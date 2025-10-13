import { vi } from 'vitest'

/**
 * Mock i18n with language switching support
 * This mock allows tests to switch languages and get appropriate translations
 */

// Translation data for all supported languages
const translations = {
  en: {
    'dishToday.title': 'Dish Today',
    'parties.title': 'Parties',
    'drink.title': 'Drink',
    'sauce.title': 'Sauce',
    'recipeChoiceCards.randomRecipe': 'Random Recipe',
    'recipeChoiceCards.whatIHave': 'What I Have',
    'recipeChoiceCards.searchRecipe': 'Search Recipe',
    'recipe.ingredients': 'Ingredients',
    'recipe.instructions': 'Instructions',
    'ingredient-pork-chops': 'Pork Chops',
    'ingredient-bell-pepper': 'Bell Peppers',
    'ingredient-garlic': 'Garlic',
    'ingredient-soy-sauce': 'Soy Sauce',
    'parties.tastePreferences': 'Taste Preferences',
    'parties.cuisineStyles': 'Cuisine Styles',
    'parties.diningScenarios': 'Dining Scenarios',
    'parties.leaveToChef': 'Leave to Chef'
  },
  zh: {
    'dishToday.title': '今日菜肴',
    'parties.title': '聚会',
    'drink.title': '饮品',
    'sauce.title': '酱料',
    'recipeChoiceCards.randomRecipe': '随机食谱',
    'recipeChoiceCards.whatIHave': '我有什么',
    'recipeChoiceCards.searchRecipe': '搜索食谱',
    'recipe.ingredients': '食材',
    'recipe.instructions': '步骤',
    'ingredient-pork-chops': '猪排',
    'ingredient-bell-pepper': '甜椒',
    'ingredient-garlic': '大蒜',
    'ingredient-soy-sauce': '酱油',
    'parties.tastePreferences': '口味偏好',
    'parties.cuisineStyles': '菜系风格',
    'parties.diningScenarios': '用餐场景',
    'parties.leaveToChef': '交给厨师'
  },
  sv: {
    'dishToday.title': 'Dagens Rätt',
    'parties.title': 'Fester',
    'drink.title': 'Dryck',
    'sauce.title': 'Sås',
    'recipeChoiceCards.randomRecipe': 'Slumpmässigt Recept',
    'recipeChoiceCards.whatIHave': 'Vad Jag Har',
    'recipeChoiceCards.searchRecipe': 'Sök Recept',
    'recipe.ingredients': 'Ingredienser',
    'recipe.instructions': 'Instruktioner',
    'ingredient-pork-chops': 'Fläskkotletter',
    'ingredient-bell-pepper': 'Paprika',
    'ingredient-garlic': 'Vitlök',
    'ingredient-soy-sauce': 'Sojasås',
    'parties.tastePreferences': 'Smakpreferenser',
    'parties.cuisineStyles': 'Köksstilar',
    'parties.diningScenarios': 'Matscenarier',
    'parties.leaveToChef': 'Lämna till Kocken'
  }
}

// Create mock i18n instance
export const createMockI18n = (initialLanguage = 'en') => {
  let currentLanguage = initialLanguage
  const listeners = []

  const mockI18n = {
    language: currentLanguage,
    
    changeLanguage: vi.fn(async (lng) => {
      currentLanguage = lng
      mockI18n.language = lng
      
      // Notify all listeners
      listeners.forEach(callback => callback(lng))
      
      return Promise.resolve()
    }),
    
    on: vi.fn((event, callback) => {
      if (event === 'languageChanged') {
        listeners.push(callback)
      }
    }),
    
    off: vi.fn((event, callback) => {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }),
    
    getResourceBundle: vi.fn((lng, namespace) => {
      // This would return the full resource bundle for the language
      // For testing, we'll return mock data
      return {}
    }),
    
    t: vi.fn((key) => {
      const langTranslations = translations[currentLanguage] || translations.en
      return langTranslations[key] || key
    })
  }

  return mockI18n
}

// Create a default instance
export const mockI18n = createMockI18n()

// Export mock useTranslation hook
export const mockUseTranslation = (language = 'en') => {
  const i18n = createMockI18n(language)
  
  return () => ({
    t: i18n.t,
    i18n
  })
}

// Export initReactI18next mock
export const mockInitReactI18next = {
  type: '3rdParty',
  init: vi.fn()
}




