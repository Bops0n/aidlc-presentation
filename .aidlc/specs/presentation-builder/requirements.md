# Requirements

## Summary
- **Total Stories**: 28 across 9 functional areas
- **Priority**: 12 High, 11 Medium, 5 Low
- **User Types**: Presenter, Designer, Quick Creator, Collaborator
- **Key Entities**: Presentation, Slide, Element, Template, Layout, User, Upload, Theme
- **Integrations**: Google Gemini AI, Unsplash API, PDF generation, PPTX generation
- **Core Flows**:
  - AI Generation: prompt → generate → layout mapping → slides
  - Canvas Editing: select element → drag/resize/edit → auto-save
  - Export: select format → render → download (pixel-perfect)
  - Collaboration: invite → join → co-edit real-time → sync
  - Present: enter presenter mode → navigate → laser pointer + notes

---

## Functional Area 1: Canvas Editor

### US-01: แก้ไข Element บน Canvas
- **As a** Designer
- **I want** drag, resize, rotate elements บน 960×540 canvas
- **So that** จัดวาง slide ได้ตามต้องการอย่างแม่นยำ
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user drags an element THEN element position (x, y) SHALL update in real-time at 60fps
2. WHEN user resizes an element THEN width/height SHALL update while maintaining minimum size of 20×20px
3. WHEN user rotates an element THEN rotation degree SHALL update with 1-degree precision

### US-02: Responsive Viewport พร้อม Zoom/Pan
- **As a** Designer
- **I want** zoom in/out และ pan canvas ได้อย่างอิสระ
- **So that** ดูรายละเอียดและภาพรวมของ slide ได้
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. The system shall calculate scale using: min((containerWidth-96)/960, (containerHeight-96)/540) with min=0.15, max=2.5
2. WHEN user switches to manual zoom THEN zoom slider SHALL allow 15% to 250% with percentage display
3. WHEN user holds Ctrl + mouse drag THEN canvas SHALL pan by (panX, panY) displacement

### US-03: Rich Text Editing
- **As a** Presenter
- **I want** double-click text element เพื่อแก้ไข inline ด้วย formatting tools
- **So that** เปลี่ยน font, size, color, alignment ได้โดยไม่ต้องออกจาก canvas
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user double-clicks a text element THEN inline WYSIWYG editor SHALL activate
2. WHILE editing text, IF user changes font family THEN text SHALL re-render immediately
3. WHEN user clicks outside text element THEN editor SHALL deactivate and save changes

---

## Functional Area 2: AI Slide Generation

### US-04: สร้าง Slides จาก Prompt
- **As a** Quick Creator
- **I want** พิมพ์ topic/prompt แล้วได้ presentation ที่สมบูรณ์
- **So that** ได้ slide พร้อมใช้ภายในไม่กี่วินาที
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user submits a prompt THEN system SHALL generate slides within 30 seconds
2. The system shall generate slides with structured narrative (Introduction → Content → Conclusion)
3. WHEN topic involves metrics/analytics THEN system SHALL include chart elements with chartData

### US-05: Layout Mapping อัตโนมัติ
- **As a** Quick Creator
- **I want** AI-generated content ถูกจัดวางเป็น pixel positions อัตโนมัติ
- **So that** ไม่ต้องจัด layout เองหลัง generate
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN AI returns two-column layout THEN system SHALL position left elements at x=80,w=380 and right at x=500,w=380
2. WHEN AI returns image-focus layout THEN system SHALL position graphic at x=80,y=140,w=400,h=340
3. The system shall apply theme colors to all generated elements automatically

---

## Functional Area 3: Template & Layout System

### US-06: เลือก Template จาก Gallery
- **As a** Presenter
- **I want** browse templates จัดกลุ่มตามประเภท (Marketing, Business, Tech, Creative, Education, Minimal)
- **So that** เริ่มต้นจาก template ที่เหมาะกับงานได้เร็ว
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user opens template gallery THEN system SHALL display 25+ templates grouped by category
2. WHEN user selects a template THEN system SHALL create presentation with pre-designed slides, theme, and layouts
3. WHEN user hovers a template THEN system SHALL show preview thumbnail

