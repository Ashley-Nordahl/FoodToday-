#!/usr/bin/env node

/**
 * Excel to JSON Converter for Recipe Files
 *
 * Usage:
 *   node scripts/excelToJsonConverter.js Asia
 *
 * Requirements:
 *   - Excel files are in src/recipes/excel/{Region}.xlsx
 *   - JSON files are in src/recipes/{Region}.json
 *   - Workbook columns match the structure produced by jsonToExcelConverter
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGION_FILE_MAP = {
  Asia: {
    excel: 'src/recipes/excel/Asia.xlsx',
    json: 'src/recipes/Asia.json'
  },
  Europe: {
    excel: 'src/recipes/excel/Europe.xlsx',
    json: 'src/recipes/Europe.json'
  },
  Africa: {
    excel: 'src/recipes/excel/Africa.xlsx',
    json: 'src/recipes/Africa.json'
  },
  MiddleEast: {
    excel: 'src/recipes/excel/MiddleEast.xlsx',
    json: 'src/recipes/MiddleEast.json'
  },
  SouthAmerica: {
    excel: 'src/recipes/excel/SouthAmerica.xlsx',
    json: 'src/recipes/SouthAmerica.json'
  },
  NorthAmerica: {
    excel: 'src/recipes/excel/NorthAmerica.xlsx',
    json: 'src/recipes/NorthAmerica.json'
  },
  LatinAmerica: {
    excel: 'src/recipes/excel/LatinAmerica.xlsx',
    json: 'src/recipes/LatinAmerica.json'
  }
};

const TARGET_REGION = process.argv[2] || 'Asia';

if (!REGION_FILE_MAP[TARGET_REGION]) {
  console.error(`❌ Unknown region "${TARGET_REGION}". Available keys: ${Object.keys(REGION_FILE_MAP).join(', ')}`);
  process.exit(1);
}

const { excel: EXCEL_PATH, json: JSON_PATH } = REGION_FILE_MAP[TARGET_REGION];

function parseNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const cleaned = `${value}`.trim();
  if (cleaned === '') return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function splitList(value, delimiter = ',') {
  if (!value) return [];
  
  // Convert to string and normalize line endings
  let str = `${value}`.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // If delimiter is provided, split by it first
  if (delimiter && delimiter !== '\n') {
    str = str.split(delimiter).join('\n');
  }
  
  // Split by newlines and clean up
  return str
    .split('\n')
    .map(entry => entry.trim())
    .filter(Boolean);
}

function parseMultiLang(row, baseKey) {
  return {
    en: row[`${baseKey} (EN)`]?.toString().trim() || '',
    zh: row[`${baseKey} (ZH)`]?.toString().trim() || '',
    sv: row[`${baseKey} (SV)`]?.toString().trim() || ''
  };
}

function parseIngredients(row) {
  // Try multiple delimiters: semicolon, newline, or pipe
  const parseIngredientList = (value) => {
    if (!value) return [];
    let str = `${value}`.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // If it contains semicolons, split by semicolon
    if (str.includes(';')) {
      return splitList(value, ';');
    }
    // If it contains pipes, split by pipe
    if (str.includes('|')) {
      return splitList(value, '|');
    }
    // Otherwise split by newlines
    return splitList(value, '\n');
  };
  
  return {
    en: parseIngredientList(row['Ingredients (EN)']),
    zh: parseIngredientList(row['Ingredients (ZH)']),
    sv: parseIngredientList(row['Ingredients (SV)'])
  };
}

function parseSteps(row) {
  // Try multiple delimiters: pipe, semicolon, or newline
  const parseStepList = (value) => {
    if (!value) return [];
    let str = `${value}`.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // If it contains pipes, split by pipe
    if (str.includes('|')) {
      return splitList(value, '|');
    }
    // If it contains semicolons, split by semicolon
    if (str.includes(';')) {
      return splitList(value, ';');
    }
    // Otherwise split by newlines
    return splitList(value, '\n');
  };
  
  return {
    en: parseStepList(row['Steps (EN)']),
    zh: parseStepList(row['Steps (ZH)']),
    sv: parseStepList(row['Steps (SV)'])
  };
}

/**
 * Parse taste preferences from Excel (comma-separated)
 * @param {object} row - Excel row data
 * @returns {string[]} Array of taste preference values
 */
