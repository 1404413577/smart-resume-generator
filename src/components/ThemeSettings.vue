<template>
  <div class="theme-settings">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>🎨 主题设置</span>
        </div>
      </template>

      <!-- 主题预设 -->
      <div class="setting-group">
        <h4>主题预设</h4>
        <div class="theme-presets">
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

      <!-- 自定义颜色 -->
      <div class="setting-group" v-if="globalSettings?.theme?.preset === 'custom'">
        <h4>自定义颜色</h4>
        <div class="color-settings">
          <div class="color-item">
            <label>主色调</label>
            <el-color-picker
              v-model="globalSettings.theme.primary"
              @change="updateThemeColor('primary', $event)"
            />
          </div>
          <div class="color-item">
            <label>辅助色</label>
            <el-color-picker
              v-model="globalSettings.theme.secondary"
              @change="updateThemeColor('secondary', $event)"
            />
          </div>
          <div class="color-item">
            <label>强调色</label>
            <el-color-picker
              v-model="globalSettings.theme.accent"
              @change="updateThemeColor('accent', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 字体设置 -->
      <div class="setting-group">
        <h4>字体设置</h4>
        <div class="font-settings">
          <div class="setting-item" v-if="globalSettings?.typography">
            <label>基础字号</label>
            <el-slider
              v-model="globalSettings.typography.baseFontSize"
              :min="12"
              :max="18"
              :step="1"
              show-input
              @change="updateTypographySetting('baseFontSize', $event)"
            />
          </div>
          <div class="setting-item" v-if="globalSettings?.typography">
            <label>标题字号</label>
            <el-slider
              v-model="globalSettings.typography.titleFontSize"
              :min="16"
              :max="28"
              :step="1"
              show-input
              @change="updateTypographySetting('titleFontSize', $event)"
            />
          </div>
          <div class="setting-item" v-if="globalSettings?.spacing">
            <label>行高</label>
            <el-slider
              v-model="globalSettings.spacing.lineHeight"
              :min="1.2"
              :max="2.0"
              :step="0.1"
              show-input
              @change="updateSpacingSetting('lineHeight', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 间距设置 -->
      <div class="setting-group">
        <h4>间距设置</h4>
        <div class="spacing-settings">
          <div class="setting-item">
            <label>页面边距</label>
            <el-slider
              v-model="pageMarginValue"
              :min="10"
              :max="40"
              :step="2"
              show-input
              @change="updatePageMargins"
            />
          </div>
          <div class="setting-item" v-if="globalSettings?.spacing">
            <label>模块间距</label>
            <el-slider
              v-model="globalSettings.spacing.moduleSpacing"
              :min="8"
              :max="24"
              :step="2"
              show-input
              @change="updateSpacingSetting('moduleSpacing', $event)"
            />
          </div>
          <div class="setting-item" v-if="globalSettings?.spacing">
            <label>章节间距</label>
            <el-slider
              v-model="globalSettings.spacing.sectionSpacing"
              :min="8"
              :max="24"
              :step="2"
              show-input
              @change="updateSpacingSetting('sectionSpacing', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 重置按钮 -->
      <div class="setting-group">
        <el-button @click="resetTheme" type="danger" plain>
          重置主题
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '../stores/resume'

const resumeStore = useResumeStore()

// 使用响应式引用，不要解构赋值以保持响应性
const globalSettings = resumeStore.globalSettings
const themePresets = resumeStore.themePresets

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
}

const updateSpacingSetting = (key, value) => {
  updateGlobalSettings({
    spacing: {
      ...globalSettings.value.spacing,
      [key]: value
    }
  })
}

// 页面边距的统一值（取平均值）
const pageMarginValue = computed({
  get() {
    if (!globalSettings.value?.spacing?.pageMargin) {
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
.theme-settings {
  width: 100%;
}

.settings-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-group h4 {
  margin: 0 0 12px 0;
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 600;
}

.theme-presets {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.theme-preset {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 2px solid var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.theme-preset:hover {
  border-color: var(--el-color-primary);
  transform: translateY(-2px);
}

.theme-preset.active {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.preset-preview {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--el-border-color);
}

.preset-name {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.color-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
  color: var(--el-text-color-regular);
}

.font-settings,
.spacing-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.setting-item label {
  min-width: 80px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.setting-item .el-slider {
  flex: 1;
}
</style>
