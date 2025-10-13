import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import IngredientSelector from './IngredientSelector'
import { useRecipes, searchRecipesFromAll } from '../data/recipes'

const RecipeChoiceCards = ({ selectedCuisine, onChoiceSelect, isRecipeSelected = false }) => {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('random')
  const [showIngredientSelector, setShowIngredientSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchResultSelected, setSearchResultSelected] = useState(false)
  const previousIsRecipeSelected = useRef(false)

  // Clear state when language changes to prevent mixing
  useEffect(() => {
    setActiveTab('random')
    setShowIngredientSelector(false)
    setSearchQuery('')
    setSearchResults([])
    setSearchResultSelected(false)
  }, [i18n.language])

  // Restore search results when recipe is closed
  useEffect(() => {
    // If recipe was previously selected but now not selected, restore search results
    if (previousIsRecipeSelected.current && !isRecipeSelected && searchQuery.trim() && searchResults.length > 0) {
      setSearchResultSelected(false)
    }
    previousIsRecipeSelected.current = isRecipeSelected
  }, [isRecipeSelected, searchQuery, searchResults.length])

  // Get reactive recipe data
  const recipes = useRecipes()

  const handleRandomRecipe = () => {
    onChoiceSelect('random', selectedCuisine)
  }

  const handleIngredientRecipe = () => {
    setShowIngredientSelector(true)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setSearchResultSelected(false) // Reset search result selected state
    
    // Scroll to tabs when user starts typing
    if (query.trim()) {
      setTimeout(() => {
        const tabsElement = document.querySelector('.choice-segments-container')
        if (tabsElement) {
          const tabsRect = tabsElement.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          
          // Calculate the position to scroll to (tabs at top of viewport)
          const targetPosition = tabsRect.top + scrollTop - 10 // 10px offset from top
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
    
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    if (selectedCuisine) {
      // Search within specific cuisine (REACTIVE)
      const culturalRecipes = recipes.cultural || {}
      const cuisineRecipes = culturalRecipes[selectedCuisine.name] || []
      
      // Search by dish name (case insensitive)
      const results = cuisineRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(query.toLowerCase())
      )
      
      setSearchResults(results)
    } else {
      // Search across all cuisines
      const results = searchRecipesFromAll(query)
      setSearchResults(results)
    }
  }

  const handleSelectSearchResult = (recipe) => {
    // Mark search result as selected to hide search results
    setSearchResultSelected(true)
    
    // Trigger the recipe selection
    onChoiceSelect('search', selectedCuisine, null, recipe)
    
    // Scroll to tabs instead of recipe display
    setTimeout(() => {
      const tabsElement = document.querySelector('.choice-segments-container')
      if (tabsElement) {
        const tabsRect = tabsElement.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        
        // Calculate the position to scroll to (tabs at top of viewport)
        const targetPosition = tabsRect.top + scrollTop - 10 // 10px offset from top
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // If there are search results, select the first one
      if (searchResults.length > 0) {
        handleSelectSearchResult(searchResults[0])
      }
    }
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    
    // Scroll to tabs section for "Random Recipe", "What I Have", and "Search" tabs
    if (tab === 'random' || tab === 'ingredients' || tab === 'search') {
      setTimeout(() => {
        const tabsElement = document.querySelector('.choice-segments-container')
        if (tabsElement) {
          // Get the position of the tabs element
          const tabsRect = tabsElement.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          
          // Calculate the position to scroll to (tabs at top of viewport)
          const targetPosition = tabsRect.top + scrollTop - 10 // 10px offset from top
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          })
        }
      }, 200)
    }
    
    if (tab === 'random') {
      // Directly trigger random recipe
      onChoiceSelect('random', selectedCuisine)
    } else if (tab === 'ingredients') {
      // Clear any previous recipe selection when switching to ingredients
      onChoiceSelect('clear', selectedCuisine)
      setShowIngredientSelector(true)
    } else if (tab === 'search') {
      // Clear previous search and recipe selection
      setSearchQuery('')
      setSearchResults([])
      setSearchResultSelected(false)
      onChoiceSelect('clear', selectedCuisine)
    }
  }


  const handleIngredientGenerate = (ingredients) => {
    onChoiceSelect('ingredients', selectedCuisine, ingredients)
  }

  return (
    <div className="choice-segments-container">
      <h3 className="choice-title">{t('recipe.choiceTitle')}</h3>
      
      <div className={`segmented-control ${isRecipeSelected ? 'disabled' : ''}`}>
        <button 
          className={`segment-option ${activeTab === 'random' ? 'active' : ''} ${isRecipeSelected ? 'disabled' : ''}`}
          onClick={() => !isRecipeSelected && handleTabClick('random')}
          disabled={isRecipeSelected}
        >
          <div className="segment-icon">🎲</div>
          <div className="segment-content">
            <div className="segment-title">{t('recipe.randomTitle')}</div>
            <div className="segment-subtitle">{t('recipe.randomSubtitle')}</div>
          </div>
        </button>
        
        <button 
          className={`segment-option ${activeTab === 'ingredients' ? 'active' : ''} ${isRecipeSelected ? 'disabled' : ''}`}
          onClick={() => !isRecipeSelected && handleTabClick('ingredients')}
          disabled={isRecipeSelected}
        >
          <div className="segment-icon">🥬</div>
          <div className="segment-content">
            <div className="segment-title">{t('recipe.whatIHaveTitle')}</div>
            <div className="segment-subtitle">{t('recipe.whatIHaveSubtitle')}</div>
          </div>
        </button>

        <button 
          className={`segment-option ${activeTab === 'search' ? 'active' : ''} ${isRecipeSelected ? 'disabled' : ''}`}
          onClick={() => !isRecipeSelected && handleTabClick('search')}
          disabled={isRecipeSelected}
        >
          <div className="segment-icon">🔍</div>
          <div className="segment-content">
            <div className="segment-title">{t('recipe.searchTitle')}</div>
            <div className="segment-subtitle">{t('recipe.searchSubtitle')}</div>
          </div>
        </button>
      </div>

      {activeTab === 'search' && (
        <div className={`search-container ${isRecipeSelected ? 'disabled' : ''}`}>
          <input
            type="text"
            className={`search-input ${isRecipeSelected ? 'disabled' : ''}`}
            placeholder={isRecipeSelected ? t('recipe.closeRecipeToSearch') : t('recipe.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => !isRecipeSelected && handleSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            autoFocus={!isRecipeSelected}
            disabled={isRecipeSelected}
          />
          
          {searchQuery && searchResults.length > 0 && !searchResultSelected && (
            <div className="search-results">
              <div className="search-results-header">
                {t('recipe.foundRecipes', { count: searchResults.length })}
              </div>
              {searchResults.map((recipe) => (
                <div 
                  key={recipe.id} 
                  className="search-result-item"
                  onClick={() => handleSelectSearchResult(recipe)}
                >
                  <span className="result-emoji">{recipe.emoji}</span>
                  <div className="result-info">
                    <div className="result-name">{recipe.name}</div>
                    <div className="result-meta">
                      {recipe.cookTime} • {recipe.servings} {t('recipe.servings')} • {t(`difficulty.${recipe.difficulty.toLowerCase()}`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {searchQuery && searchResults.length === 0 && (
            <div className="search-no-results">
              <div className="no-results-icon">🔍</div>
              <div className="no-results-text">{t('recipe.noRecipesFound')}</div>
              <div className="no-results-hint">{t('recipe.tryDifferentSearch')}</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ingredients' && showIngredientSelector && (
        <div className="ingredients-content-container">
          <IngredientSelector
            selectedCuisine={selectedCuisine}
            onGenerate={handleIngredientGenerate}
          />
        </div>
      )}

    </div>
  )
}

export default RecipeChoiceCards
