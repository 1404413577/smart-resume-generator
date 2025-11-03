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
    // 优化中文字符渲染 - 移除不支持的参数
    letterRendering: false,
    logging: false,
    ...options
  }

  try {
    // 获取要转换的元素
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`找不到ID为 ${elementId} 的元素`)
    }

    // 检测是否为Modern模板并添加PDF导出专用CSS类
    const isModernTemplate = element.querySelector('.modern-template')

    if (isModernTemplate) {
      isModernTemplate.classList.add('pdf-export')
    }

    // 临时调整元素样式以适应PDF - 优化边距和字体渲染
    const originalStyle = element.style.cssText
    element.style.width = '210mm' // A4纸宽度
    element.style.minHeight = '297mm' // A4纸高度
    element.style.padding = '5mm' // 最小边距，最大化内容区域
    element.style.boxSizing = 'border-box'
    element.style.backgroundColor = '#ffffff'
    element.style.margin = '0'
    element.style.transform = 'none' // 移除任何变换
    element.style.position = 'relative'

    // 优化字体渲染设置，特别针对中文字符
  element.style.webkitFontSmoothing = 'antialiased'
  element.style.mozOsxFontSmoothing = 'grayscale'
  element.style.textRendering = 'optimizeLegibility'

    // 安全地设置字体回退链
    const currentFontFamily = getComputedStyle(element).fontFamily || 'system-ui'
    if (!currentFontFamily.includes('Microsoft YaHei') && !currentFontFamily.includes('SimSun')) {
      // 确保字体名称格式正确
      const safeFontFamily = currentFontFamily.trim()
      if (safeFontFamily) {
        element.style.fontFamily = `${safeFontFamily}, "Microsoft YaHei", "SimSun", sans-serif`
      } else {
        element.style.fontFamily = '"Microsoft YaHei", "SimSun", system-ui, sans-serif'
      }
    }

    // 等待样式生效
    await new Promise(resolve => setTimeout(resolve, 200))

    // 使用html2canvas转换为canvas
    console.log('开始生成PDF，元素尺寸:', element.offsetWidth, 'x', element.offsetHeight)
    const canvas = await html2canvas(element, defaultOptions)
    console.log('Canvas生成完成，尺寸:', canvas.width, 'x', canvas.height)

    // 恢复原始样式和CSS类
    element.style.cssText = originalStyle
    if (isModernTemplate) {
      isModernTemplate.classList.remove('pdf-export')
    }

    // 创建PDF - 优化配置
    const imgData = canvas.toDataURL('image/png', 1.0) // 最高质量
    console.log('图片数据生成完成，长度:', imgData.length)

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    })

    // A4纸尺寸 (mm)
    const pdfWidth = 210
    const pdfHeight = 297

    // 直接使用整个页面空间，无边距
    const finalWidth = pdfWidth
    const finalHeight = pdfHeight
    const offsetX = 0
    const offsetY = 0

    // 添加图片到PDF - 充分利用整个页面空间
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

    // 检测是否为Modern模板并添加PDF导出专用CSS类
    const isModernTemplate = element.querySelector('.modern-template')
    if (isModernTemplate) {
      isModernTemplate.classList.add('pdf-export')
    }

    // 临时调整元素样式
    const originalStyle = element.style.cssText
    element.style.width = '210mm'
    element.style.padding = '5mm' // 最小边距，最大化内容区域
    element.style.margin = '0'
    element.style.boxSizing = 'border-box'
    element.style.backgroundColor = '#ffffff'

    // 优化字体渲染设置，特别针对中文字符
  element.style.webkitFontSmoothing = 'antialiased'
  element.style.mozOsxFontSmoothing = 'grayscale'
  element.style.textRendering = 'optimizeLegibility'

    // 安全地设置字体回退链
    const currentFontFamily = getComputedStyle(element).fontFamily || 'system-ui'
    if (!currentFontFamily.includes('Microsoft YaHei') && !currentFontFamily.includes('SimSun')) {
      // 确保字体名称格式正确
      const safeFontFamily = currentFontFamily.trim()
      if (safeFontFamily) {
        element.style.fontFamily = `${safeFontFamily}, "Microsoft YaHei", "SimSun", sans-serif`
      } else {
        element.style.fontFamily = '"Microsoft YaHei", "SimSun", system-ui, sans-serif'
      }
    }

    await new Promise(resolve => setTimeout(resolve, 200))

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123,
      // 优化中文字符渲染
      letterRendering: false,
      logging: false
    })

    // 恢复样式和CSS类
    element.style.cssText = originalStyle
    if (isModernTemplate) {
      isModernTemplate.classList.remove('pdf-export')
    }

    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF('portrait', 'mm', 'a4')

    // A4纸尺寸
    const pdfWidth = 210
    const pdfHeight = 297

    // 直接使用整个页面空间，无边距
    const finalWidth = pdfWidth
    const finalHeight = pdfHeight
    const offsetX = 0
    const offsetY = 0

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

    // 检测是否为Modern模板并添加PDF导出专用CSS类
    const isModernTemplate = element.querySelector('.modern-template')
    if (isModernTemplate) {
      isModernTemplate.classList.add('pdf-export')
    }

    // 保存原始样式
    const originalStyle = element.style.cssText

    // 设置PDF样式 - 保持与屏幕显示的一致性，确保没有缩放
    element.style.width = '210mm'
    element.style.height = 'auto' // 让高度自动适应内容
    element.style.minHeight = 'auto'
    element.style.maxWidth = '210mm'
    element.style.padding = '20mm' // 保持合理的页边距
    element.style.margin = '0'
    element.style.boxSizing = 'border-box'
    element.style.backgroundColor = '#ffffff'
    element.style.transform = 'none' // 确保没有缩放
    element.style.position = 'relative'
    element.style.overflow = 'visible'
    element.style.display = 'block'

    // 优化字体渲染设置，特别针对中文字符
  element.style.webkitFontSmoothing = 'antialiased'
  element.style.mozOsxFontSmoothing = 'grayscale'
  element.style.textRendering = 'optimizeLegibility'

    // 安全地设置字体回退链
    const currentFontFamily = getComputedStyle(element).fontFamily || 'system-ui'
    if (!currentFontFamily.includes('Microsoft YaHei') && !currentFontFamily.includes('SimSun')) {
      // 确保字体名称格式正确
      const safeFontFamily = currentFontFamily.trim()
      if (safeFontFamily) {
        element.style.fontFamily = `${safeFontFamily}, "Microsoft YaHei", "SimSun", sans-serif`
      } else {
        element.style.fontFamily = '"Microsoft YaHei", "SimSun", system-ui, sans-serif'
      }
    }

    // 等待样式应用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取实际的内容高度
    const contentHeight = element.scrollHeight
    const contentWidth = element.scrollWidth

    // 计算像素尺寸 (1mm ≈ 3.78px)
    const pixelWidth = Math.ceil(contentWidth)
    const pixelHeight = Math.ceil(contentHeight)

    // 优化canvas配置 - 平衡质量和一致性，特别优化中文字符渲染
    const canvas = await html2canvas(element, {
      scale: 2, // 适中的分辨率，避免过度放大导致的差异
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: pixelWidth, // 使用实际宽度
      height: pixelHeight, // 使用实际高度
      scrollX: 0,
      scrollY: 0,
      windowWidth: pixelWidth,
      windowHeight: pixelHeight,
      letterRendering: false, // 禁用letterRendering以避免中文字符间距问题
      logging: false // 关闭日志以提高性能
    })

    // 恢复原始样式和CSS类
    element.style.cssText = originalStyle
    if (isModernTemplate) {
      isModernTemplate.classList.remove('pdf-export')
    }

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

    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, '', 'FAST')

    // 如果内容超过一页，添加额外的页面
    if (totalPages > 1) {
      for (let i = 1; i < totalPages; i++) {
        pdf.addPage()
        const yOffset = -(i * pageHeight)
        pdf.addImage(imgData, 'PNG', 0, yOffset, pageWidth, pageHeight, '', 'FAST')
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
  }
}
