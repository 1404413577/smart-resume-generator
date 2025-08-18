<template>
  <aside class="app-sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 折叠按钮 -->
    <div class="sidebar-header">
      <el-button @click="toggleCollapse" size="small" text class="collapse-btn">
        <el-icon><component :is="isCollapsed ? 'Expand' : 'Fold'" /></el-icon>
      </el-button>
    </div>

    <!-- 快捷操作 -->
    <div class="sidebar-section" v-if="$route.name === 'Home'">
      <div class="section-title" v-if="!isCollapsed">快捷操作</div>
      <div class="quick-actions">
        <el-button @click="$emit('ai-generate')" type="success" size="small" class="action-btn">
          <el-icon><MagicStick /></el-icon>
          <span v-if="!isCollapsed">AI助手</span>
        </el-button>
        <el-button @click="$emit('template-manage')" type="primary" size="small" class="action-btn">
          <el-icon><Grid /></el-icon>
          <span v-if="!isCollapsed">模板中心</span>
        </el-button>
      </div>
    </div>

    <!-- 编辑模块（仅在首页显示） -->
    <div class="sidebar-section" v-if="$route.name === 'Home'">
      <div class="section-title" v-if="!isCollapsed">编辑模块</div>
      <div class="module-list">
        <div
          v-for="module in editModules"
          :key="module.id"
          class="module-item"
          :class="{ active: activeModule === module.id }"
          @click="$emit('module-change', module.id)"
        >
          <el-icon><component :is="module.icon" /></el-icon>
          <span v-if="!isCollapsed" class="module-name">{{ module.name }}</span>
          <div v-if="module.badge && !isCollapsed" class="module-badge">{{ module.badge }}</div>
        </div>
      </div>
    </div>

    <!-- 最近简历 -->
    <div class="sidebar-section" v-if="recentResumes.length">
      <div class="section-title" v-if="!isCollapsed">最近编辑</div>
      <div class="recent-list">
        <div
          v-for="resume in recentResumes.slice(0, 3)"
          :key="resume.id"
          class="recent-item"
          @click="loadResume(resume.id)"
        >
          <el-icon><Document /></el-icon>
          <div v-if="!isCollapsed" class="recent-info">
            <div class="recent-name">{{ resume.name || '未命名简历' }}</div>
            <div class="recent-time">{{ formatTime(resume.updatedAt) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="sidebar-footer">
      <el-button @click="$router.push('/settings')" size="small" text class="footer-btn">
        <el-icon><Setting /></el-icon>
        <span v-if="!isCollapsed">设置</span>
      </el-button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  MagicStick,
  Grid,
  User,
  Document,
  Briefcase,
  School,
  Star,
  FolderOpened,
  Setting,
  Expand,
  Fold
} from '@element-plus/icons-vue'
import { useResumeStore } from '../../stores/resume'

const props = defineProps({
  activeModule: {
    type: String,
    default: 'personalInfo'
  }
})

defineEmits(['ai-generate', 'template-manage', 'module-change'])

const router = useRouter()
const resumeStore = useResumeStore()
const isCollapsed = ref(false)

// 编辑模块
const editModules = computed(() => [
  {
    id: 'personalInfo',
    name: '个人信息',
    icon: User,
    badge: resumeStore.personalInfo?.name ? null : '!'
  },
  {
    id: 'summary',
    name: '个人简介',
    icon: Document,
    badge: resumeStore.summary ? null : '!'
  },
  {
    id: 'workExperience',
    name: '工作经历',
    icon: Briefcase,
    badge: resumeStore.workExperience?.length || null
  },
  {
    id: 'education',
    name: '教育背景',
    icon: School,
    badge: resumeStore.education?.length || null
  },
  {
    id: 'skills',
    name: '技能特长',
    icon: Star,
    badge: resumeStore.skills?.length || null
  },
  {
    id: 'projects',
    name: '项目经历',
    icon: FolderOpened,
    badge: resumeStore.projects?.length || null
  }
])

// 最近简历
const recentResumes = computed(() => {
  return resumeStore.recentResumes || []
})

// 方法
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const loadResume = (resumeId) => {
  resumeStore.loadResume(resumeId)
  router.push(`/resume/${resumeId}`)
}

const formatTime = (time) => {
  if (!time) return ''
  const now = new Date()
  const diff = Math.floor((now - new Date(time)) / 1000)
  
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return `${Math.floor(diff / 86400)}天前`
}
</script>

<style scoped>
.app-sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
}

.app-sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
}

.collapse-btn {
  padding: 4px;
}

.sidebar-section {
  padding: 15px;
  border-bottom: 1px solid #f0f2f5;
}

.section-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  width: 100%;
  justify-content: flex-start;
  height: 36px;
}

.module-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.module-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.module-item:hover {
  background: #f0f2f5;
  color: #409eff;
}

.module-item.active {
  background: #ecf5ff;
  color: #409eff;
  border-left: 3px solid #409eff;
}

.module-item .el-icon {
  font-size: 16px;
  margin-right: 10px;
  flex-shrink: 0;
}

.module-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.module-badge {
  background: #f56c6c;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.recent-item:hover {
  background: #f0f2f5;
}

.recent-item .el-icon {
  font-size: 14px;
  margin-right: 8px;
  color: #909399;
}

.recent-info {
  flex: 1;
  min-width: 0;
}

.recent-name {
  font-size: 13px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-time {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

.sidebar-footer {
  margin-top: auto;
  padding: 15px;
  border-top: 1px solid #e4e7ed;
}

.footer-btn {
  width: 100%;
  justify-content: flex-start;
  color: #606266;
}

/* 折叠状态下的样式调整 */
.app-sidebar.collapsed .quick-actions {
  align-items: center;
}

.app-sidebar.collapsed .action-btn {
  width: 36px;
  padding: 0;
  justify-content: center;
}

.app-sidebar.collapsed .module-item {
  justify-content: center;
  padding: 10px;
}

.app-sidebar.collapsed .recent-item {
  justify-content: center;
  padding: 8px;
}

.app-sidebar.collapsed .footer-btn {
  justify-content: center;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    left: -260px;
    top: 64px;
    height: calc(100vh - 64px);
    z-index: 999;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
  
  .app-sidebar.show {
    left: 0;
  }
}
</style>
