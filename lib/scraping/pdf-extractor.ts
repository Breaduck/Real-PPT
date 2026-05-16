// pdf-parse 는 CJS only — 동적 import 로 Next.js 환경에서 안전하게 사용
import { Buffer } from "node:buffer";

export interface PdfBrief {
  fileName: string;
  pageCount: number;
  fonts: string[];
  text: string;
}

const MAX_TEXT_CHARS = 8_000;

type PdfParseResult = { text: string; numpages: number; info?: Record<string, unknown> };
type PdfParseFn = (b: Buffer) => Promise<PdfParseResult>;

export async function extractPdf(fileName: string, buf: Buffer | Uint8Array): Promise<PdfBrief> {
  const mod = (await import("pdf-parse")) as unknown as { default: PdfParseFn };
  const pdfParse = mod.default ?? (mod as unknown as PdfParseFn);

  const data = await pdfParse(Buffer.from(buf));

  // 앞 3 + 뒤 2 페이지 정도가 가장 의미 있는 정보 — pdf-parse가 페이지 분리를 제공하지 않으므로 글자 기반 trim
  const lines = data.text.split("\n").map((l) => l.trim()).filter((l) => l && l.length > 1);
  let combined = lines.join("\n");
  if (combined.length > MAX_TEXT_CHARS) {
    const head = combined.slice(0, MAX_TEXT_CHARS * 0.6);
    const tail = combined.slice(-MAX_TEXT_CHARS * 0.4);
    combined = `${head}\n...\n${tail}`;
  }

  const info = (data.info ?? {}) as Record<string, unknown>;
  const fontsField = info.Fonts ?? info.fonts;
  const fonts = Array.isArray(fontsField) ? fontsField.map(String) : [];

  return {
    fileName,
    pageCount: data.numpages ?? 0,
    fonts,
    text: combined,
  };
}
