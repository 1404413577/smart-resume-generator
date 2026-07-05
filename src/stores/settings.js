import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_AI_SETTINGS } from '@utils/ai/aiService'

const SETTINGS_STORAGE_KEY = 'resumeBuilderSettings'

const createDefaultSettings = () => ({
  autoSave: true,
  saveInterval: 30,
  theme: 'light',

  defaultFont: 'Microsoft YaHei',
  defaultFontSize: 14,
  previewScale: 100,
  showGrid: false,

  ...DEFAULT_AI_SETTINGS,

  exportFormat: 'pdf'
})

export const useSettingsStore = defineStore('settings', () => {
  const defaultSettings = createDefaultSettings()
  const settings = ref({ ...defaultSettings })
  const isLoaded = ref(false)

  const persistSettings = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings.value))
  }

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        settings.value = {
          ...defaultSettings,
          ...parsed,
          aiEngine: parsed.aiEngine || defaultSettings.aiEngine,
          aiApiKey: parsed.aiApiKey || defaultSettings.aiApiKey,
          aiBaseUrl: parsed.aiBaseUrl || defaultSettings.aiBaseUrl,
          aiModel: parsed.aiModel || defaultSettings.aiModel
        }
      } else {
        settings.value = { ...defaultSettings }
      }
      isLoaded.value = true
      return settings.value
    } catch (error) {
      console.error('加载设置失败:', error)
      settings.value = { ...defaultSettings }
      isLoaded.value = true
      throw error
    }
  }

  const saveSettings = () => {
    persistSettings()
    return settings.value
  }

  const updateSetting = (key, value = settings.value[key]) => {
    settings.value = {
      ...settings.value,
      [key]: value
    }
    return saveSettings()
  }

  const resetSettings = () => {
    settings.value = { ...defaultSettings }
    localStorage.removeItem(SETTINGS_STORAGE_KEY)
    return settings.value
  }

  const applyDocumentSettings = () => {
    if (settings.value.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    document.documentElement.style.setProperty('--default-font', settings.value.defaultFont)
    document.documentElement.style.setProperty('--default-font-size', `${settings.value.defaultFontSize}px`)
  }

  const exportSettings = () => JSON.stringify(settings.value, null, 2)

  const importSettings = (rawSettings) => {
    const parsed = typeof rawSettings === 'string' ? JSON.parse(rawSettings) : rawSettings
    settings.value = { ...defaultSettings, ...parsed }
    return saveSettings()
  }

  return {
    settings,
    defaultSettings,
    isLoaded,
    loadSettings,
    saveSettings,
    updateSetting,
    resetSettings,
    applyDocumentSettings,
    exportSettings,
    importSettings
  }
})
