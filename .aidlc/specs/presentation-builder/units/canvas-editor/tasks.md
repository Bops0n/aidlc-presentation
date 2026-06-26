# Tasks — Canvas Editor Unit

## Summary
- **Total Tasks**: 10
- **Execution Waves**: 3
- **Strategy**: Component-first, single-concern
- **Approach**: Test-after
- **Estimated Effort**: 5-7 days (solo developer)

---

## Wave 1: Store + API + Core Infrastructure

### Task 1: Editor Zustand Store (with Undo/Redo)
- **Description**: สร้าง editor-specific store พร้อม immer middleware สำหรับ undo/redo history
- **Files**:
  - `src/store/editor-store.ts` — Active slide state, selected element, elements CRUD, undo/redo (immer temporal)
- **Acceptance**: Store actions work (addElement, updateElement, removeElement, undo, redo), history stack ≥50 entries, canUndo/canRedo computed correctly
- **Dependencies**: Foundation (types, store pattern)

### Task 2: Slides API Endpoints
- **Description**: สร้าง CRUD Route Handlers สำหรับ slides (add, update, delete, reorder)
- **Files**:
  - `src/app/api/presentations/[id]/slides/route.ts` — POST (add slide)
  - `src/app/api/presentations/[id]/slides/[slideId]/route.ts` — PATCH (update elements/bg), DELETE
  - `src/app/api/presentations/[id]/slides/reorder/route.ts` — PATCH (reorder)
- **Acceptance**: ทุก endpoint ทำงานถูกต้อง, ownership validation, cascade operations
- **Dependencies**: Foundation (auth, prisma, errors)

### Task 3: Canvas Scale Hook
- **Description**: Custom hook สำหรับคำนวณ scale-to-fit + manual zoom
- **Files**:
  - `src/hooks/use-canvas-scale.ts` — ResizeObserver, scale calculation, zoom state, pan state
- **Acceptance**: Scale คำนวณถูกต้องตาม formula, responsive เมื่อ window resize, manual zoom 15%-250% ทำงาน
- **Dependencies**: None (utility hook)

---

## Wave 2: Canvas Core Components

### Task 4: Canvas Viewport + Element Renderer
- **Description**: สร้าง scaled viewport container + element type dispatcher
- **Files**:
  - `src/components/editor/canvas-viewport.tsx` — Viewport with scale transform, pan support
  - `src/components/editor/element-renderer.tsx` — Switch by element.type, render appropriate sub-component
  - `src/components/editor/elements/text-element.tsx` — Text display (content, font, color, alignment)
  - `src/components/editor/elements/image-element.tsx` — Image display (src, referrerPolicy)
  - `src/components/editor/elements/shape-element.tsx` — Shape rendering (rect, circle, triangle, arrow, line)
- **Acceptance**: Canvas renders 960×540 scaled, elements positioned correctly with absolute position, zoom/pan works
- **Dependencies**: Task 1, Task 3

### Task 5: Selection Manager + Transform Handles
- **Description**: สร้าง selection system + custom drag/resize/rotate handles
- **Files**:
  - `src/components/editor/selection-manager.tsx` — Selection outline, click-to-select, click-canvas-to-deselect
  - `src/components/editor/transform-handles.tsx` — 8 resize handles + 1 rotate handle + drag body
  - `src/hooks/use-element-drag.ts` — Custom drag hook (mousedown → mousemove → mouseup)
  - `src/hooks/use-element-resize.ts` — Resize from 8 directions
  - `src/hooks/use-element-rotate.ts` — Angle calculation from center
- **Acceptance**: Drag updates x,y at 60fps, resize updates width/height (min 20×20), rotate updates degree, all save to store
- **Dependencies**: Task 1, Task 4

### Task 6: Inline Text Editor (Tiptap)
- **Description**: Tiptap-based WYSIWYG editor ที่ activate เมื่อ double-click text element
- **Files**:
  - `src/components/editor/inline-text-editor.tsx` — Tiptap editor with floating toolbar
