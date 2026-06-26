"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useViewportStore, CANVAS_DIMENSIONS } from "@/store/viewport-store";
import { useEditorStore, getActiveSlide } from "@/store/editor-store";
import { ElementRenderer } from "./element-renderer";
import { SelectionManager } from "./selection-manager";

export function CanvasViewport() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scale = useViewportStore((s) => s.scale);
  const panX = useViewportStore((s) => s.panX);
  const panY = useViewportStore((s) => s.panY);
  const setContainerSize = useViewportStore((s) => s.setContainerSize);
  const adjustPan = useViewportStore((s) => s.adjustPan);

  const selectElement = useEditorStore((s) => s.selectElement);
  const activeSlide = useEditorStore(getActiveSlide);

  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number } | null>(null);

  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = CANVAS_DIMENSIONS;

  // ResizeObserver for auto-fit
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize(width, height);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [setContainerSize]);

  // Native wheel event to prevent browser zoom and handle canvas zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleNativeWheel = (e: WheelEvent) => {
      // Always prevent default when Ctrl is held (blocks browser zoom)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        const currentPercent = useViewportStore.getState().zoomPercent;
        const delta = e.deltaY > 0 ? -5 : 5;
        useViewportStore.getState().setZoom(
          Math.max(15, Math.min(250, currentPercent + delta))
        );
      }
    };

    // Must use { passive: false } to allow preventDefault
    el.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleNativeWheel);
  }, []);

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Ctrl+drag or middle-click for panning
      if (e.ctrlKey || e.metaKey || e.button === 1) {
        e.preventDefault();
        setIsPanning(true);
        panStartRef.current = { x: e.clientX, y: e.clientY };
        return;
      }
    },
    []
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isPanning || !panStartRef.current) return;
      const deltaX = e.clientX - panStartRef.current.x;
      const deltaY = e.clientY - panStartRef.current.y;
      panStartRef.current = { x: e.clientX, y: e.clientY };
      adjustPan(deltaX / scale, deltaY / scale);
    },
    [isPanning, adjustPan, scale]
  );

  const handleCanvasMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
    }
  }, [isPanning]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        selectElement(null);
      }
    },
    [selectElement]
  );

  if (!activeSlide) {
    return (
      <div ref={containerRef} className="flex-1 flex items-center justify-center bg-gray-100">
        <p className="text-gray-400">No slide selected</p>
      </div>
    );
  }

  const backgroundStyle: React.CSSProperties = {};
  if (activeSlide.backgroundType === "color") {
    backgroundStyle.backgroundColor = activeSlide.backgroundValue || "#ffffff";
  } else if (activeSlide.backgroundType === "gradient") {
    backgroundStyle.background = activeSlide.backgroundValue;
  } else if (activeSlide.backgroundType === "image") {
    backgroundStyle.backgroundImage = `url(${activeSlide.backgroundValue})`;
    backgroundStyle.backgroundSize = "cover";
    backgroundStyle.backgroundPosition = "center";
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden flex items-center justify-center bg-gray-100 relative"
      style={{ cursor: isPanning ? "grabbing" : "default" }}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
    >
      <div
        style={{
          transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
          transformOrigin: "center center",
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          flexShrink: 0,
        }}
      >
        <div
          className="relative shadow-xl rounded-sm"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            ...backgroundStyle,
          }}
          onMouseDown={handleCanvasMouseDown}
          onClick={handleCanvasClick}
        >
          {activeSlide.elements.map((element) => (
            <SelectionManager key={element.id} element={element}>
              <ElementRenderer element={element} />
            </SelectionManager>
          ))}
        </div>
      </div>
    </div>
  );
}
