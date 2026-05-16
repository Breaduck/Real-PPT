import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";

export interface PptxBrief {
  fileName: string;
  slideCount: number;
  themeColors: string[];
  fonts: string[];
  sampleText: string[];
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
});

function collectStrings(node: unknown, key: string, acc: string[]): void {
  if (node == null) return;
  if (Array.isArray(node)) {
    for (const n of node) collectStrings(n, key, acc);
    return;
  }
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) {
      if (k === key) {
        if (typeof v === "string") acc.push(v);
        else if (Array.isArray(v)) v.forEach((x) => typeof x === "string" && acc.push(x));
        else if (v && typeof v === "object" && "#text" in v && typeof (v as { "#text": unknown })["#text"] === "string") {
          acc.push((v as { "#text": string })["#text"]);
        }
      } else if (typeof v === "object") {
        collectStrings(v, key, acc);
      }
    }
  }
}

function collectAttrValues(node: unknown, attrName: string, acc: string[]): void {
  if (node == null) return;
  if (Array.isArray(node)) {
    for (const n of node) collectAttrValues(n, attrName, acc);
    return;
  }
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) {
      if (k === attrName && typeof v === "string") acc.push(v);
      else if (typeof v === "object") collectAttrValues(v, attrName, acc);
    }
  }
}

export async function extractPptx(fileName: string, buf: Buffer | Uint8Array): Promise<PptxBrief> {
  const zip = await JSZip.loadAsync(buf);

  // theme1.xml — color scheme + font scheme
  const themeColors: string[] = [];
  const fonts: string[] = [];
  const themeFile = zip.file(/^ppt\/theme\/theme1\.xml$/i)[0];
  if (themeFile) {
    const xml = await themeFile.async("string");
    const parsed = parser.parse(xml);
    // a:clrScheme 안의 a:srgbClr val="HEX"
    const colorVals: string[] = [];
    collectAttrValues(parsed, "@_val", colorVals);
    for (const v of colorVals) {
      if (/^[0-9a-f]{6}$/i.test(v)) themeColors.push("#" + v.toLowerCase());
    }
    // a:fontScheme → a:latin typeface="..."
    const typeface: string[] = [];
    collectAttrValues(parsed, "@_typeface", typeface);
    for (const f of typeface) {
      if (f && !f.startsWith("+") && fonts.length < 6) fonts.push(f);
    }
  }

  // slide count
  const slideFiles = zip.file(/^ppt\/slides\/slide\d+\.xml$/i);
  const slideCount = slideFiles.length;

  // sample text from first 2 slides
  const sampleText: string[] = [];
  const firstTwo = slideFiles
    .map((f: JSZip.JSZipObject) => ({ f, num: Number(f.name.match(/slide(\d+)\.xml$/i)?.[1] ?? 0) }))
    .sort((a: { num: number }, b: { num: number }) => a.num - b.num)
    .slice(0, 2);

  for (const { f } of firstTwo) {
    const xml = await f.async("string");
    const parsed = parser.parse(xml);
    const texts: string[] = [];
    collectStrings(parsed, "a:t", texts);
    for (const t of texts) {
      const trimmed = t.trim();
      if (trimmed && trimmed.length < 240 && sampleText.length < 10) sampleText.push(trimmed);
    }
  }

  return {
    fileName,
    slideCount,
    themeColors: [...new Set(themeColors)].slice(0, 8),
    fonts: [...new Set(fonts)],
    sampleText,
  };
}
