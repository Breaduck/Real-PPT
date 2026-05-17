"use client";

import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

/**
 * 패턴 카탈로그용 미니 슬라이드 프리뷰.
 *
 * 의도적으로 brand color / 산업 콘텐츠를 쓰지 않는다:
 *  - 카탈로그는 특정 deck이 아니라 패턴 자체를 보여주는 곳
 *  - 색은 zinc 중성. 강조는 크기·굵기·서피스 대비로 처리
 *  - 콘텐츠는 "어떤 발표든 들어갈 수 있을" 일반 톤
 *
 * CSS var `--accent` 가 light/dark 자동 전환:
 *  - light: zinc-900,  dark: zinc-100
 */

const TEXT_STYLE = { wordBreak: "keep-all" as const };

// MiniSlide 컨테이너에서 자동 세팅됨 — 자식은 var() 만 참조
const ACCENT = "var(--accent)";
const ACCENT_SOFT_BG = "var(--accent-soft)";
const ACCENT_INV = "var(--accent-inv)"; // accent 면 위 텍스트 색

function MiniSlide({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  const style: CSSProperties = {
    aspectRatio: "16 / 9",
    ...TEXT_STYLE,
    // Tailwind dark 모드 클래스가 못 닿는 css var 라 직접 두 변수 지정.
    // dark 슬라이드(검정 배경)는 accent도 라이트로.
    ["--accent" as never]: dark ? "#fafafa" : "#18181b",
    ["--accent-inv" as never]: dark ? "#18181b" : "#ffffff",
    ["--accent-soft" as never]: dark ? "rgba(255,255,255,0.10)" : "rgba(24,24,27,0.06)",
  };
  return (
    <div
      className={clsx(
        "rounded-md ring-1 overflow-hidden relative",
        dark
          ? "bg-zinc-950 ring-zinc-800"
          : "bg-white dark:bg-zinc-900 ring-zinc-200 dark:ring-zinc-700 [--accent:#18181b] dark:[--accent:#fafafa] [--accent-inv:#ffffff] dark:[--accent-inv:#18181b] [--accent-soft:rgba(24,24,27,0.06)] dark:[--accent-soft:rgba(255,255,255,0.08)]",
      )}
      style={style}
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
/*  Skeleton previews                                                   */
/* ──────────────────────────────────────────────────────────────────── */

export function SkeletonPreview({ id, name }: { id: string; name: string }) {
  switch (id) {
    /* ── COVER ── */
    case "sk-cover-centered-hero":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center">
            <p className="text-[5px] tracking-[0.3em] uppercase font-bold text-zinc-500">PART · ONE</p>
            <p className="text-[14px] font-bold leading-[1.1] text-zinc-900 dark:text-zinc-100">
              발표 제목
            </p>
            <p className="text-[6px] text-zinc-500 dark:text-zinc-400">부제목 한 줄</p>
            <p className="text-[4px] mt-2 text-zinc-400 dark:text-zinc-600 tracking-wider">
              AUTHOR · 2026
            </p>
          </div>
        </MiniSlide>
      );

    case "sk-cover-asym-left":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col justify-between">
            <div>
              <p className="text-[13px] font-bold leading-[1.05] text-zinc-900 dark:text-zinc-100">
                큰 제목이<br />좌측 상단에<br />놓인다
              </p>
              <p className="text-[5px] text-zinc-500 mt-1">부제목 한 줄</p>
            </div>
            <p className="text-[4px] text-zinc-400 tracking-wider">AUTHOR · 2026</p>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-zinc-900 dark:bg-zinc-100" />
        </MiniSlide>
      );

    case "sk-cover-split-image":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex">
            <div className="w-1/2 p-3 flex flex-col justify-center">
              <p className="text-[11px] font-bold leading-[1.1] text-zinc-900 dark:text-zinc-100">
                좌측 텍스트<br />우측 이미지
              </p>
              <p className="text-[5px] text-zinc-500 mt-1">부제목 한 줄</p>
              <p className="text-[4px] mt-2 text-zinc-400">AUTHOR</p>
            </div>
            <div className="w-1/2 relative bg-gradient-to-br from-zinc-300 to-zinc-500 dark:from-zinc-700 dark:to-zinc-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.3),transparent_60%)]" />
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-cover-dark-bold":
      return (
        <MiniSlide dark>
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <p className="text-[14px] font-bold leading-[1.1] text-white">
              강한 한 줄을<br />던지는 자리.
            </p>
          </div>
          <p className="absolute right-3 bottom-2 text-[4px] text-white/40 tracking-wider">CHAPTER 04</p>
        </MiniSlide>
      );

    /* ── SECTION ── */
    case "sk-section-numbered":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col justify-center pl-4 gap-0.5">
            <p className="text-[30px] font-bold leading-none text-zinc-900 dark:text-zinc-100">01</p>
            <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 mt-1">섹션 제목</p>
            <p className="text-[5px] text-zinc-500 mt-0.5">짧은 부제목 한 줄</p>
          </div>
        </MiniSlide>
      );

    case "sk-section-minimal-line":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col justify-center px-5 gap-1.5">
            <div className="flex items-center gap-2">
              <p className="text-[6px] tracking-[0.3em] uppercase text-zinc-400 font-bold">Part Two</p>
              <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">전환점</p>
          </div>
        </MiniSlide>
      );

    case "sk-section-full-brand":
      return (
        <MiniSlide>
          {/* "Full brand color section" — 카탈로그에서는 brand 대신 zinc-900 솔리드로 표현 */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 gap-1 bg-zinc-900 dark:bg-zinc-100">
            <p className="text-[5px] tracking-[0.3em] uppercase text-white/70 dark:text-zinc-900/70 font-bold">PART THREE</p>
            <p className="text-[13px] font-bold text-white dark:text-zinc-900 leading-tight">섹션 제목</p>
            <p className="text-[5px] text-white/85 dark:text-zinc-900/85">한 줄 thesis가 들어가는 자리</p>
          </div>
        </MiniSlide>
      );

    /* ── TITLE + BODY ── */
    case "sk-title-body-classic":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-0.5">
            <p className="text-[4px] tracking-[0.25em] uppercase font-bold text-zinc-500">CHAPTER 02</p>
            <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">슬라이드 제목</p>
            <p className="text-[5px] text-zinc-500">부제목 한 줄</p>
            <p className="text-[5px] text-zinc-700 dark:text-zinc-300 leading-[1.5] mt-1.5">
              본문 단락이 들어가는 자리. 두세 줄 정도의 흐름 있는 문장이 들어가서,
              이 슬라이드의 맥락을 부드럽게 풀어준다.
            </p>
          </div>
        </MiniSlide>
      );

    case "sk-title-body-pull-quote":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-1">
            <p className="text-[9px] font-bold text-zinc-900 dark:text-zinc-100">슬라이드 제목</p>
            <p className="text-[5px] text-zinc-600 dark:text-zinc-400 leading-snug">
              본문이 한두 줄 흐르다가
            </p>
            <div className="my-0.5 border-l-2 border-zinc-900 dark:border-zinc-100 pl-1.5">
              <p className="text-[8px] font-bold leading-tight text-zinc-900 dark:text-zinc-100">
                한 줄이 크게 강조된다.
              </p>
            </div>
            <p className="text-[5px] text-zinc-600 dark:text-zinc-400 leading-snug">
              다시 본문으로 돌아온다.
            </p>
          </div>
        </MiniSlide>
      );

    case "sk-title-body-two-block":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-1.5">
            <p className="text-[9px] font-bold text-zinc-900 dark:text-zinc-100">두 가지 흐름</p>
            <p className="text-[5px] text-zinc-700 dark:text-zinc-300 leading-snug">
              <span className="font-bold">첫째.</span> 첫 번째 블록의 핵심 메시지 한 줄.
            </p>
            <div className="h-px bg-zinc-300 dark:bg-zinc-700" />
            <p className="text-[5px] text-zinc-700 dark:text-zinc-300 leading-snug">
              <span className="font-bold">둘째.</span> 두 번째 블록의 핵심 메시지 한 줄.
            </p>
          </div>
        </MiniSlide>
      );

    /* ── BULLETS ── */
    case "sk-bullets-numbered-grid":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-2.5 flex flex-col gap-1">
            <p className="text-[7px] font-bold text-zinc-900 dark:text-zinc-100">네 가지 핵심</p>
            <div className="grid grid-cols-2 gap-1 flex-1">
              {[
                ["01", "첫 번째 항목"],
                ["02", "두 번째 항목"],
                ["03", "세 번째 항목"],
                ["04", "네 번째 항목"],
              ].map(([n, label]) => (
                <div
                  key={n}
                  className="rounded border border-zinc-200 dark:border-zinc-700 p-1 flex flex-col justify-between"
                >
                  <p className="text-[7px] font-bold leading-none text-zinc-900 dark:text-zinc-100">{n}</p>
                  <p className="text-[4px] font-semibold text-zinc-700 dark:text-zinc-300">{label}</p>
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
            <p className="text-[8px] font-bold text-zinc-900 dark:text-zinc-100">핵심 네 가지</p>
            <div className="mt-1 space-y-1">
              {["첫 번째 항목 설명", "두 번째 항목 설명", "세 번째 항목 설명", "네 번째 항목 설명"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full shrink-0 bg-zinc-900 dark:bg-zinc-100" />
                  <p className="text-[5px] text-zinc-700 dark:text-zinc-300">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-bullets-card-grid":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-2.5 flex flex-col gap-1">
            <p className="text-[7px] font-bold text-zinc-900 dark:text-zinc-100">세 가지 축</p>
            <div className="grid grid-cols-3 gap-1 flex-1">
              {[
                ["축 A", "한 줄 설명"],
                ["축 B", "한 줄 설명"],
                ["축 C", "한 줄 설명"],
              ].map(([title, sub]) => (
                <div key={title} className="rounded bg-zinc-100 dark:bg-zinc-800 p-1 flex flex-col gap-0.5 justify-center">
                  <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100">{title}</p>
                  <p className="text-[4px] text-zinc-500 leading-tight">{sub}</p>
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
            <p className="text-[8px] font-bold text-zinc-900 dark:text-zinc-100">완료 항목</p>
            <div className="mt-1 space-y-1">
              {[
                ["속도", "기준 대비 두 배"],
                ["품질", "오류율 80% 감소"],
                ["규모", "월 단위로 확장"],
              ].map(([bold, rest]) => (
                <div key={bold} className="flex items-center gap-1">
                  <p className="text-[7px] font-bold leading-none text-zinc-900 dark:text-zinc-100">✓</p>
                  <p className="text-[5px] font-bold text-zinc-900 dark:text-zinc-100">{bold}</p>
                  <p className="text-[5px] text-zinc-600 dark:text-zinc-400">— {rest}</p>
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
              <p className="text-[5px] tracking-[0.2em] uppercase font-bold text-zinc-500">BEFORE</p>
              <p className="text-[7px] font-bold text-zinc-700 dark:text-zinc-400 mt-0.5">기존 방식</p>
              <p className="text-[4px] text-zinc-500">조건 · 한계 · 비용</p>
            </div>
            <div className="rounded p-1.5 flex flex-col gap-0.5 bg-zinc-900 dark:bg-zinc-100">
              <p className="text-[5px] tracking-[0.2em] uppercase font-bold text-zinc-300 dark:text-zinc-600">AFTER</p>
              <p className="text-[7px] font-bold text-white dark:text-zinc-900 mt-0.5">새 방식</p>
              <p className="text-[4px] text-zinc-300 dark:text-zinc-600">개선 · 효과 · 결과</p>
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-compare-vs-headed":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-2 flex flex-col">
            <p className="text-center text-[13px] font-bold leading-none text-zinc-900 dark:text-zinc-100">VS</p>
            <div className="grid grid-cols-2 gap-2 flex-1 mt-1">
              {[
                ["A안", "특징 한 줄"],
                ["B안", "특징 한 줄"],
              ].map(([label, sub]) => (
                <div key={label} className="flex flex-col gap-0.5 px-1">
                  <p className="text-[7px] font-bold text-zinc-900 dark:text-zinc-100">{label}</p>
                  <p className="text-[4px] text-zinc-500">{sub}</p>
                  <div className="h-[1.5px] w-[60%] mt-0.5 rounded-sm bg-zinc-900 dark:bg-zinc-100" />
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
              <p className="text-[4px] tracking-[0.2em] uppercase font-bold text-zinc-400">PROBLEM</p>
              <p className="text-[6px] font-bold text-white leading-tight mt-0.5">
                현재의<br />문제 상태
              </p>
            </div>
            <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">→</p>
            <div className="flex-1 rounded bg-zinc-50 dark:bg-zinc-900 ring-1 ring-zinc-900 dark:ring-zinc-100 p-1.5 flex flex-col gap-0.5">
              <p className="text-[4px] tracking-[0.2em] uppercase font-bold text-zinc-700 dark:text-zinc-300">SOLUTION</p>
              <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight mt-0.5">
                해결<br />방향
              </p>
            </div>
          </div>
        </MiniSlide>
      );

    /* ── STAT ── */
    case "sk-stat-mono-jumbo":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col items-center justify-center gap-0.5">
            <p className="text-[5px] tracking-[0.25em] uppercase font-bold text-zinc-500">2024 RESULT</p>
            <p className="text-[34px] font-bold leading-none text-zinc-900 dark:text-zinc-100">172%</p>
            <p className="text-[5px] text-zinc-600 dark:text-zinc-400 mt-0.5">전년 대비 성장</p>
          </div>
        </MiniSlide>
      );

    case "sk-stat-trio":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex items-center divide-x divide-zinc-200 dark:divide-zinc-700">
            {[
              ["87%", "지표 A"],
              ["$4.2B", "지표 B"],
              ["3.4×", "지표 C"],
            ].map(([n, l]) => (
              <div key={l} className="flex-1 flex flex-col items-center gap-0.5">
                <p className="text-[14px] font-bold leading-none text-zinc-900 dark:text-zinc-100">{n}</p>
                <p className="text-[4px] text-zinc-500">{l}</p>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    case "sk-stat-with-context":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex items-center gap-3">
            <div className="text-right shrink-0">
              <p className="text-[26px] font-bold leading-none text-zinc-900 dark:text-zinc-100">87%</p>
              <p className="text-[4px] text-zinc-500 mt-0.5">핵심 지표</p>
            </div>
            <p className="flex-1 text-[5px] text-zinc-700 dark:text-zinc-300 leading-[1.55]">
              왜 이 숫자가 의미를 가지는가를 설명하는 본문이
              두세 줄 정도 들어가는 자리. 숫자 옆에서 맥락을 완성한다.
            </p>
          </div>
        </MiniSlide>
      );

    /* ── QUOTE ── */
    case "sk-quote-pull-full":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col justify-center">
            <p className="text-[26px] leading-none font-serif text-zinc-900 dark:text-zinc-100">&ldquo;</p>
            <p className="text-[8px] font-bold leading-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
              짧고 강한<br />한 문장이 들어간다.
            </p>
            <p className="text-[4px] text-zinc-500 mt-1.5 tracking-wider">— NAME, ROLE</p>
          </div>
        </MiniSlide>
      );

    case "sk-quote-portrait-left":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 dark:from-zinc-600 dark:to-zinc-700 shrink-0" />
            <div className="flex-1">
              <p className="text-[6.5px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
                &ldquo;인물의 인용문이 옆에 들어간다.&rdquo;
              </p>
              <p className="text-[4px] text-zinc-500 mt-0.5 tracking-wider">— NAME, ROLE</p>
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-quote-multi-stack":
      return (
        <MiniSlide>
          <div className="absolute inset-0 px-3 py-2 flex flex-col justify-center divide-y divide-zinc-200 dark:divide-zinc-700">
            {[
              ["첫 번째 인용 한 줄", "이름 A"],
              ["두 번째 인용 한 줄", "이름 B"],
              ["세 번째 인용 한 줄", "이름 C"],
            ].map(([q, a]) => (
              <div key={a} className="py-1">
                <p className="text-[5.5px] text-zinc-900 dark:text-zinc-100 font-semibold leading-snug">&ldquo;{q}&rdquo;</p>
                <p className="text-[3.5px] text-zinc-500 mt-0.5 tracking-wider">— {a.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    /* ── TIMELINE ── */
    case "sk-timeline-horizontal-dots":
      return (
        <MiniSlide>
          <div className="absolute inset-0 px-3 flex flex-col justify-center gap-1">
            <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100 mb-1">로드맵</p>
            <div className="relative flex items-center justify-between">
              <div className="absolute left-1 right-1 h-px bg-zinc-300 dark:bg-zinc-700 top-1/2" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              ))}
            </div>
            <div className="flex justify-between text-[4px] font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">
              <span>2020<br /><span className="font-normal text-zinc-500">시작</span></span>
              <span>2022<br /><span className="font-normal text-zinc-500">확장</span></span>
              <span>2024<br /><span className="font-normal text-zinc-500">전환</span></span>
              <span className="text-right">2026<br /><span className="font-normal text-zinc-500">현재</span></span>
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-timeline-stepped-vertical":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-2.5 flex flex-col gap-0.5">
            {[
              ["단계 1", "첫 단계 한 줄 설명"],
              ["단계 2", "두 번째 단계 설명"],
              ["단계 3", "세 번째 단계 설명"],
            ].map(([title, desc], i) => (
              <div key={title} className="flex gap-1.5 flex-1">
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  {i < 2 && <div className="w-px flex-1 bg-zinc-300 dark:bg-zinc-700" />}
                </div>
                <div className="flex-1 pb-1">
                  <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">{title}</p>
                  <p className="text-[4px] text-zinc-500 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    case "sk-timeline-highlight-current":
      return (
        <MiniSlide>
          <div className="absolute inset-0 px-3 flex flex-col justify-center gap-1">
            <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100 mb-1">진행 단계</p>
            <div className="relative flex items-center justify-between">
              <div className="absolute left-1 right-1 h-px bg-zinc-300 dark:bg-zinc-700 top-1/2" />
              {[0, 1, 2, 3].map((i) =>
                i === 2 ? (
                  <div
                    key={i}
                    className="relative w-3 h-3 rounded-full bg-zinc-900 dark:bg-zinc-100"
                    style={{ boxShadow: `0 0 0 3px rgba(24,24,27,0.12)` }}
                  />
                ) : (
                  <div key={i} className="relative w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                ),
              )}
            </div>
            <div className="flex justify-between text-[4px] text-zinc-500 mt-0.5">
              <span>준비</span><span>실행</span>
              <span className="font-bold tracking-[0.15em] text-zinc-900 dark:text-zinc-100">NOW</span>
              <span>마무리</span>
            </div>
          </div>
        </MiniSlide>
      );

    /* ── IMAGE ── */
    case "sk-image-full-overlay":
      return (
        <MiniSlide>
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-500 via-zinc-700 to-zinc-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <p className="absolute left-3 bottom-1 text-[3.5px] text-white/55 tracking-wider">PHOTO · SOURCE</p>
          <p className="absolute left-3 bottom-3 text-[8px] font-bold text-white leading-tight">
            이미지 위<br />헤드라인 자리
          </p>
        </MiniSlide>
      );

    case "sk-image-caption-side":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex">
            <div className="w-[68%] bg-gradient-to-br from-zinc-300 to-zinc-500 dark:from-zinc-700 dark:to-zinc-900" />
            <div className="w-[32%] p-2 flex flex-col gap-0.5 justify-center">
              <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100">이미지 캡션</p>
              <p className="text-[4px] text-zinc-600 dark:text-zinc-400 leading-snug">
                두 줄 정도의<br />짧은 설명
              </p>
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
                <div key={i} className="rounded bg-gradient-to-br from-zinc-300 to-zinc-500 dark:from-zinc-700 dark:to-zinc-900" />
              ))}
            </div>
            <p className="text-[4px] text-center text-zinc-500">3개 이미지 공통 캡션</p>
          </div>
        </MiniSlide>
      );

    /* ── CLOSING ── */
    case "sk-closing-cta-bold":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-1">
            <p className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">감사합니다</p>
            <p className="text-[5px] text-zinc-500">함께 시작해요.</p>
            <div className="mt-1.5 px-2 py-0.5 rounded-full text-white dark:text-zinc-900 text-[5px] font-bold tracking-wider bg-zinc-900 dark:bg-zinc-100">
              시작하기 →
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-closing-contact":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col justify-center gap-0.5">
            <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">감사합니다.</p>
            <div className="mt-1 space-y-0.5">
              <p className="text-[5px] text-zinc-700 dark:text-zinc-300">hi@example.com</p>
              <p className="text-[5px] text-zinc-700 dark:text-zinc-300">example.com</p>
              <p className="text-[5px] text-zinc-500">@example</p>
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-closing-quote-end":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center gap-1">
            <p className="text-[16px] leading-none font-serif text-zinc-300 dark:text-zinc-700">&ldquo;</p>
            <p className="text-[8px] italic font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              마지막에 남길<br />여운의 한 줄.
            </p>
            <p className="text-[4px] text-zinc-500 mt-1 tracking-wider">— AUTHOR</p>
          </div>
        </MiniSlide>
      );

    /* ── HYBRID ── */
    case "sk-hero-stat-strip":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col justify-between">
            <div>
              <p className="text-[4px] tracking-[0.25em] uppercase font-bold text-zinc-500">SUMMARY 2024</p>
              <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight mt-0.5">
                숫자가 정리하는 한 해
              </p>
            </div>
            <div>
              <div className="h-px bg-zinc-200 dark:bg-zinc-700 mb-1" />
              <div className="flex justify-around">
                {[
                  ["87%", "지표 A"],
                  ["$4.2B", "지표 B"],
                  ["3.4×", "지표 C"],
                ].map(([n, l]) => (
                  <div key={l} className="flex flex-col items-center">
                    <p className="text-[8px] font-bold leading-none text-zinc-900 dark:text-zinc-100">{n}</p>
                    <p className="text-[4px] text-zinc-500 mt-0.5">{l}</p>
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
          <div className="absolute inset-0 flex p-2 gap-1.5">
            <div className="flex-[3] flex flex-col gap-1 px-1">
              <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100">맥락</p>
              <p className="text-[4.5px] text-zinc-600 dark:text-zinc-400 leading-snug">
                상황을 풀어내는 본문이 좌측에 들어간다.
                두세 줄 정도 흐름을 만들고, 우측 인사이트로 마무리한다.
              </p>
            </div>
            <div className="flex-[2] rounded bg-zinc-900 dark:bg-black p-1.5 flex flex-col gap-0.5">
              <p className="text-[4px] tracking-[0.25em] uppercase font-bold text-zinc-100">INSIGHT</p>
              <p className="text-[5px] text-white leading-snug mt-0.5">
                한 문장으로<br />압축한 결론.
              </p>
            </div>
          </div>
        </MiniSlide>
      );

    case "sk-logo-grid":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3 flex flex-col gap-1">
            <p className="text-[5px] tracking-[0.25em] uppercase font-bold text-zinc-500">Trusted by</p>
            <div className="grid grid-cols-5 grid-rows-2 gap-1 flex-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
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
            {[
              ["기능 A", "한 줄 설명"],
              ["기능 B", "한 줄 설명"],
              ["기능 C", "한 줄 설명"],
            ].map(([title, sub]) => (
              <div key={title} className="flex flex-col gap-0.5">
                <div className="w-1.5 h-1.5 rotate-45 bg-zinc-900 dark:bg-zinc-100" />
                <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{title}</p>
                <p className="text-[4px] text-zinc-500 leading-snug">{sub}</p>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    case "sk-zigzag-narrative":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-2 flex flex-col gap-1">
            <p className="text-[7px] font-bold text-zinc-900 dark:text-zinc-100">서사의 흐름</p>
            <div className="flex gap-1 flex-1">
              <div className="flex-1 self-start">
                <p className="text-[4px] text-zinc-700 dark:text-zinc-300 leading-snug">
                  좌측에서 출발하는<br />첫 번째 블록.
                </p>
              </div>
              <div className="flex-1" />
            </div>
            <div className="flex gap-1 flex-1">
              <div className="flex-1" />
              <div className="flex-1 self-end text-right">
                <p className="text-[4px] text-zinc-700 dark:text-zinc-300 leading-snug">
                  우측에서 받는<br />두 번째 블록.
                </p>
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

function BaseSlide({ children, fade = "55" }: { children: ReactNode; fade?: string }) {
  return (
    <MiniSlide>
      <div className={clsx("absolute inset-2.5 flex flex-col gap-0.5 pointer-events-none", `opacity-${fade}`)}>
        <p className="text-[4px] tracking-[0.2em] uppercase font-bold text-zinc-400">CHAPTER 02</p>
        <p className="text-[7px] font-bold text-zinc-700 dark:text-zinc-300 leading-tight">
          베이스 슬라이드 제목
        </p>
        <p className="text-[4px] text-zinc-500 leading-snug mt-0.5">
          본문 두 줄 정도가 들어가는<br />
          평범한 배경 슬라이드입니다.
        </p>
      </div>
      {children}
    </MiniSlide>
  );
}

export function AccentPreview({ id, name }: { id: string; name: string }) {
  switch (id) {
    case "ac-dark-insight-box":
      return (
        <BaseSlide fade="40">
          <div className="absolute right-2 bottom-2 w-[52%] rounded bg-zinc-900 dark:bg-black p-1.5 flex flex-col gap-0.5">
            <p className="text-[3.5px] uppercase tracking-[0.25em] font-bold text-zinc-100">INSIGHT</p>
            <p className="text-[5px] text-white leading-snug">
              한 문장으로 압축한<br />핵심 인사이트.
            </p>
          </div>
        </BaseSlide>
      );

    case "ac-brand-product-card-32":
      return (
        <MiniSlide>
          {/* 실제로는 brand color 면 — 카탈로그에선 zinc-900으로 placeholder */}
          <div className="absolute inset-3 rounded-xl p-2 overflow-hidden bg-zinc-900 dark:bg-zinc-100">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/25 dark:bg-zinc-900/25 blur-lg" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-white/20 dark:bg-zinc-900/20 blur-md" />
            <p className="relative text-[8px] font-bold leading-tight text-white dark:text-zinc-900">
              헤드라인 자리
            </p>
            <p className="relative text-[4px] mt-0.5 text-white/80 dark:text-zinc-900/70">서브라인 한 줄</p>
          </div>
        </MiniSlide>
      );

    case "ac-hairline-divider":
      return (
        <MiniSlide>
          <div className="absolute inset-2.5 flex flex-col gap-1.5">
            <div>
              <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100">위쪽 섹션</p>
              <p className="text-[4px] text-zinc-500 leading-snug mt-0.5">본문 한 줄 자리.</p>
            </div>
            <div className="h-px w-full bg-zinc-300 dark:bg-zinc-600" />
            <div>
              <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100">아래쪽 섹션</p>
              <p className="text-[4px] text-zinc-500 leading-snug mt-0.5">본문 한 줄 자리.</p>
            </div>
          </div>
        </MiniSlide>
      );

    case "ac-vertical-rule":
      return (
        <MiniSlide>
          <div className="absolute inset-2.5 flex gap-2 items-stretch">
            <div className="flex-1">
              <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100">왼쪽 컬럼</p>
              <p className="text-[4px] text-zinc-500 leading-snug mt-0.5">본문 한 줄 자리.</p>
            </div>
            <div className="w-px bg-zinc-400 dark:bg-zinc-500" />
            <div className="flex-1">
              <p className="text-[6px] font-bold text-zinc-900 dark:text-zinc-100">오른쪽 컬럼</p>
              <p className="text-[4px] text-zinc-500 leading-snug mt-0.5">본문 한 줄 자리.</p>
            </div>
          </div>
        </MiniSlide>
      );

    case "ac-eyebrow-caption":
      return (
        <BaseSlide>
          <p className="absolute top-2.5 left-2.5 text-[4px] tracking-[0.3em] uppercase font-bold text-zinc-900 dark:text-zinc-100">
            PART · TWO · 카테고리
          </p>
        </BaseSlide>
      );

    case "ac-pill-tab":
      return (
        <BaseSlide>
          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-white dark:text-zinc-900 text-[4px] font-bold tracking-wider bg-zinc-900 dark:bg-zinc-100">
            NEW
          </span>
        </BaseSlide>
      );

    case "ac-coral-strip":
      return (
        <BaseSlide>
          {/* 실제로는 brand color — 여기선 zinc로 표시 */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900 dark:bg-zinc-100" />
        </BaseSlide>
      );

    case "ac-atmospheric-blur-corner":
      return (
        <MiniSlide>
          <div className="absolute inset-3 rounded-xl overflow-hidden p-2 bg-zinc-900 dark:bg-zinc-100">
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white/40 dark:bg-zinc-900/30 blur-lg" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-white/30 dark:bg-zinc-900/20 blur-lg" />
            <p className="relative text-[6px] font-bold text-white dark:text-zinc-900 leading-tight">
              빛의 잔향으로<br />깊이를 만든다
            </p>
          </div>
        </MiniSlide>
      );

    case "ac-large-quote-mark":
      return (
        <MiniSlide>
          <p className="absolute top-0 left-1.5 text-[44px] leading-none text-zinc-200 dark:text-zinc-800 font-serif">&ldquo;</p>
          <div className="absolute inset-0 flex flex-col justify-center pl-5 pr-3">
            <p className="text-[6.5px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              짧은 인용문 위에 큰 따옴표가 깔린다.
            </p>
            <p className="text-[4px] text-zinc-500 mt-0.5 tracking-wider">— NAME</p>
          </div>
        </MiniSlide>
      );

    case "ac-stat-stack-vertical":
      return (
        <MiniSlide>
          <div className="absolute inset-2.5 right-[38%] flex flex-col gap-0.5 opacity-50">
            <p className="text-[6px] font-bold text-zinc-700 dark:text-zinc-300">수치 사이드바</p>
            <p className="text-[4px] text-zinc-500 leading-snug">
              우측 세로 영역에<br />stat 세 개가 쌓인다.
            </p>
          </div>
          <div className="absolute right-2 top-2 bottom-2 w-[34%] flex flex-col justify-around divide-y divide-zinc-200 dark:divide-zinc-700">
            {[
              ["87%", "지표 A"],
              ["4.2B", "지표 B"],
              ["3.4×", "지표 C"],
            ].map(([n, l]) => (
              <div key={l} className="py-1">
                <p className="text-[9px] font-bold leading-none text-zinc-900 dark:text-zinc-100">{n}</p>
                <p className="text-[4px] text-zinc-500 mt-0.5">{l}</p>
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
                className={clsx(
                  "w-2 h-2",
                  i % 2 === 0
                    ? "rounded-full bg-zinc-900 dark:bg-zinc-100"
                    : "rotate-45 bg-zinc-400 dark:bg-zinc-600",
                )}
              />
            ))}
          </div>
        </MiniSlide>
      );

    case "ac-page-number-corner":
      return (
        <BaseSlide>
          <p className="absolute right-2.5 bottom-1.5 text-[6px] font-mono text-zinc-500">07</p>
        </BaseSlide>
      );

    case "ac-logo-bottom-left":
      return (
        <BaseSlide>
          <div className="absolute left-2.5 bottom-1.5 flex items-center gap-0.5">
            <div className="w-1.5 h-1.5 rounded-sm bg-zinc-900 dark:bg-zinc-100" />
            <p className="text-[4px] font-bold text-zinc-700 dark:text-zinc-300 tracking-wider">LOGO</p>
          </div>
        </BaseSlide>
      );

    case "ac-arrow-callout":
      return (
        <MiniSlide>
          <div className="absolute inset-0 p-3">
            <p className="text-[5px] font-bold text-zinc-900 dark:text-zinc-100">지표 추이</p>
            <div className="relative mt-2 h-12">
              <svg viewBox="0 0 200 60" className="w-full h-full">
                <polyline points="10,10 50,18 90,30 130,42 170,50" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                <circle cx="170" cy="50" r="3" className="fill-zinc-900 dark:fill-zinc-100" />
              </svg>
              <div className="absolute right-2 bottom-0 flex items-center gap-0.5">
                <div className="h-px w-3 bg-zinc-900 dark:bg-zinc-100" />
                <p className="text-[4px] font-bold text-zinc-900 dark:text-zinc-100">최종</p>
              </div>
            </div>
          </div>
        </MiniSlide>
      );

    case "ac-highlight-circle":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex items-center justify-center gap-1.5">
            <p className="text-[6px] text-zinc-500">값</p>
            <div className="relative">
              <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">87%</p>
              <div
                className="absolute -inset-1.5 rounded-full border-2 border-zinc-900 dark:border-zinc-100"
                style={{ transform: "rotate(-8deg) scaleX(1.2)" }}
              />
            </div>
            <p className="text-[6px] text-zinc-500">달성</p>
          </div>
        </MiniSlide>
      );

    case "ac-numbered-bullet-big":
      return (
        <MiniSlide>
          <div className="absolute inset-3 flex items-center justify-around">
            {[["01", "항목"], ["02", "항목"], ["03", "항목"]].map(([n, l]) => (
              <div key={n} className="flex flex-col items-center gap-0.5">
                <p className="text-[16px] font-bold leading-none text-zinc-900 dark:text-zinc-100">{n}</p>
                <p className="text-[4px] font-semibold text-zinc-700 dark:text-zinc-300 tracking-wider uppercase">{l}</p>
              </div>
            ))}
          </div>
        </MiniSlide>
      );

    case "ac-progress-dot-row":
      return (
        <BaseSlide>
          <div className="absolute right-2.5 top-2 flex items-center gap-0.5">
            {[true, true, true, false, false].map((on, i) => (
              <div
                key={i}
                className={clsx(
                  "w-1 h-1 rounded-full",
                  on ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-300 dark:bg-zinc-700",
                )}
              />
            ))}
          </div>
        </BaseSlide>
      );

    case "ac-stat-arrow-delta":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <p className="text-[4px] tracking-[0.25em] uppercase font-bold text-zinc-500">QUARTER</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">$4.2B</p>
              <p className="text-[7px] font-bold text-emerald-500">↑ +12%</p>
            </div>
            <p className="text-[4px] text-zinc-500 mt-0.5">전년 대비</p>
          </div>
        </MiniSlide>
      );

    case "ac-keyword-underline":
      return (
        <MiniSlide>
          <div className="absolute inset-3 flex items-center justify-center">
            <p className="text-[7px] text-zinc-900 dark:text-zinc-100 leading-snug text-center">
              핵심은{" "}
              <span className="font-bold border-b-2 border-zinc-900 dark:border-zinc-100">키워드</span>
              에 있다.
            </p>
          </div>
        </MiniSlide>
      );

    case "ac-bracket-wrap":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex items-center justify-center px-3 gap-1.5">
            <p className="text-[28px] text-zinc-300 dark:text-zinc-700 leading-none font-light">[</p>
            <p className="text-[7px] font-semibold text-zinc-900 dark:text-zinc-100 text-center leading-snug">
              핵심 명제<br />한 문장
            </p>
            <p className="text-[28px] text-zinc-300 dark:text-zinc-700 leading-none font-light">]</p>
          </div>
        </MiniSlide>
      );

    case "ac-dot-pattern-bg":
      return (
        <MiniSlide>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(120,120,120,0.35) 0.6px, transparent 1.2px)",
              backgroundSize: "9px 9px",
            }}
          />
          <div className="absolute inset-3 flex items-center justify-center">
            <p className="text-[6px] font-bold text-zinc-700 dark:text-zinc-300 bg-white/85 dark:bg-zinc-900/85 px-1.5 py-0.5 rounded">
              점 패턴 위 콘텐츠
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
              backgroundImage: "repeating-linear-gradient(45deg, rgba(120,120,120,0.18) 0 2px, transparent 2px 9px)",
            }}
          />
          <div className="absolute inset-3 flex items-center justify-center">
            <p className="text-[6px] font-bold text-zinc-700 dark:text-zinc-300 bg-white/85 dark:bg-zinc-900/85 px-1.5 py-0.5 rounded">
              사선 패턴 위 콘텐츠
            </p>
          </div>
        </MiniSlide>
      );

    case "ac-quote-mark-coral":
      return (
        <MiniSlide>
          <div className="absolute inset-2.5 flex flex-col items-start justify-center">
            <p className="text-[30px] leading-none font-serif text-zinc-900 dark:text-zinc-100">&ldquo;</p>
            <p className="text-[6px] text-zinc-900 dark:text-zinc-100 -mt-1 pl-1 leading-snug">짧은 인용 한 줄.</p>
            <p className="text-[3.5px] text-zinc-500 pl-1 mt-0.5 tracking-wider">— AUTHOR</p>
          </div>
        </MiniSlide>
      );

    case "ac-vertical-progress-line":
      return (
        <BaseSlide>
          <div className="absolute left-1.5 top-2 bottom-2 w-px bg-zinc-300 dark:bg-zinc-700">
            <div className="absolute left-[-2px] w-1.5 h-1.5 bg-zinc-900 dark:bg-zinc-100" style={{ top: "35%" }} />
          </div>
          <p className="absolute left-3.5 -translate-y-1/2 text-[4px] font-bold tracking-wider text-zinc-900 dark:text-zinc-100" style={{ top: "35%" }}>
            NOW · 03/07
          </p>
        </BaseSlide>
      );

    case "ac-section-roman":
      return (
        <BaseSlide>
          <p className="absolute top-2 right-3 text-[14px] font-serif font-bold text-zinc-400 dark:text-zinc-600">
            III.
          </p>
        </BaseSlide>
      );

    case "ac-color-block-stack":
      return (
        <MiniSlide>
          {/* 실제로는 brand palette 컬러 — 여기선 zinc 톤으로 placeholder */}
          <div className="absolute left-0 top-0 bottom-0 w-3.5 flex flex-col">
            <div className="flex-1 bg-zinc-900 dark:bg-zinc-100" />
            <div className="flex-1 bg-zinc-700 dark:bg-zinc-300" />
            <div className="flex-1 bg-zinc-500" />
            <div className="flex-1 bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <div className="absolute inset-2.5 left-6 flex flex-col gap-0.5 opacity-60">
            <p className="text-[5px] font-bold text-zinc-700 dark:text-zinc-300">컬러 스택</p>
            <p className="text-[4px] text-zinc-500">팔레트 미리보기 사이드바</p>
          </div>
        </MiniSlide>
      );

    case "ac-tagline-bottom":
      return (
        <BaseSlide>
          <div className="absolute left-2.5 right-2.5 bottom-1 flex flex-col gap-0.5">
            <div className="h-px bg-zinc-300 dark:bg-zinc-700" />
            <p className="text-[4px] text-zinc-500 italic">tagline 한 줄.</p>
          </div>
        </BaseSlide>
      );

    case "ac-stat-with-icon":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <div className="w-4 h-4 rotate-45 bg-zinc-900 dark:bg-zinc-100" />
            <div>
              <p className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">87%</p>
              <p className="text-[4px] text-zinc-500 mt-0.5">지표 설명</p>
            </div>
          </div>
        </MiniSlide>
      );

    case "ac-color-swatch-row":
      return (
        <MiniSlide>
          {/* 실 사용 시엔 brand 5색 — 카탈로그는 zinc 그라데이션으로 표시 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <div className="flex gap-1">
              {["bg-zinc-900 dark:bg-zinc-100", "bg-zinc-700 dark:bg-zinc-300", "bg-zinc-500", "bg-zinc-400 dark:bg-zinc-600", "bg-zinc-200 dark:bg-zinc-800"].map((c, i) => (
                <div key={i} className={clsx("w-3.5 h-3.5 rounded-sm", c)} />
              ))}
            </div>
            <p className="text-[4px] text-zinc-500 tracking-wider mt-0.5">PALETTE · 5</p>
          </div>
        </MiniSlide>
      );

    case "ac-callout-tag-corner":
      return (
        <BaseSlide>
          <div
            className="absolute top-0 right-0 px-1.5 py-0.5 text-white dark:text-zinc-900 text-[4px] font-bold tracking-widest bg-zinc-900 dark:bg-zinc-100"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 15% 100%)",
              paddingLeft: "8px",
            }}
          >
            NEW
          </div>
        </BaseSlide>
      );

    case "ac-step-progress-3":
      return (
        <BaseSlide>
          <div className="absolute top-2 left-2.5 right-2.5 flex items-center gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <div className="flex-1 h-[1.5px] bg-zinc-900 dark:bg-zinc-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <div className="flex-1 h-[1.5px] bg-zinc-300 dark:bg-zinc-700" />
            <div className="w-1.5 h-1.5 rounded-full border border-zinc-400 dark:border-zinc-600" />
          </div>
          <div className="absolute top-4 left-2.5 right-2.5 flex justify-between text-[3.5px] text-zinc-500 tracking-wider">
            <span>단계 1</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">단계 2</span>
            <span>단계 3</span>
          </div>
        </BaseSlide>
      );

    case "ac-icon-row-features":
      return (
        <MiniSlide>
          <div className="absolute inset-2.5 flex items-center justify-around">
            {[
              ["▲", "항목"],
              ["◆", "항목"],
              ["●", "항목"],
              ["■", "항목"],
              ["◇", "항목"],
            ].map(([icon, l], i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <p className="text-[8px] leading-none text-zinc-900 dark:text-zinc-100">{icon}</p>
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
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 dark:from-zinc-600 dark:to-zinc-700" />
            <p className="text-[5.5px] font-bold text-zinc-900 dark:text-zinc-100 mt-1">이름</p>
            <p className="text-[4px] text-zinc-500">직책 한 줄</p>
          </div>
        </MiniSlide>
      );

    case "ac-thick-underline-title":
      return (
        <MiniSlide>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">제목</p>
            <div className="h-[3px] w-10 rounded-sm bg-zinc-900 dark:bg-zinc-100" />
          </div>
        </MiniSlide>
      );

    case "ac-numbered-checklist-card":
      return (
        <MiniSlide>
          <div className="absolute inset-2.5 flex flex-col gap-0.5 justify-center">
            {[
              ["01", "첫 번째 항목", "✓"],
              ["02", "두 번째 항목", "✓"],
              ["03", "세 번째 항목", "─"],
            ].map(([n, t, c]) => (
              <div
                key={n}
                className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-1 flex items-center justify-between gap-1"
              >
                <div className="flex items-center gap-1.5">
                  <p className="text-[5px] font-bold text-zinc-900 dark:text-zinc-100">{n}</p>
                  <p className="text-[4.5px] text-zinc-600 dark:text-zinc-400">{t}</p>
                </div>
                <p className={clsx("text-[6px] font-bold leading-none", c === "✓" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400")}>
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
/*  Chart placeholder 치환 — 일반 톤(특정 산업 X)의 sample 라벨         */
/* ──────────────────────────────────────────────────────────────────── */

const CHART_SAMPLES: Record<string, string> = {
  // ranked horizontal bar
  LABEL_1: "항목 A", LABEL_2: "항목 B", LABEL_3: "항목 C",
  LABEL_4: "항목 D", LABEL_5: "항목 E",
  VALUE_1: "87%", VALUE_2: "65%", VALUE_3: "42%", VALUE_4: "30%", VALUE_5: "18%",
  WIDTH_1: "700", WIDTH_2: "520", WIDTH_3: "335", WIDTH_4: "240", WIDTH_5: "145",
  WIDTH_1_END: "910", MAX_VALUE: "100",

  // grouped / stacked bar
  GROUP_LABEL_1: "Q1", GROUP_LABEL_2: "Q2", GROUP_LABEL_3: "Q3", GROUP_LABEL_4: "Q4",
  SERIES_LABEL_1: "2024", SERIES_LABEL_2: "2025",
  Y_S1_G1: "200", H_S1_G1: "240", Y_S2_G1: "260", H_S2_G1: "180",
  CATEGORY_1: "카테고리 A", CATEGORY_2: "카테고리 B", CATEGORY_3: "카테고리 C",
  SEG_W_1A: "300", SEG_X_1B: "420", SEG_W_1B: "200", SEG_X_1C: "620", SEG_W_1C: "180",

  // bullet chart
  METRIC_LABEL_1: "지표 A", METRIC_LABEL_2: "지표 B",
  ACTUAL_W_1: "560", TARGET_X_1: "720", TARGET_1: "70", ACTUAL_1: "56",

  // line / area
  POINTS: "40,320 200,260 360,200 520,180 680,140 840,110 1000,80 1140,60",
  LINE_POINTS: "40,320 200,260 360,200 520,180 680,140 840,110 1000,80 1140,60",
  AREA_PATH: "M40,320 L200,260 L360,200 L520,180 L680,140 L840,110 L1000,80 L1140,60 L1140,400 L40,400 Z",
  SERIES_1_POINTS: "40,320 200,260 360,200 520,180 680,140 840,110 1000,80 1140,60",
  SERIES_2_POINTS: "40,200 200,180 360,210 520,250 680,260 840,240 1000,220 1140,200",
  SERIES_3_POINTS: "40,350 200,330 360,310 520,290 680,280 840,260 1000,250 1140,240",
  X_LABELS: "", MAX_Y: "100",
  X_LABEL: "x축", Y_LABEL: "y축",

  // sparkline KPI tile
  KPI_LABEL_1: "지표 A", KPI_VALUE_1: "87%",
  KPI_LABEL_2: "지표 B", KPI_VALUE_2: "92%",
  KPI_LABEL_3: "지표 C", KPI_VALUE_3: "9건",
  SPARKLINE_1: "24,170 80,150 130,120 180,140 230,100 280,80 330,60",

  // waterfall
  BAR_LABEL_1: "초기", BAR_LABEL_2: "+증가", BAR_LABEL_3: "-감소", BAR_LABEL_4: "최종",
  BAR_VALUE_1: "100", BAR_VALUE_2: "+30", BAR_VALUE_3: "-12", BAR_VALUE_4: "118",
  BAR_SIGN_1: "+", BAR_SIGN_2: "+", BAR_SIGN_3: "-", BAR_SIGN_4: "+",
  Y_1: "100", H_1: "280", Y_2: "80", H_2: "240",

  // donut single
  PERCENT: "87", LABEL: "전체 대비", DASHARRAY: "765 113",

  // donut multi
  SEG_1_PERCENT: "40", SEG_2_PERCENT: "30", SEG_3_PERCENT: "20",
  SEG_4_PERCENT: "10", SEG_5_PERCENT: "0",
  SEG_1_LABEL: "A", SEG_2_LABEL: "B", SEG_3_LABEL: "C", SEG_4_LABEL: "D", SEG_5_LABEL: "E",
  SEG_1_DASH: "352 528", SEG_2_DASH: "264 616", SEG_3_DASH: "176 704",
  SEG_4_DASH: "88 792", SEG_5_DASH: "0 880",
  SEG_2_OFFSET: "-352", SEG_3_OFFSET: "-616",
  SEG_4_OFFSET: "-792", SEG_5_OFFSET: "-880",

  // treemap
  TILE_X_1: "0", TILE_Y_1: "0", TILE_W_1: "640", TILE_H_1: "300",
  TILE_X_2: "640", TILE_Y_2: "0", TILE_W_2: "512", TILE_H_2: "200",
  TILE_X_3: "640", TILE_Y_3: "200", TILE_W_3: "512", TILE_H_3: "280",
  TILE_LABEL_1: "타일 A", TILE_LABEL_2: "B", TILE_LABEL_3: "C",
  TILE_LX_1: "30", TILE_LY_1: "50",
  TILE_LX_2: "670", TILE_LY_2: "40",
  TILE_LX_3: "670", TILE_LY_3: "240",
  TILE_VALUE_1: "62%", TILE_VALUE_2: "23%", TILE_VALUE_3: "15%",

  // scatter / bubble (X_1/Y_1 reused from waterfall)
  X_3: "700", Y_3: "180",
  BUBBLE_1_X: "300", BUBBLE_1_Y: "300", BUBBLE_1_R: "50", BUBBLE_1_LABEL: "A",
  BUBBLE_2_X: "600", BUBBLE_2_Y: "200", BUBBLE_2_R: "70", BUBBLE_2_LABEL: "B",
  BUBBLE_3_X: "900", BUBBLE_3_Y: "260", BUBBLE_3_R: "40", BUBBLE_3_LABEL: "C",

  // venn
  LABEL_A: "집합 A", LABEL_B: "집합 B", OVERLAP_LABEL: "A ∩ B",

  // funnel
  STAGE_1_LABEL: "방문", STAGE_1_VALUE: "10K",
  STAGE_2_LABEL: "관심", STAGE_2_VALUE: "3.2K",
  STAGE_3_LABEL: "체험", STAGE_3_VALUE: "780",
  STAGE_4_LABEL: "전환", STAGE_4_VALUE: "220",

  // flow
  NODE_1_LABEL: "단계 1", NODE_2_LABEL: "단계 2",
  NODE_3_LABEL: "단계 3", NODE_4_LABEL: "단계 4",

  // sankey
  SRC_1_LABEL: "출처 A", SRC_2_LABEL: "출처 B",
  TGT_1_LABEL: "도착 A", TGT_2_LABEL: "도착 B",
  FLOW_1: "60", FLOW_2: "40",

  // matrix
  X_AXIS: "x축", Y_AXIS: "y축",
  Q1_LABEL: "Q1", Q2_LABEL: "Q2", Q3_LABEL: "Q3", Q4_LABEL: "Q4",
  ITEMS: "",

  // swot
  S_ITEMS: "", W_ITEMS: "", O_ITEMS: "", T_ITEMS: "",

  // pyramid
  TIER_TOP: "상위", TIER_MID: "중위", TIER_BOTTOM: "하위",

  // value chain
  ACTIVITY_1: "활동 1", ACTIVITY_2: "활동 2",
  ACTIVITY_3: "활동 3", ACTIVITY_4: "활동 4", ACTIVITY_5: "활동 5",

  // org / hub / mindmap
  ROOT_LABEL: "최상위",
  MID_1_LABEL: "중간 A", MID_2_LABEL: "중간 B", MID_3_LABEL: "중간 C",
  LEAF_1_LABEL: "말단 A", LEAF_2_LABEL: "말단 B",
  HUB_LABEL: "허브",
  SPOKE_1_LABEL: "노드 A", SPOKE_2_LABEL: "노드 B",
  SPOKE_3_LABEL: "노드 C", SPOKE_4_LABEL: "노드 D",
  CENTER: "중심 주제",
  BRANCH_1: "가지 1", BRANCH_2: "가지 2",

  // timeline events
  DATE_1: "2022", DATE_2: "2024", DATE_3: "2026",
  EVENT_1: "시작", EVENT_2: "확장", EVENT_3: "전환점",

  // gantt
  TASK_1_LABEL: "작업 1", TASK_1_X: "160", TASK_1_W: "240",
  TASK_2_LABEL: "작업 2", TASK_2_X: "300", TASK_2_W: "320",
  TASK_3_LABEL: "작업 3", TASK_3_X: "500", TASK_3_W: "440",

  // roadmap
  Q_1_LABEL: "Q1", Q_2_LABEL: "Q2", Q_3_LABEL: "Q3", Q_4_LABEL: "Q4",
  INIT_1: "이니셔티브 1", INIT_2: "이니셔티브 2", INIT_3: "이니셔티브 3",

  // kanban
  COL_1_TITLE: "TO DO", COL_2_TITLE: "DOING", COL_3_TITLE: "DONE",
  CARD_1: "작업 카드", CARD_2: "작업 카드", CARD_3: "작업 카드",

  // compare / pricing
  COL_A: "A안", COL_B: "B안", COL_C: "C안",
  FEATURE_1: "특성 1", FEATURE_2: "특성 2", FEATURE_3: "특성 3",
  VAL_A_1: "—", VAL_A_2: "—", VAL_A_3: "✗",
  VAL_B_1: "—", VAL_B_2: "—", VAL_B_3: "✓",
  VAL_C_1: "—", VAL_C_2: "—", VAL_C_3: "✓",
  PLAN_1_NAME: "Free", PLAN_1_PRICE: "$0",
  PLAN_2_NAME: "Pro", PLAN_2_PRICE: "$19",
  PLAN_3_NAME: "Team", PLAN_3_PRICE: "$99",

  // heatmap
  ROW_LABEL_1: "1주", ROW_LABEL_2: "2주", ROW_LABEL_3: "3주",
  COL_LABEL_1: "월", COL_LABEL_2: "화", COL_LABEL_3: "수",
  CELL_1: "0.3",

  // progress
  METRIC_1: "지표 A", METRIC_2: "지표 B", METRIC_3: "지표 C",
  PERCENT_1: "87", PERCENT_2: "62", PERCENT_3: "94",
  BAR_W_1: "696", BAR_W_2: "496", BAR_W_3: "752",
  DASH_1: "437 503", DASH_2: "311 629", DASH_3: "478 462",

  // radar
  AXIS_1_LABEL: "축 1", AXIS_2_LABEL: "축 2", AXIS_3_LABEL: "축 3",
  AXIS_4_LABEL: "축 4", AXIS_5_LABEL: "축 5",
  POINTS_1: "300,120 460,210 400,430 200,430 140,210",
};

export function substituteChartPlaceholders(svg: string): string {
  return svg.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => CHART_SAMPLES[key] ?? "—");
}
