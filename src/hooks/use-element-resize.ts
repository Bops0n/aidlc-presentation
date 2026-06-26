"use client";

import { useCallback, useRef } from "react";
import { useEditorStore } from "@/store/editor-store";

const MIN_SIZE = 20;

export type ResizeDirection = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export function useElementResize(elementId: string) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const resizeData = useRef<{
    startX: number; startY: number;
    elX: number; elY: number;
    elW: number; elH: number;
    dir: ResizeDirection;
  } | null>(null);

  const startResize = useCallback((
    e: React.MouseEvent,
    dir: ResizeDirection,
    currentX: number, currentY: number,
    currentW: number, currentH: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    resizeData.current = { startX: e.clientX, startY: e.clientY, elX: currentX, elY: currentY, elW: currentW, elH: currentH, dir };

    const onMove = (ev: MouseEvent) => {
      if (!resizeData.current) return;
      const r = resizeData.current;
      const dx = ev.clientX - r.startX;
      const dy = ev.clientY - r.startY;

      let newX = r.elX, newY = r.elY, newW = r.elW, newH = r.elH;

      if (dir.includes("e")) newW = Math.max(MIN_SIZE, r.elW + dx);
      if (dir.includes("w")) { newW = Math.max(MIN_SIZE, r.elW - dx); newX = r.elX + (r.elW - newW); }
      if (dir.includes("s")) newH = Math.max(MIN_SIZE, r.elH + dy);
      if (dir.includes("n")) { newH = Math.max(MIN_SIZE, r.elH - dy); newY = r.elY + (r.elH - newH); }

      updateElement(elementId, { x: newX, y: newY, width: newW, height: newH });
    };

    const onUp = () => {
      resizeData.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [elementId, updateElement]);

  return { startResize };
}
