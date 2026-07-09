<template>
  <article class="timeline-resume-template" :class="templateClasses" :style="templateVars">
    <div class="timeline-page">
      <aside class="profile-rail">
        <section class="identity-panel">
          <div v-if="personalInfo.photo" class="avatar-frame" :class="avatarPositionClass">
            <img :src="personalInfo.photo" alt="头像" class="avatar-image" />
          </div>

          <h1 class="person-name">{{ personalInfo.name || '姓名' }}</h1>
          <p v-if="personalInfo.targetPosition" class="target-position">
            {{ personalInfo.targetPosition }}
          </p>
        </section>

        <section v-if="contactItems.length" class="rail-section contact-section">
          <h2 class="rail-title">联系信息</h2>
          <ul class="contact-list">
            <li v-for="item in contactItems" :key="item.label">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </li>
          </ul>
        </section>

        <section v-if="hasArrayContent('skills')" class="rail-section">
          <h2 class="rail-title">技能特长</h2>
          <ul v-if="hasDetailedSkills" class="rail-list skill-detail-list">
            <li v-for="skill in resumeData.skills" :key="skill.id || skill.name">
              {{ getSkillText(skill) }}
            </li>
          </ul>
          <div v-else class="skill-grid">
            <span v-for="skill in resumeData.skills" :key="skill.id || skill.name" class="skill-pill">
              {{ skill.name }}<small v-if="skill.level">{{ skill.level }}</small>
            </span>
          </div>
        </section>

        <section v-if="hasArrayContent('languages')" class="rail-section">
          <h2 class="rail-title">语言能力</h2>
          <div class="language-list">
            <div v-for="language in resumeData.languages" :key="language.id || language.name" class="language-item">
              <span>{{ language.name }}</span>
              <strong v-if="language.level">{{ language.level }}</strong>
            </div>
          </div>
        </section>

        <section v-if="hasArrayContent('certifications')" class="rail-section">
          <h2 class="rail-title">证书荣誉</h2>
          <ul class="rail-list">
            <li v-for="cert in resumeData.certifications" :key="cert.id || cert.name">
              <strong>{{ cert.name }}</strong>
              <span>{{ [cert.issuer, cert.date].filter(Boolean).join(' / ') }}</span>
            </li>
          </ul>
        </section>
      </aside>

      <main class="story-column">
        <section v-if="isVisible('summary') && resumeData.summary" class="summary-card">
          <div class="section-heading compact-heading">
            <span>Profile</span>
            <h2>个人简介</h2>
          </div>
          <p>{{ resumeData.summary }}</p>
        </section>

        <section v-if="hasArrayContent('workExperience')" class="story-section">
          <div class="section-heading">
            <span>Experience</span>
            <h2>工作经历</h2>
          </div>
          <div class="timeline-list">
            <article v-for="work in resumeData.workExperience" :key="work.id || work.company" class="timeline-item">
              <div class="timeline-date">{{ formatRange(work.startDate, work.endDate, work.current) }}</div>
              <div class="timeline-body">
                <div class="item-heading">
                  <div>
                    <h3>{{ work.position || '职位' }}</h3>
                    <p>{{ [work.company, work.location].filter(Boolean).join(' / ') }}</p>
                  </div>
                </div>
                <p v-if="work.description" class="item-description">{{ work.description }}</p>
                <ul v-if="work.achievements?.length" class="bullet-list">
                  <li v-for="achievement in work.achievements" :key="achievement">{{ achievement }}</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section v-if="hasArrayContent('projects')" class="story-section">
          <div class="section-heading">
            <span>Projects</span>
            <h2>项目经历</h2>
          </div>
          <div class="project-grid">
            <article v-for="project in resumeData.projects" :key="project.id || project.name" class="project-block">
              <div class="project-topline">
                <h3>{{ project.name || '项目名称' }}</h3>
                <span>{{ formatRange(project.startDate, project.endDate) }}</span>
              </div>
              <p v-if="project.role" class="project-role">{{ project.role }}</p>
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

        <section v-if="hasArrayContent('education')" class="story-section education-section">
          <div class="section-heading">
            <span>Education</span>
            <h2>教育背景</h2>
          </div>
          <div class="education-list">
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
          </div>
        </section>
      </main>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '@stores/resume'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'timeline' },
  renderMode: { type: String, default: 'preview' }
})

const resumeStore = useResumeStore()

const personalInfo = computed(() => props.resumeData.personalInfo || {})
const globalSettings = computed(() => resumeStore.globalSettings || {})

const templateClasses = computed(() => [
  `render-${props.renderMode}`,
  personalInfo.value.photo ? 'has-avatar' : 'no-avatar'
])

