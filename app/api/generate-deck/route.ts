import { NextRequest } from "next/server";
import { callAi, stripJsonFences, type Provider } from "@/lib/ai-providers";
import {
  GENERATE_DECK_SYSTEM,
  buildGenerateDeckUserMessage,
} from "@/lib/prompts/generate-deck";
import type { PptDesignSystem, Slide } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { pptDesign, content, apiKey, provider = "anthropic" } = (await req.json()) as {
      pptDesign: PptDesignSystem;
      content: string;
      apiKey: string;
      provider?: Provider;
    };

    if (!pptDesign || !content) {
      return new Response(JSON.stringify({ error: "pptDesign and content required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API 키를 입력해 주세요." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const raw = await callAi({
            provider,
            apiKey,
            systemPrompt: GENERATE_DECK_SYSTEM,
            userMessage: buildGenerateDeckUserMessage(pptDesign, content),
            maxTokens: 16000,
          });

          let slides: Slide[];
          try {
            slides = JSON.parse(stripJsonFences(raw));
          } catch {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: "JSON 파싱 실패", raw: raw.slice(0, 500) })}\n\n`
              )
            );
            controller.close();
            return;
          }

          for (const slide of slides) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ slide })}\n\n`));
            await new Promise((r) => setTimeout(r, 30));
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`)
          );
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
