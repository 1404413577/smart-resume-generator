/**
 * 分页工具函数
 */

/**
 * 计算A4页面的实际高度（考虑页边距）
 * @param {Object} pageMargin - 页边距设置
 * @returns {number} 页面内容高度（mm）
 */
export function calculatePageContentHeight(pageMargin) {
  const A4_HEIGHT = 297 // A4纸高度（mm）
  return A4_HEIGHT - pageMargin.top - pageMargin.bottom
}

/**
 * 计算A4页面的实际宽度（考虑页边距）
 * @param {Object} pageMargin - 页边距设置
 * @returns {number} 页面内容宽度（mm）
 */
export function calculatePageContentWidth(pageMargin) {
  const A4_WIDTH = 210 // A4纸宽度（mm）
  return A4_WIDTH - pageMargin.left - pageMargin.right
}

/**
 * 根据页数设置计算总高度
 * @param {number} pageCount - 页数
 * @param {Object} pageMargin - 页边距设置
 * @returns {number} 总高度（mm）
 */
export function calculateTotalHeight(pageCount, pageMargin) {
  const singlePageHeight = calculatePageContentHeight(pageMargin)
  return singlePageHeight * pageCount
}

/**
 * 生成分页点数组
 * @param {number} pageCount - 页数
 * @param {Object} pageMargin - 页边距设置
 * @returns {Array} 分页点数组（mm）
 */
export function generatePageBreaks(pageCount, pageMargin) {
  if (pageCount <= 1) return []
  
  const pageHeight = calculatePageContentHeight(pageMargin)
  const breaks = []
  
  for (let i = 1; i < pageCount; i++) {
    breaks.push(pageHeight * i)
  }
  
  return breaks
}

/**
 * 判断元素是否应该避免分页
 * @param {HTMLElement} element - DOM元素
 * @returns {boolean} 是否应该避免分页
 */
export function shouldAvoidPageBreak(element) {
  if (!element) return false
  
  const computedStyle = window.getComputedStyle(element)
  return computedStyle.pageBreakInside === 'avoid' || 
         computedStyle.breakInside === 'avoid' ||
         element.classList.contains('avoid-break')
}

/**
 * 智能分页算法 - 考虑元素完整性
 * @param {HTMLElement} container - 容器元素
 * @param {Object} options - 配置项 { pageHeight, avoidSelector }
 * @returns {Array} 修正后的分页偏移量数组
 */
export function calculateIntelligentPageBreaks(container, options = {}) {
  const { 
    pageHeightPx = 1123, // A4 @ 96dpi ≈ 1123px
    avoidSelector = '.resume-item, .section-title, .resume-module'
  } = options

  const breaks = []
  const elementsToAvoid = container.querySelectorAll(avoidSelector)
  let lastBreakY = 0

  // 辅助函数：获取相对于容器的偏移
  const getRelativeOffset = (el) => {
    const rect = el.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    return rect.top - containerRect.top
  }

  // 遍历所有需要“避免截断”的元素
  elementsToAvoid.forEach(el => {
    const top = getRelativeOffset(el)
    const height = el.offsetHeight
    const bottom = top + height

    // 计算当前元素在第几页（相对于上一个分页点）
    const relativeTop = top - lastBreakY
    const relativeBottom = bottom - lastBreakY

    // 如果元素跨越了分页线
    if (relativeTop < pageHeightPx && relativeBottom > pageHeightPx) {
      // 只有当元素不是太长（比如超过半页）时才推到下一页
      // 如果元素本身就比一页还长，那只能任其截断（或者进一步拆分内部）
      if (height < pageHeightPx * 0.8) {
        const gap = pageHeightPx - relativeTop
        breaks.push({
          afterY: top,
          gapHeight: gap,
          element: el
        })
        lastBreakY = top // 更新逻辑上的分页点
      }
    }
  })

  return breaks
}

/**
 * 在 DOM 中应用智能分页间隔
 * @param {HTMLElement} container - 容器克隆体
 * @param {Array} breaks - 分页建议
 */
export function applyIntelligentGaps(container, breaks) {
  // 从后往前插入，避免索引偏移问题（虽然这里用的是绝对位置，但插入 DOM 会影响后续位置）
  // 最佳方案其实是直接在元素前插入 spacer
  breaks.reverse().forEach(b => {
    const spacer = document.createElement('div')
    spacer.className = 'pdf-page-spacer'
    spacer.style.height = `${b.gapHeight}px`
    spacer.style.width = '100%'
    spacer.style.backgroundColor = 'transparent'
    b.element.parentNode.insertBefore(spacer, b.element)
  })
}

/**
 * 应用分页样式
 * @param {HTMLElement} container - 容器元素
 * @param {Array} pageBreaks - 分页点数组
 * @param {boolean} showPageNumbers - 是否显示页码
 */
export function applyPageBreaks(container, pageBreaks, showPageNumbers = false) {
  if (!container || !pageBreaks.length) return
  
  const children = Array.from(container.children)
  
  // 清除之前的分页标记
  children.forEach(child => {
    child.classList.remove('page-break-before')
    child.style.pageBreakBefore = ''
  })
  
  // 应用新的分页点
  pageBreaks.forEach((breakIndex, pageIndex) => {
    if (breakIndex < children.length) {
      const element = children[breakIndex]
      element.classList.add('page-break-before')
      element.style.pageBreakBefore = 'always'
      
      // 添加页码（如果需要）
      if (showPageNumbers) {
        const pageNumber = pageIndex + 2 // 第二页开始
        element.setAttribute('data-page-number', pageNumber)
      }
    }
  })
}

/**
 * 生成页面容器样式
 * @param {Object} pageSettings - 页面设置
 * @param {Object} pageMargin - 页边距设置
 * @returns {Object} 样式对象
 */
export function generatePageContainerStyles(pageSettings, pageMargin) {
  const styles = {
    width: '210mm',
    margin: '0 auto',
    position: 'relative',
    boxSizing: 'border-box'
  }
  
  if (pageSettings.pageCount === 1) {
    // 单页模式：限制高度
    styles.height = `${calculatePageContentHeight(pageMargin)}mm`
    styles.overflow = 'hidden'
  } else {
    // 多页模式：自动高度
    styles.minHeight = `${calculatePageContentHeight(pageMargin)}mm`
    styles.height = 'auto'
  }
  
  return styles
}

/**
 * 创建页码元素
 * @param {number} pageNumber - 页码
 * @param {number} totalPages - 总页数
 * @returns {HTMLElement} 页码元素
 */
export function createPageNumberElement(pageNumber, totalPages) {
  const pageNumberEl = document.createElement('div')
  pageNumberEl.className = 'page-number'
  pageNumberEl.textContent = `${pageNumber} / ${totalPages}`
  pageNumberEl.style.cssText = `
    position: absolute;
    bottom: 10mm;
    right: 10mm;
    font-size: 10px;
    color: #666;
    z-index: 1000;
  `
  return pageNumberEl
}
