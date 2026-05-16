"use client";

import { createContext, useContext, type CSSProperties } from 'react';

export interface EditContextValue {
  editMode: boolean;
  slideIndex: number;
  selectedId: string | null;
  selectElement: (id: string) => void;
  getOverrideText: (id: string) => string | undefined;
  getOverrideStyle: (id: string) => CSSProperties | undefined;
  getOffset: (id: string) => { offsetX: number; offsetY: number };
  updateText: (id: string, text: string) => void;
  updateStyle: (id: string, style: CSSProperties) => void;
  updateOffset: (id: string, x: number, y: number) => void;
}

export const EditContext = createContext<EditContextValue | null>(null);

export function useEditContext(): EditContextValue | null {
  return useContext(EditContext);
}
