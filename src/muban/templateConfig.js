/**
 * 简历模板配置文件
 * 定义所有可用的简历模板及其基本信息
 */

export const TEMPLATE_CATEGORIES = {
  MODERN: 'modern',
  CLASSIC: 'classic',
  CREATIVE: 'creative',
  MINIMALIST: 'minimalist',
  PROFESSIONAL: 'professional',
  ACADEMIC: 'academic',
  TECH: 'tech'
}

export const TEMPLATE_CONFIGS = {
  [TEMPLATE_CATEGORIES.MODERN]: {
    id: 'modern',
    name: '现代风格',
    description: '简洁现代的设计，适合互联网和科技行业',
    category: 'modern',
    thumbnail: '/templates/thumbnails/modern.png',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      text: '#1e293b',
      background: '#ffffff'
    },
    features: ['双栏布局', '渐变色彩', '现代字体', '图标装饰'],
    suitableFor: ['软件工程师', '产品经理', '设计师', '市场营销'],
    component: () => import('./templates/ModernTemplate.vue')
  },

  [TEMPLATE_CATEGORIES.CLASSIC]: {
    id: 'classic',
    name: '经典风格',
    description: '传统商务风格，适合金融、咨询等传统行业',
    category: 'classic',
    thumbnail: '/templates/thumbnails/classic.png',
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#374151',
      text: '#111827',
      background: '#ffffff'
    },
    features: ['单栏布局', '经典配色', '正式字体', '简洁线条'],
    suitableFor: ['金融分析师', '咨询顾问', '律师', '会计师'],
    component: () => import('./templates/ClassicTemplate.vue')
  },

  [TEMPLATE_CATEGORIES.CREATIVE]: {
    id: 'creative',
    name: '创意风格',
    description: '富有创意的设计，适合设计师和创意工作者',
    category: 'creative',
    thumbnail: '/templates/thumbnails/creative.png',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#ec4899',
      text: '#1f2937',
      background: '#fafafa'
    },
    features: ['创意布局', '多彩配色', '艺术字体', '装饰元素'],
    suitableFor: ['UI设计师', '平面设计师', '创意总监', '艺术家'],
    component: () => import('./templates/CreativeTemplate.vue')
  },

  [TEMPLATE_CATEGORIES.MINIMALIST]: {
    id: 'minimalist',
    name: '极简风格',
    description: '极简主义设计，突出内容本身',
    category: 'minimalist',
    thumbnail: '/templates/thumbnails/minimalist.png',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      text: '#000000',
      background: '#ffffff'
    },
    features: ['极简布局', '黑白配色', '简洁字体', '留白设计'],
    suitableFor: ['建筑师', '摄影师', '作家', '研究员'],
    component: () => import('./templates/MinimalistTemplate.vue')
  },

  [TEMPLATE_CATEGORIES.PROFESSIONAL]: {
    id: 'professional',
    name: '专业风格',
    description: '专业商务风格，适合管理和商务岗位',
    category: 'professional',
    thumbnail: '/templates/thumbnails/professional.png',
    colors: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#1e40af',
      text: '#0f172a',
      background: '#ffffff'
    },
    features: ['专业布局', '商务配色', '正式字体', '结构清晰'],
    suitableFor: ['项目经理', '销售经理', '运营总监', '商务拓展'],
    component: () => import('./templates/ProfessionalTemplate.vue')
  },

  [TEMPLATE_CATEGORIES.ACADEMIC]: {
    id: 'academic',
    name: '学术风格',
    description: '学术研究风格，适合教育和研究领域',
    category: 'academic',
    thumbnail: '/templates/thumbnails/academic.png',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#0ea5e9',
      text: '#1e293b',
      background: '#ffffff'
    },
    features: ['学术布局', '严谨配色', '学术字体', '详细信息'],
    suitableFor: ['教授', '研究员', '博士生', '学者'],
    component: () => import('./templates/AcademicTemplate.vue')
  },

  [TEMPLATE_CATEGORIES.TECH]: {
    id: 'tech',
    name: '技术风格',
    description: '技术导向设计，适合程序员和技术专家',
    category: 'tech',
    thumbnail: '/templates/thumbnails/tech.png',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#10b981',
      text: '#111827',
      background: '#f9fafb'
    },
    features: ['技术布局', '代码配色', '等宽字体', '技能突出'],
    suitableFor: ['软件工程师', '系统架构师', 'DevOps工程师', '技术专家'],
    component: () => import('./templates/TechTemplate.vue')
  }
}

/**
 * 获取所有模板配置
 */
export function getAllTemplates() {
  return Object.values(TEMPLATE_CONFIGS)
}

/**
 * 根据ID获取模板配置
 */
export function getTemplateById(id) {
  return TEMPLATE_CONFIGS[id]
}

/**
 * 根据类别获取模板
 */
export function getTemplatesByCategory(category) {
  return Object.values(TEMPLATE_CONFIGS).filter(template => 
    template.category === category
  )
}

/**
 * 获取推荐模板（根据职业）
 */
export function getRecommendedTemplates(career) {
  return Object.values(TEMPLATE_CONFIGS).filter(template =>
    template.suitableFor.some(job => 
      job.toLowerCase().includes(career.toLowerCase()) ||
      career.toLowerCase().includes(job.toLowerCase())
    )
  )
}

/**
 * 模板默认设置
 */
export const DEFAULT_TEMPLATE_SETTINGS = {
  fontSize: 14,
  lineHeight: 1.5,
  margin: 20,
  showPhoto: true,
  showIcons: true,
  colorScheme: 'default'
}

/**
 * PDF导出设置
 */
export const PDF_EXPORT_SETTINGS = {
  margin: 10,
  filename: 'resume.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { 
    scale: 2,
    useCORS: true,
    letterRendering: true
  },
  jsPDF: { 
    unit: 'mm', 
    format: 'a4', 
    orientation: 'portrait' 
  }
}
