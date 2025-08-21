<template>
  <div class="style-settings">
    <!-- 主题设置 -->
    <div class="setting-group">
      <h4 class="group-title">
        <el-icon><Edit /></el-icon>
        主题配色
      </h4>
      
      <!-- 主题预设 -->
      <div class="theme-presets">
        <div
          v-for="(preset, key) in availableThemePresets"
          :key="key"
          class="theme-preset"
          :class="{ active: currentTheme?.preset === key }"
          @click="handleApplyThemePreset(key)"
        >
          <div class="preset-preview">
            <div 
              class="color-dot primary" 
              :style="{ backgroundColor: preset.primary }"
            ></div>
            <div 
              class="color-dot secondary" 
              :style="{ backgroundColor: preset.secondary }"
            ></div>
            <div 
              class="color-dot accent" 
              :style="{ backgroundColor: preset.accent }"
            ></div>
          </div>
          <span class="preset-name">{{ getPresetName(key) }}</span>
        </div>
      </div>

      <!-- 自定义颜色 -->
      <div class="custom-colors">
        <h5>自定义颜色</h5>
        <div class="color-controls">
          <div class="color-grid">
            <div class="color-item">
              <label class="color-label">主色调</label>
              <div class="color-picker-wrapper">
                <el-color-picker
                  v-model="currentTheme.primary"
                  @change="handleColorChange('primary', $event)"
                  show-alpha
                  size="small"
                />
                <span class="color-value">{{ currentTheme.primary }}</span>
              </div>
            </div>
            <div class="color-item">
              <label class="color-label">辅助色</label>
              <div class="color-picker-wrapper">
                <el-color-picker
                  v-model="currentTheme.secondary"
                  @change="handleColorChange('secondary', $event)"
                  show-alpha
                  size="small"
                />
                <span class="color-value">{{ currentTheme.secondary }}</span>
              </div>
            </div>
            <div class="color-item">
              <label class="color-label">强调色</label>
              <div class="color-picker-wrapper">
                <el-color-picker
                  v-model="currentTheme.accent"
                  @change="handleColorChange('accent', $event)"
                  show-alpha
                  size="small"
                />
                <span class="color-value">{{ currentTheme.accent }}</span>
              </div>
            </div>
            <div class="color-item">
              <label class="color-label">文字颜色</label>
              <div class="color-picker-wrapper">
                <el-color-picker
                  v-model="currentTheme.textPrimary"
                  @change="handleColorChange('textPrimary', $event)"
                  show-alpha
                  size="small"
                />
                <span class="color-value">{{ currentTheme.textPrimary }}</span>
              </div>
            </div>
            <div class="color-item">
              <label class="color-label">背景颜色</label>
              <div class="color-picker-wrapper">
                <el-color-picker
                  v-model="currentTheme.background"
                  @change="handleColorChange('background', $event)"
                  show-alpha
                  size="small"
                />
                <span class="color-value">{{ currentTheme.background }}</span>
              </div>
            </div>
            <div class="color-item">
              <label class="color-label">边框颜色</label>
              <div class="color-picker-wrapper">
                <el-color-picker
                  v-model="currentTheme.border"
                  @change="handleColorChange('border', $event)"
                  show-alpha
                  size="small"
                />
                <span class="color-value">{{ currentTheme.border }}</span>
              </div>
            </div>
          </div>

          <!-- 颜色快速操作 -->
          <div class="color-actions">
            <el-button size="small" @click="generateRandomColors">
              <el-icon><Refresh /></el-icon>
              随机配色
            </el-button>
            <el-button size="small" @click="resetColors">
              <el-icon><RefreshLeft /></el-icon>
              重置颜色
            </el-button>
            <el-button size="small" @click="copyColorScheme">
              <el-icon><Document /></el-icon>
              复制配色
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 字体设置 -->
    <div class="setting-group">
      <h4 class="group-title">
        <el-icon><Document /></el-icon>
        字体设置
      </h4>
      
      <div class="font-controls">
        <div class="control-item">
          <label>字体族</label>
          <el-select v-model="currentTypography.fontFamily" @change="handleTypographyChange">
            <el-option label="系统默认" value="system-ui" />
            <el-option label="宋体" value="SimSun, serif" />
            <el-option label="黑体" value="SimHei, sans-serif" />
            <el-option label="微软雅黑" value="Microsoft YaHei, sans-serif" />
            <el-option label="Arial" value="Arial, sans-serif" />
            <el-option label="Times New Roman" value="Times New Roman, serif" />
          </el-select>
        </div>
        
        <div class="control-item">
          <label>基础字号 ({{ currentTypography.baseFontSize }}px)</label>
          <el-slider 
            v-model="currentTypography.baseFontSize" 
            :min="12" 
            :max="18" 
            @change="handleTypographyChange"
          />
        </div>
        
        <div class="control-item">
          <label>标题字号 ({{ currentTypography.titleFontSize }}px)</label>
          <el-slider 
            v-model="currentTypography.titleFontSize" 
            :min="16" 
            :max="28" 
            @change="handleTypographyChange"
          />
        </div>
        
        <div class="control-item">
          <label>行高 ({{ currentSpacing.lineHeight }})</label>
          <el-slider 
            v-model="currentSpacing.lineHeight" 
            :min="1.2" 
            :max="2.0" 
            :step="0.1" 
            @change="handleSpacingChange"
          />
        </div>
      </div>
    </div>

    <!-- 间距设置 -->
    <div class="setting-group">
      <h4 class="group-title">
        <el-icon><Grid /></el-icon>
        间距设置
      </h4>
      
      <div class="spacing-controls">
        <div class="control-item">
          <label>页面边距 ({{ currentSpacing.pageMargin.top }}px)</label>
          <el-slider 
            v-model="currentSpacing.pageMargin.top" 
            :min="10" 
            :max="40" 
            @change="handlePageMarginChange"
          />
        </div>
        
        <div class="control-item">
          <label>模块间距 ({{ currentSpacing.moduleSpacing }}px)</label>
          <el-slider 
            v-model="currentSpacing.moduleSpacing" 
            :min="8" 
            :max="24" 
            @change="handleSpacingChange"
          />
        </div>
        
        <div class="control-item">
          <label>章节间距 ({{ currentSpacing.sectionSpacing }}px)</label>
          <el-slider 
            v-model="currentSpacing.sectionSpacing" 
            :min="8" 
            :max="24" 
            @change="handleSpacingChange"
          />
        </div>
      </div>
    </div>

    <!-- 布局设置 -->
    <div class="setting-group">
      <h4 class="group-title">
        <el-icon><Grid /></el-icon>
        布局设置
      </h4>

      <div class="layout-controls">
        <!-- 布局方向 -->
        <div class="control-item">
          <label class="control-label">布局方向</label>
          <el-radio-group v-model="currentLayout.orientation" @change="handleLayoutChange">
            <el-radio value="vertical">
              <el-icon><ArrowDown /></el-icon>
              纵向布局
            </el-radio>
            <el-radio value="horizontal">
              <el-icon><ArrowRight /></el-icon>
              横向布局
            </el-radio>
          </el-radio-group>
        </div>

        <!-- 列数设置（横向布局时显示） -->
        <div v-if="currentLayout.orientation === 'horizontal'" class="control-item">
          <label class="control-label">列数 ({{ currentLayout.columns }}列)</label>
          <el-slider
            v-model="currentLayout.columns"
            :min="2"
            :max="4"
            :step="1"
            @change="handleLayoutChange"
          />
        </div>

        <!-- 列间距（横向布局时显示） -->
        <div v-if="currentLayout.orientation === 'horizontal'" class="control-item">
          <label class="control-label">列间距 ({{ currentLayout.columnGap }}px)</label>
          <el-slider
            v-model="currentLayout.columnGap"
            :min="10"
            :max="40"
            @change="handleLayoutChange"
          />
        </div>

        <!-- 对齐方式 -->
        <div class="control-item">
          <label class="control-label">内容对齐</label>
          <el-radio-group v-model="currentLayout.alignment" @change="handleLayoutChange">
            <el-radio value="left">左对齐</el-radio>
            <el-radio value="center">居中</el-radio>
            <el-radio value="right">右对齐</el-radio>
          </el-radio-group>
        </div>

        <!-- 标题对齐 -->
        <div class="control-item">
          <label class="control-label">标题对齐</label>
          <el-radio-group v-model="currentLayout.titleAlignment" @change="handleLayoutChange">
            <el-radio value="left">左对齐</el-radio>
            <el-radio value="center">居中</el-radio>
            <el-radio value="right">右对齐</el-radio>
          </el-radio-group>
        </div>

        <!-- 布局预设 -->
        <div class="control-item">
          <label class="control-label">布局预设</label>
          <div class="layout-presets">
            <el-button
              size="small"
              :type="currentLayout.preset === 'traditional' ? 'primary' : ''"
              @click="applyLayoutPreset('traditional')"
            >
              传统单列
            </el-button>
            <el-button
              size="small"
              :type="currentLayout.preset === 'modern' ? 'primary' : ''"
              @click="applyLayoutPreset('modern')"
            >
              现代双列
            </el-button>
            <el-button
              size="small"
              :type="currentLayout.preset === 'creative' ? 'primary' : ''"
              @click="applyLayoutPreset('creative')"
            >
              创意多列
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 页面设置 -->
    <div class="setting-group">
      <h4 class="group-title">
        <el-icon><Document /></el-icon>
        页面设置
      </h4>

      <div class="page-controls">
        <div class="control-item">
          <label>页面模式</label>
          <el-radio-group v-model="currentPageSettings.pageCount" @change="handlePageSettingsChange">
            <el-radio :label="1">单页</el-radio>
            <el-radio :label="2">双页</el-radio>
            <el-radio :label="3">三页</el-radio>
          </el-radio-group>
        </div>

        <div v-if="currentPageSettings.pageCount > 1" class="control-item">
          <label>分页模式</label>
          <el-radio-group v-model="currentPageSettings.pagingMode" @change="handlePageSettingsChange">
            <el-radio label="auto">自动分页</el-radio>
            <el-radio label="manual">手动分页</el-radio>
          </el-radio-group>
        </div>

        <div v-if="currentPageSettings.pageCount > 1" class="control-item">
          <el-checkbox
            v-model="currentPageSettings.showPageNumbers"
            @change="handlePageSettingsChange"
          >
            显示页码
          </el-checkbox>
        </div>

        <!-- 内容溢出分析 -->
        <div v-if="contentAnalysis" class="content-analysis">
          <div class="analysis-title">内容分析</div>
          <div class="analysis-result" :class="{ warning: contentAnalysis.isOverflowing }">
            <el-icon v-if="contentAnalysis.isOverflowing"><Warning /></el-icon>
            <el-icon v-else><CircleCheck /></el-icon>
            <span>{{ contentAnalysis.recommendation }}</span>
          </div>
          <div v-if="contentAnalysis.isOverflowing" class="analysis-suggestion">
            <el-button
              size="small"
              type="primary"
              @click="applySuggestedPages"
            >
              应用建议 ({{ contentAnalysis.suggestedPages }}页)
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="setting-group">
      <el-button
        type="danger"
        :icon="RefreshLeft"
        @click="handleResetSettings"
        plain
      >
        重置为默认设置
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch, onMounted } from 'vue'
import { useResumeStore } from '@stores/resume'
import { ElMessage } from 'element-plus'
import {
  Edit,
  Document,
  Grid,
  RefreshLeft,
  Warning,
  CircleCheck,
  Refresh,
  ArrowDown,
  ArrowRight
} from '@element-plus/icons-vue'
import { createMultiPageManager } from '@/utils/multipage/pageManager'

