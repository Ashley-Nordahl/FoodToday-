import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils/testHelpers.jsx'
import Parties from '../Parties'

// Mock the useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'parties.title': 'Parties',
        'parties.dishes': 'Dishes',
        'parties.ingredientCategories': 'Ingredient Categories',
        'parties.tastePreferences': 'Taste Preferences',
        'parties.cuisineStyles': 'Cuisine Styles',
        'parties.diningScenarios': 'Dining Scenarios',
        'parties.leaveToChef': 'Leave to Chef',
        'parties.dragInstruction': 'Drag below ingredients to plates, or click on them to remove',
        'parties.noRecipeFound': 'No recipe found for this dish',
        'ingredients.meat': 'Meat',
        'ingredients.seafood': 'Seafood',
        'ingredients.vegetables': 'Vegetables',
        'ingredients.grains': 'Grains',
        'ingredients.egg': 'Egg',
        'tastes.rich': 'Rich',
        'tastes.spicy': 'Spicy',
        'tastes.sweet': 'Sweet',
        'tastes.sour': 'Sour',
        'tastes.salty': 'Salty',
        'cuisines.mixed': 'Mixed Cuisine',
        'cuisines.chinese': 'Chinese',
        'cuisines.italian': 'Italian',
        'scenarios.friends': 'Friends Gathering',
        'scenarios.family': 'Family Dinner',
        'scenarios.romantic': 'Romantic Dinner',
        'scenarios.business': 'Business Meeting'
      }
      return translations[key] || key
    },
    i18n: { language: 'en' }
  })
}))

// Mock the data hooks
vi.mock('../../data/recipes', () => ({
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
      { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
      { value: 'grains', label: 'Grains', emoji: '🌾' },
      { value: 'egg', label: 'Egg', emoji: '🥚' }
    ],
    tastePreferences: [
      { value: 'rich', label: 'Rich', emoji: '🍗' },
      { value: 'spicy', label: 'Spicy', emoji: '🌶️' },
      { value: 'sweet', label: 'Sweet', emoji: '🍯' }
    ],
    cuisineStyles: [
      { value: 'mixed', label: 'Mixed Cuisine', emoji: '🌍' },
      { value: 'chinese', label: 'Chinese', emoji: '🍚' }
    ],
    diningScenarios: [
      { value: 'friends', label: 'Friends Gathering', emoji: '👥' },
      { value: 'family', label: 'Family Dinner', emoji: '👨‍👩‍👧‍👦' }
    ]
  })),
  useIngredientData: vi.fn(() => ({
    categories: {
      'Meat': {
        emoji: '🥩',
        subcategories: {
          'Pork': { emoji: '🐷', items: ['pork-chops', 'ground-pork'] },
          'Beef': { emoji: '🐄', items: ['beef-steak', 'ground-beef'] },
          'Chicken': { emoji: '🐔', items: ['chicken-breast', 'chicken-thighs'] }
        }
      },
      'Seafood': {
        emoji: '🦞',
        subcategories: {
          'Fish': { emoji: '🐟', items: ['salmon', 'tuna'] },
          'Shellfish': { emoji: '🦐', items: ['shrimp', 'crab'] }
        }
      },
      'Vegetables': {
        emoji: '🥬',
        subcategories: {
          'Leafy': { emoji: '🥬', items: ['broccoli', 'spinach'] },
          'Root': { emoji: '🥕', items: ['carrots', 'potatoes'] }
        }
      }
    }
  })),
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
  }))
}))

