<template>
  <article class="editorial-resume-template" :class="`render-${renderMode}`" :style="templateVars">
    <div class="editorial-page">
      <header class="editorial-masthead">
        <div class="name-lockup">
          <span>Resume</span>
          <h1>{{ personalInfo.name || '姓名' }}</h1>
          <p v-if="personalInfo.targetPosition">{{ personalInfo.targetPosition }}</p>
        </div>
        <div v-if="contactItems.length" class="contact-column">
          <div v-for="item in contactItems" :key="item.label" class="contact-row">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </header>

      <section v-if="isVisible('summary') && resumeData.summary" class="lead-summary">
        <p>{{ resumeData.summary }}</p>
      </section>

      <div class="editorial-grid">
        <main class="feature-column">
          <section v-if="hasArrayContent('workExperience')" class="editorial-section">
            <h2>工作经历</h2>
            <article v-for="work in resumeData.workExperience" :key="work.id || work.company" class="feature-item">
              <div class="feature-meta">{{ formatRange(work.startDate, work.endDate, work.current) }}</div>
              <div class="feature-body">
                <h3>{{ work.position || '职位' }}</h3>
                <p class="subtitle">{{ [work.company, work.location].filter(Boolean).join(' / ') }}</p>
                <p v-if="work.description" class="item-description">{{ work.description }}</p>
                <ul v-if="work.achievements?.length" class="bullet-list">
                  <li v-for="achievement in work.achievements" :key="achievement">{{ achievement }}</li>
                </ul>
              </div>
            </article>
          </section>

          <section v-if="hasArrayContent('projects')" class="editorial-section">
            <h2>项目经历</h2>
            <article v-for="project in resumeData.projects" :key="project.id || project.name" class="feature-item project-item">
              <div class="feature-meta">{{ formatRange(project.startDate, project.endDate) }}</div>
              <div class="feature-body">
                <h3>{{ project.name || '项目名称' }}</h3>
                <p v-if="project.role" class="subtitle">{{ project.role }}</p>
                <p v-if="project.description" class="item-description">{{ project.description }}</p>
                <div v-if="project.technologies?.length" class="tag-list">
                  <span v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
                </div>
                <ul v-if="project.highlights?.length" class="bullet-list">
                  <li v-for="highlight in project.highlights" :key="highlight">{{ highlight }}</li>
                </ul>
              </div>
            </article>
          </section>
        </main>

        <aside class="note-column">
          <section v-if="hasArrayContent('skills')" class="note-section">
            <h2>技能</h2>
            <ul v-if="hasDetailedSkills" class="note-list">
              <li v-for="skill in resumeData.skills" :key="skill.id || skill.name">{{ getSkillText(skill) }}</li>
            </ul>
            <div v-else class="keyword-list">
              <span v-for="skill in resumeData.skills" :key="skill.id || skill.name">
                {{ skill.name }}<small v-if="skill.level">{{ skill.level }}</small>
              </span>
            </div>
          </section>

          <section v-if="hasArrayContent('education')" class="note-section">
            <h2>教育</h2>
            <article v-for="edu in resumeData.education" :key="edu.id || edu.school" class="note-item">
              <h3>{{ edu.school || '学校' }}</h3>
              <p>{{ [edu.major, edu.degree, edu.studyType].filter(Boolean).join(' / ') }}</p>
              <span>{{ formatRange(edu.startDate, edu.endDate) }}</span>
              <small v-if="edu.gpa || edu.description || edu.honors">
                {{ [edu.gpa ? `GPA: ${edu.gpa}` : '', edu.description || edu.honors].filter(Boolean).join(' / ') }}
              </small>
            </article>
          </section>

          <section v-if="hasArrayContent('certifications')" class="note-section">
            <h2>证书</h2>
            <article v-for="cert in resumeData.certifications" :key="cert.id || cert.name" class="note-item">
              <h3>{{ cert.name }}</h3>
              <p>{{ [cert.issuer, cert.score].filter(Boolean).join(' / ') }}</p>
              <span>{{ cert.date }}</span>
            </article>
          </section>

          <section v-if="hasArrayContent('languages')" class="note-section">
            <h2>语言</h2>
            <div class="language-list">
              <span v-for="language in resumeData.languages" :key="language.id || language.name">
                {{ [language.name, language.level].filter(Boolean).join(' / ') }}
              </span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '@stores/resume'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'editorial' },
  renderMode: { type: String, default: 'preview' }
})

