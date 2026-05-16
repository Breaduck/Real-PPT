"use client";

import { useEffect, useState } from "react";
import type { PptDesignSystem, DesignSystemManifestItem } from "@/lib/types";
import type { Provider } from "@/lib/ai-providers";
import { CATALOG, type SlugMeta } from "@/config/design-systems";
import GalleryPreviewModal from "./GalleryPreviewModal";

interface Props {
  apiKey: string;
  provider: Provider;
  onSelect: (design: PptDesignSystem) => void;
  onNeedApiKey: () => void;
}

export default function DesignGallery({ apiKey, provider, onSelect, onNeedApiKey }: Props) {
  const [items, setItems] = useState<SlugMeta[]>(CATALOG);
  const [previewMeta, setPreviewMeta] = useState<SlugMeta | null>(null);
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

  async function confirmAndConvert(meta: SlugMeta) {
    if (!apiKey.trim()) {
      onNeedApiKey();
      return;
    }
    setLoadingSlug(meta.slug);
    setError(null);
    try {
      const res = await fetch("/api/transform-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: meta.slug, apiKey, provider }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "디자인 시스템 변환 실패");
      setPreviewMeta(null);
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
        대기업 디자인 시스템을 PPT 전용으로 변환합니다. 클릭하면 4장 예시를 먼저 확인할 수 있어요.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((it) => (
          <button
            key={it.slug}
            onClick={() => { setError(null); setPreviewMeta(it); }}
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
              {it.slug}
            </p>
          </button>
        ))}
      </div>
      {error && <p className="mt-3 text-red-500 dark:text-red-400 text-sm">{error}</p>}

      {previewMeta && (
        <GalleryPreviewModal
          meta={previewMeta}
          loading={loadingSlug === previewMeta.slug}
          onClose={() => setPreviewMeta(null)}
          onConfirm={() => confirmAndConvert(previewMeta)}
        />
      )}
    </div>
  );
}

function BrandLogo({ meta }: { meta: SlugMeta }) {
  const [failed, setFailed] = useState(false);
  const useOverride = !!meta.logoOverride;
  const size = meta.logoSize ?? 80;
  const src = useOverride
    ? meta.logoOverride!
    : `https://github.com/${meta.githubOrg}.png?size=${size}`;
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
