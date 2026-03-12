<template>
  <div class="consulting-template" :style="templateStyles">
    
    <header class="c-header">
      <h1 class="c-name">{{ resumeData.personalInfo?.name || 'NAME' }}</h1>
      <div class="c-contact">
        <span v-if="resumeData.personalInfo?.address">{{ resumeData.personalInfo.address }}</span>
        <span class="c-separator" v-if="resumeData.personalInfo?.address && resumeData.personalInfo?.phone">|</span>
        <span v-if="resumeData.personalInfo?.phone">{{ resumeData.personalInfo.phone }}</span>
        <span class="c-separator" v-if="(resumeData.personalInfo?.phone || resumeData.personalInfo?.address) && resumeData.personalInfo?.email">|</span>
        <span v-if="resumeData.personalInfo?.email">{{ resumeData.personalInfo.email }}</span>
        <span class="c-separator" v-if="resumeData.personalInfo?.website">|</span>
        <span v-if="resumeData.personalInfo?.website">{{ resumeData.personalInfo.website }}</span>
      </div>
    </header>

    <section class="c-section" v-if="resumeData.education?.length">
      <h2 class="c-section-title">EDUCATION</h2>
      <div class="c-item" v-for="edu in resumeData.education" :key="edu.id">
        <div class="c-row">
          <div class="c-left"><strong>{{ edu.school }}</strong></div>
          <div class="c-right">{{ edu.startDate }} – {{ edu.endDate }}</div>
        </div>
        <div class="c-row">
          <div class="c-left"><em>{{ edu.degree }}, {{ edu.major }}</em></div>
        </div>
        <ul class="c-bullets" v-if="edu.description || edu.honors">
          <li v-if="edu.description">{{ edu.description }}</li>
          <li v-if="edu.honors"><strong>Honors:</strong> {{ edu.honors }}</li>
        </ul>
      </div>
    </section>

    <section class="c-section" v-if="resumeData.workExperience?.length">
      <h2 class="c-section-title">PROFESSIONAL EXPERIENCE</h2>
      <div class="c-item" v-for="work in resumeData.workExperience" :key="work.id">
        <div class="c-row">
          <div class="c-left"><strong>{{ work.company }}</strong></div>
          <div class="c-right">{{ work.startDate }} – {{ work.endDate }}</div>
        </div>
        <div class="c-row">
          <div class="c-left"><em>{{ work.position }}</em></div>
        </div>
        <ul class="c-bullets" v-if="work.achievements?.length || work.description">
          <li v-if="work.description">{{ work.description }}</li>
          <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
        </ul>
      </div>
    </section>

    <section class="c-section" v-if="resumeData.projects?.length">
      <h2 class="c-section-title">PROJECT EXPERIENCE</h2>
      <div class="c-item" v-for="project in resumeData.projects" :key="project.id">
        <div class="c-row">
          <div class="c-left"><strong>{{ project.name }}</strong></div>
          <div class="c-right">{{ project.startDate }} – {{ project.endDate }}</div>
        </div>
        <ul class="c-bullets">
          <li v-if="project.description">{{ project.description }}</li>
          <li v-if="project.technologies?.length"><strong>Technologies:</strong> {{ project.technologies.join(', ') }}</li>
        </ul>
      </div>
    </section>

    <section class="c-section" v-if="resumeData.skills?.length || resumeData.languages?.length">
      <h2 class="c-section-title">SKILLS & ADDITIONAL INFORMATION</h2>
      <div class="c-skills-block">
        <div class="c-skill-line" v-if="resumeData.skills?.length">
          <strong>Technical Skills:</strong> 
          {{ resumeData.skills.map(s => `${s.name} (${s.level})`).join(', ') }}
        </div>
        <div class="c-skill-line" v-if="resumeData.languages?.length">
          <strong>Languages:</strong> 
          {{ resumeData.languages.map(l => `${l.name} (${l.level})`).join(', ') }}
        </div>
      </div>
    </section>

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
    default: 'consulting'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.consulting-template {
  font-family: 'Times New Roman', Garamond, serif;
  background-color: #ffffff;
  color: #000000;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 50px 60px;
  box-sizing: border-box;
  font-size: 11pt;
  line-height: 1.4;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.c-header {
  text-align: center;
  margin-bottom: 20px;
}

.c-name {
  font-size: 20pt;
  font-weight: bold;
  margin: 0 0 5px 0;
  text-transform: uppercase;
}

.c-contact {
  font-size: 10pt;
}

.c-separator {
  margin: 0 8px;
}

.c-section {
  margin-bottom: 20px;
}

.c-section-title {
  font-size: 11pt;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1px solid #000000;
  margin: 0 0 10px 0;
  padding-bottom: 2px;
}

.c-item {
  margin-bottom: 12px;
}
.c-item:last-child {
  margin-bottom: 0;
}

.c-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2px;
}

.c-left {
  flex: 1;
}

.c-right {
  text-align: right;
  white-space: nowrap;
}

.c-bullets {
  margin: 4px 0 0 0;
  padding-left: 20px;
  list-style-type: disc;
}

.c-bullets li {
  margin-bottom: 2px;
  text-align: justify;
}

.c-skills-block {
  margin-top: 5px;
}

.c-skill-line {
  margin-bottom: 4px;
}
</style>