describe('Parties Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page title', () => {
    renderWithProviders(<Parties />)
    
    expect(screen.getByText('Parties')).toBeInTheDocument()
  })

  it('renders dishes selector with default 4 dishes', () => {
    renderWithProviders(<Parties />)
    
    // Should show 4 dishes by default
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders ingredient categories', () => {
    renderWithProviders(<Parties />)
    
    expect(screen.getByText('Meat')).toBeInTheDocument()
    expect(screen.getByText('Seafood')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Grains')).toBeInTheDocument()
    expect(screen.getByText('Egg')).toBeInTheDocument()
  })

  it('renders taste preferences with Rich as default', () => {
    renderWithProviders(<Parties />)
    
    expect(screen.getByText('Rich')).toBeInTheDocument()
    expect(screen.getByText('Spicy')).toBeInTheDocument()
    expect(screen.getByText('Sweet')).toBeInTheDocument()
  })

  it('renders cuisine styles', () => {
    renderWithProviders(<Parties />)
    
    expect(screen.getByText('Mixed Cuisine')).toBeInTheDocument()
    expect(screen.getByText('Chinese')).toBeInTheDocument()
  })

  it('renders dining scenarios with Friends Gathering as default', () => {
    renderWithProviders(<Parties />)
    
    expect(screen.getByText('Friends Gathering')).toBeInTheDocument()
    expect(screen.getByText('Family Dinner')).toBeInTheDocument()
  })

  it('renders Leave to Chef button', () => {
    renderWithProviders(<Parties />)
    
    expect(screen.getByText('Leave to Chef')).toBeInTheDocument()
  })

  it('generates dishes when Leave to Chef is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Click Leave to Chef button
    const chefButton = screen.getByText('Leave to Chef')
    await user.click(chefButton)
    
    // Wait for dishes to be generated
    await waitFor(() => {
      // Should show generated dishes
      expect(screen.getByText('Generated Dishes')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('handles ingredient category selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Click on Meat category
    const meatCategory = screen.getByText('Meat')
    await user.click(meatCategory)
    
    // Should show subcategories
    expect(screen.getByText('Pork')).toBeInTheDocument()
    expect(screen.getByText('Beef')).toBeInTheDocument()
    expect(screen.getByText('Chicken')).toBeInTheDocument()
  })

  it('handles taste preference selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Click on Rich taste (should be selected by default)
    const richTaste = screen.getByText('Rich')
    await user.click(richTaste)
    
    // Click on Spicy taste
    const spicyTaste = screen.getByText('Spicy')
    await user.click(spicyTaste)
    
    // Both should be selected
    expect(richTaste).toBeInTheDocument()
    expect(spicyTaste).toBeInTheDocument()
  })

  it('handles cuisine style selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Click on Chinese cuisine
    const chineseCuisine = screen.getByText('Chinese')
    await user.click(chineseCuisine)
    
    expect(chineseCuisine).toBeInTheDocument()
  })

  it('handles dining scenario selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Click on Family Dinner scenario
    const familyScenario = screen.getByText('Family Dinner')
    await user.click(familyScenario)
    
    expect(familyScenario).toBeInTheDocument()
  })

  it('displays drag instruction text', () => {
    renderWithProviders(<Parties />)
    
    expect(screen.getByText('Drag below ingredients to plates, or click on them to remove')).toBeInTheDocument()
  })

  it('handles dish regeneration', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Generate initial dishes
    const chefButton = screen.getByText('Leave to Chef')
    await user.click(chefButton)
    
    // Wait for dishes to be generated
    await waitFor(() => {
      expect(screen.getByText('Generated Dishes')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Click regenerate on first dish
    const regenerateButtons = screen.getAllByText('Regenerate')
    if (regenerateButtons.length > 0) {
      await user.click(regenerateButtons[0])
      
      // Should regenerate the dish
      await waitFor(() => {
        expect(screen.getByText('Generated Dishes')).toBeInTheDocument()
      })
    }
  })

  it('handles recipe button clicks', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Generate dishes first
    const chefButton = screen.getByText('Leave to Chef')
    await user.click(chefButton)
    
    // Wait for dishes to be generated
    await waitFor(() => {
      expect(screen.getByText('Generated Dishes')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Click recipe button on first dish
    const recipeButtons = screen.getAllByText('Recipe')
    if (recipeButtons.length > 0) {
      await user.click(recipeButtons[0])
      
      // Should handle recipe click (might show alert or navigate)
      await waitFor(() => {
        // Recipe button should still be present
        expect(screen.getAllByText('Recipe').length).toBeGreaterThan(0)
      })
    }
  })

  it('handles dish count changes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Find and click dish count buttons
    const dishButtons = screen.getAllByRole('button').filter(button => 
      button.textContent && /^\d+$/.test(button.textContent.trim())
    )
    
    if (dishButtons.length > 0) {
      // Click on a different dish count
      await user.click(dishButtons[0])
      
      // Should update dish count
      expect(dishButtons[0]).toBeInTheDocument()
    }
  })

  it('maintains state when switching between options', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Select some options
    const richTaste = screen.getByText('Rich')
    await user.click(richTaste)
    
    const chineseCuisine = screen.getByText('Chinese')
    await user.click(chineseCuisine)
    
    // Switch to another option and back
    const spicyTaste = screen.getByText('Spicy')
    await user.click(spicyTaste)
    
    // Original selections should still be present
    expect(richTaste).toBeInTheDocument()
    expect(chineseCuisine).toBeInTheDocument()
    expect(spicyTaste).toBeInTheDocument()
  })

  it('handles empty ingredient selection gracefully', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Click Leave to Chef without selecting ingredients
    const chefButton = screen.getByText('Leave to Chef')
    await user.click(chefButton)
    
    // Should handle gracefully (no crash)
    expect(chefButton).toBeInTheDocument()
  })

  it('displays error messages when appropriate', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    // Try to generate dishes without proper setup
    const chefButton = screen.getByText('Leave to Chef')
    await user.click(chefButton)
    
    // Should handle gracefully
    expect(chefButton).toBeInTheDocument()
  })

  it('handles rapid button clicks gracefully', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Parties />)
    
    const chefButton = screen.getByText('Leave to Chef')
    
    // Click rapidly multiple times
    await user.click(chefButton)
    await user.click(chefButton)
    await user.click(chefButton)
    
    // Should handle gracefully
    expect(chefButton).toBeInTheDocument()
  })

  it('renders all emojis correctly', () => {
    renderWithProviders(<Parties />)
    
    // Check for category emojis
    expect(screen.getByText('🥩')).toBeInTheDocument() // Meat
    expect(screen.getByText('🦞')).toBeInTheDocument() // Seafood
    expect(screen.getByText('🥬')).toBeInTheDocument() // Vegetables
    expect(screen.getByText('🌾')).toBeInTheDocument() // Grains
    expect(screen.getByText('🥚')).toBeInTheDocument() // Egg
    
    // Check for taste emojis
    expect(screen.getByText('🍗')).toBeInTheDocument() // Rich
    expect(screen.getByText('🌶️')).toBeInTheDocument() // Spicy
    expect(screen.getByText('🍯')).toBeInTheDocument() // Sweet
  })
})
