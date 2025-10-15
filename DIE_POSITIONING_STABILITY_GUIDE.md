# Die Positioning Stability Guide

## Overview
This document explains the stable die positioning logic that works consistently across Drink and Sauce pages. **DO NOT MODIFY** these patterns without understanding the complete system.

## Key Principles

### 1. Timing is Critical
```javascript
// ✅ CORRECT: setIsRolling(false) AFTER positioning
setTimeout(() => {
  // ... positioning logic ...
  setDiePosition({ x, y, isMoving: true })
  setIsRolling(false) // AFTER positioning
}, 100)

// ❌ WRONG: setIsRolling(false) BEFORE positioning
setIsRolling(false) // Triggers useEffect reset!
setTimeout(() => {
  // ... positioning logic ...
}, 100)
```

### 2. Scroll-First Approach (Sauce Page)
```javascript
// ✅ CORRECT: Scroll first, then position
selectedSauceElement.scrollIntoView({ 
  behavior: 'smooth', 
  block: 'center',
  inline: 'center'
})

setTimeout(() => {
  // Calculate position AFTER scroll completes
  const rect = selectedSauceElement.getBoundingClientRect()
  // ... positioning logic ...
  setDiePosition({ x, y, isMoving: true })
}, 300) // Wait for scroll animation
```

### 3. Category Switching Approach (Drink Page)
```javascript
// ✅ CORRECT: Switch category first, then position
if (drinkCategory && drinkCategory !== selectedCategory) {
  setSelectedCategory(drinkCategory) // Brings drink into view
}

setTimeout(() => {
  // Calculate position AFTER category switch
  const rect = selectedDrinkElement.getBoundingClientRect()
  // ... positioning logic ...
  setDiePosition({ x, y, isMoving: true })
}, 100)
```

## Stable Patterns

### Drink Page Die Logic
- **Selection**: From `allDrinks` (all drinks across categories)
- **Preparation**: Auto-switch to drink's category
- **Positioning**: Pure calculated position (no limits)
- **Timing**: `setIsRolling(false)` after positioning

### Sauce Page Die Logic  
- **Selection**: From `filteredSauces` (currently visible sauces)
- **Preparation**: Scroll to bring sauce into view
- **Positioning**: Pure calculated position (no limits)
- **Timing**: `setIsRolling(false)` after positioning

## Common Mistakes to Avoid

### ❌ Position Limiting
```javascript
// DON'T DO THIS - breaks positioning accuracy
const limitedX = Math.max(-300, Math.min(300, x))
setDiePosition({ x: limitedX, y: limitedY, isMoving: true })
```

### ❌ Premature Reset
```javascript
// DON'T DO THIS - causes instability
useEffect(() => {
  if (!isRolling) { // Triggers during die movement!
    resetDieState()
  }
}, [filters, isRolling])
```

### ❌ Complex useEffect Conditions
```javascript
// DON'T DO THIS - creates race conditions
useEffect(() => {
  if (!isRolling && !highlightedSauce && !rollResult) {
    resetDieState() // Too complex, causes issues
  }
}, [selectedUseCase, isRolling, highlightedSauce, rollResult])
```

## CSS Requirements

### Highlight Effect
```css
.sauce-item.highlighted, .drink-item.highlighted {
  border: 3px solid var(--primary-color) !important;
  background: linear-gradient(135deg, #fff5f5, #ffffff) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4) !important;
  animation: highlightPulse 2s ease-in-out;
  z-index: 1;
}
```

## Testing Checklist

Before modifying die logic, test:
- [ ] Die positions accurately on selected item
- [ ] Die stays stable (doesn't reset unexpectedly)
- [ ] Highlight effect works
- [ ] Manual clicks work correctly (show recipe, don't move die)
- [ ] Multiple consecutive rolls work
- [ ] Filter changes reset die properly
- [ ] Language changes reset die properly

## Regression Prevention

1. **Never modify timing** without understanding the complete flow
2. **Always test multiple scenarios** before committing
3. **Use exact patterns** from working pages
4. **Avoid "improvements"** that add complexity
5. **Document any changes** to this guide

## Current Stable State

- **Drink Page**: ✅ Working perfectly
- **Sauce Page**: ✅ Working with scroll-first approach
- **Highlight Effects**: ✅ Working on both pages
- **Manual Selection**: ✅ Working correctly
- **Timing**: ✅ Correct (`setIsRolling(false)` after positioning)

**Last Updated**: December 2024
**Status**: Stable - Do not modify without comprehensive testing
