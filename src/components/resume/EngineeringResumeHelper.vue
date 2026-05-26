<template>
  <div class="engineering-helper" v-if="showHelper">
    <el-card class="helper-card">
      <template #header>
        <div class="helper-header">
          <div class="header-title">
            <el-icon><Tools /></el-icon>
            <span>工科简历优化建议</span>
          </div>
          <el-button 
            size="small" 
            text 
            @click="showHelper = false"
            :icon="Close"
          />
        </div>
      </template>

      <!-- 内容分析 -->
      <div class="content-analysis">
        <h4>内容完整度分析</h4>
        <div class="analysis-grid">
          <div 
            v-for="section in sectionAnalysis" 
            :key="section.key"
            class="analysis-item"
            :class="section.status"
          >
            <div class="analysis-icon">
              <el-icon v-if="section.status === 'complete'"><CircleCheck /></el-icon>
              <el-icon v-else-if="section.status === 'partial'"><Warning /></el-icon>
              <el-icon v-else><CircleClose /></el-icon>
            </div>
            <div class="analysis-content">
              <div class="section-name">{{ section.name }}</div>
              <div class="section-suggestion">{{ section.suggestion }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术内容建议 -->
      <div class="tech-suggestions" v-if="techSuggestions.length > 0">
        <h4>技术内容建议</h4>
        <div class="suggestions-list">
          <div 
            v-for="suggestion in techSuggestions" 
            :key="suggestion.id"
            class="suggestion-item"
          >
            <div class="suggestion-icon">
              <el-icon><Sunny /></el-icon>
            </div>
            <div class="suggestion-content">
              <div class="suggestion-title">{{ suggestion.title }}</div>
              <div class="suggestion-desc">{{ suggestion.description }}</div>
              <el-button 
                v-if="suggestion.action"
                size="small" 
                type="primary" 
                text
                @click="applySuggestion(suggestion)"
              >
                {{ suggestion.actionText }}
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 多页布局建议 -->
      <div class="layout-suggestions" v-if="layoutSuggestion">
        <h4>布局优化建议</h4>
        <div class="layout-card">
          <div class="layout-info">
            <div class="layout-status" :class="layoutSuggestion.type">
              <el-icon v-if="layoutSuggestion.type === 'warning'"><Warning /></el-icon>
              <el-icon v-else><InfoFilled /></el-icon>
              <span>{{ layoutSuggestion.message }}</span>
            </div>
            <div class="layout-details">
              <p>{{ layoutSuggestion.details }}</p>
              <div class="layout-stats">
                <span>预估内容高度: {{ layoutSuggestion.estimatedHeight }}px</span>
                <span>建议页数: {{ layoutSuggestion.suggestedPages }}页</span>
              </div>
            </div>
          </div>
          <div class="layout-actions" v-if="layoutSuggestion.canApply">
            <el-button 
              type="primary" 
              size="small"
              @click="applyLayoutSuggestion"
            >
              应用建议
            </el-button>
          </div>
        </div>
      </div>

      <!-- 工科简历模板推荐 -->
      <div class="template-recommendations" v-if="!isUsingEngineeringTemplate">
        <h4>模板推荐</h4>
        <div class="template-card">
          <div class="template-info">
            <div class="template-icon">🔧</div>
            <div class="template-details">
              <div class="template-name">工科多页模板</div>
              <div class="template-desc">专为技术内容丰富的简历设计，支持多页布局</div>
              <div class="template-features">
                <el-tag size="small">多页支持</el-tag>
                <el-tag size="small">技术导向</el-tag>
                <el-tag size="small">项目突出</el-tag>
              </div>
            </div>
          </div>
          <div class="template-actions">
            <el-button 
              type="primary" 
              size="small"
              @click="recommendEngineeringTemplate"
            >
              切换模板
            </el-button>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions">
        <div class="actions-grid">
          <el-button 
            size="small" 
            @click="addTechnicalProject"
            :icon="Plus"
          >
            添加技术项目
          </el-button>
          <el-button 
            size="small" 
            @click="addTechnicalSkill"
            :icon="Plus"
          >
            添加技术技能
          </el-button>
          <el-button
            size="small"
            @click="optimizeForATS"
            :icon="Document"
          >
            ATS优化
          </el-button>
          <el-button 
            size="small" 
            @click="generateTechSummary"
            :icon="MagicStick"
          >
            生成技术总结
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Tools,
  Close,
  CircleCheck,
  Warning,
  CircleClose,
  Sunny,
  InfoFilled,
  Plus,
  Document,
  MagicStick
} from '@element-plus/icons-vue'
import { useResumeStore } from '@stores/resume'
import { createMultiPageManager } from '@/utils/multipage/pageManager'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['template-change', 'content-update'])