const resumeStore = useResumeStore()
const personalInfo = computed(() => props.resumeData.personalInfo || {})
const globalSettings = computed(() => resumeStore.globalSettings || {})

const templateVars = computed(() => {
  const theme = globalSettings.value.theme || {}
  const typography = globalSettings.value.typography || {}
  const spacing = globalSettings.value.spacing || {}
  const pageMargin = spacing.pageMargin || {}
  const previewTheme = props.renderMode === 'thumbnail'
    ? { primary: '#3f2a1d', accent: '#a03d2d', border: '#d8d1ca' }
    : {}

  return {
    '--ed-primary': previewTheme.primary || theme.primary || '#3f2a1d',
    '--ed-accent': previewTheme.accent || theme.accent || '#a03d2d',
    '--ed-text': theme.textPrimary || '#1f1c19',
    '--ed-muted': theme.textSecondary || '#665f58',
    '--ed-bg': theme.background || '#ffffff',
    '--ed-border': previewTheme.border || theme.border || '#d8d1ca',
    '--ed-font': typography.fontFamily || '"Noto Sans SC", "Source Han Sans SC", "Source Han Sans CN", system-ui, sans-serif',
    '--ed-base-size': `${typography.baseFontSize || 14}px`,
    '--ed-line-height': spacing.lineHeight || 1.55,
    '--ed-padding': `${pageMargin.top ?? 24}px ${pageMargin.right ?? 24}px ${pageMargin.bottom ?? 24}px ${pageMargin.left ?? 24}px`
  }
})

const visibleCustomFields = computed(() => (personalInfo.value.customFields || []).filter(field => field?.name && field?.value))
const contactItems = computed(() => {
  const info = personalInfo.value
  return [
    { label: '电话', value: info.phone },
    { label: '邮箱', value: info.email },
    { label: '城市', value: info.address },
    { label: '网站', value: info.website },
    { label: 'LinkedIn', value: info.linkedin },
    { label: 'GitHub', value: info.github },
    ...visibleCustomFields.value.map(field => ({ label: field.name, value: field.value }))
  ].filter(item => item.value)
})

const isVisible = (sectionKey) => resumeStore.sectionConfig?.[sectionKey]?.visible !== false
const hasArrayContent = (sectionKey) => isVisible(sectionKey) && Array.isArray(props.resumeData[sectionKey]) && props.resumeData[sectionKey].length > 0
const getSkillText = (skill) => (skill.description || skill.name || '').trim()
const hasDetailedSkills = computed(() => (props.resumeData.skills || []).some(skill => Boolean(skill.description) || getSkillText(skill).length > 28))
const formatRange = (start, end, current = false) => {
  if (!start && !end && !current) return ''
  return [start, current ? '至今' : (end || '')].filter(Boolean).join(' - ')
}
</script>

<style scoped>
.editorial-resume-template {
  width: 210mm;
  min-height: 297mm;
  box-sizing: border-box;
  background: var(--ed-bg);
  color: var(--ed-text);
  font-family: var(--ed-font);
  font-size: var(--ed-base-size);
  line-height: var(--ed-line-height);
}

.editorial-page {
  min-height: 297mm;
  padding: var(--ed-padding);
  box-sizing: border-box;
  background:
    linear-gradient(90deg, rgba(63, 42, 29, 0.04) 0 1px, transparent 1px) 0 0 / 14mm 14mm,
    var(--ed-bg);
}

.editorial-masthead {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 64mm;
  gap: 20px;
  padding-bottom: 18px;
  border-bottom: 3px double var(--ed-primary);
}

