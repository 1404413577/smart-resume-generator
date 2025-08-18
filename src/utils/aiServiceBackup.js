/**
 * AI服务备用模块 - 提供可靠的模拟AI生成功能
 */

// 模拟数据库
const mockData = {
  personalSummaries: [
    '具有{years}年以上{field}经验的专业人士，精通相关技术栈和业务流程。具备优秀的团队协作能力和项目管理经验，致力于创造高质量的解决方案。对新技术保持敏锐的学习能力，能够快速适应项目需求并提供创新方案。',
    '经验丰富的{field}专家，拥有{years}年的行业经验。擅长技术架构设计和团队管理，具有强烈的责任心和执行力。注重细节，追求卓越，能够在快节奏的工作环境中保持高效产出。',
    '资深{field}工程师，{years}年专业经验。具备扎实的技术基础和丰富的项目实战经验，善于解决复杂技术问题。具有良好的沟通能力和团队精神，能够有效推动项目进展。'
  ],
  
  workResponsibilities: [
    '负责{area}的架构设计和技术选型，提升系统性能和开发效率',
    '主导团队技术规范制定，确保代码质量和项目可维护性',
    '参与产品需求分析和技术方案评估，确保方案的可行性和合理性',
    '优化{area}流程，提升用户体验和系统稳定性',
    '指导团队成员技术成长，提升整体技术水平',
    '负责关键技术难点攻关，确保项目按时交付',
    '建立和完善{area}监控体系，及时发现和解决问题'
  ],
  
  technicalSkills: {
    frontend: ['Vue.js', 'React', 'TypeScript', 'Webpack', 'Vite', 'Element Plus', 'Ant Design'],
    backend: ['Node.js', 'Python', 'Java', 'Spring Boot', 'Express', 'Django', 'MySQL', 'Redis'],
    devops: ['Docker', 'Kubernetes', 'Jenkins', 'Git', 'Linux', 'Nginx', 'AWS', 'Azure'],
    mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Cordova'],
    data: ['Python', 'R', 'SQL', 'MongoDB', 'Elasticsearch', 'Tableau', 'Power BI']
  },
  
  softSkills: ['团队协作', '项目管理', '沟通表达', '问题解决', '创新思维', '学习能力', '领导力', '时间管理'],
  
  languages: ['英语', '日语', '韩语', '德语', '法语', '西班牙语'],
  
  projectHighlights: [
    '实现了完整的用户权限管理系统，支持多角色和细粒度权限控制',
    '集成了先进的数据可视化组件，提升了数据展示效果',
    '采用微服务架构，提高了系统的可扩展性和维护性',
    '实现了实时通信功能，提升了用户交互体验',
    '优化了系统性能，响应时间提升50%以上',
    '建立了完善的自动化测试体系，确保代码质量',
    '采用容器化部署，提升了部署效率和系统稳定性'
  ]
}

/**
 * 生成个人简介
 */
export async function generatePersonalSummary(personalInfo, targetPosition = '') {
  await simulateDelay()
  
  const templates = mockData.personalSummaries
  const template = templates[Math.floor(Math.random() * templates.length)]
  
  // 推断工作年限和领域
  const years = Math.floor(Math.random() * 8) + 3 // 3-10年
  const field = targetPosition || '相关领域'
  
  return template
    .replace('{years}', years)
    .replace('{field}', field)
    .replace('{years}', years) // 可能有多个占位符
    .replace('{field}', field)
}

/**
 * 优化工作经历描述
 */
export async function optimizeWorkExperience(workExperience) {
  await simulateDelay()
  
  const area = workExperience.jobTitle || '业务'
  const responsibilities = mockData.workResponsibilities
    .slice(0, Math.floor(Math.random() * 3) + 3) // 3-5条
    .map(resp => resp.replace('{area}', area))
  
  return responsibilities
}

/**
 * 推荐技能特长
 */
