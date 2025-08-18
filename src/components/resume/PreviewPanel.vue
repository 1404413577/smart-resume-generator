<template>
  <div class="preview-panel">
    <div class="preview-header">
      <h3 class="preview-title">简历预览</h3>
      <div class="preview-actions">
        <div class="zoom-controls">
          <el-button @click="$emit('zoom-out')" size="small" :icon="ZoomOut" :disabled="previewScale <= 0.5" />
          <span class="zoom-display">{{ Math.round(previewScale * 100) }}%</span>
          <el-button @click="$emit('zoom-in')" size="small" :icon="ZoomIn" :disabled="previewScale >= 1.5" />
          <el-button @click="$emit('reset-zoom')" size="small" :icon="Refresh" />
        </div>
        
        <div class="action-controls">
          <el-button @click="toggleFullscreen" size="small" :icon="FullScreen">
            {{ isFullscreen ? '退出全屏' : '全屏预览' }}
          </el-button>
          <el-button @click="$emit('export-pdf')" type="primary" size="small" :icon="Download">
            导出PDF
          </el-button>
        </div>
      </div>
    </div>

    <div class="preview-content" :class="{ 'fullscreen': isFullscreen }">
      <div class="preview-container" :style="previewStyle">
        <ResumePreview
          id="resume-preview"
          :scale="previewScale"
          class="resume-preview"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ZoomIn,
  ZoomOut,
  Refresh,
  FullScreen,
  Download
} from '@element-plus/icons-vue'
import { useResumeStore } from '../../stores/resume'
import ResumePreview from './ResumePreview.vue'

const props = defineProps({
  previewScale: {
    type: Number,
    default: 1
  }
})

defineEmits(['zoom-in', 'zoom-out', 'reset-zoom', 'export-pdf'])

const resumeStore = useResumeStore()
const isFullscreen = ref(false)

// 计算属性
const previewStyle = computed(() => ({
  transform: `scale(${props.previewScale})`,
  transformOrigin: 'top center'
}))

// 方法
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  // TODO: 实现全屏预览功能
}
</script>

<style scoped>
.preview-panel {
  width: 400px;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 0;
}

.preview-panel.full-width {
  width: 100%;
  max-width: none;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  flex-wrap: wrap;
  gap: 10px;
}

.preview-title {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 6px;
}

.zoom-display {
  font-size: 12px;
  color: #606266;
  min-width: 35px;
  text-align: center;
  font-weight: 500;
}

.action-controls {
  display: flex;
  gap: 8px;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.preview-content.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #f5f7fa;
  padding: 40px;
}

.preview-container {
  transition: transform 0.3s ease;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.resume-preview {
  width: 210mm;
  min-height: 297mm;
  background: white;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .preview-panel {
    width: 350px; /* 保持固定宽度，但稍微缩小 */
    height: 100%;
  }
}

@media (max-width: 768px) {
  .preview-panel {
    width: 100%;
    height: 400px;
  }
  
  .preview-header {
    padding: 12px 15px;
    flex-direction: column;
    align-items: stretch;
  }
  
  .preview-actions {
    justify-content: space-between;
  }
  
  .preview-content {
    padding: 15px;
  }
  
  .resume-preview {
    width: 100%;
    min-height: auto;
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .preview-header {
    padding: 10px;
  }
  
  .preview-title {
    font-size: 14px;
  }
  
  .zoom-controls,
  .action-controls {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .action-controls .el-button {
    font-size: 12px;
    padding: 4px 8px;
  }
  
  .preview-content {
    padding: 10px;
  }
}

/* 打印样式 */
@media print {
  .preview-panel {
    width: 100%;
    height: auto;
  }
  
  .preview-header {
    display: none;
  }
  
  .preview-content {
    padding: 0;
    overflow: visible;
  }
  
  .preview-container {
    transform: none !important;
    box-shadow: none;
    border-radius: 0;
  }
}
</style>
