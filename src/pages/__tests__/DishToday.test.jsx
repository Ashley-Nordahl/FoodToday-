import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils/testHelpers.jsx'
import DishToday from '../DishToday'

// Mock the useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'dishToday.title': 'Dish Today',
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
  ])
}))

describe('DishToday Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page title', () => {
    renderWithProviders(<DishToday />)
    
    expect(screen.getByText('Dish Today')).toBeInTheDocument()
  })

  it('renders recipe choice cards', () => {
    renderWithProviders(<DishToday />)
    
    expect(screen.getByText('Random Recipe')).toBeInTheDocument()
    expect(screen.getByText('What I Have')).toBeInTheDocument()
    expect(screen.getByText('Search Recipe')).toBeInTheDocument()
  })

  it('displays selected recipe when random recipe is chosen', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Click on random recipe button
    const randomButton = screen.getByText('Random Recipe')
    await user.click(randomButton)
    
    // Wait for recipe to load
    await waitFor(() => {
      expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
    })
  })

  it('shows recipe details when recipe is selected', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Click on random recipe button
    const randomButton = screen.getByText('Random Recipe')
    await user.click(randomButton)
    
    // Wait for recipe details to appear
    await waitFor(() => {
      expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      expect(screen.getByText('A delicious Chinese dish')).toBeInTheDocument()
      expect(screen.getByText('Medium')).toBeInTheDocument()
      expect(screen.getByText('30 minutes')).toBeInTheDocument()
    })
  })

  it('displays ingredients and instructions', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Click on random recipe button
    const randomButton = screen.getByText('Random Recipe')
    await user.click(randomButton)
    
    // Wait for recipe details
    await waitFor(() => {
      expect(screen.getByText('Ingredients')).toBeInTheDocument()
      expect(screen.getByText('Instructions')).toBeInTheDocument()
      expect(screen.getByText('1 lb pork chops')).toBeInTheDocument()
      expect(screen.getByText('2 bell peppers')).toBeInTheDocument()
      expect(screen.getByText('1. Cut pork into pieces')).toBeInTheDocument()
      expect(screen.getByText('2. Cook in wok')).toBeInTheDocument()
    })
  })

  it('handles ingredient-based recipe generation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Click on What I Have tab
    const whatIHaveTab = screen.getByText('What I Have')
    await user.click(whatIHaveTab)
    
    // Select an ingredient
    const porkChopsButton = screen.getByText('Pork Chops')
    await user.click(porkChopsButton)
    
    // Click generate recipe
    const generateButton = screen.getByText('Generate Recipe')
    await user.click(generateButton)
    
    // Wait for recipe to load
    await waitFor(() => {
      expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
    })
  })

  it('handles recipe search', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Click on Search Recipe tab
    const searchTab = screen.getByText('Search Recipe')
    await user.click(searchTab)
    
    // Type in search input
    const searchInput = screen.getByPlaceholderText('Search for a recipe...')
    await user.type(searchInput, 'pork')
    
    // Wait for search results (if any are displayed)
    await waitFor(() => {
      expect(searchInput.value).toBe('pork')
    })
  })

  it('switches between tabs correctly', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Start on Random tab
    expect(screen.getByText('Random Recipe')).toBeInTheDocument()
    
    // Switch to What I Have tab
    const whatIHaveTab = screen.getByText('What I Have')
    await user.click(whatIHaveTab)
    expect(screen.getByText('Meat')).toBeInTheDocument()
    
    // Switch to Search tab
    const searchTab = screen.getByText('Search Recipe')
    await user.click(searchTab)
    const searchInput = screen.getByPlaceholderText('Search for a recipe...')
    expect(searchInput).toBeInTheDocument()
    
    // Switch back to Random tab
    const randomTab = screen.getByText('Random Recipe')
    await user.click(randomTab)
    expect(screen.getByText('Random Recipe')).toBeInTheDocument()
  })

  it('handles scrolling to recipe display', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Mock scrollTo
    const mockScrollTo = vi.fn()
    window.scrollTo = mockScrollTo
    
    // Click on random recipe button
    const randomButton = screen.getByText('Random Recipe')
    await user.click(randomButton)
    
    // Wait for recipe to load and scroll
    await waitFor(() => {
      expect(mockScrollTo).toHaveBeenCalled()
    })
  })

  it('handles multiple recipe generations', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Generate first recipe
    const randomButton = screen.getByText('Random Recipe')
    await user.click(randomButton)
    
    await waitFor(() => {
      expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
    })
    
    // Generate second recipe
    await user.click(randomButton)
    
    await waitFor(() => {
      expect(screen.getByText('Grilled Pork')).toBeInTheDocument()
    })
  })

  it('maintains recipe state when switching tabs', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Generate a recipe
    const randomButton = screen.getByText('Random Recipe')
    await user.click(randomButton)
    
    await waitFor(() => {
      expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
    })
    
    // Switch to another tab and back
    const whatIHaveTab = screen.getByText('What I Have')
    await user.click(whatIHaveTab)
    
    const randomTab = screen.getByText('Random Recipe')
    await user.click(randomTab)
    
    // Recipe should still be displayed
    expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
  })

  it('handles empty ingredient selection gracefully', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Click on What I Have tab
    const whatIHaveTab = screen.getByText('What I Have')
    await user.click(whatIHaveTab)
    
    // Click generate without selecting ingredients
    const generateButton = screen.getByText('Generate Recipe')
    await user.click(generateButton)
    
    // Should handle gracefully (no crash)
    expect(generateButton).toBeInTheDocument()
  })

  it('handles search with no results', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Click on Search Recipe tab
    const searchTab = screen.getByText('Search Recipe')
    await user.click(searchTab)
    
    // Type in search input with no matches
    const searchInput = screen.getByPlaceholderText('Search for a recipe...')
    await user.type(searchInput, 'nonexistent')
    
    // Should handle gracefully
    expect(searchInput.value).toBe('nonexistent')
  })

  it('displays recipe emoji', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    // Click on random recipe button
    const randomButton = screen.getByText('Random Recipe')
    await user.click(randomButton)
    
    // Wait for recipe to load
    await waitFor(() => {
      expect(screen.getByText('🥩')).toBeInTheDocument()
    })
  })

  it('handles rapid button clicks gracefully', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DishToday />)
    
    const randomButton = screen.getByText('Random Recipe')
    
    // Click rapidly multiple times
    await user.click(randomButton)
    await user.click(randomButton)
    await user.click(randomButton)
    
    // Should handle gracefully
    expect(randomButton).toBeInTheDocument()
  })
})
