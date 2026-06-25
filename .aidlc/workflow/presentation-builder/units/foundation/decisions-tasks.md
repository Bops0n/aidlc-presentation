# Tasks Decisions — Foundation Unit (D4)

## Context Summary
- **Unit**: Foundation (Wave 1)
- **Components**: 6 (Auth, Presentation CRUD, DB Layer, Common UI, Error Handling, App Shell)
- **Entities**: 3 (User, Presentation, Slide)
- **Endpoints**: 6
- **Stack**: Next.js + Prisma + NextAuth + Tailwind + Zustand + Vitest
- **Team**: Solo developer

---

## Decision Questions

### D4-1: Task Breakdown Strategy
**Question**: วิธีแบ่ง tasks?
- 1) Component-first — ทำทีละ component ให้เสร็จ (DB → Auth → CRUD → UI) **(Recommended)**
- 2) Layer-first — ทำทุก component ของ layer เดียวกัน (all DB → all API → all UI)
- 3) Feature-first — ทำ feature เต็ม vertical slice (login ครบ → CRUD ครบ)
- 4) Other (please specify): _______

**Answer**: 1

---

### D4-2: Implementation Approach
**Question**: เขียน test ก่อนหรือหลัง?
- 1) Test-after — เขียน code ก่อน เพิ่ม test ทีหลัง **(Recommended)**
- 2) TDD — เขียน test ก่อน แล้ว implement ให้ผ่าน
- 3) Critical-only TDD — TDD เฉพาะ auth/validation, test-after ที่เหลือ
- 4) Other (please specify): _______

**Answer**: 1

---

### D4-3: Component Priority
**Question**: ลำดับ component ที่ควรทำก่อน?
- 1) DB Layer → Error Handling → Auth → Presentation CRUD → Common UI → App Shell **(Recommended)**
- 2) Common UI → App Shell → DB → Auth → CRUD → Error Handling
- 3) Auth → DB → CRUD → UI → Shell → Errors
- 4) Other (please specify): _______

**Answer**: 1

---

### D4-4: Task Granularity
**Question**: ขนาดของแต่ละ task?
- 1) Atomic — แต่ละ task ทำ 1 ไฟล์/1 function (เล็กมาก)
- 2) Single-concern — แต่ละ task ทำ 1 concern ให้จบ (เช่น "setup Prisma schema + client") **(Recommended)**
- 3) Multi-concern — รวมหลาย concerns ใน task เดียว (เช่น "setup DB + auth ทั้งหมด")
- 4) Other (please specify): _______

**Answer**: 2

---

### D4-5: Docker/Deployment Tasks
**Question**: รวม Docker setup ใน foundation หรือแยก?
- 1) รวม — ทำ Dockerfile + docker-compose ใน foundation เลย **(Recommended)**
- 2) แยก — ทำ development setup ก่อน, Docker ทำทีหลังใน build phase
- 3) Other (please specify): _______

**Answer**: 2

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
- D4-1 Strategy: Component-first (DB → Auth → CRUD → UI)
- D4-2 Approach: Test-after
- D4-3 Priority: DB Layer → Error Handling → Auth → Presentation CRUD → Common UI → App Shell
- D4-4 Granularity: Single-concern (1 concern per task)
- D4-5 Docker: แยก — Docker ทำทีหลังใน build phase

---

**Instructions**: Fill in your answers above and respond with "done"
