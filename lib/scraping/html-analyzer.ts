import { load } from "cheerio";
import type { AnyNode } from "domhandler";

export interface HtmlBrief {
  url: string;
  brandName?: string;
  description?: string;
  themeColor?: string;
  ogImage?: string;
  faviconUrl?: string;
  logoUrls: string[];
  fontFamilies: string[];
  /** Top colors by frequency (already hex-normalized) */
  topColors: string[];
  voiceSamples: string[];
}

const COLOR_RE = /#[0-9a-f]{3,8}\b|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/gi;
const FONT_FAMILY_RE = /font-family\s*:\s*([^;}\n]+)/gi;
const STYLESHEET_BYTE_CAP = 200_000;
const MAX_STYLESHEETS = 2;

function normalizeColor(raw: string): string | null {
  const c = raw.toLowerCase().trim();
  if (c.startsWith("#")) {
    if (c.length === 4) {
      // #abc → #aabbcc
      return "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
    }
    if (c.length === 7 || c.length === 9) return c.slice(0, 7);
    return null;
  }
  const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return null;
  const [r, g, b] = [m[1], m[2], m[3]].map((n) => Number(n));
  if ([r, g, b].some((n) => n < 0 || n > 255)) return null;
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

function rankByFrequency(values: string[], topN: number): string[] {
  const freq = new Map<string, number>();
  for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([v]) => v);
}

async function safeFetch(url: string, signal: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal,
      headers: { "User-Agent": "Mozilla/5.0 PPT-Maker-Brand-Analyzer/1.0" },
    });
    if (!res.ok) return null;
    const reader = res.body?.getReader();
    if (!reader) return await res.text();
    let received = 0;
    const chunks: Uint8Array[] = [];
    while (received < STYLESHEET_BYTE_CAP) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      received += value.byteLength;
    }
    try { await reader.cancel(); } catch { /* noop */ }
    const merged = new Uint8Array(received);
    let offset = 0;
    for (const c of chunks) {
      merged.set(c.subarray(0, Math.min(c.byteLength, received - offset)), offset);
      offset += c.byteLength;
      if (offset >= received) break;
    }
    return new TextDecoder("utf-8", { fatal: false }).decode(merged);
  } catch {
    return null;
  }
}

function resolveUrl(base: string, raw: string): string {
  try {
    return new URL(raw, base).toString();
  } catch {
    return raw;
  }
}

