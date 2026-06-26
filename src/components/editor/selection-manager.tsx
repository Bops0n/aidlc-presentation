"use client";

import { useCallback, useState, MouseEvent as ReactMouseEvent } from "react";
import type { Element } from "@/types";
import { useEditorStore } from "@/store/editor-store";
import { TransformHandles } from "./transform-handles";
import { InlineTextEditor } from "./inline-text-editor";

interface SelectionManagerProps {
  element: Element;
  children: React.ReactNode;
}

export function SelectionManager({ element, children }: SelectionManagerProps) {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const selectElement = useEditorStore((s) => s.selectElement);
  const isSelected = selectedElementId === element.id;
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  }, [element.id, selectElement]);

  const handleDoubleClick = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    if (element.type === "text") {
      setIsEditing(true);
    }
  }, [element.type]);

  const handleCloseEditor = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <div
      className="absolute"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.opacity / 100,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Show inline editor when editing text */}
      {isEditing && element.type === "text" ? (
        <InlineTextEditor
          element={element}
          onClose={handleCloseEditor}
        />
      ) : (
        children
      )}

      {/* Show transform handles when selected (but not editing) */}
      {isSelected && !isEditing && <TransformHandles element={element} />}
    </div>
  );
}
