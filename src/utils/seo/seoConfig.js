// SEO配置管理器
export const seoConfig = {
  // 基础配置
  baseUrl: import.meta.env.VITE_BASE_URL || 'https://smart-resume-generator-lac.vercel.app',
  siteName: import.meta.env.VITE_SITE_NAME || '简历编辑器',
  siteDescription: import.meta.env.VITE_SITE_DESCRIPTION || '专业的在线简历编辑器，提供多种精美简历模板',
  
  // 默认SEO配置
  defaults: {
    title: '简历编辑器 - 专业在线简历制作工具',
    description: '专业的在线简历编辑器，提供多种精美简历模板，支持实时预览、PDF导出。免费制作个人简历，助您求职成功。',
    keywords: '简历编辑器,在线简历制作,简历模板,个人简历,求职简历,简历生成器,免费简历,PDF简历',
    author: '项目维护者',
    robots: 'index, follow',
    language: 'zh-CN'
  },

  // Open Graph配置
  openGraph: {
    type: 'website',
    siteName: '简历编辑器',
    locale: 'zh_CN',
    image: '/favicon.svg',
    imageWidth: 512,
    imageHeight: 512
  },

  // Twitter Card配置
  twitterCard: {
    card: 'summary_large_image',
    site: '',
    creator: '',
    image: '/favicon.svg'
  },

  // 结构化数据模板
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "简历编辑器",
      "url": "https://smart-resume-generator-lac.vercel.app",
      "logo": "https://smart-resume-generator-lac.vercel.app/favicon.svg",
      "description": "本地优先的简历编辑工具",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "project information",
        "availableLanguage": "Chinese"
      }
    },

    webApplication: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "简历编辑器",
      "description": "专业的在线简历编辑器，提供多种精美简历模板",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "CNY"
      },
      "featureList": [
        "多种简历模板",
        "实时预览",
        "PDF导出",
        "在线编辑",
        "免费使用"
      ]
    },

    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": []
    }
  },

  // 页面特定配置
  pages: {
    home: {
      title: '首页',
      description: '专业的在线简历编辑器，提供多种精美简历模板，支持实时预览、PDF导出。免费制作个人简历，助您求职成功。',
      keywords: '简历编辑器,在线简历制作,简历模板,个人简历,求职简历,简历生成器,免费简历,PDF简历',
      path: '/'
    },

    templates: {
      title: '简历模板',
      description: '精选多种专业简历模板，包括现代风格、经典风格、简约风格等，适合不同行业和职位需求。',
      keywords: '简历模板,简历样式,简历设计,现代简历,经典简历,简约简历,专业简历模板',
      path: '/templates'
    },

    editor: {
      title: '简历编辑',
      description: '使用在线编辑器制作简历，实时预览效果，支持多种格式导出。',
      keywords: '简历编辑,在线编辑器,简历制作,实时预览,PDF导出',
      path: '/'
    },

    design: {
      title: '设计工作室',
      description: '个性化定制简历视觉风格，调整模板、颜色、字体和模块布局。',
      keywords: '简历设计,简历样式,模板定制,简历排版,视觉风格',
      path: '/design'
    },

    aiAssistant: {
      title: 'AI助手',
      description: '使用 AI 生成、润色和优化简历内容，辅助匹配目标岗位。',
      keywords: 'AI简历,简历润色,简历生成,JD匹配,求职优化',
      path: '/ai-assistant'
    },

    settings: {
      title: '设置',
      description: '管理简历编辑器的应用设置、AI服务和导出偏好。',
      keywords: '简历设置,AI配置,导出设置,应用偏好',
      path: '/settings'
    },

    about: {
      title: '关于项目',
      description: '了解简历编辑器项目、能力边界、数据保存方式和第三方服务说明。',
      keywords: '关于简历编辑器,项目说明,本地优先,第三方服务说明',
      path: '/about'
    }
  },

  // 模板页面配置
  templatePages: {
    modern: {
      title: '现代风格简历模板',
      description: '现代简洁的简历模板，适合互联网、科技等行业，突出个人技能和项目经验。',
      keywords: '现代简历模板,简洁简历,科技行业简历,互联网简历'
    },
    classic: {
      title: '经典风格简历模板',
      description: '传统经典的简历模板，适合金融、法律、教育等传统行业，正式专业。',
      keywords: '经典简历模板,传统简历,金融简历,法律简历,教育简历'
    },
    minimal: {
      title: '简约风格简历模板',
      description: '极简设计的简历模板，突出内容本身，适合设计师、艺术家等创意行业。',
      keywords: '简约简历模板,极简简历,设计师简历,创意简历'
    },
    creative: {
      title: '创意风格简历模板',
      description: '富有创意的简历模板，色彩丰富，适合广告、媒体、艺术等创意行业。',
      keywords: '创意简历模板,彩色简历,广告简历,媒体简历,艺术简历'
    },
    professional: {
      title: '专业风格简历模板',
      description: '专业商务的简历模板，适合管理、咨询、销售等商务行业，体现专业素养。',
      keywords: '专业简历模板,商务简历,管理简历,咨询简历,销售简历'
    }
  }
}

