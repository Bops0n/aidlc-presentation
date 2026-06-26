# Media Unit — Design

## Summary
- **Architecture**: Local file storage + Upload metadata table + Unsplash API proxy
- **Components**: 4 (Media Picker Modal, Upload Handler, Unsplash Search, My Uploads grid)
- **DB Model**: Upload (new table)
- **Endpoints**: 3 (POST upload, GET uploads, GET unsplash search)
- **Storage**: /public/uploads (local), metadata in PostgreSQL

## Components

### 1. Media Picker Modal
- **Purpose**: Modal with 3 tabs: Upload | Unsplash | My Uploads
- **Technology**: React + Tailwind
- **Responsibilities**: Tab navigation, file picker, Unsplash search box + grid, my uploads grid, insert as image element

### 2. Upload Handler (API)
- **Purpose**: Receive file, validate, save to /public/uploads, create DB record
- **Responsibilities**: Validate type (JPEG/PNG/WebP/SVG) + size (max 10MB), generate unique filename, save file, insert Upload record

### 3. Unsplash Search (API proxy)
- **Purpose**: Proxy Unsplash API (keep key server-side)
- **Responsibilities**: Search photos, return results with referrerPolicy handling

### 4. My Uploads Grid
- **Purpose**: Show user's previous uploads for reuse
- **Part of**: Media Picker Modal

## Data Model (new table)

### Upload
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| owner_id | BigInt | FK → User.user_id |
| url | String | /uploads/filename |
| filename | String | Original name |
| size | Int | Bytes |
| mime_type | String | image/jpeg etc. |
| created_at | DateTime | |

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/upload | Upload image file (multipart) |
| GET | /api/upload | List user's uploads |
| GET | /api/unsplash?query= | Search Unsplash photos |

## Traceability
| Requirement | Component(s) | Status |
|-------------|-------------|--------|
| US-11 (Upload images) | Media Picker (Upload tab), Upload Handler | ✅ |
| US-12 (Unsplash search) | Media Picker (Unsplash tab), Unsplash Search | ✅ |
