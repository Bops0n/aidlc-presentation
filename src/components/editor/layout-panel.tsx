"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import { layoutPresets, type LayoutPreset } from "@/data/layouts";
import { applyLayoutToElements } from "@/lib/layout-engine";
import type { Element } from "@/types";
import { produce } from "immer";

interface LayoutPanelProps {
  onClose: () => void;
}

const categories = [
  "universal",
  "marketing",
  "business",
  "developer",
  "creative",
  "education",
] as const;

export function LayoutPanel({ onClose }: LayoutPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>("universal");
  const slides = useEditorStore((s) => s.slides);
  const activeSlideId = useEditorStore((s) => s.activeSlideId);
  const setSlides = useEditorStore((s) => s.setSlides);

  const filteredLayouts = layoutPresets.filter(
    (l) => l.category === activeCategory
  );

  const applyLayout = (layout: LayoutPreset) => {
    if (!activeSlideId) return;

    const updatedSlides = produce(slides, (draft) => {
      const slide = draft.find((s) => s.id === activeSlideId);
      if (slide) {
        slide.elements = applyLayoutToElements(
          slide.elements as Element[],
          layout
        ) as Element[];
      }
    });

    setSlides(updatedSlides);
  };

  return (
    <div className="w-72 border-l border-gray-200 bg-white overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Layouts</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
          aria-label="Close layout panel"
        >
          ✕
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 py-1 text-[10px] rounded-full capitalize transition-colors ${
              activeCategory === cat
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Layout grid */}
      <div className="p-3 grid grid-cols-2 gap-2 flex-1">
        {filteredLayouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => applyLayout(layout)}
            className="group rounded-lg border border-gray-200 overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all"
            title={layout.name}
          >
            {/* Mini preview */}
            <div className="relative w-full aspect-video bg-gray-50">
              {layout.positions.map((pos, i) => (
                <div
                  key={i}
                  className="absolute rounded-sm"
                  style={{
                    left: `${(pos.x / 960) * 100}%`,
                    top: `${(pos.y / 540) * 100}%`,
                    width: `${(pos.width / 960) * 100}%`,
                    height: `${(pos.height / 540) * 100}%`,
                    backgroundColor:
                      pos.role === "title"
                        ? "#6366f1"
                        : pos.role === "subtitle"
                        ? "#a5b4fc"
                        : pos.role === "image"
                        ? "#d1d5db"
                        : pos.role === "chart"
                        ? "#86efac"
                        : pos.role === "accent"
                        ? "#fbbf24"
                        : "#c7d2fe",
                    opacity: 0.7,
                  }}
                />
              ))}
              {layout.positions.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-[10px]">
                  Blank
                </div>
              )}
            </div>
            <div className="px-2 py-1.5 bg-gray-50">
              <span className="text-[10px] text-gray-600 font-medium truncate block">
                {layout.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
