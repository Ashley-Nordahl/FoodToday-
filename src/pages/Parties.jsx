import { useState } from 'react'

const parties = [
  {
    id: 401,
    name: 'Birthday Celebration',
    description: 'Make your special day unforgettable with our birthday party packages',
    emoji: '🎂',
    category: 'Birthday',
    price: '$299',
    duration: '4 hours'
  },
  {
    id: 402,
    name: 'Corporate Events',
    description: 'Professional catering for your business meetings and corporate gatherings',
    emoji: '💼',
    category: 'Business',
    price: '$199',
    duration: '3 hours'
  },
  {
    id: 403,
    name: 'Wedding Reception',
    description: 'Elegant dining experience for your most important day',
    emoji: '💒',
    category: 'Wedding',
    price: '$899',
    duration: '6 hours'
  },
  {
    id: 404,
    name: 'Graduation Party',
    description: 'Celebrate academic achievements with friends and family',
    emoji: '🎓',
    category: 'Graduation',
    price: '$349',
    duration: '5 hours'
  },
  {
    id: 405,
    name: 'Holiday Gathering',
    description: 'Festive meals for Christmas, New Year, and special holidays',
    emoji: '🎄',
    category: 'Holiday',
    price: '$449',
    duration: '4 hours'
  },
  {
    id: 406,
    name: 'Anniversary Dinner',
    description: 'Romantic and intimate dining for milestone celebrations',
    emoji: '💕',
    category: 'Anniversary',
    price: '$249',
    duration: '3 hours'
  },
  {
    id: 407,
    name: 'Kids Party',
    description: 'Fun and exciting food options for children\'s celebrations',
    emoji: '🎈',
    category: 'Kids',
    price: '$179',
    duration: '3 hours'
  },
  {
    id: 408,
    name: 'Sports Viewing Party',
    description: 'Game day favorites for watching sports with friends',
    emoji: '⚽',
    category: 'Sports',
    price: '$129',
    duration: '4 hours'
  }
]

function Parties() {
  const [booked, setBooked] = useState(() => {
    const saved = localStorage.getItem('booked')
    return saved ? JSON.parse(saved) : []
  })

  const toggleBooking = (partyId) => {
    const newBooked = booked.includes(partyId)
      ? booked.filter(id => id !== partyId)
      : [...booked, partyId]
    
    setBooked(newBooked)
    localStorage.setItem('booked', JSON.stringify(newBooked))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🎉 Parties</h1>
        <p className="page-subtitle">Make your special occasions memorable with our party catering services</p>
      </div>

      <div className="card-grid">
        {parties.map(party => (
          <div key={party.id} className="card">
            <div className="card-image">
              <span>{party.emoji}</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">{party.name}</h3>
              <p className="card-description">{party.description}</p>
              <div style={{ 
                margin: '1rem 0', 
                padding: '0.8rem', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                <div style={{ marginBottom: '0.4rem' }}>
                  💰 {party.price} starting price
                </div>
                <div style={{ marginBottom: '0.4rem' }}>
                  ⏰ {party.duration} duration
                </div>
                <div>
                  🏷️ {party.category} event
                </div>
              </div>
              <button 
                className={`btn ${booked.includes(party.id) ? 'btn-primary' : 'btn-primary'}`}
                onClick={() => toggleBooking(party.id)}
                style={{ 
                  width: '100%',
                  background: booked.includes(party.id) 
                    ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' 
                    : 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
                }}
              >
                {booked.includes(party.id) ? '✓ Booked' : 'Book Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Parties
