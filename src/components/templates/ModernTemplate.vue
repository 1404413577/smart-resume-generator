<template>
  <div class="modern-template">
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
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  }
})

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
</script>

<style scoped>
.modern-template {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  color: #2c3e50;
  font-family: var(--resume-font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
  line-height: var(--resume-line-height, 1.6);
  font-size: var(--resume-base-font-size, 14px);
}

/* 头部样式 */
.resume-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 30px;
  margin-bottom: 30px;
}

.header-content {
  max-width: 100%;
}

.name {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 15px 0;
  letter-spacing: 1px;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.link {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: default;
  flex-wrap: wrap;
  max-width: 100%;
}

.link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.link-label {
  font-weight: 600;
  white-space: nowrap;
}

.link-url {
  font-weight: 400;
  word-break: break-all;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.custom-field-link {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: white;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: default;
  flex-wrap: wrap;
  max-width: 100%;
}

/* 章节样式 */
.section {
  margin-bottom: var(--resume-module-spacing, 35px);
  padding: 0 30px;
}

.section-title {
  font-size: var(--resume-title-font-size, 24px);
  font-weight: 600;
  color: #667eea;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 2px;
  background: #764ba2;
}

.section-content {
  padding-left: 10px;
}

/* 个人简介 */
.summary-text {
  font-size: 16px;
  line-height: 1.8;
  margin: 0;
  text-align: justify;
}

/* 工作经历 */
.work-item {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.work-item:last-child {
  border-bottom: none;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.work-title h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.work-title h4 {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: #667eea;
}

.work-meta {
  text-align: right;
  color: #6c757d;
}

.work-period {
  display: block;
  font-weight: 500;
}

.work-location {
  display: block;
  font-size: 13px;
}

.work-responsibilities {
  margin: 0;
  padding-left: 20px;
}

.work-responsibilities li {
  margin-bottom: 5px;
  line-height: 1.6;
}

/* 教育背景 */
.education-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.education-item:last-child {
  border-bottom: none;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.education-title h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 3px 0;
  color: #2c3e50;
}

.education-title h4 {
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  color: #667eea;
}

.education-meta {
  text-align: right;
  color: #6c757d;
}

.education-details {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #6c757d;
}

/* 技能特长 */
.skill-category {
  margin-bottom: 20px;
}

.skill-category-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-item {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e9ecef;
}

.skill-expert {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.skill-advanced {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.skill-intermediate {
  background: #ffc107;
  color: #212529;
  border-color: #ffc107;
}

/* 项目经历 */
.project-item {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.project-item:last-child {
  border-bottom: none;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.project-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.project-title h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
}

.project-link {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}

.project-link:hover {
  text-decoration: underline;
}

.project-meta {
  color: #6c757d;
  font-weight: 500;
}

.project-description {
  margin: 0 0 10px 0;
  line-height: 1.6;
}

.project-technologies {
  font-size: 13px;
  color: #6c757d;
}

.tech-label {
  font-weight: 600;
}

.tech-item {
  font-weight: 500;
}

/* 打印样式 */
@media print {
  .modern-template {
    font-size: 12px;
  }

  .resume-header {
    padding: 30px 20px;
  }

  .section {
    padding: 0 20px;
    margin-bottom: 25px;
  }

  .name {
    font-size: 28px;
  }

  .section-title {
    font-size: 18px;
  }

  .link-url {
    font-size: 11px !important;
    color: #333 !important;
    font-weight: 500 !important;
  }

  .link {
    border-color: #333 !important;
    color: #333 !important;
    background: white !important;
  }
}
</style>
