<template>
  <div class="academic-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 头部信息 -->
      <div class="header-section">
        <h1 class="name">{{ resumeData.personalInfo?.name || 'Academic Name' }}</h1>
        <h2 class="title">{{ resumeData.personalInfo?.title || 'Academic Position' }}</h2>
        
        <div class="contact-info">
          <div class="contact-row">
            <span v-if="resumeData.personalInfo?.email">
              <strong>Email:</strong> {{ resumeData.personalInfo.email }}
            </span>
            <span v-if="resumeData.personalInfo?.phone">
              <strong>Phone:</strong> {{ resumeData.personalInfo.phone }}
            </span>
          </div>
          <div class="contact-row">
            <span v-if="resumeData.personalInfo?.address">
              <strong>Address:</strong> {{ resumeData.personalInfo.address }}
            </span>
            <span v-if="resumeData.personalInfo?.website">
              <strong>Website:</strong> {{ resumeData.personalInfo.website }}
            </span>
          </div>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="section" v-if="resumeData.summary">
        <h3 class="section-title">Research Interests</h3>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </div>

      <!-- 教育背景 -->
      <div class="section" v-if="resumeData.education?.length">
        <h3 class="section-title">Education</h3>
        <div 
          v-for="edu in resumeData.education" 
          :key="edu.id"
          class="education-item"
        >
          <div class="education-header">
            <div class="degree-info">
              <h4 class="degree">{{ edu.degree }} in {{ edu.major }}</h4>
              <h5 class="institution">{{ edu.school }}</h5>
            </div>
            <div class="education-meta">
              <span class="graduation-date">{{ edu.graduationDate }}</span>
              <span v-if="edu.gpa" class="gpa">GPA: {{ edu.gpa }}</span>
            </div>
          </div>
          <div v-if="edu.thesis" class="thesis">
            <strong>Thesis:</strong> {{ edu.thesis }}
          </div>
          <div v-if="edu.advisor" class="advisor">
            <strong>Advisor:</strong> {{ edu.advisor }}
          </div>
        </div>
      </div>

      <!-- 工作经历 -->
      <div class="section" v-if="resumeData.workExperience?.length">
        <h3 class="section-title">Academic Experience</h3>
        <div 
          v-for="work in resumeData.workExperience" 
          :key="work.id"
          class="experience-item"
        >
          <div class="experience-header">
            <div class="position-info">
              <h4 class="position">{{ work.jobTitle }}</h4>
              <h5 class="institution">{{ work.company }}</h5>
            </div>
            <div class="experience-meta">
              <span class="period">{{ work.startDate }} - {{ work.endDate }}</span>
              <span v-if="work.location" class="location">{{ work.location }}</span>
            </div>
          </div>
          <ul class="responsibilities" v-if="work.responsibilities?.length">
            <li v-for="resp in work.responsibilities" :key="resp">{{ resp }}</li>
          </ul>
        </div>
      </div>

      <!-- 研究项目 -->
      <div class="section" v-if="resumeData.projects?.length">
        <h3 class="section-title">Research Projects</h3>
        <div 
          v-for="project in resumeData.projects" 
          :key="project.id"
          class="project-item"
        >
          <div class="project-header">
            <h4 class="project-title">{{ project.name }}</h4>
            <span class="project-period">{{ project.startDate }} - {{ project.endDate }}</span>
          </div>
          <p class="project-description">{{ project.description }}</p>
          <div v-if="project.funding" class="funding">
            <strong>Funding:</strong> {{ project.funding }}
          </div>
          <div v-if="project.collaborators" class="collaborators">
            <strong>Collaborators:</strong> {{ project.collaborators }}
          </div>
        </div>
      </div>

      <!-- 发表论文 -->
      <div class="section" v-if="resumeData.publications?.length">
        <h3 class="section-title">Publications</h3>
        <div class="publications-list">
          <div 
            v-for="(pub, index) in resumeData.publications" 
            :key="index"
            class="publication-item"
          >
            <div class="publication-authors">{{ pub.authors }}</div>
            <div class="publication-title">"{{ pub.title }}"</div>
            <div class="publication-venue">{{ pub.venue }}, {{ pub.year }}</div>
            <div v-if="pub.doi" class="publication-doi">DOI: {{ pub.doi }}</div>
          </div>
        </div>
      </div>

      <!-- 技能特长 -->
      <div class="section" v-if="resumeData.skills?.length">
        <h3 class="section-title">Technical Skills</h3>
        <div class="skills-categories">
          <div class="skill-category">
            <h4 class="category-title">Research Methods</h4>
            <div class="skills-list">
              <span 
                v-for="skill in getSkillsByCategory('research')" 
                :key="skill.name"
                class="skill-item"
              >
                {{ skill.name }}
              </span>
            </div>
          </div>
          
          <div class="skill-category">
            <h4 class="category-title">Technical Tools</h4>
            <div class="skills-list">
              <span 
                v-for="skill in getSkillsByCategory('technical')" 
                :key="skill.name"
                class="skill-item"
              >
                {{ skill.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 语言能力 -->
      <div class="section" v-if="resumeData.languages?.length">
        <h3 class="section-title">Languages</h3>
        <div class="languages-grid">
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

      <!-- 荣誉奖项 -->
      <div class="section" v-if="resumeData.awards?.length">
        <h3 class="section-title">Honors & Awards</h3>
        <div class="awards-list">
          <div 
            v-for="award in resumeData.awards" 
            :key="award.name"
            class="award-item"
          >
            <div class="award-name">{{ award.name }}</div>
            <div class="award-organization">{{ award.organization }}</div>
            <div class="award-year">{{ award.year }}</div>
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
    default: 'academic'
  }
})

