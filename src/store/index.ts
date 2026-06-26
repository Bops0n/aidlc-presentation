import { create } from "zustand";
import type { Presentation, Slide } from "@/types";

interface PresentationListItem {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  thumbnail_url: string | null;
  slides: { id: string }[];
}

interface PresentationState {
  // List state
  presentations: PresentationListItem[];
  isLoadingList: boolean;

  // Active presentation state
  activePresentation: (Presentation & { slides: Slide[] }) | null;
  isLoadingPresentation: boolean;

  // Error state
  error: string | null;

  // Actions
  fetchPresentations: (page?: number, limit?: number) => Promise<void>;
  createPresentation: (title: string) => Promise<string | null>;
  deletePresentation: (id: string) => Promise<void>;
  renamePresentation: (id: string, title: string) => Promise<void>;
  loadPresentation: (id: string) => Promise<void>;
  clearActivePresentation: () => void;
  clearError: () => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  presentations: [],
  isLoadingList: false,
  activePresentation: null,
  isLoadingPresentation: false,
  error: null,

  fetchPresentations: async (page = 1, limit = 20) => {
    set({ isLoadingList: true, error: null });
    try {
      const res = await fetch(`/api/presentations?page=${page}&limit=${limit}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to fetch");
      set({ presentations: json.data, isLoadingList: false });
    } catch (err: any) {
      set({ error: err.message, isLoadingList: false });
    }
  },

  createPresentation: async (title: string) => {
    set({ error: null });
    try {
      const res = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to create");
      // Refresh list
      await get().fetchPresentations();
      return json.data.id;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    }
  },

  deletePresentation: async (id: string) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/presentations/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to delete");
      set((state) => ({
        presentations: state.presentations.filter((p) => p.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  renamePresentation: async (id: string, title: string) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/presentations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to rename");
      set((state) => ({
        presentations: state.presentations.map((p) =>
          p.id === id ? { ...p, title } : p
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  loadPresentation: async (id: string) => {
    set({ isLoadingPresentation: true, error: null });
    try {
      const res = await fetch(`/api/presentations/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to load");
      set({ activePresentation: json.data, isLoadingPresentation: false });
    } catch (err: any) {
      set({ error: err.message, isLoadingPresentation: false });
    }
  },

  clearActivePresentation: () => set({ activePresentation: null }),
  clearError: () => set({ error: null }),
}));
