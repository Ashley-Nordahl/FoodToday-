-- Fix increment_user_stat function
-- Run this in your Supabase SQL Editor

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.increment_user_stat(uuid, integer, text, text, text);

-- Recreate the function with proper schema prefix
CREATE OR REPLACE FUNCTION public.increment_user_stat(
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_user_stat(uuid, integer, text, text, text) TO authenticated;

-- Also grant to anon role if needed
GRANT EXECUTE ON FUNCTION public.increment_user_stat(uuid, integer, text, text, text) TO anon;

-- Verify the function exists
SELECT proname, pronargs, proargtypes, prosrc
FROM pg_proc
WHERE proname = 'increment_user_stat';