- **Acceptance**: Double-click activates editor, formatting works (font, size, color, weight, alignment), click outside saves + deactivates
- **Dependencies**: Task 4, Task 5

---

## Wave 3: Sidebar + Toolbar + Editor Page

### Task 7: Slide Thumbnails Sidebar
- **Description**: Sidebar แสดง slide thumbnails + drag reorder ด้วย @dnd-kit
- **Files**:
  - `src/components/editor/slide-thumbnails.tsx` — Thumbnail list, CSS scale(0.15), dnd-kit sortable, context menu (add/duplicate/delete)
- **Acceptance**: Thumbnails render ตรงกับ slide content, drag reorder updates store + API, active slide highlighted, context menu works
- **Dependencies**: Task 1, Task 2

### Task 8: Editor Toolbar
- **Description**: Top toolbar พร้อม tools, zoom control, undo/redo buttons
- **Files**:
  - `src/components/editor/editor-toolbar.tsx` — Tool buttons, zoom slider, undo/redo, fit-to-screen
- **Acceptance**: Zoom slider updates viewport, undo/redo buttons disabled correctly, tool selection changes cursor behavior
- **Dependencies**: Task 1, Task 3

### Task 9: Editor Page (Assembly)
- **Description**: Assemble ทุก component เป็น editor page + load presentation from API
- **Files**:
  - `src/app/editor/[id]/page.tsx` — Load presentation, compose Sidebar + Viewport + Toolbar
  - `src/app/editor/[id]/layout.tsx` — Editor layout (full-screen, no sidebar navigation)
- **Acceptance**: Page loads presentation from DB, shows slides in sidebar, renders active slide on canvas, all interactions work end-to-end
- **Dependencies**: Task 4, Task 5, Task 6, Task 7, Task 8

### Task 10: Keyboard Shortcuts + Auto-Save
- **Description**: Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Delete, Ctrl+D) + auto-save ไป API
- **Files**:
  - `src/hooks/use-keyboard-shortcuts.ts` — Global keyboard listener for editor
  - `src/hooks/use-auto-save.ts` — Debounced save to API (2s after last change)
- **Acceptance**: Shortcuts trigger correct actions, auto-save persists to DB within 2s, save indicator shows status
- **Dependencies**: Task 1, Task 2, Task 9

---

## Task Dependency Graph

```
Task 1 (Store) ─────────────────────────┐
Task 2 (Slides API) ────────────────────┤
Task 3 (Scale Hook) ────────────────────┤
                                         │
Task 4 (Viewport + Elements) ← Task 1,3 │
Task 5 (Selection + Transform) ← Task 1,4
Task 6 (Tiptap Editor) ← Task 4,5       │
Task 7 (Thumbnails) ← Task 1,2          │
Task 8 (Toolbar) ← Task 1,3             │
                                         │
Task 9 (Editor Page) ← Task 4,5,6,7,8   │
Task 10 (Shortcuts + Save) ← Task 1,2,9 │
```

---

## File Ownership (No Overlaps)

| Task | Owned Files |
|------|-------------|
| 1 | src/store/editor-store.ts |
| 2 | src/app/api/presentations/[id]/slides/** |
| 3 | src/hooks/use-canvas-scale.ts |
| 4 | src/components/editor/canvas-viewport.tsx, element-renderer.tsx, elements/** |
| 5 | src/components/editor/selection-manager.tsx, transform-handles.tsx, src/hooks/use-element-*.ts |
| 6 | src/components/editor/inline-text-editor.tsx |
| 7 | src/components/editor/slide-thumbnails.tsx |
| 8 | src/components/editor/editor-toolbar.tsx |
| 9 | src/app/editor/[id]/** |
| 10 | src/hooks/use-keyboard-shortcuts.ts, src/hooks/use-auto-save.ts |
