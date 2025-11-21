import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getAllCuisines, getRecipesByCuisine } from '../data/recipeLoader'
import cuisineStructure from '../data/cuisineStructure.json'

const InlineFoodWheel = ({ onCuisineSelect, onSubcategorySelect, selectedRecipe }) => {
  const { t } = useTranslation()
  const [cuisines, setCuisines] = useState([])
  const [cuisinesWithStyles, setCuisinesWithStyles] = useState([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [isSelected, setIsSelected] = useState(false)
  
  // Second wheel states
  const [showSecondWheel, setShowSecondWheel] = useState(false)
  const [subcategories, setSubcategories] = useState([])
  const [isSecondWheelSpinning, setIsSecondWheelSpinning] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [secondWheelRotation, setSecondWheelRotation] = useState(0)
  const [subcategoryConfirmed, setSubcategoryConfirmed] = useState(false)
  
  // Function to determine what segment is closest to the pointer position
  const getPointerResult = (rotation, segments) => {
    const normalizedRotation = rotation % 360
    const segmentAngle = 360 / segments.length
    
    // The pointer is at the top (0 degrees), so we need to find which segment
    // is currently at the top position after the wheel rotation
    // Since the wheel rotates clockwise, we need to account for that
    const segmentIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % segments.length
    
    console.log('getPointerResult debug:')
    console.log('- rotation:', rotation)
    console.log('- normalizedRotation:', normalizedRotation)
    console.log('- segmentAngle:', segmentAngle)
    console.log('- segmentIndex:', segmentIndex)
    console.log('- segments:', segments)
    console.log('- result:', segments[segmentIndex])
    
    return segments[segmentIndex]
  }

  // Simple function to get a random subcategory from the correct list
  const getRandomSubcategory = (subcategories) => {
    const randomIndex = Math.floor(Math.random() * subcategories.length)
    return subcategories[randomIndex]
  }

  // Get cuisine styles from JSON data
  const getCuisineStyles = () => {
    const styles = {}
    cuisineStructure.regions.forEach(region => {
      styles[region.name] = {
        color: region.color,
        emoji: region.emoji,
        flag: region.flag
      }
    })
    return styles
  }

  useEffect(() => {
    loadCuisines()
  }, [])

  const loadCuisines = async () => {
    // Use data from JSON file
    const cuisineStyles = getCuisineStyles()
    const regionNames = cuisineStructure.regions.map(region => region.name)
    const regionsWithStyles = cuisineStructure.regions.map(region => ({
      name: region.name,
      color: region.color,
      emoji: region.emoji,
      flag: region.flag
    }))
    
    setCuisines(regionNames)
    setCuisinesWithStyles(regionsWithStyles)
  }

  const getSubcategoriesForRegion = async (regionName) => {
    // Get subcategories from JSON data
    const region = cuisineStructure.regions.find(r => r.name === regionName)
    const subcategories = region ? region.subcategories : ['General']
    return subcategories
  }

  const spinWheel = () => {
    if (isSpinning) return
    
    // Don't allow spinning if a recipe is currently selected
    if (selectedRecipe) return
    
    setIsSpinning(true)
    setIsSelected(false)
    setSelectedCuisine(null)
    setShowSecondWheel(false)
    setSelectedSubcategory(null)
    setSubcategoryConfirmed(false)
    setSubcategories([]) // Clear subcategories to prevent stale data
    setIsSecondWheelSpinning(false) // Clear second wheel spinning state
    setSecondWheelRotation(0) // Reset second wheel rotation
    
    // Force clear all state immediately
    
    // Simple random rotation (back to basics)
    const randomRotations = 5 + Math.random() * 5
    const randomAngle = Math.random() * 360
    const totalRotation = rotation + (randomRotations * 360) + randomAngle
    
    setRotation(totalRotation)
    
    setTimeout(() => {
      // Don't set isSpinning to false here - keep it spinning until subcategory is confirmed
      
      // Use the same simple calculation as FoodWheel.jsx
      const normalizedAngle = ((totalRotation % 360) + 360) % 360
      const segmentAngle = 360 / cuisinesWithStyles.length
      const selectedIndex = Math.floor((360 - normalizedAngle) / segmentAngle) % cuisinesWithStyles.length
      const selected = cuisinesWithStyles[selectedIndex]
      
      setSelectedCuisine(selected)
      
      setTimeout(async () => {
        // Force clear all second wheel state before loading new subcategories
        setSubcategories([])
        setSelectedSubcategory(null)
        setShowSecondWheel(false)
        setSecondWheelRotation(0) // Reset rotation to prevent stale calculations
        
        const subcats = await getSubcategoriesForRegion(selected.name)
        
        // Ensure subcategories are properly set before showing second wheel
        setSubcategories(subcats)
        setShowSecondWheel(true)
        
        // Wait a bit to ensure state is updated before spinning second wheel
        setTimeout(() => {
          spinSecondWheel(selected)
        }, 200)
      }, 500)
    }, 4000)
  }

  const spinSecondWheel = (passedSelectedCuisine = null) => {
    if (isSecondWheelSpinning) {
      return
    }
    
    // Use passed cuisine or fall back to state
    const currentSelectedCuisine = passedSelectedCuisine || selectedCuisine
    
    // Get the correct subcategories for the current cuisine from the structure
    const correctSubcategories = cuisineStructure.regions.find(r => r.name === currentSelectedCuisine?.name)?.subcategories || []
    
    // Validate that we have the correct subcategories for the current cuisine
    if (!correctSubcategories || correctSubcategories.length === 0) {
      return
    }
    
    setIsSecondWheelSpinning(true)
    setSelectedSubcategory(null)
    
    // Calculate rotation similar to main wheel - use random rotation and then determine selection
    const segmentAngle = 360 / correctSubcategories.length
    const randomRotations = 3 + Math.random() * 3
    const randomAngle = Math.random() * 360
    const totalRotation = secondWheelRotation + (randomRotations * 360) + randomAngle
    
    setSecondWheelRotation(totalRotation)
    
    setTimeout(() => {
      setIsSecondWheelSpinning(false)
      // Clear main spinning state when second wheel stops spinning and subcategory is selected
      setIsSpinning(false)
      
      // Use the same logic as main wheel - calculate which segment is at the pointer
      const normalizedAngle = ((totalRotation % 360) + 360) % 360
      const segmentAngle = 360 / correctSubcategories.length
      const selectedIndex = Math.floor((360 - normalizedAngle) / segmentAngle) % correctSubcategories.length
      const actualSelectedSubcategory = correctSubcategories[selectedIndex]
      
      setSelectedSubcategory(actualSelectedSubcategory)
    }, 2000)
  }

  const handleConfirmSelection = async () => {
    if (selectedCuisine) {
      const subcats = await getSubcategoriesForRegion(selectedCuisine.name)
      setSubcategories(subcats)
      setShowSecondWheel(true)
    }
  }

  const handleSkip = () => {
    if (onSubcategorySelect) {
      onSubcategorySelect(selectedCuisine, null)
      setIsSpinning(false) // Clear spinning state when skipping
    }
  }

  const handleConfirmSubcategory = () => {
    if (onSubcategorySelect) {
      onSubcategorySelect(selectedCuisine, selectedSubcategory)
      setSubcategoryConfirmed(true)
    }
  }

  const handleTryAgain = () => {
    setSelectedCuisine(null)
    setShowSecondWheel(false)
    setSelectedSubcategory(null)
    setSubcategoryConfirmed(false)
    setRotation(0)
    setSecondWheelRotation(0)
    
    // Automatically trigger a new spin after resetting
    setTimeout(() => {
      spinWheel()
    }, 100)
  }

  const handleTryAgainSubcategory = () => {
    setSelectedSubcategory(null)
    spinSecondWheel()
  }

  const getTranslatedCuisineName = (name) => {
    const translated = t(`cuisines.${name}`)
    return translated !== `cuisines.${name}` ? translated : name
  }

  const getButtonText = () => {
    if (isSpinning) return t('foodWheel.spinning')
    if (selectedCuisine && !isSelected) return t('foodWheel.tryAgain')
    if (selectedCuisine && selectedSubcategory) return t('foodWheel.tryAgain')
    if (subcategoryConfirmed) return t('foodWheel.tryAgain')
    return t('foodWheel.start')
  }

  
  // Removed excessive console logging for better performance
  
  return (
    <div className="inline-wheel-container">
      <div className="concentric-wheel-container">
        {/* Main Wheel (Outer Ring) */}
        <div className="main-wheel-container">
          <div className="wheel-pointer"></div>
          
          {/* Second wheel pointer */}
          {showSecondWheel && (
            <div className="second-wheel-pointer"></div>
          )}
          
          <div className="wheel-wrapper">
            <div className="wheel-container-inner">
              {/* Main Wheel SVG */}
              <svg 
                className={`main-wheel main-wheel-svg ${isSpinning ? 'spinning' : ''}`}
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1
                }}
                viewBox="0 0 400 400"
                width="400"
                height="400"
              >
                {cuisinesWithStyles.map((cuisine, index) => {
                  const segmentAngle = 360 / cuisinesWithStyles.length
                  const startAngle = index * segmentAngle
                  const endAngle = (index + 1) * segmentAngle
                  
                  const startAngleRad = (startAngle * Math.PI) / 180
                  const endAngleRad = (endAngle * Math.PI) / 180
                  
                  const largeArcFlag = segmentAngle > 180 ? 1 : 0
                  
                  // Outer edge points (larger wheel)
                  const x1 = 200 + 180 * Math.cos(startAngleRad - Math.PI / 2)
                  const y1 = 200 + 180 * Math.sin(startAngleRad - Math.PI / 2)
                  const x2 = 200 + 180 * Math.cos(endAngleRad - Math.PI / 2)
                  const y2 = 200 + 180 * Math.sin(endAngleRad - Math.PI / 2)
                  
                  // Inner edge points (where inner wheel starts)
                  const x3 = 200 + 120 * Math.cos(endAngleRad - Math.PI / 2)
                  const y3 = 200 + 120 * Math.sin(endAngleRad - Math.PI / 2)
                  const x4 = 200 + 120 * Math.cos(startAngleRad - Math.PI / 2)
                  const y4 = 200 + 120 * Math.sin(startAngleRad - Math.PI / 2)
                  
                  const pathData = [
                    `M ${x1} ${y1}`,
                    `A 180 180 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    `L ${x3} ${y3}`,
                    `A 120 120 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                    `Z`
                  ].join(' ')
                  
                  return (
                    <g key={cuisine.name}>
                      <path
                        d={pathData}
                        fill={cuisine.color}
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <text
                        x={200 + 150 * Math.cos((startAngle + endAngle) / 2 * Math.PI / 180 - Math.PI / 2)}
                        y={200 + 150 * Math.sin((startAngle + endAngle) / 2 * Math.PI / 180 - Math.PI / 2)}
                        textAnchor="middle"
                        fontSize="16"
                        fill="#000"
                        fontWeight="700"
                        transform={`rotate(${(startAngle + endAngle) / 2}, ${200 + 150 * Math.cos((startAngle + endAngle) / 2 * Math.PI / 180 - Math.PI / 2)}, ${200 + 150 * Math.sin((startAngle + endAngle) / 2 * Math.PI / 180 - Math.PI / 2)})`}
                        style={{ 
                          pointerEvents: 'none',
                          fontFamily: 'Arial, sans-serif'
                        }}
                      >
                        {getTranslatedCuisineName(cuisine.name)}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Inner Wheel (Subcategory) - appears when region selected */}
              {showSecondWheel && selectedCuisine && (
                <svg 
                  className={`inner-wheel-new inner-wheel-svg ${isSecondWheelSpinning ? 'spinning' : ''}`}
                  data-spinning={isSecondWheelSpinning}
                  style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${secondWheelRotation}deg)`,
                    zIndex: 2,
                    width: '200px',
                    height: '200px'
                  }}
                    viewBox="0 0 200 200"
                  >
                  {(() => {
                    const currentSubcategories = cuisineStructure.regions.find(r => r.name === selectedCuisine.name)?.subcategories || []
                    return currentSubcategories.map((subcategory, index) => {
                      const segmentAngle = 360 / currentSubcategories.length
                      const startAngle = index * segmentAngle
                      const endAngle = (index + 1) * segmentAngle
                      
                      const startAngleRad = (startAngle * Math.PI) / 180
                      const endAngleRad = (endAngle * Math.PI) / 180
                      
                      const largeArcFlag = segmentAngle > 180 ? 1 : 0
                      
                      // Outer edge points (inner wheel outer edge)
                      const x1 = 100 + 90 * Math.cos(startAngleRad - Math.PI / 2)
                      const y1 = 100 + 90 * Math.sin(startAngleRad - Math.PI / 2)
                      const x2 = 100 + 90 * Math.cos(endAngleRad - Math.PI / 2)
                      const y2 = 100 + 90 * Math.sin(endAngleRad - Math.PI / 2)
                      
                      // Inner edge points (center button area)
                      const x3 = 100 + 50 * Math.cos(endAngleRad - Math.PI / 2)
                      const y3 = 100 + 50 * Math.sin(endAngleRad - Math.PI / 2)
                      const x4 = 100 + 50 * Math.cos(startAngleRad - Math.PI / 2)
                      const y4 = 100 + 50 * Math.sin(startAngleRad - Math.PI / 2)
                      
                      const pathData = [
                        `M ${x1} ${y1}`,
                        `A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                        `L ${x3} ${y3}`,
                        `A 50 50 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                        `Z`
                      ].join(' ')
                      
                      return (
                        <g key={subcategory}>
                          <path
                            d={pathData}
                            fill={index % 2 === 0 ? '#f8f9fa' : '#e9ecef'}
                            stroke="#dee2e6"
                            strokeWidth="1"
                          />
                          <text
                            x={100 + 70 * Math.cos((startAngle + endAngle) / 2 * Math.PI / 180 - Math.PI / 2)}
                            y={100 + 70 * Math.sin((startAngle + endAngle) / 2 * Math.PI / 180 - Math.PI / 2)}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#495057"
                            fontWeight="500"
                            transform={`rotate(${(startAngle + endAngle) / 2}, ${100 + 70 * Math.cos((startAngle + endAngle) / 2 * Math.PI / 180 - Math.PI / 2)}, ${100 + 70 * Math.sin((startAngle + endAngle) / 2 * Math.PI / 180 - Math.PI / 2)})`}
                          >
                            {getTranslatedCuisineName(subcategory)}
                          </text>
                        </g>
                      )
                    })
                  })()}
                </svg>
              )}

              {/* Center Button */}
              <div className="wheel-center">
                <button 
                  className={`center-button ${selectedRecipe ? 'disabled' : ''}`}
                  onClick={spinWheel}
                  disabled={isSpinning || selectedRecipe}
                  title={selectedRecipe ? t('foodWheel.closeRecipeFirst') : ''}
                >
                  <span className="start-text">
                    {selectedRecipe ? t('foodWheel.closeRecipeFirst') : getButtonText()}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Result Display */}
      
      {selectedCuisine && selectedSubcategory && (
        <div className="result-container">
          <div className="result-content">
            <div className="selected-cuisine">
              <div className="cuisine-info">
                <div className="cuisine-selection-container">
                  <div className="cuisine-text-centered">
                    <span className="selected-name">
                      {getTranslatedCuisineName(selectedCuisine.name)}-{getTranslatedCuisineName(selectedSubcategory)}
                    </span>
                  </div>
                  <div className="action-buttons-section">
                    <button 
                      className="btn btn-confirm"
                      onClick={handleConfirmSubcategory}
                    >
                      {t('foodWheel.letsHaveThis')}
                    </button>
                    <button 
                      className="btn btn-try-again"
                      onClick={handleTryAgain}
                    >
                      {t('foodWheel.anotherOne')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InlineFoodWheel