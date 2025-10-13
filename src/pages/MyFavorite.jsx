import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { getAllStats, getFavorites, removeFromFavorites, getRecipes, removeRecipe } from '../lib/supabase'
import RecipeForm from '../components/RecipeForm'
import RecipeDetails from '../components/RecipeDetails'
import i18n from '../i18n'

function MyFavorite() {
  const { t } = useTranslation()
  const { user } = useAuth()
  
  // Use refs to persist data across unmounts
  const statsCache = useRef([])
  const favoritesCache = useRef([])
  const recipesCache = useRef([])
  const hasLoadedData = useRef(false)
  
  // Initialize state from cache
  const [stats, setStats] = useState(statsCache.current)
  const [favorites, setFavorites] = useState(favoritesCache.current)
  const [recipes, setRecipes] = useState(recipesCache.current)
  const [loading, setLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('favorites') // 'favorites' or 'recipes'
  const [selectedType, setSelectedType] = useState('dish') // 'dish', 'drink', 'sauce'
  const [showRecipeForm, setShowRecipeForm] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  useEffect(() => {
    if (user?.id && !hasLoadedData.current) {
      loadData()
      hasLoadedData.current = true
    } else if (!user?.id) {
      // Reset when user logs out
      hasLoadedData.current = false
      statsCache.current = []
      favoritesCache.current = []
      recipesCache.current = []
      setStats([])
      setFavorites([])
      setRecipes([])
    }
  }, [user?.id])

  // Clear state when language changes to prevent mixing
  useEffect(() => {
    setActiveTab('favorites')
    setSelectedType('dish')
    setShowRecipeForm(false)
    setSelectedRecipe(null)
  }, [i18n.language])

  const loadData = async () => {
    if (!user) {
      return
    }
    
    // Only show loading if we don't have cached data (true initial load)
    const isInitialLoad = statsCache.current.length === 0 && favoritesCache.current.length === 0 && recipesCache.current.length === 0
    
    if (isInitialLoad) {
      setLoading(true)
      
      // Only show loading indicator if fetch takes longer than 200ms
      const loadingTimeout = setTimeout(() => {
        setShowLoading(true)
      }, 200)
      
      // Load stats, favorites, and recipes in parallel
      const [statsResult, favoritesResult, recipesResult] = await Promise.all([
        getAllStats(user.id),
        getFavorites(user.id),
        getRecipes(user.id)
      ])

      if (statsResult.data) {
        statsCache.current = statsResult.data
        setStats(statsResult.data)
      }
      if (favoritesResult.data) {
        favoritesCache.current = favoritesResult.data
        setFavorites(favoritesResult.data)
      }
      if (recipesResult.data) {
        recipesCache.current = recipesResult.data
        setRecipes(recipesResult.data)
      }
      
      clearTimeout(loadingTimeout)
      setLoading(false)
      setShowLoading(false)
    } else {
      // For subsequent loads, update data silently without showing loading
      const [statsResult, favoritesResult, recipesResult] = await Promise.all([
        getAllStats(user.id),
        getFavorites(user.id),
        getRecipes(user.id)
      ])

      if (statsResult.data) {
        statsCache.current = statsResult.data
        setStats(statsResult.data)
      }
      if (favoritesResult.data) {
        favoritesCache.current = favoritesResult.data
        setFavorites(favoritesResult.data)
      }
      if (recipesResult.data) {
        recipesCache.current = recipesResult.data
        setRecipes(recipesResult.data)
      }
    }
  }

  const handleRemoveFavorite = async (itemId, itemType) => {
    const { error } = await removeFromFavorites(user.id, itemId, itemType)
    if (!error) {
      const updated = favorites.filter(f => !(f.item_id === itemId && f.item_type === itemType))
      favoritesCache.current = updated
      setFavorites(updated)
    }
  }

  const handleRecipeSuccess = (newRecipe) => {
    const updated = [newRecipe, ...recipes]
    recipesCache.current = updated
    setRecipes(updated)
    setShowRecipeForm(false)
  }

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe)
  }

  const handleCloseRecipe = () => {
    setSelectedRecipe(null)
  }

  const handleRemoveRecipe = async (recipeId) => {
    const { error } = await removeRecipe(user.id, recipeId)
    if (!error) {
      const updated = recipes.filter(recipe => recipe.id !== recipeId)
      recipesCache.current = updated
      setRecipes(updated)
    }
  }

  // Filter stats by type
  const getFilteredStats = () => {
    return stats.filter(stat => stat.item_type === selectedType)
  }

  // Filter favorites by type
  const getFilteredFavorites = () => {
    return favorites.filter(fav => fav.item_type === selectedType)
  }

  // Filter recipes by type
  const getFilteredRecipes = () => {
    return recipes.filter(recipe => recipe.type === selectedType)
  }

  if (showLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">{t('myFavorite.title')}</h1>
          <p className="page-subtitle">{t('myFavorite.subtitle')}</p>
        </div>
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('myFavorite.title')}</h1>
        <p className="page-subtitle">{t('myFavorite.subtitle')}</p>
      </div>
      
      {/* Main Tabs */}
      <div className="category-tabs-container">
        <div className="category-tabs-row">
          <button
            className={`category-tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <span className="category-tab-emoji">❤️</span>
            <span className="category-tab-name">{t('myFavorite.favorites')}</span>
          </button>
          <button
            className={`category-tab ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            <span className="category-tab-emoji">📝</span>
            <span className="category-tab-name">{t('myFavorite.myRecipes')}</span>
          </button>
        </div>
      </div>

      {/* Type Filter */}
      <div className="category-tabs-container">
        <div className="category-tabs-row">
          <button
            className={`category-tab ${selectedType === 'dish' ? 'active' : ''}`}
            onClick={() => setSelectedType('dish')}
          >
            <span className="category-tab-emoji">🍽️</span>
            <span className="category-tab-name">{t('myFavorite.dishes')}</span>
          </button>
          <button
            className={`category-tab ${selectedType === 'drink' ? 'active' : ''}`}
            onClick={() => setSelectedType('drink')}
          >
            <span className="category-tab-emoji">🥤</span>
            <span className="category-tab-name">{t('myFavorite.drinks')}</span>
          </button>
          <button
            className={`category-tab ${selectedType === 'sauce' ? 'active' : ''}`}
            onClick={() => setSelectedType('sauce')}
          >
            <span className="category-tab-emoji">🧂</span>
            <span className="category-tab-name">{t('myFavorite.sauces')}</span>
          </button>
          {activeTab === 'recipes' && (
            <button
              className="category-tab add-recipe-tab"
              onClick={() => setShowRecipeForm(true)}
            >
              <span className="category-tab-emoji">➕</span>
              <span className="category-tab-name">{t('myFavorite.addRecipe')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'favorites' && (
        <div className="favorites-section">
          {getFilteredFavorites().length === 0 ? (
            <div className="empty-state">
              <p>{t('myFavorite.noFavoritesYet')}</p>
            </div>
          ) : (
            <div className="ingredient-grid-compact">
              {getFilteredFavorites().map((favorite) => (
                <div key={`${favorite.item_id}-${favorite.item_type}`} className="ingredient-item-compact favorite-item">
                  <span className="ingredient-name-compact">
                    {favorite.item_emoji} {favorite.item_name}
                  </span>
                  <button
                    className="remove-btn-inline"
                    onClick={() => handleRemoveFavorite(favorite.item_id, favorite.item_type)}
                    title={t('myFavorite.removeFromFavorites')}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {activeTab === 'recipes' && (
        <div className="recipes-section">
          {getFilteredRecipes().length === 0 ? (
            <div className="empty-state">
              <p>{t('myFavorite.noRecipesYet')}</p>
            </div>
          ) : (
            <div className="recipe-list">
              {getFilteredRecipes().map((recipe) => (
                <div key={recipe.id} className="recipe-list-item">
                  <div className="recipe-list-content" onClick={() => handleViewRecipe(recipe)}>
                    <span className="recipe-title">{recipe.name}</span>
                    {recipe.source_website && (
                      <span className="recipe-source-badge">{recipe.source_website.replace('.se', '')}</span>
                    )}
                  </div>
                  <div className="recipe-list-actions">
                    <button
                      className="recipe-view-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewRecipe(recipe)
                      }}
                      title={t('myFavorite.viewRecipeDetails')}
                    >
                      📖
                    </button>
                    <button
                      className="recipe-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveRecipe(recipe.id)
                      }}
                      title={t('myFavorite.removeRecipe')}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recipe Form Modal */}
      {showRecipeForm && (
        <RecipeForm
          onSuccess={handleRecipeSuccess}
          onClose={() => setShowRecipeForm(false)}
        />
      )}

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          onClose={handleCloseRecipe}
        />
      )}
    </div>
  )
}

export default MyFavorite