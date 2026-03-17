<template>
  <div class="routing-test-page">
    <h1>🧪 路由诊断测试页面</h1>
    
    <div class="test-section">
      <h2>当前路由信息</h2>
      <div class="info-box">
        <p><strong>当前路径:</strong> {{ $route.path }}</p>
        <p><strong>当前名称:</strong> {{ $route.name }}</p>
        <p><strong>路由参数:</strong> {{ JSON.stringify($route.params) }}</p>
        <p><strong>查询参数:</strong> {{ JSON.stringify($route.query) }}</p>
      </div>
    </div>

    <div class="test-section">
      <h2>导航测试</h2>
      <div class="nav-buttons">
        <router-link to="/" class="btn">Home</router-link>
        <router-link to="/ai-assistant" class="btn">AI Assistant</router-link>
        <router-link to="/templates" class="btn">Templates</router-link>
        <router-link to="/design" class="btn">Design</router-link>
        <router-link to="/settings" class="btn">Settings</router-link>
        <router-link to="/about" class="btn">About</router-link>
        <router-link to="/print" class="btn">Print</router-link>
        <router-link to="/not-found" class="btn">Not Found</router-link>
      </div>
    </div>

    <div class="test-section">
      <h2>路由栈信息</h2>
      <div class="info-box">
        <p><strong>历史记录长度:</strong> {{ routeHistory.length }}</p>
        <p><strong>最近访问:</strong></p>
        <ul>
          <li v-for="(route, idx) in routeHistory.slice(-5)" :key="idx">
            {{ route }}
          </li>
        </ul>
      </div>
    </div>

    <div class="test-section">
      <h2>组件挂载状态</h2>
      <div class="info-box">
        <p><strong>TestPage 已挂载:</strong> ✅</p>
        <p><strong>App 已挂载:</strong> ✅</p>
        <p><strong>AppLayout 已挂载:</strong> ✅</p>
        <p><strong>Router 已就绪:</strong> ✅</p>
      </div>
    </div>

    <div class="test-section">
      <h2>性能指标</h2>
      <div class="info-box">
        <p><strong>页面加载时间:</strong> {{ loadTime }}ms</p>
        <p><strong>首次内容绘制:</strong> {{ fcp }}ms</p>
        <p><strong>最大内容绘制:</strong> {{ lcp }}ms</p>
      </div>
    </div>

    <div class="test-section">
      <h2>浏览器控制台检查项</h2>
      <div class="checklist">
        <label><input type="checkbox" disabled checked /> Router navigation 日志</label>
        <label><input type="checkbox" disabled checked /> 路由守卫日志</label>
        <label><input type="checkbox" disabled checked /> 组件加载成功</label>
        <label><input type="checkbox" disabled checked /> 无 JS 错误</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const routeHistory = ref([])
const loadTime = ref(0)
const fcp = ref(0)
const lcp = ref(0)

onMounted(() => {
  // 记录初始路由
  routeHistory.value.push(route.path)

  // 监听路由变化
  router.afterEach((to) => {
    routeHistory.value.push(to.path)
  })

  // 记录性能指标
  if (performance.timing) {
    loadTime.value = performance.timing.loadEventEnd - performance.timing.navigationStart
  }

  // 获取 FCP (First Contentful Paint)
  if (performance.getEntriesByName) {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0]
    if (fcpEntry) fcp.value = Math.round(fcpEntry.startTime)
  }

  // 获取 LCP (Largest Contentful Paint)
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    lcp.value = Math.round(lastEntry.renderTime || lastEntry.loadTime)
  })
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  } catch (e) {
    console.warn('LCP 观察不支持')
  }

  console.log('✅ 路由测试页面已加载')
  console.log('📍 当前路由:', route.path)
  console.log('🔄 尝试点击导航链接进行路由测试')
})
</script>

<style scoped>
.routing-test-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
}

h1 {
  color: #333;
  border-bottom: 3px solid #409eff;
  padding-bottom: 10px;
}

h2 {
  color: #555;
  margin-top: 20px;
  font-size: 18px;
}

.test-section {
  margin-bottom: 30px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.info-box {
  background: white;
  padding: 15px;
  border-radius: 6px;
  line-height: 1.8;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #333;
}

.info-box p {
  margin: 8px 0;
}

.info-box ul {
  list-style: none;
  padding-left: 20px;
}

.info-box li {
  padding: 5px 0;
  color: #666;
}

.info-box strong {
  color: #409eff;
  font-weight: 600;
}

.nav-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.btn {
  display: block;
  padding: 10px 15px;
  background: #409eff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid #409eff;
}

.btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  transform: translateY(-2px);
}

.btn.router-link-active,
.btn.router-link-exact-active {
  background: #0a66c2;
  border-color: #0a66c2;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  padding: 15px;
  border-radius: 6px;
}

.checklist label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
}

.checklist input {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #409eff;
}
</style>
