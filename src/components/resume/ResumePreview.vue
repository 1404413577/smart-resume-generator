<template>
  <div class="resume-preview" :style="previewStyle" :class="layoutClasses">
    <!-- 个人信息部分 -->
    <div class="resume-header">
      <div class="personal-info">
        <h1 class="name">{{ resumeData.personalInfo.name || '姓名' }}</h1>
        <h2 v-if="resumeData.personalInfo.targetPosition" class="target-position">{{ resumeData.personalInfo.targetPosition }}</h2>
        <div class="contact-info">
          <div v-if="resumeData.personalInfo.email" class="contact-item">
            <span class="contact-icon">📧</span>
            <span>{{ resumeData.personalInfo.email }}</span>
          </div>
          <div v-if="resumeData.personalInfo.phone" class="contact-item">
            <span class="contact-icon">📱</span>
            <span>{{ resumeData.personalInfo.phone }}</span>
          </div>
          <div v-if="resumeData.personalInfo.address" class="contact-item">
            <span class="contact-icon">📍</span>
            <span>{{ resumeData.personalInfo.address }}</span>
          </div>
          <div v-if="resumeData.personalInfo.website" class="contact-item">
            <span class="contact-icon">🌐</span>
            <span>{{ resumeData.personalInfo.website }}</span>
          </div>
          <div v-if="resumeData.personalInfo.linkedin" class="contact-item">
            <span class="contact-icon">💼</span>
            <span>{{ resumeData.personalInfo.linkedin }}</span>
          </div>
          <div v-if="resumeData.personalInfo.github" class="contact-item">
            <span class="contact-icon">🐙</span>
            <span>{{ resumeData.personalInfo.github }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="resume-content" :class="contentLayoutClass">

    <!-- 个人简介 -->
    <div class="resume-section">
      <h2 class="section-title">个人简介</h2>
      <div class="section-content">
        <p class="summary-text" v-if="resumeData.summary">{{ resumeData.summary }}</p>
        <div v-else class="placeholder-content">
          <p class="placeholder-text">请在左侧编辑器中填写个人简介...</p>
        </div>
      </div>
    </div>

    <!-- 工作经历 -->
    <div class="resume-section">
      <h2 class="section-title">工作经历</h2>
      <div class="section-content">
        <div v-if="resumeData.workExperience.length > 0">
          <div v-for="(work, index) in resumeData.workExperience" :key="index" class="experience-item">
            <div class="experience-header">
              <div class="experience-title">
                <h3 class="position">{{ work.position }}</h3>
                <h4 class="company">{{ work.company }}</h4>
              </div>
              <div class="experience-date">
                {{ formatDate(work.startDate) }} - {{ work.endDate ? formatDate(work.endDate) : '至今' }}
              </div>
            </div>
            <div v-if="work.location" class="experience-location">
              <span class="location-icon">📍</span>
              <span>{{ work.location }}</span>
            </div>
            <div v-if="work.description" class="experience-description">
              <p>{{ work.description }}</p>
            </div>
            <div v-if="work.achievements && work.achievements.length > 0" class="experience-achievements">
              <ul>
                <li v-for="(achievement, idx) in work.achievements" :key="idx">
                  {{ achievement }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else class="placeholder-content">
          <p class="placeholder-text">请在左侧编辑器中添加工作经历...</p>
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <div class="resume-section">
      <h2 class="section-title">教育背景</h2>
      <div class="section-content">
        <div v-if="resumeData.education.length > 0">
          <div v-for="(edu, index) in resumeData.education" :key="index" class="education-item">
            <div class="education-header">
              <div class="education-title">
                <h3 class="degree">{{ edu.degree }}</h3>
                <h4 class="school">{{ edu.school }}</h4>
                <div v-if="edu.major" class="major">{{ edu.major }}</div>
              </div>
              <div class="education-date">
                {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : '至今' }}
              </div>
            </div>
            <div v-if="edu.gpa" class="education-gpa">
              GPA: {{ edu.gpa }}
            </div>
            <div v-if="edu.honors" class="education-honors">
              荣誉: {{ edu.honors }}
            </div>
          </div>
        </div>
        <div v-else class="placeholder-content">
          <p class="placeholder-text">请在左侧编辑器中添加教育背景...</p>
        </div>
      </div>
    </div>

    <!-- 技能特长 -->
    <div class="resume-section">
      <h2 class="section-title">技能特长</h2>
      <div class="section-content">
        <div v-if="resumeData.skills.length > 0" class="skills-grid">
          <div v-for="(skill, index) in resumeData.skills" :key="index" class="skill-item">
            <span class="skill-name">{{ skill.name }}</span>
            <div v-if="skill.level" class="skill-level">
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: getSkillWidth(skill.level) }"></div>
              </div>
              <span class="skill-level-text">{{ skill.level }}</span>
            </div>
          </div>
        </div>
        <div v-else class="placeholder-content">
          <p class="placeholder-text">请在左侧编辑器中添加技能特长...</p>
        </div>
      </div>
    </div>

    <!-- 项目经历 -->
    <div class="resume-section">
      <h2 class="section-title">项目经历</h2>
      <div class="section-content">
        <div v-if="resumeData.projects.length > 0">
          <div v-for="(project, index) in resumeData.projects" :key="index" class="project-item">
            <div class="project-header">
              <div class="project-title">
                <h3 class="project-name">{{ project.name }}</h3>
                <div v-if="project.role" class="project-role">{{ project.role }}</div>
              </div>
              <div v-if="project.startDate || project.endDate" class="project-date">
                {{ project.startDate ? formatDate(project.startDate) : '' }}
                {{ project.startDate && project.endDate ? ' - ' : '' }}
                {{ project.endDate ? formatDate(project.endDate) : '' }}
              </div>
            </div>
            <div v-if="project.description" class="project-description">
              <p>{{ project.description }}</p>
            </div>
            <div v-if="project.technologies && project.technologies.length > 0" class="project-technologies">
              <span class="tech-label">技术栈:</span>
              <span class="tech-tags">
                <span v-for="(tech, idx) in project.technologies" :key="idx" class="tech-tag">
                  {{ tech }}
                </span>
              </span>
            </div>
            <div v-if="project.url || project.github" class="project-links">
              <a v-if="project.url" :href="project.url" target="_blank" class="project-link">
                🔗 项目链接
              </a>
              <a v-if="project.github" :href="project.github" target="_blank" class="project-link">
                📁 GitHub
              </a>
            </div>
          </div>
        </div>
        <div v-else class="placeholder-content">
          <p class="placeholder-text">请在左侧编辑器中添加项目经历...</p>
        </div>
      </div>
    </div>
    </div> <!-- 结束 resume-content -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '@stores/resume'

