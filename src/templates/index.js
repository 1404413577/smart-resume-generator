// 模板注册和配置
import { defineAsyncComponent } from 'vue'

// 使用 Vite 的 import.meta.glob 自动发现 components 目录下的所有 .vue 模板
const templateComponents = import.meta.glob('./components/*.vue')
const templateConfigs = import.meta.glob('./configs/*.json', { eager: true })

import SchemaRenderer from './engine/SchemaRenderer.vue'

/**
 * 辅助函数：根据文件名寻找对应的异步组件
 * 约定：注册表中的 key (如 'modern') 对应文件名 'ModernTemplate.vue'
 */
const getAsyncComponent = (key) => {
  const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1)
  
  const patterns = [
    `./components/${capitalizedKey}Template.vue`,
    `./components/${capitalizedKey}.vue`,
    // 针对特殊命名的显式映射
    key === 'detailed' ? './components/DetailedSkillTemplate.vue' : null,
    key === 'tech' ? './components/TechTemplate.vue' : null,
    key === 'notion1' ? './components/NotionTemplate1.vue' : null,
    key === 'standardClean' ? './components/StandardCleanTemplate.vue' : null,
    key === 'gridForm' ? './components/GridFormTemplate.vue' : null,
    key === 'gitProfile' ? './components/GitProfileTemplate.vue' : null,
    key === 'artisticPortfolio' ? './components/ArtisticPortfolioTemplate.vue' : null,
    key === 'corporateExecutive' ? './components/CorporateExecutiveTemplate.vue' : null,
    key === 'multipage' ? './components/MultiPageTemplate.vue' : null,
    key === 'executive' ? './components/ExecutiveTemplate.vue' : null,
    key === 'designer' ? './components/DesignerTemplate.vue' : null,
    key === 'sales' ? './components/SalesTemplate.vue' : null,
    key === 'startup' ? './components/StartupTemplate.vue' : null,
    key === 'elegant' ? './components/ElegantTemplate.vue' : null,
    key === 'timeline' ? './components/TimelineTemplate.vue' : null,
    key === 'finance' ? './components/FinanceTemplate.vue' : null,
    key === 'education' ? './components/EducationTemplate.vue' : null,
    key === 'marketing' ? './components/MarketingTemplate.vue' : null,
    key === 'developer' ? './components/DeveloperTemplate.vue' : null,
  ].filter(Boolean)

  for (const path of patterns) {
    if (templateComponents[path]) {
      return defineAsyncComponent(templateComponents[path])
    }
  }

  console.error(`[TemplateRegistry] 未能为 "${key}" 找到匹配的组件文件。`)
  return null
}

