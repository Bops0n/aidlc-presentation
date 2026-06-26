"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const MIN_SCALE = 0.15;
const MAX_SCALE = 2.5;
const PADDING = 96;

interface CanvasScaleState {
  scale: number;
  isAutoFit: boolean;
  panX: number;
  panY: number;
}

export function useCanvasScale() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CanvasScaleState>({
    scale: 1,
    isAutoFit: true,
    panX: 0,
    panY: 0,
  });

  // Calculate auto-fit scale based on container size
  const calculateFitScale = useCallback(() => {
    if (!containerRef.current) return 1;
    const { clientWidth, clientHeight } = containerRef.current;
    const scaleX = (clientWidth - PADDING) / CANVAS_WIDTH;
    const scaleY = (clientHeight - PADDING) / CANVAS_HEIGHT;
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.min(scaleX, scaleY)));
  }, []);

  // Auto-fit on resize
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (state.isAutoFit) {
        setState((prev) => ({ ...prev, scale: calculateFitScale() }));
      }
    });

    observer.observe(containerRef.current);
    // Initial calculation
    setState((prev) => ({ ...prev, scale: calculateFitScale() }));

    return () => observer.disconnect();
  }, [calculateFitScale, state.isAutoFit]);

  // Manual zoom (15% to 250%)
  const setZoom = useCallback((percent: number) => {
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, percent / 100));
    setState((prev) => ({ ...prev, scale: newScale, isAutoFit: false }));
  }, []);

  // Fit to screen
  const fitToScreen = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scale: calculateFitScale(),
      isAutoFit: true,
      panX: 0,
      panY: 0,
    }));
  }, [calculateFitScale]);

  // Pan (Ctrl+drag or middle-click drag)
  const setPan = useCallback((x: number, y: number) => {
    setState((prev) => ({ ...prev, panX: x, panY: y }));
  }, []);

  const adjustPan = useCallback((deltaX: number, deltaY: number) => {
    setState((prev) => ({
      ...prev,
      panX: prev.panX + deltaX,
      panY: prev.panY + deltaY,
    }));
  }, []);

  // Zoom in/out by step
  const zoomIn = useCallback(() => {
    setState((prev) => {
      const newScale = Math.min(MAX_SCALE, prev.scale + 0.1);
      return { ...prev, scale: newScale, isAutoFit: false };
    });
  }, []);

  const zoomOut = useCallback(() => {
    setState((prev) => {
      const newScale = Math.max(MIN_SCALE, prev.scale - 0.1);
      return { ...prev, scale: newScale, isAutoFit: false };
    });
  }, []);

  // Zoom percentage for display
  const zoomPercent = Math.round(state.scale * 100);

  return {
    containerRef,
    scale: state.scale,
    isAutoFit: state.isAutoFit,
    panX: state.panX,
    panY: state.panY,
    zoomPercent,
    setZoom,
    zoomIn,
    zoomOut,
    fitToScreen,
    setPan,
    adjustPan,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
  };
}
