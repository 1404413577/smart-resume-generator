<template>
  <div class="freelancer-template" :style="templateStyles">
    <div class="resume-wrapper">
      <!-- 头部：个人品牌卡片 -->
      <header class="header-card">
        <div class="card-avatar" v-if="resumeData.personalInfo?.photo">
          <img :src="resumeData.personalInfo.photo" alt="Profile Photo" />
        </div>
        <div class="card-avatar-placeholder" v-else>
          <span>{{ (resumeData.personalInfo?.name || 'F')[0] }}</span>
        </div>
        <div class="card-body">
          <h1 class="name">{{ resumeData.personalInfo?.name || 'Freelancer Name' }}</h1>
          <h2 class="tagline">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Independent Creative Professional' }}</h2>
          <p class="card-summary" v-if="resumeData.summary">{{ resumeData.summary }}</p>
        </div>
        <div class="card-contact" v-if="hasContact">
          <div class="cc-item" v-if="resumeData.personalInfo?.email">
            <span class="cc-icon">✉</span>
            <span>{{ resumeData.personalInfo.email }}</span>
          </div>
          <div class="cc-item" v-if="resumeData.personalInfo?.phone">
            <span class="cc-icon">☎</span>
            <span>{{ resumeData.personalInfo.phone }}</span>
          </div>
          <div class="cc-item" v-if="resumeData.personalInfo?.website">
            <span class="cc-icon">🌐</span>
            <span>{{ resumeData.personalInfo.website }}</span>
          </div>
          <div class="cc-item" v-if="resumeData.personalInfo?.address">
            <span class="cc-icon">⌂</span>
            <span>{{ resumeData.personalInfo.address }}</span>
          </div>
        </div>
      </header>

      <!-- 项目展示 -->
      <section class="section-block" v-if="resumeData.projects?.length">
        <h3 class="section-title">Selected Projects</h3>
        <div class="portfolio-grid">
          <div class="portfolio-item" v-for="proj in resumeData.projects" :key="proj.id">
            <h4 class="port-title">{{ proj.name }}</h4>
            <p class="port-desc" v-if="proj.description">{{ proj.description }}</p>
            <div class="port-meta">
              <span class="port-date" v-if="proj.endDate">{{ proj.endDate }}</span>
              <div class="port-tags" v-if="proj.technologies?.length">
                <span class="port-tag" v-for="tech in proj.technologies" :key="tech">{{ tech }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 双栏 -->
      <div class="two-col-grid">
        <div class="col-main">
          <!-- 工作经历 -->
          <section class="section-block" v-if="resumeData.workExperience?.length">
            <h3 class="section-title">Work & Collaborations</h3>
            <div class="exp-list">
              <div class="exp-item" v-for="work in resumeData.workExperience" :key="work.id">
                <div class="exp-bar"></div>
                <div class="exp-content">
                  <div class="exp-header">
                    <h4 class="exp-role">{{ work.position || work.jobTitle }}</h4>
                    <span class="exp-date">{{ work.startDate }} — {{ work.endDate || 'Present' }}</span>
                  </div>
                  <span class="exp-client">{{ work.company }}</span>
                  <ul class="exp-details" v-if="work.responsibilities?.length">
                    <li v-for="(item, i) in work.responsibilities" :key="i">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="col-side">
          <!-- 技能 -->
          <section class="section-block" v-if="resumeData.skills?.length">
            <h3 class="section-title">Skills & Tools</h3>
            <div class="skill-cloud">
              <span class="skill-bubble" v-for="skill in resumeData.skills" :key="skill.name">
                {{ skill.name }}
              </span>
            </div>
          </section>

          <!-- 教育 -->
          <section class="section-block" v-if="resumeData.education?.length">
            <h3 class="section-title">Education</h3>
            <div class="edu-list">
              <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
                <h4 class="edu-school">{{ edu.school }}</h4>
                <span class="edu-major">{{ edu.degree }}{{ edu.major ? ' in ' + edu.major : '' }}</span>
                <span class="edu-date">{{ edu.graduationDate || edu.endDate }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'freelancerCreative' }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const hasContact = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return p.email || p.phone || p.website || p.address
})
</script>

