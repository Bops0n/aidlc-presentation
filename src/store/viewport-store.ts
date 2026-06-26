"use client";

import { create } from "zustand";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const MIN_SCALE = 0.15;
const MAX_SCALE = 2.5;

interface ViewportState {
  scale: number;
  isAutoFit: boolean;
  panX: number;
  panY: number;
  containerWidth: number;
  containerHeight: number;

  // Computed
  zoomPercent: number;

  // Actions
  setContainerSize: (w: number, h: number) => void;
  setZoom: (percent: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;
  setPan: (x: number, y: number) => void;
  adjustPan: (dx: number, dy: number) => void;
}

function calcFitScale(containerW: number, containerH: number): number {
  if (containerW === 0 || containerH === 0) return 1;
  const scaleX = (containerW - 96) / CANVAS_WIDTH;
  const scaleY = (containerH - 96) / CANVAS_HEIGHT;
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.min(scaleX, scaleY)));
}

export const useViewportStore = create<ViewportState>((set, get) => ({
  scale: 1,
  isAutoFit: true,
  panX: 0,
  panY: 0,
  containerWidth: 0,
  containerHeight: 0,
  zoomPercent: 100,

  setContainerSize: (w, h) => {
    const state = get();
    const newScale = state.isAutoFit ? calcFitScale(w, h) : state.scale;
    set({ containerWidth: w, containerHeight: h, scale: newScale, zoomPercent: Math.round(newScale * 100) });
  },

  setZoom: (percent) => {
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, percent / 100));
    set({ scale: newScale, isAutoFit: false, zoomPercent: Math.round(newScale * 100) });
  },

  zoomIn: () => {
    const { scale } = get();
    const newScale = Math.min(MAX_SCALE, scale + 0.1);
    set({ scale: newScale, isAutoFit: false, zoomPercent: Math.round(newScale * 100) });
  },

  zoomOut: () => {
    const { scale } = get();
    const newScale = Math.max(MIN_SCALE, scale - 0.1);
    set({ scale: newScale, isAutoFit: false, zoomPercent: Math.round(newScale * 100) });
  },

  fitToScreen: () => {
    const { containerWidth, containerHeight } = get();
    const newScale = calcFitScale(containerWidth, containerHeight);
    set({ scale: newScale, isAutoFit: true, panX: 0, panY: 0, zoomPercent: Math.round(newScale * 100) });
  },

  setPan: (x, y) => set({ panX: x, panY: y }),

  adjustPan: (dx, dy) => {
    const { panX, panY } = get();
    set({ panX: panX + dx, panY: panY + dy });
  },
}));

export const CANVAS_DIMENSIONS = { width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
