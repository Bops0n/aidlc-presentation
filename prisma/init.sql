-- Full database initialization for presentation_builder
-- Run this on a fresh PostgreSQL database

-- Create schemas
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS public;

-- User table (existing NextAuth schema)
CREATE TABLE IF NOT EXISTS users.nextauth_user_table (
    user_id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1),
    zoho_user_id CHARACTER VARYING,
    email CHARACTER VARYING,
    first_name CHARACTER VARYING,
    last_name CHARACTER VARYING,
    display_name CHARACTER VARYING,
    firsttime_login_date TIMESTAMP WITH TIME ZONE,
    last_login_date TIMESTAMP WITH TIME ZONE,
    refresh_token CHARACTER VARYING,
    access_token CHARACTER VARYING,
    org_info_id BIGINT,
    user_level BIGINT,
    profile_img CHARACTER VARYING,
    department_name CHARACTER VARYING,
    position_name CHARACTER VARYING,
    phone CHARACTER VARYING,
    hash_password CHARACTER VARYING,
    encode_url CHARACTER VARYING,
    is_delete BOOLEAN DEFAULT FALSE,
    confirm_email BOOLEAN DEFAULT FALSE,
    resetpassword_code CHARACTER VARYING,
    provider CHARACTER VARYING,
    provider_user_id CHARACTER VARYING,
    CONSTRAINT nextauth_user_table_pkey PRIMARY KEY (user_id)
);

-- Presentation table
CREATE TABLE IF NOT EXISTS public."Presentation" (
    id TEXT NOT NULL,
    title TEXT NOT NULL,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_url TEXT,
    CONSTRAINT "Presentation_pkey" PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS "Presentation_owner_id_idx" ON public."Presentation"(owner_id);
CREATE INDEX IF NOT EXISTS "Presentation_created_at_idx" ON public."Presentation"(created_at);

ALTER TABLE public."Presentation"
    DROP CONSTRAINT IF EXISTS "Presentation_owner_id_fkey";
ALTER TABLE public."Presentation"
    ADD CONSTRAINT "Presentation_owner_id_fkey"
    FOREIGN KEY (owner_id) REFERENCES users.nextauth_user_table(user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Slide table
CREATE TABLE IF NOT EXISTS public."Slide" (
    id TEXT NOT NULL,
    presentation_id TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    background_type TEXT NOT NULL DEFAULT 'color',
    background_value TEXT NOT NULL DEFAULT '#ffffff',
    transition_mode TEXT NOT NULL DEFAULT 'none',
    notes TEXT,
    elements JSONB NOT NULL DEFAULT '[]',
    CONSTRAINT "Slide_pkey" PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS "Slide_presentation_id_order_idx" ON public."Slide"(presentation_id, "order");

ALTER TABLE public."Slide"
    DROP CONSTRAINT IF EXISTS "Slide_presentation_id_fkey";
ALTER TABLE public."Slide"
    ADD CONSTRAINT "Slide_presentation_id_fkey"
    FOREIGN KEY (presentation_id) REFERENCES public."Presentation"(id)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Template table
CREATE TABLE IF NOT EXISTS public."Template" (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    slides_data JSONB NOT NULL DEFAULT '[]',
    theme_id TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Template_pkey" PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS "Template_category_idx" ON public."Template"(category);

-- Theme table
CREATE TABLE IF NOT EXISTS public."Theme" (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    background_color TEXT NOT NULL,
    text_color TEXT NOT NULL,
    accent_color TEXT NOT NULL,
    heading_font TEXT NOT NULL,
    body_font TEXT NOT NULL,
    is_dark BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "Theme_pkey" PRIMARY KEY (id)
);

-- Upload table
CREATE TABLE IF NOT EXISTS public."Upload" (
    id TEXT NOT NULL,
    owner_id BIGINT NOT NULL,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Upload_pkey" PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS "Upload_owner_id_idx" ON public."Upload"(owner_id);
