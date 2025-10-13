const fs = require('fs');

// Read current recipes
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

console.log(`Starting expansions from ID: ${nextId}`);

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

// JAPANESE RECIPES (17 more needed)
const additionalJapaneseRecipes = [
  createRecipe(
    "Tonkatsu",
    "🍖",
    "Medium",
    "30 min",
    "Breaded and fried pork cutlet",
    ["ingredient-pork", "ingredient-breadcrumbs", "ingredient-eggs", "ingredient-flour", "ingredient-cabbage"],
    ["4 pork cutlets", "2 cups panko breadcrumbs", "3 eggs", "1 cup flour", "1/2 head cabbage", "Tonkatsu sauce", "Oil for frying"],
    [
      "Pound pork cutlets thin",
      "Season with salt and pepper",
      "Dredge in flour, egg, then breadcrumbs",
      "Heat oil to 350°F (175°C)",
      "Fry cutlets until golden brown",
      "Drain on paper towels",
      "Slice and serve with cabbage",
      "Drizzle with tonkatsu sauce"
    ],
    ["japanese", "fried", "pork"]
  ),
  createRecipe(
    "Yakitori",
    "🍢",
    "Easy",
    "25 min",
    "Grilled chicken skewers with tare sauce",
    ["ingredient-chicken", "ingredient-soy-sauce", "ingredient-mirin", "ingredient-sake", "ingredient-sugar"],
    ["2 lb chicken thighs", "1/2 cup soy sauce", "1/4 cup mirin", "1/4 cup sake", "2 tbsp sugar", "Bamboo skewers", "Scallions"],
    [
      "Cut chicken into bite-sized pieces",
      "Soak skewers in water",
      "Thread chicken onto skewers",
      "Make tare sauce with soy, mirin, sake, sugar",
      "Grill skewers, brushing with sauce",
      "Cook until chicken is done",
      "Serve with more tare sauce",
      "Garnish with scallions"
    ],
    ["japanese", "grilled", "chicken"]
  ),
  createRecipe(
    "Okonomiyaki",
    "🥞",
    "Medium",
    "35 min",
    "Savory Japanese pancake with cabbage",
    ["ingredient-cabbage", "ingredient-flour", "ingredient-eggs", "ingredient-pork", "ingredient-okonomiyaki-sauce"],
    ["1/2 head cabbage", "2 cups flour", "4 eggs", "8 slices pork belly", "Okonomiyaki sauce", "Mayonnaise", "Bonito flakes"],
    [
      "Shred cabbage finely",
      "Mix flour with water and eggs",
      "Add cabbage to batter",
      "Heat griddle and pour batter",
      "Top with pork slices",
      "Flip and cook other side",
      "Drizzle with sauce and mayo",
      "Top with bonito flakes"
    ],
    ["japanese", "pancake", "savory"]
  ),
  createRecipe(
    "Chawanmushi",
    "🍮",
    "Medium",
    "40 min",
    "Savory steamed egg custard",
    ["ingredient-eggs", "ingredient-dashi", "ingredient-shrimp", "ingredient-mushrooms", "ingredient-mitsuba"],
    ["4 eggs", "2 cups dashi stock", "8 shrimp", "4 mushrooms", "Mitsuba leaves", "Soy sauce", "Mirin"],
    [
      "Beat eggs with dashi",
      "Strain mixture",
      "Place shrimp and mushrooms in cups",
      "Pour egg mixture over",
      "Cover with foil",
      "Steam for 15 minutes",
      "Garnish with mitsuba",
      "Serve warm"
    ],
    ["japanese", "steamed", "custard"]
  ),
  createRecipe(
    "Karaage",
    "🍗",
    "Easy",
    "25 min",
    "Japanese fried chicken with soy marinade",
    ["ingredient-chicken", "ingredient-soy-sauce", "ingredient-garlic", "ingredient-ginger", "ingredient-potato-starch"],
    ["2 lb chicken thighs", "3 tbsp soy sauce", "2 garlic cloves", "1 inch ginger", "1 cup potato starch", "Oil for frying", "Lemon wedges"],
    [
      "Cut chicken into bite-sized pieces",
      "Marinate with soy sauce, garlic, ginger",
      "Let marinate for 30 minutes",
      "Coat with potato starch",
      "Heat oil to 350°F (175°C)",
      "Fry chicken until golden",
      "Drain on paper towels",
      "Serve with lemon wedges"
    ],
    ["japanese", "fried", "chicken"]
  ),
  createRecipe(
    "Oyakodon",
    "🍳",
    "Easy",
    "20 min",
    "Chicken and egg rice bowl",
    ["ingredient-chicken", "ingredient-eggs", "ingredient-onion", "ingredient-dashi", "ingredient-soy-sauce"],
    ["1 lb chicken thighs", "4 eggs", "1 onion", "1 cup dashi", "3 tbsp soy sauce", "2 tbsp mirin", "Rice", "Scallions"],
    [
      "Slice chicken and onion",
      "Heat dashi with soy sauce and mirin",
      "Add chicken and onion",
      "Cook until chicken is done",
      "Beat eggs lightly",
      "Pour eggs over chicken",
      "Cover and cook until set",
      "Serve over rice with scallions"
    ],
    ["japanese", "rice-bowl", "chicken"]
  ),
  createRecipe(
    "Katsudon",
    "🍖",
    "Medium",
    "35 min",
    "Pork cutlet and egg rice bowl",
    ["ingredient-pork", "ingredient-eggs", "ingredient-onion", "ingredient-dashi", "ingredient-breadcrumbs"],
    ["4 pork cutlets", "4 eggs", "1 onion", "1 cup dashi", "3 tbsp soy sauce", "2 tbsp mirin", "Panko breadcrumbs", "Rice"],
    [
      "Make tonkatsu (breaded pork cutlets)",
      "Slice tonkatsu into strips",
      "Heat dashi with soy sauce and mirin",
      "Add sliced onion",
      "Place tonkatsu on top",
      "Beat eggs and pour over",
      "Cover and cook until eggs set",
      "Serve over rice"
    ],
    ["japanese", "rice-bowl", "pork"]
  ),
  createRecipe(
    "Takoyaki",
    "🐙",
    "Medium",
    "30 min",
    "Octopus balls with takoyaki sauce",
    ["ingredient-octopus", "ingredient-flour", "ingredient-eggs", "ingredient-dashi", "ingredient-takoyaki-sauce"],
    ["1/2 lb octopus", "2 cups flour", "2 eggs", "2 cups dashi", "Takoyaki sauce", "Mayonnaise", "Bonito flakes", "Aonori"],
    [
      "Cut octopus into small pieces",
      "Mix flour with eggs and dashi",
      "Heat takoyaki pan",
      "Pour batter into holes",
      "Add octopus pieces",
      "Turn with skewers to form balls",
      "Cook until golden",
      "Top with sauce, mayo, and flakes"
    ],
    ["japanese", "street-food", "octopus"]
  ),
  createRecipe(
    "Agedashi Tofu",
    "🧈",
    "Easy",
    "20 min",
    "Deep-fried tofu in dashi broth",
    ["ingredient-tofu", "ingredient-potato-starch", "ingredient-dashi", "ingredient-soy-sauce", "ingredient-daikon"],
    ["1 block firm tofu", "1/2 cup potato starch", "1 cup dashi", "2 tbsp soy sauce", "1 tbsp mirin", "Grated daikon", "Scallions"],
    [
      "Cut tofu into cubes",
      "Drain and pat dry",
      "Coat with potato starch",
      "Heat oil to 350°F (175°C)",
      "Fry tofu until golden",
      "Make dashi broth with soy sauce and mirin",
      "Place tofu in bowls",
      "Pour broth over and garnish"
    ],
    ["japanese", "tofu", "fried"]
  ),
  createRecipe(
    "Hiyashi Chuka",
    "🍜",
    "Easy",
    "25 min",
    "Cold ramen salad with vegetables",
    ["ingredient-ramen-noodles", "ingredient-ham", "ingredient-eggs", "ingredient-cucumber", "ingredient-tomatoes"],
    ["4 servings ramen noodles", "4 slices ham", "2 eggs", "1 cucumber", "2 tomatoes", "Sesame dressing", "Nori strips"],
    [
      "Cook ramen noodles",
      "Rinse with cold water",
      "Make thin omelet and slice",
      "Slice ham into strips",
      "Cut vegetables into strips",
      "Arrange on cold noodles",
      "Drizzle with sesame dressing",
      "Garnish with nori"
    ],
    ["japanese", "cold", "noodles"]
  ),
  createRecipe(
    "Nikujaga",
    "🥘",
    "Easy",
    "45 min",
    "Japanese beef and potato stew",
    ["ingredient-beef", "ingredient-potatoes", "ingredient-onions", "ingredient-carrots", "ingredient-soy-sauce"],
    ["1 lb beef, sliced", "4 potatoes", "2 onions", "2 carrots", "1/2 cup soy sauce", "1/4 cup sugar", "1/4 cup mirin", "Dashi"],
    [
      "Cut vegetables into chunks",
      "Brown beef in pot",
      "Add vegetables",
      "Add dashi, soy sauce, sugar, mirin",
      "Bring to boil",
      "Simmer for 30 minutes",
      "Cook until vegetables are tender",
      "Serve with rice"
    ],
    ["japanese", "stew", "beef"]
  ),
  createRecipe(
    "Gyoza",
    "🥟",
    "Medium",
    "40 min",
    "Japanese pan-fried dumplings",
    ["ingredient-ground-pork", "ingredient-cabbage", "ingredient-garlic", "ingredient-ginger", "ingredient-gyoza-wrappers"],
    ["1 lb ground pork", "1/2 head cabbage", "2 garlic cloves", "1 inch ginger", "40 gyoza wrappers", "Soy sauce", "Sesame oil"],
    [
      "Chop cabbage and salt to remove water",
      "Mix pork with cabbage, garlic, ginger",
      "Add soy sauce and sesame oil",
      "Fill wrappers with mixture",
      "Pleat edges to seal",
      "Pan-fry until bottom is golden",
      "Add water and steam",
      "Serve with dipping sauce"
    ],
    ["japanese", "dumplings", "pan-fried"]
  ),
  createRecipe(
    "Miso Soup",
    "🍲",
    "Easy",
    "15 min",
    "Traditional Japanese soup with miso paste",
    ["ingredient-miso-paste", "ingredient-dashi", "ingredient-tofu", "ingredient-wakame", "ingredient-scallions"],
    ["4 tbsp miso paste", "4 cups dashi", "1/2 block tofu", "2 tbsp wakame", "2 scallions", "Soy sauce"],
    [
      "Soak wakame in water",
      "Heat dashi to just below boiling",
      "Add miso paste and whisk",
      "Cut tofu into small cubes",
      "Add tofu and wakame",
      "Simmer for 2 minutes",
      "Garnish with scallions",
      "Serve immediately"
    ],
    ["japanese", "soup", "miso"]
  ),
  createRecipe(
    "Onigiri",
    "🍙",
    "Easy",
    "20 min",
    "Japanese rice balls with fillings",
    ["ingredient-rice", "ingredient-nori", "ingredient-salmon", "ingredient-umeboshi", "ingredient-sesame"],
    ["4 cups cooked rice", "4 sheets nori", "Cooked salmon", "Umeboshi plums", "Sesame seeds", "Salt"],
    [
      "Season rice with salt",
      "Wet hands with water",
      "Form rice into triangular shapes",
      "Add filling in center",
      "Wrap with nori",
      "Can add sesame seeds",
      "Serve at room temperature",
      "Keep covered to prevent drying"
    ],
    ["japanese", "rice", "portable"]
  ),
  createRecipe(
    "Korokke",
    "🥔",
    "Medium",
    "45 min",
    "Japanese croquettes with meat and potatoes",
    ["ingredient-potatoes", "ingredient-ground-beef", "ingredient-onions", "ingredient-breadcrumbs", "ingredient-eggs"],
    ["4 large potatoes", "1/2 lb ground beef", "1 onion", "2 cups panko breadcrumbs", "3 eggs", "Oil for frying", "Tonkatsu sauce"],
    [
      "Boil and mash potatoes",
      "Cook beef and onions",
      "Mix with mashed potatoes",
      "Season with salt and pepper",
      "Form into oval shapes",
      "Dredge in flour, egg, breadcrumbs",
      "Fry until golden brown",
      "Serve with tonkatsu sauce"
    ],
    ["japanese", "croquettes", "fried"]
  ),
  createRecipe(
    "Shabu Shabu",
    "🍲",
    "Easy",
    "30 min",
    "Japanese hot pot with thin meat slices",
    ["ingredient-beef", "ingredient-vegetables", "ingredient-dashi", "ingredient-tofu", "ingredient-noodles"],
    ["1 lb thinly sliced beef", "Mixed vegetables", "4 cups dashi", "1 block tofu", "Udon noodles", "Ponzu sauce", "Sesame sauce"],
    [
      "Heat dashi in hot pot",
      "Prepare vegetables and tofu",
      "Dip meat in hot broth",
      "Cook until just done",
      "Add vegetables to broth",
      "Serve with dipping sauces",
      "Add noodles at the end",
      "Drink the remaining broth"
    ],
    ["japanese", "hot-pot", "beef"]
  ),
  createRecipe(
    "Taiyaki",
    "🐟",
    "Medium",
    "35 min",
    "Fish-shaped cakes with sweet filling",
    ["ingredient-flour", "ingredient-eggs", "ingredient-milk", "ingredient-azuki-beans", "ingredient-sugar"],
    ["2 cups flour", "2 eggs", "1 cup milk", "1 cup azuki bean paste", "1/2 cup sugar", "1 tsp baking powder", "Oil"],
    [
      "Mix flour, sugar, and baking powder",
      "Beat eggs with milk",
      "Combine wet and dry ingredients",
      "Heat taiyaki pan",
      "Pour batter into fish molds",
      "Add bean paste filling",
      "Cover with more batter",
      "Cook until golden brown"
    ],
    ["japanese", "dessert", "sweet"]
  )
];

