import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PPT Maker — design.md 기반 슬라이드 생성",
  description: "브랜드 디자인 시스템으로 전문적인 프레젠테이션을 자동 생성",
};

// hydration mismatch 방지: 초기 페인트 전에 테마 결정
const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('ppt_theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
