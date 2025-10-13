import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import ProtectedRoute from './components/ProtectedRoute'
import LanguageSelector from './components/LanguageSelector'
import DishToday from './pages/DishToday'
import Drink from './pages/Drink'
import Sauce from './pages/Sauce'
import Parties from './pages/Parties'
import MyFavorite from './pages/MyFavorite'
import Login from './pages/Login'
import Signup from './pages/Signup'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { t } = useTranslation()

  // Debug logging removed for production

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span>🍽️</span>
          {t('nav.brand')}
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              {t('nav.dishToday')}
            </Link>
          </li>
          <li>
            <Link to="/sauce" className={location.pathname === '/sauce' ? 'active' : ''}>
              {t('nav.sauce')}
            </Link>
          </li>
          <li>
            <Link to="/drink" className={location.pathname === '/drink' ? 'active' : ''}>
              {t('nav.drink')}
            </Link>
          </li>
          <li>
            <Link to="/parties" className={location.pathname === '/parties' ? 'active' : ''}>
              {t('nav.parties')}
            </Link>
          </li>
          <li>
            <Link to="/favorite" className={location.pathname === '/favorite' ? 'active' : ''}>
              {t('nav.myFavorite')}
            </Link>
          </li>
        </ul>
        <div className="navbar-user">
          <LanguageSelector />
          {user ? (
            <button onClick={handleSignOut} className="btn-logout btn-small">
              {t('nav.signOut')}
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-login btn-small">
                {t('nav.login')}
              </Link>
              <Link to="/signup" className="btn-signup btn-small">
                {t('nav.signup')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <div className="app-container">
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <DishToday />
                </ProtectedRoute>
              } />
              <Route path="/drink" element={
                <ProtectedRoute>
                  <Drink />
                </ProtectedRoute>
              } />
              <Route path="/sauce" element={
                <ProtectedRoute>
                  <Sauce />
                </ProtectedRoute>
              } />
              <Route path="/parties" element={
                <ProtectedRoute>
                  <Parties />
                </ProtectedRoute>
              } />
              <Route path="/favorite" element={
                <ProtectedRoute>
                  <MyFavorite />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

