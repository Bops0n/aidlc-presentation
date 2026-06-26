# Tasks — Templates & Themes Unit

## Summary
- **Total Tasks**: 8
- **Execution Waves**: 3
- **Estimated Effort**: 4-5 days

---

## Wave 1: DB Schema + Data + API

### Task 1: Prisma Schema (Template + Theme tables)
- **Files**: prisma/schema.prisma (add Template + Theme models)
- **Acceptance**: `prisma db push` creates tables

### Task 2: Layout Presets Data
- **Files**: src/data/layouts.ts
- **Acceptance**: 30+ layout presets with positions for 960×540 grid

### Task 3: Theme + Template Seed Data
- **Files**: src/data/templates.ts, src/data/themes.ts
- **Acceptance**: 25+ templates (6 categories), 10+ themes (dark + light)

### Task 4: API Endpoints
- **Files**: src/app/api/templates/route.ts, src/app/api/themes/route.ts, src/app/api/templates/seed/route.ts
- **Acceptance**: GET templates, GET themes, POST seed

---

## Wave 2: UI Components

### Task 5: Template Gallery Modal
- **Files**: src/components/editor/template-gallery.tsx
- **Acceptance**: Modal with category tabs, live mini-render previews, click to apply

### Task 6: Theme Panel
- **Files**: src/components/editor/theme-panel.tsx
- **Acceptance**: Panel showing themes, apply replaces all element colors/fonts

### Task 7: Layout Panel
- **Files**: src/components/editor/layout-panel.tsx, src/lib/layout-engine.ts
- **Acceptance**: Panel showing layouts, apply repositions elements

---

## Wave 3: Integration

### Task 8: Wire into Editor
- **Files**: src/components/editor/editor-toolbar.tsx (update), src/app/editor/[id]/page.tsx (update)
- **Acceptance**: Toolbar has Template/Theme/Layout buttons, panels open correctly
