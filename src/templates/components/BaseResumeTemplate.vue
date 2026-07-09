<template>
  <article class="base-resume-template" :class="templateClasses" :style="templateVars">
    <div class="template-page">
      <section
        v-for="sectionKey in orderedSections"
        :key="sectionKey"
        class="resume-section"
        :class="[`section-${sectionKey}`]"
      >
        <template v-if="sectionKey === 'personalInfo'">
          <div class="personal-layout" :class="avatarPositionClass">
            <div v-if="personalInfo.photo" class="avatar-block">
              <img :src="personalInfo.photo" alt="头像" class="avatar-image" />
            </div>

            <div class="identity-block">
              <h1 class="person-name">{{ personalInfo.name || '姓名' }}</h1>
              <div v-if="personalInfo.targetPosition" class="target-position">
                {{ personalInfo.targetPosition }}
              </div>

              <div class="contact-list">
                <span v-if="personalInfo.phone">{{ personalInfo.phone }}</span>
                <span v-if="personalInfo.email">{{ personalInfo.email }}</span>
                <span v-if="personalInfo.address">{{ personalInfo.address }}</span>
                <span v-if="personalInfo.website">{{ personalInfo.website }}</span>
                <span v-if="personalInfo.linkedin">{{ personalInfo.linkedin }}</span>
                <span v-if="personalInfo.github">{{ personalInfo.github }}</span>
                <span
                  v-for="field in visibleCustomFields"
                  :key="field.id || field.name"
                >
                  {{ field.name }}: {{ field.value }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="sectionKey === 'summary'">
          <h2 class="section-title">个人简介</h2>
          <p class="summary-text">{{ resumeData.summary }}</p>
        </template>

        <template v-else-if="sectionKey === 'workExperience'">
          <h2 class="section-title">工作经历</h2>
          <div class="item-list">
            <div v-for="work in resumeData.workExperience" :key="work.id || work.company" class="resume-item">
              <div class="item-header">
                <div>
                  <h3 class="item-title">{{ work.position || '职位' }}</h3>
                  <div class="item-subtitle">{{ work.company || '公司' }}</div>
                </div>
                <div class="item-meta">{{ formatRange(work.startDate, work.endDate, work.current) }}</div>
              </div>
              <div v-if="work.location" class="item-meta inline-meta">{{ work.location }}</div>
              <p v-if="work.description" class="item-description">{{ work.description }}</p>
              <ul v-if="work.achievements?.length" class="bullet-list">
                <li v-for="achievement in work.achievements" :key="achievement">{{ achievement }}</li>
              </ul>
            </div>
          </div>
        </template>

        <template v-else-if="sectionKey === 'education'">
          <h2 class="section-title">教育背景</h2>
          <div class="item-list">
            <div v-for="edu in resumeData.education" :key="edu.id || edu.school" class="resume-item">
              <div class="item-header">
                <div>
                  <h3 class="item-title">{{ edu.school || '学校' }}</h3>
                  <div class="item-subtitle">{{ [edu.major, edu.degree, edu.studyType].filter(Boolean).join(' / ') }}</div>
                </div>
                <div class="item-meta">{{ formatRange(edu.startDate, edu.endDate) }}</div>
              </div>
              <div v-if="edu.gpa" class="item-meta inline-meta">GPA: {{ edu.gpa }}</div>
              <p v-if="edu.description || edu.honors" class="item-description">{{ edu.description || edu.honors }}</p>
            </div>
          </div>
        </template>

        <template v-else-if="sectionKey === 'skills'">
          <h2 class="section-title">技能特长</h2>
          <ul v-if="hasDetailedSkills" class="skill-detail-list">
            <li v-for="skill in resumeData.skills" :key="skill.id || skill.name">
              {{ getSkillText(skill) }}
            </li>
          </ul>
          <div v-else class="skill-list">
            <div v-for="skill in resumeData.skills" :key="skill.id || skill.name" class="skill-chip">
              <span>{{ skill.name }}</span>
              <small v-if="skill.level">{{ skill.level }}</small>
            </div>
          </div>
        </template>

        <template v-else-if="sectionKey === 'projects'">
          <h2 class="section-title">项目经历</h2>
          <div class="item-list">
            <div v-for="project in resumeData.projects" :key="project.id || project.name" class="resume-item">
              <div class="item-header">
                <div>
                  <h3 class="item-title">{{ project.name || '项目名称' }}</h3>
                  <div v-if="project.role" class="item-subtitle">{{ project.role }}</div>
                </div>
                <div class="item-meta">{{ formatRange(project.startDate, project.endDate) }}</div>
              </div>
              <p v-if="project.description" class="item-description">{{ project.description }}</p>
              <div v-if="project.technologies?.length" class="tag-list">
                <span v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
              </div>
              <ul v-if="project.highlights?.length" class="bullet-list">
                <li v-for="highlight in project.highlights" :key="highlight">{{ highlight }}</li>
              </ul>
            </div>
          </div>
        </template>

        <template v-else-if="sectionKey === 'certifications'">
          <h2 class="section-title">证书荣誉</h2>
          <div class="item-list compact-items">
            <div v-for="cert in resumeData.certifications" :key="cert.id || cert.name" class="resume-item">
              <div class="item-header">
                <h3 class="item-title">{{ cert.name }}</h3>
                <div class="item-meta">{{ cert.date }}</div>
              </div>
              <div v-if="cert.issuer || cert.score" class="item-subtitle">
                {{ [cert.issuer, cert.score ? `分数：${cert.score}` : ''].filter(Boolean).join(' / ') }}
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="sectionKey === 'languages'">
          <h2 class="section-title">语言能力</h2>
          <div class="skill-list">
            <div v-for="language in resumeData.languages" :key="language.id || language.name" class="skill-chip">
              <span>{{ language.name }}</span>
              <small v-if="language.level">{{ language.level }}</small>
            </div>
          </div>
        </template>
      </section>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '@stores/resume'
const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'modern' },
  renderMode: { type: String, default: 'preview' },
  templateClass: { type: String, default: '' }
})

