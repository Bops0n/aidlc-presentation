# Tasks — Export Unit (PDF only)

## Summary
- **Total Tasks**: 3
- **Dependency**: html2canvas, jspdf

## Task 1: Offscreen Slide Renderer
- **Files**: src/components/editor/slide-static-render.tsx
- **Acceptance**: Renders a slide at exact 960×540 (no scale) using ElementRenderer, for capture

## Task 2: PDF Generator
- **Files**: src/lib/pdf-export.ts
- **Acceptance**: exportToPdf(slides, title) — captures each slide via html2canvas, builds multi-page PDF (1 slide/page), triggers download

## Task 3: Export Button Integration
- **Files**: src/components/editor/editor-toolbar.tsx, src/app/editor/[id]/page.tsx
- **Acceptance**: Export PDF button in toolbar, loading state, calls exportToPdf with current slides
