<template>
  <PagedTemplateBase
    :resume-data="props.resumeData"
    :page-content="props.pageContent"
    :page-number="props.pageNumber"
    :is-single-page="props.isSinglePage"
    template-class="classic-template"
  >
    <!-- 个人信息插槽 -->
    <template #personalInfo="{ data }">
      <header class="resume-header">
        <div class="header-content" :class="`avatar-${getAvatarPosition(data)}`">
          <!-- 头像 -->
          <div v-if="hasAvatar(data)" class="avatar-container" :class="`avatar-${getAvatarPosition(data)}`">
            <img :src="data.avatar" alt="头像" class="avatar-image" />
          </div>

          <div class="info-container">
            <div class="contact-info">
              <!-- 第一行：基本信息 -->
              <div class="contact-row primary-info">
                <span class="contact-item name-item">
                  姓名：{{ data.name || '姓名' }}
                </span>
                <span v-if="data.targetPosition" class="contact-item">
                  期望职位：{{ data.targetPosition }}
                </span>
                <span v-if="data.email" class="contact-item">
                  邮箱：{{ data.email }}
                </span>
                <span v-if="data.phone" class="contact-item">
                  电话：{{ data.phone }}
                </span>
                <span v-if="data.address" class="contact-item">
                  地址：{{ data.address }}
                </span>
              </div>

              <!-- 第二行：在线链接和自定义字段 -->
              <div v-if="hasOnlineInfo(data)" class="contact-row secondary-info">
                <span v-if="data.website" class="contact-item">
                  个人网站：{{ data.website }}
                </span>
                <span v-if="data.linkedin" class="contact-item">
                  LinkedIn：{{ data.linkedin }}
                </span>
                <span v-if="data.github" class="contact-item">
                  GitHub：{{ data.github }}
                </span>

                <!-- 自定义字段 -->
                <template v-if="data.customFields && data.customFields.length > 0">
                  <span
                    v-for="field in data.customFields"
                    :key="field.id"
                    v-show="field.value"
                    class="contact-item"
                  >
                    {{ field.name }}：{{ field.value }}
                  </span>
                </template>
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
        <div class="entry">
          <div class="entry-header">
            <span>{{ data.company }} | {{ data.position }}</span>
            <span>{{ data.startDate }} - {{ data.current ? '至今' : data.endDate }}</span>
          </div>
          <div class="entry-content">
            <div v-if="data.location || data.description">
              {{ data.location }}{{ data.location && data.description ? ' | ' : '' }}{{ data.description }}
            </div>
            <ul v-if="data.achievements && data.achievements.length > 0">
              <li v-for="(achievement, index) in data.achievements" :key="index">
                {{ achievement }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>

    <!-- 教育背景插槽 -->
    <template #education="{ data, isFirst }">
      <h2 v-if="isFirst" class="section-title">教育背景</h2>
      <div class="section-content">
        <div class="education-item">
          <div class="education-header">
            <div class="education-left">
              <span class="institution-name">{{ data.institution }}</span>
            </div>
            <div class="education-right">
              <span class="graduation-date">{{ formatEducationDate(data.startDate, data.graduationDate) }}</span>
            </div>
          </div>

          <!-- 学位信息 - 居左对齐，不缩进 -->
          <div class="degree-info">{{ data.major }} | {{ getDegreeType(data.degree) }} | {{ data.degree }}</div>

          <div class="education-details">
            <!-- 主修课程 -->
            <div v-if="data.relevantCourses" class="relevant-courses">
              主修课程：{{ data.relevantCourses }}
            </div>

            <!-- 荣誉奖项 -->
            <div v-if="data.honors" class="honors-info">
              {{ data.honors }}
            </div>

            <!-- GPA信息 -->
            <div v-if="data.gpa" class="gpa-info">
              GPA: {{ data.gpa }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 技能特长插槽 -->
    <template #skills="{ data }">
      <h2 class="section-title">技能特长</h2>
      <div class="section-content">
        <div class="skills">
          <div
            v-for="skill in data"
            :key="skill.id"
            class="skill-item"
          >
            {{ skill.name }}
          </div>
        </div>
      </div>
    </template>

    <!-- 项目经历插槽 -->
    <template #projects="{ data, isFirst }">
      <h2 v-if="isFirst" class="section-title">项目经历</h2>
      <div class="section-content">
        <div class="entry">
          <div class="entry-header">
            <span>{{ data.name }}</span>
            <span>{{ data.startDate }} - {{ data.endDate }}</span>
          </div>
          <div class="entry-content">
            <span v-if="data.role" class="project-role">项目角色：{{ data.role }}</span>
            <span v-if="data.technologies && data.technologies.length > 0" class="project-tech">
              技术栈：{{ data.technologies.join(' + ') }}
            </span>
            <span v-if="data.url" class="project-url">项目链接：{{ data.url }}</span>
            <ul v-if="data.description">
              <li v-for="(item, index) in data.description.split('\n').filter(line => line.trim())" :key="index">
                {{ item.trim() }}
              </li>
            </ul>
            <ul v-if="data.highlights && data.highlights.length > 0">
              <li v-for="(highlight, index) in data.highlights" :key="index">
                {{ highlight }}
              </li>
            </ul>
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



// 计算属性和方法
const hasLinks = (personalInfo) => {
  const { website, linkedin, github, customFields } = personalInfo
  return website || linkedin || github || (customFields && customFields.length > 0)
}

const hasAvatar = (personalInfo) => !!personalInfo.avatar
const getAvatarPosition = (personalInfo) => personalInfo.avatarPosition || 'left'

const hasOnlineInfo = (personalInfo) => {
  const { website, linkedin, github, customFields } = personalInfo
  return website || linkedin || github || (customFields && customFields.length > 0)
}





// 获取语言水平文本
const getLanguageLevelText = (level) => {
  const levelMap = {
    basic: '基础',
    conversational: '对话',
    fluent: '流利',
    native: '母语'
  }
  return levelMap[level] || '中等'
}



// 格式化教育时间
const formatEducationDate = (startDate, endDate) => {
  if (!endDate) return ''

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    return `${year}.${month.padStart(2, '0')}`
  }

  const start = formatDate(startDate)
  const end = formatDate(endDate)

  if (start && end) {
    return `${start} - ${end}`
  } else if (end) {
    return end
  }
  return ''
}

// 获取学位类型
const getDegreeType = (degree) => {
  const degreeTypeMap = {
    '博士': '博士',
    '硕士': '硕士',
    '学士': '本科',
    '大专': '大专',
    '高中': '高中',
    '中专': '中专'
  }
  return degreeTypeMap[degree] || '本科'
}
</script>

<style scoped>
.classic-template {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  color: #333;
  font-family: var(--resume-font-family, 'SimSun', '宋体', 'Times New Roman', serif);
  line-height: var(--resume-line-height, 1.5);
  font-size: var(--resume-base-font-size, 12pt);
  padding: var(--resume-page-margin-top, 15mm) var(--resume-page-margin-right, 15mm) var(--resume-page-margin-bottom, 15mm) var(--resume-page-margin-left, 15mm);
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  min-height: var(--resume-single-page-height, 297mm);
  position: relative;
}

.classic-template.multi-page {
  min-height: var(--resume-multi-page-height, 297mm);
}

/* 头部样式 */
.resume-header {
  margin-bottom: 15pt;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 20pt;
}

/* 头像样式 */
.avatar-container {
  flex-shrink: 0;
}

.avatar-image {
  width: 80pt;
  height: 80pt;
  border-radius: 50%;
  object-fit: cover;
  border: 2pt solid #333;
}

.info-container {
  flex: 1;
}

/* 头像位置布局 */
.header-content.avatar-left {
  flex-direction: row;
}

.header-content.avatar-right {
  flex-direction: row-reverse;
}

.header-content.avatar-center {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.header-content.avatar-center .info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 无头像时居中显示 */
.header-content:not(.avatar-left):not(.avatar-right):not(.avatar-center) {
  justify-content: center;
  text-align: center;
}

.name {
  font-size: var(--resume-subtitle-font-size, 18pt);
  font-weight: bold;
  margin: 0 0 10pt 0;
  color: #333;
  letter-spacing: 2px;
}

.contact-info {
  color: #333;
  margin-bottom: 15pt;
}

.contact-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 3pt 0;
  flex-wrap: wrap;
  line-height: 1.5;
}

.contact-item {
  position: relative;
}

/* 使用更美观的分隔符 */
.contact-item:not(:last-child)::after {
  content: " • ";
  margin: 0 6pt;
  color: #888;
  font-weight: normal;
}

/* 基本信息行样式 */
.primary-info {
  margin-bottom: 5pt;
}

/* 在线信息行样式 */
.secondary-info {
  margin-top: 2pt;
  color: #555;
}

/* 姓名样式保持一致 */
.name-item {
  font-weight: inherit;
  font-size: inherit;
  color: inherit;
}

.contact-item {
  margin: 0;
}

.link-item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px;
}

