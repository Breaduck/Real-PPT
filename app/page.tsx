"use client";

import { useState, useRef } from "react";
import clsx from "clsx";
import type { PptDesignSystem, Slide, WizardStep } from "@/lib/types";
import Deck from "@/components/deck/Deck";

const PLACEHOLDER_DESIGN_MD = `# paste design.md here

Get a design.md from https://getdesign.md (e.g. MiniMax, Stripe, Anthropic, Linear...)
Then paste the full content of the DESIGN.md file here.`;

const PLACEHOLDER_CONTENT = `1장: 회사 소개
MiniMax는 AI 멀티모달 기술을 선도하는 기업으로, 텍스트, 이미지, 음성을 통합하는 차세대 AI 플랫폼을 개발합니다.

2장: 핵심 문제 정의
기존 AI 모델은 단일 모달에 최적화되어 있어 실제 비즈니스 현장의 복합적 요구를 충족하지 못합니다. 87%의 기업이 다양한 AI 솔루션을 통합하는 데 어려움을 겪고 있습니다.

3장: 우리의 솔루션
MiniMax의 통합 멀티모달 엔진은 텍스트-이미지-음성을 단일 API로 처리합니다.

4장: 시장 규모
글로벌 멀티모달 AI 시장은 2028년까지 $340B 규모로 성장 예상.

5장: 핵심 기술
- Music 2.6: 상용화된 음악 생성 AI
- MiniMax-01: 멀티모달 언어 모델
- Hailuo: 비디오 생성 모델
- Voice: 실시간 음성 합성`;