.name-lockup span {
  color: var(--ed-accent);
  font-size: 12px;
  font-weight: 850;
}

.name-lockup h1 {
  margin: 5px 0 0;
  color: var(--ed-primary);
  font-size: 36px;
  line-height: 1.05;
  font-weight: 850;
  letter-spacing: 0;
  text-wrap: balance;
}

.name-lockup p {
  margin: 8px 0 0;
  color: var(--ed-muted);
  font-weight: 750;
}

.contact-column {
  display: grid;
  gap: 6px;
}

.contact-row {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  gap: 8px;
  align-items: baseline;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(63, 42, 29, 0.16);
}

.contact-row span,
.feature-meta,
.note-item span,
.note-item small,
.keyword-list small {
  color: var(--ed-muted);
  font-size: 12px;
  font-weight: 650;
}

.contact-row strong {
  color: var(--ed-text);
  font-size: 12px;
  overflow-wrap: anywhere;
}

.lead-summary {
  margin: 18px 0;
  padding: 14px 18px;
  border: 1px solid var(--ed-border);
  background: rgba(255, 255, 255, 0.76);
  break-inside: avoid;
}

.lead-summary p {
  margin: 0;
  font-size: 15px;
  color: #28231f;
}

.editorial-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 58mm;
  gap: 22px;
  align-items: start;
}

.feature-column,
.note-column {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.note-column {
  padding-left: 18px;
  border-left: 1px solid var(--ed-border);
}

.editorial-section,
.feature-item,
.note-section,
.note-item {
  break-inside: avoid;
}

.editorial-section h2,
.note-section h2 {
  margin: 0 0 10px;
  color: var(--ed-primary);
  font-size: 17px;
  line-height: 1.2;
  font-weight: 850;
}

.feature-item {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr);
  gap: 14px;
  padding: 12px 0;
  border-top: 1px solid rgba(63, 42, 29, 0.16);
}

.feature-item:first-of-type {
  padding-top: 0;
  border-top: 0;
}

.feature-body h3,
.note-item h3 {
  margin: 0;
  color: var(--ed-text);
  font-size: 15px;
  line-height: 1.3;
  font-weight: 850;
}

.subtitle,
.note-item p {
  margin: 3px 0 0;
  color: var(--ed-accent);
  font-size: 13px;
  font-weight: 750;
}

.item-description,
.bullet-list,
.tag-list {
  margin-top: 8px;
}

.item-description {
  color: #28231f;
}

.bullet-list {
  padding-left: 17px;
}

.bullet-list li {
  margin-bottom: 3px;
}

.bullet-list li::marker {
  color: var(--ed-accent);
}

.tag-list,
.keyword-list,
.language-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-list span,
.keyword-list span,
.language-list span {
  display: inline-flex;
  gap: 5px;
  padding: 3px 7px;
  border: 1px solid var(--ed-border);
  background: rgba(255, 255, 255, 0.7);
  color: var(--ed-text);
  font-size: 12px;
  font-weight: 750;
}

.note-section {
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(63, 42, 29, 0.16);
}

.note-section:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.note-list {
  margin: 0;
  padding-left: 17px;
  display: grid;
  gap: 6px;
}

.note-item + .note-item {
  margin-top: 10px;
}

.note-item small,
.note-item span {
  display: block;
  margin-top: 3px;
}

.render-thumbnail .editorial-page {
  padding: 20px 22px;
}

.render-thumbnail .editorial-masthead,
.render-thumbnail .editorial-grid {
  grid-template-columns: 1fr;
}

.render-thumbnail .contact-column {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.render-thumbnail .note-column {
  padding-left: 0;
  border-left: 0;
}

@media screen and (max-width: 900px) {
  .editorial-resume-template {
    width: 100%;
    min-height: auto;
  }

  .editorial-page {
    min-height: auto;
  }

  .editorial-masthead,
  .editorial-grid,
  .feature-item {
    grid-template-columns: 1fr;
  }

  .note-column {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
