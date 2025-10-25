import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n.js'
import IngredientCheckbox from '../components/IngredientCheckbox.jsx'
import { getIngredientMetadata } from '../data/ingredientRegistry.js'
import { 
  getAllRecipes,
  getRecipesByCuisine,
  getRecipesByCategory,
  searchRecipes
} from '../data/recipeLoader'
// AI service imports removed - using recipe database directly
import { 
  getCuisineTranslation, 
  getCookingMethodTranslation, 
  getCookingTimeTranslation, 
  getDifficultyTranslation 
} from '../utils/recipeTranslations.js'

// Data structure functions for parties page
const useIngredientCategories = () => {
  return [
    { value: 'meat', label: 'Meat', emoji: '🥩' },
    { value: 'seafood', label: 'Seafood', emoji: '🦞' },
    { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
    { value: 'grains', label: 'Grains', emoji: '🍚' },
    { value: 'egg', label: 'Egg', emoji: '🥚' }
  ]
}

const useTastePreferences = () => {
  return [
    { value: 'rich', label: 'Rich', emoji: '🍯' },
    { value: 'spicy', label: 'Spicy', emoji: '🌶️' },
    { value: 'sweet', label: 'Sweet', emoji: '🍯' },
    { value: 'sour', label: 'Sour', emoji: '🍋' },
    { value: 'salty', label: 'Salty', emoji: '🧂' },
    { value: 'mild', label: 'Mild', emoji: '🌿' }
  ]
}

const useCuisineStyles = () => {
  // Get actual cuisines from recipe data
  const allRecipes = getAllRecipes()
  const cuisines = [...new Set(allRecipes.map(recipe => recipe.region?.en || recipe.region?.zh || recipe.region?.sv))]
  
  // Cuisine styles with proper flags and colors for the new structure
  const cuisineStyles = {
    'Africa': { emoji: '🍲', flag: '🌍' },
    'Asia': { emoji: '🍜', flag: '🌏' },
    'Europe': { emoji: '🥖', flag: '🇪🇺' },
    'Latin America': { emoji: '🌽', flag: '🇲🇽' },
    'Middle East': { emoji: '🥙', flag: '🇱🇧' },
    'North America': { emoji: '🍔', flag: '🇺🇸' },
    'South America': { emoji: '🌽', flag: '🇧🇷' }
  }
  
  // Convert to the format expected by the component
  const cuisineOptions = cuisines.map(cuisine => ({
    value: cuisine.toLowerCase().replace(/\s+/g, '_'),
    label: cuisine,
    emoji: cuisineStyles[cuisine]?.emoji || '🍽️',
    flag: cuisineStyles[cuisine]?.flag || '🌍'
  }))
  
  // Add "Mixed" option at the beginning
  return [
    { value: 'mixed', label: 'Mixed', emoji: '🌍', flag: '🌍' },
    ...cuisineOptions
  ]
}

const useDiningScenarios = () => {
  return [
    { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { value: 'friends', label: 'Friends', emoji: '👥' },
    { value: 'romantic', label: 'Romantic', emoji: '💕' }
  ]
}

// Helper function to get the correct emoji based on the recipe's main_type
const getCategoryEmoji = (recipe, language = 'en') => {
  // Use the main_type field directly from the recipe database
  const mainType = recipe.main_type?.en || recipe.main_type?.[language] || recipe.main_type
  
  console.log(`🔍 Emoji Debug - Recipe: ${recipe.dish_name?.en || recipe.name}`)
  console.log(`🔍 Emoji Debug - Main type: ${mainType}`)
  
  // Map main_type to appropriate emoji
  const emojiMap = {
    'Meat': '🥩',
    'Seafood': '🦞', 
    'Vegetable': '🥬',
    'Grain': '🍚',
    'Egg': '🥚'
  }
  
  const emoji = emojiMap[mainType] || '🍽️'
  console.log(`🔍 Emoji Debug - Selected emoji: ${emoji} for main_type: ${mainType}`)
  
  return emoji
}

// Helper function to check if a recipe belongs to a category based on its primary ingredients
const isRecipeInCategory = (recipe, category, language = 'en') => {
  // Get ingredients for the current language, fallback to English
  const currentLanguage = language || 'en'
  const ingredients = recipe.ingredients?.[currentLanguage] || recipe.ingredients?.en || []
  
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return false
  }
  
  // Count ingredients by category
  const categoryCounts = {
    meat: 0,
    seafood: 0,
    vegetables: 0,
    grains: 0,
    egg: 0
  }
  
  // Count how many ingredients belong to each category
  ingredients.forEach(ingredient => {
    if (isIngredientInCategory(ingredient, 'meat')) categoryCounts.meat++
    if (isIngredientInCategory(ingredient, 'seafood')) categoryCounts.seafood++
    if (isIngredientInCategory(ingredient, 'vegetables')) categoryCounts.vegetables++
    if (isIngredientInCategory(ingredient, 'grains')) categoryCounts.grains++
    if (isIngredientInCategory(ingredient, 'egg')) categoryCounts.egg++
  })
  
  // Determine the primary category based on the highest count
  // In case of ties, prioritize: meat > seafood > vegetables > grains > egg
  const categoryPriority = { meat: 5, seafood: 4, vegetables: 3, grains: 2, egg: 1 }
  
  // Find the category with the highest count
  let maxCount = 0
  let primaryCategory = 'vegetables' // default fallback
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count
      primaryCategory = category
    } else if (count === maxCount) {
      // Tie-breaker: use priority order
      if (categoryPriority[category] > categoryPriority[primaryCategory]) {
        primaryCategory = category
      }
    }
  })
  
  // Special logic: if we have any meat/seafood ingredients, prioritize them over vegetables
  // This handles cases like "Pork Ribs with Black Bean Sauce" where meat should win over vegetables
  if (categoryCounts.meat > 0 && categoryCounts.vegetables > 0 && categoryCounts.meat >= categoryCounts.vegetables) {
    primaryCategory = 'meat'
  }
  if (categoryCounts.seafood > 0 && categoryCounts.vegetables > 0 && categoryCounts.seafood >= categoryCounts.vegetables) {
    primaryCategory = 'seafood'
  }
  
  // Only return true if this is the PRIMARY category (highest count)
  // This ensures each recipe is only assigned to one category
  const result = primaryCategory === category
  
  // Debug logging for specific recipes
  if (recipe.name && (recipe.name.includes('buddha') || recipe.name.includes('teriyaki') || recipe.name.includes('clam') || recipe.name.includes('hunan'))) {
    console.log(`🔍 Debug - ${recipe.name}:`, {
      categoryCounts,
      primaryCategory,
      requestedCategory: category,
      result
    })
  }
  
  return result
}

