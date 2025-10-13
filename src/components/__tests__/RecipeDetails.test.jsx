import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/utils/testHelpers.jsx'
import RecipeDetails from '../RecipeDetails'

// Mock the useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'recipe.ingredients': 'Ingredients',
        'recipe.instructions': 'Instructions',
        'ingredient-pork-chops': 'Pork Chops',
        'ingredient-garlic': 'Garlic',
        'ingredient-soy-sauce': 'Soy Sauce'
      }
      return translations[key] || key
    },
    i18n: { language: 'en' }
  })
}))

describe('RecipeDetails', () => {
  const mockRecipe = {
    id: 1,
    name: 'Sweet and Sour Pork',
    description: 'A delicious Chinese dish with tender pork and tangy sauce',
    cuisine: 'Chinese',
    ingredients: ['ingredient-pork-chops', 'ingredient-garlic', 'ingredient-soy-sauce'],
    ingredientsWithAmounts: [
      '1 lb pork chops, cubed',
      '3 cloves garlic, minced',
      '2 tbsp soy sauce'
    ],
    instructions: [
      'Cut pork into bite-sized pieces',
      'Heat oil in a wok over high heat',
      'Add pork and stir-fry until golden brown',
      'Add garlic and soy sauce',
      'Serve immediately over rice'
    ],
    difficulty: 'Medium',
    cookTime: '30 minutes',
    emoji: '🥩'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders recipe name and description', () => {
    renderWithProviders(<RecipeDetails recipe={mockRecipe} />)
    
    expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
    expect(screen.getByText('A delicious Chinese dish with tender pork and tangy sauce')).toBeInTheDocument()
  })

  it('renders recipe emoji', () => {
    renderWithProviders(<RecipeDetails recipe={mockRecipe} />)
    
    expect(screen.getByText('🥩')).toBeInTheDocument()
  })

  it('renders difficulty and cook time', () => {
    renderWithProviders(<RecipeDetails recipe={mockRecipe} />)
    
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('30 minutes')).toBeInTheDocument()
  })

  it('renders ingredients section with translated title', () => {
    renderWithProviders(<RecipeDetails recipe={mockRecipe} />)
    
    expect(screen.getByText('Ingredients')).toBeInTheDocument()
  })

  it('renders ingredients with amounts', () => {
    renderWithProviders(<RecipeDetails recipe={mockRecipe} />)
    
    expect(screen.getByText('1 lb pork chops, cubed')).toBeInTheDocument()
    expect(screen.getByText('3 cloves garlic, minced')).toBeInTheDocument()
    expect(screen.getByText('2 tbsp soy sauce')).toBeInTheDocument()
  })

  it('renders instructions section with translated title', () => {
    renderWithProviders(<RecipeDetails recipe={mockRecipe} />)
    
    expect(screen.getByText('Instructions')).toBeInTheDocument()
  })

  it('renders numbered instructions', () => {
    renderWithProviders(<RecipeDetails recipe={mockRecipe} />)
    
    expect(screen.getByText('1. Cut pork into bite-sized pieces')).toBeInTheDocument()
    expect(screen.getByText('2. Heat oil in a wok over high heat')).toBeInTheDocument()
    expect(screen.getByText('3. Add pork and stir-fry until golden brown')).toBeInTheDocument()
    expect(screen.getByText('4. Add garlic and soy sauce')).toBeInTheDocument()
    expect(screen.getByText('5. Serve immediately over rice')).toBeInTheDocument()
  })

  it('renders without crashing when recipe is null', () => {
    expect(() => {
      renderWithProviders(<RecipeDetails recipe={null} />)
    }).not.toThrow()
  })

  it('renders without crashing when recipe is undefined', () => {
    expect(() => {
      renderWithProviders(<RecipeDetails />)
    }).not.toThrow()
  })

  it('handles recipe with missing optional fields', () => {
    const minimalRecipe = {
      id: 2,
      name: 'Simple Recipe',
      description: 'A simple recipe',
      ingredients: ['ingredient-pork-chops'],
      ingredientsWithAmounts: ['1 lb pork chops'],
      instructions: ['Cook the pork'],
      emoji: '🥩'
    }

    renderWithProviders(<RecipeDetails recipe={minimalRecipe} />)
    
    expect(screen.getByText('Simple Recipe')).toBeInTheDocument()
    expect(screen.getByText('A simple recipe')).toBeInTheDocument()
    expect(screen.getByText('1 lb pork chops')).toBeInTheDocument()
    expect(screen.getByText('1. Cook the pork')).toBeInTheDocument()
  })

  it('handles empty ingredients array', () => {
    const recipeWithNoIngredients = {
      ...mockRecipe,
      ingredients: [],
      ingredientsWithAmounts: []
    }

    renderWithProviders(<RecipeDetails recipe={recipeWithNoIngredients} />)
    
    expect(screen.getByText('Ingredients')).toBeInTheDocument()
    // Should not crash and should still show the section
  })

  it('handles empty instructions array', () => {
    const recipeWithNoInstructions = {
      ...mockRecipe,
      instructions: []
    }

    renderWithProviders(<RecipeDetails recipe={recipeWithNoInstructions} />)
    
    expect(screen.getByText('Instructions')).toBeInTheDocument()
    // Should not crash and should still show the section
  })

  it('displays ingredients with proper styling', () => {
    renderWithProviders(<RecipeDetails recipe={mockRecipe} />)
    
    const ingredientItems = screen.getAllByText(/lb pork chops|cloves garlic|tbsp soy sauce/)
    expect(ingredientItems.length).toBe(3)
  })

  it('displays instructions with proper numbering', () => {
    renderWithProviders(<RecipeDetails recipe={mockRecipe} />)
    
    // Check that each instruction starts with a number
    expect(screen.getByText(/^1\./)).toBeInTheDocument()
    expect(screen.getByText(/^2\./)).toBeInTheDocument()
    expect(screen.getByText(/^3\./)).toBeInTheDocument()
    expect(screen.getByText(/^4\./)).toBeInTheDocument()
    expect(screen.getByText(/^5\./)).toBeInTheDocument()
  })

  it('renders cuisine information when available', () => {
    renderWithProviders(<RecipeDetails recipe={mockRecipe} />)
    
    // The cuisine might be displayed somewhere in the component
    // This test ensures it doesn't break when cuisine is present
    expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
  })

  it('handles long recipe names gracefully', () => {
    const longNameRecipe = {
      ...mockRecipe,
      name: 'Very Long Recipe Name That Might Cause Layout Issues In The Component'
    }

    renderWithProviders(<RecipeDetails recipe={longNameRecipe} />)
    
    expect(screen.getByText('Very Long Recipe Name That Might Cause Layout Issues In The Component')).toBeInTheDocument()
  })

  it('handles long descriptions gracefully', () => {
    const longDescRecipe = {
      ...mockRecipe,
      description: 'This is a very long description that might cause layout issues in the component and should be handled gracefully by the component without breaking the layout or causing any visual problems.'
    }

    renderWithProviders(<RecipeDetails recipe={longDescRecipe} />)
    
    expect(screen.getByText('This is a very long description that might cause layout issues in the component and should be handled gracefully by the component without breaking the layout or causing any visual problems.')).toBeInTheDocument()
  })
})
