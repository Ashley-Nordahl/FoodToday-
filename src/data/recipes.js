// Sample recipes organized by cuisine type
export const recipes = {
  // Chinese Cuisines
  'Jiangsu': [
    {
      id: 1,
      name: 'Sweet and Sour Pork',
      description: 'Classic Jiangsu dish with tender pork, bell peppers, and pineapple in a tangy sauce',
      ingredients: ['pork', 'bell-pepper', 'onion', 'garlic', 'soy-sauce'],
      difficulty: 'Medium',
      cookTime: '30 min',
      servings: 4,
      emoji: '🍖'
    },
    {
      id: 2,
      name: 'Braised Lion\'s Head Meatballs',
      description: 'Large, tender meatballs braised in a rich sauce with vegetables',
      ingredients: ['pork', 'cabbage', 'ginger', 'soy-sauce'],
      difficulty: 'Hard',
      cookTime: '45 min',
      servings: 4,
      emoji: '🥟'
    }
  ],
  'Shandong': [
    {
      id: 3,
      name: 'Shandong Dumplings',
      description: 'Handmade dumplings with savory pork and vegetable filling',
      ingredients: ['pork', 'cabbage', 'ginger', 'soy-sauce', 'flour'],
      difficulty: 'Medium',
      cookTime: '60 min',
      servings: 6,
      emoji: '🥟'
    },
    {
      id: 4,
      name: 'Dezhou Braised Chicken',
      description: 'Tender braised chicken with aromatic spices and herbs',
      ingredients: ['chicken', 'ginger', 'garlic', 'soy-sauce', 'star-anise'],
      difficulty: 'Medium',
      cookTime: '90 min',
      servings: 4,
      emoji: '🍗'
    }
  ],
  'Sichuan': [
    {
      id: 5,
      name: 'Mapo Tofu',
      description: 'Spicy and numbing tofu dish with ground pork in chili sauce',
      ingredients: ['tofu', 'pork', 'garlic', 'ginger', 'chili-bean-paste'],
      difficulty: 'Medium',
      cookTime: '25 min',
      servings: 4,
      emoji: '🌶️'
    },
    {
      id: 6,
      name: 'Kung Pao Chicken',
      description: 'Classic Sichuan dish with chicken, peanuts, and dried chilies',
      ingredients: ['chicken', 'peanuts', 'bell-pepper', 'garlic', 'chili'],
      difficulty: 'Medium',
      cookTime: '20 min',
      servings: 4,
      emoji: '🥜'
    }
  ],
  'Cantonese': [
    {
      id: 7,
      name: 'Steamed Fish with Ginger and Scallions',
      description: 'Fresh fish steamed with aromatic ginger and scallions',
      ingredients: ['fish', 'ginger', 'scallions', 'soy-sauce', 'sesame-oil'],
      difficulty: 'Easy',
      cookTime: '15 min',
      servings: 4,
      emoji: '🐟'
    },
    {
      id: 8,
      name: 'Char Siu (BBQ Pork)',
      description: 'Sweet and savory Chinese BBQ pork with red glaze',
      ingredients: ['pork', 'hoisin-sauce', 'soy-sauce', 'honey', 'five-spice'],
      difficulty: 'Medium',
      cookTime: '120 min',
      servings: 6,
      emoji: '🍖'
    }
  ],
  'Zhejiang': [
    {
      id: 9,
      name: 'Dongpo Pork Belly',
      description: 'Slow-braised pork belly with soy sauce and wine',
      ingredients: ['pork-belly', 'soy-sauce', 'rice-wine', 'ginger', 'scallions'],
      difficulty: 'Hard',
      cookTime: '180 min',
      servings: 4,
      emoji: '🥓'
    }
  ],
  'Hunan': [
    {
      id: 10,
      name: 'Hunan Beef',
      description: 'Spicy beef stir-fry with vegetables and Hunan chilies',
      ingredients: ['beef', 'bell-pepper', 'onion', 'garlic', 'chili'],
      difficulty: 'Medium',
      cookTime: '25 min',
      servings: 4,
      emoji: '🌶️'
    }
  ],
  'Fujian': [
    {
      id: 11,
      name: 'Buddha Jumps Over the Wall',
      description: 'Luxurious soup with multiple ingredients and rich broth',
      ingredients: ['chicken', 'pork', 'mushroom', 'bamboo-shoots', 'wine'],
      difficulty: 'Hard',
      cookTime: '240 min',
      servings: 8,
      emoji: '🍲'
    }
  ],
  'Anhui': [
    {
      id: 12,
      name: 'Red-braised Pork',
      description: 'Tender pork braised in soy sauce with rock sugar',
      ingredients: ['pork', 'soy-sauce', 'rock-sugar', 'ginger', 'wine'],
      difficulty: 'Medium',
      cookTime: '90 min',
      servings: 4,
      emoji: '🍖'
    }
  ],

  // International Cuisines
  'Japanese': [
    {
      id: 13,
      name: 'Teriyaki Chicken',
      description: 'Grilled chicken glazed with sweet teriyaki sauce',
      ingredients: ['chicken', 'soy-sauce', 'mirin', 'sugar', 'ginger'],
      difficulty: 'Easy',
      cookTime: '30 min',
      servings: 4,
      emoji: '🍗'
    },
    {
      id: 14,
      name: 'Miso Ramen',
      description: 'Rich ramen soup with miso broth and noodles',
      ingredients: ['noodles', 'miso-paste', 'pork', 'eggs', 'scallions'],
      difficulty: 'Medium',
      cookTime: '45 min',
      servings: 4,
      emoji: '🍜'
    }
  ],
  'Korean': [
    {
      id: 15,
      name: 'Bulgogi',
      description: 'Marinated grilled beef with sweet and savory flavors',
      ingredients: ['beef', 'soy-sauce', 'pear', 'garlic', 'sesame-oil'],
      difficulty: 'Medium',
      cookTime: '40 min',
      servings: 4,
      emoji: '🥩'
    },
    {
      id: 16,
      name: 'Kimchi Fried Rice',
      description: 'Spicy fried rice with fermented kimchi and vegetables',
      ingredients: ['rice', 'kimchi', 'eggs', 'onion', 'sesame-oil'],
      difficulty: 'Easy',
      cookTime: '20 min',
      servings: 4,
      emoji: '🍚'
    }
  ],
  'Italian': [
    {
      id: 17,
      name: 'Spaghetti Carbonara',
      description: 'Classic Roman pasta with eggs, cheese, and pancetta',
      ingredients: ['pasta', 'eggs', 'cheese', 'pancetta', 'black-pepper'],
      difficulty: 'Medium',
      cookTime: '25 min',
      servings: 4,
      emoji: '🍝'
    },
    {
      id: 18,
      name: 'Margherita Pizza',
      description: 'Simple pizza with tomato sauce, mozzarella, and basil',
      ingredients: ['pizza-dough', 'tomato-sauce', 'cheese', 'basil', 'olive-oil'],
      difficulty: 'Medium',
      cookTime: '30 min',
      servings: 4,
      emoji: '🍕'
    }
  ],
  'French': [
    {
      id: 19,
      name: 'Coq au Vin',
      description: 'Chicken braised in red wine with mushrooms and onions',
      ingredients: ['chicken', 'red-wine', 'mushroom', 'onion', 'herbs'],
      difficulty: 'Hard',
      cookTime: '120 min',
      servings: 4,
      emoji: '🍷'
    },
    {
      id: 20,
      name: 'Ratatouille',
      description: 'Vegetable stew with eggplant, zucchini, and tomatoes',
      ingredients: ['eggplant', 'zucchini', 'tomato', 'bell-pepper', 'herbs'],
      difficulty: 'Medium',
      cookTime: '60 min',
      servings: 6,
      emoji: '🍅'
    }
  ],
  'Indian': [
    {
      id: 21,
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken',
      ingredients: ['chicken', 'tomato', 'cream', 'garlic', 'ginger'],
      difficulty: 'Medium',
      cookTime: '45 min',
      servings: 4,
      emoji: '🍛'
    },
    {
      id: 22,
      name: 'Chana Masala',
      description: 'Spicy chickpea curry with aromatic spices',
      ingredients: ['chickpeas', 'tomato', 'onion', 'garlic', 'ginger'],
      difficulty: 'Easy',
      cookTime: '30 min',
      servings: 4,
      emoji: '🫘'
    }
  ],
  'Thai': [
    {
      id: 23,
      name: 'Pad Thai',
      description: 'Stir-fried rice noodles with shrimp, tofu, and peanuts',
      ingredients: ['noodles', 'shrimp', 'tofu', 'peanuts', 'lime'],
      difficulty: 'Medium',
      cookTime: '25 min',
      servings: 4,
      emoji: '🍤'
    },
    {
      id: 24,
      name: 'Green Curry',
      description: 'Spicy coconut curry with vegetables and meat',
      ingredients: ['coconut-milk', 'green-curry-paste', 'chicken', 'eggplant', 'basil'],
      difficulty: 'Medium',
      cookTime: '35 min',
      servings: 4,
      emoji: '🌶️'
    }
  ],
  'Mexican': [
    {
      id: 25,
      name: 'Chicken Tacos',
      description: 'Seasoned chicken in soft tortillas with fresh toppings',
      ingredients: ['chicken', 'tortillas', 'onion', 'cilantro', 'lime'],
      difficulty: 'Easy',
      cookTime: '20 min',
      servings: 4,
      emoji: '🌮'
    },
    {
      id: 26,
      name: 'Chicken Enchiladas',
      description: 'Rolled tortillas filled with chicken and cheese, covered in sauce',
      ingredients: ['chicken', 'tortillas', 'cheese', 'enchilada-sauce', 'onion'],
      difficulty: 'Medium',
      cookTime: '40 min',
      servings: 6,
      emoji: '🌯'
    }
  ]
}