export async function analyzeHomepage(rawUrl: string): Promise<HtmlBrief> {
  const url = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const html = await safeFetch(url, controller.signal);
    if (!html) throw new Error(`홈페이지를 불러올 수 없습니다: ${url}`);

    const $ = load(html);

    const brandName =
      $('meta[property="og:site_name"]').attr("content") ||
      $("title").first().text().split(/[|·\-–—]/)[0]?.trim() ||
      undefined;

    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      undefined;

    const themeColor = $('meta[name="theme-color"]').attr("content")?.trim();
    const ogImage = $('meta[property="og:image"]').attr("content");

    const faviconUrl =
      $('link[rel="icon"][type="image/svg+xml"]').attr("href") ||
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    // logo candidates
    const logoUrls = new Set<string>();
    $('img[alt*="logo" i], img[src*="logo" i], img[class*="logo" i]').each((_: number, el: AnyNode) => {
      const src = $(el).attr("src");
      if (src) logoUrls.add(resolveUrl(url, src));
    });
    const ogLogo = $('meta[property="og:logo"]').attr("content");
    if (ogLogo) logoUrls.add(resolveUrl(url, ogLogo));

    // voice samples
    const voiceSamples: string[] = [];
    $("h1, h2").slice(0, 4).each((_: number, el: AnyNode) => {
      const t = $(el).text().trim();
      if (t && t.length < 200) voiceSamples.push(t);
    });
    $("p").slice(0, 6).each((_: number, el: AnyNode) => {
      const t = $(el).text().trim();
      if (t && t.length > 20 && t.length < 240) voiceSamples.push(t);
    });

    // inline styles
    const inlineColors: string[] = [];
    const inlineFonts: string[] = [];
    $("style").each((_: number, el: AnyNode) => {
      const css = $(el).text();
      const colors = css.match(COLOR_RE) ?? [];
      inlineColors.push(...colors);
      let m: RegExpExecArray | null;
      const fontRe = new RegExp(FONT_FAMILY_RE.source, "gi");
      while ((m = fontRe.exec(css))) inlineFonts.push(m[1].trim());
    });

    // external stylesheets (max 2)
    const stylesheetHrefs: string[] = [];
    $('link[rel="stylesheet"]').each((_: number, el: AnyNode) => {
      const href = $(el).attr("href");
      if (href) stylesheetHrefs.push(resolveUrl(url, href));
    });

    const sheetSlice = stylesheetHrefs.slice(0, MAX_STYLESHEETS);
    const externalColors: string[] = [];
    const externalFonts: string[] = [];
    for (const sheet of sheetSlice) {
      const css = await safeFetch(sheet, controller.signal);
      if (!css) continue;
      externalColors.push(...(css.match(COLOR_RE) ?? []));
      const fontRe = new RegExp(FONT_FAMILY_RE.source, "gi");
      let m: RegExpExecArray | null;
      while ((m = fontRe.exec(css))) externalFonts.push(m[1].trim());
    }

    // google fonts hint from <link>
    const googleFonts: string[] = [];
    $('link[href*="fonts.googleapis"], link[href*="fonts.gstatic"]').each((_: number, el: AnyNode) => {
      const href = $(el).attr("href") || "";
      const match = href.match(/family=([^&:]+)/g);
      if (match) {
        for (const f of match) googleFonts.push(decodeURIComponent(f.replace("family=", "").replace(/\+/g, " ")));
      }
    });

    const allColors = [...inlineColors, ...externalColors]
      .map(normalizeColor)
      .filter((c): c is string => Boolean(c))
      .filter((c) => c !== "#ffffff" && c !== "#000000");
    const topColors = rankByFrequency(allColors, 8);

    const fontFamiliesRaw = [...googleFonts, ...inlineFonts, ...externalFonts];
    const fontFamilies = rankByFrequency(
      fontFamiliesRaw.map((f) => f.replace(/["']/g, "").split(",")[0].trim()).filter((f) => f && !f.startsWith("var(")),
      5
    );

    return {
      url,
      brandName,
      description,
      themeColor: themeColor && normalizeColor(themeColor) ? normalizeColor(themeColor)! : themeColor,
      ogImage: ogImage ? resolveUrl(url, ogImage) : undefined,
      faviconUrl: resolveUrl(url, faviconUrl),
      logoUrls: [...logoUrls].slice(0, 4),
      fontFamilies,
      topColors,
      voiceSamples: voiceSamples.slice(0, 8),
    };
  } finally {
    clearTimeout(timeout);
  }
}

/** Compact brief size estimate (chars). Keep under ~2000 chars for token economy. */
export function briefToCompactText(brief: HtmlBrief): string {
  const lines: string[] = [];
  lines.push(`URL: ${brief.url}`);
  if (brief.brandName) lines.push(`Brand: ${brief.brandName}`);
  if (brief.description) lines.push(`Tagline: ${brief.description.slice(0, 240)}`);
  if (brief.themeColor) lines.push(`themeColor: ${brief.themeColor}`);
  if (brief.topColors.length) lines.push(`topColors: ${brief.topColors.join(", ")}`);
  if (brief.fontFamilies.length) lines.push(`fonts: ${brief.fontFamilies.join(", ")}`);
  if (brief.logoUrls.length) lines.push(`logos: ${brief.logoUrls.slice(0, 3).join(", ")}`);
  if (brief.voiceSamples.length) {
    lines.push("voice:");
    for (const s of brief.voiceSamples.slice(0, 6)) lines.push(`  · ${s}`);
  }
  return lines.join("\n");
}
