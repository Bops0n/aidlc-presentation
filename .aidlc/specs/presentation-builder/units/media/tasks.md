# Tasks — Media Unit

## Summary
- **Total Tasks**: 5
- **Execution**: Sequential

## Task 1: Upload Prisma Model
- **Files**: prisma/schema.prisma (add Upload model)
- **Acceptance**: db push creates upload table

## Task 2: Upload API
- **Files**: src/app/api/upload/route.ts
- **Acceptance**: POST saves file to /public/uploads + DB record, validates type/size; GET lists uploads

## Task 3: Unsplash API Proxy
- **Files**: src/app/api/unsplash/route.ts
- **Acceptance**: GET proxies Unsplash search, returns photos (graceful fallback if no API key)

## Task 4: Media Picker Modal
- **Files**: src/components/editor/media-picker.tsx
- **Acceptance**: 3 tabs (Upload/Unsplash/My Uploads), insert as image element

## Task 5: Integration
- **Files**: src/components/editor/editor-toolbar.tsx, src/app/editor/[id]/page.tsx
- **Acceptance**: Image button opens media picker
