import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PPT Maker — design.md 기반 슬라이드 생성",
  description: "브랜드 디자인 시스템으로 전문적인 프레젠테이션을 자동 생성",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