const props = defineProps({
  scale: {
    type: Number,
    default: 1
  }
})

const resumeStore = useResumeStore()
const resumeData = computed(() => resumeStore.resumeData)
const globalSettings = computed(() => resumeStore.globalSettings)

const previewStyle = computed(() => {
  const layout = globalSettings.value?.layout || {}
  const theme = globalSettings.value?.theme || {}

  return {
    transform: `scale(${props.scale})`,
    transformOrigin: 'top left',
    '--primary-color': theme.primary || '#2c3e50',
    '--secondary-color': theme.secondary || '#3498db',
    '--accent-color': theme.accent || '#e74c3c',
    '--text-primary': theme.textPrimary || '#333333',
    '--background-color': theme.background || '#ffffff',
    '--border-color': theme.border || '#e0e0e0',
    '--column-gap': layout.columnGap ? `${layout.columnGap}px` : '20px'
  }
})

const layoutClasses = computed(() => {
  const layout = globalSettings.value?.layout || {}
  return {
    'layout-horizontal': layout.orientation === 'horizontal',
    'layout-vertical': layout.orientation !== 'horizontal',
    [`columns-${layout.columns || 1}`]: layout.orientation === 'horizontal',
    [`align-${layout.alignment || 'left'}`]: true,
    [`title-align-${layout.titleAlignment || 'left'}`]: true
  }
})

