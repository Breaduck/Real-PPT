"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { SKELETONS, CHARTS, ACCENTS, type Pattern } from "@/lib/patterns";
import { SkeletonPreview, AccentPreview, substituteChartPlaceholders } from "./previews";

type Tab = "skeleton" | "chart" | "accent";

const TABS: { id: Tab; label: string; count: number; hint: string }[] = [
  { id: "skeleton", label: "Skeletons", count: SKELETONS.length, hint: "슬라이드 그리드 구조" },
  { id: "chart",    label: "Charts",    count: CHARTS.length,    hint: "데이터 시각화 SVG 템플릿" },
  { id: "accent",   label: "Accents",   count: ACCENTS.length,   hint: "시그니처 강조 디바이스" },
];

export default function PatternsPage() {
  const [tab, setTab] = useState<Tab>("skeleton");

  const data: Pattern[] = tab === "skeleton" ? SKELETONS : tab === "chart" ? CHARTS : ACCENTS;

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">
            ← PPT Maker
          </Link>
          <p className="text-zinc-500 text-xs">
            총 {SKELETONS.length + CHARTS.length + ACCENTS.length}개 패턴
          </p>
        </div>

        <h1 className="text-3xl font-bold mb-1">패턴 어휘집</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 max-w-2xl">
          슬라이드 생성 AI가 참조하는 시각 패턴 카탈로그. 한 슬라이드는 skeleton 1 + chart 0~1 + accent 0~1의 조합으로 합성됩니다.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                "px-4 py-3 border-b-2 transition-colors -mb-px text-left",
                tab === t.id
                  ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              )}
            >
              <div className="text-sm font-medium">{t.label} <span className="text-zinc-400 dark:text-zinc-600 font-normal">{t.count}</span></div>
              <div className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{t.hint}</div>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((p) => <PatternCard key={p.id} pattern={p} />)}
        </div>
      </div>
    </div>
  );
}

function PatternCard({ pattern }: { pattern: Pattern }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-zinc-900 dark:text-zinc-100 text-sm font-semibold truncate">{pattern.name}</p>
          <p className="text-zinc-400 dark:text-zinc-600 text-[10px] font-mono mt-0.5 truncate">{pattern.id}</p>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800 px-2 py-0.5 rounded">
          {pattern.category}
        </span>
      </div>

      <PatternPreview pattern={pattern} />

      <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
        <span className="text-zinc-900 dark:text-zinc-200 font-medium">{pattern.purpose}</span>
      </p>
      <p className="text-zinc-500 dark:text-zinc-500 text-[11px] leading-relaxed">
        <span className="text-zinc-400 dark:text-zinc-600 uppercase tracking-wider text-[10px] mr-1">Input</span>
        {pattern.inputSignature}
      </p>
    </div>
  );
}

function PatternPreview({ pattern }: { pattern: Pattern }) {
  if (pattern.category === "chart") {
    return (
      <div
        className="bg-white dark:bg-zinc-950 rounded-md p-2 ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden flex items-center justify-center"
        style={{ aspectRatio: "16 / 9" }}
        dangerouslySetInnerHTML={{ __html: substituteChartPlaceholders(pattern.svgTemplate) }}
      />
    );
  }
  if (pattern.category === "skeleton") {
    return <SkeletonPreview id={pattern.id} name={pattern.name} />;
  }
  return <AccentPreview id={pattern.id} name={pattern.name} />;
}
