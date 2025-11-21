/**
 * INGREDIENT REGISTRY - SINGLE SOURCE OF TRUTH
 * 
 * This file defines ALL valid ingredient IDs used throughout the application.
 * Any ingredient used anywhere MUST be defined here first.
 * 
 * RULES:
 * 1. All IDs must be kebab-case (e.g., 'pork-belly', not 'porkBelly')
 * 2. All IDs must be unique
 * 3. Every ingredient MUST have translations in all language files
 * 4. Components MUST use these IDs, not define their own
 * 
 * To add a new ingredient:
 * 1. Add the ID to this registry
 * 2. Add translations to all language files (en, zh, sv)
 * 3. Run validation: npm run validate-translations
 */

// ============================================================================
// INGREDIENT REGISTRY
// ============================================================================

export const INGREDIENT_REGISTRY = {
  // Pork
  'pork-belly': { category: 'Meat', subcategory: 'Pork' },
  'pork-shoulder': { category: 'Meat', subcategory: 'Pork' },
  'pork-chops': { category: 'Meat', subcategory: 'Pork' },
  'pork-ribs': { category: 'Meat', subcategory: 'Pork' },
  'ground-pork': { category: 'Meat', subcategory: 'Pork' },
  'pork-tenderloin': { category: 'Meat', subcategory: 'Pork' },
  
  // Beef
  'beef-steak': { category: 'Meat', subcategory: 'Beef' },
  'ground-beef': { category: 'Meat', subcategory: 'Beef' },
  'beef-brisket': { category: 'Meat', subcategory: 'Beef' },
  'beef-ribs': { category: 'Meat', subcategory: 'Beef' },
  'beef-tenderloin': { category: 'Meat', subcategory: 'Beef' },
  
  // Lamb
  'lamb-chops': { category: 'Meat', subcategory: 'Lamb' },
  'ground-lamb': { category: 'Meat', subcategory: 'Lamb' },
  'lamb-shoulder': { category: 'Meat', subcategory: 'Lamb' },
  'lamb-leg': { category: 'Meat', subcategory: 'Lamb' },
  'lamb-ribs': { category: 'Meat', subcategory: 'Lamb' },
  
  // Chicken
  'chicken-breast': { category: 'Meat', subcategory: 'Chicken' },
  'chicken-thighs': { category: 'Meat', subcategory: 'Chicken' },
  'chicken-wings': { category: 'Meat', subcategory: 'Chicken' },
  'whole-chicken': { category: 'Meat', subcategory: 'Chicken' },
  'ground-chicken': { category: 'Meat', subcategory: 'Chicken' },
  
  // Duck
  'duck-breast': { category: 'Meat', subcategory: 'Duck' },
  'whole-duck': { category: 'Meat', subcategory: 'Duck' },
  'duck-legs': { category: 'Meat', subcategory: 'Duck' },
  
  // Processed Meats
  'bacon': { category: 'Meat', subcategory: 'Processed' },
  'sausage': { category: 'Meat', subcategory: 'Processed' },
  'ham': { category: 'Meat', subcategory: 'Processed' },
  'prosciutto': { category: 'Meat', subcategory: 'Processed' },
  
  // Fish
  'salmon': { category: 'Seafood', subcategory: 'Fish' },
  'tuna': { category: 'Seafood', subcategory: 'Fish' },
  'cod': { category: 'Seafood', subcategory: 'Fish' },
  'sea-bass': { category: 'Seafood', subcategory: 'Fish' },
  'mackerel': { category: 'Seafood', subcategory: 'Fish' },
  
  // Shellfish
  'shrimp': { category: 'Seafood', subcategory: 'Shellfish' },
  'scallops': { category: 'Seafood', subcategory: 'Shellfish' },
  'oysters': { category: 'Seafood', subcategory: 'Shellfish' },
  'crab-meat': { category: 'Seafood', subcategory: 'Shellfish' },
  'clams': { category: 'Seafood', subcategory: 'Shellfish' },
  
  // Cephalopods
  'squid': { category: 'Seafood', subcategory: 'Cephalopods' },
  'octopus': { category: 'Seafood', subcategory: 'Cephalopods' },
  'cuttlefish': { category: 'Seafood', subcategory: 'Cephalopods' },
  
  // Crustaceans
  'crab': { category: 'Seafood', subcategory: 'Crustaceans' },
  'lobster': { category: 'Seafood', subcategory: 'Crustaceans' },
  'prawns': { category: 'Seafood', subcategory: 'Crustaceans' },
  'crawfish': { category: 'Seafood', subcategory: 'Crustaceans' },
  'king-crab': { category: 'Seafood', subcategory: 'Crustaceans' },
  
  // Mollusks
  'mussels': { category: 'Seafood', subcategory: 'Mollusks' },
  'cockles': { category: 'Seafood', subcategory: 'Mollusks' },
  'abalone': { category: 'Seafood', subcategory: 'Mollusks' },
  
  // Processed Seafood
  'smoked-salmon': { category: 'Seafood', subcategory: 'Processed' },
  'canned-tuna': { category: 'Seafood', subcategory: 'Processed' },
  'fish-sticks': { category: 'Seafood', subcategory: 'Processed' },
  'surimi': { category: 'Seafood', subcategory: 'Processed' },
  'dried-fish': { category: 'Seafood', subcategory: 'Processed' },
  
  // Chicken Eggs
  'egg-white': { category: 'Egg', subcategory: 'Chicken Eggs' },
  'egg-yolk': { category: 'Egg', subcategory: 'Chicken Eggs' },
  
  // Other Bird Eggs
  'duck-egg': { category: 'Egg', subcategory: 'Other Bird Eggs' },
  'quail-egg': { category: 'Egg', subcategory: 'Other Bird Eggs' },
  'goose-egg': { category: 'Egg', subcategory: 'Other Bird Eggs' },
  'turkey-egg': { category: 'Egg', subcategory: 'Other Bird Eggs' },
  'ostrich-egg': { category: 'Egg', subcategory: 'Other Bird Eggs' },
  'pheasant-egg': { category: 'Egg', subcategory: 'Other Bird Eggs' },
  
  // Processed/Specialty Eggs
  'salted-egg': { category: 'Egg', subcategory: 'Processed / Specialty' },
  'century-egg': { category: 'Egg', subcategory: 'Processed / Specialty' },
  'pickled-egg': { category: 'Egg', subcategory: 'Processed / Specialty' },
  
  // General Vegetables
  'broccoli': { category: 'Vegetable', subcategory: 'General' },
  'cauliflower': { category: 'Vegetable', subcategory: 'General' },
  'spinach': { category: 'Vegetable', subcategory: 'General' },
  'kale': { category: 'Vegetable', subcategory: 'General' },
  'carrots': { category: 'Vegetable', subcategory: 'General' },
  'zucchini': { category: 'Vegetable', subcategory: 'General' },
  'bell-pepper': { category: 'Vegetable', subcategory: 'General' },
  
  // Mushrooms
  'button-mushroom': { category: 'Vegetable', subcategory: 'Mushrooms' },
  'shiitake': { category: 'Vegetable', subcategory: 'Mushrooms' },
  'portobello': { category: 'Vegetable', subcategory: 'Mushrooms' },
  'oyster-mushroom': { category: 'Vegetable', subcategory: 'Mushrooms' },
  'enoki': { category: 'Vegetable', subcategory: 'Mushrooms' },
  'morel': { category: 'Vegetable', subcategory: 'Mushrooms' },
  'chanterelle': { category: 'Vegetable', subcategory: 'Mushrooms' },
  
  // Beans
  'green-beans': { category: 'Vegetable', subcategory: 'Beans' },
  'kidney-beans': { category: 'Vegetable', subcategory: 'Beans' },
  'chickpeas': { category: 'Vegetable', subcategory: 'Beans' },
  'black-beans': { category: 'Vegetable', subcategory: 'Beans' },
  'lentils': { category: 'Vegetable', subcategory: 'Beans' },
  'edamame': { category: 'Vegetable', subcategory: 'Beans' },
  'white-beans': { category: 'Vegetable', subcategory: 'Beans' },
  
  // Tofu & Soy
  'firm-tofu': { category: 'Vegetable', subcategory: 'Tofu & Soy' },
  'silken-tofu': { category: 'Vegetable', subcategory: 'Tofu & Soy' },
  'smoked-tofu': { category: 'Vegetable', subcategory: 'Tofu & Soy' },
  'tempeh': { category: 'Vegetable', subcategory: 'Tofu & Soy' },
  'tofu-skin': { category: 'Vegetable', subcategory: 'Tofu & Soy' },
  'fried-tofu': { category: 'Vegetable', subcategory: 'Tofu & Soy' },
  
  // Whole Grains
  'rice': { category: 'Grain', subcategory: 'Whole Grains' },
  'brown-rice': { category: 'Grain', subcategory: 'Whole Grains' },
  'quinoa': { category: 'Grain', subcategory: 'Whole Grains' },
  'oats': { category: 'Grain', subcategory: 'Whole Grains' },
  'barley': { category: 'Grain', subcategory: 'Whole Grains' },
  'millet': { category: 'Grain', subcategory: 'Whole Grains' },
  'buckwheat': { category: 'Grain', subcategory: 'Whole Grains' },
  'bulgur': { category: 'Grain', subcategory: 'Whole Grains' },
  
  // Refined Grains
  'white-rice': { category: 'Grain', subcategory: 'Refined Grains' },
  'all-purpose-flour': { category: 'Grain', subcategory: 'Refined Grains' },
  'couscous': { category: 'Grain', subcategory: 'Refined Grains' },
  'semolina': { category: 'Grain', subcategory: 'Refined Grains' },
  'cornmeal': { category: 'Grain', subcategory: 'Refined Grains' },
  'white-bread': { category: 'Grain', subcategory: 'Refined Grains' },
  'pasta': { category: 'Grain', subcategory: 'Refined Grains' },
  
  // Ancient Grains
  'amaranth': { category: 'Grain', subcategory: 'Ancient Grains' },
  'farro': { category: 'Grain', subcategory: 'Ancient Grains' },
  'spelt': { category: 'Grain', subcategory: 'Ancient Grains' },
  'teff': { category: 'Grain', subcategory: 'Ancient Grains' },
  'khorasan': { category: 'Grain', subcategory: 'Ancient Grains' },
  'einkorn': { category: 'Grain', subcategory: 'Ancient Grains' },
  'sorghum': { category: 'Grain', subcategory: 'Ancient Grains' },
  
  // Additional ingredients used in recipes
  'bamboo-shoots': { category: 'Vegetable', subcategory: 'General' },
  'basil': { category: 'Vegetable', subcategory: 'General' },
  'beef': { category: 'Meat', subcategory: 'Beef' },
  'black-pepper': { category: 'Other', subcategory: 'Spices' },
  'cabbage': { category: 'Vegetable', subcategory: 'General' },
  'cheese': { category: 'Other', subcategory: 'Dairy' },
  'chicken': { category: 'Meat', subcategory: 'Chicken' },
  'chili': { category: 'Vegetable', subcategory: 'General' },
  'chili-bean-paste': { category: 'Other', subcategory: 'Condiments' },
  'cilantro': { category: 'Vegetable', subcategory: 'General' },
  'coconut-milk': { category: 'Other', subcategory: 'Dairy' },
  'cream': { category: 'Other', subcategory: 'Dairy' },
  'eggplant': { category: 'Vegetable', subcategory: 'General' },
  'eggs': { category: 'Egg', subcategory: 'Chicken Eggs' },
  'enchilada-sauce': { category: 'Other', subcategory: 'Condiments' },
  'fish': { category: 'Seafood', subcategory: 'Fish' },
  'five-spice': { category: 'Other', subcategory: 'Spices' },
  'flour': { category: 'Grain', subcategory: 'Refined Grains' },
  'garlic': { category: 'Vegetable', subcategory: 'General' },
  'ginger': { category: 'Vegetable', subcategory: 'General' },
  'green-curry-paste': { category: 'Other', subcategory: 'Condiments' },
  'herbs': { category: 'Vegetable', subcategory: 'General' },
  'hoisin-sauce': { category: 'Other', subcategory: 'Condiments' },
  'honey': { category: 'Other', subcategory: 'Sweeteners' },
  'lime': { category: 'Vegetable', subcategory: 'General' },
  'mirin': { category: 'Other', subcategory: 'Condiments' },
  'miso-paste': { category: 'Other', subcategory: 'Condiments' },
  'mushroom': { category: 'Vegetable', subcategory: 'Mushrooms' },
  'noodles': { category: 'Grain', subcategory: 'Refined Grains' },
  'olive-oil': { category: 'Other', subcategory: 'Oils' },
  'onion': { category: 'Vegetable', subcategory: 'General' },
  'pancetta': { category: 'Meat', subcategory: 'Processed' },
  'peanuts': { category: 'Vegetable', subcategory: 'Beans' },
  'pizza-dough': { category: 'Grain', subcategory: 'Refined Grains' },
  'pork': { category: 'Meat', subcategory: 'Pork' },
  'red-wine': { category: 'Other', subcategory: 'Alcohol' },
  'rice-wine': { category: 'Other', subcategory: 'Alcohol' },
  'rock-sugar': { category: 'Other', subcategory: 'Sweeteners' },
  'scallions': { category: 'Vegetable', subcategory: 'General' },
  'sesame-oil': { category: 'Other', subcategory: 'Oils' },
  'soy-sauce': { category: 'Other', subcategory: 'Condiments' },
  'star-anise': { category: 'Other', subcategory: 'Spices' },
  'sugar': { category: 'Other', subcategory: 'Sweeteners' },
  'tofu': { category: 'Vegetable', subcategory: 'Tofu & Soy' },
  'tomato': { category: 'Vegetable', subcategory: 'General' },
  'tomato-sauce': { category: 'Other', subcategory: 'Condiments' },
  'tortillas': { category: 'Grain', subcategory: 'Refined Grains' },
  'wine': { category: 'Other', subcategory: 'Alcohol' },
}

