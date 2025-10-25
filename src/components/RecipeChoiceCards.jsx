import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { searchRecipes, getRecipesByCuisine, getRecipesBySubcategory } from '../data/recipeLoader'

const RecipeChoiceCards = ({ 
  cuisine, 
  onChoice, 
  onIngredientSelect, 
  onSearchRecipe, 
  activeTab, 
  setActiveTab,
  selectedRecipe
}) => {
  const { t, i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  // Get category emoji based on main_type
  const getCategoryEmoji = (recipe) => {
    const mainType = recipe.main_type?.[i18n.language] || recipe.main_type?.en || ''
    const emojiMap = {
      'Meat': '🥩',
      'Seafood': '🦞', 
      'Vegetables': '🥬',
      'Vegetable': '🥬',
      'Grains': '🍚',
      'Grain': '🍚',
      'Egg': '🥚',
      'Dessert': '🍰',
      'Soup': '🍲',
      'Salad': '🥗',
      'Pasta': '🍝',
      'Rice': '🍚',
      'Bread': '🍞',
      'Drink': '🥤'
    }
    return emojiMap[mainType] || '🍽️'
  }

  // Clear state when language changes
  useEffect(() => {
    setSearchQuery('')
    setSearchResults([])
  }, [i18n.language])

  // Real-time search with debouncing
  useEffect(() => {
    if (!cuisine) return

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300) // 300ms delay

    return () => clearTimeout(timeoutId)
  }, [searchQuery, cuisine])

  const handleTabChange = (tab) => {
    // Don't allow tab changes if a recipe is currently selected or search results are displayed
    if (selectedRecipe || searchResults.length > 0) return
    
    setActiveTab(tab)
    if (tab === 'random') {
      onChoice('random', cuisine)
    } else if (tab === 'search') {
      // Load initial dishes from the selected cuisine/subcategory
      if (cuisine) {
        let initialResults = []
        if (cuisine.subcategory) {
          // If subcategory is selected, show dishes from that subcategory
          const mappedSubcategory = mapCuisineName(cuisine.subcategory)
          initialResults = getRecipesBySubcategory(mappedSubcategory)
        } else {
          // If only cuisine is selected, show dishes from that cuisine
          initialResults = getRecipesByCuisine(cuisine.name)
        }
        setSearchResults(initialResults.slice(0, 10))
      }
      
      // Scroll down a little when search tab is clicked
      setTimeout(() => {
        const searchSection = document.querySelector('.search-section')
        if (searchSection) {
          searchSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        } else {
          // Fallback: scroll down a bit to show the search area
          window.scrollBy({
            top: 200,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }

  // Mapping function to convert display names to data names
  const mapCuisineName = (name) => {
    const mapping = {
      'Chinese': 'China',
      'Japanese': 'Japan',
      'Korean': 'Korea',
      'Indian': 'India',
      'Thai': 'Thailand',
      'Malaysian': 'Malaysia'
    }
    return mapping[name] || name
  }

  const handleSearch = (query) => {
    // Don't allow search if a recipe is currently selected
    if (selectedRecipe) return
    
    if (!cuisine) return
    
    // Get the base cuisine results
    let baseResults = []
    if (cuisine.subcategory) {
      // Map the subcategory name to the actual data name
      const mappedSubcategory = mapCuisineName(cuisine.subcategory)
      baseResults = getRecipesBySubcategory(mappedSubcategory)
    } else {
      baseResults = getRecipesByCuisine(cuisine.name)
    }
    
    if (!query.trim()) {
      // Show all dishes from the selected cuisine/subcategory
      setSearchResults(baseResults.slice(0, 10))
      return
    }

    // Filter the cuisine results based on the search query
    const filteredResults = baseResults.filter(recipe => {
      const lowercaseQuery = query.toLowerCase()
      
      // Search in dish names (all languages)
      const nameMatch = Object.values(recipe.dish_name).some(name => 
        name.toLowerCase().includes(lowercaseQuery)
      )
      
      // Search in descriptions (all languages)
      const descMatch = Object.values(recipe.description).some(desc => 
        desc.toLowerCase().includes(lowercaseQuery)
      )
      
      // Search in ingredients (all languages)
      const ingredientMatch = Object.values(recipe.ingredients).some(ingredientList => 
        ingredientList.some(ingredient => 
          ingredient.toLowerCase().includes(lowercaseQuery)
        )
      )
      
      // Search in main type (ingredient categories) - all languages
      const mainTypeMatch = Object.values(recipe.main_type).some(mainType => 
        mainType.toLowerCase().includes(lowercaseQuery)
      )
      
      return nameMatch || descMatch || ingredientMatch || mainTypeMatch
    })
    
    setSearchResults(filteredResults.slice(0, 10)) // Limit to 10 results
  }

  const handleRecipeSelect = (recipe) => {
    onSearchRecipe(recipe)
    // Clear search results when a recipe is selected
    setSearchResults([])
  }

  const handleIngredientSelect = () => {
    onIngredientSelect()
  }

  return (
    <div className="recipe-choice-cards">
      <h2 className="choice-title">{t('recipeChoice.title')}</h2>
      <div className={`choice-cards-container ${selectedRecipe || searchResults.length > 0 ? 'faded' : ''}`}>
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
        <div className={`search-section ${selectedRecipe ? 'disabled' : ''}`}>
          {selectedRecipe && (
            <div className="search-disabled-message">
              <p>{t('recipeChoice.closeRecipeFirst')}</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="search-results">
              <div className="search-results-header">
                <h3>{t('recipeChoice.searchResults')}</h3>
                <button 
                  className="search-close-button"
                  onClick={() => {
                    setSearchResults([])
                    setActiveTab('random')
                  }}
                  title={t('button.close')}
                >
                  ✕
                </button>
              </div>
              <div className="search-results-list">
                {searchResults.map((recipe, index) => (
                  <div
                    key={recipe.id}
                    className="search-result-item"
                    onClick={() => handleRecipeSelect(recipe)}
                  >
                    <span className="result-number">{index + 1}</span>
                    <span className="result-emoji">{getCategoryEmoji(recipe)}</span>
                    <span className="result-name">
                      {recipe.dish_name?.[i18n.language] || recipe.dish_name?.en}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}



    </div>
  )
}

export default RecipeChoiceCards
