import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import './style.css'
import './styles/print.css'
import App from './App.vue'
import router from './router'
import { useResumeStore } from '@stores/resume'

// 按需加载 Element Plus 和图标
import { registerElementComponents, ElMessage } from './utils/elementPlus/index.js'
import { registerCommonIcons } from './utils/icons/index.js'

// 导入性能监控与安全防御
import './utils/performance/performance.js'
import { setupAntiScrape } from './utils/security'

// 初始化安全防御
setupAntiScrape();

const app = createApp(App)
const pinia = createPinia()

// 按需注册 Element Plus 组件
registerElementComponents(app)

// 按需注册常用图标
registerCommonIcons(app)

app.use(pinia)
app.use(router)
app.mount('#app')

// 全局快捷键：Ctrl+Shift+D 快速填充默认数据
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyD') {
    e.preventDefault()
    // 通过 Pinia 的公共 API 获取 store 实例，避免直接访问私有属性
    const store = useResumeStore()
    if (store) {
      if (confirm('是否填充默认数据？（现有数据将被覆盖）')) {
        store.fillWithDefaultData()
      }
    }
  }
})

// 注册PWA服务工作线程
registerSW({
  onNeedRefresh() {
    console.log('有新内容可用，请刷新页面')
  },
  onOfflineReady() {
    console.log('应用已准备好离线使用')
  }
})
