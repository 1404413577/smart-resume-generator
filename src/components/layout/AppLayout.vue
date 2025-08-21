<template>
  <div class="app-layout">
    <!-- 简化的头部导航 -->
    <header class="app-header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <el-icon><Document /></el-icon>
          <span>智能简历生成器</span>
        </router-link>

        <nav class="main-nav">
          <router-link to="/" class="nav-link">编辑器</router-link>
          <router-link to="/resumes" class="nav-link">简历管理</router-link>
          <router-link to="/ai-assistant" class="nav-link">AI助手</router-link>
          <router-link to="/templates" class="nav-link">模板中心</router-link>
        </nav>
      </div>
    </header>

    <!-- 页面内容 -->
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- 全局组件 -->
    <DynamicStyles />
  </div>
</template>

<script setup>
import { Document } from '@element-plus/icons-vue'
import DynamicStyles from '@components/common/DynamicStyles.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app-header {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.logo:hover {
  color: #409eff;
}

.main-nav {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #409eff;
  background: rgba(64, 158, 255, 0.1);
}

.nav-link.router-link-active {
  color: #409eff;
  background: rgba(64, 158, 255, 0.1);
}

.main-content {
  flex: 1;
  overflow: hidden; /* 防止与内层三列产生双滚动冲突 */
  background: #f5f7fa;
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .main-nav {
    display: none;
  }

  .logo {
    font-size: 16px;
  }
}
</style>
