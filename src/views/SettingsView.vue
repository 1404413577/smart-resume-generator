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

          </div>
        </div>

        <!-- AI设置 -->
        <div class="settings-section">
          <h2 class="section-title">AI设置</h2>
          <p class="section-note">请确认所选 AI 服务、接口和本地模型许可证允许当前用途；本项目不附带第三方模型授权。</p>
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>AI引擎</h3>
                <p>选择在线兼容接口、Gemini、Ollama 或浏览器本地模型</p>
              </div>
              <el-select v-model="settings.aiEngine" @change="updateSetting('aiEngine')">
                <el-option label="OpenAI兼容接口" value="online" />
                <el-option label="Gemini" value="gemini" />
                <el-option label="Ollama本地服务" value="ollama" />
                <el-option label="浏览器本地模型" value="local" />
              </el-select>
            </div>

            <template v-if="settings.aiEngine === 'online'">
              <div class="setting-item">
                <div class="setting-info">
                  <h3>接口地址</h3>
                  <p>OpenAI兼容接口 Base URL，例如 https://api.openai.com/v1 或 https://open.bigmodel.cn/api/paas/v4</p>
                </div>
                <el-input v-model="settings.aiBaseUrl" @change="updateSetting('aiBaseUrl')" />
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>API Key</h3>
                  <p>用于调用 OpenAI 兼容接口的密钥</p>
                </div>
                <el-input
                  v-model="settings.aiApiKey"
                  type="password"
                  show-password
                  @change="updateSetting('aiApiKey')"
                />
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>模型</h3>
                  <p>例如 gpt-4o-mini、deepseek-chat、glm-4.5-air 或其它兼容模型</p>
                </div>
                <el-input v-model="settings.aiModel" @change="updateSetting('aiModel')" />
              </div>
            </template>

            <template v-if="settings.aiEngine === 'gemini'">
              <div class="setting-item">
                <div class="setting-info">
                  <h3>Gemini API Key</h3>
                  <p>Google AI Studio 获取的 Gemini API Key</p>
                </div>
                <el-input
                  v-model="settings.geminiApiKey"
                  type="password"
                  show-password
                  @change="updateSetting('geminiApiKey')"
                />
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Gemini模型</h3>
                  <p>例如 gemini-1.5-flash、gemini-1.5-pro</p>
                </div>
                <el-input v-model="settings.geminiModel" @change="updateSetting('geminiModel')" />
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Gemini接口地址</h3>
                  <p>默认使用 Google Generative Language v1beta</p>
                </div>
                <el-input v-model="settings.geminiBaseUrl" @change="updateSetting('geminiBaseUrl')" />
              </div>
            </template>

            <template v-if="settings.aiEngine === 'ollama'">
              <div class="setting-item">
                <div class="setting-info">
                  <h3>Ollama地址</h3>
                  <p>本机默认 http://localhost:11434，前端直连时需配置 OLLAMA_ORIGINS</p>
                </div>
                <el-input v-model="settings.ollamaBaseUrl" @change="updateSetting('ollamaBaseUrl')" />
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>Ollama模型</h3>
                  <p>请先在本机通过 ollama pull 下载模型</p>
                </div>
                <el-input v-model="settings.ollamaModel" @change="updateSetting('ollamaModel')" />
              </div>
            </template>

            <template v-if="settings.aiEngine === 'local'">
              <div class="setting-item">
                <div class="setting-info">
                  <h3>本地运行模式</h3>
                  <p>GPU 使用 WebGPU，CPU 使用 Transformers.js/WASM</p>
                  <p class="mode-feedback">{{ localModeFeedback }}</p>
                </div>
                <el-radio-group
                  v-model="settings.localAiType"
                  class="local-mode-options"
                  @change="markLocalModelChanged('localAiType')"
                >
                  <el-radio label="gpu" class="local-mode-option">GPU/WebGPU</el-radio>
                  <el-radio label="cpu" class="local-mode-option">CPU/WASM</el-radio>
                </el-radio-group>
              </div>

              <div class="setting-item" v-if="settings.localAiType === 'gpu'">
                <div class="setting-info">
                  <h3>GPU模型</h3>
                  <p>选择 WebLLM 预置模型，也可以直接输入自定义模型 ID</p>
                </div>
                <el-select
                  v-model="settings.localModelId"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="选择或输入 GPU 模型"
                  @change="markLocalModelChanged('localModelId')"
                >
                  <el-option
                    v-for="model in gpuModelOptions"
                    :key="model.value"
                    :label="model.label"
                    :value="model.value"
                  />
                </el-select>
              </div>

              <div class="setting-item" v-else>
                <div class="setting-info">
                  <h3>CPU模型</h3>
                  <p>Transformers.js 模型 ID，例如 Xenova/Qwen1.5-0.5B-Chat</p>
                </div>
                <el-input v-model="settings.localCpuModelId" @change="markLocalModelChanged('localCpuModelId')" />
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>WebGPU检测</h3>
                  <p>{{ webGPUStatus || '检测当前浏览器是否支持 GPU 本地模型' }}</p>
                </div>
                <el-button @click="checkWebGPU" size="small" :loading="checkingWebGPU">
                  检测
                </el-button>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h3>本地模型下载</h3>
                  <p>{{ localModelStatusText }}</p>
                  <el-progress
                    :percentage="localModelProgress"
                    :stroke-width="6"
                    :status="localModelProgressStatus"
                    class="local-model-progress"
                  />
                </div>
                <el-button
                  @click="downloadLocalModel"
                  type="primary"
                  size="small"
                  :loading="loadingLocalModel"
                >
                  下载并加载模型
                </el-button>
              </div>
            </template>

            <div class="setting-item">
              <div class="setting-info">
                <h3>连接测试</h3>
                <p>用当前 AI 配置发送一条短请求，验证服务是否可用</p>
              </div>
              <el-button
                @click="testAIConnection"
                type="primary"
                size="small"
                :loading="testingAI"
                :disabled="settings.aiEngine === 'local' && (!localModelReady || loadingLocalModel)"
              >
                测试AI连接
              </el-button>
            </div>
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="settings-section">
          <h2 class="section-title">数据管理</h2>
          <div class="settings-group">
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

            <div class="setting-item">
              <div class="setting-info">
                <h3>导出设置</h3>
                <p>将当前应用和 AI 配置导出为 JSON 备份</p>
              </div>
              <el-button @click="exportSettingsFile" size="small">
                导出JSON
              </el-button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>导入设置</h3>
                <p>从 JSON 文件恢复设置，不会覆盖简历内容</p>
              </div>
              <el-upload
                :auto-upload="false"
                :show-file-list="false"
                accept="application/json,.json"
                :on-change="importSettingsFile"
              >
                <el-button size="small">导入JSON</el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Setting } from '@element-plus/icons-vue'
