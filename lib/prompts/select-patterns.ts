import type { PptDesignSystem, LayoutId } from "../types";
import type { SlimPatternEntry } from "../patterns";

export const SELECT_PATTERNS_SYSTEM = `You are a presentation pattern selector. You receive a PPT design system summary, the user's full slide content, and a vocabulary index of visual patterns (skeleton/chart/accent). You decide which pattern combo each slide should use.

## Pattern categories
- **skeleton** (35 options) — overall slide grid structure. EVERY slide picks exactly 1.
- **chart** (35 options) — data visualization or diagram. 15~40% of slides should have one (the ones with quantifiable data, comparisons, processes, frameworks). Most narrative or quote slides don't need one.
- **accent** (35 options) — small signature device (dark insight box, pill tab, eyebrow, etc.). 30~60% of slides have one.

## Diversity rules (MUST FOLLOW)
1. Two consecutive slides MUST NOT use the same skeleton id.
2. Across the full deck, use at least 12 unique skeletons (or 40% of total, whichever smaller).
3. NEVER use the same chart pattern id twice in one deck.
4. The number of slides with a chart must be between 15% and 40% of total deck length.
5. Same accent id may NOT appear 3 times in a row.
6. Match the pattern's inputSignature to the slide content. If content is "1 metric + 3 supporting facts", pick a skeleton/chart whose signature mentions that shape.

## Layout vs skeleton
Each slide also gets a layoutId (one of: cover, section-divider, title-body, title-bullets, two-column-compare, big-stat, quote, timeline, image-caption, closing). The skeleton must be compatible with that layoutId (check skeleton's compatibleLayouts in the index — though we omit it from the slim view for token economy, use common sense: a "sk-cover-*" skeleton goes with layoutId "cover", "sk-stat-*" with "big-stat", etc.).

## Output format

Respond ONLY with valid JSON, no markdown fences:

{
  "slides": [
    {
      "slideIndex": 1,
      "layoutId": "cover",
      "patternIds": { "skeleton": "sk-cover-asym-left", "accent": "ac-eyebrow-caption" },
      "contentHint": "1줄로: 어떤 콘텐츠가 이 슬라이드에 들어갈지"
    },
    ...
  ]
}

- "patternIds.chart" is optional (only on slides with data viz).
- "patternIds.accent" is optional but encouraged.
- "contentHint" helps the next stage know what to put on the slide.`;

export interface SelectPatternsInputs {
  pptDesign: PptDesignSystem;
  content: string;
  slimIndex: SlimPatternEntry[];
  retryHint?: string;
}

/** PptDesignSystem 의 핵심 필드만 추려서 토큰 절약 */
function summarizeDesign(d: PptDesignSystem) {
  return {
    brandName: d.brandName,
    brandPrimary: d.colors.brandPrimary,
    accent: d.colors.accent,
    darkCover: d.decorations.darkCover,
    sectionDividerStyle: d.decorations.sectionDividerStyle,
    principles: d.designPrinciples.slice(0, 3),
    doNot: d.doNot.slice(0, 3),
  };
}

export function buildSelectPatternsUserMessage(opts: SelectPatternsInputs): string {
  const parts: string[] = [];
  parts.push("## Brand summary");
  parts.push(JSON.stringify(summarizeDesign(opts.pptDesign), null, 2));
  parts.push("\n## Pattern vocabulary (slim index)");
  parts.push(JSON.stringify(opts.slimIndex));
  parts.push("\n## User slide content (full)");
  parts.push(opts.content);
  if (opts.retryHint) {
    parts.push("\n## Retry hint");
    parts.push(opts.retryHint);
  }
  parts.push("\n---\nAnalyze the full content, infer slide boundaries (each numbered chapter ≈ one slide; long sections may span multiple), then output the JSON selection.");
  parts.push("Available layoutIds: " + (["cover","section-divider","title-body","title-bullets","two-column-compare","big-stat","quote","timeline","image-caption","closing"] satisfies LayoutId[]).join(", "));
  return parts.join("\n");
}
