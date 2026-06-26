"use client";

import { forwardRef } from "react";
import type { Slide } from "@/types";
import { ElementRenderer } from "./element-renderer";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;

interface PdfExportRendererProps {
  slides: Slide[];
}

function getSlideBackground(slide: Slide): React.CSSProperties {
  if (slide.backgroundType === "color") {
    return { backgroundColor: slide.backgroundValue || "#ffffff" };
  }
  if (slide.backgroundType === "gradient") {
    return { background: slide.backgroundValue };
  }
  if (slide.backgroundType === "image") {
    return {
      backgroundImage: `url(${slide.backgroundValue})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: "#ffffff" };
}

/**
 * Hidden offscreen renderer that mounts every slide at exact 960×540
 * (no scale transform) so html2canvas can capture pixel-perfect pages.
 * Each slide node carries a data-slide-index for the export routine.
 */
export const PdfExportRenderer = forwardRef<HTMLDivElement, PdfExportRendererProps>(
  function PdfExportRenderer({ slides }, ref) {
    return (
      <div
        ref={ref}
        style={{
          position: "fixed",
          left: "-99999px",
          top: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            data-slide-index={index}
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              position: "relative",
              overflow: "hidden",
              ...getSlideBackground(slide),
            }}
          >
            {slide.elements.map((element) => (
              <div
                key={element.id}
                style={{
                  position: "absolute",
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  transform: `rotate(${element.rotation}deg)`,
                  opacity: element.opacity / 100,
                }}
              >
                <ElementRenderer element={element} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
);