// 获取模板配置
const templateConfig = computed(() => getTemplateById(props.templateId))

// 模板样式
const templateStyles = computed(() => ({
  '--primary-color': templateConfig.value?.colors.primary || '#1e40af',
  '--secondary-color': templateConfig.value?.colors.secondary || '#64748b',
  '--accent-color': templateConfig.value?.colors.accent || '#0ea5e9',
  '--text-color': templateConfig.value?.colors.text || '#1e293b',
  '--background-color': templateConfig.value?.colors.background || '#ffffff'
}))

// 按类别获取技能
const getSkillsByCategory = (category) => {
  if (!props.resumeData.skills) return []
  
  // 简单的分类逻辑，实际应用中可以更复杂
  const researchSkills = ['统计分析', '数据挖掘', '实验设计', '文献综述']
  const technicalSkills = ['Python', 'R', 'MATLAB', 'SPSS', 'LaTeX']
  
  return props.resumeData.skills.filter(skill => {
    if (category === 'research') {
      return researchSkills.some(rs => skill.name.includes(rs))
    } else if (category === 'technical') {
      return technicalSkills.some(ts => skill.name.includes(ts))
    }
    return true
  })
}
</script>

<style scoped>
.academic-template {
  font-family: 'Times New Roman', serif;
  background: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  font-size: 12px;
}

.resume-container {
  max-width: 210mm;
  margin: 0 auto;
  padding: 25mm 20mm;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
}

/* 头部样式 */
.header-section {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 20px;
}

.name {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
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
  font-size: 11px;
}

.contact-row {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.contact-row span {
  color: var(--text-color);
}

/* 章节样式 */
.section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0 0 15px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid var(--primary-color);
  padding-bottom: 3px;
}

/* 个人简介 */
.summary-text {
  font-size: 12px;
  line-height: 1.7;
  text-align: justify;
  margin: 0;
}

/* 教育背景 */
.education-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dotted var(--secondary-color);
}

.education-item:last-child {
  border-bottom: none;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.degree {
  font-size: 13px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 3px 0;
}

.institution {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: normal;
  margin: 0;
  font-style: italic;
}

.education-meta {
  text-align: right;
  font-size: 11px;
  color: var(--secondary-color);
}

.graduation-date {
  display: block;
  margin-bottom: 2px;
}

.gpa {
  font-weight: bold;
}

.thesis, .advisor {
  font-size: 11px;
  margin-top: 5px;
  color: var(--text-color);
}

/* 工作经历 */
.experience-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dotted var(--secondary-color);
}

.experience-item:last-child {
  border-bottom: none;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.position {
  font-size: 13px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 3px 0;
}

.experience-meta {
  text-align: right;
  font-size: 11px;
  color: var(--secondary-color);
}

.period {
  display: block;
  margin-bottom: 2px;
}

.responsibilities {
  margin: 0;
  padding-left: 15px;
  font-size: 11px;
}

.responsibilities li {
  margin-bottom: 4px;
  line-height: 1.5;
}

/* 研究项目 */
.project-item {
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px dotted var(--secondary-color);
}

.project-item:last-child {
  border-bottom: none;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.project-title {
  font-size: 12px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0;
}

.project-period {
  font-size: 10px;
  color: var(--secondary-color);
  font-style: italic;
}

.project-description {
  font-size: 11px;
  line-height: 1.5;
  margin: 0 0 6px 0;
  text-align: justify;
}

.funding, .collaborators {
  font-size: 10px;
  color: var(--secondary-color);
  margin-top: 4px;
}

/* 发表论文 */
.publications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.publication-item {
  font-size: 11px;
  line-height: 1.4;
}

.publication-authors {
  font-weight: bold;
  color: var(--text-color);
}

.publication-title {
  font-style: italic;
  color: var(--primary-color);
  margin: 2px 0;
}

.publication-venue {
  color: var(--secondary-color);
}

.publication-doi {
  font-size: 10px;
  color: var(--secondary-color);
  margin-top: 2px;
}

/* 技能分类 */
.skills-categories {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skill-category {
  margin-bottom: 10px;
}

.category-title {
  font-size: 12px;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0 0 8px 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-item {
  font-size: 11px;
  color: var(--text-color);
  padding: 2px 6px;
  border: 1px solid var(--secondary-color);
  border-radius: 3px;
  background: rgba(30, 64, 175, 0.05);
}

/* 语言能力 */
.languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.language-item {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 4px 0;
  border-bottom: 1px dotted var(--secondary-color);
}

.language-name {
  font-weight: bold;
  color: var(--text-color);
}

.language-level {
  color: var(--secondary-color);
  font-style: italic;
}

/* 荣誉奖项 */
.awards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.award-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  padding: 6px 0;
  border-bottom: 1px dotted var(--secondary-color);
}

.award-item:last-child {
  border-bottom: none;
}

.award-name {
  font-weight: bold;
  color: var(--text-color);
}

.award-organization {
  color: var(--primary-color);
  font-style: italic;
}

.award-year {
  color: var(--secondary-color);
}

/* 打印样式 */
@media print {
  .academic-template {
    font-size: 11px;
  }
  
  .resume-container {
    box-shadow: none;
    padding: 15mm 10mm;
    min-height: auto;
  }
  
  .name {
    font-size: 20px;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 13px;
  }
}
</style>