export default function Home() {
  const [step, setStep] = useState<WizardStep>("paste-design");
  const [designMd, setDesignMd] = useState("");
  const [pptDesign, setPptDesign] = useState<PptDesignSystem | null>(null);
  const [content, setContent] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [slideProgress, setSlideProgress] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  async function handleTransformDesign() {
    if (!designMd.trim()) {
      setError("design.md 내용을 붙여넣어 주세요.");
      return;
    }
    setError(null);
    setStep("transform-loading");
    setLoadingMsg("디자인 시스템을 분석 중...");

    try {
      const res = await fetch("/api/transform-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designMd }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "변환 실패");
      setPptDesign(data.pptDesign);
      setStep("design-preview");
    } catch (e) {
      setError(String(e));
      setStep("paste-design");
    }
  }

  async function handleGenerateDeck() {
    if (!content.trim()) {
      setError("슬라이드 내용을 입력해 주세요.");
      return;
    }
    if (!pptDesign) return;
    setError(null);
    setSlides([]);
    setSlideProgress(0);
    setStep("generate-loading");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/generate-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pptDesign, content }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "생성 실패");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      const collected: Slide[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          try {
            const parsed = JSON.parse(payload);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.slide) {
              collected.push(parsed.slide);
              setSlideProgress(collected.length);
            }
            if (parsed.done) {
              setSlides(collected);
              setStep("deck-view");
            }
          } catch {
            // partial line, skip
          }
        }
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(String(e));
      setStep("paste-content");
    }
  }

  function handleReset() {
    setStep("paste-design");
    setDesignMd("");
    setPptDesign(null);
    setContent("");
    setSlides([]);
    setError(null);
  }

  // Deck view — full screen, no chrome
  if (step === "deck-view" && slides.length > 0 && pptDesign) {
    return <Deck slides={slides} design={pptDesign} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4 py-16">
      {/* Logo / Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-white">PPT</span>
          <span className="text-zinc-400"> Maker</span>
        </h1>
        <p className="mt-2 text-zinc-500 text-sm">
          브랜드 design.md → 전문 프레젠테이션
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator step={step} />

      {/* Panels */}
      <div className="w-full max-w-2xl mt-10">
        {/* Step 1: paste design.md */}
        {(step === "paste-design" || step === "transform-loading") && (
          <Panel title="① design.md 붙여넣기">
            <p className="text-zinc-400 text-sm mb-4">
              <a
                href="https://getdesign.md"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                getdesign.md
              </a>{" "}
              에서 원하는 브랜드의 DESIGN.md 파일 전체를 복사해 붙여넣으세요.
              <br />
              (MiniMax, Stripe, Anthropic, Linear, Tesla 등 71+ 브랜드)
            </p>
            <textarea
              className="w-full h-64 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-200 resize-none font-mono focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder={PLACEHOLDER_DESIGN_MD}
              value={designMd}
              onChange={(e) => setDesignMd(e.target.value)}
              disabled={step === "transform-loading"}
            />
            {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleTransformDesign}
              disabled={step === "transform-loading"}
              className="mt-4 w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {step === "transform-loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> {loadingMsg}
                </span>
              ) : (
                "디자인 분석하기 →"
              )}
            </button>
          </Panel>
        )}

        {/* Step 2: design preview */}
        {step === "design-preview" && pptDesign && (
          <Panel title="② 디자인 시스템 확인">
            <div className="mb-6">
              <p className="text-zinc-400 text-sm mb-4">
                <strong className="text-white">{pptDesign.brandName}</strong> 브랜드의 PPT
                디자인 시스템이 준비되었습니다.
              </p>

              {/* Color swatches */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: "Brand", color: pptDesign.colors.brandPrimary },
                  { label: "Accent", color: pptDesign.colors.accent },
                  { label: "BG", color: pptDesign.colors.background },
                  { label: "Surface", color: pptDesign.colors.surface },
                  ...pptDesign.colors.dataPalette.map((c, i) => ({
                    label: `Data ${i + 1}`,
                    color: c,
                  })),
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded-sm ring-1 ring-white/10"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-zinc-500 text-xs">{label}</span>
                  </div>
                ))}
              </div>

              {/* Font families */}
              <div className="text-zinc-400 text-sm space-y-1">
                <p>
                  <span className="text-zinc-600">헤딩:</span>{" "}
                  <span className="font-mono text-xs">{pptDesign.fontFamilies.heading}</span>
                </p>
                <p>
                  <span className="text-zinc-600">본문:</span>{" "}
                  <span className="font-mono text-xs">{pptDesign.fontFamilies.body}</span>
                </p>
              </div>

              {/* Design principles */}
              {pptDesign.designPrinciples.length > 0 && (
                <div className="mt-4 p-3 bg-zinc-900 rounded-lg">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">
                    디자인 원칙
                  </p>
                  <ul className="space-y-1">
                    {pptDesign.designPrinciples.map((p, i) => (
                      <li key={i} className="text-zinc-300 text-sm">
                        · {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep("paste-content")}
              className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 transition-all"
            >
              콘텐츠 입력하기 →
            </button>
            <button
              onClick={() => setStep("paste-design")}
              className="mt-2 w-full text-zinc-500 hover:text-white py-2 text-sm transition-colors"
            >
              ← 다른 design.md 사용
            </button>
          </Panel>
        )}

        {/* Step 3: paste content */}
        {step === "paste-content" && (
          <Panel title="③ 슬라이드 내용 입력">
            <p className="text-zinc-400 text-sm mb-4">
              슬라이드별로 내용을 작성하세요. 형식:{" "}
              <code className="text-zinc-300 bg-zinc-800 px-1 rounded text-xs">
                1장: 제목 / 내용
              </code>{" "}
              or{" "}
              <code className="text-zinc-300 bg-zinc-800 px-1 rounded text-xs">
                # 1. 제목
              </code>{" "}
              식이면 됩니다. 맥락을 잘 써줄수록 더 좋은 슬라이드가 나옵니다.
            </p>
            <textarea
              className="w-full h-80 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-200 resize-none font-mono focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder={PLACEHOLDER_CONTENT}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleGenerateDeck}
              className="mt-4 w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 transition-all"
            >
              슬라이드 생성하기 →
            </button>
            <button
              onClick={() => setStep("design-preview")}
              className="mt-2 w-full text-zinc-500 hover:text-white py-2 text-sm transition-colors"
            >
              ← 디자인 미리보기로
            </button>
          </Panel>
        )}

        {/* Step 4: generating */}
        {step === "generate-loading" && (
          <Panel title="④ 슬라이드 생성 중...">
            <div className="flex flex-col items-center py-12 gap-6">
              <div className="relative">
                <Spinner size={48} />
              </div>
              <div className="text-center">
                <p className="text-white font-medium">
                  AI가 콘텐츠 맥락을 분석하고 있습니다
                </p>
                <p className="text-zinc-500 text-sm mt-1">
                  {slideProgress > 0
                    ? `${slideProgress}개 슬라이드 준비 완료...`
                    : "전체 내용을 먼저 파악하고 최적 레이아웃을 결정합니다"}
                </p>
              </div>
              {slideProgress > 0 && (
                <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (slideProgress / 30) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
      <h2 className="text-lg font-semibold mb-6 text-zinc-100">{title}</h2>
      {children}
    </div>
  );
}

function StepIndicator({ step }: { step: WizardStep }) {
  const steps = [
    { id: "paste-design", label: "디자인" },
    { id: "design-preview", label: "확인" },
    { id: "paste-content", label: "콘텐츠" },
    { id: "generate-loading", label: "생성" },
    { id: "deck-view", label: "완료" },
  ];

  const activeIdx = steps.findIndex((s) => s.id === step);

  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div
            className={clsx(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
              i <= activeIdx
                ? "bg-white text-black"
                : "bg-zinc-800 text-zinc-500"
            )}
          >
            {i < activeIdx ? "✓" : i + 1}
          </div>
          <span
            className={clsx(
              "ml-1.5 text-xs hidden sm:inline",
              i <= activeIdx ? "text-zinc-300" : "text-zinc-600"
            )}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={clsx(
                "w-8 h-px mx-2",
                i < activeIdx ? "bg-white/40" : "bg-zinc-800"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
