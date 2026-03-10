<template>
  <div class="cyberpunk-template" :style="templateStyles">
    <div class="glitch-background"></div>
    <div class="scanlines"></div>
    
    <!-- Header -->
    <header class="cyber-header">
      <div class="header-content">
        <h1 class="glitch-name" :data-text="resumeData.personalInfo?.name || 'SYS.ADMIN'">
          {{ resumeData.personalInfo?.name || 'SYS.ADMIN' }}
        </h1>
        <h2 class="neon-role">> {{ resumeData.personalInfo?.targetPosition || 'CYBER_SECURITY_HACKER' }}</h2>
        
        <div class="cyber-contact" v-if="hasContactInfo">
          <div class="terminal-line" v-if="resumeData.personalInfo?.email">
            <span class="cmd">PING</span> <span class="arg">{{ resumeData.personalInfo.email }}</span>
          </div>
          <div class="terminal-line" v-if="resumeData.personalInfo?.phone">
            <span class="cmd">CALL</span> <span class="arg">{{ resumeData.personalInfo.phone }}</span>
          </div>
          <div class="terminal-line" v-if="resumeData.personalInfo?.website">
            <span class="cmd">LINK</span> <span class="arg">{{ resumeData.personalInfo.website }}</span>
          </div>
        </div>
      </div>
      
      <div class="header-avatar" :class="resumeData.personalInfo?.photoPosition || 'right'" v-if="resumeData.personalInfo?.photo">
        <div class="avatar-box">
          <img :src="resumeData.personalInfo.photo" alt="Avatar"/>
          <div class="avatar-glitch"></div>
        </div>
      </div>
    </header>

    <!-- Summary -->
    <section class="cyber-section" v-if="resumeData.summary">
      <h3 class="cyber-title"><span class="bracket">[</span> INIT_SEQUENCE <span class="bracket">]</span></h3>
      <div class="cyber-box">
        <p class="matrix-text">{{ resumeData.summary }}</p>
      </div>
    </section>

    <!-- Two-column Layout -->
    <div class="cyber-grid">
      <!-- Main Content (Left) -->
      <div class="cyber-main">
        
        <!-- Experience -->
        <section class="cyber-section" v-if="resumeData.workExperience?.length">
          <h3 class="cyber-title">
            <span class="bracket">[</span> EXECUTE: EXP.LOG <span class="bracket">]</span>
          </h3>
          <div class="timeline-container">
            <div class="timeline-node" v-for="work in resumeData.workExperience" :key="work.id">
              <div class="node-header">
                <h4 class="node-title">{{ work.position }}</h4>
                <div class="node-meta">
                  <span class="company-badge">{{ work.company }}</span>
                  <span class="date-stamp">{{ work.startDate }} / {{ work.endDate }}</span>
                </div>
              </div>
              <p class="node-desc" v-if="work.description">{{ work.description }}</p>
              <ul class="hacker-list" v-if="work.achievements?.length">
                <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Projects -->
        <section class="cyber-section" v-if="resumeData.projects?.length">
          <h3 class="cyber-title">
            <span class="bracket">[</span> SYS.PROJECTS <span class="bracket">]</span>
          </h3>
          <div class="projects-grid">
            <div class="project-card" v-for="proj in resumeData.projects" :key="proj.id">
              <div class="card-edge card-edge-top-left"></div>
              <div class="card-edge card-edge-bottom-right"></div>
              <h4 class="proj-name">__{{ proj.name }}</h4>
              <p class="proj-desc">{{ proj.description }}</p>
              <div class="tech-stack" v-if="proj.technologies?.length">
                <span class="tech-tag" v-for="tech in proj.technologies" :key="tech">{{ tech }}</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      <!-- Sidebar (Right) -->
      <aside class="cyber-sidebar">
        
        <!-- Skills -->
        <section class="cyber-section" v-if="resumeData.skills?.length">
          <h3 class="cyber-title">
            <span class="bracket">[</span> DB: SKILLS <span class="bracket">]</span>
          </h3>
          <div class="skills-matrix">
            <div class="skill-row" v-for="skill in resumeData.skills" :key="skill.id">
              <span class="sk-name">{{ skill.name }}</span>
              <div class="sk-bar">
                <div class="sk-fill" :style="{ width: getSkillBar(skill.level) }"></div>
              </div>
              <span class="sk-level">{{ getSkillHex(skill.level) }}</span>
            </div>
          </div>
        </section>

        <!-- Education -->
        <section class="cyber-section" v-if="resumeData.education?.length">
          <h3 class="cyber-title">
            <span class="bracket">[</span> CORE.MEMORY <span class="bracket">]</span>
          </h3>
          <div class="edu-module" v-for="edu in resumeData.education" :key="edu.id">
            <div class="edu-year">> {{ edu.endDate }}</div>
            <h4 class="edu-degree">{{ edu.degree }}</h4>
            <div class="edu-school">{{ edu.school }}</div>
          </div>
        </section>

      </aside>
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
    default: 'cyberpunk'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const hasContactInfo = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return p.email || p.phone || p.website
})

