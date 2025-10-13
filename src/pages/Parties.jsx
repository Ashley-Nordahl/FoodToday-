import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n.js'
import IngredientCheckbox from '../components/IngredientCheckbox.jsx'
import { 
  useIngredientCategories,
  useTastePreferences,
  useCuisineStyles,
  useDiningScenarios
} from '../data/recipes.js'
import { generatePartyRecipes, regenerateSingleDish } from '../services/aiRecipeGenerator.js'
import { 
  getCuisineTranslation, 
  getCookingMethodTranslation, 
  getCookingTimeTranslation, 
  getDifficultyTranslation 
} from '../utils/recipeTranslations.js'

function Parties() {
  const { t, i18n } = useTranslation()

  // Get party data from new party data structure (REACTIVE)
  const ingredientCategories = useIngredientCategories()
  const tastePreferences = useTastePreferences()
  const cuisineStyles = useCuisineStyles()
  const diningScenarios = useDiningScenarios()
  
  const [numberOfDishes, setNumberOfDishes] = useState(4)
  const [dishCategories, setDishCategories] = useState(
    [
      { value: 'meat', label: 'Meat', emoji: '🥩' },      // Plate 1: Meat
      { value: 'meat', label: 'Meat', emoji: '🥩' },      // Plate 2: Meat  
      { value: 'seafood', label: 'Seafood', emoji: '🦞' }, // Plate 3: Seafood
      { value: 'vegetables', label: 'Vegetables', emoji: '🥬' }, // Plate 4: Vegetables
      null, null, null, null, null, null  // Remaining plates empty
    ]
  )
  
  // Taste Preferences
  const [selectedTastes, setSelectedTastes] = useState(['rich'])
  
  // Cuisine Style
  const [selectedCuisine, setSelectedCuisine] = useState('mixed')
  
  // Dining Scenario
  const [selectedScenario, setSelectedScenario] = useState('friends')
  
  // Generated dishes
  const [generatedDishes, setGeneratedDishes] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [regeneratingDishIndex, setRegeneratingDishIndex] = useState(null)
  
  // Recipe modal
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  
  // Shopping list modal
  const [showShoppingList, setShowShoppingList] = useState(false)
  
  // Shopping list checkboxes state
  const [checkedIngredients, setCheckedIngredients] = useState(new Set())
  
  // Phone number functionality
  const [quickSMSNumber, setQuickSMSNumber] = useState('')
  const [savedNumbers, setSavedNumbers] = useState([])
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false)
  
  // Sharing functionality
  
  // Ref for scrolling to generated dishes
  const dishProposalRef = useRef(null)
  
  // Scroll to generated dishes when they're created
  useEffect(() => {
    if (generatedDishes && dishProposalRef.current) {
      // Longer delay to ensure the component is fully rendered
      setTimeout(() => {
        // Double-check that the ref is still valid after the timeout
        if (dishProposalRef.current) {
        dishProposalRef.current.scrollIntoView({ 
          behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        })
        }
      }, 500) // Increased delay to 500ms
    }
  }, [generatedDishes])

  // Always reinitialize checkboxes when shopping list is opened (all checked by default)
  useEffect(() => {
    if (showShoppingList && generatedDishes) {
      initializeIngredientCheckboxes(generatedDishes.dishes)
    }
  }, [showShoppingList, generatedDishes])

  // Clear state when language changes to prevent mixing
  useEffect(() => {
    setSelectedTastes(['rich'])
    setSelectedCuisine('mixed')
    setSelectedScenario('friends')
    // Clear generated dishes to prevent language mixing
    setGeneratedDishes(null)
    setSelectedRecipe(null)
    setShowShoppingList(false)
    setDraggedCategory(null)
    setRegeneratingDishIndex(null)
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

  const [draggedCategory, setDraggedCategory] = useState(null)

  // Drag and drop handlers
  const handleDragStart = (e, category) => {
    setDraggedCategory(category)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, plateIndex) => {
    e.preventDefault()
    if (draggedCategory) {
      const newCategories = [...dishCategories]
      newCategories[plateIndex] = draggedCategory
      setDishCategories(newCategories)
      setDraggedCategory(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedCategory(null)
  }

  const handleRemoveFromPlate = (plateIndex) => {
    const newCategories = [...dishCategories]
    newCategories[plateIndex] = null
    setDishCategories(newCategories)
  }

  // Taste preference handlers
  const handleTasteToggle = (taste) => {
    setSelectedTastes(prev => 
      prev.includes(taste) 
        ? prev.filter(t => t !== taste)
        : [...prev, taste]
    )
  }

  // Initialize ingredient checkboxes when dishes are generated (simple Set approach)
  const initializeIngredientCheckboxes = (dishes) => {
    const ingredientSet = new Set()
    
    // Collect all unique ingredient names
    dishes.forEach((dish) => {
      dish.ingredientsWithAmounts.forEach(ingredient => {
        ingredientSet.add(ingredient.ingredient)
      })
    })
    
    setCheckedIngredients(ingredientSet) // All ingredients start checked
  }

  // Handle checkbox toggle for ingredients (simple Set operation)
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

  // Generate dishes using AI
  const handleGenerateDishes = async () => {
    setIsGenerating(true)
    
    try {
    const selections = {
        dishCategories: dishCategories.filter(cat => cat !== null),
      tastePreferences: selectedTastes,
      cuisineStyle: selectedCuisine,
        diningScenario: selectedScenario,
        numberOfDishes: numberOfDishes
      }

      
      const recipes = await generatePartyRecipes(selections, i18n.language)
      
      
      setGeneratedDishes({
        dishes: recipes,
        selections: selections,
        generatedAt: new Date().toISOString()
      })
      
      // Initialize checkboxes for all ingredients (default checked)
      initializeIngredientCheckboxes(recipes)
      
      // Trigger immediate scroll after a short delay
      setTimeout(() => {
        if (dishProposalRef.current) {
          dishProposalRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 200)
      
    } catch (error) {
      console.error('❌ Error generating recipes:', error)
      alert('Failed to generate recipes. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Regenerate a single dish
  const handleRegenerateSingleDish = async (dishIndex) => {
    if (!generatedDishes) return
    
    setRegeneratingDishIndex(dishIndex)
    
    try {
      const category = generatedDishes.selections.dishCategories[dishIndex]
      if (!category) return

      // Get all other dishes (excluding the one being regenerated)
      const otherDishes = generatedDishes.dishes.filter((_, index) => index !== dishIndex)
      
      // Generate a new recipe that doesn't duplicate existing dishes
      const newRecipe = await regenerateSingleDish(
        category,
        otherDishes,
        selectedCuisine,
        selectedTastes,
        i18n.language
      )
      
      if (newRecipe) {
    const updatedDishes = [...generatedDishes.dishes]
        updatedDishes[dishIndex] = newRecipe
    
    setGeneratedDishes({
      ...generatedDishes,
      dishes: updatedDishes
    })
        
        // Reinitialize checkboxes to include new ingredients (all checked by default)
        initializeIngredientCheckboxes(updatedDishes)
      } else {
        alert('Unable to generate a unique dish. Please try again.')
      }
      
    } catch (error) {
      console.error('❌ Error regenerating dish:', error)
      alert('Failed to regenerate dish. Please try again.')
    } finally {
      setRegeneratingDishIndex(null)
    }
  }

  // Recipe modal handlers
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe)
  }

  const handleCloseRecipe = () => {
    setSelectedRecipe(null)
  }

  // Shopping list handlers
  const handleShowShoppingList = () => {
    setShowShoppingList(true)
  }

  const handleCloseShoppingList = () => {
    setShowShoppingList(false)
  }

  const createShoppingListText = () => {
    let list = `🍽️ ${t('shoppingList.title')} ${t('shoppingList.for')} ${t('parties.yourCustomMenu')}\n`
    list += `📝 ${t('shoppingList.totalDishes')}: ${generatedDishes.dishes.length}\n\n`
    
    list += `🍳 ${t('shoppingList.menu')}:\n`
    generatedDishes.dishes.forEach((dish, index) => {
      list += `${index + 1}. ${dish.emoji} ${dish.name}\n`
    })
    
    list += `\n🛒 ${t('shoppingList.ingredientsNeeded')}:\n`
    
    // Helper function to parse and sum amounts (same as UI)
    const parseAmount = (amountStr) => {
      // Extract number from amount string (e.g., "3瓣" -> 3, "500g" -> 500)
      const match = amountStr.match(/(\d+(?:\.\d+)?)/)
      return match ? parseFloat(match[1]) : 0
    }
    
    const getUnit = (amountStr) => {
      // Extract unit from amount string (e.g., "3瓣" -> "瓣", "500g" -> "g")
      const match = amountStr.match(/\d+(?:\.\d+)?(.+)/)
      return match ? match[1] : ''
    }
    
    // Group ingredients by name and sum amounts (same logic as UI)
    const ingredientMap = new Map()
    
    generatedDishes.dishes.forEach((dish, dishIndex) => {
      dish.ingredientsWithAmounts.forEach(ingredient => {
        const key = ingredient.ingredient
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)
          existing.dishes.push(dishIndex + 1) // 1-based numbering
          // Parse and sum amounts
          const currentAmount = parseAmount(ingredient.amount)
          const existingAmount = parseAmount(existing.totalAmount)
          const unit = getUnit(ingredient.amount) || getUnit(existing.totalAmount)
          existing.totalAmount = `${existingAmount + currentAmount}${unit}`
        } else {
          ingredientMap.set(key, {
            ingredient: ingredient.ingredient,
            totalAmount: ingredient.amount,
            dishes: [dishIndex + 1]
          })
        }
      })
    })
    
    // Add consolidated ingredients to list (only checked ones)
    const filteredIngredients = Array.from(ingredientMap.values()).filter(item => {
      return checkedIngredients.has(item.ingredient)
    })
    
        filteredIngredients.forEach((item, index) => {
          const dishList = item.dishes.join(', ')
          list += `• ${item.totalAmount} ${item.ingredient} (${t('shoppingList.forDishes')}: ${dishList})\n`
        })
    
    list += `\n📊 Total items: ${filteredIngredients.length}\n`
    list += `\n📱 Shared from FoodToday App`
    return list
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('parties.title')}</h1>
        <p className="page-subtitle">{t('parties.subtitle')}</p>
      </div>

      <div className="dish-configuration-container">
        <div className="dishes-and-plates-row">
          <div className="dishes-selector-inline">
            <label className="dishes-label">{t('parties.dishes')}</label>
            <select 
              className="dishes-select"
              value={numberOfDishes}
              onChange={(e) => setNumberOfDishes(parseInt(e.target.value))}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div className="plates-display">
            {Array.from({ length: numberOfDishes }).map((_, index) => (
              <div 
                key={index} 
                className={`plate-container ${dishCategories[index] ? 'has-category' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {dishCategories[index] && (
                  <div 
                    className="plate-category-badge draggable"
                    draggable
                    onDragStart={(e) => handleDragStart(e, dishCategories[index])}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleRemoveFromPlate(index)}
                    title="Drag back to remove or click to remove"
                  >
                    {dishCategories[index].emoji}
                  </div>
                )}
                <div className="plate">🍽️</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="instruction-row" style={{display: 'flex', justifyContent: 'center', marginTop: '0.5rem'}}>
          <p className="instruction-text" style={{fontSize: '0.8rem', color: '#ff6b35', margin: 0, textAlign: 'center'}}>{t('parties.dragInstruction')}</p>
        </div>

        <div className="common-categories">
          <div className="category-buttons-common">
            {ingredientCategories.map((cat) => (
              <button
                key={cat.value}
                className="category-btn-common draggable"
                draggable
                onDragStart={(e) => handleDragStart(e, cat)}
                onDragEnd={handleDragEnd}
                title={`Drag ${cat.label} to a plate`}
              >
                {cat.emoji}
                <span className="category-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Taste Preferences Section */}
      <div className="preferences-section">
        <div className="category-section">
          <h3 className="category-title">👅 {t('parties.tastePreferences')} <span style={{fontSize: '0.75rem', fontStyle: 'italic', color: '#666', fontWeight: 'normal'}}>({t('parties.multiOptional')})</span></h3>
        </div>
        <div className="ingredient-grid-compact">
          {tastePreferences.map((taste) => (
            <div
              key={taste.value}
              className={`ingredient-item-compact sauce-item ${selectedTastes.includes(taste.value) ? 'selected' : ''}`}
              onClick={() => handleTasteToggle(taste.value)}
            >
              <span className="ingredient-name-compact">{taste.emoji} {taste.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cuisine Style Section */}
      <div className="preferences-section">
        <div className="category-section">
          <h3 className="category-title">🌍 {t('parties.cuisineStyle')}</h3>
        </div>
        <div className="ingredient-grid-compact">
          {cuisineStyles.map((cuisine) => (
            <div
              key={cuisine.value}
              className={`ingredient-item-compact sauce-item ${selectedCuisine === cuisine.value ? 'selected' : ''}`}
              onClick={() => setSelectedCuisine(cuisine.value)}
            >
              <span className="ingredient-name-compact">{cuisine.emoji} {cuisine.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dining Scenario Section */}
      <div className="preferences-section">
        <div className="category-section">
          <h3 className="category-title">🎉 {t('parties.diningScenario')}</h3>
        </div>
        <div className="ingredient-grid-compact">
          {diningScenarios.map((scenario) => (
            <div
              key={scenario.value}
              className={`ingredient-item-compact sauce-item ${selectedScenario === scenario.value ? 'selected' : ''}`}
              onClick={() => setSelectedScenario(scenario.value)}
            >
              <span className="ingredient-name-compact">{scenario.emoji} {scenario.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leave to Chef Button */}
      <div className="chef-section">
        <button 
          className="chef-button"
          onClick={handleGenerateDishes}
          disabled={isGenerating || dishCategories.filter(cat => cat !== null).length === 0}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
          }}
        >
          {isGenerating ? (
            <>
              <span className="loading-spinner">⏳</span>
              {t('parties.generating')}
            </>
          ) : (
            <>
              👨‍🍳 {t('parties.generateWithAI')}
            </>
          )}
        </button>
        <p className="chef-description">
          {t('parties.generateInstruction')}
        </p>
      </div>

      {/* Generated Dishes Display */}
      {generatedDishes && (
        <div className="dish-proposal-section" ref={dishProposalRef}>
          <div className="dish-proposal-header">
            <h3 className="dish-proposal-title">
              🍽️ {t('parties.yourCustomMenu')}
            </h3>
            <p className="dish-proposal-subtitle">
              {t('parties.generatedDishes', { 
                count: generatedDishes.dishes.length, 
                scenario: diningScenarios.find(s => s.value === generatedDishes.selections.diningScenario)?.label 
              })}
            </p>
          </div>
          
          <div className="dish-list">
            {generatedDishes.dishes.map((dish, index) => (
              <div key={index} className="dish-item">
                <div className="dish-number">{index + 1}</div>
                <div className="dish-emoji">{dish.emoji || '🍽️'}</div>
                <div className="dish-details">
                  <div className="dish-name">{dish.name}</div>
                  <div className="dish-category">{getCuisineTranslation(dish.cuisine, i18n.language)} • {getCookingMethodTranslation(dish.cookingMethod, i18n.language)} • {getCookingTimeTranslation(dish.cookingTime, i18n.language)}</div>
                </div>
                <div className="dish-actions-inline">
                  <button 
                    className="recipe-button"
                    onClick={() => handleRecipeClick(dish)}
                  >
                    {t('parties.recipe')}
                  </button>
                  <button 
                    className="regenerate-single-btn"
                    onClick={() => handleRegenerateSingleDish(index)}
                    disabled={regeneratingDishIndex === index}
                    title="Regenerate this dish"
                  >
                    {regeneratingDishIndex === index ? '⏳' : '🔄'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="dish-actions-section">
            <button 
              className="regenerate-button"
              onClick={handleGenerateDishes}
              disabled={isGenerating}
            >
              🔄 {t('parties.regenerateAll')}
            </button>
            <button 
              className="shopping-list-button"
              onClick={handleShowShoppingList}
            >
              🛒 {t('button.createShoppingList')}
            </button>
            <button 
              className="clear-button"
              onClick={() => setGeneratedDishes(null)}
            >
              ✕ {t('parties.clear')}
            </button>
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="recipe-modal-overlay">
          <div className="recipe-modal">
            <button 
              className="close-recipe-btn"
              onClick={handleCloseRecipe}
            >
              ✕
            </button>
            <div className="recipe-modal-header">
              <h2>{selectedRecipe.name}</h2>
              <div className="recipe-info">
                <span>🌍 {getCuisineTranslation(selectedRecipe.cuisine, i18n.language)}</span>
                <span>👨‍🍳 {getCookingMethodTranslation(selectedRecipe.cookingMethod, i18n.language)}</span>
                <span>⏱️ {getCookingTimeTranslation(selectedRecipe.cookingTime, i18n.language)}</span>
                <span>📊 {getDifficultyTranslation(selectedRecipe.difficulty, i18n.language)}</span>
              </div>
            </div>
            
            <div className="recipe-modal-content">
              <div className="recipe-section">
                <h3>📋 {t('parties.ingredients')}</h3>
                <ul className="recipe-ingredients">
                  {selectedRecipe.ingredientsWithAmounts.map((ingredient, index) => (
                    <li key={index}>
                      <span className="ingredient-amount">{ingredient.amount}</span>
                      <span className="ingredient-name"> {ingredient.ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="recipe-section">
                <h3>👨‍🍳 {t('recipe.instructions')}</h3>
                <ol className="recipe-instructions">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingList && generatedDishes && (
        <div className="shopping-list-overlay">
          <div className="shopping-list-modal" style={{ maxHeight: '90vh', overflow: 'auto' }}>
            <div className="shopping-list-header" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <h4>🍽️ {t('parties.yourCustomMenu')} ({generatedDishes.dishes.length} {t('parties.dishes')})</h4>
                <div className="menu-preview">
                  {generatedDishes.dishes.map((dish, index) => (
                    <div key={index} className="menu-item">
                      <span className="dish-number">{index + 1}</span>
                      {dish.emoji} {dish.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="ingredients-preview">
                <h5>📝 {t('shoppingList.title')}:</h5>
                <div className="consolidated-ingredients">
                  {(() => {
                    // Helper function to parse and sum amounts
                    const parseAmount = (amountStr) => {
                      // Extract number from amount string (e.g., "3瓣" -> 3, "500g" -> 500)
                      const match = amountStr.match(/(\d+(?:\.\d+)?)/)
                      return match ? parseFloat(match[1]) : 0
                    }
                    
                    const getUnit = (amountStr) => {
                      // Extract unit from amount string (e.g., "3瓣" -> "瓣", "500g" -> "g")
                      const match = amountStr.match(/\d+(?:\.\d+)?(.+)/)
                      return match ? match[1] : ''
                    }
                    
                    // Group ingredients by name and sum amounts
                    const ingredientMap = new Map()
                    
                    generatedDishes.dishes.forEach((dish, dishIndex) => {
                      dish.ingredientsWithAmounts.forEach(ingredient => {
                        const key = ingredient.ingredient
                        if (ingredientMap.has(key)) {
                          const existing = ingredientMap.get(key)
                          existing.dishes.push(dishIndex)
                          // Parse and sum amounts
                          const currentAmount = parseAmount(ingredient.amount)
                          const existingAmount = parseAmount(existing.totalAmount)
                          const unit = getUnit(ingredient.amount) || getUnit(existing.totalAmount)
                          existing.totalAmount = `${existingAmount + currentAmount}${unit}`
      } else {
                          ingredientMap.set(key, {
                            ingredient: ingredient.ingredient,
                            totalAmount: ingredient.amount,
                            dishes: [dishIndex]
                          })
                        }
                      })
                    })
                    
                    return Array.from(ingredientMap.values()).map((item, index) => {
                      const isChecked = checkedIngredients.has(item.ingredient)
                      
                      return (
                        <div key={index} className="consolidated-ingredient-row">
                          <IngredientCheckbox
                            ingredient={item.ingredient}
                            isChecked={isChecked}
                            onToggle={toggleIngredient}
                          />
                          <div className={`consolidated-ingredient-item ${!isChecked ? 'unchecked' : ''}`}>
                            <div className="ingredient-main">
                              <span className="ingredient-amount">{item.totalAmount}</span>
                              <span className="ingredient-name">{item.ingredient}</span>
                            </div>
                            <div className="ingredient-dishes">
                              {item.dishes.map(dishIndex => (
                                <span key={dishIndex} className="dish-tag">
                                  {dishIndex + 1} {generatedDishes.dishes[dishIndex].emoji}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
          </div>

              <div className="sharing-section" style={{ marginTop: '20px', padding: '15px', border: '2px solid #ff6b35', borderRadius: '8px', backgroundColor: '#fff5f0' }}>
                <h5>📤 Share:</h5>
                
                <div className="share-buttons" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <button
                    className="copy-btn"
                    onClick={() => {
                      setShowPhoneDropdown(false) // Hide phone dropdown
                      navigator.clipboard.writeText(createShoppingListText())
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
                      const subject = `${t('shoppingList.title')} ${t('shoppingList.for')} ${generatedDishes.dishes.length} ${t('parties.dishes')}`
                      const body = createShoppingListText()
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

export default Parties