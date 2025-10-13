/**
 * AI Recipe Generator Service
 * 
 * This service generates recipes using AI based on user selections.
 * It replaces the complex recipe matching logic with clean AI generation.
 */

import { getIngredientMetadata } from '../data/ingredientRegistry.js'
import { standardizeRecipe, processRecipeBatch } from '../utils/recipeDataProcessor.js'

// Simple cooking methods
export const COOKING_METHODS = [
  'grilled', 'roasted', 'sautéed', 'braised', 'steamed', 'fried', 'baked', 'boiled'
]

// Simple cuisine styles
export const CUISINE_STYLES = [
  'Chinese', 'Japanese', 'Korean', 'Italian', 'French', 'Indian', 'Thai', 'Mexican', 'American', 'Greek', 'mixed'
]

// Simple taste preferences
export const TASTE_PREFERENCES = [
  'rich', 'spicy', 'sweet', 'sour', 'salty', 'light', 'umami', 'bitter'
]

/**
 * Generate a recipe using AI based on ingredient and preferences
 */
export const generateAIRecipe = async (ingredientId, cookingMethod, cuisine, tastes, language = 'en') => {
  try {
    // Get ingredient metadata
    const ingredient = getIngredientMetadata(ingredientId)
    if (!ingredient) {
      throw new Error(`Invalid ingredient ID: ${ingredientId}`)
    }

    const { category, subcategory } = ingredient

    // Create a detailed prompt for the AI
    const prompt = createRecipePrompt(ingredientId, category, subcategory, cookingMethod, cuisine, tastes, language)

    // For now, we'll simulate AI generation with a structured response
    // In production, this would call an actual AI service like OpenAI
    const recipe = await simulateAIRecipeGeneration(ingredientId, cookingMethod, cuisine, tastes, language)

      // Standardize the generated recipe
      const standardizedRecipe = standardizeRecipe({
        id: `ai-${ingredientId}-${cookingMethod}-${Date.now()}`,
        name: recipe.name,
        emoji: recipe.emoji,
        ingredientsWithAmounts: recipe.ingredientsWithAmounts,
        instructions: recipe.instructions,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        cuisine: cuisine,
        cookingMethod: cookingMethod,
        tastes: tastes,
        language: language,
        generated: true, // Mark as AI-generated
        source: 'ai'
      }, 'AI Recipe Generator')

      return {
        success: true,
        recipe: standardizedRecipe
      }
  } catch (error) {
    console.error('AI Recipe Generation Error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Create a detailed prompt for AI recipe generation
 */
const createRecipePrompt = (ingredientId, category, subcategory, cookingMethod, cuisine, tastes, language) => {
  const tasteDescription = tastes.length > 0 ? tastes.join(', ') : 'balanced'
  
  return `Generate a ${cuisine} recipe for ${cookingMethod} ${ingredientId} (${category}/${subcategory}) with ${tasteDescription} flavors.

Requirements:
- Create an authentic ${cuisine} dish
- Use ${cookingMethod} as the primary cooking method
- Include ${ingredientId} as the main ingredient
- Incorporate ${tasteDescription} taste profile
- Provide specific ingredient amounts
- Give clear step-by-step instructions
- Output in ${language} language

Consider:
- ${subcategory} characteristics and cooking properties
- Traditional ${cuisine} cooking techniques
- Complementary ingredients for ${ingredientId}
- Appropriate cooking times and temperatures

Format as JSON with: name, ingredientsWithAmounts, instructions, cookingTime, difficulty`
}

/**
 * Simulate AI recipe generation (replace with actual AI service call)
 */
const simulateAIRecipeGeneration = async (ingredientId, cookingMethod, cuisine, tastes, language) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Generate recipe based on ingredient type - now with direct parameters
  const recipe = generateRecipeByIngredient(ingredientId, cookingMethod, cuisine, tastes, language)
  
  return recipe
}

/**
 * Generate recipe based on ingredient type (simulation)
 */
const generateRecipeByIngredient = (ingredientId, cookingMethod, cuisine, tastes, language) => {
  const ingredient = getIngredientMetadata(ingredientId)
  const category = ingredient?.category || 'Unknown'
  const subcategory = ingredient?.subcategory || 'Unknown'

  // Base recipe structure with proper multilingual names
  const baseRecipe = {
    name: generateRecipeName(ingredientId, cookingMethod, cuisine, language),
    emoji: getIngredientEmoji(ingredientId),
    ingredientsWithAmounts: [],
    instructions: [],
    servings: 4,
    cuisine: cuisine,
    cookingMethod: cookingMethod
  }

  // Add main ingredient with translated name and amount as string
  const mainIngredientAmount = getAmountTranslation(getDefaultAmount(ingredientId, category), language)
  const mainIngredientName = getIngredientNameInLanguage(ingredientId, language)
  baseRecipe.ingredientsWithAmounts.push(`${mainIngredientAmount} ${mainIngredientName}`)

  // Add complementary ingredients based on category with translated names as strings
  const complementaryIngredients = getComplementaryIngredients(category, subcategory, cuisine, language)
  complementaryIngredients.forEach(ing => {
    baseRecipe.ingredientsWithAmounts.push(`${ing.amount} ${ing.ingredient}`)
  })

  // Generate cooking instructions
  baseRecipe.instructions = generateCookingInstructions(ingredientId, cookingMethod, cuisine, language)

  // Adjust cooking time based on method and ingredient
  const cookingTimeMinutes = getCookingTime(ingredientId, cookingMethod)
  baseRecipe.prep_time = `${cookingTimeMinutes} min`
  baseRecipe.cook_time = `${cookingTimeMinutes} min`
  baseRecipe.total_time = `${cookingTimeMinutes} min`
  
  // Set difficulty based on cooking method and ingredient complexity
  baseRecipe.difficulty = getDifficultyLevel(ingredientId, cookingMethod)

  return baseRecipe
}

/**
 * Generate proper multilingual recipe names
 */
const generateRecipeName = (ingredientId, cookingMethod, cuisine, language) => {
  // Get ingredient name in the target language
  const ingredientName = getIngredientNameInLanguage(ingredientId, language)
  const cookingMethodName = getCookingMethodNameInLanguage(cookingMethod, language)
  
  // Create recipe name based on language
  if (language === 'zh') {
    return `${cookingMethodName}${ingredientName}`
  } else if (language === 'sv') {
    return `${cookingMethodName} ${ingredientName}`
  } else {
    // English (default)
    return `${cookingMethodName} ${ingredientName}`
  }
}

/**
 * Get ingredient name in target language using i18n translations
 */
const getIngredientNameInLanguage = (ingredientId, language) => {
  // Import i18n dynamically to avoid circular dependencies
  const i18n = require('../i18n').default
  
  try {
    // Get translation from i18n system
    const translationKey = `ingredients.${ingredientId}`
    const translated = i18n.getFixedT(language)('ingredients', ingredientId)
    
    // If translation exists and is not the key itself, return it
    if (translated && translated !== translationKey) {
      return translated
    }
    
    // Fallback: return the ingredient ID as-is
    return ingredientId
  } catch (error) {
    console.warn(`Translation not found for ingredient: ${ingredientId} in language: ${language}`)
    return ingredientId
  }
}

/**
 * Get amount translation for ingredients
 */
const getAmountTranslation = (amount, language) => {
  const amountTranslations = {
    '3 cloves': { en: '3 cloves', zh: '3瓣', sv: '3 klyftor' },
    '1 medium': { en: '1 medium', zh: '1个中等', sv: '1 medium' },
    '2 tbsp': { en: '2 tbsp', zh: '2汤匙', sv: '2 msk' },
    '1 tsp': { en: '1 tsp', zh: '1茶匙', sv: '1 tsk' },
    '1 piece': { en: '1 piece', zh: '1个', sv: '1 styck' },
    '2 cloves': { en: '2 cloves', zh: '2瓣', sv: '2 klyftor' },
    '1 tbsp': { en: '1 tbsp', zh: '1汤匙', sv: '1 msk' },
    '2 cups': { en: '2 cups', zh: '2杯', sv: '2 koppar' },
    '1/2 tsp': { en: '1/2 tsp', zh: '1/2茶匙', sv: '1/2 tsk' },
    '1/4 tsp': { en: '1/4 tsp', zh: '1/4茶匙', sv: '1/4 tsk' },
    '500g': { en: '500g', zh: '500克', sv: '500g' },
    '400g': { en: '400g', zh: '400克', sv: '400g' },
    '300g': { en: '300g', zh: '300克', sv: '300g' },
    '250g': { en: '250g', zh: '250克', sv: '250g' },
    '200g': { en: '200g', zh: '200克', sv: '200g' },
    '150g': { en: '150g', zh: '150克', sv: '150g' },
    '100g': { en: '100g', zh: '100克', sv: '100g' },
    '4 pieces': { en: '4 pieces', zh: '4个', sv: '4 stycken' },
    '3 pieces': { en: '3 pieces', zh: '3个', sv: '3 stycken' },
    '2 pieces': { en: '2 pieces', zh: '2个', sv: '2 stycken' },
    '1 piece': { en: '1 piece', zh: '1个', sv: '1 styck' }
  }
  
  return amountTranslations[amount]?.[language] || amount
}

/**
 * Find original ingredient ID from translated name using i18n system
 */
const findOriginalIngredientId = (translatedName, language) => {
  // Import i18n dynamically to avoid circular dependencies
  const i18n = require('../i18n').default
  
  try {
    // Get all ingredient translations for the given language
    const ingredientTranslations = i18n.getResourceBundle(language, 'translation')?.ingredients || {}
    
    // Find the ingredient ID that matches the translated name
    for (const [ingredientId, translation] of Object.entries(ingredientTranslations)) {
      if (translation === translatedName) {
        return ingredientId
      }
    }
    
    // If not found, return null
    return null
  } catch (error) {
    console.warn(`Could not find original ingredient ID for: ${translatedName} in language: ${language}`)
    return null
  }
}

/**
 * Get cooking method name in target language using i18n translations
 */
const getCookingMethodNameInLanguage = (cookingMethod, language) => {
  // Import i18n dynamically to avoid circular dependencies
  const i18n = require('../i18n').default
  
  try {
    // Get translation from i18n system
    const translationKey = `cookingMethods.${cookingMethod}`
    const translated = i18n.getFixedT(language)('cookingMethods', cookingMethod)
    
    // If translation exists and is not the key itself, return it
    if (translated && translated !== translationKey) {
      return translated
    }
    
    // Fallback: return the cooking method as-is
    return cookingMethod
  } catch (error) {
    console.warn(`Translation not found for cooking method: ${cookingMethod} in language: ${language}`)
    return cookingMethod
  }
}

const getIngredientEmoji = (ingredientId) => {
  // Use the same emoji mapping logic as recipes for consistency
  const emojiMap = {
    // Meat proteins
    'beef': '🥩',
    'beef-steak': '🥩',
    'beef-brisket': '🥩',
    'beef-ribs': '🥩',
    'beef-tenderloin': '🥩',
    'ground-beef': '🥩',
    'pork': '🐷',
    'pork-belly': '🐷',
    'pork-shoulder': '🐷',
    'pork-chops': '🐷',
    'pork-ribs': '🐷',
    'ground-pork': '🐷',
    'pork-tenderloin': '🐷',
    'chicken': '🐔',
    'chicken-breast': '🐔',
    'chicken-thighs': '🐔',
    'chicken-wings': '🐔',
    'whole-chicken': '🐔',
    'ground-chicken': '🐔',
    'lamb': '🐑',
    'lamb-chops': '🐑',
    'ground-lamb': '🐑',
    'lamb-shoulder': '🐑',
    'lamb-leg': '🐑',
    'lamb-ribs': '🐑',
    'duck': '🦆',
    'duck-breast': '🦆',
    'whole-duck': '🦆',
    'duck-legs': '🦆',
    
    // Seafood
    'fish': '🐟',
    'salmon': '🐟',
    'tuna': '🐟',
    'cod': '🐟',
    'sea-bass': '🐟',
    'mackerel': '🐟',
    'shrimp': '🦐',
    'scallops': '🦪',
    'oysters': '🦪',
    'crab-meat': '🦀',
    'crab': '🦀',
    'lobster': '🦞',
    'prawns': '🦐',
    'crawfish': '🦞',
    'king-crab': '🦀',
    'clams': '🦪',
    'mussels': '🦪',
    'cockles': '🦪',
    'abalone': '🦪',
    'squid': '🦑',
    'octopus': '🦑',
    'cuttlefish': '🦑',
    
    // Vegetarian proteins
    'tofu': '🧈',
    'firm-tofu': '🧈',
    'silken-tofu': '🧈',
    'smoked-tofu': '🧈',
    'tempeh': '🧈',
    'tofu-skin': '🧈',
    'fried-tofu': '🧈',
    'eggs': '🥚',
    'egg-white': '🥚',
    'egg-yolk': '🥚',
    'duck-egg': '🥚',
    'quail-egg': '🥚',
    'goose-egg': '🥚',
    'turkey-egg': '🥚',
    'ostrich-egg': '🥚',
    'pheasant-egg': '🥚',
    'salted-egg': '🥚',
    'century-egg': '🥚',
    'pickled-egg': '🥚',
    
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
    'bamboo-shoots': '🎋',
    'basil': '🌿',
    'chili': '🌶️',
    'cilantro': '🌿',
    'eggplant': '🍆',
    'garlic': '🧄',
    'ginger': '🫚',
    'herbs': '🌿',
    'lime': '🍋',
    'onion': '🧅',
    'scallions': '🧅',
    'tomato': '🍅',
    'mushroom': '🍄',
    'button-mushroom': '🍄',
    'button-mushrooms': '🍄',
    'shiitake': '🍄',
    'portobello': '🍄',
    'oyster-mushroom': '🍄',
    'enoki': '🍄',
    'morel': '🍄',
    'chanterelle': '🍄',
    'zucchini': '🥒',
    'cucumber': '🥒',
    'green-beans': '🫛',
    'kidney-beans': '🫘',
    'chickpeas': '🫘',
    'black-beans': '🫘',
    'lentils': '🫘',
    'edamame': '🫘',
    'white-beans': '🫘',
    'peanuts': '🥜',
    
    // Grains and starches
    'rice': '🍚',
    'brown-rice': '🍚',
    'white-rice': '🍚',
    'quinoa': '🌾',
    'oats': '🌾',
    'barley': '🌾',
    'millet': '🌾',
    'buckwheat': '🌾',
    'bulgur': '🌾',
    'all-purpose-flour': '🌾',
    'couscous': '🌾',
    'semolina': '🌾',
    'cornmeal': '🌾',
    'white-bread': '🍞',
    'pasta': '🍝',
    'flour': '🌾',
    'noodles': '🍜',
    'pizza-dough': '🍞',
    'tortillas': '🌮',
    'amaranth': '🌾',
    'farro': '🌾',
    'spelt': '🌾',
    'teff': '🌾',
    'khorasan': '🌾',
    'einkorn': '🌾',
    'sorghum': '🌾',
    
    // Dairy
    'milk': '🥛',
    'cheese': '🧀',
    'butter': '🧈',
    'yogurt': '🥛',
    
    // Nuts and seeds
    'almonds': '🥜',
    'walnuts': '🥜',
    'sesame': '🫘',
    
    // Other
    'olive-oil': '🫒',
    'red-wine': '🍷',
    'rice-wine': '🍶',
    'rock-sugar': '🍯',
    'sesame-oil': '🫒',
    'soy-sauce': '🫗',
    'star-anise': '⭐',
    'sugar': '🍯',
    'tomato-sauce': '🍅',
    'wine': '🍷'
  }
  
  return emojiMap[ingredientId] || '🍽️'
}

/**
 * Get default amount for ingredient
 */
const getDefaultAmount = (ingredientId, category) => {
  const amountMap = {
    'Meat': '500g',
    'Seafood': '400g',
    'Vegetables': '300g',
    'Grains': '200g',
    'Egg': '4 pieces'
  }
  return amountMap[category] || '250g'
}

/**
 * Get complementary ingredients based on category and cuisine
 */
const getComplementaryIngredients = (category, subcategory, cuisine, language = 'en') => {
  const complementary = {
    'Meat': [
      { ingredient: 'garlic', amount: '3 cloves' },
      { ingredient: 'onion', amount: '1 medium' },
      { ingredient: 'olive-oil', amount: '2 tbsp' },
      { ingredient: 'black-pepper', amount: '1 tsp' }
    ],
    'Seafood': [
      { ingredient: 'lemon', amount: '1 piece' },
      { ingredient: 'garlic', amount: '2 cloves' },
      { ingredient: 'olive-oil', amount: '2 tbsp' },
      { ingredient: 'herbs', amount: '1 tbsp' }
    ],
    'Vegetables': [
      { ingredient: 'garlic', amount: '2 cloves' },
      { ingredient: 'olive-oil', amount: '2 tbsp' },
      { ingredient: 'salt', amount: '1 tsp' }
    ],
    'Grains': [
      { ingredient: 'water', amount: '2 cups' },
      { ingredient: 'salt', amount: '1 tsp' }
    ],
    'Egg': [
      { ingredient: 'butter', amount: '1 tbsp' },
      { ingredient: 'salt', amount: '1/2 tsp' },
      { ingredient: 'black-pepper', amount: '1/4 tsp' }
    ]
  }
  
  const ingredients = complementary[category] || []
  
  // Translate both ingredient names and amounts to the target language
  return ingredients.map(ing => ({
    ingredient: getIngredientNameInLanguage(ing.ingredient, language),
    amount: getAmountTranslation(ing.amount, language)
  }))
}

/**
 * Generate cooking instructions
 */
const generateCookingInstructions = (ingredientId, cookingMethod, cuisine, language) => {
  // Get translated ingredient and cooking method names
  const ingredientName = getIngredientNameInLanguage(ingredientId, language)
  const cookingMethodName = getCookingMethodNameInLanguage(cookingMethod, language)
  
  const instructions = {
    en: [
      `Prepare the ${ingredientName} by cleaning and cutting as needed.`,
      `Heat a pan or pot over medium heat.`,
      `Add oil and seasonings to the pan.`,
      `Cook the ${ingredientName} using ${cookingMethodName} method.`,
      `Cook until done, about 10-15 minutes.`,
      `Serve hot with your choice of sides.`
    ],
    zh: [
      `准备${ingredientName}，清洗并切成适当大小。`,
      `将平底锅或锅子加热至中火。`,
      `在锅中加入油和调味料。`,
      `使用${cookingMethodName}方法烹饪${ingredientName}。`,
      `烹饪至熟透，大约10-15分钟。`,
      `趁热与配菜一起享用。`
    ],
    sv: [
      `Förbered ${ingredientName} genom att rengöra och skära efter behov.`,
      `Värm en panna eller kastrull på medelvärme.`,
      `Lägg till olja och kryddor i pannan.`,
      `Koka ${ingredientName} med ${cookingMethodName} metod.`,
      `Koka tills det är klart, cirka 10-15 minuter.`,
      `Servera varmt med dina valda sidorätter.`
    ]
  }

  return instructions[language] || instructions.en
}


/**
 * Generate multiple recipes for party planning
 */
export const generatePartyRecipes = async (selections, language = 'en') => {
  const { dishCategories, tastePreferences, cuisineStyle, numberOfDishes } = selections
  const recipes = []

  // Filter out null categories and ensure we have enough categories
  const validCategories = dishCategories.filter(cat => cat !== null)
  
  // If we don't have enough categories, fill with random categories
  const allAvailableCategories = [
    { value: 'meat', label: 'Meat', emoji: '🥩' },
    { value: 'seafood', label: 'Seafood', emoji: '🦞' },
    { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
    { value: 'grains', label: 'Grains', emoji: '🌾' },
    { value: 'egg', label: 'Egg', emoji: '🥚' }
  ]

  // Ensure we have enough categories for the requested number of dishes
  const categoriesToUse = []
  for (let i = 0; i < numberOfDishes; i++) {
    if (i < validCategories.length) {
      // Use the assigned category
      categoriesToUse.push(validCategories[i])
    } else {
      // Fill remaining slots with random categories
      const randomCategory = allAvailableCategories[Math.floor(Math.random() * allAvailableCategories.length)]
      categoriesToUse.push(randomCategory)
    }
  }

  // Track used ingredients and combinations to prevent duplicates
  const usedIngredients = new Set()
  const usedCombinations = new Set()
  
  // Generate recipes for each category
  for (let i = 0; i < numberOfDishes; i++) {
    const category = categoriesToUse[i]
    
    let attempts = 0
    let result = null
    
    // Try to generate a unique recipe (max 15 attempts per dish)
    while (attempts < 15 && !result) {
      const ingredientId = getRandomIngredientFromCategory(category.value)
      const cookingMethod = getRandomCookingMethod()
      
      // Create keys for checking duplicates
      const combinationKey = `${ingredientId}-${cookingMethod}`
      
      // Prioritize different main ingredients - avoid same ingredient even with different cooking methods
      const isNewIngredient = !usedIngredients.has(ingredientId)
      const isNewCombination = !usedCombinations.has(combinationKey)
      
      // Prefer completely new ingredients, but allow same ingredient with different method if needed
      if (isNewIngredient || (attempts > 5 && isNewCombination)) {
        usedIngredients.add(ingredientId)
        usedCombinations.add(combinationKey)
        
        result = await generateAIRecipe(
          ingredientId,
          cookingMethod,
          cuisineStyle,
          tastePreferences,
          language
        )
        
        if (result.success) {
          recipes.push(result.recipe)
        }
      } else {
        attempts++
      }
    }
    
    // If we couldn't generate a unique recipe, generate any recipe for this category
    if (!result) {
      const ingredientId = getRandomIngredientFromCategory(category.value)
      const cookingMethod = getRandomCookingMethod()
      
      result = await generateAIRecipe(
        ingredientId,
        cookingMethod,
        cuisineStyle,
        tastePreferences,
        language
      )
      
      if (result.success) {
        recipes.push(result.recipe)
      }
    }
  }

  return recipes
}

/**
 * Regenerate a single dish while ensuring no duplicates with existing dishes
 */
export const regenerateSingleDish = async (category, existingDishes, cuisineStyle, tastePreferences, language) => {
  const usedIngredients = new Set()
  const usedCombinations = new Set()
  
  // Add existing dish ingredients and combinations to the used sets
  // We need to reverse-engineer the original ingredientId from the translated name
  existingDishes.forEach(dish => {
    if (dish.ingredientsWithAmounts && dish.ingredientsWithAmounts.length > 0) {
      const translatedIngredient = dish.ingredientsWithAmounts[0].ingredient
      
      // Find the original ingredientId that corresponds to this translated name
      const originalIngredientId = findOriginalIngredientId(translatedIngredient, language)
      
      if (originalIngredientId) {
        const combinationKey = `${originalIngredientId}-${dish.cookingMethod}`
        usedIngredients.add(originalIngredientId)
        usedCombinations.add(combinationKey)
      }
    }
  })
  
  let attempts = 0
  let result = null
  
  // Try to generate a unique recipe (max 20 attempts)
  while (attempts < 20 && !result) {
    const ingredientId = getRandomIngredientFromCategory(category.value)
    const cookingMethod = getRandomCookingMethod()
    
    // Create keys for checking duplicates
    const combinationKey = `${ingredientId}-${cookingMethod}`
    
    // Prioritize different main ingredients - avoid same ingredient even with different cooking methods
    const isNewIngredient = !usedIngredients.has(ingredientId)
    const isNewCombination = !usedCombinations.has(combinationKey)
    
    // Prefer completely new ingredients, but allow same ingredient with different method if needed
    if (isNewIngredient || (attempts > 8 && isNewCombination)) {
      usedIngredients.add(ingredientId)
      usedCombinations.add(combinationKey)
      
      result = await generateAIRecipe(
        ingredientId,
        cookingMethod,
        cuisineStyle,
        tastePreferences,
        language
      )
      
      if (result.success) {
        return result.recipe
      }
    } else {
      attempts++
    }
  }
  
  // If we couldn't generate a unique recipe, generate any recipe for this category
  const ingredientId = getRandomIngredientFromCategory(category.value)
  const cookingMethod = getRandomCookingMethod()
  
  result = await generateAIRecipe(
    ingredientId,
    cookingMethod,
    cuisineStyle,
    tastePreferences,
    language
  )
  
  return result.success ? result.recipe : null
}

/**
 * Get random ingredient from category
 */
const getRandomIngredientFromCategory = (categoryValue) => {
  const categoryMap = {
    'meat': ['pork-belly', 'beef-steak', 'chicken-breast', 'lamb-chops'],
    'seafood': ['salmon', 'tuna', 'shrimp', 'scallops'],
    'vegetables': ['broccoli', 'carrots', 'bell-peppers', 'shiitake'],
    'grains': ['rice', 'quinoa', 'pasta', 'barley'],
    'egg': ['whole-egg', 'chicken-eggs']
  }

  const ingredients = categoryMap[categoryValue] || ['ingredient']
  return ingredients[Math.floor(Math.random() * ingredients.length)]
}

/**
 * Get random cooking method
 */
const getRandomCookingMethod = () => {
  return COOKING_METHODS[Math.floor(Math.random() * COOKING_METHODS.length)]
}

/**
 * Get cooking time based on ingredient and method
 */
const getCookingTime = (ingredientId, cookingMethod) => {
  const baseTimeMap = {
    'pork-belly': 90,
    'beef-steak': 20,
    'chicken-breast': 25,
    'lamb-chops': 30,
    'salmon': 15,
    'tuna': 12,
    'shrimp': 8,
    'scallops': 6,
    'broccoli': 10,
    'carrots': 15,
    'bell-peppers': 8,
    'shiitake': 12,
    'rice': 20,
    'quinoa': 15,
    'pasta': 12,
    'barley': 30,
    'whole-egg': 5,
    'chicken-eggs': 5
  }
  
  const methodTimeAdjustment = {
    'grilled': 1.0,
    'roasted': 1.5,
    'sautéed': 0.8,
    'braised': 2.0,
    'steamed': 0.9,
    'fried': 0.7,
    'baked': 1.3,
    'boiled': 1.0
  }
  
  const baseTime = baseTimeMap[ingredientId] || 20
  const adjustment = methodTimeAdjustment[cookingMethod] || 1.0
  
  return Math.round(baseTime * adjustment)
}

/**
 * Get difficulty level based on ingredient and cooking method
 */
const getDifficultyLevel = (ingredientId, cookingMethod) => {
  // Simple ingredients with simple methods = Easy
  const simpleIngredients = ['whole-egg', 'chicken-eggs', 'shrimp', 'scallops', 'broccoli', 'carrots', 'bell-peppers']
  const simpleMethods = ['steamed', 'boiled', 'sautéed']
  
  // Complex ingredients or complex methods = Hard
  const complexIngredients = ['pork-belly', 'beef-steak', 'lamb-chops']
  const complexMethods = ['braised', 'roasted', 'baked']
  
  if (simpleIngredients.includes(ingredientId) && simpleMethods.includes(cookingMethod)) {
    return 'Easy'
  } else if (complexIngredients.includes(ingredientId) || complexMethods.includes(cookingMethod)) {
    return 'Hard'
  } else {
    return 'Medium'
  }
}
