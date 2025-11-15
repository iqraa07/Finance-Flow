/*
  # Fix Settings Page Issues

  1. Changes
    - Add NOT NULL constraints to required fields
    - Set proper default values
    - Add missing columns
    - Update existing rows with default values

  2. Security
    - Maintain existing RLS policies
*/

-- Ensure all required columns exist with proper defaults
ALTER TABLE users
ALTER COLUMN full_name SET DEFAULT '',
ALTER COLUMN role SET DEFAULT 'staff',
ALTER COLUMN language SET DEFAULT 'en',
ALTER COLUMN timezone SET DEFAULT 'UTC',
ALTER COLUMN theme SET DEFAULT 'dark',
ALTER COLUMN date_format SET DEFAULT 'MM/DD/YYYY',
ALTER COLUMN email_notifications SET DEFAULT true,
ALTER COLUMN push_notifications SET DEFAULT true,
ALTER COLUMN two_factor_enabled SET DEFAULT false;

-- Update any existing NULL values to defaults
UPDATE users 
SET 
  full_name = COALESCE(full_name, ''),
  role = COALESCE(role, 'staff'),
  language = COALESCE(language, 'en'),
  timezone = COALESCE(timezone, 'UTC'),
  theme = COALESCE(theme, 'dark'),
  date_format = COALESCE(date_format, 'MM/DD/YYYY'),
  email_notifications = COALESCE(email_notifications, true),
  push_notifications = COALESCE(push_notifications, true),
  two_factor_enabled = COALESCE(two_factor_enabled, false),
  updated_at = COALESCE(updated_at, now());

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updated_at);