<template>
  <div class="timeline-template" :style="templateStyles">
    <div class="resume-container">
      
      <!-- 头部：左图右文结构 -->
      <header class="header-section">
        <div class="header-content">
          <h1 class="name">{{ resumeData.personalInfo?.name || '姓名' }}</h1>
          <h2 class="title" v-if="resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title">
            {{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title }}
          </h2>
          
          <div class="contact-grid">
            <div class="contact-item" v-if="resumeData.personalInfo?.phone">
              <span class="icon">📞</span> {{ resumeData.personalInfo.phone }}
            </div>
            <div class="contact-item" v-if="resumeData.personalInfo?.email">
              <span class="icon">✉️</span> {{ resumeData.personalInfo.email }}
            </div>
            <div class="contact-item" v-if="resumeData.personalInfo?.address">
              <span class="icon">📍</span> {{ resumeData.personalInfo.address }}
            </div>
            <div class="contact-item" v-if="resumeData.personalInfo?.website">
              <span class="icon">🔗</span> {{ resumeData.personalInfo.website }}
            </div>
          </div>
        </div>
        
        <div class="avatar-container" :class="resumeData.personalInfo?.photoPosition || 'right'" v-if="resumeData.personalInfo?.photo">
          <img :src="resumeData.personalInfo.photo" />
        </div>
      </header>

      <!-- 主要内容 -->
      <div class="main-content">
        <template v-for="sectionKey in orderedMainSections" :key="sectionKey">
          
          <!-- 个人简介 -->
          <section v-if="sectionKey === 'summary' && resumeData.summary" class="resume-section summary-section">
            <h3 class="section-title"><span>SUMMARY</span>个人简介</h3>
            <p class="summary-text">{{ resumeData.summary }}</p>
          </section>

          <!-- 工作经历：时间轴样式 -->
          <section v-else-if="sectionKey === 'workExperience' && resumeData.workExperience?.length" class="resume-section timeline-section">
            <h3 class="section-title"><span>EXPERIENCE</span>工作经历</h3>
            <div class="timeline-container">
              <div
                v-for="work in resumeData.workExperience"
                :key="work.id"
                class="timeline-item"
              >
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="item-header">
                    <div class="header-left">
                      <h4 class="primary-title">{{ work.position }}</h4>
                      <div class="secondary-title">{{ work.company }}</div>
                    </div>
                    <div class="header-right">
                      <div class="date-badge">{{ work.startDate }} - {{ work.endDate }}</div>
                    </div>
                  </div>
                  <div class="item-body">
                    <p class="desc" v-if="work.description">{{ work.description }}</p>
                    <ul class="bullets" v-if="work.achievements?.length">
                      <li v-for="achi in work.achievements" :key="achi">{{ achi }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 项目经历：时间轴样式 -->
          <section v-else-if="sectionKey === 'projects' && resumeData.projects?.length" class="resume-section timeline-section">
            <h3 class="section-title"><span>PROJECTS</span>项目经历</h3>
            <div class="timeline-container">
              <div
                v-for="project in resumeData.projects"
                :key="project.id"
                class="timeline-item"
              >
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="item-header">
                    <div class="header-left">
                      <h4 class="primary-title">{{ project.name }}</h4>
                      <div class="secondary-title">{{ project.role }}</div>
                    </div>
                    <div class="header-right">
                      <div class="date-badge">{{ project.startDate }} - {{ project.endDate }}</div>
                    </div>
                  </div>
                  <div class="item-body">
                    <p class="desc">{{ project.description }}</p>
                    <div class="tech-tags" v-if="project.technologies?.length">
                      <span class="tag" v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 教育背景：时间轴样式 -->
          <section v-else-if="sectionKey === 'education' && resumeData.education?.length" class="resume-section timeline-section">
            <h3 class="section-title"><span>EDUCATION</span>教育背景</h3>
            <div class="timeline-container">
              <div
                v-for="edu in resumeData.education"
                :key="edu.id"
                class="timeline-item"
              >
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="item-header">
                    <div class="header-left">
                      <h4 class="primary-title">{{ edu.school }}</h4>
                      <div class="secondary-title">{{ edu.degree }} | {{ edu.major }}</div>
                    </div>
                    <div class="header-right">
                      <div class="date-badge">{{ edu.startDate }} - {{ edu.endDate }}</div>
                    </div>
                  </div>
                  <div class="item-body" v-if="edu.description || edu.honors">
                    <p class="desc">{{ edu.description }} <span v-if="edu.honors">({{ edu.honors }})</span></p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 技能特长 -->
          <section v-else-if="sectionKey === 'skills' && resumeData.skills?.length" class="resume-section skills-section">
            <h3 class="section-title"><span>SKILLS</span>技能特长</h3>
            <div class="skills-grid">
              <div class="skill-box" v-for="skill in resumeData.skills" :key="skill.name">
                <div class="skill-box-header">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-level">{{ skill.level }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getSkillPercentage(skill.level) + '%' }"></div>
                </div>
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
    default: 'timeline'
  }
})

