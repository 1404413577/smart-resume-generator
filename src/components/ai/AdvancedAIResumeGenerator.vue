<template>
  <div class="advanced-ai-generator">
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
        <div class="chat-section">
          <div class="chat-header">
            <div class="ai-avatar">
              <el-icon><Avatar /></el-icon>
            </div>
            <div class="ai-info">
              <h3>AI简历顾问</h3>
              <p>我将帮您创建完美的简历</p>
            </div>
            <div class="quality-score" v-if="qualityScore > 0">
              <el-progress
                type="circle"
                :percentage="qualityScore"
                :width="60"
                :color="getScoreColor(qualityScore)"
              />
              <span class="score-label">质量评分</span>
            </div>
          </div>

          <div class="chat-messages" ref="chatMessages">
            <div
              v-for="(message, index) in messages"
              :key="index"
              class="message"
              :class="message.role"
            >
              <div class="message-avatar">
                <el-icon v-if="message.role === 'assistant'"><Avatar /></el-icon>
                <el-icon v-else><User /></el-icon>
              </div>
              <div class="message-content">
                <div class="message-text" v-html="formatMessage(message.content)"></div>

                <!-- 质量评分 -->
                <div v-if="message.qualityScore > 0" class="message-quality">
                  <div class="quality-title">简历质量评分：</div>
                  <div class="quality-score">
                    <el-progress
                      :percentage="message.qualityScore"
                      :color="getScoreColor(message.qualityScore)"
                      :stroke-width="6"
                    />
                    <span class="score-text">{{ message.qualityScore }}/100</span>
                  </div>
                </div>

                <!-- 改进建议 -->
                <div v-if="message.improvements?.length" class="message-improvements">
                  <div class="improvements-title">
                    <el-icon><TrendCharts /></el-icon>
                    改进建议：
                  </div>
                  <div class="improvements-list">
                    <div
                      v-for="(improvement, index) in message.improvements"
                      :key="index"
                      class="improvement-item"
                    >
                      <el-icon class="improvement-icon"><ArrowRight /></el-icon>
                      <span>{{ improvement }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="message.suggestions && message.suggestions.length" class="suggestions">
                  <h4>💡 建议</h4>
                  <ul>
                    <li v-for="suggestion in message.suggestions" :key="suggestion">
                      {{ suggestion }}
                    </li>
                  </ul>
                </div>
                <div v-if="message.questions && message.questions.length" class="questions">
                  <h4>❓ 相关问题</h4>
                  <div class="question-chips">
                    <el-tag
                      v-for="question in message.questions"
                      :key="question"
                      @click="handleQuestionClick(question)"
                      class="question-chip"
                      type="info"
                    >
                      {{ question }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isThinking" class="message assistant thinking">
              <div class="message-avatar">
                <el-icon class="rotating"><Loading /></el-icon>
              </div>
              <div class="message-content">
                <div class="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>AI正在思考中...</p>
              </div>
            </div>
          </div>

          <div class="chat-input">
            <div class="input-tools">
              <el-button
                size="small"
                @click="showJobDescriptionDialog = true"
                :icon="Document"
              >
                上传JD
              </el-button>
              <el-button
                size="small"
                @click="analyzeQuality"
                :icon="TrendCharts"
                :loading="analyzingQuality"
              >
                质量分析
              </el-button>
            </div>
            <div class="input-area">
              <el-input
                v-model="userInput"
                type="textarea"
                :rows="3"
                placeholder="告诉我您的背景信息，或者问我任何关于简历的问题..."
                @keydown.ctrl.enter="sendMessage"
                :disabled="isThinking"
              />
              <el-button
                type="primary"
                @click="sendMessage"
                :loading="isThinking"
                :disabled="!userInput.trim()"
                class="send-btn"
              >
                <el-icon><Promotion /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 右侧：预览和风格区域 -->
        <div class="preview-section">
          <el-tabs v-model="activeTab" class="preview-tabs">
            <el-tab-pane label="实时预览" name="preview">
              <div class="preview-header">
                <h3>实时预览</h3>
                <div class="preview-tools">
                  <el-button size="small" @click="refreshPreview" :icon="Refresh">
                    刷新
                  </el-button>
                  <el-button size="small" @click="applyToEditor" type="primary">
                    应用到编辑器
                  </el-button>
                </div>
              </div>

          <div class="preview-content">
            <div class="resume-preview" v-if="previewData">
              <!-- 个人信息预览 -->
              <div class="preview-section-item" v-if="previewData.personalInfo">
                <h4>个人信息</h4>
                <div class="personal-info">
                  <p><strong>{{ previewData.personalInfo.name || '姓名' }}</strong></p>
                  <p>{{ previewData.personalInfo.email || '邮箱' }}</p>
                  <p>{{ previewData.personalInfo.phone || '电话' }}</p>
                </div>
              </div>

              <!-- 个人简介预览 -->
              <div class="preview-section-item" v-if="previewData.summary">
                <h4>个人简介</h4>
                <p>{{ previewData.summary }}</p>
              </div>

              <!-- 工作经历预览 -->
              <div class="preview-section-item" v-if="previewData.workExperience?.length">
                <h4>工作经历</h4>
                <div
                  v-for="work in previewData.workExperience"
                  :key="work.company"
                  class="work-item"
                >
                  <h5>{{ work.jobTitle }} @ {{ work.company }}</h5>
                  <p class="work-period">{{ work.startDate }} - {{ work.endDate }}</p>
                  <ul>
                    <li v-for="resp in work.responsibilities" :key="resp">
                      {{ resp }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- 技能预览 -->
              <div class="preview-section-item" v-if="previewData.skills?.length">
                <h4>技能特长</h4>
                <div class="skills-grid">
                  <el-tag
                    v-for="skill in previewData.skills"
                    :key="skill.name"
                    class="skill-tag"
                  >
                    {{ skill.name }}
                  </el-tag>
                </div>
              </div>
            </div>

            <div v-else class="empty-preview">
              <el-icon class="empty-icon"><Document /></el-icon>
              <p>开始对话，AI将实时生成您的简历内容</p>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="随机风格" name="style">
          <RandomStyleSelector
            :career="getCurrentCareer()"
            :show-career-selector="false"
            @style-applied="handleStyleApplied"
            @style-previewed="handleStylePreviewed"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
      </div>

      <!-- JD上传对话框 -->
      <el-dialog
        v-model="showJobDescriptionDialog"
        title="上传职位描述"
        width="600px"
      >
        <el-input
          v-model="jobDescription"
          type="textarea"
          :rows="10"
          placeholder="请粘贴职位描述内容，AI将分析匹配度并提供优化建议..."
        />
        <template #footer>
          <el-button @click="showJobDescriptionDialog = false">取消</el-button>
          <el-button type="primary" @click="analyzeJobMatchHandler" :loading="analyzingJob">
            分析匹配度
          </el-button>
        </template>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import {
  Avatar,
  User,
  Loading,
  Document,
  TrendCharts,
  Promotion,
  Refresh,
  ArrowRight
} from '@element-plus/icons-vue'
import {
  generateConversationalResponse,
  analyzeResumeQuality,
  analyzeJobMatch,
  optimizeContent
} from '@utils/ai/aiService'
import { useResumeStore } from '@stores/resume'
import RandomStyleSelector from './RandomStyleSelector.vue'

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

const userInput = ref('')
const isThinking = ref(false)
const qualityScore = ref(0)
const previewData = ref(null)
const chatMessages = ref(null)
const activeTab = ref('preview') // 当前活跃的标签页

// JD分析相关
const showJobDescriptionDialog = ref(false)
const jobDescription = ref('')
const analyzingJob = ref(false)
const analyzingQuality = ref(false)

// 用户档案
const userProfile = ref({
  career: '',
  experience: '',
  skills: [],
  goals: []
})

// 计算属性
const getScoreColor = (score) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

const formatMessage = (content) => {
  if (!content) return ''
  return content.replace(/\n/g, '<br>')
}

// 方法
const sendMessage = async () => {
  if (!userInput.value.trim() || isThinking.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userInput.value
  })

  userInput.value = ''
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
      questions: response.questions,
      qualityScore: response.qualityScore,
      improvements: response.improvements
    })

    // 更新质量评分
    if (response.qualityScore) {
      qualityScore.value = response.qualityScore
    }

    // 更新预览数据
    if (response.resumeContent) {
      updatePreviewData(response.resumeContent)
    }

    // 滚动到底部
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('AI对话失败:', error)
    ElMessage.error('AI服务暂时不可用，请稍后重试')
  } finally {
    isThinking.value = false
  }
}

