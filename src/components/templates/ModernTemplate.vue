<template>
  <PagedTemplateBase
    :resume-data="props.resumeData"
    :page-content="props.pageContent"
    :page-number="props.pageNumber"
    :is-single-page="props.isSinglePage"
    template-class="modern-template"
  >
    <!-- 个人信息插槽 -->
    <template #personalInfo="{ data }">
      <header class="resume-header">
        <div class="header-content">
          <div class="personal-info">
            <h1 class="name">{{ data.name || '姓名' }}</h1>
            <h2 v-if="data.targetPosition" class="target-position">{{ data.targetPosition }}</h2>
            <div class="contact-info">
              <div class="contact-item" v-if="data.email">
                <el-icon><Message /></el-icon>
                <span>{{ data.email }}</span>
              </div>
              <div class="contact-item" v-if="data.phone">
                <el-icon><Phone /></el-icon>
                <span>{{ data.phone }}</span>
              </div>
              <div class="contact-item" v-if="data.address">
                <el-icon><Location /></el-icon>
                <span>{{ data.address }}</span>
              </div>
              <div class="contact-item" v-if="data.github">
                <el-icon><Link /></el-icon>
                <span>{{ data.github }}</span>
              </div>
            </div>
            <div class="links" v-if="hasLinks(data)">
              <div v-if="data.website" class="link">
                <el-icon><Link /></el-icon>
                <span class="link-label">个人网站:</span>
                <span class="link-url">{{ data.website }}</span>
              </div>
              <div v-if="data.linkedin" class="link">
                <el-icon><Link /></el-icon>
                <span class="link-label">LinkedIn:</span>
                <span class="link-url">{{ data.linkedin }}</span>
              </div>
              <div v-if="data.github" class="link">
                <el-icon><Link /></el-icon>
                <span class="link-label">GitHub:</span>
                <span class="link-url">{{ data.github }}</span>
              </div>
              <!-- 自定义字段链接 -->
              <div
                v-for="field in data.customFields"
                :key="field.id"
                class="link custom-field-link"
              >
                <el-icon><Link /></el-icon>
                <span class="link-label">{{ field.name }}:</span>
                <span class="link-url">{{ field.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </template>

    <!-- 个人简介插槽 -->
    <template #summary="{ data }">
      <h2 class="section-title">个人简介</h2>
      <div class="section-content">
        <p class="summary-text">{{ data }}</p>
      </div>
    </template>

    <!-- 工作经历插槽 -->
    <template #workExperience="{ data, isFirst }">
      <h2 v-if="isFirst" class="section-title">工作经历</h2>
      <div class="section-content">
        <div class="work-item">
          <div class="work-header">
            <div class="work-title">
              <h3>{{ data.position }}</h3>
              <h4>{{ data.company }}</h4>
            </div>
            <div class="work-meta">
              <span class="work-period">
                {{ data.startDate }} - {{ data.current ? '至今' : data.endDate }}
              </span>
              <span v-if="data.location" class="work-location">{{ data.location }}</span>
            </div>
          </div>
          <div v-if="data.description" class="work-description">
            <p>{{ data.description }}</p>
          </div>
          <ul class="work-achievements" v-if="data.achievements?.length">
            <li v-for="(achievement, index) in data.achievements" :key="index">
              {{ achievement }}
            </li>
          </ul>
        </div>
      </div>
    </template>

    <!-- 教育背景插槽 -->
    <template #education="{ data, isFirst }">
      <h2 v-if="isFirst" class="section-title">教育背景</h2>
      <div class="section-content">
        <div class="education-item">
          <div class="education-header">
            <div class="education-title">
              <h3>{{ data.degree }} - {{ data.major }}</h3>
              <h4>{{ data.school }}</h4>
            </div>
            <div class="education-meta">
              <span class="education-period">{{ data.endDate }}</span>
            </div>
          </div>
          <div class="education-details">
            <span v-if="data.gpa" class="gpa">GPA: {{ data.gpa }}</span>
            <span v-if="data.honors" class="honors">{{ data.honors }}</span>
            <div v-if="data.description" class="course-description">
              <span class="description-label">课程描述：</span>
              <span class="courses-content">{{ data.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 技能特长插槽 -->
    <template #skills="{ data }">
      <h2 class="section-title">技能特长</h2>
      <div class="section-content">
        <div v-for="category in getSkillCategories(data)" :key="category.key" class="skill-category">
          <h3 class="skill-category-title">{{ category.name }}</h3>
          <div class="skills-list">
            <span
              v-for="skill in category.skills"
              :key="skill.id"
              class="skill-item"
              :class="`skill-${skill.level}`"
            >
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- 项目经历插槽 -->
    <template #projects="{ data, isFirst }">
      <h2 v-if="isFirst" class="section-title">项目经历</h2>
      <div class="section-content">
        <div class="project-item">
          <div class="project-header">
            <div class="project-title">
              <h3>{{ data.name }}</h3>
              <a v-if="data.url" :href="data.url" target="_blank" class="project-link">
                <el-icon><Link /></el-icon>
                查看项目
              </a>
            </div>
            <div class="project-meta">
              <span class="project-period">{{ data.startDate }} - {{ data.endDate }}</span>
            </div>
          </div>
          <p class="project-description">{{ data.description }}</p>
          <div v-if="data.technologies && data.technologies.length > 0" class="project-technologies">
            <span class="tech-label">技术栈：</span>
            <span
              v-for="(tech, index) in data.technologies"
              :key="index"
              class="tech-item"
            >
              {{ tech }}{{ index < data.technologies.length - 1 ? '、' : '' }}
            </span>
          </div>
        </div>
      </div>
    </template>

  </PagedTemplateBase>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '../../stores/resume'
import PagedTemplateBase from './PagedTemplateBase.vue'

// 图标导入
import { Message, Phone, Location, Link } from '@element-plus/icons-vue'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  pageContent: {
    type: Array,
    default: () => []
  },
  pageNumber: {
    type: Number,
    default: 1
  },
  isSinglePage: {
    type: Boolean,
    default: true
  }
})

const resumeStore = useResumeStore()

// 技能分类
const skillCategories = [
  { key: 'technical', name: '技术技能' },
  { key: 'soft', name: '软技能' },
  { key: 'language', name: '语言技能' }
]

// 计算属性
const hasLinks = (personalInfo) => {
  return personalInfo.website ||
         personalInfo.linkedin ||
         personalInfo.github ||
         (personalInfo.customFields && personalInfo.customFields.length > 0)
}

const getSkillCategories = (skills) => {
  return skillCategories.map(category => ({
    ...category,
    skills: skills.filter(skill => skill.category === category.key)
  })).filter(category => category.skills.length > 0)
}


</script>

<style scoped>
.modern-template {
  width: 210mm;
  margin: 0 auto;
  background: #ffffff;
  color: #1a202c;
  font-family: var(--resume-font-family, 'Times New Roman', Times, serif);
  line-height: var(--resume-line-height, 1.4);
  font-size: var(--resume-base-font-size, 11px);
  padding: var(--resume-page-margin-top, 10mm) var(--resume-page-margin-right, 10mm) var(--resume-page-margin-bottom, 10mm) var(--resume-page-margin-left, 10mm);
  min-height: calc(297mm - 20mm);
  position: relative;
  page-break-after: auto;
  box-sizing: border-box;
}

.modern-template.multi-page {
  min-height: auto;
}

/* 分页控制 */
.page-break {
  page-break-before: always;
  margin-top: 0;
  padding-top: 0;
}

.avoid-break {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* 头部样式 - 简洁专业设计 */
.resume-header {
  background: #2563eb;
  color: white;
  padding: 15mm 0 10mm 0;
  margin: -10mm -10mm 8mm -10mm;
  position: relative;
  page-break-inside: avoid;
}

.header-content {
  max-width: 100%;
  padding: 0 10mm;
}

.name {
  font-size: var(--resume-name-font-size, 28px);
  font-weight: 700;
  margin: 0 0 4mm 0;
  letter-spacing: 0.5px;
  color: white;
}

.target-position {
  font-size: var(--resume-target-position-font-size, 16px);
  font-weight: 400;
  margin: 0 0 8mm 0;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 8mm;
  font-size: var(--resume-contact-font-size, 10px);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: white;
}

.contact-item .el-icon {
  font-size: var(--resume-contact-font-size, 12px);
}

.links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: var(--resume-link-font-size, 9px);
}

.link {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  color: white;
  text-decoration: none;
  padding: 3px 0;
  cursor: default;
  flex-wrap: wrap;
  max-width: 100%;
  font-weight: 400;
  line-height: 1.3;
}

.link-label {
  font-weight: 600;
  white-space: nowrap;
  min-width: fit-content;
  font-size: var(--resume-link-font-size, 9px);
}

.link-url {
  font-weight: 400;
  word-break: break-all;
  font-family: 'Courier New', monospace;
  opacity: 0.95;
  flex: 1;
  font-size: var(--resume-small-font-size, 8px);
}

.custom-field-link {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  text-decoration: none;
  color: white;
  padding: 3px 0;
  cursor: default;
  flex-wrap: wrap;
  max-width: 100%;
  font-weight: 400;
  line-height: 1.3;
}

/* 章节样式 - 紧凑专业设计 */
.section {
  margin-bottom: var(--resume-module-spacing, 6mm);
  padding: 0;
  position: relative;
  page-break-inside: avoid;
}

.section-title {
  font-size: var(--resume-title-font-size, 13px);
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 3mm 0;
  padding: 1.5mm 0;
  position: relative;
  border-bottom: 1.5pt solid #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-content {
  padding-left: 0;
  position: relative;
}

/* 个人简介 - 简洁排版 */
.summary-text {
  font-size: var(--resume-content-font-size, 11px);
  line-height: 1.5;
  margin: 0;
  text-align: justify;
  color: #374151;
  font-weight: 400;
  padding: 4mm 0;
  border-left: 2pt solid #2563eb;
  padding-left: 4mm;
  position: relative;
}

/* 工作经历 - 紧凑列表设计 */
.work-item {
  margin-bottom: 6mm;
  padding-bottom: 4mm;
  border-bottom: 0.5pt solid #e2e8f0;
  position: relative;
  page-break-inside: avoid;
}

.work-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2mm;
  gap: 10mm;
}

.work-title h3 {
  font-size: var(--resume-subtitle-font-size, 12px);
  font-weight: 700;
  margin: 0 0 1mm 0;
  color: #1e293b;
  line-height: 1.3;
}

.work-title h4 {
  font-size: var(--resume-content-font-size, 11px);
  font-weight: 600;
  margin: 0;
  color: #2563eb;
  line-height: 1.3;
}

.work-meta {
  text-align: right;
  color: #64748b;
  flex-shrink: 0;
  font-size: var(--resume-meta-font-size, 10px);
}

.work-period {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1mm;
  line-height: 1.2;
}

.work-location {
  display: block;
  font-weight: 500;
  line-height: 1.2;
}

.work-responsibilities {
  margin: 0;
  padding-left: 4mm;
  list-style: none;
  font-size: var(--resume-meta-font-size, 10px);
}

.work-responsibilities li {
  margin-bottom: 1mm;
  line-height: 1.4;
  position: relative;
  color: #374151;
}

.work-responsibilities li::before {
  content: '•';
  position: absolute;
  left: -3mm;
  color: #2563eb;
  font-weight: bold;
}

/* 教育背景 - 简洁列表设计 */
.education-item {
  margin-bottom: 5mm;
  padding-bottom: 3mm;
  border-bottom: 0.5pt solid #e2e8f0;
  position: relative;
  page-break-inside: avoid;
}

.education-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2mm;
  gap: 10mm;
}

