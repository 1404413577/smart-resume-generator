<template>
  <div class="elegant-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 头部：姓名、职位标题与联系方式 -->
      <header class="header-section">
        <h1 class="name">{{ resumeData.personalInfo?.name || '姓名' }}</h1>
        <h2 class="title" v-if="resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title">
          {{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title }}
        </h2>
        
        <div class="contact-info">
          <span class="contact-item" v-if="resumeData.personalInfo?.phone">
            {{ resumeData.personalInfo.phone }}
          </span>
          <span class="contact-separator" v-if="resumeData.personalInfo?.phone && resumeData.personalInfo?.email">•</span>
          <span class="contact-item" v-if="resumeData.personalInfo?.email">
            {{ resumeData.personalInfo.email }}
          </span>
          <span class="contact-separator" v-if="(resumeData.personalInfo?.phone || resumeData.personalInfo?.email) && resumeData.personalInfo?.address">•</span>
          <span class="contact-item" v-if="resumeData.personalInfo?.address">
            {{ resumeData.personalInfo.address }}
          </span>
          <span class="contact-separator" v-if="(resumeData.personalInfo?.phone || resumeData.personalInfo?.email || resumeData.personalInfo?.address) && resumeData.personalInfo?.website">•</span>
          <span class="contact-item" v-if="resumeData.personalInfo?.website">
            {{ resumeData.personalInfo.website }}
          </span>
        </div>
      </header>

      <!-- 动态渲染主要章节 -->
      <div class="main-content">
        <template v-for="sectionKey in orderedMainSections" :key="sectionKey">
          
          <!-- 个人简介 -->
          <section v-if="sectionKey === 'summary' && resumeData.summary" class="resume-section summary-section">
            <h3 class="section-title">个人简介</h3>
            <p class="summary-text">{{ resumeData.summary }}</p>
          </section>

          <!-- 工作经历 -->
          <section v-else-if="sectionKey === 'workExperience' && resumeData.workExperience?.length" class="resume-section experience-section">
            <h3 class="section-title">工作经历</h3>
            <div
              v-for="work in resumeData.workExperience"
              :key="work.id"
              class="content-item"
            >
              <div class="item-header">
                <div class="item-title-group">
                  <h4 class="primary-title">{{ work.position }}</h4>
                  <span class="secondary-title">{{ work.company }}</span>
                </div>
                <div class="item-meta">
                  <span class="date">{{ work.startDate }} - {{ work.endDate }}</span>
                  <span class="location" v-if="work.location"> | {{ work.location }}</span>
                </div>
              </div>
              <div v-if="work.description" class="description-text">
                <p>{{ work.description }}</p>
              </div>
              <ul class="bullet-points" v-if="work.achievements?.length">
                <li v-for="achievement in work.achievements" :key="achievement">{{ achievement }}</li>
              </ul>
            </div>
          </section>

          <!-- 教育背景 -->
          <section v-else-if="sectionKey === 'education' && resumeData.education?.length" class="resume-section education-section">
            <h3 class="section-title">教育背景</h3>
            <div
              v-for="edu in resumeData.education"
              :key="edu.id"
              class="content-item"
            >
              <div class="item-header">
                <div class="item-title-group">
                  <h4 class="primary-title">{{ edu.school }}</h4>
                  <span class="secondary-title">{{ edu.degree }} · {{ edu.major }}</span>
                </div>
                <div class="item-meta">
                  <span class="date">{{ edu.startDate }} - {{ edu.endDate }}</span>
                  <span class="gpa" v-if="edu.gpa"> | GPA: {{ edu.gpa }}</span>
                </div>
              </div>
              <div v-if="edu.description || edu.honors" class="description-text">
                <p v-if="edu.honors"><strong>荣誉奖项：</strong>{{ edu.honors }}</p>
                <p v-if="edu.description">{{ edu.description }}</p>
              </div>
            </div>
          </section>

          <!-- 项目经历 -->
          <section v-else-if="sectionKey === 'projects' && resumeData.projects?.length" class="resume-section projects-section">
            <h3 class="section-title">项目经历</h3>
            <div
              v-for="project in resumeData.projects"
              :key="project.id"
              class="content-item"
            >
              <div class="item-header">
                <div class="item-title-group">
                  <h4 class="primary-title">{{ project.name }}</h4>
                  <span class="secondary-title" v-if="project.role">{{ project.role }}</span>
                </div>
                <div class="item-meta">
                  <span class="date">{{ project.startDate }} - {{ project.endDate }}</span>
                </div>
              </div>
              <p class="description-text">{{ project.description }}</p>
              <div class="tech-stack" v-if="project.technologies?.length">
                <span class="tech-item" v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
              </div>
            </div>
          </section>

          <!-- 技能特长 -->
          <section v-else-if="sectionKey === 'skills' && resumeData.skills?.length" class="resume-section skills-section">
            <h3 class="section-title">专业技能</h3>
            <div class="skills-container">
              <div class="skill-category" v-for="skill in resumeData.skills" :key="skill.name">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level-text" v-if="skill.level">{{ skill.level }}</span>
              </div>
            </div>
          </section>

        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'