const handleQuestionClick = (question) => {
  userInput.value = question
  sendMessage()
}

const getCurrentStep = () => {
  // 根据对话历史判断当前步骤
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

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight
  }
}

const analyzeQuality = async () => {
  if (!previewData.value) {
    ElMessage.warning('请先生成一些简历内容')
    return
  }

  analyzingQuality.value = true
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
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('质量分析失败:', error)
    ElMessage.error('质量分析失败，请重试')
  } finally {
    analyzingQuality.value = false
  }
}

const analyzeJobMatchHandler = async () => {
  if (!jobDescription.value.trim()) {
    ElMessage.warning('请输入职位描述')
    return
  }

  analyzingJob.value = true
  try {
    const analysis = await analyzeJobMatch({
      resumeData: previewData.value,
      jobDescription: jobDescription.value
    })

    // 添加匹配分析结果到对话
    messages.value.push({
      role: 'assistant',
      content: `根据职位描述分析，您的简历匹配度为 ${analysis.matchScore}%。`,
      suggestions: analysis.recommendations.map(rec => rec.content),
      questions: ['需要我帮您优化匹配度吗？', '您想了解哪些技能需要补充？']
    })

    showJobDescriptionDialog.value = false
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('JD匹配分析失败:', error)
    ElMessage.error('匹配分析失败，请重试')
  } finally {
    analyzingJob.value = false
  }
}

