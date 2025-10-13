# Correct Recipe Format Documentation

## ✅ THE WORKING FORMAT (DO NOT CHANGE!)

This document describes the **correct** recipe format that is currently working in the application. **DO NOT try to "improve" or "fix" this format** - it works correctly as-is!

## Recipe Data Structure

### 1. Dish Names
- **Format**: `dish.xxx` (singular, not plural)
- **Example**: `dish.sweet_and_sour_pork`
- **Component handling**: Already supports both `dish.` and `dishes.` prefixes

### 2. Descriptions
- **Format**: Plain text in the target language (NOT translation keys)
- **English example**: `"Classic Jiangsu dish with tender pork, bell peppers, and pineapple in a sweet and sour sauce"`
- **Chinese example**: `"经典 江苏 菜 配 嫩 猪肉, 甜椒 甜椒, 和 菠萝 在 一个 酸 酱"`
- **Swedish example**: `"Klassisk Jiangsu-rätt med mör fläskkött, paprika och ananas i en söt och sur sås"`

### 3. Ingredients (array)
- **Format**: `ingredient.xxx` (singular, not plural)
- **Example**: `["ingredient.porkchops", "ingredient.bellpepper", "ingredient.onion"]`
- **Component handling**: Already supports both `ingredient.` and `ingredients.` prefixes

### 4. Ingredients with Amounts (array)
- **Format**: Plain text in the target language with amounts
- **English example**: `["1 lb pork chops, cut into pieces", "2 bell peppers, sliced", "1 onion, diced"]`
- **Chinese example**: `["1 磅 排骨, 切块", "2 甜椒, 切片", "1 洋葱, 切丁"]`
- **Swedish example**: `["1 pund fläskkotletter, skurna i bitar", "2 paprikor, skivade", "1 lök, tärnad"]`

## Component Translation Logic

The React components (`DishToday.jsx`, `RecipeDetails.jsx`) already handle translation correctly:

```javascript
// For dish names
{recipe.name?.startsWith('dish.') || recipe.name?.startsWith('dishes.') 
  ? t(recipe.name) 
  : recipe.name}

// For descriptions
{recipe.description?.startsWith('description.') || recipe.description?.startsWith('descriptions.') 
  ? t(recipe.description) 
  : recipe.description}

// For ingredients
{ingredient?.startsWith('ingredient.') || ingredient?.startsWith('ingredients.') 
  ? t(ingredient) 
  : ingredient}
```

## Translation Files

The translation files (`src/locales/{lang}/translation.json`) contain:
- **ingredients**: Mapping of ingredient keys to translated names
- **dishes**: Mapping of dish keys to translated names
- **Other keys**: UI text, labels, buttons, etc.

## Why This Format Works

1. **Dish names** use translation keys (`dish.xxx`) so they can be translated via i18n
2. **Descriptions** are plain text because they're already in the target language in each locale's recipe file
3. **Ingredients** use translation keys (`ingredient.xxx`) for consistency
4. **Ingredients with amounts** are plain text because they include measurements and preparation instructions specific to each language

## What NOT To Do

❌ **DO NOT** convert descriptions to translation keys
❌ **DO NOT** change `dish.xxx` to `dishes.xxx` 
❌ **DO NOT** change `ingredient.xxx` to `ingredients.xxx`
❌ **DO NOT** try to "consolidate" or "standardize" the format
❌ **DO NOT** create scripts that bulk-convert the recipe data

## If Something Breaks

1. Restore from backup: `src/locales/{lang}/recipes.json.backup`
2. Verify the format matches this document
3. Check that components are using the translation logic correctly
4. **DO NOT** create new conversion scripts!

## Backup Files

- `recipes.json.backup` - First backup (working state from afternoon)
- `recipes.json.backup2` - Second backup (may be broken state)

**Always restore from `.backup` (not `.backup2`)**

---

**Last verified working**: October 13, 2025 (evening)
**Total recipes**: 528 (172 EN + 178 ZH + 178 SV)

