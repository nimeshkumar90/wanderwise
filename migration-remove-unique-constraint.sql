-- Migration: Remove UNIQUE constraint from employee_id
-- Run this SQL in your Supabase SQL Editor to allow multiple entries per employee ID

-- Drop the existing unique constraint
ALTER TABLE teacher_holidays DROP CONSTRAINT IF EXISTS teacher_holidays_employee_id_key;

-- Verify the constraint is removed
-- You can check this by running: \d teacher_holidays in the SQL editor

-- Note: If you have existing data and want to keep only one entry per employee_id,
-- you might want to clean up duplicates first. Here's how you could do that:

-- DELETE FROM teacher_holidays 
-- WHERE id NOT IN (
--     SELECT MIN(id) 
--     FROM teacher_holidays 
--     GROUP BY employee_id
-- );

-- This migration allows teachers to submit up to 4 entries per employee ID
-- as implemented in the form validation logic. 