const resumeStore = useResumeStore()

// 获取数据，提供默认值
const globalSettings = computed(() => resumeStore.globalSettings?.value || {})
const themePresets = computed(() => resumeStore.themePresets?.value || {})

// 当前设置的响应式副本
const currentTheme = reactive({
  primary: '#409eff',
  secondary: '#67c23a',
  accent: '#e6a23c',
  preset: 'professional',
  ...globalSettings.value?.theme
})

const currentTypography = reactive({
  baseFontSize: 14,
  titleFontSize: 18,
  fontFamily: 'system-ui',
  ...globalSettings.value?.typography
})

const currentSpacing = reactive({
  pageMargin: { top: 20, right: 20, bottom: 20, left: 20 },
  moduleSpacing: 12,
  lineHeight: 1.5,
  sectionSpacing: 16,
  ...globalSettings.value?.spacing
})

const currentPageSettings = reactive({
  pageCount: 1,
  pagingMode: 'auto',
  showPageNumbers: true,
  pageBreaks: [],
  ...globalSettings.value?.pageSettings
})

const currentLayout = reactive({
  orientation: 'vertical',
  columns: 2,
  columnGap: 20,
  alignment: 'left',
  titleAlignment: 'left',
  preset: 'traditional',
  ...globalSettings.value?.layout
})

