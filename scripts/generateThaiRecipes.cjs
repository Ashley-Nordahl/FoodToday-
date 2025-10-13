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

console.log(`Starting Thai recipes from ID: ${nextId}`);

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

// THAI RECIPES (20)
const thaiRecipes = [
  createRecipe(
    "Pad Thai",
    "🍝",
    "Medium",
    "30 min",
    "Stir-fried rice noodles with shrimp and peanuts",
    ["ingredient-rice-noodles", "ingredient-shrimp", "ingredient-peanuts", "ingredient-tamarind", "ingredient-fish-sauce"],
    ["8 oz rice noodles", "1 lb shrimp, peeled", "1/2 cup roasted peanuts", "3 tbsp tamarind paste", "3 tbsp fish sauce", "2 tbsp palm sugar", "2 eggs", "Bean sprouts"],
    [
      "Soak rice noodles in warm water for 30 minutes",
      "Heat oil in wok, add shrimp and cook until pink",
      "Push shrimp to side, add beaten eggs and scramble",
      "Add noodles and stir-fry for 2 minutes",
      "Add tamarind, fish sauce, and palm sugar",
      "Toss everything together",
      "Add bean sprouts and peanuts",
      "Serve with lime wedges and chili flakes"
    ],
    ["thai", "noodles", "stir-fry"]
  ),
  createRecipe(
    "Green Curry",
    "🍛",
    "Medium",
    "40 min",
    "Spicy coconut curry with green chilies and Thai basil",
    ["ingredient-chicken", "ingredient-coconut-milk", "ingredient-green-curry-paste", "ingredient-thai-basil", "ingredient-eggplant"],
    ["1.5 lb chicken, cubed", "2 cups coconut milk", "3 tbsp green curry paste", "1 cup Thai basil leaves", "1 cup Thai eggplant", "2 tbsp fish sauce", "1 tbsp palm sugar"],
    [
      "Heat half the coconut milk in a pot",
      "Add green curry paste and cook until fragrant",
      "Add chicken and cook until sealed",
      "Add remaining coconut milk and bring to boil",
      "Add eggplant and simmer for 15 minutes",
      "Season with fish sauce and palm sugar",
      "Add Thai basil just before serving",
      "Serve with jasmine rice"
    ],
    ["thai", "curry", "coconut"]
  ),
  createRecipe(
    "Tom Yum Soup",
    "🍲",
    "Easy",
    "25 min",
    "Hot and sour soup with lemongrass and shrimp",
    ["ingredient-shrimp", "ingredient-lemongrass", "ingredient-galangal", "ingredient-lime-leaves", "ingredient-chili"],
    ["1 lb shrimp, peeled", "3 stalks lemongrass", "2 inch galangal", "6 kaffir lime leaves", "3 Thai chilies", "3 tbsp fish sauce", "2 tbsp lime juice", "Mushrooms"],
    [
      "Bring water to boil with lemongrass, galangal, and lime leaves",
      "Add mushrooms and simmer for 5 minutes",
      "Add shrimp and cook until pink",
      "Season with fish sauce and lime juice",
      "Add chilies and remove from heat",
      "Garnish with cilantro",
      "Serve hot"
    ],
    ["thai", "soup", "spicy"]
  ),
  createRecipe(
    "Massaman Curry",
    "🥘",
    "Medium",
    "60 min",
    "Rich curry with peanuts and potatoes",
    ["ingredient-beef", "ingredient-coconut-milk", "ingredient-massaman-paste", "ingredient-peanuts", "ingredient-potatoes"],
    ["2 lb beef, cubed", "2 cups coconut milk", "4 tbsp massaman paste", "1/2 cup roasted peanuts", "3 potatoes, cubed", "2 tbsp fish sauce", "1 tbsp palm sugar"],
    [
      "Heat coconut milk and add massaman paste",
      "Cook until oil separates",
      "Add beef and brown on all sides",
      "Add water and simmer for 30 minutes",
      "Add potatoes and peanuts",
      "Simmer until beef is tender",
      "Season with fish sauce and palm sugar",
      "Serve with jasmine rice"
    ],
    ["thai", "curry", "beef"]
  ),
  createRecipe(
    "Som Tam",
    "🥗",
    "Easy",
    "15 min",
    "Spicy green papaya salad with peanuts",
    ["ingredient-green-papaya", "ingredient-tomatoes", "ingredient-peanuts", "ingredient-lime", "ingredient-fish-sauce"],
    ["1 green papaya, shredded", "2 tomatoes, sliced", "1/2 cup roasted peanuts", "2 limes, juiced", "3 tbsp fish sauce", "2 tbsp palm sugar", "3 Thai chilies", "Green beans"],
    [
      "Pound chilies and garlic in mortar",
      "Add fish sauce, lime juice, and palm sugar",
      "Mix until sugar dissolves",
      "Add green beans and pound lightly",
      "Add papaya and tomatoes",
      "Toss everything together",
      "Top with peanuts",
      "Serve immediately"
    ],
    ["thai", "salad", "spicy"]
  ),
  createRecipe(
    "Pad Krapow",
    "🍖",
    "Easy",
    "20 min",
    "Spicy basil chicken with fried egg",
    ["ingredient-chicken", "ingredient-thai-basil", "ingredient-chili", "ingredient-garlic", "ingredient-fish-sauce"],
    ["1 lb ground chicken", "2 cups Thai basil leaves", "5 Thai chilies", "6 garlic cloves", "3 tbsp fish sauce", "1 tbsp soy sauce", "1 tbsp oyster sauce", "4 eggs"],
    [
      "Heat oil in wok, add garlic and chilies",
      "Add ground chicken and cook until done",
      "Add fish sauce, soy sauce, and oyster sauce",
      "Add Thai basil and stir until wilted",
      "Fry eggs sunny-side up",
      "Serve chicken over rice with fried egg",
      "Garnish with more basil"
    ],
    ["thai", "chicken", "basil"]
  ),
  createRecipe(
    "Red Curry",
    "🍛",
    "Medium",
    "35 min",
    "Rich red curry with coconut milk",
    ["ingredient-chicken", "ingredient-coconut-milk", "ingredient-red-curry-paste", "ingredient-bamboo-shoots", "ingredient-thai-basil"],
    ["1.5 lb chicken, cubed", "2 cups coconut milk", "3 tbsp red curry paste", "1 cup bamboo shoots", "1 cup Thai basil", "2 tbsp fish sauce", "1 tbsp palm sugar"],
    [
      "Heat half coconut milk, add red curry paste",
      "Cook until fragrant and oil separates",
      "Add chicken and cook until sealed",
      "Add remaining coconut milk",
      "Add bamboo shoots and simmer 15 minutes",
      "Season with fish sauce and palm sugar",
      "Add Thai basil before serving",
      "Serve with jasmine rice"
    ],
    ["thai", "curry", "red"]
  ),
  createRecipe(
    "Khao Soi",
    "🍜",
    "Medium",
    "45 min",
    "Northern Thai curry noodle soup",
    ["ingredient-chicken", "ingredient-coconut-milk", "ingredient-curry-paste", "ingredient-egg-noodles", "ingredient-lime"],
    ["1.5 lb chicken, cubed", "2 cups coconut milk", "3 tbsp curry paste", "1 lb egg noodles", "2 limes, juiced", "2 tbsp fish sauce", "Pickled mustard greens"],
    [
      "Heat coconut milk, add curry paste",
      "Cook until oil separates",
      "Add chicken and brown",
      "Add water and simmer 20 minutes",
      "Cook half the noodles soft, half crispy",
      "Season with fish sauce and lime juice",
      "Serve with both noodles",
      "Top with pickled greens and shallots"
    ],
    ["thai", "noodles", "curry"]
  ),
  createRecipe(
    "Larb",
    "🥗",
    "Easy",
    "20 min",
    "Spicy minced meat salad with herbs",
    ["ingredient-ground-pork", "ingredient-mint", "ingredient-cilantro", "ingredient-lime", "ingredient-chili"],
    ["1 lb ground pork", "1/2 cup mint leaves", "1/2 cup cilantro", "2 limes, juiced", "3 Thai chilies", "2 tbsp fish sauce", "1 tbsp roasted rice powder"],
    [
      "Cook ground pork until done",
      "Remove from heat and cool slightly",
      "Add fish sauce and lime juice",
      "Add chopped chilies and herbs",
      "Toss with roasted rice powder",
      "Serve with lettuce leaves",
      "Garnish with more herbs"
    ],
    ["thai", "salad", "pork"]
  ),
  createRecipe(
    "Satay",
    "🍢",
    "Easy",
    "30 min",
    "Grilled skewers with peanut sauce",
    ["ingredient-chicken", "ingredient-peanuts", "ingredient-coconut-milk", "ingredient-curry-paste", "ingredient-lime"],
    ["1.5 lb chicken, cubed", "1 cup roasted peanuts", "1/2 cup coconut milk", "2 tbsp curry paste", "2 limes, juiced", "2 tbsp fish sauce", "Bamboo skewers"],
    [
      "Marinate chicken in curry paste and coconut milk",
      "Thread chicken onto skewers",
      "Grill until cooked through",
      "For sauce: blend peanuts, coconut milk, curry paste",
      "Season with fish sauce and lime juice",
      "Serve skewers with peanut sauce",
      "Garnish with cucumber and onion"
    ],
    ["thai", "grilled", "peanut"]
  ),
  createRecipe(
    "Panang Curry",
    "🍛",
    "Medium",
    "35 min",
    "Thick red curry with peanuts",
    ["ingredient-chicken", "ingredient-coconut-milk", "ingredient-panang-paste", "ingredient-peanuts", "ingredient-thai-basil"],
    ["1.5 lb chicken, cubed", "2 cups coconut milk", "3 tbsp panang paste", "1/4 cup peanuts", "1 cup Thai basil", "2 tbsp fish sauce", "1 tbsp palm sugar"],
    [
      "Heat coconut milk, add panang paste",
      "Cook until fragrant",
      "Add chicken and cook until sealed",
      "Add remaining coconut milk",
      "Simmer for 15 minutes",
      "Add peanuts and basil",
      "Season with fish sauce and palm sugar",
      "Serve with jasmine rice"
    ],
    ["thai", "curry", "panang"]
  ),
  createRecipe(
    "Tom Kha Gai",
    "🍲",
    "Easy",
    "30 min",
    "Coconut chicken soup with galangal",
    ["ingredient-chicken", "ingredient-coconut-milk", "ingredient-galangal", "ingredient-lemongrass", "ingredient-lime-leaves"],
    ["1 lb chicken, cubed", "2 cups coconut milk", "2 inch galangal", "3 stalks lemongrass", "6 kaffir lime leaves", "3 tbsp fish sauce", "2 tbsp lime juice", "Mushrooms"],
    [
      "Bring coconut milk to boil with galangal, lemongrass, lime leaves",
      "Add chicken and mushrooms",
      "Simmer until chicken is cooked",
      "Season with fish sauce and lime juice",
      "Add chilies if desired",
      "Garnish with cilantro",
      "Serve hot"
    ],
    ["thai", "soup", "coconut"]
  ),
  createRecipe(
    "Pad See Ew",
    "🍝",
    "Easy",
    "20 min",
    "Stir-fried wide noodles with soy sauce",
    ["ingredient-wide-noodles", "ingredient-chicken", "ingredient-chinese-broccoli", "ingredient-soy-sauce", "ingredient-oyster-sauce"],
    ["1 lb wide rice noodles", "1 lb chicken, sliced", "2 cups Chinese broccoli", "3 tbsp soy sauce", "2 tbsp oyster sauce", "2 tbsp fish sauce", "2 eggs"],
    [
      "Heat oil in wok, add chicken and cook",
      "Add Chinese broccoli and stir-fry",
      "Add noodles and toss",
      "Add soy sauce, oyster sauce, fish sauce",
      "Push everything to side, add beaten eggs",
      "Scramble eggs and mix with noodles",
      "Serve hot"
    ],
    ["thai", "noodles", "stir-fry"]
  ),
  createRecipe(
    "Mango Sticky Rice",
    "🥭",
    "Easy",
    "30 min",
    "Sweet coconut sticky rice with mango",
    ["ingredient-sticky-rice", "ingredient-coconut-milk", "ingredient-mango", "ingredient-sugar", "ingredient-salt"],
    ["2 cups sticky rice", "1 cup coconut milk", "2 ripe mangoes", "1/2 cup sugar", "1/2 tsp salt", "Sesame seeds"],
    [
      "Soak sticky rice for 4 hours",
      "Steam rice for 20 minutes",
      "Heat coconut milk with sugar and salt",
      "Pour over hot rice and let absorb",
      "Slice mangoes",
      "Serve rice with mango slices",
      "Sprinkle with sesame seeds"
    ],
    ["thai", "dessert", "sweet"]
  ),
  createRecipe(
    "Spring Rolls",
    "🥟",
    "Medium",
    "40 min",
    "Fresh rice paper rolls with vegetables",
    ["ingredient-rice-paper", "ingredient-shrimp", "ingredient-vermicelli", "ingredient-herbs", "ingredient-vegetables"],
    ["12 rice paper sheets", "1 lb shrimp, cooked", "4 oz vermicelli noodles", "Fresh herbs (mint, cilantro)", "Lettuce, cucumber, carrots", "Dipping sauce"],
    [
      "Soak vermicelli noodles",
      "Prepare all vegetables and herbs",
      "Soak rice paper in warm water",
      "Place shrimp and vegetables on rice paper",
      "Add herbs and noodles",
      "Roll tightly",
      "Serve with dipping sauce"
    ],
    ["thai", "appetizer", "fresh"]
  ),
  createRecipe(
    "Crying Tiger",
    "🥩",
    "Medium",
    "30 min",
    "Grilled marinated beef with spicy sauce",
    ["ingredient-beef", "ingredient-garlic", "ingredient-cilantro", "ingredient-lime", "ingredient-chili"],
    ["2 lb beef sirloin", "6 garlic cloves", "1/2 cup cilantro", "2 limes, juiced", "3 Thai chilies", "2 tbsp fish sauce", "1 tbsp soy sauce"],
    [
      "Marinate beef with garlic, soy sauce, and lime juice",
      "Grill beef to desired doneness",
      "Slice thinly against the grain",
      "Make sauce with chilies, fish sauce, lime juice",
      "Add cilantro to sauce",
      "Serve beef with spicy sauce",
      "Garnish with more herbs"
    ],
    ["thai", "beef", "grilled"]
  ),
  createRecipe(
    "Kai Jeow",
    "🍳",
    "Easy",
    "10 min",
    "Thai-style fluffy omelet",
    ["ingredient-eggs", "ingredient-fish-sauce", "ingredient-oil", "ingredient-cilantro", "ingredient-green-onions"],
    ["4 eggs", "2 tbsp fish sauce", "1/4 cup oil", "Fresh cilantro", "2 green onions", "White pepper"],
    [
      "Beat eggs with fish sauce and white pepper",
      "Heat oil in wok until very hot",
      "Pour eggs into hot oil",
      "Let bottom set, then fold over",
      "Cook until golden and fluffy",
      "Garnish with cilantro and green onions",
      "Serve with rice"
    ],
    ["thai", "eggs", "simple"]
  ),
  createRecipe(
    "Gaeng Keow Wan",
    "🥘",
    "Medium",
    "40 min",
    "Sweet green curry with vegetables",
    ["ingredient-vegetables", "ingredient-coconut-milk", "ingredient-green-curry-paste", "ingredient-thai-basil", "ingredient-eggplant"],
    ["Mixed vegetables (eggplant, bamboo shoots)", "2 cups coconut milk", "3 tbsp green curry paste", "1 cup Thai basil", "2 tbsp fish sauce", "1 tbsp palm sugar"],
    [
      "Heat coconut milk, add green curry paste",
      "Cook until fragrant",
      "Add vegetables and cook until tender",
      "Season with fish sauce and palm sugar",
      "Add Thai basil before serving",
      "Serve with jasmine rice",
      "Garnish with more basil"
    ],
    ["thai", "vegetarian", "green-curry"]
  ),
  createRecipe(
    "Yum Woon Sen",
    "🥗",
    "Easy",
    "20 min",
    "Spicy glass noodle salad",
    ["ingredient-glass-noodles", "ingredient-shrimp", "ingredient-lime", "ingredient-fish-sauce", "ingredient-chili"],
    ["4 oz glass noodles", "1 lb shrimp, cooked", "2 limes, juiced", "3 tbsp fish sauce", "3 Thai chilies", "1/2 cup cilantro", "1/2 cup mint"],
    [
      "Soak glass noodles in warm water",
      "Drain and set aside",
      "Mix lime juice, fish sauce, and chilies",
      "Add shrimp and noodles",
      "Toss with herbs",
      "Let marinate for 10 minutes",
      "Serve chilled"
    ],
    ["thai", "salad", "glass-noodles"]
  ),
  createRecipe(
    "Khao Pad",
    "🍚",
    "Easy",
    "15 min",
    "Thai fried rice with egg and vegetables",
    ["ingredient-jasmine-rice", "ingredient-eggs", "ingredient-vegetables", "ingredient-soy-sauce", "ingredient-fish-sauce"],
    ["4 cups cooked jasmine rice", "3 eggs", "Mixed vegetables", "3 tbsp soy sauce", "1 tbsp fish sauce", "2 tbsp oil", "Green onions"],
    [
      "Heat oil in wok",
      "Add beaten eggs and scramble",
      "Add vegetables and stir-fry",
      "Add rice and break up clumps",
      "Add soy sauce and fish sauce",
      "Toss everything together",
      "Garnish with green onions",
      "Serve hot"
    ],
    ["thai", "fried-rice", "simple"]
  )
];

console.log(`✅ Generated ${thaiRecipes.length} Thai recipes`);
console.log('');

// Add to English recipes
enRecipes.cultural.Thai = thaiRecipes;
fs.writeFileSync('src/locales/en/recipes.json', JSON.stringify(enRecipes, null, 2));

console.log('✅ Added Thai recipes to English file');
console.log('');

module.exports = { thaiRecipes, nextId };
