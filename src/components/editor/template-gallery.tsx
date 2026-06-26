"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import {
  templateDefinitions,
  type TemplateDefinition,
} from "@/data/templates";
import { themePresets } from "@/data/themes";
import type { Slide, TextElement, Element } from "@/types";

interface TemplateGalleryProps {
  onClose: () => void;
}

const categories = [
  "all",
  "marketing",
  "business",
  "developer",
  "creative",
  "education",
  "minimal",
] as const;

export function TemplateGallery({ onClose }: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const setSlides = useEditorStore((s) => s.setSlides);

  const filteredTemplates = templateDefinitions.filter(
    (t) => activeCategory === "all" || t.category === activeCategory
  );

  const applyTemplate = (template: TemplateDefinition) => {
    const theme = themePresets.find((t) => t.name === template.themeName);

    const slides: Slide[] = template.slides.map((tSlide) => ({
      id: crypto.randomUUID(),
      backgroundType: tSlide.backgroundType,
      backgroundValue: tSlide.backgroundValue,
      transitionMode: "none",
      notes: "",
      elements: tSlide.elements.map((el) => {
        const baseElement = {
          id: crypto.randomUUID(),
          x: el.x,
          y: el.y,
          width: el.width,
          height: el.height,
          rotation: 0,
          opacity: 100,
          animation: "none" as const,
          animationDelay: 0,
        };

        if (el.type === "text") {
          return {
            ...baseElement,
            type: "text" as const,
            content: el.content ?? "Text",
            fontSize: el.fontSize ?? 22,
            fontFamily: theme
              ? el.role === "title"
                ? theme.headingFont
                : theme.bodyFont
              : "Inter",
            fontWeight: el.fontWeight ?? "400",
            lineHeight: 1.3,
            color: theme ? theme.textColor : "#1f2937",
            textAlign: el.textAlign ?? "left",
          } satisfies TextElement;
        }

        // Default: return as shape placeholder for image/shape roles
        return {
          ...baseElement,
          type: "shape" as const,
          shapeType: "rectangle" as const,
          fillColor: theme ? theme.accentColor : "#e5e7eb",
          strokeColor: "transparent",
          strokeWidth: 0,
        } as Element;
      }),
    }));

    setSlides(slides);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-[900px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Template Gallery
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Close template gallery"
          >
            ✕
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-gray-100 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-full capitalize whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-4">
            {filteredTemplates.map((template, idx) => (
              <TemplateCard
                key={`${template.name}-${idx}`}
                template={template}
                onApply={() => applyTemplate(template)}
              />
            ))}
          </div>
          {filteredTemplates.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No templates in this category
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onApply,
}: {
  template: TemplateDefinition;
  onApply: () => void;
}) {
  const theme = themePresets.find((t) => t.name === template.themeName);
  const firstSlide = template.slides[0];

  return (
    <button
      onClick={onApply}
      className="group rounded-lg border border-gray-200 overflow-hidden hover:ring-2 hover:ring-blue-400 hover:shadow-md transition-all text-left"
    >
      {/* Mini preview of first slide */}
      <div
        className="relative w-full aspect-video"
        style={{
          background: firstSlide?.backgroundValue ?? "#ffffff",
        }}
      >
        {firstSlide?.elements.slice(0, 3).map((el, i) => (
          <div
            key={i}
            className="absolute overflow-hidden"
            style={{
              left: `${(el.x / 960) * 100}%`,
              top: `${(el.y / 540) * 100}%`,
              width: `${(el.width / 960) * 100}%`,
              height: `${(el.height / 540) * 100}%`,
            }}
          >
            {el.type === "text" && (
              <span
                className="block truncate leading-tight"
                style={{
                  fontSize: `${Math.max(6, (el.fontSize ?? 20) * 0.18)}px`,
                  fontWeight: el.fontWeight ?? "400",
                  color: theme?.textColor ?? "#1f2937",
                }}
              >
                {el.content}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="px-3 py-2">
        <div className="text-xs font-medium text-gray-800 truncate">
          {template.name}
        </div>
        <div className="text-[10px] text-gray-500 mt-0.5 truncate">
          {template.slides.length} slides • {template.category}
        </div>
      </div>
    </button>
  );
}
