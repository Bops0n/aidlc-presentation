"use client";

import { useCallback } from "react";
import { useEditorStore } from "@/store/editor-store";

export function useElementRotate(elementId: string) {
  const updateElement = useEditorStore((s) => s.updateElement);

  const startRotate = useCallback((
    e: React.MouseEvent,
    centerX: number,
    centerY: number
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const onMove = (ev: MouseEvent) => {
      const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * (180 / Math.PI) + 90;
      updateElement(elementId, { rotation: Math.round(angle) });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [elementId, updateElement]);

  return { startRotate };
}
