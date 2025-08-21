<template>
  <div class="section-settings">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>📋 章节设置</span>
        </div>
      </template>

      <!-- 章节可见性控制 -->
      <div class="setting-group">
        <h4>章节显示</h4>
        <div class="section-list" v-if="sectionConfig">
          <div
            v-for="(section, key) in sectionConfig"
            :key="key"
            class="section-item"
          >
            <div class="section-header">
              <div class="section-info">
                <span class="section-icon">{{ section.icon }}</span>
                <span class="section-name">{{ section.name }}</span>
                <el-tag v-if="section.required" type="danger" size="small">必需</el-tag>
              </div>
              <div class="section-controls">
                <el-switch
                  v-model="section.visible"
                  :disabled="section.required"
                  @change="toggleSectionVisibility(key)"
                />
              </div>
            </div>

            <!-- 字段级控制 -->
            <div v-if="section.visible && section.fields" class="field-controls">
              <h5>字段显示</h5>
              <div class="field-list">
                <div 
                  v-for="(field, fieldKey) in section.fields" 
                  :key="fieldKey"
                  class="field-item"
                >
                  <span class="field-label">{{ field.label }}</span>
                  <div class="field-actions">
                    <el-tag v-if="field.required" type="warning" size="small">必需</el-tag>
                    <el-switch
                      v-model="field.visible"
                      :disabled="field.required"
                      size="small"
                      @change="updateFieldVisibility(key, fieldKey, $event)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 特殊设置 -->
            <div v-if="section.visible" class="section-special-settings">
              <!-- 技能章节特殊设置 -->
              <div v-if="key === 'skills'" class="special-setting">
                <label>布局方式</label>
                <el-radio-group 
                  v-model="section.layout" 
                  size="small"
                  @change="updateSectionConfigAdvanced(key, { layout: $event })"
                >
                  <el-radio-button label="list">列表</el-radio-button>
                  <el-radio-button label="grid">网格</el-radio-button>
                  <el-radio-button label="tags">标签</el-radio-button>
                </el-radio-group>
              </div>

              <div v-if="key === 'skills'" class="special-setting">
                <label>显示技能等级</label>
                <el-switch
                  v-model="section.showLevel"
                  @change="updateSectionConfigAdvanced(key, { showLevel: $event })"
                />
              </div>

              <!-- 个人简介字数限制 -->
              <div v-if="key === 'summary'" class="special-setting">
                <label>字数限制</label>
                <el-input-number
                  v-model="section.maxLength"
                  :min="100"
                  :max="1000"
                  :step="50"
                  size="small"
                  @change="updateSectionConfigAdvanced(key, { maxLength: $event })"
                />
              </div>

              <!-- 折叠设置 -->
              <div v-if="section.collapsible !== undefined" class="special-setting">
                <label>允许折叠</label>
                <el-switch
                  v-model="section.collapsible"
                  @change="updateSectionConfigAdvanced(key, { collapsible: $event })"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 章节排序 -->
      <div class="setting-group" v-if="sectionOrder && sectionConfig">
        <h4>章节排序</h4>
        <div class="section-order">
          <div
            v-for="(sectionKey, index) in sectionOrder"
            :key="`${sectionKey}-${index}`"
            class="section-order-item"
          >
            <el-button
              class="order-button"
              :class="{ disabled: !sectionConfig[sectionKey]?.visible }"
              size="small"
              @click="moveSectionUp(index)"
              :disabled="index === 0"
            >
              <el-icon><ArrowUp /></el-icon>
            </el-button>
            <span class="section-order-name">
              {{ sectionConfig[sectionKey]?.icon }} {{ sectionConfig[sectionKey]?.name }}
            </span>
            <el-button
              class="order-button"
              :class="{ disabled: !sectionConfig[sectionKey]?.visible }"
              size="small"
              @click="moveSectionDown(index)"
              :disabled="index === sectionOrder.length - 1"
            >
              <el-icon><ArrowDown /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 重置按钮 -->
      <div class="setting-group">
        <el-button @click="resetSectionSettings" type="danger" plain>
          重置章节设置
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'

const resumeStore = useResumeStore()

// 使用响应式引用，不要解构赋值以保持响应性
const sectionConfig = resumeStore.sectionConfig
const sectionOrder = resumeStore.sectionOrder

// 解构方法函数（这些不需要响应性）
const {
  toggleSectionVisibility,
  updateFieldVisibility,
  updateSectionConfigAdvanced,
  moveSectionUp,
  moveSectionDown,
  resetSectionOrder
} = resumeStore

// 重置章节设置
const resetSectionSettings = () => {
  if (!sectionConfig.value) return

  // 重置所有章节为默认可见状态
  Object.keys(sectionConfig.value).forEach(key => {
    if (!sectionConfig.value[key].required) {
      sectionConfig.value[key].visible = true
    }

    // 重置字段可见性
    if (sectionConfig.value[key].fields) {
      Object.keys(sectionConfig.value[key].fields).forEach(fieldKey => {
        if (!sectionConfig.value[key].fields[fieldKey].required) {
          sectionConfig.value[key].fields[fieldKey].visible = true
        }
      })
    }
  })

  // 重置章节排序
  if (resetSectionOrder) {
    resetSectionOrder()
  }
}
</script>

<style scoped>
.section-settings {
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

.section-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-item {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 16px;
  background-color: var(--el-bg-color-page);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 16px;
}

.section-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.field-controls {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.field-controls h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.field-label {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.field-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-special-settings {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.special-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.special-setting label {
  font-size: 12px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.section-order {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-order-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background-color: var(--el-bg-color-page);
}

.order-button {
  min-width: 32px;
}

.order-button.disabled {
  opacity: 0.5;
}

.section-order-name {
  flex: 1;
  font-size: 13px;
  color: var(--el-text-color-primary);
}
</style>