// 可用的主题预设
const availableThemePresets = computed(() => {
  return themePresets.value || {
    professional: {
      primary: '#2c3e50',
      secondary: '#3498db',
      accent: '#e74c3c'
    },
    creative: {
      primary: '#9b59b6',
      secondary: '#e67e22',
      accent: '#f39c12'
    },
    minimal: {
      primary: '#34495e',
      secondary: '#95a5a6',
      accent: '#2ecc71'
    }
  }
})

// 获取预设名称
const getPresetName = (key) => {
  const names = {
    professional: '专业',
    creative: '创意',
    minimal: '简约'
  }
  return names[key] || key
}

// 内容分析
const contentAnalysis = computed(() => {
  try {
    const pageManager = createMultiPageManager(resumeStore.resumeData, currentPageSettings)
    return pageManager.analyzeContentOverflow()
  } catch (error) {
    console.warn('内容分析失败:', error)
    return null
  }
})

// 事件处理函数
const handleApplyThemePreset = (presetKey) => {
  const preset = availableThemePresets.value[presetKey]
  if (preset) {
    Object.assign(currentTheme, preset, { preset: presetKey })
    updateGlobalSettings()
    ElMessage.success(`已应用${getPresetName(presetKey)}主题`)
  }
}

const handleColorChange = (colorKey, value) => {
  currentTheme[colorKey] = value
  currentTheme.preset = 'custom'
  updateGlobalSettings()
}

