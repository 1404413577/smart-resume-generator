<template>
  <div class="datascience-template" :style="templateStyles">
    <div class="resume-wrapper">
      <!-- 头部 -->
      <header class="header-section">
        <div class="header-badge">DS</div>
        <div class="header-main">
          <h1 class="name">{{ resumeData.personalInfo?.name || 'Data Scientist' }}</h1>
          <h2 class="role">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Data Science & AI' }}</h2>
        </div>
      </header>

      <!-- 联系方式 -->
      <div class="contact-strip" v-if="hasContact">
        <div class="contact-item" v-if="resumeData.personalInfo?.email">
          <span class="contact-icon">@</span>
          <span>{{ resumeData.personalInfo.email }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo?.phone">
          <span class="contact-icon">#</span>
          <span>{{ resumeData.personalInfo.phone }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo?.address">
          <span class="contact-icon">&gt;</span>
          <span>{{ resumeData.personalInfo.address }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo?.website">
          <span class="contact-icon">~</span>
          <span>{{ resumeData.personalInfo.website }}</span>
        </div>
      </div>

      <!-- 专业概述 -->
      <section class="section-block" v-if="resumeData.summary">
        <div class="section-label">## Profile</div>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </section>

      <!-- 技术栈 -->
      <section class="section-block" v-if="resumeData.skills?.length">
        <div class="section-label">## Tech Stack</div>
        <div class="stack-container">
          <div class="stack-category" v-for="skill in resumeData.skills" :key="skill.name">
            <span class="stack-name">{{ skill.name }}</span>
            <div class="stack-bar-wrap" v-if="skill.level">
              <div class="stack-bar">
                <div class="stack-fill" :style="{ width: getLevelPercent(skill.level) }"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 项目经验 -->
      <section class="section-block" v-if="resumeData.projects?.length">
        <div class="section-label">## Projects</div>
        <div class="project-grid">
          <div class="project-card" v-for="proj in resumeData.projects" :key="proj.id">
            <div class="proj-header">
              <h3 class="proj-name">{{ proj.name }}</h3>
              <span class="proj-date" v-if="proj.endDate">{{ proj.endDate }}</span>
            </div>
            <p class="proj-desc" v-if="proj.description">{{ proj.description }}</p>
            <div class="proj-techs" v-if="proj.technologies?.length">
              <span class="tech-dot" v-for="tech in proj.technologies" :key="tech">{{ tech }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 工作经历 -->
      <section class="section-block" v-if="resumeData.workExperience?.length">
        <div class="section-label">## Experience</div>
        <div class="timeline">
          <div class="timeline-item" v-for="work in resumeData.workExperience" :key="work.id">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="tl-header">
                <div>
                  <h4 class="tl-position">{{ work.position || work.jobTitle }}</h4>
                  <span class="tl-company">{{ work.company }}</span>
                </div>
                <span class="tl-date">{{ work.startDate }} — {{ work.endDate || 'Present' }}</span>
              </div>
              <ul class="tl-details" v-if="work.responsibilities?.length">
                <li v-for="(item, i) in work.responsibilities" :key="i">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 教育背景 -->
      <section class="section-block" v-if="resumeData.education?.length">
        <div class="section-label">## Education</div>
        <div class="edu-list">
          <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
            <span class="edu-year">{{ edu.graduationDate || edu.endDate }}</span>
            <div class="edu-content">
              <h4 class="edu-school">{{ edu.school }}</h4>
              <span class="edu-degree">{{ edu.degree }}{{ edu.major ? ' in ' + edu.major : '' }}</span>
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
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'dataScienceAI' }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const hasContact = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return p.email || p.phone || p.address || p.website
})

const getLevelPercent = (level) => {
  const map = { 'expert': '95%', '精通': '95%', 'advanced': '80%', '熟练': '80%', 'intermediate': '60%', '良好': '60%', 'beginner': '35%', '了解': '35%' }
  return map[level?.toLowerCase()] || '70%'
}
</script>

<style scoped>
.datascience-template {
  font-family: 'Inter', 'SF Mono', 'Fira Code', monospace;
  background: #0f172a;
  color: #e2e8f0;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.resume-wrapper {
  padding: 45px 50px;
}

/* 头部 */
.header-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 2px solid #1e293b;
}

