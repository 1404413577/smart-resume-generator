/**
 * 全局样式管理 Composable
 */

import { watch, onMounted, onUnmounted } from 'vue'
import { useResumeStore } from '../stores/resume'
import { applyCSSVariables, generatePrintStyles } from '../utils/styleUtils'

export function useGlobalStyles() {
  const resumeStore = useResumeStore()
  let styleElement = null

  /**
   * 应用全局样式到预览区域
   */
  const applyGlobalStyles = () => {
    const previewElement = document.getElementById('resume-preview')
    if (previewElement && resumeStore.globalSettings) {
      applyCSSVariables(previewElement, resumeStore.globalSettings)
    }
  }

  /**
   * 更新打印样式
   */
  const updatePrintStyles = () => {
    // 移除旧的样式
    if (styleElement) {
      document.head.removeChild(styleElement)
    }

    // 创建新的样式元素
    styleElement = document.createElement('style')
    styleElement.id = 'resume-print-styles'
    styleElement.textContent = generatePrintStyles(resumeStore.globalSettings)
    document.head.appendChild(styleElement)
  }

  /**
   * 初始化样式
   */
  const initStyles = () => {
    applyGlobalStyles()
    updatePrintStyles()
  }

  /**
   * 监听全局设置变化
   */
  const watchGlobalSettings = () => {
    return watch(
      () => resumeStore.globalSettings,
      () => {
        applyGlobalStyles()
        updatePrintStyles()
      },
      { deep: true, immediate: true }
    )
  }

  /**
   * 清理样式
   */
  const cleanup = () => {
    if (styleElement) {
      document.head.removeChild(styleElement)
      styleElement = null
    }
  }

  // 生命周期钩子
  onMounted(() => {
    // 延迟执行，确保DOM已渲染
    setTimeout(initStyles, 100)
  })

  onUnmounted(() => {
    cleanup()
  })

  // 监听设置变化
  const stopWatcher = watchGlobalSettings()

  // 返回方法供外部使用
  return {
    applyGlobalStyles,
    updatePrintStyles,
    initStyles,
    cleanup,
    stopWatcher
  }
}

/**
 * 简化版本，仅用于应用样式变量
 */
export function useStyleVariables() {
  const resumeStore = useResumeStore()

  const applyToElement = (element) => {
    if (element && resumeStore.globalSettings) {
      applyCSSVariables(element, resumeStore.globalSettings)
    }
  }

  return {
    applyToElement,
    globalSettings: resumeStore.globalSettings
  }
}
