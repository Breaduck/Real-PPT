"use client";

import SlideFrame from "../SlideFrame";
import EditableText from "../EditableText";
import type { ClosingSlide, PptDesignSystem } from "@/lib/types";

interface Props {
  slide: ClosingSlide;
  design: PptDesignSystem;
}

export default function Closing({ slide, design }: Props) {
  const isDark = slide.accentColor === "dark" || slide.accentColor === "brand";
  const textColor = isDark ? design.colors.textInverse : design.colors.text;
  const mutedColor = isDark ? `${design.colors.textInverse}80` : design.colors.textMuted;

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      <div
        className="absolute top-0 right-0 w-1/3 h-2"
        style={{ backgroundColor: design.colors.accent }}
      />
      <div
        className="absolute bottom-0 left-0 w-1/4 h-2"
        style={{ backgroundColor: design.colors.accent }}
      />

      <div className="flex flex-col items-center justify-center h-full text-center">
        <EditableText
          id="headline"
          tag="h2"
          style={{
            fontSize: design.typography.display.fontSize,
            fontWeight: design.typography.display.fontWeight,
            lineHeight: 1.2,
            letterSpacing: design.typography.display.letterSpacing,
            color: textColor,
            fontFamily: design.fontFamilies.heading,
            maxWidth: "18ch",
          }}
        >
          {slide.headline}
        </EditableText>

        {slide.subheadline && (
          <EditableText
            id="subheadline"
            tag="p"
            className="mt-6"
            style={{
              fontSize: design.typography.subheading.fontSize,
              color: mutedColor,
              fontFamily: design.fontFamilies.body,
              maxWidth: "40ch",
            }}
          >
            {slide.subheadline}
          </EditableText>
        )}

        {slide.ctaLabel && (
          <div className="mt-12">
            <EditableText
              id="ctaLabel"
              tag="div"
              className="inline-block px-8 py-4"
              style={{
                backgroundColor: design.colors.accent,
                borderRadius: design.borderRadius?.pill ?? "9999px",
                color: "#fff",
                fontSize: design.typography.body.fontSize,
                fontWeight: 700,
                fontFamily: design.fontFamilies.heading,
              }}
            >
              {slide.ctaLabel}
            </EditableText>
            {slide.ctaDetail && (
              <EditableText
                id="ctaDetail"
                tag="p"
                className="mt-3"
                style={{
                  fontSize: design.typography.caption.fontSize,
                  color: mutedColor,
                }}
              >
                {slide.ctaDetail}
              </EditableText>
            )}
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
