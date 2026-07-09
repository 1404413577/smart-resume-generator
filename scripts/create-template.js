#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { validateTemplateRegistrySources } from '../src/templates/validators/validateTemplateRegistry.js'

const registryPath = 'src/templates/index.js'
const categoriesPath = 'src/templates/templateCategories.js'
const variantsPath = 'src/templates/templateVariants.js'
const componentsDir = 'src/templates/components'

const helpText = `
用法:
  node scripts/create-template.js --id template-id --name 模板名 --category professional --suitable-for 前端,产品,运营

可选参数:
  --description    模板描述，默认生成克制描述
  --features       逗号分隔，默认使用统一模板能力
  --suitable-for   逗号分隔，至少 3 项
  --layout         默认使用 template id
  --density        compact | normal | loose，默认 normal
  --accent         line | panel | block | band，默认 line
  --preview        预览路径，默认 /images/templates/{id}-preview.png
  --dry-run        只检查并展示将要写入的配置，不修改文件
`

function parseArgs(argv) {
  const args = {}

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) continue

    const key = token.slice(2)
    if (key === 'dry-run' || key === 'help') {
      args[key] = true
      continue
    }

    args[key] = argv[index + 1] || ''
    index += 1
  }

  return args
}

function fail(message) {
  console.error(`创建模板失败: ${message}`)
  process.exit(1)
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8')
}

function readCategoryIds(source) {
  const match = source.match(/export const templateCategories = \{([\s\S]*?)\n\}/)
  if (!match) return []
  return [...match[1].matchAll(/^\s*([a-zA-Z][\w-]*):\s*'[^']+'/gm)].map(item => item[1])
}

function readTemplateIds(source) {
  const match = source.match(/export const templateRegistry = \{([\s\S]*?)\n\}/)
  if (!match) return []
  return [...match[1].matchAll(/^\s*'?([a-zA-Z][\w-]*)'?:\s*\{/gm)].map(item => item[1])
}

function toList(value, fallback) {
  const items = String(value || '')
    .split(/[,，、]/)
    .map(item => item.trim())
    .filter(Boolean)

  return items.length ? items : fallback
}

function toQuotedArray(items) {
  return `[${items.map(item => `'${item.replace(/'/g, "\\'")}'`).join(', ')}]`
}

function toPascalCase(value) {
  return String(value)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(item => item.charAt(0).toUpperCase() + item.slice(1))
    .join('')
}

function insertBeforeObjectClose(source, marker, block) {
  const start = source.indexOf(marker)
  if (start === -1) fail(`未找到 ${marker}`)

  const openIndex = source.indexOf('{', start)
  let depth = 0

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]
    if (char === '{') depth += 1
    if (char === '}') depth -= 1
    if (depth === 0) {
      return `${source.slice(0, index).trimEnd()},\n${block}\n${source.slice(index)}`
    }
  }

  fail(`无法定位 ${marker} 结束位置`)
}

function insertImport(source, componentName, componentFileName) {
  const exportMarker = "export { templateCategories } from './templateCategories'"
  if (!source.includes(exportMarker)) fail('未找到 templateCategories export 位置')
  return source.replace(
    exportMarker,
    `import ${componentName} from './components/${componentFileName}'\n${exportMarker}`
  )
}

function buildComponentSource(componentName, id) {
  return `<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-${id}"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: '${id}' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-${id} .section-title) {
  padding-bottom: 5px;
  border-bottom: 1px solid var(--tpl-border);
}
</style>
`
}

function validateSources(registrySource, categoriesSource, variantsSource) {
  const result = validateTemplateRegistrySources({
    registrySource,
    categoriesSource,
    variantsSource,
    unifiedTemplateSource: '',
    previewExists: (preview) => fs.existsSync(path.join('public', preview.replace(/^\//, '')))
  })

  if (!result.valid) {
    result.errors.forEach(error => console.error(`模板检查失败: ${error}`))
    process.exit(1)
  }
}

const args = parseArgs(process.argv.slice(2))

if (args.help) {
  console.log(helpText.trim())
  process.exit(0)
}

const id = args.id || ''
const name = args.name || ''
const category = args.category || ''
const description = args.description || `${name}模板，适合稳定清晰的简历阅读`
const preview = args.preview || `/images/templates/${id}-preview.png`
const layout = args.layout || id
const density = args.density || 'normal'
const accent = args.accent || 'line'
const features = toList(args.features, ['统一实时预览', '头像位置可控', '章节排序可控'])
const suitableFor = toList(args['suitable-for'], [])

if (!/^[a-z][a-zA-Z0-9]*(?:-[a-zA-Z0-9]+)*$/.test(id)) {
  fail('必须提供合法 --id，只能使用英文、数字、驼峰或短横线')
}
if (name.length < 2 || name.length > 8) fail('--name 必须是 2 到 8 个字符')
if (description.length < 1 || description.length > 36) fail('--description 必须是 1 到 36 个字符')
if (!['compact', 'normal', 'loose'].includes(density)) fail('--density 只能是 compact、normal 或 loose')
if (features.length < 3 || features.length > 5) fail('--features 需要 3 到 5 项')
if (suitableFor.length < 3 || suitableFor.length > 5) fail('--suitable-for 需要 3 到 5 项')

const registrySource = readFile(registryPath)
const categoriesSource = readFile(categoriesPath)
const variantsSource = readFile(variantsPath)
const categoryIds = readCategoryIds(categoriesSource)
const templateIds = readTemplateIds(registrySource)
const componentBaseName = `${toPascalCase(id)}Template`
const componentFileName = `${componentBaseName}.vue`
const componentPath = path.join(componentsDir, componentFileName)

if (templateIds.includes(id)) fail(`模板 ID 已存在: ${id}`)
if (!categoryIds.includes(category)) fail(`category 必须来自 templateCategories: ${categoryIds.join(', ')}`)
if (fs.existsSync(componentPath)) fail(`模板组件已存在: ${componentPath}`)

const registryBlock = `  '${id}': {
    name: '${name}',
    component: templates['${id}'],
    description: '${description.replace(/'/g, "\\'")}',
    category: '${category}',
    preview: '${preview}',
    features: ${toQuotedArray(features)},
    suitableFor: ${toQuotedArray(suitableFor)}
  }`

const variantBlock = `  '${id}': { layout: '${layout}', density: '${density}', accent: '${accent}' }`
const templateMapBlock = `  '${id}': markRaw(${componentBaseName})`
const componentSource = buildComponentSource(componentBaseName, id)

let nextRegistrySource = insertImport(registrySource, componentBaseName, componentFileName)
nextRegistrySource = insertBeforeObjectClose(nextRegistrySource, 'const templates = {', templateMapBlock)
nextRegistrySource = insertBeforeObjectClose(nextRegistrySource, 'export const templateRegistry = {', registryBlock)
const nextVariantsSource = insertBeforeObjectClose(variantsSource, 'export const templateVariants = {', variantBlock)

validateSources(nextRegistrySource, categoriesSource, nextVariantsSource)

if (args['dry-run']) {
  console.log('dry-run: 将新增组件:')
  console.log(componentPath)
  console.log('dry-run: 将追加 templateRegistry 配置:')
  console.log(registryBlock)
  console.log('dry-run: 将追加 templateVariants 配置:')
  console.log(variantBlock)
  process.exit(0)
}

writeFile(componentPath, componentSource)
writeFile(registryPath, nextRegistrySource)
writeFile(variantsPath, nextVariantsSource)
console.log(`已创建模板配置: ${id}`)