export async function recommendSkills(industry = '', position = '', currentSkills = []) {
  await simulateDelay()
  
  const currentSkillNames = currentSkills.map(skill => skill.name.toLowerCase())
  
  // 根据职位推断技能类别
  let skillCategory = 'frontend'
  if (position.includes('后端') || position.includes('服务端')) {
    skillCategory = 'backend'
  } else if (position.includes('运维') || position.includes('DevOps')) {
    skillCategory = 'devops'
  } else if (position.includes('移动') || position.includes('APP')) {
    skillCategory = 'mobile'
  } else if (position.includes('数据') || position.includes('分析')) {
    skillCategory = 'data'
  }
  
  const technicalSkills = mockData.technicalSkills[skillCategory] || mockData.technicalSkills.frontend
  const softSkills = mockData.softSkills
  const languages = mockData.languages
  
  // 过滤已有技能
  const newTechnical = technicalSkills
    .filter(skill => !currentSkillNames.includes(skill.toLowerCase()))
    .slice(0, 4)
  
  const newSoft = softSkills
    .filter(skill => !currentSkillNames.includes(skill.toLowerCase()))
    .slice(0, 3)
  
  const newLanguages = languages
    .filter(skill => !currentSkillNames.includes(skill.toLowerCase()))
    .slice(0, 2)
  
  return {
    technical: newTechnical,
    soft: newSoft,
    language: newLanguages
  }
}

/**
 * 完善项目经历描述
 */
export async function enhanceProjectDescription(project) {
  await simulateDelay()
  
  const description = project.description || `${project.name}是一个创新的技术项目，采用现代化的技术栈和架构设计，为用户提供优质的服务体验。项目注重性能优化和用户体验，具有良好的扩展性和维护性。`
  
  const highlights = mockData.projectHighlights
    .sort(() => Math.random() - 0.5) // 随机排序
    .slice(0, Math.floor(Math.random() * 3) + 3) // 3-5个亮点
  
  return {
    description,
    highlights
  }
}

/**
 * 生成完整的AI简历（备用服务）
 */
