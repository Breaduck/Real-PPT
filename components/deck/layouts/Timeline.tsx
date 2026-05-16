"use client";

import SlideFrame from "../SlideFrame";
import EditableText from "../EditableText";
import type { TimelineSlide, PptDesignSystem } from "@/lib/types";

interface Props {
  slide: TimelineSlide;
  design: PptDesignSystem;
}

export default function Timeline({ slide, design }: Props) {
  const textColor = design.colors.text;
  const mutedColor = design.colors.textMuted;

  return (
    <SlideFrame accentColor={slide.accentColor} design={design}>
      <div className="flex flex-col h-full">
        <div style={{ marginBottom: design.spacing.sectionGap, flexShrink: 0 }}>
          <EditableText
            id="title"
            tag="h2"
            style={{
              fontSize: design.typography.heading.fontSize,
              fontWeight: design.typography.heading.fontWeight,
              lineHeight: design.typography.heading.lineHeight,
              color: textColor,
              fontFamily: design.fontFamilies.heading,
            }}
          >
            {slide.title}
          </EditableText>
          <div
            className="mt-3 h-0.5 w-12"
            style={{ backgroundColor: design.colors.accent }}
          />
        </div>

        <div className="flex flex-1 items-center relative">
          <div
            className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
            style={{ backgroundColor: `${design.colors.accent}30` }}
          />

          {slide.steps.map((step, i) => {
            const isHighlighted = slide.highlightStep !== undefined
              ? i + 1 === slide.highlightStep
              : false;
            const dotColor = isHighlighted
              ? design.colors.brandPrimary
              : design.colors.accent;

            return (
              <div key={i} className="flex-1 flex flex-col items-center relative">
                <p
                  className="mb-4 text-center"
                  style={{
                    fontSize: design.typography.caption.fontSize,
                    fontWeight: 600,
                    color: design.colors.accent,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontFamily: design.fontFamilies.heading,
                  }}
                >
                  {step.step}
                </p>

                <div
                  className="relative z-10 flex items-center justify-center rounded-full"
                  style={{
                    width: isHighlighted ? "48px" : "32px",
                    height: isHighlighted ? "48px" : "32px",
                    backgroundColor: dotColor,
                    boxShadow: isHighlighted ? `0 0 0 6px ${dotColor}25` : "none",
                    transition: "all 0.2s",
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: isHighlighted ? "16px" : "13px",
                      fontFamily: design.fontFamilies.heading,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                <EditableText
                  id={`step-${i}-label`}
                  tag="p"
                  className="mt-4 text-center"
                  style={{
                    fontSize: design.typography.body.fontSize,
                    fontWeight: isHighlighted ? 700 : 400,
                    color: isHighlighted ? textColor : mutedColor,
                    fontFamily: design.fontFamilies.body,
                    maxWidth: "12ch",
                    lineHeight: 1.4,
                  }}
                >
                  {step.label}
                </EditableText>

                {step.description && (
                  <EditableText
                    id={`step-${i}-desc`}
                    tag="p"
                    className="mt-1 text-center"
                    style={{
                      fontSize: design.typography.caption.fontSize,
                      color: mutedColor,
                      maxWidth: "14ch",
                      lineHeight: 1.4,
                    }}
                  >
                    {step.description}
                  </EditableText>
                )}
              </div>
            );
          })}
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
