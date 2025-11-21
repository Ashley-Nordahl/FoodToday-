import { describe, it, expect } from 'vitest'
import { 
  INGREDIENT_REGISTRY, 
  INGREDIENT_CATEGORIES, 
  isValidIngredientId 
} from '../ingredientRegistry'

describe('ingredientRegistry.js', () => {
  describe('INGREDIENT_REGISTRY', () => {
    it('should contain all required meat ingredients', () => {
      expect(INGREDIENT_REGISTRY['pork-chops']).toEqual({
        category: 'Meat',
        subcategory: 'Pork'
      })
      expect(INGREDIENT_REGISTRY['beef-steak']).toEqual({
        category: 'Meat',
        subcategory: 'Beef'
      })
      expect(INGREDIENT_REGISTRY['chicken-breast']).toEqual({
        category: 'Meat',
        subcategory: 'Chicken'
      })
    })

    it('should contain all required seafood ingredients', () => {
      expect(INGREDIENT_REGISTRY['salmon']).toEqual({
        category: 'Seafood',
        subcategory: 'Fish'
      })
      expect(INGREDIENT_REGISTRY['shrimp']).toEqual({
        category: 'Seafood',
        subcategory: 'Shellfish'
      })
      expect(INGREDIENT_REGISTRY['lobster']).toEqual({
        category: 'Seafood',
        subcategory: 'Crustaceans'
      })
    })

    it('should contain all required vegetable ingredients', () => {
      expect(INGREDIENT_REGISTRY['broccoli']).toEqual({
        category: 'Vegetable',
        subcategory: 'General'
      })
      expect(INGREDIENT_REGISTRY['carrots']).toEqual({
        category: 'Vegetable',
        subcategory: 'General'
      })
    })

    it('should contain all required grain ingredients', () => {
      expect(INGREDIENT_REGISTRY['rice']).toEqual({
        category: 'Grain',
        subcategory: 'Whole Grains'
      })
      expect(INGREDIENT_REGISTRY['pasta']).toEqual({
        category: 'Grain',
        subcategory: 'Refined Grains'
      })
    })

    it('should contain all required egg ingredients', () => {
      expect(INGREDIENT_REGISTRY['chicken-eggs']).toEqual({
        category: 'Egg',
        subcategory: 'Chicken Eggs'
      })
    })

    it('should have all ingredients in kebab-case format', () => {
      Object.keys(INGREDIENT_REGISTRY).forEach(ingredientId => {
        expect(ingredientId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      })
    })

    it('should have unique ingredient IDs', () => {
      const ids = Object.keys(INGREDIENT_REGISTRY)
      const uniqueIds = new Set(ids)
      expect(ids).toHaveLength(uniqueIds.size)
    })
  })

  describe('INGREDIENT_CATEGORIES', () => {
    it('should have all required main categories', () => {
      expect(INGREDIENT_CATEGORIES).toHaveProperty('Meat')
      expect(INGREDIENT_CATEGORIES).toHaveProperty('Seafood')
      expect(INGREDIENT_CATEGORIES).toHaveProperty('Vegetable')
      expect(INGREDIENT_CATEGORIES).toHaveProperty('Grain')
      expect(INGREDIENT_CATEGORIES).toHaveProperty('Egg')
    })

    it('should have correct emojis for main categories', () => {
      expect(INGREDIENT_CATEGORIES['Meat'].emoji).toBe('🥩')
      expect(INGREDIENT_CATEGORIES['Seafood'].emoji).toBe('🦞')
      expect(INGREDIENT_CATEGORIES['Vegetable'].emoji).toBe('🥬')
      expect(INGREDIENT_CATEGORIES['Grain'].emoji).toBe('🌾')
      expect(INGREDIENT_CATEGORIES['Egg'].emoji).toBe('🥚')
    })

    it('should have subcategories with emojis and items', () => {
      const meatCategory = INGREDIENT_CATEGORIES['Meat']
      expect(meatCategory.subcategories).toHaveProperty('Pork')
      expect(meatCategory.subcategories['Pork'].emoji).toBe('🐷')
      expect(meatCategory.subcategories['Pork'].items).toContain('pork-chops')
    })

    it('should have all subcategories with required structure', () => {
      Object.values(INGREDIENT_CATEGORIES).forEach(category => {
        expect(category).toHaveProperty('emoji')
        expect(category).toHaveProperty('subcategories')
        
        Object.values(category.subcategories).forEach(subcategory => {
          expect(subcategory).toHaveProperty('emoji')
          expect(subcategory).toHaveProperty('items')
          expect(Array.isArray(subcategory.items)).toBe(true)
          expect(subcategory.items.length).toBeGreaterThan(0)
        })
      })
    })

    it('should have all registry ingredients in categories', () => {
      const registryIds = new Set(Object.keys(INGREDIENT_REGISTRY))
      
      Object.values(INGREDIENT_CATEGORIES).forEach(category => {
        Object.values(category.subcategories).forEach(subcategory => {
          subcategory.items.forEach(ingredientId => {
            expect(registryIds.has(ingredientId)).toBe(true)
          })
        })
      })
    })

    it('should have seafood category with correct emoji', () => {
      expect(INGREDIENT_CATEGORIES['Seafood'].emoji).toBe('🦞')
    })

    it('should have all seafood subcategories', () => {
      const seafoodCategory = INGREDIENT_CATEGORIES['Seafood']
      expect(seafoodCategory.subcategories).toHaveProperty('Fish')
      expect(seafoodCategory.subcategories).toHaveProperty('Shellfish')
      expect(seafoodCategory.subcategories).toHaveProperty('Cephalopods')
      expect(seafoodCategory.subcategories).toHaveProperty('Crustaceans')
      expect(seafoodCategory.subcategories).toHaveProperty('Mollusks')
    })
  })

  describe('isValidIngredientId', () => {
    it('should return true for valid ingredient IDs', () => {
      expect(isValidIngredientId('pork-chops')).toBe(true)
      expect(isValidIngredientId('salmon')).toBe(true)
      expect(isValidIngredientId('broccoli')).toBe(true)
      expect(isValidIngredientId('rice')).toBe(true)
      expect(isValidIngredientId('chicken-eggs')).toBe(true)
    })

    it('should return false for invalid ingredient IDs', () => {
      expect(isValidIngredientId('invalid-ingredient')).toBe(false)
      expect(isValidIngredientId('')).toBe(false)
      expect(isValidIngredientId(null)).toBe(false)
      expect(isValidIngredientId(undefined)).toBe(false)
      expect(isValidIngredientId('pork_chops')).toBe(false) // Wrong format
    })

    it('should handle edge cases', () => {
      expect(isValidIngredientId('pork-chops-extra')).toBe(false)
      expect(isValidIngredientId('PORK-CHOPS')).toBe(false) // Wrong case
      expect(isValidIngredientId('123')).toBe(false) // Numbers only
    })
  })

  describe('Data Consistency', () => {
    it('should have consistent category assignments for user-facing categories', () => {
      // Only check ingredients that belong to user-facing categories
      // 'Other' category is for internal use only (condiments, spices, etc.)
      const userFacingCategories = Object.keys(INGREDIENT_CATEGORIES)
      
      Object.entries(INGREDIENT_REGISTRY).forEach(([ingredientId, data]) => {
        if (userFacingCategories.includes(data.category)) {
          const category = INGREDIENT_CATEGORIES[data.category]
          expect(category).toBeDefined()
          expect(category.subcategories[data.subcategory]).toBeDefined()
          expect(category.subcategories[data.subcategory].items).toContain(ingredientId)
        }
      })
    })

    it('should have all user-facing categories properly defined', () => {
      // These are the categories that should be in INGREDIENT_CATEGORIES
      const requiredCategories = ['Meat', 'Seafood', 'Egg', 'Vegetable', 'Grain']
      const categoryKeys = Object.keys(INGREDIENT_CATEGORIES)
      
      requiredCategories.forEach(category => {
        expect(categoryKeys).toContain(category)
      })
    })

    it('should have all user-facing subcategories properly defined', () => {
      // Only check ingredients that belong to user-facing categories
      const userFacingCategories = Object.keys(INGREDIENT_CATEGORIES)
      
      Object.values(INGREDIENT_REGISTRY).forEach(item => {
        if (userFacingCategories.includes(item.category)) {
          const category = INGREDIENT_CATEGORIES[item.category]
          expect(category.subcategories[item.subcategory]).toBeDefined()
        }
      })
    })
  })
})
