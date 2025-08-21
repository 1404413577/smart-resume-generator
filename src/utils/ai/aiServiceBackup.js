/**
 * AI服务备用模块 - 提供模拟数据和基础功能
 * 当主要AI服务不可用时使用
 */

// 模拟延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 生成个人简介
 * @param {Object} personalInfo - 个人信息
 * @param {string} targetPosition - 目标职位
 * @returns {Promise<string>} 生成的个人简介
 */
export async function generatePersonalSummary(personalInfo, targetPosition = '') {
  await delay(1000) // 模拟API延迟
  
  const name = personalInfo.name || '求职者'
  const position = targetPosition || '相关职位'
  
  return `具有丰富经验的${position}专业人士，拥有扎实的专业技能和良好的团队协作能力。在工作中注重细节，善于解决问题，能够快速适应新环境和新技术。致力于为团队和公司创造价值，具备良好的沟通能力和学习能力，期待在${position}领域继续发展和成长。`
}

/**
 * 优化工作经历描述
 * @param {Object} workExperience - 工作经历信息
 * @returns {Promise<Array>} 优化后的职责描述数组
 */
export async function optimizeWorkExperience(workExperience) {
  await delay(1000)
  
  const position = workExperience.jobTitle || '职位'
  
  return [
    `负责${position}相关的日常工作，确保工作质量和效率`,
    `参与团队项目规划和执行，协助完成重要任务`,
    `与团队成员密切合作，提升整体工作效率`,
    `持续学习新技能和知识，提升专业能力`,
    `协助解决工作中遇到的技术和业务问题`
  ]
}

/**
 * 推荐技能特长
 * @param {string} industry - 行业领域
 * @param {string} position - 职位
 * @param {Array} currentSkills - 当前技能列表
 * @returns {Promise<Object>} 推荐的技能分类
 */
export async function recommendSkills(industry = '', position = '', currentSkills = []) {
  await delay(1000)
  
  return {
    technical: ['专业技能1', '专业技能2', '专业技能3'],
    soft: ['团队协作', '沟通能力', '问题解决', '学习能力'],
    language: ['中文', '英语']
  }
}

/**
 * 完善项目经历描述
 * @param {Object} project - 项目信息
 * @returns {Promise<Object>} 完善后的项目描述
 */
export async function enhanceProjectDescription(project) {
  await delay(1000)
  
  const projectName = project.name || '项目'
  
  return {
    description: `${projectName}是一个重要的业务项目，通过运用先进的技术和方法，成功实现了预期目标。项目过程中注重质量控制和团队协作，最终交付了高质量的成果。`,
    highlights: [
      '成功完成项目目标，获得客户认可',
      '运用先进技术，提升项目效率',
      '与团队密切合作，确保项目质量',
      '积累了宝贵的项目经验和技能'
    ]
  }
}

/**
 * 生成完整的AI简历
 * @param {Object} options - 生成选项
 * @returns {Promise<Object>} 生成的完整简历数据
 */
export async function generateCompleteResume(options) {
  await delay(2000)
  
  const { career, name, experience, education } = options
  
  return {
    personalInfo: {
      name: name || '张三',
      email: 'example@email.com',
      phone: '138-0000-0000',
      address: '北京市朝阳区'
    },
    summary: `具有${experience || '3'}年${career || '相关'}工作经验的专业人士，拥有扎实的专业技能和丰富的项目经验。`,
    workExperience: [
      {
        position: `${career || '相关'}工程师`,
        company: '某知名公司',
        location: '北京',
        startDate: '2021-01',
        endDate: '2024-01',
        current: false,
        description: '负责相关业务的开发和维护工作',
        achievements: [
          '完成多个重要项目的开发工作',
          '提升团队工作效率',
          '获得客户好评'
        ]
      }
    ],
    education: [
      {
        school: education || '某大学',
        major: '计算机科学与技术',
        degree: '本科',
        startDate: '2017-09',
        endDate: '2021-06',
        current: false,
        gpa: '3.5',
        honors: '优秀毕业生',
        description: '主修计算机相关课程，成绩优异'
      }
    ],
    skills: [
      { name: '专业技能1', level: 4, category: 'technical' },
      { name: '专业技能2', level: 3, category: 'technical' },
      { name: '团队协作', level: 4, category: 'soft' },
      { name: '英语', level: 3, category: 'language' }
    ],
    projects: [
      {
        name: '重要项目',
        description: '这是一个重要的业务项目，运用了先进的技术和方法。',
        technologies: ['技术1', '技术2'],
        url: '',
        startDate: '2023-01',
        endDate: '2023-06',
        highlights: [
          '成功完成项目目标',
          '提升了业务效率',
          '获得了宝贵经验'
        ]
      }
    ]
  }
}

