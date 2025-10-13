import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import i18n from '../i18n'

function Signup() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp, signInWithGoogle, signInWithGithub } = useAuth()
  const navigate = useNavigate()

  // Clear form state when language changes
  useEffect(() => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess(false)
    setLoading(false)
  }, [i18n.language])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { data, error } = await signUp(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Auto redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
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
          <h1 className="auth-title">🎉 {t('auth.welcomeTitle')}</h1>
          <p className="auth-subtitle">{t('auth.welcomeSubtitle')}</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="auth-success">
            <span>✅</span>
            <p>Account created! Check your email to verify. Redirecting to login...</p>
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
              disabled={loading || success}
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
              disabled={loading || success}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              required
              disabled={loading || success}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || success}
          >
            {loading ? t('auth.signingUp') : t('auth.signUp')}
          </button>
        </form>

        <div className="auth-divider">
          <span>{t('auth.orContinueWith')}</span>
        </div>

        <div className="auth-social">
          <button
            onClick={handleGoogleSignIn}
            className="btn btn-social"
            disabled={loading || success}
          >
            <span>🔍</span> {t('auth.google')}
          </button>
          <button
            onClick={handleGithubSignIn}
            className="btn btn-social"
            disabled={loading || success}
          >
            <span>🐙</span> {t('auth.github')}
          </button>
        </div>

        <div className="auth-footer">
          <p>
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="auth-link">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

