import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../utils/testHelpers.jsx'
import RecipeDetails from '../../components/RecipeDetails'

/**
 * ACTUAL RENDERING TEST - Tests real components with real i18n
 * This uses the ACTUAL application code to detect language mixing
 */

describe('ACTUAL Component Rendering - Language Mixing Detection', () => {
  describe('RecipeDetails Component with Real Data', () => {
    const mockEnglishRecipe = {
      id: 1,
      name: 'Sweet and Sour Pork',
      description: 'A delicious Chinese dish with tender pork and tangy sauce',
      cuisine: 'Chinese',
      ingredients: ['ingredient-pork-chops', 'ingredient-bell-pepper', 'ingredient-garlic'],
      ingredientsWithAmounts: [
        '1 lb pork chops, cubed',
        '2 bell peppers, chopped',
        '3 cloves garlic, minced'
      ],
      instructions: [
        'Cut pork into bite-sized pieces',
        'Heat oil in a wok over high heat',
        'Add pork and stir-fry until golden brown'
      ],
      difficulty: 'Medium',
      cookTime: '30 minutes',
      emoji: '🥩'
    }

    const mockChineseRecipe = {
      id: 1,
      name: '糖醋排骨',
      description: '一道美味的中国菜，猪肉嫩滑，酱汁酸甜可口',
      cuisine: 'Chinese',
      ingredients: ['ingredient-pork-chops', 'ingredient-bell-pepper', 'ingredient-garlic'],
      ingredientsWithAmounts: [
        '猪排450克，切块',
        '甜椒2个，切块',
        '大蒜3瓣，切碎'
      ],
      instructions: [
        '将猪肉切成一口大小的块',
        '在炒锅中加热油至高温',
        '加入猪肉翻炒至金黄色'
      ],
      difficulty: '中等',
      cookTime: '30分钟',
      emoji: '🥩'
    }

    it('CRITICAL: Renders English recipe without ANY Chinese characters', () => {
      renderWithProviders(<RecipeDetails recipe={mockEnglishRecipe} />, { locale: 'en' })
      
      const pageText = document.body.textContent
      
      // Should have English content
      expect(pageText).toContain('Sweet and Sour Pork')
      expect(pageText).toContain('pork chops')
      expect(pageText).toContain('Cut pork')
      
      // CRITICAL: Should NOT have ANY Chinese characters
      const chineseChars = ['糖醋', '排骨', '猪排', '甜椒', '大蒜', '将', '块', '克', '个', '瓣', '食材', '步骤']
      chineseChars.forEach(char => {
        expect(pageText).not.toContain(char)
      })
    })

    it('CRITICAL: Renders Chinese recipe without ANY English content', () => {
      renderWithProviders(<RecipeDetails recipe={mockChineseRecipe} />, { locale: 'zh' })
      
      const pageText = document.body.textContent
      
      // Should have Chinese content
      expect(pageText).toContain('糖醋排骨')
      expect(pageText).toContain('猪排')
      expect(pageText).toContain('将猪肉')
      
      // CRITICAL: Should NOT have ANY English recipe content
      const englishWords = [
        'Sweet and Sour Pork',
        'pork chops',
        'bell peppers',
        'Cut pork',
        'Heat oil',
        'stir-fry'
      ]
      
      englishWords.forEach(word => {
        expect(pageText).not.toContain(word)
      })
    })

    it('CRITICAL: Section titles match recipe language (English)', () => {
      renderWithProviders(<RecipeDetails recipe={mockEnglishRecipe} />, { locale: 'en' })
      
      const pageText = document.body.textContent
      
      // English section titles
      expect(pageText).toContain('Ingredients')
      expect(pageText).toContain('Instructions')
      
      // NOT Chinese section titles
      expect(pageText).not.toContain('食材')
      expect(pageText).not.toContain('步骤')
    })

    it('CRITICAL: Section titles match recipe language (Chinese)', () => {
      renderWithProviders(<RecipeDetails recipe={mockChineseRecipe} />, { locale: 'zh' })
      
      const pageText = document.body.textContent
      
      // Chinese section titles
      expect(pageText).toContain('食材')
      expect(pageText).toContain('步骤')
      
      // NOT English section titles  
      expect(pageText).not.toContain('Ingredients:')
      expect(pageText).not.toContain('Instructions:')
    })

    it('CRITICAL: Ingredient units match recipe language', () => {
      // English recipe should use English units
      const { unmount } = renderWithProviders(<RecipeDetails recipe={mockEnglishRecipe} />, { locale: 'en' })
      
      let pageText = document.body.textContent
      expect(pageText).toContain('lb')      // pounds
      expect(pageText).toContain('cloves')  // English unit
      expect(pageText).not.toContain('克')  // grams (Chinese)
      expect(pageText).not.toContain('个')  // pieces (Chinese)
      
      unmount()
      
      // Chinese recipe should use Chinese units
      renderWithProviders(<RecipeDetails recipe={mockChineseRecipe} />, { locale: 'zh' })
      
      pageText = document.body.textContent
      expect(pageText).toContain('克')      // grams
      expect(pageText).toContain('个')      // pieces
      expect(pageText).toContain('瓣')      // cloves (Chinese)
      expect(pageText).not.toContain('lb')  // pounds (English)
    })

    it('CRITICAL: ALL ingredients are in same language', () => {
      renderWithProviders(<RecipeDetails recipe={mockChineseRecipe} />, { locale: 'zh' })
      
      // Get all list items (ingredients)
      const listItems = screen.getAllByRole('listitem')
      
      listItems.forEach(item => {
        const itemText = item.textContent
        
        // Each ingredient should NOT have English words
        expect(itemText).not.toMatch(/\blb\b/)
        expect(itemText).not.toMatch(/\bcup\b/)
        expect(itemText).not.toMatch(/\btbsp\b/)
        expect(itemText).not.toMatch(/\boz\b/)
        expect(itemText).not.toMatch(/pork chops/)
        expect(itemText).not.toMatch(/bell peppers/)
      })
    })

    it('CRITICAL: ALL instructions are in same language', () => {
      renderWithProviders(<RecipeDetails recipe={mockChineseRecipe} />, { locale: 'zh' })
      
      const pageText = document.body.textContent
      
      // Should have Chinese instructions
      expect(pageText).toContain('将猪肉')
      expect(pageText).toContain('炒锅')
      expect(pageText).toContain('翻炒')
      
      // Should NOT have English instructions
      expect(pageText).not.toContain('Cut')
      expect(pageText).not.toContain('Heat')
      expect(pageText).not.toContain('Add')
      expect(pageText).not.toContain('Serve')
    })

    it('CRITICAL: Recipe name and ingredients are in same language', () => {
      renderWithProviders(<RecipeDetails recipe={mockChineseRecipe} />, { locale: 'zh' })
      
      // Recipe name in Chinese
      expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      
      // Ingredients also in Chinese
      expect(screen.getByText(/猪排450克/)).toBeInTheDocument()
      
      // NOT English name with Chinese ingredients (MIXING)
      expect(screen.queryByText('Sweet and Sour Pork')).not.toBeInTheDocument()
    })

    it('CRITICAL: Recipe name and instructions are in same language', () => {
      renderWithProviders(<RecipeDetails recipe={mockChineseRecipe} />, { locale: 'zh' })
      
      // Recipe name in Chinese
      expect(screen.getByText('糖醋排骨')).toBeInTheDocument()
      
      const pageText = document.body.textContent
      
      // Instructions also in Chinese
      expect(pageText).toContain('将猪肉切成一口大小的块')
      
      // NOT English instructions
      expect(pageText).not.toContain('Cut pork into bite-sized pieces')
    })

    it('CRITICAL: Detects if ingredientsWithAmounts has wrong language', () => {
      // This is a common bug: ingredientsWithAmounts array has wrong language data
      const buggyRecipe = {
        ...mockChineseRecipe,
        // Bug: English amounts with Chinese recipe
        ingredientsWithAmounts: [
          '1 lb pork chops',  // WRONG - Should be Chinese
          '2 bell peppers',   // WRONG - Should be Chinese
          '3 cloves garlic'   // WRONG - Should be Chinese
        ]
      }
      
      renderWithProviders(<RecipeDetails recipe={buggyRecipe} />, { locale: 'zh' })
      
      const pageText = document.body.textContent
      
      // This test SHOULD FAIL if bug exists
      // It checks for English units in Chinese recipe
      const hasEnglishUnits = pageText.includes('lb') || pageText.includes('cloves')
      
      if (hasEnglishUnits) {
        // BUG DETECTED!
        throw new Error('LANGUAGE MIXING BUG: English units found in Chinese recipe! ' +
                       'Check ingredientsWithAmounts array - it should be in Chinese.')
      }
    })

    it('CRITICAL: Detects if instructions has wrong language', () => {
      // Common bug: instructions array has wrong language
      const buggyRecipe = {
        ...mockChineseRecipe,
        // Bug: English instructions with Chinese recipe
        instructions: [
          'Cut pork into bite-sized pieces',  // WRONG
          'Heat oil in a wok over high heat', // WRONG
          'Add pork and stir-fry'             // WRONG
        ]
      }
      
      renderWithProviders(<RecipeDetails recipe={buggyRecipe} />, { locale: 'zh' })
      
      const pageText = document.body.textContent
      
      // This test SHOULD FAIL if bug exists
      const hasEnglishInstructions = pageText.includes('Cut pork') || pageText.includes('Heat oil')
      
      if (hasEnglishInstructions) {
        // BUG DETECTED!
        throw new Error('LANGUAGE MIXING BUG: English instructions found in Chinese recipe! ' +
                       'Check instructions array - it should be in Chinese.')
      }
    })
  })

  describe('SMOKE TEST: Real i18n Integration', () => {
    it('confirms i18n is working for English', () => {
      const recipe = {
        id: 1,
        name: 'Test Recipe',
        ingredients: ['ingredient-pork-chops'],
        ingredientsWithAmounts: ['1 lb pork chops'],
        instructions: ['Cook the pork'],
        emoji: '🥩'
      }
      
      renderWithProviders(<RecipeDetails recipe={recipe} />, { locale: 'en' })
      
      // Should render without errors
      expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    })

    it('confirms i18n is working for Chinese', () => {
      const recipe = {
        id: 1,
        name: '测试食谱',
        ingredients: ['ingredient-pork-chops'],
        ingredientsWithAmounts: ['猪排450克'],
        instructions: ['烹饪猪肉'],
        emoji: '🥩'
      }
      
      renderWithProviders(<RecipeDetails recipe={recipe} />, { locale: 'zh' })
      
      // Should render without errors
      expect(screen.getByText('测试食谱')).toBeInTheDocument()
    })

    it('confirms i18n is working for Swedish', () => {
      const recipe = {
        id: 1,
        name: 'Test Recept',
        ingredients: ['ingredient-pork-chops'],
        ingredientsWithAmounts: ['450g fläskkotletter'],
        instructions: ['Laga fläsket'],
        emoji: '🥩'
      }
      
      renderWithProviders(<RecipeDetails recipe={recipe} />, { locale: 'sv' })
      
      // Should render without errors
      expect(screen.getByText('Test Recept')).toBeInTheDocument()
    })
  })
})

