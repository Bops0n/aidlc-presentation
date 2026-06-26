"use client";

import type { TextElement } from "@/types";

interface TextElementViewProps {
  element: TextElement;
}

export function TextElementView({ element }: TextElementViewProps) {
  return (
    <div
      className="w-full h-full overflow-hidden select-none pointer-events-none"
      style={{
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight,
        color: element.color,
        textAlign: element.textAlign,
        lineHeight: element.lineHeight,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {element.content}
    </div>
  );
}
