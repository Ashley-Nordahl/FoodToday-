import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  useRecipes, 
  usePartyData, 
  useIngredientData,
  usePartyTypes,
  useIngredientCategories,
  useTastePreferences,
  useCuisineStyles,
  useDiningScenarios,
  useMergedRecipes,
  getRandomRecipe,
  getRandomRecipeFromAll,
  getRecipesByIngredients,
  getRecipesByIngredientsFromAll,
  searchRecipesFromAll,
  getAllCulturalDishes
} from '../recipes'

// Mock react-i18next
const mockI18n = {
  language: 'en',
  getResourceBundle: vi.fn()
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: mockI18n
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {}
  }
}))

// Mock recipe data
const mockRecipeData = {
  cultural: {
    Chinese: [
      {
        id: 1,
        name: 'Sweet and Sour Pork',
        description: 'Classic Chinese dish',
        ingredients: ['ingredient-pork-chops', 'ingredient-bell-pepper'],
        ingredientsWithAmounts: ['1 lb pork chops', '2 bell peppers'],
        instructions: ['Cut pork into pieces', 'Cook in wok'],
        difficulty: 'Medium',
        cookTime: '30 minutes',
        emoji: '🥩'
      }
    ]
  },
  basic: {
    'Grilled': {
      'Grilled Pork': {
        id: 2,
        name: 'Grilled Pork',
        description: 'Simple grilled pork',
        ingredients: ['ingredient-pork-chops'],
        ingredientsWithAmounts: ['1 lb pork chops'],
        instructions: ['Season pork', 'Grill for 15 minutes'],
        difficulty: 'Easy',
        cookTime: '20 minutes',
        emoji: '🥩'
      }
    }
  },
  metadata: {
    version: '1.0.0'
  }
}

// Mock party data
const mockPartyData = {
  partyTypes: [
    {
      id: 401,
      name: 'Birthday Celebration',
      description: 'Make your special day unforgettable',
      emoji: '🎂',
      category: 'Birthday',
      price: '$299',
      duration: '4 hours'
    }
  ],
  ingredientCategories: [
    {
      value: 'meat',
      label: 'Meat',
      emoji: '🥩'
    }
  ],
  tastePreferences: [
    {
      value: 'rich',
      label: 'Rich',
      emoji: '🍗'
    }
  ],
  cuisineStyles: [
    {
      value: 'mixed',
      label: 'Mixed Cuisine',
      emoji: '🌍'
    }
  ],
  diningScenarios: [
    {
      value: 'friends',
      label: 'Friends Gathering',
      emoji: '👥'
    }
  ]
}

// Mock ingredient data
const mockIngredientData = {
  categories: {
    'Meat': {
      emoji: '🥩',
      subcategories: {
        'Pork': {
          emoji: '🐷',
          items: ['ingredient-pork-chops']
        }
      }
    }
  }
}

describe('recipes.js - Reactive Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useRecipes', () => {
    it('should return recipe data for current language', () => {
      mockI18n.getResourceBundle.mockReturnValue(mockRecipeData)
      
      const recipes = useRecipes()
      
      expect(mockI18n.getResourceBundle).toHaveBeenCalledWith('en', 'recipes')
      expect(recipes).toEqual(mockRecipeData)
    })

    it('should return empty object when no data available', () => {
      mockI18n.getResourceBundle.mockReturnValue(null)
      
      const recipes = useRecipes()
      
      expect(recipes).toEqual({ cultural: {}, basic: {}, metadata: {} })
    })
  })

  describe('usePartyData', () => {
    it('should return party data for current language', () => {
      mockI18n.getResourceBundle.mockReturnValue(mockPartyData)
      
      const partyData = usePartyData()
      
      expect(mockI18n.getResourceBundle).toHaveBeenCalledWith('en', 'parties')
      expect(partyData).toEqual(mockPartyData)
    })
  })

  describe('useIngredientData', () => {
    it('should return ingredient data for current language', () => {
      mockI18n.getResourceBundle.mockReturnValue(mockIngredientData)
      
      const ingredientData = useIngredientData()
      
      expect(mockI18n.getResourceBundle).toHaveBeenCalledWith('en', 'ingredients')
      expect(ingredientData).toEqual(mockIngredientData)
    })
  })

  describe('usePartyTypes', () => {
    it('should return party types from party data', () => {
      mockI18n.getResourceBundle.mockReturnValue(mockPartyData)
      
      const partyTypes = usePartyTypes()
      
      expect(partyTypes).toEqual(mockPartyData.partyTypes)
    })
  })

  describe('useIngredientCategories', () => {
    it('should return ingredient categories from party data', () => {
      mockI18n.getResourceBundle.mockReturnValue(mockPartyData)
      
      const categories = useIngredientCategories()
      
      expect(categories).toEqual(mockPartyData.ingredientCategories)
    })
  })

  describe('useTastePreferences', () => {
    it('should return taste preferences from party data', () => {
      mockI18n.getResourceBundle.mockReturnValue(mockPartyData)
      
      const preferences = useTastePreferences()
      
      expect(preferences).toEqual(mockPartyData.tastePreferences)
    })
  })

  describe('useCuisineStyles', () => {
    it('should return cuisine styles from party data', () => {
      mockI18n.getResourceBundle.mockReturnValue(mockPartyData)
      
      const styles = useCuisineStyles()
      
      expect(styles).toEqual(mockPartyData.cuisineStyles)
    })
  })

  describe('useDiningScenarios', () => {
    it('should return dining scenarios from party data', () => {
      mockI18n.getResourceBundle.mockReturnValue(mockPartyData)
      
      const scenarios = useDiningScenarios()
      
      expect(scenarios).toEqual(mockPartyData.diningScenarios)
    })
  })
})

