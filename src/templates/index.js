// 模板注册和配置
import ModernTemplate from './components/ModernTemplate.vue'
import ClassicTemplate from './components/ClassicTemplate.vue'
import CreativeTemplate from './components/CreativeTemplate.vue'
import ProfessionalTemplate from './components/ProfessionalTemplate.vue'
import AcademicTemplate from './components/AcademicTemplate.vue'
import TechTemplate from './components/TechTemplate.vue'
import MinimalistTemplate from './components/MinimalistTemplate.vue'
import MultiPageTemplate from './components/MultiPageTemplate.vue'
import ExecutiveTemplate from './components/ExecutiveTemplate.vue'
import DesignerTemplate from './components/DesignerTemplate.vue'
import SalesTemplate from './components/SalesTemplate.vue'
import StartupTemplate from './components/StartupTemplate.vue'

// 模板注册表
export const templateRegistry = {
  modern: {
    name: 'Modern',
    component: ModernTemplate,
    description: '现代简洁风格，适合互联网行业',
    category: 'professional',
    preview: '/images/templates/modern-preview.png',
    features: ['响应式设计', '简洁布局', '专业配色'],
    suitableFor: ['互联网', '科技', '创业公司']
  },
  classic: {
    name: 'Classic',
    component: ClassicTemplate,
    description: '经典传统风格，适合传统行业',
    category: 'traditional',
    preview: '/images/templates/classic-preview.png',
    features: ['传统布局', '正式风格', '清晰结构'],
    suitableFor: ['传统行业', '政府机构', '教育行业']
  },
  creative: {
    name: 'Creative',
    component: CreativeTemplate,
    description: '创意设计风格，适合设计师和创意工作者',
    category: 'creative',
    preview: '/images/templates/creative-preview.png',
    features: ['创意设计', '色彩丰富', '个性化布局'],
    suitableFor: ['设计师', '创意工作者', '艺术家']
  },
  professional: {
    name: 'Professional',
    component: ProfessionalTemplate,
    description: '专业商务风格，适合商务和管理岗位',
    category: 'professional',
    preview: '/images/templates/professional-preview.png',
    features: ['商务风格', '专业布局', '高端设计'],
    suitableFor: ['管理岗位', '商务人士', '高级职位']
  },
  academic: {
    name: 'Academic',
    component: AcademicTemplate,
    description: '学术研究风格，适合学术和研究岗位',
    category: 'academic',
    preview: '/images/templates/academic-preview.png',
    features: ['学术格式', '研究导向', '详细信息'],
    suitableFor: ['学者', '研究人员', '博士生']
  },
  tech: {
    name: 'Tech',
    component: TechTemplate,
    description: '技术代码风格，适合程序员和技术岗位',
    category: 'tech',
    preview: '/images/templates/tech-preview.png',
    features: ['技术导向', '代码风格', '项目突出'],
    suitableFor: ['程序员', '技术人员', 'IT工程师']
  },
  minimalist: {
    name: 'Minimalist',
    component: MinimalistTemplate,
    description: '极简主义风格，突出内容本身',
    category: 'minimalist',
    preview: '/images/templates/minimalist-preview.png',
    features: ['极简设计', '内容导向', '清爽布局'],
    suitableFor: ['所有行业', '注重内容', '简约风格']
  },

  multipage: {
    name: 'MultiPage Engineering',
    component: MultiPageTemplate,
    description: '工科专业多页简历，适合技术内容丰富的求职者',
    category: 'engineering',
    preview: '/images/templates/multipage-preview.png',
    features: ['多页布局', '智能分页', '技术导向', '内容完整'],
    suitableFor: ['工程师', '研究员', '技术专家', '博士生'],
    isMultiPage: true,
    defaultPageSettings: {
      pageCount: 2,
      pagingMode: 'auto',
      showPageNumbers: true,
      pageBreaks: []
    }
  },

  executive: {
    name: 'Executive Business',
    component: ExecutiveTemplate,
    description: '高管商务风格，突出领导经验和战略成果',
    category: 'business',
    preview: '/images/templates/executive-preview.png',
    features: ['权威设计', '深色主题', '领导导向', '成果突出'],
    suitableFor: ['高级管理', 'CEO/CTO', '总监级别', '企业高管']
  },

  designer: {
    name: 'Creative Designer',
    component: DesignerTemplate,
    description: '设计师作品集风格，展示创意能力和视觉作品',
    category: 'creative',
    preview: '/images/templates/designer-preview.png',
    features: ['创意布局', '渐变配色', '作品展示', '视觉冲击'],
    suitableFor: ['UI/UX设计师', '平面设计师', '创意总监', '视觉设计师']
  },

  sales: {
    name: 'Sales Performance',
    component: SalesTemplate,
    description: '销售业绩导向，突出数据成果和客户成功',
    category: 'sales',
    preview: '/images/templates/sales-preview.png',
    features: ['业绩导向', '动态设计', '数据突出', '成果展示'],
    suitableFor: ['销售经理', '业务代表', '客户经理', '销售总监']
  },

  startup: {
    name: 'Startup Innovation',
    component: StartupTemplate,
    description: '创业公司风格，展现创新思维和产品能力',
    category: 'startup',
    preview: '/images/templates/startup-preview.png',
    features: ['年轻活力', '创新设计', '产品导向', '技术前沿'],
    suitableFor: ['产品经理', '创业者', '互联网从业者', '技术创新者']
  }
}

// 获取所有模板
export function getAllTemplates() {
  return Object.entries(templateRegistry).map(([key, template]) => ({
    id: key,
    ...template
  }))
}

// 根据分类获取模板
export function getTemplatesByCategory(category) {
  return getAllTemplates().filter(template => template.category === category)
}

// 兼容旧的函数名
export const getTemplateById = getTemplate

// 获取单个模板
export function getTemplate(templateId) {
  return templateRegistry[templateId]
}

// 模板分类
export const templateCategories = {
  professional: '专业商务',
  creative: '创意设计',
  traditional: '传统经典',
  academic: '学术研究',
  tech: '技术开发',
  minimalist: '极简主义'
}
