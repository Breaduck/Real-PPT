"use client";

import SlideFrame from "../SlideFrame";
import type { TwoColumnCompareSlide, PptDesignSystem } from "@/lib/types";

interface Props {
  slide: TwoColumnCompareSlide;
  design: PptDesignSystem;
}

export default function TwoColumnCompare({ slide, design }: Props) {
  const textColor = design.colors.text;
  const mutedColor = design.colors.textMuted;

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      {/* Vertical divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px"
        style={{ backgroundColor: `${design.colors.accent}40` }}
      />

      <div className="flex flex-col h-full">
        {/* Optional title row */}
        {slide.title && (
          <div style={{ marginBottom: design.spacing.sectionGap, flexShrink: 0 }}>
            <h2
              style={{
                fontSize: design.typography.heading.fontSize,
                fontWeight: design.typography.heading.fontWeight,
                lineHeight: design.typography.heading.lineHeight,
                color: textColor,
                fontFamily: design.fontFamilies.heading,
              }}
            >
              {slide.title}
            </h2>
          </div>
        )}

        {/* Two columns */}
        <div className="flex flex-1 gap-16">
          {/* Left */}
          <div className="flex-1 flex flex-col">
            <div
              className="mb-4 pb-3 border-b"
              style={{ borderColor: `${design.colors.accent}50` }}
            >
              <span
                style={{
                  fontSize: design.typography.subheading.fontSize,
                  fontWeight: 700,
                  color: design.colors.accent,
                  fontFamily: design.fontFamilies.heading,
                }}
              >
                {slide.leftLabel}
              </span>
            </div>
            <div className="flex flex-col" style={{ gap: design.spacing.itemGap }}>
              {slide.leftItems.map((item, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: design.typography.body.fontSize,
                    lineHeight: design.typography.body.lineHeight,
                    color: textColor,
                  }}
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 flex flex-col">
            <div
              className="mb-4 pb-3 border-b"
              style={{ borderColor: `${design.colors.brandPrimary}50` }}
            >
              <span
                style={{
                  fontSize: design.typography.subheading.fontSize,
                  fontWeight: 700,
                  color: design.colors.brandPrimary,
                  fontFamily: design.fontFamilies.heading,
                }}
              >
                {slide.rightLabel}
              </span>
            </div>
            <div className="flex flex-col" style={{ gap: design.spacing.itemGap }}>
              {slide.rightItems.map((item, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: design.typography.body.fontSize,
                    lineHeight: design.typography.body.lineHeight,
                    color: textColor,
                  }}
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compare type label bottom center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-6"
        style={{
          fontSize: design.typography.caption.fontSize,
          color: mutedColor,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {slide.compareType}
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