.link-label {
  font-weight: bold;
  color: #333;
}

.link-url {
  font-family: 'Courier New', monospace;
  font-size: var(--resume-small-font-size, 13px);
  color: #666;
  word-break: break-all;
}

/* 章节样式 */
.section {
  margin-bottom: var(--resume-module-spacing, 15pt);
}

.section-title {
  font-size: var(--resume-title-font-size, 14pt);
  font-weight: bold;
  color: #2c3e50;
  margin: var(--resume-module-spacing, 15pt) 0 10pt 0;
  border-bottom: 2px solid #3498db;
  padding-bottom: 3pt;
}

.section-content {
  margin-left: 0;
  padding-left: 0;
}

/* 个人简介 */
.summary-text {
  font-size: var(--resume-content-font-size, 14px);
  line-height: var(--resume-line-height, 1.7);
  margin: 0;
  text-align: justify;
  text-indent: 2em;
}

/* 工作经历 */
.entry {
  margin-bottom: 10pt;
  page-break-inside: avoid;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 3pt;
}

.entry-content {
  padding-left: 10pt;
  text-align: justify;
}

.entry-content ul {
  padding-left: 20pt;
  margin: 5pt 0;
}

.entry-content li {
  margin-bottom: 5pt;
  line-height: 1.6;
}

