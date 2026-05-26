<template>
  <div class="fresh-template" :style="templateStyles">
    <!-- 顶部渐变装饰条 -->
    <div class="top-accent-bar"></div>

    <div class="resume-wrapper">
      <!-- 头部区域 -->
      <header class="header-section">
        <div class="header-main">
          <h1 class="name">{{ resumeData.personalInfo?.name || 'Your Name' }}</h1>
          <h2 class="role">{{ resumeData.personalInfo?.targetPosition || 'Job Title' }}</h2>
        </div>
        <div class="header-avatar" v-if="resumeData.personalInfo?.photo">
          <img :src="resumeData.personalInfo.photo" alt="Profile" />
        </div>
      </header>

      <!-- 联系方式 -->
      <div class="contact-strip" v-if="hasContact">
        <div class="contact-item" v-if="resumeData.personalInfo?.email">
          <span class="contact-icon">✉</span>
          <span>{{ resumeData.personalInfo.email }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo?.phone">
          <span class="contact-icon">☎</span>
          <span>{{ resumeData.personalInfo.phone }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo?.address">
          <span class="contact-icon">⌂</span>
          <span>{{ resumeData.personalInfo.address }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo?.website">
          <span class="contact-icon">🌐</span>
          <span>{{ resumeData.personalInfo.website }}</span>
        </div>
      </div>

      <!-- 个人简介 -->
      <section class="section-block" v-if="resumeData.summary">
        <h3 class="section-title">
          <span class="title-accent"></span>
          个人简介
        </h3>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </section>

      <!-- 工作经历 -->
      <section class="section-block" v-if="resumeData.workExperience?.length">
        <h3 class="section-title">
          <span class="title-accent"></span>
          工作经历
        </h3>
        <div class="exp-list">
          <div class="exp-card" v-for="work in resumeData.workExperience" :key="work.id">
            <div class="exp-top">
              <div class="exp-left">
                <h4 class="exp-position">{{ work.position || work.jobTitle }}</h4>
                <span class="exp-company">{{ work.company }}</span>
              </div>
              <span class="exp-date">{{ work.startDate }} — {{ work.endDate || '至今' }}</span>
            </div>
            <p class="exp-desc" v-if="work.description">{{ work.description }}</p>
            <ul class="exp-achievements" v-if="work.achievements?.length || work.responsibilities?.length">
              <li v-for="(item, i) in (work.achievements || work.responsibilities)" :key="i">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 双栏区域：技能 + 项目 -->
      <div class="two-col-grid">
        <!-- 技能特长 -->
        <section class="section-block" v-if="resumeData.skills?.length">
          <h3 class="section-title">
            <span class="title-accent"></span>
            专业技能
          </h3>
          <div class="skills-container">
            <div class="skill-item" v-for="skill in resumeData.skills" :key="skill.name || skill.id">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level" v-if="skill.level">{{ skill.level }}</span>
              </div>
              <div class="skill-bar" v-if="skill.level">
                <div class="skill-fill" :style="{ width: getSkillPercent(skill.level) }"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 项目经历 -->
        <section class="section-block" v-if="resumeData.projects?.length">
          <h3 class="section-title">
            <span class="title-accent"></span>
            项目经历
          </h3>
          <div class="project-list">
            <div class="project-card" v-for="proj in resumeData.projects" :key="proj.id">
              <div class="proj-top">
                <h4 class="proj-name">{{ proj.name }}</h4>
                <span class="proj-date" v-if="proj.endDate">{{ proj.endDate }}</span>
              </div>
              <p class="proj-desc" v-if="proj.description">{{ proj.description }}</p>
              <div class="proj-techs" v-if="proj.technologies?.length">
                <span class="tech-badge" v-for="tech in proj.technologies" :key="tech">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 教育背景 -->
      <section class="section-block" v-if="resumeData.education?.length">
        <h3 class="section-title">
          <span class="title-accent"></span>
          教育背景
        </h3>
        <div class="edu-list">
          <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
            <div class="edu-left">
              <span class="edu-date-badge">{{ edu.startDate || edu.endDate }}</span>
            </div>
            <div class="edu-right">
              <h4 class="edu-school">{{ edu.school }}</h4>
              <span class="edu-major">{{ edu.major }}{{ edu.degree ? ' · ' + edu.degree : '' }}</span>
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
    default: 'freshModern'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const hasContact = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return p.email || p.phone || p.address || p.website
})

const getSkillPercent = (level) => {
  const map = {
    'expert': '100%', '精通': '100%',
    'advanced': '85%', '熟练': '85%',
    'intermediate': '65%', '良好': '65%',
    'beginner': '35%', '了解': '35%'
  }
  return map[level?.toLowerCase()] || '70%'
}
</script>

<style scoped>
/* ========== 容器 ========== */
.fresh-template {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #ffffff;
  color: #1a1a2e;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  position: relative;
  overflow: hidden;
}

/* 顶部渐变装饰条 */
.top-accent-bar {
  height: 6px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

.resume-wrapper {
  padding: 45px 50px 50px;
}

/* ========== 头部 ========== */
.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 24px;
}

.header-main {
  flex: 1;
}

.name {
  font-size: 38px;
  font-weight: 800;
  margin: 0 0 6px 0;
  letter-spacing: -1px;
  color: #0f172a;
  line-height: 1.1;
}

.role {
  font-size: var(--font-size-subtitle, 17px);
  font-weight: 500;
  color: #667eea;
  margin: 0;
  letter-spacing: 0.3px;
}

.header-avatar {
  width: 88px;
  height: 88px;
  border-radius: 24px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  border: 3px solid #ffffff;
}

.header-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ========== 联系栏 ========== */
.contact-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.contact-item {
  font-size: var(--font-size-base, 13px);
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-icon {
  font-style: normal;
  font-size: var(--font-size-base, 14px);
  opacity: 0.7;
}

/* ========== 区块通用 ========== */
.section-block {
  margin-bottom: 32px;
}

.section-title {
  font-size: var(--font-size-title, 16px);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 18px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.3px;
}

.title-accent {
  display: inline-block;
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  flex-shrink: 0;
}

/* ========== 个人简介 ========== */
.summary-text {
  font-size: var(--font-size-base, 14px);
  line-height: 1.8;
  color: #475569;
  margin: 0;
  text-align: justify;
}

/* ========== 工作经历 ========== */
.exp-card {
  padding: 20px 22px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  margin-bottom: 14px;
  transition: box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.exp-card:last-child {
  margin-bottom: 0;
}

.exp-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 16px;
}

.exp-position {
  font-size: var(--font-size-subtitle, 16px);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.exp-company {
  font-size: var(--font-size-base, 13px);
  color: #667eea;
  font-weight: 600;
}

.exp-date {
  font-size: var(--font-size-base, 12px);
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;
  padding: 4px 10px;
  background: #f8fafc;
  border-radius: 6px;
}

.exp-desc {
  font-size: var(--font-size-base, 13px);
  line-height: 1.7;
  color: #64748b;
  margin: 0 0 12px 0;
}

.exp-achievements {
  margin: 0;
  padding-left: 18px;
}

.exp-achievements li {
  font-size: var(--font-size-base, 13px);
  line-height: 1.7;
  color: #475569;
  margin-bottom: 6px;
}

.exp-achievements li::marker {
  color: #667eea;
}

/* ========== 双栏布局 ========== */
.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

/* ========== 技能 ========== */
.skill-item {
  margin-bottom: 14px;
}

.skill-item:last-child {
  margin-bottom: 0;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.skill-name {
  font-size: var(--font-size-base, 13px);
  font-weight: 600;
  color: #334155;
}

.skill-level {
  font-size: var(--font-size-base, 11px);
  color: #94a3b8;
  font-weight: 500;
}

.skill-bar {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.4s ease;
}

/* ========== 项目 ========== */
.project-card {
  padding: 16px 18px;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  margin-bottom: 12px;
}

.project-card:last-child {
  margin-bottom: 0;
}

.proj-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  gap: 12px;
}

.proj-name {
  font-size: var(--font-size-subtitle, 14px);
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.proj-date {
  font-size: var(--font-size-base, 11px);
  color: #94a3b8;
  white-space: nowrap;
}

.proj-desc {
  font-size: var(--font-size-base, 12px);
  line-height: 1.6;
  color: #64748b;
  margin: 0 0 10px 0;
}

.proj-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-badge {
  font-size: var(--font-size-base, 10px);
  font-weight: 600;
  color: #667eea;
  background: #eef2ff;
  padding: 3px 8px;
  border-radius: 6px;
}

/* ========== 教育 ========== */
.edu-item {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.edu-item:last-child {
  margin-bottom: 0;
}

.edu-left {
  flex-shrink: 0;
  width: 90px;
}

.edu-date-badge {
  display: inline-block;
  font-size: var(--font-size-base, 12px);
  font-weight: 600;
  color: #667eea;
  background: #eef2ff;
  padding: 4px 12px;
  border-radius: 20px;
}

.edu-right {
  flex: 1;
}

.edu-school {
  font-size: var(--font-size-subtitle, 15px);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.edu-major {
  font-size: var(--font-size-base, 13px);
  color: #64748b;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .fresh-template {
    width: 100%;
    min-height: auto;
  }

  .resume-wrapper {
    padding: 28px 24px;
  }

  .name {
    font-size: 28px;
  }

  .role {
    font-size: var(--font-size-base, 14px);
  }

  .header-avatar {
    width: 64px;
    height: 64px;
    border-radius: 16px;
  }

  .contact-strip {
    gap: 12px;
    padding: 12px 14px;
  }

  .two-col-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .exp-top {
    flex-direction: column;
    gap: 8px;
  }

  .edu-item {
    flex-direction: column;
    gap: 8px;
  }

  .edu-left {
    width: auto;
  }
}
</style>
