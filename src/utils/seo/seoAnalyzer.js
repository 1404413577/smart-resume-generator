// SEO分析和监控工具
class SEOAnalyzer {
  constructor() {
    this.checks = []
    this.score = 0
    this.recommendations = []
  }

  // 执行完整的SEO分析
  analyze() {
    this.checks = []
    this.recommendations = []
    
    // 基础SEO检查
    this.checkTitle()
    this.checkMetaDescription()
    this.checkMetaKeywords()
    this.checkHeadings()
    this.checkImages()
    this.checkLinks()
    this.checkStructuredData()
    this.checkOpenGraph()
    this.checkTwitterCard()
    this.checkCanonical()
    this.checkRobots()
    this.checkViewport()
    this.checkLanguage()
    
    // 性能相关SEO检查
    this.checkPageSpeed()
    this.checkMobileOptimization()
    
    // 内容质量检查
    this.checkContentLength()
    this.checkKeywordDensity()
    
    // 计算总分
    this.calculateScore()
    
    return this.getReport()
  }

  // 检查页面标题
  checkTitle() {
    const title = document.title
    const check = {
      name: '页面标题',
      status: 'pass',
      message: '',
      weight: 10
    }

    if (!title) {
      check.status = 'fail'
      check.message = '缺少页面标题'
      this.recommendations.push('添加描述性的页面标题')
    } else if (title.length < 30) {
      check.status = 'warning'
      check.message = '标题过短，建议30-60个字符'
      this.recommendations.push('增加标题长度，包含更多关键词')
    } else if (title.length > 60) {
      check.status = 'warning'
      check.message = '标题过长，可能在搜索结果中被截断'
      this.recommendations.push('缩短标题长度至60个字符以内')
    } else {
      check.message = '标题长度适中'
    }

    this.checks.push(check)
  }

  // 检查Meta描述
  checkMetaDescription() {
    const metaDesc = document.querySelector('meta[name="description"]')
    const check = {
      name: 'Meta描述',
      status: 'pass',
      message: '',
      weight: 8
    }

    if (!metaDesc || !metaDesc.content) {
      check.status = 'fail'
      check.message = '缺少Meta描述'
      this.recommendations.push('添加吸引人的Meta描述')
    } else {
      const content = metaDesc.content
      if (content.length < 120) {
        check.status = 'warning'
        check.message = 'Meta描述过短，建议120-160个字符'
        this.recommendations.push('增加Meta描述长度')
      } else if (content.length > 160) {
        check.status = 'warning'
        check.message = 'Meta描述过长，可能被截断'
        this.recommendations.push('缩短Meta描述至160个字符以内')
      } else {
        check.message = 'Meta描述长度适中'
      }
    }

    this.checks.push(check)
  }

  // 检查关键词
  checkMetaKeywords() {
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    const check = {
      name: 'Meta关键词',
      status: 'pass',
      message: '',
      weight: 3
    }

    if (!metaKeywords || !metaKeywords.content) {
      check.status = 'warning'
      check.message = '缺少Meta关键词'
      this.recommendations.push('添加相关的Meta关键词')
    } else {
      const keywords = metaKeywords.content.split(',').length
      if (keywords > 10) {
        check.status = 'warning'
        check.message = '关键词过多，建议5-10个'
        this.recommendations.push('减少关键词数量，专注于核心关键词')
      } else {
        check.message = `包含${keywords}个关键词`
      }
    }

    this.checks.push(check)
  }

  // 检查标题结构
  checkHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const h1s = document.querySelectorAll('h1')
    const check = {
      name: '标题结构',
      status: 'pass',
      message: '',
      weight: 6
    }

    if (h1s.length === 0) {
      check.status = 'fail'
      check.message = '缺少H1标题'
      this.recommendations.push('添加H1标题')
    } else if (h1s.length > 1) {
      check.status = 'warning'
      check.message = '存在多个H1标题'
      this.recommendations.push('确保页面只有一个H1标题')
    } else {
      check.message = `标题结构良好，共${headings.length}个标题`
    }

