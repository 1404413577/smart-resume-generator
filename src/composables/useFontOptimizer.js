import { watch } from 'vue'
import { useResumeStore } from '@stores/resume'

/**
 * 动态字体优化 Hook
 * 通过 Google Fonts 的 text 参数实现极小化子集生成
 * 彻底解决中文字体包过大（MB级）导致的加载缓慢问题
 */
export function useFontOptimizer() {
  const resumeStore = useResumeStore()

  // 提取简历中出现的所有非空字符
  const extractUsedCharacters = () => {
    const data = resumeStore.resumeData
    let text = ''

    // 个人信息
    text += data.personalInfo?.name || ''
    text += data.personalInfo?.targetPosition || ''
    
    // 总结
    text += data.summary || ''
    
    // 工作经历
    data.workExperience?.forEach(work => {
      text += work.company || ''
      text += work.jobTitle || ''
      text += work.responsibilities?.join('') || ''
    })

    // 教育经历
    data.education?.forEach(edu => {
      text += edu.school || ''
      text += edu.major || ''
    })

    // 技能
    data.skills?.forEach(skill => {
      text += skill.name || ''
    })

    // 去重并按字符排序
    const uniqueChars = Array.from(new Set(text))
      .filter(char => char.trim().length > 0)
      .sort()
      .join('')

    return encodeURIComponent(uniqueChars)
  }

  // 更新 DOM 中的字体链接
  const updateFontLink = () => {
    const chars = extractUsedCharacters()
    if (!chars) return

    // 如果字符数太少，可能在加载中
    if (decodeURIComponent(chars).length < 2) return

    const fontId = 'dynamic-subset-font'
    let link = document.getElementById(fontId)

    // 我们以“思源宋体” (Noto Serif SC) 为例，如果简历中有设置
    // 注意：这里可以根据 templateSettings 里的字体动态调整
    const fontFamily = 'Noto+Serif+SC:wght@400;700'
    const newHref = `https://fonts.googleapis.com/css2?family=${fontFamily}&text=${chars}&display=swap`

    if (!link) {
      link = document.createElement('link')
      link.id = fontId
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }

    // 只有在 Href 发生显著变化时才更新，避免频繁抖动
    if (link.href !== newHref) {
      link.href = newHref
      console.log('字体子集已动态更新，包含字符数:', decodeURIComponent(chars).length)
    }
  }

  // 监听简历数据变化，防抖更新
  let timeout = null
  watch(
    () => resumeStore.resumeData,
    () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(updateFontLink, 3000) // 采样率不要太高
    },
    { deep: true, immediate: true }
  )

  return {
    updateFontLink
  }
}
