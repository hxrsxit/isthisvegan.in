-- ===================================================
-- Supabase Database Schema for IsThisVegan.in Community
-- Run this SQL in your Supabase SQL Editor
-- ===================================================

-- 1. Create Product Comments Table (Logged-in Users Only)
CREATE TABLE IF NOT EXISTS public.product_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    snack_slug TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by product slug
CREATE INDEX IF NOT EXISTS idx_product_comments_slug ON public.product_comments(snack_slug);

-- Enable RLS on product_comments
ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read comments
CREATE POLICY "Allow public read access to comments"
    ON public.product_comments FOR SELECT
    USING (true);

-- Policy: Authenticated users can insert their own comments
CREATE POLICY "Allow authenticated users to insert comments"
    ON public.product_comments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');


-- 2. Create Product Flags Table (Public: Logged-in & Anonymous)
CREATE TABLE IF NOT EXISTS public.product_flags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    snack_slug TEXT NOT NULL,
    flag_type TEXT NOT NULL CHECK (flag_type IN ('upvote_vegan', 'report_non_vegan')),
    reason TEXT,
    details TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by product slug
CREATE INDEX IF NOT EXISTS idx_product_flags_slug ON public.product_flags(snack_slug);

-- Enable RLS on product_flags
ALTER TABLE public.product_flags ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read flags/votes count
CREATE POLICY "Allow public read access to flags"
    ON public.product_flags FOR SELECT
    USING (true);

-- Policy: Anyone (anon and authenticated) can submit a flag/upvote
CREATE POLICY "Allow public insert access to flags"
    ON public.product_flags FOR INSERT
    WITH CHECK (true);
