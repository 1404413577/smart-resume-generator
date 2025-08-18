/**
 * AI服务模块 - 使用Gemini API生成简历内容，失败时使用备用服务
 */

import * as backupService from './aiServiceBackup.js'

// Gemini API配置
const GEMINI_API_KEY = 'AIzaSyAqgE78y8_m4nQ09qHaf7xFSC0T_5ppyMU'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

// 是否使用备用服务
let useBackupService = false

// 请求频率限制
let lastRequestTime = 0
const REQUEST_INTERVAL = 1000 // 1秒间隔

/**
 * 调用Gemini API生成内容
 * @param {string} prompt - 提示词
 * @returns {Promise<string>} 生成的内容
 */
async function callGeminiAPI(prompt) {
  // 频率限制检查
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL - timeSinceLastRequest))
  }
  lastRequestTime = Date.now()

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      console.warn(`Gemini API请求失败: ${response.status} ${response.statusText}`)
      // 如果API失败，使用模拟数据
      return generateMockContent(prompt)
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.warn('API返回数据格式错误，使用模拟数据')
      return generateMockContent(prompt)
    }

    return data.candidates[0].content.parts[0].text.trim()
  } catch (error) {
    console.warn('Gemini API调用失败，使用模拟数据:', error)
    return generateMockContent(prompt)
  }
}

/**
 * 生成模拟内容作为备选方案
 * @param {string} prompt - 提示词
 * @returns {string} 模拟生成的内容
 */
function generateMockContent(prompt) {
  // 模拟API延迟
  return new Promise(resolve => {
    setTimeout(() => {
      if (prompt.includes('个人简介')) {
        resolve('具有5年以上前端开发经验的专业工程师，精通Vue.js、React等现代前端框架。具备良好的团队协作能力和项目管理经验，致力于创建高质量的用户界面和优秀的用户体验。对新技术保持敏锐的学习能力，能够快速适应项目需求并提供创新解决方案。')
      } else if (prompt.includes('工作经历') || prompt.includes('职责描述')) {
        resolve('["负责前端架构设计和技术选型，提升开发效率30%", "主导团队代码规范制定，降低bug率25%", "优化页面性能，首屏加载时间减少40%", "参与产品需求分析，确保技术方案可行性", "指导初级开发人员，提升团队整体技术水平"]')
      } else if (prompt.includes('技能') || prompt.includes('推荐')) {
        resolve('{"technical": ["TypeScript", "Node.js", "Webpack", "Docker"], "soft": ["团队协作", "项目管理", "问题解决"], "language": ["英语", "日语"]}')
      } else if (prompt.includes('项目')) {
        resolve('{"description": "基于Vue.js和Element Plus开发的企业级管理系统，支持多角色权限管理、数据可视化和实时通信功能。采用微前端架构，提升了系统的可维护性和扩展性。", "highlights": ["实现了完整的RBAC权限系统", "集成了ECharts数据可视化组件", "使用WebSocket实现实时消息推送", "采用Docker容器化部署，提升部署效率"]}')
      } else {
        resolve('这是一个AI生成的示例内容，用于演示功能。实际使用时会根据您的具体信息生成个性化内容。')
      }
    }, 1000) // 模拟1秒延迟
  })
}

/**
 * 生成个人简介
 * @param {Object} personalInfo - 个人信息
 * @param {string} targetPosition - 目标职位
 * @returns {Promise<string>} 生成的个人简介
 */
export async function generatePersonalSummary(personalInfo, targetPosition = '') {
  try {
    if (useBackupService) {
      return await backupService.generatePersonalSummary(personalInfo, targetPosition)
    }

    const prompt = `
请为以下个人信息生成一份专业的个人简介，要求简洁有力，突出核心优势：

个人信息：
- 姓名：${personalInfo.name || '求职者'}
- 邮箱：${personalInfo.email || ''}
- 电话：${personalInfo.phone || ''}
- 地址：${personalInfo.address || ''}
- 目标职位：${targetPosition || '相关职位'}

要求：
1. 字数控制在100-150字
2. 突出专业技能和工作经验
3. 体现职业目标和发展方向
4. 语言专业、积极正面
5. 适合中国求职市场

请直接返回生成的个人简介内容，不要包含其他说明文字。
`

    return await callGeminiAPI(prompt)
  } catch (error) {
    console.warn('Gemini API失败，使用备用服务:', error)
    useBackupService = true
    return await backupService.generatePersonalSummary(personalInfo, targetPosition)
  }
}

/**
 * 优化工作经历描述
 * @param {Object} workExperience - 工作经历信息
 * @returns {Promise<Array>} 优化后的职责描述数组
 */
