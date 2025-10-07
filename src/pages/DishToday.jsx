import { useState } from 'react'
import InlineFoodWheel from '../components/InlineFoodWheel'
import RecipeChoiceCards from '../components/RecipeChoiceCards'
import { getRandomRecipe, getRecipesByIngredients, recipes } from '../data/recipes'


function DishToday() {
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [showChoiceCards, setShowChoiceCards] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [recipeType, setRecipeType] = useState(null)

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine)
    setShowChoiceCards(true)
    setSelectedRecipe(null)
    setRecipeType(null)
  }

  const handleRecipeChoice = (choiceType, cuisine, ingredients = null) => {
    let recipe = null
    if (choiceType === 'random') {
      recipe = getRandomRecipe(cuisine.name)
      setRecipeType('random')
    } else if (choiceType === 'ingredients' && ingredients) {
      const matchingRecipes = getRecipesByIngredients(cuisine.name, ingredients)
      if (matchingRecipes.length > 0) {
        recipe = matchingRecipes.reduce((best, current) => {
          const currentMatches = current.ingredients.filter(ing =>
            ingredients.some(available => available.id === ing)
          ).length
          const bestMatches = best.ingredients.filter(ing =>
            ingredients.some(available => available.id === ing)
          ).length
          return currentMatches > bestMatches ? current : best
        })
        setRecipeType('ingredients')
      }
    }
    setSelectedRecipe(recipe)
    setShowChoiceCards(false)
  }

  return (
    <div className="page-container">
      <div className="wheel-section">
        <InlineFoodWheel onSelect={handleCuisineSelect} />
      </div>

      {/* Choice Cards Section */}
      {showChoiceCards && selectedCuisine && (
        <div className="choice-section">
          <RecipeChoiceCards
            selectedCuisine={selectedCuisine}
            onChoiceSelect={handleRecipeChoice}
          />
        </div>
      )}

      {/* Selected Recipe Display */}
      {selectedRecipe && (
        <div className="recipe-display">
          <div className="recipe-header">
            <h3>Your Recipe: {selectedRecipe.name}</h3>
            <p className="recipe-type">
              {recipeType === 'random' ? '🎲 Random Recipe' : '🥬 Based on Your Ingredients'}
            </p>
          </div>

          <div className="recipe-card">
            <div className="recipe-emoji">{selectedRecipe.emoji}</div>
            <div className="recipe-content">
              <p className="recipe-description">{selectedRecipe.description}</p>

              <div className="recipe-meta">
                <span className="recipe-info">⏱️ {selectedRecipe.cookTime}</span>
                <span className="recipe-info">👥 {selectedRecipe.servings} servings</span>
                <span className="recipe-info">📊 {selectedRecipe.difficulty}</span>
              </div>

              <div className="recipe-ingredients">
                <h4>Ingredients:</h4>
                <ul>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient.replace('-', ' ')}</li>
                  ))}
                </ul>
              </div>

              <div className="recipe-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    // Get a new random recipe directly
                    console.log('Getting new recipe for cuisine:', selectedCuisine.name)
                    const newRecipe = getRandomRecipe(selectedCuisine.name)
                    console.log('New recipe:', newRecipe)
                    if (newRecipe) {
                      setSelectedRecipe(newRecipe)
                      setRecipeType('random')
                    } else {
                      console.error('No recipe found for cuisine:', selectedCuisine.name)
                      // Fallback: try to get any random recipe
                      const allRecipes = Object.values(recipes).flat()
                      if (allRecipes.length > 0) {
                        const randomRecipe = allRecipes[Math.floor(Math.random() * allRecipes.length)]
                        setSelectedRecipe(randomRecipe)
                        setRecipeType('random')
                      }
                    }
                  }}
                >
                  Try Another Recipe
                </button>
                
                {recipeType === 'random' && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setSelectedRecipe(null)
                      setShowChoiceCards(true)
                    }}
                  >
                    Switch to "What I Have"
                  </button>
                )}
                
                {recipeType === 'ingredients' && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      // Get a random recipe instead
                      const newRecipe = getRandomRecipe(selectedCuisine.name)
                      if (newRecipe) {
                        setSelectedRecipe(newRecipe)
                        setRecipeType('random')
                      }
                    }}
                  >
                    Switch to Random Recipe
                  </button>
                )}
                
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setSelectedRecipe(null)
                    setShowChoiceCards(false)
                    setSelectedCuisine(null)
                  }}
                >
                  Choose Different Cuisine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DishToday