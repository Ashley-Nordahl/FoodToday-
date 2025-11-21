#!/usr/bin/env node

/**
 * Translation Helper Script
 * 
 * This script helps you identify what translations to add to your CSV file
 * by analyzing the current recipe data and suggesting missing translations.
 */

import { parseCSVTranslations, getRecipesNeedingTranslation } from './csvTranslationManager.js';

/**
 * Generate a detailed report of what translations are needed
 */
function generateDetailedReport() {
  console.log('🔍 Detailed Translation Analysis');
  console.log('================================\n');
  
  // Parse current CSV translations
  const translations = parseCSVTranslations();
  if (!translations) {
    console.log('❌ Could not parse CSV file');
    return;
  }
  
  console.log('📋 Current CSV Translations:');
  console.log(`- Dishes: ${Object.keys(translations.dishes).length}`);
  console.log(`- Ingredients: ${Object.keys(translations.ingredients).length}`);
  console.log(`- Measurements: ${Object.keys(translations.measurements).length}`);
  
  // Show current translations
  console.log('\n📝 Current Translations:');
  console.log('Dishes:', Object.keys(translations.dishes));
  console.log('Ingredients:', Object.keys(translations.ingredients));
  console.log('Measurements:', Object.keys(translations.measurements));
  
  // Get recipes needing translation
  const recipesNeedingFix = getRecipesNeedingTranslation();
  
  // Analyze what's missing
  const missingDishNames = new Set();
  const missingIngredients = new Set();
  const missingMeasurements = new Set();
  
  recipesNeedingFix.forEach(recipe => {
    recipe.issues.forEach(issue => {
      if (issue.field === 'dish_name.zh' && issue.english) {
        missingDishNames.add(issue.english);
      }
      
      if (issue.field === 'ingredients.zh' && Array.isArray(issue.current)) {
        issue.current.forEach(ingredient => {
          // Extract English words from ingredient strings
          const words = ingredient.match(/[A-Za-z]{3,}/g);
          if (words) {
            words.forEach(word => {
              if (!translations.ingredients[word.toLowerCase()]) {
                missingIngredients.add(word.toLowerCase());
              }
            });
          }
        });
      }
      
      if (issue.field === 'steps.zh' && Array.isArray(issue.current)) {
        issue.current.forEach(step => {
          // Extract English words from instruction strings
          const words = step.match(/[A-Za-z]{3,}/g);
          if (words) {
            words.forEach(word => {
              if (!translations.ingredients[word.toLowerCase()] && 
                  !translations.measurements[word.toLowerCase()]) {
                missingIngredients.add(word.toLowerCase());
              }
            });
          }
        });
      }
    });
  });
  
  console.log(`\n🎯 Missing Translations Needed:`);
  console.log(`- Dish Names: ${missingDishNames.size}`);
  console.log(`- Ingredients: ${missingIngredients.size}`);
  
  // Show top missing dish names
  console.log('\n🍽️ Top Missing Dish Names:');
  Array.from(missingDishNames).slice(0, 20).forEach(name => {
    console.log(`- ${name}`);
  });
  
  // Show top missing ingredients
  console.log('\n🥬 Top Missing Ingredients:');
  Array.from(missingIngredients).slice(0, 20).forEach(ingredient => {
    console.log(`- ${ingredient}`);
  });
  
  // Generate CSV suggestions
  console.log('\n📝 Suggested CSV Additions:');
  console.log('Add these rows to your CSV file:');
  console.log('');
  
  // Dish names
  Array.from(missingDishNames).slice(0, 10).forEach(name => {
    console.log(`${name},,,[Chinese translation],,[Swedish translation],,Dish,`);
  });
  
  console.log('');
  
  // Ingredients
  Array.from(missingIngredients).slice(0, 10).forEach(ingredient => {
    console.log(`${ingredient},,,[Chinese translation],,[Swedish translation],,Ingredient,`);
  });
  
  return {
    missingDishNames: Array.from(missingDishNames),
    missingIngredients: Array.from(missingIngredients),
    totalRecipesNeedingFix: recipesNeedingFix.length
  };
}

/**
 * Show how to use the CSV system
 */
function showUsageGuide() {
  console.log('📖 CSV Translation System Usage Guide');
  console.log('=====================================\n');
  
  console.log('1. 📝 Add translations to your CSV file:');
  console.log('   - Open "Recipes Translation Common.csv"');
  console.log('   - Add new rows with English, Chinese, Swedish translations');
  console.log('   - Use the suggested additions from the report above');
  console.log('');
  
  console.log('2. 🔄 Update recipes with your translations:');
  console.log('   node scripts/csvTranslationManager.js update');
  console.log('');
  
  console.log('3. 📊 Check the results:');
  console.log('   node scripts/csvTranslationManager.js report');
  console.log('');
  
  console.log('4. 🧪 Test the updated translations:');
  console.log('   - Run your app and check if Chinese names display correctly');
  console.log('   - Look for any remaining English text in Chinese interface');
  console.log('');
  
  console.log('💡 Tips:');
  console.log('- Start with the most common dish names and ingredients');
  console.log('- Use consistent translation style across all entries');
  console.log('- Test a few recipes first before updating all');
  console.log('- Keep your CSV file organized by category');
}

// Main execution
function main() {
  const command = process.argv[2] || 'help';
  
  switch (command) {
    case 'analyze':
      generateDetailedReport();
      break;
    case 'guide':
      showUsageGuide();
      break;
    case 'help':
      console.log('Usage: node translationHelper.js [command]');
      console.log('Commands:');
      console.log('  analyze - Generate detailed analysis of missing translations');
      console.log('  guide   - Show usage guide for the CSV system');
      console.log('  help    - Show this help message');
      break;
    default:
      console.log('Unknown command. Use "help" for available commands.');
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default {
  generateDetailedReport,
  showUsageGuide
};
