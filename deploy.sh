#!/bin/bash

# FoodToday Deployment Helper Script
# This script helps verify your deployment readiness

echo "🚀 FoodToday Deployment Readiness Check"
echo "========================================"
echo ""

# Check if build works
echo "✓ Checking if app builds..."
if npm run build > /dev/null 2>&1; then
    echo "  ✅ Build successful!"
else
    echo "  ❌ Build failed. Run 'npm run build' to see errors."
    exit 1
fi

echo ""

# Check git status
echo "✓ Checking git status..."
if git diff-index --quiet HEAD --; then
    echo "  ✅ No uncommitted changes"
else
    echo "  ⚠️  You have uncommitted changes. Commit them before deploying."
fi

echo ""

# Check if ahead of remote
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "  ✅ Local and remote are in sync"
else
    echo "  ⚠️  You have unpushed commits. Run: git push origin main"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Create Supabase Production Project:"
echo "   → Go to: https://supabase.com/dashboard"
echo "   → Click 'New Project'"
echo "   → Run the 3 SQL scripts (see DEPLOYMENT_QUICK_REFERENCE.md)"
echo ""
echo "3. Deploy to Vercel:"
echo "   → Go to: https://vercel.com"
echo "   → Import your GitHub repository"
echo "   → Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)"
echo "   → Click 'Deploy'"
echo ""
echo "4. Configure Supabase Auth:"
echo "   → Add your Vercel URL to Supabase redirect URLs"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - PRODUCTION_DEPLOYMENT_GUIDE.md (complete guide)"
echo "   - DEPLOYMENT_QUICK_REFERENCE.md (quick reference)"
echo ""
echo "🎉 Your app is ready to deploy!"

