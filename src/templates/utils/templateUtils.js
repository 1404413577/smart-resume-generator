/**
 * 模板工具函数
 */

/**
 * 验证简历数据完整性
 * @param {Object} resumeData - 简历数据
 * @returns {Object} 验证结果
 */
export function validateResumeData(resumeData) {
  const errors = []
  const warnings = []

  // 必填字段检查
  if (!resumeData.personalInfo?.name) {
    errors.push('姓名不能为空')
  }
  
  if (!resumeData.personalInfo?.email) {
    errors.push('邮箱不能为空')
  }
  
  if (!resumeData.personalInfo?.phone) {
    errors.push('电话不能为空')
  }

  // 可选但推荐的字段
  if (!resumeData.summary) {
    warnings.push('建议添加个人简介')
  }
  
  if (!resumeData.workExperience?.length) {
    warnings.push('建议添加工作经历')
  }
  
  if (!resumeData.education?.length) {
    warnings.push('建议添加教育背景')
  }
  
  if (!resumeData.skills?.length) {
    warnings.push('建议添加技能特长')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    completeness: calculateCompleteness(resumeData)
  }
}

/**
 * 计算简历完整度
 * @param {Object} resumeData - 简历数据
 * @returns {number} 完整度百分比
 */
function calculateCompleteness(resumeData) {
  const sections = [
    'personalInfo',
    'summary',
    'workExperience',
    'education',
    'skills',
    'projects'
  ]
  
  let completedSections = 0
  
  sections.forEach(section => {
    if (section === 'personalInfo') {
      if (resumeData.personalInfo?.name && 
          resumeData.personalInfo?.email && 
          resumeData.personalInfo?.phone) {
        completedSections++
      }
    } else if (Array.isArray(resumeData[section])) {
      if (resumeData[section].length > 0) {
        completedSections++
      }
    } else if (resumeData[section]) {
      completedSections++
    }
  })
  
  return Math.round((completedSections / sections.length) * 100)
}

/**
 * 格式化日期显示
 * @param {string} dateString - 日期字符串
 * @param {string} format - 格式类型
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateString, format = 'YYYY-MM') {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  
  switch (format) {
    case 'YYYY-MM':
      return `${year}-${month}`
    case 'YYYY年MM月':
      return `${year}年${month}月`
    case 'MM/YYYY':
      return `${month}/${year}`
    default:
      return dateString
  }
}

/**
 * 计算工作年限
 * @param {Array} workExperience - 工作经历数组
 * @returns {number} 工作年限
 */
export function calculateWorkYears(workExperience) {
  if (!workExperience || workExperience.length === 0) return 0
  
  let totalMonths = 0
  
  workExperience.forEach(work => {
    if (work.startDate && work.endDate) {
      const start = new Date(work.startDate)
      const end = work.current ? new Date() : new Date(work.endDate)
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                    (end.getMonth() - start.getMonth())
      totalMonths += Math.max(0, months)
    }
  })
  
  return Math.round(totalMonths / 12 * 10) / 10 // 保留一位小数
}

/**
 * 生成简历摘要统计
 * @param {Object} resumeData - 简历数据
 * @returns {Object} 统计信息
 */
export function generateResumeStats(resumeData) {
  return {
    workYears: calculateWorkYears(resumeData.workExperience),
    jobCount: resumeData.workExperience?.length || 0,
    educationCount: resumeData.education?.length || 0,
    skillCount: resumeData.skills?.length || 0,
    projectCount: resumeData.projects?.length || 0,
    completeness: calculateCompleteness(resumeData)
  }
}

/**
 * 清理和标准化简历数据
 * @param {Object} resumeData - 原始简历数据
 * @returns {Object} 清理后的数据
 */
export function sanitizeResumeData(resumeData) {
  const sanitized = JSON.parse(JSON.stringify(resumeData))
  
  // 清理空字符串和null值
  function cleanObject(obj) {
    if (Array.isArray(obj)) {
      return obj.filter(item => item != null).map(cleanObject)
    } else if (typeof obj === 'object' && obj !== null) {
      const cleaned = {}
      Object.keys(obj).forEach(key => {
        const value = obj[key]
        if (value !== null && value !== undefined && value !== '') {
          cleaned[key] = cleanObject(value)
        }
      })
      return cleaned
    }
    return obj
  }
  
  return cleanObject(sanitized)
}

/**
 * 检查模板兼容性
 * @param {string} templateId - 模板ID
 * @param {Object} resumeData - 简历数据
 * @returns {Object} 兼容性检查结果
 */
export function checkTemplateCompatibility(templateId, resumeData) {
  const templateRequirements = {
    modern: ['personalInfo', 'skills'],
    classic: ['personalInfo', 'workExperience'],
    creative: ['personalInfo', 'projects'],
    professional: ['personalInfo', 'workExperience', 'education'],
    academic: ['personalInfo', 'education', 'publications'],
    tech: ['personalInfo', 'skills', 'projects']
  }
  
  const requirements = templateRequirements[templateId] || []
  const missing = []
  
  requirements.forEach(section => {
    if (!resumeData[section] || 
        (Array.isArray(resumeData[section]) && resumeData[section].length === 0)) {
      missing.push(section)
    }
  })
  
  return {
    compatible: missing.length === 0,
    missing,
    recommendations: generateRecommendations(templateId, missing)
  }
}

/**
 * 生成模板使用建议
 * @param {string} templateId - 模板ID
 * @param {Array} missingSections - 缺失的部分
 * @returns {Array} 建议列表
 */
function generateRecommendations(templateId, missingSections) {
  const sectionNames = {
    personalInfo: '个人信息',
    workExperience: '工作经历',
    education: '教育背景',
    skills: '技能特长',
    projects: '项目经历',
    publications: '发表论文'
  }
  
  return missingSections.map(section => 
    `建议添加${sectionNames[section]}以更好地展示${templateId}模板效果`
  )
}
