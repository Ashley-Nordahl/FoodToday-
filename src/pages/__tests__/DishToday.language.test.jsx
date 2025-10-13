import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, switchLanguage } from '../../test/utils/testHelpers.jsx'
import DishToday from '../DishToday'
import { createMockI18n } from '../../test/mocks/i18n'
import { mockRecipeDataAllLanguages, getRecipeById } from '../../test/mocks/recipeData'

describe('DishToday Language Switching', () => {
  let mockI18n
  let mockUseRecipes
  
  beforeEach(() => {
    mockI18n = createMockI18n('en')
    
    // Mock useRecipes to return data based on current language
    mockUseRecipes = vi.fn(() => mockRecipeDataAllLanguages[mockI18n.language])
    
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
      useRecipes: mockUseRecipes,
      getRandomRecipe: vi.fn((cuisine) => {
        const data = mockRecipeDataAllLanguages[mockI18n.language]
        const recipes = data.cultural[cuisine]
        return recipes && recipes.length > 0 ? recipes[0] : null
      }),
      getRandomRecipeFromAll: vi.fn(() => {
        const data = mockRecipeDataAllLanguages[mockI18n.language]
        const allRecipes = []
        Object.values(data.cultural).forEach(cuisineRecipes => {
          if (Array.isArray(cuisineRecipes)) {
            allRecipes.push(...cuisineRecipes)
          }
        })
        return allRecipes.length > 0 ? allRecipes[0] : null
      }),
      getRecipesByIngredients: vi.fn(() => []),
      getRecipesByIngredientsFromAll: vi.fn(() => []),
      searchRecipesFromAll: vi.fn(() => [])
    }))
    
    vi.mock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: { id: 'test-user', email: 'test@example.com' }
      })
    }))
    
    vi.mock('../../lib/supabase', () => ({
      trackSelection: vi.fn().mockResolvedValue({ data: {}, error: null })
    }))
  })
  
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  describe('Recipe Name Translation', () => {
    it('translates recipe name when switching from English to Chinese', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Select a recipe in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      // Recipe name should now be in Chinese
      await waitFor(() => {
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
        expect(screen.queryByText('Sweet and Sour Pork')).not.toBeInTheDocument()
      })
    })

    it('translates recipe name when switching from English to Swedish', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Select a recipe in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Switch to Swedish
      await act(async () => {
        await mockI18n.changeLanguage('sv')
      })
      
      // Recipe name should now be in Swedish
      await waitFor(() => {
        expect(screen.getByText('Sötsur Fläsk')).toBeInTheDocument()
        expect(screen.queryByText('Sweet and Sour Pork')).not.toBeInTheDocument()
      })
    })

    it('cycles through all languages correctly', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Select a recipe in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // English → Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      await waitFor(() => {
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      })
      
      // Chinese → Swedish
      await act(async () => {
        await mockI18n.changeLanguage('sv')
      })
      await waitFor(() => {
        expect(screen.getByText('Sötsur Fläsk')).toBeInTheDocument()
      })
      
      // Swedish → English
      await act(async () => {
        await mockI18n.changeLanguage('en')
      })
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
    })
  })

  describe('Recipe Description Translation', () => {
    it('translates recipe description when language changes', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Select a recipe
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText(/delicious Chinese dish/)).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      await waitFor(() => {
        expect(screen.getByText(/一道美味的中国菜/)).toBeInTheDocument()
      })
    })
  })

  describe('Ingredients Translation', () => {
    it('translates ingredient amounts when language changes', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Select a recipe
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText(/1 lb pork chops/)).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      await waitFor(() => {
        expect(screen.getByText(/猪排450克/)).toBeInTheDocument()
        expect(screen.queryByText(/1 lb pork chops/)).not.toBeInTheDocument()
      })
    })

    it('translates all ingredients in the list', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Select a recipe
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText(/pork chops/)).toBeInTheDocument()
        expect(screen.getByText(/bell peppers/)).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      await waitFor(() => {
        expect(screen.getByText(/猪排/)).toBeInTheDocument()
        expect(screen.getByText(/甜椒/)).toBeInTheDocument()
      })
    })
  })

  describe('Instructions Translation', () => {
    it('translates cooking instructions when language changes', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Select a recipe
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Cut pork into bite-sized pieces/)).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      await waitFor(() => {
        expect(screen.getByText(/将猪肉切成一口大小的块/)).toBeInTheDocument()
        expect(screen.queryByText(/Cut pork into bite-sized pieces/)).not.toBeInTheDocument()
      })
    })

    it('translates all instruction steps', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Select a recipe
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Heat oil in a wok/)).toBeInTheDocument()
        expect(screen.getByText(/Serve immediately over rice/)).toBeInTheDocument()
      })
      
      // Switch to Swedish
      await act(async () => {
        await mockI18n.changeLanguage('sv')
      })
      
      await waitFor(() => {
        expect(screen.getByText(/Hetta upp olja i en wok/)).toBeInTheDocument()
        expect(screen.getByText(/Servera direkt med ris/)).toBeInTheDocument()
      })
    })
  })

  describe('Recipe Selection Persistence', () => {
    it('maintains recipe selection across language changes', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Select a recipe
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Get the recipe ID (should be 1)
      const englishRecipe = getRecipeById(1, 'en')
      expect(englishRecipe.name).toBe('Sweet and Sour Pork')
      
      // Switch language
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      // Recipe should still be selected, but in Chinese
      await waitFor(() => {
        const chineseRecipe = getRecipeById(1, 'zh')
        expect(chineseRecipe.name).toBe('糖醋排骨')
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      })
      
      // Recipe ID should remain the same
      expect(englishRecipe.id).toBe(1)
      expect(getRecipeById(1, 'zh').id).toBe(1)
    })

    it('does not lose recipe when switching back and forth', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Select a recipe
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Switch to Chinese and back to English multiple times
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      await waitFor(() => {
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      })
      
      await act(async () => {
        await mockI18n.changeLanguage('en')
      })
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      await waitFor(() => {
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      })
    })
  })

  describe('New Recipe Generation in Current Language', () => {
    it('generates new recipes in the current language', async () => {
      const user = userEvent.setup()
      
      // Start in Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      renderWithProviders(<DishToday />)
      
      // Generate a recipe
      const randomButton = screen.getByText('随机食谱')
      await user.click(randomButton)
      
      // Recipe should appear in Chinese
      await waitFor(() => {
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      })
    })

    it('generates recipes in Swedish when Swedish is selected', async () => {
      const user = userEvent.setup()
      
      // Start in Swedish
      await act(async () => {
        await mockI18n.changeLanguage('sv')
      })
      
      renderWithProviders(<DishToday />)
      
      // Generate a recipe
      const randomButton = screen.getByText('Slumpmässigt Recept')
      await user.click(randomButton)
      
      // Recipe should appear in Swedish
      await waitFor(() => {
        expect(screen.getByText('Sötsur Fläsk')).toBeInTheDocument()
      })
    })
  })

  describe('UI Labels Translation', () => {
    it('translates page title when language changes', async () => {
      renderWithProviders(<DishToday />)
      
      expect(screen.getByText('Dish Today')).toBeInTheDocument()
      
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      await waitFor(() => {
        expect(screen.getByText('今日菜肴')).toBeInTheDocument()
      })
    })

    it('translates tab labels when language changes', async () => {
      renderWithProviders(<DishToday />)
      
      expect(screen.getByText('Random Recipe')).toBeInTheDocument()
      expect(screen.getByText('What I Have')).toBeInTheDocument()
      
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      await waitFor(() => {
        expect(screen.getByText('随机食谱')).toBeInTheDocument()
        expect(screen.getByText('我有什么')).toBeInTheDocument()
      })
    })
  })
})



