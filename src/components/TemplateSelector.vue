<template>
  <div class="template-selector">
    <el-dropdown trigger="click" @command="handleTemplateChange">
      <el-button type="primary" size="small">
        <el-icon><Grid /></el-icon>
        {{ currentTemplateName }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            v-for="template in availableTemplates" 
            :key="template.id"
            :command="template.id"
            :class="{ 'is-active': template.id === selectedTemplate }"
          >
            <div class="template-option">
              <div class="template-preview-mini" :style="getTemplatePreviewStyle(template)"></div>
              <div class="template-info">
                <div class="template-name">{{ template.name }}</div>
                <div class="template-desc">{{ template.description }}</div>
              </div>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided @click="openTemplateGallery">
            <div class="template-option">
              <el-icon><Plus /></el-icon>
              <span>更多模板...</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Grid, ArrowDown, Plus } from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'
import { getAllTemplates, getTemplateById } from '../muban/templateConfig.js'

const emit = defineEmits(['open-template-gallery'])

const resumeStore = useResumeStore()

// 可用模板
const availableTemplates = computed(() => {
  try {
    return getAllTemplates()
  } catch (error) {
    console.error('获取模板列表失败:', error)
    return []
  }
})

// 当前选中的模板
const selectedTemplate = computed(() => resumeStore.selectedTemplate)

// 当前模板名称
const currentTemplateName = computed(() => {
  const template = getTemplateById(selectedTemplate.value)
  return template?.name || '选择模板'
})

// 获取模板预览样式
const getTemplatePreviewStyle = (template) => {
  if (!template || !template.colors) {
    return {
      '--preview-background': '#ffffff',
      '--preview-primary': '#3b82f6'
    }
  }
  
  return {
    '--preview-background': template.colors.background || '#ffffff',
    '--preview-primary': template.colors.primary || '#3b82f6'
  }
}

// 处理模板切换
const handleTemplateChange = (templateId) => {
  try {
    resumeStore.setTemplate(templateId)
    const template = getTemplateById(templateId)
    ElMessage.success(`已切换到 ${template?.name || templateId} 模板`)
  } catch (error) {
    console.error('切换模板失败:', error)
    ElMessage.error('切换模板失败，请重试')
  }
}

// 打开模板画廊
const openTemplateGallery = () => {
  emit('open-template-gallery')
}
</script>

<style scoped>
.template-selector {
  display: inline-block;
}

.template-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  min-width: 200px;
}

.template-preview-mini {
  width: 32px;
  height: 20px;
  background: var(--preview-background, #ffffff);
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
}

.template-preview-mini::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  height: 2px;
  background: var(--preview-primary, #3b82f6);
  border-radius: 1px;
}

.template-info {
  flex: 1;
  min-width: 0;
}

.template-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.template-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-dropdown-menu__item.is-active {
  background-color: #f5f7fa;
  color: #409eff;
}

.el-dropdown-menu__item.is-active .template-name {
  color: #409eff;
}
</style>
