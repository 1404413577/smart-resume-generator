<template>
  <div class="executive-template" :style="templateStyles">
    <!-- 顶部横幅 -->
    <div class="executive-header">
      <div class="header-content">
        <div class="executive-info">
          <h1 class="executive-name">{{ resumeData.personalInfo?.name || '姓名' }}</h1>
          <h2 class="executive-title">{{ resumeData.personalInfo?.targetPosition || '高级管理职位' }}</h2>
          <div class="executive-summary" v-if="resumeData.summary">
            <p>{{ resumeData.summary }}</p>
          </div>
        </div>
        <div class="executive-photo" v-if="resumeData.personalInfo?.photo">
          <img :src="resumeData.personalInfo.photo" alt="头像" />
        </div>
      </div>
      
      <!-- 联系信息 -->
      <div class="contact-bar">
        <div class="contact-item" v-if="resumeData.personalInfo?.email">
          <span class="contact-icon">✉</span>
          <span>{{ resumeData.personalInfo.email }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo?.phone">
          <span class="contact-icon">☎</span>
          <span>{{ resumeData.personalInfo.phone }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo?.address">
          <span class="contact-icon">📍</span>
          <span>{{ resumeData.personalInfo.address }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo?.linkedin">
          <span class="contact-icon">💼</span>
          <span>{{ resumeData.personalInfo.linkedin }}</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="executive-content">
      <!-- 核心能力 -->
      <section v-if="resumeData.skills?.length > 0" class="executive-section core-competencies">
        <h3 class="section-title">核心能力</h3>
        <div class="competencies-grid">
          <div 
            v-for="skill in resumeData.skills.slice(0, 8)" 
            :key="skill.id"
            class="competency-item"
          >
            <div class="competency-name">{{ skill.name }}</div>
            <div class="competency-level">{{ skill.level }}</div>
          </div>
        </div>
      </section>

      <!-- 领导经验 -->
      <section v-if="resumeData.workExperience?.length > 0" class="executive-section leadership-experience">
        <h3 class="section-title">领导经验</h3>
        <div class="experience-timeline">
          <div 
            v-for="work in resumeData.workExperience" 
            :key="work.id"
            class="experience-item"
          >
            <div class="experience-period">
              <div class="period-dates">{{ work.startDate }} - {{ work.endDate }}</div>
              <div class="period-duration">{{ calculateDuration(work.startDate, work.endDate) }}</div>
            </div>
            <div class="experience-details">
              <h4 class="position-title">{{ work.position }}</h4>
              <h5 class="company-name">{{ work.company }}</h5>
              <p class="position-description">{{ work.description }}</p>
              <ul v-if="work.achievements?.length" class="key-achievements">
                <li v-for="achievement in work.achievements" :key="achievement">
                  {{ achievement }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 重要项目 -->
      <section v-if="resumeData.projects?.length > 0" class="executive-section strategic-projects">
        <h3 class="section-title">战略项目</h3>
        <div class="projects-grid">
          <div 
            v-for="project in resumeData.projects" 
            :key="project.id"
            class="project-card"
          >
            <h4 class="project-name">{{ project.name }}</h4>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-impact" v-if="project.highlights?.length">
              <div class="impact-title">关键成果：</div>
              <ul class="impact-list">
                <li v-for="highlight in project.highlights" :key="highlight">
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 教育背景 -->
      <section v-if="resumeData.education?.length > 0" class="executive-section education-background">
        <h3 class="section-title">教育背景</h3>
        <div class="education-list">
          <div 
            v-for="edu in resumeData.education" 
            :key="edu.id"
            class="education-item"
          >
            <div class="education-main">
              <h4 class="degree-title">{{ edu.degree }} - {{ edu.major }}</h4>
              <h5 class="institution-name">{{ edu.school }}</h5>
              <div class="education-details">
                <span class="graduation-year">{{ edu.endDate }}</span>
                <span v-if="edu.gpa" class="gpa">GPA: {{ edu.gpa }}</span>
                <span v-if="edu.honors" class="honors">{{ edu.honors }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 认证资质 -->
      <section v-if="resumeData.certifications?.length > 0" class="executive-section certifications">
        <h3 class="section-title">专业认证</h3>
        <div class="certifications-grid">
          <div 
            v-for="cert in resumeData.certifications" 
            :key="cert.id"
            class="certification-item"
          >
            <div class="cert-name">{{ cert.name }}</div>
            <div class="cert-issuer">{{ cert.issuer }}</div>
            <div class="cert-date">{{ cert.date }}</div>
          </div>
        </div>
      </section>
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
    default: 'executive'
  }
})

// 使用模板样式
const { templateStyles } = useTemplateComponentStyles(props.templateId)

// 计算工作时长
const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return ''
  
  const start = new Date(startDate)
  const end = endDate === '至今' ? new Date() : new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
  const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
  
  if (diffYears > 0) {
    return diffMonths > 0 ? `${diffYears}年${diffMonths}个月` : `${diffYears}年`
  } else {
    return `${diffMonths}个月`
  }
}
</script>

<style scoped>
.executive-template {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  font-family: var(--font-family, 'Georgia, serif');
  color: var(--theme-text-primary, #2c3e50);
  line-height: var(--line-height, 1.6);
  margin: 0 auto;
}

/* 顶部横幅 */
.executive-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
  color: white;
  padding: 40px 30px 20px 30px;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.executive-info {
  flex: 1;
  max-width: 70%;
}

.executive-name {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.executive-title {
  font-size: 20px;
  font-weight: 400;
  margin: 0 0 20px 0;
  opacity: 0.9;
  font-style: italic;
}

.executive-summary {
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.95;
}

.executive-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.executive-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.9;
}

.contact-icon {
  font-size: 16px;
}

/* 主要内容 */
.executive-content {
  padding: 40px 30px;
}

.executive-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0 0 25px 0;
  padding-bottom: 8px;
  border-bottom: 3px solid #1e3a8a;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 核心能力 */
.competencies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.competency-item {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #1e3a8a;
}

.competency-name {
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 5px;
}

.competency-level {
  font-size: 14px;
  color: #64748b;
}

/* 领导经验 */
.experience-timeline {
  position: relative;
}

.experience-item {
  display: flex;
  gap: 30px;
  margin-bottom: 35px;
  padding-bottom: 35px;
  border-bottom: 1px solid #e2e8f0;
}

.experience-item:last-child {
  border-bottom: none;
}

.experience-period {
  flex-shrink: 0;
  width: 150px;
  text-align: right;
}

.period-dates {
  font-weight: 600;
  color: #1e3a8a;
  font-size: 14px;
}

.period-duration {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.experience-details {
  flex: 1;
}

.position-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0 0 5px 0;
}

.company-name {
  font-size: 16px;
  font-weight: 500;
  color: #475569;
  margin: 0 0 15px 0;
}

.position-description {
  margin: 0 0 15px 0;
  color: #64748b;
}

.key-achievements {
  list-style: none;
  padding: 0;
  margin: 0;
}

.key-achievements li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
  color: #475569;
}

.key-achievements li::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: #1e3a8a;
  font-size: 12px;
}

