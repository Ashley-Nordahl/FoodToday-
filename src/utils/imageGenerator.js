/**
 * Generate AI image URLs for dishes
 * Uses AI generation first, with fallbacks
 */
import { generateAIImage, isAIAvailable } from '../services/aiImageGenerator'

/**
 * Generate image URL from Foodish API (free, reliable, food-specific)
 * @param {string} dishName - Name of the dish
 * @returns {string} Image URL
 */
const generateFoodishUrl = (dishName) => {
  // Foodish provides random food images - no need to encode dish name
  return 'https://foodish-api.com/images/burger/burger1.jpg'
}

/**
 * Generate image URL from Pixabay (fallback option)
 * @param {string} dishName - Name of the dish
 * @returns {string} Image URL
 */
const generatePixabayUrl = (dishName) => {
  const cleanName = dishName
    .trim()
    .replace(/\(.*?\)/g, '') // Remove parentheses
    .replace(/[^\w\s]/g, '') // Remove special characters
    .toLowerCase()
    .trim()
  
  // Pixabay free food images (no API key needed for basic usage)
  return `https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_640.jpg`
}

/**
 * Generate image URL from Unsplash (deprecated - currently down)
 * @param {string} dishName - Name of the dish
 * @returns {string} Image URL
 */
const generateUnsplashUrl = (dishName) => {
  const cleanName = dishName
    .trim()
    .replace(/\(.*?\)/g, '') // Remove parentheses
    .replace(/[^\w\s]/g, '') // Remove special characters
    .toLowerCase()
    .trim()
  
  // Use smaller, more fitful image size for app view (600x400 for better mobile performance)
  return `https://source.unsplash.com/600x400/?food,${encodeURIComponent(cleanName)}`
}

/**
 * Generate image URL from GitHub user's repo (foodpics)
 * @param {string} dishName - Name of the dish  
 * @returns {string} Image URL
 */
const generateGitHubUrl = (dishName) => {
  const cleanName = dishName
    .trim()
    .replace(/[^a-z0-9]/gi, '_') // Replace special chars with underscore
    .toLowerCase()
  
  // Use a food photos repository (you can replace with your own repo)
  return `https://raw.githubusercontent.com/foodpics/food/main/${cleanName}.jpg`
}

/**
 * Generate image URL with multiple fallback sources
 * @param {string} dishName - Name of the dish
 * @returns {string} Primary image URL
 */
export const generateDishImageUrl = (dishName) => {
  if (!dishName) return generateFoodishUrl('food')
  
  // Use free Foodish API for real food images
  // Returns random food images without API key or payment
  return 'https://foodish-api.com/api/'
}

// Helper to get random food image with retry
export const getFoodImage = async (dishName) => {
  try {
    // Create a unique, consistent URL based on dish name
    // This ensures same dish = same image, and different dishes = different images
    const dishHash = createDishHash(dishName)
    
    // Use placeholder.com for food images
    // Format: https://via.placeholder.com/600x400 with custom text
    const colorHash = dishHash % 0xFFFFFF
    const hexColor = colorHash.toString(16).padStart(6, '0')
    
    // Create a food-themed placeholder with the dish name
    const encodedName = encodeURIComponent(dishName.substring(0, 20)) // Limit length
    const imageUrl = `https://via.placeholder.com/600x400/${hexColor}/ffffff?text=${encodedName}`
    
    console.log('Generated image URL for dish:', dishName)
    return imageUrl
  } catch (error) {
    console.error('Image generation failed:', error)
    // Fallback to simple placeholder
    const randomId = Math.floor(Math.random() * 100) + 1
    const fallbackUrl = `https://picsum.photos/600/400?random=${randomId}`
    console.log('Using fallback URL:', fallbackUrl)
    return fallbackUrl
  }
}

// Helper to create a hash from dish name for consistent image selection
const createDishHash = (dishName) => {
  let hash = 0
  for (let i = 0; i < dishName.length; i++) {
    const char = dishName.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Helper to categorize dishes
const getDishCategory = (dishName) => {
  if (!dishName) return null
  
  const name = dishName.toLowerCase()
  
  // Map dish names to Foodish categories
  if (name.includes('pizza')) return 'pizza'
  if (name.includes('burger') || name.includes('hamburger')) return 'burger'
  if (name.includes('pasta')) return 'pasta'
  if (name.includes('soup')) return 'soup'
  if (name.includes('noodle')) return 'noodles'
  if (name.includes('biryani')) return 'biryani'
  if (name.includes('dessert') || name.includes('cake') || name.includes('sweet')) return 'dessert'
  if (name.includes('dosa')) return 'dosa'
  if (name.includes('idly') || name.includes('idli')) return 'idly'
  
  return null // Use random if no match
}

/**
 * Generate multiple image URL options for a dish
 * Returns an array of image URLs for fallback
 * @param {string} dishName - Name of the dish
 * @param {number} count - Number of image options to generate
 * @returns {string[]} Array of image URLs
 */
export const generateDishImageOptions = (dishName, count = 3) => {
  if (!dishName) return []
  
  const cleanName = dishName.trim().toLowerCase()
  const options = []
  
  // Create variations with different search terms
  const searchTerms = [
    `food,${cleanName}`,
    `${cleanName},dish`,
    `delicious,${cleanName}`,
    `healthy,${cleanName}`,
    `cuisine,${cleanName}`
  ]
  
  for (let i = 0; i < Math.min(count, searchTerms.length); i++) {
    const url = `https://source.unsplash.com/600x400/?${encodeURIComponent(searchTerms[i])}`
    options.push(url)
  }
  
  return options
}

/**
 * Get image URL from recipe data (supports both image_url field and generated)
 * @param {object} recipe - Recipe object
 * @param {string} currentLanguage - Current language code
 * @returns {Promise<string>} Image URL
 */
export const getRecipeImageUrl = async (recipe, currentLanguage = 'en') => {
  // If recipe already has an image_url, use it
  if (recipe.image_url) {
    return recipe.image_url
  }
  
  // Otherwise, generate from dish name
  const dishName = recipe.dish_name?.[currentLanguage] || 
                   recipe.dish_name?.en || 
                   recipe.name || 
                   'food'
  
  // Try AI generation first if available
  if (isAIAvailable()) {
    try {
      const aiImageUrl = await generateAIImage(dishName)
      return aiImageUrl
    } catch (error) {
      console.error('AI generation failed, using fallback:', error)
      // Fall through to get free food image
    }
  }
  
  // Use free Foodish API to get a real food image
  return await getFoodImage(dishName)
}
