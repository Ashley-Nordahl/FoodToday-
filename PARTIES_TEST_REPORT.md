# Parties Page Test Report

**Test Date:** $(date)  
**Tester:** Manual Testing Required  
**Test Environment:** http://localhost:5173/parties  
**Languages Tested:** English (en), Chinese (zh), Swedish (sv)

---

## Test Execution Summary

### Phase 1: Initial Load & UI Elements ✅

#### English (en)
- [ ] Page loads without errors
- [ ] Default state: 4 plates (2 meat, 1 seafood, 1 vegetables)
- [ ] Default preferences: Rich taste, Mixed cuisine, Friends scenario
- [ ] All ingredient category buttons visible and labeled in English
- [ ] All UI text in English (no mixed languages)

#### Chinese (zh)
- [ ] Page loads without errors
- [ ] All ingredient category buttons labeled in Chinese (肉类, 海鲜, 蔬菜, 谷物, 蛋类)
- [ ] All UI text in Chinese (no mixed languages)
- [ ] Taste preferences in Chinese (浓郁, 辣, 甜, 酸, 咸, 清淡)
- [ ] Cuisine styles in Chinese (混合菜系, 中式风格, 西式风格, 日式风格)
- [ ] Dining scenarios in Chinese (家庭聚会, 朋友聚会, 浪漫晚餐)

#### Swedish (sv)
- [ ] Page loads without errors
- [ ] All ingredient category buttons labeled in Swedish (Kött, Skaldjur, Grönsaker, Spannmål, Ägg)
- [ ] All UI text in Swedish (no mixed languages)
- [ ] Taste preferences in Swedish (Rik, Kryddig, Söt, Sur, Salt, Lätt)
- [ ] Cuisine styles in Swedish (Blandad Matkultur, Kinesisk Stil, Västerländsk Stil, Japansk Stil)
- [ ] Dining scenarios in Swedish (Familjesamling, Vänsamling, Romantisk Middag)

**Status:** ⏳ Pending Manual Testing

---

### Phase 2: Drag & Drop Functionality

- [ ] Drag meat category to empty plate → appears on plate
- [ ] Drag seafood category to occupied plate → replaces existing
- [ ] Remove category with X button → plate becomes empty
- [ ] Drag and drop works in English
- [ ] Drag and drop works in Chinese
- [ ] Drag and drop works in Swedish
- [ ] Visual feedback during drag (cursor, highlighting)

**Status:** ⏳ Pending Manual Testing

---

### Phase 3: Number of Dishes Selection

- [ ] Click "2" → shows 2 plates
- [ ] Click "5" → shows 5 plates
- [ ] Click "10" → shows 10 plates
- [ ] Previously selected categories persist when changing number
- [ ] Works consistently across all languages

**Status:** ⏳ Pending Manual Testing

---

### Phase 4: Taste Preferences

- [ ] Click "Rich" → toggles selection
- [ ] Click "Spicy" → toggles selection
- [ ] Multiple tastes can be selected simultaneously
- [ ] Visual indication of selected state
- [ ] Labels properly translated in all languages

**Status:** ⏳ Pending Manual Testing

---

### Phase 5: Cuisine Style & Dining Scenario

- [ ] Select "Chinese Style" → updates selection
- [ ] Select "Western Style" → updates selection
- [ ] Select "Family Gathering" → updates selection
- [ ] Select "Romantic Dinner" → updates selection
- [ ] Selection persists until generation
- [ ] Labels translated in all languages

**Status:** ⏳ Pending Manual Testing

---

### Phase 6: AI Recipe Generation

#### English Generation
- [ ] Click "Leave to AI Chef" → shows loading state
- [ ] Generates correct number of recipes (matches selected dishes)
- [ ] Recipe names in English only
- [ ] Ingredients in English only
- [ ] Ingredient amounts have proper spacing (e.g., "500g lamb-chops")
- [ ] Page auto-scrolls to generated menu
- [ ] Layout matches original design
- [ ] Recipes match selected categories
- [ ] Recipes match taste preferences
- [ ] Recipes match cuisine style

#### Chinese Generation
- [ ] Recipe names in Chinese only (no English)
- [ ] Ingredients in Chinese only (no English)
- [ ] Ingredient amounts in Chinese with proper spacing
- [ ] Cooking methods in Chinese (烤制, 蒸制, 炒制, etc.)
- [ ] Cooking times in Chinese (10-15分钟, etc.)
- [ ] Difficulty in Chinese (简单, 中等, 困难)
- [ ] Special ingredients translated (kimchi → 泡菜, scallops → 扇贝)

#### Swedish Generation
- [ ] Recipe names in Swedish only (no English)
- [ ] Ingredients in Swedish only (no English)
- [ ] Ingredient amounts in Swedish with proper spacing
- [ ] Cooking methods in Swedish (Grillad, Ångad, Sauterad, etc.)
- [ ] Cooking times in Swedish (10-15 minuter, etc.)
- [ ] Difficulty in Swedish (Lätt, Medium, Svår)

**Status:** ⏳ Pending Manual Testing

---

