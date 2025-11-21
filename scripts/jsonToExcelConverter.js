#!/usr/bin/env node

/**
 * JSON to Excel Converter for Recipe Files
 * 
 * This script converts all recipe JSON files to Excel format
 * without modifying the original JSON files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recipe files to convert
const RECIPE_FILES = [
  { json: 'src/recipes/Asia.json', excel: 'src/recipes/excel/Asia.xlsx' },
  { json: 'src/recipes/Europe.json', excel: 'src/recipes/excel/Europe.xlsx' },
  { json: 'src/recipes/Africa.json', excel: 'src/recipes/excel/Africa.xlsx' },
  { json: 'src/recipes/MiddleEast.json', excel: 'src/recipes/excel/MiddleEast.xlsx' },
  { json: 'src/recipes/SouthAmerica.json', excel: 'src/recipes/excel/SouthAmerica.xlsx' },
  { json: 'src/recipes/NorthAmerica.json', excel: 'src/recipes/excel/NorthAmerica.xlsx' },
  { json: 'src/recipes/LatinAmerica.json', excel: 'src/recipes/excel/LatinAmerica.xlsx' }
];

/**
 * Flatten recipe object for Excel export
 */
function flattenRecipe(recipe) {
  return {
    'ID': recipe.id || '',
    'Dish Name (EN)': recipe.dish_name?.en || '',
    'Dish Name (ZH)': recipe.dish_name?.zh || '',
    'Dish Name (SV)': recipe.dish_name?.sv || '',
    'Description (EN)': recipe.description?.en || '',
    'Description (ZH)': recipe.description?.zh || '',
    'Description (SV)': recipe.description?.sv || '',
    'Region (EN)': recipe.region?.en || '',
    'Region (ZH)': recipe.region?.zh || '',
    'Region (SV)': recipe.region?.sv || '',
    'Subcategory (EN)': recipe.subcategory?.en || '',
    'Subcategory (ZH)': recipe.subcategory?.zh || '',
    'Subcategory (SV)': recipe.subcategory?.sv || '',
    'Main Type (EN)': recipe.main_type?.en || '',
    'Main Type (ZH)': recipe.main_type?.zh || '',
    'Main Type (SV)': recipe.main_type?.sv || '',
    'Difficulty (EN)': recipe.difficulty?.en || '',
    'Difficulty (ZH)': recipe.difficulty?.zh || '',
    'Difficulty (SV)': recipe.difficulty?.sv || '',
    'Servings': recipe.servings || '',
    'Total Time (min)': recipe.total_time_min || '',
    'Ingredients (EN)': Array.isArray(recipe.ingredients?.en) ? recipe.ingredients.en.join('; ') : '',
    'Ingredients (ZH)': Array.isArray(recipe.ingredients?.zh) ? recipe.ingredients.zh.join('; ') : '',
    'Ingredients (SV)': Array.isArray(recipe.ingredients?.sv) ? recipe.ingredients.sv.join('; ') : '',
    'Steps (EN)': Array.isArray(recipe.steps?.en) ? recipe.steps.en.join(' | ') : '',
    'Steps (ZH)': Array.isArray(recipe.steps?.zh) ? recipe.steps.zh.join(' | ') : '',
    'Steps (SV)': Array.isArray(recipe.steps?.sv) ? recipe.steps.sv.join(' | ') : '',
    'Cooking Method (EN)': recipe.cooking_method?.en || '',
    'Cooking Method (ZH)': recipe.cooking_method?.zh || '',
    'Cooking Method (SV)': recipe.cooking_method?.sv || '',
    'Tags': Array.isArray(recipe.tags) ? recipe.tags.join(', ') : '',
    'Image URL': recipe.image_url || '',
    'Created Date': recipe.created_date || '',
    'Updated Date': recipe.updated_date || ''
  };
}

/**
 * Convert a single JSON file to Excel
 */
