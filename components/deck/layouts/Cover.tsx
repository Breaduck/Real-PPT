"use client";

import SlideFrame from "../SlideFrame";
import type { CoverSlide, PptDesignSystem } from "@/lib/types";

interface Props {
  slide: CoverSlide;
  design: PptDesignSystem;
}

export default function Cover({ slide, design }: Props) {
  const isDark = slide.accentColor === "dark" || slide.accentColor === "brand";
  const textColor = isDark ? design.colors.textInverse : design.colors.text;
  const mutedColor = isDark ? `${design.colors.textInverse}99` : design.colors.textMuted;

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      {/* Signature decoration — diagonal accent bar top-right */}
      <div
        className="absolute top-0 right-0 w-1/3 h-2"
        style={{ backgroundColor: design.colors.accent }}
      />

      {/* Bottom left accent bar */}
      <div
        className="absolute bottom-0 left-0 w-1/4 h-1"
        style={{ backgroundColor: design.colors.accent, opacity: 0.6 }}
      />

      <div className="flex flex-col justify-center h-full max-w-[70%]">
        {slide.kicker && (
          <p
            className="mb-6 uppercase tracking-widest"
            style={{
              fontSize: design.typography.caption.fontSize,
              fontWeight: 600,
              color: design.colors.accent,
              fontFamily: design.fontFamilies.heading,
              letterSpacing: "0.15em",
            }}
          >
            {slide.kicker}
          </p>
        )}

        <h1
          style={{
            fontSize: design.typography.hero.fontSize,
            fontWeight: design.typography.hero.fontWeight,
            lineHeight: design.typography.hero.lineHeight,
            letterSpacing: design.typography.hero.letterSpacing,
            color: textColor,
            fontFamily: design.fontFamilies.heading,
          }}
        >
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p
            className="mt-6"
            style={{
              fontSize: design.typography.subheading.fontSize,
              fontWeight: design.typography.subheading.fontWeight,
              lineHeight: design.typography.subheading.lineHeight,
              color: mutedColor,
              fontFamily: design.fontFamilies.body,
            }}
          >
            {slide.subtitle}
          </p>
        )}

        {slide.date && (
          <p
            className="mt-10"
            style={{
              fontSize: design.typography.caption.fontSize,
              color: mutedColor,
              letterSpacing: "0.05em",
            }}
          >
            {slide.date}
          </p>
        )}
      </div>

      {/* Slide number */}
      <div
        className="absolute bottom-0 right-0 pr-8 pb-6"
        style={{
          fontSize: design.typography.caption.fontSize,
          color: mutedColor,
        }}
      >
        {slide.slideNumber}
      </div>
    </SlideFrame>
  );
}
