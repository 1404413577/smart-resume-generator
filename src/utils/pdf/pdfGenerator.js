import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * 生成PDF文件
 * @param {string} elementId - 要转换为PDF的元素ID
 * @param {string} filename - 文件名
 * @param {Object} options - 配置选项
 */
export async function generatePDF(elementId, filename = 'resume.pdf', options = {}) {
  const defaultOptions = {
    scale: 3, // 提高清晰度，使用更高的缩放比例
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: 794, // A4纸宽度像素 (210mm * 3.78 dpi)
    height: 1123, // A4纸高度像素 (297mm * 3.78 dpi)
    ...options
  }

  try {
    // 获取要转换的元素
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`找不到ID为 ${elementId} 的元素`)
    }

    // 临时调整元素样式以适应PDF - 优化边距
    const originalStyle = element.style.cssText
    element.style.width = '210mm' // A4纸宽度
    element.style.minHeight = '297mm' // A4纸高度
    element.style.padding = '10mm' // 减少边距到10mm
    element.style.boxSizing = 'border-box'
    element.style.backgroundColor = '#ffffff'
    element.style.margin = '0'
    element.style.transform = 'none' // 移除任何变换
    element.style.position = 'relative'

    // 等待样式生效
    await new Promise(resolve => setTimeout(resolve, 200))

    // 使用html2canvas转换为canvas
    const canvas = await html2canvas(element, defaultOptions)

    // 恢复原始样式
    element.style.cssText = originalStyle

    // 创建PDF - 优化配置
    const imgData = canvas.toDataURL('image/png', 1.0) // 最高质量
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    })

    // A4纸尺寸 (mm)
    const pdfWidth = 210
    const pdfHeight = 297

    // 计算缩放比例 - 确保充分利用页面空间
    const canvasAspectRatio = canvas.width / canvas.height
    const pdfAspectRatio = pdfWidth / pdfHeight

    let finalWidth, finalHeight, offsetX, offsetY

    if (canvasAspectRatio > pdfAspectRatio) {
      // 图片更宽，以宽度为准
      finalWidth = pdfWidth
      finalHeight = pdfWidth / canvasAspectRatio
      offsetX = 0
      offsetY = (pdfHeight - finalHeight) / 2
    } else {
      // 图片更高，以高度为准
      finalHeight = pdfHeight
      finalWidth = pdfHeight * canvasAspectRatio
      offsetX = (pdfWidth - finalWidth) / 2
      offsetY = 0
    }

    // 添加图片到PDF - 充分利用页面空间
    pdf.addImage(imgData, 'PNG', offsetX, offsetY, finalWidth, finalHeight)

    // 如果内容超过一页，需要分页处理
    if (finalHeight > pdfHeight) {
      const totalPages = Math.ceil(finalHeight / pdfHeight)

      for (let i = 1; i < totalPages; i++) {
        pdf.addPage()
        const yOffset = -pdfHeight * i
        pdf.addImage(imgData, 'PNG', offsetX, offsetY + yOffset, finalWidth, finalHeight)
      }
    }

    // 保存PDF - 使用更可靠的下载方法
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
    console.error('PDF生成失败:', error)
    throw error
  }
}

/**
 * 生成并下载PDF（使用Blob方式）
 * @param {string} elementId - 要转换为PDF的元素ID
 * @param {string} filename - 文件名
 */
