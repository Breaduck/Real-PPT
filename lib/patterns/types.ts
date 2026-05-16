import type { LayoutId } from "../types";

/**
 * 슬라이드 패턴 어휘집 — "통짜 템플릿" 라이브러리 회피용 분해.
 * 카테고리: skeleton(레이아웃 골격), chart(차트·다이어그램), accent(강조 디바이스).
 * 한 슬라이드는 skeleton 1 + chart 0~1 + accent 0~1 조합으로 합성됨.
 */

export type PatternCategory = "skeleton" | "chart" | "accent";

interface BasePattern {
  id: string;
  category: PatternCategory;
  name: string;
  purpose: string;
  inputSignature: string;
  visualSketch: string;
  tokenHints: string[];
}

export interface SkeletonPattern extends BasePattern {
  category: "skeleton";
  /** 이 골격이 자연스럽게 어울리는 layoutId 목록 */
  compatibleLayouts: LayoutId[];
}

export interface ChartPattern extends BasePattern {
  category: "chart";
  /** 1280×720 좌표계 SVG 템플릿. {{PLACEHOLDER}} 형태로 LLM이 값만 치환. */
  svgTemplate: string;
  /** 템플릿이 요구하는 placeholder 이름들 (LLM이 채울 필드) */
  placeholders: string[];
}

export interface AccentPattern extends BasePattern {
  category: "accent";
  /** 슬라이드 내 배치 위치 힌트 */
  placement: "corner" | "strip" | "inline" | "background";
}

export type Pattern = SkeletonPattern | ChartPattern | AccentPattern;

/** Stage 1 용 슬림 패턴 인덱스 — LLM 프롬프트에 주입할 압축형 (id+category+purpose+inputSignature) */
export interface SlimPatternEntry {
  id: string;
  category: PatternCategory;
  purpose: string;
  inputSignature: string;
}
