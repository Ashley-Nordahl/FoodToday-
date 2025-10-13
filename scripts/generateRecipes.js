const fs = require('fs');

// Recipe database with authentic dishes for each cuisine
const recipeDatabase = {
  Indian: [
    { name: "Butter Chicken", emoji: "🍗", difficulty: "Medium", time: "45 min", description: "Creamy tomato-based curry with tender chicken pieces" },
    { name: "Chicken Tikka Masala", emoji: "🍛", difficulty: "Medium", time: "60 min", description: "Grilled chicken in spiced tomato cream sauce" },
    { name: "Palak Paneer", emoji: "🥬", difficulty: "Easy", time: "30 min", description: "Spinach curry with Indian cottage cheese" },
    { name: "Biryani", emoji: "🍚", difficulty: "Hard", time: "90 min", description: "Fragrant rice with spiced meat and aromatic herbs" },
    { name: "Samosas", emoji: "🥟", difficulty: "Medium", time: "45 min", description: "Crispy fried pastry with spiced potato filling" },
    { name: "Tandoori Chicken", emoji: "🍗", difficulty: "Medium", time: "120 min", description: "Yogurt-marinated chicken roasted in tandoor" },
    { name: "Dal Makhani", emoji: "🍲", difficulty: "Easy", time: "60 min", description: "Creamy black lentils with butter and cream" },
    { name: "Rogan Josh", emoji: "🍖", difficulty: "Medium", time: "75 min", description: "Aromatic lamb curry with Kashmiri spices" },
    { name: "Chana Masala", emoji: "🥘", difficulty: "Easy", time: "30 min", description: "Spiced chickpea curry with tomatoes" },
    { name: "Naan Bread", emoji: "🫓", difficulty: "Medium", time: "90 min", description: "Soft leavened flatbread baked in tandoor" },
    { name: "Aloo Gobi", emoji: "🥔", difficulty: "Easy", time: "30 min", description: "Potato and cauliflower dry curry with turmeric" },
    { name: "Vindaloo", emoji: "🌶️", difficulty: "Medium", time: "60 min", description: "Spicy and tangy Goan curry with vinegar" },
    { name: "Korma", emoji: "🥘", difficulty: "Medium", time: "45 min", description: "Mild creamy curry with nuts and yogurt" },
    { name: "Pav Bhaji", emoji: "🍔", difficulty: "Easy", time: "40 min", description: "Spiced mixed vegetable mash with bread rolls" },
    { name: "Dosa", emoji: "🥞", difficulty: "Medium", time: "30 min", description: "Crispy fermented crepe with potato filling" },
    { name: "Idli", emoji: "🍘", difficulty: "Medium", time: "20 min", description: "Soft steamed rice cakes with sambar" },
    { name: "Malai Kofta", emoji: "🥘", difficulty: "Hard", time: "60 min", description: "Fried vegetable balls in creamy sauce" },
    { name: "Chole Bhature", emoji: "🫓", difficulty: "Medium", time: "60 min", description: "Spiced chickpeas with fried bread" },
    { name: "Raita", emoji: "🥛", difficulty: "Easy", time: "10 min", description: "Cool yogurt with cucumber and spices" },
    { name: "Gulab Jamun", emoji: "🍡", difficulty: "Hard", time: "60 min", description: "Sweet fried milk dumplings in syrup" }
  ],
  Thai: [
    { name: "Pad Thai", emoji: "🍝", difficulty: "Medium", time: "30 min", description: "Stir-fried rice noodles with shrimp and peanuts" },
    { name: "Green Curry", emoji: "🍛", difficulty: "Medium", time: "40 min", description: "Spicy coconut curry with green chilies" },
    { name: "Tom Yum Soup", emoji: "🍲", difficulty: "Easy", time: "25 min", description: "Hot and sour soup with lemongrass and shrimp" },
    { name: "Massaman Curry", emoji: "🥘", difficulty: "Medium", time: "60 min", description: "Rich curry with peanuts and potatoes" },
    { name: "Som Tam", emoji: "🥗", difficulty: "Easy", time: "15 min", description: "Spicy green papaya salad with peanuts" },
    { name: "Pad Krapow", emoji: "🍖", difficulty: "Easy", time: "20 min", description: "Spicy basil chicken with fried egg" },
    { name: "Red Curry", emoji: "🍛", difficulty: "Medium", time: "35 min", description: "Rich red curry with coconut milk" },
    { name: "Khao Soi", emoji: "🍜", difficulty: "Medium", time: "45 min", description: "Northern Thai curry noodle soup" },
    { name: "Larb", emoji: "🥗", difficulty: "Easy", time: "20 min", description: "Spicy minced meat salad with herbs" },
    { name: "Satay", emoji: "🍢", difficulty: "Easy", time: "30 min", description: "Grilled skewers with peanut sauce" },
    { name: "Panang Curry", emoji: "🍛", difficulty: "Medium", time: "35 min", description: "Thick red curry with peanuts" },
    { name: "Tom Kha Gai", emoji: "🍲", difficulty: "Easy", time: "30 min", description: "Coconut chicken soup with galangal" },
    { name: "Pad See Ew", emoji: "🍝", difficulty: "Easy", time: "20 min", description: "Stir-fried wide noodles with soy sauce" },
    { name: "Mango Sticky Rice", emoji: "🥭", difficulty: "Easy", time: "30 min", description: "Sweet coconut sticky rice with mango" },
    { name: "Spring Rolls", emoji: "🥟", difficulty: "Medium", time: "40 min", description: "Fresh rice paper rolls with vegetables" },
    { name: "Crying Tiger", emoji: "🥩", difficulty: "Medium", time: "30 min", description: "Grilled marinated beef with spicy sauce" },
    { name: "Kai Jeow", emoji: "🍳", difficulty: "Easy", time: "10 min", description: "Thai-style fluffy omelet" },
    { name: "Gaeng Keow Wan", emoji: "🥘", difficulty: "Medium", time: "40 min", description: "Sweet green curry with vegetables" },
    { name: "Yum Woon Sen", emoji: "🥗", difficulty: "Easy", time: "20 min", description: "Spicy glass noodle salad" },
    { name: "Khao Pad", emoji: "🍚", difficulty: "Easy", time: "15 min", description: "Thai fried rice with egg and vegetables" }
  ],
  Mexican: [
    { name: "Tacos al Pastor", emoji: "🌮", difficulty: "Medium", time: "45 min", description: "Marinated pork tacos with pineapple" },
    { name: "Enchiladas", emoji: "🌯", difficulty: "Medium", time: "40 min", description: "Rolled tortillas with sauce and cheese" },
    { name: "Guacamole", emoji: "🥑", difficulty: "Easy", time: "10 min", description: "Fresh avocado dip with lime and cilantro" },
    { name: "Chiles Rellenos", emoji: "🌶️", difficulty: "Hard", time: "60 min", description: "Stuffed poblano peppers with cheese" },
    { name: "Mole Poblano", emoji: "🍗", difficulty: "Hard", time: "120 min", description: "Complex chocolate-chile sauce with chicken" },
    { name: "Carnitas", emoji: "🍖", difficulty: "Medium", time: "180 min", description: "Slow-cooked crispy pork" },
    { name: "Pozole", emoji: "🍲", difficulty: "Medium", time: "120 min", description: "Traditional hominy and pork soup" },
    { name: "Quesadillas", emoji: "🧀", difficulty: "Easy", time: "15 min", description: "Grilled tortillas with melted cheese" },
    { name: "Chilaquiles", emoji: "🍳", difficulty: "Easy", time: "20 min", description: "Fried tortilla chips in salsa with eggs" },
    { name: "Tamales", emoji: "🫔", difficulty: "Hard", time: "120 min", description: "Steamed masa dough with filling" },
    { name: "Fajitas", emoji: "🌮", difficulty: "Easy", time: "25 min", description: "Sizzling grilled meat with peppers" },
    { name: "Ceviche", emoji: "🐟", difficulty: "Easy", time: "120 min", description: "Lime-marinated fresh fish" },
    { name: "Elote", emoji: "🌽", difficulty: "Easy", time: "15 min", description: "Mexican street corn with mayo and cheese" },
    { name: "Birria", emoji: "🥘", difficulty: "Hard", time: "180 min", description: "Spicy slow-cooked goat or beef stew" },
    { name: "Tortas", emoji: "🥖", difficulty: "Easy", time: "20 min", description: "Mexican sandwich with various fillings" },
    { name: "Sopes", emoji: "🫓", difficulty: "Medium", time: "30 min", description: "Thick corn cakes with toppings" },
    { name: "Cochinita Pibil", emoji: "🍖", difficulty: "Hard", time: "240 min", description: "Yucatan-style slow-roasted pork" },
    { name: "Tostadas", emoji: "🌮", difficulty: "Easy", time: "15 min", description: "Crispy tortillas with toppings" },
    { name: "Salsa Verde", emoji: "🥗", difficulty: "Easy", time: "15 min", description: "Tangy tomatillo and green chile salsa" },
    { name: "Churros", emoji: "🍩", difficulty: "Medium", time: "30 min", description: "Fried dough with cinnamon sugar" }
  ],
  French: [
    { name: "Coq au Vin", emoji: "🍗", difficulty: "Medium", time: "90 min", description: "Chicken braised in red wine with mushrooms" },
    { name: "Beef Bourguignon", emoji: "🥩", difficulty: "Hard", time: "180 min", description: "Beef stew in Burgundy wine" },
    { name: "Ratatouille", emoji: "🍆", difficulty: "Medium", time: "60 min", description: "Provençal vegetable stew" },
    { name: "Quiche Lorraine", emoji: "🥧", difficulty: "Medium", time: "60 min", description: "Savory tart with bacon and cheese" },
    { name: "Bouillabaisse", emoji: "🍲", difficulty: "Hard", time: "90 min", description: "Traditional Provençal fish stew" },
    { name: "Croque Monsieur", emoji: "🥪", difficulty: "Easy", time: "20 min", description: "Grilled ham and cheese sandwich" },
    { name: "Cassoulet", emoji: "🍲", difficulty: "Hard", time: "240 min", description: "White bean stew with duck and sausage" },
    { name: "Sole Meunière", emoji: "🐟", difficulty: "Medium", time: "25 min", description: "Pan-fried sole in brown butter" },
    { name: "Confit de Canard", emoji: "🦆", difficulty: "Hard", time: "180 min", description: "Duck leg preserved in its own fat" },
    { name: "Niçoise Salad", emoji: "🥗", difficulty: "Easy", time: "20 min", description: "Tuna salad with eggs and olives" },
    { name: "French Onion Soup", emoji: "🧅", difficulty: "Medium", time: "75 min", description: "Caramelized onion soup with cheese" },
    { name: "Escargots", emoji: "🐌", difficulty: "Medium", time: "30 min", description: "Snails in garlic herb butter" },
    { name: "Steak Frites", emoji: "🥩", difficulty: "Easy", time: "25 min", description: "Grilled steak with French fries" },
    { name: "Duck à l'Orange", emoji: "🦆", difficulty: "Hard", time: "120 min", description: "Roasted duck with orange sauce" },
    { name: "Tarte Tatin", emoji: "🍎", difficulty: "Medium", time: "60 min", description: "Upside-down caramelized apple tart" },
    { name: "Croissant", emoji: "🥐", difficulty: "Hard", time: "240 min", description: "Flaky buttery pastry" },
    { name: "Baguette", emoji: "🥖", difficulty: "Medium", time: "180 min", description: "Traditional French bread" },
    { name: "Crème Brûlée", emoji: "🍮", difficulty: "Medium", time: "60 min", description: "Vanilla custard with caramelized sugar" },
    { name: "Moules Marinières", emoji: "🦪", difficulty: "Easy", time: "20 min", description: "Mussels in white wine sauce" },
    { name: "Pot-au-Feu", emoji: "🍲", difficulty: "Medium", time: "180 min", description: "Traditional French beef and vegetable stew" }
  ]
};

console.log('📝 Generating Indian recipes...');
console.log(`   Total: ${recipeDatabase.Indian.length} recipes`);
console.log('');

// This is a preview - full generation will be done in batches
recipeDatabase.Indian.slice(0, 3).forEach((recipe, idx) => {
  console.log(`   ${idx + 1}. ${recipe.emoji} ${recipe.name}`);
  console.log(`      ${recipe.description}`);
  console.log(`      ${recipe.difficulty} | ${recipe.time}`);
  console.log('');
});

console.log('✅ Recipe database ready for generation');
console.log(`📊 Total cuisines ready: ${Object.keys(recipeDatabase).length}`);
console.log(`📊 Total recipes to generate: ${Object.values(recipeDatabase).flat().length}`);

