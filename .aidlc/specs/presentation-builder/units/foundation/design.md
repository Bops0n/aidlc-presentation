# Foundation Unit — Design

## Summary
- **Architecture**: Modular Monolith (Next.js App Router, standalone output for Docker)
- **Stack**: TypeScript / Next.js 14+ / Prisma / PostgreSQL / Zustand / Tailwind CSS
- **Components**: 6 designed (Auth, Presentation CRUD, DB Layer, Common UI, Error Handling, App Shell)
- **Entities**: 3 modeled (User, Presentation, Slide)
- **Endpoints**: 6 specified (auth: 3, presentations: 3)
- **Testing**: Vitest + fast-check (property-based), no E2E
- **Hosting**: Self-hosted Docker + VPS

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                     │
├──────────────────────────┬──────────────────────────────┤
│    Client Components     │      Route Handlers          │
│    ('use client')        │      (/app/api/...)          │
├──────────────────────────┼──────────────────────────────┤
│ • App Shell (Layout)     │ • /api/auth/[...nextauth]    │
│ • Dashboard Page         │ • /api/presentations (CRUD)  │
│ • Common UI Components   │                              │
│ • Zustand Store          │                              │
├──────────────────────────┴──────────────────────────────┤
│                    Prisma ORM Layer                       │
├─────────────────────────────────────────────────────────┤
│                    PostgreSQL                             │
│        (users.nextauth_user_table + app tables)          │
└─────────────────────────────────────────────────────────┘
```

**Pattern**: Layered — Pages → Components → Store → API Routes → Prisma → PostgreSQL
**Rationale**: Next.js App Router เป็น full-stack framework ที่รวม client/server ใน codebase เดียว เหมาะกับ modular monolith. Prisma ให้ type-safety + migration management. Self-hosted via Docker standalone output.

## Components

### 1. Auth System (NextAuth.js)
- **Purpose**: จัดการ registration, login, session management
- **Technology**: NextAuth.js v5 + Prisma adapter (custom mapping to existing table)
- **Responsibilities**:
  - Map NextAuth session ไป `users.nextauth_user_table` (PK: user_id)
  - Support credentials provider (email + hash_password)
  - Session management via JWT strategy
  - Protect routes ที่ต้อง login
- **Exposes**: `getServerSession()`, auth middleware, `useSession()` hook
- **Consumes**: PostgreSQL (users.nextauth_user_table)

### 2. Presentation CRUD Service
- **Purpose**: สร้าง, อ่าน, แก้ไข, ลบ presentations
- **Technology**: Next.js Route Handlers + Prisma
- **Responsibilities**:
  - CRUD operations สำหรับ presentations
  - Ownership validation (user_id match)
  - Soft delete (is_delete flag)
  - List user's presentations with pagination
- **Exposes**: REST endpoints (/api/presentations)
- **Consumes**: Prisma Client, Auth session

### 3. Database Layer (Prisma)
- **Purpose**: Type-safe database access + migrations
- **Technology**: Prisma ORM + PostgreSQL
- **Responsibilities**:
  - Schema definition + migration management
  - Connect to existing `users.nextauth_user_table`
  - Define new tables: presentations, slides, elements
  - Singleton Prisma client instance
- **Exposes**: `prisma` client instance, generated types
- **Consumes**: PostgreSQL via DATABASE_URL

### 4. Common UI Components
- **Purpose**: Shared UI elements ใช้ทั้ง app
- **Technology**: React + Tailwind CSS
- **Responsibilities**:
  - Button, Input, Modal, Card, Dropdown, Toast
  - Layout shell (Sidebar + Header + Main content)
  - Loading states, Error states
  - Responsive design utilities
- **Exposes**: Component exports from `@/components/ui/`
- **Consumes**: Tailwind CSS classes

### 5. Error Handling System
- **Purpose**: Consistent error handling ทั้ง client + server
- **Technology**: Custom AppError class + React Error Boundary
- **Responsibilities**:
  - Custom AppError class (code, message, statusCode, details)
  - API error response format: `{ error: { code, message, details } }`
  - Client-side Error Boundary component
  - Route Handler error wrapper
- **Exposes**: `AppError`, `withErrorHandler()`, `<ErrorBoundary>`
- **Consumes**: —

### 6. App Shell & Navigation
- **Purpose**: Main layout structure + routing
- **Technology**: Next.js App Router layouts
- **Responsibilities**:
  - Root layout with providers (SessionProvider, ThemeProvider)
  - Dashboard page (list presentations)
  - Navigation (sidebar/header)
  - Hydration guard for client-state
- **Exposes**: Layout components, page routes
- **Consumes**: Auth session, Common UI

## Data Model

### User (existing: `users.nextauth_user_table`)
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| user_id | BigInt | PK, auto-increment | Identity หลักทั้งระบบ |
| email | String | nullable | Login identifier |
| first_name | String | nullable | |
| last_name | String | nullable | |
| display_name | String | nullable | แสดงใน UI |
| hash_password | String | nullable | bcrypt hash |
| profile_img | String | nullable | Avatar URL |
| provider | String | nullable | auth provider name |
| provider_user_id | String | nullable | external provider ID |
| is_delete | Boolean | default: false | Soft delete |
| confirm_email | Boolean | default: false | Email verified |
| last_login_date | DateTime | nullable | |
| firsttime_login_date | DateTime | nullable | |

### Presentation
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String | PK, cuid | Presentation identifier |
| title | String | required | Presentation name |
| owner_id | BigInt | FK → user_id, required | Owner reference |
| created_at | DateTime | default: now() | |
| updated_at | DateTime | auto-update | |
| is_deleted | Boolean | default: false | Soft delete |
| thumbnail_url | String | nullable | Preview image |

**Indexes**: owner_id (for listing), created_at (for sorting)
**Relations**: User (1:N Presentations), Presentation (1:N Slides)

### Slide
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String | PK, cuid | Slide identifier |
| presentation_id | String | FK → Presentation.id, required | Parent presentation |
| order | Int | required | Position in sequence |
| background_type | String | default: "color" | color/gradient/image |
| background_value | String | default: "#ffffff" | Hex/gradient/URL |
| transition_mode | String | default: "none" | none/fade/slide/zoom |
| notes | String | nullable | Speaker notes |
| elements | Json | default: [] | Element array (JSON column) |

**Indexes**: presentation_id + order (composite, for ordering)
**Relations**: Presentation (N:1)

**Note**: Elements จะเก็บเป็น JSON column ใน Slide (ไม่แยก table) เพื่อ:
- ลด complexity ของ queries (load ทั้ง slide พร้อม elements ในครั้งเดียว)
- Elements มี structure ที่ flexible (type-specific fields)
- Performance ดีกว่าสำหรับ real-time collaboration (atomic slide updates)

## API Specification

### Conventions
- **Base URL**: `/api`
- **Auth**: All endpoints require valid session (except auth routes)
- **Response format**: `{ data: T }` (success) or `{ error: { code, message, details? } }` (error)
- **Pagination**: `?page=1&limit=20` → `{ data: T[], meta: { total, page, limit, totalPages } }`
- **Validation**: Zod schemas on request body, 400 on failure
- **Status codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Error)

### Endpoints

#### Auth (NextAuth.js built-in)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/signup | No | Register new user (custom route) |
| GET/POST | /api/auth/[...nextauth] | No | NextAuth.js handlers (signin, signout, session, callback) |

**POST /api/auth/signup**
- Request: `{ email: string, password: string, displayName?: string }`
- Validation: Zod — email format, password min 8 chars
- Response 201: `{ data: { userId: number, email: string } }`
- Response 400: `{ error: { code: "VALIDATION_ERROR", message: string } }`
- Response 409: `{ error: { code: "EMAIL_EXISTS", message: "Email already registered" } }`

#### Presentations
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/presentations | Yes | List user's presentations |
| POST | /api/presentations | Yes | Create new presentation |
| GET | /api/presentations/[id] | Yes | Get presentation with slides |
| PATCH | /api/presentations/[id] | Yes | Update presentation metadata |
| DELETE | /api/presentations/[id] | Yes | Soft delete presentation |

**GET /api/presentations**
- Query: `?page=1&limit=20&sort=updated_at`
- Response 200: `{ data: Presentation[], meta: { total, page, limit, totalPages } }`

**POST /api/presentations**
- Request: `{ title: string }`
- Response 201: `{ data: Presentation }` (with 1 blank slide auto-created)

**GET /api/presentations/[id]**
- Response 200: `{ data: Presentation & { slides: Slide[] } }`
- Response 404: `{ error: { code: "NOT_FOUND" } }`

**PATCH /api/presentations/[id]**
- Request: `{ title?: string }` (partial update)
- Response 200: `{ data: Presentation }`

**DELETE /api/presentations/[id]**
- Response 200: `{ data: { id: string, deleted: true } }` (soft delete)

## Implementation

### Directory Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout (providers, metadata)
│   ├── page.tsx                # Landing/redirect to dashboard
│   ├── (auth)/
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Registration page
│   ├── dashboard/
│   │   └── page.tsx            # Presentations list
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts  # NextAuth handlers
│       │   └── signup/route.ts         # Custom signup
│       └── presentations/
│           ├── route.ts                # GET (list), POST (create)
│           └── [id]/route.ts           # GET, PATCH, DELETE
├── components/
│   ├── ui/                     # Common UI (Button, Input, Modal, Card, Toast)
│   ├── layout/                 # App shell (Sidebar, Header)
│   └── providers/              # Context providers (Session, Theme)
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth config + helpers
│   ├── errors.ts               # AppError class + error handler
│   └── validations/
│       └── presentations.ts    # Zod schemas
├── store/
│   └── index.ts                # Zustand store (client-side cache)
├── types/
│   └── index.ts                # Shared TypeScript types (Element, Slide, Presentation)
└── hooks/
    └── use-session.ts          # Auth session hook wrapper
prisma/
├── schema.prisma               # Database schema
└── migrations/                 # Migration files
docker/
├── Dockerfile                  # Multi-stage Next.js build
└── docker-compose.yml          # App + PostgreSQL
.env.local                      # Environment variables
next.config.js                  # Next.js config (standalone output)
tailwind.config.ts              # Tailwind configuration
tsconfig.json                   # TypeScript config
vitest.config.ts                # Vitest configuration
```

