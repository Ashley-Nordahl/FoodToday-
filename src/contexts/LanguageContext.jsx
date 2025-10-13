import { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getUserLanguagePreference, updateUserLanguagePreference } from '../lib/supabase'
import { useAuth } from './AuthContext'

const LanguageContext = createContext()

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Load user's language preference from Supabase when they log in
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (user) {
        setIsLoading(true)
        const startTime = Date.now()
        
        // Add timeout to prevent hanging on login
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase timeout')), 5000)
        )
        
        try {
          const result = await Promise.race([
            getUserLanguagePreference(user.id),
            timeoutPromise
          ])
          
          const loadTime = Date.now() - startTime
          
          if (result.error) {
            // Error loading language preference
          } else if (result.data && result.data.language) {
            // User has a saved language preference
            await i18n.changeLanguage(result.data.language)
            localStorage.setItem('i18nextLng', result.data.language)
          } else {
          }
        } catch (timeoutError) {
          // Loading language preference timed out
        } finally {
          setIsLoading(false)
        }
      } else {
        // User logged out, use browser/localStorage language
        const savedLanguage = localStorage.getItem('i18nextLng')
        if (savedLanguage && ['en', 'zh', 'sv'].includes(savedLanguage)) {
          await i18n.changeLanguage(savedLanguage)
        }
      }
    }

    loadUserLanguage()
  }, [user, i18n])

  const changeLanguage = async (language) => {
    if (!['en', 'zh', 'sv'].includes(language)) {
      return
    }

    setIsLoading(true)
    const startTime = Date.now()
    
    try {
      // Change i18n language
      await i18n.changeLanguage(language)
      
      // Save to localStorage
      localStorage.setItem('i18nextLng', language)
      
      // Save to Supabase if user is logged in (with timeout)
      if (user) {
        const supabaseStartTime = Date.now()
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase timeout')), 5000)
        )
        
        try {
          const { error } = await Promise.race([
            updateUserLanguagePreference(user.id, language),
            timeoutPromise
          ])
          const supabaseTime = Date.now() - supabaseStartTime
          
          if (error) {
            // Error saving language preference
          }
        } catch (timeoutError) {
          // Supabase request timed out
        }
      }
    } catch (error) {
      // Error changing language
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    language: i18n.language,
    changeLanguage,
    isLoading,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'zh', name: '中文', flag: '🇨🇳' },
      { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
    ]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}


