import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import enTranslation from './locales/en/translation.json'
import zhTranslation from './locales/zh/translation.json'
import svTranslation from './locales/sv/translation.json'

// Import recipe translations
import enRecipes from './locales/en/recipes.json'
import zhRecipes from './locales/zh/recipes.json'
import svRecipes from './locales/sv/recipes.json'

// Note: parties.json removed - party data now in unified recipes.json

// Import drink translations
import enDrinks from './locales/en/drinks.json'
import zhDrinks from './locales/zh/drinks.json'
import svDrinks from './locales/sv/drinks.json'

// Import sauce translations
import enSauces from './locales/en/sauces.json'
import zhSauces from './locales/zh/sauces.json'
import svSauces from './locales/sv/sauces.json'

// Import ingredient translations
import enIngredients from './locales/en/ingredients.json'
import zhIngredients from './locales/zh/ingredients.json'
import svIngredients from './locales/sv/ingredients.json'

// Import party translations
import enParties from './locales/en/parties.json'
import zhParties from './locales/zh/parties.json'
import svParties from './locales/sv/parties.json'

const resources = {
  en: {
    translation: enTranslation,
    recipes: enRecipes,
    drinks: enDrinks,
    sauces: enSauces,
    ingredients: enIngredients,
    parties: enParties
  },
  zh: {
    translation: zhTranslation,
    recipes: zhRecipes,
    drinks: zhDrinks,
    sauces: zhSauces,
    ingredients: zhIngredients,
    parties: zhParties
  },
  sv: {
    translation: svTranslation,
    recipes: svRecipes,
    drinks: svDrinks,
    sauces: svSauces,
    ingredients: svIngredients,
    parties: svParties
  }
}

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language
    lng: 'en', // Default language
    debug: false, // Set to true for debugging
    
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  })

export default i18n


