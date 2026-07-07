import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import './style.css'
import './styles/print.css'
import App from './App.vue'
import router from './router'

// 按需加载 Element Plus 和图标
import { registerElementComponents } from './utils/elementPlus/index.js'
import { registerCommonIcons } from './utils/icons/index.js'

const app = createApp(App)
const pinia = createPinia()

// 按需注册 Element Plus 组件
registerElementComponents(app)

// 按需注册常用图标
registerCommonIcons(app)

app.use(pinia)
app.use(router)
app.mount('#app')

// 注册PWA服务工作线程
registerSW()
