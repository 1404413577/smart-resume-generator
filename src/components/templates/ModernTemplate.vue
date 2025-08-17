<template>
  <div class="modern-template" :class="{ 'multi-page': pageCount > 1 }">
    <!-- 头部个人信息 -->
    <header class="resume-header">
      <div class="header-content">
        <div class="personal-info">
          <h1 class="name">{{ resumeData.personalInfo.name || '姓名' }}</h1>
          <div class="contact-info">
            <div class="contact-item" v-if="resumeData.personalInfo.email">
              <el-icon><Message /></el-icon>
              <span>{{ resumeData.personalInfo.email }}</span>
            </div>
            <div class="contact-item" v-if="resumeData.personalInfo.phone">
              <el-icon><Phone /></el-icon>
              <span>{{ resumeData.personalInfo.phone }}</span>
            </div>
            <div class="contact-item" v-if="resumeData.personalInfo.address">
              <el-icon><Location /></el-icon>
              <span>{{ resumeData.personalInfo.address }}</span>
            </div>
          </div>
          <div class="links" v-if="hasLinks">
            <div v-if="resumeData.personalInfo.website" class="link">
              <el-icon><Link /></el-icon>
              <span class="link-label">个人网站:</span>
              <span class="link-url">{{ resumeData.personalInfo.website }}</span>
            </div>
            <div v-if="resumeData.personalInfo.linkedin" class="link">
              <el-icon><Link /></el-icon>
              <span class="link-label">LinkedIn:</span>
              <span class="link-url">{{ resumeData.personalInfo.linkedin }}</span>
            </div>
            <div v-if="resumeData.personalInfo.github" class="link">
              <el-icon><Link /></el-icon>
              <span class="link-label">GitHub:</span>
              <span class="link-url">{{ resumeData.personalInfo.github }}</span>
            </div>
            <!-- 自定义字段链接 -->
            <div
              v-for="field in resumeData.personalInfo.customFields"
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

    <!-- 个人简介 -->
    <section v-if="resumeData.summary" class="section summary-section">
      <h2 class="section-title">个人简介</h2>
      <div class="section-content">
        <p class="summary-text">{{ resumeData.summary }}</p>
      </div>
    </section>

    <!-- 工作经历 -->
    <section v-if="resumeData.workExperience.length > 0" class="section work-section">
      <h2 class="section-title">工作经历</h2>
      <div class="section-content">
        <div v-for="work in resumeData.workExperience" :key="work.id" class="work-item">
          <div class="work-header">
            <div class="work-title">
              <h3>{{ work.jobTitle }}</h3>
              <h4>{{ work.company }}</h4>
            </div>
            <div class="work-meta">
              <span class="work-period">
                {{ work.startDate }} - {{ work.current ? '至今' : work.endDate }}
              </span>
              <span v-if="work.location" class="work-location">{{ work.location }}</span>
            </div>
          </div>
          <ul class="work-responsibilities">
            <li v-for="(responsibility, index) in work.responsibilities" :key="index">
              {{ responsibility }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 教育背景 -->
    <section v-if="resumeData.education.length > 0" class="section education-section">
      <h2 class="section-title">教育背景</h2>
      <div class="section-content">
        <div v-for="edu in resumeData.education" :key="edu.id" class="education-item">
          <div class="education-header">
            <div class="education-title">
              <h3>{{ edu.degree }} - {{ edu.major }}</h3>
              <h4>{{ edu.institution }}</h4>
            </div>
            <div class="education-meta">
              <span class="education-period">{{ edu.graduationDate }}</span>
              <span v-if="edu.location" class="education-location">{{ edu.location }}</span>
            </div>
          </div>
          <div class="education-details">
            <span v-if="edu.gpa" class="gpa">GPA: {{ edu.gpa }}</span>
            <span v-if="edu.honors" class="honors">{{ edu.honors }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 技能特长 -->
    <section v-if="resumeData.skills.length > 0" class="section skills-section">
      <h2 class="section-title">技能特长</h2>
      <div class="section-content">
        <div v-for="category in skillCategories" :key="category.key" class="skill-category">
          <h3 class="skill-category-title">{{ category.name }}</h3>
          <div class="skills-list">
            <span 
              v-for="skill in getSkillsByCategory(category.key)" 
              :key="skill.id"
              class="skill-item"
              :class="`skill-${skill.level}`"
            >
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目经历 -->
    <section v-if="resumeData.projects.length > 0" class="section projects-section">
      <h2 class="section-title">项目经历</h2>
      <div class="section-content">
        <div v-for="project in resumeData.projects" :key="project.id" class="project-item">
          <div class="project-header">
            <div class="project-title">
              <h3>{{ project.name }}</h3>
              <a v-if="project.url" :href="project.url" target="_blank" class="project-link">
                <el-icon><Link /></el-icon>
                查看项目
              </a>
            </div>
            <div class="project-meta">
              <span class="project-period">{{ project.startDate }} - {{ project.endDate }}</span>
            </div>
          </div>
          <p class="project-description">{{ project.description }}</p>
          <div v-if="project.technologies.length > 0" class="project-technologies">
            <span class="tech-label">技术栈：</span>
            <span 
              v-for="(tech, index) in project.technologies" 
              :key="index"
              class="tech-item"
            >
              {{ tech }}{{ index < project.technologies.length - 1 ? '、' : '' }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 自定义模块 -->
    <section
      v-for="customModule in customModules"
      :key="customModule.id"
      class="section custom-module-section"
    >
      <CustomModuleRenderer
        :module="customModule"
        :module-data="getCustomModuleData(customModule.id)"
      />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '../../stores/resume'
import CustomModuleRenderer from '../CustomModuleRenderer.vue'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  }
})

