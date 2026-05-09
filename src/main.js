import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'
import './styles/print.css'
import App from './App.vue'
import router from './router'

// 导入性能监控与安全防御
import './utils/performance/performance.js'
import { setupAntiScrape } from './utils/security'

// 初始化安全防御
setupAntiScrape();

const app = createApp(App)
const pinia = createPinia()

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// 全局快捷键：Ctrl+Shift+D 快速填充默认数据
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyD') {
    e.preventDefault()
    const store = pinia._s.get('resume')
    if (store) {
      if (confirm('是否填充默认数据？（现有数据将被覆盖）')) {
        store.fillWithDefaultData()
        console.log('✓ 已填充默认数据')
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
