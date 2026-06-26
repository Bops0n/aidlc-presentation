# Design Decisions — Media Unit (D3)

## Context Summary
- **Unit**: Media (Wave 3)
- **Scope**: Image upload จากเครื่อง + Unsplash search & insert
- **Stories**: US-11 (Upload images), US-12 (Unsplash search)
- **Dependencies**: Foundation (DB, auth, file storage), Canvas Editor (image element)
- **Settled**: Prisma, Zod, Tailwind, Route Handlers, Zustand, pnpm
- **Constraint**: รองรับ JPEG/PNG/WebP/SVG, max 10MB. Unsplash images ต้องมี referrerPolicy="no-referrer"

---

## Decision Questions

### D3-1: File Storage Location
**Question**: เก็บไฟล์ที่อัพโหลดที่ไหน?
- 1) Local filesystem (`/public/uploads`) — ง่าย, เหมาะ self-hosted Docker **(Recommended)**
- 2) Cloud storage (S3/R2/Cloudinary) — scalable แต่ต้อง setup เพิ่ม
- 3) Database (bytea/base64) — ง่ายแต่ DB บวม, ไม่แนะนำ
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-2: Upload Metadata Storage
**Question**: เก็บ metadata ของ uploads ใน DB หรือไม่?
- 1) ใช่ — สร้าง Upload table (owner, url, filename, size, created_at) เพื่อ track + reuse **(Recommended)**
- 2) ไม่ — เก็บแค่ไฟล์, URL ใส่ใน element โดยตรง
- 3) Other (please specify): _______

**Answer**: 1

---

### D3-3: Image Processing
**Question**: ประมวลผลรูปก่อนเก็บหรือไม่?
- 1) Validate type/size เท่านั้น (ไม่ resize) **(Recommended)**
- 2) Resize + optimize (sharp library) — ลดขนาดไฟล์
- 3) สร้าง thumbnail + original
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-4: Media Picker UI
**Question**: UI สำหรับเลือก/ใส่รูป?
- 1) Modal with tabs: Upload | Unsplash | My Uploads **(Recommended)**
- 2) Sidebar panel
- 3) แยก 2 ปุ่ม (upload โดยตรง + Unsplash modal)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-5: Insert Mode
**Question**: เมื่อเลือกรูป ใส่เป็นอะไร?
- 1) Image element เสมอ (user ย้าย/resize เองทีหลัง) **(Recommended)**
- 2) ถามทุกครั้ง: element หรือ background
- 3) มี 2 ปุ่ม: "Insert as element" / "Set as background"
- 4) Other (please specify): _______

**Answer**: 1

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
- D3-1 File Storage: Local filesystem (/public/uploads) — self-hosted Docker
- D3-2 Metadata Storage: Upload table (owner, url, filename, size, created_at)
- D3-3 Image Processing: Validate type/size only (no resize)
- D3-4 Picker UI: Modal with tabs (Upload | Unsplash | My Uploads)
- D3-5 Insert Mode: Image element เสมอ

---

**Instructions**: Fill in your answers above and respond with "done"