const getSkillBar = (level) => {
  const map = {
    'expert': '100%',
    '精通': '100%',
    'advanced': '80%',
    '熟练': '80%',
    'intermediate': '60%',
    '良好': '60%',
    '一般': '40%',
    'beginner': '25%',
    '了解': '25%'
  }
  return map[level?.toLowerCase()] || '75%'
}

const getSkillHex = (level) => {
  const w = getSkillBar(level)
  // Just simulating a hex value representation for the cyberpunk vibe
  if (w === '100%') return '0xFF'
  if (w === '80%') return '0xCC'
  if (w === '75%') return '0xAA'
  if (w === '60%') return '0x88'
  if (w === '40%') return '0x66'
  return '0x44'
}
</script>

<style scoped>
/* 
  Cyberpunk 2077 Inspired Aesthetic 
  Colors: Neon Yellow, Cyan, Magenta on deep dark backgrounds.
*/
.cyberpunk-template {
  --cy-bg: #0d0e15;       /* Very dark navy/black */
  --cy-yellow: #fcee0a;   /* Cyberpunk Yellow */
  --cy-cyan: #00f0ff;     /* Neon Cyan */
  --cy-magenta: #ff003c;  /* Hot Magenta */
  --cy-text: #e0e6ed;     /* Off-white */
  --cy-dim: #4B5563;
  --cy-border: #00f0ff;   
  
  font-family: 'Courier New', Courier, 'Orbitron', 'Rajdhani', monospace;
  background-color: var(--cy-bg);
  color: var(--cy-text);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 40px;
  position: relative;
  overflow: hidden;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Background Effects */
.glitch-background {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
  pointer-events: none;
}

.scanlines {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,0) 50%,
    rgba(0,0,0,0.1) 50%,
    rgba(0,0,0,0.1)
  );
  background-size: 100% 4px;
  z-index: 100;
  pointer-events: none;
}

/* Base structural z-index to overlay background */
.cyber-header, .cyber-section, .cyber-grid {
  position: relative;
  z-index: 2;
}

/* Header */
.cyber-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid var(--cy-cyan);
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.header-content {
  flex: 1;
}

/* Glitch Typography */
.glitch-name {
  font-size: 44px;
  font-weight: 900;
  margin: 0 0 5px 0;
  color: var(--cy-yellow);
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  text-shadow: 2px 0 var(--cy-magenta), -2px 0 var(--cy-cyan);
}

.neon-role {
  font-size: 18px;
  color: var(--cy-cyan);
  margin: 0 0 20px 0;
  font-weight: 600;
  letter-spacing: 1px;
}

/* Terminal Contact */
.cyber-contact {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.terminal-line {
  display: flex;
  gap: 12px;
}

.cmd {
  color: var(--cy-magenta);
  font-weight: bold;
}
.arg {
  color: var(--cy-text);
}

/* Avatar Focus */
.header-avatar {
  margin-left: 30px;
}

.header-avatar.left {
  order: -1;
  margin-left: 0;
  margin-right: 30px;
}

.header-avatar.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 10px;
}

