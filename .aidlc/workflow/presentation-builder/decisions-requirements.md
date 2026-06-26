# Requirements Decisions (D1)

## Context Summary
- **Project**: AI-Powered Web-First Presentation Builder
- **Type**: Greenfield / Scope: new
- **Stack**: TypeScript / Next.js (App Router) / Zustand / PostgreSQL / Amazon Bedrock SDK (Claude Sonnet 4.5)
- **Complexity**: High — 15+ stories, 6+ domains
- **Key Features**: AI slide generation, interactive canvas editor (960×540), template gallery (6 categories), rich layout system (30+ layouts), live charts, multi-format export (pixel-perfect), presenter mode, image upload, Unsplash integration, real-time collaboration (co-op editing)

---

## Decision Questions

### D1-1: ขอบเขตของ Feature (Scope)
**Question**: ขอบเขตการพัฒนาในรอบแรกครอบคลุมแค่ไหน?
- 1) MVP — เฉพาะ core features (canvas editor + AI generation + basic export) แล้วค่อยเพิ่มทีหลัง
- 2) Full Product — ครบทุก feature ตาม specification **(Recommended)**
- 3) Phased Delivery — แบ่ง 2-3 phases ตามลำดับความสำคัญ
- 4) Other (please specify): _______

**Answer**: 
2

---

### D1-2: กลุ่มผู้ใช้หลัก (Target Users)
**Question**: ผู้ใช้กลุ่มไหนเป็นเป้าหมายหลัก?
- 1) Presenter — คนที่ต้องนำเสนองาน ต้องการ speed + presenter mode
- 2) Designer — คนที่เน้นความสวยงาม ใช้ canvas editor อย่างละเอียด
- 3) Quick Creator — คนที่พึ่ง AI เป็นหลัก ใส่ prompt แล้วได้ slide
- 4) ทุกกลุ่มเท่าเทียมกัน **(Recommended)**
- 5) Other (please specify): _______

**Answer**: 
4

---

### D1-3: Personas
**Question**: ต้องการสร้าง Personas document แยกรายละเอียดแต่ละกลุ่มผู้ใช้หรือไม่?
- 1) ใช่ — สร้าง personas เพื่อให้ requirements ชัดเจนขึ้น **(Recommended)**
- 2) ไม่ — ใช้ user types ทั่วไปพอ
- 3) Other (please specify): _______

**Answer**: 
1

---

### D1-4: Core Functionality Priority
**Question**: ถ้าต้องจัดลำดับ ฟีเจอร์ไหนสำคัญที่สุด?
- 1) AI Slide Generation — สร้าง slide จาก prompt
- 2) Canvas Editor — แก้ไข slide แบบ interactive
- 3) Export — ส่งออกไฟล์ได้ถูกต้อง (pixel-perfect)
- 4) ทุกอย่างสำคัญเท่ากัน ต้องทำครบ **(Recommended)**
- 5) Other (please specify): _______

**Answer**: 
2

---

### D1-5: Template & Layout Scope
**Question**: จำนวน templates และ layouts ที่ต้องมีตอน launch?
- 1) Starter set — 10 templates + 15 layouts เพื่อทดสอบ concept
- 2) Comprehensive — 25+ templates + 30+ layouts ครบทุกกลุ่ม **(Recommended)**
- 3) Extensible — เริ่มน้อยแต่มีระบบให้เพิ่มทีหลังง่าย
- 4) Other (please specify): _______

**Answer**: 
2

---

### D1-6: Data Entities & Persistence
**Question**: ข้อมูลอะไรบ้างที่ต้องเก็บใน PostgreSQL?
- 1) เฉพาะ presentations + slides (user uploads เก็บ file system)
- 2) ทุกอย่าง — presentations, slides, elements, uploads metadata, templates, user preferences **(Recommended)**
- 3) Minimal — เก็บแค่ uploaded images metadata, ที่เหลือ localStorage
- 4) Other (please specify): _______

**Answer**: 
2

---

