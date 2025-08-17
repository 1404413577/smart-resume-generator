<template>
  <div class="global-settings-trigger">
    <!-- 触发按钮 -->
    <el-button
      type="primary"
      :icon="Setting"
      circle
      size="large"
      class="settings-trigger-btn"
      @click="openDrawer"
      title="全局设置"
    />
    
    <!-- 设置抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="全局设置"
      direction="rtl"
      size="450px"
      :before-close="handleClose"
      class="global-settings-drawer"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="drawer-header">
          <h3 :id="titleId" :class="titleClass" class="drawer-title">
            <el-icon class="title-icon"><Setting /></el-icon>
            全局设置
          </h3>
          <div class="header-actions">
            <el-button
              type="info"
              size="small"
              :icon="RefreshLeft"
              @click="resetToDefaults"
              title="重置为默认设置"
            >
              重置
            </el-button>
            <el-button
              type="primary"
              size="small"
              :icon="Close"
              @click="close"
              circle
            />
          </div>
        </div>
      </template>

      <div class="drawer-content">
        <!-- 设置标签页 -->
        <el-tabs v-model="activeTab" type="border-card" class="settings-tabs">
          <!-- 主题设置 -->
          <el-tab-pane label="🎨 主题" name="theme">
            <ThemeSettings />
          </el-tab-pane>

          <!-- 章节设置 -->
          <el-tab-pane label="📋 章节" name="sections">
            <SectionSettings />
          </el-tab-pane>

          <!-- 原有设置 -->
          <el-tab-pane label="⚙️ 其他" name="other">
            <el-collapse v-model="activeCollapse" accordion>
          <!-- 字体设置 -->
          <el-collapse-item title="字体设置" name="typography">
            <template #title>
              <div class="collapse-title">
                <el-icon><Document /></el-icon>
                <span>字体设置</span>
              </div>
            </template>
            <div class="setting-group">
              <!-- 基础字号 -->
              <div class="setting-item">
                <label class="setting-label">基础字号</label>
                <div class="setting-control">
                  <el-slider
                    v-model="typography.baseFontSize"
                    :min="10"
                    :max="20"
                    :step="1"
                    show-input
                    :show-input-controls="false"
                    @change="updateTypographySetting('baseFontSize', $event)"
                  />
                  <span class="unit">px</span>
                </div>
              </div>

              <!-- 标题字号 -->
              <div class="setting-item">
                <label class="setting-label">标题字号</label>
                <div class="setting-control">
                  <el-slider
                    v-model="typography.titleFontSize"
                    :min="14"
                    :max="28"
                    :step="1"
                    show-input
                    :show-input-controls="false"
                    @change="updateTypographySetting('titleFontSize', $event)"
                  />
                  <span class="unit">px</span>
                </div>
              </div>

              <!-- 副标题字号 -->
              <div class="setting-item">
                <label class="setting-label">副标题字号</label>
                <div class="setting-control">
                  <el-slider
                    v-model="typography.subtitleFontSize"
                    :min="12"
                    :max="24"
                    :step="1"
                    show-input
                    :show-input-controls="false"
                    @change="updateTypographySetting('subtitleFontSize', $event)"
                  />
                  <span class="unit">px</span>
                </div>
              </div>

              <!-- 字体族 -->
              <div class="setting-item">
                <label class="setting-label">字体族</label>
                <div class="setting-control">
                  <el-select
                    v-model="typography.fontFamily"
                    placeholder="选择字体"
                    @change="updateTypographySetting('fontFamily', $event)"
                  >
                    <el-option label="系统默认" value="system-ui" />
                    <el-option label="苹方/微软雅黑" value="'PingFang SC', 'Microsoft YaHei', sans-serif" />
                    <el-option label="思源黑体" value="'Source Han Sans CN', sans-serif" />
                    <el-option label="宋体" value="'SimSun', serif" />
                    <el-option label="Times New Roman" value="'Times New Roman', serif" />
                    <el-option label="Arial" value="Arial, sans-serif" />
                  </el-select>
                </div>
              </div>
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
              <!-- 页边距 -->
              <div class="setting-item">
                <label class="setting-label">页边距</label>
                <div class="setting-control">
                  <el-slider
                    v-model="spacing.pageMargin"
                    :min="10"
                    :max="40"
                    :step="2"
                    show-input
                    :show-input-controls="false"
                    @change="updateSpacingSetting('pageMargin', $event)"
                  />
                  <span class="unit">mm</span>
                </div>
              </div>

              <!-- 模块间距 -->
              <div class="setting-item">
                <label class="setting-label">模块间距</label>
                <div class="setting-control">
                  <el-slider
                    v-model="spacing.moduleSpacing"
                    :min="10"
                    :max="50"
                    :step="2"
                    show-input
                    :show-input-controls="false"
                    @change="updateSpacingSetting('moduleSpacing', $event)"
                  />
                  <span class="unit">px</span>
                </div>
              </div>

              <!-- 行高 -->
              <div class="setting-item">
                <label class="setting-label">行高</label>
                <div class="setting-control">
                  <el-slider
                    v-model="spacing.lineHeight"
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
          </el-collapse-item>

          <!-- 页面设置 -->
          <el-collapse-item title="页面设置" name="page">
            <template #title>
              <div class="collapse-title">
                <el-icon><Document /></el-icon>
                <span>页面设置</span>
              </div>
            </template>
            <div class="setting-group">
              <!-- 页数限制 -->
              <div class="setting-item">
                <label class="setting-label">页数限制</label>
                <div class="setting-control">
                  <el-radio-group
                    v-model="pageSettings.pageCount"
                    @change="updatePageSetting('pageCount', $event)"
                  >
                    <el-radio :label="1">1页</el-radio>
                    <el-radio :label="2">2页</el-radio>
                    <el-radio :label="3">3页</el-radio>
                  </el-radio-group>
                </div>
              </div>

              <!-- 分页模式 -->
              <div class="setting-item">
                <label class="setting-label">分页模式</label>
                <div class="setting-control">
                  <el-radio-group
                    v-model="pageSettings.pagingMode"
                    @change="updatePageSetting('pagingMode', $event)"
                  >
                    <el-radio label="auto">自动分页</el-radio>
                    <el-radio label="manual">手动分页</el-radio>
                  </el-radio-group>
                </div>
              </div>

              <!-- 显示页码 -->
              <div class="setting-item">
                <label class="setting-label">显示页码</label>
                <div class="setting-control">
                  <el-switch
                    v-model="pageSettings.showPageNumbers"
                    @change="updatePageSetting('showPageNumbers', $event)"
                  />
                </div>
              </div>
            </div>
          </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="closeDrawer">取消</el-button>
          <el-button type="primary" @click="closeDrawer">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useResumeStore } from '../stores/resume'