const resumeStore = useResumeStore()
const showHelper = ref(props.visible)

// 监听外部可见性变化
watch(() => props.visible, (newVisible) => {
  showHelper.value = newVisible
})

// 章节分析
const sectionAnalysis = computed(() => {
  const data = resumeStore.resumeData
  
  return [
    {
      key: 'personalInfo',
      name: '个人信息',
      status: data.personalInfo?.name ? 'complete' : 'incomplete',
      suggestion: data.personalInfo?.name ? '信息完整' : '请完善基本信息'
    },
    {
      key: 'summary',
      name: '个人简介',
      status: data.summary && data.summary.length > 50 ? 'complete' : 
              data.summary ? 'partial' : 'incomplete',
      suggestion: !data.summary ? '建议添加技术背景总结' :
                  data.summary.length < 50 ? '建议扩展技术能力描述' : '内容充实'
    },
    {
      key: 'workExperience',
      name: '工作经历',
      status: data.workExperience?.length > 0 ? 'complete' : 'incomplete',
      suggestion: data.workExperience?.length > 0 ? '经历完整' : '请添加相关工作经验'
    },
    {
      key: 'projects',
      name: '项目经历',
      status: data.projects?.length >= 2 ? 'complete' :
              data.projects?.length > 0 ? 'partial' : 'incomplete',
      suggestion: !data.projects?.length ? '建议添加技术项目' :
                  data.projects.length < 2 ? '建议增加更多项目展示' : '项目丰富'
    },
    {
      key: 'skills',
      name: '技能特长',
      status: data.skills?.length >= 5 ? 'complete' :
              data.skills?.length > 0 ? 'partial' : 'incomplete',
      suggestion: !data.skills?.length ? '请添加技术技能' :
                  data.skills.length < 5 ? '建议补充更多技术栈' : '技能全面'
    }
  ]
})

// 技术内容建议
const techSuggestions = computed(() => {
  const suggestions = []
  const data = resumeStore.resumeData

  // 检查项目技术栈
  if (data.projects?.length > 0) {
    const hasDetailedTech = data.projects.some(p => p.technologies?.length >= 3)
    if (!hasDetailedTech) {
      suggestions.push({
        id: 'project-tech',
        title: '完善项目技术栈',
        description: '为每个项目添加详细的技术栈信息，突出技术能力',
        action: 'addProjectTech',
        actionText: '优化项目'
      })
    }
  }

  // 检查技能分类
  if (data.skills?.length > 0) {
    const hasCategories = data.skills.some(s => s.category)
    if (!hasCategories) {
      suggestions.push({
        id: 'skill-categories',
        title: '技能分类优化',
        description: '将技能按技术栈、工具、语言等分类，提高可读性',
        action: 'categorizeSkills',
        actionText: '分类技能'
      })
    }
  }

  return suggestions
})

