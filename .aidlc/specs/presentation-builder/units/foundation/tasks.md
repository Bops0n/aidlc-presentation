# Tasks — Foundation Unit

## Summary
- **Total Tasks**: 12
- **Execution Waves**: 4
- **Strategy**: Component-first, single-concern granularity
- **Approach**: Test-after
- **Estimated Effort**: 3-4 days (solo developer)

---

## Wave 1: Project Setup & Database (ทำก่อน — ไม่มี dependencies)

### Task 1: Project Scaffolding
- **Description**: สร้าง Next.js App Router project ด้วย pnpm + TypeScript + Tailwind CSS
- **Files**:
  - `package.json` — dependencies + scripts
  - `next.config.js` — standalone output mode
  - `tsconfig.json` — path aliases (@/)
  - `tailwind.config.ts` — Tailwind configuration
  - `.env.example` — template env vars
  - `.gitignore`
  - `src/app/layout.tsx` — root layout (minimal)
  - `src/app/page.tsx` — placeholder
- **Acceptance**: `pnpm dev` runs without errors, TypeScript compiles, Tailwind works
- **Dependencies**: None

### Task 2: Prisma Setup + Database Schema
- **Description**: Setup Prisma ORM, connect to PostgreSQL, define schema (User mapping + Presentation + Slide)
- **Files**:
  - `prisma/schema.prisma` — models: User (map to existing table), Presentation, Slide
  - `src/lib/prisma.ts` — Prisma client singleton
  - `.env.local` — DATABASE_URL
- **Acceptance**: `pnpm prisma migrate dev` runs, `pnpm prisma generate` generates types, client connects
- **Dependencies**: Task 1

### Task 3: Shared Types
- **Description**: สร้าง TypeScript types สำหรับ Element, Slide, Presentation contracts (ใช้ร่วมทั้ง app)
- **Files**:
  - `src/types/index.ts` — Element (text/image/shape/chart/icon/video), Slide, Presentation, user types
- **Acceptance**: Types import ได้จาก `@/types`, compile ผ่าน, ครอบคลุม spec ทั้งหมด
- **Dependencies**: Task 1

### Task 4: Error Handling System
- **Description**: สร้าง AppError class + API error response helper + withErrorHandler wrapper
- **Files**:
  - `src/lib/errors.ts` — AppError class, error codes enum, withErrorHandler
  - `src/components/providers/error-boundary.tsx` — React Error Boundary component
- **Acceptance**: AppError สร้างได้ด้วย code/message/status, withErrorHandler จับ error แล้วตอบ JSON format ถูกต้อง
- **Dependencies**: Task 1

---

## Wave 2: Authentication (ต้องมี DB + Types ก่อน)

