"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import type { Slide } from "@/types";

interface AiGenerateModalProps {
  onClose: () => void;
}

export function AiGenerateModal({ onClose }: AiGenerateModalProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setSlides = useEditorStore((s) => s.setSlides);

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.trim().length < 3) {
      setError("Please enter a topic (at least 3 characters)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "Generation failed");
        return;
      }

      if (json.data?.slides && json.data.slides.length > 0) {
        setSlides(json.data.slides);
        onClose();
      } else {
        setError("No slides were generated. Try a different prompt.");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-[560px] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">✨ AI Generate Slides</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Describe your presentation topic and AI will create slides for you.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Quarterly sales report with revenue growth, key metrics, and next quarter goals'"
          className="w-full h-32 border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || prompt.trim().length < 3}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Generating..." : "✨ Generate"}
          </button>
        </div>

        {loading && (
          <p className="mt-3 text-xs text-gray-400 text-center">
            This may take 10-30 seconds...
          </p>
        )}
      </div>
    </div>
  );
}
