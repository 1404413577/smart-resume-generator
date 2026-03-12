<template>
  <div class="design-studio-layout">
    <!-- 顶部导航栏 -->
    <header class="studio-header">
      <div class="header-left">
        <el-button @click="goBack" :icon="ArrowLeft" circle />
        <div class="title-group">
          <h1>设计工作室</h1>
          <p>{{ resumeName }} - 风格定制中</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleExportPDF" :icon="Printer">导出PDF</el-button>
        <el-button @click="goBack">完成并返回编辑</el-button>
      </div>
    </header>

    <div class="studio-main">
      <!-- 左侧设置栏 -->
      <aside class="settings-sidebar">
        <StyleSettings />
      </aside>

      <!-- 右侧预览区 -->
      <main class="preview-area">
        <div class="preview-toolbar">
          <div class="zoom-controls">
            <el-button @click="zoomOut" :icon="ZoomOut" circle size="small" :disabled="scale <= 0.4" />
            <span class="scale-text">{{ Math.round(scale * 100) }}%</span>
            <el-button @click="zoomIn" :icon="ZoomIn" circle size="small" :disabled="scale >= 1.5" />
          </div>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="single">单页</el-radio-button>
            <el-radio-button label="fit">适应屏幕</el-radio-button>
          </el-radio-group>
        </div>

        <div class="preview-viewport" ref="viewportRef">
          <div class="preview-scroller">
            <div class="preview-container" :style="containerStyle">
              <div id="resume-preview-design">
                <component
                  v-if="currentTemplateComponent"
                  :is="currentTemplateComponent"
                  :resume-data="resumeStore.resumeData"
                  :template-id="resumeStore.selectedTemplate"
                  :page-settings="resumeStore.globalSettings?.pageSettings"
                />
                <ResumePreview v-else :scale="1" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@stores/resume'
import { useGlobalStyles } from '@/composables/useGlobalStyles'
import { getTemplate } from '@templates'
import { generateOptimizedPDF } from '@utils/pdf/pdfGenerator'
import { generateMultiPageResumePDF } from '@utils/pdf/multiPagePdfGenerator'
import {
  ArrowLeft,
  Printer,
  ZoomIn,
  ZoomOut,
  Document
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 组件
import StyleSettings from '@components/settings/StyleSettingsNew.vue'
import ResumePreview from '@components/resume/ResumePreview.vue'

const router = useRouter()
const resumeStore = useResumeStore()

// 启用全局样式实时注入
useGlobalStyles()

// 状态
const scale = ref(0.85)
const viewMode = ref('single')
const viewportRef = ref(null)

// 计算属性
const resumeName = computed(() => resumeStore.resumeData.personalInfo.name || '我的简历')

const currentTemplateComponent = computed(() => {
  const template = getTemplate(resumeStore.selectedTemplate)
  return template?.component || null
})

const containerStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'top center'
}))

// 方法
const goBack = () => {
  router.push('/')
}

const zoomIn = () => { if (scale.value < 1.5) scale.value += 0.1 }
const zoomOut = () => { if (scale.value > 0.4) scale.value -= 0.1 }

const handleExportPDF = async () => {
  try {
    const filename = `${resumeName.value}_设计版.pdf`
    const template = getTemplate(resumeStore.selectedTemplate)
    
    // 临时重置缩放以导出
    const originalScale = scale.value
    scale.value = 1
    await nextTick()

    if (template?.isMultiPage) {
      await generateMultiPageResumePDF('resume-preview-design', filename, resumeStore.globalSettings?.pageSettings)
    } else {
      await generateOptimizedPDF('resume-preview-design', filename)
    }
    
    scale.value = originalScale
    ElMessage.success('PDF 导出成功')
  } catch (error) {
    console.error('Export error:', error)
    ElMessage.error('导出失败')
  }
}

onMounted(() => {
  if (window.innerWidth < 1200) scale.value = 0.6
})
</script>

<style scoped>
.design-studio-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
  overflow: hidden;
}

.studio-header {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-group h1 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.title-group p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.studio-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.settings-sidebar {
  width: 480px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  padding: 20px;
}

.preview-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #cbd5e1;
  position: relative;
}

.preview-toolbar {
  height: 48px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e2e8f0;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.scale-text {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  min-width: 40px;
  text-align: center;
}

.preview-viewport {
  flex: 1;
  overflow: auto;
  padding: 40px;
  display: flex;
  justify-content: center;
}

.preview-scroller {
  display: inline-block;
}

.preview-container {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  background: white;
}

/* 适配样式设置组件 */
:deep(.style-revamp-container) {
  height: auto;
  box-shadow: none;
  border: none;
}
</style>
