/**
 * 빌드 타임에 getdesign.md의 회사 design.md를 PPT 전용 JSON으로 변환.
 *
 * 실행: `npm run build:design-systems` (ANTHROPIC_API_KEY 또는 GEMINI_API_KEY 필요)
 * 출력: public/design-systems/<slug>.json, public/design-systems/index.json
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

import { SLUGS } from "../config/design-systems";
import { callAi, stripJsonFences, type Provider } from "../lib/ai-providers";
import {
  GETDESIGN_TO_PPT_SYSTEM,
  buildGetdesignUserMessage,
} from "../lib/prompts/getdesign-to-ppt";
import type { PptDesignSystem, DesignSystemManifestItem } from "../lib/types";

loadEnv({ path: ".env.local" });
loadEnv();

const OUT_DIR = path.join(process.cwd(), "public", "design-systems");
const STALE_DAYS = 30;

function pickProviderAndKey(): { provider: Provider; apiKey: string } {
  const ant = process.env.ANTHROPIC_API_KEY;
  const gem = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (ant) return { provider: "anthropic", apiKey: ant };
  if (gem) return { provider: "gemini", apiKey: gem };
  throw new Error("ANTHROPIC_API_KEY 또는 GEMINI_API_KEY 환경변수가 필요합니다. .env.local 확인.");
}

async function isFresh(file: string): Promise<boolean> {
  try {
    const stat = await fs.stat(file);
    const ageMs = Date.now() - stat.mtimeMs;
    return ageMs < STALE_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

async function fetchDesignMd(slug: string): Promise<string> {
  const url = `https://getdesign.md/${slug}/design-md`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 PPT-Maker-Catalog-Builder/1.0" },
  });
  if (!res.ok) throw new Error(`fetch failed ${res.status} for ${url}`);
  const html = await res.text();
  // getdesign.md 페이지는 design.md 본문을 <pre> 또는 <main>에 담는다 — 휴리스틱
  // 정확한 selector를 모르므로 가장 큰 텍스트 블록 추출
  // (간단히 <pre> 우선, 없으면 <main>, 없으면 raw)
  const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  if (preMatch) return stripHtml(preMatch[1]);
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return stripHtml(mainMatch[1]);
  // 마지막 fallback — 전체 텍스트
  return stripHtml(html);
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function buildOne(slug: string, provider: Provider, apiKey: string): Promise<PptDesignSystem | null> {
  const outFile = path.join(OUT_DIR, `${slug}.json`);
  if (await isFresh(outFile)) {
    console.log(`  ⏩ skip ${slug} (cached, <${STALE_DAYS}d)`);
    const buf = await fs.readFile(outFile, "utf-8");
    return JSON.parse(buf) as PptDesignSystem;
  }

  console.log(`  ▶ fetching getdesign.md/${slug}/design-md`);
  const designMd = await fetchDesignMd(slug);
  if (!designMd || designMd.length < 200) {
    console.warn(`  ⚠ ${slug}: design.md too short (${designMd.length} chars), skipping`);
    return null;
  }

  console.log(`  ▶ converting via ${provider} (${designMd.length} chars in)`);
  const raw = await callAi({
    provider,
    apiKey,
    systemPrompt: GETDESIGN_TO_PPT_SYSTEM,
    userMessage: buildGetdesignUserMessage(designMd, slug),
    maxTokens: 4096,
  });

  let pptDesign: PptDesignSystem;
  try {
    pptDesign = JSON.parse(stripJsonFences(raw));
  } catch (e) {
    console.error(`  ✘ ${slug} JSON parse failed:`, raw.slice(0, 400));
    throw e;
  }

  pptDesign.sourceMeta = { kind: "catalog", slug, sourceUrl: `https://getdesign.md/${slug}/design-md` };

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(pptDesign, null, 2), "utf-8");
  console.log(`  ✓ ${slug} → ${path.relative(process.cwd(), outFile)}`);
  return pptDesign;
}

async function main(): Promise<void> {
  console.log(`Building design systems for ${SLUGS.length} slugs...\n`);
  const { provider, apiKey } = pickProviderAndKey();
  console.log(`Using provider: ${provider}\n`);

  await fs.mkdir(OUT_DIR, { recursive: true });

  const manifest: DesignSystemManifestItem[] = [];
  let succeeded = 0;
  let failed = 0;

  for (const slug of SLUGS) {
    console.log(`[${slug}]`);
    try {
      const ds = await buildOne(slug, provider, apiKey);
      if (ds) {
        manifest.push({
          slug,
          brandName: ds.brandName,
          primaryColor: ds.colors.brandPrimary,
          accentColor: ds.colors.accent,
        });
        succeeded += 1;
      }
    } catch (e) {
      console.error(`  ✘ ${slug} failed:`, e instanceof Error ? e.message : e);
      failed += 1;
    }
  }

  const manifestPath = path.join(OUT_DIR, "index.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`\n✓ manifest → ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Summary: ${succeeded} succeeded, ${failed} failed.`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
