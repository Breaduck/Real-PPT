import { NextRequest } from "next/server";
import { anthropic, OPUS_MODEL } from "@/lib/anthropic";
import {
  GENERATE_DECK_SYSTEM,
  buildGenerateDeckUserMessage,
} from "@/lib/prompts/generate-deck";
import type { PptDesignSystem, Slide } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { pptDesign, content } = (await req.json()) as {
      pptDesign: PptDesignSystem;
      content: string;
    };

    if (!pptDesign || !content) {
      return new Response(JSON.stringify({ error: "pptDesign and content required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.create({
            model: OPUS_MODEL,
            max_tokens: 16000,
            system: [
              {
                type: "text",
                text: GENERATE_DECK_SYSTEM,
                cache_control: { type: "ephemeral" },
              },
            ],
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: buildGenerateDeckUserMessage(pptDesign, content),
                    cache_control: { type: "ephemeral" },
                  },
                ],
              },
            ],
          });

          const raw = response.content[0];
          if (raw.type !== "text") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: "Unexpected response" })}\n\n`)
            );
            controller.close();
            return;
          }

          let slides: Slide[];
          try {
            const cleaned = raw.text
              .replace(/^```json?\s*/m, "")
              .replace(/```\s*$/m, "")
              .trim();
            slides = JSON.parse(cleaned);
          } catch {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: "JSON parse failed", raw: raw.text.slice(0, 500) })}\n\n`
              )
            );
            controller.close();
            return;
          }

          // Stream slides one at a time so the UI can show progress
          for (const slide of slides) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ slide })}\n\n`)
            );
            // Small delay so the browser can paint between slides
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
