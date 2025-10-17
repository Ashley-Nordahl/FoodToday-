import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (loading) {
      // Only show loading if it takes longer than 300ms
      const timeout = setTimeout(() => {
        setShowLoading(true)
      }, 300)
      
      return () => clearTimeout(timeout)
    } else {
      setShowLoading(false)
    }
  }, [loading])

  if (loading && showLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <span>🍽️</span>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Allow access without authentication for testing
  // TODO: Enable authentication requirement in production
  // if (!user) {
  //   return <Navigate to="/login" />
  // }

  return children
}

export default ProtectedRoute