### Phase 7: Duplicate Prevention

- [ ] Generate 4 dishes → no duplicate recipes
- [ ] Generate 10 dishes → no duplicate recipes
- [ ] Two meat dishes use different proteins (e.g., not both pork belly)
- [ ] Multiple generations produce different menus
- [ ] Duplicate prevention works in all languages

**Status:** ⏳ Pending Manual Testing

---

### Phase 8: Recipe Modal

#### Modal Display
- [ ] Click recipe name → modal opens
- [ ] Modal shows recipe emoji
- [ ] Recipe name in correct language
- [ ] Cuisine metadata translated correctly
- [ ] Cooking method translated correctly
- [ ] Cooking time translated correctly
- [ ] Difficulty translated correctly
- [ ] Ingredients list with amounts (correct language, proper spacing)
- [ ] Instructions heading shows "Instructions" (not "parties.instructions")
- [ ] Instructions text in correct language
- [ ] No mixed languages in modal

#### Modal Interaction
- [ ] Click X button → modal closes
- [ ] Click outside modal → modal closes
- [ ] Works correctly in English
- [ ] Works correctly in Chinese
- [ ] Works correctly in Swedish

**Status:** ⏳ Pending Manual Testing

---

### Phase 9: Individual Recipe Regeneration

- [ ] Click regenerate button on dish 1 → only that dish regenerates
- [ ] Only clicked button shows loading state (others remain normal)
- [ ] Regenerated recipe is different from original
- [ ] Regenerated recipe doesn't duplicate any dish in menu
- [ ] Regenerated recipe respects same category
- [ ] Works in all languages
- [ ] Can regenerate multiple times with different results

**Status:** ⏳ Pending Manual Testing

---

### Phase 10: Shopping List - Generation & Display

#### Consolidation
- [ ] Click "Generate Shopping List" → modal opens
- [ ] Ingredients from all dishes are listed
- [ ] Same ingredients are grouped together
- [ ] Amounts are summed correctly (e.g., 200g + 200g = 400g)
- [ ] Each ingredient shows which dishes use it
- [ ] Dish references include order numbers (1️⃣, 2️⃣, 3️⃣, 4️⃣)
- [ ] Dish references include emojis
- [ ] Order numbers match generated menu order

#### Translation
- [ ] All ingredients in correct language (English)
- [ ] All ingredients in correct language (Chinese)
- [ ] All ingredients in correct language (Swedish)
- [ ] Special ingredients translated (kimchi, scallops, etc.)
- [ ] No mixed languages in shopping list

#### UI
- [ ] Close button always visible at top
- [ ] Modal scrolls properly with long lists
- [ ] Layout is clean and organized

**Status:** ⏳ Pending Manual Testing

---

### Phase 11: Shopping List - Checkboxes

- [ ] All ingredients have checkboxes
- [ ] All checkboxes are ticked by default
- [ ] Click checkbox → toggles between checked/unchecked
- [ ] Unchecked ingredients show visual feedback (grayed out)
- [ ] Checkbox state persists while modal is open
- [ ] Total items count updates with checked items only
- [ ] Works in all languages

**Status:** ⏳ Pending Manual Testing

---

### Phase 12: Shopping List - Share: Copy

- [ ] Click "Copy" button (📋 Copy)
- [ ] Content copied to clipboard
- [ ] Button shows "✅ Copied!" temporarily
- [ ] Button color changes briefly then reverts
- [ ] No alert popup

#### Copied Content Format
- [ ] Menu title with number of dishes
- [ ] Dishes listed with bullet points (not numbers: •)
- [ ] Consolidated ingredients (only checked ones)
- [ ] Total items count shows only checked items
- [ ] Content in correct language (English)
- [ ] Content in correct language (Chinese)
- [ ] Content in correct language (Swedish)

**Status:** ⏳ Pending Manual Testing

---

### Phase 13: Shopping List - Share: SMS

#### Phone Dropdown
- [ ] Click "SMS" button (📱 SMS) → dropdown appears
- [ ] Click "Copy" button → dropdown hides
- [ ] Click "Email" button → dropdown hides
- [ ] Dropdown UI is clear and functional

#### Phone Number Input
- [ ] Enter phone number → accepted
- [ ] Click "Send" with valid number → opens SMS app
- [ ] SMS app pre-filled with shopping list content
- [ ] Phone number saved to localStorage
- [ ] Saved number appears in saved numbers list
- [ ] Dropdown closes after sending

#### Saved Numbers
- [ ] Click saved number → opens SMS directly
- [ ] Click X on saved number → removes from list
- [ ] Removed number deleted from localStorage
- [ ] Saved numbers persist after page reload

#### SMS Content Format
- [ ] Dishes listed with bullet points (not numbers)
- [ ] Only checked ingredients included
- [ ] Total items count shows only checked items
- [ ] Content in correct language

#### Browser Behavior
- [ ] No browser security popups
- [ ] SMS app opens smoothly
- [ ] Works in all languages

**Status:** ⏳ Pending Manual Testing

---

### Phase 14: Shopping List - Share: Email

