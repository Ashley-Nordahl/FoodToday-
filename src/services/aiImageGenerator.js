/**
 * AI Image Generator using OpenAI DALL-E
 * Requires: VITE_OPENAI_API_KEY environment variable
 */

/**
 * Generate AI image for a dish using OpenAI DALL-E
 * @param {string} dishName - Name of the dish
 * @returns {Promise<string>} Image URL
 */
export const generateAIImage = async (dishName) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    // No API key - use free Foodish API for real food images
    return await getFallbackImage(dishName)
  }

  try {
    const prompt = createImagePrompt(dishName)
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-2',
        prompt: prompt,
        n: 1,
        size: '512x512',
        quality: 'standard'
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.data && data.data[0] && data.data[0].url) {
      return data.data[0].url
    }
    
    throw new Error('No image URL in response')
    
  } catch (error) {
    console.error('AI image generation failed:', error)
    return getFallbackImage(dishName)
  }
}

/**
 * Create an optimized prompt for dish image generation
 * @param {string} dishName - Name of the dish
 * @returns {string} Optimized prompt
 */
const createImagePrompt = (dishName) => {
  return `Professional food photography of ${dishName}, beautiful plating, restaurant quality, high resolution, appetizing, well-lit, on a white plate`
}

/**
 * Get fallback image URL when AI generation fails
 * @param {string} dishName - Name of the dish
 * @returns {Promise<string>} Fallback image URL
 */
const getFallbackImage = async (dishName) => {
  // Use free Foodish API for real food images
  try {
    const response = await fetch('https://foodish-api.com/api/')
    const data = await response.json()
    return data.image
  } catch (error) {
    console.error('Foodish API failed:', error)
    // Ultimate fallback to simple placeholder
    const randomId = Math.floor(Math.random() * 100) + 1
    return `https://picsum.photos/600/400?random=${randomId}`
  }
}

/**
 * Check if AI image generation is available
 * @returns {boolean} True if API key is available
 */
export const isAIAvailable = () => {
  return !!import.meta.env.VITE_OPENAI_API_KEY
}
