import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const cuisines = [
  // Chinese cuisine (consolidated)
  { name: 'Chinese', color: '#2ECC71', emoji: '🍚', flag: '🇨🇳' },
  
  // International cuisines - each with unique colors
  { name: 'Japanese', color: '#E74C3C', emoji: '🍣', flag: '🇯🇵' },
  { name: 'Korean', color: '#3498DB', emoji: '🥘', flag: '🇰🇷' },
  { name: 'Italian', color: '#9B59B6', emoji: '🍝', flag: '🇮🇹' },
  { name: 'French', color: '#E67E22', emoji: '🥐', flag: '🇫🇷' },
  { name: 'Indian', color: '#E17055', emoji: '🍛', flag: '🇮🇳' },
  { name: 'Thai', color: '#1ABC9C', emoji: '🌶️', flag: '🇹🇭' },
  { name: 'Mexican', color: '#00B894', emoji: '🌮', flag: '🇲🇽' },
  { name: 'American', color: '#34495E', emoji: '🍔', flag: '🇺🇸' },
  { name: 'Greek', color: '#F1C40F', emoji: '🫒', flag: '🇬🇷' }
]

function InlineFoodWheel({ onSelect }) {
  const { t, i18n } = useTranslation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [isSelected, setIsSelected] = useState(false)
  const [recentCuisines, setRecentCuisines] = useState([]) // Track recently shown cuisines

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
      const segmentAngle = 360 / cuisines.length
      const selectedIndex = Math.floor((360 - normalizedAngle) / segmentAngle) % cuisines.length
      const cuisine = cuisines[selectedIndex]
      
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
      onSelect(selectedCuisine)
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
              {cuisines.map((cuisine, index) => {
                const segmentAngle = 360 / cuisines.length
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
                      fontSize="10"
                      fontWeight="600"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                      transform={`rotate(${(startAngle + endAngle) / 2}, ${125 + 95 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}, ${125 + 95 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)})`}
                    >
                      {getTranslatedCuisineName(cuisine.name)}
                    </text>
                    <text
                      x={125 + 105 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      y={125 + 105 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="600"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                      transform={`rotate(${(startAngle + endAngle) / 2}, ${125 + 105 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}, ${125 + 105 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)})`}
                    >
                      {cuisine.flag}
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
                    <span className="selected-flag">{selectedCuisine.flag}</span>
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