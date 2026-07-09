import { markRaw } from 'vue'
import ModernTemplate from './components/ModernTemplate.vue'
import ClassicTemplate from './components/ClassicTemplate.vue'
import CompactTemplate from './components/CompactTemplate.vue'
import SidebarTemplate from './components/SidebarTemplate.vue'
import ExecutiveTemplate from './components/ExecutiveTemplate.vue'
import CreativeTemplate from './components/CreativeTemplate.vue'
import AcademicTemplate from './components/AcademicTemplate.vue'
import TechnicalTemplate from './components/TechnicalTemplate.vue'
import AtsCleanTemplate from './components/AtsCleanTemplate.vue'
import ProjectLedgerTemplate from './components/ProjectLedgerTemplate.vue'
import TimelineTemplate from './components/TimelineTemplate.vue'
import MetroTemplate from './components/MetroTemplate.vue'
import EditorialTemplate from './components/EditorialTemplate.vue'
import FlowTemplate from './components/FlowTemplate.vue'
import PortfolioTemplate from './components/PortfolioTemplate.vue'
import PortraitColumnTemplate from './components/PortraitColumnTemplate.vue'
export { templateCategories } from './templateCategories'

const templates = {
  modern: markRaw(ModernTemplate),
  classic: markRaw(ClassicTemplate),
  compact: markRaw(CompactTemplate),
  sidebar: markRaw(SidebarTemplate),
  executive: markRaw(ExecutiveTemplate),
  creative: markRaw(CreativeTemplate),
  academic: markRaw(AcademicTemplate),
  technical: markRaw(TechnicalTemplate),
  'ats-clean': markRaw(AtsCleanTemplate),
  'project-ledger': markRaw(ProjectLedgerTemplate),
  timeline: markRaw(TimelineTemplate),
  metro: markRaw(MetroTemplate),
  editorial: markRaw(EditorialTemplate),
  flow: markRaw(FlowTemplate),
  portfolio: markRaw(PortfolioTemplate),
  'portrait-column': markRaw(PortraitColumnTemplate)
}

