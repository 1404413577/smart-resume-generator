<template>
  <div class="luxury-template" :style="templateStyles">
    <div class="resume-wrapper">
      <!-- 顶部金色装饰线 -->
      <div class="gold-rule top-gold"></div>

      <!-- 头部 -->
      <header class="header-section">
        <h1 class="name">{{ resumeData.personalInfo?.name || 'Executive Name' }}</h1>
        <h2 class="title">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Senior Leadership' }}</h2>
      </header>

      <!-- 联系方式 -->
      <div class="contact-line" v-if="hasContact">
        <span class="contact-item" v-if="resumeData.personalInfo?.email">{{ resumeData.personalInfo.email }}</span>
        <span class="contact-dot" v-if="hasMultiple">&#183;</span>
        <span class="contact-item" v-if="resumeData.personalInfo?.phone">{{ resumeData.personalInfo.phone }}</span>
        <span class="contact-dot" v-if="hasMultiple">&#183;</span>
        <span class="contact-item" v-if="resumeData.personalInfo?.address">{{ resumeData.personalInfo.address }}</span>
        <span class="contact-dot" v-if="hasMultiple">&#183;</span>
        <span class="contact-item" v-if="resumeData.personalInfo?.website">{{ resumeData.personalInfo.website }}</span>
      </div>

      <div class="gold-rule"></div>

      <!-- 执行摘要 -->
      <section class="section-block" v-if="resumeData.summary">
        <h3 class="section-title">Executive Profile</h3>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </section>

      <!-- 职业经历 -->
      <section class="section-block" v-if="resumeData.workExperience?.length">
        <h3 class="section-title">Career Highlights</h3>
        <div class="exp-list">
          <div class="exp-item" v-for="work in resumeData.workExperience" :key="work.id">
            <div class="exp-header">
              <div class="exp-left">
                <h4 class="exp-position">{{ work.position || work.jobTitle }}</h4>
                <span class="exp-company">{{ work.company }}</span>
              </div>
              <span class="exp-date">{{ work.startDate }} — {{ work.endDate || 'Present' }}</span>
            </div>
            <ul class="exp-achievements" v-if="work.responsibilities?.length">
              <li v-for="(item, i) in work.responsibilities" :key="i">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 教育 + 认证 -->
      <div class="two-col-grid">
        <section class="section-block" v-if="resumeData.education?.length">
          <h3 class="section-title">Education</h3>
          <div class="edu-list">
            <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
              <h4 class="edu-school">{{ edu.school }}</h4>
              <span class="edu-degree">{{ edu.degree }}{{ edu.major ? ', ' + edu.major : '' }}</span>
              <span class="edu-date">{{ edu.graduationDate || edu.endDate }}</span>
            </div>
          </div>
        </section>

        <section class="section-block" v-if="resumeData.skills?.length">
          <h3 class="section-title">Expertise</h3>
          <div class="expertise-list">
            <div class="expertise-item" v-for="skill in resumeData.skills" :key="skill.name">
              <span class="expertise-name">{{ skill.name }}</span>
              <div class="expertise-bar" v-if="skill.level">
                <div class="expertise-fill" :style="{ width: getPercent(skill.level) }"></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 认证与成就 -->
      <section class="section-block" v-if="resumeData.projects?.length">
        <h3 class="section-title">Board Positions & Honors</h3>
        <div class="honors-list">
          <div class="honor-item" v-for="item in resumeData.projects" :key="item.id">
            <span class="honor-year" v-if="item.endDate">{{ item.endDate }}</span>
            <div class="honor-content">
              <h4 class="honor-name">{{ item.name }}</h4>
              <p class="honor-desc" v-if="item.description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="gold-rule bottom-gold"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'luxuryPremium' }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const hasContact = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return p.email || p.phone || p.address || p.website
})

const hasMultiple = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return [p.email, p.phone, p.address, p.website].filter(Boolean).length > 1
})

const getPercent = (level) => {
  const map = { 'expert': '95%', '精通': '95%', 'advanced': '80%', '熟练': '80%', 'intermediate': '60%', '良好': '60%', 'beginner': '35%', '了解': '35%' }
  return map[level?.toLowerCase()] || '70%'
}
</script>

<style scoped>
.luxury-template {
  font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, 'Times New Roman', serif;
  background: #0A0A0A;
  color: #d4d4d4;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.resume-wrapper {
  padding: 55px 60px;
}

/* 金色装饰线 */
.gold-rule {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--accent-color, #D4AF37) 20%, var(--accent-color, #D4AF37) 80%, transparent 100%);
  margin: 0 auto;
  width: 100%;
}

