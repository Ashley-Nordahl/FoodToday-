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

console.log(`Starting ID: ${nextId}`);
console.log('');

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

// INDIAN RECIPES (20)
const indianRecipes = [
  createRecipe(
    "Butter Chicken",
    "🍗",
    "Medium",
    "45 min",
    "Creamy tomato-based curry with tender chicken pieces",
    ["ingredient-chicken", "ingredient-butter", "ingredient-cream", "ingredient-tomatoes", "ingredient-garam-masala"],
    ["1 lb chicken breast, cubed", "4 tbsp butter", "1 cup heavy cream", "2 cups tomato puree", "2 tsp garam masala", "1 tsp turmeric", "1 tbsp ginger-garlic paste"],
    [
      "Marinate chicken with yogurt and spices for 30 minutes",
      "Heat butter in a pan and cook chicken until golden",
      "Remove chicken and set aside",
      "In the same pan, add tomato puree and cook for 10 minutes",
      "Add cream, garam masala, and salt",
      "Return chicken to pan and simmer for 15 minutes",
      "Garnish with cilantro and serve with naan"
    ],
    ["indian", "curry", "chicken"]
  ),
  createRecipe(
    "Chicken Tikka Masala",
    "🍛",
    "Medium",
    "60 min",
    "Grilled chicken in spiced tomato cream sauce",
    ["ingredient-chicken", "ingredient-yogurt", "ingredient-tomatoes", "ingredient-cream", "ingredient-spices"],
    ["1.5 lb chicken thighs, cubed", "1 cup yogurt", "2 cups tomato sauce", "1 cup cream", "2 tbsp tikka masala spice", "1 tbsp ginger-garlic paste"],
    [
      "Marinate chicken in yogurt and tikka spices for 2 hours",
      "Grill or broil chicken until charred",
      "Heat oil in pan, add onions and cook until soft",
      "Add tomato sauce and cook for 15 minutes",
      "Add grilled chicken and cream",
      "Simmer for 10 minutes",
      "Serve with basmati rice"
    ],
    ["indian", "curry", "grilled"]
  ),
  createRecipe(
    "Palak Paneer",
    "🥬",
    "Easy",
    "30 min",
    "Spinach curry with Indian cottage cheese",
    ["ingredient-spinach", "ingredient-paneer", "ingredient-cream", "ingredient-spices", "ingredient-onion"],
    ["1 lb spinach, blanched", "8 oz paneer, cubed", "1/2 cup cream", "1 onion, diced", "2 tsp cumin seeds", "1 tbsp ginger-garlic paste"],
    [
      "Blanch spinach and blend into smooth puree",
      "Heat oil, add cumin seeds",
      "Add onions and cook until golden",
      "Add ginger-garlic paste and spices",
      "Pour spinach puree and cook for 10 minutes",
      "Add paneer cubes and cream",
      "Simmer for 5 minutes and serve"
    ],
    ["indian", "vegetarian", "curry"]
  ),
  createRecipe(
    "Chicken Biryani",
    "🍚",
    "Hard",
    "90 min",
    "Fragrant rice with spiced chicken and aromatic herbs",
    ["ingredient-rice", "ingredient-chicken", "ingredient-yogurt", "ingredient-saffron", "ingredient-spices"],
    ["2 cups basmati rice", "1 lb chicken, cubed", "1 cup yogurt", "Pinch of saffron", "2 tbsp biryani masala", "4 tbsp ghee", "2 onions, sliced"],
    [
      "Marinate chicken in yogurt and spices for 1 hour",
      "Cook rice 70% done and set aside",
      "Fry onions until golden and crispy",
      "Layer marinated chicken, rice, fried onions, and saffron milk",
      "Cover tightly and cook on low heat for 30 minutes",
      "Let it rest for 10 minutes",
      "Serve with raita"
    ],
    ["indian", "rice", "one-pot"]
  ),
  createRecipe(
    "Samosas",
    "🥟",
    "Medium",
    "45 min",
    "Crispy fried pastry with spiced potato filling",
    ["ingredient-potatoes", "ingredient-peas", "ingredient-flour", "ingredient-spices", "ingredient-oil"],
    ["4 large potatoes, boiled and mashed", "1 cup green peas", "2 cups flour", "1 tsp cumin seeds", "1 tsp garam masala", "Oil for frying"],
    [
      "Make dough with flour, oil, and water, rest for 30 minutes",
      "Cook cumin seeds, add mashed potatoes, peas, and spices",
      "Roll dough into thin circles, cut in half",
      "Form cone shape, fill with potato mixture",
      "Seal edges with water",
      "Deep fry until golden brown",
      "Serve hot with chutney"
    ],
    ["indian", "snack", "fried"]
  ),
  createRecipe(
    "Tandoori Chicken",
    "🍗",
    "Medium",
    "120 min",
    "Yogurt-marinated chicken roasted to perfection",
    ["ingredient-chicken", "ingredient-yogurt", "ingredient-tandoori-masala", "ingredient-lemon", "ingredient-ginger"],
    ["1 whole chicken, cut into pieces", "1 cup yogurt", "3 tbsp tandoori masala", "2 tbsp lemon juice", "2 tbsp ginger-garlic paste"],
    [
      "Make deep cuts in chicken pieces",
      "Mix yogurt, tandoori masala, lemon juice, and ginger-garlic paste",
      "Marinate chicken for at least 2 hours or overnight",
      "Preheat oven to 450°F (230°C)",
      "Place chicken on a wire rack",
      "Roast for 30-40 minutes, turning once",
      "Char under broiler for 2-3 minutes",
      "Serve with mint chutney"
    ],
    ["indian", "grilled", "chicken"]
  ),
  createRecipe(
    "Dal Makhani",
    "🍲",
    "Easy",
    "60 min",
    "Creamy black lentils with butter and cream",
    ["ingredient-black-lentils", "ingredient-butter", "ingredient-cream", "ingredient-tomatoes", "ingredient-spices"],
    ["1 cup black lentils", "4 tbsp butter", "1/2 cup cream", "1 cup tomato puree", "1 tsp garam masala", "1 tbsp ginger-garlic paste"],
    [
      "Soak lentils overnight, pressure cook until soft",
      "Heat butter in pan, add ginger-garlic paste",
      "Add tomato puree and cook for 10 minutes",
      "Add cooked lentils and simmer for 20 minutes",
      "Stir in cream and garam masala",
      "Simmer for another 10 minutes",
      "Serve with naan or rice"
    ],
    ["indian", "vegetarian", "lentils"]
  ),
  createRecipe(
    "Rogan Josh",
    "🍖",
    "Medium",
    "75 min",
    "Aromatic lamb curry with Kashmiri spices",
    ["ingredient-lamb", "ingredient-yogurt", "ingredient-kashmiri-chili", "ingredient-fennel", "ingredient-ginger"],
    ["2 lb lamb, cubed", "1 cup yogurt", "2 tbsp Kashmiri chili powder", "1 tsp fennel powder", "2 tbsp ginger-garlic paste", "4 tbsp oil"],
    [
      "Heat oil and brown lamb pieces",
      "Remove lamb and set aside",
      "Add whole spices and fry until fragrant",
      "Add ginger-garlic paste and cook for 2 minutes",
      "Add yogurt gradually, stirring constantly",
      "Return lamb, add water, and simmer for 45 minutes",
      "Garnish with cilantro and serve"
    ],
    ["indian", "lamb", "curry"]
  ),
  createRecipe(
    "Chana Masala",
    "🥘",
    "Easy",
    "30 min",
    "Spiced chickpea curry with tomatoes",
    ["ingredient-chickpeas", "ingredient-tomatoes", "ingredient-onion", "ingredient-spices", "ingredient-cilantro"],
    ["2 cups chickpeas, cooked", "2 large tomatoes, pureed", "1 large onion, diced", "2 tsp chana masala", "1 tsp cumin seeds", "Fresh cilantro"],
    [
      "Heat oil, add cumin seeds",
      "Add onions and cook until golden",
      "Add tomato puree and cook for 10 minutes",
      "Add chana masala and other spices",
      "Add chickpeas and simmer for 15 minutes",
      "Garnish with cilantro",
      "Serve with bhatura or rice"
    ],
    ["indian", "vegetarian", "chickpeas"]
  ),
  createRecipe(
    "Naan Bread",
    "🫓",
    "Medium",
    "90 min",
    "Soft leavened flatbread baked to perfection",
    ["ingredient-flour", "ingredient-yogurt", "ingredient-yeast", "ingredient-sugar", "ingredient-butter"],
    ["4 cups flour", "1 cup yogurt", "2 tsp yeast", "2 tsp sugar", "4 tbsp melted butter", "1 tsp salt", "Warm water as needed"],
    [
      "Mix yeast with warm water and sugar, let foam",
      "Combine flour, yogurt, yeast mixture, and salt",
      "Knead into soft dough, let rise for 1 hour",
      "Divide into balls, roll into oval shapes",
      "Heat skillet or tandoor to very hot",
      "Cook naan until bubbles form and base chars",
      "Brush with butter and serve hot"
    ],
    ["indian", "bread", "flatbread"]
  ),
  createRecipe(
    "Aloo Gobi",
    "🥔",
    "Easy",
    "30 min",
    "Potato and cauliflower dry curry with turmeric",
    ["ingredient-potatoes", "ingredient-cauliflower", "ingredient-turmeric", "ingredient-cumin", "ingredient-tomatoes"],
    ["3 large potatoes, cubed", "1 small cauliflower, florets", "1 tsp turmeric", "1 tsp cumin seeds", "2 tomatoes, chopped", "Fresh cilantro"],
    [
      "Heat oil, add cumin seeds",
      "Add potatoes and fry for 5 minutes",
      "Add cauliflower and turmeric",
      "Cover and cook for 15 minutes, stirring occasionally",
      "Add tomatoes and spices",
      "Cook until vegetables are tender",
      "Garnish with cilantro"
    ],
    ["indian", "vegetarian", "dry-curry"]
  ),
  createRecipe(
    "Vindaloo",
    "🌶️",
    "Medium",
    "60 min",
    "Spicy and tangy Goan curry with vinegar",
    ["ingredient-pork", "ingredient-vinegar", "ingredient-kashmiri-chili", "ingredient-garlic", "ingredient-spices"],
    ["2 lb pork, cubed", "1/4 cup vinegar", "3 tbsp Kashmiri chili powder", "10 garlic cloves", "2 tsp cumin seeds", "1 tsp mustard seeds"],
    [
      "Make paste of garlic, chilies, cumin, and vinegar",
      "Marinate pork in paste for 30 minutes",
      "Heat oil, add mustard seeds",
      "Add marinated pork and cook on high heat",
      "Add water and simmer for 40 minutes",
      "Adjust seasoning with salt and sugar",
      "Serve with rice or bread"
    ],
    ["indian", "pork", "spicy"]
  ),
  createRecipe(
    "Korma",
    "🥘",
    "Medium",
    "45 min",
    "Mild creamy curry with nuts and yogurt",
    ["ingredient-chicken", "ingredient-yogurt", "ingredient-cashews", "ingredient-cream", "ingredient-cardamom"],
    ["1.5 lb chicken, cubed", "1 cup yogurt", "1/2 cup cashews", "1/2 cup cream", "4 cardamom pods", "1 onion, pureed", "2 tbsp ghee"],
    [
      "Grind cashews with water to make paste",
      "Heat ghee, add cardamom and whole spices",
      "Add onion puree and cook until golden",
      "Add chicken and brown",
      "Add yogurt and cook for 5 minutes",
      "Add cashew paste and cream",
      "Simmer until chicken is cooked, about 20 minutes"
    ],
    ["indian", "mild", "creamy"]
  ),
  createRecipe(
    "Pav Bhaji",
    "🍔",
    "Easy",
    "40 min",
    "Spiced mixed vegetable mash with bread rolls",
    ["ingredient-potatoes", "ingredient-mixed-vegetables", "ingredient-pav-bhaji-masala", "ingredient-butter", "ingredient-bread-rolls"],
    ["4 potatoes, boiled", "2 cups mixed vegetables", "3 tbsp pav bhaji masala", "6 tbsp butter", "8 pav (bread rolls)", "2 onions, chopped"],
    [
      "Boil and mash all vegetables together",
      "Heat butter in pan, add onions",
      "Add pav bhaji masala and cook for 2 minutes",
      "Add mashed vegetables and mix well",
      "Cook for 15 minutes, mashing and stirring",
      "Toast pav with butter on griddle",
      "Serve bhaji with buttered pav"
    ],
    ["indian", "street-food", "vegetarian"]
  ),
  createRecipe(
    "Masala Dosa",
    "🥞",
    "Medium",
    "30 min",
    "Crispy fermented crepe with spiced potato filling",
    ["ingredient-dosa-batter", "ingredient-potatoes", "ingredient-mustard-seeds", "ingredient-curry-leaves", "ingredient-turmeric"],
    ["2 cups dosa batter", "4 potatoes, boiled and mashed", "1 tsp mustard seeds", "10 curry leaves", "1/2 tsp turmeric", "2 green chilies"],
    [
      "Heat oil, add mustard seeds and curry leaves",
      "Add turmeric, chilies, and onions",
      "Add mashed potatoes and mix well",
      "Heat dosa pan, pour batter in circular motion",
      "Drizzle oil around edges",
      "Place potato filling in center",
      "Fold and serve with chutney and sambar"
    ],
    ["indian", "south-indian", "breakfast"]
  ),
  createRecipe(
    "Idli",
    "🍘",
    "Medium",
    "20 min",
    "Soft steamed rice cakes served with sambar",
    ["ingredient-idli-batter", "ingredient-dal", "ingredient-vegetables", "ingredient-tamarind", "ingredient-mustard-seeds"],
    ["2 cups idli batter", "1/2 cup toor dal", "1 cup mixed vegetables", "Small tamarind ball", "1 tsp mustard seeds", "Curry leaves"],
    [
      "Grease idli molds with oil",
      "Pour idli batter into molds",
      "Steam for 10-12 minutes",
      "For sambar: Cook dal and vegetables with tamarind",
      "Temper with mustard seeds and curry leaves",
      "Serve hot idlis with sambar and coconut chutney"
    ],
    ["indian", "south-indian", "steamed"]
  ),
  createRecipe(
    "Malai Kofta",
    "🥘",
    "Hard",
    "60 min",
    "Fried vegetable balls in creamy tomato sauce",
    ["ingredient-potatoes", "ingredient-paneer", "ingredient-cream", "ingredient-tomatoes", "ingredient-cashews"],
    ["3 potatoes, boiled", "1 cup paneer, grated", "1 cup cream", "2 cups tomato puree", "1/2 cup cashews", "2 tbsp cornstarch"],
    [
      "Mix mashed potatoes, paneer, and spices",
      "Form into balls, deep fry until golden",
      "Grind cashews and tomatoes separately",
      "Cook tomato puree with cashew paste",
      "Add cream and spices",
      "Add fried koftas just before serving",
      "Garnish with cream and serve with naan"
    ],
    ["indian", "vegetarian", "fried"]
  ),
  createRecipe(
    "Chole Bhature",
    "🫓",
    "Medium",
    "60 min",
    "Spiced chickpeas with fried puffy bread",
    ["ingredient-chickpeas", "ingredient-flour", "ingredient-yogurt", "ingredient-chole-masala", "ingredient-tomatoes"],
    ["2 cups chickpeas, soaked", "2 cups flour", "1/2 cup yogurt", "2 tbsp chole masala", "2 tomatoes, pureed", "Oil for frying"],
    [
      "Pressure cook chickpeas until soft",
      "Make dough with flour, yogurt, and oil, rest 1 hour",
      "Cook tomatoes with chole masala",
      "Add chickpeas and simmer for 20 minutes",
      "Roll dough into circles, deep fry until puffed",
      "Serve hot bhature with chole",
      "Garnish with onions and lemon"
    ],
    ["indian", "punjabi", "fried-bread"]
  ),
  createRecipe(
    "Raita",
    "🥛",
    "Easy",
    "10 min",
    "Cool yogurt with cucumber and spices",
    ["ingredient-yogurt", "ingredient-cucumber", "ingredient-cumin", "ingredient-mint", "ingredient-cilantro"],
    ["2 cups yogurt", "1 cucumber, grated", "1 tsp roasted cumin powder", "Fresh mint leaves", "Fresh cilantro", "Salt to taste"],
    [
      "Whisk yogurt until smooth",
      "Grate cucumber and squeeze out excess water",
      "Mix cucumber with yogurt",
      "Add roasted cumin powder and salt",
      "Chop mint and cilantro finely",
      "Mix everything together",
      "Chill and serve with biryani or paratha"
    ],
    ["indian", "side-dish", "yogurt"]
  ),
  createRecipe(
    "Gulab Jamun",
    "🍡",
    "Hard",
    "60 min",
    "Sweet fried milk dumplings in rose-scented syrup",
    ["ingredient-milk-powder", "ingredient-flour", "ingredient-sugar", "ingredient-cardamom", "ingredient-rose-water"],
    ["1 cup milk powder", "1/4 cup flour", "2 cups sugar", "4 cardamom pods", "2 tsp rose water", "Ghee for frying"],
    [
      "Make sugar syrup with water, sugar, and cardamom",
      "Mix milk powder, flour, and little milk to form soft dough",
      "Shape into small smooth balls",
      "Heat ghee on medium-low heat",
      "Fry balls until golden brown",
      "Soak in warm sugar syrup for 2 hours",
      "Serve warm or at room temperature"
    ],
    ["indian", "dessert", "sweet"]
  )
];

console.log(`✅ Generated ${indianRecipes.length} Indian recipes`);
console.log('');

// Export for next step
module.exports = { indianRecipes, nextId };

