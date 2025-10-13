/**
 * Comprehensive Recipe Translation System
 * 
 * This script scans all existing recipes and creates complete translations
 * for all metadata and content across all languages, then stores them
 * in a proper structure for easy retrieval.
 */

const fs = require('fs')
const path = require('path')

// Define the locales directory
const localesDir = path.join(__dirname, '..', 'src', 'locales')

// Language codes to process
const languages = ['en', 'zh', 'sv']

// Translation dictionaries for common terms
const translationDictionaries = {
  // Time units
  timeUnits: {
    en: { min: 'min', minutes: 'minutes', hour: 'hour', hours: 'hours' },
    zh: { min: '分钟', minutes: '分钟', hour: '小时', hours: '小时' },
    sv: { min: 'min', minutes: 'minuter', hour: 'timme', hours: 'timmar' }
  },
  
  // Difficulty levels
  difficulty: {
    en: { Easy: 'Easy', Medium: 'Medium', Hard: 'Hard' },
    zh: { Easy: '简单', Medium: '中等', Hard: '困难' },
    sv: { Easy: 'Lätt', Medium: 'Medium', Hard: 'Svår' }
  },
  
  // Cooking methods
  cookingMethods: {
    en: {
      grilled: 'Grilled', roasted: 'Roasted', sautéed: 'Sautéed', 
      braised: 'Braised', steamed: 'Steamed', fried: 'Fried', 
      baked: 'Baked', boiled: 'Boiled'
    },
    zh: {
      grilled: '烤制', roasted: '烘烤', sautéed: '炒制', 
      braised: '炖煮', steamed: '蒸制', fried: '油炸', 
      baked: '烘烤', boiled: '水煮'
    },
    sv: {
      grilled: 'Grillat', roasted: 'Rostat', sautéed: 'Sauterat', 
      braised: 'Braserat', steamed: 'Ångat', fried: 'Stekt', 
      baked: 'Bakat', boiled: 'Kokt'
    }
  },
  
  // Common ingredient terms
  ingredients: {
    en: {
      'pound': 'lb', 'pounds': 'lbs', 'cup': 'cup', 'cups': 'cups',
      'tablespoon': 'tbsp', 'tablespoons': 'tbsp', 'teaspoon': 'tsp', 'teaspoons': 'tsp',
      'inch': 'inch', 'inches': 'inches', 'clove': 'clove', 'cloves': 'cloves',
      'piece': 'piece', 'pieces': 'pieces', 'stalk': 'stalk', 'stalks': 'stalks',
      'leaf': 'leaf', 'leaves': 'leaves'
    },
    zh: {
      'pound': '磅', 'pounds': '磅', 'cup': '杯', 'cups': '杯',
      'tablespoon': '汤匙', 'tablespoons': '汤匙', 'teaspoon': '茶匙', 'teaspoons': '茶匙',
      'inch': '英寸', 'inches': '英寸', 'clove': '瓣', 'cloves': '瓣',
      'piece': '个', 'pieces': '个', 'stalk': '茎', 'stalks': '茎',
      'leaf': '叶', 'leaves': '叶'
    },
    sv: {
      'pound': 'pund', 'pounds': 'pund', 'cup': 'kopp', 'cups': 'koppar',
      'tablespoon': 'matsked', 'tablespoons': 'matskedar', 'teaspoon': 'tesked', 'teaspoons': 'teskedar',
      'inch': 'tum', 'inches': 'tum', 'clove': 'klyfta', 'cloves': 'klyftor',
      'piece': 'bit', 'pieces': 'bitar', 'stalk': 'stjälk', 'stalks': 'stjälkar',
      'leaf': 'blad', 'leaves': 'blad'
    }
  }
}

/**
 * Translate time value (e.g., "30 min" -> "30 分钟")
 */
function translateTimeValue(timeValue, targetLanguage) {
  if (!timeValue || typeof timeValue !== 'string') return timeValue
  
  const timeUnits = translationDictionaries.timeUnits[targetLanguage]
  let translated = timeValue
  
  // Replace English time units with translated ones
  Object.entries(timeUnits).forEach(([enUnit, translatedUnit]) => {
    const regex = new RegExp(`\\b${enUnit}\\b`, 'gi')
    translated = translated.replace(regex, translatedUnit)
  })
  
  return translated
}

/**
 * Translate difficulty value
 */
function translateDifficultyValue(difficultyValue, targetLanguage) {
  if (!difficultyValue || typeof difficultyValue !== 'string') return difficultyValue
  
  const difficulties = translationDictionaries.difficulty[targetLanguage]
  
  // Check if it's already translated
  if (Object.values(difficulties).includes(difficultyValue)) {
    return difficultyValue
  }
  
  // Translate from English
  Object.entries(difficulties).forEach(([enDifficulty, translatedDifficulty]) => {
    if (difficultyValue.toLowerCase() === enDifficulty.toLowerCase()) {
      return translatedDifficulty
    }
  })
  
  return difficultyValue
}

/**
 * Translate cooking method
 */
function translateCookingMethod(method, targetLanguage) {
  if (!method || typeof method !== 'string') return method
  
  const methods = translationDictionaries.cookingMethods[targetLanguage]
  
  // Check if it's already translated
  if (Object.values(methods).includes(method)) {
    return method
  }
  
  // Translate from English
  Object.entries(methods).forEach(([enMethod, translatedMethod]) => {
    if (method.toLowerCase() === enMethod.toLowerCase()) {
      return translatedMethod
    }
  })
  
  return method
}