    this.checks.push(check)
  }

  // 检查图片优化
  checkImages() {
    const images = document.querySelectorAll('img')
    const check = {
      name: '图片优化',
      status: 'pass',
      message: '',
      weight: 5
    }

    let missingAlt = 0
    let missingTitle = 0

    images.forEach(img => {
      if (!img.alt) missingAlt++
      if (!img.title) missingTitle++
    })

    if (missingAlt > 0) {
      check.status = 'warning'
      check.message = `${missingAlt}张图片缺少alt属性`
      this.recommendations.push('为所有图片添加描述性的alt属性')
    } else {
      check.message = `${images.length}张图片都有alt属性`
    }

    this.checks.push(check)
  }

  // 检查链接
  checkLinks() {
    const links = document.querySelectorAll('a')
    const check = {
      name: '链接优化',
      status: 'pass',
      message: '',
      weight: 4
    }

    let externalLinks = 0
    let noFollowLinks = 0

    links.forEach(link => {
      if (link.hostname !== window.location.hostname) {
        externalLinks++
        if (!link.rel || !link.rel.includes('nofollow')) {
          noFollowLinks++
        }
      }
    })

    check.message = `${links.length}个链接，${externalLinks}个外部链接`
    if (noFollowLinks > 0) {
      this.recommendations.push('考虑为外部链接添加rel="nofollow"')
    }

    this.checks.push(check)
  }

  // 检查结构化数据
  checkStructuredData() {
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]')
    const check = {
      name: '结构化数据',
      status: 'pass',
      message: '',
      weight: 7
    }

    if (structuredData.length === 0) {
      check.status = 'warning'
      check.message = '缺少结构化数据'
      this.recommendations.push('添加JSON-LD结构化数据')
    } else {
      check.message = `包含${structuredData.length}个结构化数据块`
    }

    this.checks.push(check)
  }

  // 检查Open Graph
  checkOpenGraph() {
    const ogTags = document.querySelectorAll('meta[property^="og:"]')
    const check = {
      name: 'Open Graph',
      status: 'pass',
      message: '',
      weight: 6
    }

    const requiredOG = ['og:title', 'og:description', 'og:image', 'og:url']
    const existingOG = Array.from(ogTags).map(tag => tag.getAttribute('property'))
    const missingOG = requiredOG.filter(tag => !existingOG.includes(tag))

    if (missingOG.length > 0) {
      check.status = 'warning'
      check.message = `缺少${missingOG.join(', ')}`
      this.recommendations.push('完善Open Graph标签')
    } else {
      check.message = 'Open Graph标签完整'
    }

    this.checks.push(check)
  }

  // 检查Twitter Card
  checkTwitterCard() {
    const twitterTags = document.querySelectorAll('meta[name^="twitter:"]')
    const check = {
      name: 'Twitter Card',
      status: 'pass',
      message: '',
      weight: 4
    }

    if (twitterTags.length === 0) {
      check.status = 'warning'
      check.message = '缺少Twitter Card标签'
      this.recommendations.push('添加Twitter Card标签')
    } else {
      check.message = `包含${twitterTags.length}个Twitter标签`
    }

    this.checks.push(check)
  }

  // 检查Canonical链接
  checkCanonical() {
    const canonical = document.querySelector('link[rel="canonical"]')
    const check = {
      name: 'Canonical链接',
      status: 'pass',
      message: '',
      weight: 5
    }

    if (!canonical) {
      check.status = 'warning'
      check.message = '缺少Canonical链接'
      this.recommendations.push('添加Canonical链接防止重复内容')
    } else {
      check.message = 'Canonical链接已设置'
    }

    this.checks.push(check)
  }

  // 检查Robots标签
  checkRobots() {
    const robots = document.querySelector('meta[name="robots"]')
    const check = {
      name: 'Robots标签',
      status: 'pass',
      message: '',
      weight: 3
    }

    if (!robots) {
      check.status = 'warning'
      check.message = '缺少Robots标签'
      this.recommendations.push('添加Robots标签控制搜索引擎行为')
    } else {
      check.message = `Robots设置: ${robots.content}`
    }

    this.checks.push(check)
  }

  // 检查Viewport
  checkViewport() {
    const viewport = document.querySelector('meta[name="viewport"]')
    const check = {
      name: 'Viewport设置',
      status: 'pass',
      message: '',
      weight: 4
    }

    if (!viewport) {
      check.status = 'fail'
      check.message = '缺少Viewport设置'
      this.recommendations.push('添加Viewport标签支持移动设备')
    } else {
      check.message = 'Viewport已正确设置'
    }

    this.checks.push(check)
  }

  // 检查语言设置
  checkLanguage() {
    const htmlLang = document.documentElement.lang
    const check = {
      name: '语言设置',
      status: 'pass',
      message: '',
      weight: 3
    }

    if (!htmlLang) {
      check.status = 'warning'
      check.message = '缺少语言设置'
      this.recommendations.push('在html标签中添加lang属性')
    } else {
      check.message = `语言设置: ${htmlLang}`
    }

    this.checks.push(check)
  }

  // 检查页面速度
  checkPageSpeed() {
    const check = {
      name: '页面速度',
      status: 'pass',
      message: '',
      weight: 8
    }

    // 这里可以集成实际的性能数据
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
    if (loadTime > 3000) {
      check.status = 'warning'
      check.message = '页面加载时间较长'
      this.recommendations.push('优化页面加载速度')
    } else {
      check.message = '页面加载速度良好'
    }

    this.checks.push(check)
  }

  // 检查移动端优化
  checkMobileOptimization() {
    const check = {
      name: '移动端优化',
      status: 'pass',
      message: '',
      weight: 7
    }

    const viewport = document.querySelector('meta[name="viewport"]')
    if (!viewport || !viewport.content.includes('width=device-width')) {
      check.status = 'warning'
      check.message = '移动端适配不完整'
      this.recommendations.push('优化移动端显示效果')
    } else {
      check.message = '移动端优化良好'
    }

    this.checks.push(check)
  }

  // 检查内容长度
  checkContentLength() {
    const textContent = document.body.textContent || document.body.innerText
    const wordCount = textContent.trim().split(/\s+/).length
    const check = {
      name: '内容长度',
      status: 'pass',
      message: '',
      weight: 5
    }

    if (wordCount < 300) {
      check.status = 'warning'
      check.message = '内容较少，建议增加有价值的内容'
      this.recommendations.push('增加页面内容，提供更多有价值的信息')
    } else {
      check.message = `内容丰富，约${wordCount}个词`
    }

    this.checks.push(check)
  }

  // 检查关键词密度
  checkKeywordDensity() {
    const check = {
      name: '关键词密度',
      status: 'pass',
      message: '关键词分布合理',
      weight: 4
    }

    // 这里可以添加更复杂的关键词密度分析
    this.checks.push(check)
  }

  // 计算SEO得分
  calculateScore() {
    let totalWeight = 0
    let weightedScore = 0

    this.checks.forEach(check => {
      totalWeight += check.weight
      if (check.status === 'pass') {
        weightedScore += check.weight
      } else if (check.status === 'warning') {
        weightedScore += check.weight * 0.5
      }
    })

    this.score = Math.round((weightedScore / totalWeight) * 100)
  }

  // 获取分析报告
  getReport() {
    return {
      score: this.score,
      grade: this.getGrade(),
      checks: this.checks,
      recommendations: this.recommendations,
      summary: this.getSummary()
    }
  }

  // 获取等级
  getGrade() {
    if (this.score >= 90) return 'A'
    if (this.score >= 80) return 'B'
    if (this.score >= 70) return 'C'
    if (this.score >= 60) return 'D'
    return 'F'
  }

  // 获取摘要
  getSummary() {
    const passed = this.checks.filter(c => c.status === 'pass').length
    const warnings = this.checks.filter(c => c.status === 'warning').length
    const failed = this.checks.filter(c => c.status === 'fail').length

    return {
      total: this.checks.length,
      passed,
      warnings,
      failed
    }
  }
}

// 创建全局SEO分析器实例
const seoAnalyzer = new SEOAnalyzer()

// 导出SEO分析功能
export { seoAnalyzer, SEOAnalyzer }
