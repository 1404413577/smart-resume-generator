/**
 * 样式工具函数 - 用于应用全局设置到简历模板
 */

/**
 * 合并模板样式和全局设置
 * @param {Object} globalSettings - 全局设置对象
 * @param {Object} templateConfig - 模板配置对象
 * @returns {Object} 合并后的样式对象
 */
export function mergeTemplateStyles(globalSettings, templateConfig = null) {
  // 默认样式
  const defaultStyles = {
    primary: '#409eff',
    secondary: '#67c23a',
    accent: '#e6a23c',
    text: '#303133',
    background: '#ffffff'
  }

  // 模板默认样式
  const templateStyles = templateConfig?.colors || {}

  // 用户自定义样式（优先级最高）
  const userStyles = globalSettings?.theme || {}

  // 合并样式，用户自定义 > 模板默认 > 系统默认
  const mergedColors = {
    ...defaultStyles,
    ...templateStyles,
    ...userStyles
  }

  return mergedColors
}

/**
 * 生成CSS变量对象
 * @param {Object} globalSettings - 全局设置对象
 * @param {Object} templateConfig - 模板配置对象（可选）
 * @returns {Object} CSS变量对象
 */
export function generateCSSVariables(globalSettings, templateConfig = null) {
  const { typography, spacing, pageSettings } = globalSettings

  // 合并颜色样式
  const mergedColors = mergeTemplateStyles(globalSettings, templateConfig)

  return {
    // 颜色相关变量（统一命名，兼容模板和全局系统）
    '--primary-color': mergedColors.primary,
    '--secondary-color': mergedColors.secondary,
    '--accent-color': mergedColors.accent,
    '--text-color': mergedColors.text,
    '--background-color': mergedColors.background,

    // 字体相关变量
    '--resume-base-font-size': `${typography.baseFontSize}px`,
    '--resume-title-font-size': `${typography.titleFontSize}px`,
    '--resume-subtitle-font-size': `${typography.subtitleFontSize}px`,
    '--resume-font-family': typography.fontFamily,

    // 扩展字体大小变量
    '--resume-name-font-size': `${Math.round(typography.baseFontSize * 2.5)}px`, // 姓名字体
    '--resume-contact-font-size': `${Math.round(typography.baseFontSize * 0.85)}px`, // 联系信息字体
    '--resume-link-font-size': `${Math.round(typography.baseFontSize * 0.75)}px`, // 链接字体
    '--resume-content-font-size': `${Math.round(typography.baseFontSize * 0.95)}px`, // 内容字体
    '--resume-meta-font-size': `${Math.round(typography.baseFontSize * 0.8)}px`, // 元信息字体
    '--resume-small-font-size': `${Math.round(typography.baseFontSize * 0.7)}px`, // 小字体
    '--resume-skill-font-size': `${Math.round(typography.baseFontSize * 0.75)}px`, // 技能标签字体

    // 间距相关变量
    '--resume-page-margin-top': `${spacing.pageMargin.top}mm`,
    '--resume-page-margin-right': `${spacing.pageMargin.right}mm`,
    '--resume-page-margin-bottom': `${spacing.pageMargin.bottom}mm`,
    '--resume-page-margin-left': `${spacing.pageMargin.left}mm`,
    '--resume-module-spacing': `${spacing.moduleSpacing}mm`,
    '--resume-line-height': spacing.lineHeight,

    // 页面相关变量
    '--resume-page-count': pageSettings.pageCount,
    '--resume-page-height': '297mm',
    '--resume-page-width': '210mm',
    '--resume-single-page-height': `calc(297mm - ${spacing.pageMargin.top}mm - ${spacing.pageMargin.bottom}mm)`,
    '--resume-multi-page-height': `calc(${pageSettings.pageCount} * 297mm - ${spacing.pageMargin.top}mm - ${spacing.pageMargin.bottom}mm)`,

    // 计算得出的变量
    '--resume-page-margin': `${spacing.pageMargin.top}mm ${spacing.pageMargin.right}mm ${spacing.pageMargin.bottom}mm ${spacing.pageMargin.left}mm`,
    '--resume-content-width': `calc(210mm - ${spacing.pageMargin.left}mm - ${spacing.pageMargin.right}mm)`,
    '--resume-content-height': `calc(297mm - ${spacing.pageMargin.top}mm - ${spacing.pageMargin.bottom}mm)`
  }
}

/**
 * 应用CSS变量到指定元素
 * @param {HTMLElement} element - 目标元素
 * @param {Object} globalSettings - 全局设置对象
 * @param {Object} templateConfig - 模板配置对象（可选）
 */
export function applyCSSVariables(element, globalSettings, templateConfig = null) {
  if (!element || !globalSettings) return

  const variables = generateCSSVariables(globalSettings, templateConfig)

  Object.entries(variables).forEach(([property, value]) => {
    element.style.setProperty(property, value)
  })
}

/**
 * 移除CSS变量
 * @param {HTMLElement} element - 目标元素
 */
