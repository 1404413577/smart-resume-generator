<template>
  <el-dialog
    :model-value="visible"
    title="AI智能简历助手"
    width="90%"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
    @close="handleClose"
    class="ai-dialog"
  >
    <div class="generator-layout">
      <!-- 左侧：AI对话区域 -->
      <AIChatPanel
        :messages="messages"
        :is-thinking="isThinking"
        :quality-score="qualityScore"
        @send-message="handleSendMessage"
        @question-click="handleQuestionClick"
        @analyze-quality="handleAnalyzeQuality"
        @upload-jd="handleUploadJD"
      />

      <!-- 右侧：实时预览区域 -->
      <AIPreviewPanel
        :preview-data="previewData"
        @refresh-preview="handleRefreshPreview"
        @apply-to-editor="handleApplyToEditor"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  generateConversationalResponse,
  analyzeResumeQuality,
  analyzeJobMatch
} from '../../utils/aiService'
import { useResumeStore } from '../../stores/resume'

// 子组件导入
import AIChatPanel from './AIChatPanel.vue'
import AIPreviewPanel from './AIPreviewPanel.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'close', 'resume-generated'])

const resumeStore = useResumeStore()

// 响应式数据
const messages = ref([
  {
    role: 'assistant',
    content: '您好！我是您的AI简历顾问。我将通过对话的方式帮您创建一份完美的简历。首先，请告诉我您想要申请什么职位？',
    suggestions: ['明确职业目标', '准备相关经验', '突出核心技能'],
    questions: ['您的目标职位是什么？', '您有多少年相关经验？', '您最擅长的技能是什么？']
  }
])

const isThinking = ref(false)
const qualityScore = ref(0)
const previewData = ref(null)

// 用户档案
const userProfile = ref({
  career: '',
  experience: '',
  skills: [],
  goals: []
})

// 方法
const handleSendMessage = async (userInput) => {
  if (!userInput.trim() || isThinking.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userInput
  })

  isThinking.value = true

  try {
    // 调用AI对话服务
    const response = await generateConversationalResponse({
      messages: messages.value,
      currentStep: getCurrentStep(),
      userProfile: userProfile.value
    })

    // 添加AI回复
    messages.value.push({
      role: 'assistant',
      content: response.response,
      suggestions: response.suggestions,
      questions: response.questions
    })

    // 更新质量评分
    if (response.qualityScore) {
      qualityScore.value = response.qualityScore
    }

    // 更新预览数据
    if (response.resumeContent) {
      updatePreviewData(response.resumeContent)
    }
  } catch (error) {
    console.error('AI对话失败:', error)
    ElMessage.error('AI服务暂时不可用，请稍后重试')
  } finally {
    isThinking.value = false
  }
}

const handleQuestionClick = (question) => {
  handleSendMessage(question)
}

const handleAnalyzeQuality = async () => {
  if (!previewData.value) {
    ElMessage.warning('请先生成一些简历内容')
    return
  }

  try {
    const analysis = await analyzeResumeQuality(previewData.value)
    
    // 添加分析结果到对话
    messages.value.push({
      role: 'assistant',
      content: `我已经分析了您的简历质量。总体评分：${analysis.overallScore}分`,
      suggestions: analysis.improvements.map(imp => imp.suggestion),
      questions: ['需要我帮您优化哪个部分？', '您还想添加什么内容？']
    })

    qualityScore.value = analysis.overallScore
  } catch (error) {
    console.error('质量分析失败:', error)
    ElMessage.error('质量分析失败，请重试')
  }
}

const handleUploadJD = async (jobDescription) => {
  if (!jobDescription.trim()) {
    ElMessage.warning('请输入职位描述')
    return
  }

  try {
    const analysis = await analyzeJobMatch({
      resumeData: previewData.value,
      jobDescription: jobDescription
    })

    // 添加匹配分析结果到对话
    messages.value.push({
      role: 'assistant',
      content: `根据职位描述分析，您的简历匹配度为 ${analysis.matchScore}%。`,
      suggestions: analysis.recommendations.map(rec => rec.content),
      questions: ['需要我帮您优化匹配度吗？', '您想了解哪些技能需要补充？']
    })
  } catch (error) {
    console.error('JD匹配分析失败:', error)
    ElMessage.error('匹配分析失败，请重试')
  }
}

const handleRefreshPreview = () => {
  ElMessage.success('预览已刷新')
}

const handleApplyToEditor = () => {
  if (!previewData.value) {
    ElMessage.warning('没有可应用的内容')
    return
  }

  // 应用到简历编辑器
  if (previewData.value.personalInfo) {
    resumeStore.updatePersonalInfo(previewData.value.personalInfo)
  }
  
  if (previewData.value.summary) {
    resumeStore.updateSummary(previewData.value.summary)
  }

  if (previewData.value.workExperience?.length) {
    previewData.value.workExperience.forEach(work => {
      resumeStore.addWorkExperience(work)
    })
  }

  if (previewData.value.skills?.length) {
    previewData.value.skills.forEach(skill => {
      resumeStore.addSkill(skill)
    })
  }

  ElMessage.success('内容已应用到简历编辑器！')
  emit('resume-generated', previewData.value)
  handleClose()
}

const getCurrentStep = () => {
  const messageCount = messages.value.length
  if (messageCount <= 2) return 'career_selection'
  if (messageCount <= 6) return 'experience_input'
  if (messageCount <= 10) return 'skills_input'
  return 'optimization'
}

const updatePreviewData = (resumeContent) => {
  if (!previewData.value) {
    previewData.value = {
      personalInfo: {},
      summary: '',
      workExperience: [],
      skills: [],
      projects: []
    }
  }

  if (resumeContent.section && resumeContent.content) {
    previewData.value[resumeContent.section] = resumeContent.content
  }
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

// 监听对话变化，自动滚动
watch(messages, () => {
  nextTick(() => {
    // 滚动逻辑由子组件处理
  })
}, { deep: true })
</script>

<style scoped>
.ai-dialog {
  --el-dialog-border-radius: 16px;
}

.generator-layout {
  display: flex;
  height: 70vh;
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .generator-layout {
    flex-direction: column;
    height: auto;
  }
}
</style>
