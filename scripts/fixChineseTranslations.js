#!/usr/bin/env node

/**
 * Fix Chinese Translations Script
 * 
 * This script identifies recipes with English names in Chinese translation fields
 * and provides proper Chinese translations or fallback strategies.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recipe files to process
const recipeFiles = [
  'src/recipes/Asia.json',
  'src/recipes/Europe.json', 
  'src/recipes/Africa.json',
  'src/recipes/MiddleEast.json',
  'src/recipes/SouthAmerica.json',
  'src/recipes/NorthAmerica.json',
  'src/recipes/LatinAmerica.json'
];

// Common dish name translations
const dishTranslations = {
  // Asian dishes
  'Kung Pao Chicken': '宫保鸡丁',
  'Mapo Tofu': '麻婆豆腐',
  'Pad Thai': '泰式炒河粉',
  'Bibimbap': '韩式拌饭',
  'Sushi': '寿司',
  'Ramen': '拉面',
  'Pho': '越南河粉',
  'Dumplings': '饺子',
  'Spring Rolls': '春卷',
  'Fried Rice': '炒饭',
  
  // European dishes
  'Ratatouille': '普罗旺斯炖菜',
  'Bouillabaisse': '马赛鱼汤',
  'Cassoulet': '卡苏莱',
  'Rillettes': '里耶特肉酱',
  'Brandade': '布兰达德',
  'Moussaka': '慕萨卡',
  'Souvlaki': '希腊烤肉串',
  'Spanakopita': '菠菜派',
  'Tzatziki': '希腊酸奶酱',
  'Pastitsio': '希腊千层面',
  'Kleftiko': '希腊烤羊肉',
  'Fava': '希腊蚕豆泥',
  'Revithokeftedes': '鹰嘴豆丸子',
  'Dolmades': '葡萄叶卷',
  'Stifado': '希腊炖肉',
  'Horiatiki': '希腊乡村沙拉',
  'Saganaki': '希腊煎奶酪',
  'Kolokithokeftedes': '西葫芦丸子',
  'Esqueixada': '加泰罗尼亚盐渍鳕鱼',
  
  // Latin American dishes
  'Ajiaco': '阿希亚科汤',
  'Ceviche': '酸橘汁腌鱼',
  'Empanadas': '肉馅饼',
  'Arepas': '玉米饼',
  'Pupusas': '萨尔瓦多饼',
  'Tacos': '墨西哥卷饼',
  'Burritos': '墨西哥卷',
  'Quesadillas': '墨西哥芝士饼',
  'Enchiladas': '墨西哥玉米卷饼',
  'Tamales': '墨西哥玉米粽',
  'Churros': '西班牙油条',
  'Flan': '焦糖布丁',
  'Dulce de Leche': '牛奶焦糖',
  
  // Middle Eastern dishes
  'Hummus': '鹰嘴豆泥',
  'Falafel': '炸豆丸子',
  'Shawarma': '沙威玛',
  'Kebab': '烤肉串',
  'Tabbouleh': '塔布勒沙拉',
  'Baba Ganoush': '茄子泥',
  'Fattoush': '法图什沙拉',
  'Mansaf': '约旦国菜',
  'Knafeh': '卡纳菲',
  'Baklava': '果仁蜜饼',
  
  // African dishes
  'Jollof Rice': '乔洛夫米饭',
  'Injera': '英吉拉饼',
  'Tagine': '塔吉锅',
  'Couscous': '古斯古斯',
  'Biltong': '比尔特干肉',
  'Boerewors': '布尔香肠',
  'Bunny Chow': '兔子面包',
  'Bobotie': '波波蒂',
  'Malva Pudding': '马尔瓦布丁',
  
  // North American dishes
  'BBQ Ribs': '烧烤排骨',
  'Mac and Cheese': '芝士通心粉',
  'Buffalo Wings': '水牛城鸡翅',
  'Clam Chowder': '蛤蜊浓汤',
  'Cornbread': '玉米面包',
  'Gumbo': '秋葵汤',
  'Jambalaya': '什锦饭',
  'Po\' Boys': '穷小子三明治',
  'Beignets': '法式甜甜圈',
  'Key Lime Pie': '青柠派'
};

// Function to detect if a string contains only English/Latin characters
function isEnglishName(name) {
  // Check if the name contains only English letters, spaces, and common punctuation
  return /^[A-Za-z\s\-'&]+$/.test(name);
}

// Function to get Chinese translation for a dish name
function getChineseTranslation(dishName) {
  // First check our translation dictionary
  if (dishTranslations[dishName]) {
    return dishTranslations[dishName];
  }
  
  // For names not in our dictionary, we could:
  // 1. Return the original name (fallback)
  // 2. Use a translation API (would require API key)
  // 3. Return a generic Chinese name
  return dishName; // For now, return original as fallback
}

// Function to process a single recipe file
function processRecipeFile(filePath) {
  console.log(`\n📁 Processing: ${filePath}`);
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const recipes = JSON.parse(data);
    
    let fixedCount = 0;
    let totalRecipes = recipes.length;
    let issuesFound = [];
    
    recipes.forEach((recipe, index) => {
      if (recipe.dish_name && recipe.dish_name.zh) {
        const chineseName = recipe.dish_name.zh;
        const englishName = recipe.dish_name.en;
        
        // Check if Chinese field contains English name
        if (isEnglishName(chineseName)) {
          issuesFound.push({
            id: recipe.id,
            englishName: englishName,
            currentChinese: chineseName,
            suggestedChinese: getChineseTranslation(englishName)
          });
        }
      }
    });
    
    console.log(`   📊 Found ${issuesFound.length} recipes with English names in Chinese field`);
    console.log(`   📊 Total recipes: ${totalRecipes}`);
    
    if (issuesFound.length > 0) {
      console.log(`\n   🔍 Issues found:`);
      issuesFound.slice(0, 10).forEach(issue => {
        console.log(`   - ${issue.id}: "${issue.englishName}" → "${issue.currentChinese}" (should be: "${issue.suggestedChinese}")`);
      });
      
      if (issuesFound.length > 10) {
        console.log(`   ... and ${issuesFound.length - 10} more`);
      }
    }
    
    return {
      filePath,
      totalRecipes,
      issuesFound,
      fixedCount
    };
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return null;
  }
}

// Main execution
function main() {
  console.log('🔧 Chinese Translation Fix Script');
  console.log('================================\n');
  
  const results = [];
  
  // Process all recipe files
  recipeFiles.forEach(filePath => {
    const result = processRecipeFile(filePath);
    if (result) {
      results.push(result);
    }
  });
  
  // Summary
  console.log('\n📋 SUMMARY');
  console.log('==========');
  
  let totalIssues = 0;
  let totalRecipes = 0;
  
  results.forEach(result => {
    totalIssues += result.issuesFound.length;
    totalRecipes += result.totalRecipes;
    console.log(`${result.filePath}: ${result.issuesFound.length} issues out of ${result.totalRecipes} recipes`);
  });
  
  console.log(`\n🎯 Total: ${totalIssues} recipes need Chinese translations out of ${totalRecipes} total recipes`);
  
  if (totalIssues > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Update recipe data with proper Chinese translations');
    console.log('2. Implement fallback strategy in display logic');
    console.log('3. Consider using translation API for missing translations');
    console.log('\n📝 Next steps:');
    console.log('- Run the fix script to update translations');
    console.log('- Test the updated translations');
    console.log('- Implement fallback strategy for remaining issues');
  } else {
    console.log('\n✅ All recipes have proper Chinese translations!');
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  processRecipeFile,
  getChineseTranslation,
  isEnglishName,
  dishTranslations
};
