"use client";

import { useEditorStore, getActiveSlide } from "@/store/editor-store";
import type { ChartElement, ChartType, ChartDataPoint } from "@/types";

interface ChartDataPanelProps {
  onClose: () => void;
}

const chartTypes: { value: ChartType; label: string; icon: string }[] = [
  { value: "bar", label: "Bar", icon: "▊" },
  { value: "line", label: "Line", icon: "📈" },
  { value: "area", label: "Area", icon: "▰" },
  { value: "pie", label: "Pie", icon: "◔" },
  { value: "donut", label: "Donut", icon: "◍" },
  { value: "radar", label: "Radar", icon: "✦" },
];

export function ChartDataPanel({ onClose }: ChartDataPanelProps) {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const activeSlide = useEditorStore(getActiveSlide);
  const updateElement = useEditorStore((s) => s.updateElement);

  const element = activeSlide?.elements.find(
    (e) => e.id === selectedElementId && e.type === "chart"
  ) as ChartElement | undefined;

  if (!element) return null;

  const data = element.chartData || [];

  const updateData = (newData: ChartDataPoint[]) => {
    updateElement(element.id, { chartData: newData });
  };

  const handleCellChange = (index: number, field: "name" | "value", value: string) => {
    const newData = [...data];
    if (field === "name") {
      newData[index] = { ...newData[index], name: value };
    } else {
      newData[index] = { ...newData[index], value: parseFloat(value) || 0 };
    }
    updateData(newData);
  };

  const addRow = () => {
    updateData([...data, { name: `Item ${data.length + 1}`, value: 0 }]);
  };

  const removeRow = (index: number) => {
    updateData(data.filter((_, i) => i !== index));
  };

  const changeType = (type: ChartType) => {
    updateElement(element.id, { chartType: type });
  };

  return (
    <div className="w-72 border-l border-gray-200 bg-white overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Chart Data</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
          aria-label="Close chart panel"
        >
          ✕
        </button>
      </div>

      {/* Chart type selector */}
      <div className="p-3 border-b border-gray-100">
        <label className="text-xs font-medium text-gray-600 mb-2 block">Chart Type</label>
        <div className="grid grid-cols-3 gap-1">
          {chartTypes.map((ct) => (
            <button
              key={ct.value}
              onClick={() => changeType(ct.value)}
              className={`px-2 py-1.5 text-xs rounded border transition-colors ${
                element.chartType === ct.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title editor */}
      <div className="p-3 border-b border-gray-100">
        <label className="text-xs font-medium text-gray-600 mb-1 block">Chart Title</label>
        <input
          type="text"
          value={element.chartTitle || ""}
          onChange={(e) => updateElement(element.id, { chartTitle: e.target.value })}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Chart title"
        />
      </div>

      {/* Data grid */}
      <div className="p-3 flex-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">Data</label>
          <button
            onClick={addRow}
            className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700"
          >
            + Row
          </button>
        </div>
        <div className="space-y-1">
          <div className="flex gap-1 text-[10px] text-gray-400 px-1">
            <span className="flex-1">Label</span>
            <span className="w-16">Value</span>
            <span className="w-5"></span>
          </div>
          {data.map((row, i) => (
            <div key={i} className="flex gap-1 items-center">
              <input
                type="text"
                value={row.name}
                onChange={(e) => handleCellChange(i, "name", e.target.value)}
                className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="number"
                value={row.value}
                onChange={(e) => handleCellChange(i, "value", e.target.value)}
                className="w-16 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => removeRow(i)}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 text-red-400 text-xs"
                title="Remove row"
              >
                ✕
              </button>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">
              No data. Click &quot;+ Row&quot; to add.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