// Function to get random recipe from a cuisine
export const getRandomRecipe = (cuisineName) => {
  console.log('Looking for recipes for cuisine:', cuisineName)
  const cuisineRecipes = recipes[cuisineName]
  console.log('Found recipes:', cuisineRecipes)
  
  if (!cuisineRecipes || cuisineRecipes.length === 0) {
    console.error('No recipes found for cuisine:', cuisineName)
    return null
  }
  
  const randomIndex = Math.floor(Math.random() * cuisineRecipes.length)
  const selectedRecipe = cuisineRecipes[randomIndex]
  console.log('Selected recipe:', selectedRecipe)
  return selectedRecipe
}

// Function to get recipes based on available ingredients
export const getRecipesByIngredients = (cuisineName, availableIngredients) => {
  const cuisineRecipes = recipes[cuisineName]
  if (!cuisineRecipes) return []
  
  return cuisineRecipes.filter(recipe => {
    // Check if at least 60% of recipe ingredients are available
    const availableCount = recipe.ingredients.filter(ingredient => 
      availableIngredients.some(available => available.id === ingredient)
    ).length
    return (availableCount / recipe.ingredients.length) >= 0.6
  })
}

// Party data functions - get data from translation files
export const useIngredientCategories = () => {
  // This would normally use i18n, but for now return static data
  return [
    { value: 'meat', label: 'Meat', emoji: '🥩' },
    { value: 'seafood', label: 'Seafood', emoji: '🐟' },
    { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
    { value: 'grains', label: 'Grains', emoji: '🌾' },
    { value: 'egg', label: 'Egg', emoji: '🥚' }
  ]
}

export const useTastePreferences = () => {
  // This would normally use i18n, but for now return static data
  return [
    { value: 'rich', label: 'Rich', emoji: '🍗' },
    { value: 'spicy', label: 'Spicy', emoji: '🌶️' },
    { value: 'sweet', label: 'Sweet', emoji: '🍯' },
    { value: 'sour', label: 'Sour', emoji: '🍋' },
    { value: 'salty', label: 'Salty', emoji: '🧂' },
    { value: 'light', label: 'Light', emoji: '🌿' }
  ]
}

export const useCuisineStyles = () => {
  // This would normally use i18n, but for now return static data
  return [
    { value: 'mixed', label: 'Mixed Cuisine', emoji: '🌍' },
    { value: 'chinese', label: 'Chinese Style', emoji: '🥢' },
    { value: 'western', label: 'Western Style', emoji: '🍽️' },
    { value: 'japanese', label: 'Japanese Style', emoji: '🍱' }
  ]
}

export const useDiningScenarios = () => {
  // This would normally use i18n, but for now return static data
  return [
    { value: 'family', label: 'Family Gathering', emoji: '👨‍👩‍👧‍👦' },
    { value: 'friends', label: 'Friends Gathering', emoji: '👯' },
    { value: 'romantic', label: 'Romantic Dinner', emoji: '💕' }
  ]
}