// Helper function to check if an ingredient belongs to a category using pattern matching
const isIngredientInCategory = (ingredientString, category) => {
  // Handle different ingredient formats
  let cleanIngredientId = ''
  
  if (typeof ingredientString === 'string') {
    // If it contains a translation key, extract the ingredient part
    if (ingredientString.includes('ingredient.')) {
      const match = ingredientString.match(/ingredient\.([^\s]+)/)
      if (match) {
        cleanIngredientId = match[1].replace(/_/g, ' ').toLowerCase()
      } else {
        cleanIngredientId = ingredientString.replace('ingredient.', '').toLowerCase()
      }
    } else if (ingredientString.includes(' ')) {
      // Format: "1 lb pork chops, cubed" - extract the ingredient name
      const parts = ingredientString.split(' ')
      if (parts.length >= 3) {
        // Skip first two parts (amount and unit), take the rest
        cleanIngredientId = parts.slice(2).join(' ').replace(',', '').toLowerCase()
      } else if (parts.length === 2) {
        // Handle cases like "Whole Chicken" or "Pork Ribs" - take both parts
        cleanIngredientId = parts.join(' ').toLowerCase()
      } else {
        cleanIngredientId = ingredientString.toLowerCase()
      }
    } else {
      cleanIngredientId = ingredientString.toLowerCase()
    }
  } else {
    cleanIngredientId = String(ingredientString).toLowerCase()
  }
  
  // First try the ingredient registry
  let metadata = getIngredientMetadata(cleanIngredientId)
  if (metadata) {
    switch (category) {
      case 'meat':
        return metadata.category === 'Meat'
      case 'seafood':
        return metadata.category === 'Seafood'
      case 'vegetables':
        return metadata.category === 'Vegetables'
      case 'grains':
        return metadata.category === 'Grains' || metadata.category === 'Staples'
      case 'egg':
        return cleanIngredientId.includes('egg')
      default:
        return false
    }
  }
  
  // If not in registry, use pattern matching
  switch (category) {
    case 'meat':
      return cleanIngredientId.includes('chicken') || 
             cleanIngredientId.includes('pork') || 
             cleanIngredientId.includes('beef') || 
             cleanIngredientId.includes('lamb') || 
             cleanIngredientId.includes('duck') || 
             cleanIngredientId.includes('turkey') ||
             cleanIngredientId.includes('bacon') ||
             cleanIngredientId.includes('ham') ||
             cleanIngredientId.includes('sausage') ||
             cleanIngredientId.includes('steak') ||
             cleanIngredientId.includes('chop') ||
             cleanIngredientId.includes('rib') ||
             cleanIngredientId.includes('ribs') ||
             cleanIngredientId.includes('tenderloin') ||
             cleanIngredientId.includes('breast') ||
             cleanIngredientId.includes('thigh') ||
             cleanIngredientId.includes('wing') ||
             cleanIngredientId.includes('ground') ||
             // Chinese meat terms
             cleanIngredientId.includes('排骨') || // pork ribs
             cleanIngredientId.includes('猪肉') || // pork
             cleanIngredientId.includes('牛肉') || // beef
             cleanIngredientId.includes('鸡肉') || // chicken
             cleanIngredientId.includes('羊肉') || // lamb
             cleanIngredientId.includes('鸭肉') || // duck
             cleanIngredientId.includes('肉') || // meat (general)
             cleanIngredientId.includes('培根') || // bacon
             cleanIngredientId.includes('火腿') || // ham
             cleanIngredientId.includes('香肠') // sausage
             
    case 'seafood':
      return cleanIngredientId.includes('fish') || 
             cleanIngredientId.includes('salmon') || 
             cleanIngredientId.includes('tuna') || 
             cleanIngredientId.includes('shrimp') || 
             cleanIngredientId.includes('crab') || 
             cleanIngredientId.includes('lobster') ||
             cleanIngredientId.includes('clam') ||
             cleanIngredientId.includes('mussel') ||
             cleanIngredientId.includes('oyster') ||
             cleanIngredientId.includes('scallop') ||
             cleanIngredientId.includes('squid') ||
             cleanIngredientId.includes('octopus') ||
             cleanIngredientId.includes('seabass') ||
             cleanIngredientId.includes('cod') ||
             cleanIngredientId.includes('halibut') ||
             cleanIngredientId.includes('seafood')
             
    case 'vegetables':
      return cleanIngredientId.includes('onion') || 
             cleanIngredientId.includes('garlic') || 
             cleanIngredientId.includes('tomato') || 
             cleanIngredientId.includes('pepper') || 
             cleanIngredientId.includes('carrot') || 
             cleanIngredientId.includes('celery') ||
             cleanIngredientId.includes('cabbage') ||
             cleanIngredientId.includes('lettuce') ||
             cleanIngredientId.includes('spinach') ||
             cleanIngredientId.includes('broccoli') ||
             cleanIngredientId.includes('cauliflower') ||
             cleanIngredientId.includes('mushroom') ||
             cleanIngredientId.includes('potato') ||
             cleanIngredientId.includes('sweetpotato') ||
             cleanIngredientId.includes('bean') ||
             cleanIngredientId.includes('pea') ||
             cleanIngredientId.includes('corn') ||
             cleanIngredientId.includes('cucumber') ||
             cleanIngredientId.includes('zucchini') ||
             cleanIngredientId.includes('eggplant') ||
             cleanIngredientId.includes('olive') ||
             cleanIngredientId.includes('lemon') ||
             cleanIngredientId.includes('lime') ||
             cleanIngredientId.includes('ginger') ||
             cleanIngredientId.includes('bamboo') ||
             cleanIngredientId.includes('sprout') ||
             cleanIngredientId.includes('herb') ||
             cleanIngredientId.includes('basil') ||
             cleanIngredientId.includes('parsley') ||
             cleanIngredientId.includes('cilantro') ||
             cleanIngredientId.includes('thyme') ||
             cleanIngredientId.includes('oregano') ||
             cleanIngredientId.includes('rosemary') ||
             cleanIngredientId.includes('sage') ||
             cleanIngredientId.includes('mint') ||
             cleanIngredientId.includes('dill') ||
             cleanIngredientId.includes('chive') ||
             cleanIngredientId.includes('scallion') ||
             cleanIngredientId.includes('greenonion') ||
             cleanIngredientId.includes('shallot') ||
             cleanIngredientId.includes('leek') ||
             cleanIngredientId.includes('radish') ||
             cleanIngredientId.includes('turnip') ||
             cleanIngredientId.includes('beet') ||
             cleanIngredientId.includes('asparagus') ||
             cleanIngredientId.includes('artichoke') ||
             cleanIngredientId.includes('avocado') ||
             cleanIngredientId.includes('squash') ||
             cleanIngredientId.includes('pumpkin') ||
             cleanIngredientId.includes('kale') ||
             cleanIngredientId.includes('chard') ||
             cleanIngredientId.includes('arugula') ||
             cleanIngredientId.includes('endive') ||
             cleanIngredientId.includes('fennel') ||
             cleanIngredientId.includes('parsnip') ||
             cleanIngredientId.includes('rutabaga') ||
             cleanIngredientId.includes('jicama') ||
             cleanIngredientId.includes('daikon') ||
             cleanIngredientId.includes('bokchoy') ||
             cleanIngredientId.includes('napa') ||
             cleanIngredientId.includes('watercress') ||
             cleanIngredientId.includes('arugula')
             
    case 'grains':
      return cleanIngredientId.includes('rice') || 
             cleanIngredientId.includes('noodle') || 
             cleanIngredientId.includes('pasta') || 
             cleanIngredientId.includes('bread') || 
             cleanIngredientId.includes('flour') || 
             cleanIngredientId.includes('wheat') ||
             cleanIngredientId.includes('oats') ||
             cleanIngredientId.includes('barley') ||
             cleanIngredientId.includes('quinoa') ||
             cleanIngredientId.includes('couscous') ||
             cleanIngredientId.includes('bulgur') ||
             cleanIngredientId.includes('millet') ||
             cleanIngredientId.includes('buckwheat') ||
             cleanIngredientId.includes('rye') ||
             cleanIngredientId.includes('cornmeal') ||
             cleanIngredientId.includes('polenta') ||
             cleanIngredientId.includes('tortilla') ||
             cleanIngredientId.includes('wrap') ||
             cleanIngredientId.includes('pita') ||
             cleanIngredientId.includes('naan') ||
             cleanIngredientId.includes('bagel') ||
             cleanIngredientId.includes('muffin') ||
             cleanIngredientId.includes('cracker') ||
             cleanIngredientId.includes('cereal') ||
             cleanIngredientId.includes('granola') ||
             cleanIngredientId.includes('hominy') ||
             cleanIngredientId.includes('grits')
             
    case 'egg':
      return cleanIngredientId.includes('egg')
      
    default:
      return false
  }
}