export const templateRegistry = {
  modern: {
    name: '现代单栏',
    component: templates.modern,
    description: '清晰克制的单栏职场模板，适合多数互联网、产品和运营岗位',
    category: 'professional',
    preview: '/images/templates/modern-preview.png',
    features: ['统一实时预览', '头像位置可控', '章节排序可控', '设计面板实时生效'],
    suitableFor: ['互联网', '产品经理', '运营', '通用岗位']
  },
  classic: {
    name: '经典单栏',
    component: templates.classic,
    description: '传统单栏结构，强调阅读稳定性和 ATS 友好',
    category: 'traditional',
    preview: '/images/templates/classic-preview.png',
    features: ['ATS友好', '单栏排版', '高可读性', '章节顺序可控'],
    suitableFor: ['传统行业', '校招', '行政', '通用岗位']
  },
  compact: {
    name: '紧凑高密度',
    component: templates.compact,
    description: '压缩间距的信息密集模板，适合内容较多的一页简历',
    category: 'minimalist',
    preview: '/images/templates/minimalist-preview.png',
    features: ['信息密度高', '留白克制', '导出友好', '实时样式控制'],
    suitableFor: ['技术岗', '项目经历丰富', '一页简历']
  },
  sidebar: {
    name: '重点单栏',
    component: templates.sidebar,
    description: '强调关键模块的单栏布局，适合突出技能、项目和核心成果',
    category: 'professional',
    preview: '/images/templates/modern-preview.png',
    features: ['单栏结构', '技能突出', '头像位置实时移动', '主题色实时响应'],
    suitableFor: ['工程师', '设计师', '产品经理']
  },
  executive: {
    name: '高管商务',
    component: templates.executive,
    description: '顶部深色商务栏，适合管理岗位和高级职位',
    category: 'business',
    preview: '/images/templates/executive-preview.png',
    features: ['商务页眉', '成果导向', '正式稳重', '实时设计控制'],
    suitableFor: ['管理岗', '总监', '咨询顾问']
  },
  creative: {
    name: '创意强调',
    component: templates.creative,
    description: '更强的强调色和视觉节奏，适合创意和品牌相关岗位',
    category: 'creative',
    preview: '/images/templates/designer-preview.png',
    features: ['强调色标题', '视觉节奏强', '章节可拖拽排序', '头像实时控制'],
    suitableFor: ['设计', '新媒体', '品牌', '市场']
  },
  academic: {
    name: '学术简洁',
    component: templates.academic,
    description: '克制的学术排版，突出教育、项目和研究经历',
    category: 'academic',
    preview: '/images/templates/academic-preview.png',
    features: ['克制排版', '教育经历突出', '文本友好', '样式实时生效'],
    suitableFor: ['教师', '研究人员', '学生', '教育行业']
  },
  technical: {
    name: '技术项目',
    component: templates.technical,
    description: '项目和技能导向的技术模板，适合研发与工程岗位',
    category: 'tech',
    preview: '/images/templates/tech-preview.png',
    features: ['项目突出', '技能标签', '单栏排版', '统一实时预览'],
    suitableFor: ['前端', '后端', '全栈', '算法', '工程师']
  },
  'ats-clean': {
    name: '清单极简',
    component: templates['ats-clean'],
    description: '黑白单栏，适合 ATS 和正式投递',
    category: 'minimalist',
    preview: '/images/templates/minimalist-preview.png',
    features: ['ATS友好', '黑白排版', '正文优先', '打印稳定'],
    suitableFor: ['校招', '行政', '财务', '通用岗位']
  },
  'project-ledger': {
    name: '项目条目',
    component: templates['project-ledger'],
    description: '项目和成果优先，适合技术岗位',
    category: 'tech',
    preview: '/images/templates/tech-preview.png',
    features: ['项目突出', '成果扫读', '技能标签', '经历清晰'],
    suitableFor: ['前端', '后端', '全栈', '工程师']
  },
  timeline: {
    name: '时间轴',
    component: templates.timeline,
    description: '时间轴成果优先模板，适合突出经历脉络和关键产出',
    category: 'professional',
    preview: '/images/templates/timeline-preview.png',
    fixedLayout: true,
    features: ['时间轴经历', '成果扫读', '紧凑页眉', '打印稳定'],
    suitableFor: ['产品经理', '项目经理', '运营', '咨询顾问']
  },
  metro: {
    name: '都会版',
    component: templates.metro,
    description: '顶部强页眉与侧栏信息区，适合成熟职场简历',
    category: 'business',
    preview: '/images/templates/metro-preview.png',
    fixedLayout: true,
    features: ['固定双栏', '强页眉', '技能侧栏', '打印稳定'],
    suitableFor: ['管理岗', '产品经理', '运营', '咨询顾问']
  },
  editorial: {
    name: '编辑版',
    component: templates.editorial,
    description: '编辑排版结构，适合内容叙事和项目成果展示',
    category: 'creative',
    preview: '/images/templates/editorial-preview.png',
    fixedLayout: true,
    features: ['固定分栏', '叙事排版', '项目突出', '打印稳定'],
    suitableFor: ['品牌', '设计', '市场', '咨询顾问']
  },
  flow: {
    name: '流线版',
    component: templates.flow,
    description: '自由设计模板，线性节奏清晰，适合多数职场简历',
    category: 'professional',
    preview: '/images/templates/flow-preview.png',
    fixedLayout: false,
    features: ['自由版式', '标题可调', '密度可调', '实时样式控制'],
    suitableFor: ['互联网', '产品经理', '运营', '通用岗位']
  },
  portfolio: {
    name: '作品集',
    component: templates.portfolio,
    description: '自由设计模板，突出项目模块和视觉节奏',
    category: 'creative',
    preview: '/images/templates/portfolio-preview.png',
    fixedLayout: false,
    features: ['自由版式', '项目网格', '强调色强', '实时样式控制'],
    suitableFor: ['设计', '品牌', '市场', '新媒体']
  },
  'portrait-column': {
    name: '头像栏',
    component: templates['portrait-column'],
    description: '头像自适应固定模板，有无头像均保持版式完整',
    category: 'business',
    preview: '/images/templates/portrait-column-preview.png',
    fixedLayout: true,
    features: ['头像自适应', '固定双栏', '信息侧栏', '打印稳定'],
    suitableFor: ['管理岗', '销售', '顾问', '通用岗位']
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
