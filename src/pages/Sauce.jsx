import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { trackSelection } from '../lib/supabase'
import ShoppingList from '../components/ShoppingList'
import i18n from '../i18n'

function Sauce() {
  const { t } = useTranslation()
  const { user } = useAuth()

  // Get translated sauce data
  const getSauces = () => {
    const currentLanguage = i18n.language || 'en'
    const sauceData = i18n.getResourceBundle(currentLanguage, 'sauces')
    return sauceData || { sauceUseCases: {}, saucesByCountry: {} }
  }

  const sauces = getSauces()
  const sauceUseCases = sauces.sauceUseCases || {}
  const saucesByCountry = sauces.saucesByCountry || {}

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  const [selectedUseCase, setSelectedUseCase] = useState(null)
  const [showHomemadeOnly, setShowHomemadeOnly] = useState(true)
  const [selectedSauce, setSelectedSauce] = useState(null)
  const [tastePreferences, setTastePreferences] = useState({
    spicy: 3,
    sweet: 2,
    salty: 3,
    sour: 2
  })
  
  // Die-related state
  const [isRolling, setIsRolling] = useState(false)
  const [rollResult, setRollResult] = useState(null)
  const [diePosition, setDiePosition] = useState({ x: 0, y: 0, isMoving: false })
  const [highlightedSauce, setHighlightedSauce] = useState(null)
  
  // Shopping list state
  const [showShoppingList, setShowShoppingList] = useState(false)

  const toggleFavorite = (sauceId) => {
    const newFavorites = favorites.includes(sauceId)
      ? favorites.filter(id => id !== sauceId)
      : [...favorites, sauceId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  // Helper function to get translated use case name
  const getTranslatedUseCaseName = (useCase) => {
    const useCaseMap = {
      'BBQ & Grilling': 'sauceUseCaseBBQGrilling',
      'Meat Dishes': 'sauceUseCaseMeatDishes',
      'Seafood': 'sauceUseCaseSeafood',
      'Vegetables': 'sauceUseCaseVegetables',
      'Pasta & Noodles': 'sauceUseCasePastaNoodles',
      'Rice & Grains': 'sauceUseCaseRiceGrains',
      'Dipping & Dressing': 'sauceUseCaseDippingDressing',
      'Marinades': 'sauceUseCaseMarinades'
    }
    const key = useCaseMap[useCase] || useCase
    return t(key)
  }

  // Helper function to get translated taste label
  const getTranslatedTasteLabel = (taste) => {
    const tasteMap = {
      'spicy': 'sauceTasteSpicy',
      'sweet': 'sauceTasteSweet',
      'salty': 'sauceTasteSalty',
      'sour': 'sauceTasteSour'
    }
    const key = tasteMap[taste] || taste
    return t(key)
  }

  // Helper function to get translated country name
  const getTranslatedCountryName = (country) => {
    const countryMap = {
      'Asian': 'sauceCountryAsian',
      'American': 'sauceCountryAmerican',
      'European': 'sauceCountryEuropean',
      'Mexican': 'sauceCountryMexican'
    }
    const key = countryMap[country] || country
    return t(key)
  }

  const handleTasteChange = (taste, value) => {
    setTastePreferences(prev => ({
      ...prev,
      [taste]: parseInt(value)
    }))
  }

  const toggleUseCase = (useCase) => {
    setSelectedUseCase(prev => prev === useCase ? null : useCase)
  }

  const getFilteredSauces = () => {
    let allSauces = []
    
    // Get all sauces from all countries
    Object.values(saucesByCountry).forEach(country => {
      allSauces = [...allSauces, ...country.sauces]
    })

    // Filter by use case, availability preference, and taste preferences
    return allSauces.filter(sauce => {
      // Filter by use case - show all if none selected, or match if one is selected
      const useCaseMatch = selectedUseCase === null || 
        (sauce.useCases && sauce.useCases.includes(selectedUseCase))
      
      // Filter by availability preference (homemade or buy)
      const availabilityMatch = showHomemadeOnly 
        ? sauce.availability && sauce.availability.includes('homemade')
        : sauce.availability && sauce.availability.includes('buy')
      
      // Filter by taste preferences
      const tasteMatch = (
        Math.abs(sauce.spicy - tastePreferences.spicy) <= 2 &&
        Math.abs(sauce.sweet - tastePreferences.sweet) <= 2 &&
        Math.abs(sauce.salty - tastePreferences.salty) <= 2 &&
        Math.abs(sauce.sour - tastePreferences.sour) <= 2
      )
      
      return useCaseMatch && availabilityMatch && tasteMatch
    })
  }

  const filteredSauces = getFilteredSauces()

  // Die functionality
  const resetDieState = () => {
    setDiePosition({ x: 0, y: 0, isMoving: false })
    setHighlightedSauce(null)
  }


  const handleDieHover = () => {
    // Only reset if die has moved to a selection
    if (diePosition.isMoving || highlightedSauce) {
      resetDieState()
    }
  }

  const handleDieRoll = () => {
    if (isRolling) return
    
    setIsRolling(true)
    setRollResult(null)
    setHighlightedSauce(null)
    setDiePosition({ x: 0, y: 0, isMoving: false })
    
    // Roll animation duration
    setTimeout(() => {
      // Use only filtered (visible) sauces for die roll
      if (filteredSauces.length === 0) {
        setIsRolling(false)
        return
      }
      
      const randomSauce = filteredSauces[Math.floor(Math.random() * filteredSauces.length)]
      
      setRollResult(randomSauce)
      
      // Wait for rendering
      setTimeout(() => {
        const selectedSauceElement = document.querySelector(`[data-sauce-id="${randomSauce.id}"]`)
        if (selectedSauceElement) {
          // First scroll to bring sauce into view (like Drink page category switching)
          selectedSauceElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          })
          
          // Highlight the selected sauce
          setHighlightedSauce(randomSauce.id)
          
          // Wait for scroll to complete, then position die
          setTimeout(() => {
            const rect = selectedSauceElement.getBoundingClientRect()
            const containerRect = document.querySelector('.die-container').getBoundingClientRect()
            
            // Calculate relative position (now sauce is in view)
            const x = rect.left + (rect.width / 2) - (containerRect.left + containerRect.width / 2)
            const y = rect.top + (rect.height / 2) - (containerRect.top + containerRect.height / 2)
            
            // Move die to selected sauce
            setDiePosition({ x, y, isMoving: true })
          }, 300) // Faster - wait less for scroll animation
        }
        
        // IMPORTANT: Set isRolling to false AFTER positioning (not before)
        setIsRolling(false)
      }, 100) // Small delay to ensure DOM is updated
    }, 1500) // 1.5 second rolling animation
  }

  // Clear state when language changes to prevent mixing
  useEffect(() => {
    setSelectedUseCase(null)
    setSelectedSauce(null)
    setShowShoppingList(false)
    setIsRolling(false)
    setRollResult(null)
    setDiePosition({ x: 0, y: 0, isMoving: false })
    setHighlightedSauce(null)
  }, [i18n.language])

  // Debug: Log when die position changes


  // Reset die state when filters change (exact same as Drink page)
  useEffect(() => {
    resetDieState()
  }, [selectedUseCase, showHomemadeOnly, tastePreferences])

  const getTasteColor = (taste) => {
    const colors = {
      spicy: '#ff4757',
      sweet: '#ffa502',
      salty: '#3742fa',
      sour: '#2ed573'
    }
    return colors[taste]
  }

  const getTasteEmoji = (taste) => {
    const emojis = {
      spicy: '🌶️',
      sweet: '🍯',
      salty: '🧂',
      sour: '🍋'
    }
    return emojis[taste]
  }

  return (
    <div className="page-container">
      {/* Animated Die Button */}
      <div 
        className={`die-container sauce-page-die ${diePosition.isMoving ? 'moving' : ''}`}
        style={{
          transform: diePosition.isMoving ? `translate(${diePosition.x}px, ${diePosition.y}px)` : 'none'
        }}
      >
        <button 
          className={`die-button ${isRolling ? 'rolling' : ''}`}
          onClick={handleDieRoll}
          onMouseEnter={handleDieHover}
          disabled={isRolling}
          title={diePosition.isMoving || highlightedSauce ? "Hover to reset die position" : "Roll for a random sauce!"}
        >
          <span className="die-icon">🎲</span>
        </button>
        
        {/* Lucky Pick Label */}
        <div className="die-label">
          {isRolling ? 'Rolling...' : highlightedSauce ? t('sauce.hoverToReset') : t('sauce.luckyPick')}
        </div>
      </div>
      <div className="page-header">
        <h1 className="page-title">🍯 {t('sauce.title')}</h1>
        <p className="page-subtitle">{t('sauce.subtitle')}</p>
      </div>

      {/* Filters Row - Where to Use and Taste Preferences */}
      <div className="filters-row">
        {/* Where to Use Filter */}
        <div className="use-case-filter">
          <h3 className="filter-title">{t('sauce.whereToUse')}</h3>
          <div className="use-case-buttons">
            {Object.entries(sauceUseCases).map(([useCase, data]) => (
              <button
                key={useCase}
                className={`use-case-btn ${selectedUseCase === useCase ? 'active' : ''}`}
                onClick={() => toggleUseCase(useCase)}
                title={data.description}
              >
                {data.emoji} {getTranslatedUseCaseName(useCase)}
              </button>
            ))}
          </div>
        </div>

        {/* Taste Preferences */}
        <div className="taste-preferences">
          <h3 className="preferences-title">{t('sauce.tastePreferences')}</h3>
          <div className="preference-sliders">
            {Object.entries(tastePreferences).map(([taste, value]) => (
              <div key={taste} className="preference-row">
                <div className="preference-label">
                  <span className="preference-emoji">{getTasteEmoji(taste)}</span>
                  <span className="preference-name">{getTranslatedTasteLabel(taste)}</span>
                </div>
                <div className="slider-container">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={value}
                    onChange={(e) => handleTasteChange(taste, e.target.value)}
                    className={`taste-slider ${taste}-slider`}
                    style={{
                      '--slider-color': getTasteColor(taste)
                    }}
                  />
            </div>
                <div 
                  className="preference-value"
                  style={{ color: getTasteColor(taste) }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Recipe Type Filter */}
      <div className="recipe-type-buttons-only">
        <button
          className={`recipe-type-btn ${showHomemadeOnly ? 'active' : ''}`}
          onClick={() => setShowHomemadeOnly(true)}
          title="Show only homemade sauces with recipes"
        >
          🏠 {t('sauce.homemade')}
        </button>
        <button
          className={`recipe-type-btn ${!showHomemadeOnly ? 'active' : ''}`}
          onClick={() => setShowHomemadeOnly(false)}
          title="Show all sauces (homemade and store-bought)"
        >
          🛒 {t('sauce.buy')}
                </button>
      </div>

      {/* Sauces by Country - Ingredient-style Layout */}
      <div className="sauce-categories">
        {Object.entries(saucesByCountry).map(([country, countryData]) => {
          // Get sauces for this country that are in the filtered list
          const countrySauces = countryData.sauces.filter(sauce => 
            filteredSauces.some(filtered => filtered.id === sauce.id)
          )

          if (countrySauces.length === 0) return null

          return (
            <div key={country} className="category-section">
              <h3 className="category-title">
                {countryData.flag} {getTranslatedCountryName(country)}
              </h3>
              <div className="ingredient-grid-compact">
                {countrySauces.map(sauce => (
                  <div
                    key={sauce.id}
                    data-sauce-id={sauce.id}
                    className={`ingredient-item-compact sauce-item ${sauce.recipe ? 'has-recipe' : ''} ${highlightedSauce === sauce.id ? 'highlighted' : ''}`}
                    title={sauce.recipe ? 'Click to view recipe' : sauce.description}
                    onClick={async () => {
                      if (sauce.recipe) {
                        setSelectedSauce(sauce)
                        // Track sauce selection
                        if (user) {
                          await trackSelection(user.id, sauce, 'sauce')
                        }
                        
                        // Scroll to recipe display after a short delay to ensure it's rendered
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
                    }}
                  >
                    <span className="ingredient-name-compact">{sauce.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {filteredSauces.length === 0 && (
        <div className="no-results">
          <p>{t('sauce.noSaucesFound')}</p>
        </div>
      )}

      {/* Selected Recipe Display - Using Random Recipe Format */}
      {selectedSauce && selectedSauce.recipe && (
        <div className="recipe-display">
          <div className="recipe-card">
            <div className="recipe-card-header">
              <div className="recipe-header-actions">
                {/* Shopping List Button - Left Aligned */}
                <button 
                  className="btn btn-shopping btn-medium"
                  onClick={() => setShowShoppingList(true)}
                >
                  🛒 {t('button.createShoppingList')}
                </button>
                
                {/* Close Button - Right Aligned */}
                <button 
                  className="close-recipe-btn"
                  onClick={() => setSelectedSauce(null)}
                  title="Close recipe"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="recipe-content">
              {/* Recipe Title */}
              <h2 className="recipe-title" style={{ textAlign: 'center', fontSize: '2rem', marginTop: '0.5rem' }}>
                {selectedSauce.name}
              </h2>
              
              {/* Recipe Description */}
              {selectedSauce.description && (
                <p className="recipe-description" style={{ textAlign: 'center' }}>
                  {selectedSauce.description}
                </p>
              )}

              <div className="recipe-meta">
                <span className="recipe-info">🔪 {t('recipe.prepTime')}: {selectedSauce.recipe.prepTime}</span>
                <span className="recipe-info">⏱️ {t('recipe.cookTime')}: {selectedSauce.recipe.cookTime}</span>
                <span className="recipe-info">📊 {t('recipe.servings')}: {selectedSauce.recipe.yield}</span>
              </div>

              <div className="recipe-ingredients">
                <h4>{t('sauce.recipe.ingredients')}</h4>
                <ul>
                  {selectedSauce.recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              {selectedSauce.recipe.instructions && (
                <div className="recipe-instructions">
                  <h4>{t('sauce.recipe.instructions')}</h4>
                  <ul className="recipe-instructions-list">
                    {selectedSauce.recipe.instructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingList && selectedSauce && selectedSauce.recipe && (
        <ShoppingList
          recipe={{
            name: selectedSauce.name,
            emoji: '🍯',
            description: selectedSauce.description || '',
            ingredientsWithAmounts: selectedSauce.recipe.ingredients,
            instructions: selectedSauce.recipe.instructions,
            cookTime: selectedSauce.recipe.cookTime || 'N/A',
            servings: selectedSauce.recipe.yield || 'N/A',
            difficulty: 'Medium'
          }}
          onClose={() => setShowShoppingList(false)}
        />
      )}
    </div>
  )
}

export default Sauce