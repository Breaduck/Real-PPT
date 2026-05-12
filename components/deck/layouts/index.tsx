"use client";

import type { Slide, PptDesignSystem } from "@/lib/types";
import Cover from "./Cover";
import SectionDivider from "./SectionDivider";
import TitleBody from "./TitleBody";
import TitleBullets from "./TitleBullets";
import TwoColumnCompare from "./TwoColumnCompare";
import BigStat from "./BigStat";
import Quote from "./Quote";
import Timeline from "./Timeline";
import ImageCaption from "./ImageCaption";
import Closing from "./Closing";

interface Props {
  slide: Slide;
  design: PptDesignSystem;
}

export default function SlideRenderer({ slide, design }: Props) {
  switch (slide.layoutId) {
    case "cover":
      return <Cover slide={slide} design={design} />;
    case "section-divider":
      return <SectionDivider slide={slide} design={design} />;
    case "title-body":
      return <TitleBody slide={slide} design={design} />;
    case "title-bullets":
      return <TitleBullets slide={slide} design={design} />;
    case "two-column-compare":
      return <TwoColumnCompare slide={slide} design={design} />;
    case "big-stat":
      return <BigStat slide={slide} design={design} />;
    case "quote":
      return <Quote slide={slide} design={design} />;
    case "timeline":
      return <Timeline slide={slide} design={design} />;
    case "image-caption":
      return <ImageCaption slide={slide} design={design} />;
    case "closing":
      return <Closing slide={slide} design={design} />;
    default:
      return null;
  }
}
