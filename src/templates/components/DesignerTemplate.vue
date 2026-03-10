<template>
  <div class="designer-editorial-template" :style="templateStyles">
    <!-- Top Bar with Contacts -->
    <div class="top-bar">
      <div class="contact-links">
        <span class="contact-item" v-if="resumeData.personalInfo?.email">{{ resumeData.personalInfo.email }}</span>
        <span class="contact-item" v-if="resumeData.personalInfo?.phone">{{ resumeData.personalInfo.phone }}</span>
        <span class="contact-item" v-if="resumeData.personalInfo?.website">{{ resumeData.personalInfo.website }}</span>
      </div>
      <div class="role-label">{{ resumeData.personalInfo?.targetPosition || 'Creative Designer' }}</div>
    </div>

    <!-- Hero Section -->
    <header class="hero">
      <div class="hero-left">
        <h1 class="hero-name">
          <span class="name-line" v-for="(part, index) in splitName(resumeData.personalInfo?.name || 'Designer')" :key="index">
            {{ part }}
          </span>
        </h1>
      </div>
      <div class="hero-right" v-if="resumeData.personalInfo?.photo">
        <div class="image-wrapper">
          <img :src="resumeData.personalInfo.photo" alt="Portrait" class="portrait" />
          <div class="image-overlay"></div>
        </div>
      </div>
    </header>

    <!-- Summary (Big Typography) -->
    <section class="summary-section" v-if="resumeData.summary">
      <div class="section-label">01 // Profile</div>
      <p class="summary-text">{{ resumeData.summary }}</p>
    </section>

    <div class="two-col-layout">
      <!-- Left Column: Portfolio & Experience -->
      <div class="col-main">
        <!-- Selected Works -->
        <section class="portfolio-section" v-if="resumeData.projects?.length">
          <div class="section-label">02 // Selected Works</div>
          <div class="works-list">
            <div class="work-item" v-for="(project, index) in resumeData.projects" :key="project.id">
              <div class="work-number">
                N°{{ String(index + 1).padStart(2, '0') }}
              </div>
              <div class="work-details">
                <div class="work-header">
                  <h3 class="work-title">{{ project.name }}</h3>
                  <span class="work-year">{{ project.endDate }}</span>
                </div>
                <p class="work-desc">{{ project.description }}</p>
                <div class="work-tags" v-if="project.technologies?.length">
                  <span class="w-tag" v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Experience -->
        <section class="experience-section" v-if="resumeData.workExperience?.length">
          <div class="section-label">03 // Experience</div>
          <div class="exp-list">
            <div class="exp-item" v-for="work in resumeData.workExperience" :key="work.id">
              <div class="exp-meta">
                <span class="exp-date">{{ work.startDate }} — {{ work.endDate }}</span>
                <span class="exp-company">{{ work.company }}</span>
              </div>
              <div class="exp-body">
                <h4 class="exp-role">{{ work.position }}</h4>
                <p class="exp-desc" v-if="work.description">{{ work.description }}</p>
                <ul class="exp-achievements" v-if="work.achievements?.length">
                  <li v-for="(achieve, i) in work.achievements" :key="i">{{ achieve }}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Skills, Education -->
      <div class="col-sidebar">
        <!-- Expertise -->
        <section class="skills-section" v-if="resumeData.skills?.length">
          <div class="section-label">04 // Expertise</div>
          <div class="skills-container">
            <div class="skill-row" v-for="skill in resumeData.skills" :key="skill.id">
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-line"></div>
              <span class="skill-level">{{ skill.level }}</span>
            </div>
          </div>
        </section>

        <!-- Education -->
        <section class="education-section" v-if="resumeData.education?.length">
          <div class="section-label">05 // Education</div>
          <div class="edu-list">
            <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
              <div class="edu-year">{{ edu.endDate }}</div>
              <h4 class="edu-degree">{{ edu.degree }}</h4>
              <div class="edu-major">{{ edu.major }}</div>
              <div class="edu-school">{{ edu.school }}</div>
            </div>
          </div>
        </section>

        <!-- Languages or other info -->
        <section class="languages-section" v-if="resumeData.languages?.length">
          <div class="section-label">06 // Languages</div>
          <div class="lang-list">
            <div class="lang-item" v-for="lang in resumeData.languages" :key="lang.id">
              <span class="lang-name">{{ lang.name }}</span>
              <span class="lang-level">{{ lang.level }}</span>
            </div>
          </div>
        </section>
      </div>
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
    default: 'designer'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

// For the hero name, we split it into separate words/characters to stack them if desired
const splitName = (name) => {
  if (!name) return ['Design']
  // If it's Chinese characters (usually short), split into individual chars
  if (/[\u4e00-\u9fa5]/.test(name) && name.length <= 4) {
    return name.split('')
  }
  // If it's English, split by space
  return name.split(' ')
}
</script>

