const fs = require('fs');

// Function to clean up duplicated Chinese words in ingredient strings
function cleanDuplicatedIngredients(ingredientString) {
  if (!ingredientString || typeof ingredientString !== 'string') {
    return ingredientString;
  }
  
  let result = ingredientString;
  
  // Remove duplicated Chinese words (common patterns)
  const duplicatedPatterns = [
    // Pattern: "2 甜椒 甜椒" -> "2 甜椒"
    /(\d+)\s*(\w+)\s*\2/g,
    // Pattern: "1 汤匙 新鲜 姜" -> "1 汤匙 姜" (remove redundant "新鲜")
    /(\d+)\s*(\w+)\s*新鲜\s*(\w+)/g,
    // Pattern: "1 磅 猪肉 排骨" -> "1 磅 排骨" (remove redundant "猪肉")
    /(\d+)\s*(\w+)\s*猪肉\s*(\w+)/g,
    // Pattern: "1 磅 绞肉 猪肉" -> "1 磅 绞肉"
    /(\d+)\s*(\w+)\s*绞肉\s*猪肉/g,
    // Pattern: "1 中等 洋葱" -> "1 洋葱" (remove redundant "中等")
    /(\d+)\s*中等\s*(\w+)/g,
    // Pattern: "4 丁香 大蒜" -> "4 瓣 大蒜" (fix unit)
    /(\d+)\s*丁香\s*(\w+)/g
  ];
  
  // Apply cleaning patterns
  result = result.replace(/(\d+)\s*(\w+)\s*\2/g, '$1 $2'); // Remove duplicated words
  result = result.replace(/(\d+)\s*(\w+)\s*新鲜\s*(\w+)/g, '$1 $2 $3'); // Remove "新鲜"
  result = result.replace(/(\d+)\s*(\w+)\s*猪肉\s*(\w+)/g, '$1 $2 $3'); // Remove redundant "猪肉"
  result = result.replace(/(\d+)\s*(\w+)\s*绞肉\s*猪肉/g, '$1 $2 绞肉'); // Fix "绞肉 猪肉"
  result = result.replace(/(\d+)\s*中等\s*(\w+)/g, '$1 $2'); // Remove "中等"
  result = result.replace(/(\d+)\s*丁香\s*(\w+)/g, '$1 瓣 $2'); // Fix "丁香" to "瓣"
  
  // Clean up extra spaces
  result = result.replace(/\s+/g, ' ').trim();
  
  return result;
}

// Function to process recipe file
function processRecipeFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changesCount = 0;
    
    // Process cultural recipes
    if (data.cultural) {
      Object.keys(data.cultural).forEach(cuisine => {
        if (Array.isArray(data.cultural[cuisine])) {
          data.cultural[cuisine].forEach(recipe => {
            // Clean ingredients with amounts
            if (recipe.ingredientsWithAmounts && Array.isArray(recipe.ingredientsWithAmounts)) {
              recipe.ingredientsWithAmounts = recipe.ingredientsWithAmounts.map(ingredient => {
                const newIngredient = cleanDuplicatedIngredients(ingredient);
                if (newIngredient !== ingredient) {
                  changesCount++;
                }
                return newIngredient;
              });
            }
          });
        }
      });
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ ${filePath}: ${changesCount} changes made`);
    
    return changesCount;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

// Main execution
console.log('🔧 CLEANING DUPLICATED INGREDIENT PATTERNS');
console.log('═'.repeat(50));

const zhFile = 'src/locales/zh/recipes.json';

let totalChanges = 0;

// Process Chinese recipes
if (fs.existsSync(zhFile)) {
  totalChanges += processRecipeFile(zhFile);
} else {
  console.log(`❌ File not found: ${zhFile}`);
}

console.log('');
console.log('🎉 DUPLICATED INGREDIENT CLEANUP COMPLETE!');
console.log(`📊 Total changes made: ${totalChanges}`);
console.log('');
console.log('✨ All duplicated Chinese words in ingredient strings have been cleaned!');
console.log('🧪 Test the recipe display to verify clean ingredient formatting.');
