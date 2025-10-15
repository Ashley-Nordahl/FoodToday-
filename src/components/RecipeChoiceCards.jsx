import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import IngredientSelector from './IngredientSelector'
// Removed old recipe import - now using proper recipes from translation files

const RecipeChoiceCards = ({ selectedCuisine, onChoiceSelect, isRecipeSelected = false }) => {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('random')
  const [showIngredientSelector, setShowIngredientSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchResultSelected, setSearchResultSelected] = useState(false)
  const previousIsRecipeSelected = useRef(false)

  // Get recipes from translation files
  const currentLanguage = i18n.language || 'en'
  const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }

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

  // Enhanced recipe search function with cuisine filtering
  const searchRecipesFromAll = (query) => {
    if (!query || query.trim() === '') {
      return []
    }
    
    // Get recipes from translation files (proper format with amounts and instructions)
    const currentLanguage = i18n.language || 'en'
    const recipes = i18n.getResourceBundle(currentLanguage, 'recipes') || { cultural: {}, basic: {}, metadata: {} }
    const culturalRecipes = recipes.cultural || {}
    
    const searchLower = query.toLowerCase()
    const matchingRecipes = []
    
    Object.entries(culturalRecipes).forEach(([cuisineName, cuisineRecipes]) => {
      if (Array.isArray(cuisineRecipes)) {
        cuisineRecipes.forEach(recipe => {
          // Only include complete recipes with amounts and instructions
          if (recipe.ingredientsWithAmounts && 
              recipe.instructions && 
              Array.isArray(recipe.ingredientsWithAmounts) && 
              Array.isArray(recipe.instructions) &&
              recipe.ingredientsWithAmounts.length > 0 &&
              recipe.instructions.length > 0) {
            
            // Search in recipe name, ingredients, and cuisine name
            const nameMatch = recipe.name && recipe.name.toLowerCase().includes(searchLower)
            const ingredientMatch = recipe.ingredients && recipe.ingredients.some(ingredient => 
              ingredient.toLowerCase().includes(searchLower)
            )
            const cuisineMatch = cuisineName.toLowerCase().includes(searchLower)
            
            // Also search in translated dish names
            let translatedNameMatch = false
            if (recipe.name && recipe.name.startsWith('dish.')) {
              try {
                const translatedName = t(`dish.${recipe.name.replace('dish.', '')}`)
                translatedNameMatch = translatedName && translatedName.toLowerCase().includes(searchLower)
              } catch (e) {
                translatedNameMatch = false
              }
            }
            
            // Also search in translated cuisine names
            const translatedCuisineName = t(`cuisines.${cuisineName}`, cuisineName).toLowerCase()
            const translatedCuisineMatch = translatedCuisineName.includes(searchLower)
            
            if (nameMatch || ingredientMatch || cuisineMatch || translatedNameMatch || translatedCuisineMatch) {
              matchingRecipes.push({
                ...recipe,
                cuisine: cuisineName
              })
            }
          }
        })
      }
    })
    
    // Sort results: prioritize better matches
    matchingRecipes.sort((a, b) => {
      const queryLower = query.toLowerCase()
      
      // Get translated names for comparison
      const aName = t(`dish.${a.name.replace('dish.', '')}`).toLowerCase()
      const bName = t(`dish.${b.name.replace('dish.', '')}`).toLowerCase()
      const aCuisine = t(`cuisines.${a.cuisine}`, a.cuisine).toLowerCase()
      const bCuisine = t(`cuisines.${b.cuisine}`, b.cuisine).toLowerCase()
      
      // Priority 1: Cuisine name starts with query (e.g., "me" matches "Mexican")
      const aCuisineStarts = aCuisine.startsWith(queryLower)
      const bCuisineStarts = bCuisine.startsWith(queryLower)
      if (aCuisineStarts && !bCuisineStarts) return -1
      if (!aCuisineStarts && bCuisineStarts) return 1
      
      // Priority 2: Dish name starts with query
      const aNameStarts = aName.startsWith(queryLower)
      const bNameStarts = bName.startsWith(queryLower)
      if (aNameStarts && !bNameStarts) return -1
      if (!aNameStarts && bNameStarts) return 1
      
      // Priority 3: Query matches start of any word in cuisine name
      const aCuisineWordStart = new RegExp(`\\b${queryLower}`, 'i').test(aCuisine)
      const bCuisineWordStart = new RegExp(`\\b${queryLower}`, 'i').test(bCuisine)
      if (aCuisineWordStart && !bCuisineWordStart) return -1
      if (!aCuisineWordStart && bCuisineWordStart) return 1
      
      // Priority 4: Query matches start of any word in dish name
      const aNameWordStart = new RegExp(`\\b${queryLower}`, 'i').test(aName)
      const bNameWordStart = new RegExp(`\\b${queryLower}`, 'i').test(bName)
      if (aNameWordStart && !bNameWordStart) return -1
      if (!aNameWordStart && bNameWordStart) return 1
      
      return 0
    })
    
    return matchingRecipes
  }

  const handleRandomRecipe = () => {
    onChoiceSelect('random', selectedCuisine)
  }

  const handleIngredientRecipe = () => {
    setShowIngredientSelector(true)
  }

  const handleIngredientGenerate = (selectedIngredients) => {
    // Pass the selected ingredients to the parent component
    onChoiceSelect('ingredients', selectedCuisine, selectedIngredients)
    setShowIngredientSelector(false)
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
    
    if (selectedCuisine) {
      // Search within specific cuisine (REACTIVE)
      const culturalRecipes = recipes.cultural || {}
      const cuisineRecipes = culturalRecipes[selectedCuisine.name] || []
      
      // If query is empty, show ALL dishes from the selected cuisine
      if (!query.trim()) {
        // Filter to only include complete recipes with amounts and instructions
        const allCuisineDishes = cuisineRecipes.filter(recipe => 
          recipe.ingredientsWithAmounts && 
          recipe.instructions && 
          Array.isArray(recipe.ingredientsWithAmounts) && 
          Array.isArray(recipe.instructions) &&
          recipe.ingredientsWithAmounts.length > 0 &&
          recipe.instructions.length > 0
        )
        setSearchResults(allCuisineDishes)
        return
      }
      
      // Search by dish name (both raw and translated, case insensitive)
      const results = cuisineRecipes.filter(recipe => {
        const queryLower = query.toLowerCase()
        const nameMatch = recipe.name && recipe.name.toLowerCase().includes(queryLower)
        
        // Also search by translated name
        let translatedNameMatch = false
        if (recipe.name && recipe.name.startsWith('dish.')) {
          try {
            const translatedName = t(`dish.${recipe.name.replace('dish.', '')}`)
            translatedNameMatch = translatedName && translatedName.toLowerCase().includes(queryLower)
          } catch (e) {
            translatedNameMatch = false
          }
        }
        
        // Also search in ingredients
        const ingredientMatch = recipe.ingredients && recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(queryLower)
        )
        
        return nameMatch || translatedNameMatch || ingredientMatch
      })
      
      // Sort results: prioritize matches at start of words
      results.sort((a, b) => {
        const aName = t(`dish.${a.name.replace('dish.', '')}`).toLowerCase()
        const bName = t(`dish.${b.name.replace('dish.', '')}`).toLowerCase()
        const queryLower = query.toLowerCase()
        
        const aStartsWith = aName.startsWith(queryLower)
        const bStartsWith = bName.startsWith(queryLower)
        
        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1
        
        // Check if query matches start of any word
        const aWordStart = new RegExp(`\\b${queryLower}`, 'i').test(aName)
        const bWordStart = new RegExp(`\\b${queryLower}`, 'i').test(bName)
        
        if (aWordStart && !bWordStart) return -1
        if (!aWordStart && bWordStart) return 1
        
        return 0
      })
      
      setSearchResults(results)
    } else {
      // No cuisine selected - search across all cuisines
      if (!query.trim()) {
        setSearchResults([])
        return
      }
      
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

  const handleSearchFocus = () => {
    // If cuisine is selected and search is empty, show all dishes from that cuisine
    if (selectedCuisine && !searchQuery.trim()) {
      handleSearch('') // This will trigger showing all cuisine dishes
    }
    
    // Scroll to keep search field visible above keyboard on mobile
    setTimeout(() => {
      const searchInput = document.querySelector('.search-input')
      if (searchInput) {
        // Get the position of the search input
        const searchRect = searchInput.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        
        // Calculate position to keep search field visible above keyboard
        // On mobile, we want the search field to be about 100px from top of viewport
        const targetPosition = searchRect.top + scrollTop - 100
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    }, 300) // Small delay to allow keyboard to appear
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
            placeholder={
              isRecipeSelected 
                ? t('recipe.closeRecipeToSearch') 
                : selectedCuisine 
                  ? t('recipe.searchByDishOrIngredient')
                  : t('recipe.searchPlaceholder')
            }
            value={searchQuery}
            onChange={(e) => !isRecipeSelected && handleSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={handleSearchFocus}
            autoFocus={!isRecipeSelected}
            disabled={isRecipeSelected}
          />
          
          {((searchQuery || selectedCuisine) && searchResults.length > 0 && !searchResultSelected) && (
            <div className="search-results">
              <div className="search-results-header">
                {selectedCuisine && !searchQuery 
                  ? t('recipe.allDishesFromCuisine', { cuisine: selectedCuisine.name ? t(`cuisines.${selectedCuisine.name}`) : 'Unknown Cuisine' })
                  : t('recipe.foundRecipes', { count: searchResults.length })}
              </div>
              {searchResults.map((recipe) => (
                <div 
                  key={recipe.id} 
                  className="search-result-item"
                  onClick={() => handleSelectSearchResult(recipe)}
                >
                  <span className="result-emoji">{recipe.emoji}</span>
                  <div className="result-info">
                    <div className="result-name">
                      {recipe.name?.startsWith('dish.')
                        ? t(`dishes.${recipe.name.replace('dish.', '')}`)
                        : recipe.name}
                    </div>
                    <div className="result-meta">
                      <span className="result-cuisine">🌍 {t(`cuisines.${recipe.cuisine}`, recipe.cuisine)}</span>
                      <span className="result-separator"> • </span>
                      <span className="result-details">
                        {recipe.cookTime} • {recipe.servings} {t('recipe.servings')} • {t(`difficulty.${recipe.difficulty.toLowerCase()}`)}
                      </span>
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
