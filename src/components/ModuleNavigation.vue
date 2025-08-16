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

      <div class="setting-group">
        <label class="setting-label">主题色彩</label>
        <div class="color-picker-group">
          <div
            v-for="color in themeColors"
            :key="color.name"
            class="color-option"
            :class="{ active: selectedColor === color.value }"
            :style="{ backgroundColor: color.value }"
            @click="handleColorChange(color.value)"
          />
        </div>
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

// 主题色彩选项
const themeColors = [
  { name: '蓝色', value: '#409EFF' },
  { name: '绿色', value: '#67C23A' },
  { name: '橙色', value: '#E6A23C' },
  { name: '红色', value: '#F56C6C' },
  { name: '紫色', value: '#909399' },
  { name: '深蓝', value: '#304156' }
]

const selectedTemplate = ref(resumeStore.selectedTemplate)
const selectedColor = ref('#409EFF')

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

const handleColorChange = (color) => {
  selectedColor.value = color
  // 这里可以添加主题色彩变更逻辑
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

.color-picker-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #303133;
  transform: scale(1.1);
}

.module-list {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  min-height: 0;
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
</style>
