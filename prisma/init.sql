-- Run this script ONCE to set up the database
-- Execute via pgAdmin or psql: psql -U postgres -h localhost -p 5432 -f prisma/init.sql

-- 1. Create database (run this separately if needed)
-- CREATE DATABASE presentation_builder;

-- 2. Connect to presentation_builder database first, then run:

-- Create schemas
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS public;

-- 3. Create the existing user table in users schema
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
