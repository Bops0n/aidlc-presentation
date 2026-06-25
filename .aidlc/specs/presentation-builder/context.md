# Context Assessment

## Summary
- **Type**: Greenfield
- **Scope**: new
- **Stack**: TypeScript / Next.js (App Router) / Zustand / Google Gemini SDK / PostgreSQL
- **Architecture**: Full-stack Next.js with Route Handlers (Client/Server split)
- **Feature**: AI-Powered Web-First Presentation Builder — สร้าง slide ด้วย AI, แก้ไข canvas แบบ interactive, export หลายรูปแบบ
- **Impact**: New standalone
- **Complexity**: High — 15+ stories, 6+ domains, 3 user types
- **Recommendations**: Personas Yes, Units Yes, NFR Yes

## Project Overview
- **Type**: Greenfield
- **Assessment Date**: 2025-06-25T11:15:00Z

## Technology Stack
- **Languages**: TypeScript
- **Frameworks**: Next.js 14+ (App Router)
- **Build System**: npm / next build
- **Testing**: Pending D3 decisions
- **Infrastructure**: Pending D3 decisions
- **State Management**: Zustand with localStorage persistence
- **Database**: PostgreSQL (สำหรับเก็บ presentations, user uploads, metadata)
- **AI Integration**: Google Gemini SDK (server-side)
- **Export**: Google Slides API, client-side PDF/PPTX generation
- **File Upload**: User image upload with server-side storage

## Patterns & Conventions
N/A — greenfield project. จะถูกกำหนดในช่วง design phase.

## Codebase Analysis
N/A — greenfield project.

## Feature Impact

**Affected Areas**: New standalone application

| Area | Impact | Reason |
|------|--------|--------|
| Canvas Editor | New | Interactive 960×540 slide canvas with drag/resize |
| AI Generator | New | Gemini-powered slide generation pipeline |
| State Management | New | Zustand store with undo/redo and persistence |
| Export Engine | New | PDF, PPTX, Google Slides export |
| Presenter Mode | New | Full-screen slideshow with transitions and laser pointer |
| Theme System | New | Dark/light presets with global harmonization |
| Template Gallery | New | Pre-designed templates จัดกลุ่มตามประเภท (Marketing, Business, Developer/Tech, Creative, Education, Minimal) สอดคล้องกับ Layout System |
| Layout System | New | Rich layout presets จัดกลุ่มตามประเภท: Universal, Marketing, Business, Developer/Tech, Creative, Education (30+ layouts) |
| Chart Renderer | New | Live SVG charts with editable data grid |
| Unsplash Integration | New | Stock photo search and placement |
| Image Upload | New | User uploads custom images for elements/backgrounds |
| Real-time Collaboration | New | Multi-user co-op editing on same presentation (WebSocket/CRDT) |
| Database Layer | New | PostgreSQL for persistent storage of presentations and uploads |

## Recommendations

- Story Count: High (15+)
- Domain Boundaries: Canvas Editor, AI Generation, Export, Presentation Mode, Theme & Templates, Data Visualization, Media Management, Layout Engine, Real-time Collaboration
- User Types: Presenter (creates and delivers), Designer (focuses on visual quality), Quick Creator (relies on AI generation), Collaborator (co-edits with team)
- Integration Points: Google Gemini API, Google Slides API, Google Drive API, Unsplash API, PostgreSQL database, File storage (user uploads), Real-time sync (WebSocket/CRDT)
- **Personas**: Yes — 3 distinct user types with different workflows
- **Units**: Yes — 6+ domains with clear boundaries, complex system
- **NFR**: Yes — real-time canvas performance, export reliability, AI response quality

## Scope

- **Detected scope**: new
- **Rationale**: ไม่มี source code อยู่เดิม, ผู้ใช้ต้องการสร้างแอปพลิเคชันใหม่ทั้งหมดจาก specification
- **Phases skipped**: None — full workflow

## Recommended Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI-DLC Full Workflow (new)                     │
└─────────────────────────────────────────────────────────────────┘

  ┌───────────┐     ┌──────────────┐     ┌───────────────┐
  │  Context  │────▶│ Requirements │────▶│ Decomposition │
  │    ✅     │     │              │     │               │
  └───────────┘     └──────────────┘     └───────────────┘
                                                  │
                    ┌─────────────────────────────┘
                    ▼
        ┌─────────────────────────────────────┐
        │   Per-Unit Cycle (for each unit):   │
        │                                     │
        │  ┌────────┐  ┌───────┐  ┌───────┐  │
        │  │ Design │─▶│ Tasks │─▶│ Impl  │  │
        │  └────────┘  └───────┘  └───────┘  │
        └─────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────┐     ┌────────┐
        │ Build and Test │────▶│ Deploy │
        └────────────────┘     └────────┘
```

## External References

| Source | Type | What was used |
|--------|------|---------------|
| presentation_requirement.md | Architecture Specification | Full system requirements, data schemas, features, API pipelines |
