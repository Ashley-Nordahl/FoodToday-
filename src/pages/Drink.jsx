import { useState } from 'react'

const drinks = [
  {
    id: 101,
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice packed with Vitamin C',
    emoji: '🍊',
    category: 'Juice',
    size: '350ml'
  },
  {
    id: 102,
    name: 'Iced Coffee',
    description: 'Cold brew coffee with ice and a splash of milk',
    emoji: '☕',
    category: 'Coffee',
    size: '500ml'
  },
  {
    id: 103,
    name: 'Green Smoothie',
    description: 'Spinach, banana, mango, and coconut water blend',
    emoji: '🥤',
    category: 'Smoothie',
    size: '400ml'
  },
  {
    id: 104,
    name: 'Lemonade',
    description: 'Classic homemade lemonade with fresh lemons and mint',
    emoji: '🍋',
    category: 'Juice',
    size: '350ml'
  },
  {
    id: 105,
    name: 'Bubble Tea',
    description: 'Taiwanese milk tea with tapioca pearls',
    emoji: '🧋',
    category: 'Tea',
    size: '500ml'
  },
  {
    id: 106,
    name: 'Watermelon Juice',
    description: 'Refreshing watermelon juice perfect for summer',
    emoji: '🍉',
    category: 'Juice',
    size: '400ml'
  },
  {
    id: 107,
    name: 'Matcha Latte',
    description: 'Premium Japanese matcha with steamed milk',
    emoji: '🍵',
    category: 'Tea',
    size: '350ml'
  },
  {
    id: 108,
    name: 'Berry Smoothie',
    description: 'Mixed berries, yogurt, and honey smoothie',
    emoji: '🍓',
    category: 'Smoothie',
    size: '400ml'
  },
  {
    id: 109,
    name: 'Coconut Water',
    description: 'Natural coconut water straight from the source',
    emoji: '🥥',
    category: 'Juice',
    size: '330ml'
  }
]

function Drink() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  const toggleFavorite = (drinkId) => {
    const newFavorites = favorites.includes(drinkId)
      ? favorites.filter(id => id !== drinkId)
      : [...favorites, drinkId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🥤 Drinks</h1>
        <p className="page-subtitle">Quench your thirst with our refreshing beverages</p>
      </div>

      <div className="card-grid">
        {drinks.map(drink => (
          <div key={drink.id} className="card">
            <div className="card-image">
              <span>{drink.emoji}</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">{drink.name}</h3>
              <p className="card-description">{drink.description}</p>
              <div className="card-meta">
                <span className="card-tag">{drink.category}</span>
                <button 
                  className={`favorite-btn ${favorites.includes(drink.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(drink.id)}
                >
                  {favorites.includes(drink.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div style={{ marginTop: '0.5rem', color: 'var(--gray-color)', fontSize: '0.9rem' }}>
                📏 {drink.size}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Drink

