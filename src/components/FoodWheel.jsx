import { useState, useEffect } from 'react'

const cuisines = [
  // Chinese cuisines
  { name: 'Jiangsu', color: '#FF6B9D', emoji: '🥟' },
  { name: 'Shandong', color: '#4ECDC4', emoji: '🍜' },
  { name: 'Sichuan', color: '#45B7D1', emoji: '🌶️' },
  { name: 'Cantonese', color: '#96CEB4', emoji: '🦐' },
  { name: 'Zhejiang', color: '#FFEAA7', emoji: '🐟' },
  { name: 'Hunan', color: '#DDA0DD', emoji: '🌶️' },
  { name: 'Fujian', color: '#98D8C8', emoji: '🍲' },
  { name: 'Anhui', color: '#F7DC6F', emoji: '🥢' },
  
  // International cuisines
  { name: 'Japanese', color: '#FF7675', emoji: '🍣' },
  { name: 'Korean', color: '#74B9FF', emoji: '🥘' },
  { name: 'Italian', color: '#A29BFE', emoji: '🍝' },
  { name: 'French', color: '#FD79A8', emoji: '🥐' },
  { name: 'Indian', color: '#FDCB6E', emoji: '🍛' },
  { name: 'Thai', color: '#6C5CE7', emoji: '🌶️' },
  { name: 'Mexican', color: '#00B894', emoji: '🌮' }
]

function FoodWheel({ isOpen, onClose, onSelect }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [rotation, setRotation] = useState(0)

  const spinWheel = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    setSelectedCuisine(null)
    
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

  const handleSelectCuisine = () => {
    if (selectedCuisine) {
      onSelect(selectedCuisine)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="wheel-overlay" onClick={onClose}>
      <div className="wheel-container" onClick={(e) => e.stopPropagation()}>
        <div className="wheel-header">
          <div className="wheel-logo">
            <span className="logo-icon">🍽️</span>
            <h2>今天吃什么?</h2>
            <p>What to Eat Today?</p>
          </div>
        </div>

        <div className="wheel-wrapper">
          <div className="wheel-pointer"></div>
          
          <div className="wheel-container-inner">
            <svg 
              className={`wheel ${isSpinning ? 'spinning' : ''}`}
              style={{ transform: `rotate(${rotation}deg)` }}
              viewBox="0 0 400 400"
              width="350"
              height="350"
            >
              <defs>
                {cuisines.map((cuisine, index) => (
                  <g key={cuisine.name}>
                    <clipPath id={`segment-${index}`}>
                      <path d={`M 200 200 L 200 0 A 200 200 0 0 1 ${200 + 200 * Math.cos(2 * Math.PI * (index + 1) / cuisines.length)} ${200 - 200 * Math.sin(2 * Math.PI * (index + 1) / cuisines.length)} Z`} />
                    </clipPath>
                  </g>
                ))}
              </defs>
              
              {cuisines.map((cuisine, index) => {
                const segmentAngle = 360 / cuisines.length
                const startAngle = index * segmentAngle
                const endAngle = (index + 1) * segmentAngle
                
                const startAngleRad = (startAngle * Math.PI) / 180
                const endAngleRad = (endAngle * Math.PI) / 180
                
                const largeArcFlag = segmentAngle > 180 ? 1 : 0
                
                const x1 = 200 + 200 * Math.cos(startAngleRad - Math.PI / 2)
                const y1 = 200 + 200 * Math.sin(startAngleRad - Math.PI / 2)
                const x2 = 200 + 200 * Math.cos(endAngleRad - Math.PI / 2)
                const y2 = 200 + 200 * Math.sin(endAngleRad - Math.PI / 2)
                
                const pathData = [
                  `M 200 200`,
                  `L ${x1} ${y1}`,
                  `A 200 200 0 ${largeArcFlag} 1 ${x2} ${y2}`,
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
                      x={200 + 120 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      y={200 + 120 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="600"
                      textShadow="0 1px 2px rgba(0,0,0,0.5)"
                      transform={`rotate(${(startAngle + endAngle) / 2}, ${200 + 120 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}, ${200 + 120 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)})`}
                    >
                      {cuisine.emoji}
                    </text>
                    <text
                      x={200 + 140 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      y={200 + 140 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="600"
                      textShadow="0 1px 2px rgba(0,0,0,0.5)"
                      transform={`rotate(${(startAngle + endAngle) / 2}, ${200 + 140 * Math.cos((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)}, ${200 + 140 * Math.sin((startAngle + endAngle) * Math.PI / 360 - Math.PI / 2)})`}
                    >
                      {cuisine.name}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="wheel-center">
            <button 
              className="center-button"
              onClick={spinWheel}
              disabled={isSpinning}
            >
              <span className="star-icon">⭐</span>
            </button>
          </div>
        </div>

        <div className="wheel-actions">
          <button 
            className={`start-button ${isSpinning ? 'disabled' : ''}`}
            onClick={spinWheel}
            disabled={isSpinning}
          >
            {isSpinning ? 'Spinning...' : '开始 Start'}
          </button>
          
          {selectedCuisine && (
            <div className="result-container">
              <div className="result-content">
                <h3>🎉 Selected Cuisine!</h3>
                <div className="selected-cuisine">
                  <span className="selected-emoji">{selectedCuisine.emoji}</span>
                  <span className="selected-name">{selectedCuisine.name}</span>
                </div>
                <button 
                  className="select-button"
                  onClick={handleSelectCuisine}
                >
                  Choose This Cuisine
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="wheel-footer">
          <span>🥢</span>
          <span>让决定变得简单 · Make decisions easier</span>
          <span>🍕</span>
        </div>

        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  )
}

export default FoodWheel
