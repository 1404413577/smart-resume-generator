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