export async function generateCompleteResume(options) {
  await simulateDelay(2000) // 模拟较长的生成时间

  const { career, name, experience, education } = options

  // 职业模板数据
  const careerTemplates = {
    'software-engineer': {
      jobTitle: '高级前端开发工程师',
      company: '字节跳动',
      skills: ['JavaScript', 'Vue.js', 'React', 'Node.js', 'TypeScript', 'Webpack'],
      summary: `具有${experience}年前端开发经验的资深工程师，精通现代前端技术栈，具备良好的编程习惯和团队协作能力。在大型互联网公司有丰富的项目经验，擅长构建高性能、可维护的前端应用。`,
      responsibilities: [
        '负责公司核心产品的前端架构设计和开发工作',
        '主导前端技术选型，建立完善的开发规范和工具链',
        '优化前端性能，提升用户体验，页面加载速度提升40%',
        '指导团队成员技术成长，参与代码审查和技术分享',
        '与产品、设计、后端团队紧密协作，确保项目按时交付'
      ]
    },
    'product-manager': {
      jobTitle: '高级产品经理',
      company: '腾讯',
      skills: ['产品规划', '需求分析', 'Axure', '数据分析', 'SQL', '项目管理'],
      summary: `拥有${experience}年产品管理经验，擅长用户需求分析和产品规划，具备敏锐的市场洞察力和优秀的跨部门协调能力。成功主导多个千万级用户产品的设计和迭代。`,
      responsibilities: [
        '负责核心产品的需求调研、产品规划和功能设计',
        '制定产品发展路线图，推动产品从0到1的完整生命周期',
        '深入分析用户行为数据，持续优化产品功能和体验',
        '协调开发、设计、运营等多个团队，确保产品按时上线',
        '跟踪竞品动态和行业趋势，为产品决策提供数据支持'
      ]
    },
    'ui-designer': {
      jobTitle: '资深UI设计师',
      company: '阿里巴巴',
      skills: ['Figma', 'Sketch', 'Adobe Creative Suite', '原型设计', '用户研究', '设计系统'],
      summary: `具有${experience}年UI/UX设计经验的资深设计师，擅长用户界面设计和交互体验优化，对设计趋势敏感，追求完美的视觉效果。曾参与多个知名产品的设计工作。`,
      responsibilities: [
        '负责产品界面设计和交互原型制作，确保设计的可用性',
        '建立和维护设计系统，保证产品视觉风格的一致性',
        '进行用户研究和可用性测试，持续优化用户体验',
        '与产品经理和开发工程师协作，确保设计方案的落地',
        '参与设计评审和用户体验优化，提升产品整体质量'
      ]
    },
    'marketing-specialist': {
      jobTitle: '数字营销专家',
      company: '美团',
      skills: ['数字营销', 'SEO/SEM', '内容营销', '社交媒体', 'Google Analytics', '品牌推广'],
      summary: `拥有${experience}年数字营销经验，精通多渠道营销和品牌推广，具备敏锐的市场洞察力和创新的营销思维。成功策划多个刷屏级营销活动。`,
      responsibilities: [
        '制定和执行数字营销策略，提升品牌知名度和用户获取',
        '管理多渠道营销活动，包括SEM、信息流、社交媒体等',
        '分析营销数据和用户行为，优化投放策略和转化率',
        '与产品、运营团队协作，制定营销方案和推广计划',
        '监控营销效果和ROI，持续优化营销策略和预算分配'
      ]
    },
    'data-analyst': {
      jobTitle: '数据分析师',
      company: '滴滴出行',
      skills: ['Python', 'SQL', 'Tableau', 'R', '机器学习', '统计分析'],
      summary: `具有${experience}年数据分析经验，精通数据挖掘和统计分析，能够从海量数据中发现业务洞察，为决策提供有力支持。擅长构建数据模型和预测算法。`,
      responsibilities: [
        '收集、清洗和分析业务数据，建立数据分析模型和指标体系',
        '制作数据报表和可视化图表，为业务团队提供数据支持',
        '进行用户行为分析和业务趋势预测，发现增长机会',
        '与业务团队协作，将数据洞察转化为可执行的业务策略',
        '优化数据处理流程，建设自动化数据分析平台'
      ]
    }
  }

  const template = careerTemplates[career] || careerTemplates['software-engineer']

  return {
    personalInfo: {
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@email.com`,
      phone: '138-0000-0000',
      address: '北京市朝阳区'
    },
    summary: template.summary,
    workExperience: [
      {
        jobTitle: template.jobTitle,
        company: template.company,
        location: '北京',
        startDate: '2022-03',
        endDate: '2024-08',
        current: false,
        responsibilities: template.responsibilities
      },
      {
        jobTitle: template.jobTitle.replace('高级', '').replace('资深', ''),
        company: '创新科技有限公司',
        location: '上海',
        startDate: '2020-06',
        endDate: '2022-02',
        current: false,
        responsibilities: template.responsibilities.slice(0, 3)
      }
    ],
    education: [
      {
        degree: '本科',
        major: '计算机科学与技术',
        school: education || '北京理工大学',
        graduationDate: '2020-06',
        gpa: '3.6/4.0'
      }
    ],
    skills: template.skills.map(skill => ({
      name: skill,
      level: '熟练',
      category: '专业技能'
    })),
    projects: [
      {
        name: '企业级管理系统',
        description: '基于Vue.js和Spring Boot开发的企业级管理系统，支持多角色权限管理、数据可视化和实时通信功能。',
        technologies: template.skills.slice(0, 4),
        highlights: [
          '实现了完整的RBAC权限系统',
          '集成了数据可视化组件',
          '采用微服务架构，提升系统可维护性'
        ]
      },
      {
        name: '移动端应用开发',
        description: '开发跨平台移动应用，为用户提供便捷的服务体验，日活跃用户超过10万。',
        technologies: template.skills.slice(2, 6),
        highlights: [
          '优化应用性能，启动速度提升50%',
          '实现离线功能，提升用户体验',
          '集成第三方支付和地图服务'
        ]
      }
    ]
  }
}

/**
 * 检查API可用性
 */
export async function checkAPIAvailability() {
  await simulateDelay(500)
  // 模拟API检查，总是返回false表示使用模拟数据
  return false
}

/**
 * 模拟API延迟
 */
function simulateDelay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
