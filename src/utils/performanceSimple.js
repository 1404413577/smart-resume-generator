// 简化版性能监控（不依赖外部包）
class SimplePerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.observers = []
    this.init()
  }

  init() {
    // 监控基础性能指标
    this.monitorBasicMetrics()
    
    // 监控自定义性能指标
    this.monitorCustomMetrics()
    
    // 监控用户交互
    this.monitorUserInteractions()
  }

  // 监控基础性能指标
  monitorBasicMetrics() {
    // 页面加载时间
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart
        this.metrics.firstByte = navigation.responseStart - navigation.requestStart
        
        this.reportMetric('PAGE_LOAD_TIME', { value: this.metrics.loadTime })
        this.reportMetric('DOM_CONTENT_LOADED', { value: this.metrics.domContentLoaded })
        this.reportMetric('FIRST_BYTE', { value: this.metrics.firstByte })
      }
    })

    // First Contentful Paint
    this.observePaintMetrics()
    
    // Largest Contentful Paint
    this.observeLCP()
    
    // Cumulative Layout Shift
    this.observeCLS()
    
    // First Input Delay
    this.observeFID()
  }

  // 监控Paint指标
  observePaintMetrics() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime
              this.reportMetric('FCP', { value: entry.startTime })
            }
            if (entry.name === 'first-paint') {
              this.metrics.fp = entry.startTime
              this.reportMetric('FP', { value: entry.startTime })
            }
          }
        })
        
        observer.observe({ type: 'paint', buffered: true })
        this.observers.push(observer)
      } catch (e) {
        console.warn('Paint metrics not supported')
      }
    }
  }

  // 监控Largest Contentful Paint
  observeLCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          this.metrics.lcp = lastEntry.startTime
          this.reportMetric('LCP', { value: lastEntry.startTime })
        })
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true })
        this.observers.push(observer)
      } catch (e) {
        console.warn('LCP not supported')
      }
    }
  }

  // 监控Cumulative Layout Shift
  observeCLS() {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          this.metrics.cls = clsValue
          this.reportMetric('CLS', { value: clsValue })
        })
        
        observer.observe({ type: 'layout-shift', buffered: true })
        this.observers.push(observer)
      } catch (e) {
        console.warn('CLS not supported')
      }
    }
  }

  // 监控First Input Delay
  observeFID() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fid = entry.processingStart - entry.startTime
            this.metrics.fid = fid
            this.reportMetric('FID', { value: fid })
            observer.disconnect()
            break
          }
        })
        
        observer.observe({ type: 'first-input', buffered: true })
        this.observers.push(observer)
      } catch (e) {
        console.warn('FID not supported')
      }
    }
  }

  // 监控自定义性能指标
  monitorCustomMetrics() {
    // 应用启动时间
    const startTime = performance.now()
    
    // DOM内容加载完成时间
    document.addEventListener('DOMContentLoaded', () => {
      const domLoadTime = performance.now() - startTime
      this.metrics.domLoadTime = domLoadTime
      this.reportMetric('DOM_LOAD_TIME', { value: domLoadTime })
    })

    // 应用完全加载时间
    window.addEventListener('load', () => {
      const fullLoadTime = performance.now() - startTime
      this.metrics.fullLoadTime = fullLoadTime
      this.reportMetric('FULL_LOAD_TIME', { value: fullLoadTime })
    })

    // 监控资源加载
    this.monitorResourceLoading()
  }

  // 监控资源加载
  monitorResourceLoading() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.initiatorType === 'img') {
              this.reportMetric('IMAGE_LOAD', {
                name: entry.name,
                duration: entry.duration,
                size: entry.transferSize || 0
              })
            }
          })
        })

        observer.observe({ entryTypes: ['resource'] })
        this.observers.push(observer)
      } catch (e) {
        console.warn('Resource timing not supported')
      }
    }
  }

  // 监控用户交互
  monitorUserInteractions() {
    // 监控点击响应时间
    let clickStartTime = 0
    
    document.addEventListener('mousedown', () => {
      clickStartTime = performance.now()
    })

    document.addEventListener('click', () => {
      if (clickStartTime) {
        const clickDuration = performance.now() - clickStartTime
        this.reportMetric('CLICK_RESPONSE', { value: clickDuration })
        clickStartTime = 0
      }
    })

    // 监控页面可见性
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.reportMetric('PAGE_HIDDEN', { timestamp: Date.now() })
      } else {
        this.reportMetric('PAGE_VISIBLE', { timestamp: Date.now() })
      }
    })
  }

  // 报告性能指标
  reportMetric(name, metric) {
    // 根据环境变量决定是否输出日志
    if (import.meta.env.VITE_ENABLE_SEO_DEBUG === 'true' || import.meta.env.DEV) {
      console.log(`📊 Performance Metric - ${name}:`, metric)
    }

    // 检查是否启用分析
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      this.sendToAnalytics(name, metric)
    }
  }

  // 发送到分析服务
  sendToAnalytics(name, metric) {
    const data = {
      metric: name,
      value: metric.value || metric.duration || 0,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo()
    }

    // 开发环境下只在控制台输出，不发送请求
    if (import.meta.env.DEV) {
      // 开发环境：只记录到控制台
      console.log('📈 Analytics Data:', data)
      return
    }

    // 生产环境：发送到分析服务
    if (navigator.sendBeacon && typeof data.value === 'number') {
      try {
        // 检查是否有有效的分析端点
        const analyticsEndpoint = this.getAnalyticsEndpoint()
        if (analyticsEndpoint) {
          navigator.sendBeacon(analyticsEndpoint, JSON.stringify(data))
        }
      } catch (e) {
        // 忽略发送错误
        console.warn('Analytics sending failed:', e)
      }
    }
  }

  // 获取分析端点
  getAnalyticsEndpoint() {
    // 可以从环境变量或配置中获取
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/analytics/performance'

    // 检查端点是否可用（简单检查）
    if (endpoint.startsWith('/api/') && window.location.hostname === 'localhost') {
      // 本地开发环境，跳过API调用
      return null
    }

    return endpoint
  }

  // 获取网络连接信息
  getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      }
    }
    return null
  }

  // 获取性能报告
  getPerformanceReport() {
    return {
      basicMetrics: {
        loadTime: this.metrics.loadTime,
        domContentLoaded: this.metrics.domContentLoaded,
        firstByte: this.metrics.firstByte,
        fcp: this.metrics.fcp,
        lcp: this.metrics.lcp,
        cls: this.metrics.cls,
        fid: this.metrics.fid
      },
      customMetrics: {
        domLoadTime: this.metrics.domLoadTime,
        fullLoadTime: this.metrics.fullLoadTime
      },
      recommendations: this.generateRecommendations()
    }
  }

  // 生成性能优化建议
  generateRecommendations() {
    const recommendations = []

    // LCP建议
    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      recommendations.push({
        type: 'LCP',
        message: 'Largest Contentful Paint较慢，建议优化图片加载和关键资源',
        priority: 'high'
      })
    }

    // FID建议
    if (this.metrics.fid && this.metrics.fid > 100) {
      recommendations.push({
        type: 'FID',
        message: 'First Input Delay较高，建议减少JavaScript执行时间',
        priority: 'medium'
      })
    }

    // CLS建议
    if (this.metrics.cls && this.metrics.cls > 0.1) {
      recommendations.push({
        type: 'CLS',
        message: 'Cumulative Layout Shift较高，建议为图片和广告预留空间',
        priority: 'high'
      })
    }

    // 加载时间建议
    if (this.metrics.loadTime && this.metrics.loadTime > 3000) {
      recommendations.push({
        type: 'LOAD_TIME',
        message: '页面加载时间较长，建议优化资源加载',
        priority: 'medium'
      })
    }

    return recommendations
  }

  // 清理资源
  cleanup() {
    this.observers.forEach(observer => {
      if (observer.disconnect) {
        observer.disconnect()
      }
    })
    this.observers = []
  }
}

// 创建全局性能监控实例
const simplePerformanceMonitor = new SimplePerformanceMonitor()

// 导出性能监控功能
export { simplePerformanceMonitor }

// 页面卸载时发送最终报告
window.addEventListener('beforeunload', () => {
  const report = simplePerformanceMonitor.getPerformanceReport()

  // 开发环境下只在控制台输出最终报告
  if (import.meta.env.DEV) {
    console.log('📊 Final Performance Report:', report)
  } else {
    // 生产环境：发送最终性能报告
    if (navigator.sendBeacon) {
      try {
        const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/analytics/performance-report'
        if (!endpoint.includes('localhost')) {
          navigator.sendBeacon(endpoint, JSON.stringify(report))
        }
      } catch (error) {
        // 忽略发送错误
        console.warn('Final report sending failed:', error)
      }
    }
  }

  simplePerformanceMonitor.cleanup()
})
