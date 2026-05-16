import type { CSSProperties } from 'react';

export interface ElementEdit {
  text?: string;
  style?: CSSProperties;
  offsetX?: number;
  offsetY?: number;
}

export type SlideEdits = Record<string, ElementEdit>;
export type DeckEdits = Record<number, SlideEdits>;
