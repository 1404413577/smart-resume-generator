import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'

/**
 * 将简历数据转换为模板变量格式
 * @param {Object} resumeData - 简历数据
 * @returns {Object} 模板变量对象
 */
function transformResumeDataForTemplate(resumeData) {
  const data = {
    // 个人信息
    name: resumeData.personalInfo?.name || '',
    email: resumeData.personalInfo?.email || '',
    phone: resumeData.personalInfo?.phone || '',
    address: resumeData.personalInfo?.address || '',
    website: resumeData.personalInfo?.website || '',
    linkedin: resumeData.personalInfo?.linkedin || '',
    github: resumeData.personalInfo?.github || '',
    targetPosition: resumeData.personalInfo?.targetPosition || '',
    
    // 个人简介
    summary: resumeData.summary || '',
    
    // 工作经历
    workExperience: (resumeData.workExperience || []).map((work, index) => ({
      index: index + 1,
      position: work.position || '',
      company: work.company || '',
      location: work.location || '',
      startDate: work.startDate || '',
      endDate: work.endDate || '至今',
      duration: formatDateRange(work.startDate, work.endDate),
      description: work.description || '',
      achievements: work.achievements || [],
      achievementsText: (work.achievements || []).join('\n• '),
      current: work.current || false
    })),
    
    // 教育背景
    education: (resumeData.education || []).map((edu, index) => ({
      index: index + 1,
      school: edu.school || '',
      major: edu.major || '',
      degree: edu.degree || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '至今',
      duration: formatDateRange(edu.startDate, edu.endDate),
      gpa: edu.gpa || '',
      honors: edu.honors || '',
      description: edu.description || '',
      current: edu.current || false
    })),
    
    // 技能特长
    skills: (resumeData.skills || []).map((skill, index) => ({
      index: index + 1,
      name: skill.name || '',
      level: skill.level || '',
      category: skill.category || '',
      description: skill.description || ''
    })),
    
    // 项目经历
    projects: (resumeData.projects || []).map((project, index) => ({
      index: index + 1,
      name: project.name || '',
      role: project.role || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      duration: formatDateRange(project.startDate, project.endDate),
      description: project.description || '',
      technologies: project.technologies || [],
      technologiesText: (project.technologies || []).join('、'),
      url: project.url || '',
      github: project.github || ''
    })),
    
    // 证书资质
    certifications: (resumeData.certifications || []).map((cert, index) => ({
      index: index + 1,
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      description: cert.description || ''
    })),
    
    // 语言能力
    languages: (resumeData.languages || []).map((lang, index) => ({
      index: index + 1,
      name: lang.name || '',
      level: lang.level || '',
      description: lang.description || ''
    })),
    
    // 统计信息
    workExperienceCount: (resumeData.workExperience || []).length,
    educationCount: (resumeData.education || []).length,
    skillsCount: (resumeData.skills || []).length,
    projectsCount: (resumeData.projects || []).length,
    certificationsCount: (resumeData.certifications || []).length,
    languagesCount: (resumeData.languages || []).length,
    
    // 当前日期
    currentDate: new Date().toLocaleDateString('zh-CN'),
    currentYear: new Date().getFullYear()
  }
  
  return data
}

/**
 * 格式化日期范围
 * @param {string} startDate - 开始日期
 * @param {string} endDate - 结束日期
 * @returns {string} 格式化的日期范围
 */
function formatDateRange(startDate, endDate) {
  if (!startDate) return ''
  const start = startDate
  const end = endDate || '至今'
  return `${start} - ${end}`
}

/**
 * 使用docxtemplater填充Word模板
 * @param {File} templateFile - 模板文件
 * @param {Object} resumeData - 简历数据
 * @param {Object} options - 选项
 * @returns {Promise<Blob>} 填充后的Word文档Blob
 */
export async function fillWordTemplate(templateFile, resumeData, options = {}) {
  try {
    // 读取模板文件
    const arrayBuffer = await templateFile.arrayBuffer()
    const zip = new PizZip(arrayBuffer)
    
    // 创建docxtemplater实例
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      ...options
    })
    
    // 转换简历数据为模板变量
    const templateData = transformResumeDataForTemplate(resumeData)
    
    // 设置数据并渲染
    doc.setData(templateData)
    doc.render()
    
    // 生成文档
    const buf = doc.getZip().generate({
      type: 'arraybuffer',
      compression: 'DEFLATE'
    })
    
    return new Blob([buf], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })
  } catch (error) {
    console.error('模板填充失败:', error)
    throw new Error(`模板填充失败: ${error.message}`)
  }
}

/**
 * 验证模板文件
 * @param {File} file - 文件对象
 * @returns {boolean} 是否为有效的docx文件
 */
export function validateTemplateFile(file) {
  if (!file) return false
  
  // 检查文件类型
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ]
  
  if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.docx')) {
    return false
  }
  
  // 检查文件大小（限制为10MB）
  if (file.size > 10 * 1024 * 1024) {
    return false
  }
  
  return true
}

/**
 * 获取模板变量说明文档
 * @returns {Object} 模板变量说明
 */
export function getTemplateVariablesDoc() {
  return {
    personalInfo: {
      name: '{{name}} - 姓名',
      email: '{{email}} - 邮箱',
      phone: '{{phone}} - 电话',
      address: '{{address}} - 地址',
      website: '{{website}} - 个人网站',
      linkedin: '{{linkedin}} - LinkedIn',
      github: '{{github}} - GitHub',
      targetPosition: '{{targetPosition}} - 目标职位'
    },
    summary: {
      summary: '{{summary}} - 个人简介'
    },
    workExperience: {
      loop: '{{#workExperience}} ... {{/workExperience}} - 工作经历循环',
      fields: {
        position: '{{position}} - 职位',
        company: '{{company}} - 公司',
        location: '{{location}} - 工作地点',
        startDate: '{{startDate}} - 开始日期',
        endDate: '{{endDate}} - 结束日期',
        duration: '{{duration}} - 工作时长',
        description: '{{description}} - 工作描述',
        achievementsText: '{{achievementsText}} - 工作成就'
      }
    },
    education: {
      loop: '{{#education}} ... {{/education}} - 教育背景循环',
      fields: {
        school: '{{school}} - 学校',
        major: '{{major}} - 专业',
        degree: '{{degree}} - 学位',
        startDate: '{{startDate}} - 开始日期',
        endDate: '{{endDate}} - 结束日期',
        gpa: '{{gpa}} - GPA',
        honors: '{{honors}} - 荣誉'
      }
    },
    skills: {
      loop: '{{#skills}} ... {{/skills}} - 技能循环',
      fields: {
        name: '{{name}} - 技能名称',
        level: '{{level}} - 技能水平',
        category: '{{category}} - 技能分类'
      }
    },
    projects: {
      loop: '{{#projects}} ... {{/projects}} - 项目循环',
      fields: {
        name: '{{name}} - 项目名称',
        role: '{{role}} - 项目角色',
        description: '{{description}} - 项目描述',
        technologiesText: '{{technologiesText}} - 技术栈',
        url: '{{url}} - 项目链接',
        github: '{{github}} - GitHub链接'
      }
    },
    statistics: {
      workExperienceCount: '{{workExperienceCount}} - 工作经历数量',
      educationCount: '{{educationCount}} - 教育背景数量',
      skillsCount: '{{skillsCount}} - 技能数量',
      projectsCount: '{{projectsCount}} - 项目数量'
    },
    date: {
      currentDate: '{{currentDate}} - 当前日期',
      currentYear: '{{currentYear}} - 当前年份'
    }
  }
}
