const fs = require('fs');
const path = require('path');

// Main ingredient to emoji mapping
const INGREDIENT_EMOJI_MAP = {
  // Meat proteins
  'beef': '🥩',
  'pork': '🐷', 
  'chicken': '🐔',
  'lamb': '🐑',
  'duck': '🦆',
  'turkey': '🦃',
  
  // Seafood
  'fish': '🐟',
  'salmon': '🐟',
  'tuna': '🐟',
  'shrimp': '🦐',
  'crab': '🦀',
  'lobster': '🦞',
  'scallops': '🦪',
  'oysters': '🦪',
  'clams': '🦪',
  'mussels': '🦪',
  'squid': '🦑',
  'octopus': '🦑',
  
  // Vegetarian proteins
  'tofu': '🧈',
  'tempeh': '🧈',
  'eggs': '🥚',
  
  // Vegetables
  'cabbage': '🥬',
  'spinach': '🥬',
  'kale': '🥬',
  'lettuce': '🥬',
  'broccoli': '🥦',
  'cauliflower': '🥦',
  'carrots': '🥕',
  'bell-pepper': '🫑',
  'bell-peppers': '🫑',
  'tomato': '🍅',
  'tomatoes': '🍅',
  'onion': '🧅',
  'onions': '🧅',
  'garlic': '🧄',
  'ginger': '🫚',
  'mushroom': '🍄',
  'mushrooms': '🍄',
  'potato': '🥔',
  'potatoes': '🥔',
  'sweet-potato': '🍠',
  'corn': '🌽',
  'cucumber': '🥒',
  'eggplant': '🍆',
  'zucchini': '🥒',
  
  // Grains and starches
  'rice': '🍚',
  'noodles': '🍜',
  'pasta': '🍝',
  'bread': '🍞',
  'flour': '🌾',
  'quinoa': '🌾',
  'oats': '🌾',
  
  // Fruits
  'apple': '🍎',
  'banana': '🍌',
  'orange': '🍊',
  'lemon': '🍋',
  'lime': '🍋',
  'strawberry': '🍓',
  'grape': '🍇',
  'peach': '🍑',
  'pear': '🍐',
  
  // Nuts and seeds
  'peanuts': '🥜',
  'almonds': '🥜',
  'walnuts': '🥜',
  'sesame': '🫘',
  
  // Dairy
  'milk': '🥛',
  'cheese': '🧀',
  'butter': '🧈',
  'yogurt': '🥛',
  
  // Special dishes
  'soup': '🍲',
  'stew': '🥘',
  'curry': '🍛',
  'pizza': '🍕',
  'burger': '🍔',
  'sandwich': '🥪',
  'salad': '🥗',
  'sushi': '🍣',
  'dumpling': '🥟',
  'spring-roll': '🌯',
  'taco': '🌮',
  'burrito': '🌯'
};

// Function to detect main ingredient from recipe
function detectMainIngredient(recipe) {
  const ingredients = recipe.ingredients || [];
  const ingredientsWithAmounts = recipe.ingredientsWithAmounts || [];
  
  // Priority order: protein > vegetable > grain > other
  const proteinKeywords = ['beef', 'pork', 'chicken', 'lamb', 'duck', 'turkey', 'fish', 'salmon', 'tuna', 'shrimp', 'crab', 'lobster', 'scallops', 'oysters', 'clams', 'mussels', 'squid', 'octopus', 'tofu', 'tempeh', 'eggs'];
  const vegetableKeywords = ['cabbage', 'spinach', 'kale', 'lettuce', 'broccoli', 'cauliflower', 'carrots', 'bell-pepper', 'bell-peppers', 'tomato', 'tomatoes', 'onion', 'onions', 'garlic', 'ginger', 'mushroom', 'mushrooms', 'potato', 'potatoes', 'sweet-potato', 'corn', 'cucumber', 'eggplant', 'zucchini'];
  const grainKeywords = ['rice', 'noodles', 'pasta', 'bread', 'flour', 'quinoa', 'oats'];
  
  // Check ingredients list first
  for (const ingredient of ingredients) {
    const cleanIngredient = ingredient.replace('ingredient-', '').toLowerCase();
    
    // Check for proteins first
    for (const protein of proteinKeywords) {
      if (cleanIngredient.includes(protein)) {
        return protein;
      }
    }
    
    // Check for vegetables
    for (const vegetable of vegetableKeywords) {
      if (cleanIngredient.includes(vegetable)) {
        return vegetable;
      }
    }
    
    // Check for grains
    for (const grain of grainKeywords) {
      if (cleanIngredient.includes(grain)) {
        return grain;
      }
    }
  }
  
  // Check ingredientsWithAmounts if no match found
  for (const ingredient of ingredientsWithAmounts) {
    const ingredientText = typeof ingredient === 'string' ? ingredient : ingredient.ingredient || '';
    const cleanIngredient = ingredientText.toLowerCase();
    
    // Check for proteins first
    for (const protein of proteinKeywords) {
      if (cleanIngredient.includes(protein)) {
        return protein;
      }
    }
    
    // Check for vegetables
    for (const vegetable of vegetableKeywords) {
      if (cleanIngredient.includes(vegetable)) {
        return vegetable;
      }
    }
    
    // Check for grains
    for (const grain of grainKeywords) {
      if (cleanIngredient.includes(grain)) {
        return grain;
      }
    }
  }
  
  // Check recipe name for special dishes
  const name = recipe.name.toLowerCase();
  if (name.includes('soup')) return 'soup';
  if (name.includes('stew')) return 'stew';
  if (name.includes('curry')) return 'curry';
  if (name.includes('pizza')) return 'pizza';
  if (name.includes('burger')) return 'burger';
  if (name.includes('sandwich')) return 'sandwich';
  if (name.includes('salad')) return 'salad';
  if (name.includes('sushi')) return 'sushi';
  if (name.includes('dumpling')) return 'dumpling';
  if (name.includes('spring roll')) return 'spring-roll';
  if (name.includes('taco')) return 'taco';
  if (name.includes('burrito')) return 'burrito';
  
  // Default fallback
  return 'unknown';
}

// Function to get emoji for main ingredient
function getEmojiForIngredient(ingredient) {
  return INGREDIENT_EMOJI_MAP[ingredient] || '🍽️'; // Default to plate emoji
}

// Function to process recipes file
function processRecipesFile(filePath) {
  console.log(`\n📁 Processing: ${filePath}`);
  
  const recipes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changesCount = 0;
  
  Object.entries(recipes.cultural || {}).forEach(([cuisine, cuisineRecipes]) => {
    if (Array.isArray(cuisineRecipes)) {
      cuisineRecipes.forEach(recipe => {
        const mainIngredient = detectMainIngredient(recipe);
        const newEmoji = getEmojiForIngredient(mainIngredient);
        
        if (recipe.emoji !== newEmoji) {
          console.log(`   ${recipe.name}: ${recipe.emoji} → ${newEmoji} (${mainIngredient})`);
          recipe.emoji = newEmoji;
          changesCount++;
        }
      });
    }
  });
  
  if (changesCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2));
    console.log(`   ✅ Updated ${changesCount} recipes`);
  } else {
    console.log(`   ℹ️  No changes needed`);
  }
  
  return changesCount;
}

// Main execution
console.log('🔧 FIXING RECIPE EMOJIS BASED ON MAIN INGREDIENTS');
console.log('═'.repeat(60));

const languageDirs = ['en', 'zh', 'sv'];
let totalChanges = 0;

languageDirs.forEach(lang => {
  const filePath = path.join('src', 'locales', lang, 'recipes.json');
  if (fs.existsSync(filePath)) {
    const changes = processRecipesFile(filePath);
    totalChanges += changes;
  } else {
    console.log(`\n❌ File not found: ${filePath}`);
  }
});

console.log('\n' + '═'.repeat(60));
console.log(`🎉 COMPLETED! Total changes: ${totalChanges}`);
console.log('📋 All recipe emojis now represent their main ingredients!');
