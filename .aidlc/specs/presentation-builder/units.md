# Units of Work

## Summary
- **Units**: 9 units — Foundation, Canvas Editor, AI Generation, Templates & Themes, Data Visualization, Media, Export, Presenter, Collaboration
- **Strategy**: Domain-Driven
- **Architecture**: Modular Monolith (single Next.js deployable, modules แบ่งภายใน)
- **Story Distribution**: Foundation: 2 (US-21,22), Canvas: 5 (US-01~03,23,26), AI: 2 (US-04~05), Templates: 3 (US-06~08), Charts: 2 (US-09~10), Media: 2 (US-11~12), Export: 2 (US-13~14), Presenter: 5 (US-15~17,24,27~28), Collaboration: 4 (US-18~20,25)
- **Key Dependencies**: ทุก unit → Foundation (Data), AI → Canvas+Templates (API), Export → Canvas+Charts (Data), Collaboration → Canvas (Event)
- **Development Sequence**: Wave 1: Foundation → Wave 2: Canvas → Wave 3: Templates+Charts+Media → Wave 4: AI → Wave 5: Export → Wave 6: Presenter → Wave 7: Collaboration

## Overview
Feature decomposed into 9 units สำหรับ phased delivery โดย solo developer

**Strategy**: Domain-Driven — แบ่งตาม business domain ที่เป็นอิสระจากกัน
**Rationale**: แต่ละ domain มี logic, data model, UI แยกกันชัดเจน — สามารถ design/implement ทีละ unit แล้วใช้งานได้ทันที

---

## Unit 0: Foundation

**Purpose**: Shared infrastructure — project setup, auth, database, shared types, common components
**Priority**: High
**Complexity**: Medium
**Stories**: US-21 (Registration & Login), US-22 (CRUD Presentations)
**Type**: Infrastructure + Core Auth

### Responsibilities
- Next.js App Router project scaffolding (src/ structure)
- PostgreSQL setup + ORM configuration + migration framework
- Shared TypeScript types (Element, Slide, Presentation contracts)
- Authentication system via **NextAuth.js** — ใช้ existing `users.nextauth_user_table` schema
  - Primary key: `user_id` (bigint, auto-increment)
  - รองรับ provider-based auth (Zoho, credentials)
  - Session management ผ่าน NextAuth
- Presentation CRUD (create, read, update, delete)
- Common UI components (Button, Input, Modal, Layout shell)
- Error handling patterns + API response format
- Environment configuration (.env.local)

### Auth Schema (existing table: `users.nextauth_user_table`)
```sql
user_id          BIGINT (PK, auto-increment) -- ใช้เป็น identity หลักทั้งระบบ
zoho_user_id     VARCHAR
email            VARCHAR
first_name       VARCHAR
last_name        VARCHAR
display_name     VARCHAR
firsttime_login_date  TIMESTAMPTZ
last_login_date       TIMESTAMPTZ
refresh_token    VARCHAR
access_token     VARCHAR
org_info_id      BIGINT
user_level       BIGINT
profile_img      VARCHAR
department_name  VARCHAR
position_name    VARCHAR
phone            VARCHAR
hash_password    VARCHAR
encode_url       VARCHAR
is_delete        BOOLEAN (default false)
confirm_email    BOOLEAN (default false)
resetpassword_code VARCHAR
provider         VARCHAR
provider_user_id VARCHAR
```

### Domain Model
**Aggregates**: User (root: User, PK: user_id), Presentation (root: Presentation)
**Entities**: User (existing nextauth_user_table), Presentation, Slide
**Value Objects**: UserId (bigint), Email, PresentationId, SlideId

### Domain Events
**Publishes**: UserRegistered, PresentationCreated, PresentationDeleted

### Dependencies
| Depends On | Type | Description |
|------------|------|-------------|
| (none) | — | Foundation has no upstream dependencies |

---

## Unit 1: Canvas Editor

**Purpose**: Interactive 960×540 canvas สำหรับแก้ไข elements ด้วย drag/resize/rotate + zoom/pan + rich text
**Priority**: High
**Complexity**: High
**Stories**: US-01 (Element editing), US-02 (Viewport zoom/pan), US-03 (Rich text), US-23 (Thumbnails & ordering), US-26 (Undo/Redo)