.header-badge {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #7B2FBE 0%, #3B82F6 100%);
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  letter-spacing: -0.5px;
  flex-shrink: 0;
}

.name {
  font-size: 30px;
  font-weight: 800;
  color: #f1f5f9;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
  line-height: 1.15;
}

.role {
  font-size: 15px;
  font-weight: 500;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

/* 联系方式 */
.contact-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
  padding: 12px 16px;
  background: #1e293b;
  border-radius: 8px;
  border: 1px solid #334155;
}

.contact-item {
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Fira Code', 'SF Mono', monospace;
}

.contact-icon { color: #7B2FBE; font-weight: 700; font-size: 14px; }

/* 区块 */
.section-block { margin-bottom: 26px; }

.section-label {
  font-size: 13px;
  font-weight: 700;
  color: #7B2FBE;
  margin-bottom: 14px;
  font-family: 'Fira Code', 'SF Mono', monospace;
  letter-spacing: 0.5px;
}

/* 个人简介 */
.summary-text {
  font-size: 13px;
  line-height: 1.7;
  color: #cbd5e1;
  margin: 0;
}

/* 技术栈 */
.stack-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stack-category {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #1e293b;
  border-radius: 6px;
  border: 1px solid #334155;
}

.stack-name {
  font-size: 12px;
  color: #e2e8f0;
  font-weight: 600;
  white-space: nowrap;
  font-family: 'Fira Code', 'SF Mono', monospace;
}

.stack-bar-wrap { flex: 1; }

.stack-bar {
  height: 4px;
  background: #334155;
  border-radius: 2px;
  overflow: hidden;
}

.stack-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #7B2FBE, #3B82F6);
}

/* 项目 */
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.project-card {
  padding: 16px;
  background: #1e293b;
  border-radius: 10px;
  border: 1px solid #334155;
}

.proj-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.proj-name {
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.proj-date {
  font-size: 10px;
  color: #64748b;
  font-family: 'Fira Code', 'SF Mono', monospace;
  white-space: nowrap;
}

.proj-desc {
  font-size: 12px;
  line-height: 1.55;
  color: #94a3b8;
  margin: 0 0 10px 0;
}

.proj-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-dot {
  font-size: 10px;
  color: #a78bfa;
  background: rgba(123, 47, 190, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Fira Code', 'SF Mono', monospace;
}

/* 时间线 */
.timeline { position: relative; padding-left: 20px; }

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: #334155;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-item:last-child { margin-bottom: 0; }

.timeline-marker {
  position: absolute;
  left: -20px;
  top: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #7B2FBE;
  border: 2px solid #0f172a;
  box-shadow: 0 0 0 2px #7B2FBE;
}

.tl-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 16px;
}

.tl-position {
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 2px 0;
}

.tl-company {
  font-size: 12px;
  color: #a78bfa;
  font-weight: 500;
}

.tl-date {
  font-size: 11px;
  color: #64748b;
  font-family: 'Fira Code', 'SF Mono', monospace;
  white-space: nowrap;
}

.tl-details {
  margin: 0;
  padding-left: 16px;
}

.tl-details li {
  font-size: 12.5px;
  line-height: 1.6;
  color: #94a3b8;
  margin-bottom: 4px;
}

.tl-details li::marker { color: #7B2FBE; }

/* 教育 */
.edu-item {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  align-items: flex-start;
}

.edu-item:last-child { margin-bottom: 0; }

.edu-year {
  font-size: 11px;
  color: #a78bfa;
  font-family: 'Fira Code', 'SF Mono', monospace;
  padding: 4px 10px;
  background: rgba(123, 47, 190, 0.15);
  border-radius: 4px;
  white-space: nowrap;
}

.edu-school {
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 2px 0;
}

.edu-degree {
  font-size: 12px;
  color: #94a3b8;
}

/* 响应式 */
@media (max-width: 768px) {
  .resume-wrapper { padding: 28px 22px; }
  .name { font-size: 24px; }
  .stack-container { grid-template-columns: 1fr; }
  .project-grid { grid-template-columns: 1fr; }
  .tl-header { flex-direction: column; gap: 6px; }
}
</style>