const refreshPreview = () => {
  // 刷新预览逻辑
  ElMessage.success('预览已刷新')
}

const applyToEditor = () => {
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

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

// 随机风格处理方法
const getCurrentCareer = () => {
  // 从用户档案或对话中推断职业类型
  return userProfile.value.career || 'software-engineer'
}

const handleStyleApplied = (style) => {
  ElMessage.success(`已应用"${style.name}"风格！`)

  // 添加风格应用消息到对话
  messages.value.push({
    role: 'assistant',
    content: `我已经为您应用了"${style.name}"风格。这个风格采用了${style.colors.name}配色方案，${style.typography.name}字体，以及${style.spacing.name}间距设计。您觉得怎么样？`,
    suggestions: ['继续优化内容', '尝试其他风格', '应用到编辑器'],
    questions: ['您喜欢这个风格吗？', '需要调整什么地方？']
  })

  nextTick(() => {
    scrollToBottom()
  })
}

const handleStylePreviewed = ({ style, originalSettings }) => {
  ElMessage.info(`正在预览"${style.name}"风格，您可以随时切换回原来的设置`)
}

// 监听对话变化，自动滚动
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.advanced-ai-generator .ai-dialog {
  --el-dialog-border-radius: 16px;
}

.generator-layout {
  display: flex;
  height: 70vh;
  gap: 20px;
}

/* 左侧聊天区域 */
.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  gap: 15px;
}

.ai-avatar {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.ai-info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
}

.ai-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.quality-score {
  margin-left: auto;
  text-align: center;
}

.score-label {
  display: block;
  font-size: 12px;
  margin-top: 5px;
  opacity: 0.9;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  gap: 12px;
  animation: fadeInUp 0.3s ease-out;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.message.assistant .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.user .message-avatar {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.message-content {
  flex: 1;
  max-width: 80%;
}

.message.user .message-content {
  text-align: right;
}

.message-text {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  line-height: 1.5;
}

.message.user .message-text {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.suggestions, .questions {
  margin-top: 10px;
}

.suggestions h4, .questions h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.suggestions ul {
  margin: 0;
  padding-left: 20px;
  color: #666;
}

.suggestions li {
  margin-bottom: 4px;
  font-size: 13px;
}

.question-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-chip {
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.thinking .message-avatar .el-icon {
  animation: rotate 2s linear infinite;
}

.thinking-dots {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.thinking-dots span {
  width: 8px;
  height: 8px;
  background: #409eff;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
.thinking-dots span:nth-child(2) { animation-delay: -0.16s; }

.chat-input {
  padding: 20px;
  background: white;
  border-top: 1px solid #e4e7ed;
}

.input-tools {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.input-area {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.input-area .el-textarea {
  flex: 1;
}

.send-btn {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  padding: 0;
}

/* 右侧预览区域 */
.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
}

.preview-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

.preview-tabs :deep(.el-tab-pane) {
  height: 100%;
  overflow-y: auto;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e4e7ed;
}

.preview-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.preview-tools {
  display: flex;
  gap: 10px;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.resume-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-section-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.preview-section-item h4 {
  margin: 0 0 12px 0;
  color: #409eff;
  font-size: 14px;
  font-weight: 600;
}

.personal-info p {
  margin: 4px 0;
  color: #606266;
  font-size: 13px;
}

.work-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.work-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.work-item h5 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 14px;
}

.work-period {
  margin: 0 0 8px 0;
  color: #909399;
  font-size: 12px;
}

.work-item ul {
  margin: 0;
  padding-left: 16px;
}

.work-item li {
  margin-bottom: 4px;
  color: #606266;
  font-size: 12px;
  line-height: 1.4;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  font-size: 12px;
}

.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* 质量评分和改进建议样式 */
.message-quality,
.message-improvements {
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #409eff;
}

.quality-title,
.improvements-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.quality-score {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-text {
  font-weight: 600;
  color: #2c3e50;
  min-width: 50px;
}

.improvements-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.improvement-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  line-height: 1.4;
  color: #606266;
}

.improvement-icon {
  color: #409eff;
  margin-top: 2px;
  flex-shrink: 0;
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .generator-layout {
    flex-direction: column;
    height: auto;
  }

  .chat-section {
    height: 400px;
  }

  .preview-section {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .chat-header {
    padding: 15px;
  }

  .ai-avatar {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .message-content {
    max-width: 90%;
  }

  .input-tools {
    flex-wrap: wrap;
  }
}
</style>
