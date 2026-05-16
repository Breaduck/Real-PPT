"use client";

import { useEffect, useState } from "react";
import type { PptDesignSystem, DesignSystemManifestItem } from "@/lib/types";

interface Props {
  onSelect: (design: PptDesignSystem) => void;
}

export default function DesignGallery({ onSelect }: Props) {
  const [items, setItems] = useState<DesignSystemManifestItem[] | null>(null);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/design-systems/index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: DesignSystemManifestItem[]) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  async function pick(slug: string) {
    setLoadingSlug(slug);
    setError(null);
    try {
      const res = await fetch(`/design-systems/${slug}.json`);
      if (!res.ok) throw new Error(`디자인 시스템을 불러올 수 없습니다: ${slug}`);
      const ds = (await res.json()) as PptDesignSystem;
      onSelect(ds);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoadingSlug(null);
    }
  }

  if (items === null) {
    return <p className="text-zinc-500 text-sm">갤러리를 불러오는 중...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 text-center">
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          아직 사전 빌드된 디자인 시스템이 없습니다.
        </p>
        <p className="text-zinc-400 dark:text-zinc-600 text-xs mt-2">
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">npm run build:design-systems</code> 실행 후 새로고침하세요.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
        대기업 디자인 시스템을 PPT 전용으로 변환했습니다. 클릭하면 바로 슬라이드 생성 단계로 이동합니다.
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
                {busy ? "불러오는 중..." : it.slug}
              </p>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-3 text-red-500 dark:text-red-400 text-sm">{error}</p>}
    </div>
  );
}