const resumeStore = useResumeStore()

// 页面设置
const pageCount = computed(() => resumeStore.globalSettings.pageSettings.pageCount)
const showPageNumbers = computed(() => resumeStore.globalSettings.pageSettings.showPageNumbers)

// 技能分类
const skillCategories = [
  { key: 'technical', name: '技术技能' },
  { key: 'soft', name: '软技能' },
  { key: 'language', name: '语言技能' }
]

// 计算属性
const hasLinks = computed(() => {
  const { website, linkedin, github, customFields } = props.resumeData.personalInfo
  return website || linkedin || github || (customFields && customFields.length > 0)
})

// 根据分类获取技能
const getSkillsByCategory = (category) => {
  return props.resumeData.skills.filter(skill => skill.category === category)
}

// 自定义模块相关
const customModules = computed(() => {
  return resumeStore.globalSettings.customModules || []
})

const getCustomModuleData = (moduleId) => {
  return resumeStore.getCustomModuleData(moduleId)
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
  padding: var(--resume-page-margin-top, 15mm) var(--resume-page-margin-right, 15mm) var(--resume-page-margin-bottom, 15mm) var(--resume-page-margin-left, 15mm);
  min-height: calc(297mm - 30mm);
  position: relative;
  page-break-after: auto;
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
  padding: 20mm 0 15mm 0;
  margin: -15mm -15mm 12mm -15mm;
  position: relative;
  page-break-inside: avoid;
}

.header-content {
  max-width: 100%;
  padding: 0 15mm;
}

.name {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8mm 0;
  letter-spacing: 0.5px;
  color: white;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 8mm;
  font-size: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: white;
}

.contact-item .el-icon {
  font-size: 12px;
}

.links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 9px;
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
}

.link-url {
  font-weight: 400;
  word-break: break-all;
  font-family: 'Courier New', monospace;
  opacity: 0.95;
  flex: 1;
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
  margin-bottom: var(--resume-module-spacing, 8mm);
  padding: 0;
  position: relative;
  page-break-inside: avoid;
}

