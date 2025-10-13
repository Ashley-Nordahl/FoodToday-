# CRITICAL: Language Mixing Prevention Tests

## Overview
These tests specifically target the **MOST CRITICAL BUG** you reported: English and Chinese content appearing mixed together when generating recipes. This should NEVER happen and breaks the user experience completely.

## What Gets Tested

### File: `src/test/__tests__/LanguageMixing.test.jsx`

This test suite contains **CRITICAL** tests that will FAIL if language mixing occurs. Any failure indicates a serious bug that must be fixed immediately.

## Test Categories

### 1. ❌ MUST NOT: English Ingredients + Chinese Recipe Name
**Test**: `MUST NOT show English ingredients with Chinese recipe name`

**Checks**:
- Recipe name is in Chinese (糖醋排骨)
- NO English text like "Sweet and Sour Pork"
- NO English ingredients like "1 lb pork chops", "bell peppers"
- NO English instructions like "Cut pork into bite-sized pieces"
- All ingredients ARE in Chinese (猪排450克, 甜椒2个)

**Why Critical**: This is the exact bug you reported

---

### 2. ❌ MUST NOT: Chinese Ingredients + English Recipe Name
**Test**: `MUST NOT show Chinese ingredients with English recipe name`

**Checks**:
- Recipe name is in English (Sweet and Sour Pork)
- NO Chinese text like "糖醋排骨"
- NO Chinese ingredients like "猪排450克"
- NO Chinese instructions like "将猪肉切成一口大小的块"
- All ingredients ARE in English

**Why Critical**: Reverse of bug #1, equally bad

---

### 3. ❌ MUST NOT: Mixed Language in Instructions
**Test**: `MUST NOT show mixed language in instructions`

**Checks**:
- When recipe is in Chinese, ALL instructions are Chinese
- NO English instructions appear
- Specifically checks for: "Cut pork", "Heat oil", "Serve immediately"
- Verifies Chinese instructions: "将猪肉切成一口大小的块"

**Why Critical**: Instructions must be 100% one language

---

### 4. ❌ MUST NOT: Mixed Units in Ingredient Amounts
**Test**: `MUST NOT show mixed language in ingredient amounts`

**Checks**:
- Chinese recipes use Chinese units: 克 (grams), 个 (pieces), 汤匙 (tablespoon)
- NO English units: "lb", "cups", "tbsp"
- Verifies: "450克" NOT "1 lb"

**Why Critical**: Units must match language

---

### 5. ❌ MUST NOT: Mix in RecipeDetails Component
**Test**: `MUST NOT mix English and Chinese in same recipe view`

**Checks**:
- Chinese recipe has NO English words anywhere
- Checks entire page text content
- Scans for common English words: "Sweet and Sour", "pork chops", "Cut pork"

**Why Critical**: Component-level verification

---

### 6. ❌ MUST NOT: English Section Titles + Chinese Content
**Test**: `MUST NOT have English section titles with Chinese content`

**Checks**:
- Section titles translate: "Ingredients" → "食材", "Instructions" → "步骤"
- NO English "Ingredients:" or "Instructions:" when recipe is Chinese

**Why Critical**: UI elements must match recipe language

---

### 7. ❌ MUST NOT: Mixed During Language Switching
**Test**: `MUST NOT show mixed languages during transition`

**Why This Is THE MOST CRITICAL TEST**:
- Tests the EXACT scenario where bugs usually occur
- Generates recipe in English
- Switches to Chinese
- Scans ENTIRE page for ANY English words
- Lists specific patterns to check:
  - Recipe names
  - Ingredients
  - Instructions
  - Units (lb, cup, tbsp)
  - UI labels

**What It Checks**:
```javascript
// These should NOT appear when in Chinese:
'Sweet and Sour Pork'
'pork chops'
'bell peppers'
'Cut pork'
'Heat oil'
'lb', 'cup', 'tbsp'
'Ingredients:'
'Instructions:'
'Random Recipe'
```

**Why Critical**: Language switching is when bugs happen most

---

### 8. ❌ MUST NOT: Mix During Rapid Switching
**Test**: `MUST handle rapid language switching without mixing`

**Checks**:
- Switches en → zh → sv → en rapidly
- Verifies NO mixing at any point
- Final state is pure English with NO Chinese or Swedish

**Why Critical**: Stress test for state management

---

### 9. ✅ Data Structure Validation
**Test**: `MUST have same recipe IDs across all languages`

**Checks**:
- Recipe ID=1 in English = Recipe ID=1 in Chinese = Recipe ID=1 in Swedish
- This is HOW the system knows they're the same recipe

