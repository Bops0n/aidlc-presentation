---
inclusion: always
---

# Product Context

## Summary
AI-Powered Web-First Presentation Builder — แอปสร้างพรีเซนเทชันบนเว็บด้วย Next.js App Router, ผู้ใช้สร้าง/แก้ไข slide แบบ visual canvas, ใช้ AI สร้าง slide อัตโนมัติ, และ export หลายรูปแบบ

## Overview
ระบบสร้างพรีเซนเทชันที่ทำงานบนเว็บเต็มรูปแบบ โดยใช้ Next.js App Router เป็น full-stack framework ผสมผสานความสามารถของ AI (Amazon Bedrock — Claude Sonnet 4.5) ในการสร้าง slide อัตโนมัติจาก prompt ของผู้ใช้ พร้อมระบบ canvas editor แบบ interactive สำหรับแก้ไข slide ด้วยมือ รองรับ chart, image, text, shape, video, icon elements พร้อม export ไปยัง PDF, PPTX, และ Google Slides

## Problem Statement
การสร้างพรีเซนเทชันแบบดั้งเดิมใช้เวลามากในการจัดวาง layout, เลือก design, และสร้าง visual elements ผู้ใช้ต้องการเครื่องมือที่ AI ช่วยสร้าง slide อัตโนมัติจาก topic แล้วยัง edit ได้แบบ professional-grade canvas editor

## Target Users
- **Presenter**: ผู้ที่ต้องการสร้างพรีเซนเทชันเพื่อนำเสนอ — ต้องการ speed ในการสร้างและ presenter mode ที่ดี
- **Designer**: ผู้ที่เน้นความสวยงามของ visual — ใช้ canvas editor, theme, chart customization อย่างละเอียด
- **Quick Creator**: ผู้ที่พึ่ง AI เป็นหลัก — ใส่ prompt แล้วได้ slide พร้อมใช้ ปรับแต่งเล็กน้อยก่อน export

## Key Features
- **AI Slide Generation**: สร้าง slide จาก text prompt ผ่าน Amazon Bedrock (Claude Sonnet 4.5) พร้อม layout mapping อัตโนมัติ
- **Interactive Canvas Editor**: 960×540 canvas พร้อม drag/resize/rotate, rich text editing, zoom/pan
- **Live Chart Renderer**: สร้างและแก้ไข chart (bar, line, area, pie, donut, radar) แบบ real-time
- **Theme System**: Dark/light presets ที่ apply ได้ทั้ง presentation ในคลิกเดียว
- **Template Gallery**: คอลเลกชัน template สวยงามจัดกลุ่มตามประเภทการใช้งาน สอดคล้องกับ Layout System:
  - **Marketing**: Pitch Deck, Product Launch, Campaign Report, Brand Guidelines, Social Media Strategy
  - **Business**: Corporate Report, Quarterly Review, Business Plan, Company Profile, Investor Update, SWOT Analysis
  - **Developer/Tech**: Tech Talk, API Documentation, Sprint Review, Architecture Proposal, Release Notes, Hackathon Pitch
  - **Creative**: Portfolio Showcase, Design Proposal, Mood Board, Photo Essay, Art Exhibition
  - **Education**: Lecture, Workshop, Course Overview, Research Presentation, Student Project
  - **Minimal**: Clean Minimal, Modern Mono, Swiss Design, Flat & Simple
  - แต่ละ template ใช้ layouts จากกลุ่มเดียวกัน + Universal layouts โดยอัตโนมัติ
- **Rich Layout System**: Layout presets จัดกลุ่มตามประเภทการใช้งาน:
  - **Universal**: title, content, two-column, three-column, section-break, blank, thank-you
  - **Marketing**: hero-banner, feature-highlight, testimonial, pricing, comparison, call-to-action, social-proof, before-after
  - **Business**: agenda, timeline, stats/metrics, team, org-chart, roadmap, swot, financial-summary, milestone
  - **Developer/Tech**: code-snippet, architecture-diagram, api-overview, demo-screenshot, tech-stack, performance-benchmark, system-flow
  - **Creative**: full-image, quote, portfolio-grid, mood-board, big-number, split-screen
  - **Education**: step-by-step, quiz, definition, diagram-label, pros-cons
