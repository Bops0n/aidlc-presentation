# Tasks — Data Visualization Unit

## Summary
- **Total Tasks**: 4
- **Execution**: Sequential
- **Dependency**: recharts (pnpm add recharts)

## Task 1: Chart Renderer (Recharts)
- **Files**: src/components/editor/elements/chart-element.tsx (replace placeholder)
- **Acceptance**: Render bar/line/area/pie/donut/radar with chartData, fills element bounds, uses chartColors

## Task 2: Chart Data Panel
- **Files**: src/components/editor/chart-data-panel.tsx
- **Acceptance**: Editable table (label/value), add/delete rows, chart re-renders on edit

## Task 3: Chart Type Selector
- **Files**: (part of chart-data-panel.tsx)
- **Acceptance**: Toggle chart type, instant re-render

## Task 4: Integration
- **Files**: src/components/editor/editor-toolbar.tsx (add chart button), src/app/editor/[id]/page.tsx (show panel when chart selected)
- **Acceptance**: Add chart from toolbar, data panel appears on chart selection