describe('recipes.js - Non-Reactive Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockI18n.getResourceBundle.mockReturnValue(mockRecipeData)
  })

  describe('getRandomRecipe', () => {
    it('should return a random recipe from specified cuisine', () => {
      const recipe = getRandomRecipe('Chinese')
      
      expect(recipe).toBeDefined()
      expect(recipe.name).toBe('Sweet and Sour Pork')
      expect(recipe.cuisine).toBe('Chinese')
    })

    it('should return null if cuisine not found', () => {
      const recipe = getRandomRecipe('NonExistent')
      
      expect(recipe).toBeNull()
    })
  })

  describe('getRandomRecipeFromAll', () => {
    it('should return a random recipe from all cuisines', () => {
      const recipe = getRandomRecipeFromAll()
      
      expect(recipe).toBeDefined()
      expect(['Sweet and Sour Pork', 'Grilled Pork']).toContain(recipe.name)
    })
  })

  describe('getRecipesByIngredients', () => {
    it('should find recipes containing specified ingredients', () => {
      const recipes = getRecipesByIngredients('Chinese', ['ingredient-pork-chops'])
      
      expect(recipes).toHaveLength(1)
      expect(recipes[0].name).toBe('Sweet and Sour Pork')
    })

    it('should return empty array if no matching recipes', () => {
      const recipes = getRecipesByIngredients('Chinese', ['ingredient-nonexistent'])
      
      expect(recipes).toHaveLength(0)
    })
  })

  describe('getRecipesByIngredientsFromAll', () => {
    it('should find recipes containing ingredients across all cuisines', () => {
      const recipes = getRecipesByIngredientsFromAll(['ingredient-pork-chops'])
      
      expect(recipes).toHaveLength(2) // Chinese recipe + basic recipe
      expect(recipes.map(r => r.name)).toContain('Sweet and Sour Pork')
      expect(recipes.map(r => r.name)).toContain('Grilled Pork')
    })
  })

  describe('searchRecipesFromAll', () => {
    it('should find recipes by name search', () => {
      const recipes = searchRecipesFromAll('pork')
      
      expect(recipes).toHaveLength(2)
      expect(recipes.every(r => r.name.toLowerCase().includes('pork'))).toBe(true)
    })

    it('should return empty array for no matches', () => {
      const recipes = searchRecipesFromAll('nonexistent')
      
      expect(recipes).toHaveLength(0)
    })
  })

  describe('getAllCulturalDishes', () => {
    it('should return all cultural dishes with cuisine info', () => {
      const dishes = getAllCulturalDishes()
      
      expect(dishes).toHaveLength(1)
      expect(dishes[0].name).toBe('Sweet and Sour Pork')
      expect(dishes[0].cuisine).toBe('Chinese')
    })
  })

  describe('useMergedRecipes', () => {
    it('should return merged cultural and basic recipes', () => {
      const merged = useMergedRecipes()
      
      expect(merged).toHaveProperty('cultural')
      expect(merged).toHaveProperty('basic')
      expect(merged.cultural).toEqual(mockRecipeData.cultural)
      expect(merged.basic).toEqual(mockRecipeData.basic)
    })
  })
})
