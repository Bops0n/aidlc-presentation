# Data Visualization Unit — Design

## Summary
- **Architecture**: Recharts (SVG) chart rendering + custom data grid sidebar
- **Components**: 4 (Chart Renderer, Data Grid Panel, Chart Type Selector, Add Chart button)
- **Library**: Recharts (SVG-based for vector export compatibility)
- **Stories**: US-09 (Chart + data grid), US-10 (Toggle chart type)

## Components

### 1. Chart Renderer (replaces placeholder)
- **Purpose**: Render actual charts on canvas using Recharts
- **Technology**: Recharts (BarChart, LineChart, AreaChart, PieChart, RadarChart)
- **Responsibilities**:
  - Render based on chartType (bar/line/area/pie/donut/radar)
  - Use chartData ({name, value}[])
  - Apply chartColors (sync with theme accent)
  - Responsive container fills element bounds
- **Replaces**: src/components/editor/elements/chart-element.tsx (placeholder)

### 2. Data Grid Panel
- **Purpose**: Right sidebar showing editable table when chart selected
- **Technology**: Custom table + Tailwind
- **Responsibilities**:
  - Show rows of {label, value}
  - Inline edit cells (text + number inputs)
  - Add row button, delete row buttons
  - Real-time update → chart re-renders within 100ms
- **Exposes**: `<ChartDataPanel element={} />`

### 3. Chart Type Selector
- **Purpose**: Toggle between chart types
- **Responsibilities**: Buttons/dropdown for bar/line/area/pie/donut/radar, instant re-render
- **Part of**: Data Grid Panel

### 4. Add Chart Button (toolbar)
- **Purpose**: Insert new chart element with default data
- **Part of**: editor-toolbar.tsx

## Chart Type Mapping (Recharts)
| chartType | Recharts Component |
|-----------|-------------------|
| bar | BarChart + Bar |
| line | LineChart + Line |
| area | AreaChart + Area |
| pie | PieChart + Pie |
| donut | PieChart + Pie (innerRadius) |
| radar | RadarChart + Radar |

## Traceability
| Requirement | Component(s) | Status |
|-------------|-------------|--------|
| US-09 (Chart + data grid) | Chart Renderer, Data Grid Panel | ✅ |
| US-10 (Toggle chart type) | Chart Type Selector | ✅ |
