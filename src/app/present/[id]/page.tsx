"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SlideStage } from "@/components/presenter/slide-stage";
import { LaserPointer } from "@/components/presenter/laser-pointer";
import { NotesTimerDock } from "@/components/presenter/notes-timer-dock";
import type { Slide } from "@/types";

export default function PresentPage() {
  const params = useParams();
  const router = useRouter();
  const presentationId = params.id as string;

  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [laserActive, setLaserActive] = useState(false);
  const [notesVisible, setNotesVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load presentation
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/presentations/${presentationId}`);
        const json = await res.json();
        if (res.ok && json.data?.slides) {
          const mapped: Slide[] = json.data.slides.map((s: any) => ({
            id: s.id,
            backgroundType: s.background_type || "color",
            backgroundValue: s.background_value || "#ffffff",
            elements: Array.isArray(s.elements) ? s.elements : [],
            transitionMode: s.transition_mode || "none",
            notes: s.notes || "",
          }));
          setSlides(mapped);
        }
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [presentationId]);

  // Compute scale on mount and resize
  useEffect(() => {
    function updateScale() {
      setScale(
        Math.min(window.innerWidth / 960, window.innerHeight / 540)
      );
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Request fullscreen on mount
  useEffect(() => {
    if (isLoading || slides.length === 0) return;
    const el = containerRef.current;
    if (el && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  }, [isLoading, slides.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          setDirection(1);
          setCurrentIndex((i) => Math.min(i + 1, slides.length - 1));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setDirection(-1);
          setCurrentIndex((i) => Math.max(i - 1, 0));
          break;
        case "Escape":
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          router.push(`/editor/${presentationId}`);
          break;
        case "l":
        case "L":
          setLaserActive((v) => !v);
          break;
        case "n":
        case "N":
          setNotesVisible((v) => !v);
          break;
      }
    },
    [slides.length, router, presentationId]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        No slides
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen bg-black relative overflow-hidden"
      style={{ cursor: laserActive ? "none" : "default" }}
    >
      {/* Scale slide to fill screen */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            width: 960,
            height: 540,
            position: "relative",
          }}
        >
          <SlideStage
            slide={currentSlide}
            slideIndex={currentIndex}
            direction={direction}
          />
        </div>
      </div>

      {/* Laser pointer */}
      <LaserPointer active={laserActive} />

      {/* Notes & Timer */}
      <NotesTimerDock
        notes={currentSlide.notes}
        visible={notesVisible}
        slideNumber={currentIndex + 1}
        totalSlides={slides.length}
      />

      {/* Minimal controls hint */}
      <div className="absolute top-4 right-4 text-white/30 text-xs space-y-0.5 pointer-events-none">
        <div>← → Space: Navigate</div>
        <div>L: Laser | N: Notes</div>
        <div>Esc: Exit</div>
      </div>
    </div>
  );
}
