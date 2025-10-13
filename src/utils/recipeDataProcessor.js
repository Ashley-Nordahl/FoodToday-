/**
 * Unified Recipe Data Processor
 * 
 * This module provides a unified interface for processing recipe data
 * from all sources (AI-generated, static, imported) to ensure consistent
 * formatting and prevent mixed language issues.
 */

import { sanitizeRecipe, validateRecipe, logRecipeValidation } from './recipeDataSanitizer.js'

/**
 * Standardize recipe data structure across all sources
 * @param {Object} recipe - Raw recipe object from any source
 * @param {string} source - Source identifier ('AI', 'Static', 'Imported', etc.)
 * @returns {Object} - Standardized recipe object
 */
export const standardizeRecipe = (recipe, source = 'Unknown') => {
  if (!recipe || typeof recipe !== 'object') {
    console.warn(`Invalid recipe object from ${source}:`, recipe)
    return null
  }

  // Validate the recipe first
  const validation = validateRecipe(recipe)
  if (!validation.isValid) {
    logRecipeValidation(recipe, source)
    console.warn(`Recipe validation failed for ${source}:`, validation.errors)
  }

  // Sanitize the recipe data
  const sanitized = sanitizeRecipe(recipe)

  // Ensure all required fields have default values
  const standardized = {
    id: sanitized.id || `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: sanitized.name || 'Unnamed Recipe',
    description: sanitized.description || '',
    emoji: sanitized.emoji || '🍽️',
    type: sanitized.type || 'cultural',
    
    // Metadata with proper formatting
    servings: sanitized.servings || 4,
    prep_time: sanitized.prep_time || '30 min',
    cook_time: sanitized.cook_time || '30 min',
    total_time: sanitized.total_time || '60 min',
    difficulty: sanitized.difficulty || 'Medium',
    cuisine: sanitized.cuisine || 'Mixed',
    
    // Content arrays
    ingredients: sanitized.ingredients || [],
    ingredientsWithAmounts: sanitized.ingredientsWithAmounts || [],
    instructions: sanitized.instructions || [],
    
    // Optional fields
    cookingMethod: sanitized.cookingMethod || 'sautéed',
    tastes: sanitized.tastes || [],
    tags: sanitized.tags || [],
    
    // Source tracking
    source: sanitized.source || source,
    generated: sanitized.generated || false,
    
    // Legacy fields for compatibility
    source_website: sanitized.source_website || '',
    source_url: sanitized.source_url || '',
    created_at: sanitized.created_at || new Date().toISOString()
  }

  return standardized
}

/**
 * Process multiple recipes from a batch (e.g., AI-generated party recipes)
 * @param {Array} recipes - Array of recipe objects
 * @param {string} source - Source identifier
 * @returns {Array} - Array of standardized recipe objects
 */
export const processRecipeBatch = (recipes, source = 'Unknown') => {
  if (!Array.isArray(recipes)) {
    console.warn(`Invalid recipe batch from ${source}:`, recipes)
    return []
  }

  return recipes
    .map(recipe => standardizeRecipe(recipe, source))
    .filter(recipe => recipe !== null) // Remove invalid recipes
}

/**
 * Create a recipe display object with translated labels
 * @param {Object} recipe - Standardized recipe object
 * @param {Function} t - Translation function from useTranslation
 * @returns {Object} - Recipe object with translated metadata labels
 */
export const createDisplayRecipe = (recipe, t) => {
  if (!recipe || !t) {
    return recipe
  }

  return {
    ...recipe,
    // Add translated labels for display
    displayLabels: {
      prepTime: t('recipe.prepTime'),
      cookTime: t('recipe.cookTime'),
      totalTime: t('recipe.totalTime'),
      difficulty: t('recipe.difficulty'),
      servings: t('recipe.servings'),
      cuisine: t('recipe.cuisine'),
      ingredients: t('recipe.ingredients'),
      instructions: t('recipe.instructions')
    }
  }
}

/**
 * Validate recipe data before saving or processing
 * @param {Object} recipe - Recipe object to validate
 * @returns {Object} - Validation result with isValid flag and detailed errors
 */
export const validateRecipeData = (recipe) => {
  const validation = validateRecipe(recipe)
  
  // Additional business logic validation
  const businessErrors = []
  
  // Check for reasonable values
  if (recipe.servings && (recipe.servings < 1 || recipe.servings > 20)) {
    businessErrors.push('Servings must be between 1 and 20')
  }
  
  if (recipe.prep_time && !recipe.prep_time.match(/^\d+\s*(min|minutes?|hr|hour|hours?)$/i)) {
    businessErrors.push('Prep time must be in format like "30 min" or "1 hour"')
  }
  
  if (recipe.difficulty && !['Easy', 'Medium', 'Hard'].includes(recipe.difficulty)) {
    businessErrors.push('Difficulty must be Easy, Medium, or Hard')
  }
  
  return {
    isValid: validation.isValid && businessErrors.length === 0,
    errors: [...validation.errors, ...businessErrors]
  }
}

/**
 * Create a recipe summary for logging/debugging
 * @param {Object} recipe - Recipe object
 * @returns {Object} - Summary object with key information
 */
export const createRecipeSummary = (recipe) => {
  if (!recipe) return null
  
  return {
    id: recipe.id,
    name: recipe.name,
    source: recipe.source,
    generated: recipe.generated,
    difficulty: recipe.difficulty,
    cuisine: recipe.cuisine,
    ingredientCount: recipe.ingredientsWithAmounts?.length || 0,
    instructionCount: recipe.instructions?.length || 0,
    hasValidMetadata: !!(recipe.prep_time && recipe.difficulty && recipe.cuisine)
  }
}

/**
 * Process recipe for specific display context (e.g., modal, card, list)
 * @param {Object} recipe - Recipe object
 * @param {string} context - Display context ('modal', 'card', 'list', 'preview')
 * @param {Function} t - Translation function
 * @returns {Object} - Context-specific recipe object
 */
export const processForDisplay = (recipe, context, t) => {
  const standardized = standardizeRecipe(recipe, 'Display Processing')
  
  if (!standardized) return null
  
  switch (context) {
    case 'modal':
      // Full recipe details for modal display
      return createDisplayRecipe(standardized, t)
      
    case 'card':
      // Simplified recipe for card display
      return {
        ...standardized,
        // Truncate long descriptions
        description: standardized.description?.length > 100 
          ? standardized.description.substring(0, 100) + '...'
          : standardized.description
      }
      
    case 'list':
      // Minimal recipe info for list display
      return {
        id: standardized.id,
        name: standardized.name,
        emoji: standardized.emoji,
        difficulty: standardized.difficulty,
        cuisine: standardized.cuisine,
        prep_time: standardized.prep_time
      }
      
    case 'preview':
      // Quick preview format
      return {
        name: standardized.name,
        emoji: standardized.emoji,
        difficulty: standardized.difficulty,
        servings: standardized.servings
      }
      
    default:
      return standardized
  }
}

export default {
  standardizeRecipe,
  processRecipeBatch,
  createDisplayRecipe,
  validateRecipeData,
  createRecipeSummary,
  processForDisplay
}