const contentLayoutClass = computed(() => {
  const layout = globalSettings.value?.layout || {}
  if (layout.orientation === 'horizontal') {
    return `horizontal-layout columns-${layout.columns || 2}`
  }
  return 'vertical-layout'
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

// 获取技能等级对应的宽度百分比
const getSkillWidth = (level) => {
  const levelMap = {
    '初级': '30%',
    '中级': '60%',
    '高级': '90%',
    '专家': '100%'
  }
  return levelMap[level] || '50%'
}
</script>

<style scoped>
.resume-preview {
  width: 210mm;
  height: 297mm; /* 固定A4高度 */
  min-height: 297mm; /* 确保最小高度 */
  background: var(--background-color, white);
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;

  /* 优化字体设置，确保跨平台一致性 */
  font-family: 'Segoe UI', 'Microsoft YaHei', '微软雅黑', 'SimSun', '宋体', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.5; /* 优化行间距 */
  letter-spacing: 0.01em; /* 轻微增加字符间距 */
  word-spacing: 0.02em; /* 优化单词间距 */
  color: var(--text-primary, #333);

  /* 字体渲染优化 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;

  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  /* 确保A4比例 */
  aspect-ratio: 210/297;

  /* 响应式处理 */
  box-sizing: border-box;
}

/* 布局相关样式 */
.resume-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1; /* 占满剩余空间 */
  min-height: 0; /* 允许flex收缩 */
}

.horizontal-layout {
  display: grid;
  gap: var(--column-gap, 20px);
  align-items: start;
  flex: 1;
  min-height: 200px; /* 确保横向布局有最小高度 */
}

.horizontal-layout.columns-2 {
  grid-template-columns: 1fr 1fr;
}

.horizontal-layout.columns-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.horizontal-layout.columns-4 {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.vertical-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 200px; /* 确保纵向布局有最小高度 */
}

/* 对齐方式 */
.align-left .section-content {
  text-align: left;
}

.align-center .section-content {
  text-align: center;
}

.align-right .section-content {
  text-align: right;
}

.title-align-left .section-title {
  text-align: left;
}

.title-align-center .section-title {
  text-align: center;
}

.title-align-right .section-title {
  text-align: right;
}

/* 个人信息部分 */
.resume-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--primary-color, #409eff);
  min-height: 120px; /* 确保头部有最小高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.personal-info .name {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color, #409eff);
  margin: 0 0 8px 0;
  text-align: center;
  min-height: 40px; /* 确保姓名区域有最小高度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.personal-info .target-position {
  font-size: 18px;
  font-weight: 500;
  color: var(--secondary-color, #666);
  margin: 0 0 15px 0;
  text-align: center;
  font-style: italic;
  min-height: 25px; /* 确保职位区域有最小高度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  min-height: 30px; /* 确保联系信息区域有最小高度 */
  align-items: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

.contact-icon {
  font-size: 16px;
}

/* 章节样式 */
.resume-section {
  margin-bottom: 25px;
  min-height: 60px; /* 确保每个section有最小高度 */
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color, #409eff);
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color, #e4e7ed);
  position: relative;
  flex-shrink: 0; /* 防止标题被压缩 */
}

.section-title::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50px;
  height: 2px;
  background: var(--primary-color, #409eff);
}

.section-content {
  padding-left: 10px;
  flex: 1;
  min-height: 30px; /* 确保内容区域有最小高度 */
}

/* 个人简介 */
.summary-text {
  font-size: 15px;
  line-height: 1.7;
  color: #555;
  margin: 0;
  text-align: justify;
  min-height: 50px; /* 确保简介区域有最小高度 */
  display: flex;
  align-items: flex-start;
}

/* 工作经历 */
.experience-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.experience-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.experience-title .position {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.experience-title .company {
  font-size: 16px;
  font-weight: 500;
  color: #666;
  margin: 0;
}

.experience-date {
  font-size: 14px;
  color: #888;
  white-space: nowrap;
  margin-left: 20px;
}

.experience-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.location-icon {
  font-size: 14px;
}

.experience-description {
  margin-bottom: 10px;
}

.experience-description p {
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.experience-achievements ul {
  margin: 0;
  padding-left: 20px;
}

.experience-achievements li {
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
}

/* 教育背景 */
.education-item {
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.education-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.education-title .degree {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 2px 0;
}

.education-title .school {
  font-size: 15px;
  font-weight: 500;
  color: #666;
  margin: 0 0 2px 0;
}

.education-title .major {
  font-size: 14px;
  color: #888;
}

.education-date {
  font-size: 14px;
  color: #888;
  white-space: nowrap;
  margin-left: 20px;
}

.education-gpa,
.education-honors {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 技能特长 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.skill-level {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skill-bar {
  flex: 1;
  height: 6px;
  background: #e4e7ed;
  border-radius: 3px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #66b3ff);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.skill-level-text {
  font-size: 12px;
  color: #666;
  min-width: 40px;
}

/* 项目经历 */
.project-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.project-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.project-title .project-name {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.project-title .project-role {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.project-date {
  font-size: 14px;
  color: #888;
  white-space: nowrap;
  margin-left: 20px;
}

.project-description {
  margin-bottom: 10px;
}

.project-description p {
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.project-technologies {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tech-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.tech-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tech-tag {
  background: #f0f2f5;
  color: #409eff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.project-links {
  display: flex;
  gap: 15px;
}

.project-link {
  font-size: 14px;
  color: #409eff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.project-link:hover {
  text-decoration: underline;
}

/* 占位内容样式 */
.placeholder-content {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px dashed var(--border-color, #e4e7ed);
  border-radius: 6px;
  margin: 10px 0;
}

.placeholder-text {
  color: #999;
  font-size: 14px;
  font-style: italic;
  margin: 0;
  text-align: center;
}

/* 空白状态优化 */
.resume-preview:not(:has(.experience-item)):not(:has(.education-item)):not(:has(.skill-item)):not(:has(.project-item)) .resume-content {
  min-height: 400px;
}

/* 确保各个section在空白状态下的最小高度 */
.resume-section:has(.placeholder-content) {
  min-height: 80px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .resume-preview {
    padding: 20px;
  }

  .personal-info .name {
    font-size: 28px;
  }

  .contact-info {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .experience-header,
  .education-header,
  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .experience-date,
  .education-date,
  .project-date {
    margin-left: 0;
    margin-top: 4px;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }
}

/* 打印样式 - 简化版，保持与屏幕显示的一致性 */
@media print {
  /* 避免组件固定尺寸干扰打印，交由 @page 控制 */
  .resume-preview {
    width: auto !important;
    height: auto !important;
    min-height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    background: white !important;
    overflow: visible !important;
    page-break-inside: avoid !important;
    letter-spacing: normal !important;
    word-spacing: normal !important;
    line-height: normal !important;
  }

  /* 个人信息部分 - 保持原有样式 */
  .resume-header {
    page-break-after: avoid !important;
  }

  .personal-info .name {
    color: var(--primary-color, #409eff) !important;
  }

  .personal-info .target-position {
    color: var(--secondary-color, #666) !important;
  }

  /* 章节样式 - 保持原有外观 */
  .section-title {
    color: var(--primary-color, #409eff) !important;
    page-break-after: avoid !important;
  }

  .section-title::before {
    background: var(--primary-color, #409eff) !important;
  }

  .resume-section {
    page-break-inside: avoid !important;
  }

  /* 基本内容样式 - 保持原有外观 */
  .experience-item,
  .education-item,
  .project-item {
    page-break-inside: avoid !important;
  }

  /* 隐藏占位内容 */
  .placeholder-content {
    display: none !important;
  }
}
</style>