const templateVars = computed(() => {
  const theme = globalSettings.value.theme || {}
  const typography = globalSettings.value.typography || {}
  const spacing = globalSettings.value.spacing || {}
  const pageMargin = spacing.pageMargin || {}
  const previewTheme = props.renderMode === 'thumbnail'
    ? { primary: '#8b1e3f', secondary: '#475569', accent: '#8b1e3f', border: '#d6d0c8' }
    : {}

  return {
    '--tl-primary': previewTheme.primary || theme.primary || '#8b1e3f',
    '--tl-secondary': previewTheme.secondary || theme.secondary || '#475569',
    '--tl-accent': previewTheme.accent || theme.accent || '#8b1e3f',
    '--tl-text': theme.textPrimary || '#171717',
    '--tl-muted': theme.textSecondary || '#525252',
    '--tl-bg': theme.background || '#ffffff',
    '--tl-border': previewTheme.border || theme.border || '#d6d0c8',
    '--tl-font': typography.fontFamily || '"Noto Sans SC", "Source Han Sans SC", "Source Han Sans CN", system-ui, sans-serif',
    '--tl-base-size': `${typography.baseFontSize || 14}px`,
    '--tl-line-height': spacing.lineHeight || 1.52,
    '--tl-padding': `${pageMargin.top ?? 24}px ${pageMargin.right ?? 24}px ${pageMargin.bottom ?? 24}px ${pageMargin.left ?? 24}px`
  }
})

