// 多页简历PDF生成器
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * 多页简历PDF生成器
 * 专门处理工科简历的多页导出需求
 */
export class MultiPagePdfGenerator {
  constructor(options = {}) {
    this.options = {
      format: 'a4',
      orientation: 'portrait',
      unit: 'mm',
      compress: true,
      quality: 0.95,
      margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      },
      ...options
    }
  }

  /**
   * 生成多页PDF
   * @param {string} elementId - 要导出的元素ID
   * @param {string} filename - 文件名
   * @param {Object} pageSettings - 页面设置
   */
  async generateMultiPagePDF(elementId, filename, pageSettings = {}) {
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error(`找不到ID为 ${elementId} 的元素`)
      }

      // 检查是否为多页模式
      const pages = element.querySelectorAll('.page')
      if (pages.length <= 1) {
        // 单页模式，使用标准导出
        return await this.generateSinglePagePDF(element, filename)
      }

      // 多页模式
      return await this.generateMultiPageFromPages(pages, filename, pageSettings)
    } catch (error) {
      console.error('PDF生成失败:', error)
      throw error
    }
  }

  /**
   * 从多个页面元素生成PDF
   */
  async generateMultiPageFromPages(pages, filename, pageSettings) {
    const pdf = new jsPDF({
      orientation: this.options.orientation,
      unit: this.options.unit,
      format: this.options.format,
      compress: this.options.compress
    })

    // A4尺寸 (mm)
    const pageWidth = 210
    const pageHeight = 297
    const { margin } = this.options

    let isFirstPage = true

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      
      try {
        // 临时显示页面（如果被隐藏）
        const originalDisplay = page.style.display
        page.style.display = 'block'

        // 生成页面截图
        const canvas = await html2canvas(page, {
          scale: 2, // 高分辨率
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: page.scrollWidth,
          height: page.scrollHeight,
          scrollX: 0,
          scrollY: 0
        })

        // 恢复原始显示状态
        page.style.display = originalDisplay

        // 计算图片尺寸
        const imgWidth = pageWidth - margin.left - margin.right
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // 如果不是第一页，添加新页面
        if (!isFirstPage) {
          pdf.addPage()
        }

        // 添加图片到PDF
        const imgData = canvas.toDataURL('image/jpeg', this.options.quality)
        pdf.addImage(
          imgData,
          'JPEG',
          margin.left,
          margin.top,
          imgWidth,
          Math.min(imgHeight, pageHeight - margin.top - margin.bottom)
        )

        // 添加页码（如果启用）
        if (pageSettings.showPageNumbers) {
          this.addPageNumber(pdf, i + 1, pages.length, pageWidth, pageHeight)
        }

        isFirstPage = false

      } catch (error) {
        console.error(`处理第${i + 1}页时出错:`, error)
        // 继续处理下一页
      }
    }

    // 保存PDF
    pdf.save(filename)
    return pdf
  }

  /**
   * 生成单页PDF
   */
  async generateSinglePagePDF(element, filename) {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const pdf = new jsPDF({
      orientation: this.options.orientation,
      unit: this.options.unit,
      format: this.options.format,
      compress: this.options.compress
    })

    const pageWidth = 210
    const pageHeight = 297
    const { margin } = this.options

    const imgWidth = pageWidth - margin.left - margin.right
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const imgData = canvas.toDataURL('image/jpeg', this.options.quality)
    pdf.addImage(
      imgData,
      'JPEG',
      margin.left,
      margin.top,
      imgWidth,
      Math.min(imgHeight, pageHeight - margin.top - margin.bottom)
    )

    pdf.save(filename)
    return pdf
  }

  /**
   * 添加页码
   */
  addPageNumber(pdf, currentPage, totalPages, pageWidth, pageHeight) {
    const fontSize = 8
    const text = `${currentPage} / ${totalPages}`
    
    pdf.setFontSize(fontSize)
    pdf.setTextColor(128, 128, 128) // 灰色
    
    // 计算文本宽度并居中
    const textWidth = pdf.getTextWidth(text)
    const x = (pageWidth - textWidth) / 2
    const y = pageHeight - 5 // 距离底部5mm
    
    pdf.text(text, x, y)
  }

  /**
   * 优化PDF大小
   */
  async generateOptimizedMultiPagePDF(elementId, filename, pageSettings = {}) {
    // 临时调整页面样式以优化PDF输出
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`找不到ID为 ${elementId} 的元素`)
    }

    // 保存原始样式
    const originalStyles = this.saveOriginalStyles(element)

    try {
      // 应用PDF优化样式
      this.applyPdfOptimizationStyles(element)

      // 等待样式应用
      await new Promise(resolve => setTimeout(resolve, 100))

      // 生成PDF
      const result = await this.generateMultiPagePDF(elementId, filename, pageSettings)

      return result
    } finally {
      // 恢复原始样式
      this.restoreOriginalStyles(element, originalStyles)
    }
  }

  /**
   * 保存原始样式
   */
  saveOriginalStyles(element) {
    const styles = {}
    const pages = element.querySelectorAll('.page')
    
    pages.forEach((page, index) => {
      styles[index] = {
        boxShadow: page.style.boxShadow,
        transform: page.style.transform,
        margin: page.style.margin
      }
    })
    
    return styles
  }

  /**
   * 应用PDF优化样式
   */
  applyPdfOptimizationStyles(element) {
    const pages = element.querySelectorAll('.page')
    
    pages.forEach(page => {
      // 移除阴影和变换效果
      page.style.boxShadow = 'none'
      page.style.transform = 'none'
      page.style.margin = '0'
      
      // 确保背景为白色
      page.style.backgroundColor = '#ffffff'
    })
  }

  /**
   * 恢复原始样式
   */
  restoreOriginalStyles(element, originalStyles) {
    const pages = element.querySelectorAll('.page')
    
    pages.forEach((page, index) => {
      if (originalStyles[index]) {
        const styles = originalStyles[index]
        page.style.boxShadow = styles.boxShadow
        page.style.transform = styles.transform
        page.style.margin = styles.margin
      }
    })
  }

  /**
   * 获取PDF预览信息
   */
  async getPdfPreviewInfo(elementId) {
    const element = document.getElementById(elementId)
    if (!element) {
      return null
    }

    const pages = element.querySelectorAll('.page')
    
    return {
      pageCount: pages.length,
      isMultiPage: pages.length > 1,
      estimatedFileSize: this.estimateFileSize(pages.length),
      recommendedSettings: this.getRecommendedSettings(pages.length)
    }
  }

  /**
   * 估算文件大小
   */
  estimateFileSize(pageCount) {
    // 基于经验的文件大小估算 (KB)
    const baseSize = 150 // 基础大小
    const perPageSize = 200 // 每页增加的大小
    
    return Math.round(baseSize + (pageCount * perPageSize))
  }

  /**
   * 获取推荐设置
   */
  getRecommendedSettings(pageCount) {
    if (pageCount === 1) {
      return {
        quality: 0.95,
        scale: 2,
        format: 'a4'
      }
    } else {
      return {
        quality: 0.9, // 多页时稍微降低质量以减小文件大小
        scale: 1.5,
        format: 'a4'
      }
    }
  }
}

/**
 * 创建多页PDF生成器实例
 */
export function createMultiPagePdfGenerator(options = {}) {
  return new MultiPagePdfGenerator(options)
}

/**
 * 快速生成多页PDF的便捷函数
 */
export async function generateMultiPageResumePDF(elementId, filename, pageSettings = {}) {
  const generator = createMultiPagePdfGenerator()
  return await generator.generateOptimizedMultiPagePDF(elementId, filename, pageSettings)
}
