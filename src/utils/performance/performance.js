// 性能监控和Core Web Vitals
// 备用的性能监控实现
const fallbackMetrics = {
  getCLS: (callback) => {
    // 简化的CLS监控
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      callback({ value: clsValue, name: 'CLS' })
    })

    try {
      observer.observe({ type: 'layout-shift', buffered: true })
    } catch (e) {
      // 浏览器不支持layout-shift
      callback({ value: 0, name: 'CLS' })
    }
  },

  getFID: (callback) => {
    // 简化的FID监控
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        callback({ value: entry.processingStart - entry.startTime, name: 'FID' })
        observer.disconnect()
        break
      }
    })

    try {
      observer.observe({ type: 'first-input', buffered: true })
    } catch (e) {
      // 浏览器不支持first-input
      callback({ value: 0, name: 'FID' })
    }
  },

  getFCP: (callback) => {
    // 简化的FCP监控
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          callback({ value: entry.startTime, name: 'FCP' })
          observer.disconnect()
          break
        }
      }
    })

    try {
      observer.observe({ type: 'paint', buffered: true })
    } catch (e) {
      // 浏览器不支持paint
      callback({ value: performance.now(), name: 'FCP' })
    }
  },

  getLCP: (callback) => {
    // 简化的LCP监控
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      callback({ value: lastEntry.startTime, name: 'LCP' })
    })

    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch (e) {
      // 浏览器不支持largest-contentful-paint
      callback({ value: performance.now(), name: 'LCP' })
    }
  },

  getTTFB: (callback) => {
    // 简化的TTFB监控
    const navigationEntry = performance.getEntriesByType('navigation')[0]
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
      callback({ value: ttfb, name: 'TTFB' })
    } else {
      callback({ value: 0, name: 'TTFB' })
    }
  }
}

// 动态导入web-vitals或使用备用方案
let metricsAPI = fallbackMetrics

// 尝试加载web-vitals
const loadWebVitals = async () => {
  try {
    const webVitals = await import('web-vitals')
    metricsAPI = {
      getCLS: webVitals.getCLS,
      getFID: webVitals.getFID,
      getFCP: webVitals.getFCP,
      getLCP: webVitals.getLCP,
      getTTFB: webVitals.getTTFB
    }
    console.log('✅ web-vitals加载成功')
  } catch (error) {
    console.warn('⚠️ web-vitals包未找到，使用备用性能监控方案')
  }
}

// 初始化
loadWebVitals()