### US-07: ใช้ Layout Presets
- **As a** Designer
- **I want** เลือก layout preset สำหรับแต่ละ slide (30+ layouts)
- **So that** จัดวาง elements ตาม pattern ที่เหมาะสมได้เร็ว
- **Priority**: Medium

**Acceptance Criteria (EARS)**:
1. WHEN user applies a layout THEN system SHALL reposition elements to match layout grid
2. The system shall provide layouts categorized: Universal, Marketing, Business, Developer/Tech, Creative, Education
3. WHEN user changes layout THEN existing content SHALL be preserved and repositioned

---

## Functional Area 4: Theme System

### US-08: Apply Theme ทั้ง Presentation
- **As a** Designer
- **I want** เลือก theme (colors + fonts) แล้ว apply ทุก slide ในคลิกเดียว
- **So that** presentation มี visual consistency ตลอด
- **Priority**: Medium

**Acceptance Criteria (EARS)**:
1. WHEN user applies a theme THEN all slides SHALL update background, text colors, chart colors, and fonts
2. The system shall provide dark and light theme presets with matching head/body typography
3. WHEN theme is applied THEN charts SHALL sync colors to theme accent palette

---

## Functional Area 5: Data Visualization (Charts)

### US-09: สร้างและแก้ไข Chart แบบ Real-time
- **As a** Quick Creator
- **I want** เห็น chart render บน canvas และแก้ไข data ใน sidebar
- **So that** ปรับข้อมูลแล้วเห็นผลลัพธ์ทันที
- **Priority**: Medium

**Acceptance Criteria (EARS)**:
1. WHEN user selects a chart element THEN system SHALL show editable data grid in right sidebar
2. WHEN user modifies a value in data grid THEN chart on canvas SHALL re-render within 100ms
3. WHEN user adds/removes a data row THEN chart SHALL update automatically

### US-10: Toggle Chart Type
- **As a** Designer
- **I want** เปลี่ยนประเภท chart (bar, line, area, pie, donut, radar) ได้ทันที
- **So that** เลือก visualization ที่เหมาะกับข้อมูลที่สุด
- **Priority**: Medium

**Acceptance Criteria (EARS)**:
1. WHEN user toggles chart type THEN canvas SHALL re-render chart in new type within 200ms
2. The system shall support: bar, line, area, pie, donut, radar chart types
3. WHEN chart type changes THEN data and colors SHALL be preserved

---

## Functional Area 6: Media Management

### US-11: อัพโหลดรูปภาพของตัวเอง
- **As a** Designer
- **I want** upload รูปจากเครื่องแล้วใส่เป็น element หรือ slide background
- **So that** ใช้ภาพของตัวเองใน presentation ได้
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user uploads an image THEN system SHALL store file and create element on canvas within 3 seconds
2. The system shall accept image formats: JPEG, PNG, WebP, SVG with max size 10MB
3. WHEN upload fails THEN system SHALL display error message with reason

### US-12: ค้นหาและใส่รูปจาก Unsplash
- **As a** Quick Creator
- **I want** search stock photos จาก Unsplash แล้วใส่เข้า slide
- **So that** ได้ภาพคุณภาพสูงโดยไม่ต้องหาเอง
- **Priority**: Medium

**Acceptance Criteria (EARS)**:
1. WHEN user searches Unsplash THEN system SHALL display results within 2 seconds
2. WHEN user clicks a photo THEN system SHALL insert as image element with referrerPolicy="no-referrer"
3. WHEN user sets as background THEN slide backgroundType SHALL update to "image" with Unsplash URL

---

## Functional Area 7: Export

### US-13: Export เป็น PDF
- **As a** Presenter
- **I want** export presentation เป็น PDF ที่ layout ตรงกับ web preview 100%
- **So that** แชร์ไฟล์ที่ดูเหมือนกันทุกเครื่อง
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user exports PDF THEN system SHALL generate vector PDF matching 960×540 coordinate grid
2. The system shall preserve element positions (x, y, width, height), colors, and fonts exactly as displayed
3. WHEN export includes charts THEN charts SHALL render as vector graphics (not rasterized)

