<template>
  <div class="home-view">
    <!-- 三列布局简历编辑器 -->
    <div class="resume-builder-container">
      <!-- 左侧导航栏 -->
      <aside class="left-sidebar">
        <!-- AI助手区域 -->
        <div class="sidebar-section">
          <div class="section-header" @click="toggleSection('ai')">
            <el-icon><MagicStick /></el-icon>
            <span>AI智能助手</span>
            <el-icon class="expand-icon" :class="{ expanded: expandedSections.ai }">
              <ArrowRight />
            </el-icon>
          </div>
          <div v-show="expandedSections.ai" class="section-content">
            <div class="action-item ai-action" @click="handleAIGenerate">
              <el-icon class="action-icon"><MagicStick /></el-icon>
              <div class="action-info">
                <div class="action-name">智能生成简历</div>
                <div class="action-desc">对话式AI，个性化生成</div>
              </div>
              <div class="action-badge">AI</div>
            </div>
          </div>
        </div>

        <!-- 模板设置 -->
        <div class="sidebar-section">
          <div class="section-header" @click="toggleSection('template')">
            <el-icon><Grid /></el-icon>
            <span>模板设置</span>
            <el-icon class="expand-icon" :class="{ expanded: expandedSections.template }">
              <ArrowRight />
            </el-icon>
          </div>
          <div v-show="expandedSections.template" class="section-content">
            <div class="action-item template-action" @click="handleTemplateManage">
              <el-icon class="action-icon"><Document /></el-icon>
              <div class="action-info">
                <div class="action-name">选择模板</div>
                <div class="action-desc">浏览和应用简历模板</div>
              </div>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <!-- 简历内容 -->
        <div class="sidebar-section">
          <div class="section-header" @click="toggleSection('content')">
            <el-icon><Document /></el-icon>
            <span>简历内容</span>
            <el-icon class="expand-icon" :class="{ expanded: expandedSections.content }">
              <ArrowRight />
            </el-icon>
          </div>
          <div v-show="expandedSections.content" class="section-content">
            <div
              v-for="module in modules"
              :key="module.id"
              class="module-item"
              :class="{ active: activeModule === module.id }"
              @click="handleModuleChange(module.id)"
            >
              <el-icon><component :is="module.icon" /></el-icon>
              <div class="module-info">
                <div class="module-name">{{ module.name }}</div>
                <div class="module-status">{{ getModuleStatus(module.id) }}</div>
              </div>
              <el-icon class="module-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <!-- 样式设置 -->
        <div class="sidebar-section">
          <div class="section-header" @click="toggleSection('style')">
            <el-icon><Tools /></el-icon>
            <span>样式设置</span>
            <el-icon class="expand-icon" :class="{ expanded: expandedSections.style }">
              <ArrowRight />
            </el-icon>
          </div>
          <div v-show="expandedSections.style" class="section-content">
            <StyleSettings />
          </div>
        </div>


      </aside>

      <!-- 中间编辑区域 -->
      <main class="main-editor">
        <div class="editor-header">
          <h2 class="editor-title">
            <el-icon><component :is="getCurrentModuleIcon()" /></el-icon>
            {{ getCurrentModuleName() }}
          </h2>
        </div>
        <div class="editor-content">
          <component
            :is="currentEditor"
            :key="activeModule"
            @data-updated="handleDataUpdated"
          />
        </div>
      </main>

      <!-- 右侧预览区域 -->
      <aside class="right-preview">
        <div class="preview-header">
          <div class="preview-title">
            <h3>简历预览</h3>
            <div class="zoom-controls">
              <el-button @click="zoomOut" size="small" :icon="ZoomOut" :disabled="previewScale <= 0.5" />
              <span class="zoom-display">{{ Math.round(previewScale * 100) }}%</span>
              <el-button @click="zoomIn" size="small" :icon="ZoomIn" :disabled="previewScale >= 1.5" />
            </div>
          </div>
          <div class="preview-actions">
            <el-button @click="handleSectionSort" size="small" :icon="Sort">
              章节排序
            </el-button>
            <el-button @click="handleExportPDF" type="primary" size="small" :icon="Printer" :loading="isExporting">
              导出PDF
            </el-button>
          </div>
        </div>
        <div class="preview-content">
          <!-- 多页预览控制 -->
          <MultiPagePreviewControls
            v-if="currentPageManager"
            :page-manager="currentPageManager"
            :current-page="currentPreviewPage"
            :show-all-pages="showAllPages"
            @page-changed="handlePageChanged"
            @view-mode-changed="handleViewModeChanged"
            @apply-suggested-paging="handleApplySuggestedPaging"
          />

          <div class="preview-container" :style="{ transform: `scale(${previewScale})` }">
            <div id="resume-preview">
              <component
                v-if="currentTemplateComponent"
                :is="currentTemplateComponent"
                :resume-data="resumeStore.resumeData"
                :template-id="resumeStore.selectedTemplate"
                :page-settings="resumeStore.globalSettings?.pageSettings"
              />
              <ResumePreview v-else :scale="previewScale" />
            </div>
          </div>
        </div>
      </aside>

      <!-- 弹窗组件 -->
      <AdvancedAIResumeGenerator
        :visible="showAIGenerator"
        @update:visible="showAIGenerator = $event"
        @close="showAIGenerator = false"
        @resume-generated="handleResumeGenerated"
      />

      <TemplateManager
        v-model="showTemplateManager"
        @close="showTemplateManager = false"
        @template-applied="handleTemplateApplied"
      />

      <!-- 章节排序对话框 -->
      <SectionSortDialog
        v-model="showSectionSort"
        @order-changed="handleSectionOrderChanged"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  MagicStick,
  Grid,
  Document,
  ArrowRight,
  User,
  Briefcase,
  School,
  Star,
  FolderOpened,
  ZoomIn,
  ZoomOut,
  Sort,
  Tools,
  Printer
} from '@element-plus/icons-vue'
import { useResumeStore } from '@stores/resume'
import { generateOptimizedPDF } from '@utils/pdf/pdfGenerator'
import { generateMultiPageResumePDF } from '@utils/pdf/multiPagePdfGenerator'
import { useGlobalStyles } from '@/composables/useGlobalStyles'

// 组件导入
import AdvancedAIResumeGenerator from '@components/ai/AdvancedAIResumeGenerator.vue'
import SectionSortDialog from '@components/resume/SectionSortDialog.vue'
import TemplateManager from '@components/templates/TemplateManager.vue'
import ResumePreview from '@components/resume/ResumePreview.vue'
import StyleSettings from '@components/settings/StyleSettingsNew.vue'
import MultiPagePreviewControls from '@components/resume/MultiPagePreviewControls.vue'
import { getTemplate } from '@templates'

// 编辑器组件导入
import PersonalInfoEditor from '@components/resume/editors/PersonalInfoEditor.vue'
import SummaryEditor from '@components/resume/editors/SummaryEditor.vue'
import WorkExperienceEditor from '@components/resume/editors/WorkExperienceEditor.vue'
import EducationEditor from '@components/resume/editors/EducationEditor.vue'
import SkillsEditor from '@components/resume/editors/SkillsEditor.vue'
import ProjectsEditor from '@components/resume/editors/ProjectsEditor.vue'

const resumeStore = useResumeStore()

// 启用全局样式管理，实现实时预览
useGlobalStyles()

// 当前模板组件（使用新的统一模板系统）
const currentTemplateComponent = computed(() => {
  const template = getTemplate(resumeStore.selectedTemplate)
  return template?.component || null
})

// 当前页面管理器
const currentPageManager = computed(() => {
  const template = getTemplate(resumeStore.selectedTemplate)
  if (template?.isMultiPage && resumeStore.globalSettings?.pageSettings) {
    const { createMultiPageManager } = require('@/utils/multipage/pageManager')
    return createMultiPageManager(resumeStore.resumeData, resumeStore.globalSettings.pageSettings)
  }
  return null
})

// 响应式数据
const activeModule = ref('personalInfo')
const previewScale = ref(0.8)
const showAIGenerator = ref(false)
const showTemplateManager = ref(false)
const showSectionSort = ref(false)
const currentPreviewPage = ref(1)
const showAllPages = ref(false)

