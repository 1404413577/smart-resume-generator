<template>
  <article class="unified-resume-template" :class="templateClasses" :style="templateVars">
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
                  <div class="item-subtitle">{{ [edu.major, edu.degree].filter(Boolean).join(' / ') }}</div>
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
              <div v-if="cert.issuer" class="item-subtitle">{{ cert.issuer }}</div>
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
import { templateVariants } from '../templateVariants'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'modern' },
  renderMode: { type: String, default: 'preview' }
})

const resumeStore = useResumeStore()

const personalInfo = computed(() => props.resumeData.personalInfo || {})
const globalSettings = computed(() => resumeStore.globalSettings || {})
const variant = computed(() => templateVariants[props.templateId] || templateVariants.modern)
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
  `layout-${variant.value.layout}`,
  `density-${variant.value.density}`,
  `design-${designStyle.value}`,
  `title-${sectionTitleStyle.value}`,
  `density-preset-${densityPreset.value}`,
  `accent-${variant.value.accent}`,
  `align-${layoutAlignment.value}`
])

const templateVars = computed(() => {
  const theme = globalSettings.value.theme || {}
  const typography = globalSettings.value.typography || {}
  const spacing = globalSettings.value.spacing || {}
  const layout = globalSettings.value.layout || {}
  const pageMargin = spacing.pageMargin || {}

  return {
    '--tpl-primary': theme.primary || '#1f2937',
    '--tpl-secondary': theme.secondary || '#4b5563',
    '--tpl-accent': theme.accent || '#2563eb',
    '--tpl-text': theme.textPrimary || '#111827',
    '--tpl-muted': theme.textSecondary || '#6b7280',
    '--tpl-bg': theme.background || '#ffffff',
    '--tpl-border': theme.border || '#d1d5db',
    '--tpl-font': typography.fontFamily || 'Arial, sans-serif',
    '--tpl-base-size': `${typography.baseFontSize || 14}px`,
    '--tpl-title-size': `${typography.titleFontSize || 18}px`,
    '--tpl-line-height': spacing.lineHeight || 1.5,
    '--tpl-section-gap': `${spacing.moduleSpacing || 14}px`,
    '--tpl-column-gap': `${layout.columnGap || 24}px`,
    '--tpl-padding': `${pageMargin.top ?? 24}px ${pageMargin.right ?? 24}px ${pageMargin.bottom ?? 24}px ${pageMargin.left ?? 24}px`
  }
})

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
.unified-resume-template {
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

.avatar-center,
.avatar-right {
  grid-template-columns: 1fr;
}

.avatar-center .avatar-block,
.avatar-right .avatar-block {
  order: -1;
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

.accent-line .section-title {
  padding-bottom: 5px;
  border-bottom: 1px solid var(--tpl-border);
}

.accent-panel .resume-section:not(.section-personalInfo) {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--tpl-border);
}

.accent-panel .section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.accent-panel .section-title::before {
  content: '';
  width: 4px;
  height: 1em;
  background: var(--tpl-accent);
}

.accent-block .resume-section:not(.section-personalInfo) {
  padding: 10px 0 10px 14px;
  border-left: 3px solid var(--tpl-accent);
  border-bottom: 1px solid var(--tpl-border);
}

.accent-band .section-personalInfo {
  padding: 20px;
  background: var(--tpl-primary);
  color: #fff;
}

.accent-band .section-personalInfo .personal-layout {
  border-bottom: none;
}

.accent-band .section-personalInfo .person-name,
.accent-band .section-personalInfo .target-position,
.accent-band .section-personalInfo .contact-list {
  color: #fff;
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

.layout-modern .template-page,
.layout-sidebar .template-page,
.layout-technical .template-page {
  display: flex;
  flex-direction: column;
  gap: var(--tpl-section-gap);
}

.layout-sidebar .section-personalInfo {
  padding: 18px;
  background: #f1f5f9;
}

.layout-creative .section-title {
  color: var(--tpl-accent);
  text-transform: uppercase;
}

.layout-executive .template-page {
  gap: calc(var(--tpl-section-gap) * 1.05);
}

.layout-academic .section-title,
.layout-classic .section-title {
  color: var(--tpl-text);
}

.layout-compact .template-page,
.density-compact .template-page {
  gap: calc(var(--tpl-section-gap) * 0.65);
}

.density-compact .resume-section:not(.section-personalInfo) {
  padding-top: 0;
  padding-bottom: 0;
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

@media (max-width: 900px) {
  .unified-resume-template {
    width: 100%;
    min-height: auto;
  }

  .template-page,
  .layout-modern .template-page,
  .layout-sidebar .template-page,
  .layout-technical .template-page {
    min-height: auto;
  }

  .personal-layout {
    grid-template-columns: 1fr;
  }
}
</style>
