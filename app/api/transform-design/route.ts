import { NextRequest, NextResponse } from "next/server";
import { callAi, stripJsonFences, type Provider } from "@/lib/ai-providers";
import {
  TRANSFORM_DESIGN_SYSTEM,
  buildTransformUserMessage,
} from "@/lib/prompts/transform-design";
import { hashDesignMd, getCachedDesign, setCachedDesign } from "@/lib/cache";
import type { PptDesignSystem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { designMd, apiKey, provider = "anthropic" } = await req.json() as {
      designMd: string;
      apiKey: string;
      provider?: Provider;
    };

    if (!designMd) return NextResponse.json({ error: "designMd required" }, { status: 400 });
    if (!apiKey) return NextResponse.json({ error: "API 키를 입력해 주세요." }, { status: 400 });

    const hash = `${provider}:${hashDesignMd(designMd)}`;
    const cached = getCachedDesign(hash);
    if (cached) return NextResponse.json({ pptDesign: cached, cached: true });

    const raw = await callAi({
      provider,
      apiKey,
      systemPrompt: TRANSFORM_DESIGN_SYSTEM,
      userMessage: buildTransformUserMessage(designMd),
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
