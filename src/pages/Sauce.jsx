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
      // Get ALL sauces from all countries for die roll (like Drink page)
      let allSauces = []
      Object.values(saucesByCountry).forEach(country => {
        allSauces = [...allSauces, ...country.sauces]
      })
      
      if (allSauces.length === 0) {
        setIsRolling(false)
        return
      }
      
      const randomSauce = allSauces[Math.floor(Math.random() * allSauces.length)]
      
      // Clear use case filter to make sure the selected sauce is visible (like Drink page switches category)
      if (selectedUseCase !== null) {
        setSelectedUseCase(null)
      }
      
      setRollResult(randomSauce)
      
      // Wait for rendering with debugging
      setTimeout(() => {
        const selectedSauceElement = document.querySelector(`[data-sauce-id="${randomSauce.id}"]`)
        console.log('=== SAUCE DIE DEBUG ===')
        console.log('Looking for sauce ID:', randomSauce.id)
        console.log('Found element:', selectedSauceElement)
        
        if (selectedSauceElement) {
          const rect = selectedSauceElement.getBoundingClientRect()
          const containerRect = document.querySelector('.die-container').getBoundingClientRect()
          
          console.log('Sauce element rect:', rect)
          console.log('Die container rect:', containerRect)
          
          // Calculate position to center die on the sauce element
          // The issue is that we need to account for the die container's current position
          const sauceCenterX = rect.left + (rect.width / 2)
          const sauceCenterY = rect.top + (rect.height / 2)
          const containerCenterX = containerRect.left + (containerRect.width / 2)
          const containerCenterY = containerRect.top + (containerRect.height / 2)
          
          const x = sauceCenterX - containerCenterX
          const y = sauceCenterY - containerCenterY
          
          console.log('Sauce center:', { x: sauceCenterX, y: sauceCenterY })
          console.log('Container center:', { x: containerCenterX, y: containerCenterY })
          console.log('Calculated position:', { x, y })
          
          // Move die to selected sauce
          setDiePosition({ x, y, isMoving: true })
          
          // Highlight the selected sauce
          setHighlightedSauce(randomSauce.id)
          
          // Auto-scroll to bring selection into view
          setTimeout(() => {
            selectedSauceElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'center'
            })
          }, 300)
        } else {
          console.log('Could not find sauce element!')
          // Debug: show all sauce elements
          const allSauceElements = document.querySelectorAll('[data-sauce-id]')
          console.log('All sauce elements:', Array.from(allSauceElements).map(el => ({
            id: el.getAttribute('data-sauce-id'),
            name: el.textContent?.trim()
          })))
        }
      }, 200)
      
      setIsRolling(false)
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


  // Reset die state when filters change (but not during die roll)
  useEffect(() => {
    if (!isRolling) {
      resetDieState()
    }
  }, [selectedUseCase, showHomemadeOnly, tastePreferences, isRolling])

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

      {/* Recipe Modal */}
      {selectedSauce && selectedSauce.recipe && (
        <div className="recipe-modal-overlay" onClick={() => setSelectedSauce(null)}>
          <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedSauce(null)}>×</button>
            
            <div className="recipe-header">
              <h2>{selectedSauce.name}</h2>
              <p className="recipe-description">{selectedSauce.description}</p>
              <div className="recipe-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', flex: '1' }}>
                  <span>⏱️ Prep: {selectedSauce.recipe.prepTime}</span>
                  <span>🍳 Cook: {selectedSauce.recipe.cookTime}</span>
                  <span>📊 Yield: {selectedSauce.recipe.yield}</span>
                </div>
                <button 
                  className="btn btn-shopping btn-small"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowShoppingList(true)
                  }}
                  style={{ flexShrink: 0 }}
                >
                  🛒 {t('button.createShoppingList')}
                </button>
              </div>
            </div>

            <div className="recipe-content">
              <div className="recipe-section">
                <h3>{t('sauce.recipe.ingredients')}</h3>
                <ul className="recipe-ingredients">
                  {selectedSauce.recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="recipe-section">
                <h3>{t('sauce.recipe.instructions')}</h3>
                <ol className="recipe-instructions">
                  {selectedSauce.recipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
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