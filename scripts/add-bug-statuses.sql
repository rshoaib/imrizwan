-- Run this in Supabase SQL Editor to add bug board statuses to existing tasks table
-- This drops the old CHECK constraint and adds a new one that includes open/fixed/closed

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
  CHECK (status IN ('todo','in_progress','testing','done','blocked','open','fixed','closed'));
