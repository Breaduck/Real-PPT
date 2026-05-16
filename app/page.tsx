"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { PptDesignSystem, Slide, WizardStep } from "@/lib/types";
import type { Provider } from "@/lib/ai-providers";
import Deck from "@/components/deck/Deck";
import DesignGallery from "@/components/wizard/DesignGallery";
import CompanyAnalyzePanel from "@/components/wizard/CompanyAnalyzePanel";

type DesignTab = "gallery" | "analyze" | "paste";
type Theme = "light" | "dark";

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
  const [tab, setTab] = useState<DesignTab>("gallery");
  const [designMd, setDesignMd] = useState("");
  const [pptDesign, setPptDesign] = useState<PptDesignSystem | null>(null);
  const [content, setContent] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [slideProgress, setSlideProgress] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const [provider, setProvider] = useState<Provider>("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // 테마: layout의 inline script가 html.dark class를 이미 설정했음
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedProvider = sessionStorage.getItem("ppt_provider") as Provider | null;
    const savedKey = sessionStorage.getItem("ppt_api_key");
    if (savedProvider) setProvider(savedProvider);
    if (savedKey) setApiKey(savedKey);

    const stored = localStorage.getItem("ppt_theme") as Theme | null;
    const initial: Theme = stored ?? (document.documentElement.classList.contains("dark") ? "dark" : "light");
    setTheme(initial);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ppt_theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  function saveSettings(p: Provider, k: string) {
    setProvider(p);
    setApiKey(k);
    sessionStorage.setItem("ppt_provider", p);
    sessionStorage.setItem("ppt_api_key", k);
    setShowSettings(false);
  }

  async function handleTransformDesign() {
    if (!designMd.trim()) { setError("design.md 내용을 붙여넣어 주세요."); return; }
    if (!apiKey.trim()) { setError("먼저 API 키를 입력해 주세요."); setShowSettings(true); return; }
    setError(null);
    setStep("transform-loading");

    try {
      const res = await fetch("/api/transform-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designMd, apiKey, provider }),
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

  async function handleAnalyzeCompany(url: string, files: File[]) {
    if (!apiKey.trim()) { setError("먼저 API 키를 입력해 주세요."); setShowSettings(true); return; }
    setError(null);
    setStep("analyze-loading");

    try {
      const form = new FormData();
      form.append("url", url);
      form.append("apiKey", apiKey);
      form.append("provider", provider);
      for (const f of files) form.append("files", f, f.name);

      const res = await fetch("/api/analyze-company", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "분석 실패");
      setPptDesign(data.pptDesign);
      setStep("design-preview");
    } catch (e) {
      setError(String(e));
      setStep("paste-design");
    }
  }

  function handleGallerySelect(ds: PptDesignSystem) {
    setError(null);
    setPptDesign(ds);
    setStep("design-preview");
  }

  async function handleGenerateDeck() {
    if (!content.trim()) { setError("슬라이드 내용을 입력해 주세요."); return; }
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
        body: JSON.stringify({ pptDesign, content, apiKey, provider }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) { const err = await res.json(); throw new Error(err.error ?? "생성 실패"); }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      const collected: Slide[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        for (const line of text.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.slide) { collected.push(parsed.slide); setSlideProgress(collected.length); }
            if (parsed.done) { setSlides(collected); setStep("deck-view"); }
          } catch { /* partial line */ }
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

  if (step === "deck-view" && slides.length > 0 && pptDesign) {
    return <Deck slides={slides} design={pptDesign} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white flex flex-col items-center justify-center px-4 py-16 transition-colors">
      {/* Top-right nav: 패턴 카탈로그 + 테마 토글 */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <Link
          href="/patterns"
          className="px-3 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center text-sm text-zinc-700 dark:text-zinc-300 transition-colors"
        >
          패턴 카탈로그
        </Link>
        <button
          onClick={toggleTheme}
          aria-label="테마 전환"
          className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          <span>PPT</span>
          <span className="text-zinc-500"> Maker</span>
        </h1>
        <p className="mt-2 text-zinc-500 text-sm">브랜드 design.md → 전문 프레젠테이션</p>
      </div>

      <StepIndicator step={step} />

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          provider={provider}
          apiKey={apiKey}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className="w-full max-w-2xl mt-10">
        {/* API 키 상태 표시 */}
        {!showSettings && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={clsx("w-2 h-2 rounded-full", apiKey ? "bg-green-500" : "bg-zinc-400 dark:bg-zinc-600")} />
              <span className="text-zinc-500 text-xs">
                {apiKey
                  ? `${provider === "anthropic" ? "Claude (Anthropic)" : "Gemini (Google)"} · ${apiKey.slice(0, 8)}...`
                  : "API 키 미설정"}
              </span>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-xs underline transition-colors"
            >
              {apiKey ? "변경" : "API 키 입력"}
            </button>
          </div>
        )}

        {/* Step 1 — 3-tab design source */}
        {(step === "paste-design" ||
          step === "transform-loading" ||
          step === "analyze-loading") && (
          <Panel title="① 디자인 시스템 선택">
            <div className="flex gap-1 mb-5 border-b border-zinc-200 dark:border-zinc-800">
              {([
                { id: "gallery", label: "갤러리", hint: "사전 빌드된 회사" },
                { id: "analyze", label: "내 회사 분석", hint: "URL + PPT 업로드" },
                { id: "paste", label: "직접 붙여넣기", hint: "design.md 텍스트" },
              ] as const).map(({ id, label, hint }) => (
                <button
                  key={id}
                  onClick={() => { setTab(id); setError(null); }}
                  disabled={step !== "paste-design"}
                  className={clsx(
                    "px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px disabled:opacity-50",
                    tab === id
                      ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                  )}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{hint}</div>
                </button>
              ))}
            </div>

            {step === "analyze-loading" && (
              <div className="flex flex-col items-center py-10 gap-4">
                <Spinner size={40} />
                <div className="text-center">
                  <p className="font-medium">회사 디자인 시스템 생성 중...</p>
                  <p className="text-zinc-500 text-sm mt-1">홈페이지와 첨부 파일 분석 → 톤앤매너 합성</p>
                </div>
              </div>
            )}

            {step === "transform-loading" && (
              <div className="flex flex-col items-center py-10 gap-4">
                <Spinner size={40} />
                <div className="text-center">
                  <p className="font-medium">디자인 분석 중...</p>
                  <p className="text-zinc-500 text-sm mt-1">design.md를 PPT 전용 토큰으로 변환합니다</p>
                </div>
              </div>
            )}

            {step === "paste-design" && tab === "gallery" && (
              <DesignGallery
                apiKey={apiKey}
                provider={provider}
                onSelect={handleGallerySelect}
                onNeedApiKey={() => setShowSettings(true)}
              />
            )}

            {step === "paste-design" && tab === "analyze" && (
              <CompanyAnalyzePanel
                busy={false}
                error={error}
                onAnalyze={handleAnalyzeCompany}
              />
            )}

            {step === "paste-design" && tab === "paste" && (
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                  <a href="https://getdesign.md" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-900 dark:hover:text-white">
                    getdesign.md
                  </a>{" "}
                  에서 원하는 브랜드의 DESIGN.md를 복사해 붙여넣으세요.
                </p>
                <textarea
                  className="w-full h-64 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 resize-none font-mono focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder={PLACEHOLDER_DESIGN_MD}
                  value={designMd}
                  onChange={(e) => setDesignMd(e.target.value)}
                />
                {error && <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{error}</p>}
                <button
                  onClick={handleTransformDesign}
                  className="mt-4 w-full bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold py-3 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all"
                >
                  디자인 분석하기 →
                </button>
              </div>
            )}
          </Panel>
        )}

        {/* Step 2: preview */}
        {step === "design-preview" && pptDesign && (
          <Panel title="② 디자인 시스템 확인">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
              <strong className="text-zinc-900 dark:text-white">{pptDesign.brandName}</strong> PPT 디자인 시스템 준비 완료.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: "Brand", color: pptDesign.colors.brandPrimary },
                { label: "Accent", color: pptDesign.colors.accent },
                { label: "BG", color: pptDesign.colors.background },
                { label: "Surface", color: pptDesign.colors.surface },
                ...pptDesign.colors.dataPalette.map((c, i) => ({ label: `Data ${i + 1}`, color: c })),
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-sm ring-1 ring-zinc-900/10 dark:ring-white/10" style={{ backgroundColor: color }} />
                  <span className="text-zinc-500 text-xs">{label}</span>
                </div>
              ))}
            </div>
            <div className="text-zinc-600 dark:text-zinc-400 text-sm space-y-1 mb-4">
              <p><span className="text-zinc-400 dark:text-zinc-600">헤딩:</span> <span className="font-mono text-xs">{pptDesign.fontFamilies.heading}</span></p>
              <p><span className="text-zinc-400 dark:text-zinc-600">본문:</span> <span className="font-mono text-xs">{pptDesign.fontFamilies.body}</span></p>
            </div>
            {pptDesign.designPrinciples.length > 0 && (
              <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-6">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">디자인 원칙</p>
                <ul className="space-y-1">
                  {pptDesign.designPrinciples.map((p, i) => (
                    <li key={i} className="text-zinc-700 dark:text-zinc-300 text-sm">· {p}</li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={() => setStep("paste-content")} className="w-full bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold py-3 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all">
              콘텐츠 입력하기 →
            </button>
            <button onClick={() => setStep("paste-design")} className="mt-2 w-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white py-2 text-sm transition-colors">
              ← 다른 design.md 사용
            </button>
          </Panel>
        )}

        {/* Step 3 */}
        {step === "paste-content" && (
          <Panel title="③ 슬라이드 내용 입력">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
              슬라이드별 내용을 자유롭게 작성하세요.{" "}
              <code className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-xs">1장: 제목 / 내용</code>{" "}
              형식을 권장합니다. 많이 쓸수록 좋은 슬라이드가 나옵니다.
            </p>
            <textarea
              className="w-full h-80 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 resize-none font-mono focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder={PLACEHOLDER_CONTENT}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {error && <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{error}</p>}
            <button onClick={handleGenerateDeck} className="mt-4 w-full bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold py-3 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all">
              슬라이드 생성하기 →
            </button>
            <button onClick={() => setStep("design-preview")} className="mt-2 w-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white py-2 text-sm transition-colors">
              ← 디자인 미리보기로
            </button>
          </Panel>
        )}

        {/* Step 4: generating */}
        {step === "generate-loading" && (
          <Panel title="④ 슬라이드 생성 중...">
            <div className="flex flex-col items-center py-12 gap-6">
              <Spinner size={48} />
              <div className="text-center">
                <p className="font-medium">AI가 콘텐츠 맥락을 분석 중입니다</p>
                <p className="text-zinc-500 text-sm mt-1">
                  {slideProgress > 0 ? `${slideProgress}개 슬라이드 준비 완료...` : "전체 내용을 파악하고 최적 레이아웃을 결정합니다"}
                </p>
              </div>
              {slideProgress > 0 && (
                <div className="w-64 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-300"
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

// ---- Settings Modal ----

function SettingsModal({
  provider: initProvider,
  apiKey: initKey,
  onSave,
  onClose,
}: {
  provider: Provider;
  apiKey: string;
  onSave: (p: Provider, k: string) => void;
  onClose: () => void;
}) {
  const [p, setP] = useState<Provider>(initProvider);
  const [k, setK] = useState(initKey);

  const placeholder = p === "anthropic" ? "sk-ant-api03-..." : "AIza...";
  const helpUrl = p === "anthropic"
    ? "https://console.anthropic.com/settings/keys"
    : "https://aistudio.google.com/app/apikey";

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-6">API 설정</h2>

        <div className="mb-5">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">AI 모델 선택</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: "anthropic", label: "Claude (Anthropic)", badge: "추천", sub: "Opus 4.7 · 가장 정확" },
              { id: "gemini", label: "Gemini (Google)", badge: "저렴", sub: "2.5 Pro · 빠르고 경제적" },
            ] as const).map(({ id, label, badge, sub }) => (
              <button
                key={id}
                onClick={() => setP(id)}
                className={clsx(
                  "p-4 rounded-xl border text-left transition-all",
                  p === id
                    ? "border-zinc-900 dark:border-white bg-zinc-100 dark:bg-white/5"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{label.split(" ")[0]}</span>
                  <span className={clsx(
                    "text-xs px-1.5 py-0.5 rounded",
                    id === "anthropic" ? "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" : "bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                  )}>
                    {badge}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs">{sub}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="text-zinc-600 dark:text-zinc-400 text-sm mb-2 block">API 키</label>
          <input
            type="password"
            value={k}
            onChange={(e) => setK(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 font-mono focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
          />
        </div>
        <a
          href={helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 text-xs underline hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          → API 키 발급하러 가기
        </a>

        <div className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <p className="text-zinc-500 text-xs">
            키는 이 브라우저 세션에만 저장됩니다. 서버에 저장되지 않습니다.
            슬라이드 30장 생성 비용: Claude ~$0.10–0.30 / Gemini ~$0.03–0.10
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-500 transition-all text-sm"
          >
            취소
          </button>
          <button
            onClick={() => onSave(p, k)}
            className="flex-1 py-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all text-sm"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Shared ----

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm dark:shadow-none">
      <h2 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-zinc-100">{title}</h2>
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
  const normalizedStep: WizardStep =
    step === "analyze-loading" || step === "transform-loading"
      ? "paste-design"
      : step;
  const activeIdx = steps.findIndex((s) => s.id === normalizedStep);
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className={clsx(
            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
            i <= activeIdx
              ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
              : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
          )}>
            {i < activeIdx ? "✓" : i + 1}
          </div>
          <span className={clsx(
            "ml-1.5 text-xs hidden sm:inline",
            i <= activeIdx ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400 dark:text-zinc-600"
          )}>
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div className={clsx("w-8 h-px mx-2", i < activeIdx ? "bg-zinc-700/40 dark:bg-white/40" : "bg-zinc-200 dark:bg-zinc-800")} />
          )}
        </div>
      ))}
    </div>
  );
}

function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
