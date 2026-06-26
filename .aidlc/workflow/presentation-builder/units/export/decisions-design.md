# Design Decisions — Export Unit (D3)

## Context Summary
- **Unit**: Export (Wave 5) — **PDF only** (PPTX ตัดออกตามที่ user ระบุ)
- **Scope**: Export presentation เป็น PDF ที่ layout ตรงกับ web preview 100% (pixel-perfect)
- **Stories**: US-13 (Export PDF) — US-14 (PPTX) ถูกตัดออก
- **Dependencies**: Foundation, Canvas Editor, Data Visualization (charts as vector), Templates & Themes
- **Settled**: Next.js, Zustand, Tailwind, charts ใช้ Recharts SVG
- **Constraint**: layout ต้องตรง web preview — position/size/color/font ไม่เพี้ยน (animation ตัดได้)

---

## Decision Questions

### D3-1: PDF Generation Approach
**Question**: วิธีสร้าง PDF?
- 1) Client-side render DOM → canvas → PDF (html2canvas + jsPDF) — ง่าย แต่ chart/text อาจ rasterize
- 2) Client-side vector PDF (jsPDF + manual draw elements) — vector แท้ แต่ต้อง map ทุก element type เอง
- 3) Server-side headless browser (Puppeteer) render หน้า → PDF — fidelity สูงสุด, vector text **(Recommended)**
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-2: Rendering Fidelity Strategy
**Question**: เพื่อให้ layout ตรง 100% ใช้วิธีไหน?
- 1) Render slide ด้วย HTML/CSS เดียวกับ canvas → Puppeteer screenshot เป็น PDF page **(Recommended)**
- 2) Re-implement rendering logic ใน PDF library
- 3) Other (please specify): _______

**Answer**: 1

---

### D3-3: Export Trigger & Delivery
**Question**: Export ทำงานและส่งไฟล์อย่างไร?
- 1) Client กดปุ่ม → POST ไป /api/export → server สร้าง PDF → download **(Recommended)**
- 2) Client-side ทั้งหมด → generate + download ใน browser
- 3) Other (please specify): _______

**Answer**: 1

---

### D3-4: Multi-Slide Handling
**Question**: จัดการหลาย slides ใน PDF อย่างไร?
- 1) แต่ละ slide = 1 PDF page (960×540 landscape) **(Recommended)**
- 2) Slides เรียงต่อกันในหน้าเดียว
- 3) Other (please specify): _______

**Answer**: 1

---

### D3-5: Puppeteer in Docker
**Question**: Self-hosted Docker ต้องมี Chromium สำหรับ Puppeteer — จัดการอย่างไร?
- 1) ใช้ puppeteer (bundled Chromium) + เพิ่ม deps ใน Dockerfile **(Recommended)**
- 2) ใช้ puppeteer-core + system Chromium
- 3) ใช้ @sparticuz/chromium (serverless-optimized)
- 4) Other (please specify): _______

**Answer**: 4 client-side

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
- D3-1 PDF Approach: Client-side (html2canvas + jsPDF)
- D3-2 Fidelity Strategy: Render HTML/CSS เดียวกับ canvas → capture
- D3-3 Trigger & Delivery: Client-side ทั้งหมด — generate + download ใน browser
- D3-4 Multi-Slide: แต่ละ slide = 1 PDF page (960×540 landscape)
- D3-5 Puppeteer/Docker: N/A — ไม่ใช้ Puppeteer (client-side)

## Validation Notes
- Conflict resolved: D3-1/D3-3 เดิมเลือก server-side Puppeteer แต่ user ยืนยัน client-side ทั้งหมด → ปรับเป็น html2canvas + jsPDF
- Tradeoff acknowledged: text/chart rasterized ใน PDF (อาจไม่คมเมื่อ zoom มาก) แต่ layout ตรง 100%, deploy ง่าย ไม่ต้องแตะ Docker/Chromium

---

**Instructions**: Fill in your answers above and respond with "done"
