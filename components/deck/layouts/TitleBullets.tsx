"use client";

import SlideFrame from "../SlideFrame";
import type { TitleBulletsSlide, PptDesignSystem } from "@/lib/types";

interface Props {
  slide: TitleBulletsSlide;
  design: PptDesignSystem;
}

const BULLET_ICONS: Record<string, string> = {
  "icon-check": "✓",
  "icon-arrow": "→",
  dot: "•",
  dash: "–",
};

export default function TitleBullets({ slide, design }: Props) {
  const textColor = design.colors.text;
  const mutedColor = design.colors.textMuted;

  function getBulletMarker(index: number): string {
    if (slide.bulletStyle === "number") return `${index + 1}.`;
    return BULLET_ICONS[slide.bulletStyle] ?? "•";
  }

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0" style={{ marginBottom: design.spacing.sectionGap }}>
          {slide.eyebrow && (
            <p
              className="mb-3 uppercase"
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
              color: textColor,
              fontFamily: design.fontFamilies.heading,
            }}
          >
            {slide.title}
          </h2>

          {/* Underline accent */}
          <div
            className="mt-3 h-0.5 w-16"
            style={{ backgroundColor: design.colors.accent }}
          />
        </div>

        {/* Bullets */}
        <div
          className="flex flex-col flex-1 justify-center"
          style={{ gap: design.spacing.itemGap }}
        >
          {slide.bullets.map((bullet, i) => (
            <div key={i} className="flex gap-5 items-start">
              <span
                className="flex-shrink-0 mt-0.5"
                style={{
                  fontSize: design.typography.subheading.fontSize,
                  fontWeight: 700,
                  color: design.colors.accent,
                  fontFamily: design.fontFamilies.heading,
                  minWidth: "2rem",
                }}
              >
                {getBulletMarker(i)}
              </span>
              <div>
                <p
                  style={{
                    fontSize: design.typography.subheading.fontSize,
                    fontWeight: design.typography.subheading.fontWeight,
                    lineHeight: design.typography.subheading.lineHeight,
                    color: textColor,
                    fontFamily: design.fontFamilies.body,
                  }}
                >
                  {bullet.text}
                </p>
                {bullet.subtext && (
                  <p
                    className="mt-1"
                    style={{
                      fontSize: design.typography.body.fontSize,
                      color: mutedColor,
                      lineHeight: 1.5,
                    }}
                  >
                    {bullet.subtext}
                  </p>
                )}
              </div>
            </div>
          ))}
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
