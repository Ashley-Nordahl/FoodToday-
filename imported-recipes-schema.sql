-- Schema for imported recipes
-- Add this to your existing Supabase database

-- Create the user_imported_recipes table
CREATE TABLE user_imported_recipes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  external_id text NOT NULL, -- Unique identifier from source (e.g., "ica_729067")
  name text NOT NULL,
  description text,
  source_website text NOT NULL, -- e.g., "ICA", "AllRecipes", "FoodNetwork"
  source_url text NOT NULL,
  source_author text,
  ingredients text[] NOT NULL, -- Array of ingredient strings
  instructions text[] NOT NULL, -- Array of instruction strings
  prep_time text, -- e.g., "15 min"
  cook_time text, -- e.g., "90 min" 
  total_time text, -- e.g., "105 min"
  servings integer,
  difficulty text, -- e.g., "Easy", "Medium", "Hard"
  cuisine text, -- e.g., "Swedish", "Italian"
  tags text[], -- Array of tags
  nutrition jsonb, -- Store nutrition info as JSON
  emoji text, -- e.g., "🍗"
  type text DEFAULT 'dish', -- 'dish', 'drink', 'sauce'
  is_favorite boolean DEFAULT false,
  times_selected integer DEFAULT 0,
  last_selected timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, external_id, source_website) -- Prevent duplicate imports
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_imported_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_imported_recipes:
-- Users can view their own imported recipes
CREATE POLICY "Users can view their own imported recipes"
ON user_imported_recipes FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own imported recipes
CREATE POLICY "Users can insert their own imported recipes"
ON user_imported_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own imported recipes
CREATE POLICY "Users can update their own imported recipes"
ON user_imported_recipes FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own imported recipes
CREATE POLICY "Users can delete their own imported recipes"
ON user_imported_recipes FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_imported_recipes_user_id ON user_imported_recipes(user_id);
CREATE INDEX idx_user_imported_recipes_type ON user_imported_recipes(type);
CREATE INDEX idx_user_imported_recipes_times_selected ON user_imported_recipes(times_selected DESC);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_imported_recipes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_imported_recipes_updated_at_trigger
  BEFORE UPDATE ON user_imported_recipes
  FOR EACH ROW EXECUTE FUNCTION update_imported_recipes_updated_at();
