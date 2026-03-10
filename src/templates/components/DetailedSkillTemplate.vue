<template>
  <div class="detailed-skill-template" :style="templateStyles">
    <div class="resume-container">
      
      <!-- 头部个人信息 -->
      <header class="header-section">
        <div class="header-main">
          <h1 class="name">{{ resumeData.personalInfo?.name || '姓名' }}</h1>
          <h2 class="title" v-if="resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title">
            {{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title }}
          </h2>
        </div>
        <div class="contact-box">
          <div class="contact-row">
            <span class="contact-item" v-if="resumeData.personalInfo?.phone">
              <i class="icon">📱</i>{{ resumeData.personalInfo.phone }}
            </span>
            <span class="contact-item" v-if="resumeData.personalInfo?.email">
              <i class="icon">✉️</i>{{ resumeData.personalInfo.email }}
            </span>
          </div>
          <div class="contact-row" v-if="resumeData.personalInfo?.address || resumeData.personalInfo?.website">
            <span class="contact-item" v-if="resumeData.personalInfo?.address">
              <i class="icon">🏠</i>{{ resumeData.personalInfo.address }}
            </span>
            <span class="contact-item" v-if="resumeData.personalInfo?.website">
              <i class="icon">🔗</i>{{ resumeData.personalInfo.website }}
            </span>
          </div>
        </div>
      </header>

      <!-- 主要内容动态渲染 -->
      <div class="main-content">
        <template v-for="sectionKey in orderedMainSections" :key="sectionKey">
          
          <!-- 个人简介 -->
          <section v-if="sectionKey === 'summary' && resumeData.summary" class="resume-section summary-section">
            <h3 class="section-title">个人主页 / 自评<span class="title-line"></span></h3>
            <div class="summary-text-box">
              <p class="summary-text">{{ resumeData.summary }}</p>
            </div>
          </section>

          <!-- ★ 核心修改点：专业技能变更为长句列表 ★ -->
          <section v-else-if="sectionKey === 'skills' && resumeData.skills?.length" class="resume-section skills-section">
            <h3 class="section-title">专业技能<span class="title-line"></span></h3>
            <ul class="detailed-skill-list">
              <li v-for="skill in resumeData.skills" :key="skill.name">
                <div class="skill-content">
                  <!-- 如果有特地写了熟悉程度（比如熟练、精通），我们可以当做加粗标签前置渲染 -->
                  <span class="skill-level-badge" v-if="skill.level && isTypicalLevel(skill.level)">
                    【{{ skill.level }}】
                  </span>
                  <!-- 主体描述 -->
                  <span class="skill-desc">{{ skill.name }}</span>
                  <!-- 如果 Level 写的是非典型熟练度，而更像是另一个补充说明，附在后头 -->
                  <span class="skill-desc-append" v-if="skill.level && !isTypicalLevel(skill.level)">
                    - {{ skill.level }}
                  </span>
                </div>
              </li>
            </ul>
          </section>

          <!-- 工作经历 -->
          <section v-else-if="sectionKey === 'workExperience' && resumeData.workExperience?.length" class="resume-section experience-section">
            <h3 class="section-title">工作经历<span class="title-line"></span></h3>
            <div
              v-for="work in resumeData.workExperience"
              :key="work.id"
              class="work-item"
            >
              <div class="item-header">
                <span class="item-company">{{ work.company }}</span>
                <span class="item-position">{{ work.position }}</span>
                <span class="item-date">{{ work.startDate }} - {{ work.endDate }}</span>
                <span class="item-location" v-if="work.location">{{ work.location }}</span>
              </div>
              <div class="item-body">
                <p class="item-desc" v-if="work.description">
                  <strong>工作描述：</strong>{{ work.description }}
                </p>
                <div class="item-achievements" v-if="work.achievements?.length">
                  <strong>主要业绩：</strong>
                  <ul class="achievement-list">
                    <li v-for="achi in work.achievements" :key="achi">{{ achi }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <!-- 项目经历 -->
          <section v-else-if="sectionKey === 'projects' && resumeData.projects?.length" class="resume-section projects-section">
            <h3 class="section-title">项目经历<span class="title-line"></span></h3>
            <div
              v-for="project in resumeData.projects"
              :key="project.id"
              class="project-item"
            >
              <div class="item-header">
                <span class="item-company">{{ project.name }}</span>
                <span class="item-position" v-if="project.role">{{ project.role }}</span>
                <span class="item-date">{{ project.startDate }} - {{ project.endDate }}</span>
              </div>
              <div class="item-body">
                <p class="item-desc">{{ project.description }}</p>
                <div class="tech-stack" v-if="project.technologies?.length">
                  <strong>技术栈：</strong>
                  <span class="tech-badge" v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 教育背景 -->
          <section v-else-if="sectionKey === 'education' && resumeData.education?.length" class="resume-section education-section">
            <h3 class="section-title">教育背景<span class="title-line"></span></h3>
            <div
              v-for="edu in resumeData.education"
              :key="edu.id"
              class="edu-item"
            >
              <div class="item-header">
                <span class="item-company">{{ edu.school }}</span>
                <span class="item-position">{{ edu.degree }} | {{ edu.major }}</span>
                <span class="item-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
              </div>
              <div class="item-body" v-if="edu.description || edu.honors">
                <p class="item-desc">{{ edu.description }} <span v-if="edu.honors" class="honors">荣誉：{{ edu.honors }}</span></p>
              </div>
            </div>
          </section>

        </template>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'
import { useResumeStore } from '@stores/resume'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateId: {
    type: String,
    default: 'detailed'
  }
})

