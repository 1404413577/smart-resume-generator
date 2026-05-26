<template>
  <div class="multi-page-template" :style="templateStyles">
    <!-- 多页容器 -->
    <div class="pages-container">
      <div
        v-for="page in pages"
        :key="page.pageNumber"
        class="page"
        :class="{ 'first-page': page.pageNumber === 1 }"
      >
        <!-- 页眉 -->
        <div v-if="showPageHeader && page.pageNumber > 1" class="page-header">
          <div class="header-name">{{ resumeData.personalInfo?.name || '姓名' }}</div>
          <div class="header-title">{{ resumeData.personalInfo?.targetPosition || '职位' }}</div>
        </div>

        <!-- 页面内容 -->
        <div class="page-content">
          <!-- 渲染该页的章节 -->
          <template v-for="section in page.sections" :key="section.key">
            <!-- 个人信息 -->
            <section v-if="section.key === 'personalInfo'" class="section personal-info-section">
              <div class="personal-header">
                <div class="personal-main">
                  <h1 class="name">{{ resumeData.personalInfo?.name || '姓名' }}</h1>
                  <h2 class="title">{{ resumeData.personalInfo?.targetPosition || '职位' }}</h2>
                </div>
                <div v-if="resumeData.personalInfo?.photo" class="personal-photo">
                  <img :src="resumeData.personalInfo.photo" alt="头像" />
                </div>
              </div>
              <div class="contact-info">
                <div v-if="resumeData.personalInfo?.email" class="contact-item">
                  <span class="contact-icon">📧</span>
                  <span>{{ resumeData.personalInfo.email }}</span>
                </div>
                <div v-if="resumeData.personalInfo?.phone" class="contact-item">
                  <span class="contact-icon">📱</span>
                  <span>{{ resumeData.personalInfo.phone }}</span>
                </div>
                <div v-if="resumeData.personalInfo?.address" class="contact-item">
                  <span class="contact-icon">📍</span>
                  <span>{{ resumeData.personalInfo.address }}</span>
                </div>
              </div>
            </section>

            <!-- 个人简介 -->
            <section v-else-if="section.key === 'summary'" class="section summary-section">
              <h3 class="section-title">个人简介</h3>
              <p class="summary-text">{{ resumeData.summary }}</p>
            </section>

            <!-- 工作经历 -->
            <section v-else-if="section.key === 'workExperience'" class="section work-section">
              <h3 class="section-title">工作经历</h3>
              <div
                v-for="work in resumeData.workExperience"
                :key="work.id"
                class="work-item"
              >
                <div class="work-header">
                  <div class="work-main">
                    <h4 class="work-position">{{ work.position }}</h4>
                    <h5 class="work-company">{{ work.company }}</h5>
                  </div>
                  <div class="work-meta">
                    <span class="work-date">{{ work.startDate }} - {{ work.endDate }}</span>
                    <span v-if="work.location" class="work-location">{{ work.location }}</span>
                  </div>
                </div>
                <div v-if="work.description" class="work-description">
                  <p>{{ work.description }}</p>
                </div>
                <ul v-if="work.achievements?.length" class="work-achievements">
                  <li v-for="achievement in work.achievements" :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </section>

            <!-- 项目经历 -->
            <section v-else-if="section.key === 'projects'" class="section projects-section">
              <h3 class="section-title">项目经历</h3>
              <div
                v-for="project in resumeData.projects"
                :key="project.id"
                class="project-item"
              >
                <div class="project-header">
                  <h4 class="project-name">{{ project.name }}</h4>
                  <span class="project-date">{{ project.startDate }} - {{ project.endDate }}</span>
                </div>
                <p class="project-description">{{ project.description }}</p>
                <div v-if="project.technologies?.length" class="project-tech">
                  <span class="tech-label">技术栈：</span>
                  <span class="tech-list">{{ project.technologies.join(', ') }}</span>
                </div>
                <ul v-if="project.highlights?.length" class="project-highlights">
                  <li v-for="highlight in project.highlights" :key="highlight">
                    {{ highlight }}
                  </li>
                </ul>
              </div>
            </section>

            <!-- 教育背景 -->
            <section v-else-if="section.key === 'education'" class="section education-section">
              <h3 class="section-title">教育背景</h3>
              <div
                v-for="edu in resumeData.education"
                :key="edu.id"
                class="education-item"
              >
                <div class="education-header">
                  <div class="education-main">
                    <h4 class="education-degree">{{ edu.degree }} - {{ edu.major }}</h4>
                    <h5 class="education-school">{{ edu.school }}</h5>
                  </div>
                  <div class="education-meta">
                    <span class="education-date">{{ edu.endDate }}</span>
                    <span v-if="edu.gpa" class="education-gpa">GPA: {{ edu.gpa }}</span>
                  </div>
                </div>
                <div v-if="edu.honors" class="education-honors">
                  <p>{{ edu.honors }}</p>
                </div>
              </div>
            </section>

            <!-- 技能特长 -->
            <section v-else-if="section.key === 'skills'" class="section skills-section">
              <h3 class="section-title">技能特长</h3>
              <div class="skills-grid">
                <div
                  v-for="skill in resumeData.skills"
                  :key="skill.id"
                  class="skill-item"
                >
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-level">{{ skill.level }}</span>
                </div>
              </div>
            </section>

            <!-- 证书认证 -->
            <section v-else-if="section.key === 'certifications'" class="section certifications-section">
              <h3 class="section-title">证书认证</h3>
              <div
                v-for="cert in resumeData.certifications"
                :key="cert.id"
                class="certification-item"
              >
                <div class="cert-main">
                  <span class="cert-name">{{ cert.name }}</span>
                  <span class="cert-issuer">{{ cert.issuer }}</span>
                </div>
                <span class="cert-date">{{ cert.date }}</span>
              </div>
            </section>

            <!-- 语言能力 -->
            <section v-else-if="section.key === 'languages'" class="section languages-section">
              <h3 class="section-title">语言能力</h3>
              <div class="languages-grid">
                <div
                  v-for="lang in resumeData.languages"
                  :key="lang.id"
                  class="language-item"
                >
                  <span class="language-name">{{ lang.name }}</span>
                  <span class="language-level">{{ lang.level }}</span>
                </div>
              </div>
            </section>
          </template>
        </div>

        <!-- 页脚 -->
        <div v-if="showPageNumbers" class="page-footer">
          <div class="page-number">{{ page.pageNumber }} / {{ totalPages }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'
import { createMultiPageManager } from '@/utils/multipage/pageManager'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateId: {
    type: String,
    default: 'multipage'
  },
  pageSettings: {
    type: Object,
    default: () => ({
      pageCount: 2,
      pagingMode: 'auto',
      showPageNumbers: true,
      pageBreaks: []
    })
  }
})

