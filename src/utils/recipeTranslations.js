/**
 * Recipe Translation Utilities
 * 
 * Shared translation functions for recipe metadata
 * Used across multiple components to avoid duplication
 */

// Translation functions for recipe metadata
export const getCuisineTranslation = (cuisine, language = 'en') => {
  const translations = {
    'mixed': { en: 'Mixed', zh: '混合', sv: 'Blandad' },
    'chinese': { en: 'Chinese', zh: '中式', sv: 'Kinesisk' },
    'italian': { en: 'Italian', zh: '意式', sv: 'Italiensk' },
    'mexican': { en: 'Mexican', zh: '墨西哥', sv: 'Mexikansk' },
    'indian': { en: 'Indian', zh: '印度', sv: 'Indisk' },
    'japanese': { en: 'Japanese', zh: '日式', sv: 'Japansk' },
    'french': { en: 'French', zh: '法式', sv: 'Fransk' },
    'thai': { en: 'Thai', zh: '泰式', sv: 'Thailändsk' }
  }
  
  return translations[cuisine]?.[language] || cuisine
}

export const getCookingMethodTranslation = (method, language = 'en') => {
  const translations = {
    'grilled': { en: 'Grilled', zh: '烤制', sv: 'Grillad' },
    'roasted': { en: 'Roasted', zh: '烘烤', sv: 'Rostad' },
    'sautéed': { en: 'Sautéed', zh: '炒制', sv: 'Sauterad' },
    'braised': { en: 'Braised', zh: '炖煮', sv: 'Bräserad' },
    'steamed': { en: 'Steamed', zh: '蒸制', sv: 'Ångad' },
    'fried': { en: 'Fried', zh: '油炸', sv: 'Stekt' },
    'baked': { en: 'Baked', zh: '烘焙', sv: 'Bakad' },
    'boiled': { en: 'Boiled', zh: '水煮', sv: 'Kokt' }
  }
  
  return translations[method]?.[language] || method
}

export const getCookingTimeTranslation = (time, language = 'en') => {
  // Clean the time value first (remove any prefixes)
  const cleanTime = time
    ?.replace(/^Cook:\s*/i, '')
    ?.replace(/^cook:\s*/i, '')
    ?.replace(/^Cooking:\s*/i, '')
    ?.replace(/^Total:\s*/i, '')
    ?.replace(/^total:\s*/i, '')
    ?.replace(/^Time:\s*/i, '')
    ?.replace(/^time:\s*/i, '')
    ?.trim() || time
  
  const translations = {
    '10-15 minutes': { en: '10-15 minutes', zh: '10-15分钟', sv: '10-15 minuter' },
    '15-20 minutes': { en: '15-20 minutes', zh: '15-20分钟', sv: '15-20 minuter' },
    '15-25 minutes': { en: '15-25 minutes', zh: '15-25分钟', sv: '15-25 minuter' },
    '20-30 minutes': { en: '20-30 minutes', zh: '20-30分钟', sv: '20-30 minuter' },
    '25-35 minutes': { en: '25-35 minutes', zh: '25-35分钟', sv: '25-35 minuter' },
    '45-60 minutes': { en: '45-60 minutes', zh: '45-60分钟', sv: '45-60 minuter' },
    '8-12 minutes': { en: '8-12 minutes', zh: '8-12分钟', sv: '8-12 minuter' },
    '10-20 minutes': { en: '10-20 minutes', zh: '10-20分钟', sv: '10-20 minuter' },
    '20 minutes': { en: '20 minutes', zh: '20分钟', sv: '20 minuter' },
    '30 minutes': { en: '30 minutes', zh: '30分钟', sv: '30 minuter' },
    '240 min': { en: '240 min', zh: '240分钟', sv: '240 min' },
    '60 min': { en: '60 min', zh: '60分钟', sv: '60 min' },
    '30 min': { en: '30 min', zh: '30分钟', sv: '30 min' }
  }
  
  return translations[cleanTime]?.[language] || cleanTime
}

export const getDifficultyTranslation = (difficulty, language = 'en') => {
  // Clean the difficulty value first (remove any prefixes)
  const cleanDifficulty = difficulty
    ?.replace(/^difficulty\./i, '')
    ?.replace(/^Difficulty:\s*/i, '')
    ?.replace(/^difficulty:\s*/i, '')
    ?.trim() || difficulty
  
  const translations = {
    'Easy': { en: 'Easy', zh: '简单', sv: 'Lätt' },
    'Medium': { en: 'Medium', zh: '中等', sv: 'Medium' },
    'Hard': { en: 'Hard', zh: '困难', sv: 'Svår' },
    // Handle already translated values
    '简单': { en: 'Easy', zh: '简单', sv: 'Lätt' },
    '中等': { en: 'Medium', zh: '中等', sv: 'Medium' },
    '困难': { en: 'Hard', zh: '困难', sv: 'Svår' },
    'Lätt': { en: 'Easy', zh: '简单', sv: 'Lätt' },
    'Svår': { en: 'Hard', zh: '困难', sv: 'Svår' }
  }
  
  return translations[cleanDifficulty]?.[language] || cleanDifficulty
}
