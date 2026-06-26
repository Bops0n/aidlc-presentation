"use client";

import type { Element } from "@/types";
import { TextElementView } from "./elements/text-element";
import { ImageElementView } from "./elements/image-element";
import { ShapeElementView } from "./elements/shape-element";
import { ChartElementView } from "./elements/chart-element";

interface ElementRendererProps {
  element: Element;
}

export function ElementRenderer({ element }: ElementRendererProps) {
  switch (element.type) {
    case "text":
      return <TextElementView element={element} />;
    case "image":
      return <ImageElementView element={element} />;
    case "shape":
      return <ShapeElementView element={element} />;
    case "chart":
      return <ChartElementView element={element} />;
    case "icon":
      return (
        <div className="flex h-full w-full items-center justify-center text-4xl">
          ⭐
        </div>
      );
    case "video":
      return (
        <div className="flex h-full w-full items-center justify-center bg-black text-white text-sm">
          ▶ Video
        </div>
      );
    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 text-gray-400 text-sm">
          Unknown
        </div>
      );
  }
}
