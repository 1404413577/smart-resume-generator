<template>
  <div class="module-navigation">
    <!-- AI生成简历按钮 - 置顶显示 -->
    <div class="ai-generate-section">
      <el-button @click="handleAIGenerate" type="success" size="default" class="ai-button">
        <el-icon><MagicStick /></el-icon>
        AI生成简历
      </el-button>
    </div>

    <!-- 主要导航区域 -->
    <div class="main-navigation">
      <!-- 模板选择 -->
      <div class="nav-section">
        <div
          class="nav-item"
          :class="{ active: activeSection === 'template' }"
          @click="toggleSection('template')"
        >
          <div class="nav-item-header">
            <el-icon><Setting /></el-icon>
            <span>模板设置</span>
            <el-icon class="expand-icon" :class="{ expanded: activeSection === 'template' }">
              <ArrowRight />
            </el-icon>
          </div>
        </div>

        <!-- 模板选择内容 -->
        <div v-show="activeSection === 'template'" class="nav-content">
          <div class="setting-group">
            <label class="setting-label">模板风格</label>
            <el-select v-model="selectedTemplate" @change="handleTemplateChange" size="small">
              <el-option
                v-for="template in templates"
                :key="template.id"
                :label="template.name"
                :value="template.id"
              />
            </el-select>
          </div>
        </div>
      </div>

      <!-- 简历模块 -->
      <div class="nav-section">
        <div
          class="nav-item"
          :class="{ active: activeSection === 'modules' }"
          @click="toggleSection('modules')"
        >
          <div class="nav-item-header">
            <el-icon><List /></el-icon>
            <span>简历内容</span>
            <el-icon class="expand-icon" :class="{ expanded: activeSection === 'modules' }">
              <ArrowRight />
            </el-icon>
          </div>
        </div>

        <!-- 模块列表内容 -->
        <div v-show="activeSection === 'modules'" class="nav-content">
          <div class="module-items">
            <div
              v-for="module in modules"
              :key="module.id"
              class="module-item"
              :class="{
                active: activeModule === module.id,
                'has-content': module.hasContent
              }"
              @click="handleModuleClick(module.id)"
            >
              <div class="module-icon">
                <el-icon>
                  <component :is="module.icon" />
                </el-icon>
              </div>
              <div class="module-info">
                <span class="module-name">{{ module.name }}</span>
                <span class="module-status">
                  {{ module.hasContent ? '已填写' : '未填写' }}
                </span>
              </div>
              <div class="module-actions">
                <el-icon class="drag-handle"><Rank /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 高级设置 -->
      <div class="nav-section">
        <div
          class="nav-item"
          :class="{ active: activeSection === 'advanced' }"
          @click="toggleSection('advanced')"
        >
          <div class="nav-item-header">
            <el-icon><Tools /></el-icon>
            <span>高级设置</span>
            <el-icon class="expand-icon" :class="{ expanded: activeSection === 'advanced' }">
              <ArrowRight />
            </el-icon>
          </div>
        </div>

        <!-- 高级设置内容 -->
        <div v-show="activeSection === 'advanced'" class="nav-content">
          <GlobalSettings />
        </div>
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <el-button @click="handleManageResumes" type="primary" size="small">
        <el-icon><Folder /></el-icon>
        简历管理
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  Setting, List, User, Document, Briefcase, School,
  Star, Folder, Rank, Plus, ArrowRight, Tools, MagicStick
} from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'
import GlobalSettings from './GlobalSettings.vue'

const props = defineProps({
  activeModule: {
    type: String,
    default: 'personalInfo'
  }
})

const emit = defineEmits(['module-change', 'template-change', 'manage-resumes', 'ai-generate'])

const resumeStore = useResumeStore()

// 模板选项
const templates = [
  { id: 'modern', name: '现代风格' },
  { id: 'classic', name: '经典风格' },
  { id: 'minimal', name: '简约风格' }
]

const selectedTemplate = ref(resumeStore.selectedTemplate)

// 导航状态管理
const activeSection = ref('modules') // 默认展开简历内容

// 切换导航区域
const toggleSection = (section) => {
  if (activeSection.value === section) {
    activeSection.value = null // 如果已经展开，则折叠
  } else {
    activeSection.value = section // 展开新的区域
  }
}