export function removeCSSVariables(element) {
  if (!element) return
  
  const variableNames = [
    '--resume-base-font-size',
    '--resume-title-font-size',
    '--resume-subtitle-font-size',
    '--resume-font-family',
    '--resume-name-font-size',
    '--resume-contact-font-size',
    '--resume-link-font-size',
    '--resume-content-font-size',
    '--resume-meta-font-size',
    '--resume-small-font-size',
    '--resume-skill-font-size',
    '--resume-page-margin-top',
    '--resume-page-margin-right',
    '--resume-page-margin-bottom',
    '--resume-page-margin-left',
    '--resume-module-spacing',
    '--resume-line-height',
    '--resume-page-margin',
    '--resume-content-width',
    '--resume-content-height'
  ]
  
  variableNames.forEach(name => {
    element.style.removeProperty(name)
  })
}

/**
 * 生成内联样式字符串
 * @param {Object} globalSettings - 全局设置对象
 * @param {Object} templateConfig - 模板配置对象（可选）
 * @returns {string} 内联样式字符串
 */
export function generateInlineStyles(globalSettings, templateConfig = null) {
  const variables = generateCSSVariables(globalSettings, templateConfig)

  return Object.entries(variables)
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ')
}

/**
 * 字体族映射
 */
export const fontFamilyMap = {
  'system-ui': 'system-ui, -apple-system, sans-serif',
  "'Source Han Sans SC', sans-serif": "'Source Han Sans SC', 'Noto Sans CJK SC', sans-serif",
  "'Microsoft YaHei', sans-serif": "'Microsoft YaHei', 'SimHei', sans-serif",
  "'PingFang SC', sans-serif": "'PingFang SC', 'Hiragino Sans GB', sans-serif",
  'SimSun, serif': 'SimSun, "NSimSun", serif',
  "'Times New Roman', serif": "'Times New Roman', 'Times', serif",
  'Arial, sans-serif': 'Arial, "Helvetica Neue", sans-serif'
}

/**
 * 获取完整的字体族声明
 * @param {string} fontFamily - 字体族值
 * @returns {string} 完整的字体族声明
 */
export function getFullFontFamily(fontFamily) {
  return fontFamilyMap[fontFamily] || fontFamily
}

/**
 * 验证设置值的有效性
 * @param {Object} settings - 设置对象
 * @returns {Object} 验证后的设置对象
 */
export function validateSettings(settings) {
  
  // 验证字体大小范围
  const typography = {
    baseFontSize: Math.max(12, Math.min(16, settings.typography?.baseFontSize || 14)),
    titleFontSize: Math.max(16, Math.min(24, settings.typography?.titleFontSize || 18)),
    subtitleFontSize: Math.max(14, Math.min(20, settings.typography?.subtitleFontSize || 16)),
    fontFamily: settings.typography?.fontFamily || 'system-ui'
  }
  
  // 验证间距范围
  const spacing = {
    pageMargin: {
      top: Math.max(10, Math.min(30, settings.spacing?.pageMargin?.top || 20)),
      right: Math.max(10, Math.min(30, settings.spacing?.pageMargin?.right || 20)),
      bottom: Math.max(10, Math.min(30, settings.spacing?.pageMargin?.bottom || 20)),
      left: Math.max(10, Math.min(30, settings.spacing?.pageMargin?.left || 20))
    },
    moduleSpacing: Math.max(5, Math.min(20, settings.spacing?.moduleSpacing || 12)),
    lineHeight: Math.max(1.0, Math.min(2.0, settings.spacing?.lineHeight || 1.5))
  }
  
  return {
    ...settings,
    typography,
    spacing
  }
}

/**
 * 生成打印样式
 * @param {Object} globalSettings - 全局设置对象
 * @returns {string} 打印样式CSS字符串
 */
export function generatePrintStyles(globalSettings) {
  const variables = generateCSSVariables(globalSettings)
  const { pageSettings } = globalSettings

  return `
    @media print {
      @page {
        size: A4;
        margin: ${variables['--resume-page-margin']};
      }

      .resume-preview {
        font-family: ${variables['--resume-font-family']};
        font-size: ${variables['--resume-base-font-size']};
        line-height: ${variables['--resume-line-height']};
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
        width: 210mm !important;
        max-width: 210mm !important;
      }

      .resume-section {
        margin-bottom: ${variables['--resume-module-spacing']};
        page-break-inside: avoid;
      }

      .resume-section-title {
        font-size: ${variables['--resume-title-font-size']};
        page-break-after: avoid;
      }

      .resume-item-title {
        font-size: ${variables['--resume-subtitle-font-size']};
      }

      /* 分页控制 */
      .page-break-before {
        page-break-before: always !important;
        break-before: page !important;
      }

      .avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* 隐藏页码指示器 */
      .page-numbers {
        display: none !important;
      }

      /* 单页模式：限制高度 */
      ${pageSettings.pageCount === 1 ? `
      .modern-template,
      .classic-template,
      .minimal-template {
        height: calc(297mm - ${variables['--resume-page-margin-top']} - ${variables['--resume-page-margin-bottom']}) !important;
        overflow: hidden !important;
      }
      ` : ''}

      /* 多页模式：确保分页 */
      ${pageSettings.pageCount > 1 ? `
      .modern-template.multi-page,
      .classic-template.multi-page,
      .minimal-template.multi-page {
        height: auto !important;
        min-height: calc(297mm - ${variables['--resume-page-margin-top']} - ${variables['--resume-page-margin-bottom']}) !important;
      }
      ` : ''}
    }
  `
}
