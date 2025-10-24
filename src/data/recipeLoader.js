// New Recipe Data Loader
// Loads recipes from organized JSON files in /src/recipes/

import meatRecipes from '../recipes/meat.json'
import seafoodRecipes from '../recipes/seafood.json'
import vegetablesRecipes from '../recipes/vegetables.json'
import grainsRecipes from '../recipes/grains.json'
import eggsRecipes from '../recipes/eggs.json'
import beansRecipes from '../recipes/beans.json'

// Combine all recipes into a single array
const allRecipes = [
  ...meatRecipes,
  ...seafoodRecipes,
  ...vegetablesRecipes,
  ...grainsRecipes,
  ...eggsRecipes,
  ...beansRecipes
]

// Recipe data access functions
export const getRecipeById = (id) => {
  return allRecipes.find(recipe => recipe.id === id)
}

export const getRecipesByCategory = (category) => {
  return allRecipes.filter(recipe => recipe.category === category)
}

export const getRecipesByCuisine = (cuisine) => {
  return allRecipes.filter(recipe => recipe.cuisine === cuisine)
}

export const getRecipesBySubcategory = (subcategory) => {
  return allRecipes.filter(recipe => recipe.subcategory === subcategory)
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
  return allRecipes.filter(recipe => recipe.difficulty === difficulty)
}

export const getRecipesByTime = (maxTimeMinutes) => {
  return allRecipes.filter(recipe => recipe.total_time_min <= maxTimeMinutes)
}

export const searchRecipes = (query) => {
  const lowercaseQuery = query.toLowerCase()
  return allRecipes.filter(recipe => {
    // Search in dish names (all languages)
    const nameMatch = Object.values(recipe.dish_name).some(name => 
      name.toLowerCase().includes(lowercaseQuery)
    )
    
    // Search in descriptions (all languages)
    const descMatch = Object.values(recipe.description).some(desc => 
      desc.toLowerCase().includes(lowercaseQuery)
    )
    
    // Search in ingredients (all languages)
    const ingredientMatch = Object.values(recipe.ingredients).some(ingredientList => 
      ingredientList.some(ingredient => 
        ingredient.toLowerCase().includes(lowercaseQuery)
      )
    )
    
    return nameMatch || descMatch || ingredientMatch
  })
}

// Get all unique categories
export const getAllCategories = () => {
  const categories = [...new Set(allRecipes.map(recipe => recipe.category))]
  return categories.sort()
}

// Get all unique cuisines
export const getAllCuisines = () => {
  const cuisines = [...new Set(allRecipes.map(recipe => recipe.cuisine))]
  return cuisines.sort()
}

// Get all unique subcategories
export const getAllSubcategories = () => {
  const subcategories = [...new Set(allRecipes.map(recipe => recipe.subcategory))]
  return subcategories.sort()
}

// Get all unique difficulties
export const getAllDifficulties = () => {
  const difficulties = [...new Set(allRecipes.map(recipe => recipe.difficulty))]
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
