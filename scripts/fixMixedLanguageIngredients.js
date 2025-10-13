const fs = require('fs')
const path = require('path')

// Read all language files
const languages = ['en', 'zh', 'sv']
const recipeFiles = {}

console.log('🔍 Reading recipe files...')

languages.forEach(lang => {
  const filePath = path.join(__dirname, '..', 'src', 'locales', lang, 'recipes.json')
  recipeFiles[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  console.log(`✅ Loaded ${lang} recipes`)
})

// Read translation files to get ingredient translations
const translationFiles = {}
languages.forEach(lang => {
  const filePath = path.join(__dirname, '..', 'src', 'locales', lang, 'translation.json')
  translationFiles[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  console.log(`✅ Loaded ${lang} translations`)
})

// Function to check if a string is a raw ingredient ID
function isRawIngredientId(str) {
  // Check if it's a simple ingredient ID (no spaces, no units, no Chinese characters)
  return !str.includes(' ') && 
         !str.includes('，') && 
         !str.includes(',') && 
         !str.includes('克') && 
         !str.includes('汤匙') && 
         !str.includes('瓣') && 
         !str.includes('个') && 
         !str.includes('杯') && 
         !str.includes('磅') && 
         !str.includes('tbsp') && 
         !str.includes('cup') && 
         !str.includes('lb') && 
         !str.includes('oz') &&
         !str.includes('盎司') &&
         !str.includes('茶匙') &&
         !str.includes('大') &&
         !str.includes('中') &&
         !str.includes('小') &&
         !str.includes('半') &&
         !str.includes('四分之一') &&
         !str.includes('块') &&
         !str.includes('片') &&
         !str.includes('条') &&
         !str.includes('根') &&
         !str.includes('张') &&
         !str.includes('罐') &&
         !str.includes('颗')
}

// Function to get translated ingredient name
function getTranslatedIngredient(ingredientId, language) {
  const translations = translationFiles[language]
  return translations[ingredientId] || ingredientId
}

// Function to fix ingredientsWithAmounts array
function fixIngredientsWithAmounts(ingredientsArray, language) {
  return ingredientsArray.map(ingredient => {
    if (isRawIngredientId(ingredient)) {
      const translated = getTranslatedIngredient(ingredient, language)
      console.log(`  🔄 ${ingredient} → ${translated} (${language})`)
      return translated
    }
    return ingredient
  })
}

// Process each language file
languages.forEach(lang => {
  console.log(`\n🔧 Processing ${lang} recipes...`)
  let totalFixed = 0
  
  // Process basic recipes
  if (recipeFiles[lang].basic) {
    Object.keys(recipeFiles[lang].basic).forEach(category => {
      if (Array.isArray(recipeFiles[lang].basic[category])) {
        recipeFiles[lang].basic[category].forEach(recipe => {
          if (recipe.ingredientsWithAmounts) {
            const originalLength = recipe.ingredientsWithAmounts.length
            recipe.ingredientsWithAmounts = fixIngredientsWithAmounts(recipe.ingredientsWithAmounts, lang)
            const fixedCount = recipe.ingredientsWithAmounts.filter((ing, index) => 
              ing !== recipe.ingredientsWithAmounts[index] || isRawIngredientId(recipe.ingredientsWithAmounts[index])
            ).length
            totalFixed += fixedCount
          }
        })
      }
    })
  }
  
  // Process cultural recipes
  if (recipeFiles[lang].cultural) {
    Object.keys(recipeFiles[lang].cultural).forEach(cuisine => {
      if (Array.isArray(recipeFiles[lang].cultural[cuisine])) {
        recipeFiles[lang].cultural[cuisine].forEach(recipe => {
          if (recipe.ingredientsWithAmounts) {
            const originalLength = recipe.ingredientsWithAmounts.length
            recipe.ingredientsWithAmounts = fixIngredientsWithAmounts(recipe.ingredientsWithAmounts, lang)
            const fixedCount = recipe.ingredientsWithAmounts.filter((ing, index) => 
              ing !== recipe.ingredientsWithAmounts[index] || isRawIngredientId(recipe.ingredientsWithAmounts[index])
            ).length
            totalFixed += fixedCount
          }
        })
      }
    })
  }
  
  console.log(`✅ Fixed ${totalFixed} ingredients in ${lang}`)
})

// Write the fixed files back
languages.forEach(lang => {
  const filePath = path.join(__dirname, '..', 'src', 'locales', lang, 'recipes.json')
  fs.writeFileSync(filePath, JSON.stringify(recipeFiles[lang], null, 2), 'utf8')
  console.log(`💾 Saved ${lang} recipes`)
})

console.log('\n🎉 Language mixing fix complete!')
console.log('📝 All raw ingredient IDs in ingredientsWithAmounts have been translated.')