.education-title h3 {
  font-size: var(--resume-subtitle-font-size, 12px);
  font-weight: 700;
  margin: 0 0 1mm 0;
  color: #1e293b;
  line-height: 1.3;
}

.education-title h4 {
  font-size: var(--resume-content-font-size, 11px);
  font-weight: 600;
  margin: 0;
  color: #2563eb;
  line-height: 1.3;
}

.education-meta {
  text-align: right;
  color: #64748b;
  flex-shrink: 0;
  font-size: var(--resume-meta-font-size, 10px);
}

.education-period {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1mm;
  line-height: 1.2;
}

.education-location {
  font-weight: 500;
  line-height: 1.2;
}

.education-details {
  display: flex;
  gap: 8px;
  font-size: var(--resume-meta-font-size, 10px);
  color: #64748b;
  font-weight: 500;
  flex-wrap: wrap;
}

.gpa {
  color: #1e40af;
  font-weight: 600;
}

.honors {
  color: #92400e;
  font-weight: 600;
}

.relevant-courses {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
  width: 100%;
}

.courses-label {
  color: #374151;
  font-weight: 600;
  font-size: var(--resume-meta-font-size, 10px);
}

.courses-content {
  color: #6b7280;
  font-weight: 400;
  line-height: 1.4;
  font-size: var(--resume-meta-font-size, 10px);
}