- **Multi-Format Export**: PDF (vector), PPTX (native Office), Google Slides (cloud) — layout ต้องตรงกับ web preview 100% (pixel-perfect positioning), ตัด animation ได้แต่ตำแหน่ง/ขนาด/สี/font ต้องไม่เพี้ยน
- **Presenter Mode**: Full-screen slideshow พร้อม transitions, laser pointer, speaker notes, timer
- **Unsplash Integration**: ค้นหาและใส่ stock photo เป็น element หรือ background
- **Image Upload**: อัพโหลดรูปภาพของตัวเองเพื่อใส่เป็น element หรือ background
- **Real-time Collaboration**: ทำงานร่วมกันหลายคนบน presentation เดียวกันแบบ real-time (co-op editing)
- **Offline-First State**: Zustand + localStorage สำหรับ auto-save และ undo/redo

## Domain Language

| Term | Definition | Example |
|------|-----------|---------|
| Element | กราฟิกบน slide canvas ที่มี bounding box (x,y,w,h) | text element, chart element, image element |
| Slide | หน้าเดียวของพรีเซนเทชัน มี background + elements | slide ที่มี title + bullet list + chart |
| Presentation | ชุด slides ที่เรียงลำดับ | "Q3 Report" presentation มี 10 slides |
| Canvas | พื้นที่ 960×540 ที่แสดง/แก้ไข slide | interactive editing canvas |
| Theme | ชุด colors + fonts ที่ apply ทั้ง presentation | dark theme, light theme |
| Template | ชุด slides + theme + layout ที่ออกแบบมาแล้วพร้อมใช้ | "Pitch Deck" template มี 12 slides สำหรับ startup |
| Layout | preset การจัดวาง elements บน slide | title, two-column, comparison, timeline, stats |
| Viewport | พื้นที่แสดงผลจริงบนหน้าจอที่ scale canvas ให้พอดี | responsive viewport with scale-to-fit |

## Success Criteria
- ผู้ใช้สร้าง presentation จาก AI prompt ได้ภายใน 30 วินาที
- Canvas editor ตอบสนอง drag/resize ได้ที่ 60fps
- Export ไปทุกรูปแบบ (PDF, PPTX, Google Slides) ได้สำเร็จ
- Export layout ต้อง pixel-perfect ตรงกับ web preview — ตำแหน่ง, ขนาด, สี, font ไม่เพี้ยน (animation ตัดได้)
- Presentation state ไม่หายเมื่อ refresh browser (localStorage persistence)
- Undo/Redo ทำงานถูกต้องสำหรับทุก mutation

## Constraints & Assumptions
**Constraints**:
- ต้องใช้ Next.js App Router เท่านั้น
- Canvas ต้องเป็น 960×540 (16:9)
- API keys (Bedrock credentials, Google) ต้องอยู่ server-side เท่านั้น
- ต้องมี hydration guard สำหรับ localStorage
- Export ทุกรูปแบบ (PDF, PPTX, Google Slides) ต้อง layout-faithful — ตำแหน่ง x/y, ขนาด w/h, สี, font ตรงกับ web preview (animation ไม่จำเป็นต้องมีใน exported file)

**Assumptions**:
- ผู้ใช้มี AWS credentials (Access Key/Secret หรือ IAM Role) สำหรับ Amazon Bedrock (Claude Sonnet 4.5)
- ผู้ใช้มี Google Cloud credentials สำหรับ Slides export
- ผู้ใช้มี Unsplash API key
- รันบน modern browsers (Chrome, Firefox, Safari, Edge ล่าสุด)

## Project Type
- **Type**: Greenfield
- **Scope**: New product — full application build from specification
