"use client";

import type { ImageElement } from "@/types";

interface ImageElementViewProps {
  element: ImageElement;
}

export function ImageElementView({ element }: ImageElementViewProps) {
  return (
    <div className="w-full h-full overflow-hidden pointer-events-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={element.src}
        alt=""
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover select-none"
        draggable={false}
      />
    </div>
  );
}
