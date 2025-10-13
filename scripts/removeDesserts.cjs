const fs = require('fs');
const path = require('path');

// Comprehensive list of dessert keywords
const dessertKeywords = [
  'pie', 'cake', 'cookie', 'biscuit', 'pudding', 'ice cream', 'sorbet', 'gelato',
  'tiramisu', 'cheesecake', 'brownie', 'muffin', 'cupcake', 'donut', 'doughnut',
  'churros', 'baklava', 'cannoli', 'panna cotta', 'crème brûlée', 'flan',
  'tarte', 'tart', 'galette', 'croissant', 'baguette', 'bread', 'loaf',
  'pancake', 'waffle', 'crepe', 'soufflé', 'mousse', 'parfait', 'trifle',
  'gulab jamun', 'kulfi', 'rasgulla', 'jalebi', 'ladoo', 'barfi',
  'mochi', 'taiyaki', 'dorayaki', 'daifuku', 'yokan', 'wagashi',
  'bingsu', 'patbingsu', 'hotteok', 'hoddeok', 'songpyeon',
  'churros', 'flan', 'tres leches', 'arroz con leche', 'dulce de leche',
  'key lime pie', 'banana bread', 'apple pie', 'pumpkin pie', 'pecan pie',
  'naan bread', 'cornbread', 'chicken and waffles' // These are borderline but removing for consistency
];

// Function to check if a recipe is a dessert
function isDessert(recipe) {
  const name = recipe.name.toLowerCase();
  return dessertKeywords.some(keyword => name.includes(keyword));
}

// Function to process recipes file and remove desserts
function removeDessertsFromFile(filePath) {
  console.log(`\n📁 Processing: ${filePath}`);
  
  const recipes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let removedCount = 0;
  let totalCount = 0;
  
  Object.entries(recipes.cultural || {}).forEach(([cuisine, cuisineRecipes]) => {
    if (Array.isArray(cuisineRecipes)) {
      totalCount += cuisineRecipes.length;
      
      // Filter out desserts
      const originalLength = cuisineRecipes.length;
      recipes.cultural[cuisine] = cuisineRecipes.filter(recipe => {
        if (isDessert(recipe)) {
          console.log(`   ❌ Removing: ${cuisine} - ${recipe.name}`);
          removedCount++;
          return false;
        }
        return true;
      });
      
      console.log(`   ${cuisine}: ${originalLength} → ${recipes.cultural[cuisine].length} recipes`);
    }
  });
  
  if (removedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2));
    console.log(`   ✅ Removed ${removedCount} dessert recipes`);
  } else {
    console.log(`   ℹ️  No desserts found to remove`);
  }
  
  return { removed: removedCount, total: totalCount };
}

// Main execution
console.log('🍰 REMOVING DESSERT RECIPES');
console.log('═'.repeat(60));
console.log('Focus: Keep only main dishes, appetizers, and sides');

const languageDirs = ['en', 'zh', 'sv'];
let totalRemoved = 0;
let totalRecipes = 0;

languageDirs.forEach(lang => {
  const filePath = path.join('src', 'locales', lang, 'recipes.json');
  if (fs.existsSync(filePath)) {
    const result = removeDessertsFromFile(filePath);
    totalRemoved += result.removed;
    totalRecipes += result.total;
  } else {
    console.log(`\n❌ File not found: ${filePath}`);
  }
});

console.log('\n' + '═'.repeat(60));
console.log(`🎉 COMPLETED!`);
console.log(`📊 Total recipes before: ${totalRecipes}`);
console.log(`🍰 Desserts removed: ${totalRemoved}`);
console.log(`📋 Main dishes remaining: ${totalRecipes - totalRemoved}`);
console.log('');
console.log('✅ Recipe collection now focuses on savory cooking only!');
