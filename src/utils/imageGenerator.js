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
 * Get local image URL from recipe ID
 * Maps recipe ID prefix to region folder name
 * @param {object} recipe - Recipe object with id field
 * @returns {string|null} Local image URL or null if not available
 */
export const getLocalRecipeImageUrl = (recipe) => {
  if (!recipe || !recipe.id) return null;
  
  // Map ID prefix to region folder name
  const regionMap = {
    'AS': 'Asia',
    'EU': 'Europe',
    'AF': 'Africa',
    'NA': 'NorthAmerica',
    'SA': 'SouthAmerica',
    'LA': 'LatinAmerica',
    'MI': 'MiddleEast',
    'ME': 'MiddleEast' // Alternative prefix
  };
  
  // Extract prefix (first 2 characters before first dash)
  const prefix = recipe.id.split('-')[0];
  const region = regionMap[prefix] || 'Asia'; // Default fallback
  
  // Try common image extensions - the browser will handle 404s gracefully
  // We'll try .png first as it's most common, but the actual file extension
  // should match what's in the folder
  return `/Recipe Image/${region}/${recipe.id}.png`;
};

/**
 * Check if a local image exists (client-side check)
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} True if image exists
 */
const checkImageExists = (url) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      // Server-side: assume it exists
      resolve(true);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Get image URL from recipe data (supports local images, image_url field, and generated)
 * Priority: 1. Local image, 2. image_url field, 3. Generated images
 * @param {object} recipe - Recipe object
 * @param {string} currentLanguage - Current language code
 * @returns {Promise<string>} Image URL
 */
export const getRecipeImageUrl = async (recipe, currentLanguage = 'en') => {
  // 1. If recipe already has an image_url, use it first (highest priority)
  if (recipe.image_url && recipe.image_url.trim() !== '') {
    // If it's a local path (starts with /Recipe Image/), use it directly
    // The browser will handle 404s gracefully via onError handler
    if (recipe.image_url.startsWith('/Recipe Image/')) {
      return recipe.image_url;
    } else {
      // External URL, return as-is
      return recipe.image_url;
    }
  }
  
  // 2. Check for local image (in public/Recipe Image/) as fallback
  const localImageUrl = getLocalRecipeImageUrl(recipe);
  if (localImageUrl) {
    // Use local image directly - browser will handle missing files
    return localImageUrl;
  }
  
  // 3. Otherwise, generate from dish name
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
