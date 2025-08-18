<template>
  <div class="settings-view">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <el-icon><Setting /></el-icon>
          设置
        </h1>
        <p class="page-description">个性化您的简历编辑器体验</p>
      </div>
    </div>

    <div class="page-content">
      <div class="settings-container">
        <!-- 通用设置 -->
        <div class="settings-section">
          <h2 class="section-title">通用设置</h2>
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>自动保存</h3>
                <p>编辑时自动保存简历内容</p>
              </div>
              <el-switch v-model="settings.autoSave" @change="updateSetting('autoSave')" />
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>保存间隔</h3>
                <p>自动保存的时间间隔（秒）</p>
              </div>
              <el-input-number
                v-model="settings.saveInterval"
                :min="5"
                :max="300"
                :step="5"
                @change="updateSetting('saveInterval')"
                :disabled="!settings.autoSave"
              />
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>语言</h3>
                <p>界面显示语言</p>
              </div>
              <el-select v-model="settings.language" @change="updateSetting('language')">
                <el-option label="简体中文" value="zh-CN" />
                <el-option label="English" value="en-US" />
              </el-select>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>主题</h3>
                <p>选择界面主题</p>
              </div>
              <el-radio-group v-model="settings.theme" @change="updateSetting('theme')">
                <el-radio label="light">浅色</el-radio>
                <el-radio label="dark">深色</el-radio>
                <el-radio label="auto">跟随系统</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>

        <!-- 编辑器设置 -->
        <div class="settings-section">
          <h2 class="section-title">编辑器设置</h2>
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>默认字体</h3>
                <p>简历预览的默认字体</p>
              </div>
              <el-select v-model="settings.defaultFont" @change="updateSetting('defaultFont')">
                <el-option label="微软雅黑" value="Microsoft YaHei" />
                <el-option label="宋体" value="SimSun" />
                <el-option label="黑体" value="SimHei" />
                <el-option label="楷体" value="KaiTi" />
              </el-select>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>默认字号</h3>
                <p>简历内容的默认字号</p>
              </div>
              <el-input-number
                v-model="settings.defaultFontSize"
                :min="10"
                :max="20"
                @change="updateSetting('defaultFontSize')"
              />
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>预览缩放</h3>
                <p>简历预览的默认缩放比例</p>
              </div>
              <el-slider
                v-model="settings.previewScale"
                :min="50"
                :max="150"
                :step="10"
                show-stops
                @change="updateSetting('previewScale')"
              />
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>显示网格线</h3>
                <p>在预览中显示辅助网格线</p>
              </div>
              <el-switch v-model="settings.showGrid" @change="updateSetting('showGrid')" />
            </div>
          </div>
        </div>

        <!-- AI设置 -->
        <div class="settings-section">
          <h2 class="section-title">AI设置</h2>
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>AI建议</h3>
                <p>启用AI智能建议功能</p>
              </div>
              <el-switch v-model="settings.aiSuggestions" @change="updateSetting('aiSuggestions')" />
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>自动优化</h3>
                <p>AI自动优化简历内容</p>
              </div>
              <el-switch
                v-model="settings.autoOptimize"
                @change="updateSetting('autoOptimize')"
                :disabled="!settings.aiSuggestions"
              />
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>响应速度</h3>
                <p>AI响应的速度偏好</p>
              </div>
              <el-radio-group v-model="settings.aiSpeed" @change="updateSetting('aiSpeed')">
                <el-radio label="fast">快速</el-radio>
                <el-radio label="balanced">平衡</el-radio>
                <el-radio label="quality">质量优先</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>

        <!-- 导出设置 -->
        <div class="settings-section">
          <h2 class="section-title">导出设置</h2>
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>默认格式</h3>
                <p>导出简历的默认格式</p>
              </div>
              <el-select v-model="settings.exportFormat" @change="updateSetting('exportFormat')">
                <el-option label="PDF" value="pdf" />
                <el-option label="Word" value="docx" />
                <el-option label="图片" value="png" />
              </el-select>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>PDF质量</h3>
                <p>PDF导出的质量设置</p>
              </div>
              <el-radio-group v-model="settings.pdfQuality" @change="updateSetting('pdfQuality')">
                <el-radio label="standard">标准</el-radio>
                <el-radio label="high">高质量</el-radio>
                <el-radio label="print">打印质量</el-radio>
              </el-radio-group>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>水印</h3>
                <p>在导出的简历中添加水印</p>
              </div>
              <el-switch v-model="settings.watermark" @change="updateSetting('watermark')" />
            </div>
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="settings-section">
          <h2 class="section-title">数据管理</h2>
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>数据备份</h3>
                <p>定期备份您的简历数据</p>
              </div>
              <el-switch v-model="settings.autoBackup" @change="updateSetting('autoBackup')" />
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>存储位置</h3>
                <p>数据存储的位置</p>
              </div>
              <el-radio-group v-model="settings.storageLocation" @change="updateSetting('storageLocation')">
                <el-radio label="local">本地存储</el-radio>
                <el-radio label="cloud">云端存储</el-radio>
              </el-radio-group>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>清理缓存</h3>
                <p>清理应用缓存和临时文件</p>
              </div>
              <el-button @click="clearCache" type="warning" size="small">
                清理缓存
              </el-button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>重置设置</h3>
                <p>恢复所有设置到默认值</p>
              </div>
              <el-button @click="resetSettings" type="danger" size="small">
                重置设置
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Setting } from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'

