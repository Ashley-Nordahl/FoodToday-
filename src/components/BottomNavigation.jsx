import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAllRecipes, searchRecipes } from '../data/recipeLoader'

const BottomNavigation = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Navigation pages configuration
  const navigationPages = [
    { path: '/', key: 'dishToday', icon: '🍽️' },
    { path: '/sauce', key: 'sauce', icon: '🍯' },
    { path: '/drink', key: 'drink', icon: '🥤' },
    { path: '/parties', key: 'parties', icon: '🎉' },
    { path: '/favorite', key: 'myFavorite', icon: '❤️' }
  ]

  // Handle search with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      setIsSearching(true)
      const results = searchRecipes(searchQuery)
      setSearchResults(results.slice(0, 10)) // Limit to 10 results
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSearchClick = () => {
    setShowSearchModal(true)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleCloseSearch = () => {
    setShowSearchModal(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleRecipeSelect = (recipe) => {
    // Navigate to DishToday page with the selected recipe
    navigate('/', { state: { selectedRecipe: recipe } })
    handleCloseSearch()
  }

  const getCategoryEmoji = (recipe) => {
    const mainType = recipe.main_type?.en || ''
    const emojiMap = {
      'Meat': '🥩',
      'Seafood': '🦞',
      'Vegetables': '🥬',
      'Grains': '🍚',
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

  return (
    <>
      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="bottom-navigation">
        {navigationPages.map((page) => {
          const isActive = location.pathname === page.path
          return (
            <button
              key={page.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(page.path)}
              title={t(`nav.${page.key}`)}
            >
              <span className="nav-icon">{page.icon}</span>
              <span className="nav-label">{t(`nav.${page.key}`)}</span>
            </button>
          )
        })}
        <button
          className="nav-item search-item"
          onClick={handleSearchClick}
          title={t('nav.search')}
        >
          <span className="nav-icon">🔍</span>
          <span className="nav-label">{t('nav.search')}</span>
        </button>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="search-modal-overlay" onClick={handleCloseSearch}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <h3>🔍 {t('nav.search')}</h3>
              <button className="close-search-btn" onClick={handleCloseSearch}>
                ×
              </button>
            </div>
            
            <div className="search-input-container">
              <input
                type="text"
                className="search-input"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            {searchQuery && (
              <div className="search-results">
                {isSearching ? (
                  <div className="search-loading">
                    <span>🔍 {t('search.searching')}...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="search-results-list">
                    {searchResults.map((recipe, index) => (
                      <div
                        key={recipe.id}
                        className="search-result-item"
                        onClick={() => handleRecipeSelect(recipe)}
                      >
                        <span className="result-number">{index + 1}</span>
                        <span className="result-emoji">{getCategoryEmoji(recipe)}</span>
                        <div className="result-content">
                          <span className="result-name">
                            {recipe.dish_name?.en || recipe.name}
                          </span>
                          <span className="result-cuisine">
                            {recipe.region?.en || 'Unknown Cuisine'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="search-no-results">
                    <span>😔 {t('search.noResults')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default BottomNavigation
