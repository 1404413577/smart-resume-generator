<template>
  <div class="classic-template">
    <!-- 头部个人信息 -->
    <header class="resume-header">
      <div class="header-content" :class="`avatar-${avatarPosition}`">
        <!-- 头像 -->
        <div v-if="hasAvatar" class="avatar-container" :class="`avatar-${avatarPosition}`">
          <img :src="resumeData.personalInfo.avatar" alt="头像" class="avatar-image" />
        </div>

        <div class="info-container">
          <h1 class="name">{{ resumeData.personalInfo.name || '姓名' }}</h1>
          <div class="contact-info">
          <div class="contact-row">
            <span v-if="resumeData.personalInfo.email" class="contact-item">
              邮箱：{{ resumeData.personalInfo.email }}
            </span>
            <span v-if="resumeData.personalInfo.phone" class="contact-item">
              电话：{{ resumeData.personalInfo.phone }}
            </span>
          </div>
          <div class="contact-row">
            <span v-if="resumeData.personalInfo.address" class="contact-item">
              地址：{{ resumeData.personalInfo.address }}
            </span>
          </div>
          <div v-if="hasLinks" class="contact-row">
            <span v-if="resumeData.personalInfo.website" class="contact-item link-item">
              <span class="link-label">个人网站:</span>
              <span class="link-url">{{ resumeData.personalInfo.website }}</span>
            </span>
            <span v-if="resumeData.personalInfo.linkedin" class="contact-item link-item">
              <span class="link-label">LinkedIn:</span>
              <span class="link-url">{{ resumeData.personalInfo.linkedin }}</span>
            </span>
            <span v-if="resumeData.personalInfo.github" class="contact-item link-item">
              <span class="link-label">GitHub:</span>
              <span class="link-url">{{ resumeData.personalInfo.github }}</span>
            </span>
          </div>
          <!-- 自定义字段 -->
          <div v-if="resumeData.personalInfo.customFields && resumeData.personalInfo.customFields.length > 0" class="contact-row">
            <span
              v-for="field in resumeData.personalInfo.customFields"
              :key="field.id"
              class="contact-item link-item"
            >
              <span class="link-label">{{ field.name }}:</span>
              <span class="link-url">{{ field.value }}</span>
            </span>
          </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 个人简介 -->
    <section v-if="resumeData.summary" class="section">
      <h2 class="section-title" :style="sectionTitleStyle">个人简介</h2>
      <div class="section-content">
        <p class="summary-text">{{ resumeData.summary }}</p>
      </div>
    </section>

    <!-- 工作经历 -->
    <section v-if="resumeData.workExperience.length > 0" class="section">
      <h2 class="section-title" :style="sectionTitleStyle">工作经历</h2>
      <div class="section-content">
        <div v-for="work in resumeData.workExperience" :key="work.id" class="work-item">
          <div class="work-header">
            <div class="work-left">
              <h3 class="job-title">{{ work.jobTitle }}</h3>
              <h4 class="company">{{ work.company }}</h4>
            </div>
            <div class="work-right">
              <span class="work-period">{{ work.startDate }} - {{ work.current ? '至今' : work.endDate }}</span>
              <span v-if="work.location" class="work-location">{{ work.location }}</span>
            </div>
          </div>
          <ul class="work-responsibilities">
            <li v-for="(responsibility, index) in work.responsibilities" :key="index">
              {{ responsibility }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 教育背景 -->
    <section v-if="resumeData.education.length > 0" class="section">
      <h2 class="section-title" :style="sectionTitleStyle">教育背景</h2>
      <div class="section-content">
        <div v-for="edu in resumeData.education" :key="edu.id" class="education-item">
          <div class="education-header">
            <div class="education-left">
              <span class="institution-name">{{ edu.institution }}</span>
            </div>
            <div class="education-right">
              <span class="graduation-date">{{ formatEducationDate(edu.startDate, edu.graduationDate) }}</span>
            </div>
          </div>

          <!-- 学位信息 - 居左对齐，不缩进 -->
          <div class="degree-info">{{ edu.major }} | {{ getDegreeType(edu.degree) }} | {{ edu.degree }}</div>

          <div class="education-details">
            <!-- 主修课程 -->
            <div v-if="edu.relevantCourses" class="relevant-courses">
              主修课程：{{ edu.relevantCourses }}
            </div>

            <!-- 荣誉奖项 -->
            <div v-if="edu.honors" class="honors-info">
              {{ edu.honors }}
            </div>

            <!-- GPA信息 -->
            <div v-if="edu.gpa" class="gpa-info">
              GPA: {{ edu.gpa }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技能特长 -->
    <section v-if="resumeData.skills.length > 0" class="section">
      <h2 class="section-title" :style="sectionTitleStyle">技能特长</h2>
      <div class="section-content">
        <div v-for="category in skillCategories" :key="category.key" class="skill-category">
          <div v-if="getSkillsByCategory(category.key).length > 0">
            <h3 class="skill-category-title">{{ category.name }}：</h3>
            <div class="skills-text">
              <span 
                v-for="(skill, index) in getSkillsByCategory(category.key)" 
                :key="skill.id"
              >
                {{ skill.name }}{{ index < getSkillsByCategory(category.key).length - 1 ? '、' : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目经历 -->
    <section v-if="resumeData.projects.length > 0" class="section">
      <h2 class="section-title" :style="sectionTitleStyle">项目经历</h2>
      <div class="section-content">
        <div v-for="project in resumeData.projects" :key="project.id" class="project-item">
          <div class="project-header">
            <div class="project-left">
              <h3 class="project-name">{{ project.name }}</h3>
              <span v-if="project.url" class="project-url">项目链接：{{ project.url }}</span>
            </div>
            <div class="project-right">
              <span class="project-period">{{ project.startDate }} - {{ project.endDate }}</span>
            </div>
          </div>
          <div v-if="project.technologies.length > 0" class="project-technologies">
            技术栈：{{ project.technologies.join('、') }}
          </div>
          <div class="project-description">{{ project.description }}</div>
          <ul v-if="project.highlights && project.highlights.length > 0" class="project-highlights">
            <li v-for="(highlight, index) in project.highlights" :key="index">
              {{ highlight }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 证书认证 -->
    <section v-if="resumeData.certifications.length > 0" class="section">
      <h2 class="section-title" :style="sectionTitleStyle">证书认证</h2>
      <div class="section-content">
        <div v-for="cert in resumeData.certifications" :key="cert.id" class="certification-item">
          <div class="certification-header">
            <h3 class="certification-name">{{ cert.name }}</h3>
            <span class="certification-date">{{ cert.date }}</span>
          </div>
          <div class="certification-details">
            <span class="certification-issuer">颁发机构：{{ cert.issuer }}</span>
            <span v-if="cert.credentialId" class="credential-id">证书编号：{{ cert.credentialId }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 语言能力 -->
    <section v-if="resumeData.languages.length > 0" class="section">
      <h2 class="section-title" :style="sectionTitleStyle">语言能力</h2>
      <div class="section-content">
        <div class="languages-list">
          <span 
            v-for="(language, index) in resumeData.languages" 
            :key="language.id"
            class="language-item"
          >
            {{ language.name }}（{{ getLanguageLevelText(language.proficiency) }}）{{ index < resumeData.languages.length - 1 ? '、' : '' }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '../../stores/resume'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  }
})

const resumeStore = useResumeStore()

// 技能分类
const skillCategories = [
  { key: 'technical', name: '技术技能' },
  { key: 'soft', name: '软技能' },
  { key: 'language', name: '语言技能' }
]

// 计算属性
const hasLinks = computed(() => {
  const { website, linkedin, github, customFields } = props.resumeData.personalInfo
  return website || linkedin || github || (customFields && customFields.length > 0)
})

const hasAvatar = computed(() => !!props.resumeData.personalInfo.avatar)
const avatarPosition = computed(() => props.resumeData.personalInfo.avatarPosition || 'left')

// 标题对齐样式
const sectionTitleStyle = computed(() => {
  return {
    textAlign: resumeStore.templateSettings.sectionTitleAlignment || 'left'
  }
})

// 根据分类获取技能
const getSkillsByCategory = (category) => {
  return props.resumeData.skills.filter(skill => skill.category === category)
}

// 获取语言水平文本
const getLanguageLevelText = (level) => {
  const levelMap = {
    basic: '基础',
    conversational: '对话',
    fluent: '流利',
    native: '母语'
  }
  return levelMap[level] || '中等'
}

// 格式化教育时间
const formatEducationDate = (startDate, endDate) => {
  if (!endDate) return ''

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    return `${year}.${month.padStart(2, '0')}`
  }

  const start = formatDate(startDate)
  const end = formatDate(endDate)

  if (start && end) {
    return `${start} - ${end}`
  } else if (end) {
    return end
  }
  return ''
}

// 获取学位类型
const getDegreeType = (degree) => {
  const degreeTypeMap = {
    '博士': '博士',
    '硕士': '硕士',
    '学士': '本科',
    '大专': '大专',
    '高中': '高中',
    '中专': '中专'
  }
  return degreeTypeMap[degree] || '本科'
}
</script>

<style scoped>
.classic-template {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  color: #333;
  font-family: 'SimSun', '宋体', 'Times New Roman', serif;
  line-height: 1.5;
  font-size: 12pt;
  padding: 15mm;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  min-height: 297mm;
  position: relative;
}

/* 头部样式 */
.resume-header {
  margin-bottom: 15pt;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 20pt;
}

/* 头像样式 */
.avatar-container {
  flex-shrink: 0;
}

.avatar-image {
  width: 80pt;
  height: 80pt;
  border-radius: 50%;
  object-fit: cover;
  border: 2pt solid #333;
}

.info-container {
  flex: 1;
}

/* 头像位置布局 */
.header-content.avatar-left {
  flex-direction: row;
}

.header-content.avatar-right {
  flex-direction: row-reverse;
}

.header-content.avatar-center {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.header-content.avatar-center .info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 无头像时居中显示 */
.header-content:not(.avatar-left):not(.avatar-right):not(.avatar-center) {
  justify-content: center;
  text-align: center;
}

.name {
  font-size: 18pt;
  font-weight: bold;
  margin: 0 0 10pt 0;
  color: #333;
  letter-spacing: 2px;
}

.contact-info {
  color: #333;
  margin-bottom: 15pt;
}

.contact-row {
  display: flex;
  justify-content: center;
  gap: 15pt;
  margin: 5pt 0;
  flex-wrap: wrap;
}

.contact-item {
  margin: 0;
}

.link-item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px;
}

.link-label {
  font-weight: bold;
  color: #333;
}

.link-url {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #666;
  word-break: break-all;
}

/* 章节样式 */
.section {
  margin-bottom: 15pt;
}

.section-title {
  font-size: 14pt;
  font-weight: bold;
  color: #2c3e50;
  margin: 15pt 0 10pt 0;
  border-bottom: 2px solid #3498db;
  padding-bottom: 3pt;
}

.section-content {
  margin-left: 0;
  padding-left: 0;
}

/* 个人简介 */
.summary-text {
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
  text-align: justify;
  text-indent: 2em;
}

/* 工作经历 */
.work-item {
  margin-bottom: 10pt;
  page-break-inside: avoid;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-weight: bold;
  margin-bottom: 3pt;
}

.work-left {
  flex: 1;
}

.work-right {
  text-align: right;
  min-width: 150px;
}

.job-title {
  font-size: inherit;
  font-weight: bold;
  margin: 0;
  color: #333;
  display: inline;
}

.company {
  font-size: inherit;
  font-weight: bold;
  margin: 0;
  color: #333;
  display: inline;
}

.work-period {
  font-weight: bold;
}

.work-location {
  font-size: inherit;
  color: #333;
  display: block;
  font-weight: normal;
  margin-top: 2pt;
}

.work-responsibilities {
  margin: 5pt 0;
  padding-left: 20pt;
}

.work-responsibilities li {
  margin-bottom: 5pt;
  line-height: 1.6;
}

/* 教育背景 */
.education-item {
  margin-bottom: 10pt;
  page-break-inside: avoid;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-weight: bold;
  margin-bottom: 3pt;
}

.education-left {
  flex: 1;
}

.education-right {
  text-align: right;
  min-width: 120px;
}

.education-left {
  display: flex;
  align-items: flex-start;
}

.institution-name {
  font-size: inherit;
  font-weight: bold;
  color: #333;
  display: block;
  margin: 0;
  padding: 0;
}

.graduation-date {
  font-weight: bold;
  color: #333;
}

.degree-info {
  color: #333;
  margin-bottom: 5pt;
  margin-top: 3pt;
  text-align: left;
}

.education-details {
  padding-left: 15pt;
  margin-top: 3pt;
  line-height: 1.6;
}

.relevant-courses {
  color: #333;
  margin-bottom: 5pt;
  text-align: justify;
}

.honors-info {
  color: #333;
  margin-bottom: 5pt;
  text-align: justify;
}

.gpa-info {
  color: #333;
  margin-bottom: 5pt;
}

/* 技能特长 */
.skill-category {
  margin-bottom: 6pt;
}

.skill-category-title {
  font-weight: bold;
  margin: 0;
  display: inline;
  color: #333;
}

.skills-text {
  display: inline;
  line-height: 1.6;
}

/* 项目经历 */
.project-item {
  margin-bottom: 10pt;
  page-break-inside: avoid;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-weight: bold;
  margin-bottom: 3pt;
}

.project-left {
  flex: 1;
}

.project-right {
  text-align: right;
  min-width: 150px;
}

.project-name {
  font-size: inherit;
  font-weight: bold;
  margin: 0;
  color: #333;
  display: inline;
}

.project-url {
  color: #333;
  font-style: normal;
  display: block;
  font-weight: normal;
  margin-top: 2pt;
}

.project-period {
  font-weight: bold;
}

.project-description {
  margin: 5pt 0;
  line-height: 1.6;
  text-align: justify;
  padding-left: 10pt;
}

.project-technologies {
  color: #7f8c8d;
  font-style: italic;
  margin-bottom: 5pt;
  display: block;
  padding-left: 10pt;
}

.project-highlights {
  margin: 5pt 0;
  padding-left: 20pt;
}

.project-highlights li {
  margin-bottom: 5pt;
  line-height: 1.6;
}

/* 证书认证 */
.certification-item {
  margin-bottom: 12px;
}

.certification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.certification-name {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.certification-date {
  font-weight: bold;
  font-size: 13px;
}

.certification-details {
  font-size: 13px;
  color: #666;
}

.certification-issuer {
  margin-right: 15px;
}

/* 语言能力 */
.languages-list {
  font-size: 14px;
  line-height: 1.6;
}

.language-item {
  font-weight: normal;
}

/* 打印样式 */
@media print {
  .classic-template {
    width: 210mm;
    padding: 15mm;
    margin: 0;
    background-color: white;
    box-shadow: none;
    min-height: 297mm;
    font-size: 12pt;
  }

  .name {
    font-size: 18pt;
  }

  .section-title {
    font-size: 14pt;
  }

  .section {
    margin-bottom: 15pt;
  }

  .work-item,
  .education-item,
  .project-item {
    margin-bottom: 10pt;
    page-break-inside: avoid;
  }

  .link-url {
    font-size: 11pt !important;
    color: #333 !important;
    font-weight: 500 !important;
  }

  .link-label {
    color: #000 !important;
    font-weight: bold !important;
  }

  @page {
    size: A4;
    margin: 0;
  }
}
</style>
