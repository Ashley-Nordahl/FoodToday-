# 🍽️ FoodToday - Your Personal Food Discovery App

A modern React app for discovering recipes, tracking your favorite dishes, drinks, and sauces, with cloud-based user statistics and rankings.

## ✨ Features

### 🔐 Authentication
- **Email/Password Sign up & Login**
- **Google OAuth** - Quick sign in with Google
- **GitHub OAuth** - Quick sign in with GitHub
- **Password Reset** - Secure password recovery
- **Protected Routes** - Automatic authentication required for main pages

### 🍽️ DishToday
- **Cuisine Wheel** - Spin to select from 15+ international cuisines
- **Random Recipe** - Get a surprise recipe instantly
- **What I Have** - Find recipes based on your ingredients
- **Shopping List** - Generate shopping lists for recipes
- **Auto-Tracking** - Every recipe selection is automatically saved

### 🥤 Drinks
- **4 Categories** - Juice, Smoothie, Coffee & Tea, Cocktails
- **Popular Drinks** - Scrolling carousel of trending drinks
- **Lucky Pick** - Roll the die for a random drink suggestion
- **Full Recipes** - Detailed instructions for each drink

### 🍯 Sauces
- **5 Regional Collections** - Asian, American, European, Mexican, Middle Eastern
- **Smart Filters** - Filter by use case (BBQ, Seafood, Pasta, etc.)
- **Taste Preferences** - Adjust spicy, sweet, salty, sour levels
- **Homemade/Buy** - Toggle between recipes and store-bought options
- **Lucky Pick** - Random sauce suggestions

### ❤️ MyFavorite - NEW!
- **📊 Statistics Dashboard**
  - Total selections tracked
  - Dishes/drinks/sauces tried counter
  - Most used category
- **📈 Rankings**
  - Top items by selection count
  - Medal system (🥇🥈🥉) for top 3
  - Last used dates
  - Filter by type (dish/drink/sauce)
- **❤️ Favorites**
  - Save your favorite items
  - Quick access to favorites
  - Remove items easily
- **📊 Top 5 Lists**
  - Top 5 dishes
  - Top 5 drinks
  - Top 5 sauces

### ☁️ Cloud Storage
- **Automatic Sync** - All data syncs across devices
- **Never Lose Data** - Cloud backup prevents data loss
- **Privacy First** - Row-level security ensures data isolation
- **Migration** - Automatically migrates localStorage data on first login

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn
- Supabase account (free tier works great!)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd FoodToday
npm install
```

### 2. Set Up Supabase

#### Create Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details (name: FoodToday, password, region)
4. Wait ~2 minutes for creation

#### Get API Keys
1. Go to Settings > API
2. Copy:
   - Project URL: `https://xxxxx.supabase.co`
   - anon/public key: `eyJhbGci...`

#### Configure Environment
Create a `.env` file in project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Set Up Database
1. In Supabase dashboard, go to SQL Editor
2. Open `supabase-schema.sql` from your project
3. Copy all contents
4. Paste into SQL Editor
5. Click "Run"
6. Verify success messages ✅

#### Enable OAuth (Optional)
1. Go to Authentication > Providers
2. Enable Google and/or GitHub
3. For production, add your OAuth credentials
4. For development, Supabase's default credentials work

### 3. Run the App
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📚 Detailed Setup Guide

For step-by-step setup instructions with screenshots, see:
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase setup guide

## 🏗️ Project Structure

```
FoodToday/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── FoodWheel.jsx
│   │   ├── InlineFoodWheel.jsx
│   │   ├── IngredientSelector.jsx
│   │   ├── RecipeChoiceCards.jsx
│   │   ├── ShoppingList.jsx
│   │   └── ProtectedRoute.jsx  # Auth guard
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx     # Authentication state
│   ├── lib/               # Utilities & configs
│   │   └── supabase.js         # Supabase client & helpers
│   ├── pages/             # Main app pages
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Signup page
│   │   ├── DishToday.jsx       # Main dish discovery
│   │   ├── Drink.jsx           # Drinks catalog
│   │   ├── Sauce.jsx           # Sauces catalog
│   │   ├── Parties.jsx         # Party planning
│   │   └── MyFavorite.jsx      # Statistics & rankings
│   ├── data/              # Static data
│   │   └── recipes.js          # Recipe database
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── supabase-schema.sql    # Database schema
├── SUPABASE_SETUP.md      # Setup guide
└── package.json           # Dependencies
```

## 🗄️ Database Schema

### Tables

**user_stats**
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- item_id: integer (recipe/drink/sauce ID)
- item_type: text ('dish', 'drink', 'sauce', 'party')
- item_name: text
- item_emoji: text
- count: integer (selection count)
- last_used: timestamp
- created_at: timestamp
- updated_at: timestamp
```

**user_favorites**
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- item_id: integer
- item_type: text
- item_name: text
- item_emoji: text
- created_at: timestamp
```

### Security
- ✅ Row Level Security (RLS) enabled
- ✅ Users can only access their own data
- ✅ Automatic data isolation by user ID
- ✅ Secure by default

### Helper Functions
- `increment_user_stat()` - Automatically increments selection count

## 🔧 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Adding New Features

#### Track New Item Type
1. Update `trackSelection()` in `lib/supabase.js`
2. Add tracking call in your page component:
   ```javascript
   await trackSelection(user.id, item, 'your-type')
   ```
3. Update MyFavorite filters to include new type

#### Add New Auth Provider
1. Enable in Supabase dashboard
2. Add button in Login/Signup pages:
   ```javascript
   const handleNewProvider = async () => {
     await supabase.auth.signInWithOAuth({ 
       provider: 'provider-name' 
     })
   }
   ```

## 📦 Dependencies

### Core
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool & dev server

### Backend
- **Supabase** - Authentication & database
  - `@supabase/supabase-js` - Official JS client

### Key Features
- **Row Level Security** - Automatic data isolation
- **Real-time** - Live data sync (future enhancement)
- **OAuth** - Social login integration
- **TypeScript types** - Auto-generated from schema

## 🎨 UI/UX Features

- **Responsive Design** - Works on mobile, tablet, desktop
- **Modern Aesthetics** - Beautiful gradient backgrounds
- **Smooth Animations** - Transitions and hover effects
- **Loading States** - Spinner during data fetch
- **Error Handling** - User-friendly error messages
- **Empty States** - Helpful messages when no data

## 🔒 Security Best Practices

✅ Environment variables for API keys  
✅ Row Level Security on all tables  
✅ Protected routes require authentication  
✅ No API keys in client code  
✅ Secure password requirements (6+ characters)  
✅ Email verification (Supabase default)  

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

### Environment Variables for Production
Make sure to set these in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📊 Usage Analytics

Track your food journey:
- See how many recipes you've tried
- Find your most-selected dishes
- Discover patterns in your preferences
- Compare dish/drink/sauce preferences

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env` file exists
- Variables must start with `VITE_`
- Restart dev server after creating `.env`

### "User stats not saving"
- Check Supabase schema is installed
- Verify user is logged in
- Check browser console for errors

### "OAuth not working"
- Enable provider in Supabase dashboard
- Check redirect URLs
- Use Supabase defaults for development

### Migration not working
- Check console logs
- Verify user is authenticated
- localStorage data must exist before migration

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 🙏 Acknowledgments

- Supabase for amazing backend services
- React team for the framework
- Vite for lightning-fast dev experience
- All the food lovers who inspired this app

## 📞 Support

Need help? Check:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed setup guide
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)

---

**Built with ❤️ for food lovers everywhere**

Enjoy discovering new recipes and tracking your culinary journey! 🍽️🥤🍯
