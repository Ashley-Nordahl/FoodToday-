import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

// Get unified recipes based on current language (REACTIVE VERSION)
export function useRecipes() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language || 'en'
  const recipeData = i18n.getResourceBundle(currentLanguage, 'recipes')
  return recipeData || { cultural: {}, basic: {}, metadata: {} }
}

// Get party data based on current language (REACTIVE VERSION)
export function usePartyData() {
  const { i18n } = useTranslation()
  const partyData = i18n.getResourceBundle(i18n.language, 'parties')
  return partyData || {}
}

// Get ingredient data based on current language (REACTIVE VERSION)
export function useIngredientData() {
  const { i18n } = useTranslation()
  const ingredientData = i18n.getResourceBundle(i18n.language, 'ingredients')
  return ingredientData || {}
}


// REACTIVE VERSION - Party metadata functions
export function usePartyTypes() {
  const partyData = usePartyData()
  return partyData.partyTypes || []
}

export function useIngredientCategories() {
  const partyData = usePartyData()
  return partyData.ingredientCategories || []
}

export function useTastePreferences() {
  const partyData = usePartyData()
  return partyData.tastePreferences || []
}

export function useCuisineStyles() {
  const partyData = usePartyData()
  return partyData.cuisineStyles || []
}

export function useDiningScenarios() {
  const partyData = usePartyData()
  return partyData.diningScenarios || []
}

// REACTIVE VERSION - Ingredient functions
export function useIngredientRegistry() {
  const ingredientData = useIngredientData()
  return ingredientData.ingredients || {}
}

export function useIngredientCategoriesStructure() {
  const ingredientData = useIngredientData()
  return ingredientData.categories || {}
}

export function useCuisines() {
  const ingredientData = useIngredientData()
  return ingredientData.cuisines || {}
}



// Function to get random recipe from a cuisine (uses cultural recipes)
// NOTE: All recipes are now organized under "Chinese" section regardless of cuisine selection
export const getRandomRecipe = (cuisineName) => {
  const currentLanguage = i18n.language || 'en'
  const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
  const culturalRecipes = recipes.cultural || {}
  // Always use "Chinese" section since all recipes are organized there
  const cuisineRecipes = culturalRecipes["Chinese"] || []
  
  if (!cuisineRecipes || cuisineRecipes.length === 0) {
    return null
  }
  
  // Filter to only include complete recipes (with ingredientsWithAmounts and instructions)
  const completeRecipes = cuisineRecipes.filter(recipe => 
    recipe.ingredientsWithAmounts && 
    recipe.instructions && 
    Array.isArray(recipe.ingredientsWithAmounts) && 
    Array.isArray(recipe.instructions) &&
    recipe.ingredientsWithAmounts.length > 0 &&
    recipe.instructions.length > 0
  )
  
  if (completeRecipes.length === 0) {
    return null
  }
  
  const randomIndex = Math.floor(Math.random() * completeRecipes.length)
  return completeRecipes[randomIndex]
}

// Function to get random recipe from all available cuisines
// NOTE: All recipes are now organized under "Chinese" section
export const getRandomRecipeFromAll = () => {
  const currentLanguage = i18n.language || 'en'
  const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
  const culturalRecipes = recipes.cultural || {}
  
  // All recipes are now in the "Chinese" section
  const allRecipes = culturalRecipes["Chinese"] || []
  
  // Filter to only include complete recipes (with ingredientsWithAmounts and instructions)
  const allCompleteRecipes = allRecipes.filter(recipe => 
    recipe.ingredientsWithAmounts && 
    recipe.instructions && 
    Array.isArray(recipe.ingredientsWithAmounts) && 
    Array.isArray(recipe.instructions) &&
    recipe.ingredientsWithAmounts.length > 0 &&
    recipe.instructions.length > 0
  )
  
  if (allCompleteRecipes.length === 0) {
    return null
  }
  
  const randomIndex = Math.floor(Math.random() * allCompleteRecipes.length)
  return allCompleteRecipes[randomIndex]
}

// Helper function to categorize ingredients
const categorizeIngredients = (ingredients) => {
  const categories = {
    protein: [], // Meat, Seafood, Egg
    vegetables: [],
    staples: [],
    others: []
  }
  
  ingredients.forEach(ingredient => {
    if (isProtein(ingredient.id)) {
      categories.protein.push(ingredient)
    } else if (isVegetable(ingredient.id)) {
      categories.vegetables.push(ingredient)
    } else if (isStaple(ingredient.id)) {
      categories.staples.push(ingredient)
    } else {
      categories.others.push(ingredient)
    }
  })
  
  return categories
}

