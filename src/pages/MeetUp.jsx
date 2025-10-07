import { useState } from 'react'

const meetups = [
  {
    id: 301,
    name: 'Italian Cooking Class',
    description: 'Learn to make authentic Italian pasta and tiramisu from scratch',
    emoji: '👨‍🍳',
    date: 'Oct 15, 2025',
    time: '6:00 PM',
    location: 'Downtown Culinary School',
    attendees: 12
  },
  {
    id: 302,
    name: 'Food Truck Festival',
    description: 'Explore diverse cuisines from the best food trucks in the city',
    emoji: '🚚',
    date: 'Oct 20, 2025',
    time: '12:00 PM',
    location: 'City Park',
    attendees: 150
  },
  {
    id: 303,
    name: 'Wine Tasting Evening',
    description: 'Sample fine wines paired with artisan cheeses',
    emoji: '🍷',
    date: 'Oct 18, 2025',
    time: '7:00 PM',
    location: 'The Wine Cellar',
    attendees: 20
  },
  {
    id: 304,
    name: 'Sushi Making Workshop',
    description: 'Master the art of rolling sushi with a professional chef',
    emoji: '🍱',
    date: 'Oct 22, 2025',
    time: '5:30 PM',
    location: 'Zen Kitchen',
    attendees: 15
  },
  {
    id: 305,
    name: 'Vegan Food Fair',
    description: 'Discover delicious plant-based dishes and meet like-minded foodies',
    emoji: '🥬',
    date: 'Oct 25, 2025',
    time: '11:00 AM',
    location: 'Green Market Square',
    attendees: 80
  },
  {
    id: 306,
    name: 'BBQ & Grill Masters',
    description: 'Join us for an outdoor BBQ competition and tasting',
    emoji: '🍗',
    date: 'Oct 28, 2025',
    time: '3:00 PM',
    location: 'Riverside Park',
    attendees: 45
  }
]

function MeetUp() {
  const [registered, setRegistered] = useState(() => {
    const saved = localStorage.getItem('registered')
    return saved ? JSON.parse(saved) : []
  })

  const toggleRegistration = (meetupId) => {
    const newRegistered = registered.includes(meetupId)
      ? registered.filter(id => id !== meetupId)
      : [...registered, meetupId]
    
    setRegistered(newRegistered)
    localStorage.setItem('registered', JSON.stringify(newRegistered))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🎉 Meet Up</h1>
        <p className="page-subtitle">Connect with food lovers and join exciting culinary events</p>
      </div>

      <div className="card-grid">
        {meetups.map(meetup => (
          <div key={meetup.id} className="card">
            <div className="card-image">
              <span>{meetup.emoji}</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">{meetup.name}</h3>
              <p className="card-description">{meetup.description}</p>
              <div style={{ 
                margin: '1rem 0', 
                padding: '0.8rem', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                <div style={{ marginBottom: '0.4rem' }}>
                  📅 {meetup.date} at {meetup.time}
                </div>
                <div style={{ marginBottom: '0.4rem' }}>
                  📍 {meetup.location}
                </div>
                <div>
                  👥 {meetup.attendees} attendees
                </div>
              </div>
              <button 
                className={`btn ${registered.includes(meetup.id) ? 'btn-primary' : 'btn-primary'}`}
                onClick={() => toggleRegistration(meetup.id)}
                style={{ 
                  width: '100%',
                  background: registered.includes(meetup.id) 
                    ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' 
                    : 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
                }}
              >
                {registered.includes(meetup.id) ? '✓ Registered' : 'Register Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MeetUp