// ============================================================================
// CATEGORY STRUCTURE (for UI display)
// ============================================================================

export const INGREDIENT_CATEGORIES = {
  'Meat': {
    emoji: '🥩',
    subcategories: {
      'Pork': {
        emoji: '🐷',
        items: ['pork-belly', 'pork-shoulder', 'pork-chops', 'pork-ribs', 'ground-pork', 'pork-tenderloin', 'pork']
      },
      'Beef': {
        emoji: '🐄',
        items: ['beef-steak', 'ground-beef', 'beef-brisket', 'beef-ribs', 'beef-tenderloin', 'beef']
      },
      'Lamb': {
        emoji: '🐑',
        items: ['lamb-chops', 'ground-lamb', 'lamb-shoulder', 'lamb-leg', 'lamb-ribs']
      },
      'Chicken': {
        emoji: '🐔',
        items: ['chicken-breast', 'chicken-thighs', 'chicken-wings', 'whole-chicken', 'ground-chicken', 'chicken']
      },
      'Duck': {
        emoji: '🦆',
        items: ['duck-breast', 'whole-duck', 'duck-legs']
      },
      'Processed': {
        emoji: '🥓',
        items: ['bacon', 'sausage', 'ham', 'prosciutto', 'pancetta']
      }
    }
  },
  'Seafood': {
    emoji: '🦞',
    subcategories: {
      'Fish': {
        items: ['salmon', 'tuna', 'cod', 'sea-bass', 'mackerel', 'fish']
      },
      'Shellfish': {
        items: ['shrimp', 'scallops', 'oysters', 'crab-meat', 'clams']
      },
      'Cephalopods': {
        items: ['squid', 'octopus', 'cuttlefish']
      },
      'Crustaceans': {
        items: ['crab', 'lobster', 'prawns', 'crawfish', 'king-crab']
      },
      'Mollusks': {
        items: ['clams', 'mussels', 'cockles', 'abalone', 'scallops']
      },
      'Processed': {
        items: ['smoked-salmon', 'canned-tuna', 'fish-sticks', 'surimi', 'dried-fish']
      }
    }
  },
  'Egg': {
    emoji: '🥚',
    subcategories: {
      'Chicken Eggs': {
        items: ['eggs', 'egg-white', 'egg-yolk']
      },
      'Other Bird Eggs': {
        items: ['duck-egg', 'quail-egg', 'goose-egg', 'turkey-egg', 'ostrich-egg', 'pheasant-egg']
      },
      'Processed / Specialty': {
        items: ['salted-egg', 'century-egg', 'pickled-egg']
      }
    }
  },
  'Vegetable': {
    emoji: '🥬',
    subcategories: {
      'General': {
        items: [
          'broccoli', 'cauliflower', 'spinach', 'kale', 'carrots', 'zucchini', 
          'bell-pepper', 'bamboo-shoots', 'basil', 'cabbage', 'chili',
          'cilantro', 'eggplant', 'garlic', 'ginger', 'herbs', 'lime', 'onion', 
          'scallions', 'tomato'
        ]
      },
      'Mushrooms': {
        items: ['button-mushroom', 'shiitake', 'portobello', 'oyster-mushroom', 'enoki', 'morel', 'chanterelle', 'mushroom']
      },
      'Beans': {
        items: ['green-beans', 'kidney-beans', 'chickpeas', 'black-beans', 'lentils', 'edamame', 'white-beans', 'peanuts']
      },
      'Tofu & Soy': {
        items: ['firm-tofu', 'silken-tofu', 'smoked-tofu', 'tempeh', 'tofu-skin', 'fried-tofu', 'tofu']
      }
    }
  },
  'Grain': {
    emoji: '🌾',
    subcategories: {
      'Whole Grains': {
        items: ['rice', 'brown-rice', 'quinoa', 'oats', 'barley', 'millet', 'buckwheat', 'bulgur']
      },
      'Refined Grains': {
        items: ['white-rice', 'all-purpose-flour', 'couscous', 'semolina', 'cornmeal', 'white-bread', 'pasta', 'flour', 'noodles', 'pizza-dough', 'tortillas']
      },
      'Ancient Grains': {
        items: ['amaranth', 'farro', 'spelt', 'teff', 'khorasan', 'einkorn', 'sorghum']
      }
    }
  }
}

