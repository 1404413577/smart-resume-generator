/**
 * 设计系统配置
 * 定义颜色、字体、间距、断点等设计标准
 */

// ============ 颜色系统 ============
export const colors = {
  // 主色系
  primary: '#409EFF',
  primaryLight: '#66B1FF',
  primaryLighter: '#A0CFFF',
  primaryLightest: '#C6E2FF',
  primaryDark: '#0A66CC',

  // 辅助色
  success: '#67C23A',
  warning: '#E6A23C',
  error: '#F56C6C',
  info: '#909399',

  // 中性色
  white: '#FFFFFF',
  black: '#000000',
  
  // 灰度系
  gray100: '#F5F7FA',
  gray200: '#EBF0F5',
  gray300: '#DFE6E9',
  gray400: '#CED4DA',
  gray500: '#B8BFCC',
  gray600: '#909399',
  gray700: '#606266',
  gray800: '#303133',
  gray900: '#1F2329',

  // 文字颜色
  textPrimary: '#303133',
  textSecondary: '#606266',
  textDisabled: '#909399',
  textPlaceholder: '#C0C4CC',

  // 背景色
  bgBase: '#FFFFFF',
  bgLight: '#F5F7FA',
  bgLighter: '#EBF0F5',
}

// ============ 字体系统 ============
export const typography = {
  // 字体族
  fontFamily: {
    base: '"Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
    mono: '"Courier New", "Monaco", "monospace"',
  },

  // 字体大小
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },

  // 行高
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // 字体权重
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
}

// ============ 间距系统 ============
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
}

// ============ 圆角系统 ============
export const borderRadius = {
  none: '0',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
}

// ============ 阴影系统 ============
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
}

// ============ 响应式断点 ============
export const breakpoints = {
  xs: 320,    // 超小屏 (手机)
  sm: 576,    // 小屏 (平板竖屏)
  md: 768,    // 中屏 (平板、小笔记本)
  lg: 992,    // 大屏 (桌面)
  xl: 1200,   // 超大屏 (大桌面)
  '2xl': 1408, // 2K屏
}

// ============ 媒体查询 ============
export const mediaQueries = {
  xs: `@media (max-width: ${breakpoints.xs - 1}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
  // 手机优先
  'phone': `@media (max-width: ${breakpoints.sm - 1}px)`,
  'tablet': `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  'desktop': `@media (min-width: ${breakpoints.lg}px)`,
}

// ============ 过渡 ============
export const transitions = {
  fast: '150ms ease-in-out',
  base: '250ms ease-in-out',
  slow: '350ms ease-in-out',
}

// ============ Z-index 层级 ============
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 2000,
}