export async function downloadPDFBlob(elementId, filename = 'resume.pdf') {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`找不到ID为 ${elementId} 的元素`)
    }

    // 临时调整元素样式
    const originalStyle = element.style.cssText
    element.style.width = '210mm'
    element.style.padding = '10mm'
    element.style.margin = '0'
    element.style.boxSizing = 'border-box'
    element.style.backgroundColor = '#ffffff'

    await new Promise(resolve => setTimeout(resolve, 200))

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123
    })

    // 恢复样式
    element.style.cssText = originalStyle

    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF('portrait', 'mm', 'a4')

    // A4纸尺寸
    const pdfWidth = 210
    const pdfHeight = 297

    // 计算最佳尺寸
    const canvasAspectRatio = canvas.width / canvas.height
    const pdfAspectRatio = pdfWidth / pdfHeight

    let finalWidth, finalHeight, offsetX, offsetY

    if (canvasAspectRatio > pdfAspectRatio) {
      finalWidth = pdfWidth
      finalHeight = pdfWidth / canvasAspectRatio
      offsetX = 0
      offsetY = (pdfHeight - finalHeight) / 2
    } else {
      finalHeight = pdfHeight
      finalWidth = pdfHeight * canvasAspectRatio
      offsetX = (pdfWidth - finalWidth) / 2
      offsetY = 0
    }

    pdf.addImage(imgData, 'PNG', offsetX, offsetY, finalWidth, finalHeight)
    
    // 转换为Blob并下载 - 使用更可靠的下载方法
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
    console.error('PDF下载失败:', error)
    throw error
  }
}

/**
 * 预览PDF（在新窗口中打开）
 * @param {string} elementId - 要转换为PDF的元素ID
 */
export async function previewPDF(elementId) {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`找不到ID为 ${elementId} 的元素`)
    }

    // 使用与生成PDF相同的配置
    const originalStyle = element.style.cssText
    element.style.width = '210mm'
    element.style.padding = '10mm'
    element.style.margin = '0'
    element.style.boxSizing = 'border-box'
    element.style.backgroundColor = '#ffffff'

    await new Promise(resolve => setTimeout(resolve, 200))

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123
    })

    element.style.cssText = originalStyle

    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF('portrait', 'mm', 'a4')

    // A4纸尺寸
    const pdfWidth = 210
    const pdfHeight = 297

    // 计算最佳尺寸
    const canvasAspectRatio = canvas.width / canvas.height
    const pdfAspectRatio = pdfWidth / pdfHeight

    let finalWidth, finalHeight, offsetX, offsetY

    if (canvasAspectRatio > pdfAspectRatio) {
      finalWidth = pdfWidth
      finalHeight = pdfWidth / canvasAspectRatio
      offsetX = 0
      offsetY = (pdfHeight - finalHeight) / 2
    } else {
      finalHeight = pdfHeight
      finalWidth = pdfHeight * canvasAspectRatio
      offsetX = (pdfWidth - finalWidth) / 2
      offsetY = 0
    }

    pdf.addImage(imgData, 'PNG', offsetX, offsetY, finalWidth, finalHeight)

    // 在新窗口中预览
    const pdfDataUri = pdf.output('datauristring')
    window.open(pdfDataUri, '_blank')

    return true
  } catch (error) {
    console.error('PDF预览失败:', error)
    throw error
  }
}

/**
 * 优化版PDF生成 - 最大化A4纸张利用率
 * @param {string} elementId - 要转换为PDF的元素ID
 * @param {string} filename - 文件名
 */
export async function generateOptimizedPDF(elementId, filename = 'resume.pdf') {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`找不到ID为 ${elementId} 的元素`)
    }

    // 保存原始样式
    const originalStyle = element.style.cssText

    // 设置最优的PDF样式
    element.style.width = '210mm'
    element.style.maxWidth = '210mm'
    element.style.padding = '8mm' // 进一步减少边距
    element.style.margin = '0'
    element.style.boxSizing = 'border-box'
    element.style.backgroundColor = '#ffffff'
    element.style.transform = 'none'
    element.style.position = 'relative'
    element.style.fontSize = '10px' // 稍微减小字体以容纳更多内容

    // 等待样式应用
    await new Promise(resolve => setTimeout(resolve, 300))

    // 高质量canvas配置
    const canvas = await html2canvas(element, {
      scale: 4, // 更高的分辨率
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4宽度像素
      height: 1123, // A4高度像素
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: 1123
    })

    // 恢复原始样式
    element.style.cssText = originalStyle

    // 创建PDF
    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 2
    })

    // 直接使用全页面尺寸，最大化利用空间
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST')

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
  }
}
