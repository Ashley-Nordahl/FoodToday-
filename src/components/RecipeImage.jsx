import { useState, useEffect } from 'react'
import { getRecipeImageUrl } from '../utils/imageGenerator'

const RecipeImage = ({ recipe, language, alt }) => {
  const [imageUrl, setImageUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true)
      setHasError(false)
      
      try {
        const url = await getRecipeImageUrl(recipe, language)
        setImageUrl(url)
      } catch (error) {
        console.error('Error loading image:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (recipe) {
      loadImage()
    }
  }, [recipe, language])

  if (isLoading) {
    return (
      <div className="recipe-image-loading">
        <div className="loading-spinner">🍽️</div>
        <p>Generating image...</p>
      </div>
    )
  }

  if (hasError || !imageUrl) {
    return null
  }

  return (
    <div className="recipe-image-container">
      <img 
        src={imageUrl} 
        alt={alt || 'Recipe'}
        className="recipe-main-image"
        onError={() => {
          setHasError(true)
        }}
      />
    </div>
  )
}

export default RecipeImage
