"use client";

import { useCallback } from "react";
import { useEditorStore } from "@/store/editor-store";
import type { Slide } from "@/types";

export function SlideThumbnails() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlideId = useEditorStore((s) => s.activeSlideId);
  const setActiveSlide = useEditorStore((s) => s.setActiveSlide);
  const addSlide = useEditorStore((s) => s.addSlide);
  const removeSlide = useEditorStore((s) => s.removeSlide);

  const handleAddSlide = useCallback(() => {
    const newSlide: Slide = {
      id: crypto.randomUUID(),
      backgroundType: "color",
      backgroundValue: "#ffffff",
      elements: [],
      transitionMode: "none",
      notes: "",
    };
    addSlide(newSlide);
  }, [addSlide]);

  const handleDuplicate = useCallback(
    (slide: Slide) => {
      const duplicate: Slide = {
        ...JSON.parse(JSON.stringify(slide)),
        id: crypto.randomUUID(),
      };
      addSlide(duplicate);
    },
    [addSlide]
  );

  return (
    <div className="w-52 border-r border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
      <div className="p-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Slides</span>
        <button
          onClick={handleAddSlide}
          className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700"
        >
          + Add
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`group relative cursor-pointer rounded border-2 transition-colors ${
              activeSlideId === slide.id
                ? "border-blue-500"
                : "border-transparent hover:border-gray-300"
            }`}
            onClick={() => setActiveSlide(slide.id)}
          >
            {/* Thumbnail */}
            <div
              className="w-full aspect-video rounded overflow-hidden"
              style={{
                backgroundColor:
                  slide.backgroundType === "color"
                    ? slide.backgroundValue
                    : "#fff",
                ...(slide.backgroundType === "gradient" && {
                  background: slide.backgroundValue,
                }),
              }}
            >
              <div
                className="w-full h-full relative"
                style={{
                  transform: "scale(0.2)",
                  transformOrigin: "top left",
                  width: 960,
                  height: 540,
                }}
              >
                {slide.elements.map((el) => (
                  <div
                    key={el.id}
                    className="absolute bg-gray-200/50"
                    style={{
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: el.height,
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Slide number */}
            <div className="absolute bottom-0.5 left-1 text-[10px] text-gray-500 font-medium">
              {index + 1}
            </div>
            {/* Context actions */}
            <div className="absolute top-0.5 right-0.5 hidden group-hover:flex gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicate(slide);
                }}
                className="w-4 h-4 text-[8px] bg-white rounded shadow flex items-center justify-center hover:bg-gray-100"
                title="Duplicate"
              >
                📋
              </button>
              {slides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSlide(slide.id);
                  }}
                  className="w-4 h-4 text-[8px] bg-white rounded shadow flex items-center justify-center hover:bg-red-50"
                  title="Delete"
                >
                  🗑
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