const handleTypographyChange = () => {
  updateGlobalSettings()
}

const handleSpacingChange = () => {
  updateGlobalSettings()
}

const handlePageMarginChange = () => {
  // 同步所有边距
  const margin = currentSpacing.pageMargin.top
  currentSpacing.pageMargin = {
    top: margin,
    right: margin,
    bottom: margin,
    left: margin
  }
  updateGlobalSettings()
}

const handlePageSettingsChange = () => {
  updateGlobalSettings()
}

const applySuggestedPages = () => {
  if (contentAnalysis.value) {
    currentPageSettings.pageCount = contentAnalysis.value.suggestedPages
    updateGlobalSettings()
    ElMessage.success(`已应用${contentAnalysis.value.suggestedPages}页布局`)
  }
}

const handleResetSettings = () => {
  resumeStore.resetGlobalSettings()
  // 重新加载当前设置
  Object.assign(currentTheme, globalSettings.value?.theme || {})
  Object.assign(currentTypography, globalSettings.value?.typography || {})
  Object.assign(currentSpacing, globalSettings.value?.spacing || {})
  Object.assign(currentPageSettings, globalSettings.value?.pageSettings || {})
  ElMessage.success('已重置为默认设置')
}

// 颜色相关方法
const generateRandomColors = () => {
  const colors = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
  ]

  currentTheme.primary = colors[Math.floor(Math.random() * colors.length)]
  currentTheme.secondary = colors[Math.floor(Math.random() * colors.length)]
  currentTheme.accent = colors[Math.floor(Math.random() * colors.length)]

  updateGlobalSettings()
  ElMessage.success('已生成随机配色')
}

const resetColors = () => {
  currentTheme.primary = '#2c3e50'
  currentTheme.secondary = '#3498db'
  currentTheme.accent = '#e74c3c'
  currentTheme.textPrimary = '#333333'
  currentTheme.background = '#ffffff'
  currentTheme.border = '#e0e0e0'

  updateGlobalSettings()
  ElMessage.success('已重置颜色')
}

