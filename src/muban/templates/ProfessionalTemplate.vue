<template>
  <div class="professional-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 头部信息 -->
      <div class="header-section">
        <div class="header-left">
          <div class="avatar-section" v-if="resumeData.personalInfo?.photo">
            <img :src="resumeData.personalInfo.photo" alt="头像" class="avatar" />
          </div>
          <div class="name-section">
            <h1 class="name">{{ resumeData.personalInfo?.name || 'Professional Name' }}</h1>
            <h2 class="title">{{ resumeData.personalInfo?.title || 'Professional Title' }}</h2>
          </div>
        </div>
        
        <div class="header-right">
          <div class="contact-section">
            <div v-if="resumeData.personalInfo?.email" class="contact-item">
              <div class="contact-label">Email</div>
              <div class="contact-value">{{ resumeData.personalInfo.email }}</div>
            </div>
            <div v-if="resumeData.personalInfo?.phone" class="contact-item">
              <div class="contact-label">Phone</div>
              <div class="contact-value">{{ resumeData.personalInfo.phone }}</div>
            </div>
            <div v-if="resumeData.personalInfo?.address" class="contact-item">
              <div class="contact-label">Address</div>
              <div class="contact-value">{{ resumeData.personalInfo.address }}</div>
            </div>
            <div v-if="resumeData.personalInfo?.website" class="contact-item">
              <div class="contact-label">Website</div>
              <div class="contact-value">{{ resumeData.personalInfo.website }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分割线 -->
      <div class="header-divider"></div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 左侧栏 -->
        <div class="sidebar">
          <!-- 个人简介 -->
          <div class="sidebar-section" v-if="resumeData.summary">
            <h3 class="sidebar-title">Executive Summary</h3>
            <p class="summary-text">{{ resumeData.summary }}</p>
          </div>

          <!-- 核心技能 -->
          <div class="sidebar-section" v-if="resumeData.skills?.length">
            <h3 class="sidebar-title">Core Competencies</h3>
            <div class="skills-list">
              <div 
                v-for="skill in resumeData.skills" 
                :key="skill.name"
                class="skill-item"
              >
                <div class="skill-header">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-level">{{ skill.level }}</span>
                </div>
                <div class="skill-bar">
                  <div 
                    class="skill-progress"
                    :style="{ width: getSkillWidth(skill.level) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 教育背景 -->
          <div class="sidebar-section" v-if="resumeData.education?.length">
            <h3 class="sidebar-title">Education</h3>
            <div 
              v-for="edu in resumeData.education" 
              :key="edu.id"
              class="education-item"
            >
              <div class="education-degree">{{ edu.degree }}</div>
              <div class="education-major">{{ edu.major }}</div>
              <div class="education-school">{{ edu.school }}</div>
              <div class="education-date">{{ edu.graduationDate }}</div>
              <div v-if="edu.gpa" class="education-gpa">GPA: {{ edu.gpa }}</div>
            </div>
          </div>

          <!-- 语言能力 -->
          <div class="sidebar-section" v-if="resumeData.languages?.length">
            <h3 class="sidebar-title">Languages</h3>
            <div class="languages-list">
              <div 
                v-for="lang in resumeData.languages" 
                :key="lang.name"
                class="language-item"
              >
                <span class="language-name">{{ lang.name }}</span>
                <span class="language-level">{{ lang.level }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧主内容 -->
        <div class="main-section">
          <!-- 工作经历 -->
          <div class="content-section" v-if="resumeData.workExperience?.length">
            <h3 class="section-title">Professional Experience</h3>
            <div 
              v-for="work in resumeData.workExperience" 
              :key="work.id"
              class="experience-item"
            >
              <div class="experience-header">
                <div class="experience-left">
                  <h4 class="job-title">{{ work.jobTitle }}</h4>
                  <h5 class="company-name">{{ work.company }}</h5>
                </div>
                <div class="experience-right">
                  <div class="work-period">{{ work.startDate }} - {{ work.endDate }}</div>
                  <div v-if="work.location" class="work-location">{{ work.location }}</div>
                </div>
              </div>
              <ul class="responsibilities" v-if="work.responsibilities?.length">
                <li v-for="resp in work.responsibilities" :key="resp">{{ resp }}</li>
              </ul>
            </div>
          </div>

          <!-- 项目经历 -->
          <div class="content-section" v-if="resumeData.projects?.length">
            <h3 class="section-title">Key Projects</h3>
            <div 
              v-for="project in resumeData.projects" 
              :key="project.id"
              class="project-item"
            >
              <div class="project-header">
                <h4 class="project-name">{{ project.name }}</h4>
                <span class="project-period">{{ project.startDate }} - {{ project.endDate }}</span>
              </div>
              <p class="project-description">{{ project.description }}</p>
              <div v-if="project.technologies?.length" class="project-technologies">
                <strong>Technologies Used:</strong>
                <span class="tech-list">{{ project.technologies.join(', ') }}</span>
              </div>
            </div>
          </div>

          <!-- 成就与认证 -->
          <div class="content-section" v-if="resumeData.achievements?.length">
            <h3 class="section-title">Achievements & Certifications</h3>
            <ul class="achievements-list">
              <li v-for="achievement in resumeData.achievements" :key="achievement">
                {{ achievement }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateId: {
    type: String,
    default: 'professional'
  }
})

// 使用新的样式系统
const { templateStyles } = useTemplateComponentStyles(props.templateId)

// 技能等级转换
const getSkillWidth = (level) => {
  const levelMap = {
    '初级': 30,
    '中级': 60,
    '高级': 85,
    '专家': 100
  }
  return levelMap[level] || 60
}
</script>

<style scoped>
.professional-template {
  font-family: 'Georgia', 'Times New Roman', serif;
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

.header-left {
  display: flex;
  align-items: center;
  gap: 25px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 3px solid var(--primary-color);
  object-fit: cover;
}

.name {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.title {
  font-size: 16px;
  color: var(--secondary-color);
  margin: 0;
  font-weight: normal;
  font-style: italic;
}

.header-right {
  text-align: right;
}

.contact-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.contact-label {
  font-size: 11px;
  color: var(--secondary-color);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-value {
  font-size: 13px;
  color: var(--text-color);
  font-weight: 500;
}

/* 分割线 */
.header-divider {
  height: 3px;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  margin-bottom: 30px;
}

/* 主要内容布局 */
.main-content {
  display: flex;
  gap: 30px;
}

.sidebar {
  width: 35%;
}

.main-section {
  flex: 1;
}

/* 侧边栏样式 */
.sidebar-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid var(--accent-color);
}

.sidebar-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0 0 15px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.summary-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-color);
  margin: 0;
  text-align: justify;
}

/* 技能样式 */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
}