- [ ] Click "Email" button (📧 Email)
- [ ] Phone dropdown hides
- [ ] Email client opens
- [ ] Email subject includes shopping list title
- [ ] Email body format correct (bullet points)
- [ ] Only checked ingredients in email
- [ ] Total items count shows only checked items
- [ ] Button shows temporary visual feedback
- [ ] Content in correct language
- [ ] Works in all languages

**Status:** ⏳ Pending Manual Testing

---

### Phase 15: Language Switching & Consistency

#### English to Chinese
- [ ] Switch language to Chinese
- [ ] All UI elements update to Chinese
- [ ] Generated dishes are cleared
- [ ] Selections reset to defaults
- [ ] No mixed English/Chinese anywhere

#### Chinese to Swedish
- [ ] Switch language to Swedish
- [ ] All UI elements update to Swedish
- [ ] Generated dishes are cleared
- [ ] No mixed Chinese/Swedish anywhere

#### Cross-Language Generation
- [ ] Generate in English → switch to Chinese → generate again
- [ ] New menu entirely in Chinese
- [ ] No remnants of English menu

#### Comprehensive Language Check
- [ ] Page title and headers translated
- [ ] Button labels translated
- [ ] Category names translated
- [ ] Taste preference labels translated
- [ ] Cuisine style names translated
- [ ] Dining scenario names translated
- [ ] Recipe names translated
- [ ] Ingredient names translated (including special ones)
- [ ] Ingredient amounts and units translated
- [ ] Cooking methods translated
- [ ] Cooking times translated
- [ ] Difficulty levels translated
- [ ] Instructions heading translated
- [ ] Shopping list headings translated
- [ ] Share button labels translated
- [ ] Total items text translated

**Status:** ⏳ Pending Manual Testing

---

### Phase 16: Edge Cases & Error Handling

- [ ] Generate with 0 plates → handles gracefully
- [ ] Generate with 1 dish → works correctly
- [ ] Generate with 10 dishes → all generate correctly
- [ ] Generate with conflicting preferences → reasonable results
- [ ] Regenerate same dish 5 times → different recipes each time
- [ ] Open shopping list with no dishes → handles gracefully
- [ ] localStorage full → phone save fails gracefully
- [ ] Very long ingredient list → scrolls properly, close button visible
- [ ] Uncheck all ingredients → "Total items: 0"
- [ ] Special characters in phone number → handles correctly

**Status:** ⏳ Pending Manual Testing

---

### Phase 17: Performance & Responsiveness

- [ ] AI generation completes within 5 seconds
- [ ] Page remains responsive during generation
- [ ] Scroll animation is smooth
- [ ] Modals open/close smoothly
- [ ] No console errors during any operations
- [ ] No memory leaks when switching languages 10+ times
- [ ] No performance degradation after multiple generations

**Status:** ⏳ Pending Manual Testing

---

### Phase 18: LocalStorage Persistence

- [ ] Save phone number → persist after page reload
- [ ] Save phone number → persist after browser close/reopen
- [ ] Saved numbers work after language switch
- [ ] Remove number → persists removal after reload
- [ ] Multiple phone numbers can be saved
- [ ] Phone numbers work correctly after app restart

**Status:** ⏳ Pending Manual Testing

---

## Critical Issues Found

_Document any bugs or issues found during testing here_

### High Priority
- None found yet

### Medium Priority
- None found yet

### Low Priority
- None found yet

---

## Test Coverage Summary

| Category | Total Tests | Passed | Failed | Pending |
|----------|-------------|--------|--------|---------|
| Initial Load | 18 | 0 | 0 | 18 |
| Drag & Drop | 7 | 0 | 0 | 7 |
| Number Selection | 5 | 0 | 0 | 5 |
| Taste Preferences | 5 | 0 | 0 | 5 |
| Cuisine & Scenario | 6 | 0 | 0 | 6 |
| AI Generation | 30 | 0 | 0 | 30 |
| Duplicate Prevention | 5 | 0 | 0 | 5 |
| Recipe Modal | 15 | 0 | 0 | 15 |
| Recipe Regeneration | 7 | 0 | 0 | 7 |
| Shopping List Display | 18 | 0 | 0 | 18 |
| Shopping List Checkboxes | 7 | 0 | 0 | 7 |
| Share: Copy | 9 | 0 | 0 | 9 |
| Share: SMS | 19 | 0 | 0 | 19 |
| Share: Email | 9 | 0 | 0 | 9 |
| Language Switching | 28 | 0 | 0 | 28 |
| Edge Cases | 10 | 0 | 0 | 10 |
| Performance | 7 | 0 | 0 | 7 |
| LocalStorage | 6 | 0 | 0 | 6 |
| **TOTAL** | **206** | **0** | **0** | **206** |

---

## Final Recommendations

_Add recommendations based on test results here_

---

## Sign-off

- [ ] All critical tests passed
- [ ] All medium priority tests passed
- [ ] All languages verified
- [ ] No breaking changes detected
- [ ] Ready for production

**Tested by:** _______________  
**Date:** _______________  
**Signature:** _______________

