import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function LanguageSelector() {
  const { language, changeLanguage, availableLanguages, isLoading } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLanguage = availableLanguages.find(lang => lang.code === language) || availableLanguages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = async (langCode) => {
    // Prevent switching to Chinese and Swedish in production
    if (langCode === 'zh' || langCode === 'sv') {
      return
    }
    await changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        className="language-selector-button btn-small"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        aria-label="Select language"
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-code">{currentLanguage.code.toUpperCase()}</span>
        <span className="language-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {availableLanguages.map((lang) => {
            const isDisabled = lang.code === 'zh' || lang.code === 'sv' // Disable Chinese and Swedish in production
            return (
              <button
                key={lang.code}
                className={`language-option ${lang.code === language ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isLoading || isDisabled}
                title={isDisabled ? 'Coming soon' : ''}
              >
                <span className="language-flag">{lang.flag}</span>
                <span className="language-name">{lang.name}</span>
                {lang.code === language && <span className="language-check">✓</span>}
                {isDisabled && <span className="language-coming-soon">🚧</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector


