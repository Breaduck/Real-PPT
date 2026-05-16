import { NextRequest, NextResponse } from "next/server";
import { callAi, stripJsonFences, type Provider } from "@/lib/ai-providers";
import {
  SYNTHESIZE_COMPANY_DESIGN_SYSTEM,
  buildCompanyBriefMessage,
} from "@/lib/prompts/synthesize-company-design";
import { analyzeHomepage } from "@/lib/scraping/html-analyzer";
import { extractPdf } from "@/lib/scraping/pdf-extractor";
import { extractPptx } from "@/lib/scraping/pptx-extractor";
import {
  hashBuffer,
  hashCompanyInputs,
  getCachedDesign,
  setCachedDesign,
} from "@/lib/cache";
import type { PptDesignSystem } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILES = 10;
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB per file

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const url = String(form.get("url") ?? "").trim();
    const apiKey = String(form.get("apiKey") ?? "");
    const provider = (String(form.get("provider") ?? "anthropic") as Provider);

    if (!url) return NextResponse.json({ error: "회사 홈페이지 URL을 입력해 주세요." }, { status: 400 });
    if (!apiKey) return NextResponse.json({ error: "API 키를 입력해 주세요." }, { status: 400 });

    const fileEntries = form.getAll("files").filter((v): v is File => v instanceof File);
    if (fileEntries.length > MAX_FILES) {
      return NextResponse.json({ error: `파일은 최대 ${MAX_FILES}개까지 업로드 가능합니다.` }, { status: 400 });
    }
    for (const f of fileEntries) {
      if (f.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: `파일 크기는 25MB 이하여야 합니다: ${f.name}` }, { status: 400 });
      }
    }

    // ---- 1) Parse all files into briefs (deterministic, no LLM) ----
    const pdfBriefs: Awaited<ReturnType<typeof extractPdf>>[] = [];
    const pptxBriefs: Awaited<ReturnType<typeof extractPptx>>[] = [];
    const fileHashes: string[] = [];
    const fileNames: string[] = [];

    for (const f of fileEntries) {
      const buf = Buffer.from(await f.arrayBuffer());
      fileHashes.push(hashBuffer(buf));
      fileNames.push(f.name);
      const lower = f.name.toLowerCase();
      try {
        if (lower.endsWith(".pdf")) {
          pdfBriefs.push(await extractPdf(f.name, buf));
        } else if (lower.endsWith(".pptx")) {
          pptxBriefs.push(await extractPptx(f.name, buf));
        } else {
          // 무시 — 알 수 없는 형식
        }
      } catch (e) {
        console.warn(`[analyze-company] parse failed for ${f.name}:`, e);
      }
    }

    // ---- 2) Cache key ----
    const cacheHash = `analyze:${provider}:${hashCompanyInputs(url, fileHashes)}`;
    const cached = getCachedDesign(cacheHash);
    if (cached) {
      return NextResponse.json({
        pptDesign: cached,
        sources: { url, fileNames },
        cached: true,
      });
    }

    // ---- 3) Homepage analysis ----
    const htmlBrief = await analyzeHomepage(url);

    // ---- 4) Single LLM call ----
    const userMessage = buildCompanyBriefMessage({
      html: htmlBrief,
      pdfs: pdfBriefs,
      pptxs: pptxBriefs,
    });

    const raw = await callAi({
      provider,
      apiKey,
      systemPrompt: SYNTHESIZE_COMPANY_DESIGN_SYSTEM,
      userMessage,
      maxTokens: 4096,
    });

    let pptDesign: PptDesignSystem;
    try {
      pptDesign = JSON.parse(stripJsonFences(raw));
    } catch {
      return NextResponse.json(
        { error: "JSON 파싱 실패", raw: raw.slice(0, 500) },
        { status: 500 }
      );
    }

    // sourceMeta 주입
    pptDesign.sourceMeta = {
      kind: "url",
      sourceUrl: htmlBrief.url,
      fileNames,
    };

    setCachedDesign(cacheHash, pptDesign);
    return NextResponse.json({
      pptDesign,
      sources: { url: htmlBrief.url, fileNames },
      cached: false,
    });
  } catch (err) {
    console.error("analyze-company error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
