import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../utils/testHelpers.jsx'
import DishToday from '../../pages/DishToday'
import RecipeDetails from '../../components/RecipeDetails'
import { createMockI18n } from '../mocks/i18n'
import { mockRecipeDataAllLanguages, getRecipeById } from '../mocks/recipeData'

/**
 * CRITICAL TEST SUITE: Language Mixing Detection
 * 
 * These tests verify that NO language mixing occurs:
 * - No English ingredients with Chinese instructions
 * - No Chinese recipe names with English descriptions
 * - No mixed language content anywhere in the UI
 * 
 * Any failure here indicates a SERIOUS bug that breaks user experience
 */

// Mock setup - avoid hoisting issues by not using external variables
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal()
  
  return {
    ...actual,
    useTranslation: vi.fn(),
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn()
    }
  }
})

vi.mock('../../data/recipes', async () => {
  return {
    useRecipes: vi.fn(),
    getRandomRecipe: vi.fn(),
    getRandomRecipeFromAll: vi.fn(),
    getRecipesByIngredients: vi.fn(() => []),
    getRecipesByIngredientsFromAll: vi.fn(() => []),
    searchRecipesFromAll: vi.fn(() => [])
  }
})

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' }
  })
}))

vi.mock('../../lib/supabase', () => ({
  trackSelection: vi.fn().mockResolvedValue({ data: {}, error: null })
}))

