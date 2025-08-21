<template>
  <div class="multi-page-layout">
    <PageContainer
      v-for="(page, index) in pages"
      :key="index"
      :page-number="index + 1"
      :total-pages="pages.length"
      :is-last-page="index === pages.length - 1"
      :is-print-mode="isPrintMode"
    >
      <component
        :is="props.templateComponent"
        :resume-data="props.resumeData"
        :page-content="page"
        :page-number="index + 1"
        :is-single-page="false"
      />
    </PageContainer>
  </div>
</template>

<script setup>
import { computed, watch, ref, nextTick } from 'vue'
import { useResumeStore } from '../stores/resume'
import PageContainer from './PageContainer.vue'

const props = defineProps({
  templateComponent: {
    type: Object,
    required: true
  },
  resumeData: {
    type: Object,
    required: true
  },
  isPrintMode: {
    type: Boolean,
    default: false
  }
})

const resumeStore = useResumeStore()

// 响应式数据
const pages = ref([])

// 计算属性
const pageSettings = computed(() => resumeStore.globalSettings.pageSettings)
const pageMargin = computed(() => resumeStore.globalSettings.spacing.pageMargin)

// A4页面内容区域高度（毫米）
const getContentHeight = () => {
  const A4_HEIGHT = 297
  return A4_HEIGHT - pageMargin.value.top - pageMargin.value.bottom
}

// 将简历内容分配到多个页面
const distributeContent = () => {
  const maxPages = pageSettings.value.pageCount
  const sectionOrder = resumeStore.sectionOrder

  // 根据排序生成所有章节数据
  const generateSectionsFromOrder = () => {
    const sections = []

    sectionOrder.forEach(sectionType => {
      switch (sectionType) {
        case 'personalInfo':
          if (props.resumeData.personalInfo.name) {
            sections.push({ type: 'personalInfo', data: props.resumeData.personalInfo })
          }
          break
        case 'summary':
          if (props.resumeData.summary) {
            sections.push({ type: 'summary', data: props.resumeData.summary })
          }
          break
        case 'workExperience':
          if (props.resumeData.workExperience.length > 0) {
            props.resumeData.workExperience.forEach(work => {
              sections.push({ type: 'workExperience', data: work })
            })
          }
          break
        case 'education':
          if (props.resumeData.education.length > 0) {
            props.resumeData.education.forEach(edu => {
              sections.push({ type: 'education', data: edu })
            })
          }
          break
        case 'skills':
          if (props.resumeData.skills.length > 0) {
            sections.push({ type: 'skills', data: props.resumeData.skills })
          }
          break
        case 'projects':
          if (props.resumeData.projects.length > 0) {
            props.resumeData.projects.forEach(project => {
              sections.push({ type: 'projects', data: project })
            })
          }
          break
      }
    })

    return sections
  }

  const allSections = generateSectionsFromOrder()

  if (maxPages === 1) {
    // 单页模式：所有内容在一页
    pages.value = [allSections]
    return
  }

  // 多页模式：智能分配内容
  const newPages = []
  let currentPage = []
  let sectionsPerPage = Math.ceil(allSections.length / maxPages)

  allSections.forEach((section, index) => {
    currentPage.push(section)

    // 检查是否需要创建新页面
    if (currentPage.length >= sectionsPerPage && newPages.length < maxPages - 1) {
      newPages.push([...currentPage])
      currentPage = []
      // 重新计算剩余章节的分配
      const remainingSections = allSections.length - (index + 1)
      const remainingPages = maxPages - newPages.length
      if (remainingPages > 0) {
        sectionsPerPage = Math.ceil(remainingSections / remainingPages)
      }
    }
  })

  // 添加最后一页
  if (currentPage.length > 0) {
    newPages.push(currentPage)
  }

  // 确保至少有一页
  if (newPages.length === 0) {
    newPages.push([])
  }

  pages.value = newPages
}

// 监听数据变化
watch(
  [() => props.resumeData, pageSettings, pageMargin, () => resumeStore.sectionOrder],
  () => {
    nextTick(() => {
      distributeContent()
    })
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
.multi-page-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  background: transparent;
  width: 100%;
}

@media print {
  .multi-page-layout {
    padding: 0;
    background: white;
  }
}
</style>
