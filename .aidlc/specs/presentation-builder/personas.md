# Personas

## Summary
- **User Types**: 4 personas
- **Key Roles**: Presenter, Designer, Quick Creator, Collaborator
- **Design Implications**: Auth + RBAC needed, real-time sync, responsive canvas, accessible UI

## Overview
ระบบรองรับ 4 กลุ่มผู้ใช้ที่มี workflow แตกต่างกัน แต่ใช้งาน presentation builder ร่วมกัน

---

## Presenter (นักนำเสนอ)

**Role**: ผู้ที่ต้องนำเสนองานเป็นประจำ (Sales, Manager, Speaker)

**Goals**:
- สร้าง presentation ที่ดูดีได้เร็วที่สุด
- นำเสนอได้อย่างมืออาชีพด้วย presenter mode

**Pain Points**:
- ไม่มีเวลาออกแบบ slide ทีละหน้า
- ต้องการ speaker notes และ timer ขณะ present
- เปลี่ยน slide ผิดจังหวะเพราะ UI ไม่ชัดเจน

**User Journey**: เปิดแอป → เลือก template/AI generate → ปรับแต่งเล็กน้อย → เข้า presenter mode → นำเสนอ

**Implications**: ต้องมี quick-start flow ที่รวดเร็ว, presenter mode ต้องมี laser pointer + notes + timer, keyboard navigation ต้องตอบสนองทันที

---

## Designer (นักออกแบบ)

**Role**: ผู้ที่เน้นความสวยงามและ pixel-perfect (Graphic Designer, Creative Director)

**Goals**:
- ควบคุม layout ทุกรายละเอียดได้อย่างแม่นยำ
- ใช้ theme/fonts/colors ที่สอดคล้องกันทั้ง presentation

**Pain Points**:
- Canvas editor ไม่ละเอียดพอ ไม่สามารถจัดตำแหน่งแม่นยำ
- Export แล้ว layout เพี้ยนจากที่เห็นบนจอ
- ต้อง upload รูปของตัวเองแต่ระบบไม่รองรับ

**User Journey**: สร้าง presentation ใหม่ → ปรับ theme/layout อย่างละเอียด → ใส่ chart/images → zoom in ดูรายละเอียด → export (ต้องตรง 100%)

**Implications**: Canvas ต้อง support zoom/pan ละเอียด, rotation/opacity/animation controls, export pixel-perfect constraint, image upload

---

## Quick Creator (ผู้สร้างด่วน)

**Role**: ผู้ที่ต้องการ slide เร็วโดยพึ่ง AI (Startup founder, Student, Researcher)

**Goals**:
- ใส่ topic/prompt แล้วได้ presentation พร้อมใช้
- ปรับแต่งเล็กน้อยแล้ว export/present ได้เลย

**Pain Points**:
- AI สร้าง slide ไม่ตรงตามที่คิด ต้อง generate ซ้ำ
- ไม่รู้จะเลือก template/layout ไหนดี
- Charts ไม่สวยหรือข้อมูลไม่ถูกต้อง

**User Journey**: พิมพ์ prompt → AI สร้าง slides → review → ปรับ data/text เล็กน้อย → export

**Implications**: AI generation ต้องคุณภาพสูง (layout mapping + chart generation), template suggestion ที่ดี, chart data editing ง่าย

---

## Collaborator (ผู้ร่วมงาน)

**Role**: ผู้ที่ทำงานร่วมกับคนอื่นบน presentation เดียวกัน (Team member, Co-presenter)

**Goals**:
- เข้ามา co-edit ได้ทันทีเมื่อได้รับ invite
- เห็นว่าใครกำลังแก้ไขอะไรอยู่แบบ real-time
- ไม่เกิด conflict เมื่อแก้ไขพร้อมกัน

**Pain Points**:
- ไม่รู้ว่าคนอื่นกำลังแก้ไขส่วนไหน ทำงานทับกัน
- Save แล้วงานคนอื่นหาย
- ต้องรอคนอื่นเสร็จก่อนถึงจะแก้ไขได้

**User Journey**: ได้รับ invite link → login → เห็น presentation พร้อม cursor คนอื่น → เลือก slide ที่ยังว่าง → แก้ไข → เห็น changes sync ทันที

**Implications**: WebSocket + CRDT สำหรับ real-time sync, cursor/selection presence, element locking, conflict resolution, auth system

---

## Design Implications

- **Architecture**: ต้องมี Auth system, WebSocket server สำหรับ real-time, CRDT สำหรับ conflict-free data sync, PostgreSQL สำหรับ persistent storage
- **UI/UX**: Canvas ต้องแสดง presence (cursors คนอื่น), element lock indicators, responsive สำหรับทุก device, quick-start flow สำหรับ Presenter/Quick Creator
- **Data & Privacy**: User data isolated per account, shared presentations via invite only, uploaded images เป็นของ owner
