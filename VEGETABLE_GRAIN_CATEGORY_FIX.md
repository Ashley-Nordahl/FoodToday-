# Vegetable & Grain Category Naming Fix

## Summary
Updated all references from "Vegetables" to "Vegetable" and "Grains" to "Grain" throughout the application to match the singular naming convention used in recipe JSON files.

## Changes Made

### 1. Core Data Files
- **src/data/ingredientRegistry.js**
  - Updated `INGREDIENT_CATEGORIES` object: `'Vegetables'` → `'Vegetable'`, `'Grains'` → `'Grain'`
  - Updated all ingredient category assignments to use singular forms

### 2. Component Files
- **src/components/RecipeChoiceCards.jsx**
  - Added support for both plural and singular forms in emoji mapping
  - Added `'Vegetable': '🥬'` and `'Grain': '🍚'` to emoji map
  
- **src/components/BottomNavigation.jsx**
  - Added support for both plural and singular forms in emoji mapping
  - Added `'Vegetable': '🥬'` and `'Grain': '🍚'` to emoji map

### 3. Page Files
- **src/pages/Parties.jsx**
  - Updated category mapping: `'vegetables'` → `'Vegetable'`, `'grains'` → `'Grain'`
  - Updated ingredient category checks to use singular forms
  
- **src/pages/DishToday.jsx**
  - Added support for both plural and singular forms in emoji mapping
  - Added `'Vegetable': '🥬'` and `'Grain': '🍚'` to emoji map

### 4. Test Files
- **src/data/__tests__/ingredientRegistry.test.js**
  - Updated all assertions to use singular forms: `'Vegetable'` and `'Grain'`
  - Updated test data to use singular forms

## Why This Change?

The recipe JSON files use singular forms (`"Vegetable"`, `"Grain"`) in the `main_type` field, but some parts of the application were using plural forms (`"Vegetables"`, `"Grains"`). This mismatch caused issues with:

1. Category-based filtering in the Parties page
2. Category-based recipe retrieval
3. Consistent emoji display across components

## Files That Support Both Forms

For backward compatibility, the following files now support both plural and singular forms:
- `RecipeChoiceCards.jsx`
- `BottomNavigation.jsx`
- `DishToday.jsx`

This ensures that recipes with either naming convention will display correctly.

## Testing Recommendations

1. Test ingredient category selection in Parties page
2. Verify that recipes with "Vegetable" and "Grain" main_type display correct emojis
3. Check that the ingredient registry filters work correctly
4. Verify that recipe category filtering works in all components
