<template>
  <div class="creative-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 装饰性背景 -->
      <div class="bg-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <!-- 头部信息 -->
      <div class="header-section">
        <div class="avatar-container" v-if="resumeData.personalInfo?.photo">
          <div class="avatar-frame">
            <img :src="resumeData.personalInfo.photo" alt="头像" class="avatar" />
          </div>
        </div>
        
        <div class="header-content">
          <h1 class="name">{{ resumeData.personalInfo?.name || 'Creative Name' }}</h1>
          <div class="title-container">
            <div class="title-decoration"></div>
            <h2 class="title">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Creative Position' }}</h2>
            <div class="title-decoration"></div>
          </div>
          
          <div class="contact-cards">
            <div v-if="resumeData.personalInfo?.email" class="contact-card">
              <div class="contact-icon">✉</div>
              <span class="contact-text">{{ resumeData.personalInfo.email }}</span>
            </div>
            <div v-if="resumeData.personalInfo?.phone" class="contact-card">
              <div class="contact-icon">📱</div>
              <span class="contact-text">{{ resumeData.personalInfo.phone }}</span>
            </div>
            <div v-if="resumeData.personalInfo?.website" class="contact-card">
              <div class="contact-icon">🌐</div>
              <span class="contact-text">{{ resumeData.personalInfo.website }}</span>
            </div>
            <div v-if="resumeData.personalInfo?.address" class="contact-card">
              <div class="contact-icon">📍</div>
              <span class="contact-text">{{ resumeData.personalInfo.address }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="creative-section" v-if="resumeData.summary">
        <div class="section-header">
          <div class="section-icon">💫</div>
          <h3 class="section-title">About Me</h3>
        </div>
        <div class="summary-card">
          <p class="summary-text">{{ resumeData.summary }}</p>
        </div>
      </div>

      <!-- 技能特长 -->
      <div class="creative-section" v-if="resumeData.skills?.length">
        <div class="section-header">
          <div class="section-icon">🎨</div>
          <h3 class="section-title">Skills & Expertise</h3>
        </div>
        <div class="skills-container">
          <div 
            v-for="skill in resumeData.skills" 
            :key="skill.name"
            class="skill-bubble"
            :class="getSkillClass(skill.level)"
          >
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-level">{{ skill.level }}</span>
          </div>
        </div>
      </div>

      <!-- 工作经历 -->
      <div class="creative-section" v-if="resumeData.workExperience?.length">
        <div class="section-header">
          <div class="section-icon">🚀</div>
          <h3 class="section-title">Work Journey</h3>
        </div>
        <div class="timeline">
          <div 
            v-for="(work, index) in resumeData.workExperience" 
            :key="work.id"
            class="timeline-item"
          >
            <div class="timeline-marker">
              <div class="timeline-dot"></div>
              <div v-if="index < resumeData.workExperience.length - 1" class="timeline-line"></div>
            </div>
            <div class="timeline-content">
              <div class="work-card">
                <div class="work-header">
                  <h4 class="job-title">{{ work.position }}</h4>
                  <div class="company-badge">{{ work.company }}</div>
                </div>
                <div class="work-meta">
                  <span class="work-period">{{ work.startDate }} - {{ work.endDate }}</span>
                  <span v-if="work.location" class="work-location">{{ work.location }}</span>
                </div>
                <div v-if="work.description" class="work-description">
                  <p>{{ work.description }}</p>
                </div>
                <ul class="work-achievements" v-if="work.achievements?.length">
                  <li v-for="achievement in work.achievements" :key="achievement">{{ achievement }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目经历 -->
      <div class="creative-section" v-if="resumeData.projects?.length">
        <div class="section-header">
          <div class="section-icon">💡</div>
          <h3 class="section-title">Featured Projects</h3>
        </div>
        <div class="projects-grid">
          <div 
            v-for="project in resumeData.projects" 
            :key="project.id"
            class="project-card"
          >
            <div class="project-header">
              <h4 class="project-name">{{ project.name }}</h4>
              <span class="project-period">{{ project.startDate }} - {{ project.endDate }}</span>
            </div>
            <p class="project-description">{{ project.description }}</p>
            <div v-if="project.technologies?.length" class="project-tech">
              <div 
                v-for="tech in project.technologies" 
                :key="tech"
                class="tech-pill"
              >
                {{ tech }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 教育背景 -->
      <div class="creative-section" v-if="resumeData.education?.length">
        <div class="section-header">
          <div class="section-icon">🎓</div>
          <h3 class="section-title">Education</h3>
        </div>
        <div class="education-cards">
          <div 
            v-for="edu in resumeData.education" 
            :key="edu.id"
            class="education-card"
          >
            <div class="education-content">
              <h4 class="degree-title">{{ edu.degree }}</h4>
              <h5 class="major-title">{{ edu.major }}</h5>
              <div class="school-info">
                <span class="school-name">{{ edu.school }}</span>
                <span class="graduation-date">{{ edu.endDate }}</span>
              </div>
              <div v-if="edu.gpa" class="gpa-badge">GPA: {{ edu.gpa }}</div>
              <div v-if="edu.honors" class="honors-badge">{{ edu.honors }}</div>
              <div v-if="edu.description" class="description-text">{{ edu.description }}</div>
            </div>
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
    default: 'creative'
  }
})