.top-gold { margin-bottom: 28px; }
.bottom-gold { margin-top: 28px; }

/* 头部 */
.header-section {
  text-align: center;
  margin-bottom: 18px;
}

.name {
  font-size: 36px;
  font-weight: 400;
  color: #f5f5f5;
  margin: 0 0 12px 0;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: 'Playfair Display', Georgia, serif;
}

.title {
  font-size: var(--font-size-subtitle, 16px);
  font-weight: 300;
  color: var(--accent-color, #D4AF37);
  margin: 0;
  letter-spacing: 4px;
  text-transform: uppercase;
}

/* 联系方式 */
.contact-line {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
  font-size: var(--font-size-base, 12px);
  color: #999;
  letter-spacing: 1px;
}

.contact-dot { color: var(--accent-color, #D4AF37); font-size: var(--font-size-subtitle, 16px); }

/* 区块 */
.section-block { margin-bottom: 30px; }

.section-title {
  font-size: var(--font-size-title, 14px);
  font-weight: 400;
  color: var(--accent-color, #D4AF37);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-align: center;
}

/* 个人简介 */
.summary-text {
  font-size: var(--font-size-base, 14px);
  line-height: 1.8;
  color: #b0b0b0;
  margin: 0;
  text-align: center;
  font-style: italic;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* 工作经历 */
.exp-item {
  margin-bottom: 22px;
  padding-bottom: 20px;
  border-bottom: 1px solid #222;
}

.exp-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 16px;
}

.exp-position {
  font-size: var(--font-size-subtitle, 16px);
  font-weight: 400;
  color: #f5f5f5;
  margin: 0 0 4px 0;
  letter-spacing: 0.5px;
}

.exp-company {
  font-size: var(--font-size-base, 13px);
  color: var(--accent-color, #D4AF37);
  font-weight: 300;
  letter-spacing: 1px;
}

.exp-date {
  font-size: var(--font-size-base, 12px);
  color: #777;
  white-space: nowrap;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.exp-achievements {
  margin: 0;
  padding-left: 18px;
}

.exp-achievements li {
  font-size: var(--font-size-base, 13px);
  line-height: 1.7;
  color: #b0b0b0;
  margin-bottom: 5px;
}

.exp-achievements li::marker { color: var(--accent-color, #D4AF37); }

/* 双栏 */
.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

/* 教育 */
.edu-item {
  margin-bottom: 16px;
}

.edu-item:last-child { margin-bottom: 0; }

.edu-school {
  font-size: var(--font-size-subtitle, 15px);
  font-weight: 400;
  color: #f5f5f5;
  margin: 0 0 3px 0;
  letter-spacing: 0.5px;
}

.edu-degree {
  display: block;
  font-size: var(--font-size-base, 12px);
  color: #999;
  margin-bottom: 2px;
}

.edu-date {
  font-size: var(--font-size-base, 11px);
  color: #666;
  letter-spacing: 0.5px;
}

/* 专业技能 */
.expertise-item {
  margin-bottom: 12px;
}

.expertise-item:last-child { margin-bottom: 0; }

.expertise-name {
  font-size: var(--font-size-base, 13px);
  color: #d4d4d4;
  display: block;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.expertise-bar {
  height: 3px;
  background: #222;
  border-radius: 2px;
  overflow: hidden;
}

.expertise-fill {
  height: 100%;
  border-radius: 2px;
  background: var(--accent-color, #D4AF37);
}

/* 荣誉 */
.honor-item {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.honor-item:last-child { margin-bottom: 0; }

.honor-year {
  font-size: var(--font-size-base, 12px);
  color: var(--accent-color, #D4AF37);
  font-weight: 400;
  letter-spacing: 1px;
  white-space: nowrap;
  min-width: 70px;
}

.honor-name {
  font-size: var(--font-size-base, 14px);
  font-weight: 400;
  color: #f5f5f5;
  margin: 0 0 3px 0;
  letter-spacing: 0.5px;
}

.honor-desc {
  font-size: var(--font-size-base, 12px);
  color: #999;
  margin: 0;
  line-height: 1.5;
}

/* 响应式 */
@media (max-width: 768px) {
  .resume-wrapper { padding: 30px 24px; }
  .name { font-size: 26px; letter-spacing: 2px; }
  .two-col-grid { grid-template-columns: 1fr; gap: 20px; }
  .exp-header { flex-direction: column; gap: 6px; }
  .contact-line { flex-wrap: wrap; gap: 8px; }
  .contact-dot { display: none; }
}
</style>