// 使用模板样式
const { templateStyles } = useTemplateComponentStyles(props.templateId)

// 创建多页管理器
const pageManager = computed(() => {
  return createMultiPageManager(props.resumeData, props.pageSettings)
})

// 生成页面
const pages = computed(() => {
  return pageManager.value.generatePages()
})

const totalPages = computed(() => {
  return pageManager.value.totalPages.value
})

const showPageNumbers = computed(() => {
  return props.pageSettings.showPageNumbers && totalPages.value > 1
})

const showPageHeader = computed(() => {
  return totalPages.value > 1
})
</script>

<style scoped>
.multi-page-template {
  width: 100%;
  font-family: var(--font-family, 'system-ui');
  color: var(--theme-text-primary, #303133);
  line-height: var(--line-height, 1.5);
}

.pages-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page {
  width: 210mm;
  min-height: 297mm;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  position: relative;
  padding: var(--spacing-page-margin-top, 20px)
           var(--spacing-page-margin-right, 20px)
           var(--spacing-page-margin-bottom, 20px)
           var(--spacing-page-margin-left, 20px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--theme-border, #e5e7eb);
  margin-bottom: 20px;
}

.header-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-primary, #409eff);
}

.header-title {
  font-size: var(--font-size-base, 14px);
  color: var(--theme-text-secondary, #606266);
}

.page-content {
  flex: 1;
}

.page-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--theme-border, #e5e7eb);
  margin-top: auto;
}

.page-number {
  font-size: var(--font-size-base, 12px);
  color: var(--theme-text-secondary, #606266);
}

/* 章节样式 */
.section {
  margin-bottom: var(--spacing-module, 24px);
  break-inside: avoid;
}

.section-title {
  font-size: var(--font-size-title, 18px);
  font-weight: 600;
  color: var(--theme-primary, #409eff);
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--theme-primary, #409eff);
}

/* 个人信息样式 */
.personal-info-section {
  margin-bottom: 32px;
}

.personal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.personal-main {
  flex: 1;
}

.name {
  font-size: 28px;
  font-weight: 700;
  color: var(--theme-text-primary, #303133);
  margin: 0 0 8px 0;
}

.title {
  font-size: var(--font-size-subtitle, 18px);
  font-weight: 500;
  color: var(--theme-primary, #409eff);
  margin: 0;
}

.personal-photo {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--theme-border, #e5e7eb);
}

.personal-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-base, 14px);
  color: var(--theme-text-secondary, #606266);
}

.contact-icon {
  font-size: var(--font-size-title, 16px);
}

/* 工作经历样式 */
.work-item {
  margin-bottom: 24px;
  break-inside: avoid;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.work-position {
  font-size: var(--font-size-title, 16px);
  font-weight: 600;
  color: var(--theme-text-primary, #303133);
  margin: 0 0 4px 0;
}

.work-company {
  font-size: var(--font-size-base, 14px);
  font-weight: 500;
  color: var(--theme-primary, #409eff);
  margin: 0;
}

.work-meta {
  text-align: right;
  font-size: var(--font-size-base, 12px);
  color: var(--theme-text-secondary, #606266);
}

.work-date {
  display: block;
  margin-bottom: 2px;
}

.work-description {
  margin-bottom: 12px;
  font-size: var(--font-size-base, 14px);
  color: var(--theme-text-secondary, #606266);
}

.work-achievements {
  list-style: none;
  padding: 0;
  margin: 0;
}

.work-achievements li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 6px;
  font-size: var(--font-size-base, 14px);
  color: var(--theme-text-secondary, #606266);
}

.work-achievements li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--theme-primary, #409eff);
  font-weight: bold;
}

/* 项目经历样式 */
.project-item {
  margin-bottom: 20px;
  break-inside: avoid;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.project-name {
  font-size: var(--font-size-subtitle, 15px);
  font-weight: 600;
  color: var(--theme-text-primary, #303133);
  margin: 0;
}

.project-date {
  font-size: var(--font-size-base, 12px);
  color: var(--theme-text-secondary, #606266);
}

.project-description {
  font-size: var(--font-size-base, 14px);
  color: var(--theme-text-secondary, #606266);
  margin: 0 0 8px 0;
}

.project-tech {
  margin-bottom: 8px;
  font-size: var(--font-size-base, 13px);
}

.tech-label {
  font-weight: 500;
  color: var(--theme-text-primary, #303133);
}

.tech-list {
  color: var(--theme-primary, #409eff);
}

/* 技能样式 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--theme-background-secondary, #f8f9fa);
  border-radius: 6px;
  font-size: var(--font-size-base, 13px);
}

.skill-name {
  font-weight: 500;
  color: var(--theme-text-primary, #303133);
}

.skill-level {
  color: var(--theme-primary, #409eff);
  font-size: var(--font-size-base, 12px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page {
    width: 100%;
    min-height: auto;
    margin: 0;
    box-shadow: none;
  }

  .personal-header {
    flex-direction: column;
    gap: 16px;
  }

  .work-header {
    flex-direction: column;
    gap: 8px;
  }

  .work-meta {
    text-align: left;
  }
}

/* 打印样式 */
@media print {
  .pages-container {
    gap: 0;
  }

  .page {
    box-shadow: none;
    margin: 0;
    page-break-after: always;
  }

  .page:last-child {
    page-break-after: auto;
  }
}
</style>
