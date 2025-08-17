<template>
  <div class="page-container" :class="{ 'print-mode': isPrintMode }">
    <div class="page" :style="pageStyles">
      <div class="page-content" :style="contentStyles">
        <slot />
      </div>
      
      <!-- 页码 -->
      <div v-if="showPageNumber && pageNumber" class="page-number">
        {{ pageNumber }} / {{ totalPages }}
      </div>
    </div>
    
    <!-- 页面分隔线（仅在预览模式显示） -->
    <div v-if="!isLastPage && !isPrintMode" class="page-separator">
      <div class="separator-line"></div>
      <div class="separator-label">第{{ pageNumber + 1 }}页</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '../stores/resume'

const props = defineProps({
  pageNumber: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  isLastPage: {
    type: Boolean,
    default: false
  },
  isPrintMode: {
    type: Boolean,
    default: false
  }
})

const resumeStore = useResumeStore()

// 计算属性
const pageSettings = computed(() => resumeStore.globalSettings.pageSettings)
const pageMargin = computed(() => resumeStore.globalSettings.spacing.pageMargin)
const showPageNumber = computed(() => pageSettings.value.showPageNumbers)

// A4纸张尺寸（毫米）
const A4_WIDTH = 210
const A4_HEIGHT = 297

// 页面样式
const pageStyles = computed(() => ({
  width: `${A4_WIDTH}mm`,
  height: `${A4_HEIGHT}mm`,
  padding: `${pageMargin.value.top}mm ${pageMargin.value.right}mm ${pageMargin.value.bottom}mm ${pageMargin.value.left}mm`,
  boxSizing: 'border-box'
}))

// 内容区域样式
const contentStyles = computed(() => {
  const contentWidth = A4_WIDTH - pageMargin.value.left - pageMargin.value.right
  const contentHeight = A4_HEIGHT - pageMargin.value.top - pageMargin.value.bottom
  
  return {
    width: `${contentWidth}mm`,
    height: `${contentHeight}mm`,
    overflow: 'hidden', // 确保内容不超出页面
    position: 'relative'
  }
})
</script>

<style scoped>
.page-container {
  margin-bottom: 20px;
  position: relative;
}

.page-container.print-mode {
  margin-bottom: 0;
}

.page {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.page-content {
  background: white;
  overflow: hidden;
}

.page-number {
  position: absolute;
  bottom: 8mm;
  right: 8mm;
  font-size: 10px;
  color: #666;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
  z-index: 1000;
}

.page-separator {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.separator-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent 0%, #ddd 20%, #999 50%, #ddd 80%, transparent 100%);
  position: relative;
}

.separator-line::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: white;
  border: 2px solid #999;
  border-radius: 50%;
}

.separator-label {
  position: absolute;
  top: -8px;
  right: 20px;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
  border: 1px solid #ddd;
  font-weight: 500;
}

/* 打印样式 */
@media print {
  .page-container {
    margin-bottom: 0;
    page-break-after: always;
  }
  
  .page-container:last-child {
    page-break-after: auto;
  }
  
  .page {
    box-shadow: none;
    border-radius: 0;
    margin: 0;
    width: 210mm !important;
    height: 297mm !important;
  }
  
  .page-content {
    overflow: visible;
  }
  
  .page-separator {
    display: none;
  }
  
  .page-number {
    background: transparent;
  }
  
  @page {
    size: A4;
    margin: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page {
    transform: scale(0.7);
    transform-origin: top center;
    margin-bottom: 40px;
  }
  
  .page-separator {
    transform: scale(0.7);
  }
}

@media (max-width: 480px) {
  .page {
    transform: scale(0.5);
    margin-bottom: 60px;
  }
}
</style>
