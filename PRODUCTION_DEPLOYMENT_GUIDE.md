# 🚀 Production Deployment Guide for FoodToday

This guide will walk you through deploying your FoodToday app to production using Vercel and Supabase.

## ✅ Pre-Deployment Checklist

- [x] App builds successfully (`npm run build` ✓)
- [x] Vercel configuration created (`vercel.json` ✓)
- [x] Git repository connected to GitHub ✓
- [ ] Push latest changes to GitHub
- [ ] Create production Supabase project
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Test production deployment

---

## Step 1: Push to GitHub 📤

Your changes are committed but need to be pushed. Run this command:

```bash
git push origin main
```

If you get an authentication error, you may need to:
- Set up a GitHub Personal Access Token, or
- Use GitHub CLI (`gh auth login`), or
- Configure SSH keys

---

## Step 2: Create Production Supabase Project 🗄️

### 2.1 Create New Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `foodtoday-production` (or your preferred name)
   - **Database Password**: Create a strong password (save this securely!)
   - **Region**: Choose closest to your target users (e.g., `us-east-1`, `eu-west-1`)
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning ⏳

### 2.2 Set Up Database Schema

Once your project is ready:

1. In the Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**

#### Run Schema Files (in this order):

**First: Main Schema**
- Copy the entire contents of `supabase-schema.sql`
- Paste into SQL Editor
- Click **"Run"** or press `Ctrl+Enter` (Mac: `Cmd+Enter`)
- You should see success messages with ✅ checkmarks

**Second: Recipe Tables**
- Click **"New query"** again
- Copy the entire contents of `imported-recipes-schema.sql`
- Paste and click **"Run"**

**Third: Fix RLS Policies**
- Click **"New query"** again
- Copy the entire contents of `fix-rls-policies.sql`
- Paste and click **"Run"**

#### Verify Tables Created

1. Go to **Database** → **Tables** (left sidebar)
2. You should see:
   - `user_stats`
   - `user_favorites`
   - `user_preferences`
   - `user_imported_recipes`

### 2.3 Get API Keys 🔑

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API** in the settings menu
3. Copy these values (you'll need them for Vercel):
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOi...` (long string)

**⚠️ Keep these secure! Don't commit them to git.**

---

## Step 3: Deploy to Vercel 🌐

### 3.1 Sign Up / Login to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 3.2 Import Your Project

1. On the Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your **FoodToday-** repository in the list
3. Click **"Import"**

### 3.3 Configure Project

Vercel should auto-detect your settings:
- **Framework Preset**: Vite (should be auto-detected)
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### 3.4 Set Environment Variables 🔐

**This is the most important step!**

Before deploying, click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL from Step 2.3 |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key from Step 2.3 |

Make sure to paste the full values without extra spaces.

### 3.5 Deploy! 🚀

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll see a success screen with confetti 🎉
4. Your app will be live at: `https://foodtoday-xxxxx.vercel.app`

---

## Step 4: Post-Deployment Configuration ⚙️

### 4.1 Configure Supabase Authentication URLs

Your app needs to redirect users back after authentication.

1. Go back to your **Supabase dashboard**
2. Go to **Authentication** → **URL Configuration**
3. Set these values:

**Site URL:**
```
https://your-vercel-app-url.vercel.app
```

**Redirect URLs** (add these patterns):
```
https://your-vercel-app-url.vercel.app/**
https://*.vercel.app/**
```

Replace `your-vercel-app-url` with your actual Vercel URL.

### 4.2 Enable OAuth Providers (Optional)

If you want Google/GitHub login:

1. In Supabase, go to **Authentication** → **Providers**
2. Enable **Google** and/or **GitHub**
3. For production, you'll need to:
   - Create OAuth apps in Google Cloud Console / GitHub
   - Add your OAuth credentials
   - (For now, Supabase's default credentials will work for testing)

---

## Step 5: Test Your Production App ✅

Visit your Vercel URL and test:

1. **Sign Up / Login**
   - Create a new account
   - Verify you receive the confirmation email
   - Login successfully

2. **DishToday Page**
   - Spin the cuisine wheel
   - Select a recipe
   - Check the shopping list

3. **Drinks Page**
   - Browse drink categories
   - Try "Lucky Pick"
   - View a drink recipe

4. **Sauces Page**
   - Filter sauces by category
   - Adjust taste preferences
   - Select a sauce

5. **MyFavorite Page**
   - Add items to favorites
   - Check statistics
   - Verify rankings update

6. **Language Switching**
   - Switch between English, Chinese, Swedish
   - Verify translations work correctly

7. **Check Browser Console**
   - Open DevTools (F12)
   - Look for any errors in Console
   - Verify no missing environment variables

---

## Step 6: Automatic Deployments 🔄

Vercel is now connected to your GitHub repository!

**From now on:**
- Every push to `main` branch → Automatic production deployment
- Every pull request → Preview deployment with unique URL
- No manual work needed!

---

## Optional: Custom Domain 🌍

Want a custom domain like `foodtoday.com`?

1. Buy a domain from any registrar (Namecheap, Google Domains, etc.)
2. In Vercel, go to your project → **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain
5. Follow DNS configuration instructions
6. Update Supabase redirect URLs to include your custom domain

---

## Troubleshooting 🔧

### "Environment variables are missing"
- Check Vercel dashboard → Settings → Environment Variables
- Make sure they start with `VITE_`
- Redeploy after adding variables

### "Cannot connect to database"
- Verify Supabase URL and key are correct
- Check Supabase project is running (not paused)
- Check RLS policies are set up correctly

### "Authentication not working"
- Verify redirect URLs in Supabase
- Check Site URL is set correctly
- Make sure email confirmation is enabled

### "App shows old version"
- Hard refresh: `Ctrl+Shift+R` (Mac: `Cmd+Shift+R`)
- Clear browser cache
- Check Vercel deployment logs

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

---

## Success Criteria ✨

Your deployment is successful when:

- ✅ App loads without errors
- ✅ Users can sign up and login
- ✅ Recipes display correctly
- ✅ Language switching works
- ✅ Data persists in Supabase
- ✅ Favorites and stats track properly
- ✅ No console errors

---

## What's Next? 🎯

Your app is now in production! Here are some next steps:

1. **Monitor Usage**
   - Check Vercel Analytics
   - Monitor Supabase database size
   - Track user growth

2. **Set Up Monitoring**
   - Add error tracking (Sentry, LogRocket)
   - Set up uptime monitoring
   - Configure alerts

3. **Performance**
   - Enable Vercel Analytics
   - Optimize images
   - Consider CDN for assets

4. **Features**
   - Collect user feedback
   - Plan new features
   - Iterate and improve

---

## Need Help? 💬

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Your README**: See `README.md` for app-specific details

---

**🎉 Congratulations! Your FoodToday app is now live in production!**

