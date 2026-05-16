"use client";

import { useEffect } from "react";
import type { SlugMeta } from "@/config/design-systems";
import { buildMockDesign } from "@/lib/preview/mock-design";
import { buildDemoSlides } from "@/lib/preview/demo-slides";
import SlideRenderer from "@/components/deck/layouts";

interface Props {
  meta: SlugMeta;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const THUMB_WIDTH = 280;
const NATIVE_WIDTH = 1280;
const NATIVE_HEIGHT = 720;
const SCALE = THUMB_WIDTH / NATIVE_WIDTH;
const THUMB_HEIGHT = NATIVE_HEIGHT * SCALE;

export default function GalleryPreviewModal({ meta, loading, onClose, onConfirm }: Props) {
  const design = buildMockDesign(meta);
  const slides = buildDemoSlides(meta.brandName, meta.slug);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 dark:bg-black/75 flex items-center justify-center px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 sm:p-8 w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">미리보기 · 4장</p>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {meta.brandName} <span className="text-zinc-400 font-normal text-base">/ {meta.slug}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-2xl leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 mb-5">
          이 디자인 시스템으로 만들 슬라이드의 톤·구성 예시. 실제 변환은 getdesign.md의 정밀 토큰으로 다시 합성됩니다.
        </p>

        {/* 4-slide grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {slides.map((slide) => (
            <div
              key={slide.slideNumber}
              className="rounded-lg overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700"
              style={{ width: "100%", aspectRatio: "16 / 9" }}
            >
              <div
                style={{
                  width: NATIVE_WIDTH,
                  height: NATIVE_HEIGHT,
                  transform: `scale(${SCALE})`,
                  transformOrigin: "top left",
                }}
              >
                <SlideRenderer slide={slide} design={design} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-500 transition-all text-sm"
          >
            닫기
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-[2] py-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
          >
            {loading ? "디자인 시스템 불러오는 중..." : "이 디자인으로 슬라이드 만들기 →"}
          </button>
        </div>

        <p className="text-zinc-400 dark:text-zinc-600 text-xs text-center mt-3">
          ⌨ esc 또는 바깥 클릭으로 닫기
        </p>
      </div>
    </div>
  );
}
