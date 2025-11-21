#!/usr/bin/env node

/**
 * Test Chinese Translation Fallback Strategy
 * 
 * This script tests the fallback strategy for Chinese dish names
 */

import { getBestDishName, isEnglishName, getChineseTranslation } from '../src/utils/dishNameTranslator.js';

// Test cases
const testCases = [
  // Case 1: Recipe with proper Chinese translation
  {
    name: "Recipe with proper Chinese translation",
    recipe: {
      dish_name: {
        en: "Kung Pao Chicken",
        zh: "宫保鸡丁",
        sv: "Kung Pao Kyckling"
      }
    },
    language: "zh",
    expected: "宫保鸡丁"
  },
  
  // Case 2: Recipe with English name in Chinese field (Ajiaco case)
  {
    name: "Recipe with English name in Chinese field",
    recipe: {
      dish_name: {
        en: "Ajiaco",
        zh: "Ajiaco", // This is the problem - English name in Chinese field
        sv: "Ajiaco"
      }
    },
    language: "zh",
    expected: "阿希亚科汤" // Should use our translation
  },
  
  // Case 3: Recipe with missing Chinese translation
  {
    name: "Recipe with missing Chinese translation",
    recipe: {
      dish_name: {
        en: "Mapo Tofu",
        sv: "Mapo Tofu"
        // zh field missing
      }
    },
    language: "zh",
    expected: "麻婆豆腐" // Should use our translation
  },
  
  // Case 4: Recipe with no dish_name
  {
    name: "Recipe with no dish_name",
    recipe: {
      name: "Some Recipe"
    },
    language: "zh",
    expected: "Some Recipe" // Should fallback to name field
  },
  
  // Case 5: English language (should work normally)
  {
    name: "English language request",
    recipe: {
      dish_name: {
        en: "Ajiaco",
        zh: "Ajiaco",
        sv: "Ajiaco"
      }
    },
    language: "en",
    expected: "Ajiaco"
  }
];

console.log('🧪 Testing Chinese Translation Fallback Strategy');
console.log('================================================\n');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  
  try {
    const result = getBestDishName(testCase.recipe, testCase.language);
    const passed = result === testCase.expected;
    
    console.log(`  Input: ${JSON.stringify(testCase.recipe.dish_name || testCase.recipe.name)}`);
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
  console.log('🎉 All tests passed! The fallback strategy is working correctly.');
} else {
  console.log('⚠️  Some tests failed. Check the implementation.');
}

// Test the utility functions
console.log('\n🔧 Testing Utility Functions');
console.log('============================');

console.log('isEnglishName("Ajiaco"):', isEnglishName("Ajiaco"));
console.log('isEnglishName("宫保鸡丁"):', isEnglishName("宫保鸡丁"));
console.log('isEnglishName("Mapo Tofu"):', isEnglishName("Mapo Tofu"));

console.log('\ngetChineseTranslation("Ajiaco"):', getChineseTranslation("Ajiaco"));
console.log('getChineseTranslation("Mapo Tofu"):', getChineseTranslation("Mapo Tofu"));
console.log('getChineseTranslation("Unknown Dish"):', getChineseTranslation("Unknown Dish"));
