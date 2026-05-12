import type { PptDesignSystem } from "./types";
import crypto from "crypto";

// In-memory cache — resets on server restart. Good enough for MVP.
const cache = new Map<string, PptDesignSystem>();

export function hashDesignMd(designMd: string): string {
  return crypto.createHash("sha256").update(designMd).digest("hex").slice(0, 16);
}

export function getCachedDesign(hash: string): PptDesignSystem | undefined {
  return cache.get(hash);
}

export function setCachedDesign(hash: string, design: PptDesignSystem): void {
  cache.set(hash, design);
}
