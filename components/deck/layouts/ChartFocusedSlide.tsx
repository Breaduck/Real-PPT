"use client";

import type { Slide, PptDesignSystem } from "@/lib/types";
import SlideFrame from "../SlideFrame";

interface Props {
  slide: Slide;
  design: PptDesignSystem;
}

/**
 * slide.inlineSvg 가 있는 슬라이드용 컨테이너.
 * 상단에 헤더(eyebrow + title + subtitle/caption), 본문에 SVG, 하단에 페이지 번호.
 * 어떤 layoutId든 일관된 frame을 제공.
 */
export default function ChartFocusedSlide({ slide, design }: Props) {
  if (!slide.inlineSvg) return null;

  const eyebrow = pickEyebrow(slide);
  const title = pickTitle(slide);
  const subtitle = pickSubtitle(slide);

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      <div
        className="absolute"
        style={{
          left: design.spacing.slideMarginX,
          right: design.spacing.slideMarginX,
          top: design.spacing.slideMarginY,
        }}
      >
        {eyebrow && (
          <p
            style={{
              fontSize: design.typography.caption.fontSize,
              fontWeight: design.typography.caption.fontWeight as number,
              letterSpacing: design.typography.caption.letterSpacing,
              color: design.colors.textMuted,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </p>
        )}
        {title && (
          <h2
            style={{
              fontSize: design.typography.heading.fontSize,
              fontWeight: design.typography.heading.fontWeight as number,
              lineHeight: design.typography.heading.lineHeight,
              letterSpacing: design.typography.heading.letterSpacing,
              fontFamily: design.fontFamilies.heading,
              color: design.colors.text,
              margin: 0,
            }}
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            style={{
              fontSize: design.typography.subheading.fontSize,
              fontWeight: 400,
              color: design.colors.textMuted,
              marginTop: 8,
              maxWidth: "85%",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Chart body */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: design.spacing.slideMarginX,
          right: design.spacing.slideMarginX,
          top: "28%",
          bottom: 80,
        }}
        dangerouslySetInnerHTML={{ __html: slide.inlineSvg }}
      />

      {/* Page number */}
      <p
        className="absolute"
        style={{
          bottom: 24,
          right: 32,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: ".06em",
          color: design.colors.textMuted,
        }}
      >
        {String(slide.slideNumber).padStart(2, "0")}
      </p>
    </SlideFrame>
  );
}

function pickEyebrow(s: Slide): string {
  if ("eyebrow" in s && s.eyebrow) return s.eyebrow;
  if (s.layoutId === "section-divider") return s.chapterNumber;
  return "";
}

function pickTitle(s: Slide): string {
  if ("title" in s && s.title) return s.title;
  if (s.layoutId === "closing") return s.headline;
  if (s.layoutId === "section-divider") return s.chapterTitle;
  if (s.layoutId === "big-stat") return s.caption;
  if (s.layoutId === "cover") return s.title;
  return "";
}

function pickSubtitle(s: Slide): string {
  if (s.layoutId === "title-body" && s.body) return s.body.slice(0, 200);
  if (s.layoutId === "big-stat" && s.context) return s.context;
  if (s.layoutId === "two-column-compare" && s.compareType) return s.compareType;
  if (s.layoutId === "section-divider" && s.chapterSubtitle) return s.chapterSubtitle;
  if (s.layoutId === "image-caption" && s.caption) return s.caption;
  if (s.layoutId === "cover" && s.subtitle) return s.subtitle;
  if (s.layoutId === "closing" && s.subheadline) return s.subheadline;
  return "";
}
