// ---- Design System ----

export interface ColorToken {
  value: string;
  description?: string;
}

export interface TypographyToken {
  fontSize: string;
  fontWeight: string | number;
  lineHeight: string;
  letterSpacing?: string;
  fontFamily?: string;
}

export interface PptDesignSystem {
  name: string;
  brandName: string;
  /** CSS-compatible font families, in order of preference */
  fontFamilies: {
    heading: string;
    body: string;
    mono?: string;
  };
  colors: {
    brandPrimary: string;
    brandSecondary?: string;
    accent: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textMuted: string;
    textInverse: string;
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    /** Ordered palette for charts/data viz */
    dataPalette: string[];
  };
  typography: {
    /** 80–140px — cover hero */
    hero: TypographyToken;
    /** 48–72px — section openers */
    display: TypographyToken;
    /** 32–44px — slide title */
    heading: TypographyToken;
    /** 20–28px — sub-heading */
    subheading: TypographyToken;
    /** 16–20px — body text */
    body: TypographyToken;
    /** 12–16px — captions, labels */
    caption: TypographyToken;
    /** 80–160px — big stat number */
    stat: TypographyToken;
  };
  spacing: {
    slideMarginX: string;
    slideMarginY: string;
    /** Between major elements */
    sectionGap: string;
    /** Between list items, small elements */
    itemGap: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    pill: string;
  };
  decorations: {
    /** SVG path or CSS description of signature decorative lines/shapes */
    signatureElements: string[];
    /** Whether to use dark background cover slides */
    darkCover: boolean;
    /** Pattern for section dividers: "diagonal" | "solid" | "gradient" */
    sectionDividerStyle: "diagonal" | "solid" | "gradient" | "minimal";
  };
  designPrinciples: string[];
  doNot: string[];

  // ---- PPT 전용 옵셔널 확장 (deck7 황금 기준) ----
  slideContainer?: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  componentVariants?: {
    pageNumberFormat: "NN" | "01/30" | "1" | "none";
    bulletMarker: "•" | "—" | "›" | "/";
    coverLayout: "split" | "centered" | "asymmetric-left";
  };
  forbiddenPatterns?: string[];
  sourceMeta?: {
    kind: "paste" | "url" | "catalog";
    sourceUrl?: string;
    slug?: string;
    fileNames?: string[];
  };
}

// ---- Slide ----

export type LayoutId =
  | "cover"
  | "section-divider"
  | "title-body"
  | "title-bullets"
  | "two-column-compare"
  | "big-stat"
  | "quote"
  | "timeline"
  | "image-caption"
  | "closing";

export type AccentColor = "brand" | "accent" | "surface" | "dark";

export interface SlidePatternIds {
  skeleton: string;
  chart?: string;
  accent?: string;
}

interface BaseSlide {
  slideNumber: number;
  layoutId: LayoutId;
  accentColor: AccentColor;
  notes?: string;
  /** Stage 1에서 선택된 패턴 ID들 (디버그·검증·UI 디스플레이용) */
  patternIds?: SlidePatternIds;
  /** Stage 2에서 LLM이 생성한 차트/다이어그램 inline SVG (1280×720 좌표계). sanitize 후 dangerouslySetInnerHTML. */
  inlineSvg?: string;
}

export interface CoverSlide extends BaseSlide {
  layoutId: "cover";
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
}

export interface SectionDividerSlide extends BaseSlide {
  layoutId: "section-divider";
  chapterNumber: string;
  chapterTitle: string;
  chapterSubtitle?: string;
}

export interface TitleBodySlide extends BaseSlide {
  layoutId: "title-body";
  title: string;
  body: string;
  eyebrow?: string;
}

export interface BulletItem {
  text: string;
  subtext?: string;
}

export interface TitleBulletsSlide extends BaseSlide {
  layoutId: "title-bullets";
  title: string;
  bullets: BulletItem[];
  eyebrow?: string;
  /** "number" | "dot" | "dash" | "icon-check" | "icon-arrow" */
  bulletStyle: "number" | "dot" | "dash" | "icon-check" | "icon-arrow";
}

export interface TwoColumnCompareSlide extends BaseSlide {
  layoutId: "two-column-compare";
  title?: string;
  leftLabel: string;
  leftItems: string[];
  rightLabel: string;
  rightItems: string[];
  /** e.g. "Before / After", "Problem / Solution", "Them / Us" */
  compareType: string;
}

export interface BigStatSlide extends BaseSlide {
  layoutId: "big-stat";
  stat: string;
  unit?: string;
  caption: string;
  context?: string;
  eyebrow?: string;
}

export interface QuoteSlide extends BaseSlide {
  layoutId: "quote";
  quote: string;
  attribution?: string;
  role?: string;
}

export interface TimelineStep {
  step: string;
  label: string;
  description?: string;
}

export interface TimelineSlide extends BaseSlide {
  layoutId: "timeline";
  title: string;
  steps: TimelineStep[];
  highlightStep?: number;
}

export interface ImageCaptionSlide extends BaseSlide {
  layoutId: "image-caption";
  title?: string;
  caption: string;
  imageAlt: string;
  imagePlaceholderLabel: string;
}

export interface ClosingSlide extends BaseSlide {
  layoutId: "closing";
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaDetail?: string;
}

export type Slide =
  | CoverSlide
  | SectionDividerSlide
  | TitleBodySlide
  | TitleBulletsSlide
  | TwoColumnCompareSlide
  | BigStatSlide
  | QuoteSlide
  | TimelineSlide
  | ImageCaptionSlide
  | ClosingSlide;

// ---- API responses ----

export interface TransformDesignResponse {
  pptDesign: PptDesignSystem;
}

export interface GenerateDeckResponse {
  slides: Slide[];
}

// ---- Wizard state ----

export type WizardStep =
  | "gallery"
  | "paste-design"
  | "analyze-company"
  | "analyze-loading"
  | "transform-loading"
  | "design-preview"
  | "paste-content"
  | "generate-loading"
  | "deck-view";

// ---- Gallery manifest ----

export interface DesignSystemManifestItem {
  slug: string;
  brandName: string;
  primaryColor: string;
  accentColor: string;
}