// 侧边栏展开状态
const expandedSections = ref({
  ai: false,
  template: false,
  content: true, // 默认展开简历内容
  style: false
})

// 模块配置
const modules = [
  { id: 'personalInfo', name: '个人信息', icon: User },
  { id: 'summary', name: '个人简介', icon: Document },
  { id: 'workExperience', name: '工作经历', icon: Briefcase },
  { id: 'education', name: '教育背景', icon: School },
  { id: 'skills', name: '技能特长', icon: Star },
  { id: 'projects', name: '项目经历', icon: FolderOpened }
]

// 编辑器组件映射
const editorComponents = {
  personalInfo: PersonalInfoEditor,
  summary: SummaryEditor,
  workExperience: WorkExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor
}

// 计算属性
const currentEditor = computed(() => {
  return editorComponents[activeModule.value] || PersonalInfoEditor
})

// 方法
const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

const handleModuleChange = (module) => {
  activeModule.value = module
}

const handleTemplateManage = () => {
  showTemplateManager.value = true
}

const handleAIGenerate = () => {
  showAIGenerator.value = true
}



const handleSectionSort = () => {
  showSectionSort.value = true
}

const handleSectionOrderChanged = (newOrder) => {
  ElMessage.success('章节排序已更新')
  // 这里可以添加额外的处理逻辑，比如刷新预览等
}

const handleDataUpdated = (data) => {
  // 数据更新处理
  console.log('Data updated:', data)
}

const getModuleStatus = (moduleId) => {
  // 根据模块ID返回状态
  const data = resumeStore.resumeData
  switch (moduleId) {
    case 'personalInfo':
      return data.personalInfo?.name ? '已填写' : '未填写'
    case 'summary':
      return data.summary ? '已填写' : '未填写'
    case 'workExperience':
      return data.workExperience?.length ? `${data.workExperience.length}项` : '未填写'
    case 'education':
      return data.education?.length ? `${data.education.length}项` : '未填写'
    case 'skills':
      return data.skills?.length ? `${data.skills.length}项` : '未填写'
    case 'projects':
      return data.projects?.length ? `${data.projects.length}项` : '未填写'
    default:
      return '未填写'
  }
}

const getCurrentModuleName = () => {
  const module = modules.find(m => m.id === activeModule.value)
  return module ? module.name : '编辑器'
}