### US-14: Export เป็น PPTX
- **As a** Presenter
- **I want** export เป็น PowerPoint file ที่เปิดใน Office แล้ว layout ไม่เพี้ยน
- **So that** ส่งไฟล์ให้คนที่ใช้ PowerPoint ได้โดยตรง
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user exports PPTX THEN system SHALL map text, shapes, images to native Office shapes
2. The system shall preserve element positions, sizes, colors, and fonts matching web preview
3. WHEN slide has chart elements THEN PPTX SHALL include chart as embedded shape (not image)

---

## Functional Area 8: Presenter Mode

### US-15: Full-Screen Slideshow
- **As a** Presenter
- **I want** เข้า full-screen mode ที่แสดง slide เต็มจอพร้อม transitions
- **So that** นำเสนอได้อย่างมืออาชีพ
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user enters presenter mode THEN system SHALL stretch slide to fill screen with CSS-fit
2. WHEN user presses Right Arrow or Spacebar THEN system SHALL advance to next slide with transition
3. WHEN user presses Left Arrow THEN system SHALL go to previous slide

### US-16: Laser Pointer
- **As a** Presenter
- **I want** เปิด virtual laser pointer ที่ตามเมาส์พร้อม trail effect
- **So that** ชี้จุดสำคัญให้ผู้ฟังเห็นได้
- **Priority**: Low

**Acceptance Criteria (EARS)**:
1. WHEN laser pointer is active THEN cursor SHALL display as red dot with dynamic trail circles
2. WHEN user moves mouse THEN trail SHALL follow with smooth animation
3. WHEN laser pointer is deactivated THEN cursor SHALL return to normal

### US-17: Speaker Notes & Timer
- **As a** Presenter
- **I want** เห็น speaker notes และเวลาที่ผ่านไปขณะนำเสนอ
- **So that** ควบคุมเนื้อหาและเวลาได้
- **Priority**: Medium

**Acceptance Criteria (EARS)**:
1. WHEN presenter mode is active THEN system SHALL display notes panel with current slide notes
2. The system shall show elapsed time from when presenter mode started
3. WHILE in presenter mode, IF slide changes THEN notes SHALL update to match current slide

---

## Functional Area 9: Real-time Collaboration

### US-18: Invite ผู้ร่วมงาน
- **As a** Collaborator
- **I want** invite คนอื่นมา co-edit ผ่าน link หรือ email
- **So that** ทำงานร่วมกันได้บน presentation เดียวกัน
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN owner generates invite link THEN system SHALL create shareable URL with access permissions
2. WHEN invited user opens link THEN system SHALL require login and grant edit access
3. The system shall support multiple concurrent editors on the same presentation

### US-19: Real-time Cursor & Presence
- **As a** Collaborator
- **I want** เห็น cursor และ selection ของคนอื่นแบบ real-time
- **So that** รู้ว่าใครกำลังแก้ไขส่วนไหน
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN another user moves cursor THEN system SHALL display their cursor position within 100ms
2. WHEN another user selects an element THEN system SHALL show colored selection indicator
3. WHEN a user disconnects THEN their cursor SHALL disappear within 5 seconds

### US-20: Conflict Resolution & Element Locking
- **As a** Collaborator
- **I want** ระบบจัดการ conflict เมื่อหลายคนแก้ไขพร้อมกัน
- **So that** งานไม่สูญหายและไม่ทับกัน
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user selects an element THEN system SHALL lock that element for other users (show lock icon)
2. WHILE element is locked by another user, IF current user tries to edit THEN system SHALL show "being edited by [name]"
3. WHEN editing user deselects element THEN lock SHALL release within 1 second

---

## Functional Area: Authentication & User Management

### US-21: User Registration & Login
- **As a** Collaborator
- **I want** สมัครสมาชิกและ login เข้าระบบ
- **So that** เก็บ presentations ของตัวเองและรับ invite collaboration
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user submits registration form THEN system SHALL create account and redirect to dashboard
2. WHEN user logs in with valid credentials THEN system SHALL create session and load user's presentations
3. IF login credentials invalid THEN system SHALL display error without revealing which field is wrong

### US-22: จัดการ Presentations (CRUD)
- **As a** Presenter
- **I want** สร้าง, ดู, แก้ไข, ลบ presentations ของตัวเอง
- **So that** จัดการงานได้เป็นระเบียบ
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user creates new presentation THEN system SHALL save to PostgreSQL and show in dashboard
2. WHEN user opens a presentation THEN system SHALL load all slides and elements from database
3. WHEN user deletes a presentation THEN system SHALL remove from database (soft delete)

