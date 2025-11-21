#!/usr/bin/env node

/**
 * Organize Recipe JSON Files
 * 
 * This script reorganizes all recipe JSON files to ensure:
 * - Ingredients are properly split into arrays (not single strings with newlines)
 * - Steps are properly split into arrays (not single strings with newlines)
 * 
 * Usage:
 *   node scripts/organizeRecipes.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPE_FILES = [
  'src/recipes/Africa.json',
  'src/recipes/Asia.json',
  'src/recipes/Europe.json',
  'src/recipes/LatinAmerica.json',
  'src/recipes/MiddleEast.json',
  'src/recipes/NorthAmerica.json',
  'src/recipes/SouthAmerica.json'
];

/**
 * Split a string into an array, handling multiple delimiters
 */
function splitIntoArray(value) {
  if (!value) return [];
  
  // If already an array, return as-is
  if (Array.isArray(value)) {
    return value;
  }
  
  // Convert to string and normalize line endings
  let str = `${value}`.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Try different delimiters in order of preference
  let parts = [];
  
  // First try pipe (|) - common for steps
  if (str.includes('|')) {
    parts = str.split('|').map(s => s.trim()).filter(Boolean);
    if (parts.length > 1) return parts;
  }
  
  // Then try semicolon (;) - common for ingredients/steps
  // Handle both ";" and "；" (Chinese semicolon)
  if (str.includes(';') || str.includes('；')) {
    // Split by both English and Chinese semicolons
    parts = str.split(/[;；]/).map(s => s.trim()).filter(Boolean);
    if (parts.length > 1) return parts;
  }
  
  // Try newlines
  parts = str.split('\n').map(s => s.trim()).filter(Boolean);
  if (parts.length > 1) return parts;
  
  // If we only have one item, check if it's a long string that should be split
  if (parts.length === 1) {
    const longString = parts[0];
    
    // Check for semicolons (English or Chinese) - split even if no space after
    if (longString.includes(';') || longString.includes('；')) {
      parts = longString.split(/[;；]\s*/).map(s => s.trim()).filter(Boolean);
      if (parts.length > 1) return parts;
    }
    
    // Check for multiple items that might be separated by spaces and numbers
    // Pattern: "item1 2 item2 3 item3" - split by number patterns
    if (longString.length > 50 && /\d+/.test(longString)) {
      // Try splitting by common patterns like "数字 + 单位" followed by text
      // This is more aggressive and might split too much, so we'll be careful
      const numberPattern = /(\d+(?:\.\d+)?\s*[^\s]+(?:\s+[^\d]+)?)/g;
      const matches = longString.match(numberPattern);
      if (matches && matches.length > 2) {
        // Likely multiple ingredients, but be conservative
        // Only split if we have clear separators
        return [longString]; // Keep as-is for now, let the display handle it
      }
    }
  }
  
  return parts;
}

/**
 * Organize a single recipe
 */
function organizeRecipe(recipe) {
  const organized = { ...recipe };
  
  // Organize ingredients
  if (organized.ingredients) {
    const organizedIngredients = {};
    for (const [lang, ingredients] of Object.entries(organized.ingredients)) {
      if (Array.isArray(ingredients)) {
        // If it's an array with single string elements, split them
        organizedIngredients[lang] = ingredients.flatMap(ing => splitIntoArray(ing));
      } else {
        organizedIngredients[lang] = splitIntoArray(ingredients);
      }
    }
    organized.ingredients = organizedIngredients;
  }
  
  // Organize steps
  if (organized.steps) {
    const organizedSteps = {};
    for (const [lang, steps] of Object.entries(organized.steps)) {
      if (Array.isArray(steps)) {
        // If it's an array with single string elements, split them
        organizedSteps[lang] = steps.flatMap(step => splitIntoArray(step));
      } else {
        organizedSteps[lang] = splitIntoArray(steps);
      }
    }
    organized.steps = organizedSteps;
  }
  
  return organized;
}

/**
 * Process a single recipe file
 */
function processRecipeFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return { processed: 0, errors: 0 };
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const recipes = JSON.parse(content);
    
    if (!Array.isArray(recipes)) {
      console.log(`⚠️  ${filePath}: Not an array, skipping`);
      return { processed: 0, errors: 0 };
    }
    
    let processed = 0;
    let errors = 0;
    
    const organizedRecipes = recipes.map(recipe => {
      try {
        const organized = organizeRecipe(recipe);
        processed++;
        return organized;
      } catch (error) {
        console.error(`❌ Error organizing recipe ${recipe.id}:`, error.message);
        errors++;
        return recipe; // Return original if organization fails
      }
    });
    
    // Write back to file
    const jsonContent = `${JSON.stringify(organizedRecipes, null, 2)}\n`;
    fs.writeFileSync(fullPath, jsonContent, 'utf8');
    
    console.log(`✅ ${filePath}: ${processed} recipes organized, ${errors} errors`);
    return { processed, errors };
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { processed: 0, errors: 1 };
  }
}

/**
 * Main function
 */
function main() {
  console.log('\n📋 Organizing all recipe JSON files...\n');
  
  let totalProcessed = 0;
  let totalErrors = 0;
  
  for (const file of RECIPE_FILES) {
    const result = processRecipeFile(file);
    totalProcessed += result.processed;
    totalErrors += result.errors;
  }
  
  console.log(`\n🎉 Organization complete!`);
  console.log(`   Total recipes processed: ${totalProcessed}`);
  console.log(`   Total errors: ${totalErrors}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default { organizeRecipe, processRecipeFile };