<style scoped>
.freelancer-template {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #fdf8f4;
  color: #3d3027;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.resume-wrapper {
  padding: 45px 48px;
}

/* 个人品牌卡片 */
.header-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 30px;
  box-shadow: 0 2px 16px rgba(193, 122, 78, 0.08);
  border: 1px solid #f0e6dc;
  text-align: center;
}

.card-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  border: 3px solid var(--primary-color, #C17A4E);
}

.card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-avatar-placeholder {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--primary-color, #C17A4E);
  color: #ffffff;
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.name {
  font-size: 28px;
  font-weight: 700;
  color: #2d2015;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
}

.tagline {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color, #C17A4E);
  margin: 0 0 14px 0;
}

.card-summary {
  font-size: 13px;
  line-height: 1.7;
  color: #6b5e52;
  margin: 0 auto;
  max-width: 520px;
}

.card-contact {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #f0e6dc;
}

.cc-item {
  font-size: 12px;
  color: #8b7355;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cc-icon { font-style: normal; font-size: 13px; color: var(--primary-color, #C17A4E); }

/* 区块 */
.section-block { margin-bottom: 28px; }

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--secondary-color, #7D9B76);
  margin: 0 0 16px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 8px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 32px;
  height: 3px;
  background: var(--primary-color, #C17A4E);
  border-radius: 2px;
}

/* 项目网格 */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.portfolio-item {
  background: #ffffff;
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid #f0e6dc;
}

.port-title {
  font-size: 15px;
  font-weight: 700;
  color: #2d2015;
  margin: 0 0 8px 0;
}

.port-desc {
  font-size: 12px;
  line-height: 1.6;
  color: #6b5e52;
  margin: 0 0 12px 0;
}

.port-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.port-date {
  font-size: 11px;
  color: #a09080;
}

.port-tags { display: flex; flex-wrap: wrap; gap: 6px; }

.port-tag {
  font-size: 10px;
  font-weight: 600;
  color: var(--secondary-color, #7D9B76);
  background: #f0f5ee;
  padding: 3px 8px;
  border-radius: 12px;
}

/* 双栏 */
.two-col-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 36px;
}

/* 工作经历 */
.exp-item {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
}

.exp-item:last-child { margin-bottom: 0; }

.exp-bar {
  width: 3px;
  background: var(--primary-color, #C17A4E);
  border-radius: 2px;
  flex-shrink: 0;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  gap: 12px;
}

.exp-role {
  font-size: 15px;
  font-weight: 700;
  color: #2d2015;
  margin: 0;
}

.exp-date {
  font-size: 11px;
  color: #a09080;
  white-space: nowrap;
}

.exp-client {
  font-size: 13px;
  color: var(--primary-color, #C17A4E);
  font-weight: 500;
  display: block;
  margin-bottom: 6px;
}

.exp-details {
  margin: 0;
  padding-left: 16px;
}

.exp-details li {
  font-size: 12.5px;
  line-height: 1.6;
  color: #6b5e52;
  margin-bottom: 3px;
}

.exp-details li::marker { color: var(--secondary-color, #7D9B76); }

/* 技能云 */
.skill-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-bubble {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-color, #C17A4E);
  background: #ffffff;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #f0e6dc;
}

/* 教育 */
.edu-item {
  margin-bottom: 14px;
}

.edu-item:last-child { margin-bottom: 0; }

.edu-school {
  font-size: 14px;
  font-weight: 700;
  color: #2d2015;
  margin: 0 0 2px 0;
}

.edu-major {
  display: block;
  font-size: 12px;
  color: #6b5e52;
  margin-bottom: 2px;
}

.edu-date {
  font-size: 11px;
  color: #a09080;
}

/* 响应式 */
@media (max-width: 768px) {
  .resume-wrapper { padding: 24px 20px; }
  .name { font-size: 24px; }
  .header-card { padding: 20px; }
  .portfolio-grid { grid-template-columns: 1fr; }
  .two-col-grid { grid-template-columns: 1fr; gap: 20px; }
  .exp-header { flex-direction: column; gap: 4px; }
}
</style>
