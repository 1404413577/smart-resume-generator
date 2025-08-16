<template>
  <div class="global-settings">
    <el-collapse v-model="activeCollapse" accordion>
      <!-- 字体设置 -->
      <el-collapse-item title="字体设置" name="typography">
        <template #title>
          <div class="collapse-title">
            <el-icon><Edit /></el-icon>
            <span>字体设置</span>
          </div>
        </template>
        
        <div class="setting-group">
          <label class="setting-label">基础字号</label>
          <el-slider
            :model-value="resumeStore.globalSettings.typography.baseFontSize"
            @update:model-value="(val) => updateTypography('baseFontSize', val)"
            :min="12"
            :max="16"
            :step="1"
            show-input
            :show-input-controls="false"
            input-size="small"
          />
          <span class="setting-unit">px</span>
        </div>

        <div class="setting-group">
          <label class="setting-label">模块标题字号</label>
          <el-slider
            :model-value="resumeStore.globalSettings.typography.titleFontSize"
            @update:model-value="(val) => updateTypography('titleFontSize', val)"
            :min="16"
            :max="24"
            :step="1"
            show-input
            :show-input-controls="false"
            input-size="small"
          />
          <span class="setting-unit">px</span>
        </div>

        <div class="setting-group">
          <label class="setting-label">一级标题字号</label>
          <el-slider
            :model-value="resumeStore.globalSettings.typography.subtitleFontSize"
            @update:model-value="(val) => updateTypography('subtitleFontSize', val)"
            :min="14"
            :max="20"
            :step="1"
            show-input
            :show-input-controls="false"
            input-size="small"
          />
          <span class="setting-unit">px</span>
        </div>

        <div class="setting-group">
          <label class="setting-label">字体族</label>
          <el-select
            :model-value="resumeStore.globalSettings.typography.fontFamily"
            @update:model-value="(val) => updateTypography('fontFamily', val)"
            size="small"
            style="width: 100%"
          >
            <el-option label="系统默认" value="system-ui" />
            <el-option label="思源黑体" value="'Source Han Sans SC', sans-serif" />
            <el-option label="微软雅黑" value="'Microsoft YaHei', sans-serif" />
            <el-option label="苹方" value="'PingFang SC', sans-serif" />
            <el-option label="宋体" value="SimSun, serif" />
            <el-option label="Times New Roman" value="'Times New Roman', serif" />
            <el-option label="Arial" value="Arial, sans-serif" />
          </el-select>
        </div>
      </el-collapse-item>

      <!-- 间距设置 -->
      <el-collapse-item title="间距设置" name="spacing">
        <template #title>
          <div class="collapse-title">
            <el-icon><Grid /></el-icon>
            <span>间距设置</span>
          </div>
        </template>

        <div class="setting-group">
          <label class="setting-label">页边距</label>
          <div class="margin-controls">
            <div class="margin-item">
              <span>上</span>
              <el-input-number
                :model-value="resumeStore.globalSettings.spacing.pageMargin.top"
                @update:model-value="(val) => updatePageMargin('top', val)"
                :min="10"
                :max="30"
                :step="1"
                size="small"
                controls-position="right"
              />
              <span>mm</span>
            </div>
            <div class="margin-item">
              <span>右</span>
              <el-input-number
                :model-value="resumeStore.globalSettings.spacing.pageMargin.right"
                @update:model-value="(val) => updatePageMargin('right', val)"
                :min="10"
                :max="30"
                :step="1"
                size="small"
                controls-position="right"
              />
              <span>mm</span>
            </div>
            <div class="margin-item">
              <span>下</span>
              <el-input-number
                :model-value="resumeStore.globalSettings.spacing.pageMargin.bottom"
                @update:model-value="(val) => updatePageMargin('bottom', val)"
                :min="10"
                :max="30"
                :step="1"
                size="small"
                controls-position="right"
              />
              <span>mm</span>
            </div>
            <div class="margin-item">
              <span>左</span>
              <el-input-number
                :model-value="resumeStore.globalSettings.spacing.pageMargin.left"
                @update:model-value="(val) => updatePageMargin('left', val)"
                :min="10"
                :max="30"
                :step="1"
                size="small"
                controls-position="right"
              />
              <span>mm</span>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">模块间距</label>
          <el-slider
            :model-value="resumeStore.globalSettings.spacing.moduleSpacing"
            @update:model-value="(val) => updateSpacing('moduleSpacing', val)"
            :min="5"
            :max="20"
            :step="1"
            show-input
            :show-input-controls="false"
            input-size="small"
          />
          <span class="setting-unit">mm</span>
        </div>

        <div class="setting-group">
          <label class="setting-label">行间距</label>
          <el-slider
            :model-value="resumeStore.globalSettings.spacing.lineHeight"
            @update:model-value="(val) => updateSpacing('lineHeight', val)"
            :min="1.0"
            :max="2.0"
            :step="0.1"
            show-input
            :show-input-controls="false"
            input-size="small"
          />
          <span class="setting-unit">倍</span>
        </div>
      </el-collapse-item>

      <!-- 自定义模块 -->
      <el-collapse-item title="自定义模块" name="modules">
        <template #title>
          <div class="collapse-title">
            <el-icon><Plus /></el-icon>
            <span>自定义模块</span>
          </div>
        </template>

        <div class="custom-modules">
          <el-button 
            type="primary" 
            size="small" 
            @click="showModuleDialog = true"
            style="width: 100%; margin-bottom: 12px;"
          >
            <el-icon><Plus /></el-icon>
            添加自定义模块
          </el-button>

          <div v-if="resumeStore.globalSettings.customModules.length === 0" class="empty-modules">
            <el-text type="info" size="small">暂无自定义模块</el-text>
          </div>

          <div v-else class="module-list">
            <div 
              v-for="module in resumeStore.globalSettings.customModules" 
              :key="module.id"
              class="module-item"
            >
              <div class="module-info">
                <span class="module-name">{{ module.name }}</span>
                <span class="module-type">{{ getModuleTypeLabel(module.type) }}</span>
              </div>
              <div class="module-actions">
                <el-button size="small" text @click="editModule(module)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button size="small" text type="danger" @click="deleteModule(module.id)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 操作按钮 -->
    <div class="settings-actions">
      <el-button @click="resetSettings" size="small">
        <el-icon><RefreshLeft /></el-icon>
        恢复默认
      </el-button>
    </div>

    <!-- 自定义模块对话框 -->
    <CustomModuleDialog
      v-model="showModuleDialog"
      :module="editingModule"
      @save="handleModuleSave"
      @close="handleModuleDialogClose"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Edit, Grid, Plus, Delete, RefreshLeft } from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'
