import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getTemplate } from '@templates'
import { generateOptimizedPDF } from '@utils/pdf/pdfGenerator'
import { generateMultiPageResumePDF } from '@utils/pdf/multiPagePdfGenerator'
import { exportResumeToDocx } from '@utils/word/exportDocx'

const createDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function useResumeExport(resumeStore, currentPageManager) {
  const isExporting = ref(false)
  const isExportingWord = ref(false)

  const exportPDF = async () => {
    try {
      isExporting.value = true
      await nextTick()

      const previewContainer = document.querySelector('.preview-container')
      const originalTransform = previewContainer?.style.transform
      if (previewContainer) {
        previewContainer.style.transform = 'none'
      }

      const filename = `${resumeStore.resumeData.personalInfo.name || '简历'}.pdf`
      const template = getTemplate(resumeStore.selectedTemplate)

      try {
        if (template?.isMultiPage && currentPageManager.value) {
          await generateMultiPageResumePDF(
            'resume-preview',
            filename,
            resumeStore.globalSettings?.pageSettings
          )
          ElMessage.success('多页PDF导出成功！')
        } else {
          await generateOptimizedPDF('resume-preview', filename)
          ElMessage.success('PDF导出成功！')
        }
      } finally {
        if (previewContainer) {
          previewContainer.style.transform = originalTransform || ''
        }
      }
    } catch (error) {
      console.error('PDF导出失败:', error)
      ElMessage.error('PDF导出失败，请重试')
    } finally {
      isExporting.value = false
    }
  }

  const exportWord = async () => {
    try {
      isExportingWord.value = true
      await nextTick()
      const name = resumeStore.resumeData.personalInfo?.name?.trim()
      const filename = `${name || '简历'}.docx`
      const blob = await exportResumeToDocx(resumeStore.resumeData)
      createDownload(blob, filename)
      ElMessage.success('Word导出成功！')
    } catch (error) {
      console.error('Word导出失败:', error)
      ElMessage.error('Word导出失败，请重试')
    } finally {
      isExportingWord.value = false
    }
  }

  return {
    isExporting,
    isExportingWord,
    exportPDF,
    exportWord
  }
}