// Helper function to find the most important ingredient
const findKeyIngredient = (categorized) => {
  // Priority 1: Meat/Seafood (pick first one)
  if (categorized.protein.length > 0) {
    return categorized.protein[0]
  }
  
  // Priority 2: If only vegetables, pick first vegetable
  if (categorized.vegetables.length > 0) {
    return categorized.vegetables[0]
  }
  
  // Priority 3: Staple food
  if (categorized.staples.length > 0) {
    return categorized.staples[0]
  }
  
  // Priority 4: Any other ingredient
  if (categorized.others.length > 0) {
    return categorized.others[0]
  }
  
  return null
}

// Helper functions to categorize ingredient types
const isProtein = (ingredientId) => {
  const proteinIds = [
    // Pork
    'pork-belly', 'pork-shoulder', 'pork-chops', 'pork-ribs', 'ground-pork', 'pork-tenderloin',
    // Beef
    'beef-steak', 'ground-beef', 'beef-brisket', 'beef-ribs', 'beef-roast', 'beef-tenderloin',
    // Lamb
    'lamb-chops', 'ground-lamb', 'lamb-shoulder', 'lamb-leg', 'lamb-ribs',
    // Chicken
    'chicken-breast', 'chicken-thighs', 'chicken-wings', 'whole-chicken', 'ground-chicken',
    // Duck
    'duck-breast', 'whole-duck', 'duck-legs',
    // Processed Meats
    'bacon', 'sausage', 'ham', 'prosciutto',
    // Fish
    'salmon', 'tuna', 'cod', 'sea-bass', 'mackerel',
    // Shellfish
    'shrimp', 'scallops', 'oysters', 'crab-meat', 'clams',
    // Cephalopods
    'squid', 'octopus', 'cuttlefish',
    // Crustaceans
    'crab', 'lobster', 'prawns', 'crawfish', 'king-crab',
    // Mollusks
    'mussels', 'cockles', 'abalone',
    // Processed Seafood
    'smoked-salmon', 'canned-tuna', 'fish-sticks',
    // Eggs
    'whole-egg', 'egg-whites', 'egg-yolks', 'duck-egg', 'quail-egg'
  ]
  return proteinIds.includes(ingredientId)
}

const isVegetable = (ingredientId) => {
  const vegetableIds = [
    // Alliums
    'onion', 'garlic', 'scallions', 'leeks', 'shallots', 'chives',
    // Peppers
    'bell-pepper', 'bell-peppers', 'chili', 'jalapeno', 'habanero', 'poblano',
    // Leafy Greens
    'cabbage', 'spinach', 'lettuce', 'kale', 'arugula', 'watercress', 'bok-choy', 'napa-cabbage',
    // Root Vegetables
    'carrot', 'carrots', 'potato', 'sweet-potato', 'beetroot', 'radish', 'turnip', 'parsnip',
    // Nightshades
    'tomato', 'eggplant', 'zucchini', 'squash', 'pumpkin',
    // Cruciferous
    'broccoli', 'cauliflower', 'brussels-sprouts', 'kohlrabi',
    // Other Vegetables
    'cucumber', 'celery', 'asparagus', 'artichoke', 'fennel', 'rhubarb',
    // Mushrooms
    'mushroom', 'shiitake', 'oyster-mushroom', 'enoki', 'portobello', 'porcini', 'cremini', 'button-mushroom',
    // Beans & Legumes
    'tofu', 'black-beans', 'kidney-beans', 'chickpeas', 'lentils', 'green-beans', 'soybeans', 'peas', 'edamame', 'lima-beans', 'navy-beans', 'pinto-beans',
    // Corn
    'corn', 'corn-kernels', 'corn-on-cob'
  ]
  return vegetableIds.includes(ingredientId)
}

