"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Slide, PptDesignSystem } from "@/lib/types";
import type { DeckEdits, SlideEdits } from "@/lib/editTypes";
import { EditContext, type EditContextValue } from "@/contexts/EditContext";
import DesignTokens from "@/components/DesignTokens";
import SlideRenderer from "./layouts/index";
import EditPanel from "./EditPanel";
import clsx from "clsx";

interface Props {
  slides: Slide[];
  design: PptDesignSystem;
  onReset: () => void;
}

export default function Deck({ slides, design, onReset }: Props) {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deckEdits, setDeckEdits] = useState<DeckEdits>({});
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const total = slides.length;

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);

  // Reset selection when slide changes
  useEffect(() => { setSelectedElementId(null); }, [current]);
  useEffect(() => { if (!editMode) setSelectedElementId(null); }, [editMode]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault(); next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault(); prev();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape") {
        if (isFullscreen) exitFullscreen();
        if (editMode) setEditMode(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, isFullscreen, editMode]);

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

  // ── Edit state helpers ──
  function getSlideEdits(idx: number): SlideEdits { return deckEdits[idx] ?? {}; }

  function updateText(slideIdx: number, id: string, text: string) {
    setDeckEdits(prev => ({
      ...prev,
      [slideIdx]: { ...(prev[slideIdx] ?? {}), [id]: { ...(prev[slideIdx]?.[id] ?? {}), text } },
    }));
  }
  function updateStyle(slideIdx: number, id: string, style: CSSProperties) {
    setDeckEdits(prev => ({
      ...prev,
      [slideIdx]: { ...(prev[slideIdx] ?? {}), [id]: { ...(prev[slideIdx]?.[id] ?? {}), style } },
    }));
  }
  function updateOffset(slideIdx: number, id: string, x: number, y: number) {
    setDeckEdits(prev => ({
      ...prev,
      [slideIdx]: { ...(prev[slideIdx] ?? {}), [id]: { ...(prev[slideIdx]?.[id] ?? {}), offsetX: x, offsetY: y } },
    }));
  }

  function makeContextValue(slideIdx: number, isEditMode: boolean): EditContextValue {
    const edits = getSlideEdits(slideIdx);
    return {
      editMode: isEditMode,
      slideIndex: slideIdx,
      selectedId: isEditMode ? selectedElementId : null,
      selectElement: (id) => setSelectedElementId(id),
      getOverrideText: (id) => edits[id]?.text,
      getOverrideStyle: (id) => edits[id]?.style,
      getOffset: (id) => ({ offsetX: edits[id]?.offsetX ?? 0, offsetY: edits[id]?.offsetY ?? 0 }),
      updateText: (id, text) => updateText(slideIdx, id, text),
      updateStyle: (id, style) => updateStyle(slideIdx, id, style),
      updateOffset: (id, x, y) => updateOffset(slideIdx, id, x, y),
    };
  }

  const mainCtxValue = makeContextValue(current, editMode);

  // ── PDF / Print ──
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
                i === current ? "ring-white/50 scale-[1.02]" : "ring-white/10 hover:ring-white/25"
              )}
            >
              <div
                style={{
                  aspectRatio: "16/9",
                  fontSize: "4px",
                  overflow: "hidden",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {/* Thumbnails render without edit context — show original content */}
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
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-white/5 flex-shrink-0">
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
              <span className="text-zinc-300 text-sm tabular-nums">{current + 1} / {total}</span>
              <button onClick={next} disabled={current === total - 1} className="text-zinc-400 hover:text-white disabled:opacity-30 px-2 py-1 text-sm transition-colors">
                다음 ›
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditMode(m => !m)}
                className={clsx(
                  "text-sm px-3 py-1.5 rounded border transition-all",
                  editMode
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "text-zinc-400 hover:text-white border-white/10 hover:border-white/25"
                )}
              >
                {editMode ? "편집 완료" : "편집"}
              </button>
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

          {/* Main canvas + edit panel row */}
          <EditContext.Provider value={mainCtxValue}>
            <div className="flex flex-1 overflow-hidden min-h-0">
              {/* Slide canvas */}
              <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
                <div
                  className="shadow-2xl ring-1 ring-white/10"
                  style={{ width: "min(100%, calc((100vh - 56px) * 16/9 - 4rem))" }}
                >
                  <SlideRenderer slide={slides[current]} design={design} />
                </div>
              </div>
              {/* Edit panel — right side */}
              {editMode && (
                <EditPanel
                  slide={slides[current]}
                  onClose={() => setEditMode(false)}
                />
              )}
            </div>
          </EditContext.Provider>

          {/* Keyboard hints */}
          <div className="flex justify-center gap-6 pb-3 text-zinc-600 text-xs flex-shrink-0 no-print">
            <span>← → 이동</span>
            <span>F 전체화면</span>
            <span>{editMode ? "Esc 편집 종료" : "편집 버튼으로 수정"}</span>
          </div>
        </div>
      </div>

      {/* Print-only: all slides */}
      <div className="print-only" style={{ display: "none" }}>
        <style>{`
          @media print {
            @page { size: 10in 5.625in; margin: 0; }
            html, body { width: 10in; height: 5.625in; margin: 0; padding: 0; }
            .print-only { display: block !important; }
            .no-print { display: none !important; }
            .slide-page {
              width: 10in;
              height: 5.625in;
              page-break-after: always;
              break-after: page;
              overflow: hidden;
              box-sizing: border-box;
            }
          }
        `}</style>
        {slides.map((slide, i) => {
          const printCtx = makeContextValue(i, false);
          return (
            <EditContext.Provider key={i} value={printCtx}>
              <div className="slide-page">
                <SlideRenderer slide={slide} design={design} />
              </div>
            </EditContext.Provider>
          );
        })}
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
