/**
 * 浏览器原生打印功能
 * 使用浏览器自带的打印对话框，可以保存为PDF或直接打印
 */

/**
 * 调用浏览器打印对话框
 * @param {string} elementId - 要打印的元素ID（可选）
 * @param {Object} options - 打印选项
 */
export async function printResume(elementId = null, options = {}) {
  const {
    title = '简历'
  } = options

  try {
    // 保存原始标题
    const originalTitle = document.title
    document.title = title

    // 直接调用浏览器打印，不修改任何样式
    // 这样可以确保打印效果与预览完全一致
    window.print()

    // 打印对话框关闭后恢复标题
    window.addEventListener('afterprint', () => {
      document.title = originalTitle
    }, { once: true })

    return true
  } catch (error) {
    console.error('打印失败:', error)
    throw error
  }
}

/**
 * 打印指定元素（已废弃，保留向后兼容）
 * @param {string} elementId - 要打印的元素ID
 * @param {Object} options - 选项
 * @deprecated 直接使用 window.print() 以保持样式一致性
 */
// eslint-disable-next-line no-unused-vars
async function printElement(elementId, options = {}) {
  const {
    title = '简历',
    removeAfterPrint = true,
    addPrintStyles = true
  } = options

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`找不到ID为 ${elementId} 的元素`)
  }

  // 保存原始标题
  const originalTitle = document.title
  document.title = title

  // 克隆要打印的元素
  const printContainer = document.createElement('div')
  printContainer.className = 'print-container'
  const clonedElement = element.cloneNode(true)
  printContainer.appendChild(clonedElement)

  // 添加打印专用样式
  if (addPrintStyles) {
    const styleElement = createPrintStyles()
    printContainer.appendChild(styleElement)
  }

  // 隐藏页面其他内容
  const bodyChildren = Array.from(document.body.children)
  bodyChildren.forEach(child => {
    if (child !== printContainer) {
      child.style.display = 'none'
    }
  })

  // 将打印容器添加到body
  document.body.appendChild(printContainer)

  // 等待样式和图片加载
  await new Promise(resolve => setTimeout(resolve, 100))

  // 调用打印
  window.print()

  // 清理：恢复页面
  if (removeAfterPrint) {
    // 监听打印完成事件
    const cleanup = () => {
      document.body.removeChild(printContainer)
      bodyChildren.forEach(child => {
        child.style.display = ''
      })
      document.title = originalTitle
      window.removeEventListener('afterprint', cleanup)
    }

    window.addEventListener('afterprint', cleanup)
  }
}

/**
 * 创建打印专用CSS样式
 */
function createPrintStyles() {
  const style = document.createElement('style')
  style.textContent = `
    @media print {
      /* 重置打印样式 */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      /* 打印容器样式 */
      .print-container {
        width: 100% !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
      }

      /* 页面设置 */
      @page {
        size: A4;
        margin: 0;
      }

      /* 隐藏不需要打印的元素 */
      .no-print,
      .action-buttons,
      .app-header,
      .app-sidebar,
      button,
      .el-button {
        display: none !important;
      }

      /* 确保背景色和图片打印 */
      body {
        background: white !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* 不修改字体渲染，保持预览效果 */

      /* 避免内容被截断 */
      .resume-container,
      .template {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      /* 章节避免分页 */
      .section {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      /* 移除阴影和过渡效果 */
      * {
        box-shadow: none !important;
        transition: none !important;
        animation: none !important;
      }

      /* 确保链接显示 */
      a {
        text-decoration: none;
        color: inherit;
      }

      /* 多页支持 */
      .page {
        page-break-after: always;
        break-after: always;
        margin: 0 !important;
        box-shadow: none !important;
      }

      .page:last-child {
        page-break-after: auto;
        break-after: auto;
      }
    }

    /* 打印预览时的样式 */
    .print-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 9999;
      overflow: auto;
    }
  `
  return style
}

/**
 * 直接打印当前页面（简化版）
 */
export function printCurrentPage() {
  window.print()
}

/**
 * 打印预览（打开打印对话框）
 * @param {string} elementId - 要预览的元素ID
 */
export async function printPreview(elementId) {
  return await printResume(elementId, {
    title: '简历预览',
    removeAfterPrint: true,
    addPrintStyles: true
  })
}

/**
 * 检查浏览器是否支持打印
 */
export function isPrintSupported() {
  return typeof window !== 'undefined' && typeof window.print === 'function'
}

/**
 * 获取打印提示信息
 */
export function getPrintInstructions() {
  const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.platform)
  const shortcut = isMac ? 'Cmd + P' : 'Ctrl + P'
  
  return {
    shortcut,
    steps: [
      '点击"打印"按钮或使用快捷键 ' + shortcut,
      '在打印对话框中选择"另存为PDF"',
      '选择保存位置并命名文件',
      '点击"保存"完成PDF导出'
    ],
    tips: [
      '浏览器原生打印保留最佳字体和排版效果',
      '建议使用Chrome或Edge浏览器以获得最佳效果',
      '可以在打印预览中调整页边距和缩放比例'
    ]
  }
}