class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.observers = []
    this.init()
  }

  init() {
    // 监控Core Web Vitals
    this.monitorCoreWebVitals()
    
    // 监控自定义性能指标
    this.monitorCustomMetrics()
    
    // 监控资源加载
    this.monitorResourceLoading()
    
    // 监控用户交互
    this.monitorUserInteractions()
  }

  // 监控Core Web Vitals
  monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    metricsAPI.getLCP((metric) => {
      this.metrics.lcp = metric
      this.reportMetric('LCP', metric)
    })

    // First Input Delay (FID)
    metricsAPI.getFID((metric) => {
      this.metrics.fid = metric
      this.reportMetric('FID', metric)
    })

    // Cumulative Layout Shift (CLS)
    metricsAPI.getCLS((metric) => {
      this.metrics.cls = metric
      this.reportMetric('CLS', metric)
    })

    // First Contentful Paint (FCP)
    metricsAPI.getFCP((metric) => {
      this.metrics.fcp = metric
      this.reportMetric('FCP', metric)
    })

    // Time to First Byte (TTFB)
    metricsAPI.getTTFB((metric) => {
      this.metrics.ttfb = metric
      this.reportMetric('TTFB', metric)
    })
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

    // Vue应用挂载时间
    this.measureVueMount()
  }

  // 测量Vue应用挂载时间
  measureVueMount() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const appElement = document.querySelector('#app > div')
          if (appElement && !appElement.id === 'loading') {
            const mountTime = performance.now()
            this.metrics.vueMountTime = mountTime
            this.reportMetric('VUE_MOUNT_TIME', { value: mountTime })
            observer.disconnect()
          }
        }
      })
    })

    observer.observe(document.querySelector('#app'), {
      childList: true,
      subtree: true
    })

    this.observers.push(observer)
  }

  // 监控资源加载
  monitorResourceLoading() {
    // 监控图片加载
    const imageObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.initiatorType === 'img') {
          this.reportMetric('IMAGE_LOAD', {
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize
          })
        }
      })
    })

    imageObserver.observe({ entryTypes: ['resource'] })
    this.observers.push(imageObserver)

    // 监控字体加载
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        this.reportMetric('FONTS_LOADED', { value: performance.now() })
      })
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

    // 监控滚动性能
    let scrollStartTime = 0
    let isScrolling = false

    document.addEventListener('scroll', () => {
      if (!isScrolling) {
        scrollStartTime = performance.now()
        isScrolling = true
      }

      clearTimeout(this.scrollTimeout)
      this.scrollTimeout = setTimeout(() => {
        const scrollDuration = performance.now() - scrollStartTime
        this.reportMetric('SCROLL_PERFORMANCE', { value: scrollDuration })
        isScrolling = false
      }, 100)
    })
  }

  // 报告性能指标
  reportMetric(name, metric) {
    console.log(`📊 Performance Metric - ${name}:`, metric)
    
    // 发送到分析服务（如Google Analytics）
    if (typeof gtag !== 'undefined') {
      gtag('event', name, {
        event_category: 'Performance',
        value: Math.round(metric.value || metric.duration || 0),
        custom_parameter_1: metric.rating || 'unknown'
      })
    }

    // 发送到自定义分析服务
    this.sendToAnalytics(name, metric)
  }

  // 发送到分析服务
  sendToAnalytics(name, metric) {
    // 这里可以集成第三方分析服务
    // 例如：Google Analytics, Mixpanel, 自建分析系统等
    
    const data = {
      metric: name,
      value: metric.value || metric.duration || 0,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo()
    }

    // 使用sendBeacon发送数据（不阻塞页面）
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/performance', JSON.stringify(data))
    }
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
      coreWebVitals: {
        lcp: this.metrics.lcp,
        fid: this.metrics.fid,
        cls: this.metrics.cls,
        fcp: this.metrics.fcp,
        ttfb: this.metrics.ttfb
      },
      customMetrics: {
        domLoadTime: this.metrics.domLoadTime,
        fullLoadTime: this.metrics.fullLoadTime,
        vueMountTime: this.metrics.vueMountTime
      },
      recommendations: this.generateRecommendations()
    }
  }

  // 生成性能优化建议
  generateRecommendations() {
    const recommendations = []

    // LCP建议
    if (this.metrics.lcp && this.metrics.lcp.value > 2500) {
      recommendations.push({
        type: 'LCP',
        message: 'Largest Contentful Paint较慢，建议优化图片加载和关键资源',
        priority: 'high'
      })
    }

    // FID建议
    if (this.metrics.fid && this.metrics.fid.value > 100) {
      recommendations.push({
        type: 'FID',
        message: 'First Input Delay较高，建议减少JavaScript执行时间',
        priority: 'medium'
      })
    }

    // CLS建议
    if (this.metrics.cls && this.metrics.cls.value > 0.1) {
      recommendations.push({
        type: 'CLS',
        message: 'Cumulative Layout Shift较高，建议为图片和广告预留空间',
        priority: 'high'
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
const performanceMonitor = new PerformanceMonitor()

// 导出性能监控功能
export { performanceMonitor }

// 页面卸载时发送最终报告
window.addEventListener('beforeunload', () => {
  const report = performanceMonitor.getPerformanceReport()
  
  // 发送最终性能报告
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/performance-report', JSON.stringify(report))
  }
  
  performanceMonitor.cleanup()
})