// 简历模块配置
const modules = computed(() => {
  const standardModules = [
    {
      id: 'personalInfo',
      name: '个人信息',
      icon: User,
      hasContent: !!resumeStore.resumeData.personalInfo.name
    },
    {
      id: 'summary',
      name: '个人简介',
      icon: Document,
      hasContent: !!resumeStore.resumeData.summary
    },
    {
      id: 'workExperience',
      name: '工作经历',
      icon: Briefcase,
      hasContent: resumeStore.resumeData.workExperience.length > 0
    },
    {
      id: 'education',
      name: '教育背景',
      icon: School,
      hasContent: resumeStore.resumeData.education.length > 0
    },
    {
      id: 'skills',
      name: '技能特长',
      icon: Star,
      hasContent: resumeStore.resumeData.skills.length > 0
    },
    {
      id: 'projects',
      name: '项目经历',
      icon: Folder,
      hasContent: resumeStore.resumeData.projects.length > 0
    }
  ]

  // 添加自定义模块
  const customModules = resumeStore.globalSettings.customModules.map(module => ({
    id: `custom-${module.id}`,
    name: module.name,
    icon: Plus,
    hasContent: hasCustomModuleContent(module.id),
    isCustom: true,
    moduleData: module
  }))

  return [...standardModules, ...customModules]
})

// 检查自定义模块是否有内容
const hasCustomModuleContent = (moduleId) => {
  const data = resumeStore.getCustomModuleData(moduleId)
  if (!data) return false

  // 检查是否有任何字段有值
  for (const key in data) {
    if (key === 'items') {
      if (data.items && data.items.length > 0) return true
    } else {
      if (data[key] && data[key].toString().trim()) return true
    }
  }
  return false
}

// 事件处理
const handleModuleClick = (moduleId) => {
  emit('module-change', moduleId)
}

const handleTemplateChange = (templateId) => {
  resumeStore.setTemplate(templateId)
  emit('template-change', templateId)
}





const handleManageResumes = () => {
  emit('manage-resumes')
}

const handleAIGenerate = () => {
  emit('ai-generate')
}
</script>

<style scoped>
.module-navigation {
  height: 100vh;
  background: #fafbfc;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* AI生成按钮区域样式 */
.ai-generate-section {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
  flex-shrink: 0;
}

.ai-generate-section .ai-button {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  border: none;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
  transition: all 0.3s ease;
  border-radius: 8px;
}

.ai-generate-section .ai-button:hover {
  background: linear-gradient(135deg, #85ce61 0%, #67c23a 100%);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
  transform: translateY(-1px);
}

.ai-generate-section .ai-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);
}

/* 主导航区域 */
.main-navigation {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 导航区域 */
.nav-section {
  border-bottom: 1px solid #e4e7ed;
}

/* 导航项 */
.nav-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: #f0f2f5;
}

.nav-item.active {
  background: #e6f7ff;
}

.nav-item-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  user-select: none;
}

.nav-item-header .el-icon {
  font-size: 16px;
  color: #409eff;
}

.expand-icon {
  margin-left: auto;
  transition: transform 0.2s ease;
  color: #909399 !important;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

/* 导航内容 */
.nav-content {
  padding: 0 20px 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e4e7ed;
}

/* 设置组样式 */
.setting-group {
  margin-bottom: 16px;
}

.setting-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}



/* 模块列表样式 */
.module-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
}

/* 模块项样式 */
.module-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  margin: 2px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.module-item:hover {
  background: #f0f2f5;
}

.module-item.active {
  background: #e6f7ff;
  border-color: #409eff;
}

.module-item.has-content .module-icon {
  color: #67c23a;
}

.module-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  border-radius: 4px;
  margin-right: 10px;
  color: #909399;
  transition: all 0.2s ease;
}

.module-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.module-name {
  font-size: 12px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 1px;
}

.module-status {
  font-size: 10px;
  color: #909399;
}

.module-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.module-item:hover .module-actions {
  opacity: 1;
}

.drag-handle {
  cursor: grab;
  color: #c0c4cc;
  font-size: 12px;
}

/* 操作按钮区域 */
.action-buttons {
  padding: 16px 20px;
  border-top: 1px solid #e4e7ed;
  background: #fafbfc;
}

.action-buttons .el-button {
  width: 100%;
  justify-content: flex-start;
  gap: 8px;
}

/* 滚动条样式 */
.main-navigation::-webkit-scrollbar {
  width: 4px;
}

.main-navigation::-webkit-scrollbar-track {
  background: transparent;
}

.main-navigation::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 2px;
}

.main-navigation::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-item-header {
    padding: 14px 16px;
    font-size: 13px;
  }

  .nav-content {
    padding: 0 16px 12px 16px;
  }

  .module-item {
    padding: 8px 10px;
    margin: 2px 6px;
  }

  .module-name {
    font-size: 11px;
  }

  .module-status {
    font-size: 9px;
  }

  .action-buttons {
    padding: 12px 16px;
  }

  .action-buttons .el-button {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>
