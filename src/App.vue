<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useResumeStore } from '@stores/resume'
import { useSEO } from '@/composables/useSEO'
import { printResume } from '@utils/pdf/browserPrint'
import { ElMessage } from 'element-plus'
import AppLayout from '@components/layout/AppLayout.vue'

const resumeStore = useResumeStore()

// SEO优化
const { applyPageSEO, setAppStructuredData } = useSEO()

// 处理键盘快捷键
const handleKeyboardShortcut = (event) => {
  // Ctrl+P 或 Cmd+P 打印简历
  if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
    event.preventDefault()
    const name = resumeStore.resumeData.personalInfo.name || '简历'
    printResume('resume-preview', {
      title: `${name}.pdf`,
      removeAfterPrint: true,
      addPrintStyles: true
    }).catch(error => {
      console.error('打印失败:', error)
      ElMessage.error('打印失败，请重试')
    })
  }
}

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

  // 添加键盘快捷键监听
  window.addEventListener('keydown', handleKeyboardShortcut)
})

// 清理
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut)
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