/**
 * 检查API可用性
 * @returns {Promise<boolean>} API是否可用
 */
export async function checkAPIAvailability() {
  await delay(500)
  return true // 备用服务总是可用
}

/**
 * 智能对话式简历生成
 * @param {Object} conversationData - 对话数据
 * @returns {Promise<Object>} AI回复和建议
 */
export async function generateConversationalResponse(conversationData) {
  await delay(1500)
  
  return {
    response: '感谢您的信息！我来帮您优化简历内容。',
    suggestions: [
      '建议添加更多具体的工作成果',
      '可以补充一些技能证书信息',
      '项目经历可以更详细一些'
    ],
    questions: [
      '您还有其他想要突出的技能吗？',
      '有没有获得过什么奖项或认证？'
    ],
    resumeContent: null,
    qualityScore: 75,
    improvements: [
      '增加量化的工作成果',
      '补充更多技能关键词',
      '优化个人简介表述'
    ]
  }
}

/**
 * 简历质量评分和分析
 * @param {Object} resumeData - 简历数据
 * @returns {Promise<Object>} 质量分析结果
 */
export async function analyzeResumeQuality(resumeData) {
  await delay(1500)
  
  return {
    overallScore: 78,
    scores: {
      completeness: 85,
      relevance: 75,
      clarity: 80,
      impact: 70,
      formatting: 90
    },
    strengths: [
      '简历结构清晰',
      '教育背景完整',
      '格式规范美观'
    ],
    weaknesses: [
      '工作成果量化不足',
      '技能描述可以更具体',
      '项目经历需要补充'
    ],
    improvements: [
      {
        section: '工作经历',
        issue: '缺少量化的工作成果',
        suggestion: '添加具体的数据和成果',
        priority: 'high'
      },
      {
        section: '技能特长',
        issue: '技能描述过于简单',
        suggestion: '详细描述技能水平和应用经验',
        priority: 'medium'
      }
    ],
    keywords: ['专业技能', '团队协作', '项目管理'],
    missingElements: ['职业证书', '语言水平', '获奖经历']
  }
}

/**
 * JD匹配度分析
 * @param {Object} params - 分析参数
 * @returns {Promise<Object>} 匹配度分析结果
 */
export async function analyzeJobMatch(params) {
  await delay(1500)
  
  return {
    matchScore: 72,
    matchedSkills: ['技能1', '技能2', '团队协作'],
    missingSkills: ['技能3', '技能4'],
    recommendations: [
      {
        type: 'add_skill',
        content: '建议学习相关技能',
        reason: '提升岗位匹配度'
      },
      {
        type: 'optimize_content',
        content: '优化工作经历描述',
        reason: '突出相关经验'
      }
    ],
    keywordOptimization: [
      {
        original: '负责开发工作',
        optimized: '负责核心功能开发',
        reason: '更具体地描述工作内容'
      }
    ],
    sectionPriority: {
      skills: 'high',
      experience: 'high',
      education: 'medium'
    }
  }
}

/**
 * 智能内容优化
 * @param {Object} params - 优化参数
 * @returns {Promise<Object>} 优化结果
 */
export async function optimizeContent(params) {
  await delay(1000)
  
  const { content, section } = params
  
  return {
    optimizedContent: `${content}（已优化）`,
    improvements: [
      '增加了具体的描述',
      '优化了表达方式',
      '突出了关键信息'
    ],
    alternatives: [
      '替代表述方案1',
      '替代表述方案2'
    ],
    keywords: ['关键词1', '关键词2'],
    tone: 'professional',
    impactScore: 80
  }
}
