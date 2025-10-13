# DishToday Page Comprehensive Test Plan

**Test Date:** $(date)  
**Tester:** Manual Testing Required  
**Test Environment:** http://localhost:5174/  
**Languages Tested:** English (en), Chinese (zh), Swedish (sv)

---

## Overview

DishToday page features:
- Food wheel for cuisine selection
- Three tabs: Random recipe, Search recipe, What I have (ingredients)
- Recipe display with shopping list integration
- Language switching support
- Reactive recipe translation

---

## Test Execution Summary

### Phase 1: Initial Page Load & UI Elements

#### English (en)
- [ ] Page loads without errors
- [ ] Page title "🍽️ Dish Today" displays
- [ ] Subtitle displays in English
- [ ] "Spin the Wheel" section title displays
- [ ] Food wheel displays with all cuisine options
- [ ] Tab buttons visible: "Random Recipe", "Search Recipe", "What I Have"
- [ ] Default tab is "Random Recipe"
- [ ] All UI text in English (no mixed languages)

#### Chinese (zh)
- [ ] Page loads without errors
- [ ] Page title in Chinese
- [ ] Subtitle in Chinese
- [ ] "Spin the Wheel" title in Chinese
- [ ] Food wheel cuisine names in Chinese
- [ ] Tab buttons in Chinese: "随机菜谱", "搜索菜谱", "我有什么"
- [ ] All UI text in Chinese (no mixed languages)

#### Swedish (sv)
- [ ] Page loads without errors
- [ ] All text elements in Swedish
- [ ] Food wheel cuisine names in Swedish
- [ ] Tab buttons in Swedish
- [ ] No mixed languages

**Files to verify:**
- `src/pages/DishToday.jsx` (lines 1-100)
- `src/components/InlineFoodWheel.jsx`
- `src/locales/{en,zh,sv}/translation.json`

---

### Phase 2: Food Wheel Functionality

#### Wheel Interaction
- [ ] Wheel spins when clicked
- [ ] Wheel stops on a random cuisine
- [ ] Selected cuisine highlights visually
- [ ] Cuisine name displays correctly in all languages
- [ ] Can spin multiple times
- [ ] Each spin may land on different cuisine

#### Cuisine Selection Impact
- [ ] Selecting Chinese cuisine → Chinese recipes available
- [ ] Selecting Italian cuisine → Italian recipes available
- [ ] Selecting Thai cuisine → Thai recipes available
- [ ] Selecting Mexican cuisine → Mexican recipes available
- [ ] Works consistently across all languages

**Files to verify:**
- `src/components/InlineFoodWheel.jsx`
- `src/pages/DishToday.jsx` (handleCuisineSelect function)

---

### Phase 3: Tab System - Random Recipe

#### Without Cuisine Selection
- [ ] Click "Random Recipe" without spinning wheel → generates recipe from all cuisines
- [ ] Recipe displays with name, description, ingredients, instructions
- [ ] Recipe is in correct language (English)
- [ ] Recipe metadata (prep time, cook time, servings, difficulty) translated
- [ ] Multiple clicks generate different recipes
- [ ] Auto-scrolls to recipe display

#### With Cuisine Selection
- [ ] Spin wheel to select cuisine
- [ ] Click "Random Recipe" → generates recipe from selected cuisine
- [ ] Recipe matches selected cuisine
- [ ] Recipe is complete (has ingredients and instructions)
- [ ] Multiple clicks generate different recipes from same cuisine

#### Language Consistency
- [ ] Random recipe in English → all text in English
- [ ] Random recipe in Chinese → all text in Chinese
- [ ] Random recipe in Swedish → all text in Swedish
- [ ] Ingredient names properly translated
- [ ] Instructions in correct language

**Files to verify:**
- `src/pages/DishToday.jsx` (handleRecipeChoice function, lines 138-218)
- `src/components/RecipeChoiceCards.jsx` (handleRandomRecipe function)

---

### Phase 4: Tab System - Search Recipe

#### Search Functionality
- [ ] Click "Search Recipe" tab → search input appears
- [ ] Type in search box → search results appear
- [ ] Search results match query (case insensitive)
- [ ] Search without cuisine → searches all cuisines
- [ ] Search with cuisine → searches within that cuisine only
- [ ] Click search result → displays recipe
- [ ] Search works in English
- [ ] Search works in Chinese
- [ ] Search works in Swedish

#### Search Results Display
- [ ] Search results show recipe names
- [ ] Results display in correct language
- [ ] Empty search → no results shown
- [ ] No matches → no results shown
- [ ] Clear search → results disappear

