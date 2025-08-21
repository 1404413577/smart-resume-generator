// 多页简历管理器
import { ref, computed } from 'vue'

/**
 * 多页简历管理器
 * 负责内容分页、页面布局和智能分配
 */
export class MultiPageManager {
  constructor(resumeData, pageSettings) {
    this.resumeData = resumeData
    this.pageSettings = pageSettings
    this.pages = ref([])
    this.currentPage = ref(1)
    this.totalPages = ref(1)
  }

  /**
   * 分析内容并生成页面布局
   */
  generatePages() {
    const { pageCount, pagingMode } = this.pageSettings
    const sections = this.getSortedSections()
    
    if (pageCount === 1) {
      // 单页模式
      this.pages.value = [{ sections, pageNumber: 1 }]
      this.totalPages.value = 1
      return this.pages.value
    }

    if (pagingMode === 'auto') {
      return this.autoGeneratePages(sections, pageCount)
    } else {
      return this.manualGeneratePages(sections)
    }
  }

  /**
   * 获取排序后的章节
   */
  getSortedSections() {
    const sectionOrder = [
      'personalInfo',
      'summary', 
      'education',
      'workExperience',
      'projects',
      'skills',
      'certifications',
      'languages'
    ]

    return sectionOrder.map(sectionKey => ({
      key: sectionKey,
      data: this.resumeData[sectionKey],
      priority: this.getSectionPriority(sectionKey),
      estimatedHeight: this.estimateSectionHeight(sectionKey)
    })).filter(section => this.shouldIncludeSection(section))
  }

  /**
   * 获取章节优先级（用于分页决策）
   */
  getSectionPriority(sectionKey) {
    const priorities = {
      personalInfo: 10,  // 必须在第一页
      summary: 9,
      workExperience: 8,
      projects: 7,
      education: 6,
      skills: 5,
      certifications: 4,
      languages: 3
    }
    return priorities[sectionKey] || 1
  }

  /**
   * 估算章节高度（用于分页计算）
   */
  estimateSectionHeight(sectionKey) {
    const data = this.resumeData[sectionKey]
    
    if (!data) return 0

    switch (sectionKey) {
      case 'personalInfo':
        return 120 // 固定高度
      case 'summary':
        return data ? Math.max(60, data.length * 0.8) : 0
      case 'workExperience':
        return Array.isArray(data) ? data.length * 150 : 0
      case 'projects':
        return Array.isArray(data) ? data.length * 120 : 0
      case 'education':
        return Array.isArray(data) ? data.length * 100 : 0
      case 'skills':
        return Array.isArray(data) ? Math.min(150, data.length * 25) : 0
      case 'certifications':
        return Array.isArray(data) ? data.length * 40 : 0
      case 'languages':
        return Array.isArray(data) ? data.length * 30 : 0
      default:
        return 80
    }
  }

  /**
   * 判断是否应该包含该章节
   */
  shouldIncludeSection(section) {
    const { key, data } = section
    
    if (key === 'personalInfo') return true
    if (key === 'summary') return data && data.trim().length > 0
    if (Array.isArray(data)) return data.length > 0
    
    return false
  }

  /**
   * 自动分页生成
   */
  autoGeneratePages(sections, maxPages) {
    const pages = []
    const pageHeight = 1000 // A4页面可用高度（像素）
    let currentPageSections = []
    let currentPageHeight = 0
    let pageNumber = 1

    // 第一页必须包含个人信息
    const personalInfoSection = sections.find(s => s.key === 'personalInfo')
    if (personalInfoSection) {
      currentPageSections.push(personalInfoSection)
      currentPageHeight += personalInfoSection.estimatedHeight
    }

    // 分配其他章节
    const remainingSections = sections.filter(s => s.key !== 'personalInfo')
    
    for (const section of remainingSections) {
      const sectionHeight = section.estimatedHeight
      
      // 检查是否需要分页
      if (currentPageHeight + sectionHeight > pageHeight && currentPageSections.length > 0) {
        // 创建新页面
        pages.push({
          sections: [...currentPageSections],
          pageNumber,
          estimatedHeight: currentPageHeight
        })
        
        pageNumber++
        if (pageNumber > maxPages) break
        
        currentPageSections = []
        currentPageHeight = 0
      }
      
      currentPageSections.push(section)
      currentPageHeight += sectionHeight
    }

    // 添加最后一页
    if (currentPageSections.length > 0 && pageNumber <= maxPages) {
      pages.push({
        sections: [...currentPageSections],
        pageNumber,
        estimatedHeight: currentPageHeight
      })
    }

    this.pages.value = pages
    this.totalPages.value = pages.length
    return pages
  }

  /**
   * 手动分页生成（基于用户设置的分页点）
   */
  manualGeneratePages(sections) {
    const { pageBreaks } = this.pageSettings
    const pages = []
    let currentPageSections = []
    let pageNumber = 1

    for (const section of sections) {
      currentPageSections.push(section)
      
      // 检查是否有手动分页点
      if (pageBreaks.includes(section.key)) {
        pages.push({
          sections: [...currentPageSections],
          pageNumber,
          isManualBreak: true
        })
        pageNumber++
        currentPageSections = []
      }
    }

    // 添加最后一页
    if (currentPageSections.length > 0) {
      pages.push({
        sections: [...currentPageSections],
        pageNumber
      })
    }

    this.pages.value = pages
    this.totalPages.value = pages.length
    return pages
  }

  /**
   * 获取指定页面的内容
   */
  getPageContent(pageNumber) {
    return this.pages.value.find(page => page.pageNumber === pageNumber)
  }

  /**
   * 添加手动分页点
   */
  addPageBreak(afterSection) {
    const pageBreaks = [...this.pageSettings.pageBreaks]
    if (!pageBreaks.includes(afterSection)) {
      pageBreaks.push(afterSection)
      this.pageSettings.pageBreaks = pageBreaks
      this.generatePages() // 重新生成页面
    }
  }

  /**
   * 移除手动分页点
   */
  removePageBreak(afterSection) {
    const pageBreaks = this.pageSettings.pageBreaks.filter(bp => bp !== afterSection)
    this.pageSettings.pageBreaks = pageBreaks
    this.generatePages() // 重新生成页面
  }

  /**
   * 检查内容是否溢出，建议使用多页
   */
  analyzeContentOverflow() {
    const totalHeight = this.getSortedSections().reduce((sum, section) => {
      return sum + section.estimatedHeight
    }, 0)

    const singlePageLimit = 1000
    const isOverflowing = totalHeight > singlePageLimit
    const suggestedPages = Math.min(3, Math.ceil(totalHeight / singlePageLimit))

    return {
      isOverflowing,
      totalHeight,
      suggestedPages,
      recommendation: isOverflowing ? 
        `建议使用 ${suggestedPages} 页布局以完整展示所有内容` : 
        '当前内容适合单页布局'
    }
  }

  /**
   * 获取分页统计信息
   */
  getPageStats() {
    return {
      totalPages: this.totalPages.value,
      currentPage: this.currentPage.value,
      pages: this.pages.value.map(page => ({
        pageNumber: page.pageNumber,
        sectionCount: page.sections.length,
        sections: page.sections.map(s => s.key),
        estimatedHeight: page.estimatedHeight
      }))
    }
  }
}

/**
 * 创建多页管理器实例
 */
export function createMultiPageManager(resumeData, pageSettings) {
  return new MultiPageManager(resumeData, pageSettings)
}
