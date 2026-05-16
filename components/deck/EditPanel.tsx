"use client";

import type { CSSProperties } from 'react';
import { useEditContext } from '@/contexts/EditContext';
import type { Slide } from '@/lib/types';

interface Props {
  slide: Slide;
  onClose: () => void;
}

const FONT_FAMILIES = [
  { label: '브랜드 폰트 (기본값)', value: '' },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Georgia', value: "'Georgia', serif" },
  { label: 'Arial / Helvetica', value: "'Arial', Helvetica, sans-serif" },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'System UI', value: 'system-ui, sans-serif' },
  { label: 'Palatino', value: "'Palatino Linotype', serif" },
  { label: 'Trebuchet MS', value: "'Trebuchet MS', sans-serif" },
];

const FONT_WEIGHTS = [
  { label: 'Thin — 100', value: '100' },
  { label: 'Light — 300', value: '300' },
  { label: 'Regular — 400', value: '400' },
  { label: 'Medium — 500', value: '500' },
  { label: 'SemiBold — 600', value: '600' },
  { label: 'Bold — 700', value: '700' },
  { label: 'ExtraBold — 800', value: '800' },
  { label: 'Black — 900', value: '900' },
];

type FieldDef = { id: string; label: string; multiline: boolean; value: string | undefined };

function getFields(slide: Slide): FieldDef[] {
  switch (slide.layoutId) {
    case 'cover':
      return [
        { id: 'kicker', label: '키커 (상단 레이블)', multiline: false, value: slide.kicker },
        { id: 'title', label: '제목', multiline: true, value: slide.title },
        { id: 'subtitle', label: '부제목', multiline: true, value: slide.subtitle },
        { id: 'date', label: '날짜', multiline: false, value: slide.date },
      ];
    case 'section-divider':
      return [
        { id: 'chapterTitle', label: '챕터 제목', multiline: true, value: slide.chapterTitle },
        { id: 'chapterSubtitle', label: '챕터 설명', multiline: true, value: slide.chapterSubtitle },
      ];
    case 'title-body':
      return [
        { id: 'eyebrow', label: '아이브로우', multiline: false, value: slide.eyebrow },
        { id: 'title', label: '제목', multiline: true, value: slide.title },
        { id: 'body', label: '본문', multiline: true, value: slide.body },
      ];
    case 'title-bullets':
      return [
        { id: 'eyebrow', label: '아이브로우', multiline: false, value: slide.eyebrow },
        { id: 'title', label: '제목', multiline: true, value: slide.title },
        ...slide.bullets.flatMap((b, i) => [
          { id: `bullet-${i}`, label: `불릿 ${i + 1}`, multiline: false, value: b.text },
          ...(b.subtext !== undefined
            ? [{ id: `bullet-${i}-sub`, label: `불릿 ${i + 1} 설명`, multiline: false, value: b.subtext }]
            : []),
        ]),
      ];
    case 'two-column-compare':
      return [
        ...(slide.title !== undefined
          ? [{ id: 'title', label: '제목', multiline: true, value: slide.title }]
          : []),
        { id: 'leftLabel', label: '왼쪽 레이블', multiline: false, value: slide.leftLabel },
        ...slide.leftItems.map((item, i) => ({
          id: `left-${i}`, label: `왼쪽 항목 ${i + 1}`, multiline: false, value: item,
        })),
        { id: 'rightLabel', label: '오른쪽 레이블', multiline: false, value: slide.rightLabel },
        ...slide.rightItems.map((item, i) => ({
          id: `right-${i}`, label: `오른쪽 항목 ${i + 1}`, multiline: false, value: item,
        })),
      ];
    case 'big-stat':
      return [
        { id: 'eyebrow', label: '아이브로우', multiline: false, value: slide.eyebrow },
        { id: 'stat', label: '핵심 수치', multiline: false, value: slide.stat },
        { id: 'unit', label: '단위', multiline: false, value: slide.unit },
        { id: 'caption', label: '캡션', multiline: false, value: slide.caption },
        { id: 'context', label: '부가 설명', multiline: true, value: slide.context },
      ];
    case 'quote':
      return [
        { id: 'quote', label: '인용문', multiline: true, value: slide.quote },
        { id: 'attribution', label: '출처 (이름)', multiline: false, value: slide.attribution },
        { id: 'role', label: '직함 / 역할', multiline: false, value: slide.role },
      ];
    case 'timeline':
      return [
        { id: 'title', label: '제목', multiline: true, value: slide.title },
        ...slide.steps.flatMap((s, i) => [
          { id: `step-${i}-label`, label: `단계 ${i + 1} 레이블`, multiline: false, value: s.label },
          ...(s.description !== undefined
            ? [{ id: `step-${i}-desc`, label: `단계 ${i + 1} 설명`, multiline: false, value: s.description }]
            : []),
        ]),
      ];
    case 'image-caption':
      return [
        { id: 'title', label: '제목', multiline: false, value: slide.title },
        { id: 'caption', label: '캡션', multiline: true, value: slide.caption },
      ];
    case 'closing':
      return [
        { id: 'headline', label: '헤드라인', multiline: true, value: slide.headline },
        { id: 'subheadline', label: '서브 헤드라인', multiline: false, value: slide.subheadline },
        { id: 'ctaLabel', label: 'CTA 버튼 텍스트', multiline: false, value: slide.ctaLabel },
        { id: 'ctaDetail', label: 'CTA 상세', multiline: false, value: slide.ctaDetail },
      ];
    default:
      return [];
  }
}

