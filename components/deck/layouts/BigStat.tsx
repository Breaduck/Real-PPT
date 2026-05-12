"use client";

import SlideFrame from "../SlideFrame";
import type { BigStatSlide, PptDesignSystem } from "@/lib/types";

interface Props {
  slide: BigStatSlide;
  design: PptDesignSystem;
}

export default function BigStat({ slide, design }: Props) {
  const isDark = slide.accentColor === "dark" || slide.accentColor === "brand";
  const textColor = isDark ? design.colors.textInverse : design.colors.text;
  const mutedColor = isDark ? `${design.colors.textInverse}80` : design.colors.textMuted;
  const statColor = isDark ? design.colors.textInverse : design.colors.brandPrimary;

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      {/* Background large decorative stat (ghost) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontSize: "400px",
          fontWeight: 900,
          color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          fontFamily: design.fontFamilies.heading,
          lineHeight: 1,
          overflow: "hidden",
        }}
      >
        {slide.stat}
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full text-center">
        {slide.eyebrow && (
          <p
            className="mb-6 uppercase"
            style={{
              fontSize: design.typography.caption.fontSize,
              fontWeight: 600,
              color: design.colors.accent,
              letterSpacing: "0.15em",
              fontFamily: design.fontFamilies.heading,
            }}
          >
            {slide.eyebrow}
          </p>
        )}

        {/* The big number */}
        <div className="flex items-end gap-2">
          <span
            style={{
              fontSize: design.typography.stat.fontSize,
              fontWeight: design.typography.stat.fontWeight,
              lineHeight: design.typography.stat.lineHeight,
              letterSpacing: design.typography.stat.letterSpacing,
              color: statColor,
              fontFamily: design.fontFamilies.heading,
            }}
          >
            {slide.stat}
          </span>
          {slide.unit && (
            <span
              className="mb-4"
              style={{
                fontSize: design.typography.heading.fontSize,
                fontWeight: 700,
                color: design.colors.accent,
                fontFamily: design.fontFamilies.heading,
              }}
            >
              {slide.unit}
            </span>
          )}
        </div>

        <p
          className="mt-4"
          style={{
            fontSize: design.typography.subheading.fontSize,
            fontWeight: design.typography.subheading.fontWeight,
            color: textColor,
            fontFamily: design.fontFamilies.body,
            maxWidth: "40ch",
          }}
        >
          {slide.caption}
        </p>

        {slide.context && (
          <p
            className="mt-4"
            style={{
              fontSize: design.typography.body.fontSize,
              color: mutedColor,
              maxWidth: "50ch",
              lineHeight: 1.6,
            }}
          >
            {slide.context}
          </p>
        )}
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
