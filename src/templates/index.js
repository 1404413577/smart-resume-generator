import { markRaw } from 'vue'
import UnifiedResumeTemplate from './components/UnifiedResumeTemplate.vue'
export { templateCategories } from './templateCategories'

const UnifiedTemplate = markRaw(UnifiedResumeTemplate)

export const templateRegistry = {
  modern: {
    name: '现代单栏',
    component: UnifiedTemplate,
    description: '清晰克制的单栏职场模板，适合多数互联网、产品和运营岗位',
    category: 'professional',
    preview: '/images/templates/modern-preview.png',
    features: ['统一实时预览', '头像位置可控', '章节排序可控', '设计面板实时生效'],
    suitableFor: ['互联网', '产品经理', '运营', '通用岗位']
  },
  classic: {
    name: '经典单栏',
    component: UnifiedTemplate,
    description: '传统单栏结构，强调阅读稳定性和 ATS 友好',
    category: 'traditional',
    preview: '/images/templates/classic-preview.png',
    features: ['ATS友好', '单栏排版', '高可读性', '章节顺序可控'],
    suitableFor: ['传统行业', '校招', '行政', '通用岗位']
  },
  compact: {
    name: '紧凑高密度',
    component: UnifiedTemplate,
    description: '压缩间距的信息密集模板，适合内容较多的一页简历',
    category: 'minimalist',
    preview: '/images/templates/minimalist-preview.png',
    features: ['信息密度高', '留白克制', '导出友好', '实时样式控制'],
    suitableFor: ['技术岗', '项目经历丰富', '一页简历']
  },
  sidebar: {
    name: '重点单栏',
    component: UnifiedTemplate,
    description: '强调关键模块的单栏布局，适合突出技能、项目和核心成果',
    category: 'professional',
    preview: '/images/templates/modern-preview.png',
    features: ['单栏结构', '技能突出', '头像位置实时移动', '主题色实时响应'],
    suitableFor: ['工程师', '设计师', '产品经理']
  },
  executive: {
    name: '高管商务',
    component: UnifiedTemplate,
    description: '顶部深色商务栏，适合管理岗位和高级职位',
    category: 'business',
    preview: '/images/templates/executive-preview.png',
    features: ['商务页眉', '成果导向', '正式稳重', '实时设计控制'],
    suitableFor: ['管理岗', '总监', '咨询顾问']
  },
  creative: {
    name: '创意强调',
    component: UnifiedTemplate,
    description: '更强的强调色和视觉节奏，适合创意和品牌相关岗位',
    category: 'creative',
    preview: '/images/templates/designer-preview.png',
    features: ['强调色标题', '视觉节奏强', '章节可拖拽排序', '头像实时控制'],
    suitableFor: ['设计', '新媒体', '品牌', '市场']
  },
  academic: {
    name: '学术简洁',
    component: UnifiedTemplate,
    description: '克制的学术排版，突出教育、项目和研究经历',
    category: 'academic',
    preview: '/images/templates/academic-preview.png',
    features: ['克制排版', '教育经历突出', '文本友好', '样式实时生效'],
    suitableFor: ['教师', '研究人员', '学生', '教育行业']
  },
  technical: {
    name: '技术项目',
    component: UnifiedTemplate,
    description: '项目和技能导向的技术模板，适合研发与工程岗位',
    category: 'tech',
    preview: '/images/templates/tech-preview.png',
    features: ['项目突出', '技能标签', '单栏排版', '统一实时预览'],
    suitableFor: ['前端', '后端', '全栈', '算法', '工程师']
  }
}

export function getAllTemplates() {
  return Object.entries(templateRegistry).map(([id, template]) => ({
    id,
    ...template
  }))
}

export function getTemplatesByCategory(category) {
  return getAllTemplates().filter(template => template.category === category)
}

export const getTemplateById = (templateId) => templateRegistry[templateId] || templateRegistry.modern

export function getTemplate(templateId) {
  return templateRegistry[templateId] || templateRegistry.modern
}
