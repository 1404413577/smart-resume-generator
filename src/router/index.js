import { createRouter, createWebHistory } from 'vue-router'
import { useResumeStore } from '../stores/resume'

// 路由组件懒加载
const HomeView = () => import('../views/HomeView.vue')
const ResumesView = () => import('../views/ResumesView.vue')
const AIAssistantView = () => import('../views/AIAssistantView.vue')
const TemplatesView = () => import('../views/TemplatesView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const AboutView = () => import('../views/AboutView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: '简历编辑器',
      description: '在线简历编辑器，创建专业简历',
      requiresResume: false
    }
  },
  {
    path: '/resumes',
    name: 'Resumes',
    component: ResumesView,
    meta: {
      title: '简历管理',
      description: '管理您的所有简历',
      requiresResume: false
    }
  },
  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: AIAssistantView,
    meta: {
      title: 'AI助手',
      description: 'AI智能简历生成助手',
      requiresResume: false
    }
  },
  {
    path: '/templates',
    name: 'Templates',
    component: TemplatesView,
    meta: {
      title: '模板中心',
      description: '选择专业简历模板',
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
  history: createWebHistory(),
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
  }

  // 设置meta描述
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
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
