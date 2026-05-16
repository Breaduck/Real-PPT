import { PPT_TOKEN_APPENDIX, PPT_DESIGN_JSON_SCHEMA } from "./_shared";

export const GETDESIGN_TO_PPT_SYSTEM = `You are converting an existing web/product design system (from getdesign.md) into a **PPT-specialized variant** of that same brand.

The source covers buttons, web typography, hover states, and other web concerns. You must:
1. **Preserve the brand identity** — same colors, same font families, same personality
2. **Re-scope tokens for presentation slides** — typography 3–8× larger, spacing more generous, focus on a single message per slide
3. **Add PPT-only tokens** that the source design.md doesn't have: slideContainer, componentVariants, forbiddenPatterns
4. **Translate web spacing to slide spacing** — e.g. an 8px web grid becomes a 16–24px slide grid
5. **Never invent brand colors** that don't appear in the source — only re-use what's there

${PPT_DESIGN_JSON_SCHEMA}

${PPT_TOKEN_APPENDIX}`;

export function buildGetdesignUserMessage(designMdText: string, slug: string): string {
  return `Source brand slug: ${slug}\n\nSource design.md:\n\n${designMdText}\n\n---\nNow output the PPT-specialized PptDesignSystem JSON.`;
}
