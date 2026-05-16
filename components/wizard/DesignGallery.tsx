"use client";

import { useEffect, useState } from "react";
import type { PptDesignSystem, DesignSystemManifestItem } from "@/lib/types";
import type { Provider } from "@/lib/ai-providers";
import { CATALOG } from "@/config/design-systems";

interface Props {
  apiKey: string;
  provider: Provider;
  onSelect: (design: PptDesignSystem) => void;
  onNeedApiKey: () => void;
}

type Item = {
  slug: string;
  brandName: string;
  primaryColor: string;
  accentColor: string;
};

export default function DesignGallery({ apiKey, provider, onSelect, onNeedApiKey }: Props) {
  const [items, setItems] = useState<Item[]>(
    // CATALOG 기반으로 즉시 표시 (fetch 결과 기다리지 않음)
    CATALOG.map((c) => ({ ...c }))
  );
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 매니페스트(빌드된 디자인 시스템)가 있으면 색상 덮어쓰기
  useEffect(() => {
    fetch("/design-systems/index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((manifest: DesignSystemManifestItem[]) => {
        if (!Array.isArray(manifest) || manifest.length === 0) return;
        setItems((prev) =>
          prev.map((it) => {
            const built = manifest.find((m) => m.slug === it.slug);
            return built
              ? { ...it, brandName: built.brandName, primaryColor: built.primaryColor, accentColor: built.accentColor }
              : it;
          })
        );
      })
      .catch(() => { /* manifest 없어도 OK — CATALOG로 표시 */ });
  }, []);

  async function pick(slug: string) {
    if (!apiKey.trim()) {
      onNeedApiKey();
      return;
    }
    setLoadingSlug(slug);
    setError(null);
    try {
      const res = await fetch("/api/transform-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, apiKey, provider }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "디자인 시스템 변환 실패");
      onSelect(data.pptDesign as PptDesignSystem);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoadingSlug(null);
    }
  }

  return (
    <div>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
        대기업 디자인 시스템을 PPT 전용으로 변환합니다. 처음 클릭하면 자동으로 변환(약 10초), 이후는 캐시.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((it) => {
          const busy = loadingSlug === it.slug;
          return (
            <button
              key={it.slug}
              onClick={() => pick(it.slug)}
              disabled={loadingSlug !== null}
              className="group bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-500 rounded-xl p-4 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded-sm ring-1 ring-zinc-900/10 dark:ring-white/10"
                  style={{ backgroundColor: it.primaryColor }}
                />
                <div
                  className="w-5 h-5 rounded-sm ring-1 ring-zinc-900/10 dark:ring-white/10"
                  style={{ backgroundColor: it.accentColor }}
                />
              </div>
              <p className="text-zinc-900 dark:text-zinc-100 text-sm font-semibold truncate">
                {it.brandName}
              </p>
              <p className="text-zinc-400 dark:text-zinc-600 text-xs mt-0.5">
                {busy ? "변환 중..." : it.slug}
              </p>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-3 text-red-500 dark:text-red-400 text-sm">{error}</p>}
    </div>
  );
}
