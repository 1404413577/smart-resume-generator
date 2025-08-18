<template>
  <div class="home-view">
    <!-- 三列布局简历编辑器 -->
    <div class="resume-builder-container">
      <!-- 左侧导航栏 -->
      <aside class="left-sidebar">
        <!-- AI助手区域 -->
        <div class="sidebar-section">
          <button @click="handleAIGenerate" class="ai-button">
            <el-icon><MagicStick /></el-icon>
            AI智能助手
          </button>
          <p class="section-desc">对话式AI，智能生成个性化简历</p>
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
            <button @click="handleTemplateManage" class="section-button">
              选择模板
            </button>
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

        <!-- 高级设置 -->
        <div class="sidebar-section">
          <div class="section-header" @click="toggleSection('advanced')">
            <el-icon><Setting /></el-icon>
            <span>高级设置</span>
            <el-icon class="expand-icon" :class="{ expanded: expandedSections.advanced }">
              <ArrowRight />
            </el-icon>
          </div>
          <div v-show="expandedSections.advanced" class="section-content">
            <button @click="handleManageResumes" class="section-button">
              简历管理
            </button>
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
          <el-button @click="handleSectionSort" size="small" :icon="Sort">
            章节排序
          </el-button>
        </div>
        <div class="preview-content">
          <div class="preview-container" :style="{ transform: `scale(${previewScale})` }">
            <ResumePreview :scale="previewScale" />
          </div>
        </div>
      </aside>

      <!-- 弹窗组件 -->
      <AIResumeGenerator
        :visible="showAIGenerator"
        @update:visible="showAIGenerator = $event"
        @close="showAIGenerator = false"
        @resume-generated="handleResumeGenerated"
      />

      <TemplateManager
        v-if="showTemplateManager"
        @close="showTemplateManager = false"
        @template-applied="handleTemplateApplied"
      />

      <ResumeManager
        :visible="showResumeManager"
        @update:visible="showResumeManager = $event"
        @close="showResumeManager = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  MagicStick,
  Grid,
  Document,
  Setting,
  ArrowRight,
  User,
  Briefcase,
  School,
  Star,
  FolderOpened,
  ZoomIn,
  ZoomOut,
  Sort
} from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'
import { generateOptimizedPDF } from '../utils/pdfGenerator'

// 组件导入
import AIResumeGenerator from '../components/ai/AIResumeGenerator.vue'
import TemplateManager from '../muban/TemplateManager.vue'
import ResumeManager from '../components/ResumeManager.vue'
import ResumePreview from '../components/resume/ResumePreview.vue'

// 编辑器组件导入
import PersonalInfoEditor from '../components/resume/editors/PersonalInfoEditor.vue'
import SummaryEditor from '../components/resume/editors/SummaryEditor.vue'
import WorkExperienceEditor from '../components/resume/editors/WorkExperienceEditor.vue'
import EducationEditor from '../components/resume/editors/EducationEditor.vue'
import SkillsEditor from '../components/resume/editors/SkillsEditor.vue'
import ProjectsEditor from '../components/resume/editors/ProjectsEditor.vue'

const resumeStore = useResumeStore()

// 响应式数据
const activeModule = ref('personalInfo')
const previewScale = ref(0.8)
const showAIGenerator = ref(false)
const showTemplateManager = ref(false)
const showResumeManager = ref(false)

// 侧边栏展开状态
const expandedSections = ref({
  template: false,
  content: true, // 默认展开简历内容
  advanced: false
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

const handleManageResumes = () => {
  showResumeManager.value = true
}

const handleSectionSort = () => {
  ElMessage.info('章节排序功能开发中...')
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

const handleExportPDF = async () => {
  try {
    resumeStore.setExporting(true)
    await generateOptimizedPDF('resume-preview', `${resumeStore.resumeData.personalInfo.name || '简历'}.pdf`)
    ElMessage.success('PDF导出成功！')
  } catch (error) {
    console.error('PDF导出失败:', error)
    ElMessage.error('PDF导出失败，请重试')
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

.ai-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  border: none;
  color: white;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-button:hover {
  background: linear-gradient(135deg, #85ce61 0%, #67c23a 100%);
  transform: translateY(-1px);
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
