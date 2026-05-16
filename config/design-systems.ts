/**
 * 빌드 타임에 PPT 전용 디자인 시스템으로 변환할 회사 슬러그 리스트.
 * getdesign.md 카탈로그의 슬러그(예: "minimax", "stripe", "anthropic")를 직접 추가.
 *
 * 추가 후 `npm run build:design-systems` 실행 → public/design-systems/<slug>.json 생성.
 */
export const SLUGS: string[] = [
  "minimax",
  "anthropic",
  "linear",
  "vercel",
  "stripe",
  "apple",
  "figma",
  "ibm",
  "lovable",
  "mastercard",
  "meta",
  "nike",
  "notion",
];