<style scoped>
/* 
  Editorial / Studio Designer Theme
  Aesthetic: High contrast, thick typography, minimalist grid, very premium.
*/
.designer-editorial-template {
  --d-bg: #f4f4f0;       /* Warm bone off-white */
  --d-text: #111111;     /* True black */
  --d-accent: #ff4a00;   /* Vibrant orange/red accent */
  --d-border: #111111;   /* Solid black borders */
  --d-gray: #767676;     /* Medium gray */

  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: var(--d-bg);
  color: var(--d-text);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 40px;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--d-border);
  padding-bottom: 15px;
  margin-bottom: 40px;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
}

.contact-links {
  display: flex;
  gap: 24px;
}

.contact-item:hover {
  color: var(--d-accent);
  cursor: pointer;
}

/* Hero Section */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
}

.hero-left {
  flex: 1;
}

.hero-name {
  margin: 0;
  font-size: 80px;
  font-weight: 900;
  line-height: 0.85;
  text-transform: uppercase;
  letter-spacing: -2px;
  display: flex;
  flex-direction: column;
}

.name-line {
  display: block;
}

/* Add accent color to the last part of the name */
.name-line:last-child {
  color: var(--d-accent);
}

.hero-right {
  width: 180px;
  height: 240px;
  flex-shrink: 0;
  margin-left: 40px;
  position: relative;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  /* subtle offset border effect */
  box-shadow: 15px 15px 0 var(--d-border);
}

.portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.2); /* High contrast B&W */
  transition: filter 0.5s ease;
}

.image-wrapper:hover .portrait {
  filter: grayscale(0%) contrast(1);
}

/* Common Section Label */
.section-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 24px;
  color: var(--d-gray);
  border-bottom: 1px solid var(--d-border);
  padding-bottom: 8px;
}

/* Summary */
.summary-section {
  margin-bottom: 60px;
}

.summary-text {
  font-family: 'Georgia', serif; /* Elegant serif for body copy contrast */
  font-size: 24px;
  line-height: 1.5;
  margin: 0;
  color: var(--d-text);
  max-width: 90%;
}

/* Two Column Layout */
.two-col-layout {
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  gap: 60px;
}

/* Works / Portfolio */
.works-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.work-item {
  display: flex;
  gap: 20px;
  group-hover: var(--d-accent);
}

.work-item:hover .work-number {
  color: var(--d-accent);
}

.work-number {
  font-size: 14px;
  font-weight: 700;
  color: var(--d-gray);
  width: 40px;
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.work-details {
  flex: 1;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.work-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

.work-year {
  font-size: 13px;
  font-weight: 600;
  color: var(--d-gray);
}

.work-desc {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  color: var(--d-text);
}

.work-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.w-tag {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid var(--d-border);
  padding: 4px 8px;
  border-radius: 20px;
}

.work-item:hover .w-tag {
  background-color: var(--d-border);
  color: var(--d-bg);
}

/* Experience */
.experience-section {
  margin-top: 60px;
}

.exp-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.exp-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exp-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  border-top: 1px solid var(--d-border);
  padding-top: 12px;
}

.exp-company {
  color: var(--d-accent);
}

.exp-body {
  margin-top: 4px;
}

.exp-role {
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
}

.exp-desc {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.exp-achievements {
  list-style: none;
  padding: 0;
  margin: 0;
}

.exp-achievements li {
  position: relative;
  padding-left: 16px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 6px;
  color: var(--d-gray);
}

.exp-achievements li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--d-border);
}

/* Sidebar: Skills, Edu, Lang */
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-row {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
}

.skill-name {
  color: var(--d-text);
  margin-right: 12px;
}

.skill-line {
  flex: 1;
  height: 1px;
  background-color: var(--d-gray);
  opacity: 0.3;
}

.skill-level {
  margin-left: 12px;
  color: var(--d-accent);
}

/* Education */
.education-section {
  margin-top: 40px;
}

.edu-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.edu-item {
  border-left: 2px solid var(--d-border);
  padding-left: 16px;
}

.edu-year {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--d-gray);
}

.edu-degree {
  font-size: 14px;
  font-weight: 800;
  margin: 0 0 4px 0;
  text-transform: uppercase;
}

.edu-major {
  font-size: 13px;
  color: var(--d-accent);
  margin-bottom: 4px;
  font-weight: 600;
}

.edu-school {
  font-size: 13px;
  color: var(--d-text);
}

/* Languages */
.languages-section {
  margin-top: 40px;
}

.lang-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lang-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
}

.lang-level {
  color: var(--d-gray);
}

/* Responsive Handling */
@media (max-width: 768px) {
  .designer-editorial-template {
    width: 100%;
    padding: 20px;
    height: auto;
  }
  
  .hero {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 30px;
  }

  .hero-right {
    margin-left: 0;
  }

  .hero-name {
    font-size: 50px;
  }

  .two-col-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
