import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { getAllStats, getRecipes, removeRecipe } from '../lib/supabase'
import RecipeForm from '../components/RecipeForm'
import RecipeDetails from '../components/RecipeDetails'
import i18n from '../i18n'

// Helper function to get the correct emoji based on the recipe's actual category
const getCategoryEmoji = (stat) => {
  // For statistics, we need to determine the category based on the item name
  // Since we don't have the full recipe data, we'll use a simplified approach
  const itemName = stat.item_name?.toLowerCase() || ''
  
  // Simple pattern matching for common dish types
  if (itemName.includes('chicken') || itemName.includes('pork') || itemName.includes('beef') || 
      itemName.includes('lamb') || itemName.includes('duck') || itemName.includes('turkey') ||
      itemName.includes('steak') || itemName.includes('chop') || itemName.includes('rib')) {
    return '🥩' // Meat
  }
  
  if (itemName.includes('fish') || itemName.includes('salmon') || itemName.includes('tuna') || 
      itemName.includes('shrimp') || itemName.includes('crab') || itemName.includes('lobster') ||
      itemName.includes('clam') || itemName.includes('mussel') || itemName.includes('oyster')) {
    return '🦞' // Seafood
  }
  
  if (itemName.includes('rice') || itemName.includes('noodle') || itemName.includes('pasta') || 
      itemName.includes('bread') || itemName.includes('flour') || itemName.includes('wheat')) {
    return '🍚' // Grains
  }
  
  if (itemName.includes('egg')) {
    return '🥚' // Egg
  }
  
  // Default to vegetables for most other dishes
  return '🥬' // Vegetables
}

function MyFavorite() {
  const { t } = useTranslation()
  const { user } = useAuth()
  
  // Use refs to persist data across unmounts
  const statsCache = useRef([])
  const recipesCache = useRef([])
  const hasLoadedData = useRef(false)
  
  // Initialize state from cache
  const [stats, setStats] = useState(statsCache.current)
  const [recipes, setRecipes] = useState(recipesCache.current)
  const [loading, setLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('statistics') // 'recipes' or 'statistics'
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
      recipesCache.current = []
      setStats([])
      setRecipes([])
    }
  }, [user?.id])

  // Clear state when language changes to prevent mixing
  useEffect(() => {
    setActiveTab('statistics')
    setSelectedType('dish')
    setShowRecipeForm(false)
    setSelectedRecipe(null)
  }, [i18n.language])

  // Debug statistics data
  useEffect(() => {
    if (stats.length > 0) {
      console.log('📊 All stats:', stats)
      const filtered = stats.filter(stat => stat.item_type === selectedType)
      console.log('📊 Filtered stats for', selectedType, ':', filtered)
    }
  }, [stats, selectedType])

  const loadData = async () => {
    if (!user) {
      return
    }
    
    // Only show loading if we don't have cached data (true initial load)
    const isInitialLoad = statsCache.current.length === 0 && favoritesCache.current.length === 0 && recipesCache.current.length === 0
    
    if (isInitialLoad) {
      setLoading(true)
      
      // Only show loading indicator if fetch takes longer than 500ms
      const loadingTimeout = setTimeout(() => {
        setShowLoading(true)
      }, 500)
      
      // Load stats and recipes in parallel
      const [statsResult, recipesResult] = await Promise.all([
        getAllStats(user.id),
        getRecipes(user.id)
      ])

      if (statsResult.data) {
        console.log('📊 Statistics loaded:', statsResult.data)
        statsCache.current = statsResult.data
        setStats(statsResult.data)
      } else {
        console.log('📊 No statistics data found:', statsResult)
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
            className={`category-tab ${activeTab === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            <span className="category-tab-emoji">📊</span>
            <span className="category-tab-name">{t('myFavorite.viewStatistics')}</span>
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
      <div className="category-tabs-container type-filter-separator">
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
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'recipes' && (
        <div className="recipes-section">
          <div className="add-recipe-container">
            <button
              className="add-recipe-btn"
              onClick={() => setShowRecipeForm(true)}
            >
              <span className="add-recipe-emoji">➕</span>
              <span className="add-recipe-text">{t('myFavorite.addRecipe')}</span>
            </button>
          </div>
          {getFilteredRecipes().length === 0 ? (
            <div className="empty-state">
              <p>{t('myFavorite.noRecipesYet')}</p>
            </div>
          ) : (
            <div className="recipe-list">
              {getFilteredRecipes().map((recipe) => (
                <div key={recipe.id} className="recipe-list-item">
                  <div className="recipe-list-content" onClick={() => handleViewRecipe(recipe)}>
                    <span className="recipe-title">
                      {recipe.name?.startsWith('dish.') 
                        ? t(`dishes.${recipe.name.replace('dish.', '')}`) 
                        : recipe.name}
                    </span>
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

      {/* Statistics Section */}
      {activeTab === 'statistics' && (
        <div className="statistics-section">
          {getFilteredStats().length === 0 ? (
            <div className="empty-state">
              <p>{t('myFavorite.noStatisticsYet')}</p>
            </div>
          ) : (
            <div className="statistics-content">
              <div className="statistics-summary">
                <h3>{t('myFavorite.yourTopChoices')}</h3>
                <p>{t('myFavorite.statisticsDescription')}</p>
              </div>
              
              <div className="statistics-list">
                {getFilteredStats().map((stat, index) => (
                  <div key={`${stat.item_id}-${stat.item_type}`} className="statistics-item">
                    <div className="statistics-rank">
                      <span className="rank-number">#{index + 1}</span>
                    </div>
                    <div className="statistics-info">
                      <div className="statistics-name">
                        <span className="statistics-emoji">
                          {stat.item_type === 'dish' ? getCategoryEmoji(stat) : 
                           stat.item_type === 'drink' ? '🥤' : 
                           stat.item_type === 'sauce' ? '🧂' : 
                           stat.item_emoji}
                        </span>
                        <span className="statistics-title">
                          {stat.item_name?.startsWith('dish.') 
                            ? t(`dishes.${stat.item_name.replace('dish.', '')}`) 
                            : stat.item_name?.startsWith('drink.') 
                            ? t(`drinks.${stat.item_name.replace('drink.', '')}`) 
                            : stat.item_name?.startsWith('sauce.') 
                            ? t(`sauces.${stat.item_name.replace('sauce.', '')}`) 
                            : stat.item_name}
                        </span>
                      </div>
                    </div>
                    <div className="statistics-count">
                      <span className="count-label">{t('myFavorite.timesSelected')}:</span>
                      <span className="count-number">{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="statistics-total">
                <p>
                  {t('myFavorite.totalSelections')}: <strong>{getFilteredStats().reduce((sum, stat) => sum + stat.count, 0)}</strong>
                </p>
              </div>
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