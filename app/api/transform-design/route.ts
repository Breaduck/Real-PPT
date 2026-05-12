import { NextRequest, NextResponse } from "next/server";
import { anthropic, OPUS_MODEL } from "@/lib/anthropic";
import {
  TRANSFORM_DESIGN_SYSTEM,
  buildTransformUserMessage,
} from "@/lib/prompts/transform-design";
import { hashDesignMd, getCachedDesign, setCachedDesign } from "@/lib/cache";
import type { PptDesignSystem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { designMd } = await req.json();
    if (!designMd || typeof designMd !== "string") {
      return NextResponse.json({ error: "designMd required" }, { status: 400 });
    }

    const hash = hashDesignMd(designMd);
    const cached = getCachedDesign(hash);
    if (cached) {
      return NextResponse.json({ pptDesign: cached, cached: true });
    }

    const response = await anthropic.messages.create({
      model: OPUS_MODEL,
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: TRANSFORM_DESIGN_SYSTEM,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: buildTransformUserMessage(designMd),
        },
      ],
    });

    const raw = response.content[0];
    if (raw.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    let pptDesign: PptDesignSystem;
    try {
      // Strip any accidental markdown fences
      const cleaned = raw.text.replace(/^```json?\s*/m, "").replace(/```\s*$/m, "").trim();
      pptDesign = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse design JSON", raw: raw.text },
        { status: 500 }
      );
    }

    setCachedDesign(hash, pptDesign);

    return NextResponse.json({ pptDesign, cached: false });
  } catch (err) {
    console.error("transform-design error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