/* 技能特长 - 紧凑标签设计 */
.skill-category {
  margin-bottom: 5mm;
  page-break-inside: avoid;
}

.skill-category-title {
  font-size: var(--resume-content-font-size, 11px);
  font-weight: 700;
  margin: 0 0 2mm 0;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2mm;
  line-height: 1.2;
}

.skill-item {
  padding: 1mm 3mm;
  font-size: var(--resume-skill-font-size, 9px);
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
  border: 0.5pt solid #e2e8f0;
  display: inline-block;
}

.skill-expert {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.skill-advanced {
  background: #059669;
  color: white;
  border-color: #059669;
}

.skill-intermediate {
  background: #d97706;
  color: white;
  border-color: #d97706;
}

/* 项目经历 - 紧凑列表设计 */
.project-item {
  margin-bottom: 6mm;
  padding-bottom: 4mm;
  border-bottom: 0.5pt solid #e2e8f0;
  position: relative;
  page-break-inside: avoid;
}

.project-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2mm;
  gap: 10mm;
}

.project-title {
  display: flex;
  align-items: flex-start;
  gap: 4mm;
  flex: 1;
}

.project-title h3 {
  font-size: var(--resume-subtitle-font-size, 12px);
  font-weight: 700;
  margin: 0;
  color: #1e293b;
  line-height: 1.3;
}

