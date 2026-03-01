<template>
  <div class="marketing-template" :style="templateStyles">
    <div class="resume-container">
      
      <!-- 极具张力的页眉设计 -->
      <header class="hero-section">
        <div class="hero-content">
          <div class="hero-left">
            <h1 class="name">{{ resumeData.personalInfo?.name || 'MARKETING PRO' }}</h1>
            <h2 class="title">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Marketing Director & Growth Strategies' }}</h2>
          </div>
          <div class="hero-right" v-if="resumeData.personalInfo?.photo">
            <img :src="resumeData.personalInfo.photo" alt="Photo" class="hero-avatar"/>
          </div>
        </div>
        <div class="contact-bar">
          <span v-if="resumeData.personalInfo?.phone">{{ resumeData.personalInfo.phone }}</span>
          <span v-if="resumeData.personalInfo?.email" class="dot">•</span>
          <span v-if="resumeData.personalInfo?.email">{{ resumeData.personalInfo.email }}</span>
          <span v-if="resumeData.personalInfo?.website" class="dot">•</span>
          <span v-if="resumeData.personalInfo?.website">{{ resumeData.personalInfo.website }}</span>
          <span v-if="resumeData.personalInfo?.address" class="dot">•</span>
          <span v-if="resumeData.personalInfo?.address">{{ resumeData.personalInfo.address }}</span>
        </div>
      </header>

      <!-- 双栏排版区 -->
      <div class="grid-layout">
        
        <!-- 左侧大幅内容 -->
        <main class="main-column">
          <!-- 个人总结 (Elevator Pitch) -->
          <section class="module" v-if="resumeData.summary">
            <h3 class="module-title">ELEVATOR PITCH</h3>
            <p class="summary-text">{{ resumeData.summary }}</p>
          </section>

          <!-- 核心战役 / 过往经历 -->
          <section class="module" v-if="resumeData.workExperience?.length">
            <h3 class="module-title">MAJOR CAMPAIGNS & EXPERIENCE</h3>
            <div class="experience-block" v-for="work in resumeData.workExperience" :key="work.id">
              <div class="exp-header">
                <div>
                  <h4 class="job-role">{{ work.position }}</h4>
                  <h5 class="company">{{ work.company }}</h5>
                </div>
                <div class="exp-date">{{ work.startDate }} / {{ work.endDate }}</div>
              </div>
              <p class="exp-desc" v-if="work.description">{{ work.description }}</p>
              
              <!-- 核心数据指标 (Metrics) 作为重点展示 -->
              <div class="metrics-grid" v-if="work.achievements?.length">
                <div class="metric-item" v-for="(ach, idx) in work.achievements" :key="idx">
                  <span class="check-icon">✓</span>
                  <span>{{ ach }}</span>
                </div>
              </div>
            </div>
          </section>

        </main>

        <!-- 右侧边栏 -->
        <aside class="side-column">
          
          <!-- 核心竞争力 -->
          <section class="side-module" v-if="resumeData.skills?.length">
            <h3 class="side-title">CORE EXPERTISE</h3>
            <div class="tags-container">
              <span class="skill-tag bold-tag" v-for="skill in resumeData.skills" :key="skill.name">
                {{ skill.name }}
              </span>
            </div>
          </section>

          <!-- 成功案例 / 项目 -->
          <section class="side-module" v-if="resumeData.projects?.length">
            <h3 class="side-title">KEY PROJECTS</h3>
            <div class="project-card" v-for="project in resumeData.projects" :key="project.id">
              <h4 class="proj-name">{{ project.name }}</h4>
              <p class="proj-desc" v-if="project.description">{{ project.description }}</p>
              <div class="proj-date">{{ project.startDate }} - {{ project.endDate }}</div>
            </div>
          </section>

          <!-- 教育经历 -->
          <section class="side-module" v-if="resumeData.education?.length">
            <h3 class="side-title">EDUCATION</h3>
            <div class="edu-card" v-for="edu in resumeData.education" :key="edu.id">
              <h4 class="edu-degree">{{ edu.degree }}</h4>
              <p class="edu-major">{{ edu.major }}</p>
              <p class="edu-school">{{ edu.school }}</p>
              <div class="edu-year">{{ edu.endDate }}</div>
            </div>
          </section>

        </aside>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateId: {
    type: String,
    default: 'marketing'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.marketing-template {
  /* 现代、时尚、具有冲击力的排版 */
  font-family: 'Oswald', 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
  background: var(--background-color, #ffffff);
  color: var(--text-color, #1a1a1a);
  line-height: 1.5;
  font-size: 13px;
}

.resume-container {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* 卡片投影 */
  overflow: hidden;
}

/* 巨幅页眉 */
.hero-section {
  background: #111111; /* 黑底色带来高级视觉感 */
  color: #ffffff;
  padding: 40px 30px 20px 30px;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #f1c40f; /* 亮黄色点缀 */
  padding-bottom: 25px;
  margin-bottom: 20px;
}

.hero-left {
  flex: 1;
}

.name {
  font-size: 38px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 5px 0;
  line-height: 1.1;
}

.title {
  font-size: 18px;
  font-weight: 500;
  color: #f1c40f; /* 亮黄色职业描述 */
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.hero-right {
  margin-left: 20px;
}

.hero-avatar {
  width: 90px;
  height: 90px;
  border-radius: 4px; /* 故意不用全圆，用略带棱角的方形状 */
  border: 2px solid #f1c40f;
  object-fit: cover;
}

.contact-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  font-size: 11px;
  font-family: 'Helvetica Neue', sans-serif;
  letter-spacing: 1px;
  color: #aaaaaa;
}

.contact-bar .dot {
  margin: 0 12px;
  color: #f1c40f;
}

/* 布局网格 */
.grid-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 0;
}

/* 左侧主视区 */
.main-column {
  padding: 30px;
}

.module {
  margin-bottom: 35px;
}

.module-title {
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
  color: #111;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
}

.module-title::before {
  content: "";
  display: inline-block;
  width: 15px;
  height: 15px;
  background: #f1c40f;
  margin-right: 10px;
}

.summary-text {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 13.5px;
  line-height: 1.8;
  color: #444;
  text-align: justify;
}

/* 经历块 */
.experience-block {
  margin-bottom: 25px;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.job-role {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
}

.company {
  font-size: 14px;
  font-weight: 600;
  color: #f39c12;
  margin: 0;
}

.exp-date {
  font-size: 11px;
  font-family: 'Helvetica Neue', sans-serif;
  color: #7f8c8d;
  font-weight: bold;
}

.exp-desc {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 12.5px;
  color: #555;
  margin: 0 0 10px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  font-family: 'Helvetica Neue', sans-serif;
}

.metric-item {
  background: #fdfbf7;
  padding: 8px 12px;
  border-left: 3px solid #111;
  font-size: 12px;
  color: #333;
  display: flex;
  align-items: flex-start;
}

.check-icon {
  color: #f39c12;
  font-weight: bold;
  margin-right: 8px;
}

/* 右侧边栏 */
.side-column {
  background: #f4f6f7;
  padding: 30px 25px;
  border-left: 1px solid #eef2f3;
}

.side-module {
  margin-bottom: 35px;
}

.side-title {
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  color: #111;
  border-bottom: 2px solid #111;
  padding-bottom: 5px;
  margin-bottom: 15px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bold-tag {
  background: #111;
  color: #fff;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.project-card, .edu-card {
  margin-bottom: 15px;
}

.proj-name, .edu-degree {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 3px 0;
  color: #111;
}

.proj-desc, .edu-major, .edu-school {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 12px;
  color: #555;
  margin: 0 0 3px 0;
}

.proj-date, .edu-year {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 10px;
  color: #999;
  font-weight: bold;
}

@media print {
  .resume-container {
    box-shadow: none;
  }
}
</style>
