"use client";

import SlideFrame from "../SlideFrame";
import EditableText from "../EditableText";
import type { ImageCaptionSlide, PptDesignSystem } from "@/lib/types";

interface Props {
  slide: ImageCaptionSlide;
  design: PptDesignSystem;
}

export default function ImageCaption({ slide, design }: Props) {
  const textColor = design.colors.text;
  const mutedColor = design.colors.textMuted;

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      <div className="flex gap-12 h-full">
        <div
          className="flex-shrink-0 rounded-lg flex items-center justify-center"
          style={{
            width: "58%",
            backgroundColor: design.colors.surfaceAlt,
            borderRadius: design.borderRadius?.lg ?? "12px",
            border: `2px dashed ${design.colors.accent}40`,
          }}
        >
          <div className="text-center p-6">
            <div
              className="mx-auto mb-3 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${design.colors.accent}20` }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke={design.colors.accent} strokeWidth="1.5"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke={design.colors.accent} strokeWidth="1.5"/>
                <path d="M21 15l-5-5L5 21" stroke={design.colors.accent} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ fontSize: design.typography.body.fontSize, color: design.colors.textMuted, fontFamily: design.fontFamilies.body }}>
              {slide.imagePlaceholderLabel}
            </p>
            <p className="mt-1" style={{ fontSize: design.typography.caption.fontSize, color: `${design.colors.textMuted}80` }}>
              {slide.imageAlt}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center flex-1">
          {slide.title && (
            <EditableText
              id="title"
              tag="h2"
              style={{
                fontSize: design.typography.heading.fontSize,
                fontWeight: design.typography.heading.fontWeight,
                lineHeight: design.typography.heading.lineHeight,
                color: textColor,
                fontFamily: design.fontFamilies.heading,
                marginBottom: design.spacing.sectionGap,
              }}
            >
              {slide.title}
            </EditableText>
          )}
          <EditableText
            id="caption"
            tag="p"
            style={{
              fontSize: design.typography.body.fontSize,
              lineHeight: 1.7,
              color: mutedColor,
              fontFamily: design.fontFamilies.body,
            }}
          >
            {slide.caption}
          </EditableText>
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
