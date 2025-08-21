<template>
  <component :is="'style'" v-if="dynamicCSS">
    {{ dynamicCSS }}
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '../stores/resume'

const resumeStore = useResumeStore()

// 使用响应式引用，不要解构赋值以保持响应性
const cssVariables = resumeStore.cssVariables
const currentThemeColors = resumeStore.currentThemeColors
const globalSettings = resumeStore.globalSettings

// 生成动态CSS
const dynamicCSS = computed(() => {
  // 确保所有数据都已初始化
  if (!currentThemeColors.value || !globalSettings.value) {
    return ''
  }

  const theme = currentThemeColors.value
  const typography = globalSettings.value.typography
  const spacing = globalSettings.value.spacing
  const layout = globalSettings.value.layout
  const decoration = globalSettings.value.decoration

  // 确保所有嵌套对象都存在
  if (!theme || !typography || !spacing || !layout || !decoration) {
    return ''
  }

  return `
    :root {
      /* 主题颜色变量 */
      --theme-primary: ${theme.primary};
      --theme-primary-light: ${theme.primaryLight};
      --theme-primary-dark: ${theme.primaryDark};
      --theme-secondary: ${theme.secondary};
      --theme-accent: ${theme.accent};
      --theme-text-primary: ${theme.textPrimary};
      --theme-text-secondary: ${theme.textSecondary};
      --theme-background: ${theme.background};
      --theme-background-secondary: ${theme.backgroundSecondary};
      --theme-border: ${theme.border};
      
      /* 字体变量 */
      --font-size-base: ${typography.baseFontSize}px;
      --font-size-title: ${typography.titleFontSize}px;
      --font-size-subtitle: ${typography.subtitleFontSize}px;
      --font-family: ${typography.fontFamily};
      --font-weight-light: ${typography.fontWeight.light};
      --font-weight-normal: ${typography.fontWeight.normal};
      --font-weight-medium: ${typography.fontWeight.medium};
      --font-weight-semibold: ${typography.fontWeight.semibold};
      --font-weight-bold: ${typography.fontWeight.bold};
      --letter-spacing: ${getLetterSpacing(typography.letterSpacing)};
      
      /* 间距变量 */
      --line-height: ${spacing.lineHeight};
      --spacing-page-margin-top: ${spacing.pageMargin.top}px;
      --spacing-page-margin-right: ${spacing.pageMargin.right}px;
      --spacing-page-margin-bottom: ${spacing.pageMargin.bottom}px;
      --spacing-page-margin-left: ${spacing.pageMargin.left}px;
      --spacing-module: ${spacing.moduleSpacing}px;
      --spacing-section: ${spacing.sectionSpacing}px;
      --spacing-item: ${spacing.itemSpacing}px;
      --spacing-paragraph: ${spacing.paragraphSpacing}px;
      
      /* 布局变量 */
      --text-align-global: ${layout.alignment.global};
      --text-align-headings: ${layout.alignment.headings};
      --text-align-content: ${layout.alignment.content};
      --text-align-contact: ${layout.alignment.contact};
      
      /* 装饰变量 */
      --border-width: ${decoration.borders.width}px;
      --border-style: ${decoration.borders.style};
      --border-radius: ${decoration.borders.radius}px;
      --border-color: ${decoration.borders.color === 'auto' ? theme.border : decoration.borders.color};
      --divider-thickness: ${decoration.dividers.thickness}px;
      --divider-color: ${decoration.dividers.color === 'auto' ? theme.border : decoration.dividers.color};
      --icon-size: ${decoration.icons.size}px;
      --icon-color: ${decoration.icons.color === 'auto' ? theme.primary : decoration.icons.color};
    }

    /* 应用主题样式到简历容器 */
    .resume-container {
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      line-height: var(--line-height);
      color: var(--theme-text-primary);
      background-color: var(--theme-background);
      padding: var(--spacing-page-margin-top) var(--spacing-page-margin-right) var(--spacing-page-margin-bottom) var(--spacing-page-margin-left);
    }

    /* 标题样式 */
    .resume-container h1,
    .resume-container .section-title {
      font-size: var(--font-size-title);
      font-weight: var(--font-weight-semibold);
      color: var(--theme-primary);
      text-align: var(--text-align-headings);
      margin-bottom: var(--spacing-section);
      letter-spacing: var(--letter-spacing);
    }

    .resume-container h2,
    .resume-container .subsection-title {
      font-size: var(--font-size-subtitle);
      font-weight: var(--font-weight-medium);
      color: var(--theme-text-primary);
      text-align: var(--text-align-headings);
      margin-bottom: var(--spacing-item);
    }

    /* 内容样式 */
    .resume-container p,
    .resume-container .content-text {
      color: var(--theme-text-primary);
      text-align: var(--text-align-content);
      margin-bottom: var(--spacing-paragraph);
      letter-spacing: var(--letter-spacing);
    }

    .resume-container .secondary-text {
      color: var(--theme-text-secondary);
      font-size: calc(var(--font-size-base) - 1px);
    }

    /* 模块间距 */
    .resume-container .resume-section {
      margin-bottom: var(--spacing-module);
    }

    .resume-container .section-content {
      margin-bottom: var(--spacing-section);
    }

    .resume-container .list-item {
      margin-bottom: var(--spacing-item);
    }

    /* 边框和分割线 */
    .resume-container .section-divider {
      border-bottom: var(--divider-thickness) solid var(--divider-color);
      margin: var(--spacing-section) 0;
    }

    .resume-container .bordered-section {
      border: var(--border-width) var(--border-style) var(--border-color);
      border-radius: var(--border-radius);
      padding: var(--spacing-section);
    }

    /* 图标样式 */
    .resume-container .section-icon {
      font-size: var(--icon-size);
      color: var(--icon-color);
    }

    /* 联系方式对齐 */
    .resume-container .contact-info {
      text-align: var(--text-align-contact);
    }

    /* 强调色应用 */
    .resume-container .accent-text {
      color: var(--theme-accent);
    }

    .resume-container .accent-bg {
      background-color: var(--theme-accent);
      color: var(--theme-background);
    }

    /* 次要背景 */
    .resume-container .secondary-bg {
      background-color: var(--theme-background-secondary);
    }

    /* 链接样式 */
    .resume-container a {
      color: var(--theme-primary);
      text-decoration: none;
    }

    .resume-container a:hover {
      color: var(--theme-primary-dark);
      text-decoration: underline;
    }

    /* 技能标签样式 */
    .resume-container .skill-tag {
      background-color: var(--theme-primary);
      color: var(--theme-background);
      padding: 4px 8px;
      border-radius: var(--border-radius);
      font-size: calc(var(--font-size-base) - 2px);
      margin: 2px;
      display: inline-block;
    }

    /* 多列布局 */
    ${layout.columns.enabled ? `
    .resume-container .columns-layout {
      column-count: ${layout.columns.count};
      column-gap: ${layout.columns.gap}px;
      column-fill: balance;
    }
    ` : ''}

    /* 装饰边框 */
    ${decoration.borders.enabled ? `
    .resume-container .decorated-border {
      border: var(--border-width) var(--border-style) var(--border-color);
      border-radius: var(--border-radius);
    }
    ` : ''}

    /* 分割线样式 */
    ${decoration.dividers.enabled ? `
    .resume-container .section-divider {
      border-bottom: var(--divider-thickness) solid var(--divider-color);
      margin: calc(var(--spacing-section) / 2) 0;
    }
    ` : ''}
  `
})

// 获取字间距值
const getLetterSpacing = (spacing) => {
  const spacingMap = {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em'
  }
  return spacingMap[spacing] || '0'
}
</script>

<style scoped>
/* 这个组件不需要scoped样式，因为它生成全局CSS */
</style>
