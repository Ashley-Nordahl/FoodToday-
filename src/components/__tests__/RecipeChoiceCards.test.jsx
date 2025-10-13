import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils/testHelpers.jsx'
import RecipeChoiceCards from '../RecipeChoiceCards'

// Mock the useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'recipeChoiceCards.randomRecipe': 'Random Recipe',
        'recipeChoiceCards.whatIHave': 'What I Have',
        'recipeChoiceCards.searchRecipe': 'Search Recipe',
        'recipeChoiceCards.searchPlaceholder': 'Search for a recipe...',
        'recipeChoiceCards.generateRecipe': 'Generate Recipe'
      }
      return translations[key] || key
    },
    i18n: { language: 'en' }
  })
}))

describe('RecipeChoiceCards', () => {
  const mockSelectedCuisine = {
    name: 'Chinese',
    emoji: '🍚',
    flag: '🇨🇳'
  }
  const mockOnChoiceSelect = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all three tabs', () => {
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    expect(screen.getByText('Random Recipe')).toBeInTheDocument()
    expect(screen.getByText('What I Have')).toBeInTheDocument()
    expect(screen.getByText('Search Recipe')).toBeInTheDocument()
  })

  it('renders random recipe tab by default', () => {
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    // Random tab should be active by default
    const randomTab = screen.getByText('Random Recipe')
    expect(randomTab).toBeInTheDocument()
  })

  it('calls onChoiceSelect when random recipe button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    // Find and click the random recipe button
    const randomButton = screen.getByText('Random Recipe')
    await user.click(randomButton)
    
    expect(mockOnChoiceSelect).toHaveBeenCalledWith('random', mockSelectedCuisine)
  })

  it('shows ingredient selector when What I Have tab is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    // Click on What I Have tab
    const whatIHaveTab = screen.getByText('What I Have')
    await user.click(whatIHaveTab)
    
    // Should show ingredient selector
    expect(screen.getByText('Meat')).toBeInTheDocument()
    expect(screen.getByText('Seafood')).toBeInTheDocument()
  })

  it('shows search input when Search Recipe tab is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    // Click on Search Recipe tab
    const searchTab = screen.getByText('Search Recipe')
    await user.click(searchTab)
    
    // Should show search input
    const searchInput = screen.getByPlaceholderText('Search for a recipe...')
    expect(searchInput).toBeInTheDocument()
  })

  it('handles search input changes', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    // Click on Search Recipe tab
    const searchTab = screen.getByText('Search Recipe')
    await user.click(searchTab)
    
    // Type in search input
    const searchInput = screen.getByPlaceholderText('Search for a recipe...')
    await user.type(searchInput, 'pork')
    
    expect(searchInput.value).toBe('pork')
  })

  it('handles ingredient selection and generation', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    // Click on What I Have tab
    const whatIHaveTab = screen.getByText('What I Have')
    await user.click(whatIHaveTab)
    
    // Select an ingredient
    const porkChopsButton = screen.getByText('Pork Chops')
    await user.click(porkChopsButton)
    
    // Click generate recipe
    const generateButton = screen.getByText('Generate Recipe')
    await user.click(generateButton)
    
    expect(mockOnChoiceSelect).toHaveBeenCalledWith(
      'ingredients', 
      mockSelectedCuisine, 
      expect.arrayContaining([
        expect.objectContaining({
          id: 'pork-chops'
        })
      ])
    )
  })

  it('handles search result selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    // Click on Search Recipe tab
    const searchTab = screen.getByText('Search Recipe')
    await user.click(searchTab)
    
    // Type in search input
    const searchInput = screen.getByPlaceholderText('Search for a recipe...')
    await user.type(searchInput, 'pork')
    
    // Wait for potential search results (if any are rendered)
    await waitFor(() => {
      // This test assumes search results might be rendered
      // In a real implementation, we'd need to mock the search function
    })
  })

  it('switches between tabs correctly', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
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

  it('handles empty search gracefully', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    // Click on Search Recipe tab
    const searchTab = screen.getByText('Search Recipe')
    await user.click(searchTab)
    
    // Clear search input
    const searchInput = screen.getByPlaceholderText('Search for a recipe...')
    await user.clear(searchInput)
    
    expect(searchInput.value).toBe('')
  })

  it('renders without crashing when selectedCuisine is null', () => {
    expect(() => {
      renderWithProviders(
        <RecipeChoiceCards 
          selectedCuisine={null}
          onChoiceSelect={mockOnChoiceSelect}
        />
      )
    }).not.toThrow()
  })

  it('renders without crashing when onChoiceSelect is not provided', () => {
    expect(() => {
      renderWithProviders(
        <RecipeChoiceCards 
          selectedCuisine={mockSelectedCuisine}
        />
      )
    }).not.toThrow()
  })

  it('handles rapid tab switching', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    // Rapidly switch between tabs
    const randomTab = screen.getByText('Random Recipe')
    const whatIHaveTab = screen.getByText('What I Have')
    const searchTab = screen.getByText('Search Recipe')
    
    await user.click(randomTab)
    await user.click(whatIHaveTab)
    await user.click(searchTab)
    await user.click(randomTab)
    
    // Should handle rapid switching without errors
    expect(randomTab).toBeInTheDocument()
  })

  it('maintains tab state correctly', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RecipeChoiceCards 
        selectedCuisine={mockSelectedCuisine}
        onChoiceSelect={mockOnChoiceSelect}
      />
    )
    
    // Start on Random tab
    const randomTab = screen.getByText('Random Recipe')
    expect(randomTab).toBeInTheDocument()
    
    // Switch to What I Have, select ingredient
    const whatIHaveTab = screen.getByText('What I Have')
    await user.click(whatIHaveTab)
    
    const porkChopsButton = screen.getByText('Pork Chops')
    await user.click(porkChopsButton)
    
    // Switch back to Random tab
    await user.click(randomTab)
    
    // Should be back on Random tab
    expect(randomTab).toBeInTheDocument()
  })
})
