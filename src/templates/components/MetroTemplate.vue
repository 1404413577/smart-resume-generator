<template>
  <article class="metro-resume-template" :class="`render-${renderMode}`" :style="templateVars">
    <div class="metro-page">
      <header class="metro-header">
        <div>
          <h1>{{ personalInfo.name || '姓名' }}</h1>
          <p v-if="personalInfo.targetPosition">{{ personalInfo.targetPosition }}</p>
        </div>
        <ul v-if="contactItems.length" class="header-contact">
          <li v-for="item in contactItems" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </li>
        </ul>
      </header>

      <div class="metro-body">
        <aside class="metro-aside">
          <section v-if="isVisible('summary') && resumeData.summary" class="metro-block summary-block">
            <h2>个人简介</h2>
            <p>{{ resumeData.summary }}</p>
          </section>

          <section v-if="hasArrayContent('skills')" class="metro-block">
            <h2>技能特长</h2>
            <ul v-if="hasDetailedSkills" class="plain-list">
              <li v-for="skill in resumeData.skills" :key="skill.id || skill.name">{{ getSkillText(skill) }}</li>
            </ul>
            <div v-else class="skill-stack">
              <span v-for="skill in resumeData.skills" :key="skill.id || skill.name">
                {{ skill.name }}<small v-if="skill.level">{{ skill.level }}</small>
              </span>
            </div>
          </section>

          <section v-if="hasArrayContent('certifications')" class="metro-block">
            <h2>证书荣誉</h2>
            <ul class="plain-list compact-list">
              <li v-for="cert in resumeData.certifications" :key="cert.id || cert.name">
                <strong>{{ cert.name }}</strong>
                <span>{{ [cert.issuer, cert.date].filter(Boolean).join(' / ') }}</span>
              </li>
            </ul>
          </section>

          <section v-if="hasArrayContent('languages')" class="metro-block">
            <h2>语言能力</h2>
            <div class="language-rows">
              <span v-for="language in resumeData.languages" :key="language.id || language.name">
                {{ [language.name, language.level].filter(Boolean).join(' / ') }}
              </span>
            </div>
          </section>
        </aside>

        <main class="metro-main">
          <section v-if="hasArrayContent('workExperience')" class="metro-section">
            <h2>工作经历</h2>
            <article v-for="work in resumeData.workExperience" :key="work.id || work.company" class="metro-item">
              <div class="item-topline">
                <div>
                  <h3>{{ work.position || '职位' }}</h3>
                  <p>{{ [work.company, work.location].filter(Boolean).join(' / ') }}</p>
                </div>
                <span>{{ formatRange(work.startDate, work.endDate, work.current) }}</span>
              </div>
              <p v-if="work.description" class="item-description">{{ work.description }}</p>
              <ul v-if="work.achievements?.length" class="bullet-list">
                <li v-for="achievement in work.achievements" :key="achievement">{{ achievement }}</li>
              </ul>
            </article>
          </section>

          <section v-if="hasArrayContent('projects')" class="metro-section">
            <h2>项目经历</h2>
            <div class="project-tiles">
              <article v-for="project in resumeData.projects" :key="project.id || project.name" class="project-tile">
                <div class="item-topline">
                  <div>
                    <h3>{{ project.name || '项目名称' }}</h3>
                    <p v-if="project.role">{{ project.role }}</p>
                  </div>
                  <span>{{ formatRange(project.startDate, project.endDate) }}</span>
                </div>
                <p v-if="project.description" class="item-description">{{ project.description }}</p>
                <div v-if="project.technologies?.length" class="tag-list">
                  <span v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
                </div>
                <ul v-if="project.highlights?.length" class="bullet-list">
                  <li v-for="highlight in project.highlights" :key="highlight">{{ highlight }}</li>
                </ul>
              </article>
            </div>
          </section>

          <section v-if="hasArrayContent('education')" class="metro-section education-section">
            <h2>教育背景</h2>
            <article v-for="edu in resumeData.education" :key="edu.id || edu.school" class="education-row">
              <div>
                <h3>{{ edu.school || '学校' }}</h3>
                <p>{{ [edu.major, edu.degree, edu.studyType].filter(Boolean).join(' / ') }}</p>
                <small v-if="edu.gpa || edu.description || edu.honors">
                  {{ [edu.gpa ? `GPA: ${edu.gpa}` : '', edu.description || edu.honors].filter(Boolean).join(' / ') }}
                </small>
              </div>
              <span>{{ formatRange(edu.startDate, edu.endDate) }}</span>
            </article>
          </section>
        </main>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '@stores/resume'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'metro' },
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
    ? { primary: '#1f2937', accent: '#0f766e', border: '#cbd5e1' }
    : {}

  return {
    '--metro-primary': previewTheme.primary || theme.primary || '#1f2937',
    '--metro-accent': previewTheme.accent || theme.accent || '#0f766e',
    '--metro-text': theme.textPrimary || '#111827',
    '--metro-muted': theme.textSecondary || '#5b6472',
    '--metro-bg': theme.background || '#ffffff',
    '--metro-border': previewTheme.border || theme.border || '#d7dde6',
    '--metro-font': typography.fontFamily || '"Noto Sans SC", "Source Han Sans SC", "Source Han Sans CN", system-ui, sans-serif',
    '--metro-base-size': `${typography.baseFontSize || 14}px`,
    '--metro-line-height': spacing.lineHeight || 1.5,
    '--metro-padding': `${pageMargin.top ?? 24}px ${pageMargin.right ?? 24}px ${pageMargin.bottom ?? 24}px ${pageMargin.left ?? 24}px`
  }
})

