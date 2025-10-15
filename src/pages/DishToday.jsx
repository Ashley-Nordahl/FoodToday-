import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { trackSelection } from '../lib/supabase'
import InlineFoodWheel from '../components/InlineFoodWheel'
import RecipeChoiceCards from '../components/RecipeChoiceCards'
import IngredientSelector from '../components/IngredientSelector'
import ShoppingList from '../components/ShoppingList'
// Removed old recipe imports - now using proper recipes from translation files


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

  // Simple recipe selection functions (from working version)
  const getRandomRecipeFromAll = () => {
    // Get recipes from translation files (proper format with amounts and instructions)
    const currentLanguage = i18n.language || 'en'
    const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
    const culturalRecipes = recipes.cultural || {}
    
    // Collect all complete recipes from all cuisines
    const allRecipes = []
    Object.entries(culturalRecipes).forEach(([cuisineName, cuisineRecipes]) => {
      if (Array.isArray(cuisineRecipes)) {
        cuisineRecipes.forEach(recipe => {
          if (recipe.ingredientsWithAmounts && 
              recipe.instructions && 
              Array.isArray(recipe.ingredientsWithAmounts) && 
              Array.isArray(recipe.instructions) &&
              recipe.ingredientsWithAmounts.length > 0 &&
              recipe.instructions.length > 0) {
            allRecipes.push({
              ...recipe,
              cuisine: cuisineName
            })
          }
        })
      }
    })
    
    if (allRecipes.length === 0) {
      return null
    }
    
    const randomIndex = Math.floor(Math.random() * allRecipes.length)
    return allRecipes[randomIndex]
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
      
      // Get recipes from translation files
      const currentLanguage = i18n.language || 'en'
      const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
      
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
  }, [selectedRecipe?.id, i18n.language])

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
        // Get random recipe from specific cuisine using proper format
        const currentLanguage = i18n.language || 'en'
        const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
        const culturalRecipes = recipes.cultural || {}
        const cuisineRecipes = culturalRecipes[cuisine.name] || []
        
        // Filter for complete recipes with amounts and instructions
        const completeRecipes = cuisineRecipes.filter(recipe => 
          recipe.ingredientsWithAmounts && 
          recipe.instructions && 
          Array.isArray(recipe.ingredientsWithAmounts) && 
          Array.isArray(recipe.instructions) &&
          recipe.ingredientsWithAmounts.length > 0 &&
          recipe.instructions.length > 0
        )
        
        if (completeRecipes.length === 0) {
          const cuisineName = t(`cuisines.${cuisine.name}`, cuisine.name)
          alert(t('errors.noRecipesAvailable', { cuisine: cuisineName }))
          return
        }
        
        const randomIndex = Math.floor(Math.random() * completeRecipes.length)
        recipe = {
          ...completeRecipes[randomIndex],
          cuisine: cuisine.name
        }
      } else {
        recipe = getRandomRecipeFromAll()
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
        // Get recipes from specific cuisine using proper format
        const currentLanguage = i18n.language || 'en'
        const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
        const culturalRecipes = recipes.cultural || {}
        const cuisineRecipes = culturalRecipes[cuisine.name] || []
        
        // Filter for complete recipes with amounts and instructions
        const completeRecipes = cuisineRecipes.filter(recipe => 
          recipe.ingredientsWithAmounts && 
          recipe.instructions && 
          Array.isArray(recipe.ingredientsWithAmounts) && 
          Array.isArray(recipe.instructions) &&
          recipe.ingredientsWithAmounts.length > 0 &&
          recipe.instructions.length > 0
        )
        
        // Helper function to map recipe ingredient IDs to registry IDs
        const mapRecipeIngredientToRegistry = (recipeIngredient) => {
          // Remove 'ingredient.' prefix and convert to kebab-case
          const cleanId = recipeIngredient.replace('ingredient.', '').toLowerCase()
          // Convert common variations to registry format
          const mapping = {
            'porkchops': 'pork-chops',
            'groundpork': 'ground-pork',
            'porkbelly': 'pork-belly',
            'porkribs': 'pork-ribs',
            'porktenderloin': 'pork-tenderloin',
            'porkchop': 'pork-chops',
            'groundbeef': 'ground-beef',
            'beefsteak': 'beef-steak',
            'beefbrisket': 'beef-brisket',
            'beefribs': 'beef-ribs',
            'beefchop': 'beef-chops',
            'chickenbreast': 'chicken-breast',
            'chickenthighs': 'chicken-thighs',
            'chickenwings': 'chicken-wings',
            'wholechicken': 'whole-chicken',
            'chickenlegs': 'chicken-legs',
            'lambchops': 'lamb-chops',
            'groundlamb': 'ground-lamb',
            'lambshoulder': 'lamb-shoulder',
            'lambleg': 'lamb-leg',
            'lambribs': 'lamb-ribs',
            'bellpepper': 'bell-pepper',
            'bellpeppers': 'bell-pepper',
            'soysauce': 'soy-sauce',
            'oystersauce': 'oyster-sauce',
            'fishsauce': 'fish-sauce',
            'sesameoil': 'sesame-oil',
            'oliveoil': 'olive-oil',
            'vegetableoil': 'vegetable-oil',
            'cookingwine': 'cooking-wine',
            'ricenoodles': 'rice-noodles',
            'eggplant': 'eggplant',
            'greenbeans': 'green-beans',
            'snowpeas': 'snow-peas',
            'bokchoy': 'bok-choy',
            'napa': 'napa-cabbage',
            'napa cabbage': 'napa-cabbage'
          }
          return mapping[cleanId] || cleanId
        }
        
        // Find matching recipes based on ingredients
        const matchingRecipes = completeRecipes.filter(recipe => {
          // Debug logging
          console.log(`🔍 Ingredient Matching Debug - Recipe: ${recipe.name}`)
          console.log(`🔍 Recipe ingredients:`, recipe.ingredients)
          console.log(`🔍 Selected ingredients:`, ingredients.map(ing => ing.id))
          
          // Check if at least 60% of recipe ingredients are available
          const availableCount = recipe.ingredients.filter(recipeIngredient => {
            const mappedIngredient = mapRecipeIngredientToRegistry(recipeIngredient)
            return ingredients.some(available => available.id === mappedIngredient)
          }).length
          
          console.log(`🔍 Available count: ${availableCount}/${recipe.ingredients.length}`)
          const match = (availableCount / recipe.ingredients.length) >= 0.6
          console.log(`🔍 Match result: ${match}`)
          
          return match
        })
        
        if (matchingRecipes.length > 0) {
          // Pick the first matching recipe
          recipe = {
            ...matchingRecipes[0],
            cuisine: cuisine.name
          }
          setRecipeType('ingredients')
        } else {
          // Show feedback for no matching recipes
          alert(t('errors.noRecipesForIngredients'))
          return
        }
      } else {
        // Use global ingredient search - use the proper recipe format
        recipe = getRandomRecipeFromAll()
        if (!recipe) {
          alert(t('errors.noRecipesForIngredients'))
          return
        }
        setRecipeType('ingredients')
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
      const allRecipes = []
      Object.entries(recipes).forEach(([cuisineName, cuisineRecipes]) => {
        if (Array.isArray(cuisineRecipes)) {
          cuisineRecipes.forEach(recipe => {
            allRecipes.push({
              ...recipe,
              cuisine: cuisineName
            })
          })
        }
      })
      
      const matchingRecipes = allRecipes.filter(recipe => {
        const availableCount = recipe.ingredients.filter(ingredient => 
          ingredients.some(available => available.id === ingredient)
        ).length
        return (availableCount / recipe.ingredients.length) >= 0.6
      })
      
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
              <div className="recipe-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem' }}>
                {/* Shopping List Button - Left Aligned */}
                <button 
                  className="btn btn-shopping btn-medium"
                  onClick={() => setShowShoppingList(true)}
                >
                  🛒 {t('button.createShoppingList')}
                </button>
                
                {/* Close Button - Right Aligned */}
                <button 
                  className="close-recipe-btn"
                  onClick={() => setSelectedRecipe(null)}
                  title="Close recipe"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="recipe-content">
              {/* Recipe Title - Translate dish names properly */}
              <h2 className="recipe-title" style={{ textAlign: 'center', fontSize: '2rem', marginTop: '0.5rem' }}>
                {selectedRecipe.name?.startsWith('dish.') 
                  ? t(`dishes.${selectedRecipe.name.replace('dish.', '')}`) 
                  : selectedRecipe.name}
              </h2>
              
              {/* Recipe Description - Translate descriptions properly */}
              {selectedRecipe.description && (
                <p className="recipe-description" style={{ textAlign: 'center' }}>
                  {selectedRecipe.description?.startsWith('description.') 
                    ? t(`descriptions.${selectedRecipe.description.replace('description.', '')}`) 
                    : selectedRecipe.description}
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
                            const translatedName = ingredientName.startsWith('ingredient.') 
                              ? t(`ingredients.${ingredientName.replace('ingredient.', '')}`)
                              : ingredientName
                            return `${amount} ${translatedName}`
                          })()
                        ) : (
                          // Handle direct ingredient keys
                          ingredient?.startsWith('ingredient.') 
                            ? t(`ingredients.${ingredient.replace('ingredient.', '')}`)
                            : ingredient
                        )}
                      </li>
                    ))
                  ) : (
                    selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient?.startsWith('ingredient.') 
                          ? t(`ingredients.${ingredient.replace('ingredient.', '')}`)
                          : ingredient}
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