const resumeStore = useResumeStore()

const personalInfo = computed(() => props.resumeData.personalInfo || {})
const globalSettings = computed(() => resumeStore.globalSettings || {})
const layoutConfig = computed(() => globalSettings.value.layout || {})
const designStyle = computed(() => {
  const value = layoutConfig.value.designStyle || 'modern'
  return ['classic', 'modern', 'business', 'minimal', 'emphasis'].includes(value) ? value : 'modern'
})
const sectionTitleStyle = computed(() => {
  const value = layoutConfig.value.sectionTitleStyle || 'accent'
  return ['plain', 'underline', 'accent', 'block'].includes(value) ? value : 'accent'
})
const densityPreset = computed(() => {
  const value = layoutConfig.value.densityPreset || 'standard'
  return ['relaxed', 'standard', 'compact'].includes(value) ? value : 'standard'
})
const layoutAlignment = computed(() => {
  const alignment = layoutConfig.value.alignment
  const value = typeof alignment === 'string'
    ? alignment
    : alignment?.global || alignment?.text || 'left'

  return ['left', 'center', 'right'].includes(value) ? value : 'left'
})

const templateClasses = computed(() => [
  props.templateClass,
  `design-${designStyle.value}`,
  `title-${sectionTitleStyle.value}`,
  `density-preset-${densityPreset.value}`,
  `align-${layoutAlignment.value}`,
  `render-${props.renderMode}`
].filter(Boolean))

const templateVars = computed(() => {
  const theme = globalSettings.value.theme || {}
  const typography = globalSettings.value.typography || {}
  const spacing = globalSettings.value.spacing || {}
  const layout = globalSettings.value.layout || {}
  const pageMargin = spacing.pageMargin || {}
  const previewTheme = getPreviewTheme(props.templateId)

  return {
    '--tpl-primary': previewTheme.primary || theme.primary || '#1f2937',
    '--tpl-secondary': previewTheme.secondary || theme.secondary || '#4b5563',
    '--tpl-accent': previewTheme.accent || theme.accent || '#2563eb',
    '--tpl-text': previewTheme.text || theme.textPrimary || '#111827',
    '--tpl-muted': previewTheme.muted || theme.textSecondary || '#6b7280',
    '--tpl-bg': previewTheme.bg || theme.background || '#ffffff',
    '--tpl-border': previewTheme.border || theme.border || '#d1d5db',
    '--tpl-font': typography.fontFamily || '"Noto Sans SC", "Source Han Sans SC", "Source Han Sans CN", system-ui, sans-serif',
    '--tpl-base-size': `${typography.baseFontSize || 14}px`,
    '--tpl-title-size': `${typography.titleFontSize || 18}px`,
    '--tpl-line-height': spacing.lineHeight || 1.5,
    '--tpl-section-gap': `${spacing.moduleSpacing || 14}px`,
    '--tpl-column-gap': `${layout.columnGap || 24}px`,
    '--tpl-padding': `${pageMargin.top ?? 24}px ${pageMargin.right ?? 24}px ${pageMargin.bottom ?? 24}px ${pageMargin.left ?? 24}px`
  }
})

