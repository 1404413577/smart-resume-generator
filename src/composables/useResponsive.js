/**
 * 移动端响应式组件库
 * 提供常用的响应式组件和 Composable
 */

import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

// ============ 响应式 Hook ============

/**
 * 响应式屏幕大小检查
 * @returns {Object} 屏幕宽度段判断
 */
export function useResponsive() {
  const { width } = useWindowSize()

  const isMobileSmall = computed(() => width.value < 480)   // 小手机 < 480px
  const isMobile = computed(() => width.value < 768)        // 手机 < 768px
  const isTablet = computed(() => width.value >= 768 && width.value < 992)  // 平板
  const isDesktop = computed(() => width.value >= 992)      // 桌面
  const isWide = computed(() => width.value >= 1200)        // 宽屏
  const isHD = computed(() => width.value >= 1408)          // 高清屏

  // 设备类型
  const deviceType = computed(() => {
    if (isMobileSmall.value) return 'mobile-small'
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    if (isWide.value) return 'wide'
    if (isHD.value) return 'hd'
    return 'desktop'
  })

  // 是否触摸设备
  const isTouchDevice = computed(() => {
    return () => {
      return (
        (typeof window !== 'undefined' && 'ontouchstart' in window) ||
        (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
      )
    }
  })

  return {
    width,
    isMobileSmall,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isHD,
    deviceType,
    isTouchDevice,
  }
}

/**
 * 响应式布局管理
 */
export function useResponsiveLayout() {
  const { width } = useWindowSize()

  // 计算栅格列数
  const gridColumns = computed(() => {
    if (width.value < 480) return 1
    if (width.value < 768) return 2
    if (width.value < 992) return 3
    if (width.value < 1200) return 4
    return 6
  })

  // 计算 gap 大小
  const gap = computed(() => {
    if (width.value < 768) return '12px'
    if (width.value < 992) return '16px'
    return '20px'
  })

  // 计算内边距
  const padding = computed(() => {
    if (width.value < 576) return '12px'
    if (width.value < 768) return '16px'
    if (width.value < 992) return '20px'
    return '24px'
  })

  // 计算 sidebar 宽度
  const sidebarWidth = computed(() => {
    if (width.value < 992) return '0px' // 移动端隐藏
    if (width.value < 1200) return '220px'
    return '260px'
  })

  // 计算容器最大宽度
  const containerMaxWidth = computed(() => {
    if (width.value < 576) return '100%'
    if (width.value < 768) return '540px'
    if (width.value < 992) return '720px'
    if (width.value < 1200) return '960px'
    if (width.value < 1408) return '1140px'
    return '1320px'
  })

  return {
    gridColumns,
    gap,
    padding,
    sidebarWidth,
    containerMaxWidth,
    width,
  }
}

/**
 * 分页管理 (适配移动端)
 */
export function useResponsivePagination(items, itemsPerPageMobile = 10, itemsPerPageDesktop = 20) {
  const { isMobile } = useResponsive()
  const currentPage = ref(1)

  const itemsPerPage = computed(() => {
    return isMobile.value ? itemsPerPageMobile : itemsPerPageDesktop
  })

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage.value)
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return items.value.slice(start, end)
  })

  const goToPage = (page) => {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  }

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    goToPage,
  }
}

/**
 * 响应式导航管理
 */
export function useResponsiveNavigation() {
  const { isMobile } = useResponsive()
  const isNavOpen = ref(false)

  const toggleNav = () => {
    if (isMobile.value) {
      isNavOpen.value = !isNavOpen.value
    }
  }

  const closeNav = () => {
    isNavOpen.value = false
  }

  const openNav = () => {
    isNavOpen.value = true
  }

  return {
    isNavOpen,
    toggleNav,
    closeNav,
    openNav,
    isMobileNav: isMobile,
  }
}

/**
 * 响应式侧边栏管理
 */
export function useResponsiveSidebar() {
  const { isDesktop } = useResponsive()
  const isSidebarOpen = ref(true)

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  // 在桌面端自动打开，移动端自动关闭
  const shouldShowSidebar = computed(() => {
    return isDesktop.value && isSidebarOpen.value
  })

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    shouldShowSidebar,
    isDesktopLayout: isDesktop,
  }
}

/**
 * 响应式模态框管理
 */
export function useResponsiveModal() {
  const { isMobile } = useResponsive()
  const isOpen = ref(false)

  // 移动端显示为 fullscreen，桌面端显示为 dialog
  const displayMode = computed(() => {
    return isMobile.value ? 'fullscreen' : 'dialog'
  })

  const modalClasses = computed(() => {
    if (displayMode.value === 'fullscreen') {
      return {
        'modal-fullscreen': true,
        'modal-open': isOpen.value,
      }
    }
    return {
      'modal': true,
      'modal-open': isOpen.value,
    }
  })

  return {
    isOpen,
    displayMode,
    modalClasses,
  }
}

/**
 * 响应式表单管理
 */
export function useResponsiveForm() {
  const { isMobile } = useResponsive()

  // 移动端使用单列布局，桌面端使用多列
  const formLayout = computed(() => {
    return isMobile.value ? 'vertical' : 'horizontal'
  })

  // 表单字段宽度
  const fieldWidth = computed(() => {
    return isMobile.value ? '100%' : 'auto'
  })

  // 按钮宽度
  const buttonWidth = computed(() => {
    return isMobile.value ? '100%' : 'auto'
  })

  return {
    formLayout,
    fieldWidth,
    buttonWidth,
    isMobileForm: isMobile,
  }
}

/**
 * 响应式工具提示
 */
export function useResponsiveTooltip() {
  const { isMobile } = useResponsive()

  // 移动端不显示 tooltip (使用 click 替代)
  const shouldShowTooltip = computed(() => {
    return !isMobile.value
  })

  return {
    shouldShowTooltip,
    triggerMode: computed(() => isMobile.value ? 'click' : 'hover'),
  }
}

/**
 * 响应式图片加载
 */
export function useResponsiveImage() {
  const { width } = useWindowSize()

  // 根据屏幕宽度选择合适的图片尺寸
  const imageSrc = computed(() => {
    if (width.value < 480) return 'src-mobile-small'
    if (width.value < 768) return 'src-mobile'
    if (width.value < 992) return 'src-tablet'
    if (width.value < 1200) return 'src-desktop'
    return 'src-widescreen'
  })

  return {
    imageSrc,
    width,
  }
}

/**
 * 响应式滚动管理
 */
export function useResponsiveScroll() {
  const { isMobile } = useResponsive()

  // 移动端禁用横向滚动
  const scrollBehavior = computed(() => {
    return isMobile.value ? 'vertical' : 'auto'
  })

  // 移动端使用溶解过度，桌面端使用平滑过度
  const scrollTransition = computed(() => {
    return isMobile.value ? 'none' : 'smooth'
  })

  return {
    scrollBehavior,
    scrollTransition,
    isMobileScroll: isMobile,
  }
}