import CustomModuleDialog from './CustomModuleDialog.vue'

const resumeStore = useResumeStore()

const activeCollapse = ref('typography')
const showModuleDialog = ref(false)
const editingModule = ref(null)

// 字体设置更新
const updateTypography = (key, value) => {
  resumeStore.updateTypographySetting(key, value)
}

// 间距设置更新
const updateSpacing = (key, value) => {
  resumeStore.updateSpacingSetting(key, value)
}

const updatePageMargin = (side, value) => {
  const newMargin = { [side]: value }
  resumeStore.updateSpacingSetting('pageMargin', newMargin)
}

// 自定义模块管理
const getModuleTypeLabel = (type) => {
  const typeMap = {
    text: '文本',
    list: '列表',
    date: '日期',
    textarea: '多行文本'
  }
  return typeMap[type] || type
}

const editModule = (module) => {
  editingModule.value = { ...module }
  showModuleDialog.value = true
}

const deleteModule = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个自定义模块吗？', '确认删除', {
      type: 'warning'
    })
    resumeStore.removeCustomModule(id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}

const handleModuleSave = (moduleData) => {
  if (editingModule.value) {
    resumeStore.updateCustomModule(editingModule.value.id, moduleData)
    ElMessage.success('模块更新成功')
  } else {
    resumeStore.addCustomModule(moduleData)
    ElMessage.success('模块添加成功')
  }
  handleModuleDialogClose()
}

const handleModuleDialogClose = () => {
  showModuleDialog.value = false
  editingModule.value = null
}

// 重置设置
const resetSettings = async () => {
  try {
    await ElMessageBox.confirm('确定要恢复所有设置到默认值吗？', '确认重置', {
      type: 'warning'
    })
    resumeStore.resetGlobalSettings()
    ElMessage.success('设置已恢复默认')
  } catch {
    // 用户取消重置
  }
}
</script>

<style scoped>
.global-settings {
  padding: 16px;
  padding-right: 12px; /* 为滚动条留出空间 */
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
}

.setting-group {
  margin-bottom: 20px;
  position: relative;
}

.setting-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.setting-unit {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #909399;
  pointer-events: none;
}

.margin-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.margin-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.margin-item span:first-child {
  min-width: 16px;
  color: #606266;
}

.margin-item span:last-child {
  color: #909399;
  font-size: 11px;
}

.custom-modules {
  padding: 0;
}

.empty-modules {
  text-align: center;
  padding: 20px;
}

.module-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.module-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.module-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
}

.module-type {
  font-size: 11px;
  color: #909399;
}

.module-actions {
  display: flex;
  gap: 4px;
}

.settings-actions {
  padding: 16px 0 0 0;
  border-top: 1px solid #e4e7ed;
  margin-top: 16px;
}

.settings-actions .el-button {
  width: 100%;
}

:deep(.el-collapse-item__header) {
  padding-left: 12px;
  font-size: 13px;
}

:deep(.el-collapse-item__content) {
  padding: 16px 12px;
}

:deep(.el-slider__input) {
  width: 60px;
}

:deep(.el-input-number) {
  width: 80px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center;
}
</style>
