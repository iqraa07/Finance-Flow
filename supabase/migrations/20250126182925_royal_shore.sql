/*
  # Add category to transactions table

  1. Changes
    - Add category column to transactions table
    - Add category_id column for future category management
    - Update RLS policies

  2. Security
    - Maintain existing RLS policies
*/

-- Add category column to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add category_id for future category management
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);

-- Update RLS policies to include new columns
CREATE POLICY "Users can insert transactions with categories" ON transactions
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update transaction categories" ON transactions
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);