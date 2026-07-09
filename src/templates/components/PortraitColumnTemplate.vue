<template>
  <article class="portrait-column-template" :class="templateClasses" :style="templateVars">
    <div class="portrait-page">
      <header class="portrait-header">
        <div v-if="hasAvatar" class="photo-panel" :class="avatarPositionClass">
          <img :src="personalInfo.photo" alt="头像" class="avatar-image" />
        </div>

        <div class="identity-panel">
          <span class="template-mark">Profile</span>
          <h1>{{ personalInfo.name || '姓名' }}</h1>
          <p v-if="personalInfo.targetPosition" class="target-position">{{ personalInfo.targetPosition }}</p>
          <div v-if="contactItems.length" class="contact-strip">
            <span v-for="item in contactItems" :key="item.label">
              {{ item.label }}: {{ item.value }}
            </span>
          </div>
        </div>
      </header>

      <div class="portrait-body">
        <aside class="portrait-side">
          <section v-if="isVisible('summary') && resumeData.summary" class="side-section summary-section">
            <h2>个人简介</h2>
            <p>{{ resumeData.summary }}</p>
          </section>

          <section v-if="hasArrayContent('skills')" class="side-section">
            <h2>技能特长</h2>
            <ul v-if="hasDetailedSkills" class="side-list">
              <li v-for="skill in resumeData.skills" :key="skill.id || skill.name">{{ getSkillText(skill) }}</li>
            </ul>
            <div v-else class="skill-list">
              <span v-for="skill in resumeData.skills" :key="skill.id || skill.name">
                {{ skill.name }}<small v-if="skill.level">{{ skill.level }}</small>
              </span>
            </div>
          </section>

          <section v-if="hasArrayContent('certifications')" class="side-section">
            <h2>证书荣誉</h2>
            <article v-for="cert in resumeData.certifications" :key="cert.id || cert.name" class="side-item">
              <h3>{{ cert.name }}</h3>
              <p>{{ [cert.issuer, cert.score].filter(Boolean).join(' / ') }}</p>
              <span>{{ cert.date }}</span>
            </article>
          </section>

          <section v-if="hasArrayContent('languages')" class="side-section">
            <h2>语言能力</h2>
            <div class="language-list">
              <span v-for="language in resumeData.languages" :key="language.id || language.name">
                {{ [language.name, language.level].filter(Boolean).join(' / ') }}
              </span>
            </div>
          </section>
        </aside>

        <main class="portrait-main">
          <section v-if="hasArrayContent('workExperience')" class="main-section">
            <h2>工作经历</h2>
            <article v-for="work in resumeData.workExperience" :key="work.id || work.company" class="main-item">
              <div class="item-heading">
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

          <section v-if="hasArrayContent('projects')" class="main-section">
            <h2>项目经历</h2>
            <article v-for="project in resumeData.projects" :key="project.id || project.name" class="main-item project-item">
              <div class="item-heading">
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
          </section>

          <section v-if="hasArrayContent('education')" class="main-section education-section">
            <h2>教育背景</h2>
            <article v-for="edu in resumeData.education" :key="edu.id || edu.school" class="education-item">
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
  templateId: { type: String, default: 'portrait-column' },
  renderMode: { type: String, default: 'preview' }
})

const resumeStore = useResumeStore()
const personalInfo = computed(() => props.resumeData.personalInfo || {})
const globalSettings = computed(() => resumeStore.globalSettings || {})
const hasAvatar = computed(() => Boolean(personalInfo.value.photo))

const templateClasses = computed(() => [
  `render-${props.renderMode}`,
  hasAvatar.value ? 'with-avatar' : 'without-avatar'
])

const templateVars = computed(() => {
  const theme = globalSettings.value.theme || {}
  const typography = globalSettings.value.typography || {}
  const spacing = globalSettings.value.spacing || {}
  const pageMargin = spacing.pageMargin || {}
  const previewTheme = props.renderMode === 'thumbnail'
    ? { primary: '#263238', accent: '#9a3412', border: '#d5d8dc' }
    : {}

  return {
    '--pc-primary': previewTheme.primary || theme.primary || '#263238',
    '--pc-accent': previewTheme.accent || theme.accent || '#9a3412',
    '--pc-text': theme.textPrimary || '#1f2933',
    '--pc-muted': theme.textSecondary || '#5f6b75',
    '--pc-bg': theme.background || '#ffffff',
    '--pc-border': previewTheme.border || theme.border || '#d5d8dc',
    '--pc-font': typography.fontFamily || '"Noto Sans SC", "Source Han Sans SC", "Source Han Sans CN", system-ui, sans-serif',
    '--pc-base-size': `${typography.baseFontSize || 14}px`,
    '--pc-line-height': spacing.lineHeight || 1.5,
    '--pc-padding': `${pageMargin.top ?? 24}px ${pageMargin.right ?? 24}px ${pageMargin.bottom ?? 24}px ${pageMargin.left ?? 24}px`
  }
})

