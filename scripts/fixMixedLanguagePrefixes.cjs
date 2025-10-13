/**
 * Fix Mixed Language Prefixes Script
 * 
 * This script specifically targets and fixes the mixed language prefixes
 * like "Prep: 240 min" and "difficulty.困难" that are causing the display issues.
 */

const fs = require('fs')
const path = require('path')

// Define the locales directory
const localesDir = path.join(__dirname, '..', 'src', 'locales')

// Language codes to process
const languages = ['en', 'zh', 'sv']

/**
 * Fix mixed language prefixes in recipe metadata
 */
function fixMixedLanguagePrefixes(recipe, language) {
  if (!recipe || typeof recipe !== 'object') return recipe
  
  const fixed = { ...recipe }
  
  // Fix prep_time - remove "Prep:" prefix
  if (fixed.prep_time && typeof fixed.prep_time === 'string') {
    fixed.prep_time = fixed.prep_time
      .replace(/^Prep:\s*/i, '')
      .replace(/^prep:\s*/i, '')
      .replace(/^Preparation:\s*/i, '')
      .trim()
  }
  
  // Fix cook_time - remove "Cook:" prefix
  if (fixed.cook_time && typeof fixed.cook_time === 'string') {
    fixed.cook_time = fixed.cook_time
      .replace(/^Cook:\s*/i, '')
      .replace(/^cook:\s*/i, '')
      .replace(/^Cooking:\s*/i, '')
      .trim()
  }
  
  // Fix total_time - remove "Total:" prefix
  if (fixed.total_time && typeof fixed.total_time === 'string') {
    fixed.total_time = fixed.total_time
      .replace(/^Total:\s*/i, '')
      .replace(/^total:\s*/i, '')
      .replace(/^Time:\s*/i, '')
      .trim()
  }
  
  // Fix difficulty - remove "difficulty." prefix
  if (fixed.difficulty && typeof fixed.difficulty === 'string') {
    fixed.difficulty = fixed.difficulty
      .replace(/^difficulty\./i, '')
      .replace(/^Difficulty:\s*/i, '')
      .replace(/^difficulty:\s*/i, '')
      .trim()
  }
  
  // Fix servings - remove "Servings:" prefix
  if (fixed.servings && typeof fixed.servings === 'string') {
    fixed.servings = fixed.servings
      .replace(/^Servings:\s*/i, '')
      .replace(/^servings:\s*/i, '')
      .replace(/^Portions:\s*/i, '')
      .trim()
  }
  
  // Fix cuisine - remove "Cuisine:" prefix
  if (fixed.cuisine && typeof fixed.cuisine === 'string') {
    fixed.cuisine = fixed.cuisine
      .replace(/^Cuisine:\s*/i, '')
      .replace(/^cuisine:\s*/i, '')
      .replace(/^Style:\s*/i, '')
      .trim()
  }
  
  return fixed
}

/**
 * Process a single recipe file and fix mixed language prefixes
 */
function processRecipeFile(filePath, language) {
  try {
    console.log(`Processing ${language}/recipes.json for mixed language prefixes...`)
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const recipeData = JSON.parse(fileContent)
    
    let fixedCount = 0
    let totalCount = 0
    
    // Process nested structure: cultural and basic recipes
    const cleanedData = { ...recipeData }
    
    // Process cultural recipes
    if (cleanedData.cultural && typeof cleanedData.cultural === 'object') {
      Object.keys(cleanedData.cultural).forEach(cuisine => {
        if (Array.isArray(cleanedData.cultural[cuisine])) {
          cleanedData.cultural[cuisine] = cleanedData.cultural[cuisine].map(recipe => {
            totalCount++
            const fixed = fixMixedLanguagePrefixes(recipe, language)
            
            // Check if any changes were made
            const hasChanges = JSON.stringify(recipe) !== JSON.stringify(fixed)
            if (hasChanges) {
              fixedCount++
              console.log(`  🔧 Fixed recipe: ${recipe.name || recipe.id}`)
            }
            
            return fixed
          })
        }
      })
    }
    
    // Process basic recipes
    if (cleanedData.basic && typeof cleanedData.basic === 'object') {
      Object.keys(cleanedData.basic).forEach(cookingMethod => {
        if (typeof cleanedData.basic[cookingMethod] === 'object') {
          Object.keys(cleanedData.basic[cookingMethod]).forEach(dishName => {
            const recipe = cleanedData.basic[cookingMethod][dishName]
            if (recipe && typeof recipe === 'object') {
              totalCount++
              const fixed = fixMixedLanguagePrefixes(recipe, language)
              
              // Check if any changes were made
              const hasChanges = JSON.stringify(recipe) !== JSON.stringify(fixed)
              if (hasChanges) {
                fixedCount++
                console.log(`  🔧 Fixed recipe: ${recipe.name || dishName}`)
              }
              
              cleanedData.basic[cookingMethod][dishName] = fixed
            }
          })
        }
      })
    }
    
    // Write back the fixed data
    if (fixedCount > 0) {
      fs.writeFileSync(filePath, JSON.stringify(cleanedData, null, 2), 'utf8')
      console.log(`✅ Fixed ${fixedCount} out of ${totalCount} recipes in ${language}/recipes.json`)
    } else {
      console.log(`✅ No mixed language prefixes found in ${language}/recipes.json (${totalCount} recipes checked)`)
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${language}/recipes.json:`, error.message)
  }
}

/**
 * Main execution function
 */
function main() {
  console.log('🔧 Starting mixed language prefix fix...\n')
  console.log('🎯 This will fix:')
  console.log('  - "Prep: 240 min" → "240 min"')
  console.log('  - "difficulty.困难" → "困难"')
  console.log('  - "Cook: 30 min" → "30 min"')
  console.log('  - "Total: 60 min" → "60 min"')
  console.log('  - "Servings: 4" → "4"')
  console.log('  - "Cuisine: Chinese" → "Chinese"\n')
  
  // Process each language
  languages.forEach(language => {
    const recipeFile = path.join(localesDir, language, 'recipes.json')
    
    if (fs.existsSync(recipeFile)) {
      processRecipeFile(recipeFile, language)
    } else {
      console.log(`⚠️  Recipe file not found: ${language}/recipes.json`)
    }
  })
  
  console.log(`\n🎉 Mixed language prefix fix completed!`)
  console.log('✨ All recipe metadata should now display clean values!')
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = {
  fixMixedLanguagePrefixes,
  processRecipeFile
}
