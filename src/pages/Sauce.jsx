import { useState } from 'react'

const sauces = [
  {
    id: 201,
    name: 'Hot Chili Sauce',
    description: 'Spicy red chili sauce with a kick of heat',
    emoji: '🌶️',
    category: 'Spicy',
    level: 'Very Hot'
  },
  {
    id: 202,
    name: 'BBQ Sauce',
    description: 'Sweet and smoky barbecue sauce with molasses',
    emoji: '🍖',
    category: 'Sweet',
    level: 'Mild'
  },
  {
    id: 203,
    name: 'Garlic Aioli',
    description: 'Creamy garlic mayonnaise with lemon zest',
    emoji: '🧄',
    category: 'Creamy',
    level: 'Mild'
  },
  {
    id: 204,
    name: 'Soy Sauce',
    description: 'Traditional Japanese soy sauce for umami flavor',
    emoji: '🥢',
    category: 'Savory',
    level: 'Mild'
  },
  {
    id: 205,
    name: 'Pesto',
    description: 'Fresh basil, pine nuts, parmesan, and olive oil',
    emoji: '🌿',
    category: 'Herbal',
    level: 'Mild'
  },
  {
    id: 206,
    name: 'Sriracha',
    description: 'Thai hot sauce made from chili peppers and garlic',
    emoji: '🔥',
    category: 'Spicy',
    level: 'Hot'
  },
  {
    id: 207,
    name: 'Ranch Dressing',
    description: 'Classic American ranch with herbs and buttermilk',
    emoji: '🥗',
    category: 'Creamy',
    level: 'Mild'
  },
  {
    id: 208,
    name: 'Teriyaki Sauce',
    description: 'Sweet Japanese glaze with soy sauce and ginger',
    emoji: '🍜',
    category: 'Sweet',
    level: 'Mild'
  },
  {
    id: 209,
    name: 'Salsa Verde',
    description: 'Tangy green sauce with tomatillos and jalapeños',
    emoji: '🫑',
    category: 'Spicy',
    level: 'Medium'
  }
]

function Sauce() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  const toggleFavorite = (sauceId) => {
    const newFavorites = favorites.includes(sauceId)
      ? favorites.filter(id => id !== sauceId)
      : [...favorites, sauceId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🍯 Sauces</h1>
        <p className="page-subtitle">Add flavor to your meals with our delicious sauces</p>
      </div>

      <div className="card-grid">
        {sauces.map(sauce => (
          <div key={sauce.id} className="card">
            <div className="card-image">
              <span>{sauce.emoji}</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">{sauce.name}</h3>
              <p className="card-description">{sauce.description}</p>
              <div className="card-meta">
                <span className="card-tag">{sauce.category}</span>
                <button 
                  className={`favorite-btn ${favorites.includes(sauce.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(sauce.id)}
                >
                  {favorites.includes(sauce.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div style={{ marginTop: '0.5rem', color: 'var(--gray-color)', fontSize: '0.9rem' }}>
                🌡️ {sauce.level}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sauce

