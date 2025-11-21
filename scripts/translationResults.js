#!/usr/bin/env node

/**
 * Translation Results Analyzer
 * 
 * This script analyzes the results of applying CSV translations to recipes
 * and shows the improvements made.
 */

import { parseCSVTranslations, getRecipesNeedingTranslation } from './csvTranslationManager.js';

/**
 * Analyze translation improvements
 */
function analyzeTranslationResults() {
  console.log('📈 Translation Results Analysis');
  console.log('================================\n');
  
  // Parse current translations
  const translations = parseCSVTranslations();
  
  console.log('📋 Available Translations:');
  console.log(`- Dishes: ${Object.keys(translations.dishes).length}`);
  console.log(`- Ingredients: ${Object.keys(translations.ingredients).length}`);
  console.log(`- Measurements: ${Object.keys(translations.measurements).length}`);
  
  console.log('\n🍽️ Available Dish Translations:');
  Object.keys(translations.dishes).forEach(dish => {
    console.log(`- ${dish} → ${translations.dishes[dish].zh}`);
  });
  
  console.log('\n🥬 Available Ingredient Translations:');
  Object.keys(translations.ingredients).forEach(ingredient => {
    console.log(`- ${ingredient} → ${translations.ingredients[ingredient].zh}`);
  });
  
  console.log('\n📏 Available Measurement Translations:');
  Object.keys(translations.measurements).forEach(measurement => {
    console.log(`- ${measurement} → ${translations.measurements[measurement].zh}`);
  });
  
  // Get current issues
  const recipesNeedingFix = getRecipesNeedingTranslation();
  
  console.log(`\n🔍 Current Status:`);
  console.log(`- Recipes with issues: ${recipesNeedingFix.length}`);
  
  // Analyze improvements
  let dishesWithEnglishNames = 0;
  let ingredientsWithEnglish = 0;
  let instructionsWithEnglish = 0;
  
  recipesNeedingFix.forEach(recipe => {
    recipe.issues.forEach(issue => {
      if (issue.field === 'dish_name.zh') {
        dishesWithEnglishNames++;
      }
      if (issue.field === 'ingredients.zh') {
        ingredientsWithEnglish++;
      }
      if (issue.field === 'steps.zh') {
        instructionsWithEnglish++;
      }
    });
  });
  
  console.log(`- Dishes with English names: ${dishesWithEnglishNames}`);
  console.log(`- Ingredients with English: ${ingredientsWithEnglish}`);
  console.log(`- Instructions with English: ${instructionsWithEnglish}`);
  
  // Show examples of improvements
  console.log('\n✅ Examples of Improvements:');
  console.log('Before: "300 g beef, 1 pc onion, 2 cloves garlic"');
  console.log('After:  "300 g 牛肉, 1 个 洋葱, 2 cloves 大蒜"');
  console.log('');
  console.log('Before: "准备食材: 300 g beef, 1 pc onion"');
  console.log('After:  "准备食材: 300 g 牛肉, 1 个 洋葱"');
  
  // Show what still needs translation
  const missingDishNames = new Set();
  recipesNeedingFix.forEach(recipe => {
    recipe.issues.forEach(issue => {
      if (issue.field === 'dish_name.zh' && issue.english) {
        missingDishNames.add(issue.english);
      }
    });
  });
  
  console.log(`\n🎯 Still Need Translation (${missingDishNames.size} dish names):`);
  Array.from(missingDishNames).slice(0, 10).forEach(name => {
    console.log(`- ${name}`);
  });
  
  if (missingDishNames.size > 10) {
    console.log(`... and ${missingDishNames.size - 10} more`);
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. Add more dish names to "Dishes Translation.csv"');
  console.log('2. Add more ingredients to "Ingredients Translation Common.csv"');
  console.log('3. Run: node scripts/csvTranslationManager.js update');
  console.log('4. Check results: node scripts/csvTranslationManager.js report');
  
  return {
    totalTranslations: Object.keys(translations.dishes).length + 
                      Object.keys(translations.ingredients).length + 
                      Object.keys(translations.measurements).length,
    recipesWithIssues: recipesNeedingFix.length,
    missingDishNames: Array.from(missingDishNames)
  };
}

// Main execution
function main() {
  analyzeTranslationResults();
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default {
  analyzeTranslationResults
};
