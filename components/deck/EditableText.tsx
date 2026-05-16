"use client";

import { useRef, type CSSProperties } from 'react';
import { useEditContext } from '@/contexts/EditContext';

type Tag = 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'blockquote';

interface Props {
  id: string;
  children?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
  tag?: Tag;
}

export default function EditableText({ id, children, style, className, tag = 'span' }: Props) {
  const ctx = useEditContext();

  const overrideText = ctx?.getOverrideText(id);
  const overrideStyle = ctx?.getOverrideStyle(id) ?? {};
  const displayContent = overrideText !== undefined ? overrideText : children;

  const Tag = tag as React.ElementType;

  if (!ctx?.editMode) {
    return (
      <Tag style={{ ...style, ...overrideStyle }} className={className}>
        {displayContent}
      </Tag>
    );
  }

  const { offsetX, offsetY } = ctx.getOffset(id);
  const isSelected = ctx.selectedId === id;

  const editStyle: CSSProperties = {
    ...style,
    ...overrideStyle,
    transform: `translate(${offsetX}px, ${offsetY}px)`,
    position: 'relative',
    outline: isSelected
      ? '2px solid rgba(99, 102, 241, 0.9)'
      : '1px dashed rgba(99, 102, 241, 0.3)',
    outlineOffset: '3px',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'outline 0.1s',
  };

  return (
    <Tag
      style={editStyle}
      className={className}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        ctx.selectElement(id);
      }}
    >
      {displayContent}
      <DragHandle id={id} />
    </Tag>
  );
}

function DragHandle({ id }: { id: string }) {
  const ctx = useEditContext()!;
  const startMouse = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    ctx.selectElement(id);
    const { offsetX, offsetY } = ctx.getOffset(id);
    startMouse.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { x: offsetX, y: offsetY };

    function onMove(ev: MouseEvent) {
      ctx.updateOffset(
        id,
        startOffset.current.x + ev.clientX - startMouse.current.x,
        startOffset.current.y + ev.clientY - startMouse.current.y,
      );
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  return (
    <span
      onMouseDown={onMouseDown}
      title="드래그해서 이동"
      style={{
        position: 'absolute',
        top: -10,
        left: -10,
        width: 18,
        height: 18,
        background: 'rgba(99, 102, 241, 0.9)',
        borderRadius: 3,
        cursor: 'grab',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        color: 'white',
        userSelect: 'none',
        zIndex: 1000,
        lineHeight: 1,
        pointerEvents: 'all',
      }}
    >
      ⠿
    </span>
  );
}
