import React from 'react'
import { useTranslation } from 'react-i18next'
import { sanitizeRecipe, logRecipeValidation } from '../utils/recipeDataSanitizer'

function RecipeDetails({ recipe, onClose }) {
  const { t } = useTranslation()
  
  if (!recipe) return null

  // DIRECT FIX: Clean all metadata values to remove any English prefixes
  const cleanValue = (value) => {
    if (!value || typeof value !== 'string') return value
    return value
      .replace(/^Prep:\s*/i, '')
      .replace(/^prep:\s*/i, '')
      .replace(/^Cook:\s*/i, '')
      .replace(/^cook:\s*/i, '')
      .replace(/^Total:\s*/i, '')
      .replace(/^total:\s*/i, '')
      .replace(/^difficulty\./i, '')
      .replace(/^Difficulty:\s*/i, '')
      .replace(/^difficulty:\s*/i, '')
      .replace(/^Servings:\s*/i, '')
      .replace(/^servings:\s*/i, '')
      .replace(/^Cuisine:\s*/i, '')
      .replace(/^cuisine:\s*/i, '')
      .trim()
  }
  
  // Process recipe data with clean values
  const cleanRecipeData = {
    ...recipe,
    prep_time: cleanValue(recipe.prep_time),
    cook_time: cleanValue(recipe.cook_time),
    total_time: cleanValue(recipe.total_time),
    difficulty: cleanValue(recipe.difficulty),
    servings: cleanValue(recipe.servings?.toString()),
    cuisine: cleanValue(recipe.cuisine)
  }

  const {
    name,
    description,
    emoji,
    type,
    servings,
    prep_time,
    cook_time,
    total_time,
    difficulty,
    cuisine,
    source_website,
    source_url,
    ingredients,
    ingredientsWithAmounts,
    instructions,
    created_at
  } = cleanRecipeData

  return (
    <div className="recipe-details-overlay">
      <div className="recipe-details-modal">
        <div className="recipe-header">
          <div className="recipe-title-section">
            {emoji && <div className="recipe-emoji-large">{emoji}</div>}
            <div className="recipe-title-info">
              <h2 className="recipe-title">
                {name?.startsWith('dish.') 
                  ? t(`dishes.${name.replace('dish.', '')}`) 
                  : name}
              </h2>
              <div className="recipe-source-info">
                {source_website && (
                  <span className="source-badge">From: {source_website}</span>
                )}
                {source_url && (
                  <a 
                    href={source_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="source-link"
                  >
                    View Original Recipe <span style={{ marginLeft: '0.25rem' }}>↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="close-recipe-btn">
            &times;
          </button>
        </div>

        <div className="recipe-content">
          {description && (
            <div className="recipe-section">
              <p className="recipe-description-full">{description}</p>
            </div>
          )}

          <div className="recipe-meta-section">
            <div className="meta-grid">
              {servings && (
                <div className="meta-item">
                  <span className="meta-icon">🍽️</span>
                  <div className="meta-content">
                    <span className="meta-label">{t('recipe.servings')}</span>
                    <span className="meta-value">{servings}</span>
                  </div>
                </div>
              )}
              {prep_time && (
                <div className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  <div className="meta-content">
                    <span className="meta-label">{t('recipe.prepTime')}</span>
                    <span className="meta-value">{prep_time}</span>
                  </div>
                </div>
              )}
              {cook_time && (
                <div className="meta-item">
                  <span className="meta-icon">🔥</span>
                  <div className="meta-content">
                    <span className="meta-label">{t('recipe.cookTime')}</span>
                    <span className="meta-value">{cook_time}</span>
                  </div>
                </div>
              )}
              {total_time && (
                <div className="meta-item">
                  <span className="meta-icon">⏳</span>
                  <div className="meta-content">
                    <span className="meta-label">{t('recipe.totalTime')}</span>
                    <span className="meta-value">{total_time}</span>
                  </div>
                </div>
              )}
              {difficulty && (
                <div className="meta-item">
                  <span className="meta-icon">💪</span>
                  <div className="meta-content">
                    <span className="meta-label">{t('recipe.difficulty')}</span>
                    <span className="meta-value">{t(`difficulty.${difficulty}`)}</span>
                  </div>
                </div>
              )}
              {cuisine && (
                <div className="meta-item">
                  <span className="meta-icon">🌍</span>
                  <div className="meta-content">
                    <span className="meta-label">{t('recipe.cuisine')}</span>
                    <span className="meta-value">{cuisine}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="recipe-main-content">
            {ingredientsWithAmounts && ingredientsWithAmounts.length > 0 && (
              <div className="ingredients-section recipe-section">
                <h3 className="section-title">{t('recipe.ingredients')}</h3>
                <ul className="ingredients-list">
                  {ingredientsWithAmounts.map((ingredient, index) => {
                    // Handle soft coded ingredient keys
                    if (typeof ingredient === 'string' && ingredient.includes(' ')) {
                      // Handle "2 茄子" format - split amount and ingredient
                      const parts = ingredient.split(' ')
                      const amount = parts[0]
                      const ingredientName = parts.slice(1).join(' ')
                      const displayText = `${amount} ${ingredientName?.startsWith('ingredient.') || ingredientName?.startsWith('ingredients.') ? t(ingredientName) : ingredientName}`
                      return <li key={index}>{displayText}</li>
                    } else {
                      // Handle direct ingredient keys
                      const displayText = ingredient?.startsWith('ingredient.') || ingredient?.startsWith('ingredients.') ? t(ingredient) : ingredient
                      return (
                        <li key={index} className="ingredient-item">
                          <span className="ingredient-number">{index + 1}</span>
                          <span className="ingredient-text">{displayText}</span>
                        </li>
                      )
                    }
                  })}
                </ul>
              </div>
            )}

            {instructions && instructions.length > 0 && (
              <div className="instructions-section recipe-section">
                <h3 className="section-title">{t('recipe.instructions')}</h3>
                <ol className="instructions-list">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="instruction-item">
                      <span className="instruction-number">{index + 1}</span>
                      <span className="instruction-text">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div className="recipe-footer">
            <div className="recipe-date">
              {created_at && (
                <span className="import-date">
                  Added: {new Date(created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetails
