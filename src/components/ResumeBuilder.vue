<template>
  <div class="resume-builder">
    <!-- 左侧：模块导航区 -->
    <div class="navigation-section">
      <ModuleNavigation
        :active-module="activeModule"
        @module-change="handleModuleChange"
        @template-change="handleTemplateChange"
        @export-pdf="handleExportPDF"
        @manage-resumes="handleManageResumes"
      />
    </div>

    <!-- 中间：内容编辑区 -->
    <div class="editor-section">
      <ContentEditor
        :active-module="activeModule"
        @ai-generate="handleAIGenerate"
      />
    </div>

    <!-- 右侧：简历预览区 -->
    <div class="preview-section" :class="{ 'full-width': resumeStore.isPreviewMode }">
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-title">
            <h3>简历预览</h3>
            <div class="zoom-controls">
              <el-button-group size="small">
                <el-button @click="zoomOut" :disabled="previewScale <= 0.5">
                  <el-icon><ZoomOut /></el-icon>
                </el-button>
                <el-button @click="resetZoom">
                  {{ Math.round(previewScale * 100) }}%
                </el-button>
                <el-button @click="zoomIn" :disabled="previewScale >= 1.5">
                  <el-icon><ZoomIn /></el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>

          <div class="preview-actions">
            <!-- 模板设置 -->
            <el-dropdown v-if="resumeStore.selectedTemplate === 'classic'" trigger="click">
              <el-button size="small">
                <el-icon><Setting /></el-icon>
                模板设置
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <div class="template-setting-item">
                      <span>标题对齐:</span>
                      <el-radio-group
                        :model-value="resumeStore.templateSettings.sectionTitleAlignment"
                        @update:model-value="updateTitleAlignment"
                        size="small"
                      >
                        <el-radio value="left">居左</el-radio>
                        <el-radio value="center">居中</el-radio>
                      </el-radio-group>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <!-- 章节排序 -->
            <el-button size="small" @click="showSectionOrder = true">
              <el-icon><Sort /></el-icon>
              章节排序
            </el-button>
          </div>
        </div>

        <div class="resume-preview-wrapper">
          <div
            class="resume-preview"
            id="resume-preview"
            :style="{ transform: `scale(${previewScale})`, transformOrigin: 'top left' }"
          >
            <component
              :is="currentTemplate"
              :resume-data="resumeStore.resumeData"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 章节排序对话框 -->
    <el-dialog
      v-model="showSectionOrder"
      title="章节排序"
      width="500px"
      :before-close="handleSectionOrderClose"
    >
      <SectionOrderManager />
      <template #footer>
        <el-button @click="showSectionOrder = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Setting, Sort, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'
import { generatePDF } from '../utils/pdfGenerator'

// 导入新的组件
import ModuleNavigation from './ModuleNavigation.vue'
import ContentEditor from './ContentEditor.vue'

// 导入模板组件
import ModernTemplate from './templates/ModernTemplate.vue'
import ClassicTemplate from './templates/ClassicTemplate.vue'

// 导入章节排序组件
import SectionOrderManager from './SectionOrderManager.vue'

const resumeStore = useResumeStore()

// 当前活跃的模块
const activeModule = ref('personalInfo')

// 章节排序对话框状态
const showSectionOrder = ref(false)

// 预览缩放比例
const previewScale = ref(0.8)

// 可用模板
const templates = [
  { id: 'modern', name: '现代风格' },
  { id: 'classic', name: '经典风格' },
  { id: 'minimal', name: '简约风格' }
]

// 当前选中的模板组件
const currentTemplate = computed(() => {
  const templateMap = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate
  }
  return templateMap[resumeStore.selectedTemplate] || ModernTemplate
})

// 模块切换处理
const handleModuleChange = (moduleId) => {
  activeModule.value = moduleId
}

// 模板切换处理
const handleTemplateChange = (templateId) => {
  resumeStore.setTemplate(templateId)
}