### Dev Setup
```bash
pnpm install
cp .env.example .env.local      # Fill DATABASE_URL, NEXTAUTH_SECRET, etc.
pnpm prisma migrate dev         # Run migrations
pnpm dev                        # Start dev server (http://localhost:3000)
```

### Conventions
- **File naming**: kebab-case for files, PascalCase for components
- **Exports**: Named exports (no default exports except pages)
- **Imports**: `@/` alias for `src/`
- **API Routes**: Zod validation → business logic → Prisma → response
- **Error handling**: `withErrorHandler(handler)` wrapper for all Route Handlers
- **Auth guard**: `getServerSession()` at top of protected routes

## Testing Strategy

### Test Pyramid
- **Unit** (70%): Business logic, Zod schemas, utility functions, store actions
- **Integration** (30%): API routes with test database, Prisma operations

### Frameworks
| Layer | Framework | Notes |
|-------|-----------|-------|
| Unit | Vitest | Fast, Jest-compatible API |
| Integration | Vitest + Prisma (test DB) | Isolated PostgreSQL per test suite |
| Property-based | fast-check | Domain logic correctness |

### Coverage Targets
- Unit: 80%+ for lib/, store/, types/
- Integration: All API endpoints covered

### Test Structure
```
tests/
├── unit/
│   ├── lib/errors.test.ts
│   ├── lib/validations.test.ts
│   └── store/index.test.ts
├── integration/
│   ├── api/auth.test.ts
│   └── api/presentations.test.ts
└── setup/
    ├── test-db.ts              # Test database setup/teardown
    └── mocks.ts                # Common mocks
```

### Run Commands
```bash
pnpm test                       # Unit + integration
pnpm test:unit                  # Unit only
pnpm test:integration           # Integration only
pnpm test:coverage              # With coverage report
```

## Correctness (Property-Based Testing)

| Property | Description | Validates |
|----------|-------------|-----------|
| Email validation idempotent | Zod email schema accepts/rejects consistently | Auth input |
| Presentation ownership isolation | User can only access own presentations | CRUD authorization |
| Soft delete reversibility | Deleted items excluded from list but exist in DB | Data integrity |
| Slide ordering invariant | Order values are contiguous 0..N-1 after reorder | Slide management |

## Traceability

| Requirement | Component(s) | Endpoint(s) | Entity | Status |
|-------------|-------------|-------------|--------|--------|
| US-21 (Registration & Login) | Auth System, App Shell | /api/auth/signup, /api/auth/[...nextauth] | User | ✅ Covered |
| US-22 (CRUD Presentations) | Presentation CRUD, Dashboard | /api/presentations, /api/presentations/[id] | Presentation, Slide | ✅ Covered |

**Coverage**: 2/2 stories covered (100%)
**Infrastructure components without direct requirement**: Common UI, Error Handling, DB Layer, App Shell — justified as shared infrastructure required by all units.
