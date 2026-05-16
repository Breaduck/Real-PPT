import type { SlugMeta } from "@/config/design-systems";
import type { PptDesignSystem } from "@/lib/types";

/**
 * CATALOG 메타(브랜드 컬러 2개)만으로 deck7 황금 기준 default를 입혀
 * 완전한 PptDesignSystem 객체를 합성. LLM 호출 없음 — 미리보기 전용.
 *
 * 사용자가 갤러리에서 회사를 클릭했을 때 4장 데모를 즉시 보여주기 위함.
 * 실제 변환 결과(getdesign.md → PPT 전용)는 transform-design API가 별도 생성.
 */
export function buildMockDesign(meta: SlugMeta): PptDesignSystem {
  const isDark = isDarkHex(meta.accentColor);
  return {
    name: `${meta.brandName} Presentation Design System (preview)`,
    brandName: meta.brandName,
    fontFamilies: {
      heading: "'Pretendard Variable', Pretendard, 'DM Sans', 'Apple SD Gothic Neo', sans-serif",
      body: "'Pretendard Variable', Pretendard, 'DM Sans', 'Apple SD Gothic Neo', sans-serif",
    },
    colors: {
      brandPrimary: meta.primaryColor,
      brandSecondary: meta.accentColor,
      accent: meta.accentColor,
      background: "#ffffff",
      surface: "#f5f5f5",
      surfaceAlt: "#fafafa",
      text: "#0a0a0a",
      textMuted: "#757575",
      textInverse: "#ffffff",
      semantic: {
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
      dataPalette: [meta.primaryColor, meta.accentColor, "#2c2c2c", "#a3a3a3", "#e5e5e5"],
    },
    typography: {
      hero:       { fontSize: "96px",  fontWeight: 800, lineHeight: "1.04", letterSpacing: "-3px" },
      display:    { fontSize: "72px",  fontWeight: 700, lineHeight: "1.08", letterSpacing: "-2.5px" },
      heading:    { fontSize: "48px",  fontWeight: 700, lineHeight: "1.12", letterSpacing: "-1.5px" },
      subheading: { fontSize: "24px",  fontWeight: 600, lineHeight: "1.3",  letterSpacing: "-0.5px" },
      body:       { fontSize: "16px",  fontWeight: 400, lineHeight: "1.55", letterSpacing: "-0.005em" },
      caption:    { fontSize: "12px",  fontWeight: 600, lineHeight: "1.4",  letterSpacing: "0.06em" },
      stat:       { fontSize: "144px", fontWeight: 800, lineHeight: "1",    letterSpacing: "-6px" },
    },
    spacing: {
      slideMarginX: "64px",
      slideMarginY: "32px",
      sectionGap: "48px",
      itemGap: "16px",
    },
    borderRadius: {
      sm: "8px",
      md: "16px",
      lg: "32px",
      pill: "9999px",
    },
    decorations: {
      signatureElements: ["minimal hairline divider", "asymmetric brand accent strip"],
      darkCover: isDark,
      sectionDividerStyle: "minimal",
    },
    designPrinciples: [
      "One idea per slide",
      "Whitespace as composition",
      "Brand color as scarce signal",
    ],
    doNot: [
      "Card left strip / top accent bar",
      "Italic text",
      "01/05 slash page numbers",
    ],
    slideContainer: { width: 1280, height: 720, aspectRatio: "16:9" },
    componentVariants: {
      pageNumberFormat: "NN",
      bulletMarker: "—",
      coverLayout: "asymmetric-left",
    },
    sourceMeta: { kind: "catalog", slug: meta.slug },
  };
}

function isDarkHex(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.35;
}
