<template>
  <div class="medical-template" :style="templateStyles">
    <div class="resume-wrapper">
      <!-- 头部 -->
      <header class="header-section">
        <div class="header-main">
          <h1 class="name">{{ resumeData.personalInfo?.name || 'Physician Name' }}</h1>
          <h2 class="role">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Medical Professional' }}</h2>
        </div>
        <div class="license-badge" v-if="resumeData.personalInfo?.website">
          <span class="badge-text">Lic #{{ resumeData.personalInfo.website }}</span>
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
      </div>

      <!-- 专业摘要 -->
      <section class="section-block" v-if="resumeData.summary">
        <h3 class="section-title">
          <span class="title-icon">+</span>
          Professional Summary
        </h3>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </section>

      <!-- 双栏布局 -->
      <div class="two-col-grid">
        <div class="col-main">
          <!-- 临床经验 -->
          <section class="section-block" v-if="resumeData.workExperience?.length">
            <h3 class="section-title">
              <span class="title-icon">+</span>
              Clinical Experience
            </h3>
            <div class="exp-list">
              <div class="exp-card" v-for="work in resumeData.workExperience" :key="work.id">
                <div class="exp-top">
                  <div class="exp-left">
                    <h4 class="exp-position">{{ work.position || work.jobTitle }}</h4>
                    <span class="exp-company">{{ work.company }}</span>
                  </div>
                  <span class="exp-date">{{ work.startDate }} — {{ work.endDate || 'Present' }}</span>
                </div>
                <ul class="exp-duties" v-if="work.responsibilities?.length">
                  <li v-for="(item, i) in work.responsibilities" :key="i">{{ item }}</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- 教育背景 -->
          <section class="section-block" v-if="resumeData.education?.length">
            <h3 class="section-title">
              <span class="title-icon">+</span>
              Education & Training
            </h3>
            <div class="edu-list">
              <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
                <div class="edu-year">{{ edu.graduationDate || edu.endDate }}</div>
                <div class="edu-content">
                  <h4 class="edu-degree">{{ edu.degree }}{{ edu.major ? ' in ' + edu.major : '' }}</h4>
                  <span class="edu-school">{{ edu.school }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="col-side">
          <!-- 执照与认证 -->
          <section class="section-block" v-if="resumeData.projects?.length">
            <h3 class="section-title">
              <span class="title-icon">+</span>
              Licenses & Certifications
            </h3>
            <div class="cert-list">
              <div class="cert-item" v-for="cert in resumeData.projects" :key="cert.id">
                <h4 class="cert-name">{{ cert.name }}</h4>
                <p class="cert-desc" v-if="cert.description">{{ cert.description }}</p>
                <span class="cert-date" v-if="cert.endDate">{{ cert.endDate }}</span>
              </div>
            </div>
          </section>

          <!-- 核心技能 -->
          <section class="section-block" v-if="resumeData.skills?.length">
            <h3 class="section-title">
              <span class="title-icon">+</span>
              Clinical Skills
            </h3>
            <div class="skills-tags">
              <span class="skill-tag" v-for="skill in resumeData.skills" :key="skill.name">
                {{ skill.name }}
              </span>
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
  templateId: { type: String, default: 'medicalHealthcare' }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const hasContact = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return p.email || p.phone || p.address
})
</script>

<style scoped>
.medical-template {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #ffffff;
  color: #1e293b;
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
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
  padding-bottom: 22px;
  border-bottom: 3px solid var(--primary-color, #0077B6);
}

.name {
  font-size: 36px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
  line-height: 1.15;
}

.role {
  font-size: var(--font-size-subtitle, 16px);
  font-weight: 500;
  color: var(--primary-color, #0077B6);
  margin: 0;
}

.license-badge {
  padding: 8px 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
}

.badge-text {
  font-size: var(--font-size-base, 12px);
  font-weight: 600;
  color: var(--primary-color, #0077B6);
  letter-spacing: 0.5px;
}

/* 联系方式 */
.contact-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 28px;
  padding: 14px 20px;
  background: #f8fafc;
  border-radius: 10px;
}

.contact-item {
  font-size: var(--font-size-base, 13px);
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-icon {
  font-style: normal;
  font-size: var(--font-size-base, 14px);
  opacity: 0.6;
}

/* 区块 */
.section-block {
  margin-bottom: 28px;
}

.section-title {
  font-size: var(--font-size-title, 15px);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: var(--primary-color, #0077B6);
  color: #ffffff;
  font-size: var(--font-size-base, 14px);
  font-weight: 700;
  border-radius: 4px;
  flex-shrink: 0;
}

/* 个人简介 */
.summary-text {
  font-size: var(--font-size-base, 13.5px);
  line-height: 1.75;
  color: #475569;
  margin: 0;
  text-align: justify;
}

/* 双栏 */
.two-col-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 36px;
}

/* 工作经历 */
.exp-card {
  padding: 18px 20px;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  margin-bottom: 12px;
  border-left: 3px solid var(--primary-color, #0077B6);
}

.exp-card:last-child { margin-bottom: 0; }

.exp-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
}

.exp-position {
  font-size: var(--font-size-subtitle, 15px);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.exp-company {
  font-size: var(--font-size-base, 13px);
  color: var(--primary-color, #0077B6);
  font-weight: 600;
}

.exp-date {
  font-size: var(--font-size-base, 12px);
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;
}

.exp-duties {
  margin: 0;
  padding-left: 18px;
}

.exp-duties li {
  font-size: var(--font-size-base, 13px);
  line-height: 1.65;
  color: #475569;
  margin-bottom: 5px;
}

.exp-duties li::marker { color: var(--primary-color, #0077B6); }

/* 教育 */
.edu-item {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.edu-item:last-child { margin-bottom: 0; }

.edu-year {
  font-size: var(--font-size-base, 12px);
  font-weight: 700;
  color: var(--primary-color, #0077B6);
  background: #f0f9ff;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  min-width: 70px;
  text-align: center;
}

.edu-degree {
  font-size: var(--font-size-base, 14px);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.edu-school {
  font-size: var(--font-size-base, 13px);
  color: #64748b;
}

/* 证书 */
.cert-item {
  padding: 14px 16px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #fafafa;
}

.cert-item:last-child { margin-bottom: 0; }

.cert-name {
  font-size: var(--font-size-base, 14px);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.cert-desc {
  font-size: var(--font-size-base, 12px);
  line-height: 1.5;
  color: #64748b;
  margin: 0 0 6px 0;
}

.cert-date {
  font-size: var(--font-size-base, 11px);
  color: #94a3b8;
  font-weight: 500;
}

/* 技能标签 */
.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  font-size: var(--font-size-base, 12px);
  font-weight: 600;
  color: var(--primary-color, #0077B6);
  background: #f0f9ff;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #bae6fd;
}

/* 响应式 */
@media (max-width: 768px) {
  .resume-wrapper { padding: 28px 22px; }
  .name { font-size: 28px; }
  .two-col-grid { grid-template-columns: 1fr; gap: 20px; }
  .exp-top { flex-direction: column; gap: 6px; }
  .header-section { flex-direction: column; gap: 14px; }
}
</style>
