import { create } from "zustand";
import { produce } from "immer";
import type { Slide, Element } from "@/types";

const MAX_HISTORY = 50;

interface EditorHistoryEntry {
  slides: Slide[];
  activeSlideId: string | null;
}

interface EditorState {
  // State
  slides: Slide[];
  activeSlideId: string | null;
  selectedElementId: string | null;

  // History
  past: EditorHistoryEntry[];
  future: EditorHistoryEntry[];

  // Computed
  canUndo: boolean;
  canRedo: boolean;

  // Slide actions
  setSlides: (slides: Slide[]) => void;
  setActiveSlide: (slideId: string) => void;
  addSlide: (slide: Slide) => void;
  removeSlide: (slideId: string) => void;
  updateSlideBackground: (slideId: string, type: string, value: string) => void;
  reorderSlides: (slideIds: string[]) => void;

  // Element actions
  selectElement: (elementId: string | null) => void;
  addElement: (element: Element) => void;
  updateElement: (elementId: string, updates: Partial<Element>) => void;
  removeElement: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;

  // History actions
  undo: () => void;
  redo: () => void;

  // Internal
  _pushHistory: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  slides: [],
  activeSlideId: null,
  selectedElementId: null,
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  // --- Internal ---

  _pushHistory: () => {
    const { slides, activeSlideId, past } = get();
    const entry: EditorHistoryEntry = {
      slides: JSON.parse(JSON.stringify(slides)),
      activeSlideId,
    };
    const newPast = [...past, entry].slice(-MAX_HISTORY);
    set({ past: newPast, future: [], canUndo: true, canRedo: false });
  },

  // --- Slide actions ---

  setSlides: (slides) => {
    get()._pushHistory();
    set((state) => {
      // Preserve current active slide if it still exists in the new slides;
      // otherwise fall back to the first slide.
      const stillExists =
        state.activeSlideId &&
        slides.some((s) => s.id === state.activeSlideId);
      const activeSlideId = stillExists
        ? state.activeSlideId
        : slides.length > 0
        ? slides[0].id
        : null;
      return { slides, activeSlideId };
    });
  },

  setActiveSlide: (slideId) => {
    set({ activeSlideId: slideId, selectedElementId: null });
  },

  addSlide: (slide) => {
    get()._pushHistory();
    set((state) => ({ slides: [...state.slides, slide] }));
  },

  removeSlide: (slideId) => {
    get()._pushHistory();
    set((state) => {
      const newSlides = state.slides.filter((s) => s.id !== slideId);
      const newActiveId =
        state.activeSlideId === slideId
          ? newSlides.length > 0
            ? newSlides[0].id
            : null
          : state.activeSlideId;
      return { slides: newSlides, activeSlideId: newActiveId, selectedElementId: null };
    });
  },

  updateSlideBackground: (slideId, type, value) => {
    get()._pushHistory();
    set((state) => ({
      slides: produce(state.slides, (draft) => {
        const slide = draft.find((s) => s.id === slideId);
        if (slide) {
          slide.backgroundType = type as Slide["backgroundType"];
          slide.backgroundValue = value;
        }
      }),
    }));
  },

  reorderSlides: (slideIds) => {
    get()._pushHistory();
    set((state) => {
      const slideMap = new Map(state.slides.map((s) => [s.id, s]));
      const reordered = slideIds
        .map((id) => slideMap.get(id))
        .filter((s): s is Slide => s !== undefined);
      return { slides: reordered };
    });
  },

  // --- Element actions ---

  selectElement: (elementId) => {
    set({ selectedElementId: elementId });
  },

  addElement: (element) => {
    get()._pushHistory();
    set((state) => ({
      slides: produce(state.slides, (draft) => {
        const slide = draft.find((s) => s.id === state.activeSlideId);
        if (slide) {
          slide.elements.push(element as Element);
        }
      }),
    }));
  },

  updateElement: (elementId, updates) => {
    get()._pushHistory();
    set((state) => ({
      slides: produce(state.slides, (draft) => {
        const slide = draft.find((s) => s.id === state.activeSlideId);
        if (slide) {
          const elIndex = slide.elements.findIndex((e) => e.id === elementId);
          if (elIndex !== -1) {
            slide.elements[elIndex] = {
              ...slide.elements[elIndex],
              ...updates,
            } as Element;
          }
        }
      }),
    }));
  },

  removeElement: (elementId) => {
    get()._pushHistory();
    set((state) => ({
      slides: produce(state.slides, (draft) => {
        const slide = draft.find((s) => s.id === state.activeSlideId);
        if (slide) {
          slide.elements = slide.elements.filter((e) => e.id !== elementId);
        }
      }),
      selectedElementId:
        state.selectedElementId === elementId ? null : state.selectedElementId,
    }));
  },

  duplicateElement: (elementId) => {
    get()._pushHistory();
    set((state) => ({
      slides: produce(state.slides, (draft) => {
        const slide = draft.find((s) => s.id === state.activeSlideId);
        if (slide) {
          const original = slide.elements.find((e) => e.id === elementId);
          if (original) {
            const clone = {
              ...JSON.parse(JSON.stringify(original)),
              id: crypto.randomUUID(),
              x: original.x + 20,
              y: original.y + 20,
            } as Element;
            slide.elements.push(clone);
          }
        }
      }),
    }));
  },

  // --- History actions ---

  undo: () => {
    const { past, slides, activeSlideId } = get();
    if (past.length === 0) return;

    const newPast = [...past];
    const previous = newPast.pop()!;

    const currentEntry: EditorHistoryEntry = {
      slides: JSON.parse(JSON.stringify(slides)),
      activeSlideId,
    };

    set((state) => ({
      slides: previous.slides,
      activeSlideId: previous.activeSlideId,
      selectedElementId: null,
      past: newPast,
      future: [currentEntry, ...state.future],
      canUndo: newPast.length > 0,
      canRedo: true,
    }));
  },

  redo: () => {
    const { future, slides, activeSlideId } = get();
    if (future.length === 0) return;

    const newFuture = [...future];
    const next = newFuture.shift()!;

    const currentEntry: EditorHistoryEntry = {
      slides: JSON.parse(JSON.stringify(slides)),
      activeSlideId,
    };

    set((state) => ({
      slides: next.slides,
      activeSlideId: next.activeSlideId,
      selectedElementId: null,
      past: [...state.past, currentEntry],
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    }));
  },
}));

// Helper: get the active slide from current state
export function getActiveSlide(state: EditorState): Slide | undefined {
  return state.slides.find((s) => s.id === state.activeSlideId);
}
