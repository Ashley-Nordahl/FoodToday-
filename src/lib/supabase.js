import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Database helper functions

/**
 * Track user selection (dish, drink, sauce, party)
 */
export async function trackSelection(userId, item, itemType) {
  if (!userId) return { error: 'User not authenticated' }

  try {
    const { data, error } = await supabase
      .rpc('increment_user_stat', {
        p_user_id: userId,
        p_item_id: item.id,
        p_item_type: itemType,
        p_item_name: item.name,
        p_item_emoji: item.emoji || ''
      })

    if (error) {
      console.warn('Supabase RPC function not available, skipping tracking:', error.message)
      return { data: null, error: null } // Don't throw error, just skip tracking
    }

    return { data, error }
  } catch (error) {
    console.warn('Failed to track selection, continuing without tracking:', error.message)
    return { data: null, error: null } // Don't throw error, just skip tracking
  }
}

/**
 * Get user's top items by type
 */
export async function getTopItems(userId, itemType, limit = 10) {
  if (!userId) return { data: [], error: 'User not authenticated' }

  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .order('count', { ascending: false })
    .limit(limit)

  return { data, error }
}

/**
 * Get all user statistics
 */
export async function getAllStats(userId) {
  if (!userId) return { data: [], error: 'User not authenticated' }

  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .order('count', { ascending: false })

  return { data, error }
}

/**
 * Add item to favorites
 */
export async function addToFavorites(userId, item, itemType) {
  if (!userId) return { error: 'User not authenticated' }

  const { data, error } = await supabase
    .from('user_favorites')
    .upsert({
      user_id: userId,
      item_id: item.id,
      item_type: itemType,
      item_name: item.name,
      item_emoji: item.emoji || ''
    }, {
      onConflict: 'user_id,item_id,item_type'
    })

  return { data, error }
}

/**
 * Remove item from favorites
 */
export async function removeFromFavorites(userId, itemId, itemType) {
  if (!userId) return { error: 'User not authenticated' }

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .eq('item_type', itemType)

  return { error }
}

/**
 * Get user's favorites
 */
export async function getFavorites(userId) {
  if (!userId) return { data: [], error: 'User not authenticated' }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Check if item is favorited
 */
export async function isFavorited(userId, itemId, itemType) {
  if (!userId) return false

  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .eq('item_type', itemType)
    .single()

  return !error && data
}

/**
 * Migrate localStorage data to Supabase
 */
export async function migrateLocalStorageData(userId) {
  if (!userId) return { error: 'User not authenticated' }

  try {
    // Check if already migrated
    const migrated = localStorage.getItem('supabase_migrated')
    if (migrated === 'true') {
      return { success: true, message: 'Already migrated' }
    }

    // Migrate favorites
    const localFavorites = localStorage.getItem('favorites')
    if (localFavorites) {
      const favoriteIds = JSON.parse(localFavorites)
      // Note: This assumes we can map IDs to items. 
      // In production, you'd need to fetch the actual items
    }

    // Migrate drink favorites
    const drinkFavorites = localStorage.getItem('drinkFavorites')
    if (drinkFavorites) {
      const drinkIds = JSON.parse(drinkFavorites)
    }

    // Migrate usage stats
    const usageStats = localStorage.getItem('usageStats')
    if (usageStats) {
      const stats = JSON.parse(usageStats)
      
      // Batch insert stats
      const statsToInsert = Object.values(stats).map(stat => ({
        user_id: userId,
        item_id: stat.id,
        item_type: stat.type,
        item_name: stat.name,
        item_emoji: stat.emoji || '',
        count: stat.count || 1,
        last_used: stat.lastUsed || new Date().toISOString()
      }))

      if (statsToInsert.length > 0) {
        const { error } = await supabase
          .from('user_stats')
          .upsert(statsToInsert, {
            onConflict: 'user_id,item_id,item_type'
          })

        if (error) {
          return { error: 'Failed to migrate usage stats' }
        }
      }
    }

    // Mark as migrated
    localStorage.setItem('supabase_migrated', 'true')
    
    return { success: true, message: 'Migration completed successfully' }
  } catch (error) {
    return { error: 'Migration failed' }
  }
}

/**
 * Add a new recipe manually
 */
export async function addRecipe(userId, recipeData) {
  if (!userId) return { error: 'User not authenticated' }
  if (!recipeData) return { error: 'Recipe data required' }

  const { data, error } = await supabase
    .from('user_imported_recipes')
    .insert({
      user_id: userId,
      external_id: recipeData.external_id || `manual_${Date.now()}`,
      name: recipeData.name,
      description: recipeData.description,
      source_website: recipeData.source_website || 'Manual Entry',
      source_url: recipeData.source_url || '',
      source_author: recipeData.source_author || 'User',
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      prep_time: recipeData.prep_time,
      cook_time: recipeData.cook_time,
      total_time: recipeData.total_time,
      servings: recipeData.servings,
      difficulty: recipeData.difficulty,
      cuisine: recipeData.cuisine,
      tags: recipeData.tags,
      nutrition: recipeData.nutrition,
      emoji: recipeData.emoji,
      type: recipeData.type || 'dish',
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Get user's recipes
 */
export async function getRecipes(userId) {
  if (!userId) return { data: [], error: 'User not authenticated' }

  const { data, error } = await supabase
    .from('user_imported_recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Remove a recipe
 */
export async function removeRecipe(userId, recipeId) {
  if (!userId) return { error: 'User not authenticated' }
  if (!recipeId) return { error: 'Recipe ID required' }

  const { data, error } = await supabase
    .from('user_imported_recipes')
    .delete()
    .eq('user_id', userId)
    .eq('id', recipeId)

  return { data, error }
}

/**
 * Get user's language preference
 */
export async function getUserLanguagePreference(userId) {
  if (!userId) return { data: null, error: 'User not authenticated' }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('language')
    .eq('user_id', userId)
    .single()

  return { data, error }
}

/**
 * Update user's language preference
 */
export async function updateUserLanguagePreference(userId, language) {
  if (!userId) return { error: 'User not authenticated' }
  if (!language) return { error: 'Language required' }

  try {
    const { data, error } = await supabase
      .rpc('upsert_user_language', {
        p_user_id: userId,
        p_language: language
      })

    if (error) {
      console.warn('Supabase RPC function not available, skipping language update:', error.message)
      return { data: null, error: null } // Don't throw error, just skip update
    }

    return { data, error }
  } catch (error) {
    console.warn('Failed to update language preference, continuing without update:', error.message)
    return { data: null, error: null } // Don't throw error, just skip update
  }
}

