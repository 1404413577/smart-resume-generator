<template>
  <div class="artistic-portfolio-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 头部信息 - 艺术风格 -->
      <div class="header-section">
        <h1 class="name">{{ resumeData.personalInfo?.name || 'Artist Name' }}</h1>
        <p class="title">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Creative Professional' }}</p>
        
        <div class="contact-line">
          <span v-if="resumeData.personalInfo?.email" class="contact-item">
            {{ resumeData.personalInfo.email }}
          </span>
          <span v-if="resumeData.personalInfo?.phone" class="contact-item">
            {{ resumeData.personalInfo.phone }}
          </span>
          <span v-if="resumeData.personalInfo?.website" class="contact-item">
            {{ resumeData.personalInfo.website }}
          </span>
          <span v-if="resumeData.personalInfo?.address" class="contact-item">
            {{ resumeData.personalInfo.address }}
          </span>
        </div>
      </div>

      <!-- 个人简介 - 艺术家声明 -->
      <div class="section" v-if="resumeData.summary">
        <div class="artist-statement">
          <h2 class="statement-title">Artist Statement</h2>
          <p class="statement-content">{{ resumeData.summary }}</p>
        </div>
      </div>

      <!-- 作品集展示 -->
      <div class="section portfolio-section" v-if="resumeData.projects?.length">
        <h2 class="section-title">Portfolio</h2>
        <div class="portfolio-grid">
          <div 
            v-for="project in resumeData.projects" 
            :key="project.id"
            class="portfolio-item"
          >
            <div class="portfolio-header">
              <h3 class="portfolio-title">{{ project.name }}</h3>
              <span class="portfolio-meta">{{ project.startDate }} - {{ project.endDate }}</span>
            </div>
            <p class="portfolio-description">{{ project.description }}</p>
            <div v-if="project.technologies?.length" class="medium-tags">
              <span 
                v-for="medium in project.technologies" 
                :key="medium"
                class="medium-tag"
              >
                {{ medium }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 教育背景 -->
      <div class="section" v-if="resumeData.education?.length">
        <h2 class="section-title">Education</h2>
        <div 
          v-for="edu in resumeData.education" 
          :key="edu.id"
          class="education-item"
        >
          <div class="education-header">
            <h3 class="degree">{{ edu.degree }} in {{ edu.major }}</h3>
            <span class="school-meta">{{ edu.school }} • {{ edu.graduationDate }}</span>
          </div>
        </div>
      </div>

      <!-- 技能特长 - 艺术技能 -->
      <div class="section" v-if="resumeData.skills?.length">
        <h2 class="section-title">Artistic Skills</h2>
        <div class="skills-categories">
          <div 
            v-for="skill in resumeData.skills" 
            :key="skill.name"
            class="skill-category"
          >
            <h4 class="skill-name">{{ skill.name }}</h4>
            <div v-if="skill.level" class="skill-level">
              <div 
                class="skill-bar" 
                :style="{ width: skill.level + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 展览经历 -->
      <div class="section" v-if="resumeData.workExperience?.length">
        <h2 class="section-title">Exhibitions & Experience</h2>
        <div 
          v-for="work in resumeData.workExperience" 
          :key="work.id"
          class="exhibition-item"
        >
          <div class="exhibition-header">
            <h3 class="exhibition-title">{{ work.jobTitle }}</h3>
            <span class="exhibition-meta">{{ work.company }} • {{ work.startDate }} - {{ work.endDate }}</span>
          </div>
          <ul class="exhibition-list" v-if="work.responsibilities?.length">
            <li v-for="resp in work.responsibilities" :key="resp">{{ resp }}</li>
          </ul>
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
    default: 'artistic-portfolio'
  }
})

// 使用新的样式系统
const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.artistic-portfolio-template {
  font-family: 'Georgia', 'Times New Roman', serif;
  background: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  font-size: 14px;
}

.resume-container {
  max-width: 210mm;
  margin: 0 auto;
  padding: 60px 50px;
  background: white;
  min-height: 100vh;
  position: relative;
}

/* 装饰性元素 */
.resume-container::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 30px;
  width: 40px;
  height: 40px;
  border: 2px solid var(--primary-color);
  opacity: 0.3;
}

