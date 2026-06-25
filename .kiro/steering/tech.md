---
inclusion: always
---

# Technology Context

## Summary
TypeScript / Next.js 14+ (App Router) / Zustand — Full-stack web application, REST-style Route Handlers, Vercel-ready deployment

## Stack
- **Languages**: TypeScript
- **Frameworks**: Next.js 14+ (App Router)
- **Build System**: npm / next build
- **Package Manager**: npm
- **Testing**: Vitest (unit/integration) + fast-check (property-based)
- **State Management**: Zustand with persist middleware (localStorage)
- **Database**: PostgreSQL (persistent storage for presentations and uploads)
- **AI SDK**: Google Gemini SDK (@google/generative-ai)
- **Export Libraries**: Pending D3 decisions (PDF, PPTX client-side generation)
- **Chart Rendering**: Pending D3 decisions (SVG-based chart library)
- **File Upload**: Server-side image upload and storage

## Architecture
- **Pattern**: Full-stack Next.js — Client Components ('use client') + Server Route Handlers (/app/api/)
- **API Style**: REST Route Handlers (POST /api/generate-slides, POST /api/export)
- **Rendering Split**:
  - Server: Route Handlers สำหรับ AI generation pipeline และ Google Slides export (ซ่อน API keys)
  - Client: Interactive canvas, state management, drag-drop, rich text editing, presenter mode

## Infrastructure
- **Cloud Provider**: Self-hosted (Docker + VPS)
- **Compute**: Docker container (Next.js standalone output)
- **Database**: PostgreSQL
- **IaC Tool**: Docker Compose

## Patterns & Conventions
- **Architecture pattern**: App Router pages → Client Components → Zustand Store → API Route Handlers → Prisma → PostgreSQL
- **Data access**: Prisma ORM with PostgreSQL, elements stored as JSON column in Slide table
- **API response format**: `{ data: T }` (success) / `{ error: { code, message, details? } }` (error)
- **Error handling**: Custom AppError class + React Error Boundary (client) + withErrorHandler wrapper (server)
- **Authentication**: NextAuth.js v5 — credentials provider, JWT sessions, user_id as primary identity
- **Validation**: Zod schemas at route level
- **Logging**: Pending — will use structured JSON logging
- **Code style**: ESLint + Prettier
- **Naming conventions**: kebab-case files, PascalCase components, named exports
- **Branch strategy**: Pending D3

## Environment Configuration
- **Config approach**: Environment variables (.env.local)
- **Required env vars**: GEMINI_API_KEY, GOOGLE_SERVICE_ACCOUNT_KEY, UNSPLASH_ACCESS_KEY, DATABASE_URL
- **Environments**: Development (local), Production
- **Secrets management**: Server-side only via Route Handlers

## CI/CD Pipeline
- Pending D3 decisions

## Dependency Management
- **Lockfile**: pnpm-lock.yaml
- **Version strategy**: Exact versions (pnpm default)
- **Monorepo tooling**: None — single Next.js app

## Known Technical Debt
N/A — greenfield project
