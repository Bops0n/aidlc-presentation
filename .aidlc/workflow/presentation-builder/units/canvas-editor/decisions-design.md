# Design Decisions — Canvas Editor Unit (D3)

## Context Summary
- **Unit**: Canvas Editor (Wave 2)
- **Scope**: Interactive 960×540 canvas, drag/resize/rotate elements, zoom/pan, rich text editing, thumbnails, undo/redo
- **Stories**: US-01 (Element editing), US-02 (Viewport zoom/pan), US-03 (Rich text), US-23 (Thumbnails & ordering), US-26 (Undo/Redo)
- **Dependencies**: Foundation unit (Prisma, Types, Auth, Error handling)
- **Settled by Foundation**: Prisma, Zod, Tailwind+custom, Route Handlers, Zustand, Vitest, ESLint+Prettier, pnpm

---

## Decision Questions

### D3-1: Canvas Rendering Approach
**Question**: วิธี render canvas และ elements?
- 1) HTML/CSS divs + absolute positioning (simple, browser-native, Tailwind-friendly) **(Recommended)**
- 2) HTML5 Canvas API (2D context, pixel-based, good performance)
- 3) SVG-based (vector, scalable, DOM-accessible)
- 4) Library: Konva.js / Fabric.js (feature-rich canvas library)
- 5) Other (please specify): _______

**Answer**: 1

---

### D3-2: Drag & Resize Library
**Question**: Library สำหรับ drag, resize, rotate elements?
- 1) Custom implementation (React event handlers + transform) **(Recommended)**
- 2) react-rnd (drag + resize, mature)
- 3) @dnd-kit (modern, accessible, flexible)
- 4) react-draggable + react-resizable (separate libs)
- 5) Other (please specify): _______

**Answer**: 1

---

### D3-3: Rich Text Editor
**Question**: Library สำหรับ inline text editing?
- 1) Tiptap (ProseMirror-based, extensible, modern) **(Recommended)**
- 2) Slate.js (low-level, highly customizable)
- 3) ContentEditable + custom logic (minimal dependency)
- 4) Lexical (Meta's editor framework)
- 5) Other (please specify): _______

**Answer**: 1

---

### D3-4: Undo/Redo Strategy
**Question**: วิธีจัดการ undo/redo history?
- 1) Zustand middleware + immer (snapshot-based, integrated with store) **(Recommended)**
- 2) Command pattern (explicit action objects)
- 3) Custom history stack (manual push/pop)
- 4) Library: zustand-undo (dedicated middleware)
- 5) Other (please specify): _______

**Answer**: 1

---

### D3-5: Slide Thumbnails Rendering
**Question**: วิธี render slide thumbnails ใน sidebar?
- 1) CSS transform scale (scale down actual slide DOM) **(Recommended)**
- 2) Canvas-to-image snapshot (generate thumbnail images)
- 3) Separate mini-component (simplified render)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-6: Drag & Drop Slide Ordering
**Question**: Library สำหรับ reorder slides ใน sidebar?
- 1) @dnd-kit/sortable (modern, accessible, performant) **(Recommended)**
- 2) react-beautiful-dnd (popular but archived)
- 3) Custom drag implementation
- 4) Other (please specify): _______

**Answer**: 1 

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
- D3-1 Canvas Rendering: HTML/CSS divs + absolute positioning
- D3-2 Drag & Resize: Custom implementation (React events + transform)
- D3-3 Rich Text Editor: Tiptap (ProseMirror-based)
- D3-4 Undo/Redo: Zustand middleware + immer (snapshot-based)
- D3-5 Thumbnails: CSS transform scale
- D3-6 Slide Ordering: @dnd-kit/sortable

---

**Instructions**: Fill in your answers above and respond with "done"
