import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { INGREDIENT_CATEGORIES, isValidIngredientId } from '../data/ingredientRegistry'

// Use centralized ingredient registry - single source of truth!
// Convert registry format to component format
const convertRegistryToComponentFormat = (registry) => {
  const result = {}
  
  Object.entries(registry).forEach(([category, categoryData]) => {
    result[category] = {
      emoji: categoryData.emoji,
      subcategories: {}
    }
    
    Object.entries(categoryData.subcategories).forEach(([subcategory, subcategoryData]) => {
      result[category].subcategories[subcategory] = {
        emoji: subcategoryData.emoji,
        items: subcategoryData.items.map(id => ({ id, name: id })) // name will be translated
      }
    })
  })
  
  return result
}

// Load ingredients from registry
const ingredients = convertRegistryToComponentFormat(INGREDIENT_CATEGORIES)

const IngredientSelector = ({ selectedCuisine = null, onGenerate }) => {
  const { t, i18n } = useTranslation()
  const [selectedIngredients, setSelectedIngredients] = useState([])

  // Clear state when language changes to prevent mixing
  useEffect(() => {
    setSelectedIngredients([])
    setShowAddInput({})
    setNewIngredientName({})
  }, [i18n.language])

  // Helper function to get translated ingredient name
  const getTranslatedIngredientName = (ingredient) => {
    // Validate ingredient ID exists in registry
    if (!isValidIngredientId(ingredient.id)) {
      return ingredient.id // Fallback to ID
    }
    
    const translated = t(ingredient.id, { ns: 'ingredients' })
    
    // If translation missing, log warning
    if (translated === ingredient.id) {
      return ingredient.id // Fallback to ID
    }
    
    return translated
  }

  // Helper function to get translated category name
  const getTranslatedCategoryName = (category) => {
    const key = `categories.${category.toLowerCase()}`
    const translated = t(key, { ns: 'ingredients' })
    return translated !== key ? translated : category
  }

  // Helper function to get translated cuisine name
  const getTranslatedCuisineName = (cuisineName) => {
    const translated = t(`cuisines.${cuisineName}`)
    return translated !== `cuisines.${cuisineName}` ? translated : cuisineName
  }

  // Helper function to get translated subcategory name
  const getTranslatedSubcategoryName = (subcategory) => {
    // Handle specific subcategory name mappings
    const subcategoryMap = {
      'Chicken Eggs': 'chickenEggs',
      'Other Bird Eggs': 'otherBirdEggs', 
      'Processed / Specialty': 'processedSpecialty',
      'Chicken': 'chicken',
      'Duck': 'duck',
      'Processed': 'processed',
      'Pork': 'pork',
      'Beef': 'beef',
      'Lamb': 'lamb',
      'Fish': 'fish',
      'Shellfish': 'shellfish',
      'Cephalopods': 'cephalopods',
      'Crustaceans': 'crustaceans',
      'Mollusks': 'mollusks',
      'General': 'general',
      'Mushrooms': 'mushrooms',
      'Beans': 'beans',
      'Tofu & Soy': 'tofuSoy',
      'Whole Grains': 'wholeGrains',
      'Refined Grains': 'refinedGrains',
      'Ancient Grains': 'ancientGrains'
    }
    
    const key = subcategoryMap[subcategory] || subcategory.toLowerCase().replace(/\s+/g, '')
    const translated = t(`subcategories.${key}`, { ns: 'ingredients' })
    return translated !== `subcategories.${key}` ? translated : subcategory
  }
  const [dynamicIngredients, setDynamicIngredients] = useState(() => {
    // Load saved ingredients from localStorage on component mount
    const savedIngredients = localStorage.getItem('customIngredients')
    if (savedIngredients) {
      try {
        const parsed = JSON.parse(savedIngredients)
        
        // Merge saved ingredients with default ingredients
        const merged = { ...ingredients }
        Object.keys(parsed).forEach(category => {
          if (merged[category]) {
            // Check if this category has subcategories (like Meat, Seafood, etc.)
            if (merged[category].subcategories && parsed[category] && typeof parsed[category] === 'object') {
              // For categories with subcategories, merge each subcategory
              merged[category] = {
                ...merged[category],
                subcategories: { ...merged[category].subcategories }
              }
              
              Object.keys(parsed[category]).forEach(subcategory => {
                if (merged[category].subcategories[subcategory]) {
                  const customItems = parsed[category][subcategory] || []
                  merged[category].subcategories[subcategory] = {
                    ...merged[category].subcategories[subcategory],
                    items: [...merged[category].subcategories[subcategory].items, ...customItems]
                  }
                }
              })
            } else if (parsed[category] && Array.isArray(parsed[category])) {
              // For categories without subcategories, merge items normally
              merged[category] = {
                ...merged[category],
                items: [...merged[category].items, ...parsed[category]]
              }
            }
          }
        })
        return merged
      } catch (error) {
        return ingredients
      }
    }
    return ingredients
  })
  const [showAddInput, setShowAddInput] = useState({})
  const [newIngredientName, setNewIngredientName] = useState({})

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients(prev => {
      const isSelected = prev.some(ing => ing.id === ingredient.id)
      if (isSelected) {
        return prev.filter(ing => ing.id !== ingredient.id)
      } else {
        return [...prev, ingredient]
      }
    })
  }

  const handleAddIngredient = (category) => {
    setShowAddInput(prev => ({ ...prev, [category]: true }))
    setNewIngredientName(prev => ({ ...prev, [category]: '' }))
  }

  const handleSaveNewIngredient = (category) => {
    const name = newIngredientName[category]?.trim()
    if (name) {
      const newIngredient = {
        id: `${category.toLowerCase().replace(/\s+/g, '-')}-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name: name
      }
      
      setDynamicIngredients(prev => {
        const updated = {
          ...prev,
          [category]: {
            ...prev[category],
            items: [...prev[category].items, newIngredient]
          }
        }
        
        // Save to localStorage - only save the custom ingredients (not the default ones)
        const customIngredients = {}
        Object.keys(updated).forEach(cat => {
          const defaultItems = ingredients[cat]?.items || []
          const allItems = updated[cat]?.items || []
          const customItems = allItems.filter(item => 
            !defaultItems.some(defaultItem => defaultItem.id === item.id)
          )
          if (customItems.length > 0) {
            customIngredients[cat] = customItems
          }
        })
        localStorage.setItem('customIngredients', JSON.stringify(customIngredients))
        
        return updated
      })
    }
    
    setShowAddInput(prev => ({ ...prev, [category]: false }))
    setNewIngredientName(prev => ({ ...prev, [category]: '' }))
  }

  const handleCancelAdd = (category) => {
    setShowAddInput(prev => ({ ...prev, [category]: false }))
    setNewIngredientName(prev => ({ ...prev, [category]: '' }))
  }

  // Subcategory ingredient management
  const handleAddIngredientSubcategory = (category, subcategory) => {
    setShowAddInput(prev => ({ ...prev, [`${category}-${subcategory}`]: true }))
    setNewIngredientName(prev => ({ ...prev, [`${category}-${subcategory}`]: '' }))
  }

  const handleSaveNewIngredientSubcategory = (category, subcategory) => {
    const name = newIngredientName[`${category}-${subcategory}`]?.trim()
    if (name) {
      const newIngredient = {
        id: `${subcategory.toLowerCase().replace(/\s+/g, '-')}-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name: name
      }
      
      setDynamicIngredients(prev => {
        const updated = {
          ...prev,
          [category]: {
            ...prev[category],
            subcategories: {
              ...prev[category].subcategories,
              [subcategory]: {
                ...prev[category].subcategories[subcategory],
                items: [...prev[category].subcategories[subcategory].items, newIngredient]
              }
            }
          }
        }
        
        // Save to localStorage - only save the custom ingredients
        const customIngredients = {}
        Object.keys(updated).forEach(cat => {
          if (updated[cat].subcategories) {
            Object.keys(updated[cat].subcategories).forEach(subcat => {
              const defaultItems = ingredients[cat]?.subcategories?.[subcat]?.items || []
              const allItems = updated[cat].subcategories[subcat]?.items || []
              const customItems = allItems.filter(item => 
                !defaultItems.some(defaultItem => defaultItem.id === item.id)
              )
              if (customItems.length > 0) {
                if (!customIngredients[cat]) customIngredients[cat] = {}
                customIngredients[cat][subcat] = customItems
              }
            })
          }
        })
        localStorage.setItem('customIngredients', JSON.stringify(customIngredients))
        
        return updated
      })
    }
    
    setShowAddInput(prev => ({ ...prev, [`${category}-${subcategory}`]: false }))
    setNewIngredientName(prev => ({ ...prev, [`${category}-${subcategory}`]: '' }))
  }

  const handleCancelAddSubcategory = (category, subcategory) => {
    setShowAddInput(prev => ({ ...prev, [`${category}-${subcategory}`]: false }))
    setNewIngredientName(prev => ({ ...prev, [`${category}-${subcategory}`]: '' }))
  }

  const handleGenerate = () => {
    if (selectedIngredients.length > 0 && onGenerate) {
      onGenerate(selectedIngredients)
    }
  }

  const handleDeleteIngredient = (ingredient, category, subcategory = null) => {
    setDynamicIngredients(prev => {
      let updated
      
      if (subcategory) {
        // Delete from subcategory
        updated = {
          ...prev,
          [category]: {
            ...prev[category],
            subcategories: {
              ...prev[category].subcategories,
              [subcategory]: {
                ...prev[category].subcategories[subcategory],
                items: prev[category].subcategories[subcategory].items.filter(item => item.id !== ingredient.id)
              }
            }
          }
        }
        
        // Update localStorage for subcategory
        const customIngredients = {}
        Object.keys(updated).forEach(cat => {
          if (updated[cat].subcategories) {
            Object.keys(updated[cat].subcategories).forEach(subcat => {
              const defaultItems = ingredients[cat]?.subcategories?.[subcat]?.items || []
              const allItems = updated[cat].subcategories[subcat]?.items || []
              const customItems = allItems.filter(item => 
                !defaultItems.some(defaultItem => defaultItem.id === item.id)
              )
              if (customItems.length > 0) {
                if (!customIngredients[cat]) customIngredients[cat] = {}
                customIngredients[cat][subcat] = customItems
              }
            })
          }
        })
        localStorage.setItem('customIngredients', JSON.stringify(customIngredients))
        
      } else {
        // Delete from regular category
        updated = {
          ...prev,
          [category]: {
            ...prev[category],
            items: prev[category].items.filter(item => item.id !== ingredient.id)
          }
        }
        
        // Update localStorage for regular category
        const customIngredients = {}
        Object.keys(updated).forEach(cat => {
          const defaultItems = ingredients[cat]?.items || []
          const allItems = updated[cat]?.items || []
          const customItems = allItems.filter(item => 
            !defaultItems.some(defaultItem => defaultItem.id === item.id)
          )
          if (customItems.length > 0) {
            customIngredients[cat] = customItems
          }
        })
        localStorage.setItem('customIngredients', JSON.stringify(customIngredients))
      }
      
      return updated
    })
    
    // Also remove from selected ingredients if it was selected
    setSelectedIngredients(prev => prev.filter(item => item.id !== ingredient.id))
  }

  return (
    <div className="ingredient-selector">
      <div className="ingredient-categories">
        {Object.entries(dynamicIngredients).map(([category, categoryData]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">
              <span className="category-emoji">{categoryData.emoji}</span>
              {getTranslatedCategoryName(category)}
            </h3>
            <div className="ingredient-grid-compact subcategories-container">
              {/* Check if this category has subcategories */}
              {categoryData.subcategories ? (
                // Render subcategories in consistent tabular format
                Object.entries(categoryData.subcategories).map(([subcategory, subcategoryData]) => (
                  <div key={subcategory} className="subcategory-section">
                    <h5 className="subcategory-title">
                      <span className="subcategory-emoji">{subcategoryData.emoji}</span>
                      {getTranslatedSubcategoryName(subcategory)}:
                    </h5>
                    <div className="subcategory-items">
                      {subcategoryData.items.map(ingredient => {
                        // Check if this is a custom ingredient
                        const isCustomIngredient = !ingredients[category]?.subcategories?.[subcategory]?.items?.some(defaultItem => defaultItem.id === ingredient.id)
                        
                        return (
                          <div
                            key={ingredient.id}
                            className={`ingredient-item-compact ${selectedIngredients.some(ing => ing.id === ingredient.id) ? 'selected' : ''} ${isCustomIngredient ? 'custom-ingredient' : ''}`}
                            onClick={() => toggleIngredient(ingredient)}
                            title={ingredient.name}
                          >
                            <span className="ingredient-name-compact">{getTranslatedIngredientName(ingredient)}</span>
                            {isCustomIngredient && (
                              <button
                                className="delete-ingredient-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteIngredient(ingredient, category, subcategory)
                                }}
                                title="Delete this ingredient"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        )
                      })}
                      
                      {/* Add ingredient button for subcategories */}
                      {showAddInput[`${category}-${subcategory}`] ? (
                        <div className="add-ingredient-input subcategory-add">
                          <input
                            type="text"
                            placeholder="Enter ingredient name"
                            value={newIngredientName[`${category}-${subcategory}`] || ''}
                            onChange={(e) => setNewIngredientName(prev => ({ ...prev, [`${category}-${subcategory}`]: e.target.value }))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveNewIngredientSubcategory(category, subcategory)
                              } else if (e.key === 'Escape') {
                                handleCancelAddSubcategory(category, subcategory)
                              }
                            }}
                            autoFocus
                            className="add-ingredient-field"
                          />
                          <div className="add-ingredient-buttons">
                            <button 
                              className="save-ingredient-btn"
                              onClick={() => handleSaveNewIngredientSubcategory(category, subcategory)}
                              disabled={!newIngredientName[`${category}-${subcategory}`]?.trim()}
                            >
                              Save
                            </button>
                            <button 
                              className="cancel-ingredient-btn"
                              onClick={() => handleCancelAddSubcategory(category, subcategory)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="add-ingredient-btn subcategory-add-btn"
                          onClick={() => handleAddIngredientSubcategory(category, subcategory)}
                          title={`Add new ingredient to ${subcategory}`}
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // Render regular items (for categories without subcategories)
                categoryData.items.map(ingredient => {
                  // Check if this is a custom ingredient (not in default ingredients)
                  const isCustomIngredient = !ingredients[category]?.items?.some(defaultItem => defaultItem.id === ingredient.id)
                  
                  return (
                    <div
                      key={ingredient.id}
                      className={`ingredient-item-compact ${selectedIngredients.some(ing => ing.id === ingredient.id) ? 'selected' : ''} ${isCustomIngredient ? 'custom-ingredient' : ''}`}
                      onClick={() => toggleIngredient(ingredient)}
                      title={ingredient.name}
                    >
                      <span className="ingredient-name-compact">{getTranslatedIngredientName(ingredient)}</span>
                      {isCustomIngredient && (
                        <button
                          className="delete-ingredient-btn"
                          onClick={(e) => {
                            e.stopPropagation() // Prevent triggering the ingredient selection
                            handleDeleteIngredient(ingredient, category)
                          }}
                          title="Delete this ingredient"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )
                })
              )}
              
              {/* Add new ingredient section - only show for categories without subcategories */}
              {!categoryData.subcategories && (
                showAddInput[category] ? (
                  <div className="add-ingredient-input">
                    <input
                      type="text"
                      placeholder="Enter ingredient name"
                      value={newIngredientName[category] || ''}
                      onChange={(e) => setNewIngredientName(prev => ({ ...prev, [category]: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveNewIngredient(category)
                        } else if (e.key === 'Escape') {
                          handleCancelAdd(category)
                        }
                      }}
                      autoFocus
                    />
                    <div className="add-ingredient-buttons">
                      <button 
                        className="save-ingredient-btn"
                        onClick={() => handleSaveNewIngredient(category)}
                        disabled={!newIngredientName[category]?.trim()}
                      >
                        Save
                      </button>
                      <button 
                        className="cancel-ingredient-btn"
                        onClick={() => handleCancelAdd(category)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="add-ingredient-btn"
                    onClick={() => handleAddIngredient(category)}
                  >
                    + Add
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="selector-actions">
        <div className="selected-count">
          {t('ingredientSelector.ingredientsSelected', { count: selectedIngredients.length })}
        </div>
        <button 
          className="generate-recipe-btn"
          onClick={handleGenerate}
          disabled={selectedIngredients.length === 0}
        >
          {t('ingredientSelector.generateRecipe')}
        </button>
      </div>
    </div>
  )
}

export default IngredientSelector
