# Tasks — Presenter Unit

## Summary
- **Total Tasks**: 5
- **Dependency**: framer-motion (installed)

## Task 1: Element Animation CSS
- **Files**: src/app/globals.css (add keyframes), src/lib/animations.ts (helper)
- **Acceptance**: 6 animation keyframes (fade/fly/slide/zoom/bounce/spin) + animationDelay

## Task 2: Presenter Slide Stage
- **Files**: src/components/presenter/slide-stage.tsx
- **Acceptance**: Full-screen scale-to-fit slide, Framer Motion transition between slides, element entrance animations

## Task 3: Laser Pointer + Notes/Timer
- **Files**: src/components/presenter/laser-pointer.tsx, src/components/presenter/notes-timer-dock.tsx
- **Acceptance**: Laser follows cursor with trail (toggle L), notes+timer overlay (toggle N)

## Task 4: Presenter Page
- **Files**: src/app/present/[id]/page.tsx, src/app/present/[id]/layout.tsx
- **Acceptance**: Load presentation, full-screen, keyboard nav (←/→/Space/Esc/L/N)

## Task 5: Animation Audit + Present Button
- **Files**: src/lib/animation-audit.ts, editor-toolbar.tsx (Present button + audit warnings)
- **Acceptance**: "Present" button opens /present/[id], audit detects 3 issue types
