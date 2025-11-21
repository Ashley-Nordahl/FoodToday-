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
        <p>Loading image...</p>
      </div>
    )
  }

  if (!imageUrl) {
    return null
  }

  return (
    <div className="recipe-image-container">
      <img 
        src={imageUrl} 
        alt={alt || 'Recipe'}
        className="recipe-main-image"
        onError={(e) => {
          console.error('Image failed to load:', imageUrl);
          setHasError(true);
          // Hide the broken image
          e.target.style.display = 'none';
        }}
        onLoad={() => {
          console.log('Image loaded successfully:', imageUrl);
        }}
      />
      {hasError && (
        <div className="recipe-image-fallback" style={{
          width: '100%',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          fontSize: '4rem',
          borderRadius: '1rem 1rem 0 0'
        }}>
          🍽️
        </div>
      )}
    </div>
  )
}

export default RecipeImage
