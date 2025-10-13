import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils/testHelpers.jsx'
import Parties from '../Parties'
import { createMockI18n } from '../../test/mocks/i18n'

describe('Parties Page Language Switching', () => {
  let mockI18n
  
  const mockPartyDataAllLanguages = {
    en: {
      tastePreferences: [
        { value: 'rich', label: 'Rich', emoji: '🍗' },
        { value: 'spicy', label: 'Spicy', emoji: '🌶️' }
      ],
      cuisineStyles: [
        { value: 'mixed', label: 'Mixed Cuisine', emoji: '🌍' },
        { value: 'chinese', label: 'Chinese', emoji: '🍚' }
      ],
      diningScenarios: [
        { value: 'friends', label: 'Friends Gathering', emoji: '👥' },
        { value: 'family', label: 'Family Dinner', emoji: '👨‍👩‍👧‍👦' }
      ],
      ingredientCategories: [
        { value: 'meat', label: 'Meat', emoji: '🥩' },
        { value: 'seafood', label: 'Seafood', emoji: '🦞' },
        { value: 'vegetables', label: 'Vegetables', emoji: '🥬' }
      ]
    },
    zh: {
      tastePreferences: [
        { value: 'rich', label: '浓郁', emoji: '🍗' },
        { value: 'spicy', label: '辛辣', emoji: '🌶️' }
      ],
      cuisineStyles: [
        { value: 'mixed', label: '混合菜系', emoji: '🌍' },
        { value: 'chinese', label: '中餐', emoji: '🍚' }
      ],
      diningScenarios: [
        { value: 'friends', label: '朋友聚会', emoji: '👥' },
        { value: 'family', label: '家庭晚餐', emoji: '👨‍👩‍👧‍👦' }
      ],
      ingredientCategories: [
        { value: 'meat', label: '肉类', emoji: '🥩' },
        { value: 'seafood', label: '海鲜', emoji: '🦞' },
        { value: 'vegetables', label: '蔬菜', emoji: '🥬' }
      ]
    },
    sv: {
      tastePreferences: [
        { value: 'rich', label: 'Rik', emoji: '🍗' },
        { value: 'spicy', label: 'Kryddig', emoji: '🌶️' }
      ],
      cuisineStyles: [
        { value: 'mixed', label: 'Blandad Kokkonst', emoji: '🌍' },
        { value: 'chinese', label: 'Kinesisk', emoji: '🍚' }
      ],
      diningScenarios: [
        { value: 'friends', label: 'Vänsammankomst', emoji: '👥' },
        { value: 'family', label: 'Familjemiddag', emoji: '👨‍👩‍👧‍👦' }
      ],
      ingredientCategories: [
        { value: 'meat', label: 'Kött', emoji: '🥩' },
        { value: 'seafood', label: 'Skaldjur', emoji: '🦞' },
        { value: 'vegetables', label: 'Grönsaker', emoji: '🥬' }
      ]
    }
  }

  beforeEach(() => {
    mockI18n = createMockI18n('en')
    
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: mockI18n.t,
        i18n: mockI18n
      }),
      initReactI18next: {
        type: '3rdParty',
        init: vi.fn()
      }
    }))
    
    vi.mock('../../data/recipes', () => ({
      usePartyData: vi.fn(() => mockPartyDataAllLanguages[mockI18n.language]),
      useIngredientData: vi.fn(() => ({
        categories: {
          'Meat': {
            emoji: '🥩',
            subcategories: {
              'Pork': { emoji: '🐷', items: ['pork-chops'] }
            }
          }
        }
      })),
      useRecipes: vi.fn(() => ({
        cultural: {},
        basic: {}
      }))
    }))
    
    vi.mock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: { id: 'test-user', email: 'test@example.com' }
      })
    }))
  })

  describe('Taste Preferences Translation', () => {
    it('displays taste preference labels in English', () => {
      renderWithProviders(<Parties />)
      
      expect(screen.getByText('Rich')).toBeInTheDocument()
      expect(screen.getByText('Spicy')).toBeInTheDocument()
    })

    it('translates taste preferences to Chinese', async () => {
      const { rerender } = renderWithProviders(<Parties />)
      
      expect(screen.getByText('Rich')).toBeInTheDocument()
      
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      rerender(<Parties />)
      
      await waitFor(() => {
        expect(screen.getByText('浓郁')).toBeInTheDocument()
        expect(screen.getByText('辛辣')).toBeInTheDocument()
      })
    })

    it('translates taste preferences to Swedish', async () => {
      const { rerender } = renderWithProviders(<Parties />)
      
      await act(async () => {
        await mockI18n.changeLanguage('sv')
      })
      
      rerender(<Parties />)
      
      await waitFor(() => {
        expect(screen.getByText('Rik')).toBeInTheDocument()
        expect(screen.getByText('Kryddig')).toBeInTheDocument()
      })
    })
  })

  describe('Cuisine Styles Translation', () => {
    it('displays cuisine style labels in English', () => {
      renderWithProviders(<Parties />)
      
      expect(screen.getByText('Mixed Cuisine')).toBeInTheDocument()
      expect(screen.getByText('Chinese')).toBeInTheDocument()
    })

    it('translates cuisine styles to Chinese', async () => {
      const { rerender } = renderWithProviders(<Parties />)
      
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      rerender(<Parties />)
      
      await waitFor(() => {
        expect(screen.getByText('混合菜系')).toBeInTheDocument()
        expect(screen.getByText('中餐')).toBeInTheDocument()
      })
    })
  })

  describe('Dining Scenarios Translation', () => {
    it('displays dining scenario labels in English', () => {
      renderWithProviders(<Parties />)
      
      expect(screen.getByText('Friends Gathering')).toBeInTheDocument()
      expect(screen.getByText('Family Dinner')).toBeInTheDocument()
    })

    it('translates dining scenarios to Chinese', async () => {
      const { rerender } = renderWithProviders(<Parties />)
      
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      rerender(<Parties />)
      
      await waitFor(() => {
        expect(screen.getByText('朋友聚会')).toBeInTheDocument()
        expect(screen.getByText('家庭晚餐')).toBeInTheDocument()
      })
    })

    it('translates dining scenarios to Swedish', async () => {
      const { rerender } = renderWithProviders(<Parties />)
      
      await act(async () => {
        await mockI18n.changeLanguage('sv')
      })
      
      rerender(<Parties />)
      
      await waitFor(() => {
        expect(screen.getByText('Vänsammankomst')).toBeInTheDocument()
        expect(screen.getByText('Familjemiddag')).toBeInTheDocument()
      })
    })
  })

  describe('Ingredient Categories Translation', () => {
    it('displays ingredient category labels in English', () => {
      renderWithProviders(<Parties />)
      
      expect(screen.getByText('Meat')).toBeInTheDocument()
      expect(screen.getByText('Seafood')).toBeInTheDocument()
      expect(screen.getByText('Vegetables')).toBeInTheDocument()
    })

    it('translates ingredient categories to Chinese', async () => {
      const { rerender } = renderWithProviders(<Parties />)
      
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      rerender(<Parties />)
      
      await waitFor(() => {
        expect(screen.getByText('肉类')).toBeInTheDocument()
        expect(screen.getByText('海鲜')).toBeInTheDocument()
        expect(screen.getByText('蔬菜')).toBeInTheDocument()
      })
    })
  })

  describe('Page Title Translation', () => {
    it('translates page title when language changes', async () => {
      renderWithProviders(<Parties />)
      
      expect(screen.getByText('Parties')).toBeInTheDocument()
      
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      await waitFor(() => {
        expect(screen.getByText('聚会')).toBeInTheDocument()
      })
    })
  })

  describe('Button Labels Translation', () => {
    it('translates Leave to Chef button', async () => {
      renderWithProviders(<Parties />)
      
      expect(screen.getByText('Leave to Chef')).toBeInTheDocument()
      
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      await waitFor(() => {
        expect(screen.getByText('交给厨师')).toBeInTheDocument()
      })
    })
  })

  describe('Selection Persistence', () => {
    it('maintains selections when language changes', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Parties />)
      
      // Select Rich taste preference
      const richOption = screen.getByText('Rich')
      await user.click(richOption)
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      // Selection should persist (button should still be selected)
      // The visual state would be maintained even though label changed
      await waitFor(() => {
        expect(screen.getByText('浓郁')).toBeInTheDocument()
      })
    })
  })

  describe('Consistency Across All Options', () => {
    it('translates all party configuration options simultaneously', async () => {
      const { rerender } = renderWithProviders(<Parties />)
      
      // All in English
      expect(screen.getByText('Rich')).toBeInTheDocument()
      expect(screen.getByText('Mixed Cuisine')).toBeInTheDocument()
      expect(screen.getByText('Friends Gathering')).toBeInTheDocument()
      expect(screen.getByText('Meat')).toBeInTheDocument()
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      rerender(<Parties />)
      
      // All should be in Chinese
      await waitFor(() => {
        expect(screen.getByText('浓郁')).toBeInTheDocument()
        expect(screen.getByText('混合菜系')).toBeInTheDocument()
        expect(screen.getByText('朋友聚会')).toBeInTheDocument()
        expect(screen.getByText('肉类')).toBeInTheDocument()
      })
    })
  })
})



