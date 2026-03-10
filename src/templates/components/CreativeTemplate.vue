<template>
  <div class="creative-pro-template" :style="templateStyles">
    <!-- Abstract Background Decor -->
    <div class="abstract-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>

    <!-- Main Resumé Grid -->
    <div class="creative-grid">
      
      <!-- Left Column / Aside -->
      <aside class="creative-aside">
        <div class="profile-section glass-card">
          <div class="avatar-wrapper" :class="resumeData.personalInfo?.photoPosition || 'center'" v-if="resumeData.personalInfo?.photo">
            <img :src="resumeData.personalInfo.photo" alt="Profile" class="avatar" />
            <div class="avatar-ring"></div>
          </div>
          <h1 class="gradient-text profile-name">{{ resumeData.personalInfo?.name || 'Your Name' }}</h1>
          <h2 class="profile-title">{{ resumeData.personalInfo?.targetPosition || 'Creative Director' }}</h2>
          
          <div class="contact-info">
            <div class="contact-item" v-if="resumeData.personalInfo?.email">
              <span class="icon">@</span>
              <span class="text">{{ resumeData.personalInfo.email }}</span>
            </div>
            <div class="contact-item" v-if="resumeData.personalInfo?.phone">
              <span class="icon">#</span>
              <span class="text">{{ resumeData.personalInfo.phone }}</span>
            </div>
            <div class="contact-item" v-if="resumeData.personalInfo?.address">
              <span class="icon">📍</span>
              <span class="text">{{ resumeData.personalInfo.address }}</span>
            </div>
          </div>
        </div>

        <!-- Skills Section -->
        <div class="aside-section" v-if="resumeData.skills?.length">
          <h3 class="aside-title">Expertise</h3>
          <div class="skills-list">
            <div class="skill-item" v-for="skill in resumeData.skills.slice(0, 10)" :key="skill.id">
              <div class="skill-meta">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level-text">{{ skill.level }}</span>
              </div>
              <div class="skill-track">
                <div class="skill-fill" :style="{ width: getSkillPercentage(skill.level) }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Education Section -->
        <div class="aside-section" v-if="resumeData.education?.length">
          <h3 class="aside-title">Education</h3>
          <div class="edu-items">
            <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
              <div class="edu-year">{{ edu.endDate }}</div>
              <h4 class="edu-degree">{{ edu.degree }} in {{ edu.major }}</h4>
              <div class="edu-school">{{ edu.school }}</div>
            </div>
          </div>
        </div>

      </aside>

      <!-- Right Column / Main Content -->
      <main class="creative-main">
        
        <!-- About/Summary -->
        <section class="main-section" v-if="resumeData.summary">
          <h3 class="section-title">Hello <span>World</span>.</h3>
          <p class="summary-text">{{ resumeData.summary }}</p>
        </section>

        <!-- Experience -->
        <section class="main-section" v-if="resumeData.workExperience?.length">
          <h3 class="section-title">Experience <span>Journey</span></h3>
          <div class="timeline">
            <div class="timeline-item" v-for="(work, index) in resumeData.workExperience" :key="work.id">
              <div class="timeline-marker">
                <div class="marker-dot"></div>
                <div class="marker-line" v-if="index !== resumeData.workExperience.length - 1"></div>
              </div>
              <div class="timeline-content hover-card">
                <div class="timeline-header">
                  <h4 class="position">{{ work.position }}</h4>
                  <span class="date">{{ work.startDate }} — {{ work.endDate }}</span>
                </div>
                <div class="company">{{ work.company }}</div>
                <p class="description" v-if="work.description">{{ work.description }}</p>
                <ul class="achievements" v-if="work.achievements?.length">
                  <li v-for="(achievement, i) in work.achievements" :key="i">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Projects -->
        <section class="main-section" v-if="resumeData.projects?.length">
          <h3 class="section-title">Selected <span>Works</span></h3>
          <div class="projects-grid">
            <div class="project-card hover-card" v-for="project in resumeData.projects" :key="project.id">
              <div class="project-header">
                <h4 class="project-name">{{ project.name }}</h4>
                <div class="project-date">{{ project.endDate }}</div>
              </div>
              <p class="project-desc" v-if="project.description">{{ project.description }}</p>
              <div class="tags" v-if="project.technologies?.length || project.highlights?.length">
                <span class="tag" v-for="(tech, idx) in (project.technologies || project.highlights).slice(0, 4)" :key="idx">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateId: {
    type: String,
    default: 'creative'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const getSkillPercentage = (level) => {
  const map = {
    'expert': '100%',
    '精通': '100%',
    'advanced': '85%',
    '熟练': '85%',
    '良好': '70%',
    'intermediate': '70%',
    '一般': '50%',
    '了解': '30%',
    'beginner': '30%'
  }
  return map[level] || map[level?.toLowerCase()] || '80%'
}
</script>

<style scoped>
/* Variables for a vibrant, creative aesthetic */
.creative-pro-template {
  --c-bg: #0f172a;        /* Deep midnight */
  --c-surface: #1e293b;   /* Slightly lighter */
  --c-text: #f1f5f9;      /* Slate 100 */
  --c-text-muted: #94a3b8;/* Slate 400 */
  --c-primary: #8b5cf6;   /* Vivid violet */
  --c-secondary: #ec4899; /* Hot pink */
  --c-tertiary: #06b6d4;  /* Cyan */
  --c-border: rgba(255, 255, 255, 0.08);

  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  background-color: var(--c-bg);
  color: var(--c-text);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 40px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Abstract Background Shapes (Blobs) */
.abstract-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  filter: blur(100px);
  opacity: 0.4;
  border-radius: 50%;
  animation: float 10s ease-in-out infinite alternate;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: var(--c-primary);
  top: -100px;
  right: -100px;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: var(--c-secondary);
  bottom: 200px;
  left: -100px;
  animation-duration: 15s;
}

@keyframes float {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(30px) scale(1.05); }
}

