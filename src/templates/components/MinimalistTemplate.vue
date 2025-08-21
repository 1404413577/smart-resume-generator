<template>
  <div class="minimalist-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 头部信息 -->
      <div class="header-section">
        <h1 class="name">{{ resumeData.personalInfo?.name || 'Name' }}</h1>
        <p class="title">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Position' }}</p>
        
        <div class="contact-line">
          <span v-if="resumeData.personalInfo?.email" class="contact-item">
            {{ resumeData.personalInfo.email }}
          </span>
          <span v-if="resumeData.personalInfo?.phone" class="contact-item">
            {{ resumeData.personalInfo.phone }}
          </span>
          <span v-if="resumeData.personalInfo?.address" class="contact-item">
            {{ resumeData.personalInfo.address }}
          </span>
          <span v-if="resumeData.personalInfo?.website" class="contact-item">
            {{ resumeData.personalInfo.website }}
          </span>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="section" v-if="resumeData.summary">
        <p class="summary">{{ resumeData.summary }}</p>
      </div>

      <!-- 工作经历 -->
      <div class="section" v-if="resumeData.workExperience?.length">
        <h2 class="section-title">Experience</h2>
        <div 
          v-for="work in resumeData.workExperience" 
          :key="work.id"
          class="item"
        >
          <div class="item-header">
            <h3 class="item-title">{{ work.jobTitle }}</h3>
            <span class="item-meta">{{ work.company }} • {{ work.startDate }} - {{ work.endDate }}</span>
          </div>
          <ul class="item-list" v-if="work.responsibilities?.length">
            <li v-for="resp in work.responsibilities" :key="resp">{{ resp }}</li>
          </ul>
        </div>
      </div>

      <!-- 教育背景 -->
      <div class="section" v-if="resumeData.education?.length">
        <h2 class="section-title">Education</h2>
        <div 
          v-for="edu in resumeData.education" 
          :key="edu.id"
          class="item"
        >
          <div class="item-header">
            <h3 class="item-title">{{ edu.degree }} {{ edu.major }}</h3>
            <span class="item-meta">{{ edu.school }} • {{ edu.graduationDate }}</span>
          </div>
        </div>
      </div>

      <!-- 技能特长 -->
      <div class="section" v-if="resumeData.skills?.length">
        <h2 class="section-title">Skills</h2>
        <div class="skills-list">
          <span 
            v-for="skill in resumeData.skills" 
            :key="skill.name"
            class="skill-tag"
          >
            {{ skill.name }}
          </span>
        </div>
      </div>

      <!-- 项目经历 -->
      <div class="section" v-if="resumeData.projects?.length">
        <h2 class="section-title">Projects</h2>
        <div 
          v-for="project in resumeData.projects" 
          :key="project.id"
          class="item"
        >
          <div class="item-header">
            <h3 class="item-title">{{ project.name }}</h3>
            <span class="item-meta">{{ project.startDate }} - {{ project.endDate }}</span>
          </div>
          <p class="item-description">{{ project.description }}</p>
          <div v-if="project.technologies?.length" class="tech-tags">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="tech-tag"
            >
              {{ tech }}
            </span>
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
    default: 'minimalist'
  }
})

// 使用新的样式系统
const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.minimalist-template {
  font-family: 'Helvetica Neue', Arial, sans-serif;
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
}

/* 头部样式 */
.header-section {
  margin-bottom: 60px;
  text-align: center;
}

.name {
  font-size: 36px;
  font-weight: 300;
  color: var(--primary-color);
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

.title {
  font-size: 16px;
  color: var(--secondary-color);
  margin: 0 0 30px 0;
  font-weight: 300;
  letter-spacing: 1px;
}

.contact-line {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.contact-item {
  font-size: 13px;
  color: var(--secondary-color);
  font-weight: 300;
}

/* 章节样式 */
.section {
  margin-bottom: 50px;
}

.section-title {
  font-size: 18px;
  font-weight: 300;
  color: var(--primary-color);
  margin: 0 0 30px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-align: center;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 1px;
  background: var(--primary-color);
}

/* 个人简介 */
.summary {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-color);
  margin: 0;
  text-align: center;
  font-weight: 300;
  max-width: 600px;
  margin: 0 auto;
}

/* 项目样式 */
.item {
  margin-bottom: 40px;
  text-align: center;
}

.item:last-child {
  margin-bottom: 0;
}

.item-header {
  margin-bottom: 15px;
}

.item-title {
  font-size: 16px;
  font-weight: 400;
  color: var(--primary-color);
  margin: 0 0 5px 0;
}

.item-meta {
  font-size: 12px;
  color: var(--secondary-color);
  font-weight: 300;
  letter-spacing: 0.5px;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

.item-list li {
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 8px;
  color: var(--text-color);
  font-weight: 300;
  position: relative;
  padding-left: 15px;
}

.item-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--secondary-color);
}

.item-description {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-color);
  margin: 15px auto 0;
  font-weight: 300;
  max-width: 600px;
}

/* 技能标签 */
.skills-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
}

.skill-tag {
  font-size: 12px;
  color: var(--text-color);
  font-weight: 300;
  letter-spacing: 1px;
  padding: 8px 0;
  border-bottom: 1px solid var(--secondary-color);
  min-width: 80px;
  text-align: center;
}

/* 技术标签 */
.tech-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.tech-tag {
  font-size: 11px;
  color: var(--secondary-color);
  font-weight: 300;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  border: 1px solid var(--secondary-color);
  border-radius: 2px;
}

/* 打印样式 */
@media print {
  .minimalist-template {
    font-size: 12px;
  }
  
  .resume-container {
    padding: 40px 30px;
    min-height: auto;
  }
  
  .name {
    font-size: 28px;
  }
  
  .section {
    margin-bottom: 35px;
  }
  
  .section-title {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .item {
    margin-bottom: 25px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-container {
    padding: 40px 30px;
  }
  
  .name {
    font-size: 28px;
  }
  
  .contact-line {
    flex-direction: column;
    gap: 10px;
  }
  
  .skills-list {
    justify-content: flex-start;
  }
  
  .tech-tags {
    justify-content: flex-start;
  }
}
</style>
