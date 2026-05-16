import type { Slide } from "@/lib/types";

/**
 * 회사명 1개를 받아 4장 데모 슬라이드 생성.
 * 발표 구조 4단계: 표지 → 데이터 → 비교 → 마무리.
 * 모든 회사 동일 placeholder, brandName만 치환.
 */
export function buildDemoSlides(brandName: string, slug: string): Slide[] {
  return [
    {
      slideNumber: 1,
      layoutId: "cover",
      accentColor: "surface",
      kicker: "2026 · VISION",
      title: `${brandName} reimagines what's next.`,
      subtitle: "A presentation system built for clarity.",
      date: "May 2026",
    },
    {
      slideNumber: 2,
      layoutId: "big-stat",
      accentColor: "brand",
      eyebrow: "KEY RESULT",
      stat: "87",
      unit: "%",
      caption: "of teams ship faster with the new workflow",
      context: "Based on Q1 2026 internal study across 240 active teams.",
    },
    {
      slideNumber: 3,
      layoutId: "two-column-compare",
      accentColor: "surface",
      title: "What changed",
      leftLabel: "Yesterday",
      leftItems: [
        "Slides took 4–6 hours per deck",
        "Inconsistent visual quality",
        "Each team reinvented templates",
      ],
      rightLabel: "Today",
      rightItems: [
        "Brand-true decks in under 10 min",
        "One design system, every slide",
        "Patterns chosen automatically",
      ],
      compareType: "Before / After",
    },
    {
      slideNumber: 4,
      layoutId: "closing",
      accentColor: "dark",
      headline: "Let's build it.",
      subheadline: "Bring your content. We'll bring the design.",
      ctaLabel: "Get in touch",
      ctaDetail: `hello@${slug}.com`,
    },
  ];
}