// 模板注册表
export const templateRegistry = {
  modern: {
    name: 'Modern',
    component: getAsyncComponent('modern'),
    description: '现代简洁风格，适合互联网行业',
    category: 'professional',
    preview: '/images/templates/modern-preview.png',
    features: ['响应式设计', '简洁布局', '专业配色'],
    suitableFor: ['互联网', '科技', '创业公司']
  },
  classic: {
    name: 'Classic',
    component: getAsyncComponent('classic'),
    description: '近典传统风格，适合传统行业',
    category: 'traditional',
    preview: '/images/templates/classic-preview.png',
    features: ['传统布局', '正式风格', '清晰结构'],
    suitableFor: ['传统行业', '政府机构', '教育行业']
  },
  creative: {
    name: 'Creative',
    component: getAsyncComponent('creative'),
    description: '创意设计风格，适合设计师 and 创意工作者',
    category: 'creative',
    preview: '/images/templates/creative-preview.png',
    features: ['创意设计', '色彩丰富', '个性化布局'],
    suitableFor: ['设计师', '创意工作者', '艺术家']
  },
  professional: {
    name: 'Professional',
    component: getAsyncComponent('professional'),
    description: '专业商务风格，适合商务和管理岗位',
    category: 'professional',
    preview: '/images/templates/professional-preview.png',
    features: ['商务风格', '专业布局', '高端设计'],
    suitableFor: ['管理岗位', '商务人士', '高级职位']
  },
  academic: {
    name: 'Academic',
    component: getAsyncComponent('academic'),
    description: '学术研究风格，适合学术和研究岗位',
    category: 'academic',
    preview: '/images/templates/academic-preview.png',
    features: ['学术格式', '研究导向', '详细信息'],
    suitableFor: ['学者', '研究人员', '博士生']
  },
  tech: {
    name: 'Silicon Valley / Clean Tech',
    component: getAsyncComponent('tech'),
    description: '硅谷前沿技术风格，极简代码符排版',
    category: 'tech',
    preview: '/images/templates/tech-preview.png',
    features: ['技术导向', '极简主义', '项目突出', 'Mono排版'],
    suitableFor: ['全栈开发', '资深研发', '架构师']
  },
  minimalist: {
    name: 'Minimalist',
    component: getAsyncComponent('minimalist'),
    description: '极简主义风格，突出内容本身',
    category: 'minimalist',
    preview: '/images/templates/minimalist-preview.png',
    features: ['极简设计', '内容导向', '清爽布局'],
    suitableFor: ['所有行业', '注重内容', '简约风格']
  },
  multipage: {
    name: 'MultiPage Engineering',
    component: getAsyncComponent('multipage'),
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
    component: getAsyncComponent('executive'),
    description: '高管商务风格，突出领导经验和战略成果',
    category: 'business',
    preview: '/images/templates/executive-preview.png',
    features: ['权威设计', '深色主题', '领导导向', '成果突出'],
    suitableFor: ['高级管理', 'CEO/CTO', '总监级别', '企业高管']
  },
  designer: {
    name: 'Creative Designer',
    component: getAsyncComponent('designer'),
    description: '设计师作品集风格，展示创意能力和视觉作品',
    category: 'creative',
    preview: '/images/templates/designer-preview.png',
    features: ['创意布局', '渐变配色', '作品展示', '视觉冲击'],
    suitableFor: ['UI/UX设计师', '平面设计师', '创意总监', '视觉设计师']
  },
  sales: {
    name: 'Sales Performance',
    component: getAsyncComponent('sales'),
    description: '销售业绩导向，突出数据成果和客户成功',
    category: 'sales',
    preview: '/images/templates/sales-preview.png',
    features: ['业绩导向', '动态设计', '数据突出', '成果展示'],
    suitableFor: ['销售经理', '业务代表', '客户经理', '销售总监']
  },
  startup: {
    name: 'Startup Innovation',
    component: getAsyncComponent('startup'),
    description: '创业公司风格，展现创新思维和产品能力',
    category: 'startup',
    preview: '/images/templates/startup-preview.png',
    features: ['年轻活力', '创新设计', '产品导向', '技术前沿'],
    suitableFor: ['产品经理', '创业者', '互联网从业者', '技术创新者']
  },
  elegant: {
    name: 'Elegant / Graceful',
    component: getAsyncComponent('elegant'),
    description: '优雅极简风格，设计感极强，提供舒适的阅读体验和高级感。',
    category: 'creative',
    preview: '/images/templates/elegant-preview.png',
    features: ['优雅排版', '古典气质', '高级感', '大量留白'],
    suitableFor: ['艺术家', '设计总监', '策展人', '文管运营']
  },
  timeline: {
    name: 'Timeline / Tech',
    component: getAsyncComponent('timeline'),
    description: '现代时间轴设计，清晰展现职业生涯发展路径。',
    category: 'tech',
    preview: '/images/templates/timeline-preview.png',
    features: ['时间轴', '动感现代', '结构化突出', '清晰导向'],
    suitableFor: ['高级工程师', '产品专家', '项目经理', '资深专家']
  },
  detailed: {
    name: 'Detailed Tech / Skills',
    component: getAsyncComponent('detailed'),
    description: '专业技能详细描述模板，适合拥有丰富技术栈需要长文案罗列的求职者。',
    category: 'tech',
    preview: '/images/templates/detailed-preview.png',
    features: ['长句排版', '详尽技能', '列表式结构', '专业化'],
    suitableFor: ['全栈开发', '前后端开发工程师', '资深技术岗']
  },
  finance: {
    name: 'Finance / Investment',
    component: getAsyncComponent('finance'),
    description: '金融投行风格，排版严谨，强调数据对齐和专业感',
    category: 'finance',
    preview: '/images/templates/finance-preview.png',
    features: ['严谨排版', '数据导向', '经典色系', '权威专业'],
    suitableFor: ['金融分析师', '投行经理', '四大会计师', '财务专家']
  },
  education: {
    name: 'Education / Teaching',
    component: getAsyncComponent('education'),
    description: '教育教学风格，配色温暖柔和，排版具亲和力',
    category: 'education',
    preview: '/images/templates/education-preview.png',
    features: ['温暖亲和', '结构清晰', '证书展示', '圆滑组件'],
    suitableFor: ['教师', '大学讲师', '公务员', '培训师']
  },
  marketing: {
    name: 'Marketing / Media',
    component: getAsyncComponent('marketing'),
    description: '市场营销风格，大块的现代杂志式拼贴排版，视觉冲击力强',
    category: 'marketing',
    preview: '/images/templates/marketing-preview.png',
    features: ['杂志排版', '核心指标突出', '大色块', '视觉张力'],
    suitableFor: ['市场经理', '公关专家', '新媒体运营', '活动策划']
  },
  developer: {
    name: 'Developer / Geek',
    component: getAsyncComponent('developer'),
    description: '极客开发者风格，代码级纯净排版，凸显技术实力',
    category: 'tech',
    preview: '/images/templates/tech-preview.png',
    features: ['极简排版', '代码风格', '技术导向', '结构清晰'],
    suitableFor: ['前端工程师', '后端架构师', '全栈开发者', '程序员']
  },
  cyberpunk: {
    name: 'Cyberpunk Web3',
    component: getAsyncComponent('cyberpunk'),
    description: '高反差霓虹赛博朋克风，适合科技发烧友与核心开发者',
    category: 'cyber',
    preview: '/images/templates/tech-preview.png',
    features: ['深色模式', '霓虹高亮', '终端界面', '硬核电竞'],
    suitableFor: ['Web3开发', '游戏制作', '系统架构', '白帽黑客']
  },
  notion: {
    name: 'Notion Minimalist',
    component: getAsyncComponent('notion'),
    description: '基于 Notion 概念的极致纯粹文档流，块状排版',
    category: 'minimalist',
    preview: '/images/templates/minimalist-preview.png',
    features: ['无边框文档', '信息块', 'Emoji修饰', '绝对专注'],
    suitableFor: ['产品经理', '内容运营', '创作者', '独立开发者']
  },
  notion1: {
    name: 'Notion Minimalist1',
    component: getAsyncComponent('notion1'),
    description: '基于 Notion 概念的极致纯粹文档流，块状排版',
    category: 'minimalist',
    preview: '/images/templates/minimalist-preview.png',
    features: ['无边框文档', '信息块', 'Emoji修饰', '绝对专注'],
    suitableFor: ['产品经理', '内容运营', '创作者', '独立开发者']
  },
  glass: {
    name: 'UI Glassmorphism',
    component: getAsyncComponent('glass'),
    description: '磨砂毛玻璃叠加流光极光背景，高颜值悬浮设计',
    category: 'creative',
    preview: '/images/templates/designer-preview.png',
    features: ['背景模糊', '流光色彩', '悬浮卡片', '前沿UI'],
    suitableFor: ['前端开发', 'UI/UX设计师', '插画师', '视觉统筹']
  },
  vogue: {
    name: 'Vogue Editorial',
    component: getAsyncComponent('vogue'),
    description: '一线时尚大牌杂志高定排版，震撼衬线字体',
    category: 'fashion',
    preview: '/images/templates/executive-preview.png',
    features: ['时尚画报', '大字体排印', '艺术留白', '奢侈品风'],
    suitableFor: ['时尚公关', '艺术指导', '买手', '新媒体主编']
  },
  terminal: {
    name: 'Geek Terminal',
    component: getAsyncComponent('terminal'),
    description: '硬核终端模拟风格，纯暗黑命令行交互感，极客专属',
    category: 'cyber',
    preview: '/images/templates/tech-preview.png',
    features: ['命令行UI', '纯暗黑模式', '闪烁光标', '硬核沉浸'],
    suitableFor: ['前端工程师', '系统架构师', '安全工程师', '开源创作者']
  },
  nordic: {
    name: 'Nordic Minimalist',
    component: getAsyncComponent('nordic'),
    description: '北欧极简双栏排版，克制的大留白与高信息密度，HR最爱',
    category: 'minimalist',
    preview: '/images/templates/minimalist-preview.png',
    features: ['侧边栏结构', '大量留白', '高阅读性', '外企最爱'],
    suitableFor: ['外企求职', '大厂研发', '产品经理', '通用岗位']
  },
  pure: {
    name: 'Pure Layout',
    component: getAsyncComponent('pure'),
    description: '极致留白排版，采用侧边标题设计，视觉极度清爽干净',
    category: 'minimalist',
    preview: '/images/templates/minimalist-preview.png',
    features: ['双栏留白', '无框线设计', '高冷极简', '重点突出'],
    suitableFor: ['设计师', '产品经理', '内容编辑', '前端开发']
  },
  standardClean: {
    name: 'Standard Clean ATS',
    component: getAsyncComponent('standardClean'),
    description: '标准ATS简历解析友好型模板，传统单栏居中，通过率极高',
    category: 'minimalist',
    preview: '/images/templates/classic-preview.png',
    features: ['ATS友好', '标准单栏', '黑白经典', '信息密度高'],
    suitableFor: ['所有行业', '校招学生', '考编考公', '传统外企']
  },
  consulting: {
    name: 'WSO Consulting & Finance',
    component: getAsyncComponent('consulting'),
    description: '顶级投行与咨询公司标准格式（WSO标准），无任何多余修饰，纯靠排版和加粗展现专业严谨度。',
    category: 'finance',
    preview: '/images/templates/classic-preview.png',
    features: ['极简硬核', 'ATS最高通过率', '数据/结果导向', '紧凑高密度'],
    suitableFor: ['投资银行', '管理咨询', '法务律师', '高端管培生']
  },
  gridForm: {
    name: 'Standard Govt/SOE Grid',
    component: getAsyncComponent('gridForm'),
    description: '国内最经典的传统表格简历，符合公文规范，信息结构严密，自带标准照片位。',
    category: 'traditional',
    preview: '/images/templates/academic-preview.png',
    features: ['全表格布局', '自带照片槽', '体制内最爱', '规范公文风'],
    suitableFor: ['公务员/考公', '国有企业', '事业单位', '传统制造业']
  },
  gitProfile: {
    name: 'GitHub Open Source',
    component: getAsyncComponent('gitProfile'),
    description: '1:1复刻 GitHub 个人主页与 README 渲染样式，开源精神拉满的技术名片。',
    category: 'cyber',
    preview: '/images/templates/tech-preview.png',
    features: ['深色代码风', '仓库卡片', '极客专属', 'Commit式经历'],
    suitableFor: ['前端开发', '全栈开发', '开源贡献者', '独立开发者']
  },
  artisticPortfolio: {
    name: 'Artistic Portfolio',
    component: getAsyncComponent('artisticPortfolio'),
    description: '艺术作品集风格，专为艺术家、摄影师、插画师等创意工作者设计，突出作品展示和个人艺术声明',
    category: 'creative',
    preview: '/images/templates/designer-preview.png',
    features: ['作品集展示', '艺术家声明', '优雅排版', '媒介标签'],
    suitableFor: ['艺术家', '摄影师', '插画师', '创意工作者', '设计师']
  },
  corporateExecutive: {
    name: 'Corporate Executive',
    component: getAsyncComponent('corporateExecutive'),
    description: '企业高管风格，专为高级管理人员设计，突出领导力、战略思维和商业成果',
    category: 'business',
    preview: '/images/templates/executive-preview.png',
    features: ['权威设计', '执行摘要', '核心能力', '成果导向'],
    suitableFor: ['CEO/总裁', 'CFO/财务总监', 'COO/运营总监', '高级副总裁', '企业高管']
  }
}