import { useResumeStore } from '@stores/resume'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateId: {
    type: String,
    default: 'elegant'
  }
})

const resumeStore = useResumeStore()

// 获取排序后的主要章节
const orderedMainSections = computed(() => {
  return (resumeStore.sectionOrder || []).filter(section => section !== 'personalInfo')
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.elegant-template {
  font-family: var(--font-family, 'Noto Serif SC', 'SimSun', serif);
  background: var(--background-color, #ffffff);
  color: var(--text-color, #2c3e50);
  line-height: 1.8;
  font-size: 14px;
}

.resume-container {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 40px 50px;
  background: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  box-sizing: border-box;
}

/* 头部样式 */
.header-section {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 1px solid var(--primary-color, #2c3e50);
}

.name {
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 4px;
  color: var(--primary-color, #2c3e50);
  margin: 0 0 10px 0;
}

.title {
  font-size: 16px;
  font-weight: 400;
  color: var(--secondary-color, #7f8c8d);
  letter-spacing: 2px;
  margin: 0 0 15px 0;
  text-transform: uppercase;
}

.contact-info {
  font-size: 13px;
  color: var(--text-color, #34495e);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}

.contact-separator {
  margin: 0 10px;
  color: var(--border-color, #bdc3c7);
}

/* 章节通用样式 */
.resume-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--primary-color, #2c3e50);
  text-transform: uppercase;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
}

.section-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color, #e0e0e0);
  margin-left: 15px;
}

/* 内容块样式 */
.content-item {
  margin-bottom: 20px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.primary-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #2c3e50);
  margin: 0;
  display: inline-block;
}

.secondary-title {
  font-size: 14px;
  color: var(--primary-color, #34495e);
  margin-left: 10px;
  font-style: italic;
}

.item-meta {
  font-size: 13px;
  color: var(--secondary-color, #7f8c8d);
  text-align: right;
}

.description-text {
  font-size: 14px;
  color: var(--text-color, #34495e);
  margin: 0 0 10px 0;
  text-align: justify;
}

.bullet-points {
  margin: 0;
  padding-left: 18px;
  color: var(--text-color, #34495e);
  font-size: 14px;
}

.bullet-points li {
  margin-bottom: 5px;
}

/* 技能标签 */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.skill-category {
  font-size: 14px;
  color: var(--text-color, #2c3e50);
}

.skill-name {
  font-weight: 600;
}

.skill-level-text {
  color: var(--secondary-color, #7f8c8d);
  margin-left: 5px;
  font-style: italic;
}

/* 科技栈标签 */
.tech-stack {
  margin-top: 8px;
}

.tech-item {
  display: inline-block;
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid var(--border-color, #bdc3c7);
  border-radius: 3px;
  margin-right: 8px;
  margin-bottom: 6px;
  color: var(--secondary-color, #7f8c8d);
}
</style>
