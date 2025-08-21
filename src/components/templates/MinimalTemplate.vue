<template>
  <PagedTemplateBase
    :resume-data="props.resumeData"
    :page-content="props.pageContent"
    :page-number="props.pageNumber"
    :is-single-page="props.isSinglePage"
    template-class="minimal-template"
  >
    <!-- 个人信息插槽 -->
    <template #personalInfo="{ data }">
      <header class="resume-header">
        <h1 class="name">{{ data.name || '姓名' }}</h1>
        <h2 v-if="data.targetPosition" class="target-position">{{ data.targetPosition }}</h2>
        <div class="contact-info">
          <span v-if="data.email" class="contact-item">{{ data.email }}</span>
          <span v-if="data.phone" class="contact-item">{{ data.phone }}</span>
          <span v-if="data.address" class="contact-item">{{ data.address }}</span>
          <span v-if="data.website" class="contact-item link-item">
            <span class="link-label">网站:</span>
            <span class="link-url">{{ data.website }}</span>
          </span>
          <span v-if="data.linkedin" class="contact-item link-item">
            <span class="link-label">LinkedIn:</span>
            <span class="link-url">{{ data.linkedin }}</span>
          </span>
          <span v-if="data.github" class="contact-item link-item">
            <span class="link-label">GitHub:</span>
            <span class="link-url">{{ data.github }}</span>
          </span>
          <!-- 自定义字段 -->
          <span
            v-for="field in data.customFields"
            :key="field.id"
            class="contact-item custom-field link-item"
          >
            <span class="link-label">{{ field.name }}:</span>
            <span class="link-url">{{ field.value }}</span>
          </span>
        </div>
      </header>
    </template>

    <!-- 个人简介插槽 -->
    <template #summary="{ data }">
      <div class="section-content">
        <p class="summary-text">{{ data }}</p>
      </div>
    </template>

    <!-- 工作经历插槽 -->
    <template #workExperience="{ data, isFirst }">
      <h2 v-if="isFirst" class="section-title">Experience</h2>
      <div class="section-content">
        <div class="item">
          <div class="item-header">
            <div class="item-title">
              <h3>{{ data.jobTitle }}</h3>
              <span class="company">{{ data.company }}</span>
            </div>
            <div class="item-meta">
              <span class="period">{{ data.startDate }} - {{ data.current ? 'Present' : data.endDate }}</span>
              <span v-if="data.location" class="location">{{ data.location }}</span>
            </div>
          </div>
          <ul v-if="data.responsibilities && data.responsibilities.length > 0" class="responsibilities">
            <li v-for="(responsibility, index) in data.responsibilities" :key="index">
              {{ responsibility }}
            </li>
          </ul>
        </div>
      </div>
    </template>

    <!-- 教育背景插槽 -->
    <template #education="{ data, isFirst }">
      <h2 v-if="isFirst" class="section-title">Education</h2>
      <div class="section-content">
        <div class="item">
          <div class="item-header">
            <div class="item-title">
              <h3>{{ data.degree }}</h3>
              <span class="institution">{{ data.school }}</span>
            </div>
            <div class="item-meta">
              <span class="period">{{ data.endDate }}</span>
            </div>
          </div>
          <div class="item-details">
            <span v-if="data.major" class="detail-item">专业: {{ data.major }}</span>
            <span v-if="data.gpa" class="detail-item">GPA: {{ data.gpa }}</span>
            <span v-if="data.honors" class="detail-item">{{ data.honors }}</span>
            <div v-if="data.description" class="course-description">
              <span class="courses-label">课程描述: </span>
              <span class="courses-content">{{ data.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 技能特长插槽 -->
    <template #skills="{ data }">
      <h2 class="section-title">Skills</h2>
      <div class="section-content">
        <div v-for="category in getSkillCategories(data)" :key="category.key" class="skill-group">
          <h3 class="skill-group-title">{{ category.name }}</h3>
          <div class="skills-list">
            {{ category.skills.map(skill => skill.name).join(', ') }}
          </div>
        </div>
      </div>
    </template>

    <!-- 项目经历插槽 -->
    <template #projects="{ data, isFirst }">
      <h2 v-if="isFirst" class="section-title">Projects</h2>
      <div class="section-content">
        <div class="item">
          <div class="item-header">
            <div class="item-title">
              <h3>{{ data.name }}</h3>
              <span v-if="data.url" class="project-link">{{ data.url }}</span>
            </div>
            <div class="item-meta">
              <span class="period">{{ data.startDate }} - {{ data.endDate }}</span>
            </div>
          </div>
          <p v-if="data.description" class="project-description">{{ data.description }}</p>
          <div v-if="data.technologies && data.technologies.length > 0" class="technologies">
            <span v-for="tech in data.technologies" :key="tech" class="tech-item">{{ tech }}</span>
          </div>
        </div>
      </div>
    </template>
  </PagedTemplateBase>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '../../stores/resume'
import PagedTemplateBase from './PagedTemplateBase.vue'

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
  }
})

const resumeStore = useResumeStore()

// 技能分类
const skillCategories = [
  { key: 'technical', name: 'Technical Skills' },
  { key: 'soft', name: 'Soft Skills' },
  { key: 'language', name: 'Languages' }
]

const getSkillCategories = (skills) => {
  return skillCategories.map(category => ({
    ...category,
    skills: skills.filter(skill => skill.category === category.key)
  })).filter(category => category.skills.length > 0)
}
</script>

