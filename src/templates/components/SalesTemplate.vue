<template>
  <div class="sales-template" :style="templateStyles">
    <!-- 动态头部 -->
    <div class="sales-header">
      <div class="header-pattern"></div>
      <div class="header-content">
        <div class="sales-profile">
          <div class="profile-photo" v-if="resumeData.personalInfo?.photo">
            <img :src="resumeData.personalInfo.photo" alt="头像" />
            <div class="photo-border"></div>
          </div>
          <div class="profile-info">
            <h1 class="sales-name">{{ resumeData.personalInfo?.name || '销售专家' }}</h1>
            <h2 class="sales-title">{{ resumeData.personalInfo?.targetPosition || '销售经理' }}</h2>
            <div class="sales-motto" v-if="resumeData.summary">
              <div class="motto-icon">💼</div>
              <p>{{ resumeData.summary }}</p>
            </div>
          </div>
        </div>
        
        <!-- 联系方式 -->
        <div class="contact-section">
          <div class="contact-grid">
            <div class="contact-item" v-if="resumeData.personalInfo?.email">
              <div class="contact-icon">📧</div>
              <div class="contact-details">
                <div class="contact-label">邮箱</div>
                <div class="contact-value">{{ resumeData.personalInfo.email }}</div>
              </div>
            </div>
            <div class="contact-item" v-if="resumeData.personalInfo?.phone">
              <div class="contact-icon">📱</div>
              <div class="contact-details">
                <div class="contact-label">电话</div>
                <div class="contact-value">{{ resumeData.personalInfo.phone }}</div>
              </div>
            </div>
            <div class="contact-item" v-if="resumeData.personalInfo?.address">
              <div class="contact-icon">📍</div>
              <div class="contact-details">
                <div class="contact-label">地址</div>
                <div class="contact-value">{{ resumeData.personalInfo.address }}</div>
              </div>
            </div>
            <div class="contact-item" v-if="resumeData.personalInfo?.linkedin">
              <div class="contact-icon">💼</div>
              <div class="contact-details">
                <div class="contact-label">LinkedIn</div>
                <div class="contact-value">{{ resumeData.personalInfo.linkedin }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="sales-content">
      <!-- 核心技能 -->
      <section v-if="resumeData.skills?.length > 0" class="sales-section skills-performance">
        <h3 class="section-title">
          <span class="title-icon">🎯</span>
          <span class="title-text">核心技能</span>
        </h3>
        <div class="skills-dashboard">
          <div 
            v-for="skill in resumeData.skills" 
            :key="skill.id"
            class="skill-meter"
          >
            <div class="skill-info">
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-level">{{ skill.level }}</div>
            </div>
            <div class="skill-bar">
              <div 
                class="skill-fill" 
                :style="{ width: getSkillPercentage(skill.level) }"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 销售业绩 -->
      <section v-if="resumeData.workExperience?.length > 0" class="sales-section performance-track">
        <h3 class="section-title">
          <span class="title-icon">📈</span>
          <span class="title-text">销售业绩</span>
        </h3>
        <div class="performance-timeline">
          <div 
            v-for="work in resumeData.workExperience" 
            :key="work.id"
            class="performance-item"
          >
            <div class="performance-header">
              <div class="performance-period">
                <div class="period-badge">{{ work.startDate }} - {{ work.endDate }}</div>
              </div>
              <div class="performance-role">
                <h4 class="role-title">{{ work.position }}</h4>
                <h5 class="company-name">{{ work.company }}</h5>
              </div>
            </div>
            <div class="performance-content">
              <p class="role-description">{{ work.description }}</p>
              <div class="achievements-grid" v-if="work.achievements?.length">
                <div 
                  v-for="achievement in work.achievements" 
                  :key="achievement"
                  class="achievement-card"
                >
                  <div class="achievement-icon">🏆</div>
                  <div class="achievement-text">{{ achievement }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 重要项目 -->
      <section v-if="resumeData.projects?.length > 0" class="sales-section projects-showcase">
        <h3 class="section-title">
          <span class="title-icon">🚀</span>
          <span class="title-text">重要项目</span>
        </h3>
        <div class="projects-grid">
          <div 
            v-for="project in resumeData.projects" 
            :key="project.id"
            class="project-card"
          >
            <div class="project-header">
              <h4 class="project-name">{{ project.name }}</h4>
              <div class="project-period">{{ project.startDate }} - {{ project.endDate }}</div>
            </div>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-results" v-if="project.highlights?.length">
              <div class="results-title">项目成果</div>
              <ul class="results-list">
                <li v-for="highlight in project.highlights" :key="highlight">
                  {{ highlight }}
                </li>
              </ul>
            </div>
            <div class="project-skills" v-if="project.technologies?.length">
              <div class="skills-used">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech"
                  class="skill-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 教育背景 -->
      <section v-if="resumeData.education?.length > 0" class="sales-section education-foundation">
        <h3 class="section-title">
          <span class="title-icon">🎓</span>
          <span class="title-text">教育背景</span>
        </h3>
        <div class="education-timeline">
          <div 
            v-for="edu in resumeData.education" 
            :key="edu.id"
            class="education-item"
          >
            <div class="edu-year">{{ edu.endDate }}</div>
            <div class="edu-content">
              <h4 class="edu-degree">{{ edu.degree }}</h4>
              <h5 class="edu-major">{{ edu.major }}</h5>
              <h6 class="edu-school">{{ edu.school }}</h6>
              <div class="edu-achievements">
                <span v-if="edu.gpa" class="gpa-badge">GPA: {{ edu.gpa }}</span>
                <span v-if="edu.honors" class="honors-badge">{{ edu.honors }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 认证证书 -->
      <section v-if="resumeData.certifications?.length > 0" class="sales-section certifications-showcase">
        <h3 class="section-title">
          <span class="title-icon">🏅</span>
          <span class="title-text">专业认证</span>
        </h3>
        <div class="certifications-grid">
          <div 
            v-for="cert in resumeData.certifications" 
            :key="cert.id"
            class="certification-badge"
          >
            <div class="cert-icon">🏅</div>
            <div class="cert-details">
              <div class="cert-name">{{ cert.name }}</div>
              <div class="cert-issuer">{{ cert.issuer }}</div>
              <div class="cert-date">{{ cert.date }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 语言技能 -->
      <section v-if="resumeData.languages?.length > 0" class="sales-section languages-global">
        <h3 class="section-title">
          <span class="title-icon">🌍</span>
          <span class="title-text">语言能力</span>
        </h3>
        <div class="languages-showcase">
          <div 
            v-for="lang in resumeData.languages" 
            :key="lang.id"
            class="language-card"
          >
            <div class="lang-flag">🌐</div>
            <div class="lang-info">
              <div class="lang-name">{{ lang.name }}</div>
              <div class="lang-level">{{ lang.level }}</div>
            </div>
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
    default: 'sales'
  }
})

// 使用模板样式
const { templateStyles } = useTemplateComponentStyles(props.templateId)

// 获取技能百分比
const getSkillPercentage = (level) => {
  const levelMap = {
    '初级': '25%',
    '中级': '50%',
    '高级': '75%',
    '专家': '90%',
    '精通': '100%'
  }
  return levelMap[level] || '50%'
}
</script>

<style scoped>
.sales-template {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  font-family: var(--font-family, 'Roboto, sans-serif');
  color: var(--theme-text-primary, #1a202c);
  line-height: var(--line-height, 1.6);
  margin: 0 auto;
}

/* 动态头部 */
.sales-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ff9ff3 100%);
  color: white;
  padding: 40px 30px;
  position: relative;
  overflow: hidden;
}

