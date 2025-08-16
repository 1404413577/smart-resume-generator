<template>
  <div class="classic-template">
    <!-- 头部个人信息 -->
    <header class="resume-header">
      <div class="header-content">
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
            <span v-if="resumeData.personalInfo.website" class="contact-item">
              网站：{{ resumeData.personalInfo.website }}
            </span>
            <span v-if="resumeData.personalInfo.linkedin" class="contact-item">
              LinkedIn：{{ resumeData.personalInfo.linkedin }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- 个人简介 -->
    <section v-if="resumeData.summary" class="section">
      <h2 class="section-title">个人简介</h2>
      <div class="section-content">
        <p class="summary-text">{{ resumeData.summary }}</p>
      </div>
    </section>

    <!-- 工作经历 -->
    <section v-if="resumeData.workExperience.length > 0" class="section">
      <h2 class="section-title">工作经历</h2>
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
      <h2 class="section-title">教育背景</h2>
      <div class="section-content">
        <div v-for="edu in resumeData.education" :key="edu.id" class="education-item">
          <div class="education-header">
            <div class="education-left">
              <h3 class="degree">{{ edu.degree }}</h3>
              <h4 class="institution">{{ edu.institution }} - {{ edu.major }}</h4>
            </div>
            <div class="education-right">
              <span class="graduation-date">{{ edu.graduationDate }}</span>
              <span v-if="edu.location" class="education-location">{{ edu.location }}</span>
            </div>
          </div>
          <div v-if="edu.gpa || edu.honors" class="education-details">
            <span v-if="edu.gpa" class="gpa">GPA: {{ edu.gpa }}</span>
            <span v-if="edu.honors" class="honors">{{ edu.honors }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 技能特长 -->
    <section v-if="resumeData.skills.length > 0" class="section">
      <h2 class="section-title">技能特长</h2>
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
      <h2 class="section-title">项目经历</h2>
      <div class="section-content">
        <div v-for="project in resumeData.projects" :key="project.id" class="project-item">
          <div class="project-header">
            <div class="project-left">
              <h3 class="project-name">{{ project.name }}</h3>
              <span v-if="project.url" class="project-url">{{ project.url }}</span>
            </div>
            <div class="project-right">
              <span class="project-period">{{ project.startDate }} - {{ project.endDate }}</span>
            </div>
          </div>
          <p class="project-description">{{ project.description }}</p>
          <div v-if="project.technologies.length > 0" class="project-technologies">
            <strong>技术栈：</strong>
            <span 
              v-for="(tech, index) in project.technologies" 
              :key="index"
            >
              {{ tech }}{{ index < project.technologies.length - 1 ? '、' : '' }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 证书认证 -->
    <section v-if="resumeData.certifications.length > 0" class="section">
      <h2 class="section-title">证书认证</h2>
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
      <h2 class="section-title">语言能力</h2>
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

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  }
})

// 技能分类
const skillCategories = [
  { key: 'technical', name: '技术技能' },
  { key: 'soft', name: '软技能' },
  { key: 'language', name: '语言技能' }
]

// 计算属性
const hasLinks = computed(() => {
  const { website, linkedin, github } = props.resumeData.personalInfo
  return website || linkedin || github
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
</script>

<style scoped>
.classic-template {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  color: #333;
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
  font-size: 14px;
  padding: 20px;
}

/* 头部样式 */
.resume-header {
  text-align: center;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.name {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 15px 0;
  color: #333;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.contact-info {
  font-size: 14px;
  line-height: 1.4;
}

.contact-row {
  margin-bottom: 5px;
}

.contact-item {
  margin-right: 30px;
}

.contact-item:last-child {
  margin-right: 0;
}

/* 章节样式 */
.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
}

.section-content {
  margin-left: 0;
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
  margin-bottom: 20px;
  page-break-inside: avoid;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.work-left {
  flex: 1;
}

.work-right {
  text-align: right;
  min-width: 150px;
}

.job-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 3px 0;
  color: #333;
}

.company {
  font-size: 14px;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: #666;
}

.work-period {
  font-weight: bold;
  display: block;
}

.work-location {
  font-size: 12px;
  color: #666;
  display: block;
}

.work-responsibilities {
  margin: 0;
  padding-left: 20px;
}

.work-responsibilities li {
  margin-bottom: 3px;
  line-height: 1.5;
}

/* 教育背景 */
.education-item {
  margin-bottom: 15px;
  page-break-inside: avoid;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5px;
}

.education-left {
  flex: 1;
}

.education-right {
  text-align: right;
  min-width: 120px;
}

.degree {
  font-size: 15px;
  font-weight: bold;
  margin: 0 0 3px 0;
  color: #333;
}

.institution {
  font-size: 14px;
  font-weight: normal;
  margin: 0;
  color: #666;
}

.graduation-date {
  font-weight: bold;
  display: block;
}

.education-location {
  font-size: 12px;
  color: #666;
  display: block;
}

.education-details {
  font-size: 13px;
  color: #666;
  margin-top: 3px;
}

.gpa {
  margin-right: 15px;
}

/* 技能特长 */
.skill-category {
  margin-bottom: 10px;
}

.skill-category-title {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  display: inline;
  color: #333;
}

.skills-text {
  display: inline;
  font-size: 14px;
  line-height: 1.6;
}

/* 项目经历 */
.project-item {
  margin-bottom: 20px;
  page-break-inside: avoid;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.project-left {
  flex: 1;
}

.project-right {
  text-align: right;
  min-width: 150px;
}

.project-name {
  font-size: 15px;
  font-weight: bold;
  margin: 0 0 3px 0;
  color: #333;
}

.project-url {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.project-period {
  font-weight: bold;
}

.project-description {
  margin: 0 0 8px 0;
  line-height: 1.6;
  text-align: justify;
}

.project-technologies {
  font-size: 13px;
  color: #666;
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
    font-size: 12px;
    padding: 15px;
  }
  
  .name {
    font-size: 24px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .section {
    margin-bottom: 20px;
  }
}
</style>
