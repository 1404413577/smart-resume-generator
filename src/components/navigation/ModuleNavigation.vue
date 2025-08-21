<template>
  <div class="module-navigation">
    <div class="navigation-header">
      <h3>编辑模块</h3>
    </div>
    
    <div class="navigation-list">
      <div
        v-for="module in modules"
        :key="module.id"
        class="nav-item"
        :class="{ active: activeModule === module.id }"
        @click="$emit('module-change', module.id)"
      >
        <el-icon>
          <component :is="module.icon" />
        </el-icon>
        <span class="nav-text">{{ module.name }}</span>
        <div v-if="module.badge" class="nav-badge">{{ module.badge }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  User,
  Document,
  Briefcase,
  School,
  Star,
  FolderOpened
} from '@element-plus/icons-vue'
import { useResumeStore } from '@stores/resume'

const props = defineProps({
  activeModule: {
    type: String,
    required: true
  }
})

defineEmits(['module-change'])

const resumeStore = useResumeStore()

// 模块配置
const modules = computed(() => [
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
</script>

<style scoped>
.module-navigation {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.navigation-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
}

.navigation-header h3 {
  margin: 0;
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.navigation-list {
  padding: 10px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f0f2f5;
  color: #409eff;
}

.nav-item.active {
  background: #ecf5ff;
  color: #409eff;
  border-left-color: #409eff;
}

.nav-item .el-icon {
  font-size: 18px;
  margin-right: 12px;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.nav-badge {
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

.nav-item.active .nav-badge {
  background: #409eff;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .module-navigation {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    min-width: 400px;
  }
  
  .navigation-header {
    display: none;
  }
  
  .navigation-list {
    display: flex;
    padding: 0;
  }
  
  .nav-item {
    flex-direction: column;
    min-width: 80px;
    padding: 10px;
    text-align: center;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  
  .nav-item.active {
    border-left: none;
    border-bottom-color: #409eff;
  }
  
  .nav-item .el-icon {
    margin-right: 0;
    margin-bottom: 4px;
  }
  
  .nav-text {
    font-size: 12px;
  }
  
  .nav-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 9px;
    min-width: 14px;
    height: 14px;
  }
}
</style>
