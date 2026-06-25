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
- **Testing**: Pending D3 decisions
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
- **Cloud Provider**: Pending D3 decisions
- **Compute**: Pending D3 decisions (Vercel recommended for Next.js)
- **Database**: PostgreSQL
- **IaC Tool**: Pending D3 decisions

## Patterns & Conventions
- **Architecture pattern**: App Router pages → Client Components → Zustand Store → localStorage
- **Data access**: PostgreSQL via ORM (Pending D3 — Prisma/Drizzle), plus client-side Zustand cache
- **API response format**: Pending D3 — JSON responses from Route Handlers
- **Error handling**: Pending D3 — will be defined during design phase
- **Authentication**: NextAuth.js — ใช้ existing `users.nextauth_user_table` (PK: user_id bigint)
- **Validation**: JSON Schema validation for AI responses (server-side)
- **Logging**: Pending D3
- **Code style**: Pending D3
- **Naming conventions**: Pending D3
- **Branch strategy**: Pending D3

## Environment Configuration
- **Config approach**: Environment variables (.env.local)
- **Required env vars**: GEMINI_API_KEY, GOOGLE_SERVICE_ACCOUNT_KEY, UNSPLASH_ACCESS_KEY, DATABASE_URL
- **Environments**: Development (local), Production
- **Secrets management**: Server-side only via Route Handlers

## CI/CD Pipeline
- Pending D3 decisions

## Dependency Management
- **Lockfile**: package-lock.json
- **Version strategy**: Pending D3
- **Monorepo tooling**: None — single Next.js app

## Known Technical Debt
N/A — greenfield project
