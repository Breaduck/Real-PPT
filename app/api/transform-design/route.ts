import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { callAi, stripJsonFences, type Provider } from "@/lib/ai-providers";
import {
  TRANSFORM_DESIGN_SYSTEM,
  buildTransformUserMessage,
} from "@/lib/prompts/transform-design";
import {
  GETDESIGN_TO_PPT_SYSTEM,
  buildGetdesignUserMessage,
} from "@/lib/prompts/getdesign-to-ppt";
import { hashDesignMd, getCachedDesign, setCachedDesign } from "@/lib/cache";
import { CATALOG } from "@/config/design-systems";
import type { PptDesignSystem } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface RequestBody {
  designMd?: string;
  slug?: string;
  apiKey: string;
  provider?: Provider;
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

async function fetchDesignMd(slug: string): Promise<string> {
  const url = `https://getdesign.md/${slug}/design-md`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 PPT-Maker-Runtime-Builder/1.0" },
  });
  if (!res.ok) throw new Error(`getdesign.md fetch 실패 (${res.status}): ${slug}`);
  const html = await res.text();
  const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  if (preMatch) return stripHtml(preMatch[1]);
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return stripHtml(mainMatch[1]);
  return stripHtml(html);
}

async function loadStaticIfExists(slug: string): Promise<PptDesignSystem | null> {
  try {
    const file = path.join(process.cwd(), "public", "design-systems", `${slug}.json`);
    const buf = await fs.readFile(file, "utf-8");
    return JSON.parse(buf) as PptDesignSystem;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { designMd, slug, apiKey, provider = "anthropic" } = body;

    if (!apiKey) return NextResponse.json({ error: "API 키를 입력해 주세요." }, { status: 400 });
    if (!designMd && !slug) {
      return NextResponse.json({ error: "designMd 또는 slug가 필요합니다." }, { status: 400 });
    }

    // ---- Slug path: try static cache → fetch getdesign.md → convert ----
    if (slug) {
      if (!CATALOG.some((c) => c.slug === slug)) {
        return NextResponse.json({ error: `알 수 없는 슬러그: ${slug}` }, { status: 400 });
      }

      const staticCached = await loadStaticIfExists(slug);
      if (staticCached) {
        return NextResponse.json({ pptDesign: staticCached, cached: true, source: "static" });
      }

      const memHash = `slug:${provider}:${slug}`;
      const memCached = getCachedDesign(memHash);
      if (memCached) {
        return NextResponse.json({ pptDesign: memCached, cached: true, source: "memory" });
      }

      const designMdText = await fetchDesignMd(slug);
      if (!designMdText || designMdText.length < 200) {
        return NextResponse.json({ error: `getdesign.md/${slug} 본문이 비었거나 너무 짧습니다.` }, { status: 502 });
      }

      const raw = await callAi({
        provider,
        apiKey,
        systemPrompt: GETDESIGN_TO_PPT_SYSTEM,
        userMessage: buildGetdesignUserMessage(designMdText, slug),
        maxTokens: 4096,
      });

      let pptDesign: PptDesignSystem;
      try {
        pptDesign = JSON.parse(stripJsonFences(raw));
      } catch {
        return NextResponse.json({ error: "JSON 파싱 실패", raw: raw.slice(0, 500) }, { status: 500 });
      }

      pptDesign.sourceMeta = {
        kind: "catalog",
        slug,
        sourceUrl: `https://getdesign.md/${slug}/design-md`,
      };

      setCachedDesign(memHash, pptDesign);
      return NextResponse.json({ pptDesign, cached: false, source: "fresh" });
    }

    // ---- Original path: design.md text ----
    const hash = `${provider}:${hashDesignMd(designMd!)}`;
    const cached = getCachedDesign(hash);
    if (cached) return NextResponse.json({ pptDesign: cached, cached: true });

    const raw = await callAi({
      provider,
      apiKey,
      systemPrompt: TRANSFORM_DESIGN_SYSTEM,
      userMessage: buildTransformUserMessage(designMd!),
      maxTokens: 4096,
    });

    let pptDesign: PptDesignSystem;
    try {
      pptDesign = JSON.parse(stripJsonFences(raw));
    } catch {
      return NextResponse.json({ error: "JSON 파싱 실패", raw: raw.slice(0, 500) }, { status: 500 });
    }

    setCachedDesign(hash, pptDesign);
    return NextResponse.json({ pptDesign, cached: false });
  } catch (err) {
    console.error("transform-design error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