// 获取页面SEO配置
export function getPageSEO(pageName, templateName = null) {
  const baseConfig = seoConfig.defaults
  let pageConfig = {}

  if (templateName && seoConfig.templatePages[templateName]) {
    pageConfig = seoConfig.templatePages[templateName]
  } else if (seoConfig.pages[pageName]) {
    pageConfig = seoConfig.pages[pageName]
  }

  return {
    title: pageConfig.title ? `${pageConfig.title} - ${seoConfig.siteName}` : baseConfig.title,
    description: pageConfig.description || baseConfig.description,
    keywords: pageConfig.keywords || baseConfig.keywords,
    canonical: `${seoConfig.baseUrl}${pageConfig.path || '/'}`,
    openGraph: {
      title: pageConfig.title || baseConfig.title,
      description: pageConfig.description || baseConfig.description,
      url: `${seoConfig.baseUrl}${pageConfig.path || '/'}`,
      image: `${seoConfig.baseUrl}${seoConfig.openGraph.image}`,
      type: seoConfig.openGraph.type,
      siteName: seoConfig.openGraph.siteName,
      locale: seoConfig.openGraph.locale
    },
    twitterCard: {
      card: seoConfig.twitterCard.card,
      title: pageConfig.title || baseConfig.title,
      description: pageConfig.description || baseConfig.description,
      image: `${seoConfig.baseUrl}${seoConfig.twitterCard.image}`,
      site: seoConfig.twitterCard.site,
      creator: seoConfig.twitterCard.creator
    }
  }
}

// 生成结构化数据
export function generateStructuredData(type, data = {}) {
  const baseData = seoConfig.structuredData[type]
  if (!baseData) return null

  // 合并自定义数据
  return {
    ...baseData,
    ...data,
    url: data.url || seoConfig.baseUrl
  }
}

// 生成面包屑数据
export function generateBreadcrumbs(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${seoConfig.baseUrl}${crumb.path}`
    }))
  }
}

// 调试模式下的SEO检查
export function debugSEO() {
  if (import.meta.env.VITE_ENABLE_SEO_DEBUG === 'true') {
    console.group('🔍 SEO Debug Information')
    console.log('Base URL:', seoConfig.baseUrl)
    console.log('Site Name:', seoConfig.siteName)
    console.log('Current Title:', document.title)
    console.log('Meta Description:', document.querySelector('meta[name="description"]')?.content)
    console.log('Meta Keywords:', document.querySelector('meta[name="keywords"]')?.content)
    console.log('Canonical URL:', document.querySelector('link[rel="canonical"]')?.href)
    console.log('Open Graph Tags:', Array.from(document.querySelectorAll('meta[property^="og:"]')).map(tag => ({
      property: tag.getAttribute('property'),
      content: tag.getAttribute('content')
    })))
    console.groupEnd()
  }
}
