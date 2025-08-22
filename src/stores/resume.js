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
      targetPosition: '', // 期望职位
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
  const lastSaveTime = ref(null)
  const isAutoSaveEnabled = ref(false)

  // 模板设置
  const templateSettings = ref({
    sectionTitleAlignment: 'left' // 'left' | 'center'
  })

  // 全局设置配置
  const globalSettings = ref({
    // 颜色主题设置
    theme: {
      // 主色调系统
      primary: '#409eff',
      primaryLight: '#66b3ff',
      primaryDark: '#1a73e8',

      // 辅助色系统
      secondary: '#67c23a',
      accent: '#e6a23c',
      warning: '#f56c6c',

      // 文字颜色系统
      textPrimary: '#303133',
      textSecondary: '#606266',
      textPlaceholder: '#c0c4cc',

      // 背景色系统
      background: '#ffffff',
      backgroundSecondary: '#f5f7fa',
      border: '#dcdfe6',

      // 预设主题
      preset: 'professional' // 'professional' | 'creative' | 'minimal' | 'custom'
    },

    // 字体设置
    typography: {
      baseFontSize: 14,        // 基础字号 12-16px
      titleFontSize: 18,       // 模块标题字号 16-24px
      subtitleFontSize: 16,    // 一级标题字号 14-20px
      fontFamily: 'system-ui', // 字体族
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      letterSpacing: 'normal'  // 'tight' | 'normal' | 'wide'
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
      lineHeight: 1.5,    // 行高 1.2-2.0
      sectionSpacing: 16, // 章节内间距
      itemSpacing: 8,     // 列表项间距
      paragraphSpacing: 12 // 段落间距
    },

    // 布局设置
    layout: {
      alignment: {
        global: 'left',     // 全局对齐: 'left' | 'center' | 'right'
        headings: 'left',   // 标题对齐
        content: 'left',    // 内容对齐
        contact: 'right'    // 联系方式对齐
      },
      columns: {
        enabled: false,     // 是否启用多列布局
        count: 2,          // 列数
        gap: 20,           // 列间距
        distribution: 'auto' // 'auto' | 'manual'
      }
    },

    // 装饰元素设置
    decoration: {
      borders: {
        enabled: true,
        style: 'solid',     // 'solid' | 'dashed' | 'dotted'
        width: 1,
        color: 'auto',      // 'auto' | 自定义颜色
        radius: 4
      },
      dividers: {
        enabled: true,
        style: 'line',      // 'line' | 'dots' | 'custom'
        thickness: 1,
        color: 'auto',
        margin: 8
      },
      icons: {
        enabled: true,
        style: 'emoji',     // 'emoji' | 'fontawesome' | 'custom'
        size: 16,
        color: 'auto'
      }
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
    'personalInfo',   // 个人信息
    'summary',        // 个人简介
    'education',      // 教育背景
    'workExperience', // 工作经历
    'skills',         // 技能特长
    'projects'        // 项目经历
  ])

  // 章节配置信息
  const sectionConfig = ref({
    personalInfo: {
      name: '个人信息',
      icon: '👤',
      visible: true,
      required: true,
      collapsible: false,
      fields: {
        name: { visible: true, required: true, label: '姓名' },
        email: { visible: true, required: true, label: '邮箱' },
        phone: { visible: true, required: true, label: '电话' },
        address: { visible: true, required: false, label: '地址' },
        website: { visible: false, required: false, label: '个人网站' },
        linkedin: { visible: false, required: false, label: 'LinkedIn' },
        github: { visible: false, required: false, label: 'GitHub' }
      }
    },
    summary: {
      name: '个人简介',
      icon: '📝',
      visible: true,
      required: false,
      collapsible: true,
      maxLength: 500
    },
    education: {
      name: '教育背景',
      icon: '🎓',
      visible: true,
      required: true,
      collapsible: true,
      fields: {
        school: { visible: true, required: true, label: '学校' },
        degree: { visible: true, required: true, label: '学位' },
        major: { visible: true, required: true, label: '专业' },
        startDate: { visible: true, required: true, label: '开始时间' },
        endDate: { visible: true, required: false, label: '结束时间' },
        gpa: { visible: false, required: false, label: 'GPA' },
        honors: { visible: false, required: false, label: '荣誉' }
      }
    },
    workExperience: {
      name: '工作经历',
      icon: '💼',
      visible: true,
      required: true,
      collapsible: true,
      fields: {
        company: { visible: true, required: true, label: '公司' },
        position: { visible: true, required: true, label: '职位' },
        startDate: { visible: true, required: true, label: '开始时间' },
        endDate: { visible: true, required: false, label: '结束时间' },
        location: { visible: true, required: false, label: '工作地点' },
        description: { visible: true, required: true, label: '工作描述' },
        achievements: { visible: true, required: false, label: '主要成就' }
      }
    },
    skills: {
      name: '技能特长',
      icon: '⚡',
      visible: true,
      required: false,
      collapsible: true,
      layout: 'list', // 'list' | 'grid' | 'tags'
      showLevel: true // 是否显示技能等级
    },
    projects: {
      name: '项目经历',
      icon: '🚀',
      visible: true,
      required: false,
      collapsible: true,
      fields: {
        name: { visible: true, required: true, label: '项目名称' },
        role: { visible: true, required: true, label: '担任角色' },
        startDate: { visible: true, required: false, label: '开始时间' },
        endDate: { visible: true, required: false, label: '结束时间' },
        description: { visible: true, required: true, label: '项目描述' },
        technologies: { visible: true, required: false, label: '使用技术' },
        url: { visible: false, required: false, label: '项目链接' },
        github: { visible: false, required: false, label: 'GitHub' }
      }
    }
  })

  // 主题预设
  const themePresets = ref({
    professional: {
      primary: '#2c3e50',
      primaryLight: '#34495e',
      primaryDark: '#1a252f',
      secondary: '#3498db',
      accent: '#e74c3c',
      textPrimary: '#2c3e50',
      textSecondary: '#7f8c8d',
      background: '#ffffff',
      backgroundSecondary: '#ecf0f1',
      border: '#bdc3c7'
    },
    creative: {
      primary: '#e74c3c',
      primaryLight: '#ec7063',
      primaryDark: '#c0392b',
      secondary: '#f39c12',
      accent: '#9b59b6',
      textPrimary: '#2c3e50',
      textSecondary: '#7f8c8d',
      background: '#ffffff',
      backgroundSecondary: '#fdf2e9',
      border: '#f4d03f'
    },
    minimal: {
      primary: '#34495e',
      primaryLight: '#5d6d7e',
      primaryDark: '#2c3e50',
      secondary: '#95a5a6',
      accent: '#3498db',
      textPrimary: '#2c3e50',
      textSecondary: '#7f8c8d',
      background: '#ffffff',
      backgroundSecondary: '#f8f9fa',
      border: '#dee2e6'
    }
  })

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

  // 当前主题颜色
  const currentThemeColors = computed(() => {
    const preset = globalSettings.value.theme.preset
    if (preset === 'custom') {
      return globalSettings.value.theme
    }
    return { ...globalSettings.value.theme, ...themePresets.value[preset] }
  })

  // 动态CSS变量
  const cssVariables = computed(() => {
    const theme = currentThemeColors.value
    const typography = globalSettings.value.typography
    const spacing = globalSettings.value.spacing

    return {
      '--theme-primary': theme.primary,
      '--theme-primary-light': theme.primaryLight,
      '--theme-primary-dark': theme.primaryDark,
      '--theme-secondary': theme.secondary,
      '--theme-accent': theme.accent,
      '--theme-text-primary': theme.textPrimary,
      '--theme-text-secondary': theme.textSecondary,
      '--theme-background': theme.background,
      '--theme-background-secondary': theme.backgroundSecondary,
      '--theme-border': theme.border,

      '--font-size-base': `${typography.baseFontSize}px`,
      '--font-size-title': `${typography.titleFontSize}px`,
      '--font-size-subtitle': `${typography.subtitleFontSize}px`,
      '--font-family': typography.fontFamily,
      '--line-height': spacing.lineHeight,

      '--spacing-page-margin-top': `${spacing.pageMargin.top}px`,
      '--spacing-page-margin-right': `${spacing.pageMargin.right}px`,
      '--spacing-page-margin-bottom': `${spacing.pageMargin.bottom}px`,
      '--spacing-page-margin-left': `${spacing.pageMargin.left}px`,
      '--spacing-module': `${spacing.moduleSpacing}px`,
      '--spacing-section': `${spacing.sectionSpacing}px`,
      '--spacing-item': `${spacing.itemSpacing}px`,
      '--spacing-paragraph': `${spacing.paragraphSpacing}px`
    }
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
        const parsed = JSON.parse(savedSectionOrder)
        // 检查是否包含personalInfo，如果没有则添加到开头
        if (!parsed.includes('personalInfo')) {
          parsed.unshift('personalInfo')
        }
        sectionOrder.value = parsed
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
          theme: {
            primary: '#409eff',
            primaryLight: '#66b3ff',
            primaryDark: '#1a73e8',
            secondary: '#67c23a',
            accent: '#e6a23c',
            textPrimary: '#303133',
            textSecondary: '#606266',
            background: '#ffffff',
            backgroundSecondary: '#f8f9fa',
            border: '#dee2e6',
            preset: 'professional',
            ...parsed.theme
          },
          typography: {
            baseFontSize: 14,
            titleFontSize: 18,
            subtitleFontSize: 16,
            fontFamily: 'system-ui',
            fontWeight: {
              light: 300,
              normal: 400,
              medium: 500,
              semibold: 600,
              bold: 700
            },
            letterSpacing: 'normal',
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
            lineHeight: parsed.spacing?.lineHeight || 1.5,
            sectionSpacing: parsed.spacing?.sectionSpacing || 16,
            itemSpacing: parsed.spacing?.itemSpacing || 8,
            paragraphSpacing: parsed.spacing?.paragraphSpacing || 12
          },
          layout: {
            alignment: {
              text: 'left',
              title: 'left'
            },
            ...parsed.layout
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



  // 模板切换
  const setTemplate = (templateId) => {
    selectedTemplate.value = templateId
    saveToLocalStorage()
  }

  // 应用模板（用于模板选择功能）
  const applyTemplate = (templateId) => {
    selectedTemplate.value = templateId
    saveToLocalStorage()
    return true
  }

  // 模板设置
  const updateTemplateSetting = (key, value) => {
    templateSettings.value[key] = value
    saveToLocalStorage()
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
        targetPosition: '',
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
      'personalInfo',
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

  const updateGlobalSettings = (updates) => {
    // 深度合并更新
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
        globalSettings.value[key] = {
          ...globalSettings.value[key],
          ...updates[key]
        }
      } else {
        globalSettings.value[key] = updates[key]
      }
    })
    saveToLocalStorage()
  }

  const resetGlobalSettings = () => {
    globalSettings.value = {
      theme: {
        primary: '#409eff',
        primaryLight: '#66b3ff',
        primaryDark: '#1a73e8',
        secondary: '#67c23a',
        accent: '#e6a23c',
        textPrimary: '#303133',
        textSecondary: '#606266',
        background: '#ffffff',
        backgroundSecondary: '#f8f9fa',
        border: '#dee2e6',
        preset: 'professional'
      },
      typography: {
        baseFontSize: 14,
        titleFontSize: 18,
        subtitleFontSize: 16,
        fontFamily: 'system-ui',
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        letterSpacing: 'normal'
      },
      spacing: {
        pageMargin: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        moduleSpacing: 12,
        lineHeight: 1.5,
        sectionSpacing: 16,
        itemSpacing: 8,
        paragraphSpacing: 12
      },
      layout: {
        alignment: {
          text: 'left',
          title: 'left'
        }
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
      hasData: sectionKey === 'personalInfo'
        ? true // 个人信息始终显示
        : sectionKey === 'summary'
          ? !!resumeData.value[sectionKey]
          : Array.isArray(resumeData.value[sectionKey])
            ? resumeData.value[sectionKey].length > 0
            : !!resumeData.value[sectionKey]
    }))
  })

  // 主题相关操作
  const applyThemePreset = (presetName) => {
    if (themePresets.value[presetName]) {
      // 应用预设的颜色值
      globalSettings.value.theme = {
        ...globalSettings.value.theme,
        ...themePresets.value[presetName],
        preset: presetName
      }
      saveToLocalStorage()
    }
  }

  const updateThemeColor = (colorKey, colorValue) => {
    globalSettings.value.theme[colorKey] = colorValue
    if (globalSettings.value.theme.preset !== 'custom') {
      globalSettings.value.theme.preset = 'custom'
    }
    saveToLocalStorage()
  }

  const resetTheme = () => {
    // 重置为professional主题预设
    applyThemePreset('professional')
  }

  // 章节配置操作
  const updateSectionConfigAdvanced = (sectionKey, config) => {
    if (sectionConfig.value[sectionKey]) {
      sectionConfig.value[sectionKey] = {
        ...sectionConfig.value[sectionKey],
        ...config
      }
      saveToLocalStorage()
    }
  }

  const toggleSectionVisibility = (sectionKey) => {
    if (sectionConfig.value[sectionKey]) {
      sectionConfig.value[sectionKey].visible = !sectionConfig.value[sectionKey].visible
      saveToLocalStorage()
    }
  }

  const updateFieldVisibility = (sectionKey, fieldKey, visible) => {
    if (sectionConfig.value[sectionKey]?.fields?.[fieldKey]) {
      sectionConfig.value[sectionKey].fields[fieldKey].visible = visible
      saveToLocalStorage()
    }
  }

  // 初始化
  const init = () => {
    loadFromLocalStorage()

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
    lastSaveTime,
    isAutoSaveEnabled,
    templateSettings,
    sectionOrder,
    sectionConfig,
    globalSettings,
    themePresets,

    // 计算属性
    isResumeComplete,
    currentThemeColors,
    cssVariables,
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
    setTemplate,
    applyTemplate,
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
    updateGlobalSettings,
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
    initializeCustomModuleData,

    // 主题相关操作
    applyThemePreset,
    updateThemeColor,
    resetTheme,

    // 高级章节配置操作
    updateSectionConfigAdvanced,
    toggleSectionVisibility,
    updateFieldVisibility
  }
})
