"use client";

import { useEditorStore } from "@/store/editor-store";
import type { TextElement, ShapeElement, ChartElement } from "@/types";

interface EditorToolbarProps {
  zoomPercent: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onSetZoom: (percent: number) => void;
  onOpenThemePanel?: () => void;
  onOpenLayoutPanel?: () => void;
  onOpenTemplateGallery?: () => void;
  onOpenMediaPicker?: () => void;
  onOpenAiGenerate?: () => void;
  onExportPdf?: () => void;
  isExporting?: boolean;
  onPresent?: () => void;
  animationWarnings?: number;
}

export function EditorToolbar({
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onSetZoom,
  onOpenThemePanel,
  onOpenLayoutPanel,
  onOpenTemplateGallery,
  onOpenMediaPicker,
  onOpenAiGenerate,
  onExportPdf,
  isExporting,
  onPresent,
  animationWarnings = 0,
}: EditorToolbarProps) {
  const canUndo = useEditorStore((s) => s.canUndo);
  const canRedo = useEditorStore((s) => s.canRedo);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const addElement = useEditorStore((s) => s.addElement);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const removeElement = useEditorStore((s) => s.removeElement);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);

  const handleAddText = () => {
    const textEl: TextElement = {
      id: crypto.randomUUID(),
      type: "text",
      x: 80 + Math.random() * 200,
      y: 80 + Math.random() * 100,
      width: 320,
      height: 60,
      rotation: 0,
      opacity: 100,
      animation: "none",
      animationDelay: 0,
      content: "Double-click to edit",
      fontSize: 24,
      fontFamily: "Inter",
      fontWeight: "400",
      lineHeight: 1.4,
      color: "#1f2937",
      textAlign: "left",
    };
    addElement(textEl);
  };

  const handleAddHeading = () => {
    const textEl: TextElement = {
      id: crypto.randomUUID(),
      type: "text",
      x: 80 + Math.random() * 100,
      y: 60 + Math.random() * 60,
      width: 500,
      height: 80,
      rotation: 0,
      opacity: 100,
      animation: "none",
      animationDelay: 0,
      content: "Heading",
      fontSize: 48,
      fontFamily: "Inter",
      fontWeight: "700",
      lineHeight: 1.2,
      color: "#111827",
      textAlign: "left",
    };
    addElement(textEl);
  };

  const handleAddSubheading = () => {
    const textEl: TextElement = {
      id: crypto.randomUUID(),
      type: "text",
      x: 80 + Math.random() * 150,
      y: 150 + Math.random() * 80,
      width: 400,
      height: 50,
      rotation: 0,
      opacity: 100,
      animation: "none",
      animationDelay: 0,
      content: "Subheading",
      fontSize: 32,
      fontFamily: "Inter",
      fontWeight: "600",
      lineHeight: 1.3,
      color: "#374151",
      textAlign: "left",
    };
    addElement(textEl);
  };

  const handleAddShape = (shapeType: "rectangle" | "circle" | "triangle" | "line" | "arrow") => {
    const shapeEl: ShapeElement = {
      id: crypto.randomUUID(),
      type: "shape",
      x: 150 + Math.random() * 300,
      y: 100 + Math.random() * 200,
      width: shapeType === "line" || shapeType === "arrow" ? 250 : 180,
      height: shapeType === "line" || shapeType === "arrow" ? 4 : shapeType === "circle" ? 180 : 140,
      rotation: 0,
      opacity: 100,
      animation: "none",
      animationDelay: 0,
      shapeType,
      fillColor: shapeType === "line" || shapeType === "arrow" ? "transparent" : "#3b82f6",
      strokeColor: "#2563eb",
      strokeWidth: shapeType === "line" || shapeType === "arrow" ? 3 : 0,
    };
    addElement(shapeEl);
  };

  const handleAddChart = () => {
    const chartEl: ChartElement = {
      id: crypto.randomUUID(),
      type: "chart",
      x: 180,
      y: 120,
      width: 600,
      height: 340,
      rotation: 0,
      opacity: 100,
      animation: "none",
      animationDelay: 0,
      chartType: "bar",
      chartTitle: "Chart Title",
      chartData: [
        { name: "Q1", value: 45 },
        { name: "Q2", value: 62 },
        { name: "Q3", value: 58 },
        { name: "Q4", value: 73 },
      ],
      chartColors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
    };
    addElement(chartEl);
  };

  return (
    <div className="h-11 border-b border-gray-200 bg-white flex items-center px-3 gap-1 shadow-sm select-none">
      {/* Insert: Text */}
      <ToolGroup label="Text">
        <ToolButton onClick={handleAddHeading} title="Heading" icon="H₁" />
        <ToolButton onClick={handleAddSubheading} title="Subheading" icon="H₂" />
        <ToolButton onClick={handleAddText} title="Body Text" icon="T" />
      </ToolGroup>

      {/* Insert: Shapes */}
      <ToolGroup label="Shapes">
        <ToolButton onClick={() => handleAddShape("rectangle")} title="Rectangle" icon="□" />
        <ToolButton onClick={() => handleAddShape("circle")} title="Circle" icon="○" />
        <ToolButton onClick={() => handleAddShape("triangle")} title="Triangle" icon="△" />
        <ToolButton onClick={() => handleAddShape("line")} title="Line" icon="─" />
        <ToolButton onClick={() => handleAddShape("arrow")} title="Arrow" icon="→" />
        <ToolButton onClick={handleAddChart} title="Chart" icon="📊" />
        <ToolButton onClick={() => onOpenMediaPicker?.()} title="Image" icon="🖼" />
      </ToolGroup>

      {/* Edit: Undo/Redo */}
      <ToolGroup label="Edit">
        <ToolButton onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" icon="↩" />
        <ToolButton onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)" icon="↪" />
      </ToolGroup>

      {/* Selection actions (conditional) */}
      {selectedElementId && (
        <ToolGroup label="Selection">
          <ToolButton onClick={() => duplicateElement(selectedElementId)} title="Duplicate (Ctrl+D)" icon="⧉" />
          <ToolButton onClick={() => removeElement(selectedElementId)} title="Delete (Del)" icon="✕" danger />
        </ToolGroup>
      )}

      {/* Design: Theme, Layout, Template, AI */}
      <ToolGroup label="Design">
        <ToolButton onClick={() => onOpenThemePanel?.()} title="Theme" icon="🎨" />
        <ToolButton onClick={() => onOpenLayoutPanel?.()} title="Layout" icon="📐" />
        <ToolButton onClick={() => onOpenTemplateGallery?.()} title="Template" icon="📄" />
        <ToolButton onClick={() => onOpenAiGenerate?.()} title="AI Generate" icon="✨" />
      </ToolGroup>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Present */}
      <button
        onClick={onPresent}
        className="relative flex items-center gap-1 px-3 py-1.5 mr-2 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-500"
        title={
          animationWarnings > 0
            ? `${animationWarnings} animation issue${animationWarnings === 1 ? "" : "s"} detected (density, invisible, or pileup)`
            : "Present full-screen"
        }
      >
        ▶ Present
        {animationWarnings > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold leading-none"
            title={`${animationWarnings} animation issue${animationWarnings === 1 ? "" : "s"}`}
          >
            {animationWarnings}
          </span>
        )}
      </button>

      {/* Export */}
      <button
        onClick={onExportPdf}
        disabled={isExporting}
        className="flex items-center gap-1 px-3 py-1.5 mr-2 text-xs font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export to PDF"
      >
        {isExporting ? "⏳ Exporting..." : "⬇ Export PDF"}
      </button>

      {/* Zoom controls */}
      <div className="flex items-center gap-1 bg-gray-50 rounded-md px-2 py-1">
        <button
          onClick={onZoomOut}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-600 text-sm"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={() => onSetZoom(100)}
          className="px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200 rounded min-w-[44px] text-center"
          title="Reset to 100%"
        >
          {zoomPercent}%
        </button>
        <button
          onClick={onZoomIn}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-600 text-sm"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={onFitToScreen}
          className="ml-1 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200 rounded"
          title="Fit to Screen"
        >
          Fit
        </button>
      </div>
    </div>
  );
}

// Tool group wrapper
function ToolGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
      {children}
    </div>
  );
}

// Reusable toolbar button
function ToolButton({
  onClick,
  disabled,
  title,
  icon,
  danger,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  icon: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-colors
        ${danger ? "hover:bg-red-50 hover:text-red-600 text-gray-500" : "hover:bg-gray-100 text-gray-700"}
        ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {icon}
    </button>
  );
}
