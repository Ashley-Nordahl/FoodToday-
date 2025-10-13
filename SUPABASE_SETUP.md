# 🚀 Supabase Setup Guide for FoodToday

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"**
3. Fill in your project details:
   - **Project name**: FoodToday
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"**
5. Wait ~2 minutes for project creation

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** > **API**
2. You'll see two important values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Configure Your App

1. Create a `.env` file in your project root:
   ```bash
   touch .env
   ```

2. Add your Supabase credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Never commit `.env` to git! It's already in `.gitignore`

## Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open the `supabase-schema.sql` file from your project
4. Copy and paste its entire contents into the SQL editor
5. Click **"Run"** to execute
6. You should see success messages: ✅

The schema creates:
- ✅ `user_stats` table - Tracks recipe selections
- ✅ `user_favorites` table - Stores user favorites
- ✅ Row Level Security policies (automatic data isolation)
- ✅ Helper functions for easy data management

## Step 5: Enable OAuth Providers (Optional)

To enable Google/GitHub login:

1. Go to **Authentication** > **Providers**
2. Enable **Google**:
   - Click on Google provider
   - Toggle "Enable Google"
   - Add your OAuth credentials (or use Supabase's for testing)
3. Enable **GitHub**:
   - Click on GitHub provider
   - Toggle "Enable GitHub"
   - Add your OAuth credentials (or use Supabase's for testing)

For production, you'll want to set up your own OAuth apps:
- [Google OAuth Setup](https://console.cloud.google.com/)
- [GitHub OAuth Setup](https://github.com/settings/developers)

## Step 6: Start Your App

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and you should see the login page!

## 🎉 You're Done!

Your app now has:
- ✅ User authentication (email + social login)
- ✅ Cloud storage for favorites and usage stats
- ✅ Data sync across all devices
- ✅ Automatic data migration from localStorage

## 📊 Database Tables

### user_stats
Tracks how many times users select each recipe:
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- item_id: integer (recipe ID)
- item_type: text ('dish', 'drink', 'sauce', 'party')
- item_name: text
- item_emoji: text
- count: integer (number of times selected)
- last_used: timestamp
- created_at: timestamp
- updated_at: timestamp
```

### user_favorites
Stores items users mark as favorites:
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- item_id: integer
- item_type: text
- item_name: text
- item_emoji: text
- created_at: timestamp
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Automatic data isolation**: No way to see other users' data
- **Secure by default**: All queries automatically filtered by user ID

## 📱 Features

Once set up, users can:
1. **Sign up** with email or social login
2. **Track selections** - Every confirmed recipe is saved
3. **View rankings** - See most-selected dishes/drinks/sauces
4. **Save favorites** - Mark items as favorites
5. **Sync everywhere** - Data available on all devices
6. **No data loss** - Cloud backup prevents data loss

## 🛠️ Troubleshooting

### "Missing Supabase environment variables"
- Make sure you created the `.env` file
- Check that variable names start with `VITE_`
- Restart your dev server after creating `.env`

### "User stats not saving"
- Check that you ran the SQL schema
- Verify RLS policies are enabled
- Check browser console for errors

### "OAuth not working"
- Make sure you enabled the provider in Supabase
- Check redirect URLs are correct
- For production, use your own OAuth credentials

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 💡 Tips

1. Use Supabase's built-in OAuth for development (no setup needed)
2. Monitor usage in Dashboard > Usage
3. Check logs in Dashboard > Logs
4. Test RLS policies in SQL Editor
5. Free tier includes 500MB database (plenty for thousands of users!)

---

Need help? Check the [Supabase Discord](https://discord.supabase.com/) or [GitHub Issues](https://github.com/supabase/supabase/issues).