const avatarPositionClass = computed(() => {
  const position = personalInfo.value.photoPosition
  return `avatar-${['left', 'center', 'right'].includes(position) ? position : 'center'}`
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
.portrait-column-template {
  width: 210mm;
  min-height: 297mm;
  box-sizing: border-box;
  background: var(--pc-bg);
  color: var(--pc-text);
  font-family: var(--pc-font);
  font-size: var(--pc-base-size);
  line-height: var(--pc-line-height);
}

.portrait-page {
  min-height: 297mm;
  display: flex;
  flex-direction: column;
}

.portrait-header {
  display: grid;
  grid-template-columns: 44mm minmax(0, 1fr);
  gap: 20px;
  padding: 24px 28px;
  background: #f4f5f3;
  border-bottom: 1px solid var(--pc-border);
}

.without-avatar .portrait-header {
  grid-template-columns: minmax(0, 1fr);
  padding: 26px 30px 22px;
}

.photo-panel {
  display: flex;
  align-items: center;
}

.avatar-left { justify-content: flex-start; }
.avatar-center { justify-content: center; }
.avatar-right { justify-content: flex-end; }

.avatar-image {
  width: 118px;
  height: 142px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--pc-primary);
  background: #fff;
}

.identity-panel {
  align-self: center;
}

.template-mark {
  display: inline-flex;
  margin-bottom: 8px;
  color: var(--pc-accent);
  font-size: 12px;
  font-weight: 850;
}

.identity-panel h1 {
  margin: 0;
  color: var(--pc-primary);
  font-size: 34px;
  line-height: 1.05;
  font-weight: 850;
  letter-spacing: 0;
  text-wrap: balance;
}

.without-avatar .identity-panel h1 {
  font-size: 38px;
}

.target-position {
  margin: 8px 0 0;
  color: var(--pc-muted);
  font-weight: 750;
}

.contact-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--pc-border);
}

.contact-strip span {
  color: var(--pc-muted);
  font-size: 12px;
  font-weight: 650;
  overflow-wrap: anywhere;
}

.portrait-body {
  flex: 1;
  display: grid;
  grid-template-columns: 62mm minmax(0, 1fr);
}

.portrait-side {
  padding: var(--pc-padding);
  padding-right: 18px;
  background: #fafafa;
  border-right: 1px solid var(--pc-border);
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.portrait-main {
  padding: var(--pc-padding);
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.side-section,
.main-section,
.main-item,
.side-item,
.education-item {
  break-inside: avoid;
}

.side-section h2,
.main-section h2 {
  margin: 0 0 9px;
  color: var(--pc-primary);
  font-size: 16px;
  line-height: 1.2;
  font-weight: 850;
}

.main-section h2 {
  padding-bottom: 6px;
  border-bottom: 2px solid var(--pc-accent);
}

.summary-section p,
.item-description {
  margin: 0;
  color: #26313a;
}

.skill-list,
.language-list,
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-list span,
.language-list span,
.tag-list span {
  display: inline-flex;
  gap: 5px;
  padding: 3px 7px;
  border: 1px solid var(--pc-border);
  background: #fff;
  color: var(--pc-text);
  font-size: 12px;
  font-weight: 750;
}

.skill-list small,
.side-item span,
.education-item span,
.education-item small,
.item-heading span {
  color: var(--pc-muted);
  font-size: 12px;
  font-weight: 650;
}

.side-list {
  margin: 0;
  padding-left: 17px;
  display: grid;
  gap: 6px;
}

.side-item + .side-item {
  margin-top: 10px;
}

.side-item h3,
.item-heading h3,
.education-item h3 {
  margin: 0;
  color: var(--pc-text);
  font-size: 15px;
  line-height: 1.3;
  font-weight: 850;
}

.side-item p,
.item-heading p,
.education-item p {
  margin: 3px 0 0;
  color: var(--pc-accent);
  font-size: 13px;
  font-weight: 750;
}

.main-section {
  display: grid;
  gap: 12px;
}

.main-item,
.education-item {
  padding-bottom: 11px;
  border-bottom: 1px solid rgba(38, 50, 56, 0.12);
}

.main-item:last-child,
.education-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.item-heading,
.education-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
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
  color: var(--pc-accent);
}

.render-thumbnail .portrait-header {
  padding: 20px 22px;
  grid-template-columns: 40mm minmax(0, 1fr);
}

.render-thumbnail.without-avatar .portrait-header {
  grid-template-columns: 1fr;
}

.render-thumbnail .portrait-side,
.render-thumbnail .portrait-main {
  padding: 18px;
}

.render-thumbnail .avatar-image {
  width: 98px;
  height: 118px;
}

@media screen and (max-width: 900px) {
  .portrait-column-template {
    width: 100%;
    min-height: auto;
  }

  .portrait-page,
  .portrait-body {
    min-height: auto;
  }

  .portrait-header,
  .portrait-body {
    grid-template-columns: 1fr;
  }

  .portrait-side {
    border-right: 0;
    border-bottom: 1px solid var(--pc-border);
  }

  .item-heading,
  .education-item {
    flex-direction: column;
  }
}
</style>