export default function EditPanel({ slide, onClose }: Props) {
  const ctx = useEditContext();
  if (!ctx) return null;

  const fields = getFields(slide);
  const selectedId = ctx.selectedId;
  const selectedStyle = selectedId ? (ctx.getOverrideStyle(selectedId) ?? {}) : null;
  const selectedOffset = selectedId ? ctx.getOffset(selectedId) : null;

  function handleStyleChange(key: keyof CSSProperties, value: string) {
    if (!selectedId) return;
    ctx.updateStyle(selectedId, { ...(selectedStyle ?? {}), [key]: value || undefined });
  }

  const hasPosition = selectedOffset && (selectedOffset.offsetX !== 0 || selectedOffset.offsetY !== 0);

  return (
    <div style={{
      width: 272,
      flexShrink: 0,
      background: '#18181b',
      borderLeft: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontSize: 12,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '11px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <span style={{ color: '#e4e4e7', fontSize: 13, fontWeight: 600 }}>편집 패널</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 2px' }}
        >
          ×
        </button>
      </div>

      {/* Slide info */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <span style={{ background: 'rgba(99,102,241,0.15)', borderRadius: 5, padding: '3px 8px', fontSize: 11, color: '#818cf8', fontFamily: 'monospace' }}>
          {slide.layoutId}
        </span>
        <span style={{ marginLeft: 8, color: '#52525b', fontSize: 11 }}>슬라이드 {slide.slideNumber}</span>
      </div>

      {/* Scrollable body */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '14px' }}>

        {/* ── TEXT FIELDS ── */}
        <SectionLabel>텍스트</SectionLabel>
        {fields.map(field => {
          if (field.value === undefined && !['title', 'headline', 'quote', 'stat', 'caption', 'chapterTitle', 'body'].includes(field.id)) return null;
          const current = ctx.getOverrideText(field.id) ?? field.value ?? '';
          const isSelected = selectedId === field.id;

          return (
            <div key={field.id} style={{ marginBottom: 10 }}>
              <label style={{
                display: 'block',
                fontSize: 10,
                fontWeight: 600,
                color: isSelected ? '#818cf8' : '#52525b',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {field.label}
              </label>
              {field.multiline ? (
                <textarea
                  value={current}
                  onChange={e => ctx.updateText(field.id, e.target.value)}
                  onFocus={() => ctx.selectElement(field.id)}
                  rows={3}
                  style={{
                    ...textareaBase,
                    border: isSelected ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    background: isSelected ? 'rgba(99,102,241,0.08)' : '#27272a',
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={current}
                  onChange={e => ctx.updateText(field.id, e.target.value)}
                  onFocus={() => ctx.selectElement(field.id)}
                  style={{
                    ...inputBase,
                    border: isSelected ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    background: isSelected ? 'rgba(99,102,241,0.08)' : '#27272a',
                  }}
                />
              )}
            </div>
          );
        })}

        {/* ── STYLE CONTROLS ── */}
        {selectedId && (
          <>
            <Divider />
            <SectionLabel>스타일 · <span style={{ color: '#818cf8' }}>{selectedId}</span></SectionLabel>

            <ControlRow label="폰트">
              <select
                value={selectedStyle?.fontFamily ?? ''}
                onChange={e => handleStyleChange('fontFamily', e.target.value)}
                style={selectBase}
              >
                {FONT_FAMILIES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </ControlRow>

            <ControlRow label="굵기">
              <select
                value={String(selectedStyle?.fontWeight ?? '')}
                onChange={e => handleStyleChange('fontWeight', e.target.value)}
                style={selectBase}
              >
                <option value="">기본값</option>
                {FONT_WEIGHTS.map(w => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </ControlRow>

            <ControlRow label="크기">
              <input
                type="text"
                placeholder="예: 32px  /  2rem"
                value={selectedStyle?.fontSize ?? ''}
                onChange={e => handleStyleChange('fontSize', e.target.value)}
                style={inputBase}
              />
            </ControlRow>

            <ControlRow label="색상">
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="color"
                  value={toHex(selectedStyle?.color) ?? '#ffffff'}
                  onChange={e => handleStyleChange('color', e.target.value)}
                  style={{ width: 34, height: 28, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 2, background: '#27272a' }}
                />
                <input
                  type="text"
                  value={selectedStyle?.color ?? ''}
                  onChange={e => handleStyleChange('color', e.target.value)}
                  placeholder="hex / rgb / 기본값"
                  style={{ ...inputBase, flex: 1 }}
                />
              </div>
            </ControlRow>

            <ControlRow label="자간">
              <input
                type="text"
                placeholder="예: 0.05em"
                value={selectedStyle?.letterSpacing ?? ''}
                onChange={e => handleStyleChange('letterSpacing', e.target.value)}
                style={inputBase}
              />
            </ControlRow>

            <ControlRow label="줄 높이">
              <input
                type="text"
                placeholder="예: 1.4"
                value={String(selectedStyle?.lineHeight ?? '')}
                onChange={e => handleStyleChange('lineHeight', e.target.value)}
                style={inputBase}
              />
            </ControlRow>

            <button
              onClick={() => ctx.updateStyle(selectedId, {})}
              style={resetBtn}
            >
              스타일 초기화
            </button>
          </>
        )}

        {/* ── POSITION ── */}
        {selectedId && (
          <>
            <Divider />
            <SectionLabel>위치 (드래그 오프셋)</SectionLabel>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={microLabel}>X (px)</label>
                <input
                  type="number"
                  value={Math.round(selectedOffset?.offsetX ?? 0)}
                  onChange={e => ctx.updateOffset(selectedId, Number(e.target.value), selectedOffset?.offsetY ?? 0)}
                  style={inputBase}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={microLabel}>Y (px)</label>
                <input
                  type="number"
                  value={Math.round(selectedOffset?.offsetY ?? 0)}
                  onChange={e => ctx.updateOffset(selectedId, selectedOffset?.offsetX ?? 0, Number(e.target.value))}
                  style={inputBase}
                />
              </div>
            </div>
            {hasPosition && (
              <button
                onClick={() => ctx.updateOffset(selectedId, 0, 0)}
                style={resetBtn}
              >
                위치 초기화
              </button>
            )}
          </>
        )}

        {!selectedId && (
          <p style={{ color: '#3f3f46', marginTop: 12, lineHeight: 1.6 }}>
            슬라이드에서 요소를 클릭하면 스타일을 편집할 수 있습니다.
          </p>
        )}

      </div>

      {/* Footer hint */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <p style={{ fontSize: 10, color: '#3f3f46', lineHeight: 1.7, margin: 0 }}>
          슬라이드 요소 클릭 → 스타일 편집<br />
          ⠿ 핸들 드래그 → 위치 이동
        </p>
      </div>
    </div>
  );
}

// ── sub-components ──

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, marginTop: 0 }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 0' }} />;
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <label style={microLabel}>{label}</label>
      {children}
    </div>
  );
}

// ── styles ──

const microLabel: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  color: '#71717a',
  marginBottom: 4,
};

const inputBase: React.CSSProperties = {
  width: '100%',
  background: '#27272a',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 5,
  padding: '6px 9px',
  color: '#e4e4e7',
  fontSize: 12,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const textareaBase: React.CSSProperties = {
  width: '100%',
  background: '#27272a',
  borderRadius: 5,
  padding: '6px 9px',
  color: '#e4e4e7',
  fontSize: 12,
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  lineHeight: 1.5,
};

const selectBase: React.CSSProperties = {
  width: '100%',
  background: '#27272a',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 5,
  padding: '6px 9px',
  color: '#e4e4e7',
  fontSize: 12,
  outline: 'none',
  cursor: 'pointer',
};

const resetBtn: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 5,
  padding: '6px 0',
  color: '#71717a',
  cursor: 'pointer',
  fontSize: 11,
  marginBottom: 8,
};

function toHex(color: string | undefined): string | undefined {
  if (!color) return undefined;
  if (color.startsWith('#') && (color.length === 4 || color.length === 7)) return color;
  return undefined;
}