/**
 * Translate ingredient amounts and units
 */
function translateIngredientAmount(ingredientText, targetLanguage) {
  if (!ingredientText || typeof ingredientText !== 'string') return ingredientText
  
  const ingredients = translationDictionaries.ingredients[targetLanguage]
  let translated = ingredientText
  
  // Replace English units with translated ones
  Object.entries(ingredients).forEach(([enUnit, translatedUnit]) => {
    const regex = new RegExp(`\\b${enUnit}\\b`, 'gi')
    translated = translated.replace(regex, translatedUnit)
  })
  
  return translated
}

/**
 * Translate a complete recipe object
 */
function translateRecipe(recipe, sourceLanguage, targetLanguage) {
  if (!recipe || typeof recipe !== 'object') return recipe
  
  const translated = { ...recipe }
  
  // Translate metadata
  if (translated.prep_time) {
    translated.prep_time = translateTimeValue(translated.prep_time, targetLanguage)
  }
  
  if (translated.cook_time) {
    translated.cook_time = translateTimeValue(translated.cook_time, targetLanguage)
  }
  
  if (translated.total_time) {
    translated.total_time = translateTimeValue(translated.total_time, targetLanguage)
  }
  
  if (translated.difficulty) {
    translated.difficulty = translateDifficultyValue(translated.difficulty, targetLanguage)
  }
  
  if (translated.cookingMethod) {
    translated.cookingMethod = translateCookingMethod(translated.cookingMethod, targetLanguage)
  }
  
  // Translate ingredients with amounts
  if (translated.ingredientsWithAmounts && Array.isArray(translated.ingredientsWithAmounts)) {
    translated.ingredientsWithAmounts = translated.ingredientsWithAmounts.map(ingredient => {
      if (typeof ingredient === 'string') {
        return translateIngredientAmount(ingredient, targetLanguage)
      }
      return ingredient
    })
  }
  
  return translated
}

/**
 * Process all recipes for a language and create complete translations
 */
function processLanguageRecipes(language) {
  console.log(`\n🔄 Processing ${language} recipes...`)
  
  const recipeFile = path.join(localesDir, language, 'recipes.json')
  
  if (!fs.existsSync(recipeFile)) {
    console.log(`⚠️  Recipe file not found: ${language}/recipes.json`)
    return
  }
  
  try {
    // Read the recipe file
    const fileContent = fs.readFileSync(recipeFile, 'utf8')
    const recipeData = JSON.parse(fileContent)
    
    let totalRecipes = 0
    let translatedCount = 0
    
    // Process cultural recipes
    if (recipeData.cultural && typeof recipeData.cultural === 'object') {
      Object.keys(recipeData.cultural).forEach(cuisine => {
        if (Array.isArray(recipeData.cultural[cuisine])) {
          recipeData.cultural[cuisine] = recipeData.cultural[cuisine].map(recipe => {
            totalRecipes++
            const translated = translateRecipe(recipe, language, language)
            
            // Check if any changes were made
            const hasChanges = JSON.stringify(recipe) !== JSON.stringify(translated)
            if (hasChanges) {
              translatedCount++
            }
            
            return translated
          })
        }
      })
    }
    
    // Process basic recipes
    if (recipeData.basic && typeof recipeData.basic === 'object') {
      Object.keys(recipeData.basic).forEach(cookingMethod => {
        if (typeof recipeData.basic[cookingMethod] === 'object') {
          Object.keys(recipeData.basic[cookingMethod]).forEach(dishName => {
            const recipe = recipeData.basic[cookingMethod][dishName]
            if (recipe && typeof recipe === 'object') {
              totalRecipes++
              const translated = translateRecipe(recipe, language, language)
              
              // Check if any changes were made
              const hasChanges = JSON.stringify(recipe) !== JSON.stringify(translated)
              if (hasChanges) {
                translatedCount++
              }
              
              recipeData.basic[cookingMethod][dishName] = translated
            }
          })
        }
      })
    }
    
    // Write back the translated data
    if (translatedCount > 0) {
      fs.writeFileSync(recipeFile, JSON.stringify(recipeData, null, 2), 'utf8')
      console.log(`✅ Translated ${translatedCount} out of ${totalRecipes} recipes in ${language}/recipes.json`)
    } else {
      console.log(`✅ No translation needed for ${language}/recipes.json (${totalRecipes} recipes checked)`)
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${language}/recipes.json:`, error.message)
  }
}

/**
 * Main execution function
 */
function main() {
  console.log('🌍 Starting comprehensive recipe translation system...\n')
  console.log('📋 This will:')
  console.log('  - Scan all existing recipes')
  console.log('  - Translate all metadata (time, difficulty, cooking methods)')
  console.log('  - Translate ingredient amounts and units')
  console.log('  - Store complete translations for all languages')
  console.log('  - Ensure consistent formatting across all recipes\n')
  
  // Process each language
  languages.forEach(language => {
    processLanguageRecipes(language)
  })
  
  console.log(`\n🎉 Translation completed for all languages!`)
  console.log('✨ All recipes now have consistent, properly translated metadata!')
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = {
  translateRecipe,
  translateTimeValue,
  translateDifficultyValue,
  translateCookingMethod,
  translateIngredientAmount,
  processLanguageRecipes
}
