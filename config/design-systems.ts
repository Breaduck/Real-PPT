/**
 * getdesign.md 카탈로그에서 PPT 전용 디자인 시스템으로 변환할 회사 메타.
 *
 * brandName/primaryColor/accentColor는 갤러리에 "바로" 보여주기 위한 fallback.
 * 빌드 후엔 public/design-systems/<slug>.json의 실제 값으로 자동 덮어쓰임.
 *
 * 사용:
 *  1) 빌드 타임 캐시 (옵션): `npm run build:design-systems`
 *  2) 런타임 즉석 변환: 갤러리에서 슬러그 클릭하면 transform-design API가 자동 호출
 */

export interface SlugMeta {
  slug: string;
  brandName: string;
  primaryColor: string;
  accentColor: string;
}

export const CATALOG: SlugMeta[] = [
  { slug: "minimax",    brandName: "MiniMax",    primaryColor: "#ff5530", accentColor: "#0a0a0a" },
  { slug: "anthropic",  brandName: "Anthropic",  primaryColor: "#cc785c", accentColor: "#1a1a1a" },
  { slug: "linear",     brandName: "Linear",     primaryColor: "#5e6ad2", accentColor: "#0a0a0a" },
  { slug: "vercel",     brandName: "Vercel",     primaryColor: "#000000", accentColor: "#fafafa" },
  { slug: "stripe",     brandName: "Stripe",     primaryColor: "#635bff", accentColor: "#0a2540" },
  { slug: "apple",      brandName: "Apple",      primaryColor: "#000000", accentColor: "#0071e3" },
  { slug: "figma",      brandName: "Figma",      primaryColor: "#0acf83", accentColor: "#a259ff" },
  { slug: "ibm",        brandName: "IBM",        primaryColor: "#0f62fe", accentColor: "#161616" },
  { slug: "lovable",    brandName: "Lovable",    primaryColor: "#ff4d8d", accentColor: "#0a0a0a" },
  { slug: "mastercard", brandName: "Mastercard", primaryColor: "#eb001b", accentColor: "#ff5f00" },
  { slug: "meta",       brandName: "Meta",       primaryColor: "#0064e0", accentColor: "#1c2b33" },
  { slug: "nike",       brandName: "Nike",       primaryColor: "#111111", accentColor: "#d4ff00" },
  { slug: "notion",     brandName: "Notion",     primaryColor: "#000000", accentColor: "#787774" },
];

export const SLUGS: string[] = CATALOG.map((c) => c.slug);
