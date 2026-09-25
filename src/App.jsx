import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import ProtectedRoute from './components/ProtectedRoute'
import LanguageSelector from './components/LanguageSelector'
import ErrorBoundary from './components/ErrorBoundary'
import BottomNavigation from './components/BottomNavigation'
import DishToday from './pages/DishToday'
import Parties from './pages/Parties'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredDot, setHoveredDot] = useState(null)

  // Debug logging removed for production

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Navigation pages configuration (Sauce, Drink, MyFavorite hidden for now)
  const navigationPages = [
    { path: '/', key: 'dishToday' },
    { path: '/parties', key: 'parties' }
  ]

  const getCurrentPageIndex = () => {
    return navigationPages.findIndex(page => page.path === location.pathname)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <span>🍽️</span>
          {t('nav.brand')}
        </Link>
        
        {/* Desktop Navigation Menu - Traditional */}
        <ul className="navbar-menu desktop-menu traditional-nav">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              {t('nav.dishToday')}
            </Link>
          </li>
          <li>
            <Link to="/parties" className={location.pathname === '/parties' ? 'active' : ''}>
              {t('nav.parties')}
            </Link>
          </li>
        </ul>

        {/* Desktop Dot Navigation */}
        <div className="dot-navigation desktop-menu">
          {navigationPages.map((page, index) => {
            const isActive = location.pathname === page.path
            const isHovered = hoveredDot === index
            return (
              <div
                key={page.path}
                className={`dot-container ${isActive ? 'active' : ''}`}
                onMouseEnter={() => setHoveredDot(index)}
                onMouseLeave={() => setHoveredDot(null)}
                onClick={() => navigate(page.path)}
              >
                <div className={`page-dot ${isActive ? 'active' : ''}`} />
                {isHovered && (
                  <div className="dot-tooltip">
                    {t(`nav.${page.key}`)}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Desktop User Actions */}
        <div className="navbar-user desktop-user">
          <LanguageSelector />
          {user && (
            <button onClick={handleSignOut} className="btn-logout btn-small">
              {t('nav.signOut')}
            </button>
          )}
        </div>

        {/* Mobile Right Navigation Items - Grouped Together */}
        <div className="mobile-right-nav-items">
          {/* Mobile User Actions - Always Visible */}
          <div className="mobile-user-actions-always-visible">
            <LanguageSelector />
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-nav-section">
            <ul className="mobile-nav-links">
              <li>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMobileMenu}>
                  {t('nav.dishToday')}
                </Link>
              </li>
              <li>
                <Link to="/parties" className={location.pathname === '/parties' ? 'active' : ''} onClick={closeMobileMenu}>
                  {t('nav.parties')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="mobile-user-actions">
            <div className="mobile-language-selector">
              <LanguageSelector />
            </div>
            {user && (
              <button onClick={handleSignOut} className="btn-logout btn-small">
                {t('nav.signOut')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <div className="app-container">
              <Navigation />
              <Routes>
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/signup" element={<Navigate to="/" replace />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <DishToday />
                  </ProtectedRoute>
                } />
                <Route path="/parties" element={
                  <ProtectedRoute>
                    <Parties />
                  </ProtectedRoute>
                } />
              </Routes>
              <BottomNavigation />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App