<style scoped>
.minimal-template {
  font-family: var(--resume-font-family, 'Helvetica Neue', Arial, sans-serif);
  font-size: var(--resume-base-font-size, 14px);
  line-height: var(--resume-line-height, 1.6);
  color: #333;
  max-width: 210mm;
  margin: 0 auto;
  padding: var(--resume-page-margin-top, 20px) var(--resume-page-margin-right, 20px) var(--resume-page-margin-bottom, 20px) var(--resume-page-margin-left, 20px);
  background: white;
}

/* 头部样式 */
.resume-header {
  text-align: center;
  margin-bottom: var(--resume-module-spacing, 30px);
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.name {
  font-size: var(--resume-name-font-size, 28px);
  font-weight: 300;
  margin: 0 0 8px 0;
  color: #2c3e50;
  letter-spacing: 1px;
}

.target-position {
  font-size: var(--resume-target-position-font-size, 16px);
  font-weight: 400;
  margin: 0 0 15px 0;
  color: #666;
  font-style: italic;
  text-align: center;
}

.contact-info {
  font-size: var(--resume-contact-font-size, 14px);
  color: #666;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.contact-item {
  position: relative;
}

.contact-item:not(:last-child)::after {
  content: '•';
  position: absolute;
  right: -12px;
  color: #ccc;
}

.custom-field {
  font-weight: 500;
  color: #555;
}

.link-item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px;
}

.link-label {
  font-weight: 600;
  color: #333;
}

.link-url {
  font-family: 'Courier New', monospace;
  font-size: var(--resume-small-font-size, 13px);
  color: #666;
  word-break: break-all;
  font-weight: 400;
}

/* 章节样式 */
.section {
  margin-bottom: var(--resume-module-spacing, 25px);
}

.section-title {
  font-size: var(--resume-title-font-size, 18px);
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 15px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.section-content {
  padding-left: 0;
}

/* 个人简介 */
.summary-text {
  font-size: var(--resume-content-font-size, 15px);
  line-height: var(--resume-line-height, 1.6);
  margin: 0;
  color: #555;
  font-weight: 300;
}

/* 通用项目样式 */
.item {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  page-break-inside: avoid;
}

.item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 20px;
}

.item-title {
  flex: 1;
}

.item-title h3 {
  font-size: var(--resume-subtitle-font-size, 16px);
  font-weight: 600;
  margin: 0 0 2px 0;
  color: #333;
}

.company,
.institution,
.issuer {
  font-size: var(--resume-content-font-size, 14px);
  color: #666;
  font-weight: 400;
}

.project-link {
  font-size: var(--resume-meta-font-size, 13px);
  color: #888;
  font-style: italic;
}

.item-meta {
  text-align: right;
  font-size: var(--resume-meta-font-size, 13px);
  color: #888;
  min-width: 120px;
}

.period {
  display: block;
  font-weight: 500;
}

.location {
  display: block;
  font-size: var(--resume-small-font-size, 12px);
  margin-top: 2px;
}

/* 详细信息 */
.item-details {
  margin: 8px 0;
}

.responsibilities {
  list-style: none;
  padding: 0;
  margin: 8px 0;
}

.responsibilities li {
  position: relative;
  padding-left: 15px;
  margin-bottom: 4px;
  line-height: var(--resume-line-height, 1.4);
  color: #555;
}

.responsibilities li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #999;
}

.detail-item {
  display: inline-block;
  margin-right: 15px;
  font-size: var(--resume-meta-font-size, 13px);
  color: #666;
}

.relevant-courses {
  margin-top: 8px;
  font-size: var(--resume-meta-font-size, 13px);
  line-height: 1.5;
}

.courses-label {
  font-weight: 600;
  color: #333;
}

.courses-content {
  color: #666;
  font-weight: 400;
}

/* 技能样式 */
.skill-group {
  margin-bottom: 15px;
}

.skill-group-title {
  font-size: var(--resume-content-font-size, 14px);
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.skills-list {
  font-size: var(--resume-content-font-size, 14px);
  line-height: var(--resume-line-height, 1.5);
  color: #555;
}

/* 项目描述 */
.project-description {
  margin: 0 0 10px 0;
  line-height: var(--resume-line-height, 1.5);
  color: #555;
  font-size: var(--resume-content-font-size, 14px);
}

/* 技术栈 */
.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tech-item {
  background: #f5f5f5;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: var(--resume-small-font-size, 12px);
  color: #666;
  font-weight: 500;
}

/* 分页断点样式 */
.page-break-before {
  page-break-before: always;
  break-before: page;
}

/* 打印样式 */
@media print {
  .minimal-template {
    font-size: var(--resume-base-font-size, 12px);
    padding: var(--resume-page-margin-top, 20px) var(--resume-page-margin-right, 20px) var(--resume-page-margin-bottom, 20px) var(--resume-page-margin-left, 20px);
  }

  .name {
    font-size: var(--resume-name-font-size, 26px);
  }

  .section-title {
    font-size: var(--resume-title-font-size, 14px);
  }

  .section {
    margin-bottom: var(--resume-module-spacing, 25px);
  }

  .item {
    margin-bottom: 18px;
    page-break-inside: avoid;
  }

  .link-url {
    font-size: var(--resume-small-font-size, 11px) !important;
    color: #333 !important;
    font-weight: 500 !important;
  }

  /* 确保分页断点生效 */
  .page-break-before {
    page-break-before: always !important;
    break-before: page !important;
  }
}
</style>