// 使用新的样式系统
const { templateStyles } = useTemplateComponentStyles(props.templateId)

// 技能等级样式
const getSkillClass = (level) => {
  const levelMap = {
    '初级': 'skill-beginner',
    '中级': 'skill-intermediate',
    '高级': 'skill-advanced',
    '专家': 'skill-expert'
  }
  return levelMap[level] || 'skill-intermediate'
}
</script>

<style scoped>
.creative-template {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  font-size: 14px;
  position: relative;
}

.resume-container {
  max-width: 210mm;
  margin: 0 auto;
  padding: 40px;
  background: white;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 装饰性背景 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.05;
}

.circle-1 {
  width: 200px;
  height: 200px;
  background: var(--primary-color);
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  background: var(--accent-color);
  bottom: 100px;
  left: -75px;
}

.circle-3 {
  width: 100px;
  height: 100px;
  background: var(--secondary-color);
  top: 50%;
  right: 50px;
}

/* 头部样式 */
.header-section {
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  z-index: 1;
}

.avatar-container {
  margin-bottom: 30px;
}

.avatar-frame {
  display: inline-block;
  padding: 8px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
}

.name {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 20px 0;
  letter-spacing: -0.5px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.title-decoration {
  width: 40px;
  height: 2px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 1px;
}

.title {
  font-size: 18px;
  color: var(--secondary-color);
  margin: 0;
  font-weight: 500;
}

.contact-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1));
  border-radius: 25px;
  border: 1px solid rgba(124, 58, 237, 0.2);
  font-size: 12px;
}

.contact-icon {
  font-size: 14px;
}

/* 章节样式 */
.creative-section {
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}

.section-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  color: white;
  font-size: 18px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

/* 个人简介 */
.summary-card {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(236, 72, 153, 0.05));
  border-radius: 15px;
  padding: 25px;
  border-left: 4px solid var(--primary-color);
}

.summary-text {
  font-size: 15px;
  line-height: 1.7;
  margin: 0;
  color: var(--text-color);
}

/* 技能气泡 */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.skill-bubble {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  border-radius: 20px;
  min-width: 100px;
  text-align: center;
  transition: transform 0.3s ease;
}

.skill-bubble:hover {
  transform: translateY(-3px);
}

.skill-beginner {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 2px solid #f59e0b;
}

.skill-intermediate {
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  border: 2px solid #3b82f6;
}

.skill-advanced {
  background: linear-gradient(135deg, #d1fae5, #86efac);
  border: 2px solid #10b981;
}

.skill-expert {
  background: linear-gradient(135deg, #fce7f3, #f9a8d4);
  border: 2px solid #ec4899;
}

.skill-name {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 4px;
}

.skill-level {
  font-size: 11px;
  opacity: 0.8;
}

/* 时间线 */
.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  margin-bottom: 30px;
}

.timeline-marker {
  position: relative;
  margin-right: 20px;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 16px;
  width: 2px;
  height: 50px;
  background: linear-gradient(to bottom, var(--primary-color), var(--accent-color));
  transform: translateX(-50%);
}

.work-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--primary-color);
  flex: 1;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.job-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.company-badge {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.work-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 12px;
  color: var(--secondary-color);
}

.work-achievements {
  margin: 0;
  padding-left: 20px;
}

.work-achievements li {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.5;
}

/* 项目网格 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--accent-color);
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.project-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.project-period {
  font-size: 11px;
  color: var(--secondary-color);
  background: rgba(124, 58, 237, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
}

.project-description {
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 15px 0;
  color: var(--text-color);
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-pill {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1));
  color: var(--primary-color);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

/* 教育卡片 */
.education-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.education-card {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(236, 72, 153, 0.05));
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(124, 58, 237, 0.1);
  text-align: center;
}

.degree-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 5px 0;
}

.major-title {
  font-size: 14px;
  color: var(--primary-color);
  margin: 0 0 15px 0;
  font-weight: 500;
}

.school-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 12px;
}

.school-name {
  color: var(--text-color);
  font-weight: 500;
}

.graduation-date {
  color: var(--secondary-color);
}

.gpa-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* 打印样式 */
@media print {
  .creative-template {
    font-size: 12px;
  }
  
  .resume-container {
    box-shadow: none;
    padding: 20px;
    min-height: auto;
  }
  
  .bg-decoration {
    display: none;
  }
  
  .name {
    font-size: 24px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .skill-bubble:hover,
  .project-card:hover {
    transform: none;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-container {
    padding: 30px 20px;
  }
  
  .contact-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .projects-grid,
  .education-cards {
    grid-template-columns: 1fr;
  }
  
  .timeline-item {
    flex-direction: column;
  }
  
  .timeline-marker {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .timeline-line {
    display: none;
  }
}
</style>
