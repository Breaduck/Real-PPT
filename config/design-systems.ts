/**
 * getdesign.md 카탈로그에서 PPT 전용 디자인 시스템으로 변환할 회사 메타.
 *
 * brandName/primaryColor/accentColor는 갤러리에 "바로" 보여주기 위한 fallback.
 * 빌드 후엔 public/design-systems/<slug>.json의 실제 값으로 자동 덮어쓰임.
 * githubOrg는 https://github.com/<org>.png?size=80 로 로고 표시 (getdesign.md와 동일 방식).
 */

export interface SlugMeta {
  slug: string;
  brandName: string;
  githubOrg: string;
  primaryColor: string;
  accentColor: string;
  /** public/ 기준 정적 로고 경로. 있으면 GH avatar 대신 우선 사용. */
  logoOverride?: string;
  /** GH avatar 요청 사이즈. 기본 80. 원본이 작은 org (MiniMax)는 200으로 올려 또렷하게. */
  logoSize?: number;
}

export const CATALOG: SlugMeta[] = [
  { slug: "minimax",    brandName: "MiniMax",    githubOrg: "MiniMax-AI",  primaryColor: "#ff5530", accentColor: "#0a0a0a", logoSize: 200 },
  { slug: "anthropic",  brandName: "Anthropic",  githubOrg: "anthropics",  primaryColor: "#cc785c", accentColor: "#1a1a1a" },
  { slug: "linear",     brandName: "Linear",     githubOrg: "linear",      primaryColor: "#5e6ad2", accentColor: "#0a0a0a" },
  { slug: "vercel",     brandName: "Vercel",     githubOrg: "vercel",      primaryColor: "#000000", accentColor: "#fafafa" },
  { slug: "stripe",     brandName: "Stripe",     githubOrg: "stripe",      primaryColor: "#635bff", accentColor: "#0a2540" },
  { slug: "apple",      brandName: "Apple",      githubOrg: "apple",       primaryColor: "#000000", accentColor: "#0071e3" },
  { slug: "figma",      brandName: "Figma",      githubOrg: "figma",       primaryColor: "#0acf83", accentColor: "#a259ff" },
  { slug: "ibm",        brandName: "IBM",        githubOrg: "ibm",         primaryColor: "#0f62fe", accentColor: "#161616" },
  { slug: "lovable",    brandName: "Lovable",    githubOrg: "lovablelabs", primaryColor: "#ff4d8d", accentColor: "#0a0a0a" },
  { slug: "mastercard", brandName: "Mastercard", githubOrg: "Mastercard",  primaryColor: "#eb001b", accentColor: "#ff5f00" },
  { slug: "meta",       brandName: "Meta",       githubOrg: "facebook",    primaryColor: "#0064e0", accentColor: "#1c2b33" },
  { slug: "nike",       brandName: "Nike",       githubOrg: "nike",        primaryColor: "#111111", accentColor: "#d4ff00", logoOverride: "/logos/nike.svg" },
  { slug: "notion",     brandName: "Notion",     githubOrg: "makenotion",  primaryColor: "#000000", accentColor: "#787774" },
];

export const SLUGS: string[] = CATALOG.map((c) => c.slug);
