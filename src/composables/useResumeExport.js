import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { exportResumePdf, exportResumeWord } from '@/services/exportService'

export function useResumeExport(resumeStore, currentPageManager) {
  const isExporting = ref(false)
  const isExportingWord = ref(false)

  const exportPDF = async () => {
    try {
      isExporting.value = true
      await nextTick()

      const filename = `${resumeStore.resumeData.personalInfo.name || '简历'}.pdf`

      await exportResumePdf({
        elementId: 'resume-preview',
        filename,
        templateId: currentPageManager.value ? resumeStore.selectedTemplate : null,
        pageSettings: resumeStore.globalSettings?.pageSettings
      })
      ElMessage.success('PDF导出成功！')
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
      await exportResumeWord(resumeStore.resumeData, filename)
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
