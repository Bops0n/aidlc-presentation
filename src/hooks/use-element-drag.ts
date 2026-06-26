"use client";

import { useCallback, useRef } from "react";
import { useEditorStore } from "@/store/editor-store";

export function useElementDrag(elementId: string) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const dragData = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null);

  const startDrag = useCallback((e: React.MouseEvent, currentX: number, currentY: number) => {
    e.stopPropagation();
    e.preventDefault();
    dragData.current = { startX: e.clientX, startY: e.clientY, elX: currentX, elY: currentY };

    const onMove = (ev: MouseEvent) => {
      if (!dragData.current) return;
      const dx = ev.clientX - dragData.current.startX;
      const dy = ev.clientY - dragData.current.startY;
      updateElement(elementId, {
        x: dragData.current.elX + dx,
        y: dragData.current.elY + dy,
      });
    };

    const onUp = () => {
      dragData.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [elementId, updateElement]);

  return { startDrag };
}
