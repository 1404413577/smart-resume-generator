<template>
  <div class="style-revamp-container">
    <!-- 侧边导航栏 -->
    <div class="glass-sidebar">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="nav-tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <el-icon><component :is="tab.icon" /></el-icon>
        <span>{{ tab.name }}</span>
      </div>
    </div>

    <!-- 主内容面板 -->
    <div class="content-panel">
      <Transition name="fade-slide" mode="out-in">
        <!-- 版式风格 Tab -->
        <div v-if='activeTab === `layout`' class='tab-content' key='layout'>
          <div class='section-header'>
            <h3>版式风格</h3>
            <p>控制简历整体结构、模块标题和信息密度</p>
          </div>

          <div class='option-section'>
            <div class='section-title-row compact-row'>
              <h4>整体版式</h4>
            </div>
            <div class='layout-visual-grid'>
              <div
                v-for='option in designStyleOptions'
                :key='option.value'
                class='layout-visual-card'
                :class='{ active: currentLayout.designStyle === option.value }'
                @click='applyDesignStyle(option.value)'
              >
                <div class='visual-box' :class='option.value'>
                  <span class='v-line name-line'></span>
                  <span class='v-line title-line'></span>
                  <span class='v-line full'></span>
                  <span class='v-line full short'></span>
                  <span class='v-line full'></span>
                </div>
                <div class='option-copy'>
                  <span>{{ option.label }}</span>
                  <small>{{ option.desc }}</small>
                </div>
              </div>
            </div>
          </div>

          <div class='option-section'>
            <div class='section-title-row compact-row'>
              <h4>模块标题</h4>
            </div>
            <div class='segmented-grid'>
              <button
                v-for='option in titleStyleOptions'
                :key='option.value'
                class='segmented-option'
                :class='{ active: currentLayout.sectionTitleStyle === option.value }'
                @click='applyTitleStyle(option.value)'
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class='option-section'>
            <div class='section-title-row compact-row'>
              <h4>信息密度</h4>
            </div>
            <div class='density-grid'>
              <button
                v-for='option in densityOptions'
                :key='option.value'
                class='density-card'
                :class='{ active: currentLayout.densityPreset === option.value }'
                @click='applyDensity(option.value)'
              >
                <span>{{ option.label }}</span>
                <small>{{ option.desc }}</small>
              </button>
            </div>
          </div>
        </div>

        <!-- 配色方案 Tab -->
        <div v-else-if="activeTab === 'theme'" class="tab-content" key="theme">
          <div class="section-header">
            <h3>主题方案</h3>
            <p>选择精心设计的专业色调，一键提升简历质感</p>
          </div>

          <div class="palette-grid">
            <div
              v-for="(preset, key) in premiumPresets"
              :key="key"
              class="palette-card"
              :class="{ active: currentTheme.preset === key }"
              @click="handleApplyThemePreset(key)"
            >
              <div class="palette-preview" :style="{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }">
                <div class="accent-dot" :style="{ backgroundColor: preset.accent }"></div>
              </div>
              <span class="palette-name">{{ getPresetName(key) }}</span>
            </div>
          </div>

          <div class="custom-section">
            <div class="section-title-row">
              <h4>自定义调色盘</h4>
              <el-button link type="primary" size="small" @click="resetColors">重置颜色</el-button>
            </div>
            <div class="color-rows">
              <div class="color-row-item" v-for="field in colorFields" :key="field.key">
                <div class="field-info">
                  <span class="label">{{ field.label }}</span>
                  <span class="hex">{{ currentTheme[field.key] }}</span>
                </div>
                <el-color-picker
                  v-model="currentTheme[field.key]"
                  @change="handleColorChange"
                  show-alpha
                  size="default"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 字体排版 Tab -->
        <div v-else-if="activeTab === 'font'" class="tab-content" key="font">
          <div class="section-header">
            <h3>文字美化</h3>
            <p>优选职场字体，精调间距，让内容更易阅读</p>
          </div>

          <div class="premium-card">
            <div class="field-label">字体家族</div>
            <el-select v-model="currentTypography.fontFamily" @change="handleTypographyChange" class="premium-select">
              <el-option v-for="font in fontOptions" :key="font.value" :label="font.label" :value="font.value">
                <span :style="{ fontFamily: font.value }">{{ font.label }}</span>
              </el-option>
            </el-select>
          </div>

          <div class="sliders-group">
            <div class="slider-card">
              <div class="slider-header">
                <label>基础字号</label>
                <span class="value-badge">{{ currentTypography.baseFontSize }}px</span>
              </div>
              <el-slider v-model="currentTypography.baseFontSize" :min="10" :max="20" @change="handleTypographyChange" />
            </div>

            <div class="slider-card">
              <div class="slider-header">
                <label>标题强度</label>
                <span class="value-badge">{{ currentTypography.titleFontSize }}px</span>
              </div>
              <el-slider v-model="currentTypography.titleFontSize" :min="14" :max="32" @change="handleTypographyChange" />
            </div>

            <div class="slider-card">
              <div class="slider-header">
                <label>文本行高</label>
                <span class="value-badge">{{ currentSpacing.lineHeight }}</span>
              </div>
              <el-slider v-model="currentSpacing.lineHeight" :min="1.0" :max="2.5" :step="0.1" @change="handleSpacingChange" />
            </div>
          </div>
        </div>

        <!-- 页面设置 Tab -->
        <div v-else-if="activeTab === 'page'" class="tab-content" key="page">
          <div class="section-header">
            <h3>打印与导出</h3>
            <p>针对 PDF 导出和分段打印进行极致优化</p>
          </div>

          <div class="page-mode-grid">
            <div 
              class="page-mode-card" 
              v-for="n in 3" 
              :key="n"
              :class="{ active: currentPageSettings.pageCount === n }"
              @click="currentPageSettings.pageCount = n; handlePageSettingsChange()"
            >
              <div class="page-icon-stack">
                <el-icon v-for="i in n" :key="i" class="stacked-doc"><Document /></el-icon>
              </div>
              <span class="page-label">{{ n === 1 ? '精炼单页' : n === 2 ? '标准双页' : '详实三页' }}</span>
            </div>
          </div>

          <div class="slider-card">
            <div class="slider-header">
              <label>全局页边距</label>
              <span class="value-badge">{{ currentSpacing.pageMargin.top }}px</span>
            </div>
            <el-slider 
              v-model="currentSpacing.pageMargin.top" 
              :min="0" 
              :max="60" 
              @change="handlePageMarginChange"
            />
            <p class="slider-hint">调节边距可改善阅读时的“呼吸感”</p>
          </div>

          <div class="action-footer">
            <el-button type="danger" round plain @click="handleResetSettings" :icon="RefreshLeft">
              重置所有样式
            </el-button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useResumeStore } from '@stores/resume'
import { ElMessage } from 'element-plus'
import {
  Brush,
  Edit,
  Monitor,
  Document,
  RefreshLeft
} from '@element-plus/icons-vue'

const resumeStore = useResumeStore()
const activeTab = ref('layout')

const tabs = [
  { id: 'layout', name: '版式风格', icon: Monitor },
  { id: 'theme', name: '配色方案', icon: Brush },
  { id: 'font', name: '文字排版', icon: Edit },
  { id: 'page', name: '页面设置', icon: Monitor }
]

const designStyleOptions = [
  { value: 'classic', label: '经典单栏', desc: '稳重清晰，适合 ATS' },
  { value: 'modern', label: '现代单栏', desc: '克制强调，通用耐看' },
  { value: 'business', label: '商务页眉', desc: '姓名区更正式突出' },
  { value: 'minimal', label: '极简文本', desc: '去装饰，强调内容' },
  { value: 'emphasis', label: '重点突出', desc: '模块层级更鲜明' }
]

const titleStyleOptions = [
  { value: 'plain', label: '无装饰' },
  { value: 'underline', label: '下划线' },
  { value: 'accent', label: '左竖线' },
  { value: 'block', label: '背景条' }
]

const densityOptions = [
  { value: 'relaxed', label: '舒展', desc: '留白更多，阅读轻松' },
  { value: 'standard', label: '标准', desc: '默认间距，适合多数简历' },
  { value: 'compact', label: '紧凑', desc: '内容较多时压缩到一页' }
]

const colorFields = [
  { key: 'primary', label: '主题主色 (标题、边框)' },
  { key: 'secondary', label: '辅助色 (副标题、图标)' },
  { key: 'accent', label: '强调色 (链接、重点)' },
  { key: 'textPrimary', label: '正文文字颜色' },
  { key: 'background', label: '页面背景底色' }
]

const fontOptions = [
  { label: '系统黑体 (默认)', value: 'var(--font-family-base)' },
  { label: '思源黑体 (更均衡)', value: '"Noto Sans SC", sans-serif' },
  { label: '思源宋体 (典雅)', value: '"Noto Serif SC", serif' },
  { label: '官方楷体 (传统)', value: 'KaiTi, "STKaiti", serif' },
  { label: 'Helvetica / Arial', value: 'Helvetica, Arial, sans-serif' }
]

