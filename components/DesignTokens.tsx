"use client";

import { useEffect } from "react";
import type { PptDesignSystem } from "@/lib/types";

interface Props {
  design: PptDesignSystem;
}

/**
 * Injects design system tokens as CSS custom properties on :root.
 * This makes all slide components able to reference e.g. var(--color-brand-primary)
 * without any prop drilling.
 */
export default function DesignTokens({ design }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    const { colors, typography, spacing, borderRadius, fontFamilies } = design;

    // Colors
    root.style.setProperty("--color-brand-primary", colors.brandPrimary);
    root.style.setProperty("--color-brand-secondary", colors.brandSecondary ?? colors.brandPrimary);
    root.style.setProperty("--color-accent", colors.accent);
    root.style.setProperty("--color-background", colors.background);
    root.style.setProperty("--color-surface", colors.surface);
    root.style.setProperty("--color-surface-alt", colors.surfaceAlt);
    root.style.setProperty("--color-text", colors.text);
    root.style.setProperty("--color-text-muted", colors.textMuted);
    root.style.setProperty("--color-text-inverse", colors.textInverse);
    root.style.setProperty("--color-success", colors.semantic.success);
    root.style.setProperty("--color-warning", colors.semantic.warning);
    root.style.setProperty("--color-error", colors.semantic.error);
    root.style.setProperty("--color-info", colors.semantic.info);

    // Data palette
    colors.dataPalette.forEach((hex, i) => {
      root.style.setProperty(`--color-data-${i}`, hex);
    });

    // Typography
    const typoKeys = ["hero", "display", "heading", "subheading", "body", "caption", "stat"] as const;
    typoKeys.forEach((key) => {
      const t = typography[key];
      root.style.setProperty(`--typo-${key}-size`, t.fontSize);
      root.style.setProperty(`--typo-${key}-weight`, String(t.fontWeight));
      root.style.setProperty(`--typo-${key}-line-height`, t.lineHeight);
      if (t.letterSpacing) root.style.setProperty(`--typo-${key}-tracking`, t.letterSpacing);
    });

    // Font families
    root.style.setProperty("--font-heading", fontFamilies.heading);
    root.style.setProperty("--font-body", fontFamilies.body);
    if (fontFamilies.mono) root.style.setProperty("--font-mono", fontFamilies.mono);

    // Spacing
    root.style.setProperty("--slide-margin-x", spacing.slideMarginX);
    root.style.setProperty("--slide-margin-y", spacing.slideMarginY);
    root.style.setProperty("--section-gap", spacing.sectionGap);
    root.style.setProperty("--item-gap", spacing.itemGap);

    // Border radius
    root.style.setProperty("--radius-sm", borderRadius.sm);
    root.style.setProperty("--radius-md", borderRadius.md);
    root.style.setProperty("--radius-lg", borderRadius.lg);
    root.style.setProperty("--radius-pill", borderRadius.pill);
  }, [design]);

  return null;
}