const avatarPositionClass = computed(() => {
  const position = personalInfo.value.photoPosition
  return `avatar-${['left', 'center', 'right'].includes(position) ? position : 'center'}`
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

const isVisible = (sectionKey) => {
  return resumeStore.sectionConfig?.[sectionKey]?.visible !== false
}

const hasArrayContent = (sectionKey) => {
  return isVisible(sectionKey) && Array.isArray(props.resumeData[sectionKey]) && props.resumeData[sectionKey].length > 0
}

const getSkillText = (skill) => {
  return (skill.description || skill.name || '').trim()
}

const hasDetailedSkills = computed(() => {
  return (props.resumeData.skills || []).some(skill => {
    const text = getSkillText(skill)
    return Boolean(skill.description) || text.length > 28
  })
})

const formatRange = (start, end, current = false) => {
  if (!start && !end && !current) return ''
  const right = current ? '至今' : (end || '')
  return [start, right].filter(Boolean).join(' - ')
}
</script>

<style scoped>
.timeline-resume-template {
  width: 210mm;
  min-height: 297mm;
  box-sizing: border-box;
  background: var(--tl-bg);
  color: var(--tl-text);
  font-family: var(--tl-font);
  font-size: var(--tl-base-size);
  line-height: var(--tl-line-height);
}

.timeline-page {
  min-height: 297mm;
  display: grid;
  grid-template-columns: 68mm minmax(0, 1fr);
  background:
    linear-gradient(90deg, rgba(23, 23, 23, 0.035) 0 1px, transparent 1px) 0 0 / 16mm 16mm,
    var(--tl-bg);
}

.profile-rail {
  padding: var(--tl-padding);
  padding-right: 18px;
  background: #f4f1ec;
  border-right: 1px solid var(--tl-border);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.story-column {
  padding: var(--tl-padding);
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.identity-panel {
  padding-bottom: 18px;
  border-bottom: 2px solid var(--tl-primary);
}

.avatar-frame {
  display: flex;
  margin-bottom: 14px;
}

.avatar-left { justify-content: flex-start; }
.avatar-center { justify-content: center; }
.avatar-right { justify-content: flex-end; }

.avatar-image {
  width: 86px;
  height: 86px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--tl-primary);
  padding: 3px;
  background: #fff;
}

.person-name {
  margin: 0;
  color: #171717;
  font-size: 32px;
  line-height: 1.06;
  font-weight: 850;
  letter-spacing: 0;
  text-wrap: balance;
}

.target-position {
  display: inline-flex;
  margin: 10px 0 0;
  padding: 4px 8px;
  color: #fff;
  background: var(--tl-primary);
  font-size: 13px;
  font-weight: 700;
}

.rail-section {
  break-inside: avoid;
}

.rail-title {
  margin: 0 0 9px;
  color: var(--tl-primary);
  font-size: 15px;
  line-height: 1.2;
  font-weight: 800;
}

.contact-list,
.rail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-list li {
  display: grid;
  gap: 2px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(139, 30, 63, 0.18);
}

.contact-list span,
.rail-list span,
.language-item strong,
.skill-pill small {
  color: var(--tl-muted);
  font-size: 12px;
  font-weight: 500;
}

.contact-list strong,
.rail-list strong {
  color: #171717;
  font-size: 13px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.skill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-pill {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  padding: 4px 7px;
  border: 1px solid rgba(139, 30, 63, 0.22);
  background: rgba(255, 255, 255, 0.64);
  color: #171717;
  font-size: 12px;
  font-weight: 700;
}

.skill-detail-list li {
  color: #171717;
  font-size: 13px;
}

.language-list {
  display: grid;
  gap: 7px;
}

.language-item {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 7px;
  border-bottom: 1px solid rgba(139, 30, 63, 0.16);
}

.language-item span {
  color: #171717;
  font-weight: 700;
}

.section-heading {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: 14px;
  align-items: baseline;
  margin-bottom: 10px;
}

.section-heading span {
  color: var(--tl-primary);
  font-size: 12px;
  font-weight: 800;
}

.section-heading h2 {
  margin: 0;
  color: #171717;
  font-size: 19px;
  line-height: 1.2;
  font-weight: 850;
}

.summary-card {
  padding: 14px 16px;
  border: 1px solid var(--tl-border);
  background: rgba(255, 255, 255, 0.78);
  break-inside: avoid;
}

.summary-card p {
  margin: 0;
  color: #252525;
  text-wrap: pretty;
}

.compact-heading {
  margin-bottom: 7px;
}

.story-section {
  break-inside: avoid;
}

.timeline-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: 14px;
  break-inside: avoid;
}

.timeline-date {
  color: var(--tl-muted);
  font-size: 12px;
  font-weight: 700;
  padding-top: 3px;
}

.timeline-body {
  position: relative;
  padding-left: 16px;
  padding-bottom: 14px;
  border-left: 1px solid var(--tl-border);
  border-bottom: 1px solid rgba(23, 23, 23, 0.08);
}

.timeline-body::before {
  content: '';
  position: absolute;
  top: 4px;
  left: -5px;
  width: 9px;
  height: 9px;
  box-sizing: border-box;
  border: 2px solid var(--tl-primary);
  background: #fff;
}

.timeline-item:last-child .timeline-body {
  padding-bottom: 0;
  border-bottom: 0;
}

.item-heading h3,
.project-topline h3,
.education-item h3 {
  margin: 0;
  color: #171717;
  font-size: 15px;
  line-height: 1.28;
  font-weight: 850;
}

.item-heading p,
.project-role,
.education-item p {
  margin: 3px 0 0;
  color: var(--tl-primary);
  font-size: 13px;
  font-weight: 700;
}

.item-description {
  margin: 8px 0 0;
  color: #252525;
}

.bullet-list {
  margin: 8px 0 0;
  padding-left: 17px;
}

.bullet-list li {
  margin-bottom: 3px;
  color: #252525;
}

.bullet-list li::marker {
  color: var(--tl-primary);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
}

.project-block {
  padding: 12px;
  border: 1px solid var(--tl-border);
  background: rgba(255, 255, 255, 0.74);
  break-inside: avoid;
}

.project-topline {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.project-topline span,
.education-item > span,
.education-item small {
  color: var(--tl-muted);
  font-size: 12px;
  font-weight: 650;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 9px;
}

.tag-list span {
  padding: 2px 6px;
  border: 1px solid rgba(139, 30, 63, 0.22);
  color: var(--tl-primary);
  background: rgba(139, 30, 63, 0.05);
  font-size: 12px;
  font-weight: 700;
}

.education-list {
  display: grid;
  gap: 10px;
}

.education-item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(23, 23, 23, 0.1);
  break-inside: avoid;
}

.education-item:last-child {
  border-bottom: 0;
}

.education-item small {
  display: block;
  margin-top: 3px;
}

.render-thumbnail .timeline-page {
  grid-template-columns: 66mm minmax(0, 1fr);
}

.render-thumbnail .profile-rail {
  padding: 20px 16px;
}

.render-thumbnail .story-column {
  padding: 20px 18px;
  gap: 14px;
}

.render-thumbnail .person-name {
  font-size: 28px;
}

.render-thumbnail .project-grid {
  grid-template-columns: 1fr;
}

@media screen and (max-width: 900px) {
  .timeline-resume-template {
    width: 100%;
    min-height: auto;
  }

  .timeline-page {
    min-height: auto;
    grid-template-columns: 1fr;
  }

  .profile-rail {
    border-right: 0;
    border-bottom: 1px solid var(--tl-border);
  }

  .story-column {
    padding-left: 24px;
  }

  .timeline-item,
  .section-heading {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .timeline-date {
    padding-top: 0;
  }

  .education-item,
  .project-topline {
    flex-direction: column;
  }
}
</style>
