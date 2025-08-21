/**
 * PDF导出功能
 * 支持将简历模板导出为高质量PDF文件
 */

import html2pdf from 'html2pdf.js'

// PDF导出默认设置
const PDF_EXPORT_SETTINGS = {
  margin: [10, 10, 10, 10],
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    letterRendering: true,
    allowTaint: false
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true
  }
}

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
 * 批量导出多个简历
 * @param {Array} elements - DOM元素数组
 * @param {Object} options - 导出选项
 */
export async function batchExportToPDF(elements, options = {}) {
  const results = []
  
  for (let i = 0; i < elements.length; i++) {
    try {
      const filename = `resume_${i + 1}_${new Date().getTime()}.pdf`
      const result = await exportToPDF(elements[i], {
        ...options,
        filename
      })
      results.push({ success: true, filename, result })
    } catch (error) {
      results.push({ success: false, error: error.message })
    }
  }
  
  return results
}

/**
 * 显示导出进度
 */
function showExportProgress() {
  // 创建进度提示元素
  const progressEl = document.createElement('div')
  progressEl.id = 'pdf-export-progress'
  progressEl.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 9999;
      text-align: center;
    ">
      <div>正在导出PDF...</div>
      <div style="margin-top: 10px;">
        <div style="
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          overflow: hidden;
        ">
          <div style="
            width: 100%;
            height: 100%;
            background: #409eff;
            animation: progress 2s infinite;
          "></div>
        </div>
      </div>
    </div>
    <style>
      @keyframes progress {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    </style>
  `
  
  document.body.appendChild(progressEl)
}

/**
 * 隐藏导出进度
 */
function hideExportProgress() {
  const progressEl = document.getElementById('pdf-export-progress')
  if (progressEl) {
    progressEl.remove()
  }
}

/**
 * 预处理导出元素
 * @param {HTMLElement} element - 要处理的元素
 */
export function preprocessExportElement(element) {
  // 克隆元素避免影响原始DOM
  const clonedElement = element.cloneNode(true)
  
  // 移除不需要的元素
  const elementsToRemove = clonedElement.querySelectorAll('.no-print, .edit-button, .action-button')
  elementsToRemove.forEach(el => el.remove())
  
  // 确保所有图片都已加载
  const images = clonedElement.querySelectorAll('img')
  const imagePromises = Array.from(images).map(img => {
    return new Promise((resolve) => {
      if (img.complete) {
        resolve()
      } else {
        img.onload = resolve
        img.onerror = resolve
      }
    })
  })
  
  return Promise.all(imagePromises).then(() => clonedElement)
}

/**
 * 获取推荐的PDF导出设置
 * @param {string} templateType - 模板类型
 */
export function getRecommendedSettings(templateType) {
  const settings = {
    modern: {
      margin: [8, 8, 8, 8],
      html2canvas: { scale: 2.5 }
    },
    classic: {
      margin: [12, 12, 12, 12],
      html2canvas: { scale: 2 }
    },
    creative: {
      margin: [6, 6, 6, 6],
      html2canvas: { scale: 3 }
    },
    professional: {
      margin: [10, 10, 10, 10],
      html2canvas: { scale: 2 }
    }
  }
  
  return {
    ...PDF_EXPORT_SETTINGS,
    ...settings[templateType]
  }
}