### D1-7: External Integrations
**Question**: Integrations ไหนบ้างที่ต้องมีตอน launch?
- 1) ทั้งหมด — Bedrock AI, Google Slides, Google Drive, Unsplash **(Recommended)**
- 2) Core only — Bedrock AI + Unsplash (ตัด Google Slides export ไปก่อน)
- 3) AI only — Bedrock AI อย่างเดียว (manual export)
- 4) Other (please specify): _______

**Answer**: 
4 เป็นข้อ 2 แต่ต้องมี pdf และ pptx ด้วย

---

### D1-8: Authentication & Multi-user
**Question**: ระบบต้องมี authentication/multi-user ระดับไหน?
- 1) Basic auth — login เพื่อเก็บ data ส่วนตัว, share link ให้คนอื่นดู
- 2) Collaborative — login + invite คนอื่นมา co-edit presentation แบบ real-time **(Recommended)**
- 3) Full team workspace — login, teams, roles (owner/editor/viewer), workspace management
- 4) Other (please specify): _______

**Answer**: 
2
---

### D1-9: Business Rules & Constraints
**Question**: มี business rules พิเศษอะไรที่ต้องคำนึงถึง?
- 1) Export fidelity เท่านั้น — layout ต้องตรง web preview 100%
- 2) Export fidelity + collaboration conflict resolution **(Recommended)**
- 3) Export fidelity + rate limiting + storage quota
- 4) ทั้งหมด (export fidelity + conflict resolution + rate limiting + storage quota)
- 5) Other (please specify): _______

**Answer**: 
5 1+2
---

### D1-10: Offline vs Online Priority
**Question**: ระบบควร prioritize offline-first หรือ online-first?
- 1) Hybrid — localStorage cache + PostgreSQL sync **(Recommended)**
- 2) Offline-first — ทำงานได้เต็มที่ไม่ต้องมี internet (sync เมื่อ online)
- 3) Online-first — ต้อง online ตลอด, PostgreSQL เป็น primary store
- 4) Other (please specify): _______

**Answer**: 
3

---

### D1-11: Team Size
**Question**: จำนวนนักพัฒนาที่จะทำโปรเจกต์นี้?
- 1) Solo (1 developer)
- 2) Small team (2–3) **(Recommended)**
- 3) Medium team (4–8)
- 4) Large team (9+)

**Answer**: 
1

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
<!-- Auto-populated after user fills answers. One line per decision. -->
- D1-1 Scope: Full Product — ครบทุก feature ตาม specification
- D1-2 Target Users: ทุกกลุ่มเท่าเทียมกัน (Presenter, Designer, Quick Creator, Collaborator)
- D1-3 Personas: ใช่ — สร้าง personas
- D1-4 Core Priority: Canvas Editor เป็นหลัก
- D1-5 Templates & Layouts: Comprehensive — 25+ templates + 30+ layouts ครบทุกกลุ่ม
- D1-6 Data Persistence: ทุกอย่างใน PostgreSQL (presentations, slides, elements, uploads, templates, preferences)
- D1-7 Integrations: Bedrock AI (Claude Sonnet 4.5) + Unsplash + PDF export + PPTX export (ตัด Google Slides export)
- D1-8 Authentication: Collaborative — login + invite co-edit real-time
- D1-9 Business Rules: Export fidelity (layout ตรง 100%) + collaboration conflict resolution
- D1-10 Offline/Online: Online-first — ต้อง online, PostgreSQL เป็น primary store
- D1-11 Team Size: Solo (1 developer)

---

**Instructions**: Fill in your answers above and respond with "done"

---

## Validation Notes

### Conflict Resolutions
1. **Full Product + Solo** → ✅ Keep — ยืนยันทำครบทั้งหมดคนเดียว (acknowledged: ใช้เวลานาน)
2. **Real-time Collaboration Level** → Full real-time — เห็น cursor กันทัน, element lock, CRDT-based sync
3. **Online-first Confirmation** → ใช่ — online-first, ไม่ต้อง offline support

### Adjusted Context
- Solo developer ทำ full product — decomposition จะแบ่ง units ให้ implement ทีละส่วนได้
- Real-time collaboration = full (WebSocket + CRDT + presence + cursor sync + element locking)
- Online-first = PostgreSQL เป็น primary, ไม่ต้อง offline fallback
