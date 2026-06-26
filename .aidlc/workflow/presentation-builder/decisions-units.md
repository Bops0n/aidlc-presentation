# Decomposition Decisions (D2)

## Context Summary
- **Project**: AI-Powered Web-First Presentation Builder
- **Stories**: 28 across 9 functional areas
- **User Types**: 4 (Presenter, Designer, Quick Creator, Collaborator)
- **Stack**: TypeScript / Next.js (App Router) / Zustand / PostgreSQL
- **Team**: Solo developer
- **Scope**: Full product
- **Key Domains**: Canvas Editor, AI Generation, Template/Layout, Charts,
  Media, Export, Presenter Mode, Collaboration, Auth/State

---

## Decision Questions

### D2-1: Decomposition Need
**Question**: โปรเจกต์นี้ต้องแบ่ง units หรือไม่?
- 1) ใช่ — หลาย domain ที่เป็นอิสระ ควรแบ่ง units **(Recommended)**
- 2) ไม่ — ทำเป็น single unit ทั้งหมด
- 3) Other (please specify): _______

**Answer**: 1

---

### D2-2: Architecture Pattern
**Question**: Architecture pattern ที่เหมาะสม?
- 1) Modular Monolith — single deployable, แบ่ง modules ภายใน **(Recommended)**
- 2) Microservices — แยก services (collaboration, AI, main app)
- 3) Single Unit — ไม่แบ่ง module ชัดเจน
- 4) Other (please specify): _______

**Answer**: 1

---

### D2-3: Decomposition Strategy
**Question**: ใช้ strategy ใดในการแบ่ง units?
- 1) Domain-Driven — แบ่งตาม business domain (Canvas, AI, Collab, Export) **(Recommended)**
- 2) Layer-Based — แบ่งตาม layer (Frontend, API, Data)
- 3) User Journey-Based — แบ่งตาม user flow (Create, Edit, Present, Share)
- 4) Hybrid — ผสม domain + layer
- 5) Other (please specify): _______

**Answer**: 1

---

### D2-4: Foundation Unit
**Question**: ต้องมี foundation unit (shared infrastructure) แยกก่อนหรือไม่?
- 1) ใช่ — ทำ foundation ก่อน (project setup, auth, DB schema, shared types, common components) **(Recommended)**
- 2) ไม่ — แต่ละ unit จัดการเอง
- 3) Other (please specify): _______

**Answer**: 1

---

### D2-5: Unit Proposals
**Question**: เห็นด้วยกับการแบ่ง units ตามนี้หรือไม่?

**Proposed Units**:
1. **Foundation** — Project setup, auth (US-21), DB schema, shared types, common UI components
2. **Canvas Editor** — Interactive canvas, elements CRUD, zoom/pan, rich text (US-01~03, US-23, US-26)
3. **AI Generation** — Bedrock (Claude Sonnet 4.5) integration, prompt → slides pipeline, layout mapping (US-04~05)
4. **Templates & Themes** — Template gallery, layout presets, theme system (US-06~08)
5. **Data Visualization** — Chart rendering, data grid editing (US-09~10)
6. **Media** — Image upload, Unsplash integration (US-11~12)
7. **Export** — PDF + PPTX generation, pixel-perfect rendering (US-13~14)
8. **Presenter** — Slideshow mode, transitions, laser pointer, notes (US-15~17, US-24, US-27~28)
9. **Collaboration** — WebSocket, CRDT, presence, locking, auto-save (US-18~20, US-25)

- 1) เห็นด้วย — ใช้ตามนี้ **(Recommended)**
- 2) รวมบาง units — (ระบุว่าจะรวมอะไร)
- 3) แยกเพิ่ม — (ระบุว่าจะแยกอะไร)
- 4) Other (please specify): _______

**Answer**: 1

---

### D2-6: Dependencies & Sequence
**Question**: ลำดับการพัฒนาที่เหมาะสม?

**Proposed Sequence**:
```
Wave 1: Foundation (ต้องทำก่อน — auth, DB, types)
Wave 2: Canvas Editor (core editing)
Wave 3: Templates & Themes + Data Visualization + Media (parallel, ต่อยอดจาก canvas)
Wave 4: AI Generation (ต้องมี canvas + templates ก่อน)
Wave 5: Export (ต้องมี canvas + charts ก่อน)
Wave 6: Presenter (ต้องมี slides + transitions)
Wave 7: Collaboration (ต่อยอดจากทุก unit — ทำสุดท้าย)
```

- 1) เห็นด้วย — ทำตามลำดับนี้ **(Recommended)**
- 2) ปรับลำดับ — (ระบุ)
- 3) Other (please specify): _______

**Answer**: 1

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
<!-- Auto-populated after user fills answers. One line per decision. -->
- D2-1 Decomposition: ใช่ — แบ่ง units ตาม domain
- D2-2 Architecture: Modular Monolith — single deployable, แบ่ง modules ภายใน
- D2-3 Strategy: Domain-Driven — แบ่งตาม business domain
- D2-4 Foundation: ใช่ — ทำ foundation unit ก่อน (auth, DB, types, common components)
- D2-5 Units: 9 units (Foundation, Canvas Editor, AI Generation, Templates & Themes, Data Visualization, Media, Export, Presenter, Collaboration)
- D2-6 Sequence: Wave 1→7 ตาม dependency chain

---

**Instructions**: Fill in your answers above and respond with "done"
