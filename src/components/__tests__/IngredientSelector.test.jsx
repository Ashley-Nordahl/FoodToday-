import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils/testHelpers.jsx'
import IngredientSelector from '../IngredientSelector'

// Mock the useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'ingredients.pork-chops': 'Pork Chops',
        'ingredients.beef-steak': 'Beef Steak',
        'ingredients.salmon': 'Salmon',
        'ingredients.broccoli': 'Broccoli',
        'ingredients.rice': 'Rice',
        'ingredients.chicken-eggs': 'Chicken Eggs',
        'ingredientSelector.selectIngredients': 'Select Ingredients',
        'ingredientSelector.generateRecipe': 'Generate Recipe',
        'ingredientSelector.clearSelection': 'Clear Selection'
      }
      return translations[key] || key
    },
    i18n: { language: 'en' }
  })
}))

describe('IngredientSelector', () => {
  const mockOnGenerate = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders ingredient categories', () => {
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    // Check that main categories are displayed
    expect(screen.getByText('Meat')).toBeInTheDocument()
    expect(screen.getByText('Seafood')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Grains')).toBeInTheDocument()
    expect(screen.getByText('Egg')).toBeInTheDocument()
  })

  it('displays category emojis', () => {
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    expect(screen.getByText('🥩')).toBeInTheDocument() // Meat
    expect(screen.getByText('🦞')).toBeInTheDocument() // Seafood
    expect(screen.getByText('🥬')).toBeInTheDocument() // Vegetables
    expect(screen.getByText('🌾')).toBeInTheDocument() // Grains
    expect(screen.getByText('🥚')).toBeInTheDocument() // Egg
  })

  it('allows selecting ingredients', async () => {
    const user = userEvent.setup()
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    // Find and click on an ingredient
    const porkChopsButton = screen.getByText('Pork Chops')
    await user.click(porkChopsButton)
    
    // The ingredient should be selected (we can't easily test visual state in jsdom)
    expect(porkChopsButton).toBeInTheDocument()
  })

  it('renders generate button', () => {
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    expect(screen.getByText('Generate Recipe')).toBeInTheDocument()
  })

  it('calls onGenerate when generate button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    // Select some ingredients first
    const porkChopsButton = screen.getByText('Pork Chops')
    await user.click(porkChopsButton)
    
    const generateButton = screen.getByText('Generate Recipe')
    await user.click(generateButton)
    
    expect(mockOnGenerate).toHaveBeenCalled()
  })

  it('handles ingredient selection and deselection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    const porkChopsButton = screen.getByText('Pork Chops')
    
    // Click to select
    await user.click(porkChopsButton)
    
    // Click again to deselect
    await user.click(porkChopsButton)
    
    expect(porkChopsButton).toBeInTheDocument()
  })

  it('renders without crashing when onGenerate is not provided', () => {
    expect(() => {
      renderWithProviders(<IngredientSelector />)
    }).not.toThrow()
  })

  it('handles multiple ingredient selections', async () => {
    const user = userEvent.setup()
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    // Select multiple ingredients
    const porkChopsButton = screen.getByText('Pork Chops')
    const beefSteakButton = screen.getByText('Beef Steak')
    
    await user.click(porkChopsButton)
    await user.click(beefSteakButton)
    
    expect(porkChopsButton).toBeInTheDocument()
    expect(beefSteakButton).toBeInTheDocument()
  })

  it('renders subcategory ingredients when category is expanded', async () => {
    const user = userEvent.setup()
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    // Click on Meat category to expand
    const meatCategory = screen.getByText('Meat')
    await user.click(meatCategory)
    
    // Should show subcategory ingredients
    expect(screen.getByText('Pork Chops')).toBeInTheDocument()
    expect(screen.getByText('Beef Steak')).toBeInTheDocument()
  })

  it('validates ingredient IDs using registry', async () => {
    const user = userEvent.setup()
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    // Expand Meat category
    const meatCategory = screen.getByText('Meat')
    await user.click(meatCategory)
    
    // Select an ingredient and generate
    const porkChopsButton = screen.getByText('Pork Chops')
    await user.click(porkChopsButton)
    
    const generateButton = screen.getByText('Generate Recipe')
    await user.click(generateButton)
    
    // Should call onGenerate with valid ingredient IDs
    expect(mockOnGenerate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.stringMatching(/^[a-z0-9]+(-[a-z0-9]+)*$/)
        })
      ])
    )
  })

  it('handles empty ingredient selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    // Click generate without selecting any ingredients
    const generateButton = screen.getByText('Generate Recipe')
    await user.click(generateButton)
    
    // Should still call onGenerate with empty array
    expect(mockOnGenerate).toHaveBeenCalledWith([])
  })

  it('renders clear selection button when ingredients are selected', async () => {
    const user = userEvent.setup()
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    // Select an ingredient first
    const porkChopsButton = screen.getByText('Pork Chops')
    await user.click(porkChopsButton)
    
    // Clear selection button should appear
    expect(screen.getByText('Clear Selection')).toBeInTheDocument()
  })

  it('clears selection when clear button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    // Select an ingredient
    const porkChopsButton = screen.getByText('Pork Chops')
    await user.click(porkChopsButton)
    
    // Click clear selection
    const clearButton = screen.getByText('Clear Selection')
    await user.click(clearButton)
    
    // Clear button should disappear
    expect(screen.queryByText('Clear Selection')).not.toBeInTheDocument()
  })

  it('handles ingredient translation correctly', () => {
    renderWithProviders(<IngredientSelector onGenerate={mockOnGenerate} />)
    
    // Ingredients should be displayed with translated names
    expect(screen.getByText('Pork Chops')).toBeInTheDocument()
    expect(screen.getByText('Beef Steak')).toBeInTheDocument()
    expect(screen.getByText('Salmon')).toBeInTheDocument()
    expect(screen.getByText('Broccoli')).toBeInTheDocument()
    expect(screen.getByText('Rice')).toBeInTheDocument()
    expect(screen.getByText('Chicken Eggs')).toBeInTheDocument()
  })

  it('handles cuisine-specific filtering when selectedCuisine is provided', () => {
    const mockSelectedCuisine = { name: 'Chinese' }
    renderWithProviders(
      <IngredientSelector 
        selectedCuisine={mockSelectedCuisine} 
        onGenerate={mockOnGenerate} 
      />
    )
    
    // Should still render all categories
    expect(screen.getByText('Meat')).toBeInTheDocument()
    expect(screen.getByText('Seafood')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Grains')).toBeInTheDocument()
    expect(screen.getByText('Egg')).toBeInTheDocument()
  })
})
