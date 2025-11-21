#!/usr/bin/env node

/**
 * CSV Translation Manager
 * 
 * This script reads the CSV translation file and provides utilities to:
 * 1. Parse translations from CSV
 * 2. Update recipe JSON files with translations
 * 3. Generate reports on missing translations
 * 4. Validate translation completeness
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DISHES_CSV_PATH = path.join(__dirname, '../src/Dishes Translation.csv');
const INGREDIENTS_CSV_PATH = path.join(__dirname, '../src/Ingredients Translation Common.csv');
const RECIPE_FILES = [
  'src/recipes/Asia.json',
  'src/recipes/Europe.json',
  'src/recipes/Africa.json',
  'src/recipes/MiddleEast.json',
  'src/recipes/SouthAmerica.json',
  'src/recipes/NorthAmerica.json',
  'src/recipes/LatinAmerica.json'
];

/**
 * Parse dishes CSV file
 * @returns {Object} Parsed dish translations
 */
export function parseDishesCSV() {
  try {
    const csvContent = fs.readFileSync(DISHES_CSV_PATH, 'utf8');
    const lines = csvContent.split('\n');
    
    // Skip header row
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    const dishes = {};
    
    dataLines.forEach(line => {
      const columns = line.split(',');
      if (columns.length < 4) return;
      
      const [
        englishSingular, chineseSingular, swedishSingular, category, notes
      ] = columns.map(col => col.trim().replace(/"/g, ''));
      
      // Skip empty rows
      if (!englishSingular) return;
      
      dishes[englishSingular] = {
        en: englishSingular,
        zh: chineseSingular,
        sv: swedishSingular,
        category: category || 'Dish',
        notes: notes || ''
      };
    });
    
    return dishes;
  } catch (error) {
    console.error('Error parsing dishes CSV:', error.message);
    return {};
  }
}

/**
 * Parse ingredients CSV file
 * @returns {Object} Parsed ingredient translations
 */
export function parseIngredientsCSV() {
  try {
    const csvContent = fs.readFileSync(INGREDIENTS_CSV_PATH, 'utf8');
    const lines = csvContent.split('\n');
    
    // Skip header row
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    const ingredients = {};
    const measurements = {};
    
    dataLines.forEach(line => {
      const columns = line.split(',');
      if (columns.length < 8) return;
      
      const [
        englishSingular, englishPlural,
        chineseSingular, chinesePlural,
        swedishSingular, swedishPlural,
        category, notes
      ] = columns.map(col => col.trim().replace(/"/g, ''));
      
      // Skip empty rows
      if (!englishSingular) return;
      
      const translation = {
        en: englishSingular,
        zh: chineseSingular,
        sv: swedishSingular,
        category: category || 'Other',
        notes: notes || ''
      };
      
      // Organize by category
      if (category.toLowerCase() === 'quantifier') {
        measurements[englishSingular] = translation;
      } else {
        ingredients[englishSingular] = translation;
      }
    });
    
    return { ingredients, measurements };
  } catch (error) {
    console.error('Error parsing ingredients CSV:', error.message);
    return { ingredients: {}, measurements: {} };
  }
}

/**
 * Parse both CSV files and extract translations
 * @returns {Object} Parsed translations organized by category
 */
export function parseCSVTranslations() {
  const dishes = parseDishesCSV();
  const { ingredients, measurements } = parseIngredientsCSV();
  
  return {
    dishes,
    ingredients,
    measurements,
    other: {}
  };
}

/**
 * Get all recipes that need translation fixes
 * @returns {Array} Array of recipes with translation issues
 */
export function getRecipesNeedingTranslation() {
  const recipesNeedingFix = [];
  
  RECIPE_FILES.forEach(filePath => {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const recipes = JSON.parse(data);
      
      recipes.forEach(recipe => {
        const issues = [];
        
        // Check dish name translations
        if (recipe.dish_name) {
          if (recipe.dish_name.zh && /^[A-Za-z\s\-'&]+$/.test(recipe.dish_name.zh)) {
            issues.push({
              field: 'dish_name.zh',
              current: recipe.dish_name.zh,
              english: recipe.dish_name.en
            });
          }
        }
        
        // Check description translations
        if (recipe.description && recipe.description.zh) {
          const hasEnglishInChinese = /[A-Za-z]{3,}/.test(recipe.description.zh);
          if (hasEnglishInChinese) {
            issues.push({
              field: 'description.zh',
              current: recipe.description.zh,
              english: recipe.description.en
            });
          }
        }
        
        // Check ingredient translations
        if (recipe.ingredients && recipe.ingredients.zh) {
          const hasEnglishIngredients = recipe.ingredients.zh.some(ingredient => 
            /[A-Za-z]{3,}/.test(ingredient)
          );
          if (hasEnglishIngredients) {
            issues.push({
              field: 'ingredients.zh',
              current: recipe.ingredients.zh,
              english: recipe.ingredients.en
            });
          }
        }
        
        // Check instruction translations
        if (recipe.steps && recipe.steps.zh) {
          const hasEnglishInstructions = recipe.steps.zh.some(step => 
            /[A-Za-z]{3,}/.test(step)
          );
          if (hasEnglishInstructions) {
            issues.push({
              field: 'steps.zh',
              current: recipe.steps.zh,
              english: recipe.steps.en
            });
          }
        }
        
        if (issues.length > 0) {
          recipesNeedingFix.push({
            id: recipe.id,
            name: recipe.dish_name?.en || 'Unknown',
            issues: issues,
            file: filePath
          });
        }
      });
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  });
  
  return recipesNeedingFix;
}

/**
 * Generate a comprehensive translation report
 */
export function generateTranslationReport() {
  console.log('📊 Translation Report Generator');
  console.log('==============================\n');
  
  // Parse CSV translations
  const translations = parseCSVTranslations();
  if (!translations) {
    console.log('❌ Could not parse CSV file');
    return;
  }
  
  console.log('📋 Available Translations:');
  console.log(`- Dishes: ${Object.keys(translations.dishes).length}`);
  console.log(`- Ingredients: ${Object.keys(translations.ingredients).length}`);
  console.log(`- Measurements: ${Object.keys(translations.measurements).length}`);
  console.log(`- Other: ${Object.keys(translations.other).length}`);
  
  // Get recipes needing translation
  const recipesNeedingFix = getRecipesNeedingTranslation();
  
  console.log(`\n🔍 Recipes Needing Translation: ${recipesNeedingFix.length}`);
  
  if (recipesNeedingFix.length > 0) {
    console.log('\n📝 Top 10 Recipes with Issues:');
    recipesNeedingFix.slice(0, 10).forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.name} (${recipe.id})`);
      recipe.issues.forEach(issue => {
        console.log(`   - ${issue.field}: "${issue.current}"`);
      });
    });
    
    if (recipesNeedingFix.length > 10) {
      console.log(`   ... and ${recipesNeedingFix.length - 10} more`);
    }
  }
  
  // Analyze what translations are needed
  const neededTranslations = new Set();
  recipesNeedingFix.forEach(recipe => {
    recipe.issues.forEach(issue => {
      if (issue.field === 'dish_name.zh' && issue.english) {
        neededTranslations.add(issue.english);
      }
    });
  });
  
  console.log(`\n🎯 Dish Names Needing Translation: ${neededTranslations.size}`);
  Array.from(neededTranslations).slice(0, 10).forEach(name => {
    console.log(`- ${name}`);
  });
  
  return {
    translations,
    recipesNeedingFix,
    neededTranslations: Array.from(neededTranslations)
  };
}

/**
 * Update a single recipe with translations from CSV
 * @param {Object} recipe - The recipe object
 * @param {Object} translations - Parsed translations from CSV
 * @returns {Object} Updated recipe
 */
export function updateRecipeWithTranslations(recipe, translations) {
  const updatedRecipe = { ...recipe };
  
  // Update dish name if it has English in Chinese field
  if (updatedRecipe.dish_name && updatedRecipe.dish_name.zh) {
    const englishName = updatedRecipe.dish_name.en;
    if (translations.dishes[englishName]) {
      updatedRecipe.dish_name.zh = translations.dishes[englishName].zh;
    }
  }
  
  // Update description if it has English in Chinese field
  if (updatedRecipe.description && updatedRecipe.description.zh) {
    let chineseDesc = updatedRecipe.description.zh;
    
    // Replace English dish names in description
    Object.entries(translations.dishes).forEach(([englishName, translation]) => {
      const pattern = new RegExp(`\\b${englishName}\\b`, 'gi');
      chineseDesc = chineseDesc.replace(pattern, translation.zh);
    });
    
    updatedRecipe.description.zh = chineseDesc;
  }
  
  // Update ingredients if they have English in Chinese field
  if (updatedRecipe.ingredients && updatedRecipe.ingredients.zh) {
    updatedRecipe.ingredients.zh = updatedRecipe.ingredients.zh.map(ingredient => {
      let chineseIngredient = ingredient;
      
      // Replace English ingredients
      Object.entries(translations.ingredients).forEach(([englishName, translation]) => {
        const pattern = new RegExp(`\\b${englishName}\\b`, 'gi');
        chineseIngredient = chineseIngredient.replace(pattern, translation.zh);
      });
      
      // Replace measurements
      Object.entries(translations.measurements).forEach(([englishUnit, translation]) => {
        const pattern = new RegExp(`\\b${englishUnit}\\b`, 'gi');
        chineseIngredient = chineseIngredient.replace(pattern, translation.zh);
      });
      
      return chineseIngredient;
    });
  }
  
  // Update instructions if they have English in Chinese field
  if (updatedRecipe.steps && updatedRecipe.steps.zh) {
    updatedRecipe.steps.zh = updatedRecipe.steps.zh.map(instruction => {
      let chineseInstruction = instruction;
      
      // Replace English ingredients
      Object.entries(translations.ingredients).forEach(([englishName, translation]) => {
        const pattern = new RegExp(`\\b${englishName}\\b`, 'gi');
        chineseInstruction = chineseInstruction.replace(pattern, translation.zh);
      });
      
      // Replace measurements
      Object.entries(translations.measurements).forEach(([englishUnit, translation]) => {
        const pattern = new RegExp(`\\b${englishUnit}\\b`, 'gi');
        chineseInstruction = chineseInstruction.replace(pattern, translation.zh);
      });
      
      return chineseInstruction;
    });
  }
  
  return updatedRecipe;
}

/**
 * Update all recipe files with translations from CSV
 */
export function updateAllRecipesWithTranslations() {
  console.log('🔄 Updating All Recipes with CSV Translations');
  console.log('==============================================\n');
  
  const translations = parseCSVTranslations();
  if (!translations) {
    console.log('❌ Could not parse CSV file');
    return;
  }
  
  let totalUpdated = 0;
  let totalRecipes = 0;
  
  RECIPE_FILES.forEach(filePath => {
    console.log(`📁 Processing: ${filePath}`);
    
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const recipes = JSON.parse(data);
      
      let fileUpdated = 0;
      
      recipes.forEach(recipe => {
        const originalRecipe = JSON.stringify(recipe);
        const updatedRecipe = updateRecipeWithTranslations(recipe, translations);
        const updatedRecipeStr = JSON.stringify(updatedRecipe);
        
        if (originalRecipe !== updatedRecipeStr) {
          fileUpdated++;
          // Update the recipe in the array
          const index = recipes.indexOf(recipe);
          recipes[index] = updatedRecipe;
        }
      });
      
      if (fileUpdated > 0) {
        // Write updated recipes back to file
        fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2));
        console.log(`   ✅ Updated ${fileUpdated} recipes`);
      } else {
        console.log(`   ℹ️  No updates needed`);
      }
      
      totalUpdated += fileUpdated;
      totalRecipes += recipes.length;
      
    } catch (error) {
      console.error(`   ❌ Error processing ${filePath}:`, error.message);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`- Total recipes processed: ${totalRecipes}`);
  console.log(`- Recipes updated: ${totalUpdated}`);
  console.log(`- Files processed: ${RECIPE_FILES.length}`);
}

// Main execution
function main() {
  const command = process.argv[2] || 'report';
  
  switch (command) {
    case 'report':
      generateTranslationReport();
      break;
    case 'update':
      updateAllRecipesWithTranslations();
      break;
    case 'help':
      console.log('Usage: node csvTranslationManager.js [command]');
      console.log('Commands:');
      console.log('  report - Generate translation report');
      console.log('  update - Update all recipes with CSV translations');
      console.log('  help   - Show this help message');
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
  parseCSVTranslations,
  getRecipesNeedingTranslation,
  generateTranslationReport,
  updateRecipeWithTranslations,
  updateAllRecipesWithTranslations
};