.skill-level {
  font-size: 11px;
  color: var(--secondary-color);
  font-weight: 500;
}

.skill-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(to right, var(--accent-color), var(--primary-color));
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 教育背景 */
.education-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.education-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.education-degree {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 2px;
}

.education-major {
  font-size: 13px;
  color: var(--accent-color);
  font-weight: 500;
  margin-bottom: 4px;
}

.education-school {
  font-size: 12px;
  color: var(--secondary-color);
  margin-bottom: 2px;
}

.education-date {
  font-size: 11px;
  color: var(--secondary-color);
  font-style: italic;
}

.education-gpa {
  font-size: 11px;
  color: var(--accent-color);
  font-weight: 600;
  margin-top: 4px;
}

/* 语言能力 */
.languages-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dotted var(--secondary-color);
}

.language-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-color);
}

.language-level {
  font-size: 11px;
  color: var(--secondary-color);
  font-style: italic;
}

/* 主内容区域 */
.content-section {
  margin-bottom: 35px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 8px;
}

/* 工作经历 */
.experience-item {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
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
  color: var(--accent-color);
  font-weight: 600;
  margin: 0;
}

.experience-right {
  text-align: right;
}

.work-period {
  font-size: 12px;
  color: var(--secondary-color);
  font-weight: 600;
}

.work-location {
  font-size: 11px;
  color: var(--secondary-color);
  font-style: italic;
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

/* 项目经历 */
.project-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
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

.project-period {
  font-size: 11px;
  color: var(--secondary-color);
  font-style: italic;
}

.project-description {
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 10px 0;
  text-align: justify;
}

.project-technologies {
  font-size: 12px;
  color: var(--secondary-color);
}

.tech-list {
  color: var(--accent-color);
  font-weight: 500;
}

/* 成就列表 */
.achievements-list {
  margin: 0;
  padding-left: 20px;
}

.achievements-list li {
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.6;
}

/* 打印样式 */
@media print {
  .professional-template {
    font-size: 12px;
  }
  
  .resume-container {
    box-shadow: none;
    padding: 20px;
    min-height: auto;
  }
  
  .name {
    font-size: 22px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .main-content {
    gap: 20px;
  }
  
  .sidebar {
    width: 30%;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-container {
    padding: 30px 20px;
  }
  
  .header-section {
    flex-direction: column;
    gap: 20px;
  }
  
  .header-left {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .header-right {
    text-align: left;
  }
  
  .main-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .experience-header,
  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .experience-right {
    text-align: left;
  }
}
</style>
