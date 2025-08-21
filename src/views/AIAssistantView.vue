<template>
  <div class="ai-assistant-view">
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <el-icon><MagicStick /></el-icon>
            AI智能助手
          </h1>
          <p class="page-description">与AI对话，智能生成个性化简历内容</p>
        </div>
        <div class="header-actions">
          <el-button @click="startNewChat" type="primary" :icon="Plus">
            新对话
          </el-button>
          <el-button @click="showHistory = !showHistory" :icon="Clock">
            历史记录
          </el-button>
        </div>
      </div>
    </div>

    <div class="page-content">
      <div class="chat-layout">
        <!-- 左侧：对话历史（可选显示） -->
        <div class="chat-sidebar" v-if="showHistory">
          <div class="sidebar-header">
            <h3>对话历史</h3>
            <el-button @click="showHistory = false" size="small" text>
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          <div class="chat-history">
            <div
              v-for="chat in chatHistory"
              :key="chat.id"
              class="history-item"
              :class="{ active: currentChatId === chat.id }"
              @click="loadChat(chat.id)"
            >
              <div class="history-title">{{ chat.title || '新对话' }}</div>
              <div class="history-time">{{ formatTime(chat.createdAt) }}</div>
            </div>
          </div>
        </div>

        <!-- 主要对话区域 -->
        <div class="chat-main" :class="{ 'full-width': !showHistory }">
          <!-- 对话消息 -->
          <div class="messages-container" ref="messagesContainer">
            <div v-if="messages.length === 0" class="welcome-message">
              <div class="welcome-content">
                <el-icon class="welcome-icon"><MagicStick /></el-icon>
                <h2>欢迎使用AI简历助手</h2>
                <p>我可以帮助您：</p>
                <ul class="feature-list">
                  <li>分析职位要求，定制简历内容</li>
                  <li>优化简历结构和表达方式</li>
                  <li>生成专业的工作经历描述</li>
                  <li>提供简历改进建议</li>
                </ul>
                <div class="quick-start">
                  <p>快速开始：</p>
                  <div class="quick-buttons">
                    <el-button @click="sendQuickMessage('帮我写一份软件工程师的简历')" size="small">
                      软件工程师简历
                    </el-button>
                    <el-button @click="sendQuickMessage('如何优化我的简历？')" size="small">
                      优化建议
                    </el-button>
                    <el-button @click="sendQuickMessage('帮我分析这个职位要求')" size="small">
                      职位分析
                    </el-button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="messages-list">
              <div
                v-for="(message, index) in messages"
                :key="index"
                class="message"
                :class="message.role"
              >
                <div class="message-avatar">
                  <el-icon v-if="message.role === 'user'"><User /></el-icon>
                  <el-icon v-else><MagicStick /></el-icon>
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
                        :stroke-width="8"
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

                  <!-- 建议标签 -->
                  <div v-if="message.suggestions?.length" class="message-suggestions">
                    <div class="suggestions-title">
                      <el-icon><Star /></el-icon>
                      建议：
                    </div>
                    <div class="suggestions-list">
                      <el-tag
                        v-for="suggestion in message.suggestions"
                        :key="suggestion"
                        size="small"
                        class="suggestion-tag"
                        type="success"
                      >
                        {{ suggestion }}
                      </el-tag>
                    </div>
                  </div>

                  <!-- 相关问题 -->
                  <div v-if="message.questions?.length" class="message-questions">
                    <div class="questions-title">
                      <el-icon><QuestionFilled /></el-icon>
                      相关问题：
                    </div>
                    <div class="questions-list">
                      <el-button
                        v-for="question in message.questions"
                        :key="question"
                        @click="sendQuickMessage(question)"
                        size="small"
                        text
                        class="question-btn"
                      >
                        <el-icon><ChatRound /></el-icon>
                        {{ question }}
                      </el-button>
                    </div>
                  </div>
                </div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
              </div>

              <!-- AI思考中 -->
              <div v-if="isThinking" class="message assistant thinking">
                <div class="message-avatar">
                  <el-icon><MagicStick /></el-icon>
                </div>
                <div class="message-content">
                  <div class="thinking-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div class="thinking-text">AI正在思考中...</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="input-area">
            <div class="input-container">
              <el-input
                v-model="inputMessage"
                type="textarea"
                :rows="3"
                placeholder="输入您的问题或需求..."
                @keydown.ctrl.enter="sendMessage"
                :disabled="isThinking"
                resize="none"
              />
              <div class="input-actions">
                <div class="input-tips">
                  <span>Ctrl + Enter 发送</span>
                </div>
                <div class="input-buttons">
                  <el-button @click="uploadJobDescription" size="small" :icon="Upload">
                    上传JD
                  </el-button>
                  <el-button
                    @click="sendMessage"
                    type="primary"
                    :loading="isThinking"
                    :disabled="!inputMessage.trim()"
                  >
                    发送
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  MagicStick,
  Plus,
  Clock,
  Close,
  User,
  Upload,
  TrendCharts,
  ArrowRight,
  Star,
  QuestionFilled,
  ChatRound
} from '@element-plus/icons-vue'
import { generateConversationalResponse } from '@utils/ai/aiService'