function parseTastePreferences(row) {
  const tasteColumn = row['Taste Preference'] || 
                     row['Taste Preferences'] || 
                     row['Taste'] || '';
  
  if (!tasteColumn) return [];
  
  // Split by comma and clean up
  return splitList(tasteColumn, ',')
    .map(taste => taste.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Generate local image URL from recipe ID
 * Maps recipe ID prefix to region folder name
 * @param {string} recipeId - Recipe ID (e.g., "AS-CH-001")
 * @returns {string} Image URL path
 */
function generateLocalImageUrl(recipeId) {
  if (!recipeId) return '';
  
  // Map ID prefix to region folder name
  const regionMap = {
    'AS': 'Asia',
    'EU': 'Europe',
    'AF': 'Africa',
    'NA': 'NorthAmerica',
    'SA': 'SouthAmerica',
    'LA': 'LatinAmerica',
    'MI': 'MiddleEast',
    'ME': 'MiddleEast' // Alternative prefix
  };
  
  // Extract prefix (first 2 characters before first dash)
  const prefix = recipeId.split('-')[0];
  const region = regionMap[prefix] || 'Asia'; // Default fallback
  
  // Try common image extensions
  const extensions = ['png', 'jpg', 'jpeg'];
  // For now, we'll use .png as default, but the actual file extension
  // should match what's in the folder. The imageGenerator will handle
  // checking which file exists.
  return `/Recipe Image/${region}/${recipeId}.png`;
}

function convertWorkbookToRecipes(excelPath) {
  if (!fs.existsSync(excelPath)) {
    throw new Error(`Excel file not found: ${excelPath}`);
  }

  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`No worksheets found in ${excelPath}`);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  console.log(`📄 ${excelPath}: ${rows.length} rows loaded`);

  return rows
    .filter(row => row['ID'])
    .map(row => {
      const recipeId = row['ID'].toString().trim();
      const tastePreferences = parseTastePreferences(row);
      
      const recipe = {
        id: recipeId,
        region: parseMultiLang(row, 'Region'),
        subcategory: parseMultiLang(row, 'Subcategory'),
        dish_name: parseMultiLang(row, 'Dish Name'),
        description: parseMultiLang(row, 'Description'),
        total_time_min: parseNumber(row['Total Time (min)']) ?? parseNumber(row['Total Time']) ?? null,
        difficulty: {
          en: row['Difficulty (EN)']?.toString().trim() || '',
          zh: row['Difficulty (ZH)']?.toString().trim() || '',
          sv: row['Difficulty (SV)']?.toString().trim() || ''
        },
        servings: parseNumber(row['Servings']) ?? null,
        main_type: parseMultiLang(row, 'Main Type'),
        ingredients: parseIngredients(row),
        steps: parseSteps(row),
        tags: splitList(row['Tags'], ','),
        cooking_method: parseMultiLang(row, 'Cooking Method')
      };

      // Add tips if present (optional field)
      // Try both "Tip" and "Tips" column names (Excel uses "Tips")
      let tips = parseMultiLang(row, 'Tips');
      // If "Tips" didn't work, try "Tip" (singular)
      if (!tips.en && !tips.zh && !tips.sv) {
        tips = parseMultiLang(row, 'Tip');
      }
      const hasTips = tips.en || tips.zh || tips.sv;
      if (hasTips) {
        recipe.tips = tips;
      }

      // Add taste preferences if present
      if (tastePreferences.length > 0) {
        recipe.taste_preferences = tastePreferences;
      }

      // Set image_url: prefer Excel value, otherwise generate from ID
      const excelImageUrl = row['Image URL']?.toString().trim();
      recipe.image_url = excelImageUrl || generateLocalImageUrl(recipeId);

      if (row['Prep Time (min)'] !== undefined || row['Cook Time (min)'] !== undefined) {
        recipe.prep_time_min = parseNumber(row['Prep Time (min)']) ?? null;
        recipe.cook_time_min = parseNumber(row['Cook Time (min)']) ?? null;
      }

      if (row['Created Date'] || row['Updated Date']) {
        recipe.created_date = row['Created Date']?.toString().trim() || '';
        recipe.updated_date = row['Updated Date']?.toString().trim() || '';
      }

      if (recipe.tags.length === 0 && row['Tags']?.toString().trim()) {
        recipe.tags = splitList(row['Tags'], ';');
      }

      return recipe;
    });
}

function writeRecipesToJson(recipes, jsonPath) {
  const jsonDir = path.dirname(jsonPath);
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }

  const jsonContent = `${JSON.stringify(recipes, null, 2)}\n`;
  fs.writeFileSync(jsonPath, jsonContent, 'utf8');
  console.log(`✅ JSON updated: ${jsonPath} (recipes: ${recipes.length})`);
}

function main() {
  try {
    console.log(`\n⇨ Converting ${TARGET_REGION} Excel → JSON`);
    console.log(`   Excel: ${EXCEL_PATH}`);
    console.log(`   JSON : ${JSON_PATH}\n`);

    const recipes = convertWorkbookToRecipes(path.join(__dirname, '..', EXCEL_PATH));
    writeRecipesToJson(recipes, path.join(__dirname, '..', JSON_PATH));

    console.log('\n🎉 Conversion completed successfully\n');
  } catch (error) {
    console.error(`\n❌ Conversion failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default {
  convertWorkbookToRecipes,
  writeRecipesToJson
};
