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

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useResumeStore } from '@stores/resume'

const emit = defineEmits(['data-updated'])
const resumeStore = useResumeStore()

// 个人简介数据
const summary = ref(resumeStore.resumeData.summary || '')

// 处理输入
const handleInput = () => {
  resumeStore.updateSummary(summary.value)
  emit('data-updated', summary.value)
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

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
  font-family: inherit;
  line-height: 1.6;
}

</style>
