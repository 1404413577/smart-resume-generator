<template>
  <div class="ordered-template" :class="templateClass">
    <!-- 动态渲染排序后的章节 -->
    <template v-for="sectionKey in orderedSectionKeys" :key="sectionKey">
      <!-- 个人信息 -->
      <section v-if="sectionKey === 'personalInfo' && shouldShowSection('personalInfo')" class="section personal-info-section">
        <slot name="personalInfo" :data="resumeData.personalInfo" />
      </section>

      <!-- 个人简介 -->
      <section v-else-if="sectionKey === 'summary' && shouldShowSection('summary')" class="section summary-section">
        <slot name="summary" :data="resumeData.summary" />
      </section>

      <!-- 工作经历 -->
      <section v-else-if="sectionKey === 'workExperience' && shouldShowSection('workExperience')" class="section work-experience-section">
        <slot name="workExperience" :data="resumeData.workExperience" />
      </section>

      <!-- 教育背景 -->
      <section v-else-if="sectionKey === 'education' && shouldShowSection('education')" class="section education-section">
        <slot name="education" :data="resumeData.education" />
      </section>

      <!-- 技能特长 -->
      <section v-else-if="sectionKey === 'skills' && shouldShowSection('skills')" class="section skills-section">
        <slot name="skills" :data="resumeData.skills" />
      </section>

      <!-- 项目经历 -->
      <section v-else-if="sectionKey === 'projects' && shouldShowSection('projects')" class="section projects-section">
        <slot name="projects" :data="resumeData.projects" />
      </section>

      <!-- 证书认证 -->
      <section v-else-if="sectionKey === 'certifications' && shouldShowSection('certifications')" class="section certifications-section">
        <slot name="certifications" :data="resumeData.certifications" />
      </section>

      <!-- 语言能力 -->
      <section v-else-if="sectionKey === 'languages' && shouldShowSection('languages')" class="section languages-section">
        <slot name="languages" :data="resumeData.languages" />
      </section>

      <!-- 自定义模块 -->
      <template v-else-if="sectionKey === 'customModules' && shouldShowSection('customModules')">
        <section
          v-for="module in getPageContent('customModules')"
          :key="module.id"
          class="section custom-module-section"
        >
          <slot name="customModule" :data="module" />
        </section>
      </template>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '@stores/resume'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  pageContent: {
    type: Array,
    default: () => []
  },
  pageNumber: {
    type: Number,
    default: 1
  },
  isSinglePage: {
    type: Boolean,
    default: true
  },
  templateClass: {
    type: String,
    default: ''
  }
})

const resumeStore = useResumeStore()

// 获取排序后的章节键
const orderedSectionKeys = computed(() => {
  return resumeStore.sectionOrder || [
    'personalInfo',
    'summary',
    'education',
    'workExperience',
    'skills',
    'projects',
    'certifications',
    'languages'
  ]
})

// 判断章节是否应该显示
const shouldShowSection = (sectionKey) => {
  // 检查章节配置中的可见性
  const sectionConfig = resumeStore.sectionConfig[sectionKey]
  if (!sectionConfig || !sectionConfig.visible) {
    return false
  }

  // 检查是否有数据
  const data = props.resumeData[sectionKey]
  
  if (sectionKey === 'personalInfo') {
    // 个人信息总是显示（如果可见）
    return true
  } else if (sectionKey === 'summary') {
    // 个人简介有内容时显示
    return data && data.trim().length > 0
  } else if (Array.isArray(data)) {
    // 数组类型的数据有内容时显示
    return data.length > 0
  }
  
  return false
}

// 获取页面内容（用于多页模式）
const getPageContent = (sectionKey) => {
  if (props.pageContent && props.pageContent.length > 0) {
    return props.pageContent.filter(item => item.section === sectionKey)
  }
  
  // 单页模式返回所有数据
  return props.resumeData[sectionKey] || []
}
</script>

<style scoped>
.ordered-template {
  width: 100%;
  min-height: 100%;
}

.section {
  margin-bottom: 20px;
}

.section:last-child {
  margin-bottom: 0;
}

/* 基础章节样式 */
.personal-info-section {
  margin-bottom: 30px;
}

.summary-section {
  margin-bottom: 25px;
}

.work-experience-section,
.education-section,
.skills-section,
.projects-section,
.certifications-section,
.languages-section {
  margin-bottom: 25px;
}

.custom-module-section {
  margin-bottom: 20px;
}

/* 响应式设计 */
@media print {
  .section {
    break-inside: avoid;
    margin-bottom: 15px;
  }
}
</style>