export async function optimizeWorkExperience(workExperience) {
  try {
    if (useBackupService) {
      return await backupService.optimizeWorkExperience(workExperience)
    }

    const prompt = `
请为以下工作经历生成专业的职责描述，要求突出成果和贡献：

工作信息：
- 职位：${workExperience.jobTitle || ''}
- 公司：${workExperience.company || ''}
- 工作时间：${workExperience.startDate || ''} - ${workExperience.endDate || '至今'}
- 地点：${workExperience.location || ''}
- 当前职责：${workExperience.responsibilities?.join('；') || ''}

要求：
1. 生成3-5条职责描述
2. 使用动作词开头（如：负责、主导、完成、优化等）
3. 尽量量化成果（如：提升XX%、管理XX人团队、完成XX项目等）
4. 突出专业技能和业务价值
5. 语言简洁专业

请以JSON数组格式返回，例如：["职责描述1", "职责描述2", "职责描述3"]
只返回JSON数组，不要包含其他文字。
`

    const result = await callGeminiAPI(prompt)

    try {
      // 尝试解析JSON
      const parsed = JSON.parse(result)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch (parseError) {
      console.warn('AI返回内容不是有效JSON，尝试文本解析')
    }

    // 如果JSON解析失败，尝试文本解析
    const lines = result.split('\n').filter(line => line.trim())
    return lines.map(line => line.replace(/^[-•\d.]\s*/, '').trim()).filter(line => line)
  } catch (error) {
    console.warn('Gemini API失败，使用备用服务:', error)
    useBackupService = true
    return await backupService.optimizeWorkExperience(workExperience)
  }
}

/**
 * 推荐技能特长
 * @param {string} industry - 行业领域
 * @param {string} position - 职位
 * @param {Array} currentSkills - 当前技能列表
 * @returns {Promise<Object>} 推荐的技能分类
 */
export async function recommendSkills(industry = '', position = '', currentSkills = []) {
  try {
    if (useBackupService) {
      return await backupService.recommendSkills(industry, position, currentSkills)
    }

    const currentSkillsText = currentSkills.map(skill => skill.name).join('、')

    const prompt = `
请为以下职位推荐相关的技能特长，分为技术技能、软技能和语言技能：

职位信息：
- 行业：${industry || '通用'}
- 职位：${position || '通用职位'}
- 现有技能：${currentSkillsText || '无'}

要求：
1. 推荐与职位高度相关的技能
2. 避免重复现有技能
3. 技术技能：具体的工具、技术、平台等
4. 软技能：沟通、领导、分析等能力
5. 语言技能：英语、其他外语等

请以JSON格式返回，格式如下：
{
  "technical": ["技能1", "技能2", "技能3"],
  "soft": ["技能1", "技能2", "技能3"],
  "language": ["技能1", "技能2"]
}

只返回JSON对象，不要包含其他文字。
`

    const result = await callGeminiAPI(prompt)

    try {
      const parsed = JSON.parse(result)
      return {
        technical: parsed.technical || [],
        soft: parsed.soft || [],
        language: parsed.language || []
      }
    } catch (parseError) {
      console.warn('技能推荐JSON解析失败:', parseError)
      return {
        technical: [],
        soft: [],
        language: []
      }
    }
  } catch (error) {
    console.warn('Gemini API失败，使用备用服务:', error)
    useBackupService = true
    return await backupService.recommendSkills(industry, position, currentSkills)
  }
}

/**
 * 完善项目经历描述
 * @param {Object} project - 项目信息
 * @returns {Promise<Object>} 完善后的项目描述
 */
export async function enhanceProjectDescription(project) {
  try {
    if (useBackupService) {
      return await backupService.enhanceProjectDescription(project)
    }

    const prompt = `
请为以下项目经历生成专业的描述和亮点：

项目信息：
- 项目名称：${project.name || ''}
- 项目描述：${project.description || ''}
- 技术栈：${project.technologies?.join('、') || ''}
- 项目链接：${project.url || ''}
- 时间：${project.startDate || ''} - ${project.endDate || ''}

要求：
1. 优化项目描述，突出项目价值和技术难点
2. 生成3-5个项目亮点
3. 突出个人贡献和技术能力
4. 量化项目成果（如性能提升、用户增长等）
5. 语言专业简洁

请以JSON格式返回：
{
  "description": "优化后的项目描述",
  "highlights": ["亮点1", "亮点2", "亮点3"]
}

只返回JSON对象，不要包含其他文字。
`

    const result = await callGeminiAPI(prompt)

    try {
      const parsed = JSON.parse(result)
      return {
        description: parsed.description || project.description || '',
        highlights: parsed.highlights || []
      }
    } catch (parseError) {
      console.warn('项目描述JSON解析失败:', parseError)
      return {
        description: project.description || '',
        highlights: []
      }
    }
  } catch (error) {
    console.warn('Gemini API失败，使用备用服务:', error)
    useBackupService = true
    return await backupService.enhanceProjectDescription(project)
  }
}

/**
 * 职业模板配置
 */
const CAREER_TEMPLATES = {
  'software-engineer': {
    name: '软件工程师',
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'Docker'],
    summary: '具有{experience}年软件开发经验的工程师，精通前后端开发技术栈，具备良好的编程习惯和团队协作能力。',
    workTemplate: {
      responsibilities: [
        '参与系统架构设计和技术选型，确保项目技术方案的可行性',
        '负责核心功能模块的开发和维护，保证代码质量和性能',
        '与产品经理和设计师协作，将需求转化为技术实现',
        '参与代码审查和技术分享，提升团队整体技术水平',
        '优化系统性能，解决生产环境中的技术问题'
      ]
    }
  },
  'product-manager': {
    name: '产品经理',
    skills: ['产品规划', '需求分析', 'Axure', 'Figma', '数据分析', '项目管理'],
    summary: '拥有{experience}年产品管理经验，擅长用户需求分析和产品规划，具备敏锐的市场洞察力和优秀的跨部门协调能力。',
    workTemplate: {
      responsibilities: [
        '负责产品需求调研和分析，制定产品发展规划和路线图',
        '设计产品功能和用户体验，输出详细的产品需求文档',
        '协调开发、设计、测试等团队，推进产品按时上线',
        '分析产品数据和用户反馈，持续优化产品功能和体验',
        '跟踪竞品动态和市场趋势，为产品决策提供数据支持'
      ]
    }
  },
  'ui-designer': {
    name: 'UI设计师',
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', '原型设计', '用户体验', '视觉设计'],
    summary: '具有{experience}年UI/UX设计经验的设计师，擅长用户界面设计和交互体验优化，对设计趋势敏感，追求完美的视觉效果。',
    workTemplate: {
      responsibilities: [
        '负责产品界面设计和交互原型制作，确保设计的可用性',
        '制定和维护设计规范，保证产品视觉风格的一致性',
        '与产品经理和开发工程师协作，确保设计方案的落地',
        '进行用户研究和可用性测试，持续优化用户体验',
        '跟踪设计趋势和最佳实践，提升设计质量和效率'
      ]
    }
  },
  'marketing-specialist': {
    name: '市场营销专员',
    skills: ['数字营销', 'SEO/SEM', '内容营销', '社交媒体', '数据分析', '品牌推广'],
    summary: '拥有{experience}年市场营销经验，精通数字营销和品牌推广，具备敏锐的市场洞察力和创新的营销思维。',
    workTemplate: {
      responsibilities: [
        '制定和执行市场营销策略，提升品牌知名度和市场份额',
        '管理多渠道营销活动，包括线上线下推广和社交媒体运营',
        '分析市场数据和竞争对手，为营销决策提供数据支持',
        '与销售团队协作，制定销售支持材料和培训内容',
        '监控营销效果和ROI，持续优化营销策略和执行方案'
      ]
    }
  },
  'data-analyst': {
    name: '数据分析师',
    skills: ['Python', 'SQL', 'Tableau', 'Excel', '统计分析', '机器学习'],
    summary: '具有{experience}年数据分析经验，精通数据挖掘和统计分析，能够从数据中发现业务洞察，为决策提供有力支持。',
    workTemplate: {
      responsibilities: [
        '收集、清洗和分析业务数据，建立数据分析模型和指标体系',
        '制作数据报表和可视化图表，为业务团队提供数据支持',
        '进行用户行为分析和市场趋势研究，发现业务增长机会',
        '与业务团队协作，将数据洞察转化为可执行的业务策略',
        '优化数据处理流程，提升数据分析的效率和准确性'
      ]
    }
  }
}

