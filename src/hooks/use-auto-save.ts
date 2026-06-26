"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/store/editor-store";

export function useAutoSave(presentationId: string) {
  const slides = useEditorStore((s) => s.slides);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip first render (initial load)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Debounce save — 2 seconds after last change
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setSaveStatus("saving");
    timeoutRef.current = setTimeout(async () => {
      try {
        // Bulk save all slides (handles create + update + delete)
        const res = await fetch(
          `/api/presentations/${presentationId}/save`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slides: slides.map((slide, index) => ({
                id: slide.id,
                order: index,
                background_type: slide.backgroundType,
                background_value: slide.backgroundValue,
                transition_mode: slide.transitionMode,
                notes: slide.notes || "",
                elements: slide.elements,
              })),
            }),
          }
        );

        if (!res.ok) throw new Error("Save failed");
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [slides, presentationId]);

  return { saveStatus };
}
