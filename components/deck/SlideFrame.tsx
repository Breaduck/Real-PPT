"use client";

import clsx from "clsx";
import type { AccentColor, PptDesignSystem } from "@/lib/types";

interface Props {
  accentColor: AccentColor;
  design: PptDesignSystem;
  className?: string;
  children: React.ReactNode;
}

/**
 * Fixed 16:9 aspect ratio container with design-system-derived background colors.
 * All slide layouts render inside this frame.
 */
export default function SlideFrame({ accentColor, design, className, children }: Props) {
  const bgColor = getBgColor(accentColor, design);
  const isInverse = accentColor === "dark" || accentColor === "brand";

  return (
    <div
      className={clsx(
        "relative overflow-hidden w-full",
        "slide-page",
        className
      )}
      style={{
        aspectRatio: "16 / 9",
        backgroundColor: bgColor,
        color: isInverse
          ? design.colors.textInverse
          : design.colors.text,
        fontFamily: design.fontFamilies.body,
        paddingLeft: design.spacing.slideMarginX,
        paddingRight: design.spacing.slideMarginX,
        paddingTop: design.spacing.slideMarginY,
        paddingBottom: design.spacing.slideMarginY,
      }}
    >
      {children}
    </div>
  );
}

function getBgColor(accentColor: AccentColor, design: PptDesignSystem): string {
  switch (accentColor) {
    case "dark":
      // Dark: flip between truly dark and brand-primary-dark; derive from brand
      return deriveDeepDark(design.colors.brandPrimary);
    case "brand":
      return design.colors.brandPrimary;
    case "accent":
      return design.colors.accent;
    case "surface":
    default:
      return design.colors.background;
  }
}

function deriveDeepDark(brandPrimary: string): string {
  // If brand is already very dark, use it. Otherwise use near-black.
  // This is a simple check — in production you'd compute luminance.
  const isAlreadyDark = isDarkHex(brandPrimary);
  return isAlreadyDark ? brandPrimary : "#0a0a0f";
}

function isDarkHex(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return true;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Perceived luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.35;
}