function getPreviewTheme(templateId) {
  if (props.renderMode !== 'thumbnail') return {}

  const themes = {
    modern: { primary: '#1f2937', secondary: '#4b5563', accent: '#2563eb', border: '#cbd5e1' },
    classic: { primary: '#111827', secondary: '#374151', accent: '#111827', border: '#9ca3af' },
    compact: { primary: '#0f172a', secondary: '#334155', accent: '#64748b', border: '#cbd5e1' },
    sidebar: { primary: '#334155', secondary: '#475569', accent: '#0f766e', bg: '#f8fafc', border: '#cbd5e1' },
    executive: { primary: '#111827', secondary: '#374151', accent: '#b45309', border: '#d1d5db' },
    creative: { primary: '#581c87', secondary: '#6b21a8', accent: '#c026d3', border: '#e9d5ff' },
    academic: { primary: '#1f2937', secondary: '#4b5563', accent: '#6b7280', border: '#9ca3af' },
    technical: { primary: '#0f172a', secondary: '#334155', accent: '#0284c7', border: '#bae6fd' },
    'ats-clean': { primary: '#111111', secondary: '#333333', accent: '#111111', border: '#111111' },
    'project-ledger': { primary: '#0f172a', secondary: '#1e3a8a', accent: '#0369a1', border: '#94a3b8' },
    timeline: { primary: '#8b1e3f', secondary: '#334155', accent: '#8b1e3f', border: '#c9c2bc' },
    flow: { primary: '#1f2937', secondary: '#475569', accent: '#0f766e', border: '#cbd5e1' },
    portfolio: { primary: '#4c1d95', secondary: '#6d28d9', accent: '#be123c', border: '#ddd6fe' }
  }

  return themes[templateId] || {}
}

const avatarPositionClass = computed(() => {
  const position = personalInfo.value.photoPosition
  return `avatar-${['left', 'center', 'right'].includes(position) ? position : 'center'}`
})

const visibleCustomFields = computed(() => {
  return (personalInfo.value.customFields || []).filter(field => field?.name && field?.value)
})

const getSkillText = (skill) => {
  return (skill.description || skill.name || '').trim()
}

const hasDetailedSkills = computed(() => {
  return (props.resumeData.skills || []).some(skill => {
    const text = getSkillText(skill)
    return Boolean(skill.description) || text.length > 28
  })
})

const orderedSections = computed(() => {
  const defaults = ['personalInfo', 'summary', 'workExperience', 'education', 'skills', 'projects', 'certifications', 'languages']
  const order = [...new Set([...(resumeStore.sectionOrder || []), ...defaults])]
  return order.filter(sectionKey => isVisible(sectionKey) && hasContent(sectionKey))
})

const isVisible = (sectionKey) => {
  return resumeStore.sectionConfig?.[sectionKey]?.visible !== false
}

const hasContent = (sectionKey) => {
  if (sectionKey === 'personalInfo') return true
  if (sectionKey === 'summary') return Boolean(props.resumeData.summary)
  const value = props.resumeData[sectionKey]
  return Array.isArray(value) && value.length > 0
}

const formatRange = (start, end, current = false) => {
  if (!start && !end && !current) return ''
  const right = current ? '至今' : (end || '')
  return [start, right].filter(Boolean).join(' - ')
}
</script>

<style scoped>
.base-resume-template {
  width: 210mm;
  min-height: 297mm;
  background: var(--tpl-bg);
  color: var(--tpl-text);
  font-family: var(--tpl-font);
  font-size: var(--tpl-base-size);
  line-height: var(--tpl-line-height);
  box-sizing: border-box;
}

.template-page {
  min-height: 297mm;
  padding: var(--tpl-padding);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--tpl-section-gap);
}

.resume-section {
  page-break-inside: avoid;
}

.personal-layout {
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 18px;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--tpl-primary);
}

.avatar-block {
  display: flex;
}

.avatar-left .avatar-block { justify-content: flex-start; }
.avatar-center .avatar-block { justify-content: center; }
.avatar-right .avatar-block { justify-content: flex-end; }

.avatar-center {
  grid-template-columns: 1fr 112px 1fr;
}

.avatar-center .avatar-block {
  grid-column: 2;
}

.avatar-center .identity-block {
  grid-column: 1 / -1;
  text-align: center;
}

.avatar-center .contact-list {
  justify-content: center;
}

.avatar-right {
  grid-template-columns: 1fr 112px;
}

.avatar-right .avatar-block {
  order: 2;
}

.avatar-image {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--tpl-accent);
}

