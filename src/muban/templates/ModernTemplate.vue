<template>
  <div class="modern-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 左侧栏 -->
      <div class="sidebar">
        <!-- 个人头像 -->
        <div class="avatar-section" v-if="resumeData.personalInfo?.photo">
          <img :src="resumeData.personalInfo.photo" alt="头像" class="avatar" />
        </div>

        <!-- 联系信息 -->
        <div class="contact-section">
          <h3 class="section-title">联系方式</h3>
          <div class="contact-item" v-if="resumeData.personalInfo?.email">
            <i class="icon">📧</i>
            <span>{{ resumeData.personalInfo.email }}</span>
          </div>
          <div class="contact-item" v-if="resumeData.personalInfo?.phone">
            <i class="icon">📱</i>
            <span>{{ resumeData.personalInfo.phone }}</span>
          </div>
          <div class="contact-item" v-if="resumeData.personalInfo?.address">
            <i class="icon">📍</i>
            <span>{{ resumeData.personalInfo.address }}</span>
          </div>
          <div class="contact-item" v-if="resumeData.personalInfo?.website">
            <i class="icon">🌐</i>
            <span>{{ resumeData.personalInfo.website }}</span>
          </div>
        </div>

        <!-- 技能特长 -->
        <div class="skills-section" v-if="resumeData.skills?.length">
          <h3 class="section-title">技能特长</h3>
          <div class="skills-grid">
            <div 
              v-for="skill in resumeData.skills" 
              :key="skill.name"
              class="skill-item"
            >
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-level">
                <div 
                  class="skill-bar"
                  :style="{ width: getSkillLevel(skill.level) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 语言能力 -->
        <div class="languages-section" v-if="resumeData.languages?.length">
          <h3 class="section-title">语言能力</h3>
          <div class="language-item" v-for="lang in resumeData.languages" :key="lang.name">
            <span class="language-name">{{ lang.name }}</span>
            <span class="language-level">{{ lang.level }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧主内容 -->
      <div class="main-content">
        <!-- 个人信息标题 -->
        <div class="header-section">
          <h1 class="name">{{ resumeData.personalInfo?.name || '姓名' }}</h1>
          <h2 class="title">{{ resumeData.personalInfo?.title || '职位' }}</h2>
        </div>

        <!-- 个人简介 -->
        <div class="summary-section" v-if="resumeData.summary">
          <h3 class="section-title">个人简介</h3>
          <p class="summary-text">{{ resumeData.summary }}</p>
        </div>

        <!-- 工作经历 -->
        <div class="experience-section" v-if="resumeData.workExperience?.length">
          <h3 class="section-title">工作经历</h3>
          <div 
            v-for="work in resumeData.workExperience" 
            :key="work.id"
            class="experience-item"
          >
            <div class="experience-header">
              <div class="job-info">
                <h4 class="job-title">{{ work.jobTitle }}</h4>
                <h5 class="company-name">{{ work.company }}</h5>
              </div>
              <div class="date-location">
                <span class="date">{{ work.startDate }} - {{ work.endDate }}</span>
                <span class="location" v-if="work.location">{{ work.location }}</span>
              </div>
            </div>
            <ul class="responsibilities" v-if="work.responsibilities?.length">
              <li v-for="resp in work.responsibilities" :key="resp">{{ resp }}</li>
            </ul>
          </div>
        </div>

        <!-- 教育背景 -->
        <div class="education-section" v-if="resumeData.education?.length">
          <h3 class="section-title">教育背景</h3>
          <div 
            v-for="edu in resumeData.education" 
            :key="edu.id"
            class="education-item"
          >
            <div class="education-header">
              <div class="degree-info">
                <h4 class="degree">{{ edu.degree }}</h4>
                <h5 class="school">{{ edu.school }}</h5>
              </div>
              <div class="edu-date">
                <span class="date">{{ edu.graduationDate }}</span>
                <span class="gpa" v-if="edu.gpa">GPA: {{ edu.gpa }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目经历 -->
        <div class="projects-section" v-if="resumeData.projects?.length">
          <h3 class="section-title">项目经历</h3>
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
              <span class="tech-label">技术栈：</span>
              <span class="tech-list">{{ project.technologies.join(', ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getTemplateById } from '../templateConfig.js'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateId: {
    type: String,
    default: 'modern'
  }
})

// 获取模板配置
const templateConfig = computed(() => getTemplateById(props.templateId))

// 模板样式
const templateStyles = computed(() => ({
  '--primary-color': templateConfig.value?.colors.primary || '#2563eb',
  '--secondary-color': templateConfig.value?.colors.secondary || '#64748b',
  '--accent-color': templateConfig.value?.colors.accent || '#0ea5e9',
  '--text-color': templateConfig.value?.colors.text || '#1e293b',
  '--background-color': templateConfig.value?.colors.background || '#ffffff'
}))

// 技能等级转换
const getSkillLevel = (level) => {
  const levelMap = {
    '初级': 30,
    '中级': 60,
    '高级': 90,
    '专家': 100
  }
  return levelMap[level] || 50
}
</script>

<style scoped>
.modern-template {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  font-size: 14px;
}

.resume-container {
  display: flex;
  min-height: 100vh;
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* 左侧栏样式 */
.sidebar {
  width: 35%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  padding: 30px 25px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.contact-section {
  margin-bottom: 30px;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
}

.contact-item .icon {
  margin-right: 10px;
  font-size: 16px;
}

.skills-section {
  margin-bottom: 30px;
}

.skill-item {
  margin-bottom: 15px;
}

.skill-name {
  font-size: 13px;
  margin-bottom: 5px;
  font-weight: 500;
}

.skill-level {
  background: rgba(255, 255, 255, 0.2);
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}

.skill-bar {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.languages-section .language-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

/* 右侧主内容样式 */
.main-content {
  flex: 1;
  padding: 40px 35px;
}

.header-section {
  margin-bottom: 30px;
  border-bottom: 3px solid var(--primary-color);
  padding-bottom: 20px;
}

.name {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.title {
  font-size: 18px;
  color: var(--secondary-color);
  margin: 0;
  font-weight: 400;
}

.main-content .section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  margin: 30px 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-color);
  position: relative;
}

.main-content .section-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--accent-color);
}

.summary-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-color);
  margin: 0;
}

.experience-item, .education-item, .project-item {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.experience-item:last-child, .education-item:last-child, .project-item:last-child {
  border-bottom: none;
}

.experience-header, .education-header, .project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.job-title, .degree, .project-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 4px 0;
}

.company-name, .school {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 500;
  margin: 0;
}

.date-location, .edu-date, .project-date {
  text-align: right;
  font-size: 12px;
  color: var(--secondary-color);
}

.location, .gpa {
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
}

.project-description {
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.project-tech {
  font-size: 12px;
}

.tech-label {
  font-weight: 600;
  color: var(--primary-color);
}

.tech-list {
  color: var(--secondary-color);
}

/* 打印样式 */
@media print {
  .modern-template {
    font-size: 12px;
  }
  
  .resume-container {
    box-shadow: none;
    min-height: auto;
  }
  
  .sidebar {
    width: 30%;
    padding: 20px 15px;
  }
  
  .main-content {
    padding: 25px 20px;
  }
  
  .name {
    font-size: 24px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
}
</style>
