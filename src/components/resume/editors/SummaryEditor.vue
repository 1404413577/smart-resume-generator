<template>
  <div class="summary-editor">
    <div class="editor-section">
      <h4 class="section-title">个人简介</h4>
      <p class="section-description">
        简洁地描述您的专业背景、核心技能和职业目标，让招聘者快速了解您的价值。
      </p>

      <el-form-item>
        <el-input
          v-model="summary"
          type="textarea"
          :rows="8"
          placeholder="请输入个人简介，建议100-200字..."
          show-word-limit
          maxlength="500"
          @input="handleInput"
        />
      </el-form-item>

      <div class="tips-section">
        <h5 class="tips-title">💡 写作建议</h5>
        <ul class="tips-list">
          <li>突出您的核心专业技能和经验</li>
          <li>提及您的主要成就或项目经验</li>
          <li>表达您的职业目标和价值观</li>
          <li>保持简洁，避免过于详细的描述</li>
        </ul>
      </div>

      <div class="ai-assist-section">
        <el-button @click="generateWithAI" type="primary" :loading="isGenerating">
          <el-icon><MagicStick /></el-icon>
          AI智能生成
        </el-button>
        <el-button @click="optimizeWithAI" :loading="isOptimizing" :disabled="!summary.trim()">
          <el-icon><EditPen /></el-icon>
          AI优化润色
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { MagicStick, EditPen } from '@element-plus/icons-vue'
import { useResumeStore } from '../../../stores/resume'

const emit = defineEmits(['data-updated'])
const resumeStore = useResumeStore()

// 个人简介数据
const summary = ref(resumeStore.resumeData.summary || '')
const isGenerating = ref(false)
const isOptimizing = ref(false)

// 处理输入
const handleInput = () => {
  resumeStore.updateSummary(summary.value)
  emit('data-updated', summary.value)
}

// AI生成简介
const generateWithAI = async () => {
  isGenerating.value = true
  try {
    // TODO: 集成AI服务
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟API调用

    const generatedSummary = `具有${Math.floor(Math.random() * 5) + 2}年软件开发经验的专业工程师，擅长前端开发和用户体验设计。熟练掌握Vue.js、React等现代前端框架，具备良好的团队协作能力和项目管理经验。致力于通过技术创新提升产品质量和用户满意度。`

    summary.value = generatedSummary
    handleInput()
    ElMessage.success('AI简介生成成功！')
  } catch (error) {
    ElMessage.error('AI生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

// AI优化简介
const optimizeWithAI = async () => {
  if (!summary.value.trim()) {
    ElMessage.warning('请先输入简介内容')
    return
  }

  isOptimizing.value = true
  try {
    // TODO: 集成AI服务
    await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟API调用

    // 简单的优化逻辑（实际应该调用AI服务）
    const optimized = summary.value
      .replace(/。/g, '，在此基础上不断提升专业技能。')
      .substring(0, 200) + '...'

    summary.value = optimized
    handleInput()
    ElMessage.success('AI优化完成！')
  } catch (error) {
    ElMessage.error('AI优化失败，请重试')
  } finally {
    isOptimizing.value = false
  }
}

// 监听数据变化
watch(summary, (newValue) => {
  resumeStore.updateSummary(newValue)
  emit('data-updated', newValue)
})
</script>

<style scoped>
.summary-editor {
  padding: 0;
}

.editor-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.section-description {
  font-size: 13px;
  color: #606266;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.tips-section {
  margin: 20px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #67c23a;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: #67c23a;
  margin: 0 0 12px 0;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.tips-list li {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.4;
}

.ai-assist-section {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
  font-family: inherit;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .ai-assist-section {
    flex-direction: column;
  }

  .ai-assist-section .el-button {
    width: 100%;
  }
}
</style>
