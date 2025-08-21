/**
 * 随机简历风格生成器
 * 用于生成随机的模板样式、配色方案和布局配置
 */

// 预定义的配色方案
export const colorSchemes = {
  professional: [
    {
      name: '商务蓝',
      primary: '#2c3e50',
      secondary: '#3498db',
      accent: '#e74c3c',
      text: '#2c3e50',
      background: '#ffffff'
    },
    {
      name: '深海蓝',
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      accent: '#f59e0b',
      text: '#1f2937',
      background: '#ffffff'
    },
    {
      name: '墨绿色',
      primary: '#065f46',
      secondary: '#10b981',
      accent: '#f97316',
      text: '#1f2937',
      background: '#ffffff'
    }
  ],
  creative: [
    {
      name: '活力橙',
      primary: '#ea580c',
      secondary: '#f97316',
      accent: '#8b5cf6',
      text: '#1f2937',
      background: '#ffffff'
    },
    {
      name: '紫色梦幻',
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#ec4899',
      text: '#1f2937',
      background: '#ffffff'
    },
    {
      name: '青春粉',
      primary: '#be185d',
      secondary: '#ec4899',
      accent: '#06b6d4',
      text: '#1f2937',
      background: '#ffffff'
    }
  ],
  minimal: [
    {
      name: '极简黑',
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#ffffff'
    },
    {
      name: '温暖灰',
      primary: '#374151',
      secondary: '#9ca3af',
      accent: '#f59e0b',
      text: '#374151',
      background: '#ffffff'
    },
    {
      name: '冷调灰',
      primary: '#475569',
      secondary: '#94a3b8',
      accent: '#06b6d4',
      text: '#475569',
      background: '#ffffff'
    }
  ],
  modern: [
    {
      name: '科技蓝',
      primary: '#0ea5e9',
      secondary: '#38bdf8',
      accent: '#22c55e',
      text: '#0f172a',
      background: '#ffffff'
    },
    {
      name: '未来绿',
      primary: '#059669',
      secondary: '#10b981',
      accent: '#3b82f6',
      text: '#064e3b',
      background: '#ffffff'
    },
    {
      name: '电子紫',
      primary: '#7c2d12',
      secondary: '#dc2626',
      accent: '#8b5cf6',
      text: '#1f2937',
      background: '#ffffff'
    }
  ]
}

// 字体配置
export const fontConfigurations = [
  {
    name: '现代无衬线',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    baseFontSize: 14,
    titleFontSize: 20,
    subtitleFontSize: 16
  },
  {
    name: '经典衬线',
    fontFamily: 'Georgia, Times New Roman, serif',
    baseFontSize: 14,
    titleFontSize: 18,
    subtitleFontSize: 16
  },
  {
    name: '简洁系统',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    baseFontSize: 13,
    titleFontSize: 19,
    subtitleFontSize: 15
  },
  {
    name: '优雅字体',
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    baseFontSize: 14,
    titleFontSize: 20,
    subtitleFontSize: 17
  }
]

// 间距配置
export const spacingConfigurations = [
  {
    name: '紧凑',
    moduleSpacing: 16,
    lineHeight: 1.4,
    pageMargin: { top: 15, right: 15, bottom: 15, left: 15 }
  },
  {
    name: '标准',
    moduleSpacing: 20,
    lineHeight: 1.6,
    pageMargin: { top: 20, right: 20, bottom: 20, left: 20 }
  },
  {
    name: '宽松',
    moduleSpacing: 24,
    lineHeight: 1.8,
    pageMargin: { top: 25, right: 25, bottom: 25, left: 25 }
  }
]

// 布局配置
export const layoutConfigurations = [
  {
    name: '左右分栏',
    type: 'sidebar',
    sidebarWidth: 35,
    alignment: 'left'
  },
  {
    name: '单栏布局',
    type: 'single',
    alignment: 'center'
  },
  {
    name: '顶部标题',
    type: 'header',
    headerHeight: 25,
    alignment: 'center'
  }
]