.resume-container::after {
  content: '';
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 40px;
  height: 40px;
  border: 2px solid var(--primary-color);
  opacity: 0.3;
}

/* 头部样式 */
.header-section {
  margin-bottom: 60px;
  text-align: center;
  position: relative;
}

.header-section::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 2px;
  background: var(--primary-color);
  opacity: 0.6;
}

.name {
  font-size: 42px;
  font-weight: 300;
  color: var(--primary-color);
  margin: 0 0 15px 0;
  letter-spacing: 1px;
  font-family: 'Playfair Display', Georgia, serif;
}

.title {
  font-size: 18px;
  color: var(--secondary-color);
  margin: 0 0 30px 0;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.contact-line {
  display: flex;
  justify-content: center;
  gap: 25px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.contact-item {
  font-size: 13px;
  color: var(--secondary-color);
  font-weight: 300;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 章节样式 */
.section {
  margin-bottom: 50px;
}

.section-title {
  font-size: 22px;
  font-weight: 300;
  color: var(--primary-color);
  margin: 0 0 30px 0;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-align: center;
  position: relative;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: var(--primary-color);
}

/* 艺术家声明 */
.artist-statement {
  max-width: 700px;
  margin: 0 auto;
}

.statement-title {
  font-size: 18px;
  color: var(--primary-color);
  margin: 0 0 20px 0;
  text-align: center;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: 2px;
}

.statement-content {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-color);
  margin: 0;
  font-style: italic;
  text-align: justify;
  font-family: 'Georgia', serif;
}

/* 作品集网格 */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.portfolio-item {
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.portfolio-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.portfolio-header {
  margin-bottom: 15px;
}

.portfolio-title {
  font-size: 18px;
  font-weight: 400;
  color: var(--primary-color);
  margin: 0 0 8px 0;
  font-family: 'Playfair Display', Georgia, serif;
}

.portfolio-meta {
  font-size: 12px;
  color: var(--secondary-color);
  font-weight: 300;
  letter-spacing: 1px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.portfolio-description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color);
  margin: 15px 0;
  font-family: 'Georgia', serif;
}

/* 媒介标签 */
.medium-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.medium-tag {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 400;
  letter-spacing: 0.5px;
  padding: 4px 12px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 15px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 教育背景 */
.education-item {
  margin-bottom: 25px;
}

.education-item:last-child {
  margin-bottom: 0;
}

.education-header {
  margin-bottom: 10px;
}

.degree {
  font-size: 16px;
  font-weight: 400;
  color: var(--primary-color);
  margin: 0 0 5px 0;
  font-family: 'Playfair Display', Georgia, serif;
}

.school-meta {
  font-size: 13px;
  color: var(--secondary-color);
  font-weight: 300;
  letter-spacing: 0.5px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 技能分类 */
.skills-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.skill-category {
  text-align: center;
}

.skill-name {
  font-size: 14px;
  color: var(--primary-color);
  margin: 0 0 10px 0;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: 1px;
}

.skill-level {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.skill-bar {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.5s ease;
}

/* 展览经历 */
.exhibition-item {
  margin-bottom: 30px;
}

.exhibition-item:last-child {
  margin-bottom: 0;
}

.exhibition-header {
  margin-bottom: 15px;
}

.exhibition-title {
  font-size: 16px;
  font-weight: 400;
  color: var(--primary-color);
  margin: 0 0 8px 0;
  font-family: 'Playfair Display', Georgia, serif;
}

.exhibition-meta {
  font-size: 12px;
  color: var(--secondary-color);
  font-weight: 300;
  letter-spacing: 0.5px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.exhibition-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.exhibition-list li {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  color: var(--text-color);
  position: relative;
  padding-left: 20px;
  font-family: 'Georgia', serif;
}

.exhibition-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--primary-color);
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-container {
    padding: 40px 25px;
  }
  
  .name {
    font-size: 32px;
  }
  
  .contact-line {
    flex-direction: column;
    gap: 10px;
  }
  
  .portfolio-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .skills-categories {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .section-title {
    font-size: 18px;
    letter-spacing: 3px;
  }
}
</style>