### Task 5: NextAuth.js Configuration
- **Description**: Setup NextAuth.js v5 + Prisma adapter ที่ map ไป existing user table
- **Files**:
  - `src/lib/auth.ts` — NextAuth config (credentials provider, JWT strategy, callbacks)
  - `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route handler
  - `.env.local` — NEXTAUTH_SECRET, NEXTAUTH_URL
- **Acceptance**: NextAuth session works, login/logout functional, user_id ใน session ถูกต้อง
- **Dependencies**: Task 2, Task 3

### Task 6: Custom Signup Endpoint
- **Description**: สร้าง registration endpoint พร้อม Zod validation + password hashing
- **Files**:
  - `src/app/api/auth/signup/route.ts` — POST handler
  - `src/lib/validations/auth.ts` — Zod schemas (signupSchema, loginSchema)
- **Acceptance**: POST /api/auth/signup สร้าง user ใน DB, hash password ด้วย bcrypt, validate email format + password min 8
- **Dependencies**: Task 4, Task 5

### Task 7: Auth Pages (Login + Register)
- **Description**: สร้าง login และ register pages ด้วย Tailwind
- **Files**:
  - `src/app/(auth)/login/page.tsx` — Login form
  - `src/app/(auth)/register/page.tsx` — Register form
  - `src/app/(auth)/layout.tsx` — Auth layout (centered card)
- **Acceptance**: Forms submit correctly, redirect หลัง login, show errors on invalid input
- **Dependencies**: Task 5, Task 6

---

## Wave 3: Presentation CRUD (ต้องมี Auth ก่อน)

### Task 8: Presentations API Endpoints
- **Description**: สร้าง CRUD Route Handlers สำหรับ presentations
- **Files**:
  - `src/app/api/presentations/route.ts` — GET (list), POST (create)
  - `src/app/api/presentations/[id]/route.ts` — GET, PATCH, DELETE
  - `src/lib/validations/presentations.ts` — Zod schemas
- **Acceptance**: ทุก endpoint ทำงานถูกต้อง, ownership validation (user_id), soft delete, pagination works
- **Dependencies**: Task 5, Task 6, Task 4

### Task 9: Zustand Store
- **Description**: สร้าง client-side store สำหรับ presentations cache + active presentation state
- **Files**:
  - `src/store/index.ts` — Zustand store (presentations list, active presentation, loading states)
- **Acceptance**: Store fetch/create/update/delete presentations ผ่าน API, cache locally, loading/error states work
- **Dependencies**: Task 3, Task 8

---

## Wave 4: UI Shell & Dashboard (ต้องมี API + Store ก่อน)

### Task 10: Common UI Components
- **Description**: สร้าง reusable UI components ด้วย Tailwind CSS
- **Files**:
  - `src/components/ui/button.tsx`
  - `src/components/ui/input.tsx`
  - `src/components/ui/modal.tsx`
  - `src/components/ui/card.tsx`
  - `src/components/ui/toast.tsx`
  - `src/components/ui/dropdown.tsx`
  - `src/components/ui/loading.tsx`
- **Acceptance**: Components render ถูกต้อง, responsive, accessible (aria labels), consistent styling
- **Dependencies**: Task 1

### Task 11: App Shell & Providers
- **Description**: สร้าง layout shell (sidebar + header) + context providers
- **Files**:
  - `src/components/layout/sidebar.tsx` — Navigation sidebar
  - `src/components/layout/header.tsx` — Top header with user info
  - `src/components/providers/session-provider.tsx` — NextAuth SessionProvider wrapper
  - `src/app/layout.tsx` — Update root layout with providers + shell
- **Acceptance**: Layout renders, sidebar navigation works, session provider wraps app, hydration guard works
- **Dependencies**: Task 5, Task 10

### Task 12: Dashboard Page
- **Description**: สร้างหน้า dashboard แสดง presentations list + create new button
- **Files**:
  - `src/app/dashboard/page.tsx` — Presentations grid/list view
  - `src/app/dashboard/layout.tsx` — Dashboard layout (protected route)
- **Acceptance**: แสดง presentations ของ user, create new presentation, delete/rename, redirect ถ้าไม่ login
- **Dependencies**: Task 8, Task 9, Task 10, Task 11

---

## Task Dependency Graph

```
Task 1 (Scaffolding)
├── Task 2 (Prisma) ──────┐
├── Task 3 (Types)         │
├── Task 4 (Errors)        │
└── Task 10 (UI Components)│
                           │
    Task 5 (NextAuth) ←────┘ ← Task 2, Task 3
    ├── Task 6 (Signup) ← Task 4
    │   └── Task 7 (Auth Pages)
    ├── Task 8 (CRUD API) ← Task 4, Task 6
    │   └── Task 9 (Store) ← Task 3
    └── Task 11 (Shell) ← Task 10
        └── Task 12 (Dashboard) ← Task 8, Task 9, Task 10, Task 11
```

---

## File Ownership (No Overlaps)

| Task | Owned Files |
|------|-------------|
| 1 | package.json, next.config.js, tsconfig.json, tailwind.config.ts, .env.example, .gitignore |
| 2 | prisma/schema.prisma, src/lib/prisma.ts |
| 3 | src/types/index.ts |
| 4 | src/lib/errors.ts, src/components/providers/error-boundary.tsx |
| 5 | src/lib/auth.ts, src/app/api/auth/[...nextauth]/route.ts |
| 6 | src/app/api/auth/signup/route.ts, src/lib/validations/auth.ts |
| 7 | src/app/(auth)/** |
| 8 | src/app/api/presentations/**, src/lib/validations/presentations.ts |
| 9 | src/store/index.ts |
| 10 | src/components/ui/** |
| 11 | src/components/layout/**, src/components/providers/session-provider.tsx, src/app/layout.tsx |
| 12 | src/app/dashboard/** |