/* 战略项目 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.project-card {
  background: #f8fafc;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0 0 12px 0;
}

.project-description {
  margin: 0 0 15px 0;
  color: #64748b;
}

.impact-title {
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.impact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.impact-list li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 14px;
}

.impact-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #059669;
  font-weight: bold;
}

/* 教育背景 */
.education-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.education-item {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #1e3a8a;
}

.degree-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0 0 5px 0;
}

.institution-name {
  font-size: 16px;
  font-weight: 500;
  color: #475569;
  margin: 0 0 10px 0;
}

.education-details {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #64748b;
}

/* 专业认证 */
.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.certification-item {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.cert-name {
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 5px;
}

.cert-issuer {
  color: #475569;
  margin-bottom: 5px;
  font-size: 14px;
}

.cert-date {
  color: #64748b;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .executive-template {
    width: 100%;
    min-height: auto;
  }
  
  .executive-header {
    padding: 20px 15px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .executive-info {
    max-width: 100%;
  }
  
  .executive-name {
    font-size: 28px;
  }
  
  .contact-bar {
    gap: 15px;
  }
  
  .executive-content {
    padding: 20px 15px;
  }
  
  .experience-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .experience-period {
    width: auto;
    text-align: left;
  }
  
  .competencies-grid,
  .projects-grid,
  .certifications-grid {
    grid-template-columns: 1fr;
  }
}

</style>
