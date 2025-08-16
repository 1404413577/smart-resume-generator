<template>
  <div class="minimal-template">
    <!-- 头部个人信息 -->
    <header class="resume-header">
      <h1 class="name">{{ resumeData.personalInfo.name || '姓名' }}</h1>
      <div class="contact-info">
        <span v-if="resumeData.personalInfo.email" class="contact-item">{{ resumeData.personalInfo.email }}</span>
        <span v-if="resumeData.personalInfo.phone" class="contact-item">{{ resumeData.personalInfo.phone }}</span>
        <span v-if="resumeData.personalInfo.address" class="contact-item">{{ resumeData.personalInfo.address }}</span>
        <span v-if="resumeData.personalInfo.website" class="contact-item link-item">
          <span class="link-label">网站:</span>
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
        <!-- 自定义字段 -->
        <span
          v-for="field in resumeData.personalInfo.customFields"
          :key="field.id"
          class="contact-item custom-field link-item"
        >
          <span class="link-label">{{ field.name }}:</span>
          <span class="link-url">{{ field.value }}</span>
        </span>
      </div>
    </header>

    <!-- 个人简介 -->
    <section v-if="resumeData.summary" class="section">
      <div class="section-content">
        <p class="summary-text">{{ resumeData.summary }}</p>
      </div>
    </section>

    <!-- 工作经历 -->
    <section v-if="resumeData.workExperience.length > 0" class="section">
      <h2 class="section-title">Experience</h2>
      <div class="section-content">
        <div v-for="work in resumeData.workExperience" :key="work.id" class="work-item">
          <div class="item-header">
            <div class="item-title">
              <h3>{{ work.jobTitle }}</h3>
              <span class="company">{{ work.company }}</span>
            </div>
            <div class="item-meta">
              <span class="period">{{ work.startDate }} - {{ work.current ? 'Present' : work.endDate }}</span>
              <span v-if="work.location" class="location">{{ work.location }}</span>
            </div>
          </div>
          <ul class="item-details">
            <li v-for="(responsibility, index) in work.responsibilities" :key="index">
              {{ responsibility }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 教育背景 -->
    <section v-if="resumeData.education.length > 0" class="section">
      <h2 class="section-title">Education</h2>
      <div class="section-content">
        <div v-for="edu in resumeData.education" :key="edu.id" class="education-item">
          <div class="item-header">
            <div class="item-title">
              <h3>{{ edu.degree }}</h3>
              <span class="institution">{{ edu.institution }} - {{ edu.major }}</span>
            </div>
            <div class="item-meta">
              <span class="period">{{ edu.graduationDate }}</span>
              <span v-if="edu.location" class="location">{{ edu.location }}</span>
            </div>
          </div>
          <div v-if="edu.gpa || edu.honors" class="item-details">
            <span v-if="edu.gpa" class="detail-item">GPA: {{ edu.gpa }}</span>
            <span v-if="edu.honors" class="detail-item">{{ edu.honors }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 技能特长 -->
    <section v-if="resumeData.skills.length > 0" class="section">
      <h2 class="section-title">Skills</h2>
      <div class="section-content">
        <div class="skills-grid">
          <div v-for="category in skillCategories" :key="category.key" class="skill-group">
            <div v-if="getSkillsByCategory(category.key).length > 0">
              <h4 class="skill-group-title">{{ category.name }}</h4>
              <div class="skills-list">
                <span 
                  v-for="(skill, index) in getSkillsByCategory(category.key)" 
                  :key="skill.id"
                  class="skill-item"
                >
                  {{ skill.name }}{{ index < getSkillsByCategory(category.key).length - 1 ? ', ' : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目经历 -->
    <section v-if="resumeData.projects.length > 0" class="section">
      <h2 class="section-title">Projects</h2>
      <div class="section-content">
        <div v-for="project in resumeData.projects" :key="project.id" class="project-item">
          <div class="item-header">
            <div class="item-title">
              <h3>{{ project.name }}</h3>
              <span v-if="project.url" class="project-link">{{ project.url }}</span>
            </div>
            <div class="item-meta">
              <span class="period">{{ project.startDate }} - {{ project.endDate }}</span>
            </div>
          </div>
          <p class="project-description">{{ project.description }}</p>
          <div v-if="project.technologies.length > 0" class="technologies">
            <span 
              v-for="(tech, index) in project.technologies" 
              :key="index"
              class="tech-item"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 证书认证 -->
    <section v-if="resumeData.certifications.length > 0" class="section">
      <h2 class="section-title">Certifications</h2>
      <div class="section-content">
        <div v-for="cert in resumeData.certifications" :key="cert.id" class="certification-item">
          <div class="item-header">
            <div class="item-title">
              <h3>{{ cert.name }}</h3>
              <span class="issuer">{{ cert.issuer }}</span>
            </div>
            <div class="item-meta">
              <span class="period">{{ cert.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 语言能力 -->
    <section v-if="resumeData.languages.length > 0" class="section">
      <h2 class="section-title">Languages</h2>
      <div class="section-content">
        <div class="languages-list">
          <span 
            v-for="(language, index) in resumeData.languages" 
            :key="language.id"
            class="language-item"
          >
            {{ language.name }} ({{ getLanguageLevelText(language.proficiency) }}){{ index < resumeData.languages.length - 1 ? ', ' : '' }}
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
  { key: 'technical', name: 'Technical' },
  { key: 'soft', name: 'Soft Skills' },
  { key: 'language', name: 'Languages' }
]

// 根据分类获取技能
const getSkillsByCategory = (category) => {
  return props.resumeData.skills.filter(skill => skill.category === category)
}

// 获取语言水平文本
const getLanguageLevelText = (level) => {
  const levelMap = {
    basic: 'Basic',
    conversational: 'Conversational',
    fluent: 'Fluent',
    native: 'Native'
  }
  return levelMap[level] || 'Intermediate'
}
</script>

<style scoped>
.minimal-template {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  color: #333;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  font-size: 14px;
  padding: 40px;
}

/* 头部样式 */
.resume-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.name {
  font-size: 32px;
  font-weight: 300;
  margin: 0 0 10px 0;
  color: #333;
  letter-spacing: -1px;
}

.contact-info {
  font-size: 14px;
  color: #666;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
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
  font-size: 13px;
  color: #666;
  word-break: break-all;
  font-weight: 400;
}

/* 章节样式 */
.section {
  margin-bottom: 35px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 8px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 1px;
  background: #333;
}

.section-content {
  margin-left: 0;
}

/* 个人简介 */
.summary-text {
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  color: #555;
  font-weight: 300;
}

/* 通用项目样式 */
.work-item,
.education-item,
.project-item,
.certification-item {
  margin-bottom: 25px;
  position: relative;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.item-title {
  flex: 1;
}

.item-title h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 2px 0;
  color: #333;
}

.company,
.institution,
.issuer {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}

.project-link {
  font-size: 13px;
  color: #888;
  font-style: italic;
}

.item-meta {
  text-align: right;
  font-size: 13px;
  color: #888;
  min-width: 120px;
}

.period {
  display: block;
  font-weight: 500;
}

.location {
  display: block;
  font-size: 12px;
  margin-top: 2px;
}

/* 详细信息 */
.item-details {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.item-details li {
  margin-bottom: 4px;
  line-height: 1.5;
  position: relative;
  padding-left: 15px;
  color: #555;
}

.item-details li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

.detail-item {
  display: inline-block;
  margin-right: 15px;
  font-size: 13px;
  color: #666;
}

/* 技能样式 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.skill-group-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.skills-list {
  font-size: 14px;
  line-height: 1.5;
  color: #555;
}

.skill-item {
  font-weight: 400;
}

/* 项目描述 */
.project-description {
  margin: 0 0 10px 0;
  line-height: 1.5;
  color: #555;
  font-size: 14px;
}

/* 技术栈 */
.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-item {
  background: #f5f5f5;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 语言列表 */
.languages-list {
  font-size: 14px;
  line-height: 1.5;
  color: #555;
}

.language-item {
  font-weight: 400;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .minimal-template {
    padding: 20px;
  }
  
  .item-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-meta {
    text-align: left;
    margin-top: 5px;
    min-width: auto;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 5px;
  }
  
  .contact-item:not(:last-child)::after {
    display: none;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
}

/* 打印样式 */
@media print {
  .minimal-template {
    font-size: 12px;
    padding: 20px;
  }

  .name {
    font-size: 26px;
  }

  .section-title {
    font-size: 14px;
  }

  .section {
    margin-bottom: 25px;
  }

  .work-item,
  .education-item,
  .project-item,
  .certification-item {
    margin-bottom: 18px;
    page-break-inside: avoid;
  }

  .link-url {
    font-size: 11px !important;
    color: #333 !important;
    font-weight: 500 !important;
  }

  .link-label {
    color: #000 !important;
    font-weight: bold !important;
  }
}
</style>
