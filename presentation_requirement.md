# AI-Powered Web-First Presentation Builder
## Next.js (App Router) Rebuild & Migration Architecture Specification (`next_requirement.md`)

This document is a comprehensive, production-ready specification designed for an AI Coding Agent or Developer to reconstruct the **AI-Powered Web-First Presentation Builder** from absolute scratch using **Next.js (App Router)**.

All concrete implementation details (packages, libraries, and code syntax) are specified at the functional, algorithmic, and architectural level, leaving the choice of tools, packages, or direct implementations to the execution agent.

---

## 1. System Architecture & High-Level Design

The system must be built as a full-stack Next.js application leveraging App Router features. All operations must run cleanly on modern devices, with a clear boundary between interactive client states and secure server route handlers.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS (APP ROUTER) APP                        │
├───────────────────────────────────┬────────────────────────────────────┤
│         Client Components         │           Route Handlers           │
│        (use client directive)     │            (Server-Side)           │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Interactive Canvas & Viewport   │ • /api/generate-slides             │
│ • Rich Text Editor & Live Charts   │   (Wraps Bedrock SDK with Schemas)  │
│ • Slide Sorters & Drag Drop       │ • /api/export                      │
│ • State Stores (Zustand Persist)  │   (Integrates Google API SDK)      │
└───────────────────────────────────┴────────────────────────────────────┘
```

### 1.1 Rendering Split
*   **Server Route Handlers (`/app/api/...`):** Handle secure, server-side actions including Amazon Bedrock generative pipelines (keeping AWS credentials hidden from client bundles) and Google Slides export integrations (handling OAuth tokens or Service Account keys safely).
*   **Client Pages & Components (`'use client'`):** Manage real-time graphics canvas editing, drag-and-drop slide sorters, interactive chart grids, theme managers, and presenter modes.
*   **Client Hydration Guard:** Because slide states are persisted locally in browser storage, a hydration guard must wrap the editor mount. This prevents Next.js static server rendering from complaining about local storage mismatches.

---

## 2. Core Domain Data Schemas (`types/index.ts`)

Define precise TypeScript structures to enforce a deterministic spatial editing layout.

### 2.1 Element Contract
Every graphic item on a slide canvas is represented by an absolute-positioned bounding box.
*   `id`: String identifier.
*   `type`: `"text" | "image" | "shape" | "chart" | "icon" | "video"`.
*   `x`, `y`, `width`, `height`: Number attributes representing pixels on a native **960 × 540 (16:9)** coordinate grid.
*   `rotation`: Rotation in degrees.
*   `opacity`: Opacity percentage ($0$ to $100$).
*   `animation`: Selected visual entrance transition (e.g. fade, fly, slide, zoom, bounce, spin).
*   `animationDelay`: Number (seconds) to stagger overlapping elements.
*   **Text Specifics:** Content string, font size, text alignment, font family, font weight, line height, color.
*   **Image Specifics:** Photo resource URLs. Image references must include `referrerPolicy="no-referrer"` to display public URLs correctly in sandboxed iframes.
*   **Chart Specifics:** `chartType` (`"bar" | "line" | "area" | "pie" | "donut" | "radar"`), `chartTitle`, `chartData` array of metrics (`{ name: string, value: number }`), custom theme keys, and color hex arrays.

### 2.2 Slide Contract
*   `id`: String identifier.
*   `backgroundType`: `"color" | "gradient" | "image"`.
*   `backgroundValue`: Hex value, CSS gradient string, or Unsplash URL.
*   `elements`: Order-dependent array of `Element` contracts.
*   `transitionMode`: Slide transition preset (`"none" | "fade" | "slide" | "zoom"`).
*   `notes`: String containing presentation cues.

### 2.3 Presentation Contract
*   `id`, `title`: Strings.
*   `slides`: Ordered array of `Slide` contracts.
*   `createdAt`, `updatedAt`: ISO timestamps.

---

## 3. Client State Management & Persistence (Zustand Store)

Manage active presentations under an offline-first state machine:
1.  **Local Storage Synchronization:** Save all change sequences automatically to local storage keys (e.g., `"presentations_list"`).
2.  **Undo/Redo History Stacks:** Retain twin-linked array buffers capturing element mutations (colors, sizes, coordinate drags, inline typing), allowing rapid rollback/rollforward actions.
3.  **Bootstrapping/Seeding:** If browser storage has no registered slides, instantiate a beautiful onboarding presentation template containing headings, bullet lists, shapes, and dynamic charts to immediately guide users.

---

## 4. High-Fidelity Client Workspace Features

### 4.1 Responsive 16:9 Canvas Viewport
*   **Canvas Grid:** The slide canvas must enforce native logical dimensions of **960 × 540 pixels** ($16:9$ aspect ratio).
*   **Intelligent Scale-to-Fit:** Calculate available viewport space in real time using a Resize Observer. Scale the canvas uniformly using CSS transform origins:
    $$\text{scale} = \min\left(\frac{\text{containerWidth} - 96}{960}, \frac{\text{containerHeight} - 96}{540}\right)$$
    Force a minimum scale barrier ($0.15$) and a maximum barrier ($1.25$ or larger) to ensure usability.
*   **Manual Zoom Overlay:** Allow users to toggle between automated fitting and manual scale ratios ($15\%$ to $250\%$) with precise percentage displays.
*   **Workspace Panning:** When manually zoomed in, support mouse middle-click dragging or `Ctrl + Mouse Drag` actions, capturing the viewport displacement under local `panX` and `panY` coordinate vectors.
*   **Layout Resilience:** Apply explicit `shrink-0` classes and overflow controls to canvas stages, backgrounds, and element outlines to prevent component collapse during high browser-level zooms ($150\%+$).

### 4.2 Rich Inline Text Editor
*   **Double-Click Activation:** Replace plain-text canvas boxes with a WYSIWYG text box.
*   **Properties Toolbar:** Expose floating options to format text strings (font family switching, inline color pickers, font sizing, weights, line heights, and alignments) directly.

### 4.3 Vector-Style Live Charts Renderer
*   **Theme Integration:** Sync charts to display the colors of the presentation's visual theme automatically.
*   **Interactive Data Grid Panel:** When a chart element is focused, render an editable data-grid layout on the right sidebar. Users must be able to:
    *   Directly modify label names and numeric metric values inside table cells.
    *   Append new record rows.
    *   Delete records.
    *   Toggle chart models (`bar`, `line`, `area`, `pie`, `donut`, `radar`) in real time, refreshing the slide canvas instantly.

### 4.4 Thumbnails Sorter & Sidebar
*   **Scale-Down Microviews:** Implement small slide miniatures on the left panels, rendered with small CSS scales to ensure accurate layouts.
*   **Drag & Drop Ordering:** Let users drag thumbnails to rearrange the presentation sequence.
*   **Utility Hooks:** Expose controls to duplicate, delete, or append blank slides instantly.

### 4.5 Visual Theme Coordinator
*   **Pre-Built Presets:** Support beautiful dark and light themes.
*   **Global Harmonization:** Allow users to apply theme configurations (matching head/body typography pairings, background styles, and color hierarchies) to all slides simultaneously in one click.

### 4.6 Unsplash Library Integrations
*   **Search Overlay:** An inline modal querying Unsplash API search routes.
*   **Canvas Placement:** Let users search, click a stock photo, and insert it directly as a dynamic picture element or slide background.

---

## 5. Slide Show & Presenter View

An immersive presentation view that supports professional speaking flows:
*   **Full-Screen Media Viewport:** Stretch active slides to consume the user's monitor cleanly using CSS-fit configurations.
*   **Transitions Engine:** Execute fluid sliding, fading, or zooming animations when swapping slides.
*   **Interactive Presenter Helpers:**
    *   **Virtual Laser Pointer:** An option that converts the user's cursor into an elegant visual laser point with dynamic trail circles.
    *   **Keyboard Navigation:** Listen to `Left / Right Arrow Keys` and `Spacebar` for slides routing.
    *   **Speaker Notes Sidebar:** Provide a split presenter dock showing active speech notes and elapsed timers.

---

## 6. Server-Side AI Slide Generator Pipeline (`/app/api/generate-slides/route.ts`)

Implement a server-side route handler that executes prompt engineering patterns with the Amazon Bedrock SDK (Claude Sonnet 4.5 — model ID: anthropic.claude-sonnet-4-5-20250929-v1:0).

### 6.1 Strict Prompt Directives
The server system prompt must instruct the model to act as a layout architect:
1.  **Structured Narrative:** Arrange slides sequentially based on user topics (e.g. Introduction, Challenges, Solutions, Stats, Outro).
2.  **Structural Layout Presets:** Force the model to assign design themes per slide:
    *   `title`: Large display title alignments.
    *   `two-column`: Binary columns splitting elements left and right.
    *   `image-focus`: Hero visual (image/chart) on the left side, bullet lists on the right.
    *   `content`: Single-column content streams.
3.  **Visualization Injection:** If the topic involves growth metrics, analytics, finances, comparisons, or distributions, the model **must declare a `chart` element**, generating clean label-value data blocks under `chartData`.

### 6.2 Schema Integrity Check
Validate responses on the server using structural JSON schema validators:

```json
{
  "title": "Generated Presentation Title",
  "theme": {
    "backgroundColor": "Hex Code",
    "textColor": "Hex Code",
    "accentColor": "Hex Code",
    "headingFont": "Font Name",
    "bodyFont": "Font Name"
  },
  "slides": [
    {
      "slideTitle": "Slide Header Title",
      "layout": "title | two-column | image-focus | content",
      "elements": [
        {
          "type": "title | body | bullet | image_prompt | image | chart",
          "content": "Content text or topic query for stock images",
          "suggestedAnimation": "none | fade_in | fly_in_bottom | zoom_in",
          "chartType": "bar | line | area | pie | donut | radar",
          "chartTitle": "Chart Label Header",
          "chartData": [
            { "name": "Metric Label", "value": 100 }
          ]
        }
      ],
      "notes": "Speaker notes"
    }
  ]
}
```

### 6.3 Spatial Grid Translation Algorithm
The Next.js endpoint must parse the generated outline and map elements to physical pixel positions ($x, y, w, h$) on the $960 \times 540$ coordinate canvas:
*   **`two-column` layout mapping:** Position left-column elements at $x=80, w=380$ and right-column elements at $x=500, w=380$.
*   **`image-focus` layout mapping:** Position primary graphic/chart blocks at $x=80, y=140, w=400, h=340$ and description bullets at $x=520, y=150, w=360$.
*   **Sizing overrides:** Ensure charts are given clean containers ($w=800, h=200$ for standard, $w=380, h=240$ for columns) and colored with the theme's colors dynamically.

---

## 7. Export & Animation Auditing Engines

### 7.1 Visual Quality & Animation Audit
Validate animation configurations to keep presentations visually polished. Warn users or prevent exports if:
1.  **Density Threshold Exceeded:** A single slide has more than 6 animated elements, which might feel overwhelming.
2.  **Opacity Conflict:** An element has an animation but its base opacity is set to $0$ (making it invisible).
3.  **Synchronization Pile-ups:** Overlapping elements share identical animations without staggered delays.

### 7.2 Multi-Format Exporters
*   **Vector PDF Exporter:** Run client-side PDF builders to print vector frames matching presentation slide coordinate layers.
*   **Local PPTX Exporter:** Build standard PowerPoint files (`.pptx`) on the client side, mapping text blocks, shapes, colors, and stock pictures to native Office shapes.
*   **Cloud Google Slides Export (`/app/api/export`):** Secure server route handler that uses official Google Slides and Google Drive APIs. When provided with a valid Google Cloud Service Account credential (`GOOGLE_SERVICE_ACCOUNT_KEY`), it programmatically connects and builds a live, editable presentation directly in the cloud.

---
*End of Next.js Migration Architecture Specification.*
