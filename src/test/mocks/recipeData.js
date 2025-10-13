/**
 * Mock recipe data for all supported languages
 * Each recipe has the same ID across all languages but different translated content
 */

export const mockRecipeDataAllLanguages = {
  en: {
    cultural: {
      Chinese: [
        {
          id: 1,
          name: 'Sweet and Sour Pork',
          description: 'A delicious Chinese dish with tender pork and tangy sauce',
          cuisine: 'Chinese',
          ingredients: ['ingredient-pork-chops', 'ingredient-bell-pepper', 'ingredient-garlic', 'ingredient-soy-sauce'],
          ingredientsWithAmounts: [
            '1 lb pork chops, cubed',
            '2 bell peppers, chopped',
            '3 cloves garlic, minced',
            '2 tbsp soy sauce'
          ],
          instructions: [
            'Cut pork into bite-sized pieces',
            'Heat oil in a wok over high heat',
            'Add pork and stir-fry until golden brown',
            'Add garlic and vegetables',
            'Add sauce and simmer for 5 minutes',
            'Serve immediately over rice'
          ],
          difficulty: 'Medium',
          cookTime: '30 minutes',
          emoji: '🥩'
        },
        {
          id: 2,
          name: 'Kung Pao Chicken',
          description: 'Spicy Sichuan dish with chicken and peanuts',
          cuisine: 'Chinese',
          ingredients: ['ingredient-chicken-breast', 'ingredient-peanuts', 'ingredient-chili', 'ingredient-soy-sauce'],
          ingredientsWithAmounts: [
            '1 lb chicken breast, diced',
            '1/2 cup roasted peanuts',
            '3-4 dried chilies',
            '2 tbsp soy sauce'
          ],
          instructions: [
            'Dice chicken into small cubes',
            'Heat wok and add oil',
            'Stir-fry chicken until cooked',
            'Add chilies and peanuts',
            'Add sauce and toss',
            'Serve hot'
          ],
          difficulty: 'Medium',
          cookTime: '25 minutes',
          emoji: '🐔'
        }
      ]
    },
    basic: {
      'Grilled': {
        'Grilled Pork': {
          id: 10,
          name: 'Grilled Pork',
          description: 'Simple grilled pork chops',
          ingredients: ['ingredient-pork-chops', 'ingredient-garlic'],
          ingredientsWithAmounts: ['1 lb pork chops', '2 cloves garlic'],
          instructions: ['Season pork', 'Grill for 15 minutes', 'Rest and serve'],
          difficulty: 'Easy',
          cookTime: '20 minutes',
          emoji: '🥩'
        }
      }
    }
  },
  
  zh: {
    cultural: {
      Chinese: [
        {
          id: 1,
          name: '糖醋排骨',
          description: '一道美味的中国菜，猪肉嫩滑，酱汁酸甜可口',
          cuisine: 'Chinese',
          ingredients: ['ingredient-pork-chops', 'ingredient-bell-pepper', 'ingredient-garlic', 'ingredient-soy-sauce'],
          ingredientsWithAmounts: [
            '猪排450克，切块',
            '甜椒2个，切块',
            '大蒜3瓣，切碎',
            '酱油2汤匙'
          ],
          instructions: [
            '将猪肉切成一口大小的块',
            '在炒锅中加热油至高温',
            '加入猪肉翻炒至金黄色',
            '加入大蒜和蔬菜',
            '加入酱汁炖煮5分钟',
            '立即配米饭食用'
          ],
          difficulty: '中等',
          cookTime: '30分钟',
          emoji: '🥩'
        },
        {
          id: 2,
          name: '宫保鸡丁',
          description: '四川辣味菜肴，配鸡肉和花生',
          cuisine: 'Chinese',
          ingredients: ['ingredient-chicken-breast', 'ingredient-peanuts', 'ingredient-chili', 'ingredient-soy-sauce'],
          ingredientsWithAmounts: [
            '鸡胸肉450克，切丁',
            '烤花生半杯',
            '干辣椒3-4个',
            '酱油2汤匙'
          ],
          instructions: [
            '将鸡肉切成小块',
            '加热炒锅并加油',
            '翻炒鸡肉至熟',
            '加入辣椒和花生',
            '加入酱汁翻炒',
            '趁热上桌'
          ],
          difficulty: '中等',
          cookTime: '25分钟',
          emoji: '🐔'
        }
      ]
    },
    basic: {
      'Grilled': {
        'Grilled Pork': {
          id: 10,
          name: '烤猪排',
          description: '简单的烤猪排',
          ingredients: ['ingredient-pork-chops', 'ingredient-garlic'],
          ingredientsWithAmounts: ['猪排450克', '大蒜2瓣'],
          instructions: ['给猪肉调味', '烤15分钟', '静置后上桌'],
          difficulty: '简单',
          cookTime: '20分钟',
          emoji: '🥩'
        }
      }
    }
  },
  
  sv: {
    cultural: {
      Chinese: [
        {
          id: 1,
          name: 'Sötsur Fläsk',
          description: 'En läcker kinesisk rätt med mört fläsk och syrlighet',
          cuisine: 'Chinese',
          ingredients: ['ingredient-pork-chops', 'ingredient-bell-pepper', 'ingredient-garlic', 'ingredient-soy-sauce'],
          ingredientsWithAmounts: [
            '450g fläskkotletter, tärnade',
            '2 paprikor, hackade',
            '3 vitlöksklyftor, hackade',
            '2 msk sojasås'
          ],
          instructions: [
            'Skär fläsket i lagom stora bitar',
            'Hetta upp olja i en wok på hög värme',
            'Lägg i fläsket och stek tills det är gyllene',
            'Tillsätt vitlök och grönsaker',
            'Tillsätt såsen och låt sjuda i 5 minuter',
            'Servera direkt med ris'
          ],
          difficulty: 'Medel',
          cookTime: '30 minuter',
          emoji: '🥩'
        },
        {
          id: 2,
          name: 'Kung Pao Kyckling',
          description: 'Kryddig Sichuan-rätt med kyckling och jordnötter',
          cuisine: 'Chinese',
          ingredients: ['ingredient-chicken-breast', 'ingredient-peanuts', 'ingredient-chili', 'ingredient-soy-sauce'],
          ingredientsWithAmounts: [
            '450g kycklingbröst, tärnat',
            '½ kopp rostade jordnötter',
            '3-4 torkade chilifrukter',
            '2 msk sojasås'
          ],
          instructions: [
            'Tärna kycklingen i små kuber',
            'Hetta upp wok och tillsätt olja',
            'Wooka kycklingen tills den är genomstekt',
            'Tillsätt chili och jordnötter',
            'Tillsätt sås och blanda',
            'Servera varmt'
          ],
          difficulty: 'Medel',
          cookTime: '25 minuter',
          emoji: '🐔'
        }
      ]
    },
    basic: {
      'Grilled': {
        'Grilled Pork': {
          id: 10,
          name: 'Grillat Fläsk',
          description: 'Enkla grillade fläskkotletter',
          ingredients: ['ingredient-pork-chops', 'ingredient-garlic'],
          ingredientsWithAmounts: ['450g fläskkotletter', '2 vitlöksklyftor'],
          instructions: ['Krydda fläsket', 'Grilla i 15 minuter', 'Vila och servera'],
          difficulty: 'Lätt',
          cookTime: '20 minuter',
          emoji: '🥩'
        }
      }
    }
  }
}

// Helper function to get recipe data for a specific language
export const getRecipeDataForLanguage = (language) => {
  return mockRecipeDataAllLanguages[language] || mockRecipeDataAllLanguages.en
}

// Helper function to get a recipe by ID in a specific language
export const getRecipeById = (id, language) => {
  const data = getRecipeDataForLanguage(language)
  
  // Search in cultural recipes
  for (const cuisine in data.cultural) {
    const recipe = data.cultural[cuisine].find(r => r.id === id)
    if (recipe) return recipe
  }
  
  // Search in basic recipes
  for (const cookingMethod in data.basic) {
    for (const dishName in data.basic[cookingMethod]) {
      const recipe = data.basic[cookingMethod][dishName]
      if (recipe.id === id) return recipe
    }
  }
  
  return null
}




