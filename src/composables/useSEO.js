// SEO优化组合函数
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { seoConfig, getPageSEO, generateStructuredData, debugSEO } from '../utils/seoConfig'

export function useSEO() {
  const currentMeta = ref({})
  
  // 设置页面标题
  const setTitle = (title) => {
    if (title) {
      document.title = `${title} - 简历编辑器`
    } else {
      document.title = '简历编辑器 - 专业在线简历制作工具'
    }
  }
  
  // 设置meta标签
  const setMeta = (metaData) => {
    const head = document.head
    
    // 清除之前的动态meta标签
    const existingMetas = head.querySelectorAll('meta[data-dynamic="true"]')
    existingMetas.forEach(meta => meta.remove())
    
    // 添加新的meta标签
    Object.entries(metaData).forEach(([key, value]) => {
      if (value) {
        const meta = document.createElement('meta')
        meta.setAttribute('data-dynamic', 'true')
        
        if (key === 'description') {
          meta.setAttribute('name', 'description')
          meta.setAttribute('content', value)
        } else if (key === 'keywords') {
          meta.setAttribute('name', 'keywords')
          meta.setAttribute('content', value)
        } else if (key.startsWith('og:')) {
          meta.setAttribute('property', key)
          meta.setAttribute('content', value)
        } else if (key.startsWith('twitter:')) {
          meta.setAttribute('name', key)
          meta.setAttribute('content', value)
        } else {
          meta.setAttribute('name', key)
          meta.setAttribute('content', value)
        }
        
        head.appendChild(meta)
      }
    })
    
    currentMeta.value = metaData
  }
  
  // 设置结构化数据
  const setStructuredData = (data) => {
    // 移除现有的结构化数据
    const existingScript = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]')
    if (existingScript) {
      existingScript.remove()
    }
    
    // 添加新的结构化数据
    if (data) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-dynamic', 'true')
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
    }
  }
  
  // 设置Open Graph图片
  const setOGImage = (imageUrl) => {
    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage && imageUrl) {
      ogImage.setAttribute('content', imageUrl)
    }
  }
  
  // 设置canonical链接
  const setCanonical = (url) => {
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }
  
  // 预设的SEO配置
  const seoPresets = {
    home: {
      title: '首页',
      description: '专业的在线简历编辑器，提供多种精美简历模板，支持实时预览、PDF导出。免费制作个人简历，助您求职成功。',
      keywords: '简历编辑器,在线简历制作,简历模板,个人简历,求职简历,简历生成器,免费简历,PDF简历',
      'og:title': '简历编辑器 - 专业在线简历制作工具',
      'og:description': '专业的在线简历编辑器，提供多种精美简历模板，支持实时预览、PDF导出。',
      'twitter:title': '简历编辑器 - 专业在线简历制作工具',
      'twitter:description': '专业的在线简历编辑器，提供多种精美简历模板，支持实时预览、PDF导出。'
    },
    templates: {
      title: '简历模板',
      description: '精选多种专业简历模板，包括现代风格、经典风格、简约风格等，适合不同行业和职位需求。',
      keywords: '简历模板,简历样式,简历设计,现代简历,经典简历,简约简历,专业简历模板',
      'og:title': '简历模板 - 多种精美简历模板选择',
      'og:description': '精选多种专业简历模板，包括现代风格、经典风格、简约风格等，适合不同行业和职位需求。'
    },
    editor: {
      title: '简历编辑',
      description: '使用我们的在线编辑器轻松制作专业简历，实时预览效果，支持多种格式导出。',
      keywords: '简历编辑,在线编辑器,简历制作,实时预览,PDF导出',
      'og:title': '简历编辑器 - 在线制作专业简历',
      'og:description': '使用我们的在线编辑器轻松制作专业简历，实时预览效果，支持多种格式导出。'
    }
  }
  
  // 应用预设SEO配置
  const applySEOPreset = (presetName) => {
    const preset = seoPresets[presetName]
    if (preset) {
      setTitle(preset.title)
      setMeta(preset)
    }
  }

  // 应用页面SEO配置（使用新的配置系统）
  const applyPageSEO = (pageName, templateName = null) => {
    const pageConfig = getPageSEO(pageName, templateName)

    setTitle(pageConfig.title)
    setMeta({
      description: pageConfig.description,
      keywords: pageConfig.keywords,
      'og:title': pageConfig.openGraph.title,
      'og:description': pageConfig.openGraph.description,
      'og:url': pageConfig.openGraph.url,
      'og:image': pageConfig.openGraph.image,
      'twitter:title': pageConfig.twitterCard.title,
      'twitter:description': pageConfig.twitterCard.description,
      'twitter:image': pageConfig.twitterCard.image
    })

    setCanonical(pageConfig.canonical)

    // 调试模式下输出SEO信息
    if (import.meta.env.VITE_ENABLE_SEO_DEBUG === 'true') {
      debugSEO()
    }
  }

  // 设置应用结构化数据
  const setAppStructuredData = () => {
    const webAppData = generateStructuredData('webApplication')
    if (webAppData) {
      setStructuredData(webAppData)
    }
  }
  
  // 生成面包屑结构化数据
  const generateBreadcrumbData = (breadcrumbs) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    }
  }
  
  // 生成文章结构化数据
  const generateArticleData = (article) => {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.description,
      "author": {
        "@type": "Organization",
        "name": "简历编辑器团队"
      },
      "publisher": {
        "@type": "Organization",
        "name": "简历编辑器",
        "logo": {
          "@type": "ImageObject",
          "url": "https://resume-editor.example.com/logo.png"
        }
      },
      "datePublished": article.publishDate,
      "dateModified": article.modifyDate || article.publishDate,
      "image": article.image
    }
  }
  
  // 监听路由变化
  const watchRoute = (router) => {
    if (router) {
      watch(() => router.currentRoute.value, (to) => {
        // 根据路由自动设置SEO
        const routeName = to.name || 'home'
        if (seoPresets[routeName]) {
          applySEOPreset(routeName)
        }
        
        // 设置canonical URL
        const baseUrl = 'https://resume-editor.example.com'
        setCanonical(`${baseUrl}${to.path}`)
      }, { immediate: true })
    }
  }
  
  // 清理函数
  const cleanup = () => {
    const dynamicMetas = document.querySelectorAll('meta[data-dynamic="true"]')
    dynamicMetas.forEach(meta => meta.remove())
    
    const dynamicScripts = document.querySelectorAll('script[data-dynamic="true"]')
    dynamicScripts.forEach(script => script.remove())
  }
  
  // 组件卸载时清理
  onUnmounted(() => {
    cleanup()
  })
  
  return {
    setTitle,
    setMeta,
    setStructuredData,
    setOGImage,
    setCanonical,
    applySEOPreset,
    applyPageSEO,
    setAppStructuredData,
    generateBreadcrumbData,
    generateArticleData,
    watchRoute,
    currentMeta,
    seoPresets
  }
}

// 页面级SEO组合函数
export function usePageSEO(config) {
  const { setTitle, setMeta, setStructuredData, setCanonical } = useSEO()
  
  onMounted(() => {
    if (config.title) setTitle(config.title)
    if (config.meta) setMeta(config.meta)
    if (config.structuredData) setStructuredData(config.structuredData)
    if (config.canonical) setCanonical(config.canonical)
  })
}

// 动态SEO更新
export function useDynamicSEO() {
  const { setTitle, setMeta, setOGImage } = useSEO()
  
  // 根据内容动态更新SEO
  const updateSEOFromContent = (content) => {
    if (content.title) {
      setTitle(content.title)
    }
    
    if (content.description) {
      setMeta({
        description: content.description,
        'og:description': content.description,
        'twitter:description': content.description
      })
    }
    
    if (content.image) {
      setOGImage(content.image)
    }
  }
  
  return {
    updateSEOFromContent
  }
}