const premiumPresets = {
  professional: {
    primary: '#1e293b',
    secondary: '#475569',
    accent: '#3b82f6',
    textPrimary: '#1e293b',
    background: '#ffffff',
    name: '职场经典'
  },
  tech: {
    primary: '#0f172a',
    secondary: '#334155',
    accent: '#06b6d4',
    textPrimary: '#0f172a',
    background: '#f8fafc',
    name: '极客蓝'
  },
  creative: {
    primary: '#4c1d95',
    secondary: '#7c3aed',
    accent: '#f43f5e',
    textPrimary: '#2e1065',
    background: '#ffffff',
    name: '艺术创意'
  },
  nature: {
    primary: '#064e3b',
    secondary: '#059669',
    accent: '#10b981',
    textPrimary: '#064e3b',
    background: '#f0fdf4',
    name: '清新自然'
  },
  minimal: {
    primary: '#000000',
    secondary: '#404040',
    accent: '#737373',
    textPrimary: '#000000',
    background: '#ffffff',
    name: '极致简约'
  }
}

// 获取 Store 数据
const globalSettings = computed(() => resumeStore.globalSettings || {})

// 实例化响应式副本
const currentTheme = reactive({
  primary: '#1e293b',
  secondary: '#475569',
  accent: '#3b82f6',
  textPrimary: '#1e293b',
  background: '#ffffff',
  preset: 'professional',
  ...globalSettings.value.theme
})

const currentTypography = reactive({
  baseFontSize: 14,
  titleFontSize: 18,
  fontFamily: 'var(--font-family-base)',
  ...globalSettings.value.typography
})

const currentSpacing = reactive({
  pageMargin: { top: 24, right: 24, bottom: 24, left: 24 },
  moduleSpacing: 16,
  lineHeight: 1.6,
  ...globalSettings.value.spacing
})

const currentLayout = reactive({
  designStyle: 'modern',
  sectionTitleStyle: 'accent',
  densityPreset: 'standard',
  ...globalSettings.value.layout
})

const currentPageSettings = reactive({
  pageCount: 1,
  pagingMode: 'auto',
  ...globalSettings.value.pageSettings
})

// UI 方法
const getPresetName = (key) => premiumPresets[key]?.name || key

const handleApplyThemePreset = (key) => {
  const preset = premiumPresets[key]
  if (preset) {
    Object.assign(currentTheme, { ...preset, preset: key })
    updateAllSettings()
    ElMessage.success({ message: `已应用 ${preset.name} 主题`, plain: true })
  }
}

const handleColorChange = () => {
  currentTheme.preset = 'custom'
  updateAllSettings()
}

const handleTypographyChange = () => updateAllSettings()
const handleSpacingChange = () => updateAllSettings()
const handlePageSettingsChange = () => updateAllSettings()

const applyDesignStyle = (value) => {
  currentLayout.designStyle = value
  updateAllSettings()
}

const applyTitleStyle = (value) => {
  currentLayout.sectionTitleStyle = value
  updateAllSettings()
}

const applyDensity = (value) => {
  const presets = {
    relaxed: { baseFontSize: 15, titleFontSize: 20, lineHeight: 1.75, moduleSpacing: 18, pageMargin: 26 },
    standard: { baseFontSize: 14, titleFontSize: 18, lineHeight: 1.5, moduleSpacing: 12, pageMargin: 20 },
    compact: { baseFontSize: 13, titleFontSize: 16, lineHeight: 1.35, moduleSpacing: 8, pageMargin: 16 }
  }
  const preset = presets[value]
  if (!preset) return

  currentLayout.densityPreset = value
  currentTypography.baseFontSize = preset.baseFontSize
  currentTypography.titleFontSize = preset.titleFontSize
  currentSpacing.lineHeight = preset.lineHeight
  currentSpacing.moduleSpacing = preset.moduleSpacing
  currentSpacing.pageMargin = {
    top: preset.pageMargin,
    right: preset.pageMargin,
    bottom: preset.pageMargin,
    left: preset.pageMargin
  }
  updateAllSettings()
}

const handlePageMarginChange = () => {
  const m = currentSpacing.pageMargin.top
  currentSpacing.pageMargin = { top: m, right: m, bottom: m, left: m }
  updateAllSettings()
}

const updateAllSettings = () => {
  resumeStore.updateGlobalSettings({
    theme: { ...currentTheme },
    typography: { ...currentTypography },
    spacing: { ...currentSpacing },
    layout: { ...currentLayout },
    pageSettings: { ...currentPageSettings }
  })
}

const resetColors = () => {
  const def = premiumPresets.professional
  Object.assign(currentTheme, { ...def, preset: 'professional' })
  updateAllSettings()
}

const handleResetSettings = () => {
  resumeStore.resetGlobalSettings()
  location.reload()
}

onMounted(() => {
  // 初始化逻辑可在此补充
})
</script>

