# Design Decisions — Collaboration Unit (D3)

## Context Summary
- **Unit**: Collaboration (Wave 7) — Real-time co-editing
- **Scope**: WebSocket/CRDT sync, cursor presence, element locking, invite system, auto-save (enhanced)
- **Stories**: US-18 (Invite), US-19 (Cursor & presence), US-20 (Conflict resolution & locking), US-25 (Auto-save — enhanced)
- **Dependencies**: Foundation (auth, DB), Canvas Editor (element mutations)
- **Settled**: Next.js, Prisma, PostgreSQL, Zustand, self-hosted Docker
- **D1 Answers**: Full real-time (cursor sync, element lock, CRDT), online-first

---

## Decision Questions

### D3-1: Real-time Infrastructure
**Question**: WebSocket/real-time infrastructure ที่จะใช้?
- 1) Liveblocks (managed service, presence + storage built-in, free tier 250 MAU) **(Recommended for solo dev)**
- 2) Pusher Channels (managed, real-time events, free tier 200k messages/day)
- 3) Socket.io + แยก Node.js server (self-hosted, full control, ฟรี แต่ต้อง deploy แยก)
- 4) Yjs + y-websocket server (CRDT-native, self-hosted, best for document collaboration)
- 5) Ably (managed, free tier 6M messages/month)
- 6) Other (please specify): _______

**Answer**: 3

---

### D3-2: CRDT / Conflict Resolution
**Question**: วิธีจัดการ conflict เมื่อหลายคนแก้พร้อมกัน?
- 1) Element-level locking (เมื่อเลือก element → ล็อค คนอื่นแก้ไม่ได้) **(Recommended — simple, effective)**
- 2) Full CRDT (Yjs) — ไม่ต้อง lock, merge อัตโนมัติ (ซับซ้อน)
- 3) Hybrid: lock for active editing + event broadcast for position
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-3: Invite Mechanism
**Question**: วิธี invite คนมา collaborate?
- 1) Share link (copy URL with access token) **(Recommended)**
- 2) Email invite (ต้อง email service)
- 3) Both (link + email)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-4: Presence Display
**Question**: แสดง presence (cursor/avatar คนอื่น) อย่างไร?
- 1) Colored cursors + name labels + avatar badges ที่ header **(Recommended)**
- 2) Cursors only (ไม่มี avatar list)
- 3) Avatar list เฉพาะ header (ไม่มี cursor บน canvas)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-5: Session Persistence
**Question**: เมื่อ user disconnect แล้ว reconnect เป็นอย่างไร?
- 1) Auto-reconnect + sync missed changes (optimistic) **(Recommended)**
- 2) Force refresh page เมื่อ reconnect
- 3) Other (please specify): _______

**Answer**: 1

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
- D3-1 Infrastructure: 
- D3-2 Conflict Resolution: 
- D3-3 Invite: 
- D3-4 Presence: 
- D3-5 Reconnection: 

---

**Instructions**: Fill in your answers above and respond with "done"

> ⚠️ **สำคัญ**: D3-1 กำหนดว่าต้อง setup อะไร:
> - Liveblocks → สมัคร liveblocks.io → ได้ public key (ฟรี 250 MAU)
> - Pusher → สมัคร pusher.com → ได้ app_id, key, secret, cluster
> - Socket.io → ต้อง run node server แยก
> - Yjs → ต้อง run y-websocket server แยก