### Commands
| Command | Description | Actor |
|---------|-------------|-------|
| MoveElement | เปลี่ยนตำแหน่ง x, y ของ element | User |
| ResizeElement | เปลี่ยน width, height | User |
| RotateElement | เปลี่ยน rotation degree | User |
| EditText | แก้ไข text content inline | User |
| ReorderSlides | จัดลำดับ slides ใหม่ด้วย drag | User |
| Undo/Redo | ย้อน/ทำซ้ำ mutation | User |

### Domain Model
**Aggregates**: Slide (root: Slide)
**Entities**: Element (text, image, shape, chart, icon, video)
**Value Objects**: Position (x,y), Size (w,h), Rotation, Opacity, Animation, BoundingBox

### Domain Events
**Publishes**: ElementMoved, ElementResized, ElementRotated, TextEdited, SlidesReordered, MutationRecorded
**Subscribes**: PresentationLoaded from Foundation — โหลด slides เข้า canvas

### Dependencies
| Depends On | Type | Description |
|------------|------|-------------|
| Foundation | Data | Shared types (Element, Slide), DB access, auth session |

---

## Unit 2: AI Generation

**Purpose**: สร้าง slides อัตโนมัติจาก text prompt ผ่าน Amazon Bedrock (Claude Sonnet 4.5) + layout mapping algorithm
**Priority**: High
**Complexity**: High
**Stories**: US-04 (Generate slides from prompt), US-05 (Layout mapping)

### Commands
| Command | Description | Actor |
|---------|-------------|-------|
| GenerateSlides | ส่ง prompt ไป Bedrock (Claude Sonnet 4.5), ได้ structured JSON กลับมา | User |
| MapLayout | แปลง AI response เป็น pixel positions บน 960×540 | System |

### Domain Model
**Aggregates**: GenerationRequest (root: GenerationRequest)
**Entities**: GeneratedSlide, GeneratedElement
**Value Objects**: Prompt, LayoutType (title/two-column/image-focus/content), SpatialGrid

### Domain Events
**Publishes**: SlidesGenerated — ส่ง slides ที่ map แล้วไป canvas
**Subscribes**: (none)

### Dependencies
| Depends On | Type | Description |
|------------|------|-------------|
| Foundation | Data | Shared types, API route infrastructure, auth |
| Canvas Editor | API | ต้องรู้ Element/Slide structure เพื่อ map positions |
| Templates & Themes | API | ใช้ theme colors ใน generated elements |

---

## Unit 3: Templates & Themes

**Purpose**: Template gallery (25+ templates, 6 categories) + layout presets (30+) + theme system
**Priority**: High
**Complexity**: Medium
**Stories**: US-06 (Template gallery), US-07 (Layout presets), US-08 (Theme system)

### Commands
| Command | Description | Actor |
|---------|-------------|-------|
| ApplyTemplate | สร้าง presentation จาก template | User |
| ApplyLayout | จัดวาง elements ตาม layout preset | User |
| ApplyTheme | เปลี่ยน colors/fonts ทุก slide | User |

### Domain Model
**Aggregates**: Template (root: Template), Theme (root: Theme)
**Entities**: TemplateSlide, LayoutPreset
**Value Objects**: TemplateCategory, ThemeColors, Typography, LayoutGrid

### Domain Events
**Publishes**: ThemeApplied, TemplateApplied, LayoutApplied
**Subscribes**: (none)

### Dependencies
| Depends On | Type | Description |
|------------|------|-------------|
| Foundation | Data | Shared types, DB for template storage |
| Canvas Editor | API | ต้องรู้ Element structure เพื่อ reposition elements ตาม layout |

---

## Unit 4: Data Visualization

**Purpose**: Render charts (bar, line, area, pie, donut, radar) + editable data grid
**Priority**: Medium
**Complexity**: Medium
**Stories**: US-09 (Chart rendering + data grid), US-10 (Toggle chart type)