const getCurrentModuleIcon = () => {
  const module = modules.find(m => m.id === activeModule.value)
  return module ? module.icon : Document
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

const isExporting = ref(false)

const handleExportPDF = async () => {
  try {
    isExporting.value = true
    await nextTick()

    const filename = `${resumeStore.resumeData.personalInfo.name || '简历'}.pdf`
    const template = getTemplate(resumeStore.selectedTemplate)

    // 检查是否为多页模板
    if (template?.isMultiPage && currentPageManager.value) {
      // 使用多页PDF生成器
      await generateMultiPageResumePDF(
        'resume-preview',
        filename,
        resumeStore.globalSettings?.pageSettings
      )
      ElMessage.success('多页PDF导出成功！')
    } else {
      // 使用标准PDF生成器
      await generateOptimizedPDF('resume-preview', filename)
      ElMessage.success('PDF导出成功！')
    }
  } catch (error) {
    console.error('PDF导出失败:', error)
    ElMessage.error('PDF导出失败，请重试')
  } finally {
    isExporting.value = false
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

// 多页预览控制事件处理
const handlePageChanged = (pageNumber) => {
  currentPreviewPage.value = pageNumber
}

const handleViewModeChanged = (showAll) => {
  showAllPages.value = showAll
}

const handleApplySuggestedPaging = (analysis) => {
  if (analysis && analysis.suggestedPages) {
    resumeStore.updateGlobalSettings({
      pageSettings: {
        ...resumeStore.globalSettings?.pageSettings,
        pageCount: analysis.suggestedPages
      }
    })
    ElMessage.success(`已应用${analysis.suggestedPages}页布局建议`)
  }
}
</script>

<style scoped>
.home-view {
  height: calc(100vh - 60px); /* 减去头部导航高度 */
  width: 100%;
  background: #f5f7fa;
}

.resume-builder-container {
  display: grid;
  grid-template-columns: 280px 4fr 6fr;
  height: calc(100vh - 60px);
  width: 100%;
  background: #f5f7fa;
  overflow: hidden;
}

/* 左侧导航栏 */
.left-sidebar {
  width: 280px;
  min-width: 280px;
  max-width: 280px;
  background: #ffffff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
}

.sidebar-section {
  border-bottom: 1px solid #f0f2f5;
}

/* 操作项样式 - 统一的按钮样式 */
.action-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #f0f2f5;
}

.action-item:hover {
  background: #f5f7fa;
  border-color: #e4e7ed;
}

.action-icon {
  color: #606266;
  font-size: 16px;
  flex-shrink: 0;
}

.action-info {
  flex: 1;
}

.action-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.action-desc {
  font-size: 11px;
  color: #909399;
  line-height: 1.3;
}

.action-arrow {
  color: #c0c4cc;
  font-size: 12px;
  flex-shrink: 0;
}

.action-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

/* AI助手特殊样式 */
.ai-action:hover {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.ai-action:hover .action-icon {
  color: #0ea5e9;
}

.ai-action:hover .action-name {
  color: #0ea5e9;
}

/* 模板操作特殊样式 */
.template-action:hover {
  background: #fefce8;
  border-color: #fde047;
}

.template-action:hover .action-icon {
  color: #eab308;
}

.template-action:hover .action-name {
  color: #eab308;
}

.template-action:hover .action-arrow {
  color: #eab308;
}

.section-desc {
  padding: 8px 16px 16px;
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin: 0;
  line-height: 1.3;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  gap: 12px;
}

.section-header:hover {
  background: #f5f7fa;
}

.section-header span {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.expand-icon {
  transition: transform 0.3s ease;
  color: #909399;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.section-content {
  padding: 0 16px 16px;
}

/* 样式设置特殊样式 */
.sidebar-section .section-content .style-settings {
  padding: 0;
}

.sidebar-section .section-content .style-settings .setting-group {
  margin-bottom: 16px;
  padding-bottom: 12px;
}

.sidebar-section .section-content .style-settings .group-title {
  font-size: 13px;
  margin-bottom: 8px;
}

.sidebar-section .section-content .style-settings .setting-item {
  margin-bottom: 12px;
}

.sidebar-section .section-content .style-settings .theme-presets {
  gap: 6px;
}

.sidebar-section .section-content .style-settings .theme-preset {
  padding: 6px;
}

.sidebar-section .section-content .style-settings .color-dot {
  width: 10px;
  height: 10px;
}

.section-button {
  width: 100%;
  padding: 8px 12px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.section-button:hover {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.module-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 12px;
}

.module-item:hover {
  background: #f5f7fa;
}

.module-item.active {
  background: #ecf5ff;
  border-left: 3px solid #409eff;
}

.module-item .el-icon {
  color: #606266;
  font-size: 16px;
}

.module-item.active .el-icon {
  color: #409eff;
}

.module-info {
  flex: 1;
}

.module-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.module-item.active .module-name {
  color: #409eff;
}

.module-status {
  font-size: 11px;
  color: #909399;
}

.module-arrow {
  color: #c0c4cc;
  font-size: 12px;
}

/* 中间编辑区域 */
.main-editor {
  min-width: 0; /* 允许内容缩小 */
  background: #ffffff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

.editor-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.editor-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* 右侧预览区域 */
.right-preview {
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

.preview-header {
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}


.preview-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-right: 16px;
}

.preview-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 6px;
}

.zoom-display {
  font-size: 12px;
  color: #606266;
  min-width: 35px;
  text-align: center;
  font-weight: 500;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.preview-container {
  transition: transform 0.3s ease;
  transform-origin: top center;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .resume-builder-container {
    grid-template-columns: 240px 4fr 6fr;
  }
}

@media (max-width: 1200px) {
  .resume-builder-container {
    grid-template-columns: 200px 4fr 6fr;
  }

  .editor-content {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .resume-builder-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    height: calc(100vh - 60px);
  }

  .left-sidebar {
    height: auto;
    max-height: 200px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .main-editor {
    min-height: 400px;
  }

  .right-preview {
    height: 400px;
  }
}
</style>
