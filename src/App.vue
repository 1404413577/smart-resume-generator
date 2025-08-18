<script setup>
import { onMounted } from 'vue'
import { useResumeStore } from './stores/resume'
import { useSEO } from './composables/useSEO'
import AppLayout from './components/layout/AppLayout.vue'

const resumeStore = useResumeStore()

// SEO优化
const { applyPageSEO, setAppStructuredData } = useSEO()

// 初始化
onMounted(() => {
  // 应用首页SEO配置
  applyPageSEO('home')

  // 设置应用结构化数据
  setAppStructuredData()

  // 初始化简历store
  resumeStore.init()

  // 移除加载状态
  const loadingElement = document.getElementById('loading')
  if (loadingElement) {
    loadingElement.style.display = 'none'
  }
})
</script>

<template>
  <div id="app">
    <!-- 应用布局 -->
    <AppLayout />
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>


