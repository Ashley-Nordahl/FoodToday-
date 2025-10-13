const fs = require('fs');

// Read current recipes to get the highest ID
const enRecipes = JSON.parse(fs.readFileSync('src/locales/en/recipes.json', 'utf8'));
let currentMaxId = 0;

// Find max ID across all cuisines
Object.values(enRecipes.cultural).forEach(cuisineRecipes => {
  if (Array.isArray(cuisineRecipes)) {
    cuisineRecipes.forEach(recipe => {
      if (recipe.id > currentMaxId) currentMaxId = recipe.id;
    });
  }
});

let nextId = currentMaxId + 1;

console.log(`Starting Mexican recipes from ID: ${nextId}`);

// Helper function to create a recipe
function createRecipe(name, emoji, difficulty, time, description, ingredients, ingredientsWithAmounts, instructions, tags) {
  return {
    id: nextId++,
    name,
    description,
    ingredients,
    ingredientsWithAmounts,
    instructions,
    prepTime: time,
    cookTime: time,
    totalTime: time,
    servings: 4,
    difficulty,
    emoji,
    tags
  };
}

// MEXICAN RECIPES (20)
const mexicanRecipes = [
  createRecipe(
    "Tacos al Pastor",
    "🌮",
    "Medium",
    "45 min",
    "Marinated pork tacos with pineapple",
    ["ingredient-pork", "ingredient-pineapple", "ingredient-chili", "ingredient-onion", "ingredient-cilantro"],
    ["2 lb pork shoulder, sliced", "1 cup pineapple chunks", "3 dried ancho chilies", "1 onion, sliced", "Fresh cilantro", "Corn tortillas", "Lime wedges"],
    [
      "Make marinade with chilies, vinegar, and spices",
      "Marinate pork for 2 hours",
      "Grill pork until cooked through",
      "Grill pineapple until caramelized",
      "Warm tortillas",
      "Slice pork and pineapple",
      "Serve in tortillas with onion and cilantro",
      "Add lime juice"
    ],
    ["mexican", "tacos", "pork"]
  ),
  createRecipe(
    "Enchiladas",
    "🌯",
    "Medium",
    "40 min",
    "Rolled tortillas with sauce and cheese",
    ["ingredient-tortillas", "ingredient-chicken", "ingredient-cheese", "ingredient-enchilada-sauce", "ingredient-onion"],
    ["12 corn tortillas", "2 cups shredded chicken", "2 cups cheese", "3 cups enchilada sauce", "1 onion, diced", "Sour cream", "Cilantro"],
    [
      "Heat enchilada sauce",
      "Dip tortillas in sauce to soften",
      "Fill with chicken and cheese",
      "Roll and place in baking dish",
      "Pour remaining sauce over top",
      "Sprinkle with cheese",
      "Bake at 350°F (175°C) for 20 minutes",
      "Garnish with sour cream and cilantro"
    ],
    ["mexican", "baked", "cheese"]
  ),
  createRecipe(
    "Guacamole",
    "🥑",
    "Easy",
    "10 min",
    "Fresh avocado dip with lime and cilantro",
    ["ingredient-avocado", "ingredient-lime", "ingredient-cilantro", "ingredient-tomato", "ingredient-onion"],
    ["4 ripe avocados", "2 limes, juiced", "1/2 cup cilantro", "2 tomatoes, diced", "1/2 onion, diced", "2 jalapeños", "Salt to taste"],
    [
      "Cut avocados in half and remove pits",
      "Mash avocados with lime juice",
      "Add diced tomatoes and onion",
      "Chop cilantro and jalapeños",
      "Mix everything together",
      "Season with salt",
      "Serve immediately with chips"
    ],
    ["mexican", "dip", "avocado"]
  ),
  createRecipe(
    "Chiles Rellenos",
    "🌶️",
    "Hard",
    "60 min",
    "Stuffed poblano peppers with cheese",
    ["ingredient-poblano-peppers", "ingredient-cheese", "ingredient-eggs", "ingredient-flour", "ingredient-tomato-sauce"],
    ["6 poblano peppers", "2 cups cheese", "4 eggs", "1/2 cup flour", "2 cups tomato sauce", "Oil for frying"],
    [
      "Roast peppers until charred",
      "Peel and remove seeds carefully",
      "Stuff with cheese",
      "Separate eggs and beat whites",
      "Fold in yolks and flour",
      "Dip peppers in batter",
      "Fry until golden",
      "Serve with tomato sauce"
    ],
    ["mexican", "stuffed", "peppers"]
  ),
  createRecipe(
    "Mole Poblano",
    "🍗",
    "Hard",
    "120 min",
    "Complex chocolate-chile sauce with chicken",
    ["ingredient-chicken", "ingredient-chocolate", "ingredient-chilies", "ingredient-nuts", "ingredient-spices"],
    ["1 whole chicken", "2 oz dark chocolate", "6 dried chilies", "1/4 cup almonds", "1/4 cup raisins", "2 tbsp sesame seeds", "Cinnamon, cloves"],
    [
      "Soak chilies and remove seeds",
      "Toast nuts and seeds",
      "Blend chilies with nuts and spices",
      "Cook chicken and remove meat",
      "Make sauce with chicken broth",
      "Add chocolate and simmer",
      "Return chicken to sauce",
      "Serve with rice and tortillas"
    ],
    ["mexican", "mole", "chicken"]
  ),
  createRecipe(
    "Carnitas",
    "🍖",
    "Medium",
    "180 min",
    "Slow-cooked crispy pork",
    ["ingredient-pork-shoulder", "ingredient-orange", "ingredient-lime", "ingredient-garlic", "ingredient-cumin"],
    ["3 lb pork shoulder", "2 oranges, juiced", "2 limes, juiced", "8 garlic cloves", "2 tbsp cumin", "Bay leaves", "Salt"],
    [
      "Cut pork into large chunks",
      "Season with salt and cumin",
      "Place in Dutch oven with citrus juice",
      "Add garlic and bay leaves",
      "Cover and cook at 300°F (150°C) for 3 hours",
      "Remove and shred meat",
      "Broil until crispy",
      "Serve with tortillas and salsa"
    ],
    ["mexican", "slow-cooked", "pork"]
  ),
  createRecipe(
    "Pozole",
    "🍲",
    "Medium",
    "120 min",
    "Traditional hominy and pork soup",
    ["ingredient-pork", "ingredient-hominy", "ingredient-chilies", "ingredient-garlic", "ingredient-onion"],
    ["2 lb pork shoulder", "2 cans hominy", "6 dried chilies", "8 garlic cloves", "2 onions", "Cumin, oregano", "Lime wedges"],
    [
      "Cook pork in water with garlic and onion",
      "Remove pork and shred",
      "Strain broth",
      "Soak and blend chilies",
      "Add hominy to broth",
      "Add shredded pork and chili puree",
      "Simmer for 30 minutes",
      "Serve with lime and toppings"
    ],
    ["mexican", "soup", "hominy"]
  ),
  createRecipe(
    "Quesadillas",
    "🧀",
    "Easy",
    "15 min",
    "Grilled tortillas with melted cheese",
    ["ingredient-tortillas", "ingredient-cheese", "ingredient-chicken", "ingredient-vegetables", "ingredient-salsa"],
    ["8 flour tortillas", "2 cups cheese", "1 cup cooked chicken", "Bell peppers, onions", "Salsa", "Sour cream"],
    [
      "Heat skillet over medium heat",
      "Place tortilla in pan",
      "Add cheese and fillings",
      "Top with second tortilla",
      "Cook until golden",
      "Flip and cook other side",
      "Cut into wedges",
      "Serve with salsa and sour cream"
    ],
    ["mexican", "quick", "cheese"]
  ),
  createRecipe(
    "Chilaquiles",
    "🍳",
    "Easy",
    "20 min",
    "Fried tortilla chips in salsa with eggs",
    ["ingredient-tortilla-chips", "ingredient-salsa", "ingredient-eggs", "ingredient-cheese", "ingredient-crema"],
    ["4 cups tortilla chips", "2 cups salsa", "4 eggs", "1 cup cheese", "1/2 cup crema", "Cilantro", "Onion"],
    [
      "Heat salsa in large pan",
      "Add tortilla chips",
      "Toss to coat with salsa",
      "Fry eggs sunny-side up",
      "Top chips with cheese",
      "Place eggs on top",
      "Drizzle with crema",
      "Garnish with cilantro and onion"
    ],
    ["mexican", "breakfast", "eggs"]
  ),
  createRecipe(
    "Tamales",
    "🫔",
    "Hard",
    "120 min",
    "Steamed masa dough with filling",
    ["ingredient-masa", "ingredient-pork", "ingredient-chilies", "ingredient-corn-husks", "ingredient-lard"],
    ["4 cups masa harina", "1 lb pork shoulder", "6 dried chilies", "Corn husks", "1/2 cup lard", "Baking powder"],
    [
      "Soak corn husks in warm water",
      "Cook pork with chilies and spices",
      "Shred pork and mix with sauce",
      "Mix masa with lard and broth",
      "Spread masa on husks",
      "Add pork filling",
      "Fold and tie husks",
      "Steam for 1 hour"
    ],
    ["mexican", "steamed", "traditional"]
  ),
  createRecipe(
    "Fajitas",
    "🌮",
    "Easy",
    "25 min",
    "Sizzling grilled meat with peppers",
    ["ingredient-beef", "ingredient-bell-peppers", "ingredient-onion", "ingredient-lime", "ingredient-spices"],
    ["2 lb beef skirt steak", "3 bell peppers", "2 onions", "2 limes, juiced", "Cumin, chili powder", "Tortillas", "Sour cream"],
    [
      "Marinate beef with lime juice and spices",
      "Slice peppers and onions",
      "Heat cast iron skillet",
      "Cook beef until desired doneness",
      "Remove and slice thinly",
      "Cook peppers and onions",
      "Serve with warm tortillas",
      "Add sour cream and salsa"
    ],
    ["mexican", "grilled", "beef"]
  ),
  createRecipe(
    "Ceviche",
    "🐟",
    "Easy",
    "120 min",
    "Lime-marinated fresh fish",
    ["ingredient-fresh-fish", "ingredient-lime", "ingredient-onion", "ingredient-cilantro", "ingredient-tomato"],
    ["1 lb fresh white fish", "1 cup lime juice", "1 red onion", "1/2 cup cilantro", "2 tomatoes", "Jalapeño", "Avocado"],
    [
      "Cut fish into small cubes",
      "Marinate in lime juice for 2 hours",
      "Dice onion and tomatoes",
      "Chop cilantro and jalapeño",
      "Drain fish and mix with vegetables",
      "Add salt and pepper",
      "Serve with avocado",
      "Accompany with tortilla chips"
    ],
    ["mexican", "seafood", "fresh"]
  ),
  createRecipe(
    "Elote",
    "🌽",
    "Easy",
    "15 min",
    "Mexican street corn with mayo and cheese",
    ["ingredient-corn", "ingredient-mayonnaise", "ingredient-cheese", "ingredient-chili-powder", "ingredient-lime"],
    ["4 ears corn", "1/2 cup mayonnaise", "1/2 cup cotija cheese", "2 tbsp chili powder", "2 limes", "Cilantro"],
    [
      "Grill corn until charred",
      "Brush with mayonnaise",
      "Sprinkle with cheese",
      "Add chili powder",
      "Squeeze lime juice over top",
      "Garnish with cilantro",
      "Serve immediately"
    ],
    ["mexican", "street-food", "corn"]
  ),
  createRecipe(
    "Birria",
    "🥘",
    "Hard",
    "180 min",
    "Spicy slow-cooked goat or beef stew",
    ["ingredient-beef", "ingredient-chilies", "ingredient-garlic", "ingredient-cinnamon", "ingredient-vinegar"],
    ["3 lb beef chuck", "8 dried chilies", "10 garlic cloves", "2 cinnamon sticks", "1/4 cup vinegar", "Bay leaves", "Oregano"],
    [
      "Soak chilies in hot water",
      "Blend chilies with garlic and spices",
      "Sear beef on all sides",
      "Add chili puree and water",
      "Add bay leaves and oregano",
      "Simmer for 3 hours",
      "Shred meat and return to broth",
      "Serve with tortillas and lime"
    ],
    ["mexican", "stew", "spicy"]
  ),
  createRecipe(
    "Tortas",
    "🥖",
    "Easy",
    "20 min",
    "Mexican sandwich with various fillings",
    ["ingredient-bolillo-rolls", "ingredient-meat", "ingredient-avocado", "ingredient-refried-beans", "ingredient-cheese"],
    ["4 bolillo rolls", "Cooked meat (carnitas, chicken)", "2 avocados", "1 cup refried beans", "Cheese", "Lettuce", "Tomato"],
    [
      "Slice rolls lengthwise",
      "Spread refried beans on bottom",
      "Add sliced meat",
      "Top with cheese",
      "Add avocado slices",
      "Add lettuce and tomato",
      "Close sandwich",
      "Serve with chips"
    ],
    ["mexican", "sandwich", "quick"]
  ),
  createRecipe(
    "Sopes",
    "🫓",
    "Medium",
    "30 min",
    "Thick corn cakes with toppings",
    ["ingredient-masa", "ingredient-refried-beans", "ingredient-meat", "ingredient-cheese", "ingredient-salsa"],
    ["2 cups masa harina", "1 cup refried beans", "Cooked meat", "1 cup cheese", "Salsa", "Lettuce", "Crema"],
    [
      "Mix masa with water and salt",
      "Form into thick discs",
      "Cook on griddle until set",
      "Pinch edges to form walls",
      "Fry until golden",
      "Top with beans and meat",
      "Add cheese and salsa",
      "Garnish with lettuce and crema"
    ],
    ["mexican", "appetizer", "corn"]
  ),
  createRecipe(
    "Cochinita Pibil",
    "🍖",
    "Hard",
    "240 min",
    "Yucatan-style slow-roasted pork",
    ["ingredient-pork", "ingredient-achiote", "ingredient-orange", "ingredient-garlic", "ingredient-banana-leaves"],
    ["3 lb pork shoulder", "4 tbsp achiote paste", "2 oranges, juiced", "8 garlic cloves", "Banana leaves", "Cumin, oregano"],
    [
      "Make marinade with achiote and citrus",
      "Marinate pork overnight",
      "Line baking dish with banana leaves",
      "Place pork in dish",
      "Cover with more banana leaves",
      "Bake at 300°F (150°C) for 4 hours",
      "Shred meat",
      "Serve with pickled onions"
    ],
    ["mexican", "yucatan", "slow-cooked"]
  ),
  createRecipe(
    "Tostadas",
    "🌮",
    "Easy",
    "15 min",
    "Crispy tortillas with toppings",
    ["ingredient-tortillas", "ingredient-refried-beans", "ingredient-meat", "ingredient-lettuce", "ingredient-cheese"],
    ["8 corn tortillas", "1 cup refried beans", "Cooked meat", "Shredded lettuce", "1 cup cheese", "Salsa", "Crema"],
    [
      "Fry tortillas until crispy",
      "Spread with refried beans",
      "Add shredded meat",
      "Top with lettuce",
      "Add cheese",
      "Drizzle with salsa",
      "Add crema",
      "Serve immediately"
    ],
    ["mexican", "crispy", "quick"]
  ),
  createRecipe(
    "Salsa Verde",
    "🥗",
    "Easy",
    "15 min",
    "Tangy tomatillo and green chile salsa",
    ["ingredient-tomatillos", "ingredient-green-chilies", "ingredient-onion", "ingredient-garlic", "ingredient-cilantro"],
    ["1 lb tomatillos", "4 green chilies", "1 onion", "4 garlic cloves", "1/2 cup cilantro", "Lime juice", "Salt"],
    [
      "Remove husks from tomatillos",
      "Roast tomatillos and chilies",
      "Blend with onion and garlic",
      "Add cilantro and lime juice",
      "Season with salt",
      "Let cool",
      "Serve with chips or as condiment"
    ],
    ["mexican", "salsa", "green"]
  ),
  createRecipe(
    "Churros",
    "🍩",
    "Medium",
    "30 min",
    "Fried dough with cinnamon sugar",
    ["ingredient-flour", "ingredient-water", "ingredient-eggs", "ingredient-sugar", "ingredient-cinnamon"],
    ["1 cup flour", "1 cup water", "2 eggs", "1/2 cup sugar", "2 tbsp cinnamon", "Oil for frying", "Chocolate sauce"],
    [
      "Boil water with butter and salt",
      "Add flour and stir until smooth",
      "Beat in eggs one at a time",
      "Heat oil to 375°F (190°C)",
      "Pipe dough into hot oil",
      "Fry until golden brown",
      "Roll in cinnamon sugar",
      "Serve with chocolate sauce"
    ],
    ["mexican", "dessert", "fried"]
  )
];

console.log(`✅ Generated ${mexicanRecipes.length} Mexican recipes`);
console.log('');

// Add to English recipes
enRecipes.cultural.Mexican = mexicanRecipes;
fs.writeFileSync('src/locales/en/recipes.json', JSON.stringify(enRecipes, null, 2));

console.log('✅ Added Mexican recipes to English file');
console.log('');

module.exports = { mexicanRecipes, nextId };
