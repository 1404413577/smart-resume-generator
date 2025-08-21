/**
 * 模板样式管理 Composable
 * 用于处理模板样式和全局设置的合并
 */

import { computed } from 'vue'
import { useResumeStore } from '@stores/resume'
import { getTemplate } from '@templates'
import { mergeTemplateStyles, generateCSSVariables } from '@utils/styles/styleUtils'

export function useTemplateStyles(templateId = null) {
  const resumeStore = useResumeStore()

  // 获取当前模板配置
  const currentTemplateConfig = computed(() => {
    const id = templateId || resumeStore.selectedTemplate
    return getTemplate(id)
  })

  // 合并后的样式
  const mergedStyles = computed(() => {
    if (!resumeStore.globalSettings) return {}

    const merged = mergeTemplateStyles(
      resumeStore.globalSettings,
      currentTemplateConfig.value
    )

    // 调试信息
    console.log('Template styles merged:', {
      templateId: templateId || resumeStore.selectedTemplate,
      templateColors: currentTemplateConfig.value?.colors,
      globalTheme: resumeStore.globalSettings.theme,
      mergedResult: merged
    })

    return merged
  })

  // 生成CSS变量对象
  const cssVariables = computed(() => {
    if (!resumeStore.globalSettings) return {}
    
    return generateCSSVariables(
      resumeStore.globalSettings,
      currentTemplateConfig.value
    )
  })

  // 生成内联样式字符串
  const inlineStyles = computed(() => {
    const variables = cssVariables.value
    return Object.entries(variables)
      .map(([property, value]) => `${property}: ${value}`)
      .join('; ')
  })

  // 获取特定颜色值
  const getColor = (colorKey) => {
    return mergedStyles.value[colorKey] || '#000000'
  }

  // 获取字体设置
  const getFontSize = (sizeKey) => {
    const typography = resumeStore.globalSettings?.typography
    if (!typography) return '14px'
    
    const sizeMap = {
      base: typography.baseFontSize,
      title: typography.titleFontSize,
      subtitle: typography.subtitleFontSize
    }
    
    return `${sizeMap[sizeKey] || typography.baseFontSize}px`
  }

  // 获取间距设置
  const getSpacing = (spacingKey) => {
    const spacing = resumeStore.globalSettings?.spacing
    if (!spacing) return '12px'
    
    const spacingMap = {
      module: spacing.moduleSpacing,
      line: spacing.lineHeight
    }
    
    return spacingMap[spacingKey] || spacing.moduleSpacing
  }

  return {
    currentTemplateConfig,
    mergedStyles,
    cssVariables,
    inlineStyles,
    getColor,
    getFontSize,
    getSpacing
  }
}

/**
 * 用于模板组件的样式钩子
 * 返回可直接用于模板的样式对象
 */
export function useTemplateComponentStyles(templateId = null) {
  const { cssVariables, mergedStyles } = useTemplateStyles(templateId)

  // 模板组件可直接使用的样式对象
  const templateStyles = computed(() => ({
    // 兼容旧的CSS变量命名
    '--primary-color': mergedStyles.value.primary,
    '--secondary-color': mergedStyles.value.secondary,
    '--accent-color': mergedStyles.value.accent,
    '--text-color': mergedStyles.value.text,
    '--background-color': mergedStyles.value.background,
    
    // 包含所有CSS变量
    ...cssVariables.value
  }))

  return {
    templateStyles,
    mergedStyles
  }
}
