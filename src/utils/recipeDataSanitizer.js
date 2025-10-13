/**
 * Recipe Data Sanitizer
 * 
 * This utility sanitizes recipe data to ensure consistent formatting
 * and removes any mixed language prefixes that may cause display issues.
 */

/**
 * Sanitize recipe metadata values by removing English prefixes
 * @param {string} value - The metadata value to sanitize
 * @param {string} field - The field name for context
 * @returns {string} - Sanitized value
 */
export const sanitizeMetadataValue = (value, field) => {
  if (!value || typeof value !== 'string') {
    return value
  }

  // Remove common English prefixes
  const prefixes = {
    prep_time: ['Prep:', 'prep:', 'Preparation:', 'preparation:'],
    cook_time: ['Cook:', 'cook:', 'Cooking:', 'cooking:'],
    total_time: ['Total:', 'total:', 'Time:', 'time:'],
    difficulty: ['difficulty.', 'Difficulty:', 'difficulty:'],
    servings: ['Servings:', 'servings:', 'Portions:', 'portions:'],
    cuisine: ['Cuisine:', 'cuisine:', 'Style:', 'style:']
  }

  const fieldPrefixes = prefixes[field] || []
  
  let sanitizedValue = value.trim()
  
  // Remove any matching prefixes
  for (const prefix of fieldPrefixes) {
    if (sanitizedValue.toLowerCase().startsWith(prefix.toLowerCase())) {
      sanitizedValue = sanitizedValue.substring(prefix.length).trim()
      break
    }
  }

  // Remove any trailing periods from difficulty values
  if (field === 'difficulty' && sanitizedValue.endsWith('.')) {
    sanitizedValue = sanitizedValue.slice(0, -1)
  }

  return sanitizedValue
}

/**
 * Sanitize a complete recipe object
 * @param {Object} recipe - The recipe object to sanitize
 * @returns {Object} - Sanitized recipe object
 */
export const sanitizeRecipe = (recipe) => {
  if (!recipe || typeof recipe !== 'object') {
    return recipe
  }

  const sanitized = { ...recipe }

  // Sanitize metadata fields
  const metadataFields = ['prep_time', 'cook_time', 'total_time', 'difficulty', 'servings', 'cuisine']
  
  metadataFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizeMetadataValue(sanitized[field], field)
    }
  })

  return sanitized
}

/**
 * Validate recipe data structure
 * @param {Object} recipe - The recipe object to validate
 * @returns {Object} - Validation result with isValid flag and errors array
 */
export const validateRecipe = (recipe) => {
  const errors = []
  
  if (!recipe) {
    errors.push('Recipe object is null or undefined')
    return { isValid: false, errors }
  }

  if (typeof recipe !== 'object') {
    errors.push('Recipe must be an object')
    return { isValid: false, errors }
  }

  // Check required fields
  const requiredFields = ['name', 'ingredientsWithAmounts', 'instructions']
  requiredFields.forEach(field => {
    if (!recipe[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  })

  // Check metadata field formats
  const metadataFields = ['prep_time', 'cook_time', 'total_time', 'difficulty']
  metadataFields.forEach(field => {
    if (recipe[field] && typeof recipe[field] === 'string') {
      // Check for mixed language patterns
      if (recipe[field].includes('Prep:') || recipe[field].includes('difficulty.')) {
        errors.push(`Field ${field} contains mixed language pattern: ${recipe[field]}`)
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Log recipe validation issues for debugging
 * @param {Object} recipe - The recipe object
 * @param {string} source - Source identifier (e.g., 'AI-generated', 'Static data')
 */
export const logRecipeValidation = (recipe, source) => {
  const validation = validateRecipe(recipe)
  
  if (!validation.isValid) {
    console.warn(`Recipe validation failed for ${source}:`, {
      recipeName: recipe?.name || 'Unknown',
      recipeId: recipe?.id || 'Unknown',
      errors: validation.errors
    })
  }
}

export default {
  sanitizeMetadataValue,
  sanitizeRecipe,
  validateRecipe,
  logRecipeValidation
}