// AI生成处理
const handleAIGenerate = (moduleType) => {
  ElMessage.info(`正在为${moduleType}模块生成AI内容...`)
  // 这里可以添加具体的AI生成逻辑
}

// 简历管理处理
const handleManageResumes = () => {
  // 触发简历管理对话框
  ElMessage.info('打开简历管理')
}

// 缩放功能
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
  previewScale.value = 0.8
}

// 导出PDF处理
const handleExportPDF = async () => {
  try {
    // 临时重置缩放比例以确保PDF正常生成
    const originalScale = previewScale.value
    previewScale.value = 1

    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100))

    await generatePDF('resume-preview', `${resumeStore.resumeData.personalInfo.name || '简历'}.pdf`)
    ElMessage.success('PDF下载成功！')

    // 恢复原始缩放比例
    previewScale.value = originalScale
  } catch (error) {
    console.error('PDF生成失败:', error)
    ElMessage.error('PDF生成失败，请重试')
    // 确保恢复缩放比例
    previewScale.value = originalScale
  }
}

// 更新标题对齐方式
const updateTitleAlignment = (alignment) => {
  resumeStore.updateTemplateSetting('sectionTitleAlignment', alignment)
}

// 关闭章节排序对话框
const handleSectionOrderClose = () => {
  showSectionOrder.value = false
}
</script>

<style scoped>
.resume-builder {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 0;
  position: relative;
  align-items: stretch;
  max-width: 100vw;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

/* 左侧：模块导航区 (25%) */
.navigation-section {
  flex: 0 0 25%;
  min-width: 280px;
  max-width: 320px;
  height: 100vh;
  background: #fafbfc;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
}

/* 中间：内容编辑区 (35%) */
.editor-section {
  flex: 0 0 35%;
  min-width: 400px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
}

/* 右侧：简历预览区 (40%) */
.preview-section {
  flex: 1;
  min-width: 500px;
  height: 100vh;
  transition: all 0.3s ease;
  z-index: 10;
  background: white;
  overflow: hidden;
}

.preview-section.full-width {
  flex: 1;
  max-width: 100vw;
  height: 100vh;
}

.preview-container {
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.preview-header {
  flex-shrink: 0;
  padding: 16px 20px;
  background: #fafbfc;
  border-bottom: 1px solid #ebeef5;
}

.preview-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.preview-title h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.preview-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.resume-preview-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f8f9fa;
  padding: 20px;
  height: 0;
}

.resume-preview {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 32px;
  min-height: 800px;
  width: 100%;
  max-width: 210mm;
  margin: 0 auto;
  transform-origin: top center;
  transition: transform 0.2s ease;
}

.template-setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  min-width: 200px;
}

.template-setting-item span {
  font-weight: 600;
  color: #2c3e50;
  min-width: 60px;
}

/* 优化滚动条样式 */
.resume-preview-wrapper::-webkit-scrollbar {
  width: 6px;
}

.resume-preview-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.resume-preview-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.resume-preview-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .navigation-section {
    flex: 0 0 22%;
    min-width: 260px;
    max-width: 300px;
  }

  .editor-section {
    flex: 0 0 38%;
    min-width: 380px;
  }

  .preview-section {
    min-width: 480px;
  }
}

@media (max-width: 1200px) {
  .resume-builder {
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .navigation-section {
    flex: 0 0 150px;
    min-width: auto;
    max-width: none;
    width: 100%;
    height: 150px;
    overflow-y: auto;
  }

  .editor-section {
    flex: 1;
    min-width: auto;
    width: 100%;
    height: 0;
    overflow: hidden;
  }

  .preview-section {
    flex: 0 0 40%;
    min-width: auto;
    width: 100%;
    height: 40vh;
    min-height: 300px;
    overflow: hidden;
  }

  .preview-container {
    height: 100%;
  }
}


</style>
