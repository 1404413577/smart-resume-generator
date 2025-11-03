<template>
  <div class="print-root">
    <!-- 纯净的打印容器，复用现有预览组件 -->
    <ResumePreview id="resume-preview" :scale="1" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useResumeStore } from '@stores/resume'
import ResumePreview from '@components/resume/ResumePreview.vue'

const route = useRoute()
const resumeStore = useResumeStore()

onMounted(() => {
  // 打印视图初始化
  console.log('Print view mounted')
})
</script>

<style scoped>
.print-root {
  /* 屏幕预览时的居中容器 */
  width: 210mm;
  margin: 0 auto;
  padding: 12mm;
  background: #fff;
  box-sizing: border-box;
}

/* 打印介质下强制按A4渲染且避免双重边距/缩放 */
@media print {
  :host, .print-root {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
    background: #fff !important;
  }
  /* 让 @page 控制边距，避免容器与组件的 padding 叠加导致缩放 */
  @page { size: A4; margin: 20mm; }

  /* 移除组件内部的固定尺寸与边距，避免被 PDF 缩放造成字距异常 */
  #resume-preview.resume-preview {
    width: auto !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    padding: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    aspect-ratio: auto !important;
    overflow: visible !important;
  }
  /* 优化字体渲染，保持适当的字符间距 */
  #resume-preview {
    letter-spacing: 0.05em !important; /* 保持适当的字符间距，特别是中文 */
    word-spacing: 0.03em !important;
    line-height: 1.6 !important; /* 增加行间距 */
    -webkit-font-smoothing: antialiased !important;
    text-rendering: optimizeLegibility !important;
    font-family: 'Segoe UI', 'Microsoft YaHei', '微软雅黑', 'SimSun', '宋体', sans-serif !important;
  }
}
</style>

