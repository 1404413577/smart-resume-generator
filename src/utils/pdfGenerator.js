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
    scale: 2, // 提高清晰度
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    ...options
  }

  try {
    // 获取要转换的元素
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`找不到ID为 ${elementId} 的元素`)
    }

    // 临时调整元素样式以适应PDF
    const originalStyle = element.style.cssText
    element.style.width = '210mm' // A4纸宽度
    element.style.minHeight = '297mm' // A4纸高度
    element.style.padding = '20mm'
    element.style.boxSizing = 'border-box'
    element.style.backgroundColor = '#ffffff'

    // 等待一下让样式生效
    await new Promise(resolve => setTimeout(resolve, 100))

    // 使用html2canvas转换为canvas
    const canvas = await html2canvas(element, defaultOptions)
    
    // 恢复原始样式
    element.style.cssText = originalStyle

    // 创建PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // 计算图片在PDF中的尺寸
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    // 添加图片到PDF
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

    // 如果内容超过一页，需要分页处理
    if (imgHeight * ratio > pdfHeight) {
      const totalPages = Math.ceil(imgHeight * ratio / pdfHeight)
      
      for (let i = 1; i < totalPages; i++) {
        pdf.addPage()
        const yOffset = -pdfHeight * i
        pdf.addImage(imgData, 'PNG', imgX, imgY + yOffset, imgWidth * ratio, imgHeight * ratio)
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

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('portrait', 'mm', 'a4')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio)
    
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

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('portrait', 'mm', 'a4')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio)
    
    // 在新窗口中预览
    const pdfDataUri = pdf.output('datauristring')
    window.open(pdfDataUri, '_blank')
    
    return true
  } catch (error) {
    console.error('PDF预览失败:', error)
    throw error
  }
}
