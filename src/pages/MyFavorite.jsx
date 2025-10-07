import { useState, useEffect } from 'react'

// Import all items from other pages
const allDishes = [
  { id: 1, name: 'Grilled Salmon', emoji: '🐟', category: 'Main Course', type: 'dish' },
  { id: 2, name: 'Chicken Tikka Masala', emoji: '🍛', category: 'Main Course', type: 'dish' },
  { id: 3, name: 'Vegetable Stir Fry', emoji: '🥗', category: 'Vegetarian', type: 'dish' },
  { id: 4, name: 'Beef Burger', emoji: '🍔', category: 'Fast Food', type: 'dish' },
  { id: 5, name: 'Margherita Pizza', emoji: '🍕', category: 'Italian', type: 'dish' },
  { id: 6, name: 'Sushi Platter', emoji: '🍣', category: 'Japanese', type: 'dish' },
  { id: 7, name: 'Tacos', emoji: '🌮', category: 'Mexican', type: 'dish' },
  { id: 8, name: 'Pad Thai', emoji: '🍜', category: 'Thai', type: 'dish' }
]

const allDrinks = [
  { id: 101, name: 'Fresh Orange Juice', emoji: '🍊', category: 'Juice', type: 'drink' },
  { id: 102, name: 'Iced Coffee', emoji: '☕', category: 'Coffee', type: 'drink' },
  { id: 103, name: 'Green Smoothie', emoji: '🥤', category: 'Smoothie', type: 'drink' },
  { id: 104, name: 'Lemonade', emoji: '🍋', category: 'Juice', type: 'drink' },
  { id: 105, name: 'Bubble Tea', emoji: '🧋', category: 'Tea', type: 'drink' },
  { id: 106, name: 'Watermelon Juice', emoji: '🍉', category: 'Juice', type: 'drink' },
  { id: 107, name: 'Matcha Latte', emoji: '🍵', category: 'Tea', type: 'drink' },
  { id: 108, name: 'Berry Smoothie', emoji: '🍓', category: 'Smoothie', type: 'drink' },
  { id: 109, name: 'Coconut Water', emoji: '🥥', category: 'Juice', type: 'drink' }
]

const allSauces = [
  { id: 201, name: 'Hot Chili Sauce', emoji: '🌶️', category: 'Spicy', type: 'sauce' },
  { id: 202, name: 'BBQ Sauce', emoji: '🍖', category: 'Sweet', type: 'sauce' },
  { id: 203, name: 'Garlic Aioli', emoji: '🧄', category: 'Creamy', type: 'sauce' },
  { id: 204, name: 'Soy Sauce', emoji: '🥢', category: 'Savory', type: 'sauce' },
  { id: 205, name: 'Pesto', emoji: '🌿', category: 'Herbal', type: 'sauce' },
  { id: 206, name: 'Sriracha', emoji: '🔥', category: 'Spicy', type: 'sauce' },
  { id: 207, name: 'Ranch Dressing', emoji: '🥗', category: 'Creamy', type: 'sauce' },
  { id: 208, name: 'Teriyaki Sauce', emoji: '🍜', category: 'Sweet', type: 'sauce' },
  { id: 209, name: 'Salsa Verde', emoji: '🫑', category: 'Spicy', type: 'sauce' }
]

const allParties = [
  { id: 401, name: 'Birthday Celebration', emoji: '🎂', category: 'Birthday', type: 'party' },
  { id: 402, name: 'Corporate Events', emoji: '💼', category: 'Business', type: 'party' },
  { id: 403, name: 'Wedding Reception', emoji: '💒', category: 'Wedding', type: 'party' },
  { id: 404, name: 'Graduation Party', emoji: '🎓', category: 'Graduation', type: 'party' },
  { id: 405, name: 'Holiday Gathering', emoji: '🎄', category: 'Holiday', type: 'party' },
  { id: 406, name: 'Anniversary Dinner', emoji: '💕', category: 'Anniversary', type: 'party' },
  { id: 407, name: 'Kids Party', emoji: '🎈', category: 'Kids', type: 'party' },
  { id: 408, name: 'Sports Viewing Party', emoji: '⚽', category: 'Sports', type: 'party' }
]

const allItems = [...allDishes, ...allDrinks, ...allSauces, ...allParties]

function MyFavorite() {
  const [favorites, setFavorites] = useState([])
  const [favoriteItems, setFavoriteItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    const favoriteIds = saved ? JSON.parse(saved) : []
    setFavorites(favoriteIds)

    const items = allItems.filter(item => favoriteIds.includes(item.id))
    setFavoriteItems(items)
  }, [])

  const removeFavorite = (itemId) => {
    const newFavorites = favorites.filter(id => id !== itemId)
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    setFavoriteItems(allItems.filter(item => newFavorites.includes(item.id)))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">❤️ My Favorites</h1>
        <p className="page-subtitle">Your personally curated collection of favorites</p>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💔</div>
          <h2 className="empty-state-title">No favorites yet</h2>
          <p className="empty-state-text">
            Start exploring dishes, drinks, and sauces to add them to your favorites!
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {favoriteItems.map(item => (
            <div key={item.id} className="card">
              <div className="card-image">
                <span>{item.emoji}</span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{item.name}</h3>
                <div className="card-meta">
                  <span className="card-tag">{item.category}</span>
                  <button 
                    className="favorite-btn active"
                    onClick={() => removeFavorite(item.id)}
                  >
                    ❤️
                  </button>
                </div>
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem', 
                  background: '#f8f9fa', 
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  color: 'var(--primary-color)'
                }}>
                  {item.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyFavorite

