<template>
  <div class="style-settings" v-if="globalSettings && themePresets">
    <!-- 加载状态 -->
    <div v-if="!isLoaded" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载设置中...</span>
    </div>

    <!-- 设置内容 -->
    <div v-else>
    <!-- 主题设置 -->
    <div class="setting-group">
      <h4 class="group-title">
        <el-icon><Edit /></el-icon>
        主题配色
      </h4>
      <div class="theme-presets" v-if="themePresets">
        <div
          v-for="(preset, key) in themePresets"
          :key="key"
          class="theme-preset"
          :class="{ active: globalSettings?.theme?.preset === key }"
          @click="applyThemePreset(key)"
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
    </div>

    <!-- 字体设置 -->
    <div class="setting-group">
      <h4 class="group-title">
        <el-icon><Document /></el-icon>
        字体设置
      </h4>
      <div class="setting-item" v-if="globalSettings?.typography">
        <label class="setting-label">基础字号</label>
        <div class="setting-control">
          <el-slider
            v-model="globalSettings.typography.baseFontSize"
            :min="12"
            :max="18"
            :step="1"
            show-input
            :show-input-controls="false"
            @change="updateTypographySetting('baseFontSize', $event)"
          />
          <span class="unit">px</span>
        </div>
      </div>
      <div class="setting-item" v-if="globalSettings?.typography">
        <label class="setting-label">标题字号</label>
        <div class="setting-control">
          <el-slider
            v-model="globalSettings.typography.titleFontSize"
            :min="16"
            :max="28"
            :step="1"
            show-input
            :show-input-controls="false"
            @change="updateTypographySetting('titleFontSize', $event)"
          />
          <span class="unit">px</span>
        </div>
      </div>
      <div class="setting-item" v-if="globalSettings?.spacing">
        <label class="setting-label">行高</label>
        <div class="setting-control">
          <el-slider
            v-model="globalSettings.spacing.lineHeight"
            :min="1.2"
            :max="2.0"
            :step="0.1"
            show-input
            :show-input-controls="false"
            @change="updateSpacingSetting('lineHeight', $event)"
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
      <div class="setting-item" v-if="globalSettings?.spacing">
        <label class="setting-label">页面边距</label>
        <div class="setting-control">
          <el-slider
            v-model="pageMarginValue"
            :min="10"
            :max="40"
            :step="2"
            show-input
            :show-input-controls="false"
            @change="updatePageMargins"
          />
          <span class="unit">px</span>
        </div>
      </div>
      <div class="setting-item" v-if="globalSettings?.spacing">
        <label class="setting-label">模块间距</label>
        <div class="setting-control">
          <el-slider
            v-model="globalSettings.spacing.moduleSpacing"
            :min="8"
            :max="24"
            :step="2"
            show-input
            :show-input-controls="false"
            @change="updateSpacingSetting('moduleSpacing', $event)"
          />
          <span class="unit">px</span>
        </div>
      </div>
    </div>

    <!-- 自定义颜色 -->
    <div class="setting-group">
      <h4 class="group-title">
        <el-icon><Picture /></el-icon>
        自定义颜色
      </h4>
      <div class="color-settings">
        <div class="color-item" v-if="globalSettings?.theme">
          <label class="color-label">主色调</label>
          <el-color-picker
            v-model="globalSettings.theme.primary"
            @change="updateThemeColor('primary', $event)"
            show-alpha
            size="small"
          />
        </div>
        <div class="color-item" v-if="globalSettings?.theme">
          <label class="color-label">辅助色</label>
          <el-color-picker
            v-model="globalSettings.theme.secondary"
            @change="updateThemeColor('secondary', $event)"
            show-alpha
            size="small"
          />
        </div>
        <div class="color-item" v-if="globalSettings?.theme">
          <label class="color-label">强调色</label>
          <el-color-picker
            v-model="globalSettings.theme.accent"
            @change="updateThemeColor('accent', $event)"
            show-alpha
            size="small"
          />
        </div>
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="setting-group">
      <el-button @click="resetTheme" type="danger" plain size="small" class="reset-btn">
        <el-icon><RefreshLeft /></el-icon>
        重置样式
      </el-button>
    </div>

    </div> <!-- 关闭设置内容 div -->
  </div>
</template>

<script setup>
import { computed, nextTick } from 'vue'
import { useResumeStore } from '../stores/resume'
import {
  Edit,
  Document,
  Grid,
  Picture,
  RefreshLeft,
  Loading
} from '@element-plus/icons-vue'

const resumeStore = useResumeStore()

// 使用响应式引用，不要解构赋值以保持响应性
const globalSettings = resumeStore.globalSettings
const themePresets = resumeStore.themePresets

// 检查是否已加载
const isLoaded = computed(() => {
  return globalSettings?.value &&
         globalSettings.value.theme &&
         globalSettings.value.typography &&
         globalSettings.value.spacing &&
         themePresets?.value
})

// 解构方法函数（这些不需要响应性）
const {
  applyThemePreset,
  updateThemeColor,
  resetTheme,
  updateGlobalSettings
} = resumeStore

// 字体和间距设置的辅助函数
const updateTypographySetting = (key, value) => {
  updateGlobalSettings({
    typography: {
      ...globalSettings.value.typography,
      [key]: value
    }
  })
  // 强制触发样式更新
  nextTick(() => {
    const event = new CustomEvent('resume-style-updated')
    document.dispatchEvent(event)
  })
}

const updateSpacingSetting = (key, value) => {
  updateGlobalSettings({
    spacing: {
      ...globalSettings.value.spacing,
      [key]: value
    }
  })
  // 强制触发样式更新
  nextTick(() => {
    const event = new CustomEvent('resume-style-updated')
    document.dispatchEvent(event)
  })
}

// 页面边距的统一值（取平均值）
const pageMarginValue = computed({
  get() {
    if (!globalSettings?.value?.spacing?.pageMargin) {
      return 20 // 默认值
    }
    const margins = globalSettings.value.spacing.pageMargin
    return (margins.top + margins.right + margins.bottom + margins.left) / 4
  },
  set(value) {
    // 在setter中不做任何操作，实际更新通过updatePageMargins方法
  }
})

// 更新页面边距
const updatePageMargins = (value) => {
  const margins = {
    top: value,
    right: value,
    bottom: value,
    left: value
  }
  updateSpacingSetting('pageMargin', margins)
}

// 获取预设名称
const getPresetName = (key) => {
  const names = {
    professional: '专业',
    creative: '创意',
    minimal: '简约'
  }
  return names[key] || key
}
</script>

<style scoped>
.style-settings {
  padding: 0;
}

.setting-group {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.theme-presets {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.theme-preset {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-preset:hover {
  border-color: #409eff;
  background-color: #f5f7fa;
}

.theme-preset.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.preset-preview {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #e4e7ed;
}

.preset-name {
  font-size: 12px;
  color: #606266;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-control :deep(.el-slider) {
  flex: 1;
}

.unit {
  font-size: 12px;
  color: #909399;
  min-width: 20px;
}

.color-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color-label {
  font-size: 13px;
  color: #606266;
}

.reset-btn {
  width: 100%;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #909399;
  font-size: 14px;
}

.loading-state .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}
</style>