describe('Language Mixing Prevention - CRITICAL', () => {
  let mockI18n
  
  beforeEach(() => {
    mockI18n = createMockI18n('en')
  })

  describe('CRITICAL: Recipe Content Language Consistency', () => {
    it('MUST NOT show English ingredients with Chinese recipe name', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithProviders(<DishToday />)
      
      // Generate recipe in English first
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      rerender(<DishToday />)
      
      await waitFor(() => {
        // Chinese recipe name should be present
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
        
        // CRITICAL: NO English content should remain
        expect(screen.queryByText('Sweet and Sour Pork')).not.toBeInTheDocument()
        expect(screen.queryByText(/lb pork chops/)).not.toBeInTheDocument()
        expect(screen.queryByText(/bell peppers/)).not.toBeInTheDocument()
        expect(screen.queryByText('Cut pork into bite-sized pieces')).not.toBeInTheDocument()
        
        // Should have Chinese ingredients instead
        expect(screen.getByText(/猪排/)).toBeInTheDocument()
        expect(screen.getByText(/甜椒/)).toBeInTheDocument()
      })
    })

    it('MUST NOT show Chinese ingredients with English recipe name', async () => {
      const user = userEvent.setup()
      
      // Start in Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      const { rerender } = renderWithProviders(<DishToday />)
      
      // Generate recipe in Chinese
      const randomButton = screen.getByText('随机食谱')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
        expect(screen.getByText(/猪排/)).toBeInTheDocument()
      })
      
      // Switch to English
      await act(async () => {
        await mockI18n.changeLanguage('en')
      })
      
      rerender(<DishToday />)
      
      await waitFor(() => {
        // English recipe name should be present
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
        
        // CRITICAL: NO Chinese content should remain
        expect(screen.queryByText('糖醋排骨')).not.toBeInTheDocument()
        expect(screen.queryByText(/猪排450克/)).not.toBeInTheDocument()
        expect(screen.queryByText(/甜椒2个/)).not.toBeInTheDocument()
        expect(screen.queryByText(/将猪肉切成一口大小的块/)).not.toBeInTheDocument()
        
        // Should have English ingredients instead
        expect(screen.getByText(/pork chops/)).toBeInTheDocument()
        expect(screen.getByText(/bell peppers/)).toBeInTheDocument()
      })
    })

    it('MUST NOT show mixed language in instructions', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithProviders(<DishToday />)
      
      // Generate in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      rerender(<DishToday />)
      
      await waitFor(() => {
        // Get all text content
        const pageText = document.body.textContent
        
        // Recipe name should be Chinese
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
        
        // CRITICAL: Instructions should be ALL Chinese, NO English
        expect(pageText).toContain('将猪肉切成一口大小的块')
        expect(pageText).not.toContain('Cut pork into bite-sized pieces')
        expect(pageText).not.toContain('Heat oil in a wok')
        expect(pageText).not.toContain('Serve immediately over rice')
      })
    })

    it('MUST NOT show mixed language in ingredient amounts', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithProviders(<DishToday />)
      
      // Generate in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText(/1 lb pork chops/)).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      rerender(<DishToday />)
      
      await waitFor(() => {
        const pageText = document.body.textContent
        
        // CRITICAL: Should use Chinese units (克, 个, 汤匙) NOT English units (lb, cups, tbsp)
        expect(pageText).toContain('450克')  // grams
        expect(pageText).toContain('个')     // piece
        expect(pageText).toContain('汤匙')   // tablespoon
        
        // Should NOT contain English units
        expect(pageText).not.toContain('1 lb')
        expect(pageText).not.toContain('2 bell peppers')
        expect(pageText).not.toContain('tbsp')
      })
    })
  })

  describe('CRITICAL: RecipeDetails Component Language Purity', () => {
    it('MUST NOT mix English and Chinese in same recipe view', () => {
      const chineseRecipe = mockRecipeDataAllLanguages.zh.cultural.Chinese[0]
      
      renderWithProviders(<RecipeDetails recipe={chineseRecipe} />)
      
      const pageText = document.body.textContent
      
      // Should have Chinese content
      expect(pageText).toContain('糖醋排骨')
      expect(pageText).toContain('猪排')
      expect(pageText).toContain('将猪肉')
      
      // CRITICAL: Should NOT have ANY English content
      expect(pageText).not.toContain('Sweet and Sour')
      expect(pageText).not.toContain('pork chops')
      expect(pageText).not.toContain('Cut pork')
      expect(pageText).not.toContain('bell peppers')
    })

    it('MUST NOT mix Chinese and Swedish in same recipe view', () => {
      const swedishRecipe = mockRecipeDataAllLanguages.sv.cultural.Chinese[0]
      
      renderWithProviders(<RecipeDetails recipe={swedishRecipe} />)
      
      const pageText = document.body.textContent
      
      // Should have Swedish content
      expect(pageText).toContain('Sötsur Fläsk')
      expect(pageText).toContain('fläskkotletter')
      
      // CRITICAL: Should NOT have Chinese content
      expect(pageText).not.toContain('糖醋排骨')
      expect(pageText).not.toContain('猪排')
      expect(pageText).not.toContain('将猪肉')
      
      // Should NOT have English content
      expect(pageText).not.toContain('Sweet and Sour')
      expect(pageText).not.toContain('pork chops')
    })

    it('MUST NOT have English section titles with Chinese content', async () => {
      const chineseRecipe = mockRecipeDataAllLanguages.zh.cultural.Chinese[0]
      
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      renderWithProviders(<RecipeDetails recipe={chineseRecipe} />)
      
      const pageText = document.body.textContent
      
      // Section titles should be in Chinese
      expect(pageText).toContain('食材')     // Ingredients
      expect(pageText).toContain('步骤')     // Instructions
      
      // CRITICAL: Should NOT have English section titles
      expect(pageText).not.toContain('Ingredients:')
      expect(pageText).not.toContain('Instructions:')
    })
  })

  describe('CRITICAL: UI Labels Must Match Recipe Language', () => {
    it('MUST NOT show English UI with Chinese recipe', async () => {
      const user = userEvent.setup()
      
      // Start in Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      renderWithProviders(<DishToday />)
      
      // Generate recipe
      const randomButton = screen.getByText('随机食谱')
      await user.click(randomButton)
      
      await waitFor(() => {
        const pageText = document.body.textContent
        
        // Recipe and UI should ALL be Chinese
        expect(pageText).toContain('糖醋排骨')
        expect(pageText).toContain('食材')
        expect(pageText).toContain('步骤')
        expect(pageText).toContain('随机食谱')
        
        // CRITICAL: NO English UI elements
        expect(pageText).not.toContain('Ingredients:')
        expect(pageText).not.toContain('Instructions:')
        expect(pageText).not.toContain('Random Recipe')
        expect(pageText).not.toContain('What I Have')
      })
    })

    it('MUST NOT show Chinese UI with English recipe', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DishToday />)
      
      // Generate recipe in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        const pageText = document.body.textContent
        
        // Recipe and UI should ALL be English
        expect(pageText).toContain('Sweet and Sour Pork')
        expect(pageText).toContain('Ingredients')
        expect(pageText).toContain('Instructions')
        expect(pageText).toContain('Random Recipe')
        
        // CRITICAL: NO Chinese UI elements or content
        expect(pageText).not.toContain('糖醋排骨')
        expect(pageText).not.toContain('食材')
        expect(pageText).not.toContain('步骤')
        expect(pageText).not.toContain('随机食谱')
        expect(pageText).not.toContain('猪排')
      })
    })
  })

  describe('CRITICAL: Language Switching Transition (Most Bug-Prone)', () => {
    it('MUST NOT show mixed languages during transition', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithProviders(<DishToday />)
      
      // Generate in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      
      rerender(<DishToday />)
      
      // Wait for transition to complete
      await waitFor(() => {
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      })
      
      // After transition completes, do thorough check
      const pageText = document.body.textContent
      
      // CRITICAL: Verify NO English content remains anywhere
      const englishPatterns = [
        'Sweet and Sour Pork',
        'pork chops',
        'bell peppers',
        'Cut pork',
        'Heat oil',
        'Serve immediately',
        'lb',
        'cup',
        'tbsp',
        'Ingredients:',
        'Instructions:',
        'Random Recipe',
        'What I Have'
      ]
      
      englishPatterns.forEach(pattern => {
        expect(pageText).not.toContain(pattern)
      })
      
      // Verify Chinese content is present
      const chinesePatterns = [
        '糖醋排骨',
        '猪排',
        '甜椒',
        '将猪肉',
        '食材',
        '步骤'
      ]
      
      chinesePatterns.forEach(pattern => {
        expect(pageText).toContain(pattern)
      })
    })

    it('MUST handle rapid language switching without mixing', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithProviders(<DishToday />)
      
      // Generate in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Rapid switching: en → zh → sv → en
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      rerender(<DishToday />)
      
      await waitFor(() => {
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      })
      
      await act(async () => {
        await mockI18n.changeLanguage('sv')
      })
      rerender(<DishToday />)
      
      await waitFor(() => {
        expect(screen.getByText('Sötsur Fläsk')).toBeInTheDocument()
      })
      
      await act(async () => {
        await mockI18n.changeLanguage('en')
      })
      rerender(<DishToday />)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Final check: Should be pure English
      const pageText = document.body.textContent
      expect(pageText).not.toContain('糖醋排骨')
      expect(pageText).not.toContain('Sötsur Fläsk')
      expect(pageText).not.toContain('猪排')
      expect(pageText).not.toContain('fläskkotletter')
    })
  })

  describe('CRITICAL: Multiple Recipes Same Language', () => {
    it('MUST NOT mix different recipes across languages', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithProviders(<DishToday />)
      
      // Generate first recipe in English
      const randomButton = screen.getByText('Random Recipe')
      await user.click(randomButton)
      
      await waitFor(() => {
        expect(screen.getByText('Sweet and Sour Pork')).toBeInTheDocument()
      })
      
      // Switch to Chinese
      await act(async () => {
        await mockI18n.changeLanguage('zh')
      })
      rerender(<DishToday />)
      
      await waitFor(() => {
        expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      })
      
      // Generate another recipe (should be second Chinese recipe)
      const randomButtonChinese = screen.getByText('随机食谱')
      await user.click(randomButtonChinese)
      
      await waitFor(() => {
        // Should show a Chinese recipe, not mix with English
        const pageText = document.body.textContent
        
        // CRITICAL: Should NOT show English from previous recipe
        expect(pageText).not.toContain('Sweet and Sour Pork')
        expect(pageText).not.toContain('pork chops, cubed')
      })
    })
  })

  describe('CRITICAL: Data Structure Verification', () => {
    it('MUST have same recipe IDs across all languages', () => {
      const englishRecipe1 = mockRecipeDataAllLanguages.en.cultural.Chinese[0]
      const chineseRecipe1 = mockRecipeDataAllLanguages.zh.cultural.Chinese[0]
      const swedishRecipe1 = mockRecipeDataAllLanguages.sv.cultural.Chinese[0]
      
      // CRITICAL: Same recipe must have same ID
      expect(englishRecipe1.id).toBe(chineseRecipe1.id)
      expect(englishRecipe1.id).toBe(swedishRecipe1.id)
      expect(englishRecipe1.id).toBe(1)
    })

    it('MUST have different content for same recipe ID', () => {
      const englishRecipe = mockRecipeDataAllLanguages.en.cultural.Chinese[0]
      const chineseRecipe = mockRecipeDataAllLanguages.zh.cultural.Chinese[0]
      
      // Same ID
      expect(englishRecipe.id).toBe(chineseRecipe.id)
      
      // CRITICAL: But different content
      expect(englishRecipe.name).not.toBe(chineseRecipe.name)
      expect(englishRecipe.description).not.toBe(chineseRecipe.description)
      expect(englishRecipe.ingredientsWithAmounts[0]).not.toBe(chineseRecipe.ingredientsWithAmounts[0])
      expect(englishRecipe.instructions[0]).not.toBe(chineseRecipe.instructions[0])
    })

    it('MUST NOT have any English text in Chinese recipe data', () => {
      const chineseRecipe = mockRecipeDataAllLanguages.zh.cultural.Chinese[0]
      
      // Convert entire recipe to string for checking
      const recipeString = JSON.stringify(chineseRecipe)
      
      // CRITICAL: Should not contain common English words
      const englishWords = ['pork chops', 'bell peppers', 'Cut', 'Heat', 'Serve', 'cup', 'tbsp', 'lb']
      
      englishWords.forEach(word => {
        expect(recipeString).not.toContain(word)
      })
    })

    it('MUST NOT have any Chinese characters in English recipe data', () => {
      const englishRecipe = mockRecipeDataAllLanguages.en.cultural.Chinese[0]
      
      // Convert entire recipe to string for checking
      const recipeString = JSON.stringify(englishRecipe)
      
      // CRITICAL: Should not contain Chinese characters
      const chineseChars = ['糖醋', '猪排', '甜椒', '大蒜', '将', '块', '克', '个']
      
      chineseChars.forEach(char => {
        expect(recipeString).not.toContain(char)
      })
    })
  })
})

