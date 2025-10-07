import { useState } from 'react'
import InlineFoodWheel from '../components/InlineFoodWheel'

const dishes = [
  {
    id: 1,
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with herbs and lemon, served with roasted vegetables',
    emoji: '🐟',
    category: 'Main Course',
    calories: 420
  },
  {
    id: 2,
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken in a creamy tomato-based curry sauce with aromatic spices',
    emoji: '🍛',
    category: 'Main Course',
    calories: 580
  },
  {
    id: 3,
    name: 'Vegetable Stir Fry',
    description: 'Mixed vegetables tossed in a savory Asian sauce with tofu',
    emoji: '🥗',
    category: 'Vegetarian',
    calories: 320
  },
  {
    id: 4,
    name: 'Beef Burger',
    description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
    emoji: '🍔',
    category: 'Fast Food',
    calories: 650
  },
  {
    id: 5,
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
    emoji: '🍕',
    category: 'Italian',
    calories: 720
  },
  {
    id: 6,
    name: 'Sushi Platter',
    description: 'Assorted sushi rolls with salmon, tuna, and vegetables',
    emoji: '🍣',
    category: 'Japanese',
    calories: 380
  },
  {
    id: 7,
    name: 'Tacos',
    description: 'Three soft tacos with seasoned meat, fresh salsa, and guacamole',
    emoji: '🌮',
    category: 'Mexican',
    calories: 540
  },
  {
    id: 8,
    name: 'Pad Thai',
    description: 'Traditional Thai stir-fried noodles with shrimp, peanuts, and lime',
    emoji: '🍜',
    category: 'Thai',
    calories: 490
  }
]

function DishToday() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })
  
  const [selectedCuisine, setSelectedCuisine] = useState(null)

  const toggleFavorite = (dishId) => {
    const newFavorites = favorites.includes(dishId)
      ? favorites.filter(id => id !== dishId)
      : [...favorites, dishId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine)
    console.log(`Selected cuisine: ${cuisine.name}`)
  }

  return (
    <div className="page-container">
      {/* Wheel Section */}
      <div className="wheel-section">
        <InlineFoodWheel onSelect={handleCuisineSelect} />
      </div>


      {/* Dishes Grid */}
      <div className="dishes-section">
        <h2 className="section-title">Featured Dishes</h2>
        <div className="card-grid">
          {dishes.map(dish => (
            <div key={dish.id} className="card">
              <div className="card-image">
                <span>{dish.emoji}</span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{dish.name}</h3>
                <p className="card-description">{dish.description}</p>
                <div className="card-meta">
                  <span className="card-tag">{dish.category}</span>
                  <button 
                    className={`favorite-btn ${favorites.includes(dish.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(dish.id)}
                  >
                    {favorites.includes(dish.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div style={{ marginTop: '0.5rem', color: 'var(--gray-color)', fontSize: '0.9rem' }}>
                  📊 {dish.calories} cal
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DishToday