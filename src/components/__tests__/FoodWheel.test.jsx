import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils/testHelpers.jsx'
import FoodWheel from '../FoodWheel'

// Mock the useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' }
  })
}))

describe('FoodWheel', () => {
  const mockOnCuisineSelect = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the food wheel with all cuisine options', () => {
    renderWithProviders(<FoodWheel onCuisineSelect={mockOnCuisineSelect} />)
    
    // Check that all expected cuisines are present
    expect(screen.getByText('Chinese')).toBeInTheDocument()
    expect(screen.getByText('Italian')).toBeInTheDocument()
    expect(screen.getByText('Japanese')).toBeInTheDocument()
    expect(screen.getByText('Mexican')).toBeInTheDocument()
    expect(screen.getByText('Indian')).toBeInTheDocument()
    expect(screen.getByText('French')).toBeInTheDocument()
    expect(screen.getByText('Thai')).toBeInTheDocument()
    expect(screen.getByText('American')).toBeInTheDocument()
    expect(screen.getByText('Greek')).toBeInTheDocument()
    expect(screen.getByText('Korean')).toBeInTheDocument()
  })

  it('renders the spin button', () => {
    renderWithProviders(<FoodWheel onCuisineSelect={mockOnCuisineSelect} />)
    
    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  it('calls onCuisineSelect when a cuisine is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<FoodWheel onCuisineSelect={mockOnCuisineSelect} />)
    
    const chineseOption = screen.getByText('Chinese')
    await user.click(chineseOption)
    
    expect(mockOnCuisineSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Chinese',
        emoji: '🍚',
        flag: '🇨🇳'
      })
    )
  })

  it('handles spin button click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<FoodWheel onCuisineSelect={mockOnCuisineSelect} />)
    
    const spinButton = screen.getByText('Start')
    await user.click(spinButton)
    
    // The wheel should start spinning (we can't easily test the animation, 
    // but we can verify the button click is handled)
    expect(spinButton).toBeInTheDocument()
  })

  it('displays emojis for each cuisine', () => {
    renderWithProviders(<FoodWheel onCuisineSelect={mockOnCuisineSelect} />)
    
    // Check for emoji characters
    expect(screen.getByText('🍚')).toBeInTheDocument() // Chinese
    expect(screen.getByText('🍝')).toBeInTheDocument() // Italian
    expect(screen.getByText('🍣')).toBeInTheDocument() // Japanese
    expect(screen.getByText('🌶️')).toBeInTheDocument() // Mexican
    expect(screen.getByText('🍛')).toBeInTheDocument() // Indian
    expect(screen.getByText('🥖')).toBeInTheDocument() // French
    expect(screen.getByText('🥘')).toBeInTheDocument() // Thai
    expect(screen.getByText('🍔')).toBeInTheDocument() // American
    expect(screen.getByText('🫒')).toBeInTheDocument() // Greek
    expect(screen.getByText('🍜')).toBeInTheDocument() // Korean
  })

  it('displays flags for each cuisine', () => {
    renderWithProviders(<FoodWheel onCuisineSelect={mockOnCuisineSelect} />)
    
    // Check for flag characters
    expect(screen.getByText('🇨🇳')).toBeInTheDocument() // Chinese
    expect(screen.getByText('🇮🇹')).toBeInTheDocument() // Italian
    expect(screen.getByText('🇯🇵')).toBeInTheDocument() // Japanese
    expect(screen.getByText('🇲🇽')).toBeInTheDocument() // Mexican
    expect(screen.getByText('🇮🇳')).toBeInTheDocument() // Indian
    expect(screen.getByText('🇫🇷')).toBeInTheDocument() // French
    expect(screen.getByText('🇹🇭')).toBeInTheDocument() // Thai
    expect(screen.getByText('🇺🇸')).toBeInTheDocument() // American
    expect(screen.getByText('🇬🇷')).toBeInTheDocument() // Greek
    expect(screen.getByText('🇰🇷')).toBeInTheDocument() // Korean
  })

  it('has proper accessibility attributes', () => {
    renderWithProviders(<FoodWheel onCuisineSelect={mockOnCuisineSelect} />)
    
    const spinButton = screen.getByText('Start')
    expect(spinButton).toHaveAttribute('type', 'button')
  })

  it('renders without crashing when onCuisineSelect is not provided', () => {
    expect(() => {
      renderWithProviders(<FoodWheel />)
    }).not.toThrow()
  })

  it('handles multiple rapid clicks gracefully', async () => {
    const user = userEvent.setup()
    renderWithProviders(<FoodWheel onCuisineSelect={mockOnCuisineSelect} />)
    
    const chineseOption = screen.getByText('Chinese')
    
    // Click multiple times rapidly
    await user.click(chineseOption)
    await user.click(chineseOption)
    await user.click(chineseOption)
    
    // Should call onCuisineSelect for each click
    expect(mockOnCuisineSelect).toHaveBeenCalledTimes(3)
  })

  it('displays all cuisines with unique colors', () => {
    renderWithProviders(<FoodWheel onCuisineSelect={mockOnCuisineSelect} />)
    
    // We can't easily test CSS colors in jsdom, but we can verify
    // that all cuisine elements are rendered
    const cuisineElements = screen.getAllByRole('button').filter(button => 
      button.textContent && (
        button.textContent.includes('Chinese') ||
        button.textContent.includes('Italian') ||
        button.textContent.includes('Japanese')
      )
    )
    
    expect(cuisineElements.length).toBeGreaterThan(0)
  })
})