const isStaple = (ingredientId) => {
  const stapleIds = [
    // Rice & Grains
    'rice', 'brown-rice', 'white-rice', 'jasmine-rice', 'basmati-rice', 'wild-rice', 'sticky-rice',
    // Noodles & Pasta
    'noodles', 'pasta', 'spaghetti', 'linguine', 'fettuccine', 'penne', 'rigatoni', 'macaroni', 'ramen-noodles', 'udon-noodles', 'soba-noodles', 'rice-noodles',
    // Bread & Baked Goods
    'bread', 'white-bread', 'whole-wheat-bread', 'sourdough-bread', 'baguette', 'pita-bread', 'naan-bread', 'tortillas', 'corn-tortillas', 'flour-tortillas',
    // Ancient Grains
    'quinoa', 'barley', 'oats', 'steel-cut-oats', 'rolled-oats', 'buckwheat', 'millet', 'amaranth', 'teff', 'spelt', 'farro', 'bulgur',
    // Flour & Starches
    'flour', 'all-purpose-flour', 'whole-wheat-flour', 'bread-flour', 'cake-flour', 'cornstarch', 'potato-starch', 'tapioca-starch',
    // Other Staples
    'couscous', 'polenta', 'grits', 'semolina'
  ]
  return stapleIds.includes(ingredientId)
}

// Function to get recipes based on available ingredients with smart matching
// NOTE: All recipes are now organized under "Chinese" section regardless of cuisine selection
export const getRecipesByIngredients = (cuisineName, availableIngredients) => {
  const currentLanguage = i18n.language || 'en'
  const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
  const culturalRecipes = recipes.cultural || {}
  // Always use "Chinese" section since all recipes are organized there
  const cuisineRecipes = culturalRecipes["Chinese"] || []
  
  if (!cuisineRecipes || cuisineRecipes.length === 0) {
    return []
  }
  
  // Categorize ingredients by type
  const categorizedIngredients = categorizeIngredients(availableIngredients)
  
  // Find the key ingredient (primary protein)
  const keyIngredient = findKeyIngredient(categorizedIngredients)
  
  if (!keyIngredient) {
    return []
  }
  
  // Find recipes that use this key ingredient
  const keyIngredientRecipes = cuisineRecipes.filter(recipe => 
    recipe.ingredients && recipe.ingredients.includes(keyIngredient.id)
  )
  
  if (keyIngredientRecipes.length > 0) {
    return keyIngredientRecipes
  }
  
  // Fallback: return any recipe from this cuisine
  const randomRecipe = getRandomRecipe(cuisineName)
  return randomRecipe ? [randomRecipe] : []
}

// Function to get recipes by ingredients from all available cuisines
// NOTE: All recipes are now organized under "Chinese" section
export const getRecipesByIngredientsFromAll = (availableIngredients) => {
  const currentLanguage = i18n.language || 'en'
  const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
  const culturalRecipes = recipes.cultural || {}
  
  // All recipes are now in the "Chinese" section
  const allRecipes = (culturalRecipes["Chinese"] || []).map(recipe => ({
    ...recipe,
    cuisine: "Chinese" // Add cuisine info to the recipe
  }))
  
  if (allRecipes.length === 0) {
    return []
  }
  
  // Categorize ingredients by type
  const categorizedIngredients = categorizeIngredients(availableIngredients)
  
  // Find the key ingredient (primary protein)
  const keyIngredient = findKeyIngredient(categorizedIngredients)
  
  if (!keyIngredient) {
    return []
  }
  
  // Find complete recipes that use this key ingredient from all cuisines
  const keyIngredientRecipes = allRecipes.filter(recipe => 
    recipe.ingredients && recipe.ingredients.includes(keyIngredient.id) &&
    recipe.ingredientsWithAmounts && 
    recipe.instructions && 
    Array.isArray(recipe.ingredientsWithAmounts) && 
    Array.isArray(recipe.instructions) &&
    recipe.ingredientsWithAmounts.length > 0 &&
    recipe.instructions.length > 0
  )
  
  if (keyIngredientRecipes.length > 0) {
    return keyIngredientRecipes
  }
  
  // Fallback: return any random recipe from all cuisines
  const randomRecipe = getRandomRecipeFromAll()
  return randomRecipe ? [randomRecipe] : []
}