function convertJsonToExcel(jsonPath, excelPath) {
  try {
    console.log(`📁 Converting: ${jsonPath}`);
    
    // Read JSON file
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const recipes = JSON.parse(jsonData);
    
    // Flatten all recipes
    const flattenedRecipes = recipes.map(flattenRecipe);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(flattenedRecipes);
    
    // Set column widths
    const columnWidths = [
      { wch: 15 }, // ID
      { wch: 25 }, // Dish Name (EN)
      { wch: 25 }, // Dish Name (ZH)
      { wch: 25 }, // Dish Name (SV)
      { wch: 50 }, // Description (EN)
      { wch: 50 }, // Description (ZH)
      { wch: 50 }, // Description (SV)
      { wch: 15 }, // Region (EN)
      { wch: 15 }, // Region (ZH)
      { wch: 15 }, // Region (SV)
      { wch: 20 }, // Subcategory (EN)
      { wch: 20 }, // Subcategory (ZH)
      { wch: 20 }, // Subcategory (SV)
      { wch: 15 }, // Main Type (EN)
      { wch: 15 }, // Main Type (ZH)
      { wch: 15 }, // Main Type (SV)
      { wch: 15 }, // Difficulty (EN)
      { wch: 15 }, // Difficulty (ZH)
      { wch: 15 }, // Difficulty (SV)
      { wch: 10 }, // Servings
      { wch: 15 }, // Total Time
      { wch: 100 }, // Ingredients (EN)
      { wch: 100 }, // Ingredients (ZH)
      { wch: 100 }, // Ingredients (SV)
      { wch: 200 }, // Steps (EN)
      { wch: 200 }, // Steps (ZH)
      { wch: 200 }, // Steps (SV)
      { wch: 20 }, // Cooking Method (EN)
      { wch: 20 }, // Cooking Method (ZH)
      { wch: 20 }, // Cooking Method (SV)
      { wch: 30 }, // Tags
      { wch: 30 }, // Image URL
      { wch: 15 }, // Created Date
      { wch: 15 }  // Updated Date
    ];
    
    worksheet['!cols'] = columnWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recipes');
    
    // Create directory if it doesn't exist
    const excelDir = path.dirname(excelPath);
    if (!fs.existsSync(excelDir)) {
      fs.mkdirSync(excelDir, { recursive: true });
    }
    
    // Write Excel file
    XLSX.writeFile(workbook, excelPath);
    
    console.log(`   ✅ Created: ${excelPath} (${recipes.length} recipes)`);
    return { success: true, count: recipes.length };
    
  } catch (error) {
    console.error(`   ❌ Error converting ${jsonPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Convert all recipe files to Excel
 */
function convertAllRecipes() {
  console.log('🔄 Converting Recipe JSON Files to Excel');
  console.log('========================================\n');
  
  let totalRecipes = 0;
  let successCount = 0;
  let errorCount = 0;
  
  RECIPE_FILES.forEach(({ json, excel }) => {
    const result = convertJsonToExcel(json, excel);
    
    if (result.success) {
      totalRecipes += result.count;
      successCount++;
    } else {
      errorCount++;
    }
  });
  
  console.log(`\n📊 Conversion Summary:`);
  console.log(`- Files processed: ${RECIPE_FILES.length}`);
  console.log(`- Successful conversions: ${successCount}`);
  console.log(`- Failed conversions: ${errorCount}`);
  console.log(`- Total recipes converted: ${totalRecipes}`);
  
  if (successCount > 0) {
    console.log(`\n📁 Excel files created in: src/recipes/excel/`);
    console.log(`- Asia.xlsx`);
    console.log(`- Europe.xlsx`);
    console.log(`- Africa.xlsx`);
    console.log(`- MiddleEast.xlsx`);
    console.log(`- SouthAmerica.xlsx`);
    console.log(`- NorthAmerica.xlsx`);
    console.log(`- LatinAmerica.xlsx`);
  }
  
  return { totalRecipes, successCount, errorCount };
}

/**
 * Create a master Excel file with all recipes
 */
function createMasterExcel() {
  console.log('\n📋 Creating Master Excel File');
  console.log('============================\n');
  
  try {
    const allRecipes = [];
    
    // Collect all recipes from all files
    RECIPE_FILES.forEach(({ json }) => {
      try {
        const jsonData = fs.readFileSync(json, 'utf8');
        const recipes = JSON.parse(jsonData);
        allRecipes.push(...recipes);
        console.log(`📁 Loaded ${recipes.length} recipes from ${json}`);
      } catch (error) {
        console.error(`❌ Error loading ${json}:`, error.message);
      }
    });
    
    // Flatten all recipes
    const flattenedRecipes = allRecipes.map(flattenRecipe);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create main worksheet
    const worksheet = XLSX.utils.json_to_sheet(flattenedRecipes);
    worksheet['!cols'] = [
      { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 25 },
      { wch: 50 }, { wch: 50 }, { wch: 50 },
      { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 20 }, { wch: 20 }, { wch: 20 },
      { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 10 }, { wch: 15 },
      { wch: 100 }, { wch: 100 }, { wch: 100 },
      { wch: 200 }, { wch: 200 }, { wch: 200 },
      { wch: 20 }, { wch: 20 }, { wch: 20 },
      { wch: 30 }, { wch: 30 }, { wch: 15 }, { wch: 15 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Recipes');
    
    // Create summary worksheet
    const summaryData = [
      { 'Cuisine': 'Asia', 'Count': allRecipes.filter(r => r.region?.en === 'Asia').length },
      { 'Cuisine': 'Europe', 'Count': allRecipes.filter(r => r.region?.en === 'Europe').length },
      { 'Cuisine': 'Africa', 'Count': allRecipes.filter(r => r.region?.en === 'Africa').length },
      { 'Cuisine': 'Middle East', 'Count': allRecipes.filter(r => r.region?.en === 'Middle East').length },
      { 'Cuisine': 'South America', 'Count': allRecipes.filter(r => r.region?.en === 'South America').length },
      { 'Cuisine': 'North America', 'Count': allRecipes.filter(r => r.region?.en === 'North America').length },
      { 'Cuisine': 'Latin America', 'Count': allRecipes.filter(r => r.region?.en === 'Latin America').length }
    ];
    
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
    
    // Write master file
    const masterPath = 'src/recipes/excel/All_Recipes_Master.xlsx';
    XLSX.writeFile(workbook, masterPath);
    
    console.log(`✅ Master Excel file created: ${masterPath}`);
    console.log(`📊 Total recipes: ${allRecipes.length}`);
    
    return { success: true, totalRecipes: allRecipes.length };
    
  } catch (error) {
    console.error('❌ Error creating master Excel file:', error.message);
    return { success: false, error: error.message };
  }
}

// Main execution
function main() {
  const command = process.argv[2] || 'convert';
  
  switch (command) {
    case 'convert':
      convertAllRecipes();
      break;
    case 'master':
      createMasterExcel();
      break;
    case 'all':
      convertAllRecipes();
      createMasterExcel();
      break;
    case 'help':
      console.log('Usage: node jsonToExcelConverter.js [command]');
      console.log('Commands:');
      console.log('  convert - Convert all JSON files to Excel (default)');
      console.log('  master  - Create master Excel file with all recipes');
      console.log('  all     - Convert all files and create master file');
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
  convertJsonToExcel,
  convertAllRecipes,
  createMasterExcel
};