// 自动加载 JSON 模板配置
Object.entries(templateConfigs).forEach(([path, config]) => {
  const id = path.split('/').pop().replace('.json', '')
  if (!templateRegistry[id]) {
    templateRegistry[id] = {
      name: config.name,
      component: SchemaRenderer, // 使用通用的 Schema 渲染组件
      isSchema: true,
      config: config,
      description: `${config.name} (动态配置模板)`,
      category: config.category?.toLowerCase() || 'minimalist',
      preview: '/images/templates/minimalist-preview.png', // 默认预览图
      features: ['动态布局', '高度可定制'],
      suitableFor: ['通用职位']
    }
  }
})

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
export const getTemplateById = (templateId) => templateRegistry[templateId]

// 获取单个模板
export function getTemplate(templateId) {
  return templateRegistry[templateId]
}

// 模板分类
export const templateCategories = {
  professional: '专业商务',
  business: '高管商务',
  finance: '金融财务',
  sales: '销售业绩',
  traditional: '传统经典',
  education: '教育公职',
  creative: '创意设计',
  marketing: '市场营销',
  academic: '学术研究',
  tech: '技术开发',
  cyber: '极客赛博',
  engineering: '工程研发',
  startup: '创业创新',
  minimalist: '极简主义',
  fashion: '高定时尚'
}