import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import i18n from '../i18n'

function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signInWithGoogle, signInWithGithub, refreshSession } = useAuth()
  const navigate = useNavigate()

  // Refresh session on component mount to check for email confirmation
  useEffect(() => {
    const refreshUserSession = async () => {
      try {
        await refreshSession()
      } catch (error) {
        console.log('Session refresh failed:', error)
      }
    }
    
    refreshUserSession()
  }, [refreshSession])

  // Clear form state when language changes
  useEffect(() => {
    setEmail('')
    setPassword('')
    setError('')
    setLoading(false)
  }, [i18n.language])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Refresh session before attempting sign in to check for email confirmation
    try {
      await refreshSession()
    } catch (refreshError) {
      console.log('Session refresh failed:', refreshError)
    }

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setError('')
    setLoading(true)
    const { error } = await signInWithGithub()
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">🍽️ {t('auth.welcomeBack')}</h1>
          <p className="auth-subtitle">{t('auth.signInSubtitle')}</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? t('auth.signingIn') : t('auth.signIn')}
          </button>
        </form>

        {/* Social authentication hidden for now */}
        <div className="auth-divider" style={{ display: 'none' }}>
          <span>{t('auth.orContinueWith')}</span>
        </div>

        <div className="auth-social" style={{ display: 'none' }}>
          <button
            onClick={handleGoogleSignIn}
            className="btn btn-social"
            disabled={loading}
          >
            <span>🔍</span> {t('auth.google')}
          </button>
          <button
            onClick={handleGithubSignIn}
            className="btn btn-social"
            disabled={loading}
          >
            <span>🐙</span> {t('auth.github')}
          </button>
        </div>

        <div className="auth-footer">
          <p>
            {t('auth.noAccount')}{' '}
            <Link to="/signup" className="auth-link">
              {t('auth.signUp')}
            </Link>
          </p>
          <Link to="/forgot-password" className="auth-link-small">
            {t('auth.forgotPassword')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login

