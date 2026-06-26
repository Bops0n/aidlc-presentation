# Templates & Themes Unit — Design

## Summary
- **Architecture**: PostgreSQL-backed template/theme system + static layout presets
- **Components**: 5 (Template Gallery, Layout Panel, Theme Panel, Template Seeder, Layout Engine)
- **DB Models**: Template, TemplateSlide, Theme (new tables)
- **Endpoints**: 3 (GET templates, GET themes, POST seed)
- **Storage**: Templates + Themes in PostgreSQL, Layout presets in TypeScript data files

## Components

### 1. Template Gallery
- **Purpose**: Modal/panel showing templates grouped by category with live mini-render preview
- **Responsibilities**: Browse templates by category, preview slides, apply to create new presentation
- **Exposes**: `<TemplateGallery onSelect={} />`

### 2. Layout Panel
- **Purpose**: Sidebar panel showing layout presets grouped by type (Universal, Marketing, Business, etc.)
- **Responsibilities**: Browse layouts, apply to current slide (reposition elements)
- **Exposes**: `<LayoutPanel />`

### 3. Theme Panel
- **Purpose**: Panel for applying theme to entire presentation
- **Responsibilities**: Show theme presets, apply colors/fonts to all slides destructively
- **Exposes**: `<ThemePanel />`

### 4. Template Seeder
- **Purpose**: Seed DB with initial templates and themes on first run
- **Responsibilities**: Check if templates exist, create 25+ templates + 10+ themes
- **Exposes**: `/api/templates/seed` endpoint

### 5. Layout Engine
- **Purpose**: Algorithm to reposition elements according to layout grid
- **Responsibilities**: Map existing elements to layout positions, maintain content

## Data Model (new tables)

### Template
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| name | String | Template name |
| category | String | marketing/business/developer/creative/education/minimal |
| description | String? | Brief description |
| slides_data | Json | Array of slide definitions (elements, background, layout) |
| theme_id | String? | Associated theme |
| created_at | DateTime | |

### Theme
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| name | String | Theme name |
| background_color | String | Hex |
| text_color | String | Hex |
| accent_color | String | Hex |
| heading_font | String | Font family |
| body_font | String | Font family |
| is_dark | Boolean | Dark/light indicator |

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/templates | List all templates (grouped by category) |
| GET | /api/themes | List all themes |
| POST | /api/templates/seed | Seed initial templates + themes (run once) |

## Layout Presets (TypeScript data)
Static data in `src/data/layouts.ts` — 30+ presets defining element positions on 960×540 grid.

## Traceability
| Requirement | Component(s) | Status |
|-------------|-------------|--------|
| US-06 (Template gallery) | Template Gallery, Template Seeder | ✅ |
| US-07 (Layout presets) | Layout Panel, Layout Engine | ✅ |
| US-08 (Theme system) | Theme Panel | ✅ |
