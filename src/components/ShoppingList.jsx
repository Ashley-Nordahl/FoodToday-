import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import IngredientCheckbox from './IngredientCheckbox'

const ShoppingList = ({ recipe, onClose }) => {
  const { t } = useTranslation()
  
  // Shopping list checkboxes state
  const [checkedIngredients, setCheckedIngredients] = useState(new Set())
  
  // Phone number functionality
  const [quickSMSNumber, setQuickSMSNumber] = useState('')
  const [savedNumbers, setSavedNumbers] = useState([])
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false)

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

  // Initialize checkboxes when component mounts
  useEffect(() => {
    if (recipe && checkedIngredients.size === 0) {
      const ingredients = recipe.ingredientsWithAmounts || recipe.ingredients || []
      const newCheckedIngredients = new Set()
      
      ingredients.forEach(ingredient => {
        const ingredientName = typeof ingredient === 'string' ? ingredient : ingredient.ingredient || ingredient
        newCheckedIngredients.add(ingredientName)
      })
      
      setCheckedIngredients(newCheckedIngredients)
    }
  }, [recipe, checkedIngredients.size])

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
    const smsBody = createShoppingListText(recipe)
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(smsBody)}`
    setShowPhoneDropdown(false) // Hide dropdown after sending
    window.location.href = smsUrl
  }

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


  const createShoppingListText = (recipe) => {
    let list = `🍽️ ${t('shoppingList.title')} for: ${recipe.name}\n`
    list += `📝 ${t('recipe.description')}: ${recipe.description}\n`
    list += `⏱️ ${t('recipe.cookTime')}: ${recipe.cookTime || recipe.totalTime}\n`
    list += `👥 ${t('recipe.servings')}: ${recipe.servings}\n`
    list += `📊 ${t('recipe.difficulty')}: ${t(`difficulty.${recipe.difficulty.toLowerCase()}`)}\n\n`
    
    list += `🛒 ${t('recipe.ingredients')}:\n`
    const ingredients = recipe.ingredientsWithAmounts || recipe.ingredients
    let checkedCount = 0
    
    ingredients.forEach((ingredient, index) => {
      const ingredientName = typeof ingredient === 'string' ? ingredient : ingredient.ingredient || ingredient
      
      // Only include checked ingredients
      if (checkedIngredients.has(ingredientName)) {
        checkedCount++
        if (recipe.ingredientsWithAmounts) {
          // Use the ingredient with amount directly
          list += `• ${ingredient}\n`
        } else {
          // Format the ingredient ID
          list += `• ${formatIngredientName(ingredient)}\n`
        }
      }
    })
    
    list += `\n${t('shoppingList.totalItems')}: ${checkedCount}\n`
    list += `📱 Shared from FoodToday App`
    return list
  }

  const formatIngredientName = (ingredientId) => {
    // Use translation if available, otherwise format the ID
    try {
      return t(`ingredients.${ingredientId}`)
    } catch {
      return ingredientId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  return (
    <div className="shopping-list-overlay">
      <div className="shopping-list-modal">
        <div className="shopping-list-header">
          <h3>🛒 {t('button.createShoppingList')}</h3>
          <button className="shopping-list-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="shopping-list-content">
          <div className="recipe-info">
            <h4>{recipe.emoji} {recipe.name}</h4>
            <p>{recipe.description}</p>
            <div className="recipe-details">
              <span>⏱️ {recipe.cookTime}</span>
              <span>👥 {recipe.servings} {t('recipe.servings')}</span>
              <span>📊 {t(`difficulty.${recipe.difficulty.toLowerCase()}`)}</span>
            </div>
          </div>

          <div className="ingredients-preview">
            <h5>📝 {t('recipe.ingredients')}</h5>
            <div className="consolidated-ingredients">
              {(recipe.ingredientsWithAmounts || recipe.ingredients).map((ingredient, index) => {
                const ingredientName = typeof ingredient === 'string' ? ingredient : ingredient.ingredient || ingredient
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
                        <span className="ingredient-name">
                          {recipe.ingredientsWithAmounts ? ingredient : formatIngredientName(ingredient)}
                        </span>
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
                  setShowPhoneDropdown(false) // Hide phone dropdown
                  navigator.clipboard.writeText(createShoppingListText(recipe))
                  // Simple indication without popup
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
                  const subject = `${t('shoppingList.title')} for ${recipe.name}`
                  const body = createShoppingListText(recipe)
                  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                  window.open(mailtoLink, '_blank')
                  
                  // Simple indication without popup
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
              Copy to clipboard, or open directly in SMS or Email app.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingList
