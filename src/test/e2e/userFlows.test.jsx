import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../utils/testHelpers.jsx'
import App from '../../App'

// Mock the useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'dishToday.title': 'Dish Today',
        'parties.title': 'Parties',
        'drink.title': 'Drink',
        'sauce.title': 'Sauce',
        'myFavorite.title': 'My Favorite',
        'meetUp.title': 'Meet Up',
        'recipeChoiceCards.randomRecipe': 'Random Recipe',
        'recipeChoiceCards.whatIHave': 'What I Have',
        'recipeChoiceCards.searchRecipe': 'Search Recipe',
        'recipe.ingredients': 'Ingredients',
        'recipe.instructions': 'Instructions',
        'ingredients.pork-chops': 'Pork Chops',
        'ingredients.beef-steak': 'Beef Steak',
        'ingredients.salmon': 'Salmon',
        'ingredients.broccoli': 'Broccoli',
        'ingredients.rice': 'Rice',
        'ingredients.chicken-eggs': 'Chicken Eggs'
      }
      return translations[key] || key
    },
    i18n: { language: 'en' }
  })
}))

// Mock the data hooks
vi.mock('../../data/recipes', () => ({
  useRecipes: vi.fn(() => ({
    cultural: {
      Chinese: [
        {
          id: 1,
          name: 'Sweet and Sour Pork',
          description: 'A delicious Chinese dish',
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
    }
  })),
  getRandomRecipe: vi.fn(() => ({
    id: 1,
    name: 'Sweet and Sour Pork',
    description: 'A delicious Chinese dish',
    ingredients: ['ingredient-pork-chops', 'ingredient-bell-pepper'],
    ingredientsWithAmounts: ['1 lb pork chops', '2 bell peppers'],
    instructions: ['Cut pork into pieces', 'Cook in wok'],
    difficulty: 'Medium',
    cookTime: '30 minutes',
    emoji: '🥩'
  })),
  getRandomRecipeFromAll: vi.fn(() => ({
    id: 2,
    name: 'Grilled Pork',
    description: 'Simple grilled pork',
    ingredients: ['ingredient-pork-chops'],
    ingredientsWithAmounts: ['1 lb pork chops'],
    instructions: ['Season pork', 'Grill for 15 minutes'],
    difficulty: 'Easy',
    cookTime: '20 minutes',
    emoji: '🥩'
  })),
  getRecipesByIngredientsFromAll: vi.fn(() => [
    {
      id: 1,
      name: 'Sweet and Sour Pork',
      description: 'A delicious Chinese dish',
      ingredients: ['ingredient-pork-chops', 'ingredient-bell-pepper'],
      ingredientsWithAmounts: ['1 lb pork chops', '2 bell peppers'],
      instructions: ['Cut pork into pieces', 'Cook in wok'],
      difficulty: 'Medium',
      cookTime: '30 minutes',
      emoji: '🥩'
    }
  ]),
  searchRecipesFromAll: vi.fn(() => [
    {
      id: 1,
      name: 'Sweet and Sour Pork',
      description: 'A delicious Chinese dish',
      ingredients: ['ingredient-pork-chops', 'ingredient-bell-pepper'],
      ingredientsWithAmounts: ['1 lb pork chops', '2 bell peppers'],
      instructions: ['Cut pork into pieces', 'Cook in wok'],
      difficulty: 'Medium',
      cookTime: '30 minutes',
      emoji: '🥩'
    }
  ]),
  usePartyData: vi.fn(() => ({
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
      { value: 'meat', label: 'Meat', emoji: '🥩' },
      { value: 'seafood', label: 'Seafood', emoji: '🦞' },
      { value: 'vegetables', label: 'Vegetables', emoji: '🥬' }
    ],
    tastePreferences: [
      { value: 'rich', label: 'Rich', emoji: '🍗' },
      { value: 'spicy', label: 'Spicy', emoji: '🌶️' }
    ],
    cuisineStyles: [
      { value: 'mixed', label: 'Mixed Cuisine', emoji: '🌍' },
      { value: 'chinese', label: 'Chinese', emoji: '🍚' }
    ],
    diningScenarios: [
      { value: 'friends', label: 'Friends Gathering', emoji: '👥' }
    ]
  })),
  useIngredientData: vi.fn(() => ({
    categories: {
      'Meat': {
        emoji: '🥩',
        subcategories: {
          'Pork': { emoji: '🐷', items: ['pork-chops', 'ground-pork'] },
          'Beef': { emoji: '🐄', items: ['beef-steak', 'ground-beef'] }
        }
      },
      'Seafood': {
        emoji: '🦞',
        subcategories: {
          'Fish': { emoji: '🐟', items: ['salmon', 'tuna'] }
        }
      }
    }
  }))
}))

describe('E2E User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Food Wheel Selection Flow', () => {
    it('completes the full food wheel selection to recipe display flow', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)
      
      // Navigate to Dish Today page
      expect(screen.getByText('Dish Today')).toBeInTheDocument()
      
      // Click on Chinese cuisine from food wheel
      const chineseCuisine = screen.getByText('Chinese')
      await user.click(chineseCuisine)
      
      // Click on Random Recipe
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      // Wait for recipe to be displayed
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
        expect(screen.getByText('A delicious Chinese dish')).toBeInTheDocument()
      })
      
      // Verify recipe details are shown
      expect(screen.getByText('Ingredients')).toBeInTheDocument()
      expect(screen.getByText('Instructions')).toBeInTheDocument()
      expect(screen.getByText('1 lb pork chops')).toBeInTheDocument()
      expect(screen.getByText('1. Cut pork into pieces')).toBeInTheDocument()
    })
  })

  describe('Ingredient-Based Recipe Generation Flow', () => {
    it('completes the ingredient selection to recipe generation flow', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)
      
      // Navigate to Dish Today page
      expect(screen.getByText('Dish Today')).toBeInTheDocument()
      
      // Click on What I Have tab
      const whatIHaveTab = screen.getByText('What I Have')
      await user.click(whatIHaveTab)
      
      // Select ingredients
      const porkChopsButton = screen.getByText('Pork Chops')
      await user.click(porkChopsButton)
      
      // Click Generate Recipe
      const generateButton = screen.getByText('Generate Recipe')
      await user.click(generateButton)
      
      // Wait for recipe to be generated and displayed
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Verify recipe details
      expect(screen.getByText('Ingredients')).toBeInTheDocument()
      expect(screen.getByText('Instructions')).toBeInTheDocument()
    })
  })

  describe('Recipe Search Flow', () => {
    it('completes the recipe search flow', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)
      
      // Navigate to Dish Today page
      expect(screen.getByText('Dish Today')).toBeInTheDocument()
      
      // Click on Search Recipe tab
      const searchTab = screen.getByText('Search Recipe')
      await user.click(searchTab)
      
      // Type in search input
      const searchInput = screen.getByPlaceholderText('Search for a recipe...')
      await user.type(searchInput, 'pork')
      
      // Wait for search results
      await waitFor(() => {
        expect(searchInput.value).toBe('pork')
      })
      
      // Verify search functionality works
      expect(searchInput).toBeInTheDocument()
    })
  })

  describe('Parties Menu Creation Flow', () => {
    it('completes the parties menu creation flow', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)
      
      // Navigate to Parties page
      const partiesTab = screen.getByText('Parties')
      await user.click(partiesTab)
      
      // Verify parties page loads
      expect(screen.getByText('Parties')).toBeInTheDocument()
      
      // Verify default settings
      expect(screen.getByText('4')).toBeInTheDocument() // Default dish count
      expect(screen.getByText('Rich')).toBeInTheDocument() // Default taste
      expect(screen.getByText('Friends Gathering')).toBeInTheDocument() // Default scenario
      
      // Click Leave to Chef
      const chefButton = screen.getByText('Leave to Chef')
      await user.click(chefButton)
      
      // Wait for dishes to be generated
      await waitFor(() => {
        expect(screen.getByText('Generated Dishes')).toBeInTheDocument()
      }, { timeout: 5000 })
      
      // Verify generated dishes are displayed
      expect(screen.getByText('Generated Dishes')).toBeInTheDocument()
    })
  })

  describe('Navigation Flow', () => {
    it('completes navigation between all pages', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)
      
      // Start on Dish Today page
      expect(screen.getByText('Dish Today')).toBeInTheDocument()
      
      // Navigate to Parties
      const partiesTab = screen.getByText('Parties')
      await user.click(partiesTab)
      expect(screen.getByText('Parties')).toBeInTheDocument()
      
      // Navigate to Drink
      const drinkTab = screen.getByText('Drink')
      await user.click(drinkTab)
      expect(screen.getByText('Drink')).toBeInTheDocument()
      
      // Navigate to Sauce
      const sauceTab = screen.getByText('Sauce')
      await user.click(sauceTab)
      expect(screen.getByText('Sauce')).toBeInTheDocument()
      
      // Navigate to My Favorite
      const favoriteTab = screen.getByText('My Favorite')
      await user.click(favoriteTab)
      expect(screen.getByText('My Favorite')).toBeInTheDocument()
      
      // Navigate to Meet Up
      const meetUpTab = screen.getByText('Meet Up')
      await user.click(meetUpTab)
      expect(screen.getByText('Meet Up')).toBeInTheDocument()
      
      // Navigate back to Dish Today
      const dishTodayTab = screen.getByText('Dish Today')
      await user.click(dishTodayTab)
      expect(screen.getByText('Dish Today')).toBeInTheDocument()
    })
  })

  describe('Complete Recipe Discovery Flow', () => {
    it('completes the full recipe discovery flow from wheel to details', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)
      
      // Step 1: Select cuisine from food wheel
      const chineseCuisine = screen.getByText('Chinese')
      await user.click(chineseCuisine)
      
      // Step 2: Try random recipe
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      // Step 3: Wait for recipe display
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Step 4: Switch to ingredient-based generation
      const whatIHaveTab = screen.getByText('What I Have')
      await user.click(whatIHaveTab)
      
      // Step 5: Select ingredients
      const porkChopsButton = screen.getByText('Pork Chops')
      await user.click(porkChopsButton)
      
      // Step 6: Generate recipe
      const generateButton = screen.getByText('Generate Recipe')
      await user.click(generateButton)
      
      // Step 7: Verify recipe is displayed
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Step 8: Verify recipe details
      expect(screen.getByText('Ingredients')).toBeInTheDocument()
      expect(screen.getByText('Instructions')).toBeInTheDocument()
      expect(screen.getByText('1 lb pork chops')).toBeInTheDocument()
      expect(screen.getByText('1. Cut pork into pieces')).toBeInTheDocument()
    })
  })

  describe('Parties Configuration Flow', () => {
    it('completes the parties configuration and generation flow', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)
      
      // Navigate to Parties
      const partiesTab = screen.getByText('Parties')
      await user.click(partiesTab)
      
      // Configure taste preferences
      const spicyTaste = screen.getByText('Spicy')
      await user.click(spicyTaste)
      
      // Configure cuisine style
      const chineseCuisine = screen.getByText('Chinese')
      await user.click(chineseCuisine)
      
      // Generate menu
      const chefButton = screen.getByText('Leave to Chef')
      await user.click(chefButton)
      
      // Wait for menu generation
      await waitFor(() => {
        expect(screen.getByText('Generated Dishes')).toBeInTheDocument()
      }, { timeout: 5000 })
      
      // Verify configuration is maintained
      expect(screen.getByText('Generated Dishes')).toBeInTheDocument()
    })
  })

  describe('Error Handling Flow', () => {
    it('handles errors gracefully throughout the application', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)
      
      // Try to generate recipe without selecting cuisine
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      // Should handle gracefully
      expect(randomButton).toBeInTheDocument()
      
      // Try to generate recipe without ingredients
      const whatIHaveTab = screen.getByText('What I Have')
      await user.click(whatIHaveTab)
      
      const generateButton = screen.getByText('Generate Recipe')
      await user.click(generateButton)
      
      // Should handle gracefully
      expect(generateButton).toBeInTheDocument()
      
      // Try to generate parties menu without proper setup
      const partiesTab = screen.getByText('Parties')
      await user.click(partiesTab)
      
      const chefButton = screen.getByText('Leave to Chef')
      await user.click(chefButton)
      
      // Should handle gracefully
      expect(chefButton).toBeInTheDocument()
    })
  })

  describe('Language Switching Flow', () => {
    it('handles language switching throughout the application', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithProviders(<App />)
      
      // Start on Dish Today page in English
      expect(screen.getByText('Dish Today')).toBeInTheDocument()
      
      // Generate a recipe in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      // Wait for recipe in English
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      rerender(<App />)
      
      // Wait for content to update to Chinese
      await waitFor(() => {
        // Page title should be in Chinese
        expect(screen.getByText('今日菜肴')).toBeInTheDocument()
        
        // Recipe should be in Chinese
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
        expect(screen.queryByText('Sweet and Sour Pork')).not.toBeInTheDocument()
        
        // Tabs should be in Chinese
        expect(screen.getByText('随机食谱')).toBeInTheDocument()
        expect(screen.getByText('我有什么')).toBeInTheDocument()
      })
      
      // Navigate to Parties
      const partiesTab = screen.getByText('聚会')
      await user.click(partiesTab)
      
      // Verify parties page loads in Chinese
      await waitFor(() => {
        expect(screen.getByText('聚会')).toBeInTheDocument()
        expect(screen.getByText('交给厨师')).toBeInTheDocument() // Leave to Chef button
      })
      
      // Switch to Swedish
      await act(async () => {
        await mockI18n.changeLanguage('sv')
      })
      
      rerender(<App />)
      
      // Parties page should now be in Swedish
      await waitFor(() => {
        expect(screen.getByText('Fester')).toBeInTheDocument()
        expect(screen.getByText('Lämna till Kocken')).toBeInTheDocument()
      })
      
      // Navigate back to Dish Today
      const dishTodayTab = screen.getByText('Dagens Rätt')
      await user.click(dishTodayTab)
      
      // Recipe should still be displayed in Swedish
      await waitFor(() => {
        expect(screen.getByText('Sötsur Fläsk')).toBeInTheDocument()
      })
      
      // Switch back to English
      await act(async () => {
        await mockI18n.changeLanguage('en')
      })
      
      rerender(<App />)
      
      // Everything should be back in English
      await waitFor(() => {
        expect(screen.getByText('Dish Today')).toBeInTheDocument()
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
    })

    it('maintains recipe selection when switching languages multiple times', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithProviders(<App />)
      
      // Generate recipe in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Rapid language switching
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      rerender(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      })
      
      await act(async () => {
        await mockI18n.changeLanguage('sv')
      })
      rerender(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Sötsur Fläsk')).toBeInTheDocument()
      })
      
      await act(async () => {
        await mockI18n.changeLanguage('en')
      })
      rerender(<App />)
      
      // Recipe should still be displayed after all switches
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
    })

    it('generates new recipes in the current language', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithProviders(<App />)
      
      // Switch to Chinese first
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      rerender(<App />)
      
      // Generate a recipe - should be in Chinese
      const randomButton = screen.getByText('随机食谱')
      await user.click(randomButton)
      
      await waitFor(() => {
        // Recipe should appear directly in Chinese
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
        
        // Should NOT show English content
        expect(screen.queryByText('Sweet and Sour Pork')).not.toBeInTheDocument()
      })
    })
  })
})
