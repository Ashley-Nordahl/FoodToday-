/**
 * API endpoint for AI recipe generation
 * 
 * This would typically connect to an external AI service like OpenAI
 * For now, it's a local implementation that can be easily replaced
 */

import { generateAIRecipe, generatePartyRecipes } from '../services/aiRecipeGenerator'

/**
 * Generate a single recipe
 */
export const generateRecipe = async (req, res) => {
  try {
    const { ingredientId, cookingMethod, cuisine, tastes, language } = req.body

    if (!ingredientId || !cookingMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: ingredientId, cookingMethod'
      })
    }

    const result = await generateAIRecipe(
      ingredientId,
      cookingMethod,
      cuisine || 'mixed',
      tastes || ['rich'],
      language || 'en'
    )

    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (error) {
    console.error('Recipe generation API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Generate multiple recipes for party planning
 */
export const generatePartyRecipesAPI = async (req, res) => {
  try {
    const { selections, language } = req.body

    if (!selections) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: selections'
      })
    }

    const recipes = await generatePartyRecipes(selections, language || 'en')

    res.json({
      success: true,
      recipes: recipes
    })
  } catch (error) {
    console.error('Party recipes generation API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Health check endpoint
 */
export const healthCheck = async (req, res) => {
  res.json({
    success: true,
    message: 'AI Recipe Generator API is running',
    timestamp: new Date().toISOString()
  })
}
