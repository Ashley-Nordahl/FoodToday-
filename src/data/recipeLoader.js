// New Recipe Data Loader
// Loads recipes from organized JSON files in /src/recipes/

import africaRecipes from '../recipes/Africa.json'
import asiaRecipes from '../recipes/Asia.json'
import europeRecipes from '../recipes/Europe.json'
import latinAmericaRecipes from '../recipes/LatinAmerica.json'
import middleEastRecipes from '../recipes/MiddleEast.json'
import northAmericaRecipes from '../recipes/NorthAmerica.json'
import southAmericaRecipes from '../recipes/SouthAmerica.json'

// Combine all recipes into a single array
const allRecipes = [
  ...africaRecipes,
  ...asiaRecipes,
  ...europeRecipes,
  ...latinAmericaRecipes,
  ...middleEastRecipes,
  ...northAmericaRecipes,
  ...southAmericaRecipes
]

// Recipe data access functions
export const getRecipeById = (id) => {
  return allRecipes.find(recipe => recipe.id === id)
}

export const getRecipesByCategory = (category) => {
  return allRecipes.filter(recipe => {
    const currentLanguage = 'en' // Default to English for now
    return recipe.main_type?.[currentLanguage] === category || recipe.main_type?.en === category
  })
}

export const getRecipesByCuisine = (cuisine) => {
  return allRecipes.filter(recipe => {
    const currentLanguage = 'en' // Default to English for now
    return recipe.region?.[currentLanguage] === cuisine || recipe.region?.en === cuisine
  })
}

export const getRecipesBySubcategory = (subcategory) => {
  return allRecipes.filter(recipe => {
    const currentLanguage = 'en' // Default to English for now
    return recipe.subcategory?.[currentLanguage] === subcategory || recipe.subcategory?.en === subcategory
  })
}

export const getRandomRecipe = () => {
  const randomIndex = Math.floor(Math.random() * allRecipes.length)
  return allRecipes[randomIndex]
}

export const getRandomRecipeByCategory = (category) => {
  const categoryRecipes = getRecipesByCategory(category)
  if (categoryRecipes.length === 0) return null
  const randomIndex = Math.floor(Math.random() * categoryRecipes.length)
  return categoryRecipes[randomIndex]
}

export const getRandomRecipeByCuisine = (cuisine) => {
  const cuisineRecipes = getRecipesByCuisine(cuisine)
  if (cuisineRecipes.length === 0) return null
  const randomIndex = Math.floor(Math.random() * cuisineRecipes.length)
  return cuisineRecipes[randomIndex]
}

export const getRecipesByDifficulty = (difficulty) => {
  return allRecipes.filter(recipe => {
    const currentLanguage = 'en' // Default to English for now
    return recipe.difficulty?.[currentLanguage] === difficulty || recipe.difficulty?.en === difficulty
  })
}

export const getRecipesByTime = (maxTimeMinutes) => {
  return allRecipes.filter(recipe => recipe.total_time_min <= maxTimeMinutes)
}

export const searchRecipes = (query) => {
  const lowercaseQuery = query.toLowerCase()
  
  // Create search variations for common cuisine terms
  const searchVariations = [lowercaseQuery]
  
  // Add common variations for cuisine searches
  if (lowercaseQuery === 'chinese' || lowercaseQuery === 'china') {
    searchVariations.push('china', 'chinese')
  }
  if (lowercaseQuery === 'japanese' || lowercaseQuery === 'japan') {
    searchVariations.push('japan', 'japanese')
  }
  if (lowercaseQuery === 'korean' || lowercaseQuery === 'korea') {
    searchVariations.push('korea', 'korean')
  }
  if (lowercaseQuery === 'thai' || lowercaseQuery === 'thailand') {
    searchVariations.push('thailand', 'thai')
  }
  if (lowercaseQuery === 'indian' || lowercaseQuery === 'india') {
    searchVariations.push('india', 'indian')
  }
  if (lowercaseQuery === 'malaysian' || lowercaseQuery === 'malaysia') {
    searchVariations.push('malaysia', 'malaysian')
  }
  
  return allRecipes.filter(recipe => {
    // Search in dish names (all languages)
    const nameMatch = Object.values(recipe.dish_name).some(name => 
      searchVariations.some(variation => name.toLowerCase().includes(variation))
    )
    
    // Search in descriptions (all languages)
    const descMatch = Object.values(recipe.description).some(desc => 
      searchVariations.some(variation => desc.toLowerCase().includes(variation))
    )
    
    // Search in ingredients (all languages)
    const ingredientMatch = Object.values(recipe.ingredients).some(ingredientList => 
      ingredientList.some(ingredient => 
        searchVariations.some(variation => ingredient.toLowerCase().includes(variation))
      )
    )
    
    // Search in cuisine category (region) - all languages
    const regionMatch = Object.values(recipe.region).some(region => 
      searchVariations.some(variation => region.toLowerCase().includes(variation))
    )
    
    // Search in cuisine subcategory - all languages
    const subcategoryMatch = Object.values(recipe.subcategory).some(subcategory => 
      searchVariations.some(variation => subcategory.toLowerCase().includes(variation))
    )
    
    // Search in main type (ingredient categories) - all languages
    const mainTypeMatch = Object.values(recipe.main_type).some(mainType => 
      searchVariations.some(variation => mainType.toLowerCase().includes(variation))
    )
    
    return nameMatch || descMatch || ingredientMatch || regionMatch || subcategoryMatch || mainTypeMatch
  })
}

// Get all unique categories (main_type)
export const getAllCategories = () => {
  const categories = [...new Set(allRecipes.map(recipe => recipe.main_type?.en || recipe.main_type?.zh || recipe.main_type?.sv))]
  return categories.sort()
}

// Get all unique cuisines (regions)
export const getAllCuisines = () => {
  const cuisines = [...new Set(allRecipes.map(recipe => recipe.region?.en || recipe.region?.zh || recipe.region?.sv))]
  return cuisines.sort()
}

// Get all unique subcategories
export const getAllSubcategories = () => {
  const subcategories = [...new Set(allRecipes.map(recipe => recipe.subcategory?.en || recipe.subcategory?.zh || recipe.subcategory?.sv))]
  return subcategories.sort()
}

// Get all unique difficulties
export const getAllDifficulties = () => {
  const difficulties = [...new Set(allRecipes.map(recipe => recipe.difficulty?.en || recipe.difficulty?.zh || recipe.difficulty?.sv))]
  return difficulties.sort()
}

// Get recipe statistics
export const getRecipeStats = () => {
  return {
    totalRecipes: allRecipes.length,
    categories: getAllCategories().length,
    cuisines: getAllCuisines().length,
    subcategories: getAllSubcategories().length,
    difficulties: getAllDifficulties().length
  }
}

// Export all recipes for components that need the full dataset
export const getAllRecipes = () => allRecipes

export default {
  getRecipeById,
  getRecipesByCategory,
  getRecipesByCuisine,
  getRecipesBySubcategory,
  getRandomRecipe,
  getRandomRecipeByCategory,
  getRandomRecipeByCuisine,
  getRecipesByDifficulty,
  getRecipesByTime,
  searchRecipes,
  getAllCategories,
  getAllCuisines,
  getAllSubcategories,
  getAllDifficulties,
  getRecipeStats,
  getAllRecipes
}
