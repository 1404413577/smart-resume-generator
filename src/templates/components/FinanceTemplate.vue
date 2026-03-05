<template>
  <div class="finance-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 头部个人信息 -->
      <div class="header-section">
        <h1 class="name">{{ resumeData.personalInfo?.name || 'NAME SURNAME' }}</h1>
        <div class="contact-info">
          <span v-if="resumeData.personalInfo?.address">{{ resumeData.personalInfo.address }}</span>
          <span v-if="resumeData.personalInfo?.address && (resumeData.personalInfo?.phone || resumeData.personalInfo?.email)" class="separator">|</span>
          <span v-if="resumeData.personalInfo?.phone">{{ resumeData.personalInfo.phone }}</span>
          <span v-if="resumeData.personalInfo?.phone && resumeData.personalInfo?.email" class="separator">|</span>
          <span v-if="resumeData.personalInfo?.email">{{ resumeData.personalInfo.email }}</span>
          <span v-if="resumeData.personalInfo?.website" class="separator">|</span>
          <span v-if="resumeData.personalInfo?.website">{{ resumeData.personalInfo.website }}</span>
        </div>
      </div>

      <!-- 个人摘要 -->
      <div class="section" v-if="resumeData.summary">
        <h2 class="section-title">SUMMARY</h2>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </div>

      <!-- 教育背景 - 投行风通常教育在最前 -->
      <div class="section" v-if="resumeData.education?.length">
        <h2 class="section-title">EDUCATION</h2>
        <div class="education-item" v-for="edu in resumeData.education" :key="edu.id">
          <div class="flex-row main-row">
            <span class="school">{{ edu.school }}</span>
            <span class="location" v-if="edu.location">{{ edu.location }}</span>
          </div>
          <div class="flex-row sub-row">
            <span class="degree"><i>{{ edu.degree }} in {{ edu.major }}</i></span>
            <span class="date">{{ edu.startDate ? edu.startDate + ' - ' : '' }}{{ edu.endDate }}</span>
          </div>
          <div class="edu-details" v-if="edu.gpa || edu.honors || edu.description">
            <ul class="achievements">
              <li v-if="edu.gpa"><strong>GPA:</strong> {{ edu.gpa }}</li>
              <li v-if="edu.honors"><strong>Honors:</strong> {{ edu.honors }}</li>
              <li v-if="edu.description">{{ edu.description }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 工作经历 -->
      <div class="section" v-if="resumeData.workExperience?.length">
        <h2 class="section-title">PROFESSIONAL EXPERIENCE</h2>
        <div class="experience-item" v-for="work in resumeData.workExperience" :key="work.id">
          <div class="flex-row main-row">
            <span class="company">{{ work.company }}</span>
            <span class="location" v-if="work.location">{{ work.location }}</span>
          </div>
          <div class="flex-row sub-row">
            <span class="position"><i>{{ work.position }}</i></span>
            <span class="date">{{ work.startDate }} - {{ work.endDate }}</span>
          </div>
          <p class="work-desc" v-if="work.description">{{ work.description }}</p>
          <ul class="achievements" v-if="work.achievements?.length">
            <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
          </ul>
        </div>
      </div>

      <!-- 项目经历 -->
      <div class="section" v-if="resumeData.projects?.length">
        <h2 class="section-title">SELECTED TRANSACTION / PROJECT EXPERIENCE</h2>
        <div class="project-item" v-for="project in resumeData.projects" :key="project.id">
          <div class="flex-row main-row">
            <span class="project-name">{{ project.name }}</span>
            <span class="date">{{ project.startDate }} - {{ project.endDate }}</span>
          </div>
          <p class="work-desc" v-if="project.description">{{ project.description }}</p>
          <ul class="achievements" v-if="project.highlights?.length">
            <li v-for="hlt in project.highlights" :key="hlt">{{ hlt }}</li>
          </ul>
        </div>
      </div>

      <!-- 技能与语言 -->
      <div class="section" v-if="resumeData.skills?.length || resumeData.languages?.length">
        <h2 class="section-title">SKILLS & ADDITIONAL INFORMATION</h2>
        <div class="skills-content">
          <div class="skill-line" v-if="resumeData.skills?.length">
            <strong>Technical Skills: </strong>
            <span>{{ resumeData.skills.map(s => s.name).join(', ') }}</span>
          </div>
          <div class="skill-line" v-if="resumeData.languages?.length">
            <strong>Languages: </strong>
            <span>{{ resumeData.languages.map(l => `${l.name} (${l.level})`).join(', ') }}</span>
          </div>
          <div class="skill-line" v-if="resumeData.awards?.length">
            <strong>Certifications / Awards: </strong>
            <span>{{ resumeData.awards.map(a => a.name).join(', ') }}</span>
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
    default: 'finance'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.finance-template {
  /* 华尔街/投行标准：经典衬线字体，字号偏小，内容紧凑 */
  font-family: var(--resume-font-family, 'Times New Roman', Times, serif);
  background: var(--resume-background-color, #ffffff);
  color: var(--resume-text-color, #000000);
  line-height: var(--resume-line-height, 1.35);
  font-size: 11px;
}

.resume-container {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 20mm;
  background: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* 增加微妙的高级质感 */
}

/* 头部 */
.header-section {
  text-align: center;
  margin-bottom: 20px;
}

.name {
  font-size: var(--resume-name-font-size, 24px);
  font-weight: bold;
  text-transform: uppercase;
  margin: 0 0 5px 0;
  letter-spacing: 1px;
  color: var(--resume-primary-color, #1A2B4C); /* 彭博蓝 Bloomberg Blue Default */
}

.contact-info {
  font-size: var(--resume-contact-font-size, 10.5px);
}

.separator {
  margin: 0 8px;
  color: #666;
}

/* 通用章节 */
.section {
  margin-bottom: 15px;
}

.section-title {
  font-size: var(--resume-title-font-size, 13px);
  font-weight: bold;
  text-transform: uppercase;
  color: var(--resume-primary-color, #1A2B4C);
  border-bottom: 1.5px solid var(--resume-primary-color, #1A2B4C); /* 明显的深蓝色分割线 */
  margin: 0 0 8px 0;
  padding-bottom: 2px;
}

/* Flex Row 排版方案：左对齐内容，右对齐日期/地点 */
.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.main-row {
  font-weight: bold;
  margin-bottom: 2px;
}

.sub-row {
  margin-bottom: 4px;
}

.company, .school, .project-name {
  font-size: var(--resume-subtitle-font-size, 12px);
  color: #111;
}

.location, .date {
  font-size: var(--resume-meta-font-size, 11px);
}

.position, .degree {
  font-size: var(--resume-content-font-size, 11.5px);
  color: #333;
}

.work-desc {
  margin: 0 0 4px 0;
  text-align: justify;
}

.achievements {
  margin: 0;
  padding-left: 20px;
  text-align: justify;
}

.achievements li {
  margin-bottom: 3px;
  position: relative;
  list-style-type: disc;
}

/* 技能与额外信息 */
.skills-content {
  line-height: 1.6;
}

.skill-line {
  margin-bottom: 2px;
}

/* 打印与导出适配 */
@media print {
  .resume-container {
    box-shadow: none;
  }
}
</style>
