// 模板注册和配置
import ModernTemplate from './components/ModernTemplate.vue'
import ClassicTemplate from './components/ClassicTemplate.vue'
import CreativeTemplate from './components/CreativeTemplate.vue'
import ProfessionalTemplate from './components/ProfessionalTemplate.vue'
import AcademicTemplate from './components/AcademicTemplate.vue'
import TechTemplate from './components/TechTemplate.vue'
import MinimalistTemplate from './components/MinimalistTemplate.vue'

// 模板注册表
export const templateRegistry = {
  modern: {
    name: 'Modern',
    component: ModernTemplate,
    description: '现代简洁风格，适合互联网行业',
    category: 'professional',
    preview: '/images/templates/modern-preview.png'
  },
  classic: {
    name: 'Classic',
    component: ClassicTemplate,
    description: '经典传统风格，适合传统行业',
    category: 'traditional',
    preview: '/images/templates/classic-preview.png'
  },
  creative: {
    name: 'Creative',
    component: CreativeTemplate,
    description: '创意设计风格，适合设计师和创意工作者',
    category: 'creative',
    preview: '/images/templates/creative-preview.png'
  },
  professional: {
    name: 'Professional',
    component: ProfessionalTemplate,
    description: '专业商务风格，适合商务和管理岗位',
    category: 'professional',
    preview: '/images/templates/professional-preview.png'
  },
  academic: {
    name: 'Academic',
    component: AcademicTemplate,
    description: '学术研究风格，适合学术和研究岗位',
    category: 'academic',
    preview: '/images/templates/academic-preview.png'
  },
  tech: {
    name: 'Tech',
    component: TechTemplate,
    description: '技术代码风格，适合程序员和技术岗位',
    category: 'tech',
    preview: '/images/templates/tech-preview.png'
  },
  minimalist: {
    name: 'Minimalist',
    component: MinimalistTemplate,
    description: '极简主义风格，突出内容本身',
    category: 'minimalist',
    preview: '/images/templates/minimalist-preview.png'
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