---

## Functional Area: Slide Management

### US-23: Thumbnail Sidebar & Slide Ordering
- **As a** Presenter
- **I want** เห็น slide thumbnails ด้านข้างและ drag เพื่อจัดลำดับ
- **So that** จัดเรียง flow ของ presentation ได้ง่าย
- **Priority**: Medium

**Acceptance Criteria (EARS)**:
1. The system shall display scaled-down slide thumbnails in left panel
2. WHEN user drags a thumbnail THEN system SHALL reorder slides and update presentation
3. WHEN user right-clicks thumbnail THEN system SHALL show context menu (duplicate, delete, add blank)

### US-24: Slide Transitions
- **As a** Presenter
- **I want** เลือก transition effect ระหว่าง slides (fade, slide, zoom)
- **So that** การเปลี่ยน slide ดูราบรื่นเวลา present
- **Priority**: Low

**Acceptance Criteria (EARS)**:
1. WHEN user sets transition mode THEN system SHALL apply animation when advancing slides in presenter mode
2. The system shall support transition modes: none, fade, slide, zoom
3. WHEN transition plays THEN animation SHALL complete within 500ms

---

## Functional Area: State & Persistence

### US-25: Auto-Save to Database
- **As a** Designer
- **I want** ระบบ save การเปลี่ยนแปลงอัตโนมัติทุกครั้งที่แก้ไข
- **So that** ไม่ต้องกด save เอง และงานไม่หาย
- **Priority**: High

**Acceptance Criteria (EARS)**:
1. WHEN user modifies any element THEN system SHALL persist changes to PostgreSQL within 2 seconds
2. IF save fails due to network error THEN system SHALL retry 3 times and show warning
3. The system shall display save status indicator (saving/saved/error)

### US-26: Undo/Redo
- **As a** Designer
- **I want** undo/redo การเปลี่ยนแปลงทุกอย่าง (position, color, text, size)
- **So that** แก้ไขผิดพลาดได้ทันที
- **Priority**: Medium

**Acceptance Criteria (EARS)**:
1. WHEN user presses Ctrl+Z THEN system SHALL undo last mutation
2. WHEN user presses Ctrl+Y THEN system SHALL redo last undone mutation
3. The system shall maintain undo/redo history stack of at least 50 actions

---

## Functional Area: Animations

### US-27: Element Entrance Animations
- **As a** Designer
- **I want** กำหนด animation (fade, fly, slide, zoom, bounce, spin) และ delay ให้แต่ละ element
- **So that** slide มีความเคลื่อนไหวเวลา present
- **Priority**: Low

**Acceptance Criteria (EARS)**:
1. WHEN user sets animation on element THEN element SHALL play animation when slide appears in presenter mode
2. WHEN animationDelay is set THEN element animation SHALL start after specified seconds
3. The system shall support animations: fade, fly, slide, zoom, bounce, spin

### US-28: Animation Audit Warnings
- **As a** Designer
- **I want** ระบบเตือนเมื่อ animation configuration มีปัญหา
- **So that** ไม่เกิด visual issues ตอน present
- **Priority**: Low

**Acceptance Criteria (EARS)**:
1. IF slide has more than 6 animated elements THEN system SHALL warn "density threshold exceeded"
2. IF element has animation but opacity=0 THEN system SHALL warn "invisible animated element"
3. IF overlapping elements share same animation without staggered delays THEN system SHALL warn "synchronization pile-up"

---

## Story Summary

