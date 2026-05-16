import { PPT_TOKEN_APPENDIX, PPT_DESIGN_JSON_SCHEMA } from "./_shared";
import type { HtmlBrief } from "../scraping/html-analyzer";
import { briefToCompactText } from "../scraping/html-analyzer";
import type { PdfBrief } from "../scraping/pdf-extractor";
import type { PptxBrief } from "../scraping/pptx-extractor";

export const SYNTHESIZE_COMPANY_DESIGN_SYSTEM = `You are a world-class presentation designer creating a **custom PPT design system** for a specific company.

You receive a brand brief assembled from the company's homepage (HTML, meta, CSS) and optionally from sample PPT files the user uploaded (PDF or PPTX). The brand brief contains:
- Brand name, tagline
- Colors observed in the website's CSS (frequency-ranked) and theme-color meta
- Font families used on the site
- Voice samples (headlines + body text)
- If PPT samples were provided: theme colors from PowerPoint XML, fonts, slide text samples

Your job: synthesize all of this into a **single PptDesignSystem JSON** suitable for 16:9 presentation slides.

## Guidelines

1. **Color hierarchy**: identify the most distinctive single brand color (not white/black/generic gray). If the site has a theme-color meta and it's strong, use it. Otherwise pick the highest-frequency saturated color.
2. **PPT samples > website**: if the user uploaded PPT samples, prefer THEIR theme colors and fonts — they reflect the company's actual presentation conventions.
3. **Voice-driven principles**: derive 3–5 designPrinciples from the brand voice samples (e.g. terse/technical voice → "치밀한 정보 위계, 장식 최소" / playful voice → "여백 안에 의외성").
4. **doNot list**: include 3–5 brand-specific forbiddenPatterns plus the universal PPT cliché patterns from the appendix below.
5. **Conservative defaults**: when the brand brief is sparse, fall back to neutral charcoal/steel grays for text, white background, and use the brand color sparingly.
6. **No invented data**: never fabricate a brand color that's not derivable from the brief. If unsure, pick the safest neutral.

${PPT_DESIGN_JSON_SCHEMA}

${PPT_TOKEN_APPENDIX}`;

export interface CompanyBriefInputs {
  html: HtmlBrief;
  pdfs: PdfBrief[];
  pptxs: PptxBrief[];
}

export function buildCompanyBriefMessage({ html, pdfs, pptxs }: CompanyBriefInputs): string {
  const parts: string[] = [];

  parts.push("# Company Brand Brief\n");
  parts.push("## Homepage Signals");
  parts.push(briefToCompactText(html));

  if (pptxs.length) {
    parts.push("\n## Uploaded PPTX Samples");
    for (const p of pptxs) {
      parts.push(`### ${p.fileName} (${p.slideCount} slides)`);
      if (p.themeColors.length) parts.push(`themeColors: ${p.themeColors.join(", ")}`);
      if (p.fonts.length) parts.push(`fonts: ${p.fonts.join(", ")}`);
      if (p.sampleText.length) {
        parts.push("sampleText:");
        for (const t of p.sampleText.slice(0, 6)) parts.push(`  · ${t}`);
      }
    }
  }

  if (pdfs.length) {
    parts.push("\n## Uploaded PDF Samples");
    for (const p of pdfs) {
      parts.push(`### ${p.fileName} (${p.pageCount} pages)`);
      if (p.fonts.length) parts.push(`fonts: ${p.fonts.slice(0, 5).join(", ")}`);
      // limit excerpt
      const excerpt = p.text.slice(0, 1200);
      parts.push(`excerpt:\n${excerpt}`);
    }
  }

  parts.push("\n---\nNow output the PptDesignSystem JSON.");
  return parts.join("\n");
}
