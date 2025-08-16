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
      github: ''
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: []
  })

  const selectedTemplate = ref('modern')
  const isPreviewMode = ref(false)
  const savedResumes = ref([])
  const lastSaveTime = ref(null)
  const isAutoSaveEnabled = ref(false)

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

  const updateWorkExperience = (id, experience) => {
    const index = resumeData.value.workExperience.findIndex(exp => exp.id === id)
    if (index !== -1) {
      resumeData.value.workExperience[index] = { ...resumeData.value.workExperience[index], ...experience }
    }
  }

  const removeWorkExperience = (id) => {
    resumeData.value.workExperience = resumeData.value.workExperience.filter(exp => exp.id !== id)
  }

  // 教育经历操作
  const addEducation = (education) => {
    const newEducation = {
      ...education,
      id: Date.now().toString()
    }
    resumeData.value.education.push(newEducation)
  }

  const updateEducation = (id, education) => {
    const index = resumeData.value.education.findIndex(edu => edu.id === id)
    if (index !== -1) {
      resumeData.value.education[index] = { ...resumeData.value.education[index], ...education }
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

  // 项目操作
  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      highlights: project.highlights || ['']
    }
    resumeData.value.projects.push(newProject)
  }

  const updateProject = (id, project) => {
    const index = resumeData.value.projects.findIndex(proj => proj.id === id)
    if (index !== -1) {
      resumeData.value.projects[index] = { ...resumeData.value.projects[index], ...project }
    }
  }

  const removeProject = (id) => {
    resumeData.value.projects = resumeData.value.projects.filter(project => project.id !== id)
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
      lastSaveTime.value = new Date()
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
        resumeData.value = JSON.parse(saved)
      } catch (error) {
        console.error('加载本地数据失败:', error)
      }
    }

    const savedTemplate = localStorage.getItem('selectedTemplate')
    if (savedTemplate) {
      selectedTemplate.value = savedTemplate
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
      selectedTemplate.value = resume.template
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
        github: ''
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
    
    // 计算属性
    isResumeComplete,
    
    // 方法
    updatePersonalInfo,
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
    togglePreviewMode,
    resetResumeData,
    startAutoSave,
    stopAutoSave,
    init
  }
})
