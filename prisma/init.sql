-- Run this script ONCE to set up the database
-- Docker Compose mounts this as /docker-entrypoint-initdb.d/01-init.sql
-- It runs automatically on first container start (empty pgdata volume)

-- Create schemas
CREATE SCHEMA IF NOT EXISTS users;

-- ============================================================
-- Users schema
-- ============================================================
CREATE TABLE IF NOT EXISTS users.nextauth_user_table (
    user_id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    zoho_user_id VARCHAR,
    email VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    display_name VARCHAR,
    firsttime_login_date TIMESTAMPTZ,
    last_login_date TIMESTAMPTZ,
    refresh_token VARCHAR,
    access_token VARCHAR,
    org_info_id BIGINT,
    user_level BIGINT,
    profile_img VARCHAR,
    department_name VARCHAR,
    position_name VARCHAR,
    phone VARCHAR,
    hash_password VARCHAR,
    encode_url VARCHAR,
    is_delete BOOLEAN DEFAULT FALSE,
    confirm_email BOOLEAN DEFAULT FALSE,
    resetpassword_code VARCHAR,
    provider VARCHAR,
    provider_user_id VARCHAR,
    CONSTRAINT nextauth_user_table_pkey PRIMARY KEY (user_id)
);

-- ============================================================
-- Public schema — Presentation tables
-- ============================================================
CREATE TABLE IF NOT EXISTS public."Presentation" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    owner_id BIGINT NOT NULL REFERENCES users.nextauth_user_table(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_url TEXT
);
CREATE INDEX IF NOT EXISTS idx_presentation_owner ON public."Presentation"(owner_id);
CREATE INDEX IF NOT EXISTS idx_presentation_created ON public."Presentation"(created_at);

CREATE TABLE IF NOT EXISTS public."Slide" (
    id TEXT PRIMARY KEY,
    presentation_id TEXT NOT NULL REFERENCES public."Presentation"(id) ON DELETE CASCADE,
    "order" INT NOT NULL,
    background_type TEXT NOT NULL DEFAULT 'color',
    background_value TEXT NOT NULL DEFAULT '#ffffff',
    transition_mode TEXT NOT NULL DEFAULT 'none',
    notes TEXT,
    elements JSONB NOT NULL DEFAULT '[]'
);
CREATE INDEX IF NOT EXISTS idx_slide_pres_order ON public."Slide"(presentation_id, "order");

CREATE TABLE IF NOT EXISTS public."Template" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    slides_data JSONB NOT NULL DEFAULT '[]',
    theme_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_template_category ON public."Template"(category);

CREATE TABLE IF NOT EXISTS public."Theme" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    background_color TEXT NOT NULL,
    text_color TEXT NOT NULL,
    accent_color TEXT NOT NULL,
    heading_font TEXT NOT NULL,
    body_font TEXT NOT NULL,
    is_dark BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public."Upload" (
    id TEXT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    size INT NOT NULL,
    mime_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_upload_owner ON public."Upload"(owner_id);
