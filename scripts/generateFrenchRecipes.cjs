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

console.log(`Starting French recipes from ID: ${nextId}`);

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

// FRENCH RECIPES (20)
const frenchRecipes = [
  createRecipe(
    "Coq au Vin",
    "🍗",
    "Medium",
    "90 min",
    "Chicken braised in red wine with mushrooms",
    ["ingredient-chicken", "ingredient-red-wine", "ingredient-mushrooms", "ingredient-bacon", "ingredient-onion"],
    ["1 whole chicken, cut up", "2 cups red wine", "1 lb mushrooms", "4 oz bacon", "2 onions", "Carrots", "Garlic", "Thyme"],
    [
      "Season chicken with salt and pepper",
      "Cook bacon until crispy, remove",
      "Brown chicken in bacon fat",
      "Add onions, carrots, and garlic",
      "Add wine and bring to boil",
      "Add mushrooms and herbs",
      "Simmer for 45 minutes",
      "Serve with crusty bread"
    ],
    ["french", "braised", "wine"]
  ),
  createRecipe(
    "Beef Bourguignon",
    "🥩",
    "Hard",
    "180 min",
    "Beef stew in Burgundy wine",
    ["ingredient-beef", "ingredient-red-wine", "ingredient-mushrooms", "ingredient-onions", "ingredient-bacon"],
    ["3 lb beef chuck", "2 bottles red wine", "1 lb mushrooms", "12 pearl onions", "6 oz bacon", "Carrots", "Thyme", "Bay leaves"],
    [
      "Cut beef into large chunks",
      "Marinate in wine overnight",
      "Cook bacon until crispy",
      "Brown beef in bacon fat",
      "Add wine and bring to boil",
      "Add vegetables and herbs",
      "Simmer for 2 hours",
      "Serve with mashed potatoes"
    ],
    ["french", "stew", "bourguignon"]
  ),
  createRecipe(
    "Ratatouille",
    "🍆",
    "Medium",
    "60 min",
    "Provençal vegetable stew",
    ["ingredient-eggplant", "ingredient-zucchini", "ingredient-tomatoes", "ingredient-bell-peppers", "ingredient-onion"],
    ["2 eggplants", "3 zucchini", "4 tomatoes", "2 bell peppers", "2 onions", "Garlic", "Herbs de Provence", "Olive oil"],
    [
      "Slice all vegetables thinly",
      "Sauté onions and garlic",
      "Add bell peppers and cook",
      "Add tomatoes and herbs",
      "Layer vegetables in baking dish",
      "Drizzle with olive oil",
      "Bake at 375°F (190°C) for 45 minutes",
      "Serve warm or cold"
    ],
    ["french", "vegetarian", "provençal"]
  ),
  createRecipe(
    "Quiche Lorraine",
    "🥧",
    "Medium",
    "60 min",
    "Savory tart with bacon and cheese",
    ["ingredient-pie-crust", "ingredient-bacon", "ingredient-eggs", "ingredient-cream", "ingredient-cheese"],
    ["1 pie crust", "8 oz bacon", "4 eggs", "1 cup heavy cream", "1 cup cheese", "Nutmeg", "Salt and pepper"],
    [
      "Preheat oven to 375°F (190°C)",
      "Cook bacon until crispy",
      "Beat eggs with cream",
      "Add cheese and seasonings",
      "Place bacon in pie crust",
      "Pour egg mixture over",
      "Bake for 35 minutes",
      "Let cool before serving"
    ],
    ["french", "quiche", "bacon"]
  ),
  createRecipe(
    "Bouillabaisse",
    "🍲",
    "Hard",
    "90 min",
    "Traditional Provençal fish stew",
    ["ingredient-fish", "ingredient-shellfish", "ingredient-saffron", "ingredient-fennel", "ingredient-tomatoes"],
    ["2 lb mixed fish", "1 lb shellfish", "Pinch of saffron", "1 fennel bulb", "4 tomatoes", "Orange peel", "Herbs", "Rouille"],
    [
      "Make fish stock with bones",
      "Sauté fennel and onions",
      "Add tomatoes and saffron",
      "Add fish stock and bring to boil",
      "Add fish and shellfish",
      "Simmer for 15 minutes",
      "Serve with rouille and bread",
      "Garnish with herbs"
    ],
    ["french", "seafood", "provençal"]
  ),
  createRecipe(
    "Croque Monsieur",
    "🥪",
    "Easy",
    "20 min",
    "Grilled ham and cheese sandwich",
    ["ingredient-bread", "ingredient-ham", "ingredient-cheese", "ingredient-bechamel", "ingredient-butter"],
    ["8 slices bread", "8 slices ham", "2 cups cheese", "1 cup béchamel sauce", "4 tbsp butter", "Dijon mustard"],
    [
      "Spread mustard on bread",
      "Layer ham and cheese",
      "Top with second slice",
      "Spread butter on outside",
      "Cook in pan until golden",
      "Flip and cook other side",
      "Serve hot",
      "Optional: add béchamel on top"
    ],
    ["french", "sandwich", "quick"]
  ),
  createRecipe(
    "Cassoulet",
    "🍲",
    "Hard",
    "240 min",
    "White bean stew with duck and sausage",
    ["ingredient-white-beans", "ingredient-duck", "ingredient-sausage", "ingredient-tomatoes", "ingredient-herbs"],
    ["2 cups white beans", "4 duck legs", "1 lb sausage", "2 cups tomatoes", "Herbs", "Garlic", "Onions", "Breadcrumbs"],
    [
      "Soak beans overnight",
      "Cook beans until tender",
      "Brown duck legs and sausage",
      "Sauté onions and garlic",
      "Layer beans, meat, and tomatoes",
      "Add herbs and seasonings",
      "Bake at 300°F (150°C) for 3 hours",
      "Top with breadcrumbs"
    ],
    ["french", "stew", "traditional"]
  ),
  createRecipe(
    "Sole Meunière",
    "🐟",
    "Medium",
    "25 min",
    "Pan-fried sole in brown butter",
    ["ingredient-sole", "ingredient-butter", "ingredient-flour", "ingredient-lemon", "ingredient-parsley"],
    ["4 sole fillets", "8 tbsp butter", "1/2 cup flour", "2 lemons", "Fresh parsley", "Salt and pepper"],
    [
      "Season fish with salt and pepper",
      "Dredge in flour",
      "Heat butter in pan",
      "Cook fish until golden",
      "Flip and cook other side",
      "Remove fish and keep warm",
      "Brown remaining butter",
      "Add lemon juice and parsley",
      "Pour sauce over fish"
    ],
    ["french", "fish", "butter"]
  ),
  createRecipe(
    "Confit de Canard",
    "🦆",
    "Hard",
    "180 min",
    "Duck leg preserved in its own fat",
    ["ingredient-duck-legs", "ingredient-duck-fat", "ingredient-garlic", "ingredient-thyme", "ingredient-salt"],
    ["4 duck legs", "2 cups duck fat", "8 garlic cloves", "Fresh thyme", "Coarse salt", "Black pepper"],
    [
      "Salt duck legs heavily",
      "Refrigerate for 24 hours",
      "Rinse and pat dry",
      "Melt duck fat in oven",
      "Add duck legs and garlic",
      "Cook at 200°F (95°C) for 3 hours",
      "Crisp skin in hot pan",
      "Serve with potatoes"
    ],
    ["french", "duck", "confit"]
  ),
  createRecipe(
    "Salade Niçoise",
    "🥗",
    "Easy",
    "20 min",
    "Tuna salad with eggs and olives",
    ["ingredient-tuna", "ingredient-eggs", "ingredient-olives", "ingredient-tomatoes", "ingredient-green-beans"],
    ["2 cans tuna", "4 hard-boiled eggs", "1/2 cup olives", "4 tomatoes", "1 lb green beans", "Anchovies", "Vinaigrette"],
    [
      "Cook green beans until tender",
      "Hard boil eggs",
      "Arrange lettuce on plates",
      "Add tuna, eggs, and vegetables",
      "Top with olives and anchovies",
      "Drizzle with vinaigrette",
      "Serve immediately"
    ],
    ["french", "salad", "nicoise"]
  ),
  createRecipe(
    "French Onion Soup",
    "🧅",
    "Medium",
    "75 min",
    "Caramelized onion soup with cheese",
    ["ingredient-onions", "ingredient-beef-broth", "ingredient-cheese", "ingredient-bread", "ingredient-butter"],
    ["6 large onions", "6 cups beef broth", "2 cups cheese", "4 slices bread", "4 tbsp butter", "White wine", "Thyme"],
    [
      "Slice onions thinly",
      "Cook slowly in butter for 45 minutes",
      "Add wine and broth",
      "Simmer for 30 minutes",
      "Season with salt and pepper",
      "Toast bread slices",
      "Ladle soup into bowls",
      "Top with bread and cheese",
      "Broil until bubbly"
    ],
    ["french", "soup", "onion"]
  ),
  createRecipe(
    "Escargots",
    "🐌",
    "Medium",
    "30 min",
    "Snails in garlic herb butter",
    ["ingredient-snails", "ingredient-butter", "ingredient-garlic", "ingredient-parsley", "ingredient-white-wine"],
    ["24 snails", "1/2 cup butter", "6 garlic cloves", "1/4 cup parsley", "2 tbsp white wine", "Salt and pepper"],
    [
      "Rinse snails thoroughly",
      "Make garlic herb butter",
      "Mix butter with garlic and parsley",
      "Add wine and seasonings",
      "Place snails in shells",
      "Top with butter mixture",
      "Bake at 400°F (200°C) for 10 minutes",
      "Serve with bread"
    ],
    ["french", "appetizer", "snails"]
  ),
  createRecipe(
    "Steak Frites",
    "🥩",
    "Easy",
    "25 min",
    "Grilled steak with French fries",
    ["ingredient-steak", "ingredient-potatoes", "ingredient-butter", "ingredient-herbs", "ingredient-oil"],
    ["4 steaks", "4 large potatoes", "4 tbsp butter", "Fresh herbs", "Oil for frying", "Salt and pepper"],
    [
      "Cut potatoes into fries",
      "Soak in cold water",
      "Heat oil to 350°F (175°C)",
      "Fry potatoes until golden",
      "Season steaks with salt and pepper",
      "Cook steaks to desired doneness",
      "Add butter and herbs to steaks",
      "Serve with fries"
    ],
    ["french", "steak", "fries"]
  ),
  createRecipe(
    "Duck à l'Orange",
    "🦆",
    "Hard",
    "120 min",
    "Roasted duck with orange sauce",
    ["ingredient-duck", "ingredient-oranges", "ingredient-grand-marnier", "ingredient-stock", "ingredient-herbs"],
    ["1 whole duck", "4 oranges", "1/4 cup Grand Marnier", "2 cups duck stock", "Fresh herbs", "Sugar", "Vinegar"],
    [
      "Season duck inside and out",
      "Roast at 425°F (220°C) for 30 minutes",
      "Reduce heat to 350°F (175°C)",
      "Continue roasting for 1 hour",
      "Make orange sauce",
      "Add Grand Marnier and stock",
      "Reduce until thickened",
      "Carve duck and serve with sauce"
    ],
    ["french", "duck", "orange"]
  ),
  createRecipe(
    "Tarte Tatin",
    "🍎",
    "Medium",
    "60 min",
    "Upside-down caramelized apple tart",
    ["ingredient-apples", "ingredient-puff-pastry", "ingredient-butter", "ingredient-sugar", "ingredient-lemon"],
    ["6 apples", "1 sheet puff pastry", "6 tbsp butter", "1 cup sugar", "1 lemon", "Vanilla"],
    [
      "Peel and core apples",
      "Melt butter in oven-safe pan",
      "Add sugar and cook until caramel",
      "Arrange apples in pan",
      "Cover with pastry",
      "Bake at 400°F (200°C) for 30 minutes",
      "Invert onto plate",
      "Serve warm with cream"
    ],
    ["french", "dessert", "tart"]
  ),
  createRecipe(
    "Croissant",
    "🥐",
    "Hard",
    "240 min",
    "Flaky buttery pastry",
    ["ingredient-flour", "ingredient-butter", "ingredient-yeast", "ingredient-milk", "ingredient-sugar"],
    ["4 cups flour", "1 lb butter", "2 tsp yeast", "1 cup milk", "2 tbsp sugar", "Salt", "Egg wash"],
    [
      "Make dough with flour, yeast, and milk",
      "Let rise for 1 hour",
      "Roll out and add butter",
      "Fold and roll multiple times",
      "Chill between folds",
      "Shape into crescents",
      "Let rise for 2 hours",
      "Bake at 400°F (200°C) for 15 minutes"
    ],
    ["french", "pastry", "breakfast"]
  ),
  createRecipe(
    "Baguette",
    "🥖",
    "Medium",
    "180 min",
    "Traditional French bread",
    ["ingredient-flour", "ingredient-yeast", "ingredient-water", "ingredient-salt", "ingredient-malt"],
    ["4 cups flour", "1 tsp yeast", "1.5 cups water", "2 tsp salt", "1 tsp malt", "Steam for baking"],
    [
      "Mix flour, yeast, and salt",
      "Add water gradually",
      "Knead until smooth",
      "Let rise for 1 hour",
      "Shape into baguettes",
      "Let rise for 1 hour",
      "Score tops with knife",
      "Bake with steam at 450°F (230°C) for 25 minutes"
    ],
    ["french", "bread", "traditional"]
  ),
  createRecipe(
    "Crème Brûlée",
    "🍮",
    "Medium",
    "60 min",
    "Vanilla custard with caramelized sugar",
    ["ingredient-cream", "ingredient-eggs", "ingredient-sugar", "ingredient-vanilla", "ingredient-ramekins"],
    ["2 cups heavy cream", "6 egg yolks", "1/2 cup sugar", "1 vanilla bean", "6 ramekins", "Extra sugar for topping"],
    [
      "Heat cream with vanilla",
      "Beat egg yolks with sugar",
      "Temper eggs with hot cream",
      "Strain mixture",
      "Pour into ramekins",
      "Bake in water bath at 325°F (165°C) for 30 minutes",
      "Chill for 2 hours",
      "Caramelize sugar on top"
    ],
    ["french", "dessert", "custard"]
  ),
  createRecipe(
    "Moules Marinières",
    "🦪",
    "Easy",
    "20 min",
    "Mussels in white wine sauce",
    ["ingredient-mussels", "ingredient-white-wine", "ingredient-shallots", "ingredient-garlic", "ingredient-parsley"],
    ["4 lbs mussels", "1 cup white wine", "4 shallots", "4 garlic cloves", "1/2 cup parsley", "Butter", "Crusty bread"],
    [
      "Clean and debeard mussels",
      "Sauté shallots and garlic",
      "Add wine and bring to boil",
      "Add mussels and cover",
      "Cook until shells open",
      "Discard unopened mussels",
      "Add butter and parsley",
      "Serve with bread"
    ],
    ["french", "seafood", "mussels"]
  ),
  createRecipe(
    "Pot-au-Feu",
    "🍲",
    "Medium",
    "180 min",
    "Traditional French beef and vegetable stew",
    ["ingredient-beef", "ingredient-vegetables", "ingredient-bouquet-garni", "ingredient-onions", "ingredient-carrots"],
    ["3 lb beef chuck", "Mixed vegetables", "Bouquet garni", "2 onions", "4 carrots", "Turnips", "Leeks", "Salt"],
    [
      "Place beef in large pot",
      "Add cold water and salt",
      "Bring to gentle boil",
      "Skim foam from surface",
      "Add bouquet garni",
      "Simmer for 2 hours",
      "Add vegetables",
      "Continue cooking for 1 hour",
      "Serve with mustard and pickles"
    ],
    ["french", "stew", "traditional"]
  )
];

console.log(`✅ Generated ${frenchRecipes.length} French recipes`);
console.log('');

// Add to English recipes
enRecipes.cultural.French = frenchRecipes;
fs.writeFileSync('src/locales/en/recipes.json', JSON.stringify(enRecipes, null, 2));

console.log('✅ Added French recipes to English file');
console.log('');

module.exports = { frenchRecipes, nextId };
