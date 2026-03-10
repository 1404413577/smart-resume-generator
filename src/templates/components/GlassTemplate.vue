<template>
  <div class="glass-template" :style="templateStyles">
    
    <!-- Abstract blurred background orbs -->
    <div class="glass-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>
    </div>

    <!-- Main Glass Container -->
    <div class="glass-container">
      
      <!-- Header -->
      <header class="glass-header">
        <div class="header-content">
          <h1 class="glass-name">{{ resumeData.personalInfo?.name || 'Designer' }}</h1>
          <h2 class="glass-role">{{ resumeData.personalInfo?.targetPosition || 'UI/UX Interactive Designer' }}</h2>
          <p class="glass-summary" v-if="resumeData.summary">
            {{ resumeData.summary }}
          </p>
        </div>
        <div class="header-side" :class="resumeData.personalInfo?.photoPosition || 'right'" v-if="resumeData.personalInfo?.photo">
          <div class="avatar-glass">
            <img :src="resumeData.personalInfo.photo" alt="Avatar"/>
          </div>
        </div>
      </header>

      <!-- Contact Bar -->
      <div class="glass-contact-bar" v-if="hasContactInfo">
        <div class="c-item" v-if="resumeData.personalInfo?.email">
          <i class="icon">✉</i> {{ resumeData.personalInfo.email }}
        </div>
        <div class="c-item" v-if="resumeData.personalInfo?.phone">
          <i class="icon">📱</i> {{ resumeData.personalInfo.phone }}
        </div>
        <div class="c-item" v-if="resumeData.personalInfo?.website">
          <i class="icon">🌐</i> {{ resumeData.personalInfo.website }}
        </div>
      </div>

      <!-- Content Grid -->
      <div class="glass-grid">
        
        <!-- Left Column (Wider) -->
        <div class="glass-main">
          
          <!-- Experience -->
          <section class="glass-section" v-if="resumeData.workExperience?.length">
            <h3 class="glass-title">Experience</h3>
            <div class="glass-card exp-card" v-for="work in resumeData.workExperience" :key="work.id">
              <div class="exp-header">
                <div>
                  <h4 class="exp-role">{{ work.position }}</h4>
                  <div class="exp-company">{{ work.company }}</div>
                </div>
                <div class="exp-date badge-glass">{{ work.startDate }} - {{ work.endDate }}</div>
              </div>
              <p class="exp-desc" v-if="work.description">{{ work.description }}</p>
              <ul class="exp-list" v-if="work.achievements?.length">
                <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
              </ul>
            </div>
          </section>

          <!-- Projects -->
          <section class="glass-section" v-if="resumeData.projects?.length">
            <h3 class="glass-title">Selected Works</h3>
            <div class="projects-wrapper">
              <div class="glass-card proj-card" v-for="proj in resumeData.projects" :key="proj.id">
                <div class="proj-header">
                  <h4 class="proj-name">{{ proj.name }}</h4>
                </div>
                <p class="proj-desc">{{ proj.description }}</p>
                <div class="proj-tags" v-if="proj.technologies?.length">
                  <span class="tag-glass" v-for="tech in proj.technologies" :key="tech">{{ tech }}</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        <!-- Right Column (Narrower) -->
        <div class="glass-sidebar">
          
          <!-- Skills -->
          <section class="glass-section" v-if="resumeData.skills?.length">
            <h3 class="glass-title">Expertise</h3>
            <div class="glass-card skills-card">
              <div class="skill-row" v-for="skill in resumeData.skills" :key="skill.id">
                <div class="skill-info">
                  <span class="sk-name">{{ skill.name }}</span>
                  <span class="sk-level">{{ skill.level }}</span>
                </div>
                <div class="sk-track">
                  <div class="sk-fill" :style="{ width: getSkillBar(skill.level) }"></div>
                </div>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section class="glass-section" v-if="resumeData.education?.length">
            <h3 class="glass-title">Education</h3>
            <div class="glass-card edu-card" v-for="edu in resumeData.education" :key="edu.id">
              <div class="edu-year badge-glass">{{ edu.endDate }}</div>
              <h4 class="edu-degree">{{ edu.degree }}</h4>
              <div class="edu-school">{{ edu.school }}</div>
            </div>
          </section>

        </div>

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
    default: 'glass'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const hasContactInfo = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return p.email || p.phone || p.website
})