const resumeStore = useResumeStore()

// 获取排序后的主要章节
const orderedMainSections = computed(() => {
  return (resumeStore.sectionOrder || []).filter(section => section !== 'personalInfo')
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const getSkillPercentage = (level) => {
  const map = {
    '初级': 30,
    '中级': 60,
    '高级': 85,
    '专家': 100
  }
  return map[level] || 50
}
</script>

<style scoped>
.timeline-template {
  font-family: var(--font-family, 'Noto Sans SC', sans-serif);
  background: var(--background-color, #f8f9fa);
  color: var(--text-color, #333333);
  font-size: 14px;
  line-height: 1.6;
}

.resume-container {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: #ffffff;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  box-sizing: border-box;
}

/* 头部样式 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 3px solid var(--primary-color, #3b82f6);
}

.header-content {
  flex: 1;
}

.name {
  font-size: 38px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
  margin: 0 0 5px 0;
  letter-spacing: 1px;
}

.title {
  font-size: 18px;
  color: var(--primary-color, #3b82f6);
  font-weight: 500;
  margin: 0 0 20px 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  font-size: 13px;
  color: var(--secondary-color, #6b7280);
}

.contact-item {
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 8px;
  color: var(--primary-color, #3b82f6);
}

.avatar-container {
  width: 110px;
  height: 110px;
  border-radius: 8px;
  overflow: hidden;
  margin-left: 30px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  border: 3px solid #ffffff;
}

.avatar-container.left {
  order: -1;
  margin-left: 0;
  margin-right: 30px;
}

.avatar-container.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 40px;
}

.avatar-container.right {
  order: 2;
}

.avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 章节通用样式 */
.resume-section {
  margin-bottom: 35px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
  margin: 0 0 25px 0;
  display: flex;
  flex-direction: column;
}

.section-title span {
  font-size: 12px;
  font-weight: 800;
  color: var(--primary-color, #3b82f6);
  letter-spacing: 4px;
  margin-bottom: 2px;
}

.summary-text {
  font-size: 14px;
  color: var(--text-color, #4b5563);
  text-align: justify;
  background: var(--background-secondary, #f3f4f6);
  padding: 15px;
  border-left: 4px solid var(--primary-color, #3b82f6);
  border-radius: 4px;
}

/* 时间轴样式 */
.timeline-container {
  padding-left: 20px;
}

.timeline-item {
  position: relative;
  padding-left: 25px;
  padding-bottom: 25px;
  border-left: 2px solid var(--border-color, #e5e7eb);
}

.timeline-item:last-child {
  padding-bottom: 0;
  border-left-color: transparent;
}

.timeline-marker {
  position: absolute;
  left: -7px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid var(--primary-color, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.primary-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
  margin: 0 0 4px 0;
}

.secondary-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--secondary-color, #6b7280);
}

.date-badge {
  background: var(--primary-light-color, #eff6ff);
  color: var(--primary-color, #2563eb);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.item-body .desc {
  font-size: 14px;
  color: var(--text-color, #4b5563);
  margin: 0 0 10px 0;
}

.item-body .bullets {
  margin: 0;
  padding-left: 18px;
  color: var(--text-color, #4b5563);
  font-size: 13.5px;
}

.item-body .bullets li {
  margin-bottom: 4px;
}

/* 标签样式 */
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  background: var(--background-secondary, #f3f4f6);
  color: var(--secondary-color, #4b5563);
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
}

/* 技能网格 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.skill-box-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.skill-name {
  font-weight: 600;
  font-size: 14px;
}

.skill-level {
  font-size: 12px;
  color: var(--secondary-color, #6b7280);
}

.progress-bar {
  height: 6px;
  background: var(--border-color, #e5e7eb);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color, #3b82f6);
  border-radius: 3px;
}
</style>
