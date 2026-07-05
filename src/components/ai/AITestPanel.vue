<template>
  <div class="ai-test-panel">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>AI功能测试面板</span>
          <el-tag :type="apiStatus.type">{{ apiStatus.text }}</el-tag>
        </div>
      </template>

      <!-- API状态检查 -->
      <div class="test-section">
        <h4>API连接状态</h4>
        <div class="status-info">
          <p><strong>当前引擎:</strong> {{ aiSettings.aiEngine }}</p>
          <p><strong>当前模型:</strong> {{ currentModel }}</p>
          <p><strong>接口地址:</strong> {{ currentBaseUrl }}</p>
          <el-button size="small" @click="testConnection" :loading="testing">
            测试连接
          </el-button>
        </div>
      </div>

      <!-- 简单AI测试 -->
      <div class="test-section">
        <h4>AI响应测试</h4>
        <el-input
          v-model="testPrompt"
          type="textarea"
          :rows="3"
          placeholder="输入测试提示词..."
        />
        <div class="test-actions">
          <el-button type="primary" @click="testAI" :loading="aiTesting">
            测试AI响应
          </el-button>
          <el-button @click="clearTest">清空</el-button>
        </div>
        <div v-if="aiResponse" class="ai-response">
          <h5>AI响应：</h5>
          <pre>{{ aiResponse }}</pre>
        </div>
      </div>

      <!-- 简历生成测试 -->
      <div class="test-section">
        <h4>简历生成测试</h4>
        <el-form :model="resumeTestForm" label-width="80px" size="small">
          <el-form-item label="姓名">
            <el-input v-model="resumeTestForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="职位">
            <el-input v-model="resumeTestForm.position" placeholder="请输入目标职位" />
          </el-form-item>
          <el-form-item label="经验">
            <el-select v-model="resumeTestForm.experience" placeholder="选择工作经验">
              <el-option label="应届毕业生" value="0-1年" />
              <el-option label="1-3年" value="1-3年" />
              <el-option label="3-5年" value="3-5年" />
              <el-option label="5年以上" value="5年以上" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="testResumeGeneration" :loading="resumeTesting">
          测试简历生成
        </el-button>
        <div v-if="resumeResult" class="resume-result">
          <h5>生成结果：</h5>
          <pre>{{ JSON.stringify(resumeResult, null, 2) }}</pre>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  checkAPIAvailability,
  generateConversationalResponse,
  generateCompleteResume,
  getAiSettings
} from '@utils/ai/aiService'

// 响应式数据
const testing = ref(false)
const aiTesting = ref(false)
const resumeTesting = ref(false)
const testPrompt = ref('你好，请介绍一下你自己。')
const aiResponse = ref('')
const resumeResult = ref(null)

const resumeTestForm = ref({
  name: '张三',
  position: '前端开发工程师',
  experience: '1-3年'
})

// API配置信息
const aiSettings = ref(getAiSettings())

// 计算属性
const currentModel = computed(() => {
  if (aiSettings.value.aiEngine === 'gemini') return aiSettings.value.geminiModel
  if (aiSettings.value.aiEngine === 'ollama') return aiSettings.value.ollamaModel
  if (aiSettings.value.aiEngine === 'local') {
    return aiSettings.value.localAiType === 'gpu'
      ? aiSettings.value.localModelId
      : aiSettings.value.localCpuModelId
  }
  return aiSettings.value.aiModel
})

const currentBaseUrl = computed(() => {
  if (aiSettings.value.aiEngine === 'gemini') return aiSettings.value.geminiBaseUrl
  if (aiSettings.value.aiEngine === 'ollama') return aiSettings.value.ollamaBaseUrl
  if (aiSettings.value.aiEngine === 'local') return '浏览器本地运行'
  return aiSettings.value.aiBaseUrl
})

const apiStatus = computed(() => {
  if (aiSettings.value.aiEngine === 'local') {
    return { type: 'info', text: '本地模型' }
  }
  return { type: 'success', text: '已加载配置' }
})

// 方法
const testConnection = async () => {
  testing.value = true
  try {
    aiSettings.value = getAiSettings()
    const ok = await checkAPIAvailability()
    if (ok === true) {
      ElMessage.success('API连接成功！')
    } else {
      ElMessage.error(ok?.message || 'API连接失败，请检查设置')
    }
  } catch (error) {
    console.error('连接测试失败:', error)
    ElMessage.error('连接测试失败')
  } finally {
    testing.value = false
  }
}

const testAI = async () => {
  if (!testPrompt.value.trim()) {
    ElMessage.warning('请输入测试提示词')
    return
  }

  aiTesting.value = true
  aiResponse.value = ''

  try {
    const response = await generateConversationalResponse({
      messages: [
        { role: 'user', content: testPrompt.value }
      ],
      currentStep: 'test',
      userProfile: {}
    })

    aiResponse.value = response.response || JSON.stringify(response, null, 2)
    ElMessage.success('AI响应成功！')
  } catch (error) {
    console.error('AI测试失败:', error)
    aiResponse.value = `错误: ${error.message}`
    ElMessage.error('AI测试失败')
  } finally {
    aiTesting.value = false
  }
}

const testResumeGeneration = async () => {
  const { name, position, experience } = resumeTestForm.value
  
  if (!name || !position || !experience) {
    ElMessage.warning('请填写完整的测试信息')
    return
  }

  resumeTesting.value = true
  resumeResult.value = null

  try {
    const result = await generateCompleteResume({
      career: position,
      name: name,
      experience: experience,
      education: '本科',
      companies: ['测试公司'],
      requirements: '测试简历生成功能'
    })

    resumeResult.value = result
    ElMessage.success('简历生成成功！')
  } catch (error) {
    console.error('简历生成测试失败:', error)
    resumeResult.value = { error: error.message }
    ElMessage.error('简历生成测试失败')
  } finally {
    resumeTesting.value = false
  }
}

const clearTest = () => {
  testPrompt.value = ''
  aiResponse.value = ''
  resumeResult.value = null
}

// 生命周期
onMounted(() => {
  console.log('AI测试面板已加载')
  console.log('AI配置:', aiSettings.value)
})
</script>

<style scoped>
.ai-test-panel {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.test-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.test-section:last-child {
  border-bottom: none;
}

.test-section h4 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
}

.status-info {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.status-info p {
  margin: 5px 0;
  font-size: 14px;
}

.test-actions {
  margin: 15px 0;
  display: flex;
  gap: 10px;
}

.ai-response,
.resume-result {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.ai-response h5,
.resume-result h5 {
  margin: 0 0 10px 0;
  color: #409eff;
}

.ai-response pre,
.resume-result pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  line-height: 1.4;
  max-height: 300px;
  overflow-y: auto;
}
</style>
