"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore } from "@/store/editor-store";
import { useViewportStore } from "@/store/viewport-store";
import { CanvasViewport } from "@/components/editor/canvas-viewport";
import { SlideThumbnails } from "@/components/editor/slide-thumbnails";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { ThemePanel } from "@/components/editor/theme-panel";
import { LayoutPanel } from "@/components/editor/layout-panel";
import { TemplateGallery } from "@/components/editor/template-gallery";
import { ChartDataPanel } from "@/components/editor/chart-data-panel";
import { MediaPicker } from "@/components/editor/media-picker";
import { AiGenerateModal } from "@/components/editor/ai-generate-modal";
import { PdfExportRenderer } from "@/components/editor/pdf-export-renderer";
import { exportSlidesToPdf } from "@/lib/pdf-export";
import { auditAnimations } from "@/lib/animation-audit";
import { Loading } from "@/components/ui/loading";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useAutoSave } from "@/hooks/use-auto-save";
import type { Slide } from "@/types";

import { getActiveSlide } from "@/store/editor-store";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const presentationId = params.id as string;
  const setSlides = useEditorStore((s) => s.setSlides);
  const slides = useEditorStore((s) => s.slides);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const activeSlide = useEditorStore(getActiveSlide);

  // Animation audit warnings
  const warnings = auditAnimations(slides);

  // PDF export
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    if (!exportRef.current || isExporting) return;
    setIsExporting(true);
    try {
      // Wait a moment for the offscreen renderer to mount/settle
      await new Promise((r) => setTimeout(r, 300));
      const nodes = Array.from(
        exportRef.current.querySelectorAll<HTMLElement>("[data-slide-index]")
      ).sort(
        (a, b) =>
          Number(a.dataset.slideIndex) - Number(b.dataset.slideIndex)
      );
      const title = "presentation";
      await exportSlidesToPdf(nodes, title);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Detect if selected element is a chart
  const selectedIsChart = activeSlide?.elements.some(
    (e) => e.id === selectedElementId && e.type === "chart"
  );

  // Panel visibility state
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showLayoutPanel, setShowLayoutPanel] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showAiGenerate, setShowAiGenerate] = useState(false);

  // Zoom from shared viewport store
  const zoomPercent = useViewportStore((s) => s.zoomPercent);
  const zoomIn = useViewportStore((s) => s.zoomIn);
  const zoomOut = useViewportStore((s) => s.zoomOut);
  const fitToScreen = useViewportStore((s) => s.fitToScreen);
  const setZoom = useViewportStore((s) => s.setZoom);

  // Wire up keyboard shortcuts
  useKeyboardShortcuts();

  // Wire up auto-save
  const { saveStatus } = useAutoSave(presentationId);

  // Load presentation
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/presentations/${presentationId}`);
        const json = await res.json();
        if (res.ok && json.data?.slides) {
          const mappedSlides: Slide[] = json.data.slides.map((s: any) => ({
            id: s.id,
            backgroundType: s.background_type || "color",
            backgroundValue: s.background_value || "#ffffff",
            elements: Array.isArray(s.elements) ? s.elements : [],
            transitionMode: s.transition_mode || "none",
            notes: s.notes || "",
          }));
          setSlides(mappedSlides);
        }
      } catch (err) {
        console.error("Failed to load presentation:", err);
      }
    }
    load();
  }, [presentationId, setSlides]);

  if (slides.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <>
      <EditorToolbar
        zoomPercent={zoomPercent}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToScreen={fitToScreen}
        onSetZoom={setZoom}
        onOpenThemePanel={() => {
          setShowThemePanel((v) => !v);
          setShowLayoutPanel(false);
        }}
        onOpenLayoutPanel={() => {
          setShowLayoutPanel((v) => !v);
          setShowThemePanel(false);
        }}
        onOpenTemplateGallery={() => setShowTemplateGallery(true)}
        onOpenMediaPicker={() => setShowMediaPicker(true)}
        onOpenAiGenerate={() => setShowAiGenerate(true)}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        onPresent={() => router.push(`/present/${presentationId}`)}
        animationWarnings={warnings.length}
      />
      {/* Save status indicator */}
      <div className="h-5 bg-gray-50 border-b border-gray-100 flex items-center px-4">
        <span className="text-[10px] text-gray-400">
          {saveStatus === "saved" && "✓ All changes saved"}
          {saveStatus === "saving" && "⏳ Saving..."}
          {saveStatus === "error" && "⚠ Save failed — retrying"}
        </span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <SlideThumbnails />
        <CanvasViewport />
        {showThemePanel && (
          <ThemePanel onClose={() => setShowThemePanel(false)} />
        )}
        {showLayoutPanel && (
          <LayoutPanel onClose={() => setShowLayoutPanel(false)} />
        )}
        {selectedIsChart && (
          <ChartDataPanel onClose={() => useEditorStore.getState().selectElement(null)} />
        )}
      </div>
      {showTemplateGallery && (
        <TemplateGallery onClose={() => setShowTemplateGallery(false)} />
      )}
      {showMediaPicker && (
        <MediaPicker onClose={() => setShowMediaPicker(false)} />
      )}
      {showAiGenerate && (
        <AiGenerateModal onClose={() => setShowAiGenerate(false)} />
      )}
      {/* Offscreen renderer for PDF export */}
      <PdfExportRenderer ref={exportRef} slides={slides} />
    </>
  );
}
