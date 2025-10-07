import { useState } from 'react'

const cuisines = [
  // Chinese cuisines
  { name: 'Jiangsu', color: '#FF6B9D', emoji: '🥟', flag: '🇨🇳' },
  { name: 'Shandong', color: '#4ECDC4', emoji: '🍜', flag: '🇨🇳' },
  { name: 'Sichuan', color: '#45B7D1', emoji: '🌶️', flag: '🇨🇳' },
  { name: 'Cantonese', color: '#96CEB4', emoji: '🦐', flag: '🇨🇳' },
  { name: 'Zhejiang', color: '#FFEAA7', emoji: '🐟', flag: '🇨🇳' },
  { name: 'Hunan', color: '#DDA0DD', emoji: '🌶️', flag: '🇨🇳' },
  { name: 'Fujian', color: '#98D8C8', emoji: '🍲', flag: '🇨🇳' },
  { name: 'Anhui', color: '#F7DC6F', emoji: '🥢', flag: '🇨🇳' },
  
  // International cuisines
  { name: 'Japanese', color: '#FF7675', emoji: '🍣', flag: '🇯🇵' },
  { name: 'Korean', color: '#74B9FF', emoji: '🥘', flag: '🇰🇷' },
  { name: 'Italian', color: '#A29BFE', emoji: '🍝', flag: '🇮🇹' },
  { name: 'French', color: '#FD79A8', emoji: '🥐', flag: '🇫🇷' },
  { name: 'Indian', color: '#FDCB6E', emoji: '🍛', flag: '🇮🇳' },
  { name: 'Thai', color: '#6C5CE7', emoji: '🌶️', flag: '🇹🇭' },
  { name: 'Mexican', color: '#00B894', emoji: '🌮', flag: '🇲🇽' }
]

function InlineFoodWheel({ onSelect }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [isSelected, setIsSelected] = useState(false)

  const spinWheel = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    setSelectedCuisine(null)
    setIsSelected(false)
    
    // Random rotation (5-10 full rotations + random angle)
    const randomRotations = 5 + Math.random() * 5
    const randomAngle = Math.random() * 360
    const totalRotation = rotation + (randomRotations * 360) + randomAngle
    
    setRotation(totalRotation)
    
    // Calculate selected cuisine based on final rotation
    setTimeout(() => {
      const normalizedAngle = ((totalRotation % 360) + 360) % 360
      const segmentAngle = 360 / cuisines.length
      const selectedIndex = Math.floor((360 - normalizedAngle) / segmentAngle) % cuisines.length
      const cuisine = cuisines[selectedIndex]
      
      setSelectedCuisine(cuisine)
      setIsSpinning(false)
    }, 3000)
  }

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked
    setIsSelected(checked)
    if (checked && selectedCuisine) {
      onSelect(selectedCuisine)
    }
  }

  const getButtonText = () => {
    if (isSpinning) return "Spinning..."
    if (selectedCuisine && !isSelected) return "Try Again"
    return "Start"
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
              viewBox="0 0 300 300"
              width="300"
              height="300"
            >
              {cuisines.map((cuisine, index) => {
                const segmentAngle = 360 / cuisines.length
                const startAngle = index * segmentAngle
                const endAngle = (index + 1) * segmentAngle
                
                const startAngleRad = (startAngle * Math.PI) / 180
                const endAngleRad = (endAngle * Math.PI) / 180
                
                const largeArcFlag = segmentAngle > 180 ? 1 : 0
                
                // Outer edge points (at radius 150)
                const x1 = 150 + 150 * Math.cos(startAngleRad - Math.PI / 2)
                const y1 = 150 + 150 * Math.sin(startAngleRad - Math.PI / 2)
                const x2 = 150 + 150 * Math.cos(endAngleRad - Math.PI / 2)
                const y2 = 150 + 150 * Math.sin(endAngleRad - Math.PI / 2)
                
                // Inner edge points (at radius 60 to leave room for center)
                const x3 = 150 + 60 * Math.cos(endAngleRad - Math.PI / 2)
                const y3 = 150 + 60 * Math.sin(endAngleRad - Math.PI / 2)
                const x4 = 150 + 60 * Math.cos(startAngleRad - Math.PI / 2)
                const y4 = 150 + 60 * Math.sin(startAngleRad - Math.PI / 2)
                
                const pathData = [
                  `M ${x1} ${y1}`,
                  `A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `L ${x3} ${y3}`,
                  `A 60 60 0 ${largeArcFlag} 0 ${x4} ${y4}`,
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
                      x={150 + 125 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      y={150 + 125 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="600"
                      textShadow="0 1px 2px rgba(0,0,0,0.5)"
                      transform={`rotate(${(startAngle + endAngle) / 2}, ${150 + 125 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}, ${150 + 125 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)})`}
                    >
                      {cuisine.name}
                    </text>
                    <text
                      x={150 + 140 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      y={150 + 140 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="13"
                      fontWeight="600"
                      textShadow="0 1px 2px rgba(0,0,0,0.5)"
                      transform={`rotate(${(startAngle + endAngle) / 2}, ${150 + 140 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}, ${150 + 140 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)})`}
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
                <div className="cuisine-name-row">
                  <div className="cuisine-text">
                    <span className="selected-flag">{selectedCuisine.flag}</span>
                    <span className="selected-name">{selectedCuisine.name} Food</span>
                  </div>
                  <div className="checkbox-section">
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                        className="choice-checkbox"
                      />
                      <span className="checkmark"></span>
                    </label>
                    {isSelected && <p className="selected-label">Selected</p>}
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