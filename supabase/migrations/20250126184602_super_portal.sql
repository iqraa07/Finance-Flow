/*
  # Add User Settings Columns

  1. Changes
    - Add missing columns to users table for settings functionality:
      - phone (text)
      - language (text)
      - timezone (text) 
      - theme (text)
      - email_notifications (boolean)
      - push_notifications (boolean)
      - two_factor_enabled (boolean)
      - date_format (text)

  2. Security
    - Maintain existing RLS policies
*/

-- Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark',
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS date_format TEXT DEFAULT 'MM/DD/YYYY';

-- Add indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_users_language ON users(language);
CREATE INDEX IF NOT EXISTS idx_users_timezone ON users(timezone);
CREATE INDEX IF NOT EXISTS idx_users_theme ON users(theme);

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);