### Commands
| Command | Description | Actor |
|---------|-------------|-------|
| UpdateChartData | แก้ไข label/value ใน data grid | User |
| ToggleChartType | เปลี่ยนประเภท chart | User |
| AddDataRow | เพิ่ม row ใน data grid | User |
| RemoveDataRow | ลบ row ออกจาก data grid | User |

### Domain Model
**Aggregates**: ChartElement (extends Element)
**Entities**: ChartDataRow
**Value Objects**: ChartType, ChartData ({name, value}[]), ChartColors

### Domain Events
**Publishes**: ChartDataUpdated, ChartTypeChanged
**Subscribes**: ThemeApplied from Templates & Themes — sync chart colors กับ theme

### Dependencies
| Depends On | Type | Description |
|------------|------|-------------|
| Foundation | Data | Shared types |
| Canvas Editor | API | Chart renders เป็น element บน canvas |
| Templates & Themes | Event | รับ theme colors เพื่อ sync chart palette |

---

## Unit 5: Media

**Purpose**: Image upload + Unsplash search & insert
**Priority**: Medium
**Complexity**: Low
**Stories**: US-11 (Upload images), US-12 (Unsplash search)

### Commands
| Command | Description | Actor |
|---------|-------------|-------|
| UploadImage | อัพโหลดไฟล์จากเครื่อง, save server-side | User |
| SearchUnsplash | ค้นหา stock photos | User |
| InsertImage | ใส่รูปเป็น element หรือ background | User |

### Domain Model
**Aggregates**: Upload (root: Upload)
**Entities**: ImageAsset
**Value Objects**: ImageUrl, FileMetadata (size, format, dimensions)

### Domain Events
**Publishes**: ImageUploaded, ImageInserted
**Subscribes**: (none)

### Dependencies
| Depends On | Type | Description |
|------------|------|-------------|
| Foundation | Data | DB for upload metadata, auth (ownership), file storage |
| Canvas Editor | API | ใส่ image element บน canvas |

---

## Unit 6: Export

**Purpose**: สร้าง PDF + PPTX ที่ pixel-perfect ตรงกับ web preview
**Priority**: High
**Complexity**: High
**Stories**: US-13 (Export PDF), US-14 (Export PPTX)

### Commands
| Command | Description | Actor |
|---------|-------------|-------|
| ExportPDF | สร้าง vector PDF จาก slide data | User |
| ExportPPTX | สร้าง PowerPoint file จาก slide data | User |

### Domain Model
**Aggregates**: ExportJob (root: ExportJob)
**Entities**: ExportedSlide
**Value Objects**: ExportFormat (pdf/pptx), RenderContext (positions, colors, fonts)

### Domain Events
**Publishes**: ExportCompleted, ExportFailed
**Subscribes**: (none)

### Dependencies
| Depends On | Type | Description |
|------------|------|-------------|
| Foundation | Data | Shared types (Element, Slide, Presentation) |
| Canvas Editor | Data | ต้อง read slide data + element positions เพื่อ render ตรง |
| Data Visualization | Data | ต้อง render charts เป็น vector ใน export |
| Templates & Themes | Data | ต้องรู้ theme colors/fonts สำหรับ accurate rendering |

---

## Unit 7: Presenter

**Purpose**: Full-screen slideshow mode + transitions + laser pointer + speaker notes + timer + animations
**Priority**: Medium
**Complexity**: Medium
**Stories**: US-15 (Full-screen slideshow), US-16 (Laser pointer), US-17 (Notes & timer), US-24 (Transitions), US-27 (Element animations), US-28 (Animation audit)

### Commands
| Command | Description | Actor |
|---------|-------------|-------|
| EnterPresenterMode | เข้า full-screen slideshow | User |
| NavigateSlide | ไปหน้าถัดไป/ก่อนหน้า | User |
| ToggleLaserPointer | เปิด/ปิด virtual laser | User |
| SetTransition | กำหนด transition mode ของ slide | User |
| SetAnimation | กำหนด entrance animation ของ element | User |

### Domain Model
**Aggregates**: PresentationSession (root: PresentationSession)
**Entities**: SlideTransition, ElementAnimation
**Value Objects**: TransitionMode (none/fade/slide/zoom), AnimationType, AnimationDelay, LaserPosition