.avatar-box {
  width: 130px;
  height: 130px;
  border: 2px solid var(--cy-cyan);
  padding: 4px;
  position: relative;
  background: rgba(0, 240, 255, 0.1);
  clip-path: polygon(100% 0, 100% 85%, 85% 100%, 0 100%, 0 0);
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  clip-path: polygon(100% 0, 100% 85%, 85% 100%, 0 100%, 0 0);
  filter: contrast(1.2) grayscale(0.2) drop-shadow(0 0 5px var(--cy-cyan));
}

/* Headings */
.cyber-title {
  font-size: 16px;
  color: var(--cy-yellow);
  margin: 0 0 16px 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.bracket {
  color: var(--cy-cyan);
}

.cyber-section {
  margin-bottom: 35px;
}

/* Info Box */
.cyber-box {
  border-left: 3px solid var(--cy-yellow);
  background: rgba(252, 238, 10, 0.05); /* very faint yellow */
  padding: 12px 16px;
}

.matrix-text {
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
  color: var(--cy-text);
}

/* Grid Layout */
.cyber-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

/* Timeline */
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-node {
  position: relative;
  padding-left: 20px;
  border-left: 1px dotted var(--cy-cyan);
}

.timeline-node::before {
  content: '';
  position: absolute;
  top: 0; left: -5px;
  width: 9px; height: 9px;
  background-color: var(--cy-magenta);
  box-shadow: 0 0 8px var(--cy-magenta);
}

.node-header {
  margin-bottom: 8px;
}

.node-title {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 4px 0;
  text-transform: uppercase;
}

.node-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.company-badge {
  background: var(--cy-cyan);
  color: #000;
  padding: 2px 6px;
  font-weight: bold;
}

.date-stamp {
  color: var(--cy-dim);
}

.node-desc {
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 10px 0;
}

.hacker-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.hacker-list li {
  position: relative;
  padding-left: 15px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #aaa;
}

.hacker-list li::before {
  content: '>';
  position: absolute;
  left: 0;
  color: var(--cy-yellow);
  font-weight: bold;
}

/* Projects Cards */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.project-card {
  border: 1px solid var(--cy-dim);
  background: rgba(0,0,0,0.4);
  padding: 16px;
  position: relative;
}

/* Faux clip-path corners */
.card-edge {
  position: absolute;
  width: 10px; height: 10px;
  border: 2px solid var(--cy-yellow);
}
.card-edge-top-left {
  top: -2px; left: -2px;
  border-right: none; border-bottom: none;
}
.card-edge-bottom-right {
  bottom: -2px; right: -2px;
  border-left: none; border-top: none;
}

.proj-name {
  font-size: 16px;
  color: var(--cy-cyan);
  margin: 0 0 8px 0;
  text-transform: uppercase;
}

.proj-desc {
  font-size: 13px;
  margin: 0 0 12px 0;
  color: #aaa;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  font-size: 10px;
  border: 1px solid var(--cy-magenta);
  color: var(--cy-magenta);
  padding: 2px 6px;
  text-transform: uppercase;
  background: rgba(255, 0, 60, 0.1);
}

/* Sidebar: Skills */
.skills-matrix {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-row {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.sk-name {
  width: 90px;
  color: var(--cy-text);
  text-transform: uppercase;
}

.sk-bar {
  flex: 1;
  height: 6px;
  background: var(--cy-dim);
  margin-right: 12px;
  position: relative;
}

.sk-fill {
  height: 100%;
  background: var(--cy-yellow);
  box-shadow: 0 0 5px var(--cy-yellow);
}

.sk-level {
  width: 35px;
  text-align: right;
  color: var(--cy-cyan);
  font-weight: bold;
}

/* Sidebar: Education */
.edu-module {
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 2px solid var(--cy-magenta);
}

.edu-year {
  font-size: 12px;
  color: var(--cy-yellow);
  margin-bottom: 4px;
}

.edu-degree {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 4px 0;
  text-transform: uppercase;
}

.edu-school {
  font-size: 12px;
  color: #aaa;
}

@media (max-width: 768px) {
  .cyberpunk-template {
    width: 100%;
    padding: 20px;
    height: auto;
  }
  .cyber-grid {
    grid-template-columns: 1fr;
  }
  .cyber-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .header-avatar {
    margin-left: 0;
  }
}
</style>
