<template>
  <div class="executive-template" :style="templateStyles">
    <!-- Header Section -->
    <header class="exec-header">
      <div class="header-main">
        <h1 class="exec-name">{{ resumeData.personalInfo?.name || '姓名' }}</h1>
        <h2 class="exec-title">{{ resumeData.personalInfo?.targetPosition || '高级管理职位' }}</h2>
      </div>
      <div class="header-photo" v-if="resumeData.personalInfo?.photo">
        <img :src="resumeData.personalInfo.photo" alt="Profile Photo" />
      </div>
    </header>

    <!-- Contacts Bar -->
    <div class="exec-contacts">
      <div class="contact-item" v-if="resumeData.personalInfo?.email">
        <i>✉</i>
        <span>{{ resumeData.personalInfo.email }}</span>
      </div>
      <div class="contact-item" v-if="resumeData.personalInfo?.phone">
        <i>☎</i>
        <span>{{ resumeData.personalInfo.phone }}</span>
      </div>
      <div class="contact-item" v-if="resumeData.personalInfo?.address">
        <i>📍</i>
        <span>{{ resumeData.personalInfo.address }}</span>
      </div>
      <div class="contact-item" v-if="resumeData.personalInfo?.linkedin">
        <i>💼</i>
        <span>{{ resumeData.personalInfo.linkedin }}</span>
      </div>
    </div>

    <!-- Summary Section -->
    <div class="exec-summary" v-if="resumeData.summary">
      <p>{{ resumeData.summary }}</p>
    </div>

    <!-- Core Competencies -->
    <section v-if="resumeData.skills?.length" class="exec-section">
      <h3 class="section-title"><span>核心专长 / Core Competencies</span></h3>
      <div class="skills-grid">
        <div class="skill-item" v-for="skill in resumeData.skills.slice(0, 9)" :key="skill.id">
          <span class="skill-name">{{ skill.name }}</span>
          <div class="skill-bar">
            <div class="skill-progress" :style="{ width: getSkillWidth(skill.level) }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Professional Experience -->
    <section v-if="resumeData.workExperience?.length" class="exec-section">
      <h3 class="section-title"><span>管理经验 / Executive Experience</span></h3>
      <div class="experience-list">
        <div class="exp-item" v-for="work in resumeData.workExperience" :key="work.id">
          <div class="exp-header">
            <div class="exp-title-group">
              <h4 class="exp-position">{{ work.position }}</h4>
              <span class="exp-company">{{ work.company }}</span>
            </div>
            <div class="exp-date">
              {{ work.startDate }} - {{ work.endDate }}
              <span class="exp-duration" v-if="calculateDuration(work.startDate, work.endDate)">
                ({{ calculateDuration(work.startDate, work.endDate) }})
              </span>
            </div>
          </div>
          <p class="exp-desc" v-if="work.description">{{ work.description }}</p>
          <ul class="exp-achievements" v-if="work.achievements?.length">
            <li v-for="achievement in work.achievements" :key="achievement">
              <span class="bullet"></span>
              <span class="text">{{ achievement }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Strategic Projects -->
    <section v-if="resumeData.projects?.length" class="exec-section">
      <h3 class="section-title"><span>战略项目 / Strategic Initiatives</span></h3>
      <div class="project-list">
        <div class="proj-item" v-for="project in resumeData.projects" :key="project.id">
          <div class="proj-header">
            <h4 class="proj-name">{{ project.name }}</h4>
          </div>
          <p class="proj-desc" v-if="project.description">{{ project.description }}</p>
          <div class="proj-highlights" v-if="project.highlights?.length">
            <div class="highlight-label">关键成果 Key Results:</div>
            <ul class="highlight-list">
               <li v-for="highlight in project.highlights" :key="highlight">
                 {{ highlight }}
               </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <div class="exec-bottom-row">
      <!-- Education -->
      <section v-if="resumeData.education?.length" class="exec-section half-width">
        <h3 class="section-title"><span>教育背景 / Education</span></h3>
        <div class="edu-list">
          <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
            <div class="edu-year">{{ edu.endDate }}</div>
            <div class="edu-details">
              <h4 class="edu-degree">{{ edu.degree }} · {{ edu.major }}</h4>
              <div class="edu-school">{{ edu.school }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Certifications -->
      <section v-if="resumeData.certifications?.length" class="exec-section half-width">
        <h3 class="section-title"><span>资格认证 / Certifications</span></h3>
        <div class="cert-list">
          <div class="cert-item" v-for="cert in resumeData.certifications" :key="cert.id">
            <div class="cert-year">{{ cert.date }}</div>
            <div class="cert-details">
              <h4 class="cert-name">{{ cert.name }}</h4>
              <div class="cert-issuer">{{ cert.issuer }}</div>
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
    default: 'executive'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return ''
  
  const start = new Date(startDate)
  const end = endDate === '至今' ? new Date() : new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
  const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
  
  if (diffYears > 0) {
    return diffMonths > 0 ? `${diffYears}年${diffMonths}个月` : `${diffYears}年`
  } else if (diffMonths > 0) {
    return `${diffMonths}个月`
  }
  return ''
}

// Map textual levels like '精通', '熟练', '了解' to percentage widths
const getSkillWidth = (level) => {
  const levelMap = {
    'expert': '100%',
    '精通': '100%',
    'advanced': '85%',
    '熟练': '85%',
    '良好': '70%',
    'intermediate': '70%',
    '一般': '50%',
    '了解': '30%',
    'beginner': '30%'
  }
  return levelMap[level] || levelMap[level?.toLowerCase()] || '80%'
}
</script>

<style scoped>
/* Reset and Base Styles */
.executive-template {
  --exec-primary: #111827;     /* Deep slate */
  --exec-secondary: #4b5563;   /* Slate gray */
  --exec-accent: #e5e7eb;      /* Light gray for lines */
  --exec-gold: #b45309;        /* Sophisticated gold/bronze for highlights */
  --exec-bg: #ffffff;
  
  width: 210mm;
  min-height: 297mm;
  background: var(--exec-bg);
  font-family: 'Times New Roman', Times, STSong, serif; /* High-end serif for executive feel */
  color: var(--exec-primary);
  line-height: 1.6;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 50px 50px 40px;
}

/* Header */
.exec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--exec-primary);
  padding-bottom: 20px;
  margin-bottom: 15px;
}

