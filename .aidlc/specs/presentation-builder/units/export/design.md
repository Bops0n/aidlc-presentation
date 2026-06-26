# Export Unit — Design (PDF only)

## Summary
- **Architecture**: Client-side PDF generation (html2canvas + jsPDF)
- **Components**: 2 (Export Button, PDF Generator)
- **Libraries**: html2canvas, jspdf
- **Stories**: US-13 (Export PDF) — US-14 (PPTX) deferred

## Components

### 1. PDF Generator (lib)
- **Purpose**: Render each slide to canvas, compose into multi-page PDF
- **Technology**: html2canvas + jsPDF (client-side)
- **Responsibilities**:
  - For each slide: render slide DOM (960×540) offscreen → html2canvas → image
  - Create jsPDF in landscape, page size matched to 960×540 ratio
  - Each slide = 1 PDF page
  - Preserve element positions/colors/fonts (layout matches web preview)
  - Trigger browser download
- **Exposes**: `exportToPdf(slides, title)`

### 2. Export Button (UI)
- **Purpose**: Toolbar button + progress indicator
- **Responsibilities**: Trigger export, show "Generating..." state, handle errors
- **Part of**: editor-toolbar.tsx

## Rendering Strategy
To match web preview exactly:
1. Render each slide using the SAME element rendering components (ElementRenderer) in a hidden offscreen container at exact 960×540 (no scale transform)
2. html2canvas captures the container at scale 2 (retina quality)
3. Add captured image to PDF page sized 960×540 (px → pt conversion)
4. Loop all slides, then save

## Implementation Notes
- Offscreen render container: position fixed, left -9999px, width 960px height 540px
- Wait for images to load before capture (html2canvas useCORS + allowTaint for Unsplash)
- jsPDF: orientation landscape, unit "px", format [960, 540]

## Traceability
| Requirement | Component(s) | Status |
|-------------|-------------|--------|
| US-13 (Export PDF) | PDF Generator, Export Button | ✅ |
| US-14 (PPTX) | — | Deferred (scope reduced) |
