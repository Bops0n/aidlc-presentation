"use client";

import { useCallback, useRef, MouseEvent as ReactMouseEvent } from "react";
import type { Element } from "@/types";
import { useEditorStore } from "@/store/editor-store";

interface TransformHandlesProps {
  element: Element;
}

type HandlePosition = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const HANDLE_SIZE = 8;
const MIN_SIZE = 20;

const handlePositions: Record<HandlePosition, { top: string; left: string; cursor: string }> = {
  nw: { top: "-4px", left: "-4px", cursor: "nwse-resize" },
  n: { top: "-4px", left: "calc(50% - 4px)", cursor: "ns-resize" },
  ne: { top: "-4px", left: "calc(100% - 4px)", cursor: "nesw-resize" },
  e: { top: "calc(50% - 4px)", left: "calc(100% - 4px)", cursor: "ew-resize" },
  se: { top: "calc(100% - 4px)", left: "calc(100% - 4px)", cursor: "nwse-resize" },
  s: { top: "calc(100% - 4px)", left: "calc(50% - 4px)", cursor: "ns-resize" },
  sw: { top: "calc(100% - 4px)", left: "-4px", cursor: "nesw-resize" },
  w: { top: "calc(50% - 4px)", left: "-4px", cursor: "ew-resize" },
};

export function TransformHandles({ element }: TransformHandlesProps) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const dragStart = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null);
  const resizeStart = useRef<{ startX: number; startY: number; elX: number; elY: number; elW: number; elH: number; handle: HandlePosition } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  // --- DRAG ---
  const handleDragStart = useCallback((e: ReactMouseEvent) => {
    if (e.target !== e.currentTarget) return;
    e.stopPropagation();
    e.preventDefault();
    dragStart.current = { startX: e.clientX, startY: e.clientY, elX: element.x, elY: element.y };

    const onMove = (ev: globalThis.MouseEvent) => {
      if (!dragStart.current) return;
      const dx = ev.clientX - dragStart.current.startX;
      const dy = ev.clientY - dragStart.current.startY;
      updateElement(element.id, {
        x: dragStart.current.elX + dx,
        y: dragStart.current.elY + dy,
      });
    };

    const onUp = () => {
      dragStart.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [element.id, element.x, element.y, updateElement]);

  // --- RESIZE ---
  const handleResizeStart = useCallback((handle: HandlePosition, e: ReactMouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    resizeStart.current = {
      startX: e.clientX,
      startY: e.clientY,
      elX: element.x,
      elY: element.y,
      elW: element.width,
      elH: element.height,
      handle,
    };

    const onMove = (ev: globalThis.MouseEvent) => {
      if (!resizeStart.current) return;
      const r = resizeStart.current;
      const dx = ev.clientX - r.startX;
      const dy = ev.clientY - r.startY;

      let newX = r.elX, newY = r.elY, newW = r.elW, newH = r.elH;

      if (handle.includes("e")) { newW = Math.max(MIN_SIZE, r.elW + dx); }
      if (handle.includes("w")) { newW = Math.max(MIN_SIZE, r.elW - dx); newX = r.elX + (r.elW - newW); }
      if (handle.includes("s")) { newH = Math.max(MIN_SIZE, r.elH + dy); }
      if (handle.includes("n")) { newH = Math.max(MIN_SIZE, r.elH - dy); newY = r.elY + (r.elH - newH); }

      updateElement(element.id, { x: newX, y: newY, width: newW, height: newH });
    };

    const onUp = () => {
      resizeStart.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [element.id, element.x, element.y, element.width, element.height, updateElement]);

  // --- ROTATE (fixed: use getBoundingClientRect for screen center) ---
  const handleRotateStart = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Get the element's visual center on screen using getBoundingClientRect
    const parentEl = elementRef.current?.parentElement;
    if (!parentEl) return;

    const rect = parentEl.getBoundingClientRect();
    const screenCenterX = rect.left + rect.width / 2;
    const screenCenterY = rect.top + rect.height / 2;

    // Store initial angle to calculate relative rotation
    const startAngle = Math.atan2(
      e.clientY - screenCenterY,
      e.clientX - screenCenterX
    ) * (180 / Math.PI);
    const startRotation = element.rotation;

    const onMove = (ev: globalThis.MouseEvent) => {
      const currentAngle = Math.atan2(
        ev.clientY - screenCenterY,
        ev.clientX - screenCenterX
      ) * (180 / Math.PI);

      const deltaAngle = currentAngle - startAngle;
      let newRotation = startRotation + deltaAngle;

      // Normalize to 0-360
      newRotation = ((newRotation % 360) + 360) % 360;

      updateElement(element.id, { rotation: Math.round(newRotation) });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [element.id, element.rotation, updateElement]);

  return (
    <div ref={elementRef}>
      {/* Drag overlay */}
      <div
        className="absolute inset-0 border-2 border-blue-500 cursor-move"
        onMouseDown={handleDragStart}
      />

      {/* Resize handles */}
      {(Object.entries(handlePositions) as [HandlePosition, typeof handlePositions[HandlePosition]][]).map(
        ([pos, style]) => (
          <div
            key={pos}
            className="absolute bg-white border-2 border-blue-500 z-10 rounded-sm"
            style={{
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              top: style.top,
              left: style.left,
              cursor: style.cursor,
            }}
            onMouseDown={(e) => handleResizeStart(pos, e)}
          />
        )
      )}

      {/* Rotate handle */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-10 w-6 h-6 rounded-full bg-blue-500 border-2 border-white cursor-grab z-10 flex items-center justify-center shadow-md hover:bg-blue-600 active:cursor-grabbing"
        onMouseDown={handleRotateStart}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M21 12a9 9 0 1 1-3-6.7" />
          <path d="M21 3v5h-5" />
        </svg>
      </div>
      {/* Line connecting rotate handle to element */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-7 w-px h-5 bg-blue-400" />
    </div>
  );
}
