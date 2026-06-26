"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import { themePresets, type ThemePreset } from "@/data/themes";
import type { Slide, TextElement, ShapeElement, Element } from "@/types";

interface ThemePanelProps {
  onClose: () => void;
}

export function ThemePanel({ onClose }: ThemePanelProps) {
  const [filter, setFilter] = useState<"all" | "light" | "dark">("all");
  const slides = useEditorStore((s) => s.slides);
  const setSlides = useEditorStore((s) => s.setSlides);

  const filteredThemes = themePresets.filter((t) => {
    if (filter === "light") return !t.isDark;
    if (filter === "dark") return t.isDark;
    return true;
  });

  const applyTheme = (theme: ThemePreset) => {
    const updatedSlides: Slide[] = slides.map((slide) => ({
      ...slide,
      backgroundType: "color" as const,
      backgroundValue: theme.backgroundColor,
      elements: slide.elements.map((el) => {
        if (el.type === "text") {
          const textEl = el as TextElement;
          const isHeading = textEl.fontSize >= 36;
          return {
            ...textEl,
            color: textEl.color === theme.accentColor
              ? theme.accentColor
              : theme.textColor,
            fontFamily: isHeading
              ? theme.headingFont
              : theme.bodyFont,
          } as Element;
        }
        if (el.type === "shape") {
          const shapeEl = el as ShapeElement;
          return {
            ...shapeEl,
            fillColor: theme.accentColor,
            strokeColor: theme.accentColor,
          } as Element;
        }
        return el;
      }),
    }));
    setSlides(updatedSlides);
  };

  return (
    <div className="w-72 border-l border-gray-200 bg-white overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Themes</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
          aria-label="Close theme panel"
        >
          ✕
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-2 border-b border-gray-100">
        {(["all", "light", "dark"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
              filter === f
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Theme grid */}
      <div className="p-3 grid grid-cols-2 gap-2 flex-1">
        {filteredThemes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => applyTheme(theme)}
            className="group rounded-lg border border-gray-200 overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all"
            title={theme.name}
          >
            <div
              className="h-16 relative flex items-center justify-center"
              style={{ backgroundColor: theme.backgroundColor }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: theme.textColor }}
              >
                Aa
              </span>
              <div
                className="absolute bottom-1 right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
            </div>
            <div className="px-2 py-1.5 bg-gray-50">
              <span className="text-[10px] text-gray-600 font-medium truncate block">
                {theme.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