<style scoped>
.style-revamp-container {
  display: flex;
  height: 650px;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

/* 侧边导航 */
.glass-sidebar {
  width: 90px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  padding: 30px 0;
  gap: 10px;
  border-right: 1px solid #f1f5f9;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #94a3b8;
  gap: 6px;
  position: relative;
}

.nav-tab .el-icon {
  font-size: 24px;
}

.nav-tab span {
  font-size: 12px;
  font-weight: 600;
}

.nav-tab:hover {
  color: #64748b;
  background: #f1f5f9;
}

.nav-tab.active {
  color: #3b82f6;
  background: #ffffff;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 15%;
  height: 70%;
  width: 4px;
  background: #3b82f6;
  border-radius: 4px 0 0 4px;
}

/* 主内容区 */
.content-panel {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  background: #ffffff;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section-header h3 {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: #0f172a;
}

.section-header p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 主题选择卡片 */
.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
}

.palette-card {
  padding: 12px;
  background: #ffffff;
  border-radius: 16px;
  border: 2px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.25s ease;
}

.palette-card:hover {
  transform: translateY(-4px);
  border-color: #e2e8f0;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.palette-card.active {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.palette-preview {
  height: 80px;
  border-radius: 12px;
  position: relative;
  margin-bottom: 12px;
}

.accent-dot {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2.5px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.palette-name {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  display: block;
  text-align: center;
}

/* 自定义部分 */
.custom-section {
  margin-top: 10px;
  padding-top: 25px;
  border-top: 1px solid #f1f5f9;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title-row h4 {
  font-size: 16px;
  margin: 0;
  color: #0f172a;
}

.color-rows {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.color-row-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: #f8fafc;
  border-radius: 14px;
}

.field-info {
  display: flex;
  flex-direction: column;
}

.field-info .label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.field-info .hex {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'JetBrains Mono', monospace;
}

/* 字体排版系统 */
.premium-card {
  padding: 24px;
  background: #f8fafc;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.field-label {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

.premium-select :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02) inset;
  padding: 8px 16px;
}

.slider-card {
  padding: 24px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.slider-header label {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.value-badge {
  background: #3b82f6;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
}

.slider-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 10px;
}

/* 布局可视化 */
.layout-visual-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.layout-visual-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 20px;
  border: 2.5px solid transparent;
  cursor: pointer;
  transition: all 0.25s;
}

.layout-visual-card.active {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
}

.visual-box {
  width: 80px;
  height: 100px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  gap: 6px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.03);
}

.v-line {
  background: #e2e8f0;
  border-radius: 3px;
}

.visual-box.traditional { flex-direction: column; }
.visual-box.traditional .v-line.full { height: 12px; width: 100%; margin-bottom: 6px; }

.visual-box.modern .side { width: 35%; height: 100%; background: #cbd5e1; }
.visual-box.modern .main { width: 60%; height: 100%; }

.visual-box.creative .side { width: 20%; height: 100%; background: #94a3b8; }
.visual-box.creative .main { width: 50%; height: 100%; }
.visual-box.creative .extra { width: 20%; height: 100%; background: #cbd5e1; }

.option-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.compact-row {
  margin-bottom: 0;
}

.option-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.option-copy span,
.density-card span {
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
}

.option-copy small,
.density-card small {
  font-size: 11px;
  line-height: 1.4;
  color: #64748b;
}

.visual-box.classic,
.visual-box.modern,
.visual-box.business,
.visual-box.minimal,
.visual-box.emphasis {
  flex-direction: column;
  gap: 7px;
}

.visual-box .name-line { width: 62%; height: 12px; background: #475569; }
.visual-box .title-line { width: 38%; height: 8px; background: #94a3b8; }
.visual-box .full { width: 100%; height: 7px; }
.visual-box .short { width: 72%; }
.visual-box.business .name-line { width: 100%; height: 18px; background: #1e293b; }
.visual-box.minimal .title-line { background: #e2e8f0; }
.visual-box.emphasis .title-line { background: #3b82f6; }

.segmented-grid,
.density-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.density-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.segmented-option,
.density-card {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.density-card {
  min-height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.segmented-option.active,
.density-card.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #1d4ed8;
}

/* 页面模式 */
.page-mode-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.page-mode-card {
  padding: 30px 20px;
  background: #f8fafc;
  border-radius: 20px;
  border: 2.5px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  cursor: pointer;
}

.page-mode-card.active {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.page-icon-stack {
  display: flex;
  gap: -10px;
}

.stacked-doc {
  font-size: 36px;
  color: #cbd5e1;
  margin-right: -15px;
}

.active .stacked-doc { color: #3b82f6; opacity: 0.8; }
.active .stacked-doc:last-child { opacity: 1; }

/* 转场动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

/* 页脚 */
.action-footer {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 滚动条定制 */
.content-panel::-webkit-scrollbar { width: 8px; }
.content-panel::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.content-panel::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
