<template>
  <div class="notion-template" :style="templateStyles">
    
    <!-- Cover & Icon -->
    <div class="notion-cover"></div>
    <div class="notion-icon">
      <!-- Random emoji or first letter of name -->
      {{ resumeData.personalInfo?.name ? resumeData.personalInfo.name[0] : '📄' }}
    </div>

    <!-- Main Content Body -->
    <div class="notion-body">
      
      <!-- Title Block -->
      <h1 class="notion-title">{{ resumeData.personalInfo?.name || 'Untitled' }}</h1>
      
      <!-- Properties Block (Notion table prep) -->
      <div class="notion-properties">
        <div class="prop-row" v-if="resumeData.personalInfo?.targetPosition">
          <div class="prop-key">
            <span class="p-icon">📝</span> Role
          </div>
          <div class="prop-val">
            <span class="notion-badge bg-blue">{{ resumeData.personalInfo.targetPosition }}</span>
          </div>
        </div>
        <div class="prop-row" v-if="resumeData.personalInfo?.email">
          <div class="prop-key">
            <span class="p-icon">📧</span> Email
          </div>
          <div class="prop-val text-link">{{ resumeData.personalInfo.email }}</div>
        </div>
        <div class="prop-row" v-if="resumeData.personalInfo?.phone">
          <div class="prop-key">
            <span class="p-icon">📱</span> Phone
          </div>
          <div class="prop-val">{{ resumeData.personalInfo.phone }}</div>
        </div>
        <div class="prop-row" v-if="resumeData.personalInfo?.website">
          <div class="prop-key">
            <span class="p-icon">🔗</span> Link
          </div>
          <div class="prop-val text-link">{{ resumeData.personalInfo.website }}</div>
        </div>
      </div>

      <div class="notion-divider"></div>

      <!-- About -->
      <div class="notion-block" v-if="resumeData.summary">
        <h2 class="h2-block">About</h2>
        <p class="text-block">{{ resumeData.summary }}</p>
      </div>

      <!-- Two Cols for Experience & Projects vs Skills & Edu -->
      <div class="notion-cols">
        <!-- Left Col -->
        <div class="col-left">
          
          <!-- Experience -->
          <div class="notion-block" v-if="resumeData.workExperience?.length">
            <h2 class="h2-block">Work Experience</h2>
            <div class="toggle-block" v-for="work in resumeData.workExperience" :key="work.id">
              <div class="toggle-header">
                <span class="t-arrow">▼</span>
                <span class="t-title">{{ work.company }} - {{ work.position }}</span>
                <span class="t-date">{{ work.startDate }} / {{ work.endDate }}</span>
              </div>
              <div class="toggle-content">
                <p class="text-block" v-if="work.description">{{ work.description }}</p>
                <ul class="bulleted-list" v-if="work.achievements?.length">
                  <li v-for="ach in work.achievements" :key="ach">
                    <span class="bullet">•</span> {{ ach }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Projects -->
          <div class="notion-block" v-if="resumeData.projects?.length">
            <h2 class="h2-block">Projects</h2>
            
            <div class="gallery-view">
              <div class="gallery-card" v-for="proj in resumeData.projects" :key="proj.id">
                <div class="card-cover"></div>
                <div class="card-content">
                  <div class="card-title">📖 {{ proj.name }}</div>
                  <div class="card-desc">{{ proj.description }}</div>
                  <div class="card-tags" v-if="proj.technologies?.length">
                    <span class="notion-badge bg-gray" v-for="tech in proj.technologies.slice(0, 3)" :key="tech">{{ tech }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Col -->
        <div class="col-right">
          
          <!-- Skills -->
          <div class="notion-block" v-if="resumeData.skills?.length">
            <h2 class="h2-block">Skills</h2>
            <div class="skills-list">
              <div class="skill-row" v-for="skill in resumeData.skills" :key="skill.id">
                <span class="s-name">{{ skill.name }}</span>
                <span class="s-bar">
                  <div class="s-fill" :style="{ width: getSkillWidth(skill.level) }"></div>
                </span>
              </div>
            </div>
          </div>

          <!-- Education -->
          <div class="notion-block" v-if="resumeData.education?.length">
            <h2 class="h2-block">Education</h2>
            <div class="callout-block" v-for="edu in resumeData.education" :key="edu.id">
              <div class="c-icon">🎓</div>
              <div class="c-text">
                <div class="c-title">{{ edu.school }}</div>
                <div class="c-sub">{{ edu.degree }} in {{ edu.major }}</div>
                <div class="c-meta" v-if="edu.endDate">Graduated: {{ edu.endDate }}</div>
              </div>
            </div>
          </div>

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
    default: 'notion'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const getSkillWidth = (level) => {
  const map = {
    'expert': '100%', '精通': '100%',
    'advanced': '85%', '熟练': '85%',
    'intermediate': '65%', '良好': '65%',
    'beginner': '35%', '了解': '35%'
  }
  return map[level?.toLowerCase()] || '70%'
}
</script>

<style scoped>
/* 
  Notion Aesthetic 
  Clean, utilitarian, sans-serif, standard spacing.
*/
.notion-template {
  --n-bg: #FFFFFF;
  --n-text: #37352F;
  --n-gray: rgba(55, 53, 47, 0.65);
  --n-border: rgba(55, 53, 47, 0.16);
  --n-hover: rgba(55, 53, 47, 0.08);
  --n-blue-bg: rgba(35, 131, 226, 0.14);
  --n-blue-text: #2383e2;
  --n-gray-bg: rgba(227, 226, 224, 0.5);

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif;
  background-color: var(--n-bg);
  color: var(--n-text);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  position: relative;
  overflow: hidden; /* For cover out of bounds */
}

/* Cover Image */
.notion-cover {
  height: 180px;
  width: 100%;
  background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  position: relative;
}

.notion-icon {
  position: absolute;
  top: 130px; /* Overlaps cover */
  left: 90px;
  font-size: 78px;
  line-height: 1;
  background: var(--n-bg);
  border-radius: 8px;
  padding: 0;
}

/* Main Body */
.notion-body {
  padding: 60px 96px 80px; /* Match typical Notion margins */
}

/* Title */
.notion-title {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 30px 0;
  color: var(--n-text);
  line-height: 1.2;
}

/* Properties Table */
.notion-properties {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.prop-row {
  display: flex;
  padding: 6px 0;
  align-items: center;
  font-size: 14px;
}

.prop-key {
  width: 180px;
  color: var(--n-gray);
  display: flex;
  align-items: center;
  gap: 6px;
}

.p-icon {
  width: 18px; 
  text-align: center;
}

.prop-val {
  flex: 1;
}

.text-link {
  color: var(--n-gray);
  text-decoration: underline;
  text-decoration-color: var(--n-border);
}

.notion-badge {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 1;
}

.bg-blue {
  background: var(--n-blue-bg);
  color: var(--n-blue-text);
}

.bg-gray {
  background: var(--n-gray-bg);
  color: var(--n-gray);
}

.notion-divider {
  height: 1px;
  background: var(--n-border);
  margin: 12px 0 24px 0;
}

/* General Blocks */
.notion-block {
  margin-bottom: 24px;
}

.h2-block {
  font-size: 24px;
  font-weight: 600;
  margin: 32px 0 16px 0;
  color: var(--n-text);
  line-height: 1.3;
}

.text-block {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 10px 0;
  white-space: pre-wrap;
}

/* Two Columns */
.notion-cols {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
  margin-top: 10px;
}

/* Toggle Block (Experience) */
.toggle-block {
  margin-bottom: 8px;
}

.toggle-header {
  display: flex;
  align-items: center;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  margin-left: -6px; /* Align text exactly with margin */
}

.t-arrow {
  font-size: 12px;
  margin-right: 8px;
  color: var(--n-gray);
  width: 16px;
  display: inline-block;
  text-align: center;
}

.t-title {
  flex: 1;
}

.t-date {
  font-size: 14px;
  color: var(--n-gray);
  font-weight: 400;
}

.toggle-content {
  padding-left: 30px; /* Align with toggle title */
  margin-top: 4px;
  margin-bottom: 16px;
}

.bulleted-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bulleted-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 6px;
  font-size: 16px;
  line-height: 1.6;
}

.bullet {
  font-size: 20px;
  line-height: 0.8;
  margin-right: 8px;
  color: var(--n-text);
}

/* Gallery View (Projects) */
.gallery-view {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.gallery-card {
  border: 1px solid var(--n-border);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.05) 0px 2px 4px;
}

.card-cover {
  height: 60px;
  background: var(--n-gray-bg);
  border-bottom: 1px solid var(--n-border);
}

.card-content {
  padding: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 12px;
  color: var(--n-gray);
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* Skills */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-row {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.s-name {
  width: 100px;
  font-weight: 500;
}

.s-bar {
  flex: 1;
  height: 8px;
  background: var(--n-gray-bg);
  border-radius: 4px;
  overflow: hidden;
}

.s-fill {
  height: 100%;
  background: var(--n-text);
  border-radius: 4px;
}

/* Callout Block (Education) */
.callout-block {
  display: flex;
  padding: 16px;
  background-color: rgb(247, 246, 243);
  border-radius: 4px;
  border: 1px solid rgba(247, 246, 243, 0);
  margin-bottom: 12px;
}

.c-icon {
  margin-right: 12px;
}

.c-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.c-sub {
  font-size: 14px;
  margin-bottom: 4px;
}

.c-meta {
  font-size: 12px;
  color: var(--n-gray);
}

@media (max-width: 768px) {
  .notion-template {
    width: 100%;
    height: auto;
  }
  .notion-body {
    padding: 40px 24px;
  }
  .notion-icon {
    left: 24px;
  }
  .notion-cols {
    grid-template-columns: 1fr;
  }
  .gallery-view {
    grid-template-columns: 1fr;
  }
}
</style>
