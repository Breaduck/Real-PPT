"use client";

import SlideFrame from "../SlideFrame";
import type { SectionDividerSlide, PptDesignSystem } from "@/lib/types";

interface Props {
  slide: SectionDividerSlide;
  design: PptDesignSystem;
}

export default function SectionDivider({ slide, design }: Props) {
  const isDark = slide.accentColor === "dark" || slide.accentColor === "brand";
  const textColor = isDark ? design.colors.textInverse : design.colors.text;
  const mutedColor = isDark ? `${design.colors.textInverse}80` : design.colors.textMuted;

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      {/* Left vertical accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-2"
        style={{ backgroundColor: design.colors.accent }}
      />

      {/* Asymmetric layout — chapter number large left, title right-offset */}
      <div className="flex items-center h-full gap-16">
        {/* Chapter number — giant, decorative */}
        <div
          style={{
            fontSize: "200px",
            fontWeight: 900,
            lineHeight: 1,
            color: isDark ? `${design.colors.textInverse}15` : `${design.colors.brandPrimary}12`,
            fontFamily: design.fontFamilies.heading,
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          {slide.chapterNumber}
        </div>

        {/* Title and subtitle */}
        <div className="flex flex-col justify-center">
          <p
            className="mb-3 uppercase"
            style={{
              fontSize: design.typography.caption.fontSize,
              fontWeight: 600,
              color: design.colors.accent,
              letterSpacing: "0.12em",
              fontFamily: design.fontFamilies.heading,
            }}
          >
            Section {slide.chapterNumber}
          </p>

          <h2
            style={{
              fontSize: design.typography.display.fontSize,
              fontWeight: design.typography.display.fontWeight,
              lineHeight: design.typography.display.lineHeight,
              letterSpacing: design.typography.display.letterSpacing,
              color: textColor,
              fontFamily: design.fontFamilies.heading,
            }}
          >
            {slide.chapterTitle}
          </h2>

          {slide.chapterSubtitle && (
            <p
              className="mt-4"
              style={{
                fontSize: design.typography.subheading.fontSize,
                color: mutedColor,
                fontFamily: design.fontFamilies.body,
              }}
            >
              {slide.chapterSubtitle}
            </p>
          )}
        </div>
      </div>

      <div
        className="absolute bottom-0 right-0 pr-8 pb-6"
        style={{ fontSize: design.typography.caption.fontSize, color: mutedColor }}
      >
        {slide.slideNumber}
      </div>
    </SlideFrame>
  );
}
