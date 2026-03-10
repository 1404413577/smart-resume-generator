<template>
  <div class="tech-modern-template" :style="templateStyles">
    <!-- Header -->
    <header class="tech-header">
      <div class="header-main">
        <h1 class="dev-name">{{ resumeData.personalInfo?.name || 'Developer Name' }}</h1>
        <h2 class="dev-title">
          <span class="punct">&lt;</span>{{ resumeData.personalInfo?.targetPosition || 'Software Engineer' }} <span class="punct">/&gt;</span>
        </h2>
        <p class="dev-summary" v-if="resumeData.summary">
          {{ resumeData.summary }}
        </p>
      </div>
      
      <div class="header-meta">
        <div class="meta-item" v-if="resumeData.personalInfo?.email">
          <span class="meta-icon">@</span>
          <span class="meta-text">{{ resumeData.personalInfo.email }}</span>
        </div>
        <div class="meta-item" v-if="resumeData.personalInfo?.phone">
          <span class="meta-icon">#</span>
          <span class="meta-text">{{ resumeData.personalInfo.phone }}</span>
        </div>
        <div class="meta-item" v-if="resumeData.personalInfo?.website">
          <span class="meta-icon">🔗</span>
          <span class="meta-text">{{ resumeData.personalInfo.website }}</span>
        </div>
        <div class="meta-item" v-if="resumeData.personalInfo?.address">
          <span class="meta-icon">📍</span>
          <span class="meta-text">{{ resumeData.personalInfo.address }}</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="tech-body">
      
      <!-- Left Column: Experience & Projects -->
      <div class="main-col">
        
        <!-- Experience -->
        <section class="tech-section" v-if="resumeData.workExperience?.length">
          <h3 class="section-title">
            <span class="keyword">const</span> <span class="func">Experience</span> <span class="op">=</span> <span class="punct">() => {</span>
          </h3>
          <div class="section-content border-left">
            <div class="exp-item" v-for="work in resumeData.workExperience" :key="work.id">
              <div class="exp-header">
                <div class="exp-role-group">
                  <h4 class="exp-role">{{ work.position }}</h4>
                  <span class="exp-at">@</span>
                  <span class="exp-company">{{ work.company }}</span>
                </div>
                <div class="exp-date">{{ work.startDate }} — {{ work.endDate }}</div>
              </div>
              <p class="exp-desc" v-if="work.description">{{ work.description }}</p>
              <ul class="exp-tasks" v-if="work.achievements?.length">
                <li v-for="(ach, i) in work.achievements" :key="i">{{ ach }}</li>
              </ul>
            </div>
          </div>
          <div class="section-footer"><span class="punct">}</span></div>
        </section>

        <!-- Projects -->
        <section class="tech-section" v-if="resumeData.projects?.length">
          <h3 class="section-title">
            <span class="keyword">const</span> <span class="func">Projects</span> <span class="op">=</span> <span class="punct">() => {</span>
          </h3>
          <div class="section-content border-left">
            <div class="project-list">
              <div class="proj-card" v-for="project in resumeData.projects" :key="project.id">
                <div class="proj-header">
                  <h4 class="proj-name">{{ project.name }}</h4>
                  <span class="proj-date">{{ project.endDate }}</span>
                </div>
                <p class="proj-desc">{{ project.description }}</p>
                <div class="proj-techs" v-if="project.technologies?.length">
                  <span class="tech-badge" v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="section-footer"><span class="punct">}</span></div>
        </section>

      </div>

      <!-- Right Column: Skills & Education -->
      <div class="side-col">
        
        <!-- Skills -->
        <section class="tech-section" v-if="resumeData.skills?.length">
          <h3 class="section-title">
            <span class="keyword">type</span> <span class="func">Skills</span> <span class="op">=</span> <span class="punct">{</span>
          </h3>
          <div class="section-content border-left">
            <div class="skills-wrap">
              <div class="skill-block" v-for="skill in resumeData.skills" :key="skill.id">
                <div class="skill-key">{{ skill.name }}:</div>
                <div class="skill-val">"{{ skill.level }}"</div>
              </div>
            </div>
          </div>
          <div class="section-footer"><span class="punct">}</span></div>
        </section>

        <!-- Education -->
        <section class="tech-section" v-if="resumeData.education?.length">
          <h3 class="section-title">
            <span class="keyword">interface</span> <span class="func">Education</span> <span class="punct">{</span>
          </h3>
          <div class="section-content border-left">
            <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
              <div class="edu-year">{{ edu.endDate }}</div>
              <h4 class="edu-degree">{{ edu.degree }}</h4>
              <div class="edu-major">{{ edu.major }}</div>
              <div class="edu-school">{{ edu.school }}</div>
            </div>
          </div>
          <div class="section-footer"><span class="punct">}</span></div>
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
    default: 'tech'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