#### Recipe Display from Search
- [ ] Click search result → recipe displays
- [ ] Recipe details complete and correct
- [ ] Auto-scrolls to tabs (not recipe)
- [ ] Recipe in correct language
- [ ] No mixed languages

**Files to verify:**
- `src/components/RecipeChoiceCards.jsx` (handleSearch, handleSelectSearchResult)
- `src/data/recipes.js` (searchRecipesFromAll function)

---

### Phase 5: Tab System - What I Have (Ingredients)

#### Ingredient Selector Display
- [ ] Click "What I Have" tab → ingredient selector appears
- [ ] Ingredient categories displayed (Proteins, Vegetables, Staples)
- [ ] Ingredients properly translated in all languages
- [ ] Can select multiple ingredients
- [ ] Selected ingredients highlighted visually
- [ ] Back button available

#### Ingredient Selection & Generation
- [ ] Select 1 ingredient → click generate → recipe includes that ingredient
- [ ] Select 2 ingredients → recipe includes selected ingredients
- [ ] Select 3+ ingredients → recipe uses selected ingredients
- [ ] No matching recipe → fallback to random recipe
- [ ] Generated recipe displays correctly
- [ ] Auto-scrolls to recipe display

#### Language Consistency
- [ ] Ingredient names in English
- [ ] Ingredient names in Chinese
- [ ] Ingredient names in Swedish
- [ ] Generated recipe uses selected ingredients correctly
- [ ] No mixed languages

**Critical:** Verify ingredient matching logic from previous bug fix

**Files to verify:**
- `src/components/IngredientSelector.jsx`
- `src/pages/DishToday.jsx` (handleIngredientGenerate function)
- `src/data/recipes.js` (getRecipesByIngredients, getRecipesByIngredientsFromAll)

---

### Phase 6: Recipe Display

#### Recipe Card Elements
- [ ] Recipe name displayed (correct language)
- [ ] Recipe description displayed
- [ ] Recipe emoji/icon displayed
- [ ] Shopping list button visible: "🛒 Create Shopping List"
- [ ] Recipe metadata row displays:
  - [ ] Prep time (if available)
  - [ ] Cook time/Total time
  - [ ] Servings (translated)
  - [ ] Difficulty (translated)

#### Ingredients Section
- [ ] Ingredients heading "Ingredients" (translated)
- [ ] Ingredients list displays
- [ ] Ingredients with amounts show amounts
- [ ] Ingredients properly translated
- [ ] No mixed languages

#### Instructions Section
- [ ] Instructions heading "Instructions" (translated)
- [ ] Instructions list displays
- [ ] Steps numbered correctly
- [ ] Instructions in correct language
- [ ] Instructions complete and readable

**Files to verify:**
- `src/pages/DishToday.jsx` (recipe display section, lines 335-394)

---

### Phase 7: Shopping List Integration

#### Opening Shopping List
- [ ] Generate recipe → shopping list button appears
- [ ] Click shopping list button → modal opens
- [ ] Modal displays recipe name
- [ ] Ingredients preview section shows all ingredients
- [ ] Close button visible at top

#### Shopping List Features
- [ ] All ingredients listed
- [ ] Ingredients have checkboxes
- [ ] All checkboxes ticked by default
- [ ] Click checkbox → toggles checked/unchecked
- [ ] Unchecked items show visual feedback
- [ ] Sharing section visible: Copy, SMS, Email buttons

#### Sharing from Shopping List
- [ ] Click "Copy" → copies to clipboard, shows "Copied!" indication
- [ ] Click "SMS" → phone dropdown appears
- [ ] Enter phone number → send SMS → saves number
- [ ] Click "Email" → opens email client
- [ ] Share content only includes checked ingredients
- [ ] Share content in correct language

#### Language Consistency in Shopping List
- [ ] Shopping list in English
- [ ] Shopping list in Chinese
- [ ] Shopping list in Swedish
- [ ] All labels translated (ingredients, share buttons)
- [ ] No mixed languages

**Files to verify:**
- `src/components/ShoppingList.jsx`
- `src/pages/DishToday.jsx` (showShoppingList state)

---

### Phase 8: Language Switching & Consistency

#### English to Chinese
- [ ] Switch language to Chinese
- [ ] Page title updates to Chinese
- [ ] All UI elements update to Chinese
- [ ] Generated recipe clears (prevents mixing)
- [ ] Cuisine selection clears
- [ ] Tabs reset to default
- [ ] Generate new recipe in Chinese
- [ ] All recipe content in Chinese
- [ ] No English remnants

