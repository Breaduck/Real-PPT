"use client";

import { useState, useRef, type DragEvent } from "react";
import clsx from "clsx";

interface Props {
  busy: boolean;
  error: string | null;
  onAnalyze: (url: string, files: File[]) => void;
}

const MAX_FILES = 10;
const ALLOWED_EXT = [".pdf", ".pptx"];

function isAllowed(file: File): boolean {
  const name = file.name.toLowerCase();
  return ALLOWED_EXT.some((ext) => name.endsWith(ext));
}

export default function CompanyAnalyzePanel({ busy, error, onAnalyze }: Props) {
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(incoming: FileList | File[]) {
    setLocalError(null);
    const next = [...files];
    for (const f of Array.from(incoming)) {
      if (!isAllowed(f)) {
        setLocalError(`지원하지 않는 형식입니다: ${f.name} (PDF/PPTX만 가능)`);
        continue;
      }
      if (next.length >= MAX_FILES) {
        setLocalError(`최대 ${MAX_FILES}개까지 업로드 가능합니다.`);
        break;
      }
      if (!next.some((x) => x.name === f.name && x.size === f.size)) {
        next.push(f);
      }
    }
    setFiles(next);
  }

  function removeAt(idx: number) {
    setFiles(files.filter((_, i) => i !== idx));
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }

  function submit() {
    if (!url.trim()) {
      setLocalError("홈페이지 URL을 입력해 주세요.");
      return;
    }
    onAnalyze(url.trim(), files);
  }

  return (
    <div>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
        회사 홈페이지 URL과 (선택) 자주 쓰는 PPT 파일을 업로드하면 자동으로 회사 맞춤 디자인 시스템을 만들어 드립니다.
      </p>

      <label className="block text-zinc-500 text-xs uppercase tracking-wider mb-2">
        회사 홈페이지 URL <span className="text-red-500 dark:text-red-400">*</span>
      </label>
      <input
        type="url"
        placeholder="https://anthropic.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={busy}
        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 mb-5 focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
      />

      <label className="block text-zinc-500 text-xs uppercase tracking-wider mb-2">
        자주 쓰는 PPT 파일 (선택, 최대 {MAX_FILES}개 · PDF/PPTX)
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "w-full border-2 border-dashed rounded-lg px-6 py-8 text-center cursor-pointer transition-all",
          dragOver
            ? "border-zinc-900 dark:border-white bg-zinc-100 dark:bg-white/5"
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 bg-zinc-50 dark:bg-zinc-900"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.pptx"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          disabled={busy}
        />
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          파일을 여기에 드래그하거나 클릭해 선택
        </p>
        <p className="text-zinc-400 dark:text-zinc-600 text-xs mt-1">
          PPT가 없어도 홈페이지만으로 분석 가능
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-xs">
              <span className="text-zinc-700 dark:text-zinc-300 truncate">
                <span className="text-zinc-500">
                  {f.name.toLowerCase().endsWith(".pdf") ? "PDF" : "PPTX"}
                </span>
                {" · "}
                {f.name}
                <span className="text-zinc-400 dark:text-zinc-600 ml-2">
                  {(f.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeAt(i); }}
                className="text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-2"
                disabled={busy}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {(error || localError) && (
        <p className="mt-3 text-red-500 dark:text-red-400 text-sm">{error ?? localError}</p>
      )}

      <button
        onClick={submit}
        disabled={busy}
        className="mt-5 w-full bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold py-3 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {busy ? "분석 중..." : "회사 디자인 시스템 생성하기 →"}
      </button>
    </div>
  );
}