.header-main {
  flex: 1;
}

.exec-name {
  font-size: 38px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0 0 10px 0;
  color: var(--exec-primary);
}

.exec-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--exec-secondary);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;
  font-family: 'Arial', sans-serif;
}

.header-photo {
  width: 110px;
  height: 110px;
  border-radius: 4px; /* Slightly squared for professional look */
  overflow: hidden;
  border: 1px solid var(--exec-accent);
  margin-left: 30px;
}

.header-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(20%); /* Executive slight desaturation */
}

/* Contacts */
.exec-contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  font-family: 'Arial', sans-serif;
  font-size: 13px;
  color: var(--exec-secondary);
  justify-content: flex-start;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-item i {
  font-style: normal;
  color: var(--exec-primary);
  font-size: 15px;
}

/* Summary */
.exec-summary {
  font-size: 15px;
  line-height: 1.8;
  color: var(--exec-primary);
  margin-bottom: 40px;
  padding-left: 20px;
  border-left: 3px solid var(--exec-gold);
  font-style: italic;
  text-align: justify;
}

/* General Sections */
.exec-section {
  margin-bottom: 35px;
}

.exec-section.half-width {
  flex: 1;
  min-width: 0;
}

.exec-bottom-row {
  display: flex;
  gap: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--exec-primary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
}

.section-title span {
  padding-right: 15px;
  background: var(--exec-bg);
  position: relative;
  z-index: 1;
}

.section-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--exec-accent);
  position: relative;
  top: 1px;
}

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  font-family: 'Arial', sans-serif;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--exec-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.skill-bar {
  height: 3px;
  background: var(--exec-accent);
  width: 100%;
  border-radius: 1.5px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: var(--exec-primary);
  transition: width 0.5s ease;
}

/* Experience */
.experience-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.exp-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exp-position {
  font-size: 17px;
  font-weight: 700;
  margin: 0;
  color: var(--exec-primary);
}

.exp-company {
  font-size: 15px;
  font-weight: 600;
  color: var(--exec-gold);
  font-family: 'Arial', sans-serif;
}

.exp-date {
  font-size: 13px;
  color: var(--exec-secondary);
  font-family: 'Arial', sans-serif;
  text-align: right;
  font-weight: 500;
}

.exp-duration {
  font-style: italic;
  font-weight: normal;
  margin-left: 5px;
  color: var(--exec-secondary);
}

.exp-desc {
  font-size: 14px;
  color: var(--exec-secondary);
  margin: 0 0 12px 0;
  line-height: 1.6;
  text-align: justify;
}

.exp-achievements {
  list-style: none;
  padding: 0;
  margin: 0;
}

.exp-achievements li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.6;
}

.bullet {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  background-color: var(--exec-gold);
  border-radius: 50%;
  margin-top: 8px;
  margin-right: 12px;
  flex-shrink: 0;
}

/* Projects */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.proj-header {
  margin-bottom: 8px;
}

.proj-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--exec-primary);
  margin: 0;
}

.proj-desc {
  font-size: 14px;
  color: var(--exec-secondary);
  margin: 0 0 10px 0;
  line-height: 1.6;
  text-align: justify;
}

.proj-highlights {
  background: #f9fafb;
  padding: 15px;
  border-left: 2px solid var(--exec-primary);
  font-family: 'Arial', sans-serif;
}

.highlight-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--exec-primary);
  margin-bottom: 8px;
}

.highlight-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.highlight-list li {
  position: relative;
  padding-left: 15px;
  font-size: 13px;
  color: var(--exec-secondary);
  margin-bottom: 6px;
}

.highlight-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--exec-gold);
}

/* Education & Certs Side by Side */
.edu-list, .cert-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.edu-item, .cert-item {
  display: flex;
  gap: 20px;
  align-items: baseline;
}

.edu-year, .cert-year {
  font-family: 'Arial', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--exec-primary);
  width: 80px;
  flex-shrink: 0;
}

.edu-details, .cert-details {
  flex: 1;
}

.edu-degree, .cert-name {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: var(--exec-primary);
}

.edu-school, .cert-issuer {
  font-size: 14px;
  color: var(--exec-secondary);
  font-family: 'Arial', sans-serif;
}

/* Responsive */
@media (max-width: 768px) {
  .executive-template {
    width: 100%;
    min-height: auto;
    padding: 20px;
  }
  
  .exec-header {
    flex-direction: column-reverse;
    text-align: center;
    gap: 20px;
  }
  
  .header-photo {
    margin: 0;
  }
  
  .exec-contacts {
    justify-content: center;
  }
  
  .skills-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .exec-bottom-row {
    flex-direction: column;
    gap: 0;
  }
  
  .exp-header {
    flex-direction: column;
    gap: 5px;
  }
  
  .exp-date {
    text-align: left;
  }
}
</style>