#### Chinese to Swedish
- [ ] Switch language to Swedish
- [ ] All UI elements update to Swedish
- [ ] Generated recipe clears
- [ ] Generate new recipe in Swedish
- [ ] No Chinese/English mixing

#### Cross-Language Recipe Generation
- [ ] Generate recipe in English
- [ ] Switch to Chinese
- [ ] Verify recipe cleared
- [ ] Generate new recipe
- [ ] New recipe entirely in Chinese

#### Comprehensive Language Check
- [ ] Page title and subtitle
- [ ] Wheel section title
- [ ] Tab labels (Random, Search, What I Have)
- [ ] Search placeholder text
- [ ] Ingredient category names
- [ ] Ingredient names
- [ ] Recipe names
- [ ] Recipe descriptions
- [ ] Recipe metadata (prep time, cook time, servings, difficulty)
- [ ] Ingredients heading
- [ ] Instructions heading
- [ ] Shopping list button
- [ ] Shopping list modal content
- [ ] Share button labels

**Files to verify:**
- `src/pages/DishToday.jsx` (useEffect for language change, lines 84-93)
- `src/components/RecipeChoiceCards.jsx` (language change effect)
- `src/locales/{en,zh,sv}/translation.json`

---

### Phase 9: Reactive Recipe Translation

#### Recipe Translation on Language Switch
- [ ] Generate recipe in English (note recipe ID)
- [ ] Switch to Chinese while recipe displayed
- [ ] Recipe updates to Chinese version (same ID)
- [ ] Switch to Swedish
- [ ] Recipe updates to Swedish version (same ID)
- [ ] Recipe content accurate in each language

**Note:** This tests the reactive translation feature that updates displayed recipes when language changes

**Files to verify:**
- `src/pages/DishToday.jsx` (useEffect for recipe translation, lines 95-129)

---

### Phase 10: Edge Cases & Error Handling

- [ ] Click tabs rapidly → no errors
- [ ] Search with special characters → handles gracefully
- [ ] Search with empty string → no results
- [ ] Select ingredients then switch language → state resets
- [ ] Generate recipe, switch tab, generate again → works correctly
- [ ] Spin wheel multiple times quickly → handles gracefully
- [ ] No recipes available for cuisine → fallback works
- [ ] No matching recipes for ingredients → fallback to random
- [ ] Very long recipe name → displays without breaking layout
- [ ] Very long ingredient list → scrolls properly
- [ ] Open shopping list with minimal recipe → works
- [ ] localStorage full → handles gracefully

---

### Phase 11: Auto-Scroll Behavior

- [ ] Generate random recipe → scrolls to recipe display
- [ ] Search and select recipe → scrolls to tabs
- [ ] Generate from ingredients → scrolls to recipe display
- [ ] Start typing in search → scrolls to tabs
- [ ] Scroll behavior smooth (not jarring)
- [ ] Scroll positions correct across all scenarios

**Files to verify:**
- `src/pages/DishToday.jsx` (scroll logic in handleRecipeChoice, lines 202-217)
- `src/components/RecipeChoiceCards.jsx` (scroll logic in search functions)

---

### Phase 12: User Tracking

- [ ] User logged in → recipe selections tracked
- [ ] Track random recipe selection
- [ ] Track search recipe selection
- [ ] Track ingredient-based recipe selection
- [ ] User not logged in → no tracking errors

**Files to verify:**
- `src/pages/DishToday.jsx` (trackSelection calls)
- `src/lib/supabase.js` (trackSelection function)

---

### Phase 13: Performance & Console

- [ ] Page loads quickly (< 2 seconds)
- [ ] Wheel spins smoothly
- [ ] Tab switching instant
- [ ] Recipe generation quick (< 1 second)
- [ ] Search results appear quickly
- [ ] No console errors during any operations
- [ ] No console warnings
- [ ] No memory leaks when switching languages multiple times

---

## Test Coverage Summary

| Category | Total Tests | Status |
|----------|-------------|--------|
| Initial Load (3 languages) | 24 | ⏳ Pending |
| Food Wheel | 11 | ⏳ Pending |
| Random Recipe Tab | 17 | ⏳ Pending |
| Search Recipe Tab | 15 | ⏳ Pending |
| What I Have Tab | 15 | ⏳ Pending |
| Recipe Display | 14 | ⏳ Pending |
| Shopping List | 16 | ⏳ Pending |
| Language Switching | 28 | ⏳ Pending |
| Reactive Translation | 6 | ⏳ Pending |
| Edge Cases | 12 | ⏳ Pending |
| Auto-Scroll | 6 | ⏳ Pending |
| User Tracking | 5 | ⏳ Pending |
| Performance | 8 | ⏳ Pending |
| **TOTAL** | **177** | **⏳ Pending** |

