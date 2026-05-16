import type { SlidePatternIds } from "../types";

/**
 * Stage 1 (Haiku 패턴 선택) 출력의 다양성 룰 검증.
 * 위반 시 호출 측에서 1회 재시도 트리거.
 */

export interface PatternSelectionRow {
  slideIndex: number;
  layoutId: string;
  patternIds: SlidePatternIds;
  contentHint?: string;
}

export interface ValidationResult {
  ok: boolean;
  violations: string[];
}

/** AI 클리셰 회피 룰 */
export function validatePatternSelection(rows: PatternSelectionRow[]): ValidationResult {
  const violations: string[] = [];
  const total = rows.length;
  if (total === 0) {
    return { ok: false, violations: ["empty selection"] };
  }

  // 1) 연속 2장 동일 skeleton 금지
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].patternIds.skeleton === rows[i - 1].patternIds.skeleton) {
      violations.push(`연속 슬라이드 ${i}, ${i + 1}이 동일 skeleton 사용: ${rows[i].patternIds.skeleton}`);
    }
  }

  // 2) 30장 이상이면 unique skeleton >= 12, 그 미만은 비례
  const uniqueSkeletons = new Set(rows.map((r) => r.patternIds.skeleton));
  const minUnique = Math.min(12, Math.floor(total * 0.4));
  if (uniqueSkeletons.size < minUnique) {
    violations.push(`unique skeleton 부족: ${uniqueSkeletons.size} < ${minUnique}`);
  }

  // 3) 같은 chart 패턴 id를 2회 이상 사용 금지
  const chartCounts = new Map<string, number>();
  for (const r of rows) {
    if (r.patternIds.chart) {
      chartCounts.set(r.patternIds.chart, (chartCounts.get(r.patternIds.chart) ?? 0) + 1);
    }
  }
  for (const [id, n] of chartCounts) {
    if (n > 1) violations.push(`chart 패턴 ${id} 중복 사용 (${n}회)`);
  }

  // 4) chart 사용 슬라이드 비율 — 너무 많으면 산만, 너무 적으면 단조
  const chartSlides = rows.filter((r) => r.patternIds.chart).length;
  const minChart = Math.floor(total * 0.15);
  const maxChart = Math.ceil(total * 0.4);
  if (chartSlides < minChart) violations.push(`chart 슬라이드 부족: ${chartSlides} < ${minChart}`);
  if (chartSlides > maxChart) violations.push(`chart 슬라이드 과다: ${chartSlides} > ${maxChart}`);

  // 5) 같은 accent 연속 3회 금지
  for (let i = 2; i < rows.length; i++) {
    const a0 = rows[i - 2].patternIds.accent;
    const a1 = rows[i - 1].patternIds.accent;
    const a2 = rows[i].patternIds.accent;
    if (a0 && a0 === a1 && a1 === a2) {
      violations.push(`accent ${a0} 가 슬라이드 ${i - 1}~${i + 1} 연속 3회`);
    }
  }

  return { ok: violations.length === 0, violations };
}

/** validation 위반 사항을 LLM 재시도 프롬프트에 추가할 텍스트로 포맷 */
export function violationsToRetryHint(violations: string[]): string {
  return `이전 시도에서 다양성 룰 위반:\n${violations.map((v) => `- ${v}`).join("\n")}\n\n위 위반을 모두 해결하도록 패턴 선택을 다시 분배하라.`;
}
