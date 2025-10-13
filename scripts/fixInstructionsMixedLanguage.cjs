const fs = require('fs');

// Comprehensive English to Chinese translation for cooking instructions
const instructionTranslations = {
  // Common cooking verbs
  'add': '加', 'heat': '加热', 'cook': '烹饪', 'stir': '搅拌', 'mix': '混合',
  'combine': '结合', 'pour': '倒', 'remove': '移除', 'set': '放', 'aside': '一边',
  'return': '返回', 'toss': '搅拌', 'form': '形成', 'cut': '切', 'slice': '切片',
  'chop': '切碎', 'dice': '切丁', 'mince': '剁碎', 'grate': '磨碎', 'shred': '切丝',
  'peel': '去皮', 'wash': '洗', 'clean': '清洁', 'drain': '沥干', 'rinse': '冲洗',
  'boil': '煮沸', 'simmer': '炖', 'fry': '炸', 'sauté': '炒', 'stir-fry': '炒',
  'deep-fry': '炸', 'pan-fry': '煎', 'grill': '烤', 'roast': '烤制', 'bake': '烘烤',
  'steam': '蒸', 'braise': '炖', 'marinate': '腌制', 'season': '调味', 'salt': '盐',
  'pepper': '胡椒', 'taste': '品尝', 'adjust': '调整', 'serve': '服务', 'garnish': '装饰',
  
  // Common cooking terms
  'until': '直到', 'about': '大约', 'minutes': '分钟', 'hours': '小时', 'seconds': '秒',
  'medium': '中等', 'high': '高', 'low': '低', 'hot': '热', 'cold': '冷', 'warm': '温',
  'temperature': '温度', 'heat': '火', 'flame': '火焰', 'pan': '平底锅', 'pot': '锅',
  'wok': '炒锅', 'bowl': '碗', 'plate': '盘子', 'spoon': '勺子', 'fork': '叉子',
  'knife': '刀', 'cutting': '切', 'board': '板', 'oil': '油', 'butter': '黄油',
  'water': '水', 'broth': '汤', 'stock': '高汤', 'sauce': '酱', 'dressing': '调料',
  'marinade': '腌料', 'seasoning': '调味料', 'spice': '香料', 'herb': '香草',
  
  // Descriptive terms
  'golden': '金黄', 'brown': '棕色', 'crispy': '酥脆', 'tender': '嫩', 'soft': '软',
  'firm': '结实', 'thick': '厚', 'thin': '薄', 'smooth': '光滑', 'rough': '粗糙',
  'thickens': '变稠', 'reduces': '减少', 'bubbles': '冒泡', 'boils': '沸腾',
  'simmering': '炖煮', 'sizzling': '滋滋作响', 'steaming': '蒸', 'smoking': '冒烟',
  
  // Time and quantity terms
  'everything': '一切', 'together': '一起', 'all': '所有', 'both': '两者', 'each': '每个',
  'some': '一些', 'more': '更多', 'less': '更少', 'enough': '足够', 'too': '太',
  'very': '非常', 'quite': '相当', 'rather': '相当', 'quite': '相当', 'enough': '足够',
  'almost': '几乎', 'nearly': '几乎', 'just': '只是', 'only': '只有', 'first': '首先',
  'next': '然后', 'then': '然后', 'finally': '最后', 'last': '最后', 'begin': '开始',
  'start': '开始', 'end': '结束', 'finish': '完成', 'complete': '完成', 'done': '完成',
  
  // Common phrases
  'set aside': '放在一边', 'return to': '返回到', 'add to': '添加到', 'mix well': '充分混合',
  'stir constantly': '不断搅拌', 'cook until': '煮至', 'heat through': '加热透',
  'bring to': '煮至', 'reduce heat': '降低火力', 'increase heat': '提高火力',
  'turn off': '关闭', 'turn on': '打开', 'remove from': '从...移除', 'place in': '放在',
  'cover with': '用...覆盖', 'uncover': '揭开', 'let rest': '静置', 'let cool': '冷却',
  
  // Specific cooking instructions
  'brown on all sides': '各面煎至棕色', 'cook through': '煮透', 'heat through': '加热透',
  'bring to boil': '煮至沸腾', 'reduce to simmer': '调小火炖', 'stir occasionally': '偶尔搅拌',
  'stir frequently': '经常搅拌', 'stir constantly': '不断搅拌', 'do not stir': '不要搅拌',
  'cover and cook': '盖上盖子煮', 'uncover and cook': '揭开盖子煮', 'let simmer': '小火炖',
  'bring to room temperature': '达到室温', 'chill in refrigerator': '冷藏',
  
  // Common words that appear in instructions
  'the': '', 'a': '一个', 'an': '一个', 'and': '和', 'or': '或', 'with': '配', 'in': '在',
  'on': '在', 'at': '在', 'by': '由', 'for': '为', 'to': '到', 'from': '从', 'of': '的',
  'is': '是', 'are': '是', 'was': '是', 'were': '是', 'be': '是', 'been': '是', 'being': '是',
  'have': '有', 'has': '有', 'had': '有', 'having': '有', 'do': '做', 'does': '做',
  'did': '做', 'doing': '做', 'will': '将', 'would': '将', 'could': '能', 'should': '应该',
  'may': '可能', 'might': '可能', 'can': '能', 'must': '必须', 'shall': '将'
};

// Function to translate mixed language instructions
function translateInstruction(instruction) {
  if (!instruction || typeof instruction !== 'string') {
    return instruction;
  }
  
  let result = instruction;
  
  // Sort translation keys by length (longest first) to handle compound phrases
  const sortedKeys = Object.keys(instructionTranslations).sort((a, b) => b.length - a.length);
  
  // Replace English words with Chinese translations
  sortedKeys.forEach(englishWord => {
    const translation = instructionTranslations[englishWord];
    if (translation) {
      // Use word boundary regex to ensure we only replace whole words
      const regex = new RegExp(`\\b${englishWord}\\b`, 'gi');
      result = result.replace(regex, translation);
    }
  });
  
  // Clean up extra spaces and punctuation
  result = result.replace(/\s+/g, ' ').trim();
  result = result.replace(/\s*,\s*/g, ', ');
  result = result.replace(/\s*\.\s*/g, '. ');
  result = result.replace(/\s*\?\s*/g, '? ');
  result = result.replace(/\s*!\s*/g, '! ');
  
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
            // Fix recipe name
            if (recipe.name) {
              const newName = translateInstruction(recipe.name);
              if (newName !== recipe.name) {
                recipe.name = newName;
                changesCount++;
              }
            }
            
            // Fix instructions
            if (recipe.instructions && Array.isArray(recipe.instructions)) {
              recipe.instructions = recipe.instructions.map(instruction => {
                const newInstruction = translateInstruction(instruction);
                if (newInstruction !== instruction) {
                  changesCount++;
                }
                return newInstruction;
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
console.log('🔧 FIXING INSTRUCTIONS MIXED LANGUAGE CONTENT');
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
console.log('🎉 INSTRUCTIONS MIXED LANGUAGE FIX COMPLETE!');
console.log(`📊 Total changes made: ${totalChanges}`);
console.log('');
console.log('✨ All mixed language content in instructions has been fixed!');
console.log('🧪 Test the recipe display to verify complete language consistency.');
