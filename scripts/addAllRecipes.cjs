const fs = require('fs');

// Read existing recipes
const enRecipes = JSON.parse(fs.readFileSync('src/locales/en/recipes.json', 'utf8'));

console.log('📝 Adding Indian recipes to English file...');

// Add all 20 Indian recipes from the generator
const { indianRecipes } = require('./fullRecipeGenerator.cjs');

enRecipes.cultural.Indian = indianRecipes;

// Write back
fs.writeFileSync('src/locales/en/recipes.json', JSON.stringify(enRecipes, null, 2));

console.log(`✅ Added ${indianRecipes.length} Indian recipes to English`);
console.log('');
console.log('📊 Updated counts:');
Object.entries(enRecipes.cultural).forEach(([cuisine, recipes]) => {
  console.log(`   ${cuisine}: ${recipes.length} recipes`);
});

