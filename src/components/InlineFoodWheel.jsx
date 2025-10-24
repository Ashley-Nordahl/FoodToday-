import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// Cuisine styles with proper flags and colors
const cuisineStyles = {
  'Africa': { color: '#27AE60', emoji: '🍲', flag: '🌍' },
  'Asia': { color: '#E67E22', emoji: '🍜', flag: '🌏' },
  'East Asia': { color: '#E74C3C', emoji: '🥢', flag: '🇨🇳' },
  'Europe': { color: '#8E44AD', emoji: '🥖', flag: '🇪🇺' },
  'Global': { color: '#95A5A6', emoji: '🌍', flag: '🌍' },
  'Latin America': { color: '#E74C3C', emoji: '🌽', flag: '🇲🇽' },
  'Mediterranean': { color: '#F1C40F', emoji: '🫒', flag: '🇬🇷' },
  'Middle East': { color: '#D35400', emoji: '🥙', flag: '🇱🇧' },
  'North America': { color: '#34495E', emoji: '🍔', flag: '🇺🇸' },
  'South America': { color: '#E74C3C', emoji: '🌽', flag: '🇧🇷' },
  'South Asia': { color: '#E17055', emoji: '🍛', flag: '🇮🇳' },
  'Southeast Asia': { color: '#1ABC9C', emoji: '🌶️', flag: '🇹🇭' },
  'Southern Europe': { color: '#9B59B6', emoji: '🍝', flag: '🇮🇹' }
}

// Default fallback style
const defaultStyle = { color: '#95A5A6', emoji: '🍽️', flag: '🌍' }

