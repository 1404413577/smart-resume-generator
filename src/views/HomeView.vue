<template>
  <div class="home-view">
    <!-- 三列布局简历编辑器 -->
    <div class="resume-builder-container" :class="{ 'is-mobile': isMobile }">
      <!-- 左侧导航栏 -->
      <aside class="left-sidebar" v-if="!isMobile || mobileActiveTab === 'ai'">
        <div class="workspace-header">
          <div class="workspace-label">本地工作区</div>
          <div class="workspace-title">简历编辑器</div>
          <div class="workspace-meta">
            <span>{{ completedModuleCount }}/{{ modules.length }} 项已填写</span>
            <span>浏览器本地保存</span>
          </div>
        </div>

        <!-- 简历内容 -->
        <div class="sidebar-section content-section">
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

        <div class="sidebar-section workspace-section">
          <div class="section-label">工作流</div>
          <div class="section-content">
            <div
              v-for="link in workspaceLinks"
              :key="link.path"
              class="module-item workspace-link"
              @click="handleWorkspaceLink(link.path)"
            >
              <el-icon><component :is="link.icon" /></el-icon>
              <div class="module-info">
                <div class="module-name">{{ link.name }}</div>
                <div class="module-status">{{ link.description }}</div>
              </div>
              <el-icon class="module-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <!-- 填写建议 -->
        <div class="sidebar-section suggestions-section" v-if="resumeSuggestions.length > 0">
          <div class="section-label">填写建议</div>
          <div class="section-content">
            <div
              v-for="rec in resumeSuggestions"
              :key="rec.id"
              class="recommendation-item"
              @click="handleSuggestion(rec)"
            >
              <el-icon class="rec-icon"><component :is="rec.icon" /></el-icon>
              <div class="rec-content">
                <div class="rec-title">{{ rec.title }}</div>
                <div class="rec-desc">{{ rec.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-footnote">
          <span>当前未启用云同步</span>
          <span>请定期导出备份</span>
        </div>

      </aside>

      <!-- 中间编辑区域 -->
      <main class="main-editor" v-if="!isMobile || mobileActiveTab === 'edit'">
        <div class="editor-header">
          <div class="editor-heading">
            <div class="editor-title-row">
              <el-icon><component :is="getCurrentModuleIcon()" /></el-icon>
              <h2 class="editor-title">{{ getCurrentModuleName() }}</h2>
            </div>
            <p class="editor-description">{{ getCurrentModuleDescription() }}</p>
          </div>
          <div class="editor-state">
            <span class="state-dot"></span>
            <span>{{ getModuleStatus(activeModule) }}</span>
          </div>
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
      <aside class="right-preview" v-if="!isMobile || mobileActiveTab === 'preview'">
        <div class="preview-header">
          <div class="preview-title">
            <div>
              <h3>简历预览</h3>
              <p>{{ resumeStore.selectedTemplate }} · A4 实时渲染</p>
            </div>
            <div class="zoom-controls" v-if="!isMobile">
              <el-button @click="zoomOut" size="small" :icon="ZoomOut" :disabled="previewScale <= 0.5" />
              <span class="zoom-display">{{ Math.round(previewScale * 100) }}%</span>
              <el-button @click="zoomIn" size="small" :icon="ZoomIn" :disabled="previewScale >= 1.5" />
            </div>
          </div>
          <div class="preview-actions">
            <el-button @click="handleSectionSort" size="small" :icon="Sort" v-if="!isMobile">
              章节排序
            </el-button>
            <el-button @click="handleExportPDF" type="primary" size="small" :icon="Printer" :loading="isExporting">
              导出PDF
            </el-button>
            <el-dropdown trigger="click" split-button type="default" size="small" @click="handleExportWord" v-if="!isMobile">
              导出Word
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="showTemplateUploader = true">模板导出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button @click="handleExportWord" size="small" :icon="Document" :loading="isExportingWord" v-else>
              Word
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

          <div class="preview-wrapper">
            <!-- 使用真实尺寸实现 WYSIWYG，缩放只用于视觉显示 -->
            <div class="preview-container" :style="getPreviewContainerStyle">
              <div id="resume-preview">
                <component
                  v-if="currentTemplateComponent"
                  :key="previewRenderKey"
                  :is="currentTemplateComponent"
                  :resume-data="resumeStore.resumeData"
                  :template-id="resumeStore.selectedTemplate"
                  :page-settings="resumeStore.globalSettings?.pageSettings"
                />
                <ResumePreview v-else :key="previewRenderKey" :scale="1" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 移动端底部切换栏 -->
      <div v-if="isMobile" class="mobile-tab-bar">
        <div class="tab-item" :class="{ active: mobileActiveTab === 'ai' }" @click="mobileActiveTab = 'ai'">
          <el-icon><AIMagic /></el-icon>
          <span>建议</span>
        </div>
        <div class="tab-item" :class="{ active: mobileActiveTab === 'edit' }" @click="mobileActiveTab = 'edit'">
          <el-icon><Edit /></el-icon>
          <span>编辑</span>
        </div>
        <div class="tab-item" :class="{ active: mobileActiveTab === 'preview' }" @click="mobileActiveTab = 'preview'">
          <el-icon><View /></el-icon>
          <span>预览</span>
        </div>
      </div>

      <!-- 章节排序对话框 -->
      <SectionSortDialog
        v-model="showSectionSort"
        @order-changed="handleSectionOrderChanged"
      />

      <!-- 模板上传对话框 -->
      <el-dialog
        v-model="showTemplateUploader"
        title="Word模板导出"
        width="800px"
        :close-on-click-modal="false"
      >
        <TemplateUploader
          @export-success="handleTemplateExportSuccess"
          @export-error="handleTemplateExportError"
        />
      </el-dialog>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
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
  Printer,
  Brush,
  MagicStick
} from '@element-plus/icons-vue'
import { useResumeStore } from '@stores/resume'
import { createMultiPageManager } from '@/utils/multipage/pageManager'
import { useGlobalStyles } from '@/composables/useGlobalStyles'
import { useResumeExport } from '@/composables/useResumeExport'
import { Edit, View, MagicStick as AIMagic } from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'

// 组件导入
import TemplateUploader from '@components/word/TemplateUploader.vue'
import SectionSortDialog from '@components/resume/SectionSortDialog.vue'
import ResumePreview from '@components/resume/ResumePreview.vue'
import { getTemplate } from '@templates'

// 编辑器组件导入
import PersonalInfoEditor from '@components/resume/editors/PersonalInfoEditor.vue'
import SummaryEditor from '@components/resume/editors/SummaryEditor.vue'
import WorkExperienceEditor from '@components/resume/editors/WorkExperienceEditor.vue'
import EducationEditor from '@components/resume/editors/EducationEditor.vue'
import SkillsEditor from '@components/resume/editors/SkillsEditor.vue'
import ProjectsEditor from '@components/resume/editors/ProjectsEditor.vue'

const resumeStore = useResumeStore()
const router = useRouter()

// 启用全局样式管理，实现实时预览
useGlobalStyles()

// 当前模板组件（使用新的统一模板系统）
const currentTemplateComponent = computed(() => {
  const template = getTemplate(resumeStore.selectedTemplate)
  return template?.component || null
})

const previewRenderKey = computed(() => {
  const personalInfo = resumeStore.resumeData.personalInfo || {}
  return [
    resumeStore.selectedTemplate,
    personalInfo.photoPosition || 'center',
    personalInfo.photo ? 'has-photo' : 'no-photo'
  ].join(':')
})

// 当前页面管理器
const currentPageManager = computed(() => {
  const template = getTemplate(resumeStore.selectedTemplate)
  if (template?.isMultiPage && resumeStore.globalSettings?.pageSettings) {
    return createMultiPageManager(resumeStore.resumeData, resumeStore.globalSettings.pageSettings)
  }
  return null
})

// 响应式数据
const activeModule = ref('personalInfo')
const previewScale = ref(0.8)
const showSectionSort = ref(false)
const currentPreviewPage = ref(1)
const showAllPages = ref(false)

// 响应式设计相关
const { width: windowWidth } = useWindowSize()
const isMobile = computed(() => windowWidth.value <= 768)
const mobileActiveTab = ref('edit') // 'edit', 'preview', 'ai'

// 侧边栏展开状态
const expandedSections = ref({
  content: true
})

// 填写建议
const resumeSuggestions = ref([
  {
    id: 1,
    title: '完善个人信息',
    description: '添加联系方式和基本信息',
    icon: User,
    action: 'personalInfo'
  },
  {
    id: 2,
    title: '补充工作经历',
    description: '添加职位、公司和主要成就',
    icon: Briefcase,
    action: 'workExperience'
  },
  {
    id: 3,
    title: '添加技能特长',
    description: '补充与目标职位相关的技能',
    icon: Star,
    action: 'skills'
  }
])

// 模块配置
const modules = [
  { id: 'personalInfo', name: '个人信息', icon: User, description: '联系方式、头像和目标职位' },
  { id: 'summary', name: '个人简介', icon: Document, description: '用简短段落说明经验和优势' },
  { id: 'workExperience', name: '工作经历', icon: Briefcase, description: '公司、职位、职责和可量化成果' },
  { id: 'education', name: '教育背景', icon: School, description: '学校、专业、学历和补充信息' },
  { id: 'skills', name: '技能特长', icon: Star, description: '按类别整理专业技能和熟练程度' },
  { id: 'projects', name: '项目经历', icon: FolderOpened, description: '项目背景、技术栈和个人贡献' }
]

const workspaceLinks = [
  { path: '/design', name: '设计与样式', description: '模板配色', icon: Brush },
  { path: '/ai-assistant', name: 'AI助手', description: '内容优化', icon: MagicStick }
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

const completedModuleCount = computed(() => {
  return modules.filter(module => getModuleStatus(module.id) !== '未填写').length
})

// 方法
const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

const handleModuleChange = (moduleId) => {
  activeModule.value = moduleId
  // 移动端优化：点击模块后自动切换到编辑标签页
  if (isMobile.value) {
    mobileActiveTab.value = 'edit'
  }
}

const handleWorkspaceLink = (path) => {
  router.push(path)
}

const handleSectionSort = () => {
  showSectionSort.value = true
}

const handleSectionOrderChanged = (newOrder) => {
  ElMessage.success('章节排序已更新')
  // 这里可以添加额外的处理逻辑，比如刷新预览等
}

const handleDataUpdated = (data) => {
  updateResumeSuggestions()
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

const getCurrentModuleDescription = () => {
  const module = modules.find(m => m.id === activeModule.value)
  return module?.description || '编辑当前简历章节'
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

// 计算预览容器的缩放样式（用于显示缩放效果，但不影响导出）
const getPreviewContainerStyle = computed(() => {
  let scale = previewScale.value
  
  // 移动端自动缩放：确保 A4 宽度适应屏幕
  if (isMobile.value) {
    const padding = 40 // 左右间距总和
    const availableWidth = windowWidth.value - padding
    const a4WidthInPx = 210 * 3.7795 // 210mm 转换为 px
    const autoScale = availableWidth / a4WidthInPx
    scale = autoScale
  }

  return {
    transform: `scale(${scale})`,
    transformOrigin: 'top center'
  }
})

const showTemplateUploader = ref(false)
const {
  isExporting,
  isExportingWord,
  exportPDF: handleExportPDF,
  exportWord: handleExportWord
} = useResumeExport(resumeStore, currentPageManager)

const handleTemplateExportSuccess = (result) => {
  showTemplateUploader.value = false
  ElMessage.success(`模板导出成功：${result.filename}`)
}

const handleTemplateExportError = (error) => {
  console.error('模板导出错误:', error)
  ElMessage.error('模板导出失败，请检查模板格式')
}

const handleResumeGenerated = (resumeData) => {
  ElMessage.success('简历已更新，您可以继续编辑和完善！')
  activeModule.value = 'personalInfo'
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

const handleSuggestion = (suggestion) => {
  switch (suggestion.action) {
    case 'personalInfo':
      activeModule.value = 'personalInfo'
      ElMessage.info('请完善个人信息')
      break
    case 'workExperience':
      activeModule.value = 'workExperience'
      ElMessage.info('请补充工作经历')
      break
    case 'skills':
      activeModule.value = 'skills'
      ElMessage.info('请补充技能特长')
      break
    default:
      ElMessage.info('请继续完善简历内容')
  }
}

// 更新填写建议
const updateResumeSuggestions = () => {
  const recommendations = []
  const data = resumeStore.resumeData

  // 检查个人信息完整度
  if (!data.personalInfo.name || !data.personalInfo.email) {
    recommendations.push({
      id: 1,
      title: '完善个人信息',
      description: '添加姓名、邮箱等基本信息',
      icon: User,
      action: 'personalInfo'
    })
  }

  // 检查工作经历
  if (!data.workExperience?.length) {
    recommendations.push({
      id: 2,
      title: '添加工作经历',
      description: '添加您的工作经验',
      icon: Briefcase,
      action: 'workExperience'
    })
  }

  // 检查技能
  if (!data.skills?.length) {
    recommendations.push({
      id: 4,
      title: '添加技能特长',
      description: '展示您的专业技能',
      icon: Star,
      action: 'skills'
    })
  }

  resumeSuggestions.value = recommendations.slice(0, 3) // 最多显示3个建议
}

// 生命周期钩子
onMounted(() => {
  updateResumeSuggestions()
})

// 监听简历数据变化，更新建议
watch(() => resumeStore.resumeData, () => {
  updateResumeSuggestions()
}, { deep: true })
</script>

<style scoped>
.home-view {
  height: calc(100vh - 60px); /* 减去头部导航高度 */
  width: 100%;
  background: #f4f6f8;
}

.resume-builder-container {
  display: grid;
  grid-template-columns: 276px minmax(360px, 4fr) minmax(520px, 6fr);
  height: calc(100vh - 60px);
  width: 100%;
  background: #f4f6f8;
  overflow: hidden;
}

/* 左侧导航栏 */
.left-sidebar {
  width: 100%;
  min-width: 0;
  max-width: 276px;
  background: #fbfcfd;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-section {
  border-bottom: 1px solid #f0f2f5;
}

.workspace-header {
  padding: 18px 18px 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #ffffff;
}

.workspace-label,
.section-label {
  font-size: 11px;
  line-height: 1;
  color: #909399;
  font-weight: 600;
}

.workspace-title {
  margin-top: 8px;
  font-size: 17px;
  line-height: 1.3;
  font-weight: 650;
  color: #1f2937;
}

.workspace-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 10px;
  font-size: 12px;
  color: #606266;
}

.content-section {
  background: #ffffff;
}

.section-label {
  padding: 16px 18px 8px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.recommendation-item:hover {
  color: #409eff;
}

.rec-icon {
  margin-top: 2px;
  color: #909399;
  flex-shrink: 0;
  font-size: 14px;
}

.rec-content {
  flex: 1;
  min-width: 0;
}

.rec-title {
  font-size: 12px;
  font-weight: 600;
  color: #303133;
}

.rec-desc {
  margin-top: 3px;
  font-size: 11px;
  color: #666;
  line-height: 1.4;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 16px 18px;
  cursor: pointer;
  transition: background 0.2s ease;
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
  padding: 0 14px 14px;
}

.module-item {
  display: flex;
  align-items: center;
  padding: 10px 10px;
  margin-bottom: 3px;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  gap: 12px;
}

.module-item:hover {
  background: #f5f7fa;
}

.module-item.active {
  background: #ecf5ff;
  box-shadow: inset 3px 0 0 #409eff;
}

.workspace-section {
  background: #fbfcfd;
}

.workspace-link {
  border: 1px solid #e4e7ed;
  background: #ffffff;
}

.workspace-link:hover {
  border-color: #409eff;
  box-shadow: none;
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
  font-weight: 600;
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

.suggestions-section {
  background: #ffffff;
}

.sidebar-footnote {
  margin-top: auto;
  padding: 14px 18px 18px;
  border-top: 1px solid #e4e7ed;
  color: #909399;
  font-size: 11px;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
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
  padding: 18px 24px;
  border-bottom: 1px solid #e4e7ed;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.editor-heading {
  min-width: 0;
}

.editor-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-title {
  font-size: 18px;
  font-weight: 650;
  color: #303133;
  margin: 0;
}

.editor-description {
  margin: 6px 0 0;
  color: #606266;
  font-size: 13px;
}

.editor-state {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border: 1px solid #e4e7ed;
  border-radius: 999px;
  color: #606266;
  font-size: 12px;
  white-space: nowrap;
}

.state-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #67c23a;
}

.editor-content {
  flex: 1;
  padding: 24px 28px;
  overflow-y: auto;
}

/* 右侧预览区域 */
.right-preview {
  background: #eef1f5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

.preview-header {
  padding: 14px 18px;
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
  font-weight: 650;
  color: #303133;
  margin: 0;
}

.preview-title p {
  margin: 4px 0 0;
  color: #909399;
  font-size: 12px;
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
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 600px; /* 确保预览区域有最小高度 */
}

.preview-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 297mm; /* 确保预览包装器有最小高度 */
}

.preview-container {
  background: white;
  box-shadow: 0 18px 40px rgba(31, 41, 55, 0.16);
  border-radius: 4px;
  overflow: visible; /* 修正长页面截断 Bug, 允许由于内容撑开 */
  width: 210mm; /* A4纸张宽度 */
  max-width: 210mm; /* 限制最大宽度 */
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .resume-builder-container {
    grid-template-columns: 248px minmax(340px, 4fr) minmax(500px, 6fr);
  }
}

@media (max-width: 1200px) {
  .resume-builder-container {
    grid-template-columns: 220px minmax(320px, 4fr) minmax(480px, 6fr);
  }

  .editor-content {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .resume-builder-container {
    display: block; /* 改为块级布局，配合 v-if 控制单列 */
    height: calc(100vh - 60px - 60px); /* 减去头部和底部 Tab Bar */
    overflow-y: auto;
  }

  .left-sidebar, .main-editor, .right-preview {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    border-right: none;
    overflow-y: auto;
  }

  .editor-header,
  .preview-header {
    align-items: stretch;
    flex-direction: column;
  }

  .preview-title {
    margin-right: 0;
  }

  .preview-content {
    padding: 10px;
    background: #f5f7fa;
  }

  .preview-container {
    margin: 0 auto;
    /* 缩放已经在内联样式中通过 getPreviewContainerStyle 处理 */
  }

  .mobile-tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #ffffff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #e4e7ed;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    z-index: 1000;
  }

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: #909399;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    padding: 8px 0;
  }

  .tab-item.active {
    color: #409eff;
  }

  .tab-item .el-icon {
    font-size: 20px;
  }

  .tab-item span {
    font-size: 11px;
    font-weight: 500;
  }
}
</style>
