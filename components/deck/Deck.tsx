"use client";

import { useCallback, useEffect, useState } from "react";
import type { Slide, PptDesignSystem } from "@/lib/types";
import DesignTokens from "@/components/DesignTokens";
import SlideRenderer from "./layouts/index";
import clsx from "clsx";

interface Props {
  slides: Slide[];
  design: PptDesignSystem;
  onReset: () => void;
}

export default function Deck({ slides, design, onReset }: Props) {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const total = slides.length;

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape") {
        if (isFullscreen) exitFullscreen();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, isFullscreen]);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      exitFullscreen();
    }
  }

  function exitFullscreen() {
    document.exitFullscreen().then(() => setIsFullscreen(false));
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <DesignTokens design={design} />

      <div className="flex h-screen bg-zinc-950 no-print" style={{ overflow: "hidden" }}>
        {/* Sidebar — thumbnail strip */}
        <div
          className="w-52 flex-shrink-0 overflow-y-auto py-4 px-2 flex flex-col gap-2 bg-zinc-900"
          style={{ scrollbarWidth: "thin" }}
        >
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={clsx(
                "w-full text-left rounded overflow-hidden ring-1 transition-all",
                i === current
                  ? "ring-white/50 scale-[1.02]"
                  : "ring-white/10 hover:ring-white/25"
              )}
            >
              {/* Mini preview */}
              <div
                className="w-full"
                style={{
                  aspectRatio: "16/9",
                  fontSize: "4px",
                  transform: "scale(1)",
                  overflow: "hidden",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                <SlideRenderer slide={slide} design={design} />
              </div>
              <div className="px-2 py-1 bg-zinc-800">
                <p className="text-zinc-400 text-[10px] truncate">
                  {i + 1}. {getSlideLabel(slide)}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-white/5">
            <button
              onClick={onReset}
              className="text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-1.5"
            >
              ← 새로 만들기
            </button>

            <div className="flex items-center gap-3">
              <button onClick={prev} disabled={current === 0} className="text-zinc-400 hover:text-white disabled:opacity-30 px-2 py-1 text-sm transition-colors">
                ‹ 이전
              </button>
              <span className="text-zinc-300 text-sm tabular-nums">
                {current + 1} / {total}
              </span>
              <button onClick={next} disabled={current === total - 1} className="text-zinc-400 hover:text-white disabled:opacity-30 px-2 py-1 text-sm transition-colors">
                다음 ›
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="text-zinc-400 hover:text-white text-sm px-3 py-1.5 rounded border border-white/10 hover:border-white/25 transition-all"
              >
                PDF 저장
              </button>
              <button
                onClick={toggleFullscreen}
                className="text-zinc-400 hover:text-white text-sm px-3 py-1.5 rounded border border-white/10 hover:border-white/25 transition-all"
              >
                전체화면 (F)
              </button>
            </div>
          </div>

          {/* Slide canvas */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <div
              className="shadow-2xl ring-1 ring-white/10"
              style={{ width: "min(100%, calc(100vh * 16/9 - 8rem))" }}
            >
              <SlideRenderer slide={slides[current]} design={design} />
            </div>
          </div>

          {/* Keyboard hints */}
          <div className="flex justify-center gap-6 pb-3 text-zinc-600 text-xs">
            <span>← → 이동</span>
            <span>F 전체화면</span>
            <span>P PDF</span>
          </div>
        </div>
      </div>

      {/* Print-only: all slides in order */}
      <div className="print-only hidden" style={{ display: "none" }}>
        <style>{`
          @media print {
            .print-only { display: block !important; }
            .no-print { display: none !important; }
          }
        `}</style>
        {slides.map((slide, i) => (
          <div key={i} className="slide-page">
            <SlideRenderer slide={slide} design={design} />
          </div>
        ))}
      </div>
    </>
  );
}

function getSlideLabel(slide: Slide): string {
  switch (slide.layoutId) {
    case "cover": return slide.title;
    case "section-divider": return slide.chapterTitle;
    case "title-body": return slide.title;
    case "title-bullets": return slide.title;
    case "two-column-compare": return slide.title ?? `${slide.leftLabel} vs ${slide.rightLabel}`;
    case "big-stat": return `${slide.stat} ${slide.unit ?? ""}`.trim();
    case "quote": return slide.quote.slice(0, 30) + "…";
    case "timeline": return slide.title;
    case "image-caption": return slide.caption.slice(0, 30);
    case "closing": return slide.headline;
    default: return "슬라이드";
  }
}