/* Grid Layout */
.creative-grid {
  display: grid;
  grid-template-columns: 32% 1fr;
  gap: 40px;
  position: relative;
  z-index: 1; /* Above abstract shapes */
}

/* Glass Card Utility */
.glass-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--c-border);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 30px;
}

.hover-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-card:hover {
  transform: translateY(-4px);
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 10px 40px rgba(139, 92, 246, 0.15);
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, var(--c-tertiary), var(--c-primary), var(--c-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Aside Section */
.creative-aside {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.profile-section {
  text-align: center;
  padding: 40px 30px;
  position: relative;
}

.avatar-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
}

.avatar-wrapper.left {
  margin-left: 0;
  justify-content: flex-start;
}

.avatar-wrapper.right {
  margin-right: 0;
  justify-content: flex-end;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  border: 4px solid var(--c-surface);
}

.avatar-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-primary), var(--c-secondary));
  z-index: 1;
  animation: spin 8s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.profile-name {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.profile-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 24px 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--c-text);
  word-break: break-all;
}

.contact-item .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-primary);
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.aside-title {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 20px 0;
  color: var(--c-text);
  position: relative;
  padding-left: 12px;
}

.aside-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: var(--c-primary);
  border-radius: 2px;
}

/* Skills */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
}

.skill-name {
  font-weight: 500;
}

.skill-level-text {
  color: var(--c-text-muted);
  font-size: 12px;
}

.skill-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-tertiary), var(--c-primary));
  border-radius: 3px;
  transition: width 1s ease;
}

/* Education */
.edu-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.edu-item {
  position: relative;
}

.edu-year {
  font-size: 12px;
  color: var(--c-primary);
  font-weight: 600;
  margin-bottom: 4px;
}

.edu-degree {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.edu-school {
  font-size: 13px;
  color: var(--c-text-muted);
}

/* Main Content */
.creative-main {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 24px 0;
  letter-spacing: -1px;
}

.section-title span {
  color: var(--c-primary);
  /* Gradient Option */
  background: linear-gradient(135deg, var(--c-primary), var(--c-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.summary-text {
  font-size: 15px;
  line-height: 1.8;
  color: var(--c-text-muted);
  margin: 0;
  text-align: justify;
}

/* Timeline (Experience) */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-item {
  display: flex;
  gap: 20px;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12px;
  flex-shrink: 0;
  margin-top: 6px;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--c-primary);
  box-shadow: 0 0 10px var(--c-primary);
  z-index: 2;
}

.marker-line {
  flex: 1;
  width: 2px;
  background: rgba(139, 92, 246, 0.3); /* muted primary */
  margin-top: 4px;
  margin-bottom: -16px; /* connect to next dot */
}

.timeline-content {
  flex: 1;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.position {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: var(--c-text);
}

.date {
  font-size: 13px;
  color: var(--c-secondary);
  font-weight: 500;
  flex-shrink: 0;
}

.company {
  font-size: 14px;
  color: var(--c-tertiary);
  font-weight: 500;
  margin-bottom: 12px;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--c-text-muted);
  margin: 0 0 12px 0;
}

.achievements {
  list-style: none;
  padding: 0;
  margin: 0;
}

.achievements li {
  position: relative;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--c-text-muted);
  margin-bottom: 6px;
}

.achievements li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--c-primary);
  font-size: 16px;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.project-card {
  display: flex;
  flex-direction: column;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.project-name {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: var(--c-text);
}

.project-date {
  font-size: 12px;
  color: var(--c-tertiary);
}

.project-desc {
  font-size: 13px;
  color: var(--c-text-muted);
  line-height: 1.6;
  flex: 1;
  margin: 0 0 16px 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-text);
  border: 1px solid var(--c-border);
}

/* Responsive Handling */
@media (max-width: 768px) {
  .creative-pro-template {
    width: 100%;
    padding: 20px;
    height: auto;
  }
  
  .creative-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