import { Setting, RefreshLeft, Close, Document, Grid } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ThemeSettings from './ThemeSettings.vue'
import SectionSettings from './SectionSettings.vue'

const resumeStore = useResumeStore()

// 抽屉状态
const drawerVisible = ref(false)
const activeTab = ref('theme')
const activeCollapse = ref('typography')

// 设置数据的响应式引用
const typography = computed(() => resumeStore.globalSettings.typography)
const spacing = computed(() => resumeStore.globalSettings.spacing)
const pageSettings = computed(() => resumeStore.globalSettings.pageSettings)

// 打开抽屉
const openDrawer = () => {
  drawerVisible.value = true
}

// 关闭抽屉
const closeDrawer = () => {
  drawerVisible.value = false
}

// 关闭前确认
const handleClose = (done) => {
  done()
}

// 更新设置的方法
const updateTypographySetting = (key, value) => {
  resumeStore.updateTypographySetting(key, value)
}

const updateSpacingSetting = (key, value) => {
  resumeStore.updateSpacingSetting(key, value)
}

const updatePageSetting = (key, value) => {
  resumeStore.updatePageSetting(key, value)
}

// 重置为默认设置
const resetToDefaults = () => {
  ElMessageBox.confirm(
    '确定要重置所有设置为默认值吗？此操作不可撤销。',
    '重置设置',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    resumeStore.resetGlobalSettings()
    ElMessage.success('设置已重置为默认值')
  }).catch(() => {
    // 用户取消
  })
}

// ESC键关闭抽屉
const handleKeydown = (event) => {
  if (event.key === 'Escape' && drawerVisible.value) {
    closeDrawer()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.global-settings-trigger {
  position: relative;
}

.settings-trigger-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.settings-trigger-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* 抽屉样式 */
:deep(.global-settings-drawer .el-drawer__header) {
  padding: 0;
  margin-bottom: 0;
  border-bottom: 1px solid #ebeef5;
}

:deep(.global-settings-drawer .el-drawer__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
}

:deep(.global-settings-drawer .el-drawer__footer) {
  border-top: 1px solid #ebeef5;
  padding: 16px 20px;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8f9fa;
}

.drawer-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.title-icon {
  color: #409eff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 折叠面板样式 */
:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 8px;
  font-weight: 500;
}

:deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}

:deep(.el-collapse-item__content) {
  padding: 16px 0 24px 0;
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #303133;
}

/* 设置组样式 */
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 4px;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-control .el-slider {
  flex: 1;
}

.unit {
  font-size: 12px;
  color: #909399;
  min-width: 20px;
  text-align: center;
}

/* 单选组样式 */
:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.el-radio) {
  margin-right: 0;
  white-space: nowrap;
}

/* 选择器样式 */
.setting-control .el-select {
  width: 100%;
}

/* 开关样式 */
.setting-control .el-switch {
  margin-left: auto;
}

/* 底部按钮 */
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-trigger-btn {
    bottom: 10px;
    right: 10px;
    transform: scale(0.9);
  }
}

:deep(.global-settings-drawer .el-drawer) {
  width: 450px;
}

@media (max-width: 768px) {
  :deep(.global-settings-drawer .el-drawer) {
    width: 100% !important;
  }
}

/* 滚动条样式 */
.drawer-content::-webkit-scrollbar {
  width: 6px;
}

.drawer-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.drawer-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.drawer-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