// ============================================================================
// VALIDATION & HELPERS
// ============================================================================

/**
 * Check if an ingredient ID is valid
 */
export function isValidIngredientId(id) {
  return id in INGREDIENT_REGISTRY
}

/**
 * Get ingredient metadata by ID
 */
export function getIngredientMetadata(id) {
  if (!isValidIngredientId(id)) {
    return null
  }
  return INGREDIENT_REGISTRY[id]
}

/**
 * Get all ingredient IDs
 */
export function getAllIngredientIds() {
  return Object.keys(INGREDIENT_REGISTRY)
}

/**
 * Get ingredients by category
 */
export function getIngredientsByCategory(category) {
  return Object.entries(INGREDIENT_REGISTRY)
    .filter(([_, meta]) => meta.category === category)
    .map(([id]) => id)
}

/**
 * Get ingredients by subcategory
 */
export function getIngredientsBySubcategory(category, subcategory) {
  return Object.entries(INGREDIENT_REGISTRY)
    .filter(([_, meta]) => meta.category === category && meta.subcategory === subcategory)
    .map(([id]) => id)
}

/**
 * Validate a list of ingredient IDs
 */
export function validateIngredientIds(ids) {
  const invalid = ids.filter(id => !isValidIngredientId(id))
  if (invalid.length > 0) {
    return false
  }
  return true
}

