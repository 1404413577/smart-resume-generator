/**
 * PDF导出功能
 * 支持将简历模板导出为高质量PDF文件
 */

import html2pdf from 'html2pdf.js'
import { PDF_EXPORT_SETTINGS } from './templateConfig.js'

/**
 * 导出简历为PDF
 * @param {HTMLElement} element - 要导出的DOM元素
 * @param {Object} options - 导出选项
 * @returns {Promise} 导出Promise
 */
export async function exportToPDF(element, options = {}) {
  try {
    // 合并默认设置和用户选项
    const settings = {
      ...PDF_EXPORT_SETTINGS,
      ...options
    }

    // 设置文件名
    const filename = options.filename || `resume_${new Date().getTime()}.pdf`
    
    // 配置html2pdf选项
    const opt = {
      margin: settings.margin,
      filename: filename,
      image: settings.image,
      html2canvas: {
        ...settings.html2canvas,
        height: element.scrollHeight,
        width: element.scrollWidth
      },
      jsPDF: settings.jsPDF
    }

    // 显示导出进度
    showExportProgress()

    // 执行PDF导出
    const pdf = await html2pdf().set(opt).from(element).save()
    
    // 隐藏进度提示
    hideExportProgress()
    
    return pdf
  } catch (error) {
    hideExportProgress()
    console.error('PDF导出失败:', error)
    throw new Error('PDF导出失败，请重试')
  }
}

/**
 * 预览PDF（不下载）
 * @param {HTMLElement} element - 要预览的DOM元素
 * @param {Object} options - 预览选项
 * @returns {Promise<Blob>} PDF Blob对象
 */
export async function previewPDF(element, options = {}) {
  try {
    const settings = {
      ...PDF_EXPORT_SETTINGS,
      ...options
    }

    const opt = {
      margin: settings.margin,
      image: settings.image,
      html2canvas: {
        ...settings.html2canvas,
        height: element.scrollHeight,
        width: element.scrollWidth
      },
      jsPDF: settings.jsPDF
    }

    showExportProgress('正在生成预览...')

    const pdf = await html2pdf().set(opt).from(element).outputPdf('blob')
    
    hideExportProgress()
    
    return pdf
  } catch (error) {
    hideExportProgress()
    console.error('PDF预览失败:', error)
    throw new Error('PDF预览失败，请重试')
  }
}

/**
 * 批量导出多个简历模板
 * @param {Array} templates - 模板数组，每个包含element和filename
 * @param {Object} options - 导出选项
 * @returns {Promise} 批量导出Promise
 */
export async function batchExportPDF(templates, options = {}) {
  try {
    const results = []
    
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i]
      showExportProgress(`正在导出第 ${i + 1}/${templates.length} 个文件...`)
      
      const result = await exportToPDF(template.element, {
        ...options,
        filename: template.filename
      })
      
      results.push(result)
    }
    
    hideExportProgress()
    return results
  } catch (error) {
    hideExportProgress()
    console.error('批量导出失败:', error)
    throw new Error('批量导出失败，请重试')
  }
}

/**
 * 优化元素以适合PDF导出
 * @param {HTMLElement} element - 要优化的元素
 * @returns {Function} 恢复函数
 */
export function optimizeForPDF(element) {
  const originalStyles = {}
  
  // 保存原始样式
  const computedStyle = window.getComputedStyle(element)
  originalStyles.transform = element.style.transform
  originalStyles.boxShadow = element.style.boxShadow
  originalStyles.borderRadius = element.style.borderRadius
  
  // 应用PDF优化样式
  element.style.transform = 'none'
  element.style.boxShadow = 'none'
  element.style.borderRadius = '0'
  
  // 优化子元素
  const childElements = element.querySelectorAll('*')
  const childOriginalStyles = []
  
  childElements.forEach((child, index) => {
    const childStyle = window.getComputedStyle(child)
    childOriginalStyles[index] = {
      transform: child.style.transform,
      boxShadow: child.style.boxShadow,
      borderRadius: child.style.borderRadius
    }
    
    child.style.transform = 'none'
    child.style.boxShadow = 'none'
    if (childStyle.borderRadius !== '0px') {
      child.style.borderRadius = '4px' // 保留小圆角
    }
  })
  
  // 返回恢复函数
  return () => {
    element.style.transform = originalStyles.transform
    element.style.boxShadow = originalStyles.boxShadow
    element.style.borderRadius = originalStyles.borderRadius
    
    childElements.forEach((child, index) => {
      const original = childOriginalStyles[index]
      child.style.transform = original.transform
      child.style.boxShadow = original.boxShadow
      child.style.borderRadius = original.borderRadius
    })
  }
}

/**
 * 显示导出进度
 * @param {String} message - 进度消息
 */
function showExportProgress(message = '正在导出PDF...') {
  // 移除已存在的进度提示
  hideExportProgress()
  
  const progressDiv = document.createElement('div')
  progressDiv.id = 'pdf-export-progress'
  progressDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    ">
      <div style="
        background: white;
        padding: 30px 40px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 300px;
      ">
        <div style="
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        "></div>
        <div style="
          font-size: 16px;
          color: #374151;
          font-weight: 500;
        ">${message}</div>
        <div style="
          font-size: 14px;
          color: #6b7280;
          margin-top: 8px;
        ">请稍候，不要关闭页面</div>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `
  
  document.body.appendChild(progressDiv)
}

/**
 * 隐藏导出进度
 */
function hideExportProgress() {
  const progressDiv = document.getElementById('pdf-export-progress')
  if (progressDiv) {
    progressDiv.remove()
  }
}

/**
 * 获取PDF导出预设配置
 * @param {String} preset - 预设名称 ('high', 'medium', 'low')
 * @returns {Object} 配置对象
 */
export function getPDFPreset(preset = 'medium') {
  const presets = {
    high: {
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3,
        useCORS: true,
        letterRendering: true,
        allowTaint: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: false
      }
    },
    medium: {
      image: { type: 'jpeg', quality: 0.92 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    },
    low: {
      image: { type: 'jpeg', quality: 0.8 },
      html2canvas: { 
        scale: 1.5,
        useCORS: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    }
  }
  
  return presets[preset] || presets.medium
}

/**
 * 验证浏览器是否支持PDF导出
 * @returns {Boolean} 是否支持
 */
export function isPDFExportSupported() {
  try {
    return !!(window.html2canvas && window.jsPDF)
  } catch (error) {
    return false
  }
}

/**
 * 计算PDF文件大小估算
 * @param {HTMLElement} element - 要计算的元素
 * @returns {String} 估算大小
 */
export function estimatePDFSize(element) {
  const area = element.scrollWidth * element.scrollHeight
  const estimatedKB = Math.round(area / 10000) // 粗略估算
  
  if (estimatedKB < 1024) {
    return `约 ${estimatedKB} KB`
  } else {
    return `约 ${(estimatedKB / 1024).toFixed(1)} MB`
  }
}
