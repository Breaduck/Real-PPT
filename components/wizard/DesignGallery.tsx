"use client";

import { useEffect, useState } from "react";
import type { PptDesignSystem, DesignSystemManifestItem } from "@/lib/types";
import type { Provider } from "@/lib/ai-providers";
import { CATALOG, type SlugMeta } from "@/config/design-systems";

interface Props {
  apiKey: string;
  provider: Provider;
  onSelect: (design: PptDesignSystem) => void;
  onNeedApiKey: () => void;
}

export default function DesignGallery({ apiKey, provider, onSelect, onNeedApiKey }: Props) {
  const [items, setItems] = useState<SlugMeta[]>(CATALOG);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      .catch(() => { /* ignore */ });
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
        대기업 디자인 시스템을 PPT 전용으로 변환합니다. 처음 클릭하면 자동 변환(약 10초), 이후는 캐시.
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
              <div className="mb-3">
                <BrandLogo meta={it} />
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

function BrandLogo({ meta }: { meta: SlugMeta }) {
  const [failed, setFailed] = useState(false);

  // 우선순위: logoOverride(정적 파일) > GH avatar
  const useOverride = !!meta.logoOverride;
  const size = meta.logoSize ?? 80;
  const src = useOverride
    ? meta.logoOverride!
    : `https://github.com/${meta.githubOrg}.png?size=${size}`;
  // GH avatar는 2x DPR 용 retina src도 같이 제공 (override는 SVG라 불필요)
  const srcSet = useOverride
    ? undefined
    : `${src} 1x, https://github.com/${meta.githubOrg}.png?size=${Math.max(size, 160)} 2x`;

  if (failed) {
    return (
      <div
        className="w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold text-white"
        style={{ backgroundColor: meta.primaryColor }}
        aria-label={meta.brandName}
      >
        {meta.brandName.charAt(0)}
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={`${meta.brandName} logo`}
      width={40}
      height={40}
      onError={() => setFailed(true)}
      className="w-10 h-10 rounded-md object-contain bg-white ring-1 ring-zinc-900/5 dark:ring-white/10"
    />
  );
}
