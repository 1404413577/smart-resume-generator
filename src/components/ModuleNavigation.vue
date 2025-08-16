<template>
  <div class="module-navigation">
    <!-- 全局设置区域 -->
    <div class="global-settings">
      <h3 class="section-title">
        <el-icon><Setting /></el-icon>
        全局设置
      </h3>

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

    <!-- 模块列表区域 -->
    <div class="module-list">
      <h3 class="section-title">
        <el-icon><List /></el-icon>
        简历模块
      </h3>

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

    <!-- 高级设置区域 -->
    <div class="advanced-settings">
      <GlobalSettings />
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <el-button type="primary" @click="handleExportPDF" :loading="isExporting">
        <el-icon><Download /></el-icon>
        导出PDF
      </el-button>
      
      <el-button @click="handleManageResumes">
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
  Star, Folder, Download, Rank
} from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'
import GlobalSettings from './GlobalSettings.vue'

const props = defineProps({
  activeModule: {
    type: String,
    default: 'personalInfo'
  }
})

const emit = defineEmits(['module-change', 'template-change', 'export-pdf', 'manage-resumes'])

const resumeStore = useResumeStore()
const isExporting = ref(false)

// 模板选项
const templates = [
  { id: 'modern', name: '现代风格' },
  { id: 'classic', name: '经典风格' },
  { id: 'minimal', name: '简约风格' }
]

const selectedTemplate = ref(resumeStore.selectedTemplate)

// 简历模块配置
const modules = computed(() => [
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
])

// 事件处理
const handleModuleClick = (moduleId) => {
  emit('module-change', moduleId)
}

const handleTemplateChange = (templateId) => {
  resumeStore.setTemplate(templateId)
  emit('template-change', templateId)
}



const handleExportPDF = () => {
  isExporting.value = true
  emit('export-pdf')
  setTimeout(() => {
    isExporting.value = false
  }, 2000)
}

const handleManageResumes = () => {
  emit('manage-resumes')
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

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.global-settings {
  padding: 20px 16px;
  border-bottom: 1px solid #e4e7ed;
}

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



.module-list {
  padding: 20px 0;
  border-bottom: 1px solid #e4e7ed;
}

.advanced-settings {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  max-height: calc(100vh - 400px); /* 确保有固定的最大高度 */
  padding: 0;
  /* 平滑滚动 */
  scroll-behavior: smooth;
  /* 确保在移动设备上也能滚动 */
  -webkit-overflow-scrolling: touch;
}

.module-items {
  padding: 0 8px;
}

.module-item {
  display: flex;
  align-items: center;
  padding: 12px 8px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.module-item:hover {
  background: #f0f2f5;
}

.module-item.active {
  background: #e6f7ff;
  border-color: #409EFF;
}

.module-item.has-content .module-icon {
  color: #67C23A;
}

.module-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  border-radius: 6px;
  margin-right: 12px;
  color: #909399;
  transition: all 0.2s;
}

.module-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.module-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.module-status {
  font-size: 11px;
  color: #909399;
}

.module-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.module-item:hover .module-actions {
  opacity: 1;
}

.drag-handle {
  cursor: grab;
  color: #c0c4cc;
}

.action-buttons {
  padding: 16px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-buttons .el-button {
  width: 100%;
  justify-content: flex-start;
}

/* 滚动条样式 */
.module-list::-webkit-scrollbar {
  width: 4px;
}

.module-list::-webkit-scrollbar-track {
  background: transparent;
}

.module-list::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 2px;
}

.module-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 高级设置区域滚动条样式 */
.advanced-settings::-webkit-scrollbar {
  width: 4px;
}

.advanced-settings::-webkit-scrollbar-track {
  background: transparent;
}

.advanced-settings::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 2px;
}

.advanced-settings::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 - 确保在不同屏幕尺寸下滚动正常 */
@media (max-height: 800px) {
  .advanced-settings {
    max-height: calc(100vh - 350px);
  }
}

@media (max-height: 600px) {
  .advanced-settings {
    max-height: calc(100vh - 300px);
  }
}

/* 确保在小屏幕设备上滚动条可见 */
@media (max-width: 768px) {
  .advanced-settings::-webkit-scrollbar {
    width: 6px;
  }
}
</style>
