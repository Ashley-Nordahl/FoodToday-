import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import DishToday from './pages/DishToday'
import Drink from './pages/Drink'
import Sauce from './pages/Sauce'
import Parties from './pages/Parties'
import MyFavorite from './pages/MyFavorite'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span>🍽️</span>
          FoodToday
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              DishToday
            </Link>
          </li>
          <li>
            <Link to="/drink" className={location.pathname === '/drink' ? 'active' : ''}>
              Drink
            </Link>
          </li>
          <li>
            <Link to="/sauce" className={location.pathname === '/sauce' ? 'active' : ''}>
              Sauce
            </Link>
          </li>
          <li>
            <Link to="/parties" className={location.pathname === '/parties' ? 'active' : ''}>
              Parties
            </Link>
          </li>
          <li>
            <Link to="/favorite" className={location.pathname === '/favorite' ? 'active' : ''}>
              MyFavorite
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <Routes>
          <Route path="/" element={<DishToday />} />
          <Route path="/drink" element={<Drink />} />
          <Route path="/sauce" element={<Sauce />} />
          <Route path="/parties" element={<Parties />} />
          <Route path="/favorite" element={<MyFavorite />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

