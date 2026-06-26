# Canvas Editor Unit — Design

## Summary
- **Architecture**: Client-side canvas with HTML/CSS divs, custom drag/resize/rotate, Tiptap rich text
- **Stack**: React + Tailwind + Zustand (immer) + Tiptap + @dnd-kit/sortable
- **Components**: 8 designed (Canvas Viewport, Element Renderer, Selection Manager, Transform Handles, Rich Text Editor, Slide Thumbnails, Toolbar, Undo/Redo System)
- **Endpoints**: 2 (slides CRUD — save/load slide elements)
- **Key Algorithm**: Scale-to-fit: min((containerW-96)/960, (containerH-96)/540), clamp 0.15–2.5

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Editor Page (/editor/[id])                │
├───────────────┬─────────────────────────────┬───────────────┤
│  Slide        │      Canvas Viewport         │   Properties  │
│  Thumbnails   │  ┌───────────────────────┐   │   Panel       │
│  (sidebar)    │  │  960×540 Canvas Stage  │   │  (future)     │
│               │  │  ┌─────┐ ┌─────────┐  │   │               │
│  [@dnd-kit]   │  │  │ Elm │ │  Elm    │  │   │               │
│  sortable     │  │  └─────┘ └─────────┘  │   │               │
│               │  │       [Transform]       │   │               │
│               │  └───────────────────────┘   │               │
├───────────────┴─────────────────────────────┴───────────────┤
│                        Toolbar                                │
│  [Select] [Text] [Shape] [Image] [Zoom] [Undo] [Redo]       │
├─────────────────────────────────────────────────────────────┤
│                  Zustand Store (immer + undo history)         │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Canvas Viewport
- **Purpose**: Container ที่ scale canvas 960×540 ให้พอดี viewport + manual zoom/pan
- **Technology**: React + ResizeObserver + CSS transform
- **Responsibilities**:
  - คำนวณ scale = min((containerW-96)/960, (containerH-96)/540), clamp(0.15, 2.5)
  - Apply CSS transform: `scale(${scale})` with transform-origin: top left
  - Manual zoom slider (15%–250%)
  - Pan: Ctrl+drag หรือ middle-click drag (panX, panY)
  - Prevent collapse: shrink-0, overflow hidden
- **Exposes**: `<CanvasViewport>`, current scale value
- **Consumes**: Zustand store (active slide)

### 2. Element Renderer
- **Purpose**: Render แต่ละ element ตาม type (text, image, shape, chart, icon, video)
- **Technology**: React + Tailwind + absolute positioning
- **Responsibilities**:
  - Position: style={{ left: x, top: y, width, height, transform: `rotate(${rotation}deg)`, opacity }}
  - Type-specific rendering (TextElement, ImageElement, ShapeElement, etc.)
  - Click to select, double-click to edit (text)
- **Exposes**: `<ElementRenderer element={} />`
- **Consumes**: Element type from store

### 3. Selection Manager
- **Purpose**: Track selected element(s), show selection outline
- **Technology**: React state + CSS borders
- **Responsibilities**:
  - Single select (click)
  - Deselect (click canvas background)
  - Show blue border + resize/rotate handles on selected
  - Keyboard shortcuts: Delete (remove), Ctrl+D (duplicate)
- **Exposes**: selectedElementId, selectElement(), deselectAll()
- **Consumes**: Zustand store

### 4. Transform Handles (Custom Drag/Resize/Rotate)
- **Purpose**: Custom handles สำหรับ drag, resize (8 points), rotate
- **Technology**: React mouse/pointer events + math transforms
- **Responsibilities**:
  - **Drag**: mousedown on element → track delta → update x,y
  - **Resize**: mousedown on handle → calculate new width/height based on handle position
  - **Rotate**: mousedown on rotate handle → calculate angle from center
  - All at 60fps (requestAnimationFrame)
  - Min size: 20×20px
  - Boundary detection (keep within canvas)
- **Exposes**: `<TransformHandles element={} />`
- **Consumes**: Store actions (updateElement)

### 5. Rich Text Editor (Tiptap)
- **Purpose**: Inline WYSIWYG text editing when double-clicking text element
- **Technology**: Tiptap + extensions (FontFamily, FontSize, Color, TextAlign, Bold, Italic)
- **Responsibilities**:
  - Activate on double-click text element
  - Floating toolbar: font family, size, weight, color, alignment
  - Deactivate on click outside → save content to store
  - Map Tiptap content back to element.content
- **Exposes**: `<InlineTextEditor element={} onSave={} />`
- **Consumes**: Element data, store actions

### 6. Slide Thumbnails Sidebar
- **Purpose**: แสดง slide thumbnails + drag reorder
- **Technology**: @dnd-kit/sortable + CSS transform scale(0.15)
- **Responsibilities**:
  - Render slides เป็น miniature (CSS scale)
  - Drag to reorder (@dnd-kit/sortable)
  - Click to switch active slide
  - Context menu: duplicate, delete, add blank
  - Active slide highlighted
- **Exposes**: `<SlideThumbnails />`
- **Consumes**: Store (slides, activeSlideId, reorderSlides)

