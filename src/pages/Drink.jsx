import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { trackSelection } from '../lib/supabase'
import ShoppingList from '../components/ShoppingList'
import i18n from '../i18n'

// Force production redeploy - Drinks page die positioning fix

function Drink() {
  const { t } = useTranslation()
  const { user } = useAuth()

  // Get translated drink data
  const getDrinks = () => {
    const currentLanguage = i18n.language || 'en'
    const drinkData = i18n.getResourceBundle(currentLanguage, 'drinks')
    return drinkData || { popularDrinks: [], drinksByCategory: {} }
  }

  const drinks = getDrinks()
  const popularDrinks = drinks.popularDrinks || []
  const drinksByCategory = drinks.drinksByCategory || {}

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  // Get the first available category dynamically
  const getFirstCategory = () => {
    const categories = Object.keys(drinksByCategory)
    return categories.length > 0 ? categories[0] : null
  }

  const [selectedCategory, setSelectedCategory] = useState(getFirstCategory())
  const [selectedDrink, setSelectedDrink] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [centerCardIndex, setCenterCardIndex] = useState(0)
  
  // Die-related state
  const [isRolling, setIsRolling] = useState(false)
  const [rollResult, setRollResult] = useState(null)
  const [diePosition, setDiePosition] = useState({ x: 0, y: 0, isMoving: false })
  const [highlightedDrink, setHighlightedDrink] = useState(null)
  
  // Shopping list state
  const [showShoppingList, setShowShoppingList] = useState(false)

  const toggleFavorite = (drinkId) => {
    const newFavorites = favorites.includes(drinkId)
      ? favorites.filter(id => id !== drinkId)
      : [...favorites, drinkId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const toggleCategory = (category) => {
    setSelectedCategory(prev => prev === category ? null : category)
  }

  const getTranslatedDrinkName = (drinkName) => {
    const drinkMap = {
      'Fresh Orange Juice': 'freshOrangeJuice',
      'Lemonade': 'lemonade',
      'Tropical Sunrise': 'tropicalSunrise',
      'Apple Ginger Refresher': 'appleGingerRefresher',
      'Pineapple Mint Cooler': 'pineappleMintCooler',
      'Green Detox Juice': 'greenDetoxJuice',
      'Carrot Orange Zinger': 'carrotOrangeZinger',
      'Berry Antioxidant Mix': 'berryAntioxidantMix',
      'Green Smoothie': 'greenSmoothie',
      'Strawberry Banana Smoothie': 'strawberryBananaSmoothie',
      'Mango Lassi': 'mangoLassi',
      'Peanut Butter Protein Shake': 'peanutButterProteinShake',
      'Acai Berry Bowl': 'acaiBerryBowl',
      'Matcha Latte': 'matchaLatte',
      'Iced Coffee': 'icedCoffee',
      'Espresso': 'espresso',
      'Cappuccino': 'cappuccino',
      'Latte': 'latte',
      'Americano': 'americano',
      'Bubble Tea': 'bubbleTea',
      'Chai Latte': 'chaiLatte',
      'Hot Chocolate': 'hotChocolate',
      'Mojito': 'mojito',
      'Margarita': 'margarita',
      'Pina Colada': 'pinaColada',
      'Old Fashioned': 'oldFashioned',
      'Cosmopolitan': 'cosmopolitan',
      'Espresso Martini': 'espressoMartini'
    }
    const key = drinkMap[drinkName] || drinkName.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')
    const translated = t(`drinks.drinks.${key}`)
    return translated !== `drinks.drinks.${key}` ? translated : drinkName
  }

  const getTranslatedCategoryName = (category) => {
    const translated = t(`drinks.categories.${category.toLowerCase().replace(/\s+/g, '')}`)
    return translated !== `drinks.categories.${category.toLowerCase().replace(/\s+/g, '')}` ? translated : category
  }

  // Calculate which card is in the center based on scroll position
  const calculateCenterCard = () => {
    if (popularDrinks.length === 0) return 0
    
    const carouselContainer = document.querySelector('.carousel-container')
    if (!carouselContainer) return 0
    
    const containerRect = carouselContainer.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2
    
    let closestIndex = 0
    let minDistance = Infinity
    
    popularDrinks.forEach((drink, index) => {
      const cardElement = document.querySelector(`[data-drink-index="${index}"]`)
      if (cardElement) {
        const cardRect = cardElement.getBoundingClientRect()
        const cardCenter = cardRect.left + cardRect.width / 2
        const distance = Math.abs(cardCenter - containerCenter)
        
        if (distance < minDistance) {
          minDistance = distance
          closestIndex = index
        }
      }
    })
    
    return closestIndex
  }

  // Update center card on scroll
  useEffect(() => {
    const handleScroll = () => {
      const newCenterIndex = calculateCenterCard()
      if (newCenterIndex !== centerCardIndex) {
        setCenterCardIndex(newCenterIndex)
      }
    }

    const carouselContainer = document.querySelector('.carousel-container')
    if (carouselContainer) {
      carouselContainer.addEventListener('scroll', handleScroll)
      // Also check on animation frame for smooth updates
      const checkCenter = () => {
        handleScroll()
        requestAnimationFrame(checkCenter)
      }
      checkCenter()
      
      return () => {
        carouselContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [popularDrinks, centerCardIndex])

  const getFilteredDrinks = () => {
    let drinksToFilter = []
    
    if (selectedCategory === null) {
      // Show all drinks when no category is selected
      Object.values(drinksByCategory).forEach(category => {
        drinksToFilter = [...drinksToFilter, ...category.drinks]
      })
    } else {
      // Show only drinks from the selected category
      if (drinksByCategory[selectedCategory]) {
        drinksToFilter = drinksByCategory[selectedCategory].drinks
      }
    }

    // Filter by search term
    return drinksToFilter.filter(drink => {
      const searchMatch = searchTerm === '' || 
        drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drink.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      return searchMatch
    })
  }

  const filteredDrinks = getFilteredDrinks()

  // Die functionality
  const resetDieState = () => {
    setDiePosition({ x: 0, y: 0, isMoving: false })
    setHighlightedDrink(null)
  }

  const handleDieHover = () => {
    // Only reset if die has moved to a selection
    if (diePosition.isMoving || highlightedDrink) {
      resetDieState()
    }
  }

  // Move die to selected drink
  const moveDieToDrink = (drink) => {
    if (!drink) return
    
    setRollResult(drink)
    setHighlightedDrink(drink.id)
    // Don't set selectedDrink - die should only highlight, not open recipe
    
    // Wait for rendering
    setTimeout(() => {
      const selectedDrinkElement = document.querySelector(`[data-drink-id="${drink.id}"]`)
      if (selectedDrinkElement) {
        const rect = selectedDrinkElement.getBoundingClientRect()
        const containerRect = document.querySelector('.die-container').getBoundingClientRect()
        
        // Calculate relative position
        const x = rect.left + (rect.width / 2) - (containerRect.left + containerRect.width / 2)
        const y = rect.top + (rect.height / 2) - (containerRect.top + containerRect.height / 2)
        
        // Move die to selected drink
        setDiePosition({ x, y, isMoving: true })
        
        // Auto-scroll to bring selection into view
        setTimeout(() => {
          selectedDrinkElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          })
        }, 300)
      }
    }, 100)
  }

  const handleDieRoll = () => {
    if (isRolling) return
    
    setIsRolling(true)
    setRollResult(null)
    setHighlightedDrink(null)
    setDiePosition({ x: 0, y: 0, isMoving: false })
    
    // Roll animation duration
    setTimeout(() => {
      // Get ALL drinks from all categories for die roll
      let allDrinks = []
      Object.values(drinksByCategory).forEach(category => {
        allDrinks = [...allDrinks, ...category.drinks]
      })
      
      if (allDrinks.length === 0) {
        setIsRolling(false)
        return
      }
      
      const randomDrink = allDrinks[Math.floor(Math.random() * allDrinks.length)]
      
      // Find which category this drink belongs to and switch to it
      let drinkCategory = null
      Object.entries(drinksByCategory).forEach(([category, categoryData]) => {
        if (categoryData.drinks.some(drink => drink.id === randomDrink.id)) {
          drinkCategory = category
        }
      })
      
      // Switch to the drink's category if it's different from current
      if (drinkCategory && drinkCategory !== selectedCategory) {
        setSelectedCategory(drinkCategory)
      }
      
      setRollResult(randomDrink)
      
      // Wait for rendering
      setTimeout(() => {
        const selectedDrinkElement = document.querySelector(`[data-drink-id="${randomDrink.id}"]`)
        if (selectedDrinkElement) {
          const rect = selectedDrinkElement.getBoundingClientRect()
          const containerRect = document.querySelector('.die-container').getBoundingClientRect()
          
          // Calculate relative position
          const x = rect.left + (rect.width / 2) - (containerRect.left + containerRect.width / 2)
          const y = rect.top + (rect.height / 2) - (containerRect.top + containerRect.height / 2)
          
          // Move die to selected drink
          setDiePosition({ x, y, isMoving: true })
          
          // Highlight the selected drink
          setHighlightedDrink(randomDrink.id)
          
          // Auto-scroll to bring selection into view
          setTimeout(() => {
            selectedDrinkElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'center'
            })
          }, 300)
        }
      }, 100) // Small delay to ensure DOM is updated
      
      setIsRolling(false)
    }, 1500) // 1.5 second rolling animation
  }

  // Reset die state when filters change
  useEffect(() => {
    resetDieState()
  }, [selectedCategory, searchTerm])

  // Clear state when language changes to prevent mixing
  useEffect(() => {
    setSelectedCategory(getFirstCategory())
    setSelectedDrink(null)
    setSearchTerm('')
    setCenterCardIndex(0)
    setShowShoppingList(false)
    setIsRolling(false)
    setRollResult(null)
    setDiePosition({ x: 0, y: 0, isMoving: false })
    setHighlightedDrink(null)
  }, [i18n.language])

  // Update selected category when language changes
  useEffect(() => {
    const categories = Object.keys(drinksByCategory)
    const firstCategory = categories.length > 0 ? categories[0] : null
    
    // Check if current selectedCategory exists in the current language
    if (!categories.includes(selectedCategory) && firstCategory) {
      setSelectedCategory(firstCategory)
    }
  }, [i18n.language, drinksByCategory, selectedCategory])

  return (
    <div className="page-container">
      {/* Animated Die Button */}
      <div 
        className={`die-container drink-page-die ${diePosition.isMoving ? 'moving' : ''}`}
        style={{
          transform: diePosition.isMoving ? `translate(${diePosition.x}px, ${diePosition.y}px)` : 'none'
        }}
      >
        <button 
          className={`die-button ${isRolling ? 'rolling' : ''}`}
          onClick={handleDieRoll}
          onMouseEnter={handleDieHover}
          disabled={isRolling}
          title={diePosition.isMoving || highlightedDrink ? "Hover to reset die position" : "Roll for a random drink!"}
        >
          <span className="die-icon">🎲</span>
        </button>
        
        {/* Lucky Pick Label */}
        {!diePosition.isMoving && (
        <div className="die-label">
          {highlightedDrink ? t('drinkHoverToReset') : t('drinkLuckyPick')}
        </div>
        )}
      </div>

      <div className="page-header">
        <h1 className="page-title">🥤 {t('drinkTitle')}</h1>
        <p className="page-subtitle">{t('drinkSubtitle')}</p>
      </div>

      {/* Popular Drinks Carousel */}
      <div className="popular-drinks-section">
        <h2 className="section-title">{t('drinkPopularDrinks')}</h2>
        <div className="carousel-container">
          <div className="carousel-track">
            {popularDrinks.map((drink, index) => {
              // Find the actual drink data
              const actualDrink = Object.values(drinksByCategory)
                .flatMap(cat => cat.drinks)
                .find(d => d.id === drink.drinkId)
              
              if (!actualDrink) return null
              
              return (
                <div
                  key={drink.id}
                  data-drink-index={index}
                  className={`popular-drink-card clickable ${index === centerCardIndex ? 'center' : ''}`}
                  onClick={async () => {
                    if (actualDrink.recipe) {
                      setSelectedDrink(actualDrink) // Show recipe popup
                      // Don't move die on manual selection - only show recipe
                      if (user) {
                        await trackSelection(user.id, actualDrink, 'drink')
                      }
                    }
                  }}
                  title={actualDrink.description}
                >
                  <div className="popular-drink-emoji">{actualDrink.emoji}</div>
                  <div className="popular-drink-info">
                    <div className="popular-drink-name">{getTranslatedDrinkName(actualDrink.name)}</div>
                    <div className="popular-drink-desc">{actualDrink.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Category Filters - Only show when no drink is selected */}
      {!selectedDrink && (
        <div className="category-filters">
          {Object.entries(drinksByCategory).map(([category, data]) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              {data.emoji} {getTranslatedCategoryName(category)}
            </button>
          ))}
        </div>
      )}

      {/* Selected Drink Display */}
      {selectedDrink && (
        <div className="selected-drink-display">
          <div className="selected-drink-header" style={{ marginTop: '-20px', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <button 
                className="back-to-categories-btn"
                onClick={() => setSelectedDrink(null)}
                title="Back to drink categories"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ←
              </button>
              {selectedDrink.recipe && (
                <button 
                  className="btn btn-shopping btn-small"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowShoppingList(true)
                  }}
                >
                  🛒 {t('button.createShoppingList')}
                </button>
              )}
            </div>
            <h2 className="selected-drink-title">
              {selectedDrink.emoji} {getTranslatedDrinkName(selectedDrink.name)}
            </h2>
            <p className="selected-drink-description">{selectedDrink.description}</p>
          </div>
          
          {selectedDrink.recipe && (
            <div className="selected-drink-recipe">
              <div className="recipe-meta">
                <span>⏱️ Prep: {selectedDrink.recipe.prepTime}</span>
                <span>🍳 Cook: {selectedDrink.recipe.cookTime}</span>
                <span>📊 Yield: {selectedDrink.recipe.yield}</span>
              </div>
              
              <div className="recipe-content">
                <div className="recipe-section">
                  <h3>{t('drinkRecipeIngredients')}</h3>
                  <ul className="ingredients-list">
                    {selectedDrink.recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="recipe-section">
                  <h3>{t('drinkRecipeInstructions')}</h3>
                  <ol className="instructions-list">
                    {selectedDrink.recipe.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Drinks Display - Only show when no drink is selected */}
      {!selectedDrink && (
        <div className="drink-categories">
        {selectedCategory === null ? (
          // Show all drinks organized by category when no category is selected
          Object.entries(drinksByCategory).map(([category, categoryData]) => {
            // Get drinks for this category that are in the filtered list
            const categoryDrinks = categoryData.drinks.filter(drink => 
              filteredDrinks.some(filtered => filtered.id === drink.id)
            )

            if (categoryDrinks.length === 0) return null

            return (
              <div key={category} className="category-section">
                <div className="ingredient-grid-compact">
                  {categoryDrinks.map(drink => (
                  <div
                    key={drink.id}
                    data-drink-id={drink.id}
                    className={`ingredient-item-compact drink-item ${drink.recipe ? 'has-recipe' : ''} ${highlightedDrink === drink.id ? 'highlighted' : ''}`}
                    title={drink.recipe ? 'Click to view recipe' : drink.description}
                    onClick={async () => {
                      if (drink.recipe) {
                        setSelectedDrink(drink) // Show recipe popup
                        // Don't move die on manual selection - only show recipe
                        // Track drink selection
                        if (user) {
                          await trackSelection(user.id, drink, 'drink')
                        }
                      }
                    }}
                  >
                    <span className="ingredient-name-compact">{drink.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })
        ) : (
          // Show only drinks from the selected category
          <div className="category-section">
            <div className="ingredient-grid-compact">
              {filteredDrinks.map(drink => (
                <div
                  key={drink.id}
                  data-drink-id={drink.id}
                  className={`ingredient-item-compact drink-item ${drink.recipe ? 'has-recipe' : ''} ${highlightedDrink === drink.id ? 'highlighted' : ''}`}
                  title={drink.recipe ? 'Click to view recipe' : drink.description}
                  onClick={async () => {
                    if (drink.recipe) {
                      setSelectedDrink(drink) // Show recipe popup
                      // Don't move die on manual selection - only show recipe
                      // Track drink selection
                      if (user) {
                        await trackSelection(user.id, drink, 'drink')
                      }
                    }
                  }}
                >
                  <span className="ingredient-name-compact">{getTranslatedDrinkName(drink.name)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {filteredDrinks.length === 0 && (
          <div className="no-results">
            <p>{t('drinkNoDrinksFound')}</p>
          </div>
        )}
      </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingList && selectedDrink && selectedDrink.recipe && (
        <ShoppingList
          recipe={{
            name: selectedDrink.name,
            emoji: selectedDrink.emoji || '🍹',
            description: selectedDrink.description || '',
            ingredientsWithAmounts: selectedDrink.recipe.ingredients,
            instructions: selectedDrink.recipe.instructions,
            cookTime: selectedDrink.recipe.cookTime || 'N/A',
            servings: selectedDrink.recipe.yield || 'N/A',
            difficulty: 'Easy'
          }}
          onClose={() => setShowShoppingList(false)}
        />
      )}
    </div>
  )
}

export default Drink