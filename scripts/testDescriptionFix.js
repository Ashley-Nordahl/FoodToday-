#!/usr/bin/env node

/**
 * Test Description Fix Script
 * 
 * This script tests the removal of dish names from descriptions
 */

import { getBestDescription, removeDishNameFromDescription } from '../src/utils/dishNameTranslator.js';

// Test cases
const testCases = [
  // Case 1: Chinese description with English dish name
  {
    name: "Chinese description with English dish name",
    recipe: {
      description: {
        zh: "Ajiaco - 经典的哥伦比亚菜，适合家庭烹饪。",
        en: "Ajiaco - a classic Colombia dish prepared for home cooks."
      }
    },
    language: "zh",
    expected: "经典的哥伦比亚菜，适合家庭烹饪。"
  },
  
  // Case 2: English description
  {
    name: "English description",
    recipe: {
      description: {
        en: "Ajiaco - a classic Colombia dish prepared for home cooks.",
        zh: "Ajiaco - 经典的哥伦比亚菜，适合家庭烹饪。"
      }
    },
    language: "en",
    expected: "a classic Colombia dish prepared for home cooks."
  },
  
  // Case 3: Swedish description
  {
    name: "Swedish description",
    recipe: {
      description: {
        sv: "Ajiaco - en klassisk Colombiarätt anpassad för hemanvändning.",
        en: "Ajiaco - a classic Colombia dish prepared for home cooks."
      }
    },
    language: "sv",
    expected: "en klassisk Colombiarätt anpassad för hemanvändning."
  },
  
  // Case 4: Description without dish name (should remain unchanged)
  {
    name: "Description without dish name",
    recipe: {
      description: {
        en: "A classic Colombian soup dish.",
        zh: "经典的哥伦比亚汤菜。"
      }
    },
    language: "en",
    expected: "A classic Colombian soup dish."
  },
  
  // Case 5: Empty description
  {
    name: "Empty description",
    recipe: {
      description: {
        en: "",
        zh: ""
      }
    },
    language: "en",
    expected: ""
  }
];

console.log('🧪 Testing Description Fix (Remove Dish Name Duplication)');
console.log('========================================================\n');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  
  try {
    const result = getBestDescription(testCase.recipe, testCase.language);
    const passed = result === testCase.expected;
    
    console.log(`  Input: "${testCase.recipe.description[testCase.language] || testCase.recipe.description.en}"`);
    console.log(`  Language: ${testCase.language}`);
    console.log(`  Expected: "${testCase.expected}"`);
    console.log(`  Got: "${result}"`);
    console.log(`  Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    
    if (passed) {
      passedTests++;
    }
    
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    console.log(`  Result: ❌ FAIL`);
  }
  
  console.log('');
});

console.log('📊 SUMMARY');
console.log('==========');
console.log(`Passed: ${passedTests}/${totalTests} tests`);

if (passedTests === totalTests) {
  console.log('🎉 All tests passed! The description fix is working correctly.');
} else {
  console.log('⚠️  Some tests failed. Check the implementation.');
}

// Test the utility function directly
console.log('\n🔧 Testing removeDishNameFromDescription Function');
console.log('================================================');

const directTests = [
  {
    input: "Ajiaco - 经典的哥伦比亚菜，适合家庭烹饪。",
    expected: "经典的哥伦比亚菜，适合家庭烹饪。"
  },
  {
    input: "Kung Pao Chicken - a spicy Chinese dish",
    expected: "a spicy Chinese dish"
  },
  {
    input: "No dash in this description",
    expected: "No dash in this description"
  }
];

directTests.forEach((test, index) => {
  const result = removeDishNameFromDescription(test.input);
  const passed = result === test.expected;
  console.log(`Direct Test ${index + 1}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Input: "${test.input}"`);
  console.log(`  Expected: "${test.expected}"`);
  console.log(`  Got: "${result}"`);
  console.log('');
});