const resumeStore = useResumeStore()

// 默认设置
const defaultSettings = {
  // 通用设置
  autoSave: true,
  saveInterval: 30,
  language: 'zh-CN',
  theme: 'light',
  
  // 编辑器设置
  defaultFont: 'Microsoft YaHei',
  defaultFontSize: 14,
  previewScale: 100,
  showGrid: false,
  
  // AI设置
  aiSuggestions: true,
  autoOptimize: false,
  aiSpeed: 'balanced',
  
  // 导出设置
  exportFormat: 'pdf',
  pdfQuality: 'high',
  watermark: false,
  
  // 数据管理
  autoBackup: true,
  storageLocation: 'local'
}

// 响应式设置
const settings = reactive({ ...defaultSettings })

// 方法
const updateSetting = (key) => {
  try {
    // 保存到本地存储
    const allSettings = { ...settings }
    localStorage.setItem('resumeBuilderSettings', JSON.stringify(allSettings))
    
    // 应用设置
    applySettings()
    
    ElMessage.success('设置已保存')
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存设置失败')
  }
}

const applySettings = () => {
  // 应用主题
  if (settings.theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  // 应用字体设置
  document.documentElement.style.setProperty('--default-font', settings.defaultFont)
  document.documentElement.style.setProperty('--default-font-size', `${settings.defaultFontSize}px`)
  
  // 更新简历store设置
  resumeStore.updateSettings({
    autoSave: settings.autoSave,
    saveInterval: settings.saveInterval * 1000, // 转换为毫秒
    previewScale: settings.previewScale / 100
  })
}

const clearCache = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清理缓存吗？这将删除所有临时文件。',
      '确认清理',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 清理缓存逻辑
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
    }
    
    ElMessage.success('缓存已清理')
  } catch {
    // 用户取消
  }
}

const resetSettings = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有设置吗？这将恢复到默认配置。',
      '确认重置',
      {
        confirmButtonText: '重置',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 重置设置
    Object.assign(settings, defaultSettings)
    localStorage.removeItem('resumeBuilderSettings')
    applySettings()
    
    ElMessage.success('设置已重置')
  } catch {
    // 用户取消
  }
}

const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('resumeBuilderSettings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      Object.assign(settings, { ...defaultSettings, ...parsed })
    }
    applySettings()
  } catch (error) {
    console.error('加载设置失败:', error)
    ElMessage.error('加载设置失败，使用默认设置')
  }
}

// 生命周期
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 24px 32px;
}

.header-content {
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-description {
  color: #606266;
  margin: 0;
  font-size: 14px;
}

.page-content {
  flex: 1;
  padding: 24px 32px;
  overflow: auto;
}

.settings-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f0f2f5;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
  margin-right: 20px;
}

.setting-info h3 {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 4px 0;
}

.setting-info p {
  font-size: 13px;
  color: #606266;
  margin: 0;
  line-height: 1.4;
}

.setting-item .el-select,
.setting-item .el-input-number {
  width: 200px;
}

.setting-item .el-slider {
  width: 200px;
}

.setting-item .el-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 20px;
  }
  
  .page-content {
    padding: 16px 20px;
  }
  
  .settings-section {
    padding: 20px 16px;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .setting-info {
    margin-right: 0;
  }
  
  .setting-item .el-select,
  .setting-item .el-input-number,
  .setting-item .el-slider {
    width: 100%;
  }
  
  .setting-item .el-radio-group {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
