"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/editor-store";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when in input/textarea/contenteditable
      const target = e.target as HTMLElement;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        target?.isContentEditable ||
        target?.closest("[contenteditable]")
      ) {
        return;
      }

      const state = useEditorStore.getState();

      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        state.undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        state.redo();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (state.selectedElementId) {
          e.preventDefault();
          state.removeElement(state.selectedElementId);
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        if (state.selectedElementId) {
          e.preventDefault();
          state.duplicateElement(state.selectedElementId);
        }
        return;
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
}
