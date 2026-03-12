<template>
  <div class="resume-builder-view" :class="{ 'preview-mode': resumeStore.isPreviewMode }">
    <!-- 左侧：模块导航区 -->
    <NavigationPanel
      v-show="!resumeStore.isPreviewMode"
      :active-module="activeModule"
      @module-change="handleModuleChange"
      @template-manage="handleTemplateManage"
      @ai-generate="handleAIGenerate"
      @ocr-import="handleOCRImport"
    />

    <!-- 中间：内容编辑区 -->
    <EditorPanel
      v-show="!resumeStore.isPreviewMode"
      :active-module="activeModule"
      @ai-generate="handleAIGenerate"
    />

    <!-- 右侧：简历预览区 -->
    <PreviewPanel
      :class="{ 'full-width': resumeStore.isPreviewMode }"
      :preview-scale="previewScale"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @reset-zoom="resetZoom"
      @export-pdf="handleExportPDF"
    />

    <!-- AI简历生成器 -->
    <AIResumeGenerator
      :visible="showAIGenerator"
      @update:visible="showAIGenerator = $event"
      @close="showAIGenerator = false"
      @resume-generated="handleResumeGenerated"
    />

    <!-- 模板管理器 -->
    <TemplateManager
      v-if="showTemplateManager"
      @close="showTemplateManager = false"
      @template-applied="handleTemplateApplied"
    />

    <!-- OCR 导入对话框 -->
    <OCRImport ref="ocrImportRef" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useResumeStore } from '@stores/resume'
import { printResume } from '@utils/pdf/browserPrint'

// 组件导入
import NavigationPanel from '@components/navigation/NavigationPanel.vue'
import EditorPanel from '@components/resume/EditorPanel.vue'
import PreviewPanel from '@components/resume/PreviewPanel.vue'
import AIResumeGenerator from '@components/ai/AIResumeGenerator.vue'
import OCRImport from '@components/resume/OCRImport.vue'
import TemplateManager from '@components/templates/TemplateManager.vue'

const resumeStore = useResumeStore()

// 响应式数据
const activeModule = ref('personalInfo')
const previewScale = ref(1)
const showAIGenerator = ref(false)
const showTemplateManager = ref(false)
const ocrImportRef = ref(null)


// 计算属性
const isExporting = computed(() => resumeStore.isExporting)

// 方法
const handleModuleChange = (module) => {
  activeModule.value = module
}

const handleTemplateManage = () => {
  showTemplateManager.value = true
}

const handleAIGenerate = () => {
  showAIGenerator.value = true
}

const handleOCRImport = () => {
  ocrImportRef.value?.show()
}



const zoomIn = () => {
  if (previewScale.value < 1.5) {
    previewScale.value = Math.min(1.5, previewScale.value + 0.1)
  }
}

const zoomOut = () => {
  if (previewScale.value > 0.5) {
    previewScale.value = Math.max(0.5, previewScale.value - 0.1)
  }
}

const resetZoom = () => {
  previewScale.value = 1
}

const handleExportPDF = async () => {
  try {
    resumeStore.setExporting(true)
    const name = resumeStore.resumeData.personalInfo.name || '简历'
    
    // 使用浏览器原生打印功能
    await printResume('resume-preview', {
      title: `${name}.pdf`,
      removeAfterPrint: true,
      addPrintStyles: true
    })
    
    ElMessage.success({
      message: 'PDF打印窗口已打开，请在打印对话框中选择"另存为PDF"',
      duration: 5000
    })
  } catch (error) {
    console.error('打印失败:', error)
    ElMessage.error('打印失败，请重试')
  } finally {
    resumeStore.setExporting(false)
  }
}

const handleResumeGenerated = (resumeData) => {
  ElMessage.success('AI简历已应用，您可以继续编辑和完善！')
  showAIGenerator.value = false
  activeModule.value = 'personalInfo'
}

const handleTemplateApplied = (templateData) => {
  ElMessage.success('模板已应用成功！')
  showTemplateManager.value = false
}
</script>

<style scoped>
.resume-builder-view {
  display: flex;
  height: 100%;
  width: 100%;
  background: #f5f7fa;
  overflow: hidden;
}

.resume-builder-view.preview-mode {
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.full-width {
  width: 100% !important;
  max-width: none !important;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .resume-builder-view {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .resume-builder-view {
    padding: 10px;
  }
}
</style>
