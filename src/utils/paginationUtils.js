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
 * 自动分页算法
 * @param {HTMLElement} container - 容器元素
 * @param {Object} pageSettings - 页面设置
 * @param {Object} pageMargin - 页边距设置
 * @returns {Array} 自动分页点数组
 */
export function calculateAutoPageBreaks(container, pageSettings, pageMargin) {
  if (!container || pageSettings.pagingMode !== 'auto') {
    return []
  }
  
  const pageHeight = calculatePageContentHeight(pageMargin)
  const children = Array.from(container.children)
  const breaks = []
  let currentHeight = 0
  let currentPage = 1
  
  children.forEach((child, index) => {
    // 更准确的px到mm转换 (基于CSS标准: 1mm = 3.7795275591px)
    const childHeight = child.offsetHeight / 3.7795275591

    // 检查是否需要分页
    if (currentHeight + childHeight > pageHeight && currentPage < pageSettings.pageCount) {
      // 如果当前元素应该避免分页，尝试将其移到下一页
      if (shouldAvoidPageBreak(child)) {
        breaks.push(index)
        currentHeight = childHeight
        currentPage++
      } else {
        // 在当前位置分页
        breaks.push(index)
        currentHeight = childHeight
        currentPage++
      }
    } else {
      currentHeight += childHeight
    }
  })
  
  return breaks
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
