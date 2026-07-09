#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { validateTemplateRegistrySources } from '../src/templates/validators/validateTemplateRegistry.js'

const registryPath = 'src/templates/index.js'
const categoriesPath = 'src/templates/templateCategories.js'
const variantsPath = 'src/templates/templateVariants.js'
const unifiedTemplatePath = 'src/templates/components/UnifiedResumeTemplate.vue'

const registrySource = fs.readFileSync(registryPath, 'utf8')
const categoriesSource = fs.readFileSync(categoriesPath, 'utf8')
const variantsSource = fs.readFileSync(variantsPath, 'utf8')
const unifiedTemplateSource = fs.readFileSync(unifiedTemplatePath, 'utf8')

const result = validateTemplateRegistrySources({
  registrySource,
  categoriesSource,
  variantsSource,
  unifiedTemplateSource,
  previewExists: (preview) => fs.existsSync(path.join('public', preview.replace(/^\//, '')))
})

for (const warning of result.warnings) {
  console.warn(`模板检查提示: ${warning}`)
}

if (!result.valid) {
  for (const error of result.errors) {
    console.error(`模板检查失败: ${error}`)
  }
  process.exit(1)
}

console.log(`模板检查通过: ${result.templateIds.length} 个模板，${result.categoryIds.length} 个分类`)
