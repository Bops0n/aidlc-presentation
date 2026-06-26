# Design Decisions — Presenter Unit (D3)

## Context Summary
- **Unit**: Presenter (Wave 6)
- **Scope**: Full-screen slideshow + transitions + laser pointer + speaker notes + timer + animations
- **Stories**: US-15 (Full-screen slideshow), US-16 (Laser pointer), US-17 (Notes & timer), US-24 (Transitions), US-27 (Element animations), US-28 (Animation audit)
- **Dependencies**: Foundation, Canvas Editor (read slide/element data)
- **Settled**: Next.js, Zustand, Tailwind. All client-side (no new deps/API key needed).

---

## Decision Questions

### D3-1: Transitions Implementation
**Question**: วิธีทำ slide transitions (fade/slide/zoom)?
- 1) CSS transitions/animations (Tailwind + custom keyframes) **(Recommended)**
- 2) Library: Framer Motion (declarative, powerful แต่เพิ่ม dependency)
- 3) Other (please specify): _______

**Answer**: 2

---

### D3-2: Element Entrance Animations
**Question**: Element animations (fade/fly/slide/zoom/bounce/spin) ตอน slide ปรากฏ?
- 1) CSS keyframe animations + animationDelay (ตาม element config) **(Recommended)**
- 2) Framer Motion stagger
- 3) ข้ามไปก่อน (transitions อย่างเดียว, ทำ element animation ทีหลัง)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-3: Presenter View Layout
**Question**: Speaker notes + timer แสดงอย่างไร?
- 1) Full-screen slide + overlay controls (notes/timer toggle ได้) — single window **(Recommended)**
- 2) Dual-window presenter view (audience + presenter แยกจอ)
- 3) Other (please specify): _______

**Answer**: 1

---

### D3-4: Animation Audit (US-28)
**Question**: ตรวจ animation issues เมื่อไหร่?
- 1) แสดง warnings ใน editor (ก่อนเข้า presenter) — density >6, opacity=0+animation, sync pile-up **(Recommended)**
- 2) ตรวจตอน export เท่านั้น
- 3) ข้ามไปก่อน
- 4) Other (please specify): _______

**Answer**: 1

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
- D3-1 Transitions: Framer Motion (slide transitions)
- D3-2 Element Animations: CSS keyframe animations + animationDelay
- D3-3 Presenter Layout: Full-screen + overlay controls (single window)
- D3-4 Animation Audit: Warnings in editor before presenter

---

**Instructions**: Fill in your answers above and respond with "done"
