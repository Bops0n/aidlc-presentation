# Design Decisions — Templates & Themes Unit (D3)

## Context Summary
- **Unit**: Templates & Themes (Wave 3)
- **Scope**: Template gallery (25+ templates, 6 categories), layout presets (30+, 6 groups), theme system (apply colors/fonts to all slides)
- **Stories**: US-06 (Template gallery), US-07 (Layout presets), US-08 (Theme system)
- **Dependencies**: Foundation (DB, auth, types), Canvas Editor (element structure)
- **Settled by Foundation**: Prisma, Zod, Tailwind, Route Handlers, Zustand, Vitest, pnpm

---

## Decision Questions

### D3-1: Template Storage
**Question**: Templates เก็บที่ไหน?
- 1) Hard-coded ใน TypeScript files (static data, no DB query) **(Recommended)**
- 2) PostgreSQL (dynamic, admin สามารถเพิ่ม/แก้ไขได้)
- 3) JSON files ใน /public (static, easy to edit)
- 4) Other (please specify): _______

**Answer**: 2

---

### D3-2: Theme Application Strategy
**Question**: เมื่อ apply theme ทำอย่างไรกับ existing elements?
- 1) Replace colors/fonts ของทุก element ทันที (destructive) **(Recommended)**
- 2) Apply เฉพาะ elements ที่ยังไม่ถูก customize
- 3) สร้าง theme variables (CSS custom properties) ให้ elements reference
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-3: Layout Apply Behavior
**Question**: เมื่อ apply layout preset ทำอย่างไรกับ existing elements?
- 1) Reposition existing elements ตาม layout grid (keep content) **(Recommended)**
- 2) Replace ทั้ง slide ด้วย layout template (ลบ elements เดิม)
- 3) เพิ่ม placeholder elements ตาม layout (ไม่แตะ elements เดิม)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-4: Template Preview
**Question**: Template preview ใน gallery แสดงอย่างไร?
- 1) Static thumbnail images (pre-rendered) **(Recommended)**
- 2) Live mini-render (scale down actual slides)
- 3) CSS mockup (simplified representation)
- 4) Other (please specify): _______

**Answer**: 2

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
- D3-1 Template Storage: PostgreSQL (dynamic, admin can manage)
- D3-2 Theme Application: Replace colors/fonts ของทุก element ทันที (destructive)
- D3-3 Layout Apply: Reposition existing elements ตาม layout grid (keep content)
- D3-4 Template Preview: Live mini-render (scale down actual slides)

---

**Instructions**: Fill in your answers above and respond with "done"
