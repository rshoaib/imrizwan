-- Run this in Supabase SQL Editor to create the tasks table
CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  priority    TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  status      TEXT DEFAULT 'todo' CHECK (status IN ('todo','in_progress','testing','done','blocked')),
  assigned_to TEXT DEFAULT 'Tester',
  app_name    TEXT DEFAULT '',
  test_cases  TEXT DEFAULT '',
  test_result TEXT DEFAULT '' CHECK (test_result IN ('','pass','fail','partial')),
  notes       TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Allow public read/write (no auth, stateless site)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
