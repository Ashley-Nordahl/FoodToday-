# 🚀 Quick Deployment Reference

## Essential Information

### Your GitHub Repository
```
https://github.com/Ashley-Nordahl/FoodToday-.git
```

### Build Configuration (Already Set Up)
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 16+

---

## Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

## SQL Scripts to Run (In Order)

### 1️⃣ Main Schema (supabase-schema.sql)
Creates: `user_stats`, `user_favorites`, `user_preferences` tables

Location: `/Users/ashleynordahl/Documents/FoodToday/supabase-schema.sql`

### 2️⃣ Recipe Tables (imported-recipes-schema.sql)
Creates: `user_imported_recipes` table

Location: `/Users/ashleynordahl/Documents/FoodToday/imported-recipes-schema.sql`

### 3️⃣ Fix RLS Policies (fix-rls-policies.sql)
Ensures proper Row Level Security

Location: `/Users/ashleynordahl/Documents/FoodToday/fix-rls-policies.sql`

---

## Supabase URL Configuration

After deployment, add to Supabase → Authentication → URL Configuration:

**Site URL:**
```
https://your-vercel-url.vercel.app
```

**Redirect URLs:**
```
https://your-vercel-url.vercel.app/**
https://*.vercel.app/**
```

---

## Quick Deployment Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Supabase Project**
   - Go to supabase.com/dashboard
   - Click "New Project"
   - Run the 3 SQL scripts

3. **Deploy to Vercel**
   - Go to vercel.com
   - Import GitHub repository
   - Add environment variables
   - Click "Deploy"

4. **Configure Supabase**
   - Add Vercel URL to Supabase authentication settings

5. **Test!**
   - Visit your Vercel URL
   - Sign up / Login
   - Test all features

---

## Useful Commands

```bash
# Build locally
npm run build

# Preview build locally
npm run preview

# Run tests
npm test

# Check git status
git status

# Push changes
git push
```

---

## Important URLs

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/Ashley-Nordahl/FoodToday-.git

---

## Checklist

- [ ] Push latest code to GitHub
- [ ] Create production Supabase project
- [ ] Run SQL schema (3 files)
- [ ] Get Supabase API keys
- [ ] Deploy to Vercel
- [ ] Add environment variables in Vercel
- [ ] Configure Supabase redirect URLs
- [ ] Test production app
- [ ] Verify all features work
- [ ] Check for console errors

---

**⚡ You're ready to deploy!**

