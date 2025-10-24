import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { searchRecipes } from '../data/recipeLoader'

const RecipeChoiceCards = ({ 
  cuisine, 
  onChoice, 
  onIngredientSelect, 
  onSearchRecipe, 
  activeTab, 
  setActiveTab 
}) => {
  const { t, i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  // Clear state when language changes
  useEffect(() => {
    setSearchQuery('')
    setSearchResults([])
  }, [i18n.language])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'random') {
      onChoice('random', cuisine)
    } else if (tab === 'ingredients') {
      onChoice('ingredients', cuisine)
    }
  }

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results = searchRecipes(query)
    setSearchResults(results.slice(0, 10)) // Limit to 10 results
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  const handleRecipeSelect = (recipe) => {
    onSearchRecipe(recipe)
  }

  const handleIngredientSelect = () => {
    onIngredientSelect()
  }

  return (
    <div className="recipe-choice-cards">
      <h2 className="choice-title">{t('recipeChoice.title')}</h2>
      <div className="choice-cards-container">
        <div
          className={`choice-card ${activeTab === 'random' ? 'active' : ''}`}
          onClick={() => handleTabChange('random')}
        >
          <div className="card-icon">🎲</div>
          <div className="card-content">
            <h3 className="card-title">{t('recipeChoice.random')}</h3>
            <p className="card-subtitle">{t('recipeChoice.randomSubtitle')}</p>
          </div>
        </div>
        
        <div
          className={`choice-card ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => handleTabChange('ingredients')}
        >
          <div className="card-icon">🥬</div>
          <div className="card-content">
            <h3 className="card-title">{t('recipeChoice.ingredients')}</h3>
            <p className="card-subtitle">{t('recipeChoice.ingredientsSubtitle')}</p>
          </div>
        </div>
        
        <div
          className={`choice-card ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <div className="card-icon">🔍</div>
          <div className="card-content">
            <h3 className="card-title">{t('recipeChoice.search')}</h3>
            <p className="card-subtitle">{t('recipeChoice.searchSubtitle')}</p>
          </div>
        </div>
      </div>

      {activeTab === 'search' && (
        <div className="search-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('recipeChoice.searchPlaceholder')}
              className="search-input"
            />
            <button type="submit" className="search-button">
              {t('recipeChoice.search')}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>{t('recipeChoice.searchResults')}</h3>
              <div className="recipe-list">
                {searchResults.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="recipe-item"
                    onClick={() => handleRecipeSelect(recipe)}
                  >
                    <div className="recipe-info">
                      <h4>{recipe.dish_name?.[i18n.language] || recipe.dish_name?.en}</h4>
                      <p>{recipe.description?.[i18n.language] || recipe.description?.en}</p>
                      <div className="recipe-meta">
                        <span className="recipe-cuisine">{recipe.cuisine}</span>
                        <span className="recipe-category">{recipe.category}</span>
                        <span className="recipe-difficulty">{recipe.difficulty}</span>
                        <span className="recipe-time">{recipe.total_time_min} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ingredients' && (
        <div className="ingredients-section">
          <p>{t('recipeChoice.ingredientsDescription')}</p>
          <button
            className="ingredient-selector-btn"
            onClick={handleIngredientSelect}
          >
            {t('recipeChoice.selectIngredients')}
          </button>
        </div>
      )}

      {activeTab === 'random' && (
        <div className="random-section">
          <p>{t('recipeChoice.randomDescription')}</p>
          <button
            className="random-recipe-btn"
            onClick={() => onChoice('random', cuisine)}
          >
            {t('recipeChoice.getRandomRecipe')}
          </button>
        </div>
      )}
    </div>
  )
}

export default RecipeChoiceCards
