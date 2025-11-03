/**
 * 打印调试工具
 * 帮助开发者和用户诊断打印问题
 */

/**
 * 比较预览和打印样式的差异
 * @param {string} elementId - 元素ID
 */
export function comparePrintStyles(elementId) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('找不到元素:', elementId)
    return
  }

  const styles = window.getComputedStyle(element)
  
  console.group('🖨️ 打印样式诊断')
  console.log('元素ID:', elementId)
  console.log('---')
  
  // 关键样式属性
  const keyProperties = [
    'width',
    'height',
    'padding',
    'margin',
    'font-family',
    'font-size',
    'line-height',
    'letter-spacing',
    'word-spacing',
    'color',
    'background-color'
  ]
  
  console.table(
    keyProperties.reduce((acc, prop) => {
      acc[prop] = styles.getPropertyValue(prop)
      return acc
    }, {})
  )
  
  console.groupEnd()
}

/**
 * 生成打印样式报告
 */
export function generatePrintReport() {
  const report = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    printSupport: typeof window.print === 'function',
    cssMediaSupport: window.matchMedia('print').media === 'print'
  }
  
  console.group('📊 打印环境报告')
  console.table(report)
  console.groupEnd()
  
  return report
}

/**
 * 检查打印样式冲突
 */
export function checkPrintStyleConflicts() {
  const conflicts = []
  
  // 检查是否有其他打印样式表
  const styleSheets = Array.from(document.styleSheets)
  
  styleSheets.forEach((sheet, index) => {
    try {
      const rules = Array.from(sheet.cssRules || [])
      rules.forEach(rule => {
        if (rule.media && rule.media.mediaText.includes('print')) {
          conflicts.push({
            sheet: index,
            href: sheet.href || 'inline',
            rule: rule.cssText.substring(0, 100) + '...'
          })
        }
      })
    } catch {
      // 跨域样式表无法访问
    }
  })
  
  if (conflicts.length > 0) {
    console.group('⚠️ 检测到多个打印样式')
    console.table(conflicts)
    console.groupEnd()
  } else {
    console.log('✅ 没有发现样式冲突')
  }
  
  return conflicts
}

/**
 * 预览打印效果（不实际打印）
 */
export function previewPrintMode() {
  // 临时添加打印类
  document.body.classList.add('print-preview-simulation')
  
  // 添加模拟打印的样式
  const style = document.createElement('style')
  style.id = 'print-preview-style'
  style.textContent = `
    .print-preview-simulation {
      background: #f0f0f0 !important;
    }
    .print-preview-simulation .app-header,
    .print-preview-simulation .app-sidebar,
    .print-preview-simulation .navigation-panel,
    .print-preview-simulation .editor-panel,
    .print-preview-simulation .preview-header,
    .print-preview-simulation .action-buttons,
    .print-preview-simulation button {
      opacity: 0.3;
      pointer-events: none;
    }
    .print-preview-simulation .preview-panel {
      width: 100% !important;
      max-width: none !important;
    }
  `
  document.head.appendChild(style)
  
  console.log('🔍 打印预览模式已激活，按ESC退出')
  
  // ESC键退出预览
  const exitPreview = (e) => {
    if (e.key === 'Escape') {
      document.body.classList.remove('print-preview-simulation')
      const previewStyle = document.getElementById('print-preview-style')
      if (previewStyle) {
        previewStyle.remove()
      }
      document.removeEventListener('keydown', exitPreview)
      console.log('✅ 已退出打印预览模式')
    }
  }
  
  document.addEventListener('keydown', exitPreview)
}

/**
 * 导出样式到文件（用于调试）
 */
export function exportComputedStyles(elementId, filename = 'styles.json') {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('找不到元素:', elementId)
    return
  }

  const styles = window.getComputedStyle(element)
  const styleObj = {}
  
  for (let i = 0; i < styles.length; i++) {
    const prop = styles[i]
    styleObj[prop] = styles.getPropertyValue(prop)
  }
  
  const blob = new Blob([JSON.stringify(styleObj, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
  
  console.log('✅ 样式已导出到:', filename)
}

// 开发模式下自动启用调试
if (import.meta.env.DEV) {
  window.printDebug = {
    compare: comparePrintStyles,
    report: generatePrintReport,
    checkConflicts: checkPrintStyleConflicts,
    preview: previewPrintMode,
    exportStyles: exportComputedStyles
  }
  
  console.log('🔧 打印调试工具已加载，使用 window.printDebug 访问')
}
