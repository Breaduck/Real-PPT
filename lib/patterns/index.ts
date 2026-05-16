import { SKELETONS } from "./skeletons";
import { CHARTS } from "./charts";
import { ACCENTS } from "./accents";
import type {
  Pattern,
  SkeletonPattern,
  ChartPattern,
  AccentPattern,
  SlimPatternEntry,
  PatternCategory,
} from "./types";

export type { Pattern, SkeletonPattern, ChartPattern, AccentPattern, SlimPatternEntry, PatternCategory };
export { SKELETONS, CHARTS, ACCENTS };

export const ALL_PATTERNS: Pattern[] = [...SKELETONS, ...CHARTS, ...ACCENTS];

const BY_ID = new Map<string, Pattern>(ALL_PATTERNS.map((p) => [p.id, p]));

export function getPatternById(id: string): Pattern | undefined {
  return BY_ID.get(id);
}

export function getPatternsByIds(ids: {
  skeleton?: string;
  chart?: string;
  accent?: string;
}): {
  skeleton?: SkeletonPattern;
  chart?: ChartPattern;
  accent?: AccentPattern;
} {
  const out: { skeleton?: SkeletonPattern; chart?: ChartPattern; accent?: AccentPattern } = {};
  if (ids.skeleton) {
    const p = BY_ID.get(ids.skeleton);
    if (p?.category === "skeleton") out.skeleton = p;
  }
  if (ids.chart) {
    const p = BY_ID.get(ids.chart);
    if (p?.category === "chart") out.chart = p;
  }
  if (ids.accent) {
    const p = BY_ID.get(ids.accent);
    if (p?.category === "accent") out.accent = p;
  }
  return out;
}

/** Stage 1 (Haiku) 용 슬림 인덱스 — id+category+purpose+inputSignature만, ~10KB */
export function getSlimIndex(): SlimPatternEntry[] {
  return ALL_PATTERNS.map((p) => ({
    id: p.id,
    category: p.category,
    purpose: p.purpose,
    inputSignature: p.inputSignature,
  }));
}

/** Stage 2 (Opus) 용 풀 디테일 — visualSketch + svgTemplate 포함, 선택된 패턴만 */
export function getFullDetails(ids: {
  skeleton?: string;
  chart?: string;
  accent?: string;
}[]): Pattern[] {
  const set = new Set<string>();
  for (const i of ids) {
    if (i.skeleton) set.add(i.skeleton);
    if (i.chart) set.add(i.chart);
    if (i.accent) set.add(i.accent);
  }
  return [...set].map((id) => BY_ID.get(id)).filter((p): p is Pattern => Boolean(p));
}