/* 教育背景 */
.education-item {
  margin-bottom: 10pt;
  page-break-inside: avoid;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-weight: bold;
  margin-bottom: 3pt;
}

.education-left {
  flex: 1;
}

.education-right {
  text-align: right;
  min-width: 120px;
}

.education-left {
  display: flex;
  align-items: flex-start;
}

.institution-name {
  font-size: inherit;
  font-weight: bold;
  color: #333;
  display: block;
  margin: 0;
  padding: 0;
}

.graduation-date {
  font-weight: bold;
  color: #333;
}

.degree-info {
  color: #333;
  margin-bottom: 5pt;
  margin-top: 3pt;
  text-align: left;
}

.education-details {
  padding-left: 15pt;
  margin-top: 3pt;
  line-height: 1.6;
}

.relevant-courses {
  color: #333;
  margin-bottom: 5pt;
  text-align: justify;
}

.honors-info {
  color: #333;
  margin-bottom: 5pt;
  text-align: justify;
}

.gpa-info {
  color: #333;
  margin-bottom: 5pt;
}

/* 技能特长 */
.skills {
  line-height: 1.6;
}

.skill-item {
  margin-bottom: 6pt;
  color: #333;
  text-align: justify;
}

/* 项目经历 - 使用与工作经历相同的entry样式 */
.project-role {
  font-weight: bold;
  margin-bottom: 3pt;
  display: block;
}

.project-tech {
  color: #7f8c8d;
  font-style: italic;
  margin-bottom: 5pt;
  display: block;
}

.project-url {
  color: #333;
  font-style: normal;
  display: block;
  font-weight: normal;
  margin-bottom: 3pt;
}

/* 证书认证 */
.certification-item {
  margin-bottom: 12px;
}

.certification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.certification-name {
  font-size: var(--resume-content-font-size, 14px);
  font-weight: bold;
  margin: 0;
  color: #333;
}

.certification-date {
  font-weight: bold;
  font-size: var(--resume-meta-font-size, 13px);
}

.certification-details {
  font-size: var(--resume-meta-font-size, 13px);
  color: #666;
}

.certification-issuer {
  margin-right: 15px;
}

/* 语言能力 */
.languages-list {
  font-size: var(--resume-content-font-size, 14px);
  line-height: var(--resume-line-height, 1.6);
}

.language-item {
  font-weight: normal;
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
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.page-number.current-page {
  background: #3498db;
  border-color: #3498db;
  color: white;
}

/* 分页断点样式 */
.page-break-before {
  page-break-before: always;
  break-before: page;
}

/* 打印样式 */
@media print {
  .classic-template {
    width: 210mm;
    padding: var(--resume-page-margin-top, 15mm) var(--resume-page-margin-right, 15mm) var(--resume-page-margin-bottom, 15mm) var(--resume-page-margin-left, 15mm);
    margin: 0;
    background-color: white;
    box-shadow: none;
    min-height: 297mm;
    font-size: var(--resume-base-font-size, 12pt);
  }

  .name {
    font-size: var(--resume-name-font-size, 18pt);
  }

  .section-title {
    font-size: var(--resume-title-font-size, 14pt);
  }

  .section {
    margin-bottom: 15pt;
  }

  .work-item,
  .education-item,
  .project-item {
    margin-bottom: 10pt;
    page-break-inside: avoid;
  }

  .link-url {
    font-size: var(--resume-small-font-size, 11pt) !important;
    color: #333 !important;
    font-weight: 500 !important;
  }

  .link-label {
    color: #000 !important;
    font-weight: bold !important;
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

  @page {
    size: A4;
    margin: 0;
  }
}
</style>
