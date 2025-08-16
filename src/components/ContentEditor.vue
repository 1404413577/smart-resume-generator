<template>
  <div class="content-editor">
    <div class="editor-header">
      <h2 class="editor-title">
        <el-icon>
          <component :is="currentModuleIcon" />
        </el-icon>
        {{ currentModuleName }}
      </h2>
      <div class="editor-actions">
        <el-button 
          v-if="showAIButton" 
          type="primary" 
          size="small"
          @click="handleAIGenerate"
        >
          <el-icon><MagicStick /></el-icon>
          AI辅助
        </el-button>
      </div>
    </div>

    <div class="editor-content">
      <div class="form-wrapper">
        <!-- 个人信息表单 -->
        <PersonalInfoForm v-if="activeModule === 'personalInfo'" />
        
        <!-- 个人简介表单 -->
        <SummaryForm v-if="activeModule === 'summary'" />
        
        <!-- 工作经历表单 -->
        <WorkExperienceForm v-if="activeModule === 'workExperience'" />
        
        <!-- 教育背景表单 -->
        <EducationForm v-if="activeModule === 'education'" />
        
        <!-- 技能特长表单 -->
        <SkillsForm v-if="activeModule === 'skills'" />
        
        <!-- 项目经历表单 -->
        <ProjectsForm v-if="activeModule === 'projects'" />

        <!-- 自定义模块表单 -->
        <CustomModuleEditor
          v-if="isCustomModule && currentCustomModule"
          :module="currentCustomModule"
        />

        <!-- 默认提示 -->
        <div v-if="!activeModule" class="empty-state">
          <el-icon class="empty-icon"><Document /></el-icon>
          <p class="empty-text">请从左侧选择要编辑的模块</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  User, Document, Briefcase, School, Star, Folder, MagicStick, Plus
} from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'

// 导入表单组件
import PersonalInfoForm from './forms/PersonalInfoForm.vue'
import SummaryForm from './forms/SummaryForm.vue'
import WorkExperienceForm from './forms/WorkExperienceForm.vue'
import EducationForm from './forms/EducationForm.vue'
import SkillsForm from './forms/SkillsForm.vue'
import ProjectsForm from './forms/ProjectsForm.vue'
import CustomModuleEditor from './CustomModuleEditor.vue'

const props = defineProps({
  activeModule: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['ai-generate'])

const resumeStore = useResumeStore()

// 检查是否是自定义模块
const isCustomModule = computed(() => {
  return props.activeModule && props.activeModule.startsWith('custom-')
})

// 获取自定义模块数据
const currentCustomModule = computed(() => {
  if (!isCustomModule.value) return null

  const moduleId = props.activeModule.replace('custom-', '')
  return resumeStore.globalSettings.customModules.find(module => module.id === moduleId)
})

// 模块配置映射
const moduleConfig = {
  personalInfo: {
    name: '个人信息',
    icon: User,
    hasAI: false
  },
  summary: {
    name: '个人简介',
    icon: Document,
    hasAI: true
  },
  workExperience: {
    name: '工作经历',
    icon: Briefcase,
    hasAI: true
  },
  education: {
    name: '教育背景',
    icon: School,
    hasAI: false
  },
  skills: {
    name: '技能特长',
    icon: Star,
    hasAI: true
  },
  projects: {
    name: '项目经历',
    icon: Folder,
    hasAI: true
  }
}

// 计算属性
const currentModuleName = computed(() => {
  if (isCustomModule.value && currentCustomModule.value) {
    return currentCustomModule.value.name
  }
  return moduleConfig[props.activeModule]?.name || '选择模块'
})

const currentModuleIcon = computed(() => {
  if (isCustomModule.value) {
    return Plus
  }
  return moduleConfig[props.activeModule]?.icon || Document
})

const showAIButton = computed(() => {
  if (isCustomModule.value) {
    return false // 自定义模块暂不支持AI生成
  }
  return moduleConfig[props.activeModule]?.hasAI || false
})

// 事件处理
const handleAIGenerate = () => {
  emit('ai-generate', props.activeModule)
}
</script>

<style scoped>
.content-editor {
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.editor-actions {
  display: flex;
  gap: 8px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.form-wrapper {
  padding: 24px;
  height: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  margin: 0;
}

/* 优化表单组件在新布局中的显示 */
.form-wrapper :deep(.el-card) {
  border: none;
  box-shadow: none;
  background: transparent;
}

.form-wrapper :deep(.el-card__header) {
  padding: 0 0 16px 0;
  background: transparent;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 20px;
}

.form-wrapper :deep(.el-card__body) {
  padding: 0;
}

.form-wrapper :deep(.card-header) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 滚动条样式 */
.editor-content::-webkit-scrollbar {
  width: 6px;
}

.editor-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.editor-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.editor-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