/**
 * 生成完整的AI简历
 * @param {Object} options - 生成选项
 * @param {string} options.career - 职业类型
 * @param {string} options.name - 姓名
 * @param {string} options.experience - 工作年限
 * @param {string} options.education - 教育背景
 * @param {Array} options.companies - 公司列表
 * @returns {Promise<Object>} 生成的完整简历数据
 */
export async function generateCompleteResume(options) {
  try {
    if (useBackupService) {
      return await backupService.generateCompleteResume(options)
    }

    const { career, name, experience, education, companies = [] } = options
    const template = CAREER_TEMPLATES[career]

    if (!template) {
      throw new Error(`不支持的职业类型: ${career}`)
    }

    const prompt = `
请为以下信息生成一份完整的专业简历，要求内容真实可信、结构清晰、突出亮点：

基本信息：
- 姓名：${name}
- 目标职位：${template.name}
- 工作年限：${experience}年
- 教育背景：${education}
- 目标公司类型：${companies.join('、') || '互联网公司'}

请生成以下内容并以JSON格式返回：
{
  "personalInfo": {
    "name": "${name}",
    "email": "示例邮箱",
    "phone": "示例电话",
    "address": "示例地址"
  },
  "summary": "个人简介（100-150字）",
  "workExperience": [
    {
      "jobTitle": "职位名称",
      "company": "公司名称",
      "location": "工作地点",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "current": false,
      "responsibilities": ["职责1", "职责2", "职责3"]
    }
  ],
  "education": [
    {
      "degree": "学位",
      "major": "专业",
      "school": "学校名称",
      "graduationDate": "毕业时间",
      "gpa": "成绩"
    }
  ],
  "skills": [
    {
      "name": "技能名称",
      "level": "熟练程度",
      "category": "技能分类"
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "description": "项目描述",
      "technologies": ["技术1", "技术2"],
      "highlights": ["亮点1", "亮点2"]
    }
  ]
}

要求：
1. 内容要符合${template.name}的职业特点
2. 工作经历要体现职业发展轨迹
3. 技能要与职位匹配
4. 项目经历要突出技术能力和业务价值
5. 所有时间格式使用 YYYY-MM
6. 只返回JSON，不要其他文字

请确保返回的是有效的JSON格式。
`

    const result = await callGeminiAPI(prompt)

    try {
      const resumeData = JSON.parse(result)

      // 验证和补充数据
      return validateAndEnhanceResumeData(resumeData, template)
    } catch (parseError) {
      console.warn('AI返回内容不是有效JSON，使用模板生成:', parseError)
      return generateResumeFromTemplate(options, template)
    }
  } catch (error) {
    console.warn('Gemini API失败，使用备用服务:', error)
    useBackupService = true
    return await backupService.generateCompleteResume(options)
  }
}

