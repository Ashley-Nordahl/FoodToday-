-- ----------------------------------------
-- FoodToday Database Schema
-- ----------------------------------------
-- This SQL creates all necessary tables and functions for the FoodToday app
-- Run this in your Supabase SQL Editor after creating your project

-- ----------------------------------------
-- 1. User Statistics Table
-- ----------------------------------------
-- Tracks how many times users select each dish/drink/sauce
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id integer NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('dish', 'drink', 'sauce', 'party')),
  item_name text NOT NULL,
  item_emoji text DEFAULT '',
  count integer DEFAULT 1 CHECK (count >= 0),
  last_used timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_item_type ON user_stats(item_type);
CREATE INDEX IF NOT EXISTS idx_user_stats_count ON user_stats(count DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_last_used ON user_stats(last_used DESC);

-- ----------------------------------------
-- 2. User Favorites Table
-- ----------------------------------------
-- Stores items that users mark as favorites (separate from usage tracking)
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id integer NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('dish', 'drink', 'sauce', 'party')),
  item_name text NOT NULL,
  item_emoji text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_item_type ON user_favorites(item_type);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at DESC);

-- ----------------------------------------
-- 3. Row Level Security (RLS)
-- ----------------------------------------
-- Ensures users can only access their own data

-- Enable RLS on both tables
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own stats
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own stats
CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own stats
CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own stats
CREATE POLICY "Users can delete own stats" ON user_stats
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own favorites
CREATE POLICY "Users can insert own favorites" ON user_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorites
CREATE POLICY "Users can delete own favorites" ON user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------
-- 4. Helper Functions
-- ----------------------------------------

-- Function: Increment user stat counter
-- This function either inserts a new stat or increments the count if it exists
CREATE OR REPLACE FUNCTION increment_user_stat(
  p_user_id uuid,
  p_item_id integer,
  p_item_type text,
  p_item_name text,
  p_item_emoji text DEFAULT ''
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_stats (user_id, item_id, item_type, item_name, item_emoji, count, last_used)
  VALUES (p_user_id, p_item_id, p_item_type, p_item_name, p_item_emoji, 1, now())
  ON CONFLICT (user_id, item_id, item_type)
  DO UPDATE SET
    count = user_stats.count + 1,
    last_used = now(),
    updated_at = now();
END;
$$;

-- ----------------------------------------
-- 5. Triggers
-- ----------------------------------------

-- Trigger: Update updated_at timestamp on user_stats changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------
-- 6. Initial Data Check (Optional)
-- ----------------------------------------
-- You can add some test data here if needed for development

-- Example: Check if tables are created successfully
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_stats') THEN
    RAISE NOTICE '✅ user_stats table created successfully';
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_favorites') THEN
    RAISE NOTICE '✅ user_favorites table created successfully';
  END IF;
  
  RAISE NOTICE '✅ Database schema setup complete!';
END $$;

-- ----------------------------------------
-- 7. User Preferences Table
-- ----------------------------------------
-- Stores user-specific preferences like language
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  language text DEFAULT 'en' CHECK (language IN ('en', 'zh', 'sv')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own preferences
CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own preferences
CREATE POLICY "Users can delete own preferences" ON user_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: Update updated_at timestamp on user_preferences changes
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Update or insert user language preference
CREATE OR REPLACE FUNCTION upsert_user_language(
  p_user_id uuid,
  p_language text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_preferences (user_id, language)
  VALUES (p_user_id, p_language)
  ON CONFLICT (user_id)
  DO UPDATE SET
    language = p_language,
    updated_at = now();
END;
$$;

-- ----------------------------------------
-- Setup Complete!
-- ----------------------------------------
-- Your database is now ready for use.
-- 
-- Tables created:
-- ✅ user_stats - Tracks recipe selection counts
-- ✅ user_favorites - Stores user favorites
-- ✅ user_preferences - Stores user preferences (language, etc.)
-- 
-- Features enabled:
-- ✅ Row Level Security (automatic data isolation)
-- ✅ Automatic timestamp updates
-- ✅ Helper functions for incrementing stats and updating preferences
-- ✅ Indexes for performance
-- 
-- Next steps:
-- 1. Run this schema in your Supabase SQL Editor
-- 2. Set up OAuth providers in Supabase (optional)
--    - Go to Authentication > Providers
--    - Enable Google, GitHub, etc.
-- 3. Configure email templates (optional)
--    - Go to Authentication > Email Templates
-- 4. Start your app and test!
-- ----------------------------------------

