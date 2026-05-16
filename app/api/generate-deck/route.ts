import { NextRequest } from "next/server";
import { callAi, stripJsonFences, type Provider } from "@/lib/ai-providers";
import {
  SELECT_PATTERNS_SYSTEM,
  buildSelectPatternsUserMessage,
} from "@/lib/prompts/select-patterns";
import {
  SYNTHESIZE_DECK_SYSTEM,
  buildSynthesizeDeckUserMessage,
} from "@/lib/prompts/synthesize-deck";
import { getSlimIndex, getFullDetails } from "@/lib/patterns";
import {
  validatePatternSelection,
  violationsToRetryHint,
  type PatternSelectionRow,
} from "@/lib/patterns/validate";
import { sanitizeInlineSvg } from "@/lib/patterns/sanitize";
import type { PptDesignSystem, Slide } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

interface RequestBody {
  pptDesign: PptDesignSystem;
  content: string;
  apiKey: string;
  provider?: Provider;
}

interface Stage1Response {
  slides: PatternSelectionRow[];
}

export async function POST(req: NextRequest) {
  try {
    const {
      pptDesign,
      content,
      apiKey,
      provider = "anthropic",
    } = (await req.json()) as RequestBody;

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
        const send = (obj: unknown) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

        try {
          // ── Stage 1: Haiku 패턴 선택 (Anthropic 한정, Gemini는 기존 1단계 흐름 폴백) ──
          let plan: PatternSelectionRow[] | null = null;

          if (provider === "anthropic") {
            send({ stage: 1, status: "selecting" });

            const slimIndex = getSlimIndex();
            const stage1Raw = await callAi({
              provider,
              apiKey,
              model: "claude-haiku-4-5-20251001",
              systemPrompt: SELECT_PATTERNS_SYSTEM,
              userMessage: buildSelectPatternsUserMessage({
                pptDesign,
                content,
                slimIndex,
              }),
              maxTokens: 4000,
            });

            let stage1: Stage1Response;
            try {
              stage1 = JSON.parse(stripJsonFences(stage1Raw)) as Stage1Response;
            } catch {
              send({ error: "Stage 1 JSON 파싱 실패", raw: stage1Raw.slice(0, 500) });
              controller.close();
              return;
            }

            plan = stage1.slides;

            // Validate + (1회) 재시도
            const v = validatePatternSelection(plan);
            if (!v.ok) {
              send({ stage: 1, status: "retrying", violations: v.violations });
              const retry = await callAi({
                provider,
                apiKey,
                model: "claude-haiku-4-5-20251001",
                systemPrompt: SELECT_PATTERNS_SYSTEM,
                userMessage: buildSelectPatternsUserMessage({
                  pptDesign,
                  content,
                  slimIndex,
                  retryHint: violationsToRetryHint(v.violations),
                }),
                maxTokens: 4000,
              });
              try {
                const parsed = JSON.parse(stripJsonFences(retry)) as Stage1Response;
                plan = parsed.slides;
              } catch {
                // 재시도 실패해도 1차 결과 그대로 진행
              }
            }

            send({
              stage: 1,
              status: "complete",
              count: plan.length,
              patternIds: plan.map((r) => ({ slideIndex: r.slideIndex, ids: r.patternIds })),
            });
          }

          // ── Stage 2: Opus 슬라이드 합성 ──
          send({ stage: 2, status: "synthesizing" });

          const stage2Raw = plan
            ? await callAi({
                provider,
                apiKey,
                model: "claude-opus-4-7",
                systemPrompt: SYNTHESIZE_DECK_SYSTEM,
                userMessage: buildSynthesizeDeckUserMessage({
                  pptDesign,
                  content,
                  plan,
                  patternDetails: getFullDetails(plan.map((r) => r.patternIds)),
                }),
                maxTokens: 16000,
              })
            : // Gemini는 단일 호출 (구 흐름)
              await callAi({
                provider,
                apiKey,
                systemPrompt: SYNTHESIZE_DECK_SYSTEM,
                userMessage: buildSynthesizeDeckUserMessage({
                  pptDesign,
                  content,
                  plan: [],
                  patternDetails: [],
                }),
                maxTokens: 16000,
              });

          let slides: Slide[];
          try {
            slides = JSON.parse(stripJsonFences(stage2Raw)) as Slide[];
          } catch {
            send({ error: "Stage 2 JSON 파싱 실패", raw: stage2Raw.slice(0, 500) });
            controller.close();
            return;
          }

          // inlineSvg sanitize + drop on failure
          for (const s of slides) {
            if (s.inlineSvg) {
              const safe = sanitizeInlineSvg(s.inlineSvg);
              if (safe) s.inlineSvg = safe;
              else delete s.inlineSvg;
            }
          }

          for (const slide of slides) {
            send({ stage: 2, slide });
            await new Promise((r) => setTimeout(r, 30));
          }

          send({ done: true });
        } catch (err) {
          send({ error: String(err) });
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
