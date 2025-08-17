<template>
  <div class="paged-template" :class="templateClass">
    <!-- 个人信息 -->
    <section v-if="shouldShowSection('personalInfo')" class="section personal-info-section">
      <slot name="personalInfo" :data="resumeData.personalInfo" />
    </section>

    <!-- 个人简介 -->
    <section v-if="shouldShowSection('summary')" class="section summary-section">
      <slot name="summary" :data="resumeData.summary" />
    </section>

    <!-- 工作经历 -->
    <template v-if="shouldShowSection('workExperience')">
      <section 
        v-for="work in getPageContent('workExperience')" 
        :key="work.id"
        class="section work-section"
      >
        <slot name="workExperience" :data="work" :isFirst="isFirstWorkItem(work)" />
      </section>
    </template>

    <!-- 教育背景 -->
    <template v-if="shouldShowSection('education')">
      <section 
        v-for="edu in getPageContent('education')" 
        :key="edu.id"
        class="section education-section"
      >
        <slot name="education" :data="edu" :isFirst="isFirstEducationItem(edu)" />
      </section>
    </template>

    <!-- 技能特长 -->
    <section v-if="shouldShowSection('skills')" class="section skills-section">
      <slot name="skills" :data="getPageContent('skills')" />
    </section>

    <!-- 项目经历 -->
    <template v-if="shouldShowSection('projects')">
      <section 
        v-for="project in getPageContent('projects')" 
        :key="project.id"
        class="section projects-section"
      >
        <slot name="projects" :data="project" :isFirst="isFirstProjectItem(project)" />
      </section>
    </template>

    <!-- 自定义模块 -->
    <template v-if="shouldShowSection('customModules')">
      <section 
        v-for="module in getPageContent('customModules')" 
        :key="module.id"
        class="section custom-module-section"
      >
        <slot name="customModule" :data="module" />
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

// 检查当前页面是否应该显示某个章节
const shouldShowSection = (sectionType) => {
  if (props.isSinglePage) {
    // 单页模式：显示所有有内容的章节
    switch (sectionType) {
      case 'personalInfo':
        return props.resumeData.personalInfo.name
      case 'summary':
        return props.resumeData.summary
      case 'workExperience':
        return props.resumeData.workExperience.length > 0
      case 'education':
        return props.resumeData.education.length > 0
      case 'skills':
        return props.resumeData.skills.length > 0
      case 'projects':
        return props.resumeData.projects.length > 0
      case 'customModules':
        return props.resumeData.customModules?.length > 0
      default:
        return false
    }
  } else {
    // 多页模式：只显示分配给当前页面的章节
    return props.pageContent.some(section => section.type === sectionType)
  }
}

// 获取当前页面的章节内容
const getPageContent = (sectionType) => {
  if (props.isSinglePage) {
    // 单页模式：返回所有内容
    switch (sectionType) {
      case 'workExperience':
        return props.resumeData.workExperience
      case 'education':
        return props.resumeData.education
      case 'skills':
        return props.resumeData.skills
      case 'projects':
        return props.resumeData.projects
      case 'customModules':
        return props.resumeData.customModules || []
      default:
        return []
    }
  } else {
    // 多页模式：只返回分配给当前页面的内容
    const sections = props.pageContent.filter(section => section.type === sectionType)
    if (sectionType === 'skills') {
      // 技能章节返回所有技能数据
      return sections.length > 0 ? sections[0].data : []
    }
    return sections.map(section => section.data)
  }
}

// 检查是否是第一个工作项目（用于显示章节标题）
const isFirstWorkItem = (work) => {
  if (props.isSinglePage) {
    return props.resumeData.workExperience[0]?.id === work.id
  } else {
    const workSections = props.pageContent.filter(section => section.type === 'workExperience')
    return workSections[0]?.data?.id === work.id
  }
}

// 检查是否是第一个教育项目
const isFirstEducationItem = (edu) => {
  if (props.isSinglePage) {
    return props.resumeData.education[0]?.id === edu.id
  } else {
    const eduSections = props.pageContent.filter(section => section.type === 'education')
    return eduSections[0]?.data?.id === edu.id
  }
}

// 检查是否是第一个项目
const isFirstProjectItem = (project) => {
  if (props.isSinglePage) {
    return props.resumeData.projects[0]?.id === project.id
  } else {
    const projectSections = props.pageContent.filter(section => section.type === 'projects')
    return projectSections[0]?.data?.id === project.id
  }
}
</script>

<style scoped>
.paged-template {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: var(--resume-font-family, 'Times New Roman', Times, serif);
  font-size: var(--resume-base-font-size, 14px);
  line-height: var(--resume-line-height, 1.5);
  color: #333;
}

.section {
  margin-bottom: var(--resume-module-spacing, 12px);
  flex-shrink: 0;
}

.section:last-child {
  margin-bottom: 0;
}

/* 确保内容不超出页面 */
.personal-info-section {
  flex-shrink: 0;
}

.summary-section,
.work-section,
.education-section,
.skills-section,
.projects-section,
.custom-module-section {
  flex-shrink: 0;
  overflow: hidden;
}
</style>
