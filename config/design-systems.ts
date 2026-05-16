/**
 * getdesign.md 카탈로그에서 PPT 전용 디자인 시스템으로 변환할 회사 메타.
 *
 * brandName/primaryColor/accentColor는 갤러리에 "바로" 보여주기 위한 fallback.
 * 빌드 후엔 public/design-systems/<slug>.json의 실제 값으로 자동 덮어쓰임.
 * domain은 Clearbit 로고 API(https://logo.clearbit.com/<domain>)로 로고 표시에 사용.
 */

export interface SlugMeta {
  slug: string;
  brandName: string;
  domain: string;
  primaryColor: string;
  accentColor: string;
}

export const CATALOG: SlugMeta[] = [
  { slug: "minimax",    brandName: "MiniMax",    domain: "minimaxi.com",  primaryColor: "#ff5530", accentColor: "#0a0a0a" },
  { slug: "anthropic",  brandName: "Anthropic",  domain: "anthropic.com", primaryColor: "#cc785c", accentColor: "#1a1a1a" },
  { slug: "linear",     brandName: "Linear",     domain: "linear.app",    primaryColor: "#5e6ad2", accentColor: "#0a0a0a" },
  { slug: "vercel",     brandName: "Vercel",     domain: "vercel.com",    primaryColor: "#000000", accentColor: "#fafafa" },
  { slug: "stripe",     brandName: "Stripe",     domain: "stripe.com",    primaryColor: "#635bff", accentColor: "#0a2540" },
  { slug: "apple",      brandName: "Apple",      domain: "apple.com",     primaryColor: "#000000", accentColor: "#0071e3" },
  { slug: "figma",      brandName: "Figma",      domain: "figma.com",     primaryColor: "#0acf83", accentColor: "#a259ff" },
  { slug: "ibm",        brandName: "IBM",        domain: "ibm.com",       primaryColor: "#0f62fe", accentColor: "#161616" },
  { slug: "lovable",    brandName: "Lovable",    domain: "lovable.dev",   primaryColor: "#ff4d8d", accentColor: "#0a0a0a" },
  { slug: "mastercard", brandName: "Mastercard", domain: "mastercard.com",primaryColor: "#eb001b", accentColor: "#ff5f00" },
  { slug: "meta",       brandName: "Meta",       domain: "meta.com",      primaryColor: "#0064e0", accentColor: "#1c2b33" },
  { slug: "nike",       brandName: "Nike",       domain: "nike.com",      primaryColor: "#111111", accentColor: "#d4ff00" },
  { slug: "notion",     brandName: "Notion",     domain: "notion.so",     primaryColor: "#000000", accentColor: "#787774" },
];

export const SLUGS: string[] = CATALOG.map((c) => c.slug);
