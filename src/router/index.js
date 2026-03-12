import { createRouter, createWebHashHistory } from 'vue-router'
import { useResumeStore } from '@stores/resume'

// 路由组件懒加载
const HomeView = () => import('../views/HomeView.vue')
const AIAssistantView = () => import('../views/AIAssistantView.vue')
const TemplatesView = () => import('../views/TemplatesView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const AboutView = () => import('../views/AboutView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
const DesignView = () => import('../views/DesignView.vue')
const PrintView = () => import('../views/PrintView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: '简历编辑器',
      description: '免费在线简历编辑器，提供多种精美开源模板，支持ATS解析，一键导出高清PDF简历。',
      keywords: '免费简历,在线简历制作,求职简历生成器,ATS友好模板,导出PDF简历',
      requiresResume: false
    }
  },
  {
    path: '/design',
    name: 'Design',
    component: DesignView,
    meta: {
      title: '设计工作室',
      description: '个性化定制您的简历视觉风格。',
      requiresResume: true
    }
  },

  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: AIAssistantView,
    meta: {
      title: 'AI助手',
      description: '基于AI大模型的智能简历生成助手，自动润色经历描述，匹配职位要求。',
      keywords: 'AI简历润色,AI智能写简历,职位JD匹配分析,工作经历代写',
      requiresResume: false
    }
  },
  {
    path: '/templates',
    name: 'Templates',
    component: TemplatesView,
    meta: {
      title: '模板中心',
      description: '海量高质量简历模板，涵盖校招、社招、互联网、传统行业，支持颜色主题深度定制。',
      keywords: '简历模板下载,好用的简历模板,双语简历模板,高级简历设计',
      requiresResume: false
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: {
      title: '设置',
      description: '应用设置和偏好',
      requiresResume: false
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      title: '关于',
      description: '关于简历编辑器',
      requiresResume: false
    }
  },
  {
    path: '/resume/:id?',
    name: 'ResumeEditor',
    component: HomeView,
    meta: {
      title: '编辑简历',
      description: '编辑您的简历',
      requiresResume: false
    }
  },
  {
    path: '/print',
    name: 'Print',
    component: PrintView,
    meta: {
      title: '打印预览',
      description: '用于服务端导出高保真PDF的打印页面',
      requiresResume: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: {
      title: '页面未找到',
      description: '您访问的页面不存在'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 简历编辑器`

    // 更新 OG:Title
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', `${to.meta.title} - 专业简历制作平台`)
  }

  // 设置meta描述
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }

    // 更新 OG:Description
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) ogDescription.setAttribute('content', to.meta.description)
  }

  // 设置meta关键词
  if (to.meta.keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', to.meta.keywords)
  }

  // 检查是否需要简历数据（可选的路由守卫）
  if (to.meta.requiresResume) {
    const resumeStore = useResumeStore()
    if (!resumeStore.hasResumeData) {
      // 可以重定向到首页或显示提示
      console.warn('No resume data found, redirecting to home')
    }
  }

  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 页面访问统计或其他后置处理
  console.log(`Navigated from ${from.name} to ${to.name}`)
})

export default router
