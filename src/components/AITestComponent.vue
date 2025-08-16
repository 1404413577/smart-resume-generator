<template>
  <div class="ai-test">
    <h2>AI功能测试</h2>
    
    <el-card class="test-card">
      <template #header>
        <h3>个人简介生成测试</h3>
      </template>
      
      <el-form :model="testData" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="testData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="testData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="目标职位">
          <el-input v-model="testData.position" placeholder="请输入目标职位" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="testSummaryGeneration" :loading="loading">
            测试个人简介生成
          </el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="generatedSummary" class="result">
        <h4>生成的个人简介：</h4>
        <p>{{ generatedSummary }}</p>
      </div>
    </el-card>

    <el-card class="test-card">
      <template #header>
        <h3>API连接测试</h3>
      </template>
      
      <el-button @click="testAPIConnection" :loading="apiTesting">
        测试API连接
      </el-button>
      
      <div v-if="apiStatus !== null" class="api-status">
        <el-tag :type="apiStatus ? 'success' : 'danger'">
          {{ apiStatus ? 'API连接正常' : 'API连接失败' }}
        </el-tag>
      </div>
    </el-card>

    <el-card class="test-card">
      <template #header>
        <h3>错误日志</h3>
      </template>
      
      <div v-if="errors.length > 0" class="error-log">
        <div v-for="(error, index) in errors" :key="index" class="error-item">
          <el-tag type="danger">{{ error.time }}</el-tag>
          <span>{{ error.message }}</span>
        </div>
      </div>
      <div v-else class="no-errors">
        <el-tag type="success">暂无错误</el-tag>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generatePersonalSummary, checkAPIAvailability } from '../utils/aiService'

const loading = ref(false)
const apiTesting = ref(false)
const apiStatus = ref(null)
const generatedSummary = ref('')
const errors = ref([])

const testData = ref({
  name: '张三',
  email: 'zhangsan@example.com',
  position: '前端开发工程师'
})

const addError = (message) => {
  errors.value.unshift({
    time: new Date().toLocaleTimeString(),
    message
  })
  if (errors.value.length > 10) {
    errors.value = errors.value.slice(0, 10)
  }
}

const testSummaryGeneration = async () => {
  if (!testData.value.name) {
    ElMessage.warning('请输入姓名')
    return
  }

  loading.value = true
  generatedSummary.value = ''

  try {
    const summary = await generatePersonalSummary(testData.value, testData.value.position)
    generatedSummary.value = summary
    ElMessage.success('个人简介生成成功！')
  } catch (error) {
    console.error('生成失败:', error)
    addError(`个人简介生成失败: ${error.message}`)
    ElMessage.error(`生成失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const testAPIConnection = async () => {
  apiTesting.value = true
  apiStatus.value = null

  try {
    const isAvailable = await checkAPIAvailability()
    apiStatus.value = isAvailable
    
    if (isAvailable) {
      ElMessage.success('API连接测试成功！')
    } else {
      ElMessage.error('API连接测试失败！')
      addError('API连接测试失败')
    }
  } catch (error) {
    console.error('API测试失败:', error)
    apiStatus.value = false
    addError(`API测试失败: ${error.message}`)
    ElMessage.error(`API测试失败: ${error.message}`)
  } finally {
    apiTesting.value = false
  }
}
</script>

<style scoped>
.ai-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-card {
  margin-bottom: 20px;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.result h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.result p {
  margin: 0;
  line-height: 1.6;
  color: #606266;
}

.api-status {
  margin-top: 15px;
}

.error-log {
  max-height: 200px;
  overflow-y: auto;
}

.error-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding: 8px;
  background: #fef0f0;
  border-radius: 4px;
}

.no-errors {
  text-align: center;
  padding: 20px;
  color: #909399;
}
</style>
