/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key) - Unique identifier for each task
      - `title` (text, required) - Title of the task
      - `description` (text, optional) - Detailed description of the task
      - `status` (text, required) - Current status: 'pending', 'in-progress', or 'completed'
      - `created_at` (timestamptz) - Timestamp when task was created
  
  2. Security
    - Enable RLS on `tasks` table
    - Add policy for anyone to read all tasks (public app)
    - Add policy for anyone to create tasks
    - Add policy for anyone to update tasks
    - Add policy for anyone to delete tasks
  
  Note: This is a public task manager where all users can manage all tasks.
  For a production app with user accounts, policies would be more restrictive.
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tasks"
  ON tasks FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update tasks"
  ON tasks FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete tasks"
  ON tasks FOR DELETE
  USING (true);