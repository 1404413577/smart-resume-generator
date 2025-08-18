<template>
  <header class="app-header">
    <div class="header-content">
      <!-- 左侧：Logo和标题 -->
      <div class="header-left">
        <router-link to="/" class="logo-link">
          <el-icon class="logo-icon"><Document /></el-icon>
          <h1 class="app-title">智能简历生成器</h1>
        </router-link>
      </div>

      <!-- 中间：导航菜单 -->
      <nav class="header-nav">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.name === item.name }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- 右侧：操作按钮 -->
      <div class="header-actions">
        <!-- 自动保存状态 -->
        <div class="auto-save-status" v-if="resumeStore.isAutoSaveEnabled">
          <el-icon class="save-icon"><CircleCheck /></el-icon>
          <span class="save-text">
            自动保存
            <span v-if="resumeStore.lastSaveTime" class="save-time">
              ({{ formatSaveTime(resumeStore.lastSaveTime) }})
            </span>
          </span>
        </div>

        <!-- 快捷操作 -->
        <el-button @click="handleExportPDF" type="primary" size="small" :loading="isExporting">
          <el-icon><Download /></el-icon>
          导出PDF
        </el-button>

        <!-- 预览模式切换 -->
        <el-button @click="togglePreviewMode" size="small" v-if="$route.name === 'Home'">
          <el-icon><View /></el-icon>
          {{ resumeStore.isPreviewMode ? '编辑模式' : '预览模式' }}
        </el-button>

        <!-- 用户菜单 -->
        <el-dropdown trigger="click" class="user-menu">
          <el-button circle size="small">
            <el-icon><User /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/settings')">
                <el-icon><Setting /></el-icon>
                设置
              </el-dropdown-item>
              <el-dropdown-item @click="$router.push('/about')">
                <el-icon><InfoFilled /></el-icon>
                关于
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleReset">
                <el-icon><RefreshLeft /></el-icon>
                重置数据
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Document,
  CircleCheck,
  Download,
  View,
  User,
  Setting,
  InfoFilled,
  RefreshLeft,
  House,
  Folder,
  MagicStick,
  Grid
} from '@element-plus/icons-vue'
import { useResumeStore } from '../../stores/resume'
import { generateOptimizedPDF } from '../../utils/pdfGenerator'

const router = useRouter()
const resumeStore = useResumeStore()
const isExporting = ref(false)

// 导航菜单项
const navItems = [
  { name: 'Home', path: '/', label: '编辑器', icon: House },
  { name: 'Resumes', path: '/resumes', label: '简历管理', icon: Folder },
  { name: 'AIAssistant', path: '/ai-assistant', label: 'AI助手', icon: MagicStick },
  { name: 'Templates', path: '/templates', label: '模板中心', icon: Grid }
]

// 格式化保存时间
const formatSaveTime = (saveTime) => {
  if (!saveTime) return ''
  const now = new Date()
  const diff = Math.floor((now - saveTime) / 1000)

  if (diff < 10) return '刚刚'
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  return saveTime.toLocaleTimeString()
}

// 导出PDF
const handleExportPDF = async () => {
  try {
    isExporting.value = true
    await generateOptimizedPDF('resume-preview', `${resumeStore.resumeData.personalInfo.name || '简历'}.pdf`)
    ElMessage.success('PDF导出成功！')
  } catch (error) {
    console.error('PDF导出失败:', error)
    ElMessage.error('PDF导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}

// 切换预览模式
const togglePreviewMode = () => {
  resumeStore.togglePreviewMode()
}

// 重置数据
const handleReset = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有数据吗？此操作不可恢复。',
      '确认重置',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    resumeStore.resetData()
    ElMessage.success('数据已重置')
    router.push('/')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.app-header {
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.logo-link:hover {
  color: #409eff;
}

.logo-icon {
  font-size: 28px;
}

.app-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.header-nav {
  display: flex;
  gap: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.nav-item.active {
  background: #409eff;
  color: white;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auto-save-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(103, 194, 58, 0.1);
  border-radius: 16px;
  font-size: 12px;
  color: #67c23a;
}

.save-icon {
  animation: pulse 2s infinite;
}

.save-time {
  opacity: 0.8;
}

.user-menu {
  margin-left: 8px;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .header-nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 15px;
  }
  
  .app-title {
    font-size: 16px;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .auto-save-status {
    display: none;
  }
}
</style>
