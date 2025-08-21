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
          <div class="color-item">
            <label>主色调</label>
            <el-color-picker 
              v-model="currentTheme.primary" 
              @change="handleColorChange('primary', $event)"
            />
          </div>
          <div class="color-item">
            <label>辅助色</label>
            <el-color-picker 
              v-model="currentTheme.secondary" 
              @change="handleColorChange('secondary', $event)"
            />
          </div>
          <div class="color-item">
            <label>强调色</label>
            <el-color-picker 
              v-model="currentTheme.accent" 
              @change="handleColorChange('accent', $event)"
            />
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
  RefreshLeft
} from '@element-plus/icons-vue'

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

const handleResetSettings = () => {
  resumeStore.resetGlobalSettings()
  // 重新加载当前设置
  Object.assign(currentTheme, globalSettings.value?.theme || {})
  Object.assign(currentTypography, globalSettings.value?.typography || {})
  Object.assign(currentSpacing, globalSettings.value?.spacing || {})
  ElMessage.success('已重置为默认设置')
}

// 更新全局设置
const updateGlobalSettings = () => {
  resumeStore.updateGlobalSettings({
    theme: { ...currentTheme },
    typography: { ...currentTypography },
    spacing: { ...currentSpacing }
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.color-item label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
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
