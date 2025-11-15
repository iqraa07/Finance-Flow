/*
  # Fix user constraints and improve error handling

  1. Changes
    - Add ON DELETE CASCADE to user references
    - Ensure proper user profile creation
    - Add indexes for better performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Ensure proper user profile handling
ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_user_id_fkey,
ADD CONSTRAINT transactions_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Add default categories if not exists
INSERT INTO categories (name, type, icon)
SELECT * FROM (
  VALUES 
    ('Salary', 'income'::transaction_type, 'wallet'),
    ('Investments', 'income'::transaction_type, 'trending-up'),
    ('Freelance', 'income'::transaction_type, 'briefcase'),
    ('Housing', 'expense'::transaction_type, 'home'),
    ('Transportation', 'expense'::transaction_type, 'car'),
    ('Food', 'expense'::transaction_type, 'utensils'),
    ('Healthcare', 'expense'::transaction_type, 'activity-heart'),
    ('Entertainment', 'expense'::transaction_type, 'tv'),
    ('Shopping', 'expense'::transaction_type, 'shopping-bag'),
    ('Other', 'expense'::transaction_type, 'more-horizontal')
) AS new_categories(name, type, icon)
WHERE NOT EXISTS (
  SELECT 1 FROM categories c 
  WHERE c.name = new_categories.name
);