// Recipe generator using the existing recipe database
const generatePartyRecipes = async (selections, language) => {
  console.log('🔍 Debug - Using recipe database for selections:', selections)
  
  try {
    // Map ingredient categories to recipe main_type values
    const categoryMapping = {
      'meat': 'Meat',
      'seafood': 'Seafood', 
      'vegetables': 'Vegetable',
      'grains': 'Grain',
      'egg': 'Egg'
    }
    
    const allRecipes = getAllRecipes()
    const generatedDishes = []
    
    // Get the actual number of filled plates
    const filledPlates = selections.dishCategories || []
    const selectedCuisine = selections.cuisineStyle
    
    console.log('🔍 Debug - filledPlates:', filledPlates)
    console.log('🔍 Debug - selectedCuisine:', selectedCuisine)
    console.log('🔍 Debug - total recipes available:', allRecipes.length)
    
    for (const plate of filledPlates) {
      if (plate && plate.value) {
        // Map ingredient category to recipe main_type
        const recipeCategory = categoryMapping[plate.value]
        
        console.log(`🔍 Debug - Mapping ${plate.value} to ${recipeCategory}`)
        
        if (recipeCategory) {
          // First get recipes by category
          let categoryRecipes = getRecipesByCategory(recipeCategory)
          
          console.log(`🔍 Debug - Found ${categoryRecipes.length} recipes for ${recipeCategory}`)
          
          // Apply cuisine filtering if not "mixed"
          if (selectedCuisine && selectedCuisine !== 'mixed') {
            const cuisineRecipes = getRecipesByCuisine(selectedCuisine)
            console.log(`🔍 Debug - Found ${cuisineRecipes.length} recipes for cuisine: ${selectedCuisine}`)
            
            // Filter category recipes by cuisine
            categoryRecipes = categoryRecipes.filter(recipe => 
              cuisineRecipes.some(cuisineRecipe => cuisineRecipe.id === recipe.id)
            )
            
            console.log(`🔍 Debug - After cuisine filtering: ${categoryRecipes.length} recipes`)
          }
          
          if (categoryRecipes.length > 0) {
            // Shuffle and select a random recipe
            const shuffled = [...categoryRecipes].sort(() => Math.random() - 0.5)
            const selectedRecipe = shuffled[0]
            generatedDishes.push(selectedRecipe)
            console.log(`🔍 Debug - Selected recipe: ${selectedRecipe.dish_name?.en || selectedRecipe.name} (Region: ${selectedRecipe.region?.en})`)
          } else {
            console.log(`⚠️ Warning - No recipes found for category: ${recipeCategory} with cuisine: ${selectedCuisine}`)
          }
        } else {
          console.log(`⚠️ Warning - No mapping found for category: ${plate.value}`)
        }
      }
    }
    
    console.log('🔍 Debug - Final generated dishes count:', generatedDishes.length)
    console.log('🔍 Debug - Generated dishes:', generatedDishes.map(d => `${d.dish_name?.en || d.name} (${d.region?.en})`))
    
    if (generatedDishes.length === 0) {
      console.log('⚠️ Warning - No dishes generated! This might be the issue.')
    }
    
    return generatedDishes
    
  } catch (error) {
    console.error('❌ Error generating recipes:', error)
    return []
  }
}

const regenerateSingleDish = async (category, otherDishes, selectedCuisine, selectedTastes, language) => {
  console.log('🔍 Debug - Using recipe database for single dish regeneration')
  console.log('🔍 Debug - selectedCuisine:', selectedCuisine)
  
  try {
    // Map ingredient categories to recipe main_type values
    const categoryMapping = {
      'meat': 'Meat',
      'seafood': 'Seafood', 
      'vegetables': 'Vegetable',
      'grains': 'Grain',
      'egg': 'Egg'
    }
    
    // Map the category value to recipe main_type
    const recipeCategory = categoryMapping[category.value]
    
    if (!recipeCategory) {
      console.log(`⚠️ Warning - No mapping found for category: ${category.value}`)
      return null
    }
    
    console.log(`🔍 Debug - Mapping ${category.value} to ${recipeCategory}`)
    
    // Get recipes for this category
    let categoryRecipes = getRecipesByCategory(recipeCategory)
    
    console.log(`🔍 Debug - Found ${categoryRecipes.length} recipes for ${recipeCategory}`)
    
    // Apply cuisine filtering if not "mixed"
    if (selectedCuisine && selectedCuisine !== 'mixed') {
      const cuisineRecipes = getRecipesByCuisine(selectedCuisine)
      console.log(`🔍 Debug - Found ${cuisineRecipes.length} recipes for cuisine: ${selectedCuisine}`)
      
      // Filter category recipes by cuisine
      categoryRecipes = categoryRecipes.filter(recipe => 
        cuisineRecipes.some(cuisineRecipe => cuisineRecipe.id === recipe.id)
      )
      
      console.log(`🔍 Debug - After cuisine filtering: ${categoryRecipes.length} recipes`)
    }
    
    if (categoryRecipes.length === 0) {
      console.log(`⚠️ Warning - No recipes found for category: ${recipeCategory} with cuisine: ${selectedCuisine}`)
      return null
    }
    
    // Filter out recipes that are already in otherDishes to avoid duplicates
    const otherDishIds = otherDishes.map(dish => dish.id)
    const availableRecipes = categoryRecipes.filter(recipe => 
      !otherDishIds.includes(recipe.id)
    )
    
    // If no unique recipes available, use all category recipes
    const recipesToChooseFrom = availableRecipes.length > 0 ? availableRecipes : categoryRecipes
    
    // Return a random recipe from the available recipes
    const randomIndex = Math.floor(Math.random() * recipesToChooseFrom.length)
    const selectedRecipe = recipesToChooseFrom[randomIndex]
    
    console.log(`🔍 Debug - Selected recipe: ${selectedRecipe.dish_name?.en || selectedRecipe.name} (Region: ${selectedRecipe.region?.en})`)
    return selectedRecipe
    
  } catch (error) {
    console.error('❌ Error regenerating single dish:', error)
    return null
  }
}