### 7. Editor Toolbar
- **Purpose**: Top toolbar พร้อม tools + zoom controls + undo/redo
- **Technology**: React + Tailwind buttons
- **Responsibilities**:
  - Tool selection (select, add text, add shape, add image)
  - Zoom display + slider (15%–250%)
  - Fit-to-screen button
  - Undo/Redo buttons with state awareness (disabled when empty)
- **Exposes**: `<EditorToolbar />`
- **Consumes**: Store (canUndo, canRedo, undo, redo, zoom)

### 8. Undo/Redo System
- **Purpose**: Zustand middleware ที่จับ mutations เป็น history stack
- **Technology**: Zustand + immer + temporal middleware pattern
- **Responsibilities**:
  - Track element mutations (move, resize, rotate, edit text, add, delete)
  - History stack ≥50 entries
  - Ctrl+Z → undo, Ctrl+Y → redo
  - Clear future on new mutation after undo
- **Exposes**: undo(), redo(), canUndo, canRedo
- **Consumes**: Zustand store state

## API Specification

### Endpoints (extends Foundation presentations API)

#### Slides
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| PATCH | /api/presentations/[id]/slides/[slideId] | Yes | Update slide (elements, background, notes) |
| POST | /api/presentations/[id]/slides | Yes | Add new slide |
| DELETE | /api/presentations/[id]/slides/[slideId] | Yes | Delete slide |
| PATCH | /api/presentations/[id]/slides/reorder | Yes | Reorder slides |

**PATCH /api/presentations/[id]/slides/[slideId]**
- Request: `{ elements?: Element[], background_type?: string, background_value?: string, notes?: string }`
- Response 200: `{ data: Slide }`

**POST /api/presentations/[id]/slides**
- Request: `{ order: number, background_type?: string, background_value?: string }`
- Response 201: `{ data: Slide }`

**PATCH /api/presentations/[id]/slides/reorder**
- Request: `{ slideIds: string[] }` (new order)
- Response 200: `{ data: Slide[] }`

## Implementation

### Directory Structure (new files for this unit)
```
src/
├── app/
│   ├── editor/
│   │   └── [id]/
│   │       └── page.tsx            # Editor page (canvas workspace)
│   └── api/
│       └── presentations/
│           └── [id]/
│               └── slides/
│                   ├── route.ts           # POST (add slide)
│                   ├── [slideId]/route.ts  # PATCH, DELETE
│                   └── reorder/route.ts   # PATCH (reorder)
├── components/
│   └── editor/
│       ├── canvas-viewport.tsx      # Scaled viewport container
│       ├── element-renderer.tsx     # Element type dispatcher
│       ├── elements/
│       │   ├── text-element.tsx     # Text display + double-click edit
│       │   ├── image-element.tsx    # Image display
│       │   ├── shape-element.tsx    # Shape rendering
│       │   └── chart-element.tsx    # Chart placeholder (future unit)
│       ├── transform-handles.tsx    # Resize/rotate handles
│       ├── selection-manager.tsx    # Selection state + outline
│       ├── inline-text-editor.tsx   # Tiptap editor wrapper
│       ├── slide-thumbnails.tsx     # Sidebar thumbnails + dnd-kit
│       └── editor-toolbar.tsx       # Top toolbar
├── store/
│   └── editor-store.ts             # Canvas-specific Zustand store with undo/redo
└── hooks/
    ├── use-canvas-scale.ts          # ResizeObserver + scale calculation
    ├── use-element-drag.ts          # Custom drag hook
    ├── use-element-resize.ts        # Custom resize hook
    └── use-element-rotate.ts        # Custom rotate hook
```

### Key Algorithms

**Scale-to-Fit**:
```typescript
const scale = Math.max(0.15, Math.min(2.5,
  Math.min((containerWidth - 96) / 960, (containerHeight - 96) / 540)
));
```

**Element Transform (drag)**:
```typescript
onMouseDown → capture startX, startY, element.x, element.y
onMouseMove → delta = (clientX - startX) / scale
              newX = element.x + deltaX
              newY = element.y + deltaY
              updateElement({ x: newX, y: newY })
onMouseUp → commit to store, push to undo history
```

**Rotation calculation**:
```typescript
const center = { x: element.x + element.width/2, y: element.y + element.height/2 };
const angle = Math.atan2(mouseY - center.y, mouseX - center.x) * (180 / Math.PI);
```

## Traceability

| Requirement | Component(s) | Endpoint(s) | Status |
|-------------|-------------|-------------|--------|
| US-01 (Element editing) | Transform Handles, Element Renderer, Selection Manager | PATCH slides/[slideId] | ✅ Covered |
| US-02 (Viewport zoom/pan) | Canvas Viewport, Editor Toolbar | — (client-only) | ✅ Covered |
| US-03 (Rich text editing) | Rich Text Editor (Tiptap), Inline Text Editor | PATCH slides/[slideId] | ✅ Covered |
| US-23 (Thumbnails & ordering) | Slide Thumbnails, @dnd-kit | PATCH slides/reorder, POST/DELETE slides | ✅ Covered |
| US-26 (Undo/Redo) | Undo/Redo System (Zustand immer) | — (client-only) | ✅ Covered |

**Coverage**: 5/5 stories covered (100%)
