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

  const sourceElement = rootElement.querySelector('.base-resume-template, .unified-resume-template, .resume-preview') || rootElement
  const originalRootStyle = rootElement.style.cssText
  const originalRootClass = rootElement.className
  let exportRoot = null
  let exportElement = null
  let exportHost = null

  try {
    exportRoot = rootElement.cloneNode(true)
    exportRoot.style.width = '210mm'
    exportRoot.style.maxWidth = '210mm'
    exportRoot.style.margin = '0'
    exportRoot.style.padding = '0'
    exportRoot.style.transform = 'none'
    exportRoot.style.transformOrigin = 'top left'
    exportRoot.style.overflow = 'visible'

    exportElement = exportRoot.querySelector('.base-resume-template, .unified-resume-template, .resume-preview') || exportRoot
    exportElement.classList.add('pdf-export')
    exportElement.style.width = '210mm'
    exportElement.style.maxWidth = '210mm'
    exportElement.style.margin = '0'
    exportElement.style.transform = 'none'
    exportElement.style.transformOrigin = 'top left'
    exportElement.style.position = 'relative'
    exportElement.style.overflow = 'visible'
    exportElement.style.backgroundColor = '#ffffff'
    exportElement.style.webkitFontSmoothing = 'antialiased'
    exportElement.style.mozOsxFontSmoothing = 'grayscale'
    exportElement.style.textRendering = 'optimizeLegibility'

    exportHost = document.createElement('div')
    exportHost.className = 'pdf-export-host'
    exportHost.style.cssText = `
      position: fixed;
      left: -10000px;
      top: 0;
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
      overflow: visible;
      z-index: 0;
      transform: none;
      pointer-events: none;
    `
    exportHost.appendChild(exportRoot)
    document.body.appendChild(exportHost)

    const currentFontFamily = getComputedStyle(sourceElement).fontFamily || 'system-ui'
    if (!currentFontFamily.includes('Noto Sans SC') && !currentFontFamily.includes('Source Han Sans')) {
      const safeFontFamily = currentFontFamily.trim()
      if (safeFontFamily) {
        exportElement.style.fontFamily = `${safeFontFamily}, "Noto Sans SC", "Source Han Sans SC", "Source Han Sans CN", system-ui, sans-serif`
      } else {
        exportElement.style.fontFamily = '"Noto Sans SC", "Source Han Sans SC", "Source Han Sans CN", system-ui, sans-serif'
      }
    }

    const pageHeightPx = 1123
    const breaks = calculateIntelligentPageBreaks(exportElement, { pageHeightPx })
    applyIntelligentGaps(exportElement, breaks)

    await new Promise(resolve => setTimeout(resolve, 500))

    const contentHeight = exportElement.scrollHeight
    const contentWidth = exportElement.scrollWidth
    const pixelWidth = Math.max(1, Math.ceil(contentWidth || exportElement.offsetWidth))
    const pixelHeight = Math.max(1, Math.ceil(contentHeight || exportElement.offsetHeight))

    const canvas = await html2canvas(exportElement, {
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
    rootElement.style.cssText = originalRootStyle
    rootElement.className = originalRootClass
    if (exportHost && exportHost.parentNode) {
      exportHost.parentNode.removeChild(exportHost)
    }
  }
}
