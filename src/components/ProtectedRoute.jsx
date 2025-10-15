import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
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

