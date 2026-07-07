import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { calculateIntelligentPageBreaks, applyIntelligentGaps } from '../paginationUtils'

/**
 * 优化版PDF生成 - 最大化A4纸张利用率
 * @param {string} elementId - 要转换为PDF的元素ID
 * @param {string} filename - 文件名
 */
export async function generateOptimizedPDF(elementId, filename = 'resume.pdf') {
  const rootElement = document.getElementById(elementId)
  if (!rootElement) {
    throw new Error(`找不到ID为 ${elementId} 的元素`)
  }

  const element = rootElement.querySelector('.unified-resume-template, .resume-preview') || rootElement

  element.classList.add('pdf-export')

  const originalStyle = element.style.cssText
  let clone = null

  try {
    // 设置PDF样式
    element.style.width = '210mm'
    element.style.height = 'auto'
    element.style.minHeight = 'auto'
    element.style.maxWidth = '210mm'
    element.style.padding = '0'
    element.style.margin = '0'
    element.style.boxSizing = 'border-box'
    element.style.backgroundColor = '#ffffff'
    element.style.transform = 'none'
    element.style.position = 'relative'
    element.style.overflow = 'visible'
    element.style.display = 'block'
    element.style.webkitFontSmoothing = 'antialiased'
    element.style.mozOsxFontSmoothing = 'grayscale'
    element.style.textRendering = 'optimizeLegibility'

    const currentFontFamily = getComputedStyle(element).fontFamily || 'system-ui'
    if (!currentFontFamily.includes('Microsoft YaHei') && !currentFontFamily.includes('SimSun')) {
      const safeFontFamily = currentFontFamily.trim()
      if (safeFontFamily) {
        element.style.fontFamily = `${safeFontFamily}, "Microsoft YaHei", "SimSun", sans-serif`
      } else {
        element.style.fontFamily = '"Microsoft YaHei", "SimSun", system-ui, sans-serif'
      }
    }

    // 智能分页处理
    clone = element.cloneNode(true)
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    clone.style.top = '0'
    clone.style.width = '210mm'
    clone.style.visibility = 'hidden'
    document.body.appendChild(clone)

    const pageHeightPx = 1123
    const breaks = calculateIntelligentPageBreaks(clone, { pageHeightPx })
    applyIntelligentGaps(element, breaks)

    await new Promise(resolve => setTimeout(resolve, 500))

    const contentHeight = element.scrollHeight
    const contentWidth = element.scrollWidth
    const pixelWidth = Math.max(1, Math.ceil(contentWidth || element.offsetWidth))
    const pixelHeight = Math.max(1, Math.ceil(contentHeight || element.offsetHeight))

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: pixelWidth,
      height: pixelHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: pixelWidth,
      windowHeight: pixelHeight,
      letterRendering: false,
      logging: false,
      onclone: (clonedDoc) => {
        const svgs = clonedDoc.querySelectorAll('svg')
        svgs.forEach(svg => {
          if (!svg.getAttribute('width')) svg.setAttribute('width', svg.getBoundingClientRect().width)
          if (!svg.getAttribute('height')) svg.setAttribute('height', svg.getBoundingClientRect().height)
          svg.style.opacity = '1'
        })
      }
    })

    // 创建PDF
    const imgData = canvas.toDataURL('image/png', 1.0)

    // 计算实际的PDF高度（mm）
    // canvas高度 / 像素密度 = mm高度
    // 1mm ≈ 3.78px (at 96dpi)
    const actualHeightMm = (pixelHeight / 3.78)

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 2
    })

    // 根据实际内容高度添加图像
    // 如果内容超过一页，需要分页
    const pageHeight = 297
    const pageWidth = 210

    // 计算需要多少页
    const totalPages = Math.ceil(actualHeightMm / pageHeight)

    // 添加第一页，传入实际长图高度actualHeightMm而非页面高度，否则JS会挤压！
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, actualHeightMm, '', 'FAST')

    // 如果内容超过一页，添加额外的页面
    if (totalPages > 1) {
      for (let i = 1; i < totalPages; i++) {
        pdf.addPage()
        const yOffset = -(i * pageHeight)
        pdf.addImage(imgData, 'PNG', 0, yOffset, pageWidth, actualHeightMm, '', 'FAST')
      }
    }

    // 清理分页间隔（还原 DOM）
    element.querySelectorAll('.pdf-page-spacer').forEach(s => s.remove())

    // 保存PDF
    const pdfBlob = pdf.output('blob')
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error('优化PDF生成失败:', error)
    throw error
  } finally {
    // 确保样式和DOM始终恢复
    element.style.cssText = originalStyle
    element.classList.remove('pdf-export')
    element.querySelectorAll('.pdf-page-spacer').forEach(s => s.remove())
    if (clone && clone.parentNode) {
      clone.parentNode.removeChild(clone)
    }
  }
}