function Parties() {
  const { t, i18n } = useTranslation()

  // Get party data from proper data structure
  const ingredientCategories = useIngredientCategories()
  const tastePreferences = useTastePreferences()
  const cuisineStyles = useCuisineStyles()
  const diningScenarios = useDiningScenarios()
  
  // State management with plate system
  const [numberOfDishes, setNumberOfDishes] = useState(4)
  const [dishCategories, setDishCategories] = useState(
    [
      { value: 'meat', label: 'Meat', emoji: '🥩' },      // Plate 1: Meat
      { value: 'meat', label: 'Meat', emoji: '🥩' },      // Plate 2: Meat  
      { value: 'seafood', label: 'Seafood', emoji: '🦞' }, // Plate 3: Seafood
      { value: 'vegetables', label: 'Vegetables', emoji: '🥬' }, // Plate 4: Vegetables
      null, null, null, null, null, null  // Remaining plates empty
    ]
  )
  const [selectedTastes, setSelectedTastes] = useState(['rich'])
  const [selectedCuisine, setSelectedCuisine] = useState('mixed')
  const [selectedScenario, setSelectedScenario] = useState('friends')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showTemporaryFeedback, setShowTemporaryFeedback] = useState(false)
  
  // Generated dishes
  const [generatedDishes, setGeneratedDishes] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [regeneratingDishIndex, setRegeneratingDishIndex] = useState(null)
  
  // Recipe modal
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  
  // Shopping list modal
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState(new Set())
  
  // Phone number functionality
  const [quickSMSNumber, setQuickSMSNumber] = useState('')
  const [savedNumbers, setSavedNumbers] = useState([])
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false)
  
  // Ref for scrolling to generated dishes
  const dishProposalRef = useRef(null)
  
  // Scroll to generated dishes when they're created
  useEffect(() => {
    if (generatedDishes && dishProposalRef.current) {
      // Longer delay to ensure the component is fully rendered
      setTimeout(() => {
        // Double-check that the ref is still valid after the timeout
        if (dishProposalRef.current) {
        dishProposalRef.current.scrollIntoView({ 
          behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        })
        }
      }, 500) // Increased delay to 500ms
    }
  }, [generatedDishes])

  // Always reinitialize checkboxes when shopping list is opened (all checked by default)
  useEffect(() => {
    console.log('🔍 Shopping List Debug - useEffect triggered')
    console.log('🔍 Shopping List Debug - showShoppingList:', showShoppingList)
    console.log('🔍 Shopping List Debug - generatedDishes:', generatedDishes)
    
    if (showShoppingList && generatedDishes) {
      console.log('🔍 Shopping List Debug - Initializing checkboxes')
      initializeIngredientCheckboxes(generatedDishes.dishes)
    }
  }, [showShoppingList, generatedDishes])

  // Clear state when language changes to prevent mixing
  useEffect(() => {
    setSelectedTastes(['rich'])
    setSelectedCuisine('mixed')
    setSelectedScenario('friends')
    setDishCategories([
      { value: 'meat', label: 'Meat', emoji: '🥩' },
      { value: 'meat', label: 'Meat', emoji: '🥩' },
      { value: 'seafood', label: 'Seafood', emoji: '🦞' },
      { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
      null, null, null, null, null, null
    ])
    setGeneratedDishes(null)
    setSelectedRecipe(null)
    setShowShoppingList(false)
    setSelectedCategory(null)
    setRegeneratingDishIndex(null)
    setShowTemporaryFeedback(false)
  }, [i18n.language])

  // Clear temporary feedback when plates change
  useEffect(() => {
    const filledPlates = dishCategories.filter(cat => cat !== null).length
    const totalPlates = numberOfDishes
    const allPlatesFull = filledPlates >= totalPlates && totalPlates > 0
    
    if (!allPlatesFull && showTemporaryFeedback) {
      setShowTemporaryFeedback(false)
    }
  }, [dishCategories, numberOfDishes, showTemporaryFeedback])

  // Load saved phone numbers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedPhoneNumbers')
    if (saved) {
      try {
        setSavedNumbers(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved phone numbers:', error)
      }
    }
  }, [])

  // Single-click handlers for plate system
  const handleCategoryClick = (category) => {
    // Check if all plates are full
    const filledPlates = dishCategories.filter(cat => cat !== null).length
    const totalPlates = numberOfDishes
    
    if (filledPlates >= totalPlates) {
      // All plates are full, show temporary feedback for 5 seconds
      setShowTemporaryFeedback(true)
      setTimeout(() => {
        setShowTemporaryFeedback(false)
      }, 5000)
      return
    }
    
    // When an ingredient is clicked, store it as selected
    setSelectedCategory(category)
    
    // Find the first empty plate and assign the category
    const newCategories = [...dishCategories]
    const emptyPlateIndex = newCategories.findIndex(cat => cat === null)
    
    if (emptyPlateIndex !== -1) {
      newCategories[emptyPlateIndex] = category
      setDishCategories(newCategories)
      setSelectedCategory(null) // Reset selection after adding
    } else {
      // This shouldn't happen with the check above, but just in case
      alert(t('parties.noEmptyPlates', 'All plates are full! Click on a plate to replace its ingredient.'))
    }
  }

  const handlePlateClick = (plateIndex) => {
    const newCategories = [...dishCategories]
    
    if (newCategories[plateIndex] !== null) {
      // If plate has an ingredient, remove it
      newCategories[plateIndex] = null
      setDishCategories(newCategories)
    } else if (selectedCategory) {
      // If plate is empty and there's a selected category, add it
      newCategories[plateIndex] = selectedCategory
      setDishCategories(newCategories)
      setSelectedCategory(null)
    }
  }

  // Taste preference handlers
  const handleTasteToggle = (taste) => {
    setSelectedTastes(prev => 
      prev.includes(taste) 
        ? prev.filter(t => t !== taste)
        : [...prev, taste]
    )
  }

  // Initialize ingredient checkboxes when dishes are generated (simple Set approach)
  const initializeIngredientCheckboxes = (dishes) => {
    const ingredientSet = new Set()
    
    // Collect all unique ingredient names
    dishes.forEach((dish) => {
      const currentLanguage = i18n.language || 'en'
      const ingredients = dish.ingredients?.[currentLanguage] || dish.ingredients?.en || []
      if (Array.isArray(ingredients) && ingredients.length > 0) {
        ingredients.forEach(ingredientString => {
          // Extract ingredient name from string like "1 lb pork chops, cubed"
          // or handle translation keys like "2 ingredient.bell_peppers_sliced"
          let ingredientName = ingredientString
          
          if (typeof ingredientString === 'string') {
            // If it contains a translation key, extract the ingredient part
            if (ingredientString.includes('ingredient.')) {
              const match = ingredientString.match(/ingredient\.([^\s]+)/)
              if (match) {
                ingredientName = match[1].replace(/_/g, ' ')
              }
            } else {
              // Extract ingredient name from amount string like "1 lb pork chops, cubed"
              const parts = ingredientString.split(' ')
              if (parts.length >= 3) {
                // Skip amount and unit, take the rest
                ingredientName = parts.slice(2).join(' ').replace(',', '').trim()
              } else if (parts.length === 2) {
                // Handle cases like "Whole Chicken"
                ingredientName = parts.join(' ')
              }
            }
          }
          
          ingredientSet.add(ingredientName)
        })
      }
    })
    
    console.log('🔍 Shopping List Debug - Initialized ingredients:', Array.from(ingredientSet))
    setCheckedIngredients(ingredientSet) // All ingredients start checked
  }

  // Handle checkbox toggle for ingredients (simple Set operation)
  const toggleIngredient = (ingredient) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev)
      if (newSet.has(ingredient)) {
        newSet.delete(ingredient)
      } else {
        newSet.add(ingredient)
      }
      return newSet
    })
  }

  // Phone number management functions
  const savePhoneNumber = (number) => {
    if (number && !savedNumbers.includes(number)) {
      const updated = [...savedNumbers, number]
      setSavedNumbers(updated)
      localStorage.setItem('savedPhoneNumbers', JSON.stringify(updated))
    }
  }

  const removePhoneNumber = (number) => {
    const updated = savedNumbers.filter(n => n !== number)
    setSavedNumbers(updated)
    localStorage.setItem('savedPhoneNumbers', JSON.stringify(updated))
  }

  const sendQuickSMS = (phoneNumber) => {
    const smsBody = createShoppingListText()
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(smsBody)}`
    setShowPhoneDropdown(false) // Hide dropdown after sending
    window.location.href = smsUrl
  }

  // Generate dishes using AI
  const handleGenerateDishes = async () => {
    setIsGenerating(true)
    
    try {
      // Get the actual number of filled plates
      const filledPlates = dishCategories.filter(cat => cat !== null)
      const actualNumberOfDishes = filledPlates.length
      
      if (actualNumberOfDishes === 0) {
        alert(t('parties.noIngredientsSelected', 'Please select at least one ingredient category for your plates before generating dishes.'))
        setIsGenerating(false)
        return
      }
      
      const selections = {
        dishCategories: filledPlates, // Pass the full category objects, not just values
        tastePreferences: selectedTastes,
        cuisineStyle: selectedCuisine,
        diningScenario: selectedScenario,
        numberOfDishes: actualNumberOfDishes
      }

      console.log('🔍 Debug - dishCategories state:', dishCategories)
      console.log('🔍 Debug - filledPlates:', filledPlates)
      console.log('🔍 Debug - actualNumberOfDishes:', actualNumberOfDishes)
      console.log('🔍 Debug - selections:', selections)
      
      console.log('🔍 Debug - About to call generatePartyRecipes...')
      const recipes = await generatePartyRecipes(selections, i18n.language)
      console.log('🔍 Debug - generatePartyRecipes returned:', recipes)
      
      setGeneratedDishes({
        dishes: recipes,
        selections: selections,
        generatedAt: new Date().toISOString()
      })
      
      // Initialize checkboxes for all ingredients (default checked)
      initializeIngredientCheckboxes(recipes)
      
      // Trigger immediate scroll after a short delay
      setTimeout(() => {
        if (dishProposalRef.current) {
          dishProposalRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 200)
      
    } catch (error) {
      console.error('❌ Error generating recipes:', error)
      alert('Failed to generate recipes. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Regenerate a single dish
  const handleRegenerateSingleDish = async (dishIndex) => {
    if (!generatedDishes) return
    
    setRegeneratingDishIndex(dishIndex)
    
    try {
      const category = generatedDishes.selections.dishCategories[dishIndex]
      if (!category) return

      // Get all other dishes (excluding the one being regenerated)
      const otherDishes = generatedDishes.dishes.filter((_, index) => index !== dishIndex)
      
      // Generate a new recipe that doesn't duplicate existing dishes
      const newRecipe = await regenerateSingleDish(
        category,
        otherDishes,
        selectedCuisine,
        selectedTastes,
        i18n.language
      )
      
      if (newRecipe) {
    const updatedDishes = [...generatedDishes.dishes]
        updatedDishes[dishIndex] = newRecipe
    
    setGeneratedDishes({
      ...generatedDishes,
      dishes: updatedDishes
    })
        
        // Reinitialize checkboxes to include new ingredients (all checked by default)
        initializeIngredientCheckboxes(updatedDishes)
      } else {
        alert('Unable to generate a unique dish. Please try again.')
      }
      
    } catch (error) {
      console.error('❌ Error regenerating dish:', error)
      alert('Failed to regenerate dish. Please try again.')
    } finally {
      setRegeneratingDishIndex(null)
    }
  }

  // Recipe modal handlers
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe)
  }

  const handleCloseRecipe = () => {
    setSelectedRecipe(null)
  }

  // Shopping list handlers
  const handleShowShoppingList = () => {
    console.log('🔍 Shopping List Debug - Button clicked')
    console.log('🔍 Shopping List Debug - generatedDishes:', generatedDishes)
    console.log('🔍 Shopping List Debug - showShoppingList before:', showShoppingList)
    setShowShoppingList(true)
    console.log('🔍 Shopping List Debug - setShowShoppingList(true) called')
  }

  const handleCloseShoppingList = () => {
    setShowShoppingList(false)
  }

  const createShoppingListText = () => {
    let list = `🍽️ ${t('shoppingList.title')} ${t('shoppingList.for')} ${t('parties.yourCustomMenu')}\n`
    list += `📝 ${t('shoppingList.totalDishes')}: ${generatedDishes.dishes.length}\n\n`
    
    list += `🍳 ${t('shoppingList.menu')}:\n`
    generatedDishes.dishes.forEach((dish, index) => {
      const dishName = typeof dish.name === 'string' && dish.name.startsWith('dish.')
        ? t(`dishes.${dish.name.replace('dish.', '')}`)
        : typeof dish.name === 'string'
          ? dish.name
          : dish.dish_name?.en || dish.name
      list += `${index + 1}. ${getCategoryEmoji(dish)} ${dishName}\n`
    })
    
    list += `\n🛒 ${t('shoppingList.ingredientsNeeded')}:\n`
    
    // Helper function to parse and sum amounts (same as UI)
    const parseAmount = (amountStr) => {
      // Safety check for undefined/null values
      if (!amountStr || typeof amountStr !== 'string') {
        return 0
      }
      // Extract number from amount string (e.g., "3瓣" -> 3, "500g" -> 500)
      const match = amountStr.match(/(\d+(?:\.\d+)?)/)
      return match ? parseFloat(match[1]) : 0
    }
    
    const getUnit = (amountStr) => {
      // Extract unit from amount string (e.g., "3瓣" -> "瓣", "500g" -> "g")
      const match = amountStr.match(/\d+(?:\.\d+)?(.+)/)
      return match ? match[1] : ''
    }
    
    // Group ingredients by name and sum amounts (same logic as UI)
    const ingredientMap = new Map()
    
    generatedDishes.dishes.forEach((dish, dishIndex) => {
      const currentLanguage = i18n.language || 'en'
      const ingredients = dish.ingredients?.[currentLanguage] || dish.ingredients?.en || []
      ingredients.forEach(ingredientString => {
        // Parse ingredient string like "1 lb pork chops, cubed"
        let ingredientName = ingredientString
        let amount = ingredientString
        
        if (typeof ingredientString === 'string') {
          // If it contains a translation key, extract the ingredient part
          if (ingredientString.includes('ingredient.')) {
            const match = ingredientString.match(/ingredient\.([^\s]+)/)
            if (match) {
              ingredientName = match[1].replace(/_/g, ' ')
              // Extract amount from the beginning of the string
              const amountMatch = ingredientString.match(/^(\d+(?:\.\d+)?\s*\w*)/)
              amount = amountMatch ? amountMatch[1] : ingredientString
            }
          } else {
            // Extract ingredient name from amount string like "1 lb pork chops, cubed"
            const parts = ingredientString.split(' ')
            if (parts.length >= 3) {
              // Skip amount and unit, take the rest
              ingredientName = parts.slice(2).join(' ').replace(',', '').trim()
              // Extract just the amount and unit (first two parts)
              amount = parts.slice(0, 2).join(' ')
            } else if (parts.length === 2) {
              // Handle cases like "Whole Chicken"
              ingredientName = parts.join(' ')
              amount = ingredientString
            }
          }
        }
        
        const key = ingredientName
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)
          existing.dishes.push(dishIndex + 1) // 1-based numbering
          // Parse and sum amounts
          const currentAmount = parseAmount(amount)
          const existingAmount = parseAmount(existing.totalAmount)
          const unit = getUnit(amount) || getUnit(existing.totalAmount)
          existing.totalAmount = `${existingAmount + currentAmount}${unit}`
        } else {
          ingredientMap.set(key, {
            ingredient: ingredientName,
            totalAmount: amount,
            dishes: [dishIndex + 1]
          })
        }
      })
    })
    
    // Add consolidated ingredients to list (only checked ones)
    const filteredIngredients = Array.from(ingredientMap.values()).filter(item => {
      return checkedIngredients.has(item.ingredient)
    })
    
        filteredIngredients.forEach((item, index) => {
          const dishList = item.dishes.join(', ')
          list += `• ${item.totalAmount} ${item.ingredient} (${t('shoppingList.forDishes')}: ${dishList})\n`
        })
    
    list += `\n📊 Total items: ${filteredIngredients.length}\n`
    list += `\n📱 Shared from FoodToday App`
    return list
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('parties.title')}</h1>
        <p className="page-subtitle">{t('parties.subtitle')}</p>
      </div>

      <div className="dish-configuration-container">
        <div className="dishes-and-plates-row">
          <div className="dishes-selector-inline">
            <label className="dishes-label">{t('parties.dishes')}</label>
            <select 
              className="dishes-select"
              value={numberOfDishes}
              onChange={(e) => setNumberOfDishes(parseInt(e.target.value))}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div className="plates-display">
            {Array.from({ length: numberOfDishes }).map((_, index) => (
              <div 
                key={index} 
                className={`plate-container ${dishCategories[index] ? 'has-category' : ''}`}
                onClick={() => handlePlateClick(index)}
                style={{ cursor: 'pointer' }}
                title={dishCategories[index] ? "Click to remove ingredient" : "Click an ingredient below to add it"}
              >
                {dishCategories[index] && (
                  <div 
                    className="plate-category-badge"
                    title="Click the plate to remove"
                  >
                    {dishCategories[index].emoji}
                  </div>
                )}
                <div className="plate">🍽️</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="instruction-row" style={{display: 'flex', justifyContent: 'center', marginTop: '0.5rem'}}>
          <p className="instruction-text" style={{fontSize: '0.8rem', color: '#666', fontWeight: 'normal', margin: 0, textAlign: 'center'}}>{t('parties.clickInstruction')}</p>
        </div>

        <div className="common-categories">
          <div className="category-buttons-common">
            {ingredientCategories.map((cat) => (
              <button
                key={cat.value}
                className={`category-btn-common ${selectedCategory?.value === cat.value ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(cat)}
                title={`Click ${cat.label} to add to a plate`}
                style={{ cursor: 'pointer' }}
              >
                {cat.emoji}
                <span className="category-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Visual feedback when all plates are full and user tried to add more */}
        {(() => {
          const filledPlates = dishCategories.filter(cat => cat !== null).length
          const totalPlates = numberOfDishes
          const allPlatesFull = filledPlates >= totalPlates && totalPlates > 0
          
          // Show feedback only if showTemporaryFeedback is true AND all plates are full
          if (showTemporaryFeedback && allPlatesFull) {
            return (
              <div className="plates-full-feedback" style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1.5rem',
                marginBottom: '1rem'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  fontStyle: 'italic',
                  color: '#ff6b35',
                  margin: 0,
                  textAlign: 'center'
                }}>
                  {t('parties.allPlatesFull')}
                </p>
              </div>
            )
          }
          return null
        })()}
      </div>

      {/* Taste Preferences Section */}
      <div className="preferences-section">
        <div className="category-section">
          <h3 className="category-title">👅 {t('parties.tastePreferences')} <span style={{fontSize: '0.75rem', fontStyle: 'italic', color: '#666', fontWeight: 'normal'}}>({t('parties.multiOptional')})</span></h3>
        </div>
        <div className="ingredient-grid-compact">
          {tastePreferences.map((taste) => (
            <div
              key={taste.value}
              className={`ingredient-item-compact sauce-item ${selectedTastes.includes(taste.value) ? 'selected' : ''}`}
              onClick={() => handleTasteToggle(taste.value)}
            >
              <span className="ingredient-name-compact">{taste.emoji} {taste.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cuisine Style Section */}
      <div className="preferences-section">
        <div className="category-section">
          <h3 className="category-title">🌍 {t('parties.cuisineStyle')}</h3>
        </div>
        <div className="ingredient-grid-compact">
          {cuisineStyles.map((cuisine) => (
            <div
              key={cuisine.value}
              className={`ingredient-item-compact sauce-item ${selectedCuisine === cuisine.value ? 'selected' : ''}`}
              onClick={() => setSelectedCuisine(cuisine.value)}
            >
              <span className="ingredient-name-compact">{cuisine.emoji} {cuisine.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dining Scenario Section */}
      <div className="preferences-section">
        <div className="category-section">
          <h3 className="category-title">🎉 {t('parties.diningScenario')}</h3>
        </div>
        <div className="ingredient-grid-compact">
          {diningScenarios.map((scenario) => (
            <div
              key={scenario.value}
              className={`ingredient-item-compact sauce-item ${selectedScenario === scenario.value ? 'selected' : ''}`}
              onClick={() => setSelectedScenario(scenario.value)}
            >
              <span className="ingredient-name-compact">{scenario.emoji} {scenario.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leave to Chef Button */}
      <div className="chef-section">
        <button 
          className="chef-button"
          onClick={handleGenerateDishes}
          disabled={isGenerating || dishCategories.filter(cat => cat !== null).length === 0}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
          }}
        >
          {isGenerating ? (
            <>
              <span className="loading-spinner">⏳</span>
              {t('parties.generating')}
            </>
          ) : (
            <>
              👨‍🍳 {t('parties.generateWithAI')}
            </>
          )}
        </button>
        <p className="chef-description">
          {t('parties.generateInstruction')}
        </p>
      </div>

      {/* Generated Dishes Display */}
      {generatedDishes && (
        <div className="dish-proposal-section" ref={dishProposalRef}>
          <div className="dish-proposal-header">
            <h3 className="dish-proposal-title">
              🍽️ {t('parties.yourCustomMenu')}
            </h3>
            <p className="dish-proposal-subtitle">
              {t('parties.generatedDishes', { 
                count: generatedDishes.dishes.length, 
                scenario: diningScenarios.find(s => s.value === generatedDishes.selections.diningScenario)?.label 
              })}
            </p>
          </div>
          
          <div className="dish-list">
            {generatedDishes.dishes.map((dish, index) => (
              <div key={index} className="dish-item">
                <div className="dish-number">{index + 1}</div>
                <div className="dish-emoji">{getCategoryEmoji(dish) || '🍽️'}</div>
                <div className="dish-details">
                  <div className="dish-name">
                    {typeof dish.name === 'string' && dish.name.startsWith('dish.')
                      ? t(`dishes.${dish.name.replace('dish.', '')}`)
                      : typeof dish.name === 'string'
                        ? dish.name
                        : dish.dish_name?.en || dish.name}
                  </div>
                  {dish.description && (
                    <div className="dish-description">
                      {typeof dish.description === 'string' && dish.description.startsWith('description.')
                        ? t(`descriptions.${dish.description.replace('description.', '')}`)
                        : typeof dish.description === 'string' 
                          ? dish.description 
                          : dish.description?.[i18n.language] || dish.description?.en || dish.description}
                    </div>
                  )}
                  <div className="dish-category">
                    {dish.region?.en && getCuisineTranslation(dish.region.en, i18n.language)}
                    {dish.total_time_min && ` • ${dish.total_time_min} min`}
                    {dish.difficulty?.en && ` • ${dish.difficulty.en}`}
                    {dish.servings && ` • ${dish.servings} servings`}
                  </div>
                </div>
                <div className="dish-actions-inline">
                  <button 
                    className="recipe-button"
                    onClick={() => handleRecipeClick(dish)}
                  >
                    {t('parties.recipe')}
                  </button>
                  <button 
                    className="regenerate-single-btn"
                    onClick={() => handleRegenerateSingleDish(index)}
                    disabled={regeneratingDishIndex === index}
                    title="Regenerate this dish"
                  >
                    {regeneratingDishIndex === index ? '⏳' : '🔄'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="dish-actions-section">
            <button 
              className="regenerate-button"
              onClick={handleGenerateDishes}
              disabled={isGenerating}
            >
              🔄 {t('parties.regenerateAll')}
            </button>
            <button 
              className="shopping-list-button"
              onClick={handleShowShoppingList}
            >
              🛒 {t('button.createShoppingList')}
            </button>
            <button 
              className="clear-button"
              onClick={() => setGeneratedDishes(null)}
            >
              ✕ {t('parties.clear')}
            </button>
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="recipe-modal-overlay">
          <div className="recipe-modal">
            <button 
              className="close-recipe-btn"
              onClick={handleCloseRecipe}
            >
              ✕
            </button>
            <div className="recipe-modal-header">
              <h2>
                {typeof selectedRecipe.name === 'string' && selectedRecipe.name.startsWith('dish.')
                  ? t(`dishes.${selectedRecipe.name.replace('dish.', '')}`)
                  : typeof selectedRecipe.name === 'string'
                    ? selectedRecipe.name
                    : selectedRecipe.dish_name?.en || selectedRecipe.name}
              </h2>
              <div className="recipe-info">
                {selectedRecipe.region?.en && <span>🌍 {getCuisineTranslation(selectedRecipe.region.en, i18n.language)}</span>}
                {selectedRecipe.total_time_min && <span>⏳ Total: {selectedRecipe.total_time_min} min</span>}
                {selectedRecipe.difficulty?.en && <span>📊 {selectedRecipe.difficulty.en}</span>}
                {selectedRecipe.servings && <span>🍽️ {selectedRecipe.servings} servings</span>}
              </div>
            </div>
            
            <div className="recipe-modal-content">
              <div className="recipe-section">
                <h3>📋 {t('parties.ingredients')}</h3>
                <ul className="recipe-ingredients">
                  {(selectedRecipe.ingredients?.[i18n.language] || selectedRecipe.ingredients?.en || []).map((ingredient, index) => {
                    // Handle real recipe database format (array of strings)
                    if (typeof ingredient === 'string' && ingredient.includes(' ')) {
                      // Handle "2 ingredient.bell_peppers_sliced" format - split amount and ingredient
                      const parts = ingredient.split(' ')
                      const amount = parts[0]
                      const ingredientName = parts.slice(1).join(' ')
                      const translatedName = ingredientName?.startsWith('ingredient.')
                        ? t(`ingredients.${ingredientName.replace('ingredient.', '')}`)
                        : ingredientName
                      return (
                        <li key={index}>
                          <span className="ingredient-amount">{amount}</span>
                          <span className="ingredient-name"> {translatedName}</span>
                        </li>
                      )
                    } else {
                      // Handle direct ingredient keys or other formats
                      const displayText = ingredient?.startsWith('ingredient.')
                        ? t(`ingredients.${ingredient.replace('ingredient.', '')}`)
                        : ingredient
                      return (
                        <li key={index}>
                          <span className="ingredient-name">{displayText}</span>
                        </li>
                      )
                    }
                  })}
                </ul>
              </div>
              
              <div className="recipe-section">
                <h3>👨‍🍳 {t('recipe.instructions')}</h3>
                <ol className="recipe-instructions">
                  {(selectedRecipe.steps?.[i18n.language] || selectedRecipe.steps?.en || []).map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingList && generatedDishes && (
        <div className="shopping-list-overlay">
          <div className="shopping-list-modal" style={{ maxHeight: '90vh', overflow: 'auto' }}>
            <div className="shopping-list-header" style={{ position: 'sticky', top: '0', background: 'white', zIndex: 100, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>🛒 {t('button.createShoppingList')}</h3>
              <button 
                className="close-btn" 
                onClick={handleCloseShoppingList}
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: '#ff6b35', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '30px', 
                  height: '30px', 
                  cursor: 'pointer', 
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}
              >
                ×
              </button>
    </div>

            <div className="shopping-list-content">
              <div className="recipe-info">
                <h4>🍽️ {t('parties.yourCustomMenu')} ({generatedDishes.dishes.length} {t('parties.dishes')})</h4>
                <div className="menu-preview">
                  {generatedDishes.dishes.map((dish, index) => (
                    <div key={index} className="menu-item">
                      <span className="dish-number">{index + 1}</span>
                      {getCategoryEmoji(dish)} {typeof dish.name === 'string' && dish.name.startsWith('dish.')
                        ? t(`dishes.${dish.name.replace('dish.', '')}`)
                        : typeof dish.name === 'string'
                          ? dish.name
                          : dish.dish_name?.en || dish.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="ingredients-preview">
                <h5>📝 {t('shoppingList.title')}:</h5>
                <div className="consolidated-ingredients">
                  {(() => {
                    // Helper function to parse and sum amounts
                    const parseAmount = (amountStr) => {
                      // Safety check for undefined/null values
                      if (!amountStr || typeof amountStr !== 'string') {
                        return 0
                      }
                      // Extract number from amount string (e.g., "3瓣" -> 3, "500g" -> 500)
                      const match = amountStr.match(/(\d+(?:\.\d+)?)/)
                      return match ? parseFloat(match[1]) : 0
                    }
                    
                    const getUnit = (amountStr) => {
                      // Extract unit from amount string (e.g., "3瓣" -> "瓣", "500g" -> "g")
                      const match = amountStr.match(/\d+(?:\.\d+)?(.+)/)
                      return match ? match[1] : ''
                    }
                    
                    // Group ingredients by name and sum amounts
                    const ingredientMap = new Map()
                    
                    generatedDishes.dishes.forEach((dish, dishIndex) => {
                      const ingredients = dish.ingredients?.[i18n.language] || dish.ingredients?.en || []
                      ingredients.forEach(ingredientString => {
                        // Parse ingredient string like "1 lb pork chops, cubed"
                        let ingredientName = ingredientString
                        let amount = ingredientString
                        
                        if (typeof ingredientString === 'string') {
                          // If it contains a translation key, extract the ingredient part
                          if (ingredientString.includes('ingredient.')) {
                            const match = ingredientString.match(/ingredient\.([^\s]+)/)
                            if (match) {
                              ingredientName = match[1].replace(/_/g, ' ')
                              // Extract amount from the beginning of the string
                              const amountMatch = ingredientString.match(/^(\d+(?:\.\d+)?\s*\w*)/)
                              amount = amountMatch ? amountMatch[1] : ingredientString
                            }
                          } else {
                            // Extract ingredient name from amount string like "1 lb pork chops, cubed"
                            const parts = ingredientString.split(' ')
                            if (parts.length >= 3) {
                              // Skip amount and unit, take the rest
                              ingredientName = parts.slice(2).join(' ').replace(',', '').trim()
                              // Extract just the amount and unit (first two parts)
                              amount = parts.slice(0, 2).join(' ')
                            } else if (parts.length === 2) {
                              // Handle cases like "Whole Chicken"
                              ingredientName = parts.join(' ')
                              amount = ingredientString
                            }
                          }
                        }
                        
                        const key = ingredientName
                        if (ingredientMap.has(key)) {
                          const existing = ingredientMap.get(key)
                          existing.dishes.push(dishIndex)
                          // Parse and sum amounts
                          const currentAmount = parseAmount(amount)
                          const existingAmount = parseAmount(existing.totalAmount)
                          const unit = getUnit(amount) || getUnit(existing.totalAmount)
                          existing.totalAmount = `${existingAmount + currentAmount}${unit}`
                        } else {
                          ingredientMap.set(key, {
                            ingredient: ingredientName,
                            totalAmount: amount,
                            dishes: [dishIndex]
                          })
                        }
                      })
                    })
                    
                    return Array.from(ingredientMap.values()).map((item, index) => {
                      const isChecked = checkedIngredients.has(item.ingredient)
                      
                      return (
                        <div key={index} className="consolidated-ingredient-row">
                          <IngredientCheckbox
                            ingredient={item.ingredient}
                            isChecked={isChecked}
                            onToggle={toggleIngredient}
                          />
                          <div className={`consolidated-ingredient-item ${!isChecked ? 'unchecked' : ''}`}>
                            <div className="ingredient-main">
                              <span className="ingredient-amount">{item.totalAmount}</span>
                              <span className="ingredient-name">{item.ingredient}</span>
                            </div>
                            <div className="ingredient-dishes">
                              {item.dishes.map(dishIndex => (
                                <span key={dishIndex} className="dish-tag">
                                  {dishIndex + 1} {generatedDishes.dishes[dishIndex].emoji}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
          </div>

              <div className="sharing-section" style={{ marginTop: '20px', padding: '15px', border: '2px solid #ff6b35', borderRadius: '8px', backgroundColor: '#fff5f0' }}>
                <h5>📤 Share:</h5>
                
                <div className="share-buttons" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <button
                    className="copy-btn"
                    onClick={() => {
                      setShowPhoneDropdown(false) // Hide phone dropdown
                      navigator.clipboard.writeText(createShoppingListText())
                      // Simple indication without popup
                      const button = event.target
                      const originalText = button.textContent
                      button.textContent = '✅ Copied!'
                      button.style.backgroundColor = '#2E7D32'
                      setTimeout(() => {
                        button.textContent = originalText
                        button.style.backgroundColor = '#4CAF50'
                      }, 2000)
                    }}
                    style={{ 
                      padding: '10px 15px', 
                      backgroundColor: '#4CAF50', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    📋 Copy
                  </button>
                  <button
                    className="sms-btn"
                    onClick={() => {
                      setShowPhoneDropdown(!showPhoneDropdown)
                    }}
                    style={{ 
                      padding: '10px 15px', 
                      backgroundColor: '#2196F3', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    📱 SMS
                  </button>
            <button
                    className="email-btn"
                    onClick={() => {
                      setShowPhoneDropdown(false) // Hide phone dropdown
                      const subject = `${t('shoppingList.title')} ${t('shoppingList.for')} ${generatedDishes.dishes.length} ${t('parties.dishes')}`
                      const body = createShoppingListText()
                      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                      window.open(mailtoLink, '_blank')
                      
                      // Simple indication without popup
                      const button = event.target
                      const originalText = button.textContent
                      button.textContent = '📧 Opening Email...'
                      button.style.backgroundColor = '#E65100'
                      setTimeout(() => {
                        button.textContent = originalText
                        button.style.backgroundColor = '#FF9800'
                      }, 2000)
                    }}
                    style={{ 
                      padding: '10px 15px', 
                      backgroundColor: '#FF9800', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    📧 Email
            </button>
                </div>
                
                {/* Quick SMS with Phone Number - Dropdown */}
                {showPhoneDropdown && (
                <div className="quick-sms-section" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
                  <h6 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>📱 Quick SMS:</h6>
                  
                  {/* Phone Number Input */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                    <input
                      type="tel"
                      placeholder="Enter phone number (e.g., +1234567890)"
                      value={quickSMSNumber}
                      onChange={(e) => setQuickSMSNumber(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={() => {
                        if (quickSMSNumber.trim()) {
                          savePhoneNumber(quickSMSNumber.trim())
                          sendQuickSMS(quickSMSNumber.trim())
                          setQuickSMSNumber('')
                          setShowPhoneDropdown(false) // Hide dropdown after sending
                        }
                      }}
                      disabled={!quickSMSNumber.trim()}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: quickSMSNumber.trim() ? '#28a745' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: quickSMSNumber.trim() ? 'pointer' : 'not-allowed',
                        fontSize: '14px'
                      }}
                    >
                      Send
                    </button>
                  </div>
                  
                  {/* Saved Numbers */}
                  {savedNumbers.length > 0 && (
                    <div className="saved-numbers">
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Saved numbers:</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {savedNumbers.map((number, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              onClick={() => sendQuickSMS(number)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              {number}
                            </button>
                            <button
                              onClick={() => removePhoneNumber(number)}
                              style={{
                                padding: '2px 6px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '10px'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                )}
                
                <p className="share-description" style={{ fontSize: '12px', marginTop: '8px' }}>
                  {t('parties.shareDescription')}
                </p>
        </div>
      </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Parties