### Domain Events
**Publishes**: PresenterModeStarted, SlideAdvanced
**Subscribes**: (none)

### Dependencies
| Depends On | Type | Description |
|------------|------|-------------|
| Foundation | Data | Shared types, auth |
| Canvas Editor | Data | ต้อง read slide/element data เพื่อ render full-screen |

---

## Unit 8: Collaboration

**Purpose**: Real-time co-editing — WebSocket, CRDT sync, cursor presence, element locking, auto-save
**Priority**: High
**Complexity**: High
**Stories**: US-18 (Invite collaborators), US-19 (Cursor & presence), US-20 (Conflict resolution & locking), US-25 (Auto-save)

### Commands
| Command | Description | Actor |
|---------|-------------|-------|
| InviteCollaborator | สร้าง invite link/send email | User |
| JoinSession | เข้าร่วม editing session | User |
| BroadcastCursor | ส่ง cursor position ให้คนอื่น | System |
| LockElement | ล็อค element ที่กำลังแก้ไข | System |
| UnlockElement | ปลด lock เมื่อเลิกแก้ไข | System |
| SyncChanges | sync mutations ผ่าน CRDT | System |
| AutoSave | save ลง PostgreSQL อัตโนมัติ | System |

### Domain Model
**Aggregates**: CollaborationSession (root: CollaborationSession)
**Entities**: Participant, ElementLock
**Value Objects**: CursorPosition, PresenceStatus, InviteLink, CRDTOperation

### Domain Events
**Publishes**: ParticipantJoined, ParticipantLeft, CursorMoved, ElementLocked, ElementUnlocked, ChangeSynced
**Subscribes**: ElementMoved, ElementResized, TextEdited from Canvas Editor — broadcast ไปทุก participant

### Dependencies
| Depends On | Type | Description |
|------------|------|-------------|
| Foundation | Data | Auth (user identity), DB (session persistence), shared types |
| Canvas Editor | Event | Subscribe element mutations เพื่อ broadcast, inject cursor overlays |

---

## Context Map

| Upstream | Downstream | Pattern |
|----------|------------|---------|
| Foundation | ทุก Unit | Shared Kernel (types, auth, DB) |
| Canvas Editor | AI Generation | Customer/Supplier (canvas provides element structure) |
| Canvas Editor | Templates & Themes | Customer/Supplier (canvas accepts layout changes) |
| Canvas Editor | Data Visualization | Customer/Supplier (canvas renders chart elements) |
| Canvas Editor | Export | Conformist (export reads canvas data as-is) |
| Canvas Editor | Presenter | Conformist (presenter reads slide data as-is) |
| Canvas Editor | Collaboration | Publisher/Subscriber (canvas publishes mutations) |
| Templates & Themes | AI Generation | Customer/Supplier (AI uses theme colors) |
| Templates & Themes | Data Visualization | Publisher/Subscriber (theme events → chart colors) |
| Data Visualization | Export | Customer/Supplier (export needs chart render data) |

---

## Development Sequence

### Wave 1: Foundation
- [ ] Unit 0: Foundation — ต้องทำก่อน: auth, DB, types, project structure

### Wave 2: Core Editing
- [ ] Unit 1: Canvas Editor — core ของ app ทั้งหมด, units อื่นต่อยอดจากนี้

### Wave 3: Content Enrichment (parallel)
- [ ] Unit 3: Templates & Themes — เสริม canvas ด้วย templates/layouts/themes
- [ ] Unit 4: Data Visualization — เสริม canvas ด้วย charts
- [ ] Unit 5: Media — เสริม canvas ด้วย images

### Wave 4: AI Intelligence
- [ ] Unit 2: AI Generation — ต้องมี canvas + templates ก่อนเพื่อ map ลง layout

### Wave 5: Output
- [ ] Unit 6: Export — ต้องมี canvas + charts + themes ครบก่อน render

### Wave 6: Presentation
- [ ] Unit 7: Presenter — ต้องมี slides + transitions พร้อม

### Wave 7: Multiplayer
- [ ] Unit 8: Collaboration — ต่อยอดจากทุก unit, ทำสุดท้าย (complex + depends on all)
