<template>
  <div class="classic-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 头部信息 -->
      <div class="header-section">
        <div class="personal-info">
          <h1 class="name">{{ resumeData.personalInfo?.name || '姓名' }}</h1>
          <h2 class="title">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || '职位' }}</h2>
          
          <div class="contact-info">
            <div class="contact-row">
              <span v-if="resumeData.personalInfo?.email" class="contact-item">
                📧 {{ resumeData.personalInfo.email }}
              </span>
              <span v-if="resumeData.personalInfo?.phone" class="contact-item">
                📱 {{ resumeData.personalInfo.phone }}
              </span>
            </div>
            <div class="contact-row">
              <span v-if="resumeData.personalInfo?.address" class="contact-item">
                📍 {{ resumeData.personalInfo.address }}
              </span>
              <span v-if="resumeData.personalInfo?.website" class="contact-item">
                🌐 {{ resumeData.personalInfo.website }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="avatar-section" v-if="resumeData.personalInfo?.photo">
          <img :src="resumeData.personalInfo.photo" alt="头像" class="avatar" />
        </div>
      </div>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 个人简介 -->
      <div class="summary-section" v-if="resumeData.summary">
        <h3 class="section-title">PROFESSIONAL SUMMARY</h3>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </div>

      <!-- 工作经历 -->
      <div class="experience-section" v-if="resumeData.workExperience?.length">
        <h3 class="section-title">PROFESSIONAL EXPERIENCE</h3>
        <div 
          v-for="work in resumeData.workExperience" 
          :key="work.id"
          class="experience-item"
        >
          <div class="experience-header">
            <div class="job-info">
              <h4 class="job-title">{{ work.position }}</h4>
              <h5 class="company-name">{{ work.company }}</h5>
            </div>
            <div class="date-location">
              <span class="date">{{ work.startDate }} - {{ work.endDate }}</span>
              <span class="location" v-if="work.location">{{ work.location }}</span>
            </div>
          </div>
          <div v-if="work.description" class="work-description">
            <p>{{ work.description }}</p>
          </div>
          <ul class="achievements" v-if="work.achievements?.length">
            <li v-for="achievement in work.achievements" :key="achievement">{{ achievement }}</li>
          </ul>
        </div>
      </div>

      <!-- 教育背景 -->
      <div class="education-section" v-if="resumeData.education?.length">
        <h3 class="section-title">EDUCATION</h3>
        <div 
          v-for="edu in resumeData.education" 
          :key="edu.id"
          class="education-item"
        >
          <div class="education-header">
            <div class="degree-info">
              <h4 class="degree">{{ edu.degree }} in {{ edu.major }}</h4>
              <h5 class="school">{{ edu.school }}</h5>
            </div>
            <div class="edu-date">
              <span class="date">{{ edu.endDate }}</span>
              <span class="gpa" v-if="edu.gpa">GPA: {{ edu.gpa }}</span>
            </div>
          </div>
          <div v-if="edu.honors" class="education-honors">
            <p>{{ edu.honors }}</p>
          </div>
          <div v-if="edu.description" class="education-description">
            <p>{{ edu.description }}</p>
          </div>
        </div>
      </div>

      <!-- 技能特长 -->
      <div class="skills-section" v-if="resumeData.skills?.length">
        <h3 class="section-title">CORE COMPETENCIES</h3>
        <div class="skills-grid">
          <div 
            v-for="skill in resumeData.skills" 
            :key="skill.name"
            class="skill-item"
          >
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-level">{{ skill.level }}</span>
          </div>
        </div>
      </div>

      <!-- 项目经历 -->
      <div class="projects-section" v-if="resumeData.projects?.length">
        <h3 class="section-title">KEY PROJECTS</h3>
        <div 
          v-for="project in resumeData.projects" 
          :key="project.id"
          class="project-item"
        >
          <div class="project-header">
            <h4 class="project-name">{{ project.name }}</h4>
            <span class="project-date">{{ project.startDate }} - {{ project.endDate }}</span>
          </div>
          <p class="project-description">{{ project.description }}</p>
          <div class="project-tech" v-if="project.technologies?.length">
            <strong>Technologies:</strong> {{ project.technologies.join(', ') }}
          </div>
        </div>
      </div>

      <!-- 语言能力 -->
      <div class="languages-section" v-if="resumeData.languages?.length">
        <h3 class="section-title">LANGUAGES</h3>
        <div class="languages-grid">
          <div class="language-item" v-for="lang in resumeData.languages" :key="lang.name">
            <span class="language-name">{{ lang.name }}</span>
            <span class="language-level">{{ lang.level }}</span>
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
    default: 'classic'
  }
})

