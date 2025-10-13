import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { trackSelection } from '../lib/supabase'
import InlineFoodWheel from '../components/InlineFoodWheel'
import RecipeChoiceCards from '../components/RecipeChoiceCards'
import IngredientSelector from '../components/IngredientSelector'
import ShoppingList from '../components/ShoppingList'
import { useRecipes, getRandomRecipe, getRecipesByIngredients, getRandomRecipeFromAll, getRecipesByIngredientsFromAll, searchRecipesFromAll } from '../data/recipes'


function DishToday() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [showChoiceCards, setShowChoiceCards] = useState(false)
  const [showIngredientSelector, setShowIngredientSelector] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [recipeType, setRecipeType] = useState(null)
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [activeTab, setActiveTab] = useState('random') // Default to random tab

  // Get reactive recipe data
  const recipes = useRecipes()

  // Reactive recipe selection functions
  const getReactiveRandomRecipe = (cuisineName) => {
    const culturalRecipes = recipes.cultural || {}
    const cuisineRecipes = culturalRecipes[cuisineName]
    
    if (!cuisineRecipes || !Array.isArray(cuisineRecipes)) {
      return null
    }
    
    // Filter for complete recipes (with ingredients and instructions)
    const completeRecipes = cuisineRecipes.filter(recipe => 
      recipe.ingredientsWithAmounts && 
      recipe.instructions && 
      Array.isArray(recipe.ingredientsWithAmounts) && 
      Array.isArray(recipe.instructions) &&
      recipe.ingredientsWithAmounts.length > 0 &&
      recipe.instructions.length > 0
    )
    
    if (completeRecipes.length === 0) {
      return null
    }
    
    const randomIndex = Math.floor(Math.random() * completeRecipes.length)
    return completeRecipes[randomIndex]
  }

  const getReactiveRandomRecipeFromAll = () => {
    const culturalRecipes = recipes.cultural || {}
    
    // Collect all complete recipes from all cuisines
    const allCompleteRecipes = []
    Object.entries(culturalRecipes).forEach(([cuisineName, cuisineRecipes]) => {
      if (Array.isArray(cuisineRecipes)) {
        cuisineRecipes.forEach(recipe => {
          if (recipe.ingredientsWithAmounts && 
              recipe.instructions && 
              Array.isArray(recipe.ingredientsWithAmounts) && 
              Array.isArray(recipe.instructions) &&
              recipe.ingredientsWithAmounts.length > 0 &&
              recipe.instructions.length > 0) {
            allCompleteRecipes.push({
              ...recipe,
              cuisine: cuisineName
            })
          }
        })
      }
    })
    
    if (allCompleteRecipes.length === 0) {
      return null
    }
    
    const randomIndex = Math.floor(Math.random() * allCompleteRecipes.length)
    return allCompleteRecipes[randomIndex]
  }

  // Clear all state when language changes to prevent mixing
  useEffect(() => {
    setSelectedRecipe(null)
    setSelectedCuisine(null)
    setShowChoiceCards(false)
    setShowIngredientSelector(false)
    setRecipeType(null)
    setActiveTab('random')
    setShowShoppingList(false)
  }, [i18n.language])

  // Update selected recipe when language changes (REACTIVE TRANSLATION)
  useEffect(() => {
    if (selectedRecipe && selectedRecipe.id) {
      // Find the recipe in the current language's data
      let foundRecipe = null
      
      if (selectedRecipe.cuisine) {
        // Cultural recipe
        const culturalRecipes = recipes.cultural || {}
        const cuisineRecipes = culturalRecipes[selectedRecipe.cuisine]
        if (cuisineRecipes && Array.isArray(cuisineRecipes)) {
          foundRecipe = cuisineRecipes.find(r => r.id === selectedRecipe.id)
        }
      } else {
        // Basic recipe - search through all basic recipes
        const basicRecipes = recipes.basic || {}
        for (const cookingMethod in basicRecipes) {
          if (typeof basicRecipes[cookingMethod] === 'object') {
            for (const dishName in basicRecipes[cookingMethod]) {
              const recipe = basicRecipes[cookingMethod][dishName]
              if (recipe && recipe.id === selectedRecipe.id) {
                foundRecipe = recipe
                break
              }
            }
          }
          if (foundRecipe) break
        }
      }
      
      if (foundRecipe) {
        setSelectedRecipe(foundRecipe)
      }
    }
  }, [recipes, selectedRecipe?.id, i18n.language])

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine)
    setShowChoiceCards(true)
    setSelectedRecipe(null)
    setRecipeType(null)
  }

  const handleRecipeChoice = async (choiceType, cuisine, ingredients = null, searchRecipe = null) => {
    // Handle clearing recipe selection when switching tabs
    if (choiceType === 'clear') {
      setSelectedRecipe(null)
      setRecipeType(null)
      setShowIngredientSelector(false)
      return
    }
    
    let recipe = null
    if (choiceType === 'random') {
      if (cuisine) {
        recipe = getReactiveRandomRecipe(cuisine.name)
        if (!recipe) {
          // Show user feedback for missing recipes
          const cuisineName = t(`cuisines.${cuisine.name}`, cuisine.name)
          alert(t('errors.noRecipesAvailable', { cuisine: cuisineName }))
          return
        }
      } else {
        recipe = getReactiveRandomRecipeFromAll()
        if (!recipe) {
          alert(t('errors.noRecipesFound'))
          return
        }
      }
      setRecipeType('random')
    } else if (choiceType === 'search' && searchRecipe) {
      recipe = searchRecipe
      setRecipeType('search')
    } else if (choiceType === 'ingredients' && ingredients) {
      if (cuisine) {
        const matchingRecipes = getRecipesByIngredients(cuisine.name, ingredients)
        
        if (matchingRecipes.length > 0) {
          // Since we're using smart matching, just pick the first one (they all have the key ingredient)
          recipe = matchingRecipes[0]
          setRecipeType('ingredients')
        } else {
          // Show feedback for no matching recipes
          alert(t('errors.noRecipesForIngredients'))
          return
        }
      } else {
        // Use global ingredient search
        const matchingRecipes = getRecipesByIngredientsFromAll(ingredients)
        
        if (matchingRecipes.length > 0) {
          recipe = matchingRecipes[0]
          setRecipeType('ingredients')
        } else {
          alert(t('errors.noRecipesForIngredients'))
          return
        }
      }
    }
    
    setSelectedRecipe(recipe)
    // Keep tabs visible - don't hide choice cards
    // setShowChoiceCards(false)
    setShowIngredientSelector(false)

    // Track selection in Supabase
    if (recipe && user) {
      await trackSelection(user.id, recipe, 'dish')
    }

    // Scroll to recipe display for all recipe types
    if (recipe) {
      setTimeout(() => {
        const recipeElement = document.querySelector('.recipe-display')
        if (recipeElement) {
          const recipeRect = recipeElement.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const targetPosition = recipeRect.top + scrollTop - 20
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }

  const handleIngredientBack = () => {
    setShowIngredientSelector(false)
    setShowChoiceCards(true)
    // Clear any previous recipe when going back from ingredient selector
    setSelectedRecipe(null)
    setRecipeType(null)
  }

  const handleIngredientGenerate = (ingredients) => {
    if (selectedCuisine) {
      // Use cuisine-specific search
      handleRecipeChoice('ingredients', selectedCuisine, ingredients)
    } else {
      // Use global search across all cuisines
      const matchingRecipes = getRecipesByIngredientsFromAll(ingredients)
      
      if (matchingRecipes.length > 0) {
        // Pick the first matching recipe
        const recipe = matchingRecipes[0]
        setSelectedRecipe(recipe)
        setRecipeType('ingredients')
        
        // Track the selection
        if (user) {
          trackSelection(user.id, recipe, 'dish')
        }
        
        // Scroll to tabs to show tabs at top
        setTimeout(() => {
          const recipeElement = document.querySelector('.recipe-display')
          if (recipeElement) {
            const recipeRect = recipeElement.getBoundingClientRect()
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            const targetPosition = recipeRect.top + scrollTop - 20
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            })
          }
        }, 100)
      } else {
        // Fallback: get a random recipe from all cuisines
        const randomRecipe = getRandomRecipeFromAll()
        if (randomRecipe) {
          setSelectedRecipe(randomRecipe)
          setRecipeType('random')
          if (user) {
            trackSelection(user.id, randomRecipe, 'dish')
          }
          
          // Scroll to tabs for fallback recipe too
          setTimeout(() => {
            const recipeElement = document.querySelector('.recipe-display')
            if (recipeElement) {
              const recipeRect = recipeElement.getBoundingClientRect()
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop
              const targetPosition = recipeRect.top + scrollTop - 20
              
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              })
            }
          }, 100)
        }
      }
    }
  }

  return (
    <div className="page-container">
      {/* Page Header - Consistent with other pages */}
      <div className="page-header">
        <h1 className="page-title">🍽️ {t('recipe.title')}</h1>
        <p className="page-subtitle">{t('recipe.subtitle')}</p>
      </div>

      <div className="wheel-section">
        <div className="wheel-intro">
          <h2 className="wheel-intro-title">{t('recipe.spinWheelTitle')}</h2>
        </div>
        <InlineFoodWheel onSelect={handleCuisineSelect} />
      </div>

      {/* Choice Cards Section - Always show, even before cuisine selection */}
      {!showIngredientSelector && (
        <div className="choice-section">
          {selectedCuisine ? (
            <RecipeChoiceCards
              selectedCuisine={selectedCuisine}
              onChoiceSelect={handleRecipeChoice}
              isRecipeSelected={!!selectedRecipe}
            />
          ) : (
            <RecipeChoiceCards
              selectedCuisine={null}
              onChoiceSelect={handleRecipeChoice}
              isRecipeSelected={!!selectedRecipe}
            />
          )}
        </div>
      )}


      {/* Ingredient Selector Section */}
      {showIngredientSelector && (
        <div className="choice-section">
          <IngredientSelector
            selectedCuisine={selectedCuisine}
            onBack={handleIngredientBack}
            onGenerate={handleIngredientGenerate}
          />
        </div>
      )}

      {/* Selected Recipe Display */}
      {selectedRecipe && (
        <div className="recipe-display">
          <div className="recipe-card">
            <div className="recipe-card-header">
              <div className="recipe-title-row">
                <div className="recipe-title-section">
                  <h3>{selectedRecipe.name}</h3>
                </div>
                <button 
                  className="close-recipe-btn"
                  onClick={() => setSelectedRecipe(null)}
                  title="Close recipe"
                >
                  ✕
                </button>
              </div>
              <div className="recipe-description-row">
                <p className="recipe-description">{selectedRecipe.description}</p>
              </div>
              
              {/* Shopping List Button - positioned close to top, right aligned */}
              <div className="recipe-shopping-section">
                <button 
                  className="btn btn-shopping btn-medium"
                  onClick={() => setShowShoppingList(true)}
                >
                  🛒 {t('button.createShoppingList')}
                </button>
              </div>
            </div>
            <div className="recipe-content">
              {/* Recipe Title - Use t() for soft coded dish names */}
              <h2 className="recipe-title">{selectedRecipe.name?.startsWith('dish.') || selectedRecipe.name?.startsWith('dishes.') ? t(selectedRecipe.name) : selectedRecipe.name}</h2>
              
              {/* Recipe Description - Use t() for soft coded descriptions */}
              {selectedRecipe.description && (
                <p className="recipe-description">
                  {selectedRecipe.description?.startsWith('description.') || selectedRecipe.description?.startsWith('descriptions.') ? t(selectedRecipe.description) : selectedRecipe.description}
                </p>
              )}

              <div className="recipe-meta">
                {selectedRecipe.prep_time && (
                  <span className="recipe-info">🔪 {t('recipe.prepTime')}: {selectedRecipe.prep_time}</span>
                )}
                <span className="recipe-info">⏱️ {t('recipe.cookTime')}: {selectedRecipe.cook_time || selectedRecipe.total_time}</span>
                <span className="recipe-info">👥 {t('recipe.servings')}: {selectedRecipe.servings}</span>
                <span className="recipe-info">📊 {t('recipe.difficulty')}: {selectedRecipe.difficulty}</span>
              </div>

              <div className="recipe-ingredients">
                <h4>{t('recipe.ingredients')}</h4>
                <ul>
                  {selectedRecipe.ingredientsWithAmounts ? (
                    selectedRecipe.ingredientsWithAmounts.map((ingredient, index) => (
                      <li key={index}>
                        {typeof ingredient === 'string' && ingredient.includes(' ') ? (
                          // Handle "2 茄子" format - split amount and ingredient
                          (() => {
                            const parts = ingredient.split(' ')
                            const amount = parts[0]
                            const ingredientName = parts.slice(1).join(' ')
                            return `${amount} ${ingredientName.startsWith('ingredient.') || ingredientName.startsWith('ingredients.') ? t(ingredientName) : ingredientName}`
                          })()
                        ) : (
                          // Handle direct ingredient keys
                          ingredient?.startsWith('ingredient.') || ingredient?.startsWith('ingredients.') ? t(ingredient) : ingredient
                        )}
                      </li>
                    ))
                  ) : (
                    selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient?.startsWith('ingredient.') || ingredient?.startsWith('ingredients.') ? t(ingredient) : t(`ingredients.${ingredient}`)}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {selectedRecipe.instructions && (
                <div className="recipe-instructions">
                  <h4>{t('recipe.instructions')}</h4>
                  <ul className="recipe-instructions-list">
                    {selectedRecipe.instructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingList && selectedRecipe && (
        <ShoppingList
          recipe={selectedRecipe}
          onClose={() => setShowShoppingList(false)}
        />
      )}

    </div>
  )
}

export default DishToday