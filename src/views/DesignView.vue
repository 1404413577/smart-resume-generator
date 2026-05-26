<template>
  <div class="design-studio-layout" :class="{ 'is-mobile': isMobile }">
    <!-- 顶部导航栏 -->
    <header class="studio-header">
      <div class="header-left">
        <el-button @click="goBack" :icon="ArrowLeft" circle size="default" />
        <div class="title-group">
          <h1>设计工作室</h1>
          <p v-if="!isMobile">{{ resumeName }} - 风格定制中</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleExportPDF" :icon="Printer" :size="isMobile ? 'small' : 'default'">
          {{ isMobile ? '导出' : '导出PDF' }}
        </el-button>
        <el-button v-if="!isMobile" @click="goBack">完成并返回编辑</el-button>
      </div>
    </header>

    <div class="studio-main">
      <!-- 左侧设置栏：桌面端常显，移动端按 Tab 显示 -->
      <aside class="settings-sidebar" v-if="!isMobile || mobileActiveTab === 'settings'">
        <StyleSettings />
      </aside>

      <!-- 右侧预览区：桌面端常显，移动端按 Tab 显示 -->
      <main class="preview-area" v-if="!isMobile || mobileActiveTab === 'preview'">
        <div class="preview-toolbar" v-if="!isMobile">
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

    <!-- 移动端底部切换栏 -->
    <div v-if="isMobile" class="mobile-tab-bar">
      <div
        class="tab-item"
        :class="{ active: mobileActiveTab === 'settings' }"
        @click="mobileActiveTab = 'settings'"
      >
        <el-icon><Setting /></el-icon>
        <span>样式设置</span>
      </div>
      <div
        class="tab-item"
        :class="{ active: mobileActiveTab === 'preview' }"
        @click="mobileActiveTab = 'preview'"
      >
        <el-icon><View /></el-icon>
        <span>预览</span>
      </div>
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
import { useWindowSize } from '@vueuse/core'
import {
  ArrowLeft,
  Printer,
  ZoomIn,
  ZoomOut,
  Setting,
  View
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import StyleSettings from '@components/settings/StyleSettingsNew.vue'
import ResumePreview from '@components/resume/ResumePreview.vue'

const router = useRouter()
const resumeStore = useResumeStore()

useGlobalStyles()

const { width: windowWidth } = useWindowSize()
const isMobile = computed(() => windowWidth.value <= 768)
const mobileActiveTab = ref('preview')

const scale = ref(0.85)
const viewMode = ref('single')
const viewportRef = ref(null)

const resumeName = computed(() => resumeStore.resumeData.personalInfo.name || '我的简历')

const currentTemplateComponent = computed(() => {
  const template = getTemplate(resumeStore.selectedTemplate)
  return template?.component || null
})

const containerStyle = computed(() => {
  const baseTransform = viewMode.value === 'fit' ? 0.7 : scale.value

  let effectiveScale = baseTransform
  if (isMobile.value) {
    const availableWidth = windowWidth.value - 32
    const a4Width = 210 * 3.7795
    effectiveScale = Math.min(availableWidth / a4Width, 1)
  }

  return {
    transform: `scale(${effectiveScale})`,
    transformOrigin: 'top center'
  }
})

const goBack = () => {
  router.push('/')
}

const zoomIn = () => { if (scale.value < 1.5) scale.value += 0.1 }
const zoomOut = () => { if (scale.value > 0.4) scale.value -= 0.1 }

const handleExportPDF = async () => {
  const originalScale = scale.value
  try {
    const filename = `${resumeName.value}_设计版.pdf`
    const template = getTemplate(resumeStore.selectedTemplate)

    scale.value = 1
    await nextTick()

    if (template?.isMultiPage) {
      await generateMultiPageResumePDF('resume-preview-design', filename, resumeStore.globalSettings?.pageSettings)
    } else {
      await generateOptimizedPDF('resume-preview-design', filename)
    }

    ElMessage.success('PDF 导出成功')
  } catch (error) {
    console.error('Export error:', error)
    ElMessage.error('导出失败')
  } finally {
    scale.value = originalScale
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

/* ========== 顶部导航栏 ========== */
.studio-header {
  height: 64px;
  min-height: 64px;
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

/* ========== 主体区域 ========== */
.studio-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ========== 设置侧栏 ========== */
.settings-sidebar {
  width: 480px;
  min-width: 480px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  padding: 20px;
}

/* ========== 预览区域 ========== */
.preview-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #cbd5e1;
  position: relative;
}

.preview-toolbar {
  height: 48px;
  min-height: 48px;
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

:deep(.style-revamp-container) {
  height: auto;
  box-shadow: none;
  border: none;
}

/* ========== 移动端底部 Tab 栏 ========== */
.mobile-tab-bar {
  height: 60px;
  min-height: 60px;
  background: #ffffff;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #909399;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  padding: 8px 0;
}

.tab-item.active {
  color: #409eff;
}

.tab-item .el-icon {
  font-size: 20px;
}

.tab-item span {
  font-size: 11px;
  font-weight: 500;
}

/* ========== 响应式：平板 (769-1200) ========== */
@media (max-width: 1200px) {
  .settings-sidebar {
    width: 380px;
    min-width: 380px;
    padding: 16px;
  }

  .preview-viewport {
    padding: 24px;
  }
}

/* ========== 响应式：移动端 (≤768) ========== */
@media (max-width: 768px) {
  .design-studio-layout.is-mobile {
    height: 100vh;
  }

  .studio-header {
    height: 52px;
    min-height: 52px;
    padding: 0 12px;
  }

  .header-left {
    gap: 10px;
  }

  .header-left .el-button {
    width: 32px;
    height: 32px;
  }

  .title-group h1 {
    font-size: 15px;
  }

  .header-actions {
    gap: 8px;
  }

  .header-actions .el-button {
    padding: 6px 12px;
    font-size: 13px;
  }

  .studio-main {
    flex: 1;
    display: block;
    overflow-y: auto;
  }

  .settings-sidebar {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    border-right: none;
    padding: 12px;
    height: 100%;
  }

  .preview-area {
    width: 100%;
    height: 100%;
  }

  .preview-viewport {
    padding: 16px 8px;
  }

  .preview-container {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}
</style>
