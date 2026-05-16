import type { PptDesignSystem } from "../types";
import type { Pattern } from "../patterns";
import type { PatternSelectionRow } from "../patterns/validate";

export const SYNTHESIZE_DECK_SYSTEM = `You are a world-class presentation strategist and visual storyteller. You receive:
1. A PPT design system (JSON)
2. The user's full slide content
3. A pre-selected pattern plan: for each slide, which skeleton/chart/accent ids the Stage-1 selector chose
4. The FULL details of every chosen pattern (visualSketch, svgTemplate where applicable, tokenHints)

Your job: synthesize the final slide JSON array. Each slide combines its assigned skeleton + (optional) chart + (optional) accent into a coherent slide. The pattern details are your blueprint — respect their visual logic but write the actual copy from the user's content.

## Core principles

**Faithful to plan.** The pattern plan was chosen for diversity and fit. Don't ignore it. If the assigned pattern truly clashes with the content, you may fall back, but only as last resort.

**One idea per slide.** Distill — never paste raw user content verbatim.

**Anti-AI rules:**
- Bullet text: max 12 words per bullet
- Body text: max 60 words per slide
- Stats and quotes must be genuine — never invent numbers/quotes
- No filler words ("As we can see...", "In conclusion...")

**Chart slides (when patternIds.chart is set):**
- Read the chart's svgTemplate
- Fill in the placeholders ({{PLACEHOLDER}}) with real values derived from the user's content
- Output the completed SVG string in the slide's "inlineSvg" field
- Maintain the 1280×720 (or smaller inner) coordinate system intact
- Use CSS variable color references already in the template — do NOT replace var(--*) with hex
- For data-heavy charts, replicate any repeating <g>/<rect> block per data point as needed

**Accent integration:**
- If patternIds.accent is set, weave the accent's visual idea into the slide. Most accents don't need their own field; describe them in the slide's text fields or imply via the layout's visual choices.

## Output format

Respond ONLY with valid JSON, no markdown fences. An array of slide objects.

Each slide MUST include:
- slideNumber: 1-indexed
- layoutId: from the plan
- accentColor: "brand" | "accent" | "surface" | "dark"
- patternIds: { skeleton, chart?, accent? } — exactly as in the plan
- all layout-specific required fields (see schemas below)
- inlineSvg: ONLY if patternIds.chart is set; full SVG string starting with <svg

### Layout field schemas

**cover**: { kicker?, title, subtitle?, date? }
**section-divider**: { chapterNumber, chapterTitle, chapterSubtitle? }
**title-body**: { eyebrow?, title, body }
**title-bullets**: { eyebrow?, title, bullets: [{text, subtext?}], bulletStyle }
**two-column-compare**: { title?, leftLabel, leftItems[], rightLabel, rightItems[], compareType }
**big-stat**: { eyebrow?, stat, unit?, caption, context? }
**quote**: { quote, attribution?, role? }
**timeline**: { title, steps: [{step, label, description?}], highlightStep? }
**image-caption**: { title?, caption, imageAlt, imagePlaceholderLabel }
**closing**: { headline, subheadline?, ctaLabel?, ctaDetail? }

bulletStyle: "number" | "dot" | "dash" | "icon-check" | "icon-arrow"`;

export interface SynthesizeDeckInputs {
  pptDesign: PptDesignSystem;
  content: string;
  plan: PatternSelectionRow[];
  patternDetails: Pattern[];
}

export function buildSynthesizeDeckUserMessage(opts: SynthesizeDeckInputs): string {
  return `## PPT design system
${JSON.stringify(opts.pptDesign, null, 2)}

## User content
${opts.content}

## Pattern plan (slide-by-slide)
${JSON.stringify(opts.plan, null, 2)}

## Pattern details (full)
${JSON.stringify(opts.patternDetails, null, 2)}

---
Now synthesize the complete slide JSON array. Follow the plan, distill content, fill SVG placeholders where charts are assigned.`;
}