.project-link {
  display: inline;
  color: #2563eb;
  text-decoration: none;
  font-size: var(--resume-small-font-size, 9px);
  font-weight: 600;
  word-break: break-all;
}

.project-meta {
  color: #64748b;
  font-weight: 600;
  font-size: var(--resume-meta-font-size, 10px);
  flex-shrink: 0;
  text-align: right;
}

.project-description {
  margin: 0 0 2mm 0;
  line-height: 1.4;
  color: #374151;
  font-size: var(--resume-meta-font-size, 10px);
}

.project-technologies {
  font-size: var(--resume-small-font-size, 9px);
  color: #64748b;
  line-height: 1.3;
}

.tech-label {
  font-weight: 700;
  color: #1e293b;
}

.tech-item {
  font-weight: 500;
}

/* 页码样式 */
.page-numbers {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 1000;
}

.page-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.page-number.current-page {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

/* 分页断点样式 */
.page-break-before {
  page-break-before: always;
  break-before: page;
}

/* 打印样式 - 完美A4打印效果 */
@media print {
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .modern-template {
    width: 210mm !important;
    max-width: 210mm !important;
    margin: 0 !important;
    padding: var(--resume-page-margin-top, 10mm) var(--resume-page-margin-right, 10mm) var(--resume-page-margin-bottom, 10mm) var(--resume-page-margin-left, 10mm) !important;
    font-size: var(--resume-base-font-size, 11px) !important;
    line-height: var(--resume-line-height, 1.4) !important;
    background: white !important;
    box-shadow: none !important;
    page-break-after: auto;
    box-sizing: border-box !important;
  }

  .modern-template.multi-page {
    min-height: auto !important;
  }

  .page-break {
    page-break-before: always !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .avoid-break {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .resume-header {
    background: #2563eb !important;
    color: white !important;
    padding: 12mm 0 8mm 0 !important;
    margin: -10mm -10mm 6mm -10mm !important;
    page-break-inside: avoid !important;
  }

  .header-content {
    padding: 0 10mm !important;
  }

  .name {
    font-size: var(--resume-name-font-size, 24px) !important;
    color: white !important;
    margin: 0 0 6mm 0 !important;
  }

  .contact-info {
    font-size: var(--resume-contact-font-size, 9px) !important;
    gap: 10px !important;
    margin-bottom: 6mm !important;
  }

  .contact-item {
    color: white !important;
    background: none !important;
    padding: 0 !important;
    border: none !important;
  }

  .links {
    font-size: var(--resume-link-font-size, 8px) !important;
    gap: 6px !important;
  }

  .link,
  .custom-field-link {
    color: white !important;
    background: none !important;
    padding: 0 !important;
    border: none !important;
    line-height: 1.2 !important;
  }

  .link-url {
    font-size: var(--resume-small-font-size, 8px) !important;
    color: white !important;
    opacity: 0.9 !important;
  }

  .section {
    margin-bottom: var(--resume-module-spacing, 6mm) !important;
    padding: 0 !important;
    page-break-inside: avoid;
  }

  .section-title {
    font-size: var(--resume-title-font-size, 12px) !important;
    margin: 0 0 3mm 0 !important;
    padding: 1.5mm 0 !important;
    border-bottom: 1pt solid #2563eb !important;
    page-break-after: avoid;
  }

  .section-content {
    padding-left: 0 !important;
  }

  .summary-text {
    font-size: var(--resume-content-font-size, 10px) !important;
    line-height: var(--resume-line-height, 1.4) !important;
    padding: 3mm 0 !important;
    border-left: 1.5pt solid #2563eb !important;
    padding-left: 3mm !important;
    background: none !important;
  }

  .work-item,
  .education-item,
  .project-item {
    margin-bottom: 4mm !important;
    padding-bottom: 3mm !important;
    border-bottom: 0.5pt solid #e2e8f0 !important;
    page-break-inside: avoid !important;
    background: none !important;
    box-shadow: none !important;
  }

  .work-header,
  .education-header,
  .project-header {
    margin-bottom: 1.5mm !important;
    gap: 8mm !important;
  }

  .work-title h3,
  .education-title h3,
  .project-title h3 {
    font-size: var(--resume-subtitle-font-size, 11px) !important;
    margin: 0 0 0.5mm 0 !important;
  }

  .work-title h4,
  .education-title h4 {
    font-size: var(--resume-content-font-size, 10px) !important;
  }

  .work-meta,
  .education-meta,
  .project-meta {
    font-size: var(--resume-meta-font-size, 9px) !important;
  }

  .work-responsibilities {
    font-size: var(--resume-meta-font-size, 9px) !important;
    padding-left: 3mm !important;
  }

  .work-responsibilities li {
    margin-bottom: 0.5mm !important;
    line-height: 1.3 !important;
  }

  .education-details {
    font-size: var(--resume-meta-font-size, 9px) !important;
    gap: 6px !important;
  }

  .project-description {
    font-size: var(--resume-meta-font-size, 9px) !important;
    margin: 0 0 1.5mm 0 !important;
    line-height: var(--resume-line-height, 1.3) !important;
  }

  .project-technologies {
    font-size: var(--resume-small-font-size, 8px) !important;
  }

  .project-link {
    font-size: var(--resume-small-font-size, 8px) !important;
    color: #2563eb !important;
    background: none !important;
    padding: 0 !important;
    border: none !important;
  }

  .skill-category {
    margin-bottom: 4mm !important;
    page-break-inside: avoid !important;
    background: none !important;
    border: none !important;
    padding: 0 !important;
  }

  .skill-category-title {
    font-size: var(--resume-content-font-size, 10px) !important;
    margin: 0 0 1.5mm 0 !important;
  }

  .skills-list {
    gap: 1.5mm !important;
  }

  .skill-item {
    font-size: var(--resume-skill-font-size, 8px) !important;
    padding: 0.5mm 2mm !important;
    border: 0.5pt solid #e2e8f0 !important;
  }

  .skill-expert {
    background: #2563eb !important;
    color: white !important;
    border-color: #2563eb !important;
  }

  .skill-advanced {
    background: #059669 !important;
    color: white !important;
    border-color: #059669 !important;
  }

  .skill-intermediate {
    background: #d97706 !important;
    color: white !important;
    border-color: #d97706 !important;
  }

  /* 打印时隐藏页码 */
  .page-numbers {
    display: none !important;
  }

  /* 确保分页断点生效 */
  .page-break-before {
    page-break-before: always !important;
    break-before: page !important;
  }
}
</style>
