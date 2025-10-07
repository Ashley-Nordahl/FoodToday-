import { useState } from 'react'

const RecipeChoiceCards = ({ selectedCuisine, onChoiceSelect }) => {
  const [activeTab, setActiveTab] = useState('random')

  const handleRandomRecipe = () => {
    onChoiceSelect('random', selectedCuisine)
  }

  const handleIngredientRecipe = () => {
    // For now, just show a simple message or redirect to a different flow
    alert('Ingredient-based recipe selection is coming soon! For now, try the random recipe option.')
  }

  return (
    <div className="choice-segments-container">
      <h3 className="choice-title">How would you like to get your recipe?</h3>
      
      <div className="segmented-control">
        <button 
          className={`segment-option ${activeTab === 'random' ? 'active' : ''}`}
          onClick={() => setActiveTab('random')}
        >
          <div className="segment-icon">🎲</div>
          <div className="segment-content">
            <div className="segment-title">Random Recipe</div>
            <div className="segment-subtitle">Quick & easy • surprise me</div>
          </div>
        </button>
        
        <button 
          className={`segment-option ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          <div className="segment-icon">🥬</div>
          <div className="segment-content">
            <div className="segment-title">What I Have</div>
            <div className="segment-subtitle">Custom recipes • based on ingredients</div>
          </div>
        </button>
      </div>

      <div className="segment-content-area">
        {activeTab === 'random' && (
          <div className="segment-panel">
            <h4>Get a Surprise Recipe!</h4>
            <p>Let us surprise you with a random recipe from {selectedCuisine.name} cuisine. Perfect for when you want to try something new!</p>
            <button 
              className="choice-button random-button"
              onClick={handleRandomRecipe}
            >
              Get Random Recipe
            </button>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="segment-panel">
            <h4>Custom Recipe Based on Your Ingredients</h4>
            <p>Tell us what ingredients you have available, and we'll suggest a perfect {selectedCuisine.name} recipe tailored to your kitchen!</p>
            <button 
              className="choice-button ingredient-button"
              onClick={handleIngredientRecipe}
            >
              What I Have
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeChoiceCards
