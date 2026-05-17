"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

// 미니 카탈로그용 시각 톤. CSS var와 어울리지만 미리보기는 고정 hex.
const BRAND = "#ff5530";

function MiniSlide({
  children,
  dark = false,
  className,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-md ring-1 overflow-hidden relative",
        dark
          ? "bg-zinc-950 ring-zinc-800"
          : "bg-white dark:bg-zinc-900 ring-zinc-200 dark:ring-zinc-700",
        className,
      )}
      style={{ aspectRatio: "16 / 9" }}
    >
      {children}
    </div>
  );
}

function FallbackPreview({ name }: { name: string }) {
  return (
    <MiniSlide>
      <div className="absolute inset-0 flex items-center justify-center text-center px-2">
        <p className="text-[6px] text-zinc-400">{name}</p>
      </div>
    </MiniSlide>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Skeleton previews — 한 슬라이드 전체 구조를 보여주는 미니 16:9      */
/* ──────────────────────────────────────────────────────────────────── */

export function SkeletonPreview({ id, name }: { id: string; name: string }) {
  switch (id) {
    /* ── COVER ── */
    case "sk-cover-centered-hero":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center">
            <p className="text-[5px] tracking-[0.25em] uppercase text-zinc-400">PART ONE</p>
            <p className="text-[16px] font-bold leading-none text-zinc-900 dark:text-zinc-100">Hero Title</p>
            <p className="text-[6px] text-zinc-500">supporting subtitle line</p>
            <p className="text-[4px] mt-2 text-zinc-400">Author · 2026</p>
          </div>
        </MiniSlide>
      );

    case "sk-cover-asym-left":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col justify-between">
            <div className="space-y-0.5">
              <p className="text-[13px] font-bold leading-tight text-zinc-900 dark:text-zinc-100">
                Hero Title<br />wraps tightly
              </p>
              <p className="text-[5px] text-zinc-500 mt-0.5">supporting subtitle</p>
            </div>
            <p className="text-[4px] text-zinc-400">Author · 2026</p>
          </div>
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45"
            style={{ background: BRAND }}
          />
        </MiniSlide>
      );

    case "sk-cover-split-image":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex">
            <div className="w-1/2 p-3 flex flex-col justify-center gap-0.5">
              <p className="text-[12px] font-bold leading-tight text-zinc-900 dark:text-zinc-100">Title</p>
              <p className="text-[5px] text-zinc-500">subtitle line</p>
              <p className="text-[4px] mt-2 text-zinc-400">Author</p>
            </div>
            <div className="w-1/2 bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800" />
          </div>
        </MiniSlide>
      );

    case "sk-cover-dark-bold":
      return (
        <MiniSlide dark>
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <p className="text-[14px] font-bold leading-tight text-white">
              Big statement<br />that lands hard
            </p>
          </div>
        </MiniSlide>
      );

    /* ── SECTION ── */
    case "sk-section-numbered":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col justify-center pl-4 gap-0.5">
            <p className="text-[26px] font-bold leading-none" style={{ color: BRAND }}>01</p>
            <p className="text-[10px] font-semibold text-zinc-900 dark:text-zinc-100 mt-1">Chapter Title</p>
            <p className="text-[5px] text-zinc-500">subtitle for the section</p>
          </div>
        </MiniSlide>
      );

    case "sk-section-minimal-line":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col justify-center px-5 gap-1">
            <div className="flex items-center gap-2">
              <p className="text-[6px] tracking-[0.25em] uppercase text-zinc-400">Part Two</p>
              <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <p className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">The Inflection</p>
          </div>
        </MiniSlide>
      );

    case "sk-section-full-brand":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col justify-center px-4 gap-0.5" style={{ background: BRAND }}>
            <p className="text-[5px] tracking-[0.3em] uppercase text-white/70">PART THREE</p>
            <p className="text-[12px] font-bold text-white">Section Title</p>
            <p className="text-[5px] text-white/80 mt-0.5">a thesis line that frames the chapter</p>
          </div>
        </MiniSlide>
      );

    /* ── TITLE + BODY ── */
    case "sk-title-body-classic":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-0.5">
            <p className="text-[4px] tracking-[0.2em] uppercase text-zinc-400">EYEBROW</p>
            <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">Slide Title</p>
            <p className="text-[5px] text-zinc-500">subtitle</p>
            <div className="mt-1.5 space-y-1">
              <div className="h-[2.5px] w-full rounded-sm bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-[2.5px] w-[95%] rounded-sm bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-[2.5px] w-[88%] rounded-sm bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-[2.5px] w-[70%] rounded-sm bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-title-body-pull-quote":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-1">
            <p className="text-[9px] font-bold text-zinc-900 dark:text-zinc-100">Slide Title</p>
            <div className="space-y-0.5">
              <div className="h-[2.5px] w-full bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[2.5px] w-[88%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            </div>
            <div className="my-0.5 border-l-2 pl-1.5" style={{ borderColor: BRAND }}>
              <p className="text-[7px] font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                Key sentence amplified here.
              </p>
            </div>
            <div className="space-y-0.5">
              <div className="h-[2.5px] w-full bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[2.5px] w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-title-body-two-block":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-1.5">
            <p className="text-[9px] font-bold text-zinc-900 dark:text-zinc-100">Slide Title</p>
            <div className="space-y-0.5">
              <div className="h-[3px] w-full bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[3px] w-[85%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            </div>
            <div className="h-px bg-zinc-300 dark:bg-zinc-700" />
            <div className="space-y-0.5">
              <div className="h-[3px] w-full bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[3px] w-[78%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            </div>
          </div>
        </MiniSlide>
      );

    /* ── BULLETS ── */
    case "sk-bullets-numbered-grid":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-1">
            <p className="text-[8px] font-bold text-zinc-900 dark:text-zinc-100">Slide Title</p>
            <div className="grid grid-cols-2 gap-1 flex-1">
              {["01", "02", "03", "04"].map((n) => (
                <div
                  key={n}
                  className="rounded border border-zinc-200 dark:border-zinc-700 p-1 flex flex-col justify-between"
                >
                  <p className="text-[7px] font-bold" style={{ color: BRAND }}>{n}</p>
                  <div className="h-[2.5px] w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-bullets-icon-list":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-1">
            <p className="text-[8px] font-bold text-zinc-900 dark:text-zinc-100">Slide Title</p>
            <div className="mt-1 space-y-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full shrink-0" style={{ background: BRAND }} />
                  <div
                    className="h-[3px] bg-zinc-200 dark:bg-zinc-700 rounded-sm"
                    style={{ width: `${85 - i * 10}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-bullets-card-grid":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-1">
            <p className="text-[8px] font-bold text-zinc-900 dark:text-zinc-100">Slide Title</p>
            <div className="grid grid-cols-3 gap-1 flex-1">
              {["A", "B", "C"].map((l) => (
                <div
                  key={l}
                  className="rounded bg-zinc-100 dark:bg-zinc-800 p-1 flex flex-col gap-0.5"
                >
                  <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100">{l}</p>
                  <div className="h-[2px] w-full bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
                  <div className="h-[2px] w-[70%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-bullets-checklist-bold":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-1">
            <p className="text-[8px] font-bold text-zinc-900 dark:text-zinc-100">Slide Title</p>
            <div className="mt-1 space-y-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <p className="text-[7px] font-bold leading-none" style={{ color: BRAND }}>✓</p>
                  <p className="text-[6px] font-semibold text-zinc-900 dark:text-zinc-100 leading-none">Bold</p>
                  <div className="h-[2px] flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </MiniSlide>
      );

    /* ── COMPARE ── */
    case "sk-compare-before-after":
      return (
        <MiniSlide>
          <div className="absolute inset-0 grid grid-cols-2 gap-1 p-2">
            <div className="rounded bg-zinc-100 dark:bg-zinc-800 p-1.5 flex flex-col gap-0.5">
              <p className="text-[5px] tracking-[0.2em] uppercase text-zinc-500">BEFORE</p>
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[2px] w-[80%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
              ))}
            </div>
            <div className="rounded p-1.5 flex flex-col gap-0.5" style={{ background: `${BRAND}22` }}>
              <p className="text-[5px] tracking-[0.2em] uppercase font-bold" style={{ color: BRAND }}>AFTER</p>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[2px] w-[80%] rounded-sm"
                  style={{ background: `${BRAND}99` }}
                />
              ))}
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-compare-vs-headed":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-2 flex flex-col">
            <p className="text-center text-[14px] font-bold leading-none" style={{ color: BRAND }}>VS</p>
            <div className="grid grid-cols-2 gap-2 flex-1 mt-1">
              {["Option A", "Option B"].map((l) => (
                <div key={l} className="flex flex-col gap-0.5">
                  <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100">{l}</p>
                  <div className="h-[2px] w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                  <div className="h-[2px] w-[70%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-7 bottom-2 left-1/2 w-px bg-zinc-300 dark:bg-zinc-700" />
        </MiniSlide>
      );

    case "sk-compare-problem-solution":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-2 flex items-center gap-1">
            <div className="flex-1 rounded bg-zinc-900 dark:bg-black p-1.5 flex flex-col gap-0.5">
              <p className="text-[5px] tracking-[0.2em] uppercase text-zinc-400">PROBLEM</p>
              <div className="h-[2px] w-[80%] bg-zinc-500 rounded-sm" />
              <div className="h-[2px] w-[60%] bg-zinc-500 rounded-sm" />
            </div>
            <p className="text-[10px]" style={{ color: BRAND }}>→</p>
            <div
              className="flex-1 rounded bg-zinc-50 dark:bg-zinc-900 ring-1 p-1.5 flex flex-col gap-0.5"
              style={{ borderColor: BRAND }}
            >
              <p className="text-[5px] tracking-[0.2em] uppercase font-bold" style={{ color: BRAND }}>SOLUTION</p>
              <div className="h-[2px] w-[80%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[2px] w-[60%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
            </div>
          </div>
        </MiniSlide>
      );

    /* ── STAT ── */
    case "sk-stat-mono-jumbo":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col items-center justify-center gap-0.5">
            <p className="text-[5px] tracking-[0.2em] uppercase text-zinc-400">EYEBROW</p>
            <p className="text-[32px] font-bold leading-none" style={{ color: BRAND }}>172%</p>
            <p className="text-[5px] text-zinc-500">growth caption</p>
          </div>
        </MiniSlide>
      );

    case "sk-stat-trio":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex items-center divide-x divide-zinc-200 dark:divide-zinc-700">
            {[["87%", "users"], ["$4.2B", "market"], ["3.4×", "growth"]].map(([n, l]) => (
              <div key={l} className="flex-1 flex flex-col items-center gap-0.5">
                <p className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">{n}</p>
                <p className="text-[4px] text-zinc-500 uppercase tracking-wider">{l}</p>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    case "sk-stat-with-context":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex items-center gap-3">
            <p className="text-[24px] font-bold leading-none" style={{ color: BRAND }}>87%</p>
            <div className="flex-1 space-y-0.5">
              <div className="h-[3px] w-full bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[3px] w-[90%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[3px] w-[60%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            </div>
          </div>
        </MiniSlide>
      );

    /* ── QUOTE ── */
    case "sk-quote-pull-full":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col justify-center gap-1">
            <p className="text-[18px] leading-none font-serif" style={{ color: BRAND }}>&ldquo;</p>
            <p className="text-[8px] font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
              The single most important thing.
            </p>
            <p className="text-[5px] text-zinc-500 mt-1">— Name, Role</p>
          </div>
        </MiniSlide>
      );

    case "sk-quote-portrait-left":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600 shrink-0" />
            <div className="flex-1 flex flex-col gap-0.5">
              <p className="text-[7px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
                &ldquo;Quote that carries weight.&rdquo;
              </p>
              <p className="text-[5px] text-zinc-500">— Name, Role</p>
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-quote-multi-stack":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col justify-center divide-y divide-zinc-200 dark:divide-zinc-700">
            {["A", "B", "C"].map((a) => (
              <div key={a} className="py-1 flex flex-col gap-0.5">
                <p className="text-[6px] text-zinc-900 dark:text-zinc-100 font-semibold leading-none">&ldquo;Quote {a}&rdquo;</p>
                <p className="text-[4px] text-zinc-500">— Person {a}</p>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    /* ── TIMELINE ── */
    case "sk-timeline-horizontal-dots":
      return (
        <MiniSlide>
          <div className="absolute inset-0 px-3 flex flex-col justify-center gap-1.5">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-1 right-1 h-px bg-zinc-300 dark:bg-zinc-700 top-1/2" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
              ))}
            </div>
            <div className="flex justify-between text-[4px] text-zinc-500">
              <span>2020</span><span>2022</span><span>2024</span><span>2026</span>
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-timeline-stepped-vertical":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-0.5">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex gap-1.5">
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
                  {i < 2 && <div className="w-px flex-1 bg-zinc-300 dark:bg-zinc-700" />}
                </div>
                <div className="flex-1 pb-1">
                  <p className="text-[6px] font-semibold text-zinc-900 dark:text-zinc-100 leading-none">Step {s}</p>
                  <div className="h-[2px] w-[70%] mt-0.5 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    case "sk-timeline-highlight-current":
      return (
        <MiniSlide>
          <div className="absolute inset-0 px-3 flex flex-col justify-center gap-1.5">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-1 right-1 h-px bg-zinc-300 dark:bg-zinc-700 top-1/2" />
              {[0, 1, 2, 3].map((i) =>
                i === 2 ? (
                  <div
                    key={i}
                    className="relative w-3 h-3 rounded-full"
                    style={{ background: BRAND, boxShadow: `0 0 0 3px ${BRAND}22` }}
                  />
                ) : (
                  <div key={i} className="relative w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                ),
              )}
            </div>
            <div className="flex justify-center">
              <p className="text-[5px] font-bold tracking-[0.2em]" style={{ color: BRAND }}>NOW</p>
            </div>
          </div>
        </MiniSlide>
      );

    /* ── IMAGE ── */
    case "sk-image-full-overlay":
      return (
        <MiniSlide>
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-400 via-zinc-600 to-zinc-800 dark:from-zinc-700 dark:to-zinc-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute left-3 bottom-2 text-[8px] font-bold text-white leading-tight">
            Headline over image
          </p>
        </MiniSlide>
      );

    case "sk-image-caption-side":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex">
            <div className="w-[70%] bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800" />
            <div className="w-[30%] p-2 flex flex-col gap-0.5 justify-center">
              <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100">Caption</p>
              <div className="h-[2px] w-full bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[2px] w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-image-gallery-3":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-2 flex flex-col gap-1">
            <div className="flex-1 grid grid-cols-3 gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800"
                />
              ))}
            </div>
            <p className="text-[5px] text-center text-zinc-500">shared caption</p>
          </div>
        </MiniSlide>
      );

    /* ── CLOSING ── */
    case "sk-closing-cta-bold":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-1">
            <p className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">Thank You</p>
            <p className="text-[5px] text-zinc-500">Let&rsquo;s build it.</p>
            <div
              className="mt-1 px-2 py-0.5 rounded-full text-white text-[5px] font-bold"
              style={{ background: BRAND }}
            >
              Start now →
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-closing-contact":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col justify-center gap-0.5">
            <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">Thanks.</p>
            <p className="text-[5px] text-zinc-500 mt-1">hi@team.com</p>
            <p className="text-[5px] text-zinc-500">team.com</p>
            <p className="text-[5px] text-zinc-500">@team</p>
          </div>
        </MiniSlide>
      );

    case "sk-closing-quote-end":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center gap-0.5">
            <p className="text-[8px] italic font-semibold text-zinc-900 dark:text-zinc-100">
              &ldquo;Final thought.&rdquo;
            </p>
            <p className="text-[5px] text-zinc-500 mt-1">— Author</p>
          </div>
        </MiniSlide>
      );

    /* ── HYBRID ── */
    case "sk-hero-stat-strip":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col justify-between">
            <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              Headline that anchors
            </p>
            <div>
              <div className="h-px bg-zinc-200 dark:bg-zinc-700 mb-1" />
              <div className="flex justify-around">
                {[["87%", "users"], ["4.2B", "mkt"], ["3.4×", "grow"]].map(([n, l]) => (
                  <div key={l} className="flex flex-col items-center">
                    <p className="text-[8px] font-bold leading-none" style={{ color: BRAND }}>{n}</p>
                    <p className="text-[4px] text-zinc-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-dark-insight-panel":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex p-2 gap-1">
            <div className="flex-[3] p-1 flex flex-col gap-0.5">
              <p className="text-[6px] font-semibold text-zinc-900 dark:text-zinc-100">Context</p>
              <div className="h-[2px] w-full bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[2px] w-[85%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[2px] w-[70%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            </div>
            <div className="flex-[2] rounded bg-zinc-900 dark:bg-black p-1.5 flex flex-col gap-0.5">
              <p className="text-[5px] tracking-[0.2em] uppercase font-bold" style={{ color: BRAND }}>INSIGHT</p>
              <div className="h-[2px] w-[80%] bg-zinc-500 rounded-sm" />
              <div className="h-[2px] w-[60%] bg-zinc-500 rounded-sm" />
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-logo-grid":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-1">
            <p className="text-[5px] tracking-[0.2em] uppercase text-zinc-500">Trusted by</p>
            <div className="grid grid-cols-5 grid-rows-2 gap-1 flex-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
                >
                  <div className="w-3 h-1 rounded-sm bg-zinc-400 dark:bg-zinc-600" />
                </div>
              ))}
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-three-col-feature":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 grid grid-cols-3 gap-2 items-start content-center">
            {["A", "B", "C"].map((l) => (
              <div key={l} className="flex flex-col gap-0.5">
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: BRAND }} />
                <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">Feature {l}</p>
                <div className="h-[2px] w-full bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                <div className="h-[2px] w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    case "sk-zigzag-narrative":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-2 flex flex-col gap-1">
            <p className="text-[7px] font-bold text-zinc-900 dark:text-zinc-100">Title</p>
            <div className="flex gap-1 flex-1">
              <div className="flex-1 space-y-0.5 self-start">
                <div className="h-[2px] w-full bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                <div className="h-[2px] w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              </div>
              <div className="flex-1" />
            </div>
            <div className="flex gap-1 flex-1">
              <div className="flex-1" />
              <div className="flex-1 space-y-0.5 self-end">
                <div className="h-[2px] w-full bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                <div className="h-[2px] w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              </div>
            </div>
          </div>
        </MiniSlide>
      );

    default:
      return <FallbackPreview name={name} />;
  }
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Accent previews — 베이스 슬라이드 위에 디바이스가 어디 박히는지     */
/* ──────────────────────────────────────────────────────────────────── */

function BaseSlide({ children }: { children: ReactNode }) {
  return (
    <MiniSlide>
      <div className="absolute inset-2 flex flex-col gap-1 opacity-40 pointer-events-none">
        <div className="h-[6px] w-[40%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
        <div className="h-[2px] w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
        <div className="h-[2px] w-[70%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
        <div className="h-[2px] w-[60%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
      </div>
      {children}
    </MiniSlide>
  );
}

export function AccentPreview({ id, name }: { id: string; name: string }) {
  switch (id) {
    case "ac-dark-insight-box":
      return (
        <BaseSlide>
          <div className="absolute right-2 bottom-2 w-[48%] rounded bg-zinc-900 dark:bg-black p-1.5 flex flex-col gap-0.5">
            <p className="text-[4px] uppercase tracking-[0.2em] font-bold" style={{ color: BRAND }}>INSIGHT</p>
            <p className="text-[5px] text-white leading-tight">a short high-density insight.</p>
          </div>
        </BaseSlide>
      );

    case "ac-brand-product-card-32":
      return (
        <MiniSlide>
          <div
            className="absolute inset-3 rounded-xl p-2 overflow-hidden"
            style={{ background: BRAND }}
          >
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/30 blur-md" />
            <div className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-white/20 blur-md" />
            <p className="relative text-[8px] font-bold text-white leading-tight">Headline</p>
            <p className="relative text-[5px] text-white/80 mt-0.5">subhead</p>
          </div>
        </MiniSlide>
      );

    case "ac-hairline-divider":
      return (
        <MiniSlide>
          <div className="absolute inset-2 flex flex-col gap-1">
            <div className="space-y-0.5 opacity-60">
              <div className="h-[2px] w-full bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[2px] w-[80%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
            </div>
            <div className="h-px w-full bg-zinc-400 dark:bg-zinc-500 my-1" />
            <div className="space-y-0.5 opacity-60">
              <div className="h-[2px] w-full bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[2px] w-[70%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
            </div>
          </div>
        </MiniSlide>
      );

    case "ac-vertical-rule":
      return (
        <MiniSlide>
          <div className="absolute inset-2 flex gap-2 items-stretch">
            <div className="flex-1 space-y-0.5 opacity-60">
              <div className="h-[2px] w-[80%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[2px] w-[70%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
            </div>
            <div className="w-px bg-zinc-400 dark:bg-zinc-500" />
            <div className="flex-1 space-y-0.5 opacity-60">
              <div className="h-[2px] w-[80%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
              <div className="h-[2px] w-[70%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
            </div>
          </div>
        </MiniSlide>
      );

    case "ac-eyebrow-caption":
      return (
        <BaseSlide>
          <p
            className="absolute top-2 left-2 text-[4px] tracking-[0.3em] uppercase font-bold"
            style={{ color: BRAND }}
          >
            PART · TWO
          </p>
        </BaseSlide>
      );

    case "ac-pill-tab":
      return (
        <BaseSlide>
          <span
            className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-white text-[4px] font-bold tracking-wider"
            style={{ background: BRAND }}
          >
            NEW
          </span>
        </BaseSlide>
      );

    case "ac-coral-strip":
      return (
        <BaseSlide>
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: BRAND }} />
        </BaseSlide>
      );

    case "ac-atmospheric-blur-corner":
      return (
        <MiniSlide>
          <div
            className="absolute inset-3 rounded-xl overflow-hidden"
            style={{ background: BRAND }}
          >
            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white/40 blur-md" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white/30 blur-md" />
          </div>
        </MiniSlide>
      );

    case "ac-large-quote-mark":
      return (
        <MiniSlide>
          <p className="absolute top-0 left-2 text-[40px] leading-none text-zinc-200 dark:text-zinc-800 font-serif">&ldquo;</p>
          <div className="absolute inset-0 flex flex-col justify-center pl-5 pr-3">
            <p className="text-[7px] font-semibold text-zinc-900 dark:text-zinc-100">quote sits over the mark</p>
            <p className="text-[4px] text-zinc-500 mt-0.5">— Author</p>
          </div>
        </MiniSlide>
      );

    case "ac-stat-stack-vertical":
      return (
        <MiniSlide>
          <div className="absolute inset-2 right-[36%] space-y-1 opacity-40">
            <div className="h-[6px] w-[60%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
            <div className="h-[2px] w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            <div className="h-[2px] w-[70%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
          </div>
          <div className="absolute right-2 top-2 bottom-2 w-[30%] flex flex-col justify-around divide-y divide-zinc-200 dark:divide-zinc-700">
            {[["87%", "users"], ["4.2B", "mkt"], ["3.4×", "grow"]].map(([n, l]) => (
              <div key={l} className="py-0.5">
                <p className="text-[8px] font-bold leading-none" style={{ color: BRAND }}>{n}</p>
                <p className="text-[4px] text-zinc-500">{l}</p>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    case "ac-icon-grid-9":
      return (
        <MiniSlide>
          <div className="absolute inset-3 grid grid-cols-3 gap-1.5 place-items-center">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={clsx("w-1.5 h-1.5", i % 2 === 0 ? "rounded-full" : "rotate-45")}
                style={{ background: i % 2 === 0 ? BRAND : "var(--tw-prose-body, #9ca3af)" }}
              />
            ))}
          </div>
        </MiniSlide>
      );

    case "ac-page-number-corner":
      return (
        <BaseSlide>
          <p className="absolute right-2 bottom-1 text-[5px] font-mono text-zinc-500">01</p>
        </BaseSlide>
      );

    case "ac-logo-bottom-left":
      return (
        <BaseSlide>
          <div className="absolute left-2 bottom-1 flex items-center gap-0.5">
            <div className="w-1.5 h-1.5 rounded-sm" style={{ background: BRAND }} />
            <p className="text-[4px] font-bold text-zinc-700 dark:text-zinc-300">brand</p>
          </div>
        </BaseSlide>
      );

    case "ac-arrow-callout":
      return (
        <MiniSlide>
          <div className="absolute inset-2 flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
            <div className="h-px w-6 bg-zinc-500" />
            <p className="text-[5px] text-zinc-700 dark:text-zinc-300">callout note</p>
          </div>
        </MiniSlide>
      );

    case "ac-highlight-circle":
      return (
        <MiniSlide>
          <div className="absolute inset-2 flex items-center justify-center gap-1">
            <p className="text-[6px] text-zinc-500">value</p>
            <div className="relative">
              <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">87%</p>
              <div
                className="absolute -inset-1 rounded-full border-2"
                style={{ borderColor: BRAND, transform: "rotate(-8deg)" }}
              />
            </div>
          </div>
        </MiniSlide>
      );

    case "ac-numbered-bullet-big":
      return (
        <MiniSlide>
          <div className="absolute inset-3 flex items-center justify-around">
            {["01", "02", "03"].map((n) => (
              <p key={n} className="text-[16px] font-bold leading-none" style={{ color: BRAND }}>
                {n}
              </p>
            ))}
          </div>
        </MiniSlide>
      );

    case "ac-progress-dot-row":
      return (
        <BaseSlide>
          <div className="absolute right-2 top-2 flex items-center gap-0.5">
            {[true, true, true, false, false].map((on, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{ background: on ? BRAND : "#d4d4d8" }}
              />
            ))}
          </div>
        </BaseSlide>
      );

    case "ac-stat-arrow-delta":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex items-center justify-center gap-1.5">
            <p className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">$4.2B</p>
            <p className="text-[7px] font-bold text-emerald-500">↑ +12%</p>
          </div>
        </MiniSlide>
      );

    case "ac-keyword-underline":
      return (
        <MiniSlide>
          <div className="absolute inset-2 flex items-center justify-center">
            <p className="text-[7px] text-zinc-900 dark:text-zinc-100">
              this is the{" "}
              <span
                className="font-bold"
                style={{
                  borderBottom: `2px solid ${BRAND}`,
                  paddingBottom: "0px",
                }}
              >
                key
              </span>{" "}
              point
            </p>
          </div>
        </MiniSlide>
      );

    case "ac-bracket-wrap":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex items-center justify-center px-3 gap-1.5">
            <p className="text-[24px] text-zinc-300 dark:text-zinc-700 leading-none">[</p>
            <p className="text-[8px] font-semibold text-zinc-900 dark:text-zinc-100 text-center">Main statement</p>
            <p className="text-[24px] text-zinc-300 dark:text-zinc-700 leading-none">]</p>
          </div>
        </MiniSlide>
      );

    case "ac-dot-pattern-bg":
      return (
        <MiniSlide>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(120,120,120,0.4) 0.5px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />
          <div className="absolute inset-3 flex items-center justify-center">
            <p className="text-[6px] text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 px-1 rounded">
              content over pattern
            </p>
          </div>
        </MiniSlide>
      );

    case "ac-diagonal-line-bg":
      return (
        <MiniSlide>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, rgba(120,120,120,0.15) 0 2px, transparent 2px 8px)",
            }}
          />
          <div className="absolute inset-3 flex items-center justify-center">
            <p className="text-[6px] text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 px-1 rounded">
              content over diagonals
            </p>
          </div>
        </MiniSlide>
      );

    case "ac-quote-mark-coral":
      return (
        <MiniSlide>
          <div className="absolute inset-2 flex flex-col items-start justify-center">
            <p className="text-[28px] leading-none font-serif" style={{ color: BRAND }}>&ldquo;</p>
            <p className="text-[6px] text-zinc-900 dark:text-zinc-100 -mt-1 pl-1">short quote</p>
          </div>
        </MiniSlide>
      );

    case "ac-vertical-progress-line":
      return (
        <BaseSlide>
          <div className="absolute left-1.5 top-2 bottom-2 w-px bg-zinc-300 dark:bg-zinc-700">
            <div className="absolute left-[-2px] top-1/3 w-1.5 h-1.5" style={{ background: BRAND }} />
          </div>
        </BaseSlide>
      );

    case "ac-section-roman":
      return (
        <BaseSlide>
          <p className="absolute top-2 right-2 text-[12px] font-serif font-bold text-zinc-400 dark:text-zinc-600">
            III.
          </p>
        </BaseSlide>
      );

    case "ac-color-block-stack":
      return (
        <MiniSlide>
          <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col">
            <div className="flex-1" style={{ background: BRAND }} />
            <div className="flex-1" style={{ background: `${BRAND}99` }} />
            <div className="flex-1 bg-zinc-900 dark:bg-zinc-100" />
            <div className="flex-1" style={{ background: `${BRAND}55` }} />
          </div>
          <div className="absolute inset-2 left-5 space-y-1 opacity-50">
            <div className="h-[6px] w-[40%] bg-zinc-300 dark:bg-zinc-700 rounded-sm" />
            <div className="h-[2px] w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            <div className="h-[2px] w-[70%] bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
          </div>
        </MiniSlide>
      );

    case "ac-tagline-bottom":
      return (
        <BaseSlide>
          <div className="absolute left-2 right-2 bottom-1 flex flex-col gap-0.5">
            <div className="h-px bg-zinc-300 dark:bg-zinc-700" />
            <p className="text-[4px] text-zinc-500 italic">Build the future.</p>
          </div>
        </BaseSlide>
      );

    case "ac-stat-with-icon":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <div className="w-3 h-3 rotate-45" style={{ background: BRAND }} />
            <div>
              <p className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">87%</p>
              <p className="text-[4px] text-zinc-500 mt-0.5">users</p>
            </div>
          </div>
        </MiniSlide>
      );

    case "ac-color-swatch-row":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {[BRAND, `${BRAND}99`, "#0a0a0a", "#757575", "#e5e5e5"].map((c) => (
              <div key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
            ))}
          </div>
        </MiniSlide>
      );

    case "ac-callout-tag-corner":
      return (
        <BaseSlide>
          <div
            className="absolute top-0 right-0 px-1.5 py-0.5 text-white text-[4px] font-bold tracking-widest"
            style={{
              background: BRAND,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 12% 100%)",
            }}
          >
            NEW
          </div>
        </BaseSlide>
      );

    case "ac-step-progress-3":
      return (
        <BaseSlide>
          <div className="absolute top-2 left-2 right-2 flex items-center gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
            <div className="flex-1 h-[1.5px]" style={{ background: BRAND }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
            <div className="flex-1 h-[1.5px] bg-zinc-300 dark:bg-zinc-700" />
            <div className="w-1.5 h-1.5 rounded-full border border-zinc-400 dark:border-zinc-600" />
          </div>
        </BaseSlide>
      );

    case "ac-icon-row-features":
      return (
        <MiniSlide>
          <div className="absolute inset-2 flex items-center justify-around">
            {["A", "B", "C", "D", "E"].map((l) => (
              <div key={l} className="flex flex-col items-center gap-0.5">
                <div className="w-2 h-2 rotate-45 bg-zinc-500 dark:bg-zinc-400" />
                <p className="text-[4px] text-zinc-500">{l}</p>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    case "ac-image-mask-circle":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 dark:from-zinc-600 dark:to-zinc-700" />
            <p className="text-[5px] font-semibold text-zinc-900 dark:text-zinc-100">Person Name</p>
            <p className="text-[4px] text-zinc-500">Role</p>
          </div>
        </MiniSlide>
      );

    case "ac-thick-underline-title":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">Title</p>
            <div className="h-[3px] w-8 rounded-sm" style={{ background: BRAND }} />
          </div>
        </MiniSlide>
      );

    case "ac-numbered-checklist-card":
      return (
        <MiniSlide>
          <div className="absolute inset-2 flex flex-col gap-0.5 justify-center">
            {[["01", "✓"], ["02", "✓"], ["03", "─"]].map(([n, c]) => (
              <div
                key={n}
                className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 flex items-center justify-between"
              >
                <p className="text-[5px] font-bold text-zinc-900 dark:text-zinc-100">{n}</p>
                <p
                  className="text-[6px] font-bold"
                  style={{ color: c === "✓" ? BRAND : "#a1a1aa" }}
                >
                  {c}
                </p>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    default:
      return <FallbackPreview name={name} />;
  }
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Chart placeholder 치환 — {{KEY}} 토큰을 대표 sample 값으로 교체    */
/* ──────────────────────────────────────────────────────────────────── */

const CHART_SAMPLES: Record<string, string> = {
  // ── ranked horizontal bar
  LABEL_1: "Company A", LABEL_2: "Company B", LABEL_3: "Company C",
  VALUE_1: "87%", VALUE_2: "65%", VALUE_3: "42%", VALUE_4: "30%", VALUE_5: "18%",
  WIDTH_1: "700", WIDTH_2: "520", WIDTH_3: "335", WIDTH_4: "240", WIDTH_5: "145",
  WIDTH_1_END: "910", MAX_VALUE: "100",

  // ── grouped / stacked bar
  GROUP_LABEL_1: "Q1", GROUP_LABEL_2: "Q2", GROUP_LABEL_3: "Q3", GROUP_LABEL_4: "Q4",
  SERIES_LABEL_1: "2024", SERIES_LABEL_2: "2025",
  Y_S1_G1: "200", H_S1_G1: "240", Y_S2_G1: "260", H_S2_G1: "180",
  CATEGORY_1: "Channel A", CATEGORY_2: "Channel B", CATEGORY_3: "Channel C",
  SEG_W_1A: "300", SEG_X_1B: "420", SEG_W_1B: "200", SEG_X_1C: "620", SEG_W_1C: "180",

  // ── bullet chart
  METRIC_LABEL_1: "Revenue", METRIC_LABEL_2: "Users",
  ACTUAL_W_1: "560", TARGET_X_1: "720", TARGET_1: "70", ACTUAL_1: "56",

  // ── line / area
  POINTS: "40,300 200,250 360,180 520,200 680,140 840,100 1000,80 1140,60",
  LINE_POINTS: "40,300 200,250 360,180 520,200 680,140 840,100 1000,80 1140,60",
  AREA_PATH: "M40,300 L200,250 L360,180 L520,200 L680,140 L840,100 L1000,80 L1140,60 L1140,400 L40,400 Z",
  SERIES_1_POINTS: "40,300 200,250 360,180 520,200 680,140 840,100 1000,80 1140,60",
  SERIES_2_POINTS: "40,200 200,180 360,210 520,250 680,260 840,240 1000,220 1140,200",
  SERIES_3_POINTS: "40,350 200,330 360,310 520,290 680,280 840,260 1000,250 1140,240",
  X_LABELS: "", MAX_Y: "100", X_LABEL: "time", Y_LABEL: "value",

  // ── sparkline kpi tile
  KPI_LABEL_1: "Adoption", KPI_VALUE_1: "87%",
  KPI_LABEL_2: "Retention", KPI_VALUE_2: "92%",
  SPARKLINE_1: "24,170 80,150 130,120 180,140 230,100 280,80 330,60",

  // ── waterfall
  BAR_LABEL_1: "Start", BAR_LABEL_2: "+New", BAR_LABEL_3: "-Churn", BAR_LABEL_4: "End",
  BAR_VALUE_1: "100", BAR_VALUE_2: "+30", BAR_VALUE_3: "-12", BAR_VALUE_4: "118",
  BAR_SIGN_1: "+", BAR_SIGN_2: "+", BAR_SIGN_3: "-", BAR_SIGN_4: "+",
  Y_1: "100", H_1: "280", Y_2: "80", H_2: "240",

  // ── donut single
  PERCENT: "87", LABEL: "market share", DASHARRAY: "765 113",

  // ── donut multi (circumference ≈ 880 for r=140)
  SEG_1_PERCENT: "40", SEG_2_PERCENT: "30", SEG_3_PERCENT: "20", SEG_4_PERCENT: "10", SEG_5_PERCENT: "0",
  SEG_1_LABEL: "A", SEG_2_LABEL: "B", SEG_3_LABEL: "C", SEG_4_LABEL: "D", SEG_5_LABEL: "E",
  SEG_1_DASH: "352 528", SEG_2_DASH: "264 616", SEG_3_DASH: "176 704", SEG_4_DASH: "88 792", SEG_5_DASH: "0 880",
  SEG_2_OFFSET: "-352", SEG_3_OFFSET: "-616", SEG_4_OFFSET: "-792", SEG_5_OFFSET: "-880",

  // ── treemap
  TILE_X_1: "0", TILE_Y_1: "0", TILE_W_1: "640", TILE_H_1: "300",
  TILE_X_2: "640", TILE_Y_2: "0", TILE_W_2: "512", TILE_H_2: "200",
  TILE_X_3: "640", TILE_Y_3: "200", TILE_W_3: "512", TILE_H_3: "280",
  TILE_LABEL_1: "Segment A", TILE_LABEL_2: "B", TILE_LABEL_3: "C",
  TILE_LX_1: "30", TILE_LY_1: "50", TILE_LX_2: "670", TILE_LY_2: "40", TILE_LX_3: "670", TILE_LY_3: "240",
  TILE_VALUE_1: "62%", TILE_VALUE_2: "23%", TILE_VALUE_3: "15%",

  // ── scatter / bubble  (X_1/Y_1 reused from waterfall — also work as point coords)
  X_3: "700", Y_3: "180",
  BUBBLE_1_X: "300", BUBBLE_1_Y: "300", BUBBLE_1_R: "50", BUBBLE_1_LABEL: "A",
  BUBBLE_2_X: "600", BUBBLE_2_Y: "200", BUBBLE_2_R: "70", BUBBLE_2_LABEL: "B",
  BUBBLE_3_X: "900", BUBBLE_3_Y: "260", BUBBLE_3_R: "40", BUBBLE_3_LABEL: "C",

  // ── venn
  LABEL_A: "Set A", LABEL_B: "Set B", OVERLAP_LABEL: "A∩B",

  // ── funnel
  STAGE_1_LABEL: "Visitors", STAGE_1_VALUE: "10K",
  STAGE_2_LABEL: "Leads", STAGE_2_VALUE: "3.2K",
  STAGE_3_LABEL: "Trials", STAGE_3_VALUE: "780",
  STAGE_4_LABEL: "Paid", STAGE_4_VALUE: "220",

  // ── flow
  NODE_1_LABEL: "Step 1", NODE_2_LABEL: "Step 2", NODE_3_LABEL: "Step 3", NODE_4_LABEL: "Step 4",

  // ── sankey
  SRC_1_LABEL: "Web", SRC_2_LABEL: "App", TGT_1_LABEL: "Paid", TGT_2_LABEL: "Trial",
  FLOW_1: "60", FLOW_2: "40",

  // ── matrix
  X_AXIS: "Market share", Y_AXIS: "Growth",
  Q1_LABEL: "Stars", Q2_LABEL: "?", Q3_LABEL: "Dogs", Q4_LABEL: "Cash cows",
  ITEMS: "",

  // ── swot
  S_ITEMS: "", W_ITEMS: "", O_ITEMS: "", T_ITEMS: "",

  // ── pyramid
  TIER_TOP: "Vision", TIER_MID: "Strategy", TIER_BOTTOM: "Execution",

  // ── value chain
  ACTIVITY_1: "Inbound", ACTIVITY_2: "Operations", ACTIVITY_3: "Outbound",
  ACTIVITY_4: "Sales", ACTIVITY_5: "Service",

  // ── org / hub / mindmap
  ROOT_LABEL: "CEO", MID_1_LABEL: "Eng", MID_2_LABEL: "Design", MID_3_LABEL: "Ops",
  LEAF_1_LABEL: "Web", LEAF_2_LABEL: "Mobile",
  HUB_LABEL: "Core", SPOKE_1_LABEL: "A", SPOKE_2_LABEL: "B", SPOKE_3_LABEL: "C", SPOKE_4_LABEL: "D",
  CENTER: "Idea", BRANCH_1: "Branch", BRANCH_2: "Branch",

  // ── timeline events
  DATE_1: "2020", DATE_2: "2022", DATE_3: "2024",
  EVENT_1: "Founded", EVENT_2: "Series A", EVENT_3: "IPO",

  // ── gantt
  TASK_1_LABEL: "Discovery", TASK_1_X: "160", TASK_1_W: "240",
  TASK_2_LABEL: "Design", TASK_2_X: "300", TASK_2_W: "320",
  TASK_3_LABEL: "Build", TASK_3_X: "500", TASK_3_W: "440",

  // ── roadmap
  Q_1_LABEL: "Q1", Q_2_LABEL: "Q2", Q_3_LABEL: "Q3", Q_4_LABEL: "Q4",
  INIT_1: "Launch", INIT_2: "Scale", INIT_3: "Optimize",

  // ── kanban
  COL_1_TITLE: "TODO", COL_2_TITLE: "DOING", COL_3_TITLE: "DONE",
  CARD_1: "Build form", CARD_2: "Wire API", CARD_3: "Ship beta",

  // ── compare / pricing
  COL_A: "Free", COL_B: "Pro", COL_C: "Team",
  FEATURE_1: "Seats", FEATURE_2: "Storage", FEATURE_3: "Support",
  VAL_A_1: "3", VAL_A_2: "1GB", VAL_A_3: "✗", VAL_B_1: "10", VAL_B_2: "20GB", VAL_B_3: "✓",
  VAL_C_1: "∞", VAL_C_2: "1TB", VAL_C_3: "✓",
  PLAN_1_NAME: "Free", PLAN_1_PRICE: "$0",
  PLAN_2_NAME: "Pro", PLAN_2_PRICE: "$19",
  PLAN_3_NAME: "Team", PLAN_3_PRICE: "$99",

  // ── heatmap
  ROW_LABEL_1: "1", ROW_LABEL_2: "2", ROW_LABEL_3: "3",
  COL_LABEL_1: "M", COL_LABEL_2: "T", COL_LABEL_3: "W",
  CELL_1: "0.3",

  // ── progress
  METRIC_1: "Onboarding", METRIC_2: "Activation", METRIC_3: "Retention",
  PERCENT_1: "87", PERCENT_2: "62", PERCENT_3: "94",
  BAR_W_1: "696", BAR_W_2: "496", BAR_W_3: "752",
  DASH_1: "437 503", DASH_2: "311 629", DASH_3: "478 462",

  // ── radar
  AXIS_1_LABEL: "Speed", AXIS_2_LABEL: "Power", AXIS_3_LABEL: "Range",
  AXIS_4_LABEL: "Cost", AXIS_5_LABEL: "Ease",
  POINTS_1: "300,120 460,210 400,430 200,430 140,210",
};

export function substituteChartPlaceholders(svg: string): string {
  return svg.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => CHART_SAMPLES[key] ?? "—");
}
