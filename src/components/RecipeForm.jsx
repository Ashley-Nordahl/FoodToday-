import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { addRecipe } from '../lib/supabase'

function RecipeForm({ onSuccess, onClose }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [url, setUrl] = useState('')

  // Simple URL parser for ICA.se recipes
  const parseIcaRecipe = (url) => {
    try {
      // Extract recipe ID from URL - handle trailing slash
      const cleanUrl = url.replace(/\/$/, '') // Remove trailing slash
      const urlParts = cleanUrl.split('/')
      const lastPart = urlParts[urlParts.length - 1]
      
      // Extract recipe ID from the last part
      const recipeId = lastPart.split('-').pop()
      
      
      // Mock recipe data based on URL - you can expand this with real parsing
      const mockRecipes = {
        '729067': {
          name: 'Helstekt kyckling i ugn',
          emoji: '🍗',
          description: 'Enkelt och gott recept på helstekt kyckling i ugn smaksatt med honung, soja och färska örter.',
          type: 'dish',
          source_website: 'ICA.se',
          source_url: url,
          ingredients: [
            '1 hel kyckling (ca 1,5 kg)',
            '2 msk honung',
            '2 msk sojasås',
            '2 klyftor vitlök',
            '1 msk färsk rosmarin',
            '1 msk färsk timjan',
            'salt och svartpeppar',
            'olja för stekning'
          ],
          instructions: [
            'Sätt ugnen på 200°C.',
            'Mixa honung, sojasås, pressad vitlök och hackade örter.',
            'Gnid kycklingen med salt och peppar.',
            'Bred på honungssåsen över kycklingen.',
            'Stek i ugnen i ca 60-75 minuter tills köttet är genomstekt.',
            'Låt vila 10 minuter innan servering.'
          ],
          prep_time: '15 min',
          cook_time: '75 min',
          total_time: '90 min',
          servings: '4',
          difficulty: 'Medium',
          cuisine: 'Svensk',
          tags: ['kyckling', 'ugn', 'huvudrätt']
        },
        '725504': {
          name: 'Shish kebab med pitabröd',
          emoji: '🥙',
          description: 'Hemlagad shish kebab med pitabröd, färska grönsaker och vitlökssås.',
          type: 'dish',
          source_website: 'ICA.se',
          source_url: url,
          ingredients: [
            '500 g nötfärs',
            '1 gul lök',
            '2 klyftor vitlök',
            '1 msk spiskummin',
            '1 msk paprikapulver',
            'salt och peppar',
            '4 pitabröd',
            '2 tomater',
            '1 gurka',
            '1 rödlök',
            '2 dl turkisk yoghurt',
            '1 klyfta vitlök till sås'
          ],
          instructions: [
            'Blanda färs med finhackad lök, vitlök och kryddor.',
            'Forma små köttbullar eller längre kebab.',
            'Stek kebaben i olja tills de är genomstekta.',
            'Värm pitabröd enligt anvisning på förpackningen.',
            'Skiva tomater, gurka och rödlök.',
            'Gör vitlökssås: blanda yoghurt med pressad vitlök.',
            'Lägg kebab, grönsaker och sås i pitabrödet.',
            'Servera omedelbart.'
          ],
          prep_time: '20 min',
          cook_time: '15 min',
          total_time: '35 min',
          servings: '4',
          difficulty: 'Medium',
          cuisine: 'Turkisk',
          tags: ['kebab', 'pitabröd', 'mellanöstern']
        },
        '750034': {
          name: 'Krämig kantarellpasta med parmesan',
          emoji: '🍝',
          description: 'Delikat pasta med kantareller, grädde och parmesanost.',
          type: 'dish',
          source_website: 'ICA.se',
          source_url: url,
          ingredients: [
            '400 g pasta',
            '300 g kantareller',
            '1 gul lök',
            '2 klyftor vitlök',
            '2 dl grädde',
            '1 dl parmesanost, riven',
            '2 msk smör',
            'salt och peppar',
            'färsk persilja'
          ],
          instructions: [
            'Koka pastan enligt anvisning på förpackningen.',
            'Skiva kantarellerna och hacka löken.',
            'Stek löken i smör tills den blir mjuk.',
            'Tillsätt kantareller och låt steka några minuter.',
            'Häll i grädden och låt koka ihop.',
            'Rör ner riven parmesan.',
            'Blanda med den kokta pastan.',
            'Krydda med salt, peppar och hackad persilja.'
          ],
          prep_time: '10 min',
          cook_time: '20 min',
          total_time: '30 min',
          servings: '4',
          difficulty: 'Easy',
          cuisine: 'Italiensk',
          tags: ['pasta', 'kantareller', 'svamp', 'parmesan']
        }
      }
      
      const recipe = mockRecipes[recipeId]
      if (!recipe) {
        throw new Error(`Recipe not found for ID: ${recipeId}. Supported IDs: ${Object.keys(mockRecipes).join(', ')}`)
      }
      
      return recipe
    } catch (error) {
      throw new Error(`Failed to parse recipe URL: ${error.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Parse the recipe from URL
      const recipeData = parseIcaRecipe(url)
      
      // Add the recipe to the database
      const { data, error: addError } = await addRecipe(user.id, recipeData)

      if (addError) {
        setError(`Failed to save recipe: ${addError.message}`)
      } else {
        onSuccess(data)
        onClose()
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recipe-form-overlay" onClick={onClose}>
      <div className="recipe-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>📝 Add New Recipe</h2>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>

        <div className="form-content">
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Import Recipe from URL</h3>
              
              <div className="form-group">
                <label htmlFor="url">Recipe URL:</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/recipe"
                  required
                />
              </div>

              <div className="supported-sites">
                <p><strong>Supported websites:</strong></p>
                <ul>
                  <li>ICA.se - Swedish recipes</li>
                  <li>More sites coming soon...</li>
                </ul>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || !url.trim()}
              >
                {loading ? 'Importing...' : 'Import Recipe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RecipeForm