.header-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><defs><pattern id="hexagon" width="60" height="60" patternUnits="userSpaceOnUse"><polygon points="30,5 50,20 50,40 30,55 10,40 10,20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="60" height="60" fill="url(%23hexagon)"/></svg>');
  opacity: 0.3;
}

.header-content {
  position: relative;
  z-index: 2;
}

.sales-profile {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.profile-photo {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.profile-photo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.photo-border {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.profile-info {
  flex: 1;
}

.sales-name {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.sales-title {
  font-size: 22px;
  font-weight: 400;
  margin: 0 0 20px 0;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.sales-motto {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.motto-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.sales-motto p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

/* 联系方式 */
.contact-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.contact-details {
  flex: 1;
}

.contact-label {
  font-size: 11px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.contact-value {
  font-size: 14px;
  font-weight: 500;
}

/* 主要内容 */
.sales-content {
  padding: 40px 30px;
}

.sales-section {
  margin-bottom: 50px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  padding-bottom: 12px;
  border-bottom: 3px solid #ff6b6b;
}

.title-icon {
  font-size: 24px;
}

.title-text {
  font-size: 24px;
  font-weight: 600;
  color: #ff6b6b;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 技能仪表板 */
.skills-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.skill-meter {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.skill-meter:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.15);
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.skill-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
}

.skill-level {
  font-size: 14px;
  color: #ff6b6b;
  font-weight: 500;
}

.skill-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ee5a24);
  border-radius: 4px;
  transition: width 1.5s ease;
}

/* 业绩时间线 */
.performance-timeline {
  position: relative;
}

.performance-item {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.performance-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(255, 107, 107, 0.15);
}

.performance-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.period-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.performance-role {
  text-align: right;
}

.role-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.company-name {
  font-size: 16px;
  color: #ff6b6b;
  margin: 0;
  font-weight: 500;
}

.role-description {
  color: #4a5568;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.achievement-card {
  background: linear-gradient(135deg, #fff5f5, #fed7d7);
  padding: 15px;
  border-radius: 12px;
  border-left: 4px solid #ff6b6b;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.achievement-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.achievement-text {
  font-size: 14px;
  color: #2d3748;
  line-height: 1.5;
}

/* 项目展示 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.project-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b, #ee5a24, #ff9ff3);
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(255, 107, 107, 0.15);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.project-period {
  font-size: 12px;
  color: #ff6b6b;
  background: #fff5f5;
  padding: 4px 8px;
  border-radius: 12px;
}

.project-description {
  color: #4a5568;
  margin: 0 0 15px 0;
  line-height: 1.6;
}

.results-title {
  font-size: 14px;
  font-weight: 600;
  color: #ff6b6b;
  margin-bottom: 8px;
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0 0 15px 0;
}

.results-list li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 6px;
  color: #4a5568;
  font-size: 14px;
}

.results-list li::before {
  content: '📊';
  position: absolute;
  left: 0;
  font-size: 12px;
}

.skills-used {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* 教育背景 */
.education-timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.education-item {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #ff6b6b;
  display: flex;
  gap: 20px;
  align-items: center;
}

.edu-year {
  font-size: 28px;
  font-weight: 700;
  color: #ff6b6b;
  flex-shrink: 0;
  text-align: center;
  min-width: 80px;
}

.edu-content {
  flex: 1;
}

.edu-degree {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.edu-major {
  font-size: 16px;
  color: #ff6b6b;
  margin: 0 0 4px 0;
}

.edu-school {
  font-size: 14px;
  color: #4a5568;
  margin: 0 0 8px 0;
}

.edu-achievements {
  display: flex;
  gap: 10px;
}

.gpa-badge,
.honors-badge {
  background: #ff6b6b;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* 认证展示 */
.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.certification-badge {
  background: linear-gradient(135deg, #fff5f5, #fed7d7);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #fbb6ce;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.certification-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.15);
}

.cert-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.cert-details {
  flex: 1;
}

.cert-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
}

.cert-issuer {
  font-size: 14px;
  color: #ff6b6b;
  margin-bottom: 4px;
}

.cert-date {
  font-size: 12px;
  color: #4a5568;
}

/* 语言展示 */
.languages-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.language-card {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.language-card:hover {
  transform: scale(1.05);
}

.lang-flag {
  font-size: 24px;
  margin-bottom: 10px;
}

.lang-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.lang-level {
  font-size: 14px;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sales-template {
    width: 100%;
    min-height: auto;
  }

  .sales-header {
    padding: 20px 15px;
  }

  .sales-profile {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .sales-name {
    font-size: 32px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .sales-content {
    padding: 20px 15px;
  }

  .skills-dashboard,
  .projects-grid,
  .certifications-grid,
  .languages-showcase {
    grid-template-columns: 1fr;
  }

  .performance-header {
    flex-direction: column;
    gap: 15px;
  }

  .performance-role {
    text-align: left;
  }

  .education-item {
    flex-direction: column;
    text-align: center;
  }
}

/* 打印样式 */
@media print {
  .sales-template {
    box-shadow: none;
    margin: 0;
  }

  .photo-border {
    animation: none;
  }
}
</style>
