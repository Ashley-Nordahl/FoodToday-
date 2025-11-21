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

  // Language detection is now handled by i18n LanguageDetector
  // No need for manual language loading since i18n.init() handles it automatically

  const changeLanguage = async (language) => {
    if (!['en', 'zh', 'sv'].includes(language)) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Change i18n language - LanguageDetector will automatically save to localStorage
      await i18n.changeLanguage(language)
    } catch (error) {
      console.error('Error changing language:', error)
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