**Test**: `MUST NOT have any English text in Chinese recipe data`

**Checks**:
- Chinese recipe JSON has NO English words
- Scans for: "pork chops", "bell peppers", "Cut", "Heat", "lb", "cup"

**Test**: `MUST NOT have any Chinese characters in English recipe data`

**Checks**:
- English recipe JSON has NO Chinese characters
- Scans for: "糖醋", "猪排", "甜椒", "克", "个"

**Why Critical**: Data integrity at source

---

## How These Tests Catch The Bug

### Scenario: Recipe Generated in English, User Switches to Chinese

**What SHOULD happen**:
1. User sees "Sweet and Sour Pork" in English
2. User switches to Chinese
3. System finds recipe with ID=1 in Chinese data
4. Displays "糖醋排骨" with Chinese ingredients/instructions
5. NO English content remains

**What the tests check**:
```javascript
// After switch to Chinese
expect(screen.getByText('糖醋排骨')).toBeInTheDocument() // ✅
expect(screen.queryByText('Sweet and Sour Pork')).not.toBeInTheDocument() // ✅
expect(pageText).not.toContain('pork chops') // ✅ CRITICAL
expect(pageText).not.toContain('Cut pork') // ✅ CRITICAL
expect(pageText).toContain('猪排') // ✅
expect(pageText).toContain('将猪肉') // ✅
```

### If ANY of these fail → Language mixing bug exists

---

## How to Run These Tests

```bash
# Run ONLY the critical language mixing tests
npm test -- LanguageMixing.test.jsx

# Run with verbose output to see what's mixing
npm test -- LanguageMixing.test.jsx --reporter=verbose

# Run in UI mode for debugging
npm run test:ui
```

---

## What To Do If Tests Fail

### If test fails: "MUST NOT show English ingredients with Chinese recipe name"

**Problem**: `useEffect` in DishToday.jsx might not be triggered by language change

**Check**:
1. Is `i18n.language` in the `useEffect` dependency array?
2. Is `useRecipes()` returning data for current language?
3. Is the recipe ID lookup finding the right recipe?

**Code to check**: `src/pages/DishToday.jsx` lines 84-118

---

### If test fails: "MUST NOT show mixed languages during transition"

**Problem**: Old recipe state not clearing before new language loads

**Check**:
1. Is `setSelectedRecipe()` being called with new recipe data?
2. Are ingredient/instruction arrays being replaced completely?
3. Is component re-rendering after language change?

---

### If test fails: Data structure validation

**Problem**: Recipe data files have wrong translations

**Check**:
1. `src/locales/en/recipes.json` - Check recipe ID=1
2. `src/locales/zh/recipes.json` - Check recipe ID=1
3. Ensure IDs match but content is translated
4. Run: `npm run validate-translations`

---

## Success Criteria

✅ All 18+ critical tests pass
✅ NO language mixing in any scenario
✅ Recipe content 100% in selected language
✅ UI elements 100% in selected language
✅ Transitions are clean with no mixing
✅ Data structure is consistent

---

## Why These Tests Are Different

**Regular Language Tests**: Verify translations work
**THESE Tests**: Verify NO MIXING occurs

These tests use:
- **Negative assertions**: `not.toContain()`, `not.toBeInTheDocument()`
- **Full page scans**: Check ALL text content
- **Pattern lists**: Specific English/Chinese words to exclude
- **Stress tests**: Rapid switching, multiple transitions

**Goal**: ZERO TOLERANCE for language mixing

---

## Real-World Impact

**Without these tests**: Users might see:
```
Recipe: 糖醋排骨 (Chinese)
Ingredients: 
- 1 lb pork chops (English!)  ❌ BUG
- 2 bell peppers (English!)   ❌ BUG
Instructions:
1. 将猪肉切成一口大小的块 (Chinese) ✅
2. Cut pork into pieces (English!) ❌ BUG
```

**With these tests passing**: Users see:
```
Recipe: 糖醋排骨 (Chinese)
Ingredients:
- 猪排450克，切块 (Chinese) ✅
- 甜椒2个，切块 (Chinese) ✅
Instructions:
1. 将猪肉切成一口大小的块 (Chinese) ✅
2. 在炒锅中加热油至高温 (Chinese) ✅
```

---

## Maintenance

Run these tests:
- ✅ Before every deployment
- ✅ After any i18n changes
- ✅ After recipe data updates
- ✅ When adding new languages
- ✅ When debugging user-reported mixing issues

**These tests protect THE most important user experience**: Clean, unmixed language throughout the app.


