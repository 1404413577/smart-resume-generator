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



  // 简化的分页逻辑：强制分页测试
  if (maxPages === 1) {
    // 单页模式：所有内容在一页
    const allSections = []

    if (props.resumeData.personalInfo.name) {
      allSections.push({ type: 'personalInfo', data: props.resumeData.personalInfo })
    }
    if (props.resumeData.summary) {
      allSections.push({ type: 'summary', data: props.resumeData.summary })
    }
    if (props.resumeData.workExperience.length > 0) {
      props.resumeData.workExperience.forEach(work => {
        allSections.push({ type: 'workExperience', data: work })
      })
    }
    if (props.resumeData.education.length > 0) {
      props.resumeData.education.forEach(edu => {
        allSections.push({ type: 'education', data: edu })
      })
    }
    if (props.resumeData.skills.length > 0) {
      allSections.push({ type: 'skills', data: props.resumeData.skills })
    }
    if (props.resumeData.projects.length > 0) {
      props.resumeData.projects.forEach(project => {
        allSections.push({ type: 'projects', data: project })
      })
    }

    pages.value = [allSections]
    return
  }

  // 多页模式：强制分页
  const page1 = []
  const page2 = []

  // 第1页：个人信息 + 简介 + 第一个工作经历
  if (props.resumeData.personalInfo.name) {
    page1.push({ type: 'personalInfo', data: props.resumeData.personalInfo })
  }
  if (props.resumeData.summary) {
    page1.push({ type: 'summary', data: props.resumeData.summary })
  }
  if (props.resumeData.workExperience.length > 0) {
    page1.push({ type: 'workExperience', data: props.resumeData.workExperience[0] })
  }

  // 第2页：剩余工作经历 + 教育 + 技能 + 项目
  if (props.resumeData.workExperience.length > 1) {
    for (let i = 1; i < props.resumeData.workExperience.length; i++) {
      page2.push({ type: 'workExperience', data: props.resumeData.workExperience[i] })
    }
  }
  if (props.resumeData.education.length > 0) {
    props.resumeData.education.forEach(edu => {
      page2.push({ type: 'education', data: edu })
    })
  }
  if (props.resumeData.skills.length > 0) {
    page2.push({ type: 'skills', data: props.resumeData.skills })
  }
  if (props.resumeData.projects.length > 0) {
    props.resumeData.projects.forEach(project => {
      page2.push({ type: 'projects', data: project })
    })
  }

  const newPages = [page1]
  if (page2.length > 0) {
    newPages.push(page2)
  }

  pages.value = newPages

}

// 监听数据变化
watch(
  [() => props.resumeData, pageSettings, pageMargin],
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
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

@media print {
  .multi-page-layout {
    padding: 0;
    background: white;
  }
}
</style>
