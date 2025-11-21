# Fix increment_user_stat Function Issue

## Problem
The Supabase RPC function `public.increment_user_stat` is not found in the schema cache, causing errors when trying to track user statistics.

Error message:
```
Supabase RPC function not available, skipping tracking: Could not find the function public.increment_user_stat(p_item_emoji, p_item_id, p_item_type, p_user_id) in the schema cache
```

## Solution

### Option 1: Run the Quick Fix SQL (Recommended)

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `fix-increment-user-stat.sql`
4. Click "Run" or press Cmd+Enter (Mac) / Ctrl+Enter (Windows)

This will:
- Drop the old function if it exists
- Recreate it with the proper `public` schema prefix
- Grant execute permissions to `authenticated` and `anon` roles
- Verify the function was created successfully

### Option 2: Run the Complete Schema Update

If the quick fix doesn't work, you can run the updated `supabase-schema.sql` file which now includes:
- Proper `public.` schema prefix for all functions
- `GRANT EXECUTE` permissions for authenticated users

### Option 3: Manual Database Refresh

Sometimes Supabase needs to refresh its schema cache:

1. Go to Database > Functions in your Supabase Dashboard
2. Look for `increment_user_stat` in the list
3. If it doesn't exist, run the SQL from `fix-increment-user-stat.sql`
4. If it exists but still causing issues, try clicking "Refresh" or wait a few minutes

## Verification

After running the fix, you should see:
- No more console errors about the missing function
- User statistics being tracked properly
- The function appears in your Supabase Dashboard under Database > Functions

## Testing

1. Log into your app
2. Select a recipe, drink, or sauce
3. Check the browser console - the error should be gone
4. Go to MyFavorite page and verify statistics are being tracked

## Notes

- The function uses `SECURITY DEFINER` which runs with the privileges of the function owner (postgres user)
- The function is idempotent - calling it multiple times for the same item will increment the count
- The function gracefully handles ON CONFLICT to update existing records
