import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { trackSelection } from '../lib/supabase'
import InlineFoodWheel from '../components/InlineFoodWheel'
import RecipeChoiceCards from '../components/RecipeChoiceCards'
import IngredientSelector from '../components/IngredientSelector'
import IngredientCheckbox from '../components/IngredientCheckbox'
import { 
  getRandomRecipe, 
  getRandomRecipeByCuisine, 
  getRecipesByCuisine,
  getAllCuisines,
  getRecipeById,
  getAllRecipes
} from '../data/recipeLoader'

function DishToday() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [showChoiceCards, setShowChoiceCards] = useState(false)
  const [showIngredientSelector, setShowIngredientSelector] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [recipeType, setRecipeType] = useState(null)
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState(new Set())
  const [activeTab, setActiveTab] = useState('random') // Default to random tab
  
  // Phone number functionality
  const [quickSMSNumber, setQuickSMSNumber] = useState('')
  const [savedNumbers, setSavedNumbers] = useState([])
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false)

  // Get available cuisines from new recipe system
  const availableCuisines = getAllCuisines()

  // Function to get country flag emoji based on subcategory
  const getCountryFlag = (subcategory) => {
    const flagMap = {
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'France': '🇫🇷',
      'Greece': '🇬🇷',
      'Germany': '🇩🇪',
      'Sweden': '🇸🇪',
      'Turkey': '🇹🇷',
      'America': '🇺🇸',
      'Canada': '🇨🇦',
      'Brazil': '🇧🇷',
      'Colombia': '🇨🇴',
      'Mexico': '🇲🇽',
      'Peru': '🇵🇪',
      'Argentina': '🇦🇷',
      'Iran': '🇮🇷',
      'Lebanon': '🇱🇧',
      'Morocco': '🇲🇦',
      'Nigeria': '🇳🇬',
      'South Africa': '🇿🇦',
      'Chinese': '🇨🇳',
      'Japanese': '🇯🇵',
      'Malaysia': '🇲🇾',
      'Thailand': '🇹🇭',
      'Korea': '🇰🇷',
      'India': '🇮🇳'
    }
    return flagMap[subcategory] || '🌍'
  }

  // Clear all state when language changes to prevent mixing
  useEffect(() => {
    setSelectedRecipe(null)
    setSelectedCuisine(null)
    setShowChoiceCards(false)
    setShowIngredientSelector(false)
    setRecipeType(null)
  }, [i18n.language])

  // Load saved phone numbers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedPhoneNumbers')
    if (saved) {
      try {
        setSavedNumbers(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved phone numbers:', error)
      }
    }
  }, [])

  // Update selected recipe when language changes (REACTIVE TRANSLATION)
  useEffect(() => {
    if (selectedRecipe && selectedRecipe.id) {
      const foundRecipe = getRecipeById(selectedRecipe.id)
      if (foundRecipe) {
        setSelectedRecipe(foundRecipe)
      }
    }
  }, [selectedRecipe?.id, i18n.language])

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine)
    setShowChoiceCards(true)
    setSelectedRecipe(null)
    setRecipeType(null)
    
    // Scroll to choice cards after they appear
    setTimeout(() => {
      const choiceCardsElement = document.querySelector('.recipe-choice-cards')
      if (choiceCardsElement) {
        choiceCardsElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
      }
    }, 100)
  }

  const handleSubcategorySelect = (cuisine, subcategory) => {
    // Set the selected cuisine with subcategory information and show choice cards
    const cuisineWithSubcategory = {
      ...cuisine,
      subcategory: subcategory
    }
    setSelectedCuisine(cuisineWithSubcategory)
    setShowChoiceCards(true)
    setSelectedRecipe(null)
    setRecipeType(null)
    
    // Scroll to choice cards after they appear
    setTimeout(() => {
      const choiceCardsElement = document.querySelector('.recipe-choice-cards')
      if (choiceCardsElement) {
        choiceCardsElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
      }
    }, 100)
  }

  const handleRecipeChoice = async (choiceType, cuisine, ingredients = null, searchRecipe = null) => {
    // Handle clearing recipe selection when switching tabs
    if (choiceType === 'clear') {
      setSelectedRecipe(null)
      setRecipeType(null)
      setShowIngredientSelector(false)
      return
    }
    
    let recipe = null
    if (choiceType === 'random') {
      if (cuisine) {
        // Get random recipe from specific cuisine using new loader
        recipe = getRandomRecipeByCuisine(cuisine.name)
        if (!recipe) {
          const cuisineName = t(`cuisines.${cuisine.name}`, cuisine.name)
          alert(t('errors.noRecipesAvailable', { cuisine: cuisineName }))
          return
        }
      } else {
        recipe = getRandomRecipe()
        if (!recipe) {
          alert(t('errors.noRecipesFound'))
          return
        }
      }
      setRecipeType('random')
    } else if (choiceType === 'search' && searchRecipe) {
      recipe = searchRecipe
      setRecipeType('search')
    } else if (choiceType === 'ingredients' && ingredients) {
      if (cuisine) {
        // Get recipes from specific cuisine using new loader
        const cuisineRecipes = getRecipesByCuisine(cuisine.name)
        const completeRecipes = cuisineRecipes.filter(recipe => 
          recipe.ingredients && 
          recipe.steps && 
          Array.isArray(recipe.ingredients) && 
          Array.isArray(recipe.steps) &&
          recipe.ingredients.length > 0 &&
          recipe.steps.length > 0
        )
        
        // Simple ingredient matching
        const matchingRecipes = completeRecipes.filter(recipe => {
          const recipeIngredients = recipe.ingredients || []
          const availableCount = recipeIngredients.filter(ingredient => 
            ingredients.some(available => 
              ingredient.toLowerCase().includes(available.id.toLowerCase()) ||
              available.id.toLowerCase().includes(ingredient.toLowerCase())
            )
          ).length
          
          return (availableCount / recipeIngredients.length) >= 0.6
        })
        
        if (matchingRecipes.length > 0) {
          recipe = matchingRecipes[0]
          setRecipeType('ingredients')
        } else {
          alert(t('errors.noRecipesForIngredients'))
          return
        }
      } else {
        // Use global ingredient search
        recipe = getRandomRecipe()
        if (!recipe) {
          alert(t('errors.noRecipesForIngredients'))
          return
        }
        setRecipeType('ingredients')
      }
    }
    
    setSelectedRecipe(recipe)
    setShowIngredientSelector(false)

    // Track selection in Supabase
    if (recipe && user) {
      await trackSelection(user.id, recipe, 'dish')
    }

    // Scroll to recipe display for all recipe types
    if (recipe) {
      setTimeout(() => {
        const recipeElement = document.querySelector('.recipe-display')
        if (recipeElement) {
          recipeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        } else {
          // Fallback: scroll down a bit to show the recipe area
          window.scrollBy({
            top: 300,
            behavior: 'smooth'
          })
        }
      }, 200)
    }
  }

  const handleIngredientSelect = (ingredients) => {
    handleRecipeChoice('ingredients', selectedCuisine, ingredients)
  }

  const handleSearchRecipe = (searchRecipe) => {
    handleRecipeChoice('search', selectedCuisine, null, searchRecipe)
  }


  const handleViewShoppingList = () => {
    setShowShoppingList(true)
  }

  const handleCloseShoppingList = () => {
    setShowShoppingList(false)
  }

  // Toggle ingredient checkbox
  const toggleIngredient = (ingredient) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev)
      if (newSet.has(ingredient)) {
        newSet.delete(ingredient)
      } else {
        newSet.add(ingredient)
      }
      return newSet
    })
  }

  // Initialize ingredient checkboxes when recipe is selected
  useEffect(() => {
    if (selectedRecipe) {
      const ingredientSet = new Set()
      const ingredients = selectedRecipe.ingredients?.[i18n.language] || selectedRecipe.ingredients?.en || []
      
      ingredients.forEach(ingredientString => {
        let ingredientName = ingredientString
        
        if (typeof ingredientString === 'string') {
          if (ingredientString.includes('ingredient.')) {
            const match = ingredientString.match(/ingredient\.([^\s]+)/)
            if (match) {
              ingredientName = match[1].replace(/_/g, ' ')
            }
          } else {
            const parts = ingredientString.split(' ')
            if (parts.length >= 3) {
              ingredientName = parts.slice(2).join(' ').replace(',', '').trim()
            } else if (parts.length === 2) {
              ingredientName = parts.join(' ')
            }
          }
        }
        
        ingredientSet.add(ingredientName)
      })
      
      setCheckedIngredients(ingredientSet) // All ingredients start checked
    }
  }, [selectedRecipe, i18n.language])

  // Get category emoji for recipe
  const getCategoryEmoji = (recipe) => {
    const mainType = recipe.main_type?.[i18n.language] || recipe.main_type?.en || ''
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

  // Create shopping list text for sharing
  const createShoppingListText = () => {
    let list = `🍽️ ${t('shoppingList.title')} - ${selectedRecipe.dish_name?.[i18n.language] || selectedRecipe.dish_name?.en || 'Recipe'}\n`
    list += `📝 ${t('shoppingList.totalDishes')}: 1\n\n`
    
    list += `🍳 ${t('shoppingList.menu')}:\n`
    const dishName = typeof selectedRecipe.name === 'string' && selectedRecipe.name.startsWith('dish.')
      ? t(`dishes.${selectedRecipe.name.replace('dish.', '')}`)
      : typeof selectedRecipe.name === 'string'
        ? selectedRecipe.name
        : selectedRecipe.dish_name?.en || selectedRecipe.name
    list += `1. ${getCategoryEmoji(selectedRecipe)} ${dishName}\n`
    
    list += `\n🛒 ${t('shoppingList.ingredientsNeeded')}:\n`
    
    const ingredients = selectedRecipe.ingredients?.[i18n.language] || selectedRecipe.ingredients?.en || []
    ingredients.forEach((ingredient, index) => {
      if (typeof ingredient === 'string' && ingredient.includes(' ')) {
        const parts = ingredient.split(' ')
        const amount = parts[0]
        const ingredientName = parts.slice(1).join(' ')
        const translatedName = ingredientName?.startsWith('ingredient.')
          ? t(`ingredients.${ingredientName.replace('ingredient.', '')}`)
          : ingredientName
        list += `• ${amount} ${translatedName}\n`
      } else {
        const displayText = ingredient?.startsWith('ingredient.')
          ? t(`ingredients.${ingredient.replace('ingredient.', '')}`)
          : ingredient
        list += `• ${displayText}\n`
      }
    })
    
    return list
  }

  // Phone number management functions
  const savePhoneNumber = (number) => {
    if (number && !savedNumbers.includes(number)) {
      const updated = [...savedNumbers, number]
      setSavedNumbers(updated)
      localStorage.setItem('savedPhoneNumbers', JSON.stringify(updated))
    }
  }

  const removePhoneNumber = (number) => {
    const updated = savedNumbers.filter(n => n !== number)
    setSavedNumbers(updated)
    localStorage.setItem('savedPhoneNumbers', JSON.stringify(updated))
  }

  const sendQuickSMS = (phoneNumber) => {
    const smsBody = createShoppingListText()
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(smsBody)}`
    setShowPhoneDropdown(false) // Hide dropdown after sending
    window.location.href = smsUrl
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('dishToday.title')}</h1>
        <p className="page-subtitle">{t('dishToday.subtitle')}</p>
      </div>

      <InlineFoodWheel 
        cuisines={availableCuisines}
        onCuisineSelect={handleCuisineSelect}
        onSubcategorySelect={handleSubcategorySelect}
        selectedRecipe={selectedRecipe}
      />

      {showChoiceCards && selectedCuisine && (
        <div className={`recipe-choice-cards ${selectedRecipe ? 'faded' : ''}`}>
          <RecipeChoiceCards
            cuisine={selectedCuisine}
            onChoice={handleRecipeChoice}
            onIngredientSelect={handleIngredientSelect}
            onSearchRecipe={handleSearchRecipe}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedRecipe={selectedRecipe}
          />
        </div>
      )}

      {showIngredientSelector && (
        <IngredientSelector
          onIngredientsSelected={handleIngredientSelect}
          onClose={() => setShowIngredientSelector(false)}
        />
      )}

      {selectedRecipe && (
        <div className="recipe-display">
          <div className="recipe-header">
            <button 
              className="recipe-close-button"
              onClick={() => {
                setSelectedRecipe(null);
                setShowChoiceCards(true);
              }}
              title={t('button.close')}
            >
              ✕
            </button>
            <div className="recipe-title-container">
            <h2 className="recipe-title">
              {selectedRecipe.dish_name?.[i18n.language] || selectedRecipe.dish_name?.en || 'Unknown Recipe'}
            </h2>
              <p className="recipe-description">
                {selectedRecipe.description?.[i18n.language] || selectedRecipe.description?.en || ''}
              </p>
            </div>
            <div className="recipe-info">
              {selectedRecipe.region?.en && selectedRecipe.subcategory?.en && (
                <span>{getCountryFlag(selectedRecipe.subcategory.en)} {selectedRecipe.region.en} • {selectedRecipe.subcategory.en}</span>
              )}
              {selectedRecipe.total_time_min && <span>⏳ Total: {selectedRecipe.total_time_min} min</span>}
              {selectedRecipe.difficulty?.en && <span>👨‍🍳 {selectedRecipe.difficulty.en}</span>}
              {selectedRecipe.servings && <span>🍽️ {selectedRecipe.servings} servings</span>}
            </div>
          </div>

          <div className="recipe-actions">
            <button 
              className="shopping-list-button"
              onClick={handleViewShoppingList}
            >
              🛒 {t('button.createShoppingList')}
            </button>
          </div>

          <div className="recipe-modal-content">
            <div className="recipe-section">
              <h3>📋 {t('parties.ingredients')}</h3>
              <ul className="recipe-ingredients">
                {(selectedRecipe.ingredients?.[i18n.language] || selectedRecipe.ingredients?.en || []).map((ingredient, index) => {
                  // Handle real recipe database format (array of strings)
                  if (typeof ingredient === 'string' && ingredient.includes(' ')) {
                    // Handle "2 ingredient.bell_peppers_sliced" format - split amount and ingredient
                    const parts = ingredient.split(' ')
                    const amount = parts[0]
                    const ingredientName = parts.slice(1).join(' ')
                    const translatedName = ingredientName?.startsWith('ingredient.')
                      ? t(`ingredients.${ingredientName.replace('ingredient.', '')}`)
                      : ingredientName
                    return (
                      <li key={index}>
                        <span className="ingredient-amount">{amount}</span>
                        <span className="ingredient-name"> {translatedName}</span>
                      </li>
                    )
                  } else {
                    // Handle direct ingredient keys or other formats
                    const displayText = ingredient?.startsWith('ingredient.')
                      ? t(`ingredients.${ingredient.replace('ingredient.', '')}`)
                      : ingredient
                    return (
                      <li key={index}>
                        <span className="ingredient-name">{displayText}</span>
                      </li>
                    )
                  }
                })}
              </ul>
            </div>

            <div className="recipe-section">
              <h3>👨‍🍳 {t('recipe.instructions')}</h3>
              <ol className="recipe-instructions">
                {(selectedRecipe.steps?.[i18n.language] || selectedRecipe.steps?.en || []).map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingList && selectedRecipe && (
        <div className="shopping-list-overlay">
          <div className="shopping-list-modal" style={{ maxHeight: '90vh', overflow: 'auto' }}>
            <div className="shopping-list-header" style={{ position: 'sticky', top: '0', background: 'white', zIndex: 100, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>🛒 {t('button.createShoppingList')}</h3>
              <button 
                className="close-btn" 
                onClick={handleCloseShoppingList}
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: '#ff6b35', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '30px', 
                  height: '30px', 
                  cursor: 'pointer', 
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}
              >
                ×
              </button>
            </div>

            <div className="shopping-list-content">
              <div className="recipe-info">
                <h4>🍽️ {t('parties.yourCustomMenu')} (1 {t('parties.dish')})</h4>
                <div className="menu-preview">
                  <div className="menu-item">
                    <span className="dish-number">1</span>
                    {getCategoryEmoji(selectedRecipe)} {typeof selectedRecipe.name === 'string' && selectedRecipe.name.startsWith('dish.')
                      ? t(`dishes.${selectedRecipe.name.replace('dish.', '')}`)
                      : typeof selectedRecipe.name === 'string'
                        ? selectedRecipe.name
                        : selectedRecipe.dish_name?.en || selectedRecipe.name}
                  </div>
                </div>
              </div>

              <div className="ingredients-preview">
                <h5>📝 {t('shoppingList.title')}:</h5>
                <div className="consolidated-ingredients">
                  {(selectedRecipe.ingredients?.[i18n.language] || selectedRecipe.ingredients?.en || []).map((ingredientString, index) => {
                    // Parse ingredient string like "1 lb pork chops, cubed"
                    let ingredientName = ingredientString
                    let amount = ingredientString
                    
                    if (typeof ingredientString === 'string') {
                      // If it contains a translation key, extract the ingredient part
                      if (ingredientString.includes('ingredient.')) {
                        const match = ingredientString.match(/ingredient\.([^\s]+)/)
                        if (match) {
                          ingredientName = match[1].replace(/_/g, ' ')
                          // Extract amount from the beginning of the string
                          const amountMatch = ingredientString.match(/^(\d+(?:\.\d+)?\s*\w*)/)
                          amount = amountMatch ? amountMatch[1] : ingredientString
                        }
                      } else {
                        // Extract ingredient name from amount string like "1 lb pork chops, cubed"
                        const parts = ingredientString.split(' ')
                        if (parts.length >= 3) {
                          // Skip amount and unit, take the rest
                          ingredientName = parts.slice(2).join(' ').replace(',', '').trim()
                          // Extract just the amount and unit (first two parts)
                          amount = parts.slice(0, 2).join(' ')
                        } else if (parts.length === 2) {
                          // Handle cases like "Whole Chicken"
                          ingredientName = parts.join(' ')
                          amount = ingredientString
                        }
                      }
                    }
                    
                    const isChecked = checkedIngredients.has(ingredientName)
                    
                    return (
                      <div key={index} className="consolidated-ingredient-row">
                        <IngredientCheckbox
                          ingredient={ingredientName}
                          isChecked={isChecked}
                          onToggle={toggleIngredient}
                        />
                        <div className={`consolidated-ingredient-item ${!isChecked ? 'unchecked' : ''}`}>
                          <div className="ingredient-main">
                            <span className="ingredient-amount">{amount}</span>
                            <span className="ingredient-name">{ingredientName}</span>
                          </div>
                          <div className="ingredient-dishes">
                            <span className="dish-tag">1</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="sharing-section" style={{ marginTop: '20px', padding: '15px', border: '2px solid #ff6b35', borderRadius: '8px', backgroundColor: '#fff5f0' }}>
                <h5>📤 Share:</h5>
                
                <div className="share-buttons" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <button
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(createShoppingListText())
                      const button = event.target
                      const originalText = button.textContent
                      button.textContent = '✅ Copied!'
                      button.style.backgroundColor = '#2E7D32'
                      setTimeout(() => {
                        button.textContent = originalText
                        button.style.backgroundColor = '#4CAF50'
                      }, 2000)
                    }}
                    style={{ 
                      padding: '10px 15px', 
                      backgroundColor: '#4CAF50', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    📋 Copy
                  </button>
                  <button
                    className="sms-btn"
                    onClick={() => {
                      setShowPhoneDropdown(!showPhoneDropdown)
                    }}
                    style={{ 
                      padding: '10px 15px', 
                      backgroundColor: '#2196F3', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    📱 SMS
                  </button>
                  <button
                    className="email-btn"
                    onClick={() => {
                      setShowPhoneDropdown(false) // Hide phone dropdown
                      const subject = `${t('shoppingList.title')} - ${selectedRecipe.dish_name?.[i18n.language] || selectedRecipe.dish_name?.en || 'Recipe'}`
                      const body = createShoppingListText()
                      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                      window.open(mailtoLink, '_blank')
                      
                      const button = event.target
                      const originalText = button.textContent
                      button.textContent = '📧 Opening Email...'
                      button.style.backgroundColor = '#E65100'
                      setTimeout(() => {
                        button.textContent = originalText
                        button.style.backgroundColor = '#FF9800'
                      }, 2000)
                    }}
                    style={{ 
                      padding: '10px 15px', 
                      backgroundColor: '#FF9800', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    📧 Email
                  </button>
                </div>
                
                {/* Quick SMS with Phone Number - Dropdown */}
                {showPhoneDropdown && (
                <div className="quick-sms-section" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
                  <h6 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>📱 Quick SMS:</h6>
                  
                  {/* Phone Number Input */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                    <input
                      type="tel"
                      placeholder="Enter phone number (e.g., +1234567890)"
                      value={quickSMSNumber}
                      onChange={(e) => setQuickSMSNumber(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={() => {
                        if (quickSMSNumber.trim()) {
                          savePhoneNumber(quickSMSNumber.trim())
                          sendQuickSMS(quickSMSNumber.trim())
                          setQuickSMSNumber('')
                          setShowPhoneDropdown(false) // Hide dropdown after sending
                        }
                      }}
                      disabled={!quickSMSNumber.trim()}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: quickSMSNumber.trim() ? '#28a745' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: quickSMSNumber.trim() ? 'pointer' : 'not-allowed',
                        fontSize: '14px'
                      }}
                    >
                      Send
                    </button>
                  </div>
                  
                  {/* Saved Numbers */}
                  {savedNumbers.length > 0 && (
                    <div className="saved-numbers">
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>Saved numbers:</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {savedNumbers.map((number, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              onClick={() => sendQuickSMS(number)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              {number}
                            </button>
                            <button
                              onClick={() => removePhoneNumber(number)}
                              style={{
                                padding: '2px 6px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '10px'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                )}
                
                <p className="share-description" style={{ fontSize: '12px', marginTop: '8px' }}>
                  {t('parties.shareDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DishToday
