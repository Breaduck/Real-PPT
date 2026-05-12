"use client";

import SlideFrame from "../SlideFrame";
import type { TitleBodySlide, PptDesignSystem } from "@/lib/types";

interface Props {
  slide: TitleBodySlide;
  design: PptDesignSystem;
}

export default function TitleBody({ slide, design }: Props) {
  const textColor = design.colors.text;
  const mutedColor = design.colors.textMuted;

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 h-1 w-24"
        style={{ backgroundColor: design.colors.accent }}
      />

      <div className="flex flex-col justify-center h-full max-w-[75%]">
        {slide.eyebrow && (
          <p
            className="mb-4 uppercase"
            style={{
              fontSize: design.typography.caption.fontSize,
              fontWeight: 600,
              color: design.colors.accent,
              letterSpacing: "0.1em",
              fontFamily: design.fontFamilies.heading,
            }}
          >
            {slide.eyebrow}
          </p>
        )}

        <h2
          style={{
            fontSize: design.typography.heading.fontSize,
            fontWeight: design.typography.heading.fontWeight,
            lineHeight: design.typography.heading.lineHeight,
            letterSpacing: design.typography.heading.letterSpacing,
            color: textColor,
            fontFamily: design.fontFamilies.heading,
            marginBottom: design.spacing.sectionGap,
          }}
        >
          {slide.title}
        </h2>

        <p
          style={{
            fontSize: design.typography.body.fontSize,
            fontWeight: design.typography.body.fontWeight,
            lineHeight: design.typography.body.lineHeight,
            color: mutedColor,
            fontFamily: design.fontFamilies.body,
            maxWidth: "56ch",
          }}
        >
          {slide.body}
        </p>
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
