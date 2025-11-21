#!/usr/bin/env node

/**
 * Test Instruction Translation Script
 * 
 * This script tests the translation of ingredients in recipe instructions
 */

import { getBestInstructions, fixInstructionText } from '../src/utils/dishNameTranslator.js';

// Test cases
const testCases = [
  // Case 1: Chinese instructions with English ingredients
  {
    name: "Chinese instructions with English ingredients",
    recipe: {
      steps: {
        zh: [
          "准备食材: 300 g beef, 1 pc onion, 2 cloves garlic, 30 ml olive oil.",
          "如需，可将主要食材腌制或调味15–30分钟。",
          "如适用，将锅或烤箱预热至200°C。",
          "烹饪 Ajiaco using the suitable method (grill, sauté, simmer or bake) until properly done.",
          "尝味并调整调味，必要时静置片刻，趁热上桌。"
        ],
        en: [
          "Prepare ingredients: 300 g beef, 1 pc onion, 2 cloves garlic, 30 ml olive oil.",
          "If required, marinate or season the main ingredients for 15–30 minutes.",
          "Preheat pan or oven to 200°C when appropriate.",
          "Cook Ajiaco using the suitable method (grill, sauté, simmer or bake) until properly done.",
          "Taste and adjust seasoning, rest if needed, then serve warm."
        ]
      }
    },
    language: "zh",
    expected: [
      "准备食材: 300 克 牛肉, 1 个 洋葱, 2 瓣 大蒜, 30 毫升 橄榄油.",
      "如需，可将主要食材腌制或调味15–30分钟。",
      "如适用，将锅或烤箱预热至200°C。",
      "烹饪 Ajiaco using the suitable method (grill, sauté, simmer or bake) until properly done.",
      "尝味并调整调味，必要时静置片刻，趁热上桌。"
    ]
  },
  
  // Case 2: English instructions (should remain unchanged)
  {
    name: "English instructions",
    recipe: {
      steps: {
        en: [
          "Prepare ingredients: 300 g beef, 1 pc onion, 2 cloves garlic, 30 ml olive oil.",
          "If required, marinate or season the main ingredients for 15–30 minutes."
        ]
      }
    },
    language: "en",
    expected: [
      "Prepare ingredients: 300 g beef, 1 pc onion, 2 cloves garlic, 30 ml olive oil.",
      "If required, marinate or season the main ingredients for 15–30 minutes."
    ]
  },
  
  // Case 3: Recipe with no steps
  {
    name: "Recipe with no steps",
    recipe: {
      name: "Some Recipe"
    },
    language: "zh",
    expected: []
  }
];

console.log('🧪 Testing Instruction Translation');
console.log('==================================\n');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  
  try {
    const result = getBestInstructions(testCase.recipe, testCase.language);
    const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
    
    console.log(`  Language: ${testCase.language}`);
    console.log(`  Expected: ${JSON.stringify(testCase.expected)}`);
    console.log(`  Got: ${JSON.stringify(result)}`);
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
  console.log('🎉 All tests passed! The instruction translation is working correctly.');
} else {
  console.log('⚠️  Some tests failed. Check the implementation.');
}

// Test the utility function directly
console.log('\n🔧 Testing fixInstructionText Function');
console.log('=====================================');

const directTests = [
  {
    input: "准备食材: 300 g beef, 1 pc onion, 2 cloves garlic, 30 ml olive oil.",
    expected: "准备食材: 300 克 牛肉, 1 个 洋葱, 2 瓣 大蒜, 30 毫升 橄榄油."
  },
  {
    input: "Add 2 tbsp olive oil and 1 tsp salt.",
    expected: "Add 2 汤匙 橄榄油 and 1 茶匙 盐."
  },
  {
    input: "Mix chicken with garlic and onion.",
    expected: "Mix 鸡肉 with 大蒜 and 洋葱."
  }
];

directTests.forEach((test, index) => {
  const result = fixInstructionText(test.input, 'zh');
  const passed = result === test.expected;
  console.log(`Direct Test ${index + 1}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Input: "${test.input}"`);
  console.log(`  Expected: "${test.expected}"`);
  console.log(`  Got: "${result}"`);
  console.log('');
});