// 布局建议
const layoutSuggestion = computed(() => {
  try {
    const pageManager = createMultiPageManager(
      resumeStore.resumeData, 
      resumeStore.globalSettings?.pageSettings || { pageCount: 1 }
    )
    const analysis = pageManager.analyzeContentOverflow()
    
    if (analysis.isOverflowing) {
      return {
        type: 'warning',
        message: '内容可能溢出单页',
        details: analysis.recommendation,
        estimatedHeight: analysis.totalHeight,
        suggestedPages: analysis.suggestedPages,
        canApply: true
      }
    } else {
      return {
        type: 'info',
        message: '当前布局合适',
        details: '内容适合当前页面设置',
        estimatedHeight: analysis.totalHeight,
        suggestedPages: 1,
        canApply: false
      }
    }
  } catch (error) {
    return null
  }
})

// 是否使用工科模板
const isUsingEngineeringTemplate = computed(() => {
  return resumeStore.selectedTemplate === 'multipage'
})

// 方法
const applySuggestion = (suggestion) => {
  switch (suggestion.action) {
    case 'addProjectTech':
      // 跳转到项目编辑
      emit('content-update', { section: 'projects', action: 'edit' })
      break
    case 'categorizeSkills':
      // 跳转到技能编辑
      emit('content-update', { section: 'skills', action: 'categorize' })
      break
  }
  ElMessage.success('已应用建议')
}

const applyLayoutSuggestion = () => {
  if (layoutSuggestion.value?.canApply) {
    resumeStore.updateGlobalSettings({
      pageSettings: {
        ...resumeStore.globalSettings?.pageSettings,
        pageCount: layoutSuggestion.value.suggestedPages
      }
    })
    ElMessage.success(`已应用${layoutSuggestion.value.suggestedPages}页布局`)
  }
}

const recommendEngineeringTemplate = () => {
  emit('template-change', 'multipage')
  ElMessage.success('已推荐工科多页模板')
}

const addTechnicalProject = () => {
  emit('content-update', { section: 'projects', action: 'add' })
}

const addTechnicalSkill = () => {
  emit('content-update', { section: 'skills', action: 'add' })
}

const optimizeForATS = () => {
  ElMessage.info('ATS优化功能开发中...')
}

const generateTechSummary = () => {
  ElMessage.info('AI技术总结生成功能开发中...')
}
</script>

<style scoped>
.engineering-helper {
  margin-bottom: 20px;
}

.helper-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.helper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #303133;
}

/* 内容分析 */
.content-analysis {
  margin-bottom: 24px;
}

.content-analysis h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.analysis-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.analysis-item.complete {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.analysis-item.partial {
  background: #fffbeb;
  border-color: #fed7aa;
}

.analysis-item.incomplete {
  background: #fef2f2;
  border-color: #fecaca;
}

.analysis-icon {
  flex-shrink: 0;
}

.analysis-item.complete .analysis-icon {
  color: #059669;
}

.analysis-item.partial .analysis-icon {
  color: #d97706;
}

.analysis-item.incomplete .analysis-icon {
  color: #dc2626;
}

.section-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
}

.section-suggestion {
  font-size: 12px;
  color: #6b7280;
}

/* 技术建议 */
.tech-suggestions {
  margin-bottom: 24px;
}

.tech-suggestions h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.suggestion-icon {
  flex-shrink: 0;
  color: #f59e0b;
}

.suggestion-title {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.suggestion-desc {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

/* 布局建议 */
.layout-suggestions {
  margin-bottom: 24px;
}

.layout-suggestions h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.layout-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.layout-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
}

.layout-status.warning {
  color: #d97706;
}

.layout-status.info {
  color: #0ea5e9;
}

.layout-details p {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #6b7280;
}

.layout-stats {
  display: flex;
  gap: 16px;
  font-size: 11px;
  color: #9ca3af;
}

/* 模板推荐 */
.template-recommendations {
  margin-bottom: 24px;
}

.template-recommendations h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.template-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.template-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.template-icon {
  font-size: 24px;
}

.template-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.template-desc {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.template-features {
  display: flex;
  gap: 6px;
}

.template-features .el-tag {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
}

/* 快速操作 */
.quick-actions h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .layout-card {
    flex-direction: column;
    gap: 12px;
  }

  .template-card {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