// Add to existing Japanese recipes
enRecipes.cultural.Japanese = [...enRecipes.cultural.Japanese, ...additionalJapaneseRecipes];

console.log(`✅ Added ${additionalJapaneseRecipes.length} Japanese recipes (now ${enRecipes.cultural.Japanese.length} total)`);

// KOREAN RECIPES (18 more needed)
const additionalKoreanRecipes = [
  createRecipe(
    "Bulgogi",
    "🥩",
    "Easy",
    "30 min",
    "Marinated grilled beef",
    ["ingredient-beef", "ingredient-soy-sauce", "ingredient-garlic", "ingredient-ginger", "ingredient-sesame-oil"],
    ["2 lb beef sirloin", "1/2 cup soy sauce", "6 garlic cloves", "2 inch ginger", "2 tbsp sesame oil", "2 tbsp sugar", "1 onion"],
    [
      "Slice beef very thinly",
      "Make marinade with soy sauce, garlic, ginger",
      "Add sugar and sesame oil",
      "Marinate beef for 30 minutes",
      "Grill or pan-fry beef",
      "Add sliced onions",
      "Cook until beef is done",
      "Serve with rice and lettuce"
    ],
    ["korean", "grilled", "beef"]
  ),
  createRecipe(
    "Galbi",
    "🍖",
    "Medium",
    "45 min",
    "Korean short ribs with sweet marinade",
    ["ingredient-short-ribs", "ingredient-soy-sauce", "ingredient-garlic", "ingredient-pear", "ingredient-sesame-oil"],
    ["3 lb short ribs", "1/2 cup soy sauce", "8 garlic cloves", "1 Asian pear", "2 tbsp sesame oil", "2 tbsp sugar", "1 onion"],
    [
      "Score ribs between bones",
      "Make marinade with soy sauce, garlic, pear",
      "Add sugar and sesame oil",
      "Marinate ribs for 2 hours",
      "Grill over medium heat",
      "Baste with marinade",
      "Cook until caramelized",
      "Serve with lettuce wraps"
    ],
    ["korean", "ribs", "grilled"]
  ),
  createRecipe(
    "Japchae",
    "🍝",
    "Medium",
    "40 min",
    "Stir-fried glass noodles with vegetables",
    ["ingredient-glass-noodles", "ingredient-beef", "ingredient-vegetables", "ingredient-soy-sauce", "ingredient-sesame-oil"],
    ["8 oz glass noodles", "1/2 lb beef", "Mixed vegetables", "1/4 cup soy sauce", "2 tbsp sesame oil", "2 tbsp sugar", "Sesame seeds"],
    [
      "Soak noodles in warm water",
      "Slice beef and vegetables",
      "Cook beef and set aside",
      "Stir-fry vegetables separately",
      "Cook noodles until tender",
      "Mix everything together",
      "Add soy sauce and sesame oil",
      "Garnish with sesame seeds"
    ],
    ["korean", "noodles", "stir-fry"]
  ),
  createRecipe(
    "Tteokbokki",
    "🌶️",
    "Easy",
    "25 min",
    "Spicy rice cakes in gochujang sauce",
    ["ingredient-rice-cakes", "ingredient-gochujang", "ingredient-fish-cakes", "ingredient-cabbage", "ingredient-scallions"],
    ["1 lb rice cakes", "3 tbsp gochujang", "4 oz fish cakes", "1/2 head cabbage", "2 scallions", "2 tbsp sugar", "1 tbsp soy sauce"],
    [
      "Soak rice cakes in water",
      "Make sauce with gochujang, sugar, soy sauce",
      "Heat sauce in pan",
      "Add rice cakes and fish cakes",
      "Add cabbage",
      "Simmer until sauce thickens",
      "Garnish with scallions",
      "Serve hot"
    ],
    ["korean", "spicy", "street-food"]
  ),
  createRecipe(
    "Bibimbap",
    "🍚",
    "Medium",
    "35 min",
    "Mixed rice bowl with vegetables and meat",
    ["ingredient-rice", "ingredient-beef", "ingredient-vegetables", "ingredient-eggs", "ingredient-gochujang"],
    ["4 cups cooked rice", "1/2 lb beef", "Mixed vegetables", "4 eggs", "4 tbsp gochujang", "Sesame oil", "Sesame seeds"],
    [
      "Cook rice and keep warm",
      "Season and cook beef",
      "Prepare vegetables separately",
      "Fry eggs sunny-side up",
      "Arrange rice in bowls",
      "Top with vegetables and beef",
      "Add fried egg",
      "Serve with gochujang and sesame oil"
    ],
    ["korean", "rice-bowl", "mixed"]
  ),
  createRecipe(
    "Samgyeopsal",
    "🥓",
    "Easy",
    "30 min",
    "Korean grilled pork belly",
    ["ingredient-pork-belly", "ingredient-garlic", "ingredient-sesame-oil", "ingredient-salt", "ingredient-lettuce"],
    ["2 lb pork belly", "8 garlic cloves", "2 tbsp sesame oil", "Coarse salt", "Lettuce leaves", "Ssamjang", "Green onions"],
    [
      "Cut pork belly into thick slices",
      "Heat grill or pan",
      "Grill pork belly until crispy",
      "Cut into bite-sized pieces",
      "Serve with lettuce leaves",
      "Add garlic and ssamjang",
      "Wrap in lettuce",
      "Eat immediately"
    ],
    ["korean", "grilled", "pork"]
  ),
  createRecipe(
    "Haemul Pajeon",
    "🥞",
    "Medium",
    "30 min",
    "Seafood and scallion pancake",
    ["ingredient-flour", "ingredient-eggs", "ingredient-seafood", "ingredient-scallions", "ingredient-soy-sauce"],
    ["2 cups flour", "2 eggs", "1/2 lb mixed seafood", "1 bunch scallions", "1/2 cup soy sauce", "2 tbsp vinegar", "1 tbsp sugar"],
    [
      "Mix flour with water and eggs",
      "Add chopped scallions",
      "Add seafood to batter",
      "Heat oil in pan",
      "Pour batter into pan",
      "Cook until bottom is set",
      "Flip and cook other side",
      "Serve with dipping sauce"
    ],
    ["korean", "pancake", "seafood"]
  ),
  createRecipe(
    "Dakgalbi",
    "🍗",
    "Medium",
    "35 min",
    "Spicy stir-fried chicken with vegetables",
    ["ingredient-chicken", "ingredient-cabbage", "ingredient-sweet-potato", "ingredient-gochujang", "ingredient-garlic"],
    ["2 lb chicken thighs", "1/2 head cabbage", "2 sweet potatoes", "3 tbsp gochujang", "6 garlic cloves", "2 tbsp soy sauce", "1 tbsp sugar"],
    [
      "Cut chicken into bite-sized pieces",
      "Make sauce with gochujang, garlic, soy sauce",
      "Marinate chicken in sauce",
      "Cut vegetables into chunks",
      "Heat large pan or wok",
      "Add chicken and cook",
      "Add vegetables",
      "Stir-fry until everything is cooked"
    ],
    ["korean", "chicken", "spicy"]
  ),
  createRecipe(
    "Sundubu Jjigae",
    "🍲",
    "Easy",
    "25 min",
    "Spicy soft tofu stew",
    ["ingredient-soft-tofu", "ingredient-gochujang", "ingredient-vegetables", "ingredient-seafood", "ingredient-eggs"],
    ["2 packages soft tofu", "2 tbsp gochujang", "Mixed vegetables", "1/2 lb seafood", "2 eggs", "2 tbsp soy sauce", "1 tbsp sesame oil"],
    [
      "Heat oil in pot",
      "Add gochujang and cook",
      "Add vegetables and cook",
      "Add water and bring to boil",
      "Add tofu and seafood",
      "Simmer for 10 minutes",
      "Crack eggs on top",
      "Cook until eggs are set"
    ],
    ["korean", "stew", "tofu"]
  ),
  createRecipe(
    "Gimbap",
    "🍙",
    "Medium",
    "45 min",
    "Korean rice rolls with vegetables and meat",
    ["ingredient-rice", "ingredient-nori", "ingredient-vegetables", "ingredient-beef", "ingredient-eggs"],
    ["4 cups cooked rice", "8 sheets nori", "Mixed vegetables", "1/2 lb beef", "3 eggs", "Sesame oil", "Salt"],
    [
      "Season rice with sesame oil and salt",
      "Cook and season beef",
      "Make thin omelet and slice",
      "Prepare vegetables",
      "Place nori on bamboo mat",
      "Spread rice on nori",
      "Add fillings in center",
      "Roll tightly and slice"
    ],
    ["korean", "rolls", "rice"]
  ),
  createRecipe(
    "Bossam",
    "🥬",
    "Medium",
    "90 min",
    "Boiled pork belly with kimchi",
    ["ingredient-pork-belly", "ingredient-kimchi", "ingredient-garlic", "ingredient-ginger", "ingredient-radish"],
    ["3 lb pork belly", "1 head napa cabbage kimchi", "8 garlic cloves", "2 inch ginger", "1 daikon radish", "Soy sauce", "Sesame oil"],
    [
      "Boil pork belly with garlic and ginger",
      "Cook until very tender",
      "Slice thinly",
      "Make radish kimchi",
      "Serve pork with kimchi",
      "Wrap in lettuce or cabbage",
      "Add ssamjang",
      "Eat as wraps"
    ],
    ["korean", "pork", "boiled"]
  ),
  createRecipe(
    "Naengmyeon",
    "🍜",
    "Medium",
    "40 min",
    "Cold buckwheat noodles in broth",
    ["ingredient-buckwheat-noodles", "ingredient-beef", "ingredient-cucumber", "ingredient-pear", "ingredient-mustard"],
    ["1 lb buckwheat noodles", "1/2 lb beef", "1 cucumber", "1 Asian pear", "2 tbsp mustard", "Vinegar", "Sugar"],
    [
      "Make cold beef broth",
      "Cook and slice beef",
      "Julienne cucumber and pear",
      "Cook noodles and rinse in cold water",
      "Make mustard sauce",
      "Place noodles in bowls",
      "Add cold broth",
      "Top with beef and vegetables"
    ],
    ["korean", "cold", "noodles"]
  ),
  createRecipe(
    "Jjajangmyeon",
    "🍜",
    "Medium",
    "35 min",
    "Noodles with black bean sauce",
    ["ingredient-noodles", "ingredient-pork", "ingredient-black-bean-paste", "ingredient-vegetables", "ingredient-onions"],
    ["1 lb wheat noodles", "1/2 lb pork", "4 tbsp black bean paste", "Mixed vegetables", "2 onions", "2 tbsp soy sauce", "1 tbsp sugar"],
    [
      "Cut pork and vegetables",
      "Heat oil and cook pork",
      "Add vegetables and onions",
      "Add black bean paste",
      "Cook until vegetables are tender",
      "Add water and simmer",
      "Cook noodles separately",
      "Serve noodles with sauce"
    ],
    ["korean", "noodles", "black-bean"]
  ),
  createRecipe(
    "Hotteok",
    "🍯",
    "Medium",
    "30 min",
    "Sweet Korean pancakes with brown sugar filling",
    ["ingredient-flour", "ingredient-yeast", "ingredient-brown-sugar", "ingredient-cinnamon", "ingredient-nuts"],
    ["2 cups flour", "1 tsp yeast", "1/2 cup brown sugar", "1 tsp cinnamon", "1/4 cup chopped nuts", "1 cup warm water", "Oil"],
    [
      "Mix flour with yeast and water",
      "Let rise for 1 hour",
      "Make filling with brown sugar, cinnamon, nuts",
      "Divide dough into balls",
      "Flatten and add filling",
      "Seal edges",
      "Cook in oiled pan",
      "Press flat while cooking"
    ],
    ["korean", "dessert", "sweet"]
  ),
  createRecipe(
    "Gamjatang",
    "🍲",
    "Medium",
    "90 min",
    "Spicy pork bone soup with potatoes",
    ["ingredient-pork-bones", "ingredient-potatoes", "ingredient-vegetables", "ingredient-gochujang", "ingredient-garlic"],
    ["2 lb pork bones", "4 potatoes", "Mixed vegetables", "2 tbsp gochujang", "8 garlic cloves", "2 tbsp soy sauce", "Sesame leaves"],
    [
      "Boil pork bones for 1 hour",
      "Skim foam from surface",
      "Add gochujang and garlic",
      "Add potatoes and vegetables",
      "Simmer for 30 minutes",
      "Season with soy sauce",
      "Add sesame leaves",
      "Serve hot with rice"
    ],
    ["korean", "soup", "pork-bones"]
  ),
  createRecipe(
    "Bingsu",
    "🍧",
    "Easy",
    "20 min",
    "Korean shaved ice dessert",
    ["ingredient-ice", "ingredient-condensed-milk", "ingredient-azuki-beans", "ingredient-fruit", "ingredient-nuts"],
    ["Shaved ice", "1/2 cup condensed milk", "1/2 cup sweet azuki beans", "Mixed fruits", "Chopped nuts", "Ice cream"],
    [
      "Shave ice very finely",
      "Place in serving bowls",
      "Add sweet azuki beans",
      "Top with condensed milk",
      "Add fresh fruits",
      "Sprinkle with nuts",
      "Add scoop of ice cream",
      "Serve immediately"
    ],
    ["korean", "dessert", "shaved-ice"]
  ),
  createRecipe(
    "Makgeolli",
    "🍶",
    "Hard",
    "180 min",
    "Traditional Korean rice wine",
    ["ingredient-rice", "ingredient-nuruk", "ingredient-water", "ingredient-sugar", "ingredient-yeast"],
    ["2 cups rice", "1/4 cup nuruk", "6 cups water", "2 tbsp sugar", "1 tsp yeast", "Cheesecloth", "Fermentation vessel"],
    [
      "Cook rice and cool",
      "Mix with nuruk and water",
      "Add yeast and sugar",
      "Cover and ferment for 3 days",
      "Strain through cheesecloth",
      "Bottle and refrigerate",
      "Serve chilled",
      "Shake before serving"
    ],
    ["korean", "beverage", "fermented"]
  )
];

// Add to existing Korean recipes
enRecipes.cultural.Korean = [...enRecipes.cultural.Korean, ...additionalKoreanRecipes];

console.log(`✅ Added ${additionalKoreanRecipes.length} Korean recipes (now ${enRecipes.cultural.Korean.length} total)`);

// Write back to file
fs.writeFileSync('src/locales/en/recipes.json', JSON.stringify(enRecipes, null, 2));

console.log('');
console.log('✅ Updated English recipes file');
console.log(`📊 Current counts:`);
Object.entries(enRecipes.cultural).forEach(([cuisine, recipes]) => {
  console.log(`   ${cuisine}: ${recipes.length} recipes`);
});

module.exports = { nextId };