import { useResumeStore } from '@stores/resume'
import { useSettingsStore } from '@stores/settings'
import { checkAPIAvailability } from '@utils/ai/aiService'
import { checkWebGPUSupport, localAiService } from '@utils/ai/localAi'

const resumeStore = useResumeStore()
const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const testingAI = ref(false)
const checkingWebGPU = ref(false)
const webGPUStatus = ref('')
const loadingLocalModel = ref(false)
const localModelReady = ref(false)
const localModelProgress = ref(0)
const localModelStatusText = ref('选择运行模式和模型后，点击按钮下载并加载到浏览器缓存。')
const localModelProgressStatus = ref('')
const localModeFeedback = ref('当前未加载本地模型。')

const gpuModelOptions = [
  { label: 'SmolLM2 135M q0f32 - 最轻量', value: 'SmolLM2-135M-Instruct-q0f32-MLC' },
  { label: 'SmolLM2 135M q0f16 - 更省显存', value: 'SmolLM2-135M-Instruct-q0f16-MLC' },
  { label: 'SmolLM2 360M q4f16 - 平衡', value: 'SmolLM2-360M-Instruct-q4f16_1-MLC' },
  { label: 'SmolLM2 360M q4f32 - 较高精度', value: 'SmolLM2-360M-Instruct-q4f32_1-MLC' },
  { label: 'SmolLM2 1.7B q4f16 - 更强', value: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC' },
  { label: 'Llama 3.2 1B q4f16', value: 'Llama-3.2-1B-Instruct-q4f16_1-MLC' },
  { label: 'Llama 3.2 3B q4f16', value: 'Llama-3.2-3B-Instruct-q4f16_1-MLC' },
  { label: 'Phi 3.5 mini q4f16', value: 'Phi-3.5-mini-instruct-q4f16_1-MLC' },
  { label: 'Gemma 2 2B q4f16', value: 'gemma-2-2b-it-q4f16_1-MLC' }
]

// 方法
const updateSetting = (key) => {
  try {
    settingsStore.updateSetting(key)
    applySettings()
    ElMessage.success('设置已保存')
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存设置失败')
  }
}

const testAIConnection = async () => {
  if (settings.value.aiEngine === 'local' && !localModelReady.value) {
    ElMessage.warning('请先下载并加载浏览器本地模型')
    return
  }

  testingAI.value = true
  try {
    const ok = await checkAPIAvailability()
    if (ok === true) {
      ElMessage.success('AI连接测试成功')
    } else {
      ElMessage.error(ok?.message || 'AI连接测试失败，请检查配置或服务状态')
    }
  } finally {
    testingAI.value = false
  }
}

const getLocalModelConfig = () => {
  const type = settings.value.localAiType || 'gpu'
  const modelId = type === 'gpu'
    ? settings.value.localModelId
    : settings.value.localCpuModelId

  return { type, modelId }
}

const refreshLocalModelReady = () => {
  const { type, modelId } = getLocalModelConfig()
  localModelReady.value = localAiService.isModelReady(modelId, type)
  if (localModelReady.value) {
    localModeFeedback.value = `当前已加载 ${type === 'gpu' ? 'GPU/WebGPU' : 'CPU/WASM'} 模式。`
    localModelStatusText.value = '模型已加载，可以测试和使用。'
    localModelProgress.value = 100
    localModelProgressStatus.value = 'success'
  }
}

const markLocalModelChanged = (key) => {
  localModelReady.value = false
  localModelProgress.value = 0
  localModelProgressStatus.value = ''
  const { type, modelId } = getLocalModelConfig()
  const modeName = type === 'gpu' ? 'GPU/WebGPU' : 'CPU/WASM'

  localModeFeedback.value = `已选择 ${modeName} 模式。`
  localModelStatusText.value = `已选择 ${modeName} 模式，模型 ${modelId || '未填写'}，请点击“下载并加载模型”。`
  updateSetting(key)
  ElMessage.info(`已切换到 ${modeName} 模式`)
}

const downloadLocalModel = async () => {
  const { type, modelId } = getLocalModelConfig()
  if (!modelId) {
    ElMessage.warning('请先填写模型 ID')
    return
  }

  loadingLocalModel.value = true
  localModelReady.value = false
  localModelProgress.value = 0
  localModelProgressStatus.value = ''
  localModelStatusText.value = '准备下载并加载模型...'

  try {
    await localAiService.getEngine(modelId, type, (report) => {
      localModelProgress.value = Math.min(100, Math.max(0, report.progress || 0))
      localModelStatusText.value = report.statusText || '正在下载并加载模型...'
    })
    localModelReady.value = true
    localModelProgress.value = 100
    localModelProgressStatus.value = 'success'
    localModelStatusText.value = '模型已加载，可以测试和使用。'
    ElMessage.success('本地模型已加载')
  } catch (error) {
    localModelReady.value = false
    localModelProgressStatus.value = 'exception'
    localModelStatusText.value = error?.message || '本地模型加载失败'
    ElMessage.error(localModelStatusText.value)
  } finally {
    loadingLocalModel.value = false
  }
}

const checkWebGPU = async () => {
  checkingWebGPU.value = true
  try {
    const result = await checkWebGPUSupport()
    webGPUStatus.value = result.message
    if (result.supported) {
      ElMessage.success(result.message)
    } else {
      ElMessage.warning(result.message)
    }
  } finally {
    checkingWebGPU.value = false
  }
}

const applySettings = () => {
  // 更新简历store设置
  resumeStore.updateSettings({
    autoSave: settings.value.autoSave,
    saveInterval: settings.value.saveInterval * 1000
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
    
    settingsStore.resetSettings()
    applySettings()
    
    ElMessage.success('设置已重置')
  } catch {
    // 用户取消
  }
}

const exportSettingsFile = () => {
  try {
    const blob = new Blob([settingsStore.exportSettings()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'resume-builder-settings.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    ElMessage.success('设置已导出')
  } catch (error) {
    console.error('导出设置失败:', error)
    ElMessage.error('导出设置失败')
  }
}

const importSettingsFile = async (uploadFile) => {
  try {
    const text = await uploadFile.raw.text()
    settingsStore.importSettings(text)
    applySettings()
    ElMessage.success('设置已导入')
  } catch (error) {
    console.error('导入设置失败:', error)
    ElMessage.error('导入设置失败，请检查 JSON 文件格式')
  }
}

const loadSettings = () => {
  try {
    settingsStore.loadSettings()
    applySettings()
    refreshLocalModelReady()
  } catch {
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
.setting-item .el-input,
.setting-item .el-input-number {
  width: 320px;
}

.section-note {
  margin: -8px 0 18px;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.setting-item .el-slider {
  width: 200px;
}

.setting-item .el-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.local-mode-options {
  width: 320px;
}

.local-mode-option {
  width: 100%;
  height: auto;
  margin-right: 0;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #ffffff;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.local-mode-option:hover {
  border-color: #409eff;
  background: #f5faff;
}

.local-mode-option.is-checked {
  border-color: #409eff;
  background: #ecf5ff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.12);
}

.local-mode-option.is-checked :deep(.el-radio__label) {
  color: #1677d2;
  font-weight: 600;
}

.local-model-progress {
  margin-top: 10px;
  max-width: 320px;
}

.mode-feedback {
  margin-top: 6px !important;
  color: #409eff !important;
  font-weight: 500;
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
  .setting-item .el-input,
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
