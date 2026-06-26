"use client";

import { useEffect, useState } from "react";

interface NotesTimerDockProps {
  notes: string;
  visible: boolean;
  slideNumber: number;
  totalSlides: number;
}

export function NotesTimerDock({
  notes,
  visible,
  slideNumber,
  totalSlides,
}: NotesTimerDockProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white p-4 z-40">
      <div className="max-w-4xl mx-auto flex items-start gap-6">
        {/* Notes */}
        <div className="flex-1 overflow-y-auto max-h-32">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">
            Speaker Notes
          </h4>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {notes || "No notes for this slide"}
          </p>
        </div>
        {/* Timer + Slide counter */}
        <div className="text-right shrink-0">
          <div className="text-2xl font-mono">{formatTime(elapsed)}</div>
          <div className="text-xs text-gray-400 mt-1">
            Slide {slideNumber} / {totalSlides}
          </div>
        </div>
      </div>
    </div>
  );
}
