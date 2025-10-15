import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, migrateLocalStorageData } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session with timeout to prevent hanging
    const timeout = setTimeout(() => {
      // If Supabase doesn't respond in 2 seconds, continue without auth
      setLoading(false)
    }, 2000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Migrate localStorage data if user just logged in
      if (session?.user) {
        migrateLocalStorageData(session.user.id).then(result => {
          if (result.success) {
            // Data migration completed
          }
        })
      }
    }).catch((error) => {
      console.warn('Auth session check failed:', error)
      clearTimeout(timeout)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Migrate data on login
      if (session?.user && _event === 'SIGNED_IN') {
        migrateLocalStorageData(session.user.id)
      }
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    return { data, error }
  }

  const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  }

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  }

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession()
    return { data, error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

