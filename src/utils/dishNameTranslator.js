/**
 * Dish Name Translation Utilities
 * 
 * Provides fallback strategies for missing Chinese translations
 * and handles display logic for dish names.
 */

// Common ingredient translations
const ingredientTranslations = {
  // Meats
  'beef': '牛肉',
  'pork': '猪肉',
  'chicken': '鸡肉',
  'lamb': '羊肉',
  'salmon': '三文鱼',
  'fish': '鱼',
  'shrimp': '虾',
  'crab': '蟹',
  
  // Vegetables
  'onion': '洋葱',
  'garlic': '大蒜',
  'ginger': '姜',
  'tomato': '番茄',
  'potato': '土豆',
  'carrot': '胡萝卜',
  'bell pepper': '甜椒',
  'mushroom': '蘑菇',
  'spinach': '菠菜',
  'lettuce': '生菜',
  'cabbage': '卷心菜',
  'broccoli': '西兰花',
  'cauliflower': '花椰菜',
  'eggplant': '茄子',
  'cucumber': '黄瓜',
  'zucchini': '西葫芦',
  
  // Grains & Starches
  'rice': '米饭',
  'pasta': '意大利面',
  'bread': '面包',
  'flour': '面粉',
  'noodles': '面条',
  
  // Dairy
  'milk': '牛奶',
  'cheese': '奶酪',
  'butter': '黄油',
  'yogurt': '酸奶',
  'cream': '奶油',
  
  // Oils & Condiments
  'olive oil': '橄榄油',
  'vegetable oil': '植物油',
  'sesame oil': '芝麻油',
  'soy sauce': '酱油',
  'vinegar': '醋',
  'salt': '盐',
  'pepper': '胡椒',
  'sugar': '糖',
  'honey': '蜂蜜',
  
  // Spices & Herbs
  'basil': '罗勒',
  'oregano': '牛至',
  'thyme': '百里香',
  'rosemary': '迷迭香',
  'cilantro': '香菜',
  'parsley': '欧芹',
  'chili': '辣椒',
  'paprika': '辣椒粉',
  'cumin': '孜然',
  'cinnamon': '肉桂',
  'nutmeg': '肉豆蔻',
  'bay leaf': '月桂叶',
  
  // Other ingredients
  'egg': '鸡蛋',
  'lemon': '柠檬',
  'lime': '青柠',
  'orange': '橙子',
  'apple': '苹果',
  'banana': '香蕉',
  'strawberry': '草莓',
  'blueberry': '蓝莓',
  'almond': '杏仁',
  'walnut': '核桃',
  'peanut': '花生',
  'cashew': '腰果',
  'chickpeas': '鹰嘴豆',
  'lentils': '扁豆',
  'beans': '豆类',
  'tofu': '豆腐',
  'tahini': '芝麻酱'
};

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

/**
 * Check if a string contains only English/Latin characters
 * @param {string} name - The name to check
 * @returns {boolean} - True if the name is in English/Latin
 */