.person-name {
  margin: 0;
  font-size: calc(var(--tpl-title-size) + 12px);
  line-height: 1.1;
  color: var(--tpl-primary);
  font-weight: 800;
}

.target-position {
  margin-top: 6px;
  color: var(--tpl-accent);
  font-weight: 650;
}

.contact-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-top: 12px;
  color: var(--tpl-muted);
  font-size: 0.92em;
}

.section-title {
  margin: 0 0 8px;
  font-size: var(--tpl-title-size);
  color: var(--tpl-primary);
  font-weight: 750;
}

.summary-text,
.item-description {
  margin: 0;
  color: var(--tpl-text);
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resume-item {
  page-break-inside: avoid;
}

.item-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.item-title {
  margin: 0;
  font-size: 1.04em;
  color: var(--tpl-text);
  font-weight: 700;
}

.item-subtitle,
.item-meta {
  color: var(--tpl-muted);
  font-size: 0.9em;
}

.inline-meta {
  margin-top: 3px;
}

.item-description {
  margin-top: 6px;
}

.bullet-list {
  margin: 6px 0 0;
  padding-left: 18px;
}

.skill-list,
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip,
.tag-list span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border: 1px solid var(--tpl-border);
  background: #f8fafc;
}

.skill-chip small {
  color: var(--tpl-muted);
}

.skill-detail-list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.skill-detail-list li {
  color: var(--tpl-text);
  line-height: var(--tpl-line-height);
}

.render-thumbnail .template-page {
  padding: 22px 24px;
}

.render-thumbnail .section-title {
  margin-bottom: 7px;
}

.render-thumbnail .summary-text,
.render-thumbnail .item-description {
  max-width: 74ch;
}

.align-center .resume-section:not(.section-personalInfo) {
  text-align: center;
}

.align-center .item-header {
  align-items: center;
}

.align-right .resume-section:not(.section-personalInfo) {
  text-align: right;
}

.align-right .bullet-list {
  list-style-position: inside;
  padding-left: 0;
}

.title-plain .section-title {
  padding-bottom: 0;
  border-bottom: none;
}

.title-plain .section-title::before {
  display: none;
}

.title-underline .section-title {
  padding-bottom: 6px;
  border-bottom: 1px solid var(--tpl-border);
}

.title-underline .section-title::before {
  display: none;
}

.title-accent .section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-accent .section-title::before {
  content: '';
  width: 4px;
  height: 1em;
  background: var(--tpl-accent);
}

.title-block .section-title {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  color: #fff;
  background: var(--tpl-primary);
}

.title-block .section-title::before {
  display: none;
}

.design-classic .resume-section:not(.section-personalInfo),
.design-minimal .resume-section:not(.section-personalInfo) {
  padding: 0 0 8px;
  border-left: none;
  border-bottom: 1px solid var(--tpl-border);
  background: transparent;
}

.design-minimal .personal-layout {
  border-bottom-width: 1px;
}

.design-business .section-personalInfo {
  padding: 20px;
  background: var(--tpl-primary);
  color: #fff;
}

.design-business .section-personalInfo .personal-layout {
  padding-bottom: 0;
  border-bottom: none;
}

.design-business .section-personalInfo .person-name,
.design-business .section-personalInfo .target-position,
.design-business .section-personalInfo .contact-list {
  color: #fff;
}

.design-emphasis .resume-section:not(.section-personalInfo) {
  padding: 10px 0 10px 14px;
  border-left: 3px solid var(--tpl-accent);
  border-bottom: 1px solid var(--tpl-border);
}

.density-preset-relaxed .template-page {
  gap: calc(var(--tpl-section-gap) * 1.25);
}

.density-preset-relaxed .item-list {
  gap: 13px;
}

.density-preset-compact .template-page {
  gap: calc(var(--tpl-section-gap) * 0.75);
}

.density-preset-compact .item-list {
  gap: 7px;
}

.density-preset-compact .section-title {
  margin-bottom: 5px;
}

.density-preset-compact .bullet-list,
.density-preset-compact .item-description {
  margin-top: 4px;
}

@media screen and (max-width: 900px) {
  .base-resume-template {
    width: 100%;
    min-height: auto;
  }

  .template-page {
    min-height: auto;
  }

  .base-resume-template:not(.pdf-export) .personal-layout {
    grid-template-columns: 1fr;
  }

  .base-resume-template:not(.pdf-export) .avatar-center .avatar-block,
  .base-resume-template:not(.pdf-export) .avatar-center .identity-block,
  .base-resume-template:not(.pdf-export) .avatar-right .avatar-block {
    grid-column: auto;
    order: initial;
  }
}
</style>
