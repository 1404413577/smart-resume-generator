<template>
  <div class="legal-template" :style="templateStyles">
    <div class="resume-wrapper">
      <!-- 头部 -->
      <header class="header-section">
        <div class="header-rule top-rule"></div>
        <div class="header-content">
          <h1 class="name">{{ resumeData.personalInfo?.name || 'Attorney Name' }}</h1>
          <h2 class="title">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Legal Professional' }}</h2>
        </div>
        <div class="header-rule bottom-rule"></div>
      </header>

      <!-- 联系方式 -->
      <div class="contact-line" v-if="hasContact">
        <span class="contact-item" v-if="resumeData.personalInfo?.email">{{ resumeData.personalInfo.email }}</span>
        <span class="contact-sep" v-if="hasMultipleContacts">|</span>
        <span class="contact-item" v-if="resumeData.personalInfo?.phone">{{ resumeData.personalInfo.phone }}</span>
        <span class="contact-sep" v-if="hasMultipleContacts">|</span>
        <span class="contact-item" v-if="resumeData.personalInfo?.address">{{ resumeData.personalInfo.address }}</span>
      </div>

      <!-- 执业资格摘要 -->
      <section class="section-block" v-if="resumeData.summary">
        <h3 class="section-title">Professional Profile</h3>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </section>

      <!-- 双栏 -->
      <div class="two-col-grid">
        <div class="col-main">
          <!-- 职业经历 -->
          <section class="section-block" v-if="resumeData.workExperience?.length">
            <h3 class="section-title">Professional Experience</h3>
            <div class="exp-list">
              <div class="exp-item" v-for="work in resumeData.workExperience" :key="work.id">
                <div class="exp-header">
                  <div>
                    <h4 class="exp-position">{{ work.position || work.jobTitle }}</h4>
                    <span class="exp-firm">{{ work.company }}</span>
                  </div>
                  <span class="exp-date">{{ work.startDate }} — {{ work.endDate || 'Present' }}</span>
                </div>
                <ul class="exp-details" v-if="work.responsibilities?.length">
                  <li v-for="(item, i) in work.responsibilities" :key="i">{{ item }}</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- 教育背景 -->
          <section class="section-block" v-if="resumeData.education?.length">
            <h3 class="section-title">Education</h3>
            <div class="edu-list">
              <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
                <div class="edu-main">
                  <h4 class="edu-school">{{ edu.school }}</h4>
                  <span class="edu-degree">{{ edu.degree }}{{ edu.major ? ', ' + edu.major : '' }}</span>
                </div>
                <span class="edu-date">{{ edu.graduationDate || edu.endDate }}</span>
              </div>
            </div>
          </section>
        </div>

        <div class="col-side">
          <!-- 执业资格 -->
          <section class="section-block" v-if="resumeData.projects?.length">
            <h3 class="section-title">Bar Admissions</h3>
            <div class="admission-list">
              <div class="admission-item" v-for="item in resumeData.projects" :key="item.id">
                <h4 class="admission-name">{{ item.name }}</h4>
                <p class="admission-desc" v-if="item.description">{{ item.description }}</p>
                <span class="admission-date" v-if="item.endDate">{{ item.endDate }}</span>
              </div>
            </div>
          </section>

          <!-- 专业领域 -->
          <section class="section-block" v-if="resumeData.skills?.length">
            <h3 class="section-title">Practice Areas</h3>
            <div class="practice-list">
              <div class="practice-item" v-for="skill in resumeData.skills" :key="skill.name">
                <span class="practice-bullet">&#8226;</span>
                <span class="practice-name">{{ skill.name }}</span>
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
  templateId: { type: String, default: 'legalLaw' }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const hasContact = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return p.email || p.phone || p.address
})

const hasMultipleContacts = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return [p.email, p.phone, p.address].filter(Boolean).length > 1
})
</script>