| ID | Title | Area | Priority | Dependencies |
|----|-------|------|----------|--------------|
| US-01 | แก้ไข Element บน Canvas | Canvas Editor | High | — |
| US-02 | Responsive Viewport + Zoom/Pan | Canvas Editor | High | US-01 |
| US-03 | Rich Text Editing | Canvas Editor | High | US-01 |
| US-04 | สร้าง Slides จาก Prompt | AI Generation | High | US-05 |
| US-05 | Layout Mapping อัตโนมัติ | AI Generation | High | — |
| US-06 | เลือก Template จาก Gallery | Template & Layout | High | — |
| US-07 | ใช้ Layout Presets | Template & Layout | Medium | US-01 |
| US-08 | Apply Theme ทั้ง Presentation | Theme | Medium | — |
| US-09 | สร้างและแก้ไข Chart Real-time | Charts | Medium | US-01 |
| US-10 | Toggle Chart Type | Charts | Medium | US-09 |
| US-11 | อัพโหลดรูปภาพ | Media | High | US-22 |
| US-12 | ค้นหา Unsplash | Media | Medium | US-01 |
| US-13 | Export PDF | Export | High | US-01 |
| US-14 | Export PPTX | Export | High | US-01 |
| US-15 | Full-Screen Slideshow | Presenter | High | US-24 |
| US-16 | Laser Pointer | Presenter | Low | US-15 |
| US-17 | Speaker Notes & Timer | Presenter | Medium | US-15 |
| US-18 | Invite ผู้ร่วมงาน | Collaboration | High | US-21 |
| US-19 | Real-time Cursor & Presence | Collaboration | High | US-18 |
| US-20 | Conflict Resolution & Locking | Collaboration | High | US-19 |
| US-21 | Registration & Login | Auth | High | — |
| US-22 | จัดการ Presentations (CRUD) | Auth | High | US-21 |
| US-23 | Thumbnail Sidebar & Ordering | Slide Management | Medium | US-01 |
| US-24 | Slide Transitions | Slide Management | Low | — |
| US-25 | Auto-Save to Database | State | High | US-22 |
| US-26 | Undo/Redo | State | Medium | US-01 |
| US-27 | Element Animations | Animations | Low | US-01 |
| US-28 | Animation Audit Warnings | Animations | Low | US-27 |

---

## Story-Persona Matrix

| ID | Presenter | Designer | Quick Creator | Collaborator |
|----|-----------|----------|---------------|--------------|
| US-01 | Secondary | Primary | — | Secondary |
| US-02 | — | Primary | — | — |
| US-03 | Primary | Secondary | — | — |
| US-04 | Secondary | — | Primary | — |
| US-05 | — | — | Primary | — |
| US-06 | Primary | Secondary | Primary | — |
| US-07 | — | Primary | — | — |
| US-08 | — | Primary | Secondary | — |
| US-09 | — | Secondary | Primary | — |
| US-10 | — | Primary | Secondary | — |
| US-11 | — | Primary | — | Secondary |
| US-12 | — | Secondary | Primary | — |
| US-13 | Primary | Primary | Secondary | — |
| US-14 | Primary | Primary | Secondary | — |
| US-15 | Primary | — | Secondary | — |
| US-16 | Primary | — | — | — |
| US-17 | Primary | — | — | — |
| US-18 | — | — | — | Primary |
| US-19 | — | — | — | Primary |
| US-20 | — | — | — | Primary |
| US-21 | Primary | Primary | Primary | Primary |
| US-22 | Primary | Primary | Primary | Secondary |
| US-23 | Primary | Secondary | — | Secondary |
| US-24 | Primary | — | — | — |
| US-25 | Secondary | Primary | Secondary | Primary |
| US-26 | — | Primary | — | — |
| US-27 | — | Primary | — | — |
| US-28 | — | Primary | — | — |

---

## Non-Functional Notes

- **Performance**: Canvas drag/resize ต้อง 60fps, chart re-render ภายใน 200ms, AI generation ภายใน 30 วินาที
- **Export Fidelity**: ทุก format (PDF, PPTX) ต้อง pixel-perfect ตรงกับ web preview — position, size, color, font ต้องไม่เพี้ยน
- **Real-time Sync**: Cursor/presence latency ไม่เกิน 100ms, element lock release ภายใน 1 วินาที
- **Reliability**: Auto-save ภายใน 2 วินาที, retry 3 ครั้งเมื่อ network error
- **Security**: API keys server-side only, user data isolated per account

---

## External References

| Source | Stories Derived | What was used |
|--------|----------------|---------------|
| presentation_requirement.md | US-01 to US-28 | Full architecture spec — canvas dimensions, AI pipeline, export requirements, presenter features |
| D1 Decisions | US-18 to US-22 | Collaboration scope, auth level, persistence decisions |