// 响应式数据
const showHistory = ref(false)
const messages = ref([])
const inputMessage = ref('')
const isThinking = ref(false)
const messagesContainer = ref(null)
const currentChatId = ref(null)
const chatHistory = ref([])

// 方法
const startNewChat = () => {
  messages.value = []
  inputMessage.value = ''
  currentChatId.value = null
  ElMessage.success('已开始新对话')
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isThinking.value) return

  const userMessage = {
    role: 'user',
    content: inputMessage.value.trim(),
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  inputMessage.value = ''
  isThinking.value = true

  // 滚动到底部
  await nextTick()
  scrollToBottom()

  try {
    const response = await generateConversationalResponse({
      messages: messages.value,
      currentStep: 'general',
      userProfile: {}
    })

    const aiMessage = {
      role: 'assistant',
      content: response.response,
      suggestions: response.suggestions,
      questions: response.questions,
      qualityScore: response.qualityScore,
      improvements: response.improvements,
      timestamp: new Date()
    }

    messages.value.push(aiMessage)
    
    // 保存对话到历史
    saveChatToHistory()
  } catch (error) {
    console.error('AI对话失败:', error)
    ElMessage.error('AI服务暂时不可用，请稍后重试')
  } finally {
    isThinking.value = false
    await nextTick()
    scrollToBottom()
  }
}

const sendQuickMessage = (message) => {
  inputMessage.value = message
  sendMessage()
}

const uploadJobDescription = () => {
  // TODO: 实现JD上传功能
  ElMessage.info('JD上传功能开发中...')
}

const loadChat = (chatId) => {
  // TODO: 从历史记录加载对话
  currentChatId.value = chatId
  ElMessage.info('加载历史对话功能开发中...')
}

const saveChatToHistory = () => {
  if (!currentChatId.value && messages.value.length > 0) {
    const newChat = {
      id: Date.now().toString(),
      title: messages.value[0]?.content.slice(0, 20) + '...',
      createdAt: new Date(),
      messages: [...messages.value]
    }
    chatHistory.value.unshift(newChat)
    currentChatId.value = newChat.id
  }
}

const formatMessage = (content) => {
  // 简单的markdown格式化
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return date.toLocaleDateString()
}

const getScoreColor = (score) => {
  if (score >= 80) return '#67c23a'  // 绿色 - 优秀
  if (score >= 60) return '#e6a23c'  // 橙色 - 良好
  if (score >= 40) return '#f56c6c'  // 红色 - 需要改进
  return '#909399'  // 灰色 - 较差
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 生命周期
onMounted(() => {
  // 加载历史对话
  // TODO: 从本地存储或服务器加载
})
</script>

<style scoped>
.ai-assistant-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 24px 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-description {
  color: #606266;
  margin: 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.page-content {
  flex: 1;
  overflow: hidden;
}

.chat-layout {
  display: flex;
  height: 100%;
}

.chat-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.history-item {
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.3s ease;
}

.history-item:hover {
  background: #f5f7fa;
}

.history-item.active {
  background: #ecf5ff;
  border-left: 3px solid #409eff;
}

.history-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-time {
  font-size: 12px;
  color: #909399;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-main.full-width {
  width: 100%;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.welcome-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.welcome-content {
  max-width: 500px;
}

.welcome-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 16px;
}

.welcome-content h2 {
  color: #303133;
  margin: 0 0 16px 0;
}

.welcome-content p {
  color: #606266;
  margin: 0 0 12px 0;
}

.feature-list {
  text-align: left;
  color: #606266;
  margin: 0 0 24px 0;
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 8px;
}

.quick-start p {
  color: #303133;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: #409eff;
  color: white;
}

.message.assistant .message-avatar {
  background: #67c23a;
  color: white;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message.user .message-content {
  text-align: right;
}

.message-text {
  background: #f0f2f5;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
}

.message.user .message-text {
  background: #409eff;
  color: white;
}

.message-quality,
.message-improvements,
.message-suggestions,
.message-questions {
  margin-top: 12px;
}

.quality-title,
.improvements-title,
.suggestions-title,
.questions-title {
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

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-tag {
  cursor: default;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.question-btn {
  text-align: left;
  padding: 4px 8px;
  height: auto;
  line-height: 1.4;
}

.message-time {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
  flex-shrink: 0;
}

.thinking {
  opacity: 0.8;
}

.thinking-animation {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.thinking-animation span {
  width: 6px;
  height: 6px;
  background: #67c23a;
  border-radius: 50%;
  animation: thinking 1.4s infinite ease-in-out;
}

.thinking-animation span:nth-child(1) { animation-delay: -0.32s; }
.thinking-animation span:nth-child(2) { animation-delay: -0.16s; }

@keyframes thinking {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.thinking-text {
  font-size: 12px;
  color: #909399;
}

.input-area {
  border-top: 1px solid #e4e7ed;
  padding: 20px;
  background: #fafbfc;
}

.input-container {
  max-width: 800px;
  margin: 0 auto;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.input-tips {
  font-size: 12px;
  color: #909399;
}

.input-buttons {
  display: flex;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .chat-sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    height: 100%;
    z-index: 999;
    transition: left 0.3s ease;
  }
  
  .chat-sidebar.show {
    left: 0;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .input-area {
    padding: 16px;
  }
  
  .input-actions {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
}
</style>
