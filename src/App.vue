<script setup>
import { ref, onMounted } from 'vue'
import { useResumeStore } from './stores/resume'
import ResumeBuilder from './components/ResumeBuilder.vue'
import ResumeManager from './components/ResumeManager.vue'

const resumeStore = useResumeStore()
const showResumeManager = ref(false)

// 格式化保存时间
const formatSaveTime = (saveTime) => {
  if (!saveTime) return ''
  const now = new Date()
  const diff = Math.floor((now - saveTime) / 1000) // 秒数差

  if (diff < 10) return '刚刚'
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  return saveTime.toLocaleTimeString()
}

onMounted(() => {
  resumeStore.init()
})
</script>

<template>
  <div id="app">
    <el-container class="app-container">
      <el-header class="app-header">
        <div class="header-content">
          <h1 class="app-title">
            <el-icon><Document /></el-icon>
            智能简历生成器
          </h1>
          <div class="header-actions">
            <div class="auto-save-status" v-if="resumeStore.isAutoSaveEnabled">
              <el-icon class="save-icon"><CircleCheck /></el-icon>
              <span class="save-text">
                自动保存
                <span v-if="resumeStore.lastSaveTime" class="save-time">
                  ({{ formatSaveTime(resumeStore.lastSaveTime) }})
                </span>
              </span>
            </div>
            <el-button @click="showResumeManager = true">
              <el-icon><Folder /></el-icon>
              简历管理
            </el-button>
            <el-button type="primary" @click="resumeStore.togglePreviewMode()">
              <el-icon><View /></el-icon>
              {{ resumeStore.isPreviewMode ? '编辑模式' : '预览模式' }}
            </el-button>
          </div>
        </div>
      </el-header>

      <el-main class="app-main">
        <ResumeBuilder />
      </el-main>
    </el-container>

    <!-- 简历管理对话框 -->
    <ResumeManager
      :visible="showResumeManager"
      @update:visible="showResumeManager = $event"
      @close="showResumeManager = false"
    />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.app-main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.auto-save-status {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 14px;
  color: white;
}

.save-icon {
  color: #67c23a;
  animation: pulse 2s infinite;
}

.save-text {
  font-weight: 500;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}
</style>
