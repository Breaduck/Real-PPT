"use client";

import SlideFrame from "../SlideFrame";
import EditableText from "../EditableText";
import type { QuoteSlide, PptDesignSystem } from "@/lib/types";

interface Props {
  slide: QuoteSlide;
  design: PptDesignSystem;
}

export default function Quote({ slide, design }: Props) {
  const isDark = slide.accentColor === "dark" || slide.accentColor === "brand";
  const textColor = isDark ? design.colors.textInverse : design.colors.text;
  const mutedColor = isDark ? `${design.colors.textInverse}80` : design.colors.textMuted;

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      <div
        className="absolute top-4 left-12 select-none pointer-events-none"
        style={{
          fontSize: "280px",
          lineHeight: 1,
          fontWeight: 900,
          color: isDark ? `${design.colors.accent}25` : `${design.colors.brandPrimary}12`,
          fontFamily: design.fontFamilies.heading,
        }}
      >
        &ldquo;
      </div>

      <div
        className="absolute left-0 top-1/4 h-1/2 w-1.5"
        style={{ backgroundColor: design.colors.accent }}
      />

      <div className="relative flex flex-col justify-center h-full pl-8">
        <EditableText
          id="quote"
          tag="blockquote"
          style={{
            fontSize: design.typography.display.fontSize,
            fontWeight: design.typography.display.fontWeight,
            lineHeight: 1.3,
            letterSpacing: design.typography.display.letterSpacing,
            color: textColor,
            fontFamily: design.fontFamilies.heading,
            maxWidth: "24ch",
          }}
        >
          {`“${slide.quote}”`}
        </EditableText>

        {(slide.attribution || slide.role) && (
          <div className="mt-8 flex items-center gap-3">
            <div
              className="w-8 h-px"
              style={{ backgroundColor: design.colors.accent }}
            />
            <div>
              {slide.attribution && (
                <EditableText
                  id="attribution"
                  tag="p"
                  style={{
                    fontSize: design.typography.body.fontSize,
                    fontWeight: 600,
                    color: textColor,
                    fontFamily: design.fontFamilies.body,
                  }}
                >
                  {slide.attribution}
                </EditableText>
              )}
              {slide.role && (
                <EditableText
                  id="role"
                  tag="p"
                  style={{
                    fontSize: design.typography.caption.fontSize,
                    color: mutedColor,
                  }}
                >
                  {slide.role}
                </EditableText>
              )}
            </div>
          </div>
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
