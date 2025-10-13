#!/usr/bin/env node

/**
 * Translation Validation Script
 * 
 * This script validates that all ingredient IDs in the registry have
 * corresponding translations in all language files.
 * 
 * Run: npm run validate-translations
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Import registry
const registryPath = join(rootDir, 'src/data/ingredientRegistry.js')
let INGREDIENT_REGISTRY

try {
  const registryModule = await import('../src/data/ingredientRegistry.js')
  INGREDIENT_REGISTRY = registryModule.INGREDIENT_REGISTRY
} catch (error) {
  console.error('❌ Failed to load ingredient registry:', error.message)
  process.exit(1)
}

// Load translation files
const loadJSON = (path) => {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    console.error(`❌ Failed to load ${path}:`, error.message)
    return null
  }
}

const enPath = join(rootDir, 'src/locales/en/translation.json')
const zhPath = join(rootDir, 'src/locales/zh/translation.json')
const svPath = join(rootDir, 'src/locales/sv/translation.json')

const enTranslations = loadJSON(enPath)
const zhTranslations = loadJSON(zhPath)
const svTranslations = loadJSON(svPath)

if (!enTranslations || !zhTranslations || !svTranslations) {
  console.error('❌ Failed to load translation files')
  process.exit(1)
}

const languages = {
  en: enTranslations,
  zh: zhTranslations,
  sv: svTranslations
}

console.log('🔍 Validating ingredient translations...\n')
console.log(`Registry contains ${Object.keys(INGREDIENT_REGISTRY).length} ingredients`)

let hasErrors = false
let missingCount = 0
let extraCount = 0

// Check that all registry ingredients have translations
console.log('\n📋 Checking registry ingredients have translations:\n')

Object.keys(INGREDIENT_REGISTRY).forEach(ingredientId => {
  Object.entries(languages).forEach(([lang, translations]) => {
    if (!translations.ingredients || !translations.ingredients[ingredientId]) {
      console.error(`  ❌ Missing ${lang.toUpperCase()} translation for: ${ingredientId}`)
      hasErrors = true
      missingCount++
    }
  })
})

// Check for extra translations (not in registry)
console.log('\n🔍 Checking for extra translations not in registry:\n')

Object.entries(languages).forEach(([lang, translations]) => {
  if (!translations.ingredients) {
    console.warn(`  ⚠️  ${lang.toUpperCase()} has no ingredients section`)
    return
  }
  
  Object.keys(translations.ingredients).forEach(translationKey => {
    // Skip category/subcategory keys
    if (translationKey === 'categories' || translationKey === 'subcategories' || translationKey === 'items') {
      return
    }
    
    if (!INGREDIENT_REGISTRY[translationKey]) {
      console.warn(`  ⚠️  ${lang.toUpperCase()} has translation for unknown ingredient: ${translationKey}`)
      extraCount++
    }
  })
})

// Summary
console.log('\n' + '='.repeat(60))
console.log('VALIDATION SUMMARY')
console.log('='.repeat(60))

if (hasErrors) {
  console.error(`\n❌ Found ${missingCount} missing translations`)
  console.error('\n🚨 VALIDATION FAILED - Fix missing translations before proceeding\n')
  process.exit(1)
} else {
  console.log('\n✅ All registry ingredients have translations in all languages!')
}

if (extraCount > 0) {
  console.warn(`\n⚠️  Found ${extraCount} extra translation keys (not critical)`)
  console.warn('    These can be removed to clean up translation files\n')
} else {
  console.log('✅ No extra translations found')
}

console.log('\n🎉 Translation validation PASSED!\n')
process.exit(0)