/* 
  Silicon Valley / Clean Developer Theme
  Aesthetic: Light mode, high readability, monospace accents inspired by Vercel/GitHub
*/
.tech-modern-template {
  --t-bg: #ffffff;
  --t-text: #334155;     /* Slate 700 */
  --t-heading: #0f172a;  /* Slate 900 */
  --t-primary: #0070f3;  /* Tech Blue */
  --t-border: #e2e8f0;   /* Slate 200 */
  --t-muted: #64748b;    /* Slate 500 */
  
  --t-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --t-font-mono: 'Fira Code', 'SF Mono', Consolas, Menlo, monospace;

  font-family: var(--t-font-sans);
  background-color: var(--t-bg);
  color: var(--t-text);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 45px 50px;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  position: relative;
}

/* Subtle Grid Background (Optional, adds tech feel) */
.tech-modern-template::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
  pointer-events: none;
}

/* Header */
.tech-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px dashed var(--t-border);
}

.header-main {
  flex: 1;
  padding-right: 40px;
}

.dev-name {
  font-family: var(--t-font-sans);
  font-size: 36px;
  font-weight: 800;
  color: var(--t-heading);
  margin: 0 0 8px 0;
  letter-spacing: -1px;
}

.dev-title {
  font-family: var(--t-font-mono);
  font-size: 16px;
  font-weight: 600;
  color: var(--t-primary);
  margin: 0 0 16px 0;
}

.punct {
  color: var(--t-muted);
  font-weight: normal;
}

.dev-summary {
  font-size: 14px;
  line-height: 1.6;
  color: var(--t-text);
  margin: 0;
  max-width: 90%;
}

.header-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: var(--t-font-mono);
  font-size: 12px;
  color: var(--t-muted);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-icon {
  color: var(--t-primary);
  font-weight: bold;
}

.meta-text {
  color: var(--t-heading);
}

/* Body Layout */
.tech-body {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

/* Section styling */
.tech-section {
  margin-bottom: 35px;
}

.section-title {
  font-family: var(--t-font-mono);
  font-size: 15px;
  margin: 0 0 10px 0;
  color: var(--t-heading);
  display: flex;
  align-items: center;
  gap: 6px;
}

.keyword { color: #d946ef; /* Fuchsia 500 */ }
.func { color: var(--t-primary); font-weight: 700; }
.op { color: var(--t-muted); }

.border-left {
  border-left: 2px solid var(--t-border);
  padding-left: 20px;
  margin-left: 6px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.section-footer {
  font-family: var(--t-font-mono);
  font-size: 15px;
  margin-top: 10px;
}

/* Experience */
.exp-item {
  margin-bottom: 25px;
}
.exp-item:last-child {
  margin-bottom: 0;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.exp-role-group {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.exp-role {
  font-size: 17px;
  font-weight: 700;
  color: var(--t-heading);
  margin: 0;
}

.exp-at {
  color: var(--t-primary);
  font-family: var(--t-font-mono);
  font-weight: bold;
}

.exp-company {
  font-size: 15px;
  font-weight: 600;
  color: var(--t-heading);
}

.exp-date {
  font-family: var(--t-font-mono);
  font-size: 12px;
  color: var(--t-muted);
}

.exp-desc {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.exp-tasks {
  list-style: none;
  padding: 0;
  margin: 0;
}

.exp-tasks li {
  position: relative;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 6px;
  color: var(--t-text);
}

.exp-tasks li::before {
  content: '>';
  position: absolute;
  left: 0;
  font-family: var(--t-font-mono);
  color: var(--t-primary);
  font-weight: bold;
}

/* Projects */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.proj-card {
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid var(--t-border);
  border-radius: 8px;
  padding: 16px;
}

.proj-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.proj-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--t-heading);
  margin: 0;
}

.proj-date {
  font-family: var(--t-font-mono);
  font-size: 11px;
  color: var(--t-muted);
}

.proj-desc {
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.proj-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-badge {
  font-family: var(--t-font-mono);
  font-size: 10px;
  background: var(--t-primary);
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

/* Skills */
.skills-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: var(--t-font-mono);
  font-size: 13px;
}

.skill-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.skill-key {
  color: var(--t-heading);
  font-weight: 600;
}

.skill-val {
  color: #16a34a; /* Green string color */
  padding-left: 10px;
}

/* Education */
.edu-item {
  margin-bottom: 20px;
}
.edu-item:last-child {
  margin-bottom: 0;
}

.edu-year {
  font-family: var(--t-font-mono);
  font-size: 12px;
  color: var(--t-muted);
  margin-bottom: 4px;
}

.edu-degree {
  font-size: 14px;
  font-weight: 700;
  color: var(--t-heading);
  margin: 0 0 2px 0;
}

.edu-major {
  font-size: 13px;
  color: var(--t-primary);
  margin-bottom: 4px;
  font-weight: 500;
}

.edu-school {
  font-size: 13px;
  color: var(--t-text);
}

/* Responsive */
@media (max-width: 768px) {
  .tech-modern-template {
    width: 100%;
    padding: 20px;
    height: auto;
  }
  
  .tech-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .header-main {
    padding-right: 0;
  }
  
  .tech-body {
    grid-template-columns: 1fr;
  }
}
</style>
