<template>
  <div class="home-view">
    <!-- 三列布局简历编辑器 -->
    <div class="resume-builder-container">
      <!-- 左侧导航栏 -->
      <aside class="left-sidebar">
        <!-- AI助手区域 -->
        <div class="sidebar-section ai-assistant-section">
          <div class="section-header" @click="toggleSection('ai')">
            <div class="header-left">
              <el-icon><MagicStick /></el-icon>
              <span>AI智能助手</span>
              <div class="ai-status" :class="{ online: aiStatus.online }">
                <div class="status-dot"></div>
                <span class="status-text">{{ aiStatus.online ? '在线' : '离线' }}</span>
              </div>
            </div>
            <el-icon class="expand-icon" :class="{ expanded: expandedSections.ai }">
              <ArrowRight />
            </el-icon>
          </div>
          <div v-show="expandedSections.ai" class="section-content">
            <!-- 主要AI功能 -->
            <div class="ai-main-actions">
              <div class="action-item ai-action primary" @click="handleAIGenerate">
                <el-icon class="action-icon"><MagicStick /></el-icon>
                <div class="action-info">
                  <div class="action-name">智能对话助手</div>
                  <div class="action-desc">与AI对话，生成个性化简历</div>
                </div>
                <div class="action-badge">AI</div>
              </div>
            </div>

            <!-- 快速操作 -->
            <div class="ai-quick-actions">
              <div class="quick-actions-title">快速操作</div>
              <div class="quick-actions-grid">
                <div class="quick-action-item" @click="handleQuickOptimize">
                  <el-icon><Promotion /></el-icon>
                  <span>智能优化</span>
                </div>
                <div class="quick-action-item" @click="handleJobMatch">
                  <el-icon><Search /></el-icon>
                  <span>职位匹配</span>
                </div>
                <div class="quick-action-item" @click="handleQualityCheck">
                  <el-icon><TrendCharts /></el-icon>
                  <span>质量检查</span>
                </div>
                <div class="quick-action-item" @click="handleAIGenerate">
                  <el-icon><ChatRound /></el-icon>
                  <span>AI对话</span>
                </div>
              </div>
            </div>

            <!-- 智能推荐 -->
            <div class="ai-recommendations" v-if="aiRecommendations.length > 0">
              <div class="recommendations-title">
                <el-icon><Star /></el-icon>
                智能推荐
              </div>
              <div class="recommendations-list">
                <div
                  v-for="rec in aiRecommendations"
                  :key="rec.id"
                  class="recommendation-item"
                  @click="handleRecommendation(rec)"
                >
                  <div class="rec-icon">
                    <el-icon><component :is="rec.icon" /></el-icon>
                  </div>
                  <div class="rec-content">
                    <div class="rec-title">{{ rec.title }}</div>
                    <div class="rec-desc">{{ rec.description }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 开发模式下的AI测试按钮 -->
            <div v-if="isDevelopment" class="ai-dev-section">
              <div class="action-item ai-test-action" @click="showAITest = true">
                <el-icon class="action-icon"><Tools /></el-icon>
                <div class="action-info">
                  <div class="action-name">AI功能测试</div>
                  <div class="action-desc">测试API连接和功能</div>
                </div>
                <div class="action-badge dev">DEV</div>
              </div>
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

      <!-- AI测试面板对话框 (仅开发模式) -->
      <el-dialog
        v-model="showAITest"
        title="AI功能测试面板"
        width="90%"
        :before-close="() => showAITest = false"
        v-if="isDevelopment"
      >
        <AITestPanel />
      </el-dialog>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
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
  Printer,
  Promotion,
  Search,
  TrendCharts,
  ChatRound
} from '@element-plus/icons-vue'
import { useResumeStore } from '@stores/resume'
import { generateOptimizedPDF } from '@utils/pdf/pdfGenerator'
import { generateMultiPageResumePDF } from '@utils/pdf/multiPagePdfGenerator'
import { createMultiPageManager } from '@/utils/multipage/pageManager'
import { useGlobalStyles } from '@/composables/useGlobalStyles'

// 组件导入
import AdvancedAIResumeGenerator from '@components/ai/AdvancedAIResumeGenerator.vue'
import SectionSortDialog from '@components/resume/SectionSortDialog.vue'
import TemplateManager from '@components/templates/TemplateManager.vue'
import ResumePreview from '@components/resume/ResumePreview.vue'
import StyleSettings from '@components/settings/StyleSettingsNew.vue'
import MultiPagePreviewControls from '@components/resume/MultiPagePreviewControls.vue'
import AITestPanel from '@components/ai/AITestPanel.vue'
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
const showAITest = ref(false)

// 开发模式检测
const isDevelopment = computed(() => {
  return import.meta.env.MODE === 'development' || import.meta.env.DEV
})

// 侧边栏展开状态
const expandedSections = ref({
  ai: false,
  template: false,
  content: true, // 默认展开简历内容
  style: false
})

// AI助手状态
const aiStatus = ref({
  online: true,
  lastCheck: new Date()
})

// AI智能推荐
const aiRecommendations = ref([
  {
    id: 1,
    title: '完善个人信息',
    description: '添加联系方式和基本信息',
    icon: 'User',
    action: 'personalInfo'
  },
  {
    id: 2,
    title: '优化工作经历',
    description: '使用AI优化工作经历描述',
    icon: 'Briefcase',
    action: 'optimize-work'
  },
  {
    id: 3,
    title: '技能匹配分析',
    description: '分析技能与目标职位的匹配度',
    icon: 'TrendCharts',
    action: 'skill-match'
  }
])

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

// AI助手相关方法
const handleQuickOptimize = () => {
  if (!resumeStore.resumeData.personalInfo.name) {
    ElMessage.warning('请先填写基本信息')
    return
  }
  showAIGenerator.value = true
  ElMessage.info('正在启动AI智能优化...')
}

const handleJobMatch = () => {
  showAIGenerator.value = true
  ElMessage.info('正在启动职位匹配分析...')
}

const handleQualityCheck = () => {
  if (!resumeStore.resumeData.personalInfo.name) {
    ElMessage.warning('请先填写基本信息')
    return
  }
  showAIGenerator.value = true
  ElMessage.info('正在启动简历质量检查...')
}

const handleRecommendation = (recommendation) => {
  switch (recommendation.action) {
    case 'personalInfo':
      activeModule.value = 'personalInfo'
      ElMessage.info('请完善个人信息')
      break
    case 'optimize-work':
      if (!resumeStore.resumeData.workExperience?.length) {
        activeModule.value = 'workExperience'
        ElMessage.info('请先添加工作经历')
      } else {
        showAIGenerator.value = true
        ElMessage.info('正在启动工作经历优化...')
      }
      break
    case 'skill-match':
      showAIGenerator.value = true
      ElMessage.info('正在启动技能匹配分析...')
      break
    default:
      showAIGenerator.value = true
  }
}

// 检查AI服务状态
const checkAIStatus = async () => {
  try {
    // 这里可以添加实际的API检查逻辑
    aiStatus.value.online = true
    aiStatus.value.lastCheck = new Date()
  } catch (error) {
    aiStatus.value.online = false
    console.warn('AI服务检查失败:', error)
  }
}

// 更新AI推荐
const updateAIRecommendations = () => {
  const recommendations = []
  const data = resumeStore.resumeData

  // 检查个人信息完整度
  if (!data.personalInfo.name || !data.personalInfo.email) {
    recommendations.push({
      id: 1,
      title: '完善个人信息',
      description: '添加姓名、邮箱等基本信息',
      icon: 'User',
      action: 'personalInfo'
    })
  }

  // 检查工作经历
  if (!data.workExperience?.length) {
    recommendations.push({
      id: 2,
      title: '添加工作经历',
      description: '添加您的工作经验',
      icon: 'Briefcase',
      action: 'workExperience'
    })
  } else if (data.workExperience.some(work => !work.description || work.description.length < 50)) {
    recommendations.push({
      id: 3,
      title: '优化工作经历',
      description: '使用AI优化工作经历描述',
      icon: 'Promotion',
      action: 'optimize-work'
    })
  }

  // 检查技能
  if (!data.skills?.length) {
    recommendations.push({
      id: 4,
      title: '添加技能特长',
      description: '展示您的专业技能',
      icon: 'Star',
      action: 'skills'
    })
  }

  aiRecommendations.value = recommendations.slice(0, 3) // 最多显示3个推荐
}

// 生命周期钩子
onMounted(() => {
  // 初始化AI状态检查
  checkAIStatus()

  // 更新AI推荐
  updateAIRecommendations()

  // 定期检查AI状态
  setInterval(checkAIStatus, 30000) // 每30秒检查一次
})

// 监听简历数据变化，更新推荐
watch(() => resumeStore.resumeData, () => {
  updateAIRecommendations()
}, { deep: true })
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

/* AI助手区域特殊样式 */
.ai-assistant-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-bottom: 1px solid #e1e6ff;
}

.ai-assistant-section .section-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 0;
  border-radius: 0;
}

.ai-assistant-section .section-header .header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  font-size: 11px;
  opacity: 0.9;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff4757;
  animation: pulse 2s infinite;
}

.ai-status.online .status-dot {
  background: #2ed573;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.status-text {
  font-size: 10px;
  font-weight: 500;
}

/* AI主要操作 */
.ai-main-actions {
  padding: 12px;
}

.ai-action.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.ai-action.primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.ai-action.primary .action-icon {
  color: white;
}

.ai-action.primary .action-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 快速操作 */
.ai-quick-actions {
  padding: 0 12px 12px;
}

.quick-actions-title {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.quick-action-item:hover {
  background: #e3f2fd;
  border-color: #2196f3;
  transform: translateY(-1px);
}

.quick-action-item .el-icon {
  font-size: 16px;
  color: #2196f3;
  margin-bottom: 4px;
}

.quick-action-item span {
  font-size: 10px;
  color: #666;
  text-align: center;
  line-height: 1.2;
}

/* 智能推荐 */
.ai-recommendations {
  padding: 0 12px 12px;
}

.recommendations-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.recommendations-title .el-icon {
  color: #ffa726;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #fff3e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ffe0b2;
}

.recommendation-item:hover {
  background: #ffecb3;
  border-color: #ffa726;
  transform: translateX(2px);
}

.rec-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffa726;
  border-radius: 4px;
  flex-shrink: 0;
}

.rec-icon .el-icon {
  color: white;
  font-size: 12px;
}

.rec-content {
  flex: 1;
  min-width: 0;
}

.rec-title {
  font-size: 11px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.rec-desc {
  font-size: 10px;
  color: #666;
  line-height: 1.3;
}

/* 开发模式区域 */
.ai-dev-section {
  padding: 8px 12px;
  border-top: 1px solid #f0f2f5;
  background: #f8f9fa;
}

.ai-test-action {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
}

.ai-test-action:hover {
  background: #ffeaa7;
}

.ai-test-action .action-badge.dev {
  background: #fd79a8;
  color: white;
  font-size: 10px;
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