---

## Critical Items to Verify

### Language Consistency
- [ ] No mixed English/Chinese anywhere
- [ ] No mixed English/Swedish anywhere
- [ ] All recipe names translated
- [ ] All ingredient names translated
- [ ] All UI labels translated
- [ ] Metadata (difficulty, servings) translated

### Ingredient Matching (Previous Bug)
- [ ] Selected ingredients actually appear in generated recipe
- [ ] Ingredient IDs match between selector and recipes
- [ ] "What I Have" uses correct kebab-case ingredient IDs

### Shopping List (Consistent with Parties)
- [ ] Checkboxes all ticked by default
- [ ] Unchecked items excluded from share
- [ ] Phone number dropdown works
- [ ] SMS/Email sharing works
- [ ] Bullet points (not numbers) in shared content
- [ ] Total items count reflects checked items only

### State Management
- [ ] Language switch clears recipe
- [ ] Language switch resets tabs
- [ ] Tab switching clears previous state
- [ ] No state mixing between features

---

## Known Issues from Previous Fixes

1. **Ingredient Matching Issue (FIXED)**
   - Previous: Selected ingredients didn't appear in recipes
   - Fix: Updated `isProtein`, `isVegetable`, `isStaple` to use correct kebab-case IDs
   - Test: Verify ingredient matching works correctly

2. **Shopping List Consistency**
   - Verify shopping list implementation matches Parties page
   - Same checkbox behavior
   - Same sharing functionality
   - Same phone number dropdown

---

## Manual Testing Checklist

### Quick Test Flow (English)

1. **Initial Load**
   - [ ] Open http://localhost:5174/
   - [ ] Verify no console errors
   - [ ] Verify all text in English

2. **Random Recipe**
   - [ ] Click "Random Recipe" without cuisine
   - [ ] Verify recipe displays
   - [ ] Click again → different recipe
   - [ ] Verify auto-scroll

3. **With Cuisine**
   - [ ] Spin wheel → select cuisine
   - [ ] Click "Random Recipe"
   - [ ] Verify recipe from that cuisine

4. **Search**
   - [ ] Click "Search Recipe" tab
   - [ ] Type recipe name
   - [ ] Click result
   - [ ] Verify recipe displays

5. **Ingredients**
   - [ ] Click "What I Have" tab
   - [ ] Select 2-3 ingredients
   - [ ] Click generate
   - [ ] Verify recipe includes selected ingredients

6. **Shopping List**
   - [ ] Click "🛒 Create Shopping List"
   - [ ] Verify modal opens
   - [ ] Test checkboxes
   - [ ] Test sharing (Copy, SMS, Email)

### Quick Test Flow (Chinese)

1. **Language Switch**
   - [ ] Switch to Chinese
   - [ ] Verify all UI in Chinese
   - [ ] Verify previous recipe cleared

2. **Generate Recipe**
   - [ ] Spin wheel
   - [ ] Generate random recipe
   - [ ] Verify all text in Chinese
   - [ ] Check for any English mixing

3. **Ingredient Test**
   - [ ] Click "我有什么" tab
   - [ ] Select ingredients (verify Chinese names)
   - [ ] Generate
   - [ ] Verify recipe includes selected ingredients
   - [ ] Verify all recipe text in Chinese

### Quick Test Flow (Swedish)

1. **Language Switch**
   - [ ] Switch to Swedish
   - [ ] Verify all UI in Swedish

2. **Full Flow**
   - [ ] Test random, search, and ingredients
   - [ ] Verify all text in Swedish
   - [ ] No English/Chinese mixing

---

## Automated Pre-Flight Checks Completed

✅ **Code Quality:**
- No linting errors in DishToday.jsx
- No linting errors in RecipeChoiceCards.jsx
- No linting errors in IngredientSelector.jsx
- No console.log debugging statements

✅ **Files Verified:**
- DishToday.jsx structure
- RecipeChoiceCards.jsx tab system
- ShoppingList.jsx integration
- Translation files present

---

## Sign-off

- [ ] All critical tests passed
- [ ] All language versions verified
- [ ] No mixed languages detected
- [ ] Ingredient matching working
- [ ] Shopping list consistent with Parties page
- [ ] No breaking changes
- [ ] Ready for production

**Tested by:** _______________  
**Date:** _______________  
**Signature:** _______________

