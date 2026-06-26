# Design Decisions — Data Visualization Unit (D3)

## Context Summary
- **Unit**: Data Visualization (Wave 3)
- **Scope**: Chart rendering (bar/line/area/pie/donut/radar), editable data grid, toggle chart type
- **Stories**: US-09 (Chart + data grid), US-10 (Toggle chart type)
- **Dependencies**: Foundation, Canvas Editor (chart element on canvas), Templates & Themes (sync chart colors)
- **Settled**: Prisma, Zod, Tailwind, Zustand, Vitest, pnpm. Note: spec requires PDF/PPTX export to render charts as VECTOR (not rasterized).

---

## Decision Questions

### D3-1: Chart Rendering Library
**Question**: Library สำหรับ render charts?
- 1) Recharts (React-native, SVG-based, declarative, popular) **(Recommended)**
- 2) Chart.js + react-chartjs-2 (canvas-based, feature-rich)
- 3) Custom SVG (full control, vector-perfect for export, more work)
- 4) Visx (low-level D3 + React primitives)
- 5) Other (please specify): _______

**Answer**: 1

---

### D3-2: Chart Export Compatibility
**Question**: Export fidelity เป็น constraint — chart ต้อง render vector ใน PDF/PPTX. แนวทาง?
- 1) ใช้ SVG-based library (Recharts) — export ดึง SVG ออกมาตรงๆ **(Recommended)**
- 2) Canvas-based + convert เป็น image ตอน export (rasterized, อาจเบลอ)
- 3) Render ซ้ำตอน export ด้วย chart data (re-render vector)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-3: Data Grid Editing
**Question**: Data grid UI สำหรับแก้ไข chart data?
- 1) Custom table component (inline edit cells, add/remove rows) **(Recommended)**
- 2) Library: react-data-grid (feature-rich, heavier)
- 3) Simple input list (label + value pairs)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-4: Chart Element Selection Panel
**Question**: เมื่อเลือก chart element แสดง data grid ที่ไหน?
- 1) Right sidebar panel (ตาม spec — slide ออกมาเมื่อเลือก chart) **(Recommended)**
- 2) Floating popover ใกล้ chart
- 3) Modal dialog
- 4) Other (please specify): _______

**Answer**: 1

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
- D3-1 Chart Library: Recharts (SVG-based, declarative)
- D3-2 Export Compatibility: SVG-based — export ดึง SVG ออกมาตรงๆ (vector)
- D3-3 Data Grid: Custom table component (inline edit, add/remove rows)
- D3-4 Selection Panel: Right sidebar panel (slide ออกเมื่อเลือก chart)

---

**Instructions**: Fill in your answers above and respond with "done"