/**
 * 验证和增强简历数据
 */
function validateAndEnhanceResumeData(data, template) {
  // 确保必要字段存在
  const enhanced = {
    personalInfo: {
      name: data.personalInfo?.name || '姓名',
      email: data.personalInfo?.email || 'example@email.com',
      phone: data.personalInfo?.phone || '138-0000-0000',
      address: data.personalInfo?.address || '北京市',
      ...data.personalInfo
    },
    summary: data.summary || template.summary.replace('{experience}', '3'),
    workExperience: data.workExperience || [],
    education: data.education || [],
    skills: data.skills || template.skills.map(skill => ({
      name: skill,
      level: '熟练',
      category: '技术技能'
    })),
    projects: data.projects || []
  }

  return enhanced
}

/**
 * 从模板生成简历数据（备用方案）
 */
function generateResumeFromTemplate(options, template) {
  const { name, experience, education } = options

  return {
    personalInfo: {
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@email.com`,
      phone: '138-0000-0000',
      address: '北京市朝阳区'
    },
    summary: template.summary.replace('{experience}', experience),
    workExperience: [
      {
        jobTitle: template.name,
        company: '科技有限公司',
        location: '北京',
        startDate: '2022-01',
        endDate: '2024-01',
        current: false,
        responsibilities: template.workTemplate.responsibilities
      }
    ],
    education: [
      {
        degree: '本科',
        major: '计算机科学与技术',
        school: education || '北京大学',
        graduationDate: '2022-06',
        gpa: '3.5'
      }
    ],
    skills: template.skills.map(skill => ({
      name: skill,
      level: '熟练',
      category: '专业技能'
    })),
    projects: [
      {
        name: '示例项目',
        description: '这是一个展示技术能力的示例项目',
        technologies: template.skills.slice(0, 3),
        highlights: ['项目亮点1', '项目亮点2']
      }
    ]
  }
}

/**
 * 检查API可用性
 * @returns {Promise<boolean>} API是否可用
 */
export async function checkAPIAvailability() {
  if (useBackupService) {
    return await backupService.checkAPIAvailability()
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: '测试连接'
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 10,
        }
      })
    })

    if (!response.ok) {
      useBackupService = true
      return false
    }

    return true
  } catch (error) {
    console.error('API连接测试失败:', error)
    useBackupService = true
    return false
  }
}

/**
 * 获取支持的职业类型列表
 * @returns {Array} 职业类型列表
 */
export function getSupportedCareers() {
  return Object.keys(CAREER_TEMPLATES).map(key => ({
    id: key,
    name: CAREER_TEMPLATES[key].name,
    skills: CAREER_TEMPLATES[key].skills
  }))
}
