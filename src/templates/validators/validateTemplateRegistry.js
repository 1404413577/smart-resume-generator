const readKeys = (source) => {
  return [...source.matchAll(/^\s*'?([a-zA-Z][\w-]*)'?:\s*\{/gm)].map(match => match[1])
}

const readObjectBlock = (source, key) => {
  const keyMatch = source.match(new RegExp(`\\n\\s*'?${key}'?:\\s*\\{`))
  if (!keyMatch || keyMatch.index === undefined) return ''

  const openIndex = source.indexOf('{', keyMatch.index)
  let depth = 0

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]
    if (char === '{') depth += 1
    if (char === '}') depth -= 1
    if (depth === 0) {
      return source.slice(openIndex + 1, index)
    }
  }

  return ''
}

const readStringProp = (source, field) => {
  return source.match(new RegExp(`${field}:\\s*'([^']*)'`))?.[1] || ''
}

const readArrayProp = (source, field) => {
  const match = source.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`))
  if (!match) return []
  return [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1])
}

const allowedIdPattern = /^[a-z][a-zA-Z0-9]*(?:-[a-zA-Z0-9]+)*$/
const allowedDensities = new Set(['compact', 'normal', 'loose'])

export function validateTemplateRegistrySources({
  registrySource,
  categoriesSource,
  variantsSource,
  unifiedTemplateSource,
  previewExists = () => true
}) {
  const errors = []
  const warnings = []

  const registryMatch = registrySource.match(/export const templateRegistry = \{([\s\S]*?)\n\}/)
  const categoriesMatch = categoriesSource.match(/export const templateCategories = \{([\s\S]*?)\n\}/)
  const variantsMatch = variantsSource.match(/export const templateVariants = \{([\s\S]*?)\n\}/)

  if (!registryMatch) errors.push('未找到 templateRegistry')
  if (!categoriesMatch) errors.push('未找到 templateCategories')
  if (!variantsMatch) errors.push('未找到 templateVariants')
  if (errors.length) {
    return { valid: false, errors, warnings, templateIds: [], categoryIds: [] }
  }

  const templateIds = readKeys(registryMatch[1])
  const categoryIds = [...categoriesMatch[1].matchAll(/^\s*([a-zA-Z][\w-]*):\s*'[^']+'/gm)].map(match => match[1])
  const variantIds = readKeys(variantsMatch[1])
  const allowedCategories = new Set(categoryIds)
  const unifiedTemplateIds = templateIds.filter((id) => {
    const block = readObjectBlock(registrySource, id)
    return block.includes('component: UnifiedTemplate')
  })

  if (new Set(templateIds).size !== templateIds.length) {
    errors.push('templateRegistry 存在重复模板 ID')
  }

  if (new Set(categoryIds).size !== categoryIds.length) {
    errors.push('templateCategories 存在重复分类 ID')
  }

  for (const id of templateIds) {
    if (!allowedIdPattern.test(id)) {
      errors.push(`${id} 模板 ID 必须使用英文、数字、驼峰或短横线`)
    }
  }

  for (const id of templateIds) {
    const block = readObjectBlock(registrySource, id)
    if (!block) {
      errors.push(`无法读取模板配置: ${id}`)
      continue
    }

    const name = readStringProp(block, 'name')
    const description = readStringProp(block, 'description')
    const category = readStringProp(block, 'category')
    const preview = readStringProp(block, 'preview')
    const features = readArrayProp(block, 'features')
    const suitableFor = readArrayProp(block, 'suitableFor')

    for (const field of ['name', 'component', 'description', 'preview', 'features', 'suitableFor']) {
      if (!block.includes(`${field}:`)) errors.push(`${id} 缺少 ${field}`)
    }

    if (name.length < 2 || name.length > 8) errors.push(`${id} name 应为 2 到 8 个字符`)
    if (description.length === 0 || description.length > 36) errors.push(`${id} description 应为 1 到 36 个字符`)
    if (!category) errors.push(`${id} 缺少 category`)
    if (category && !allowedCategories.has(category)) errors.push(`${id} 的 category 未出现在 templateCategories: ${category}`)

    if (features.length < 3 || features.length > 5) errors.push(`${id} features 需要 3 到 5 项`)
    if (suitableFor.length < 3 || suitableFor.length > 5) errors.push(`${id} suitableFor 需要 3 到 5 项`)
    if (!preview) {
      errors.push(`${id} 缺少 preview 路径`)
    } else if (!previewExists(preview)) {
      warnings.push(`${id} 的 preview 图片不存在，将依赖组件实时缩略图: ${preview}`)
    }
  }

  for (const id of unifiedTemplateIds) {
    if (!variantIds.includes(id)) errors.push(`${id} 使用 UnifiedTemplate 但缺少 templateVariants 配置`)
  }

  for (const id of variantIds) {
    if (!templateIds.includes(id)) {
      errors.push(`templateVariants 包含未注册模板 ID: ${id}`)
      continue
    }

    const block = readObjectBlock(variantsSource, id)
    const layout = readStringProp(block, 'layout')
    const density = readStringProp(block, 'density')
    const accent = readStringProp(block, 'accent')

    if (!layout) errors.push(`${id} variant 缺少 layout`)
    if (!density) errors.push(`${id} variant 缺少 density`)
    if (!accent) errors.push(`${id} variant 缺少 accent`)
    if (density && !allowedDensities.has(density)) errors.push(`${id} variant 使用了非法 density: ${density}`)
    if (unifiedTemplateIds.includes(id) && layout && !unifiedTemplateSource.includes(`.layout-${layout}`)) {
      errors.push(`${id} variant layout-${layout} 缺少 UnifiedResumeTemplate 样式`)
    }
    if (unifiedTemplateIds.includes(id) && accent && !unifiedTemplateSource.includes(`.accent-${accent}`)) {
      errors.push(`${id} variant accent-${accent} 缺少 UnifiedResumeTemplate 样式`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    templateIds,
    categoryIds
  }
}