// Function to search recipes by name from all available cuisines
export const searchRecipesFromAll = (searchTerm) => {
  const currentLanguage = i18n.language || 'en'
  const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
  const culturalRecipes = recipes.cultural || {}
  
  if (!searchTerm || searchTerm.trim() === '') {
    return []
  }
  
  const searchLower = searchTerm.toLowerCase()
  
  // Collect all complete recipes from all cuisines that match search term
  const matchingRecipes = []
  
  Object.entries(culturalRecipes).forEach(([cuisineName, cuisineRecipes]) => {
    if (Array.isArray(cuisineRecipes)) {
      cuisineRecipes.forEach(recipe => {
        // Check if recipe is complete
        if (recipe.ingredientsWithAmounts && 
            recipe.instructions && 
            Array.isArray(recipe.ingredientsWithAmounts) && 
            Array.isArray(recipe.instructions) &&
            recipe.ingredientsWithAmounts.length > 0 &&
            recipe.instructions.length > 0) {
          
          // Search in: recipe name, cuisine name, and ingredients
          const nameMatch = recipe.name && recipe.name.toLowerCase().includes(searchLower)
          const cuisineMatch = cuisineName.toLowerCase().includes(searchLower)
          
          // Search in ingredients (both ingredient names and amounts)
          const ingredientMatch = recipe.ingredientsWithAmounts.some(ing => {
            const ingredientText = typeof ing === 'string' ? ing : (ing.ingredient || '')
            return ingredientText.toLowerCase().includes(searchLower)
          })
          
          if (nameMatch || cuisineMatch || ingredientMatch) {
            matchingRecipes.push({
              ...recipe,
              cuisine: cuisineName // Add cuisine info to the recipe
            })
          }
        }
      })
    }
  })
  
  return matchingRecipes
}

// Get all cultural dishes for Parties page
export const getAllCulturalDishes = () => {
  const currentLanguage = i18n.language || 'en'
  const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
  const culturalRecipes = recipes.cultural || {}
  
  const culturalDishes = {}
  Object.entries(culturalRecipes).forEach(([cuisine, recipes]) => {
    if (Array.isArray(recipes)) {
      recipes.forEach(recipe => {
        // Only include complete recipes
        if (recipe.ingredientsWithAmounts && 
            recipe.instructions && 
            Array.isArray(recipe.ingredientsWithAmounts) && 
            Array.isArray(recipe.instructions) &&
            recipe.ingredientsWithAmounts.length > 0 &&
            recipe.instructions.length > 0) {
          culturalDishes[recipe.name] = {
            ingredients: recipe.ingredientsWithAmounts,
            instructions: recipe.instructions,
            prepTime: recipe.prepTime || recipe.cookTime || 'N/A',
            cookTime: recipe.cookTime || 'N/A',
            servings: recipe.servings?.toString() || '4',
            cuisine: cuisine,
            emoji: recipe.emoji || '🍽️'
          }
        }
      })
    }
  })
  
  return culturalDishes
}

// REACTIVE VERSION - Get cultural dishes
export const useCulturalDishes = () => {
  const recipes = useRecipes()
  const culturalRecipes = recipes.cultural || {}
  
  const culturalDishes = {}
  Object.entries(culturalRecipes).forEach(([cuisine, recipes]) => {
    if (Array.isArray(recipes)) {
      recipes.forEach(recipe => {
        // Only include complete recipes
        if (recipe.ingredientsWithAmounts && 
            recipe.instructions && 
            Array.isArray(recipe.ingredientsWithAmounts) && 
            Array.isArray(recipe.instructions) &&
            recipe.ingredientsWithAmounts.length > 0 &&
            recipe.instructions.length > 0) {
          culturalDishes[recipe.name] = {
            ingredients: recipe.ingredients,
            ingredientsWithAmounts: recipe.ingredientsWithAmounts,
            instructions: recipe.instructions,
            prepTime: recipe.prepTime || recipe.cookTime || 'N/A',
            cookTime: recipe.cookTime || 'N/A',
            servings: recipe.servings?.toString() || '4',
            cuisine: cuisine,
            emoji: recipe.emoji || '🍽️'
          }
        }
      })
    }
  })
  
  return culturalDishes
}

// REACTIVE VERSION - Get merged recipes (cultural + basic)
export const useMergedRecipes = () => {
  const recipes = useRecipes()
  const culturalDishes = useCulturalDishes()
  const merged = { ...recipes.basic }
  merged['Cultural Dishes'] = culturalDishes
  return merged
}

// Legacy non-reactive version
export const getMergedRecipes = () => {
  const currentLanguage = i18n.language || 'en'
  const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
  const merged = { ...recipes.basic }
  merged['Cultural Dishes'] = getAllCulturalDishes()
  return merged
}