const copyColorScheme = async () => {
  const colorScheme = {
    primary: currentTheme.primary,
    secondary: currentTheme.secondary,
    accent: currentTheme.accent,
    textPrimary: currentTheme.textPrimary,
    background: currentTheme.background,
    border: currentTheme.border
  }

  try {
    await navigator.clipboard.writeText(JSON.stringify(colorScheme, null, 2))
    ElMessage.success('配色方案已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 布局相关方法
const handleLayoutChange = () => {
  updateGlobalSettings()
}

const applyLayoutPreset = (preset) => {
  const presets = {
    traditional: {
      orientation: 'vertical',
      columns: 1,
      columnGap: 0,
      alignment: 'left',
      titleAlignment: 'left',
      preset: 'traditional'
    },
    modern: {
      orientation: 'horizontal',
      columns: 2,
      columnGap: 20,
      alignment: 'left',
      titleAlignment: 'left',
      preset: 'modern'
    },
    creative: {
      orientation: 'horizontal',
      columns: 3,
      columnGap: 15,
      alignment: 'center',
      titleAlignment: 'center',
      preset: 'creative'
    }
  }

  const presetConfig = presets[preset]
  if (presetConfig) {
    Object.assign(currentLayout, presetConfig)
    updateGlobalSettings()
    ElMessage.success(`已应用${preset === 'traditional' ? '传统' : preset === 'modern' ? '现代' : '创意'}布局`)
  }
}

// 更新全局设置
const updateGlobalSettings = () => {
  resumeStore.updateGlobalSettings({
    theme: { ...currentTheme },
    typography: { ...currentTypography },
    spacing: { ...currentSpacing },
    pageSettings: { ...currentPageSettings },
    layout: { ...currentLayout }
  })
}

// 监听全局设置变化，同步到本地状态
watch(globalSettings, (newSettings) => {
  if (newSettings?.theme) {
    Object.assign(currentTheme, newSettings.theme)
  }
  if (newSettings?.typography) {
    Object.assign(currentTypography, newSettings.typography)
  }
  if (newSettings?.spacing) {
    Object.assign(currentSpacing, newSettings.spacing)
  }
  if (newSettings?.pageSettings) {
    Object.assign(currentPageSettings, newSettings.pageSettings)
  }
  if (newSettings?.layout) {
    Object.assign(currentLayout, newSettings.layout)
  }
}, { deep: true })

// 组件挂载时初始化
onMounted(() => {
  // 确保数据同步
  if (globalSettings.value?.theme) {
    Object.assign(currentTheme, globalSettings.value.theme)
  }
  if (globalSettings.value?.typography) {
    Object.assign(currentTypography, globalSettings.value.typography)
  }
  if (globalSettings.value?.spacing) {
    Object.assign(currentSpacing, globalSettings.value.spacing)
  }
  if (globalSettings.value?.pageSettings) {
    Object.assign(currentPageSettings, globalSettings.value.pageSettings)
  }
  if (globalSettings.value?.layout) {
    Object.assign(currentLayout, globalSettings.value.layout)
  }
})
</script>

<style scoped>
.style-settings {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.setting-group {
  margin-bottom: 32px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

/* 主题预设 */
.theme-presets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.theme-preset {
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.theme-preset:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.theme-preset.active {
  border-color: #409eff;
  background: #f0f9ff;
}

.preset-preview {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 8px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
}

.preset-name {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* 自定义颜色 */
.custom-colors h5 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.color-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.color-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-value {
  font-size: 11px;
  color: #9ca3af;
  font-family: monospace;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 70px;
  text-align: center;
}

.color-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.color-actions .el-button {
  flex: 1;
  min-width: 100px;
}

/* 布局设置 */
.layout-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.layout-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.layout-presets .el-button {
  flex: 1;
  min-width: 80px;
}

/* 控制项 */
.font-controls,
.spacing-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-item label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.control-item .el-select {
  width: 100%;
}

/* 页面设置样式 */
.page-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-analysis {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.analysis-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.analysis-result {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #059669;
  margin-bottom: 12px;
}

.analysis-result.warning {
  color: #d97706;
}

.analysis-suggestion {
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .style-settings {
    padding: 16px;
  }

  .setting-group {
    padding: 16px;
    margin-bottom: 24px;
  }

  .theme-presets {
    grid-template-columns: repeat(2, 1fr);
  }

  .color-controls {
    grid-template-columns: 1fr;
  }
}

/* 滚动条样式 */
.style-settings::-webkit-scrollbar {
  width: 6px;
}

.style-settings::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.style-settings::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.style-settings::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
