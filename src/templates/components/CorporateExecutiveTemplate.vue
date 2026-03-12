<template>
  <div class="corporate-executive-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 头部信息 - 高管风格 -->
      <div class="header-section">
        <div class="name-title-container">
          <h1 class="name">{{ resumeData.personalInfo?.name || 'Executive Name' }}</h1>
          <p class="title">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Senior Executive' }}</p>
        </div>
        
        <div class="contact-info">
          <div class="contact-grid">
            <div v-if="resumeData.personalInfo?.email" class="contact-item">
              <span class="contact-label">Email:</span>
              <span class="contact-value">{{ resumeData.personalInfo.email }}</span>
            </div>
            <div v-if="resumeData.personalInfo?.phone" class="contact-item">
              <span class="contact-label">Phone:</span>
              <span class="contact-value">{{ resumeData.personalInfo.phone }}</span>
            </div>
            <div v-if="resumeData.personalInfo?.address" class="contact-item">
              <span class="contact-label">Location:</span>
              <span class="contact-value">{{ resumeData.personalInfo.address }}</span>
            </div>
            <div v-if="resumeData.personalInfo?.website" class="contact-item">
              <span class="contact-label">Website:</span>
              <span class="contact-value">{{ resumeData.personalInfo.website }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 执行摘要 -->
      <div class="section executive-summary" v-if="resumeData.summary">
        <h2 class="section-title">Executive Summary</h2>
        <p class="summary-content">{{ resumeData.summary }}</p>
      </div>

      <!-- 核心能力 -->
      <div class="section core-competencies" v-if="resumeData.skills?.length">
        <h2 class="section-title">Core Competencies</h2>
        <div class="competencies-grid">
          <div 
            v-for="skill in resumeData.skills" 
            :key="skill.name"
            class="competency-item"
          >
            <span class="competency-name">{{ skill.name }}</span>
          </div>
        </div>
      </div>

      <!-- 职业经历 -->
      <div class="section professional-experience" v-if="resumeData.workExperience?.length">
        <h2 class="section-title">Professional Experience</h2>
        <div 
          v-for="work in resumeData.workExperience" 
          :key="work.id"
          class="experience-item"
        >
          <div class="experience-header">
            <div class="company-info">
              <h3 class="position">{{ work.jobTitle }}</h3>
              <span class="company">{{ work.company }}</span>
            </div>
            <div class="date-range">
              {{ work.startDate }} - {{ work.endDate }}
            </div>
          </div>
          <ul class="achievements-list" v-if="work.responsibilities?.length">
            <li v-for="achievement in work.responsibilities" :key="achievement">
              <span class="achievement-icon">•</span>
              <span class="achievement-text">{{ achievement }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 教育背景 -->
      <div class="section education" v-if="resumeData.education?.length">
        <h2 class="section-title">Education</h2>
        <div 
          v-for="edu in resumeData.education" 
          :key="edu.id"
          class="education-item"
        >
          <div class="education-header">
            <h3 class="degree">{{ edu.degree }} in {{ edu.major }}</h3>
            <span class="institution">{{ edu.school }}</span>
          </div>
          <div class="education-details">
            <span class="graduation-date">{{ edu.graduationDate }}</span>
          </div>
        </div>
      </div>

      <!-- 专业认证 -->
      <div class="section certifications" v-if="resumeData.projects?.length">
        <h2 class="section-title">Certifications & Achievements</h2>
        <div class="certifications-list">
          <div 
            v-for="project in resumeData.projects" 
            :key="project.id"
            class="certification-item"
          >
            <h4 class="certification-name">{{ project.name }}</h4>
            <p class="certification-description">{{ project.description }}</p>
            <div class="certification-date">{{ project.startDate }} - {{ project.endDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateId: {
    type: String,
    default: 'corporate-executive'
  }
})

// 使用新的样式系统
const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.corporate-executive-template {
  font-family: 'Georgia', 'Times New Roman', serif;
  background: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  font-size: 14px;
}

.resume-container {
  max-width: 210mm;
  margin: 0 auto;
  padding: 50px 40px;
  background: white;
  min-height: 100vh;
  border-left: 4px solid var(--primary-color);
}

/* 头部样式 */
.header-section {
  margin-bottom: 40px;
  padding-left: 20px;
}

.name-title-container {
  margin-bottom: 20px;
}

.name {
  font-size: 38px;
  font-weight: 300;
  color: var(--primary-color);
  margin: 0 0 10px 0;
  letter-spacing: 1px;
  font-family: 'Georgia', serif;
}

.title {
  font-size: 18px;
  color: var(--secondary-color);
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.contact-info {
  background: rgba(64, 158, 255, 0.05);
  padding: 15px 20px;
  border-radius: 4px;
  border-left: 2px solid var(--primary-color);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.contact-item {
  display: flex;
  flex-direction: column;
}

.contact-label {
  font-size: 11px;
  color: var(--secondary-color);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.contact-value {
  font-size: 13px;
  color: var(--text-color);
  font-weight: 400;
  font-family: 'Georgia', serif;
}

/* 章节样式 */
.section {
  margin-bottom: 40px;
  padding-left: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 400;
  color: var(--primary-color);
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 50px;
  height: 2px;
  background: var(--primary-color);
}

/* 执行摘要 */
.executive-summary .summary-content {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-color);
  margin: 0;
  font-family: 'Georgia', serif;
  text-align: justify;
}

/* 核心能力 */
.competencies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.competency-item {
  background: rgba(64, 158, 255, 0.1);
  padding: 12px 15px;
  border-radius: 4px;
  text-align: center;
  transition: all 0.2s ease;
}

.competency-item:hover {
  background: rgba(64, 158, 255, 0.15);
  transform: translateY(-1px);
}

.competency-name {
  font-size: 13px;
  color: var(--primary-color);
  font-weight: 600;
  letter-spacing: 0.5px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 职业经历 */
.experience-item {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.experience-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.company-info {
  flex: 1;
}

.position {
  font-size: 17px;
  font-weight: 400;
  color: var(--primary-color);
  margin: 0 0 5px 0;
  font-family: 'Georgia', serif;
}

.company {
  font-size: 14px;
  color: var(--secondary-color);
  font-weight: 400;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.date-range {
  font-size: 13px;
  color: var(--secondary-color);
  font-weight: 400;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  min-width: 120px;
  text-align: right;
}

.achievements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.achievements-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.achievement-icon {
  color: var(--primary-color);
  font-size: 18px;
  margin-right: 10px;
  line-height: 1.2;
}

.achievement-text {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-color);
  font-family: 'Georgia', serif;
}

/* 教育背景 */
.education-item {
  margin-bottom: 20px;
}

.education-item:last-child {
  margin-bottom: 0;
}

.education-header {
  margin-bottom: 8px;
}

.degree {
  font-size: 16px;
  font-weight: 400;
  color: var(--primary-color);
  margin: 0 0 5px 0;
  font-family: 'Georgia', serif;
}

.institution {
  font-size: 14px;
  color: var(--secondary-color);
  font-weight: 400;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.education-details {
  display: flex;
  justify-content: space-between;
}

.graduation-date {
  font-size: 13px;
  color: var(--secondary-color);
  font-weight: 400;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 专业认证 */
.certifications-list {
  display: grid;
  gap: 20px;
}

.certification-item {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
}

.certification-name {
  font-size: 15px;
  font-weight: 400;
  color: var(--primary-color);
  margin: 0 0 10px 0;
  font-family: 'Georgia', serif;
}

.certification-description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color);
  margin: 0 0 10px 0;
  font-family: 'Georgia', serif;
}

.certification-date {
  font-size: 13px;
  color: var(--secondary-color);
  font-weight: 400;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-container {
    padding: 40px 25px;
    border-left: none;
    border-top: 4px solid var(--primary-color);
  }
  
  .header-section {
    padding-left: 0;
  }
  
  .section {
    padding-left: 0;
  }
  
  .name {
    font-size: 32px;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .experience-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .date-range {
    text-align: left;
  }
  
  .section-title {
    font-size: 18px;
    letter-spacing: 2px;
  }
}
</style>