export function isEnglishName(name) {
  if (!name || typeof name !== 'string') return false;
  // Check if the name contains only English letters, spaces, and common punctuation
  return /^[A-Za-z\s\-'&]+$/.test(name);
}

/**
 * Get Chinese translation for a dish name
 * @param {string} dishName - The English dish name
 * @returns {string} - The Chinese translation or original name if not found
 */
export function getChineseTranslation(dishName) {
  if (!dishName || typeof dishName !== 'string') return dishName;
  
  // First check our translation dictionary
  if (dishTranslations[dishName]) {
    return dishTranslations[dishName];
  }
  
  // Return original name as fallback
  return dishName;
}

/**
 * Get the best available dish name for display
 * @param {Object} recipe - The recipe object
 * @param {string} language - The current language ('en', 'zh', 'sv')
 * @returns {string} - The best available dish name
 */
export function getDisplayDishName(recipe, language = 'en') {
  if (!recipe || !recipe.dish_name) {
    return 'Unknown Recipe';
  }

  const dishName = recipe.dish_name;
  const rawLanguage = typeof language === 'string' ? language : 'en';
  const normalizedLanguage = rawLanguage.toLowerCase();
  const baseLanguage = normalizedLanguage.split('-')[0] || normalizedLanguage;
  const languageCandidates = [...new Set([rawLanguage, normalizedLanguage, baseLanguage])];

  if (baseLanguage === 'zh') {
    const chineseName = languageCandidates.map(key => dishName[key]).find(Boolean) || dishName.zh;
    const englishName = dishName.en;

    if (chineseName && !isEnglishName(chineseName)) {
      return chineseName;
    }

    if (englishName) {
      const translatedName = getChineseTranslation(englishName);
      return translatedName;
    }

    return chineseName || englishName || 'Unknown Recipe';
  }

  const localizedName = languageCandidates.map(key => dishName[key]).find(Boolean);
  return localizedName || dishName.en || 'Unknown Recipe';
}

/**
 * Check if a recipe has proper Chinese translation
 * @param {Object} recipe - The recipe object
 * @returns {boolean} - True if recipe has proper Chinese translation
 */
export function hasProperChineseTranslation(recipe) {
  if (!recipe || !recipe.dish_name || !recipe.dish_name.zh) {
    return false;
  }
  
  const chineseName = recipe.dish_name.zh;
  return !isEnglishName(chineseName);
}

/**
 * Get all recipes that need Chinese translation fixes
 * @param {Array} recipes - Array of recipe objects
 * @returns {Array} - Array of recipes that need Chinese translation fixes
 */
export function getRecipesNeedingChineseTranslation(recipes) {
  if (!Array.isArray(recipes)) return [];
  
  return recipes.filter(recipe => {
    if (!recipe.dish_name || !recipe.dish_name.zh) return false;
    
    const chineseName = recipe.dish_name.zh;
    return isEnglishName(chineseName);
  });
}

/**
 * Fix description text by replacing English dish names with Chinese translations
 * @param {string} description - The description text
 * @param {string} language - The current language
 * @returns {string} - The description with translated dish names
 */
export function fixDescriptionText(description, language = 'en') {
  if (!description || typeof description !== 'string' || language !== 'zh') {
    return description;
  }
  
  let fixedDescription = description;
  
  // Replace English dish names with Chinese translations
  Object.entries(dishTranslations).forEach(([englishName, chineseName]) => {
    // Replace the English name at the beginning of the description
    const pattern = new RegExp(`^${englishName}\\s*-`, 'g');
    fixedDescription = fixedDescription.replace(pattern, `${chineseName} -`);
    
    // Also replace standalone English names
    const standalonePattern = new RegExp(`\\b${englishName}\\b`, 'g');
    fixedDescription = fixedDescription.replace(standalonePattern, chineseName);
  });
  
  return fixedDescription;
}

/**
 * Remove dish name from description to avoid duplication with title
 * @param {string} description - The description text
 * @param {string} language - The current language
 * @returns {string} - The description without the dish name
 */
export function removeDishNameFromDescription(description, language = 'en') {
  if (!description || typeof description !== 'string') {
    return description;
  }
  
  // Pattern to match dish name at the beginning followed by " - "
  // This works for English, Chinese, and other languages
  const dishNamePattern = /^[^-\n]+\s*-\s*/;
  return description.replace(dishNamePattern, '');
}

/**
 * Fix instruction text by translating English ingredients to Chinese
 * @param {string} instruction - The instruction text
 * @param {string} language - The current language
 * @returns {string} - The instruction with translated ingredients
 */
export function fixInstructionText(instruction, language = 'en') {
  if (!instruction || typeof instruction !== 'string' || language !== 'zh') {
    return instruction;
  }
  
  let fixedInstruction = instruction;
  
  // Fix common measurement units first (to avoid conflicts)
  const measurementTranslations = {
    'g': '克',
    'kg': '千克',
    'ml': '毫升',
    'l': '升',
    'tbsp': '汤匙',
    'tsp': '茶匙',
    'cup': '杯',
    'pc': '个',
    'cloves': '瓣',
    'slices': '片',
    'pieces': '块'
  };
  
  // Replace English ingredients with Chinese translations
  Object.entries(ingredientTranslations).forEach(([englishName, chineseName]) => {
    // Use regex with word boundaries but handle punctuation properly
    const pattern = new RegExp(`\\b${englishName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    fixedInstruction = fixedInstruction.replace(pattern, chineseName);
  });
  
  // Fix common measurement units
  Object.entries(measurementTranslations).forEach(([englishUnit, chineseUnit]) => {
    // Use regex with word boundaries but handle punctuation properly
    const pattern = new RegExp(`\\b${englishUnit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    fixedInstruction = fixedInstruction.replace(pattern, chineseUnit);
  });
  
  return fixedInstruction;
}

/**
 * Get the best available instructions with translated ingredients
 * @param {Object} recipe - The recipe object
 * @param {string} language - The current language
 * @returns {Array} - The best available instructions
 */
export function getBestInstructions(recipe, language = 'en') {
  if (!recipe || !recipe.steps) {
    return [];
  }
  
  const instructions = recipe.steps[language] || recipe.steps.en || [];
  
  // Split each instruction string by semicolons to create individual steps
  // Handle both English (;) and Chinese (；) semicolons
  const splitInstructions = instructions.flatMap(instruction => {
    if (typeof instruction === 'string') {
      // Split by semicolon (English or Chinese), clean up, and filter empty strings
      return instruction
        .split(/[;；]\s*/)  // Split by semicolon (English or Chinese) followed by optional whitespace
        .map(step => step.trim())
        .filter(step => step.length > 0);
    }
    return [instruction];
  });
  
  if (language === 'zh') {
    return splitInstructions.map(instruction => fixInstructionText(instruction, language));
  }
  
  return splitInstructions;
}

/**
 * Get the best available description with translated dish names and removed duplication
 * @param {Object} recipe - The recipe object
 * @param {string} language - The current language
 * @returns {string} - The best available description
 */
export function getBestDescription(recipe, language = 'en') {
  if (!recipe) {
    return '';
  }
  
  const description = recipe.description?.[language] || recipe.description?.en || '';
  
  // First fix any English dish names in Chinese descriptions
  const fixedDescription = fixDescriptionText(description, language);
  
  // Then remove the dish name from the beginning to avoid duplication with title
  return removeDishNameFromDescription(fixedDescription, language);
}

/**
 * Enhanced dish name display with fallback strategy
 * This is the main function to use in components
 * @param {Object} recipe - The recipe object
 * @param {string} language - The current language
 * @returns {string} - The best available dish name for display
 */
export function getBestDishName(recipe, language = 'en') {
  if (!recipe) {
    return 'Unknown Recipe';
  }
  
  return getDisplayDishName(recipe, language);
}

export default {
  isEnglishName,
  getChineseTranslation,
  getDisplayDishName,
  hasProperChineseTranslation,
  getRecipesNeedingChineseTranslation,
  getBestDishName,
  fixDescriptionText,
  getBestDescription,
  removeDishNameFromDescription,
  fixInstructionText,
  getBestInstructions
};
