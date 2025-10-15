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

  // Load user's language preference from localStorage (Supabase disabled for testing)
  useEffect(() => {
    const loadUserLanguage = async () => {
      // Use localStorage language for all users (no Supabase calls)
      const savedLanguage = localStorage.getItem('i18nextLng')
      if (savedLanguage && ['en', 'zh', 'sv'].includes(savedLanguage)) {
        // If user has Chinese or Swedish saved, switch them to English for production
        if (savedLanguage === 'zh' || savedLanguage === 'sv') {
          await i18n.changeLanguage('en')
          localStorage.setItem('i18nextLng', 'en')
        } else {
          await i18n.changeLanguage(savedLanguage)
        }
      }
    }

    loadUserLanguage()
  }, [i18n])

  const changeLanguage = async (language) => {
    if (!['en', 'zh', 'sv'].includes(language)) {
      return
    }
    
    // Prevent switching to Chinese or Swedish in production
    if (language === 'zh' || language === 'sv') {
      return
    }

    setIsLoading(true)
    const startTime = Date.now()
    
    try {
      // Change i18n language
      await i18n.changeLanguage(language)
      
      // Save to localStorage
      localStorage.setItem('i18nextLng', language)
      
      // Save to localStorage only (Supabase disabled for testing)
      // TODO: Re-enable Supabase user preference saving when database is set up
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