.section-title {
  font-size: var(--resume-title-font-size, 14px);
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4mm 0;
  padding: 2mm 0;
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
  font-size: 11px;
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
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 1mm 0;
  color: #1e293b;
  line-height: 1.3;
}

.work-title h4 {
  font-size: 11px;
  font-weight: 600;
  margin: 0;
  color: #2563eb;
  line-height: 1.3;
}

.work-meta {
  text-align: right;
  color: #64748b;
  flex-shrink: 0;
  font-size: 10px;
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
  font-size: 10px;
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
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 1mm 0;
  color: #1e293b;
  line-height: 1.3;
}

.education-title h4 {
  font-size: 11px;
  font-weight: 600;
  margin: 0;
  color: #2563eb;
  line-height: 1.3;
}

.education-meta {
  text-align: right;
  color: #64748b;
  flex-shrink: 0;
  font-size: 10px;
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
  font-size: 10px;
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

/* 技能特长 - 紧凑标签设计 */
.skill-category {
  margin-bottom: 5mm;
  page-break-inside: avoid;
}

.skill-category-title {
  font-size: 11px;
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
  font-size: 9px;
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
  font-size: 12px;
  font-weight: 700;
  margin: 0;
  color: #1e293b;
  line-height: 1.3;
}

.project-link {
  display: inline;
  color: #2563eb;
  text-decoration: none;
  font-size: 9px;
  font-weight: 600;
  word-break: break-all;
}

.project-meta {
  color: #64748b;
  font-weight: 600;
  font-size: 10px;
  flex-shrink: 0;
  text-align: right;
}

.project-description {
  margin: 0 0 2mm 0;
  line-height: 1.4;
  color: #374151;
  font-size: 10px;
}

.project-technologies {
  font-size: 9px;
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
    padding: 15mm !important;
    font-size: 11px !important;
    line-height: 1.4 !important;
    background: white !important;
    box-shadow: none !important;
    page-break-after: auto;
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
    padding: 15mm 0 10mm 0 !important;
    margin: -15mm -15mm 8mm -15mm !important;
    page-break-inside: avoid !important;
  }

  .header-content {
    padding: 0 15mm !important;
  }

  .name {
    font-size: 24px !important;
    color: white !important;
    margin: 0 0 6mm 0 !important;
  }

  .contact-info {
    font-size: 9px !important;
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
    font-size: 8px !important;
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
    font-size: 8px !important;
    color: white !important;
    opacity: 0.9 !important;
  }

  .section {
    margin-bottom: 6mm !important;
    padding: 0 !important;
    page-break-inside: avoid;
  }

  .section-title {
    font-size: 12px !important;
    margin: 0 0 3mm 0 !important;
    padding: 1.5mm 0 !important;
    border-bottom: 1pt solid #2563eb !important;
    page-break-after: avoid;
  }

  .section-content {
    padding-left: 0 !important;
  }

  .summary-text {
    font-size: 10px !important;
    line-height: 1.4 !important;
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
    font-size: 11px !important;
    margin: 0 0 0.5mm 0 !important;
  }

  .work-title h4,
  .education-title h4 {
    font-size: 10px !important;
  }

  .work-meta,
  .education-meta,
  .project-meta {
    font-size: 9px !important;
  }

  .work-responsibilities {
    font-size: 9px !important;
    padding-left: 3mm !important;
  }

  .work-responsibilities li {
    margin-bottom: 0.5mm !important;
    line-height: 1.3 !important;
  }

  .education-details {
    font-size: 9px !important;
    gap: 6px !important;
  }

  .project-description {
    font-size: 9px !important;
    margin: 0 0 1.5mm 0 !important;
    line-height: 1.3 !important;
  }

  .project-technologies {
    font-size: 8px !important;
  }

  .project-link {
    font-size: 8px !important;
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
    font-size: 10px !important;
    margin: 0 0 1.5mm 0 !important;
  }

  .skills-list {
    gap: 1.5mm !important;
  }

  .skill-item {
    font-size: 8px !important;
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
}
</style>
