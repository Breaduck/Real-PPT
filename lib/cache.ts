import type { PptDesignSystem } from "./types";
import crypto from "crypto";

const cache = new Map<string, PptDesignSystem>();

export function hashDesignMd(designMd: string): string {
  return crypto.createHash("sha256").update(designMd).digest("hex").slice(0, 16);
}

export function hashCompanyInputs(url: string, fileHashes: string[]): string {
  const combined = [url, ...fileHashes.sort()].join("|");
  return crypto.createHash("sha256").update(combined).digest("hex").slice(0, 16);
}

export function hashBuffer(buf: Buffer | Uint8Array): string {
  return crypto.createHash("sha256").update(buf).digest("hex").slice(0, 16);
}

export function getCachedDesign(hash: string): PptDesignSystem | undefined {
  return cache.get(hash);
}

export function setCachedDesign(hash: string, design: PptDesignSystem): void {
  cache.set(hash, design);
}
