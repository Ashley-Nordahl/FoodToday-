import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import enTranslation from './locales/en/translation.json'
import zhTranslation from './locales/zh/translation.json'
import svTranslation from './locales/sv/translation.json'

// Note: recipes.json removed - now using organized JSON files in /src/recipes/

// Import drink translations
import enDrinks from './locales/en/drinks.json'
import zhDrinks from './locales/zh/drinks.json'
import svDrinks from './locales/sv/drinks.json'

// Import sauce translations
import enSauces from './locales/en/sauces.json'
import zhSauces from './locales/zh/sauces.json'
import svSauces from './locales/sv/sauces.json'

// Import ingredient translations
import enIngredientsData from './locales/en/ingredients.json'
import zhIngredientsData from './locales/zh/ingredients.json'
import svIngredientsData from './locales/sv/ingredients.json'

// Extract ingredients namespace from the data
const enIngredients = enIngredientsData.ingredients
const zhIngredients = zhIngredientsData.ingredients
const svIngredients = svIngredientsData.ingredients

// Import party translations
import enParties from './locales/en/parties.json'
import zhParties from './locales/zh/parties.json'
import svParties from './locales/sv/parties.json'

const resources = {
  en: {
    translation: enTranslation,
    drinks: enDrinks,
    sauces: enSauces,
    ingredients: enIngredients,
    parties: enParties
  },
  zh: {
    translation: zhTranslation,
    drinks: zhDrinks,
    sauces: zhSauces,
    ingredients: zhIngredients,
    parties: zhParties
  },
  sv: {
    translation: svTranslation,
    drinks: svDrinks,
    sauces: svSauces,
    ingredients: svIngredients,
    parties: svParties
  }
}

// Check if user has a saved language preference
const getStoredLanguage = () => {
  try {
    const stored = localStorage.getItem('i18nextLng')
    // Only use stored language if it's a valid option
    if (stored && ['en', 'zh', 'sv'].includes(stored)) {
      return stored
    }
  } catch (e) {
    // localStorage might not be available
  }
  // Default to English for new users
  return 'en'
}

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    lng: getStoredLanguage(), // Use stored preference or default to English
    fallbackLng: 'en', // Fallback language
    debug: false, // Set to true for debugging
    
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    
    detection: {
      // Order of language detection
      // Only check localStorage for saved preferences
      // Don't check navigator to ensure English is default for new users
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      // Only use detected language if it's explicitly saved in localStorage
      // This ensures new users always get English as default
      checkWhitelist: true
    }
  })
  .then(() => {
    // Ensure English is set if no valid language preference exists
    const currentLang = i18n.language
    if (!currentLang || !['en', 'zh', 'sv'].includes(currentLang)) {
      i18n.changeLanguage('en')
    }
  })

export default i18n


