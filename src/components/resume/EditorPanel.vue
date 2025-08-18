<template>
  <div class="editor-panel">
    <div class="editor-header">
      <h3 class="editor-title">{{ getModuleTitle(activeModule) }}</h3>
      <div class="editor-actions">
        <el-button @click="$emit('ai-generate')" type="success" size="small" :icon="MagicStick">
          AI助手
        </el-button>
      </div>
    </div>

    <div class="editor-content">
      <component
        :is="currentEditor"
        :key="activeModule"
        @data-updated="handleDataUpdated"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'

// 编辑器组件导入
import PersonalInfoEditor from './editors/PersonalInfoEditor.vue'
import SummaryEditor from './editors/SummaryEditor.vue'
import WorkExperienceEditor from './editors/WorkExperienceEditor.vue'
import EducationEditor from './editors/EducationEditor.vue'
import SkillsEditor from './editors/SkillsEditor.vue'
import ProjectsEditor from './editors/ProjectsEditor.vue'

const props = defineProps({
  activeModule: {
    type: String,
    required: true
  }
})

defineEmits(['ai-generate'])

// 模块标题映射
const moduleTitles = {
  personalInfo: '个人信息',
  summary: '个人简介',
  workExperience: '工作经历',
  education: '教育背景',
  skills: '技能特长',
  projects: '项目经历'
}

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
  return editorComponents[props.activeModule] || PersonalInfoEditor
})

// 方法
const getModuleTitle = (module) => {
  return moduleTitles[module] || '编辑器'
}

const handleDataUpdated = (data) => {
  // 数据更新处理逻辑可以在这里添加
  console.log('Editor data updated:', data)
}
</script>

<style scoped>
.editor-panel {
  flex: 1;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}

.editor-title {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.editor-actions {
  display: flex;
  gap: 8px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .editor-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
  }
  
  .editor-header {
    padding: 12px 15px;
  }
  
  .editor-title {
    font-size: 14px;
  }
  
  .editor-content {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .editor-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
