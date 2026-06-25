---
inclusion: always
---

# Project Structure

## Summary
Single Next.js App Router application, src/ directory convention, app/ for pages and API routes, components/ for UI

## Repository
- **Type**: Single repo
- **Root**: Next.js application with App Router

## Key Directories

| Directory | Purpose | Key Contents |
|-----------|---------|--------------|
| src/app/ | App Router pages and API routes | page.tsx, layout.tsx, api/ |
| src/app/api/ | Server-side Route Handlers | generate-slides/, export/, upload/ |
| src/components/ | React components | canvas/, editor/, slides/, presenter/ |
| src/store/ | Zustand state management | presentationStore.ts |
| src/types/ | TypeScript type definitions | index.ts (Element, Slide, Presentation) |
| src/lib/ | Utility functions and helpers | Pending design phase |
| src/hooks/ | Custom React hooks | Pending design phase |
| public/ | Static assets | Pending design phase |

## Key Files

| File | Purpose | Notes |
|------|---------|-------|
| src/types/index.ts | Core domain data schemas | Element, Slide, Presentation contracts |
| src/store/presentationStore.ts | Zustand store with persistence | undo/redo, localStorage sync |
| src/app/api/generate-slides/route.ts | AI generation endpoint | Gemini SDK integration |
| src/app/api/export/route.ts | Google Slides export | Service Account auth |
| src/app/api/upload/route.ts | Image upload endpoint | File storage + DB record |
| next.config.js | Next.js configuration | Pending design phase |
| .env.local | Environment variables | API keys (server-side only) |

## Entry Points

| Entry | Type | Description |
|-------|------|-------------|
| src/app/page.tsx | Web page | Main editor/dashboard page |
| src/app/api/generate-slides/route.ts | API endpoint | POST — AI slide generation |
| src/app/api/export/route.ts | API endpoint | POST — Google Slides export |
| src/app/api/upload/route.ts | API endpoint | POST — Image upload |

## Module Dependencies
Will be defined during design phase.

## Data Flow
Will be defined during design phase.

## Key Abstractions
Will be defined during design phase.

## Test Organization
Will be defined during design phase (D3 decisions).

## Build & Deploy
- **Build output**: .next/ (Next.js build artifacts)
- **Container**: Pending D3
- **Deploy target**: Pending D3 (Vercel recommended)