function InlineFoodWheel({ cuisines, onCuisineSelect }) {
  const { t, i18n } = useTranslation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [isSelected, setIsSelected] = useState(false)
  const [recentCuisines, setRecentCuisines] = useState([]) // Track recently shown cuisines

  // Convert cuisine names to objects with styles
  const cuisinesWithStyles = cuisines.map(cuisineName => ({
    name: cuisineName,
    ...(cuisineStyles[cuisineName] || defaultStyle)
  }))

  // Clear state when language changes to prevent mixing
  useEffect(() => {
    setSelectedCuisine(null)
    setIsSpinning(false)
    setIsSelected(false)
    setRecentCuisines([])
  }, [i18n.language])

  // Helper function to get translated cuisine name
  const getTranslatedCuisineName = (cuisineName) => {
    const translated = t(`cuisines.${cuisineName}`)
    return translated !== `cuisines.${cuisineName}` ? translated : cuisineName
  }

  const spinWheel = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    setSelectedCuisine(null)
    setIsSelected(false)
    
    // Use the same approach as FoodWheel.jsx - random rotation and calculate result
    const randomRotations = 5 + Math.random() * 5
    const randomAngle = Math.random() * 360
    const totalRotation = rotation + (randomRotations * 360) + randomAngle
    
    setRotation(totalRotation)
    
    // Calculate selected cuisine based on final rotation (same as FoodWheel.jsx)
    setTimeout(() => {
      const normalizedAngle = ((totalRotation % 360) + 360) % 360
      const segmentAngle = 360 / cuisinesWithStyles.length
      const selectedIndex = Math.floor((360 - normalizedAngle) / segmentAngle) % cuisinesWithStyles.length
      const cuisine = cuisinesWithStyles[selectedIndex]
      
      setSelectedCuisine(cuisine)
      setIsSpinning(false)
      
      // Add to recent cuisines (keep last 3-4 cuisines)
      setRecentCuisines(prev => {
        const updated = [...prev, cuisine.name]
        // Keep only the last 3 cuisines to ensure variety
        return updated.length > 3 ? updated.slice(-3) : updated
      })
    }, 4000)
  }

  const handleConfirmSelection = () => {
    setIsSelected(true)
    if (selectedCuisine) {
      onCuisineSelect(selectedCuisine)
    }
  }

  const handleTryAgain = () => {
    setSelectedCuisine(null)
    setIsSelected(false)
    spinWheel()
  }

  const getButtonText = () => {
    if (isSpinning) return t('foodWheel.spinning')
    if (selectedCuisine && !isSelected) return t('foodWheel.tryAgain')
    return t('foodWheel.start')
  }

  return (
    <div className="inline-wheel-container">
      <div className="wheel-game-container">
        <div className="wheel-pointer"></div>
        
        <div className="wheel-wrapper">
          <div className="wheel-container-inner">
            <svg 
              className={`wheel ${isSpinning ? 'spinning' : ''}`}
              style={{ transform: `rotate(${rotation}deg)` }}
              viewBox="0 0 250 250"
              width="250"
              height="250"
            >
              {cuisinesWithStyles.map((cuisine, index) => {
                const segmentAngle = 360 / cuisinesWithStyles.length
                const startAngle = index * segmentAngle
                const endAngle = (index + 1) * segmentAngle
                
                const startAngleRad = (startAngle * Math.PI) / 180
                const endAngleRad = (endAngle * Math.PI) / 180
                
                const largeArcFlag = segmentAngle > 180 ? 1 : 0
                
                // Outer edge points (at radius 115 - adjusted for smaller wheel)
                const x1 = 125 + 115 * Math.cos(startAngleRad - Math.PI / 2)
                const y1 = 125 + 115 * Math.sin(startAngleRad - Math.PI / 2)
                const x2 = 125 + 115 * Math.cos(endAngleRad - Math.PI / 2)
                const y2 = 125 + 115 * Math.sin(endAngleRad - Math.PI / 2)
                
                // Inner edge points (at radius 80 - adjusted for smaller wheel)
                const x3 = 125 + 80 * Math.cos(endAngleRad - Math.PI / 2)
                const y3 = 125 + 80 * Math.sin(endAngleRad - Math.PI / 2)
                const x4 = 125 + 80 * Math.cos(startAngleRad - Math.PI / 2)
                const y4 = 125 + 80 * Math.sin(startAngleRad - Math.PI / 2)
                
                const pathData = [
                  `M ${x1} ${y1}`,
                  `A 115 115 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `L ${x3} ${y3}`,
                  `A 80 80 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                  `Z`
                ].join(' ')
                
                return (
                  <g key={cuisine.name}>
                    <path
                      d={pathData}
                      fill={cuisine.color}
                      stroke="#fff"
                      strokeWidth="3"
                    />
                    <text
                      x={125 + 95 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      y={125 + 95 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="7"
                      fontWeight="600"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)", wordSpacing: '0px', letterSpacing: '0px' }}
                      transform={`rotate(${(startAngle + endAngle) / 2}, ${125 + 95 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}, ${125 + 95 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)})`}
                    >
                      {getTranslatedCuisineName(cuisine.name).split(' ').map((word, wordIndex) => (
                        <tspan
                          key={wordIndex}
                          x={125 + 95 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                          dy={wordIndex === 0 ? 0 : '1.1em'}
                          textAnchor="middle"
                        >
                          {word}
                        </tspan>
                      ))}
                    </text>
                  </g>
                )
              })}
            </svg>

            <div className="wheel-center">
              <button 
                className="center-button"
                onClick={spinWheel}
                disabled={isSpinning}
              >
                <span className="start-text">{getButtonText()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedCuisine && (
        <div className="result-container">
          <div className="result-content">
            <div className="selected-cuisine">
              <div className="cuisine-info">
                <div className="cuisine-selection-container">
                  <div className="cuisine-text-centered">
                    <span className="selected-name">{getTranslatedCuisineName(selectedCuisine.name)}{t('foodWheel.cuisineSuffix')}</span>
                  </div>
                  {!isSelected && (
                    <div className="action-buttons-section">
                      <button 
                        className="btn btn-confirm"
                        onClick={handleConfirmSelection}
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
                  )}
                  {isSelected && (
                    <div className="confirmed-section">
                      <span className="confirmed-message">
                        ✅ {t('foodWheel.confirmed')}
                      </span>
                      <button 
                        className="btn btn-try-again"
                        onClick={handleTryAgain}
                      >
                        {t('foodWheel.anotherOne')}
                      </button>
                    </div>
                  )}
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