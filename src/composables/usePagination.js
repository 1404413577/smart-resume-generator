/**
 * 分页功能组合函数
 */

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useResumeStore } from '../stores/resume'
import {
  calculatePageContentHeight,
  calculateTotalHeight,
  generatePageBreaks,
  calculateAutoPageBreaks,
  applyPageBreaks,
  generatePageContainerStyles
} from '../utils/paginationUtils'

export function usePagination(templateRef) {
  const resumeStore = useResumeStore()
  
  // 响应式数据
  const currentPageBreaks = ref([])
  const isInitialized = ref(false)
  
  // 计算属性
  const pageSettings = computed(() => resumeStore.globalSettings.pageSettings)
  const pageMargin = computed(() => resumeStore.globalSettings.spacing.pageMargin)
  
  const pageCount = computed(() => pageSettings.value.pageCount)
  const pagingMode = computed(() => pageSettings.value.pagingMode)
  const showPageNumbers = computed(() => pageSettings.value.showPageNumbers)
  
  // 计算页面样式
  const containerStyles = computed(() => {
    return generatePageContainerStyles(pageSettings.value, pageMargin.value)
  })
  
  // 计算总高度
  const totalHeight = computed(() => {
    if (pageCount.value === 1) {
      return `${calculatePageContentHeight(pageMargin.value)}mm`
    } else {
      return 'auto'
    }
  })
  
  // 是否为多页模式
  const isMultiPage = computed(() => pageCount.value > 1)
  
  /**
   * 初始化分页
   */
  const initializePagination = async () => {
    if (!templateRef.value) return
    
    await nextTick()
    
    try {
      if (pagingMode.value === 'auto') {
        // 自动分页
        const autoBreaks = calculateAutoPageBreaks(
          templateRef.value,
          pageSettings.value,
          pageMargin.value
        )
        currentPageBreaks.value = autoBreaks
      } else {
        // 手动分页
        currentPageBreaks.value = pageSettings.value.pageBreaks || []
      }
      
      // 应用分页
      applyPageBreaks(
        templateRef.value,
        currentPageBreaks.value,
        showPageNumbers.value
      )
      
      isInitialized.value = true
    } catch (error) {
      console.error('分页初始化失败:', error)
    }
  }
  
  /**
   * 更新分页
   */
  const updatePagination = async () => {
    if (!isInitialized.value) return
    await initializePagination()
  }
  
  /**
   * 重置分页
   */
  const resetPagination = () => {
    if (!templateRef.value) return
    
    const children = Array.from(templateRef.value.children)
    children.forEach(child => {
      child.classList.remove('page-break-before')
      child.style.pageBreakBefore = ''
      child.removeAttribute('data-page-number')
    })
    
    currentPageBreaks.value = []
    isInitialized.value = false
  }
  
  /**
   * 添加手动分页点
   */
  const addManualPageBreak = (elementIndex) => {
    if (pagingMode.value !== 'manual') return
    
    const breaks = [...currentPageBreaks.value]
    if (!breaks.includes(elementIndex)) {
      breaks.push(elementIndex)
      breaks.sort((a, b) => a - b)
      currentPageBreaks.value = breaks
      
      // 更新store中的分页点
      resumeStore.updatePageSetting('pageBreaks', breaks)
      
      // 重新应用分页
      updatePagination()
    }
  }
  
  /**
   * 移除手动分页点
   */
  const removeManualPageBreak = (elementIndex) => {
    if (pagingMode.value !== 'manual') return
    
    const breaks = currentPageBreaks.value.filter(index => index !== elementIndex)
    currentPageBreaks.value = breaks
    
    // 更新store中的分页点
    resumeStore.updatePageSetting('pageBreaks', breaks)
    
    // 重新应用分页
    updatePagination()
  }
  
  /**
   * 获取当前页码
   */
  const getCurrentPage = (elementIndex) => {
    let page = 1
    for (const breakIndex of currentPageBreaks.value) {
      if (elementIndex >= breakIndex) {
        page++
      } else {
        break
      }
    }
    return page
  }
  
  /**
   * 检查元素是否在指定页面
   */
  const isElementOnPage = (elementIndex, pageNumber) => {
    return getCurrentPage(elementIndex) === pageNumber
  }
  
  // 监听设置变化
  watch(
    [pageCount, pagingMode, pageMargin],
    () => {
      if (isInitialized.value) {
        updatePagination()
      }
    },
    { deep: true }
  )
  
  // 监听窗口大小变化
  const handleResize = () => {
    if (isInitialized.value) {
      updatePagination()
    }
  }
  
  // 生命周期
  onMounted(() => {
    // 延迟初始化，确保DOM已渲染
    setTimeout(initializePagination, 100)
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    resetPagination()
  })
  
  return {
    // 响应式数据
    currentPageBreaks,
    isInitialized,
    
    // 计算属性
    pageCount,
    pagingMode,
    showPageNumbers,
    containerStyles,
    totalHeight,
    isMultiPage,
    
    // 方法
    initializePagination,
    updatePagination,
    resetPagination,
    addManualPageBreak,
    removeManualPageBreak,
    getCurrentPage,
    isElementOnPage
  }
}
