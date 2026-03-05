-- ============================================================
-- Online Notes Sharing Platform — Supabase Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Users (synced from Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

-- Notes
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  downloads INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating_value INTEGER CHECK (rating_value BETWEEN 1 AND 5),
  UNIQUE (note_id, user_id)
);

-- Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_notes_subject ON public.notes(subject_id);
CREATE INDEX idx_notes_uploaded_by ON public.notes(uploaded_by);
CREATE INDEX idx_ratings_note ON public.ratings(note_id);
CREATE INDEX idx_comments_note ON public.comments(note_id);
CREATE INDEX idx_notes_title_search ON public.notes USING gin(to_tsvector('english', title));

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Public read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public read ratings" ON public.ratings FOR SELECT USING (true);

-- Authenticated inserts
CREATE POLICY "Auth insert notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth insert comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth insert ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth insert users" ON public.users FOR INSERT WITH CHECK (true);

-- Update own records
CREATE POLICY "Auth update own notes" ON public.notes FOR UPDATE USING (auth.uid() = uploaded_by);
CREATE POLICY "Auth update notes service" ON public.notes FOR UPDATE USING (true);

-- Delete (admin via service role)
CREATE POLICY "Auth delete notes" ON public.notes FOR DELETE USING (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

-- Run this in the Supabase SQL editor or create via Dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('notes-pdfs', 'notes-pdfs', true);

-- Storage policies (run in SQL editor):
-- CREATE POLICY "Allow authenticated uploads" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'notes-pdfs' AND auth.uid() IS NOT NULL);
-- CREATE POLICY "Allow public downloads" ON storage.objects
--   FOR SELECT USING (bucket_id = 'notes-pdfs');

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Sample User (demo account)
INSERT INTO public.users (id, email, name, role) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'demo@noteshare.com', 'Demo User', 'user'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'admin@noteshare.com', 'Admin User', 'admin');

-- Sample Subjects
INSERT INTO public.subjects (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Computer Science'),
  ('22222222-2222-2222-2222-222222222222', 'Database Management System'),
  ('33333333-3333-3333-3333-333333333333', 'Python Programming'),
  ('44444444-4444-4444-4444-444444444444', 'Web Development'),
  ('55555555-5555-5555-5555-555555555555', 'Data Structures');

-- Sample Notes
INSERT INTO public.notes (id, title, description, subject_id, file_url, uploaded_by, downloads, rating) VALUES
  (
    'aaaa1111-aaaa-1111-aaaa-111111111111',
    'Introduction to DBMS',
    'Basic concepts of database systems including tables, keys and normalization.',
    '22222222-2222-2222-2222-222222222222',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    45,
    4.5
  ),
  (
    'bbbb2222-bbbb-2222-bbbb-222222222222',
    'Python Basics Notes',
    'Variables, loops, functions and basic Python syntax.',
    '33333333-3333-3333-3333-333333333333',
    'https://www.orimi.com/pdf-test.pdf',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    32,
    4.0
  ),
  (
    'cccc3333-cccc-3333-cccc-333333333333',
    'HTML and CSS Fundamentals',
    'Introduction to web development with HTML structure and CSS styling.',
    '44444444-4444-4444-4444-444444444444',
    'https://gahp.net/wp-content/uploads/2017/09/sample.pdf',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    28,
    4.2
  ),
  (
    'dddd4444-dddd-4444-dddd-444444444444',
    'Data Structures & Algorithms',
    'Arrays, linked lists, stacks, queues, trees and sorting algorithms explained.',
    '55555555-5555-5555-5555-555555555555',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    56,
    4.7
  ),
  (
    'eeee5555-eeee-5555-eeee-555555555555',
    'Operating Systems Concepts',
    'Process management, memory management, file systems and deadlocks.',
    '11111111-1111-1111-1111-111111111111',
    'https://www.orimi.com/pdf-test.pdf',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    41,
    4.3
  );

-- Sample Ratings
INSERT INTO public.ratings (note_id, user_id, rating_value) VALUES
  ('aaaa1111-aaaa-1111-aaaa-111111111111', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 5),
  ('bbbb2222-bbbb-2222-bbbb-222222222222', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 4),
  ('cccc3333-cccc-3333-cccc-333333333333', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 4),
  ('dddd4444-dddd-4444-dddd-444444444444', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 5),
  ('eeee5555-eeee-5555-eeee-555555555555', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 4);

-- Sample Comments
INSERT INTO public.comments (note_id, user_id, comment_text) VALUES
  ('aaaa1111-aaaa-1111-aaaa-111111111111', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Very helpful notes! The normalization section was excellent.'),
  ('aaaa1111-aaaa-1111-aaaa-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Great for exam preparation. Thanks for sharing!'),
  ('bbbb2222-bbbb-2222-bbbb-222222222222', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Clear explanations of Python basics. Loved the examples.'),
  ('dddd4444-dddd-4444-dddd-444444444444', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Best DSA notes I have found. Very well organized.'),
  ('eeee5555-eeee-5555-eeee-555555555555', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'The OS concepts are explained in a very simple way.');