const resumeStore = useResumeStore()

// 获取排序后的主要章节
const orderedMainSections = computed(() => {
  return (resumeStore.sectionOrder || []).filter(section => section !== 'personalInfo')
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

// 判断等级字段是否是一个典型的“熟练度”小词语
const isTypicalLevel = (lvl) => {
  const t = (lvl || '').trim()
  return ['了解', '熟悉', '掌握', '熟练', '精通', '专家'].includes(t)
}
</script>

<style scoped>
.detailed-skill-template {
  font-family: var(--font-family, 'PingFang SC', 'Microsoft YaHei', sans-serif);
  background: var(--background-color, #ffffff);
  color: var(--text-color, #333333);
  font-size: 14px;
  line-height: 1.6;
}

.resume-container {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 45px 50px;
  background: #ffffff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  box-sizing: border-box;
}

/* 头部样式 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--primary-color, #2b6cb0);
  margin-bottom: 30px;
}

.header-main {
  flex: 1;
}

.name {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color, #2b6cb0);
  margin: 0 0 5px 0;
  letter-spacing: 2px;
}

.title {
  font-size: 16px;
  color: var(--text-color, #4a5568);
  margin: 0;
  font-weight: 500;
}

.contact-box {
  text-align: right;
  font-size: 13px;
  color: var(--secondary-color, #718096);
}

.contact-row {
  margin-top: 5px;
}

.contact-item {
  margin-left: 15px;
  display: inline-flex;
  align-items: center;
}

.icon {
  margin-right: 4px;
  font-style: normal;
}

/* 通用章节样式 */
.resume-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color, #2b6cb0);
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.title-line {
  flex: 1;
  height: 1px;
  background: var(--border-color, #e2e8f0);
  margin-left: 15px;
  margin-top: 4px;
}

/* 个人评价 */
.summary-text-box {
  background: var(--background-secondary, #f7fafc);
  padding: 15px 20px;
  border-radius: 4px;
  border-left: 3px solid var(--primary-color, #2b6cb0);
}

.summary-text {
  margin: 0;
  color: var(--text-color, #2d3748);
  font-size: 14px;
  text-align: justify;
  line-height: 1.7;
}

/* ★ 技能列表（长句核心） ★ */
.detailed-skill-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: square;
  color: var(--primary-color, #2b6cb0);
}

.detailed-skill-list li {
  margin-bottom: 10px;
}

.skill-content {
  color: var(--text-color, #2d3748);
  line-height: 1.6;
}

.skill-level-badge {
  font-weight: 700;
  color: var(--primary-color, #2b6cb0);
}

.skill-desc {
  font-weight: 400;
}

.skill-desc-append {
  color: var(--secondary-color, #718096);
}

/* 履历项目通用样式 */
.work-item, .project-item, .edu-item {
  margin-bottom: 20px;
}

.work-item:last-child, .project-item:last-child, .edu-item:last-child {
  margin-bottom: 0;
}

.item-header {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  margin-bottom: 8px;
}

.item-company {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-color, #1a202c);
  margin-right: 15px;
}

.item-position {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color, #2b6cb0);
  flex: 1; /* 撑开中间，将date推向右侧 */
}

.item-date {
  font-size: 13px;
  color: var(--secondary-color, #718096);
  text-align: right;
  margin-left: 10px;
}

.item-location {
  font-size: 12px;
  color: var(--secondary-color, #a0aec0);
  margin-left: 10px;
}

.item-body {
  padding-left: 5px;
}

.item-desc {
  margin: 0 0 6px 0;
  color: var(--text-color, #4a5568);
  line-height: 1.6;
}

.item-achievements {
  color: var(--text-color, #4a5568);
}

.achievement-list {
  margin: 4px 0 0 0;
  padding-left: 20px;
  list-style-type: disc;
}

.achievement-list li {
  margin-bottom: 4px;
}

/* 技术栈微调 */
.tech-stack {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-color, #4a5568);
}

.tech-badge {
  display: inline-block;
  background: var(--background-secondary, #edf2f7);
  padding: 2px 8px;
  margin-right: 6px;
  margin-bottom: 4px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--primary-color, #2b6cb0);
}

.honors {
  display: inline-block;
  margin-left: 10px;
  color: var(--accent-color, #dd6b20);
  font-size: 13px;
}
</style>