const getSkillBar = (level) => {
  const map = {
    'expert': '100%', '精通': '100%',
    'advanced': '85%', '熟练': '85%',
    'intermediate': '65%', '良好': '65%',
    'beginner': '35%', '了解': '35%'
  }
  return map[level?.toLowerCase()] || '75%'
}
</script>

<style scoped>
/* 
  Glassmorphism Aesthetic
  Soft colorful gradients, frosted glass cards, white borders.
*/
.glass-template {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;
  color: #fff;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 40px;
  position: relative;
  overflow: hidden;
  background-color: #0f172a; /* Deep slate baseline */
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Background Orbs */
.glass-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  pointer-events: none;
  filter: blur(80px); /* Heavy blur for frosted effect */
  opacity: 0.8;
}

.orb {
  position: absolute;
  border-radius: 50%;
  animation: float 20s infinite ease-in-out alternate;
}

.orb-1 { width: 500px; height: 500px; background: #c084fc; top: -100px; left: -100px; }
.orb-2 { width: 600px; height: 600px; background: #3b82f6; bottom: -200px; right: -150px; animation-delay: -5s; }
.orb-3 { width: 400px; height: 400px; background: #ec4899; top: 40%; left: 30%; animation-delay: -10s; }
.orb-4 { width: 300px; height: 300px; background: #2dd4bf; top: 10%; right: 10%; animation-delay: -15s; }

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 30px) scale(1.1); }
  100% { transform: translate(-30px, 60px) scale(0.9); }
}

/* Glass Main Container */
.glass-container {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  min-height: calc(100% - 80px);
}

/* Common Card Mixin */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  transition: transform 0.3s ease, background 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.12);
}

/* Common Badges */
.badge-glass {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
}

.tag-glass {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
}

/* Header */
.glass-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-content {
  flex: 1;
  padding-right: 30px;
}

.header-side.left {
  order: -1;
  margin-right: 30px;
}

.header-side.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
}

.header-side.right {
  order: 2;
}

.glass-name {
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -1px;
  background: linear-gradient(to right, #ffffff, rgba(255,255,255,0.7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-role {
  font-size: 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 16px 0;
}

.glass-summary {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
}

.avatar-glass {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  padding: 6px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.avatar-glass img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* Contact Bar */
.glass-contact-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.c-item {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 6px;
}

.c-item .icon {
  font-style: normal;
  color: #fff;
}

/* Layout Grid */
.glass-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 30px;
}

/* Sections */
.glass-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px 0;
  letter-spacing: 0.5px;
}

.glass-section {
  margin-bottom: 40px;
}

/* Experience */
.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.exp-role {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.exp-company {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.exp-desc {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 16px 0;
}

.exp-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.exp-list li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255,255,255,0.75);
}

.exp-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #fff;
  font-weight: bold;
}

/* Projects */
.projects-wrapper {
  display: flex;
  flex-direction: column;
}

.proj-header {
  margin-bottom: 8px;
}

.proj-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.proj-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.proj-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Skills */
.skill-row {
  margin-bottom: 16px;
}

.skill-row:last-child {
  margin-bottom: 0;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.sk-name {
  font-size: 13px;
  font-weight: 500;
}

.sk-level {
  font-size: 11px;
  color: rgba(255,255,255,0.6);
}

.sk-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
}

.sk-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.9));
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(255,255,255,0.3);
}

/* Education */
.edu-degree {
  font-size: 15px;
  font-weight: 600;
  margin: 12px 0 4px 0;
}

.edu-school {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
}

/* Responsive */
@media (max-width: 768px) {
  .glass-template {
    width: 100%;
    padding: 20px;
    height: auto;
  }
  .glass-container {
    padding: 24px;
  }
  .glass-header {
    flex-direction: column-reverse;
    text-align: center;
    gap: 20px;
  }
  .header-content {
    padding-right: 0;
  }
  .glass-contact-bar {
    justify-content: center;
  }
  .glass-grid {
    grid-template-columns: 1fr;
  }
}
</style>