/**
 * 根据职业类型获取合适的配色方案类别
 * @param {string} career - 职业类型
 * @returns {string} 配色方案类别
 */
export function getColorSchemeCategory(career) {
  const categoryMap = {
    'software-engineer': 'modern',
    'product-manager': 'professional',
    'ui-designer': 'creative',
    'marketing-specialist': 'creative',
    'data-analyst': 'modern',
    'default': 'professional'
  }
  
  return categoryMap[career] || categoryMap.default
}

/**
 * 生成随机风格配置
 * @param {string} career - 职业类型（可选）
 * @returns {Object} 随机生成的风格配置
 */
export function generateRandomStyle(career = null) {
  // 根据职业选择合适的配色方案类别
  const colorCategory = career ? getColorSchemeCategory(career) : 'professional'
  const availableColors = colorSchemes[colorCategory] || colorSchemes.professional
  
  // 随机选择配色方案
  const randomColorScheme = availableColors[Math.floor(Math.random() * availableColors.length)]
  
  // 随机选择字体配置
  const randomFont = fontConfigurations[Math.floor(Math.random() * fontConfigurations.length)]
  
  // 随机选择间距配置
  const randomSpacing = spacingConfigurations[Math.floor(Math.random() * spacingConfigurations.length)]
  
  // 随机选择布局配置
  const randomLayout = layoutConfigurations[Math.floor(Math.random() * layoutConfigurations.length)]
  
  return {
    id: `random-${Date.now()}`,
    name: `随机风格 - ${randomColorScheme.name}`,
    category: colorCategory,
    colors: randomColorScheme,
    typography: randomFont,
    spacing: randomSpacing,
    layout: randomLayout,
    isRandom: true,
    timestamp: Date.now()
  }
}

/**
 * 生成多个随机风格选项
 * @param {number} count - 生成数量
 * @param {string} career - 职业类型（可选）
 * @returns {Array} 随机风格配置数组
 */
export function generateMultipleRandomStyles(count = 3, career = null) {
  const styles = []
  const usedCombinations = new Set()
  
  while (styles.length < count && usedCombinations.size < 50) {
    const style = generateRandomStyle(career)
    const combination = `${style.colors.name}-${style.typography.name}-${style.spacing.name}`
    
    if (!usedCombinations.has(combination)) {
      usedCombinations.add(combination)
      styles.push(style)
    }
  }
  
  return styles
}

/**
 * 将随机风格配置转换为全局设置格式
 * @param {Object} randomStyle - 随机风格配置
 * @returns {Object} 全局设置格式的配置
 */
export function convertToGlobalSettings(randomStyle) {
  return {
    theme: {
      primary: randomStyle.colors.primary,
      primaryLight: lightenColor(randomStyle.colors.primary, 20),
      primaryDark: darkenColor(randomStyle.colors.primary, 20),
      secondary: randomStyle.colors.secondary,
      accent: randomStyle.colors.accent,
      textPrimary: randomStyle.colors.text,
      textSecondary: darkenColor(randomStyle.colors.text, 30),
      textPlaceholder: lightenColor(randomStyle.colors.text, 50),
      background: randomStyle.colors.background,
      backgroundSecondary: '#f5f7fa',
      border: '#dcdfe6',
      preset: 'custom'
    },
    typography: randomStyle.typography,
    spacing: randomStyle.spacing,
    layout: randomStyle.layout
  }
}

/**
 * 颜色加亮函数
 * @param {string} color - 十六进制颜色值
 * @param {number} percent - 加亮百分比
 * @returns {string} 加亮后的颜色值
 */
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

/**
 * 颜色加深函数
 * @param {string} color - 十六进制颜色值
 * @param {number} percent - 加深百分比
 * @returns {string} 加深后的颜色值
 */
function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) - amt
  const G = (num >> 8 & 0x00FF) - amt
  const B = (num & 0x0000FF) - amt
  return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
    (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1)
}
