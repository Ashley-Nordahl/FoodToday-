-- Fix RLS policies for user_imported_recipes table
-- Run this in your Supabase SQL Editor

-- First, let's check if the policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_imported_recipes';

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own imported recipes" ON user_imported_recipes;
DROP POLICY IF EXISTS "Users can insert their own imported recipes" ON user_imported_recipes;
DROP POLICY IF EXISTS "Users can update their own imported recipes" ON user_imported_recipes;
DROP POLICY IF EXISTS "Users can delete their own imported recipes" ON user_imported_recipes;

-- Recreate the RLS policies
-- Users can view their own imported recipes
CREATE POLICY "Users can view their own imported recipes"
ON user_imported_recipes FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own imported recipes
CREATE POLICY "Users can insert their own imported recipes"
ON user_imported_recipes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own imported recipes
CREATE POLICY "Users can update their own imported recipes"
ON user_imported_recipes FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own imported recipes
CREATE POLICY "Users can delete their own imported recipes"
ON user_imported_recipes FOR DELETE
USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_imported_recipes';
