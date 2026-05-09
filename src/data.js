// 默认简历数据填充
export const defaultResumeData = {
  personalInfo: {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    address: '北京市朝阳区',
    website: 'https://zhangsan.dev',
    linkedin: 'https://linkedin.com/in/zhangsan',
    github: 'https://github.com/zhangsan',
    targetPosition: '前端开发工程师',
    photo: '', // 头像base64数据，可留空
    photoPosition: 'left',
    customFields: [] // 自定义字段数组
  },
  summary: '一名富有激情的前端开发工程师，拥有5年以上的Web开发经验。精通现代前端技术栈，包括Vue.js、React.js、TypeScript等。注重用户体验和代码质量，善于解决复杂的技术问题。',
  workExperience: [
    {
      id: 'exp-1',
      company: 'ABC科技有限公司',
      position: '高级前端开发工程师',
      startDate: '2022-01-01',
      endDate: '2024-12-31',
      location: '北京市',
      description: '负责公司主要产品的前端开发和维护，领导一个3人前端团队。',
      achievements: [
        '重构了公司核心产品的前端架构，提升了30%的性能',
        '引入TypeScript，提高了代码质量和开发效率',
        '指导初级开发者，提升团队整体技术水平'
      ]
    },
    {
      id: 'exp-2',
      company: 'XYZ互联网公司',
      position: '前端开发工程师',
      startDate: '2020-03-01',
      endDate: '2021-12-31',
      location: '上海市',
      description: '参与多个大型Web项目的开发，负责前端功能实现和用户界面设计。',
      achievements: [
        '开发了公司移动端H5项目，日活跃用户超过10万',
        '优化页面加载性能，减少了40%的加载时间',
        '与设计师合作，提升了用户界面的可用性'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: '清华大学',
      degree: '硕士',
      major: '计算机科学与技术',
      startDate: '2018-09-01',
      endDate: '2020-06-30',
      gpa: '3.8',
      honors: '优秀毕业生、一等奖学金'
    }
  ],
  skills: [
    { id: 'skill-1', name: 'JavaScript', level: '专家', category: '编程语言' },
    { id: 'skill-2', name: 'TypeScript', level: '高级', category: '编程语言' },
    { id: 'skill-3', name: 'Vue.js', level: '专家', category: '前端框架' },
    { id: 'skill-4', name: 'React.js', level: '高级', category: '前端框架' },
    { id: 'skill-5', name: 'Node.js', level: '中级', category: '后端技术' },
    { id: 'skill-6', name: 'Python', level: '中级', category: '编程语言' },
    { id: 'skill-7', name: 'HTML/CSS', level: '专家', category: '前端基础' },
    { id: 'skill-8', name: 'Git', level: '高级', category: '工具' }
  ],
  projects: [
    {
      id: 'proj-1',
      name: '电商平台前端重构',
      role: '前端负责人',
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      description: '领导团队对公司电商平台进行前端重构，使用Vue 3和TypeScript重写核心模块，提升了用户体验和开发效率。',
      technologies: ['Vue.js', 'TypeScript', 'Vite', 'Pinia', 'Element Plus'],
      url: 'https://example.com/project',
      github: 'https://github.com/zhangsan/ecommerce-refactor'
    }
  ],
  certifications: [
    { id: 'cert-1', name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: '2023-05-15', url: '' },
    { id: 'cert-2', name: 'Vue.js认证开发者', issuer: 'Vue.js官方', date: '2022-08-20', url: '' }
  ],
  languages: [
    { id: 'lang-1', name: '中文', proficiency: '母语', level: '精通' },
    { id: 'lang-2', name: '英语', proficiency: '工作熟练', level: '高级' },
    { id: 'lang-3', name: '日语', proficiency: '基础', level: '初级' }
  ],
  customModulesData: {} // 自定义模块数据，可根据需要添加
}

// 导出默认数据填充函数
export const fillWithDefaultData = (resumeStore) => {
  if (resumeStore && resumeStore.resumeData) {
    // 深拷贝默认数据以避免引用问题
    const defaultData = JSON.parse(JSON.stringify(defaultResumeData))
    Object.assign(resumeStore.resumeData, defaultData)
  }
}

// 如果需要在浏览器环境中直接使用
if (typeof window !== 'undefined') {
  window.defaultResumeData = defaultResumeData
  window.fillWithDefaultData = fillWithDefaultData
}