<style scoped>
.legal-template {
  font-family: 'Times New Roman', Georgia, 'Songti SC', serif;
  background: #ffffff;
  color: #1a1a1a;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.resume-wrapper {
  padding: 50px 55px;
}

/* 头部 */
.header-section {
  text-align: center;
  margin-bottom: 20px;
}

.header-rule {
  height: 2px;
  background: var(--primary-color, #1B2A4A);
}

.top-rule { margin-bottom: 20px; }
.bottom-rule { margin-top: 20px; }

.name {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Times New Roman', Georgia, serif;
}

.title {
  font-size: var(--font-size-subtitle, 15px);
  font-weight: 400;
  color: var(--primary-color, #1B2A4A);
  margin: 0;
  letter-spacing: 3px;
  text-transform: uppercase;
}

/* 联系方式 */
.contact-line {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
  font-size: var(--font-size-base, 12px);
  color: #555;
  letter-spacing: 0.3px;
}

.contact-sep {
  color: var(--accent-color, #C9A962);
  font-size: var(--font-size-base, 10px);
}

/* 区块 */
.section-block { margin-bottom: 26px; }

.section-title {
  font-size: var(--font-size-title, 14px);
  font-weight: 700;
  color: var(--primary-color, #1B2A4A);
  margin: 0 0 14px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--accent-color, #C9A962);
}

/* 个人简介 */
.summary-text {
  font-size: var(--font-size-base, 13px);
  line-height: 1.7;
  color: #333;
  margin: 0;
  text-align: justify;
}

/* 双栏 */
.two-col-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 40px;
}

/* 工作经历 */
.exp-item {
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.exp-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 16px;
}

.exp-position {
  font-size: var(--font-size-base, 14px);
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 2px 0;
}

.exp-firm {
  font-size: var(--font-size-base, 13px);
  color: var(--primary-color, #1B2A4A);
  font-style: italic;
}

.exp-date {
  font-size: var(--font-size-base, 12px);
  color: #888;
  white-space: nowrap;
  font-weight: 400;
}

.exp-details {
  margin: 0;
  padding-left: 18px;
}

.exp-details li {
  font-size: var(--font-size-base, 12.5px);
  line-height: 1.65;
  color: #444;
  margin-bottom: 4px;
}

/* 教育 */
.edu-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
  gap: 16px;
}

.edu-item:last-child { margin-bottom: 0; }

.edu-school {
  font-size: var(--font-size-base, 14px);
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 2px 0;
}

.edu-degree {
  font-size: var(--font-size-base, 12.5px);
  color: #555;
  font-style: italic;
}

.edu-date {
  font-size: var(--font-size-base, 12px);
  color: #888;
  white-space: nowrap;
}

/* 执业资格 */
.admission-item {
  margin-bottom: 12px;
  padding: 12px 14px;
  border: 1px solid #eee;
  border-left: 2px solid var(--accent-color, #C9A962);
}

.admission-item:last-child { margin-bottom: 0; }

.admission-name {
  font-size: var(--font-size-base, 13px);
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 3px 0;
}

.admission-desc {
  font-size: var(--font-size-base, 12px);
  color: #666;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.admission-date {
  font-size: var(--font-size-base, 11px);
  color: #999;
}

/* 专业领域 */
.practice-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.practice-item:last-child { margin-bottom: 0; }

.practice-bullet {
  color: var(--accent-color, #C9A962);
  font-size: var(--font-size-subtitle, 16px);
  line-height: 1;
}

.practice-name {
  font-size: var(--font-size-base, 13px);
  color: #333;
  font-weight: 400;
}

/* 响应式 */
@media (max-width: 768px) {
  .resume-wrapper { padding: 30px 22px; }
  .name { font-size: 24px; letter-spacing: 1px; }
  .two-col-grid { grid-template-columns: 1fr; gap: 20px; }
  .exp-header { flex-direction: column; gap: 6px; }
  .contact-line { flex-direction: column; gap: 6px; }
  .contact-sep { display: none; }
}
</style>
