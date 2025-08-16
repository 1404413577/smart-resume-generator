import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useResumeStore = defineStore('resume', () => {
  // 状态
  const resumeData = ref({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      linkedin: '',
      github: '',
      avatar: '', // 头像base64数据
      avatarPosition: 'left', // 头像位置: 'left' | 'right' | 'center'
      customFields: [] // 自定义字段数组
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customModulesData: {} // 存储自定义模块的用户数据，key为模块ID
  })

  const selectedTemplate = ref('modern')
  const isPreviewMode = ref(false)
  const savedResumes = ref([])
  const lastSaveTime = ref(null)
  const isAutoSaveEnabled = ref(false)

  // 模板设置
  const templateSettings = ref({
    sectionTitleAlignment: 'left' // 'left' | 'center'
  })

  // 全局设置配置
  const globalSettings = ref({
    // 字体设置
    typography: {
      baseFontSize: 14,        // 基础字号 12-16px
      titleFontSize: 18,       // 模块标题字号 16-24px
      subtitleFontSize: 16,    // 一级标题字号 14-20px
      fontFamily: 'system-ui'  // 字体族
    },
    // 间距设置
    spacing: {
      pageMargin: {
        top: 20,    // 页面上边距 10-40px
        right: 20,  // 页面右边距 10-40px
        bottom: 20, // 页面下边距 10-40px
        left: 20    // 页面左边距 10-40px
      },
      moduleSpacing: 12,  // 模块间距 8-20px
      lineHeight: 1.5     // 行高 1.2-2.0
    },
    // 页面设置
    pageSettings: {
      pageCount: 1,           // 页数限制 1-3
      pagingMode: 'auto',     // 分页模式: 'auto' | 'manual'
      showPageNumbers: true,  // 是否显示页码
      pageBreaks: []          // 手动分页点
    },
    // 自定义模块
    customModules: []
  })

  // 章节排序设置
  const sectionOrder = ref([
    'summary',        // 个人简介
    'education',      // 教育背景
    'workExperience', // 工作经历
    'skills',         // 技能特长
    'projects'        // 项目经历
  ])

  // 章节配置信息
  const sectionConfig = {
    summary: { name: '个人简介', icon: '📝' },
    education: { name: '教育背景', icon: '🎓' },
    workExperience: { name: '工作经历', icon: '💼' },
    skills: { name: '技能特长', icon: '⚡' },
    projects: { name: '项目经历', icon: '🚀' }
  }

  // 计算属性
  const isResumeComplete = computed(() => {
    const { personalInfo, workExperience, education } = resumeData.value
    return !!(
      personalInfo.name &&
      personalInfo.email &&
      personalInfo.phone &&
      workExperience.length > 0 &&
      education.length > 0
    )
  })

  // 个人信息操作
  const updatePersonalInfo = (info) => {
    resumeData.value.personalInfo = { ...resumeData.value.personalInfo, ...info }
  }

  // 头像操作
  const updateAvatar = (avatarData) => {
    resumeData.value.personalInfo.avatar = avatarData
    // 同时保存到localStorage
    try {
      localStorage.setItem('resume_avatar', avatarData)
    } catch (error) {
      console.warn('Failed to save avatar to localStorage:', error)
    }
  }

  const updateAvatarPosition = (position) => {
    resumeData.value.personalInfo.avatarPosition = position
  }

  const removeAvatar = () => {
    resumeData.value.personalInfo.avatar = ''
    try {
      localStorage.removeItem('resume_avatar')
    } catch (error) {
      console.warn('Failed to remove avatar from localStorage:', error)
    }
  }

  // 自定义字段操作
  const addCustomField = (field) => {
    const newField = {
      ...field,
      id: Date.now().toString()
    }
    resumeData.value.personalInfo.customFields.push(newField)
  }

  const updateCustomField = (id, updates) => {
    const index = resumeData.value.personalInfo.customFields.findIndex(field => field.id === id)
    if (index !== -1) {
      resumeData.value.personalInfo.customFields[index] = {
        ...resumeData.value.personalInfo.customFields[index],
        ...updates
      }
    }
  }

  const removeCustomField = (id) => {
    resumeData.value.personalInfo.customFields = resumeData.value.personalInfo.customFields.filter(field => field.id !== id)
  }

  const moveCustomField = (fromIndex, toIndex) => {
    const fields = [...resumeData.value.personalInfo.customFields]
    const [movedField] = fields.splice(fromIndex, 1)
    fields.splice(toIndex, 0, movedField)
    resumeData.value.personalInfo.customFields = fields
  }

  // 个人简介操作
  const updateSummary = (summary) => {
    resumeData.value.summary = summary
  }

  // 工作经历操作
  const addWorkExperience = (experience) => {
    const newExperience = {
      ...experience,
      id: Date.now().toString()
    }
    resumeData.value.workExperience.push(newExperience)
  }

  const updateWorkExperience = (id, updates) => {
    const index = resumeData.value.workExperience.findIndex(exp => exp.id === id)
    if (index !== -1) {
      resumeData.value.workExperience[index] = {
        ...resumeData.value.workExperience[index],
        ...updates
      }
    }
  }

  const removeWorkExperience = (id) => {
    resumeData.value.workExperience = resumeData.value.workExperience.filter(exp => exp.id !== id)
  }

  // 教育背景操作
  const addEducation = (education) => {
    const newEducation = {
      ...education,
      id: Date.now().toString()
    }
    resumeData.value.education.push(newEducation)
  }

  const updateEducation = (id, updates) => {
    const index = resumeData.value.education.findIndex(edu => edu.id === id)
    if (index !== -1) {
      resumeData.value.education[index] = {
        ...resumeData.value.education[index],
        ...updates
      }
    }
  }

  const removeEducation = (id) => {
    resumeData.value.education = resumeData.value.education.filter(edu => edu.id !== id)
  }

  // 技能操作
  const addSkill = (skill) => {
    const newSkill = {
      ...skill,
      id: Date.now().toString()
    }
    resumeData.value.skills.push(newSkill)
  }

  const removeSkill = (id) => {
    resumeData.value.skills = resumeData.value.skills.filter(skill => skill.id !== id)
  }

  // 项目经历操作
  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString()
    }
    resumeData.value.projects.push(newProject)
  }

  const updateProject = (id, updates) => {
    const index = resumeData.value.projects.findIndex(proj => proj.id === id)
    if (index !== -1) {
      resumeData.value.projects[index] = {
        ...resumeData.value.projects[index],
        ...updates
      }
    }
  }

  const removeProject = (id) => {
    resumeData.value.projects = resumeData.value.projects.filter(proj => proj.id !== id)
  }

  // 证书操作
  const addCertification = (certification) => {
    const newCertification = {
      ...certification,
      id: Date.now().toString()
    }
    resumeData.value.certifications.push(newCertification)
  }

  const removeCertification = (id) => {
    resumeData.value.certifications = resumeData.value.certifications.filter(cert => cert.id !== id)
  }

  // 语言操作
  const addLanguage = (language) => {
    const newLanguage = {
      ...language,
      id: Date.now().toString()
    }
    resumeData.value.languages.push(newLanguage)
  }

  const removeLanguage = (id) => {
    resumeData.value.languages = resumeData.value.languages.filter(lang => lang.id !== id)
  }

  // 本地存储
  const saveToLocalStorage = () => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData.value))
    localStorage.setItem('selectedTemplate', selectedTemplate.value)
    localStorage.setItem('templateSettings', JSON.stringify(templateSettings.value))
    localStorage.setItem('globalSettings', JSON.stringify(globalSettings.value))
    lastSaveTime.value = new Date()
  }

  // 自动保存定时器
  let autoSaveTimer = null

  // 启动自动保存
  const startAutoSave = () => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer)
    }

    isAutoSaveEnabled.value = true
    autoSaveTimer = setInterval(() => {
      saveToLocalStorage()
      console.log('自动保存完成:', new Date().toLocaleTimeString())
    }, 3000) // 每3秒自动保存
  }

  // 停止自动保存
  const stopAutoSave = () => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer)
      autoSaveTimer = null
      isAutoSaveEnabled.value = false
    }
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('resumeData')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        // 确保包含customModulesData字段
        if (!parsedData.customModulesData) {
          parsedData.customModulesData = {}
        }
        resumeData.value = parsedData
      } catch (error) {
        console.error('加载本地数据失败:', error)
      }
    }

    // 单独加载头像数据（可能很大）
    const savedAvatar = localStorage.getItem('resume_avatar')
    if (savedAvatar) {
      resumeData.value.personalInfo.avatar = savedAvatar
    }

    const savedTemplate = localStorage.getItem('selectedTemplate')
    if (savedTemplate) {
      // 如果保存的模板是已移除的简约风格，则重置为现代风格
      if (savedTemplate === 'minimal') {
        selectedTemplate.value = 'modern'
      } else {
        selectedTemplate.value = savedTemplate
      }
    }

    const savedSettings = localStorage.getItem('templateSettings')
    if (savedSettings) {
      try {
        templateSettings.value = JSON.parse(savedSettings)
      } catch (error) {
        console.error('加载模板设置失败:', error)
      }
    }

    // 加载章节排序设置
    const savedSectionOrder = localStorage.getItem('sectionOrder')
    if (savedSectionOrder) {
      try {
        sectionOrder.value = JSON.parse(savedSectionOrder)
      } catch (error) {
        console.error('加载章节排序设置失败:', error)
      }
    }

    // 加载全局设置
    const savedGlobalSettings = localStorage.getItem('globalSettings')
    if (savedGlobalSettings) {
      try {
        const parsed = JSON.parse(savedGlobalSettings)
        // 合并默认设置和保存的设置，确保新增的配置项有默认值
        globalSettings.value = {
          typography: {
            baseFontSize: 14,
            titleFontSize: 18,
            subtitleFontSize: 16,
            fontFamily: 'system-ui',
            ...parsed.typography
          },
          spacing: {
            pageMargin: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
              ...parsed.spacing?.pageMargin
            },
            moduleSpacing: parsed.spacing?.moduleSpacing || 12,
            lineHeight: parsed.spacing?.lineHeight || 1.5
          },
          pageSettings: {
            pageCount: parsed.pageSettings?.pageCount || 1,
            pagingMode: parsed.pageSettings?.pagingMode || 'auto',
            showPageNumbers: parsed.pageSettings?.showPageNumbers !== false,
            pageBreaks: parsed.pageSettings?.pageBreaks || []
          },
          customModules: parsed.customModules || []
        }
      } catch (error) {
        console.error('加载全局设置失败:', error)
      }
    }
  }

  // 简历管理
  const saveResume = (name) => {
    const newResume = {
      id: Date.now().toString(),
      name,
      data: JSON.parse(JSON.stringify(resumeData.value)),
      template: selectedTemplate.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    savedResumes.value.push(newResume)
    localStorage.setItem('savedResumes', JSON.stringify(savedResumes.value))
  }

  const loadResume = (id) => {
    const resume = savedResumes.value.find(r => r.id === id)
    if (resume) {
      resumeData.value = JSON.parse(JSON.stringify(resume.data))
      // 如果简历使用的是已移除的简约风格，则重置为现代风格
      if (resume.template === 'minimal') {
        selectedTemplate.value = 'modern'
      } else {
        selectedTemplate.value = resume.template
      }
    }
  }

  const deleteResume = (id) => {
    savedResumes.value = savedResumes.value.filter(r => r.id !== id)
    localStorage.setItem('savedResumes', JSON.stringify(savedResumes.value))
  }

  // 模板切换
  const setTemplate = (templateId) => {
    selectedTemplate.value = templateId
  }

  // 模板设置
  const updateTemplateSetting = (key, value) => {
    templateSettings.value[key] = value
  }

  // 预览模式切换
  const togglePreviewMode = () => {
    isPreviewMode.value = !isPreviewMode.value
  }

  // 重置数据
  const resetResumeData = () => {
    resumeData.value = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        linkedin: '',
        github: '',
        customFields: []
      },
      summary: '',
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    }
  }

  // 章节排序方法
  const updateSectionOrder = (newOrder) => {
    sectionOrder.value = [...newOrder]
    localStorage.setItem('sectionOrder', JSON.stringify(sectionOrder.value))
  }

  const moveSectionUp = (index) => {
    if (index > 0) {
      const newOrder = [...sectionOrder.value]
      const temp = newOrder[index]
      newOrder[index] = newOrder[index - 1]
      newOrder[index - 1] = temp
      updateSectionOrder(newOrder)
    }
  }

  const moveSectionDown = (index) => {
    if (index < sectionOrder.value.length - 1) {
      const newOrder = [...sectionOrder.value]
      const temp = newOrder[index]
      newOrder[index] = newOrder[index + 1]
      newOrder[index + 1] = temp
      updateSectionOrder(newOrder)
    }
  }

  const resetSectionOrder = () => {
    const defaultOrder = [
      'summary',
      'education',
      'workExperience',
      'skills',
      'projects'
    ]
    updateSectionOrder(defaultOrder)
  }

  // 全局设置方法
  const updateTypographySetting = (key, value) => {
    globalSettings.value.typography[key] = value
    saveToLocalStorage()
  }

  const updateSpacingSetting = (key, value) => {
    if (key === 'pageMargin') {
      globalSettings.value.spacing.pageMargin = { ...globalSettings.value.spacing.pageMargin, ...value }
    } else {
      globalSettings.value.spacing[key] = value
    }
    saveToLocalStorage()
  }

  const updatePageSetting = (key, value) => {
    globalSettings.value.pageSettings[key] = value
    saveToLocalStorage()
  }

  const addCustomModule = (module) => {
    const newModule = {
      ...module,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    globalSettings.value.customModules.push(newModule)
    saveToLocalStorage()
    return newModule
  }

  const updateCustomModule = (id, updates) => {
    const index = globalSettings.value.customModules.findIndex(module => module.id === id)
    if (index !== -1) {
      globalSettings.value.customModules[index] = {
        ...globalSettings.value.customModules[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
    }
  }

  const removeCustomModule = (id) => {
    globalSettings.value.customModules = globalSettings.value.customModules.filter(module => module.id !== id)
    saveToLocalStorage()
  }

  const resetGlobalSettings = () => {
    globalSettings.value = {
      typography: {
        baseFontSize: 14,
        titleFontSize: 18,
        subtitleFontSize: 16,
        fontFamily: 'system-ui'
      },
      spacing: {
        pageMargin: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        moduleSpacing: 12,
        lineHeight: 1.5
      },
      pageSettings: {
        pageCount: 1,
        pagingMode: 'auto',
        showPageNumbers: true,
        pageBreaks: []
      },
      customModules: []
    }
    saveToLocalStorage()
  }

  // 自定义模块数据管理
  const updateCustomModuleData = (moduleId, data) => {
    resumeData.value.customModulesData[moduleId] = data
    saveToLocalStorage()
  }

  const getCustomModuleData = (moduleId) => {
    return resumeData.value.customModulesData[moduleId] || {}
  }

  const initializeCustomModuleData = (moduleId, fields) => {
    if (!resumeData.value.customModulesData[moduleId]) {
      const initialData = {}
      fields.forEach(field => {
        initialData[field.name] = field.type === 'list' ? [] : ''
      })
      resumeData.value.customModulesData[moduleId] = initialData
      saveToLocalStorage()
    }
  }

  // 获取排序后的章节数据
  const getOrderedSections = computed(() => {
    return sectionOrder.value.map(sectionKey => ({
      key: sectionKey,
      name: sectionConfig[sectionKey].name,
      icon: sectionConfig[sectionKey].icon,
      data: resumeData.value[sectionKey],
      hasData: sectionKey === 'summary'
        ? !!resumeData.value[sectionKey]
        : Array.isArray(resumeData.value[sectionKey])
          ? resumeData.value[sectionKey].length > 0
          : !!resumeData.value[sectionKey]
    }))
  })

  // 初始化
  const init = () => {
    loadFromLocalStorage()
    const saved = localStorage.getItem('savedResumes')
    if (saved) {
      try {
        savedResumes.value = JSON.parse(saved)
      } catch (error) {
        console.error('加载保存的简历失败:', error)
      }
    }

    // 启动自动保存
    startAutoSave()

    // 页面卸载时停止自动保存
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', stopAutoSave)
    }
  }

  return {
    // 状态
    resumeData,
    selectedTemplate,
    isPreviewMode,
    savedResumes,
    lastSaveTime,
    isAutoSaveEnabled,
    templateSettings,
    sectionOrder,
    sectionConfig,
    globalSettings,

    // 计算属性
    isResumeComplete,
    getOrderedSections,

    // 方法
    updatePersonalInfo,
    updateAvatar,
    updateAvatarPosition,
    removeAvatar,
    addCustomField,
    updateCustomField,
    removeCustomField,
    moveCustomField,
    updateSummary,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    removeCertification,
    addLanguage,
    removeLanguage,
    saveResume,
    loadResume,
    deleteResume,
    setTemplate,
    updateTemplateSetting,
    togglePreviewMode,
    resetResumeData,
    startAutoSave,
    stopAutoSave,
    init,
    saveToLocalStorage,

    // 章节排序方法
    updateSectionOrder,
    moveSectionUp,
    moveSectionDown,
    resetSectionOrder,

    // 全局设置方法
    updateTypographySetting,
    updateSpacingSetting,
    updatePageSetting,
    addCustomModule,
    updateCustomModule,
    removeCustomModule,
    resetGlobalSettings,

    // 自定义模块数据管理
    updateCustomModuleData,
    getCustomModuleData,
    initializeCustomModuleData
  }
})
