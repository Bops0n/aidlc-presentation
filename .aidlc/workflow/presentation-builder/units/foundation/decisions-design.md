# Design Decisions — Foundation Unit (D3)

## Context Summary
- **Unit**: Foundation (Wave 1)
- **Scope**: Project setup, NextAuth.js auth, PostgreSQL DB, shared types, common UI, error handling
- **Stories**: US-21 (Registration & Login), US-22 (CRUD Presentations)
- **Stack**: TypeScript / Next.js (App Router)
- **Architecture**: Modular Monolith
- **Auth**: NextAuth.js with existing `users.nextauth_user_table` (PK: user_id)

---

## Decision Questions

### D3-1: Database ORM/Client
**Question**: ORM สำหรับ PostgreSQL?
- 1) Prisma (type-safe, auto migrations, great DX) **(Recommended)**
- 2) Drizzle (lightweight, SQL-like syntax, good performance)
- 3) TypeORM (decorator-based, mature)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-2: Validation Library
**Question**: ใช้ library ใดสำหรับ validation (API input, form data)?
- 1) Zod (type-safe, works great with TypeScript + tRPC/Next.js) **(Recommended)**
- 2) Joi (mature, expressive, but weaker TS inference)
- 3) class-validator (decorator-based)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-3: UI Component Library
**Question**: UI component library/styling approach?
- 1) Tailwind CSS + shadcn/ui (utility-first, customizable, copy-paste components) **(Recommended)**
- 2) Tailwind CSS + custom components
- 3) Material UI (MUI) (comprehensive, opinionated)
- 4) Chakra UI (accessible, composable)
- 5) Other (please specify): _______

**Answer**: 2

---

### D3-4: API Design Pattern
**Question**: API design pattern สำหรับ client-server communication?
- 1) Next.js Route Handlers (REST-style) **(Recommended)**
- 2) tRPC (end-to-end type-safe, no code generation)
- 3) Next.js Server Actions (direct server mutations)
- 4) Hybrid: Server Actions + Route Handlers
- 5) Other (please specify): _______

**Answer**: 1

---

### D3-5: State Management
**Question**: Client-side state management (ยืนยัน Zustand หรือเปลี่ยน)?
- 1) Zustand (lightweight, simple API, persist middleware) **(Recommended)**
- 2) Jotai (atomic state, minimal boilerplate)
- 3) React Context + useReducer (built-in, no dependency)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-6: Testing Strategy
**Question**: Testing framework + approach?
- 1) Vitest (fast, Vite-native, Jest-compatible API) **(Recommended)**
- 2) Jest (mature, wide ecosystem)
- 3) Minimal — no unit tests, E2E only (Playwright)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-7: E2E Testing
**Question**: E2E testing framework?
- 1) Playwright (modern, fast, multi-browser) **(Recommended)**
- 2) Cypress (developer-friendly, good DX)
- 3) None for now — add later
- 4) Other (please specify): _______

**Answer**: 3

---

### D3-8: Code Style & Linting
**Question**: Code style enforcement?
- 1) ESLint + Prettier (standard combo) **(Recommended)**
- 2) Biome (fast all-in-one linter + formatter)
- 3) ESLint only (format manually)
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-9: Package Manager
**Question**: Package manager?
- 1) pnpm (fast, disk-efficient, strict) **(Recommended)**
- 2) npm (standard, no extra install)
- 3) yarn (plug'n'play, workspaces)
- 4) bun (fastest, but newer ecosystem)
- 5) Other (please specify): _______

**Answer**: 1

---

### D3-10: Correctness & Property-Based Testing
**Question**: วิธีตรวจสอบ correctness ของ domain logic (data transforms, spatial calculations)?
- 1) Property-based testing (fast-check) + unit tests สำหรับ critical paths **(Recommended)**
- 2) Unit tests only (example-based)
- 3) Integration tests only
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-11: Error Handling Pattern
**Question**: Error handling approach?
- 1) Custom AppError class + global error boundary (client) + try-catch middleware (server) **(Recommended)**
- 2) Result type pattern (neverthrow/ts-results)
- 3) Basic try-catch + HTTP status codes
- 4) Other (please specify): _______

**Answer**: 1

---

### D3-12: Hosting Platform
**Question**: Hosting/deployment platform?
- 1) Vercel (optimal for Next.js, zero-config) **(Recommended)**
- 2) AWS (EC2/ECS/Lambda — more control, more setup)
- 3) Railway (simple PaaS, supports PostgreSQL)
- 4) Self-hosted (Docker + VPS)
- 5) Other (please specify): _______

**Answer**: 4

---

## Decisions Summary
<!-- Machine-readable compact summary. Downstream phases: read ONLY this section. -->
- D3-1 ORM: Prisma
- D3-2 Validation: Zod
- D3-3 UI Library: Tailwind CSS + custom components
- D3-4 API Pattern: Next.js Route Handlers (REST-style)
- D3-5 State Management: Zustand
- D3-6 Testing: Vitest
- D3-7 E2E: None for now — add later
- D3-8 Code Style: ESLint + Prettier
- D3-9 Package Manager: pnpm
- D3-10 Correctness: Property-based testing (fast-check) + unit tests
- D3-11 Error Handling: Custom AppError class + error boundary + try-catch middleware
- D3-12 Hosting: Self-hosted (Docker + VPS)

---

**Instructions**: Fill in your answers above and respond with "done"