// 使用新的样式系统
const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.classic-template {
  font-family: 'Times New Roman', serif;
  background: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  font-size: 14px;
}

.resume-container {
  max-width: 210mm;
  margin: 0 auto;
  padding: 40px;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
}

/* 头部样式 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.personal-info {
  flex: 1;
}

.name {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.title {
  font-size: 16px;
  color: var(--secondary-color);
  margin: 0 0 20px 0;
  font-weight: normal;
  font-style: italic;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-row {
  display: flex;
  gap: 30px;
}

.contact-item {
  font-size: 13px;
  color: var(--text-color);
}

.avatar-section {
  margin-left: 30px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  border: 2px solid var(--primary-color);
  object-fit: cover;
}

/* 分割线 */
.divider {
  height: 2px;
  background: var(--primary-color);
  margin: 30px 0;
}

/* 章节标题 */
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--primary-color);
  margin: 30px 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid var(--primary-color);
  padding-bottom: 5px;
}

/* 个人简介 */
.summary-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-color);
  margin: 0;
  text-align: justify;
}

/* 工作经历 */
.experience-item {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.experience-item:last-child {
  border-bottom: none;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.job-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 4px 0;
}

.company-name {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: normal;
  margin: 0;
  font-style: italic;
}

.date-location {
  text-align: right;
  font-size: 12px;
  color: var(--secondary-color);
}

.location {
  display: block;
  margin-top: 2px;
}

.responsibilities {
  margin: 0;
  padding-left: 20px;
}

.responsibilities li {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.6;
  text-align: justify;
}

/* 教育背景 */
.education-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.education-item:last-child {
  border-bottom: none;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.degree {
  font-size: 15px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 4px 0;
}

.school {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: normal;
  margin: 0;
  font-style: italic;
}

.edu-date {
  text-align: right;
  font-size: 12px;
  color: var(--secondary-color);
}

.gpa {
  display: block;
  margin-top: 2px;
}

/* 技能特长 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dotted var(--secondary-color);
}

.skill-name {
  font-weight: 500;
  color: var(--text-color);
}

.skill-level {
  font-size: 12px;
  color: var(--secondary-color);
  font-style: italic;
}

/* 项目经历 */
.project-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.project-item:last-child {
  border-bottom: none;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.project-name {
  font-size: 15px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0;
}

.project-date {
  font-size: 12px;
  color: var(--secondary-color);
  font-style: italic;
}

.project-description {
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 8px 0;
  text-align: justify;
}

.project-tech {
  font-size: 12px;
  color: var(--secondary-color);
}

/* 语言能力 */
.languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dotted var(--secondary-color);
}

.language-name {
  font-weight: 500;
  color: var(--text-color);
}

.language-level {
  font-size: 12px;
  color: var(--secondary-color);
  font-style: italic;
}

/* 打印样式 */
@media print {
  .classic-template {
    font-size: 12px;
  }
  
  .resume-container {
    box-shadow: none;
    padding: 20px;
    min-height: auto;
  }
  
  .name {
    font-size: 24px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .section-title {
    font-size: 14px;
  }
}
</style>
