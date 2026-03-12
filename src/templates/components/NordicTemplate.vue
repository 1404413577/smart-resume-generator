<template>
  <div class="nordic-template" :style="templateStyles">
    
    <aside class="nordic-sidebar">
      <div class="profile-section">
        <div class="avatar" v-if="resumeData.personalInfo?.photo">
          <img :src="resumeData.personalInfo.photo" alt="Profile" />
        </div>
        <h1 class="name">{{ resumeData.personalInfo?.name || 'Your Name' }}</h1>
        <h2 class="role">{{ resumeData.personalInfo?.targetPosition || 'Job Title' }}</h2>
      </div>

      <div class="sidebar-block contact-block">
        <h3 class="side-title">CONTACT</h3>
        <ul class="contact-list">
          <li v-if="resumeData.personalInfo?.phone">
            <i>📱</i> {{ resumeData.personalInfo.phone }}
          </li>
          <li v-if="resumeData.personalInfo?.email">
            <i>✉️</i> {{ resumeData.personalInfo.email }}
          </li>
          <li v-if="resumeData.personalInfo?.address">
            <i>📍</i> {{ resumeData.personalInfo.address }}
          </li>
          <li v-if="resumeData.personalInfo?.website">
            <i>🔗</i> {{ resumeData.personalInfo.website }}
          </li>
        </ul>
      </div>

      <div class="sidebar-block" v-if="resumeData.skills?.length">
        <h3 class="side-title">SKILLS</h3>
        <div class="skill-tags">
          <span class="n-tag" v-for="skill in resumeData.skills" :key="skill.name">
            {{ skill.name }}
          </span>
        </div>
      </div>
      
      <div class="sidebar-block" v-if="resumeData.education?.length">
        <h3 class="side-title">EDUCATION</h3>
        <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
          <div class="edu-year">{{ edu.endDate }}</div>
          <div class="edu-degree">{{ edu.degree }}</div>
          <div class="edu-school">{{ edu.school }}</div>
        </div>
      </div>
    </aside>

    <main class="nordic-main">
      
      <section class="main-section" v-if="resumeData.summary">
        <h3 class="main-title">PROFILE</h3>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </section>

      <section class="main-section" v-if="resumeData.workExperience?.length">
        <h3 class="main-title">EXPERIENCE</h3>
        <div class="n-item" v-for="work in resumeData.workExperience" :key="work.id">
          <div class="n-item-header">
            <h4 class="n-item-title">{{ work.position }}</h4>
            <span class="n-item-date">{{ work.startDate }} — {{ work.endDate }}</span>
          </div>
          <div class="n-item-subtitle">{{ work.company }}</div>
          <p class="n-item-desc" v-if="work.description">{{ work.description }}</p>
          <ul class="n-item-bullets" v-if="work.achievements?.length">
            <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
          </ul>
        </div>
      </section>

      <section class="main-section" v-if="resumeData.projects?.length">
        <h3 class="main-title">PROJECTS</h3>
        <div class="n-item" v-for="project in resumeData.projects" :key="project.id">
          <div class="n-item-header">
            <h4 class="n-item-title">{{ project.name }}</h4>
            <span class="n-item-date">{{ project.endDate }}</span>
          </div>
          <p class="n-item-desc">{{ project.description }}</p>
          <div class="proj-techs" v-if="project.technologies?.length">
            <span class="tech-text" v-for="tech in project.technologies" :key="tech">#{{ tech }}</span>
          </div>
        </div>
      </section>

    </main>
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
    default: 'nordic'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');

.nordic-template {
  --n-bg-main: #ffffff;
  --n-bg-side: #f4f4f5;
  --n-text-dark: #18181b;
  --n-text-muted: #71717a;
  --n-accent: #27272a;
  --n-border: #e4e4e7;

  font-family: 'Inter', sans-serif;
  background-color: var(--n-bg-main);
  color: var(--n-text-dark);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Sidebar */
.nordic-sidebar {
  width: 32%;
  background-color: var(--n-bg-side);
  padding: 50px 30px;
  box-sizing: border-box;
}

.profile-section {
  text-align: center;
  margin-bottom: 40px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 20px auto;
  border: 3px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 5px 0;
  letter-spacing: -0.5px;
}

.role {
  font-size: 14px;
  font-weight: 400;
  color: var(--n-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.sidebar-block {
  margin-bottom: 35px;
}

.side-title {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--n-accent);
  margin: 0 0 15px 0;
  border-bottom: 1px solid var(--n-border);
  padding-bottom: 8px;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
}

.contact-list li {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--n-text-dark);
  word-break: break-all;
}

.contact-list i {
  font-style: normal;
  opacity: 0.7;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.n-tag {
  background-color: #e4e4e7;
  color: var(--n-text-dark);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 600;
}

.edu-item {
  margin-bottom: 15px;
}

.edu-year {
  font-size: 12px;
  color: var(--n-text-muted);
  margin-bottom: 2px;
}

.edu-degree {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 2px;
}

.edu-school {
  font-size: 13px;
  color: var(--n-text-muted);
}

/* Main Content */
.nordic-main {
  flex: 1;
  padding: 50px 40px;
  box-sizing: border-box;
}

.main-section {
  margin-bottom: 40px;
}

.main-title {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: var(--n-accent);
  margin: 0 0 20px 0;
  position: relative;
  display: inline-block;
}

.main-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background-color: var(--n-accent);
}

.summary-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--n-text-muted);
  margin: 0;
  text-align: justify;
}

.n-item {
  margin-bottom: 25px;
}

.n-item:last-child {
  margin-bottom: 0;
}

.n-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.n-item-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.n-item-date {
  font-size: 13px;
  color: var(--n-text-muted);
  font-weight: 600;
}

.n-item-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: var(--n-text-muted);
  margin-bottom: 8px;
}

.n-item-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--n-text-muted);
  margin: 0 0 10px 0;
}

.n-item-bullets {
  margin: 0;
  padding-left: 18px;
  color: var(--n-text-muted);
  font-size: 14px;
  line-height: 1.6;
}

.n-item-bullets li {
  margin-bottom: 6px;
}

.proj-techs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.tech-text {
  font-size: 12px;
  color: var(--n-text-dark);
  font-weight: 600;
  opacity: 0.6;
}
</style>