const visibleCustomFields = computed(() => {
  return (personalInfo.value.customFields || []).filter(field => field?.name && field?.value)
})

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
.metro-resume-template {
  width: 210mm;
  min-height: 297mm;
  box-sizing: border-box;
  background: var(--metro-bg);
  color: var(--metro-text);
  font-family: var(--metro-font);
  font-size: var(--metro-base-size);
  line-height: var(--metro-line-height);
}

.metro-page {
  min-height: 297mm;
  display: flex;
  flex-direction: column;
}

.metro-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 84mm;
  gap: 20px;
  padding: 24px 28px;
  color: #fff;
  background: var(--metro-primary);
}

.metro-header h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1.05;
  font-weight: 850;
  letter-spacing: 0;
}

.metro-header p {
  margin: 9px 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 700;
}

.header-contact {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px 12px;
}

.header-contact li {
  min-width: 0;
}

.header-contact span {
  display: block;
  color: rgba(255, 255, 255, 0.62);
  font-size: 11px;
}

.header-contact strong {
  display: block;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.metro-body {
  flex: 1;
  display: grid;
  grid-template-columns: 66mm minmax(0, 1fr);
}

.metro-aside {
  padding: var(--metro-padding);
  padding-right: 18px;
  background: #f5f7f8;
  border-right: 1px solid var(--metro-border);
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.metro-main {
  padding: var(--metro-padding);
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.metro-block,
.metro-section,
.metro-item,
.project-tile,
.education-row {
  break-inside: avoid;
}

.metro-block h2,
.metro-section h2 {
  margin: 0 0 9px;
  color: var(--metro-primary);
  font-size: 16px;
  line-height: 1.2;
  font-weight: 850;
}

.metro-section h2 {
  padding-bottom: 6px;
  border-bottom: 2px solid var(--metro-accent);
}

.summary-block p,
.item-description {
  margin: 0;
  color: #222935;
}

.skill-stack,
.language-rows,
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-stack span,
.language-rows span,
.tag-list span {
  display: inline-flex;
  gap: 5px;
  padding: 3px 7px;
  border: 1px solid var(--metro-border);
  background: #fff;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
}

.skill-stack small {
  color: var(--metro-muted);
  font-weight: 600;
}

.plain-list {
  margin: 0;
  padding-left: 17px;
  display: grid;
  gap: 6px;
}

.compact-list {
  list-style: none;
  padding-left: 0;
}

.compact-list li {
  display: grid;
  gap: 2px;
}

.compact-list span,
.education-row small,
.item-topline span {
  color: var(--metro-muted);
  font-size: 12px;
  font-weight: 650;
}

.metro-section {
  display: grid;
  gap: 12px;
}

.metro-item,
.project-tile,
.education-row {
  padding-bottom: 11px;
  border-bottom: 1px solid rgba(17, 24, 39, 0.1);
}

.metro-item:last-child,
.education-row:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.item-topline,
.education-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
}

.item-topline h3,
.education-row h3 {
  margin: 0;
  color: #111827;
  font-size: 15px;
  line-height: 1.28;
  font-weight: 850;
}

.item-topline p,
.education-row p {
  margin: 3px 0 0;
  color: var(--metro-accent);
  font-size: 13px;
  font-weight: 750;
}

.item-description,
.bullet-list,
.tag-list {
  margin-top: 8px;
}

.bullet-list {
  padding-left: 17px;
}

.bullet-list li {
  margin-bottom: 3px;
}

.bullet-list li::marker {
  color: var(--metro-accent);
}

.project-tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.project-tile {
  padding: 11px;
  border: 1px solid var(--metro-border);
  background: #fff;
}

.render-thumbnail .metro-header {
  padding: 20px 22px;
  grid-template-columns: 1fr;
}

.render-thumbnail .header-contact {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.render-thumbnail .metro-aside,
.render-thumbnail .metro-main {
  padding: 18px;
}

.render-thumbnail .project-tiles {
  grid-template-columns: 1fr;
}

@media screen and (max-width: 900px) {
  .metro-resume-template {
    width: 100%;
    min-height: auto;
  }

  .metro-page,
  .metro-body {
    min-height: auto;
  }

  .metro-header,
  .metro-body {
    grid-template-columns: 1fr;
  }

  .metro-aside {
    border-right: 0;
    border-bottom: 1px solid var(--metro-border);
  }

  .project-tiles,
  .header-contact {
    grid-template-columns: 1fr;
  }
}
</style>
