#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common dish name translations
const dishTranslations = {
  // Italian dishes
  'Pasta Carbonara': '卡布奇诺意面',
  'Lasagna': '千层面',
  'Risotto Milanese': '米兰烩饭',
  'Osso Buco': '红酒炖牛膝',
  'Polenta': '玉米粥',
  'Saltimbocca': '盐渍牛肉',
  'Minestrone': '蔬菜汤',
  'Focaccia': '佛卡夏面包',
  'Gnocchi': '意式土豆饺子',
  'Tagliatelle al Ragù': '肉酱宽面',
  'Panzanella': '意式面包沙拉',
  'Ribollita': '托斯卡纳汤',
  'Vitello Tonnato': '金枪鱼小牛肉',
  'Caponata': '西西里茄子',
  'Porchetta': '烤猪肉',
  'Tortellini': '意大利饺子',
  'Arancini': '炸饭团',
  
  // Spanish dishes
  'Gazpacho': '西班牙冷汤',
  'Escalivada': '烤蔬菜',
  'Salmorejo': '番茄冷汤',
  'Cocido': '西班牙炖菜',
  'Pinchos': '西班牙串烧',
  'Tostas': '西班牙吐司',
  'Caldereta': '西班牙炖肉',
  
  // Japanese dishes
  'Sukiyaki': '寿喜烧',
  'Yakitori': '日式烤鸡串',
  
  // Malaysian dishes
  'Laksa': '叻沙',
  
  // German dishes
  'Schnitzel': '炸肉排',
  
  // Add more as needed
};

// Country name translations
const countryTranslations = {
  'Italy': '意大利',
  'Spain': '西班牙',
  'France': '法国',
  'Germany': '德国',
  'Greece': '希腊',
  'Sweden': '瑞典',
  'Turkey': '土耳其',
  'America': '美国',
  'Canada': '加拿大',
  'Brazil': '巴西',
  'Colombia': '哥伦比亚',
  'Mexico': '墨西哥',
  'Peru': '秘鲁',
  'Argentina': '阿根廷',
  'Iran': '伊朗',
  'Lebanon': '黎巴嫩',
  'Morocco': '摩洛哥',
  'Nigeria': '尼日利亚',
  'South Africa': '南非',
  'China': '中国',
  'Japan': '日本',
  'Korea': '韩国',
  'Thailand': '泰国',
  'India': '印度',
  'Malaysia': '马来西亚',
  'Singapore': '新加坡',
  'Vietnam': '越南',
  'Indonesia': '印度尼西亚',
  'Philippines': '菲律宾',
  'Australia': '澳大利亚',
  'New Zealand': '新西兰',
  'Russia': '俄罗斯',
  'Poland': '波兰',
  'Czech Republic': '捷克',
  'Hungary': '匈牙利',
  'Romania': '罗马尼亚',
  'Bulgaria': '保加利亚',
  'Croatia': '克罗地亚',
  'Serbia': '塞尔维亚',
  'Slovenia': '斯洛文尼亚',
  'Slovakia': '斯洛伐克',
  'Estonia': '爱沙尼亚',
  'Latvia': '拉脱维亚',
  'Lithuania': '立陶宛',
  'Finland': '芬兰',
  'Norway': '挪威',
  'Denmark': '丹麦',
  'Iceland': '冰岛',
  'Ireland': '爱尔兰',
  'Scotland': '苏格兰',
  'Wales': '威尔士',
  'England': '英格兰',
  'Portugal': '葡萄牙',
  'Netherlands': '荷兰',
  'Belgium': '比利时',
  'Luxembourg': '卢森堡',
  'Switzerland': '瑞士',
  'Austria': '奥地利',
  'Liechtenstein': '列支敦士登',
  'Monaco': '摩纳哥',
  'Andorra': '安道尔',
  'San Marino': '圣马力诺',
  'Vatican': '梵蒂冈',
  'Malta': '马耳他',
  'Cyprus': '塞浦路斯',
  'Albania': '阿尔巴尼亚',
  'Macedonia': '马其顿',
  'Montenegro': '黑山',
  'Bosnia': '波斯尼亚',
  'Kosovo': '科索沃',
  'Moldova': '摩尔多瓦',
  'Ukraine': '乌克兰',
  'Belarus': '白俄罗斯',
  'Georgia': '格鲁吉亚',
  'Armenia': '亚美尼亚',
  'Azerbaijan': '阿塞拜疆',
  'Kazakhstan': '哈萨克斯坦',
  'Uzbekistan': '乌兹别克斯坦',
  'Kyrgyzstan': '吉尔吉斯斯坦',
  'Tajikistan': '塔吉克斯坦',
  'Turkmenistan': '土库曼斯坦',
  'Afghanistan': '阿富汗',
  'Pakistan': '巴基斯坦',
  'Bangladesh': '孟加拉国',
  'Sri Lanka': '斯里兰卡',
  'Maldives': '马尔代夫',
  'Nepal': '尼泊尔',
  'Bhutan': '不丹',
  'Myanmar': '缅甸',
  'Laos': '老挝',
  'Cambodia': '柬埔寨',
  'Brunei': '文莱',
  'East Timor': '东帝汶',
  'Papua New Guinea': '巴布亚新几内亚',
  'Fiji': '斐济',
  'Samoa': '萨摩亚',
  'Tonga': '汤加',
  'Vanuatu': '瓦努阿图',
  'Solomon Islands': '所罗门群岛',
  'Palau': '帕劳',
  'Micronesia': '密克罗尼西亚',
  'Marshall Islands': '马绍尔群岛',
  'Kiribati': '基里巴斯',
  'Tuvalu': '图瓦卢',
  'Nauru': '瑙鲁',
  'Cook Islands': '库克群岛',
  'Niue': '纽埃',
  'Tokelau': '托克劳',
  'Pitcairn': '皮特凯恩',
  'Norfolk Island': '诺福克岛',
  'Christmas Island': '圣诞岛',
  'Cocos Islands': '科科斯群岛',
  'Heard Island': '赫德岛',
  'Macquarie Island': '麦夸里岛',
  'Lord Howe Island': '豪勋爵岛',
  'Norfolk Island': '诺福克岛',
  'Christmas Island': '圣诞岛',
  'Cocos Islands': '科科斯群岛',
  'Heard Island': '赫德岛',
  'Macquarie Island': '麦夸里岛',
  'Lord Howe Island': '豪勋爵岛'
};

function fixRecipeFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let changesCount = 0;
    
    // Fix dish names
    for (const [english, chinese] of Object.entries(dishTranslations)) {
      const pattern = new RegExp(`"zh": "${english}",`, 'g');
      if (updatedContent.includes(`"zh": "${english}",`)) {
        updatedContent = updatedContent.replace(pattern, `"zh": "${chinese}",`);
        changesCount++;
        console.log(`  Fixed dish name: ${english} -> ${chinese}`);
      }
    }
    
    // Fix country names in descriptions
    for (const [english, chinese] of Object.entries(countryTranslations)) {
      const pattern = new RegExp(`"zh": ".*${english}.*"`, 'g');
      const matches = updatedContent.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const updatedMatch = match.replace(english, chinese);
          updatedContent = updatedContent.replace(match, updatedMatch);
          changesCount++;
          console.log(`  Fixed country in description: ${english} -> ${chinese}`);
        });
      }
    }
    
    if (changesCount > 0) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`  ✅ Updated ${filePath} with ${changesCount} changes`);
    } else {
      console.log(`  ⚪ No changes needed for ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main execution
const recipesDir = path.join(__dirname, '..', 'src', 'recipes');
const recipeFiles = [
  'Europe.json',
  'Asia.json',
  'LatinAmerica.json',
  'NorthAmerica.json',
  'SouthAmerica.json',
  'MiddleEast.json',
  'Africa.json'
];

console.log('🔧 Fixing hardcoded English translations in recipe files...\n');

recipeFiles.forEach(fileName => {
  const filePath = path.join(recipesDir, fileName);
  if (fs.existsSync(filePath)) {
    fixRecipeFile(filePath);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log('\n✅ Translation fix complete!');
