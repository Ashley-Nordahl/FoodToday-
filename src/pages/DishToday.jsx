import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { trackSelection } from '../lib/supabase'
import InlineFoodWheel from '../components/InlineFoodWheel'
import RecipeChoiceCards from '../components/RecipeChoiceCards'
import IngredientSelector from '../components/IngredientSelector'
import ShoppingList from '../components/ShoppingList'
import { 
  getRandomRecipe, 
  getRandomRecipeByCuisine, 
  getRecipesByCuisine,
  getAllCuisines,
  getRecipeById 
} from '../data/recipeLoader'

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

  // Get available cuisines from new recipe system
  const availableCuisines = getAllCuisines()

  // Clear all state when language changes to prevent mixing
  useEffect(() => {
    setSelectedRecipe(null)
    setSelectedCuisine(null)
    setShowChoiceCards(false)
    setShowIngredientSelector(false)
    setRecipeType(null)
  }, [i18n.language])

  // Update selected recipe when language changes (REACTIVE TRANSLATION)
  useEffect(() => {
    if (selectedRecipe && selectedRecipe.id) {
      const foundRecipe = getRecipeById(selectedRecipe.id)
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
        // Get random recipe from specific cuisine using new loader
        recipe = getRandomRecipeByCuisine(cuisine.name)
        if (!recipe) {
          const cuisineName = t(`cuisines.${cuisine.name}`, cuisine.name)
          alert(t('errors.noRecipesAvailable', { cuisine: cuisineName }))
          return
        }
      } else {
        recipe = getRandomRecipe()
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
        // Get recipes from specific cuisine using new loader
        const cuisineRecipes = getRecipesByCuisine(cuisine.name)
        const completeRecipes = cuisineRecipes.filter(recipe => 
          recipe.ingredients && 
          recipe.steps && 
          Array.isArray(recipe.ingredients) && 
          Array.isArray(recipe.steps) &&
          recipe.ingredients.length > 0 &&
          recipe.steps.length > 0
        )
        
        // Simple ingredient matching
        const matchingRecipes = completeRecipes.filter(recipe => {
          const recipeIngredients = recipe.ingredients || []
          const availableCount = recipeIngredients.filter(ingredient => 
            ingredients.some(available => 
              ingredient.toLowerCase().includes(available.id.toLowerCase()) ||
              available.id.toLowerCase().includes(ingredient.toLowerCase())
            )
          ).length
          
          return (availableCount / recipeIngredients.length) >= 0.6
        })
        
        if (matchingRecipes.length > 0) {
          recipe = matchingRecipes[0]
          setRecipeType('ingredients')
        } else {
          alert(t('errors.noRecipesForIngredients'))
          return
        }
      } else {
        // Use global ingredient search
        recipe = getRandomRecipe()
        if (!recipe) {
          alert(t('errors.noRecipesForIngredients'))
          return
        }
        setRecipeType('ingredients')
      }
    }
    
    setSelectedRecipe(recipe)
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

  const handleIngredientSelect = (ingredients) => {
    handleRecipeChoice('ingredients', selectedCuisine, ingredients)
  }

  const handleSearchRecipe = (searchRecipe) => {
    handleRecipeChoice('search', selectedCuisine, null, searchRecipe)
  }

  const handleViewShoppingList = () => {
    setShowShoppingList(true)
  }

  const handleCloseShoppingList = () => {
    setShowShoppingList(false)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('dishToday.title')}</h1>
        <p className="page-subtitle">{t('dishToday.subtitle')}</p>
      </div>

      <InlineFoodWheel 
        cuisines={availableCuisines}
        onCuisineSelect={handleCuisineSelect}
      />

      {showChoiceCards && selectedCuisine && (
        <RecipeChoiceCards
          cuisine={selectedCuisine}
          onChoice={handleRecipeChoice}
          onIngredientSelect={handleIngredientSelect}
          onSearchRecipe={handleSearchRecipe}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {showIngredientSelector && (
        <IngredientSelector
          onIngredientsSelected={handleIngredientSelect}
          onClose={() => setShowIngredientSelector(false)}
        />
      )}

      {selectedRecipe && (
        <div className="recipe-display">
          <div className="recipe-header">
            <h2 className="recipe-title">
              {selectedRecipe.dish_name?.[i18n.language] || selectedRecipe.dish_name?.en || 'Unknown Recipe'}
            </h2>
            <div className="recipe-meta">
              <span className="recipe-cuisine">{selectedRecipe.cuisine}</span>
              <span className="recipe-category">{selectedRecipe.category}</span>
              <span className="recipe-difficulty">{selectedRecipe.difficulty}</span>
              <span className="recipe-time">{selectedRecipe.total_time_min} min</span>
              <span className="recipe-servings">{selectedRecipe.servings} servings</span>
            </div>
          </div>

          <div className="recipe-description">
            <p>{selectedRecipe.description?.[i18n.language] || selectedRecipe.description?.en || ''}</p>
          </div>

          <div className="recipe-content">
            <div className="recipe-ingredients">
              <h3>{t('recipe.ingredients')}</h3>
              <ul>
                {(selectedRecipe.ingredients?.[i18n.language] || selectedRecipe.ingredients?.en || []).map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="recipe-steps">
              <h3>{t('recipe.instructions')}</h3>
              <ol>
                {(selectedRecipe.steps?.[i18n.language] || selectedRecipe.steps?.en || []).map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="recipe-actions">
            <button 
              className="shopping-list-btn"
              onClick={handleViewShoppingList}
            >
              {t('recipe.viewShoppingList')}
            </button>
          </div>
        </div>
      )}

      {showShoppingList && selectedRecipe && (
        <ShoppingList
          recipe={selectedRecipe}
          onClose={handleCloseShoppingList}
        />
      )}
    </div>
  )
}

export default DishToday
