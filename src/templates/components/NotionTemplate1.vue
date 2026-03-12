<template>
  <div class="notion-template" :style="templateStyles">
    
    <div class="notion-cover"></div>
    <div class="notion-icon-wrapper">
      <span class="notion-icon">👨‍💻</span>
    </div>

    <div class="notion-page-content">
      
      <h1 class="notion-page-title">{{ resumeData.personalInfo?.name || 'Untitled' }}</h1>
      
      <div class="notion-callout">
        <div class="notion-callout-icon">💡</div>
        <div class="notion-callout-text">
          <strong>{{ resumeData.personalInfo?.targetPosition || 'Job Title' }}</strong><br/>
          <span class="contact-line">
            <span v-if="resumeData.personalInfo?.phone">📞 {{ resumeData.personalInfo.phone }}</span>
            <span class="spacer" v-if="resumeData.personalInfo?.phone && resumeData.personalInfo?.email">|</span>
            <span v-if="resumeData.personalInfo?.email">✉️ {{ resumeData.personalInfo.email }}</span>
            <span class="spacer" v-if="(resumeData.personalInfo?.email || resumeData.personalInfo?.phone) && resumeData.personalInfo?.website">|</span>
            <span v-if="resumeData.personalInfo?.website">🔗 {{ resumeData.personalInfo.website }}</span>
          </span>
        </div>
      </div>

      <blockquote class="notion-quote" v-if="resumeData.summary">
        {{ resumeData.summary }}
      </blockquote>

      <div class="notion-block" v-if="resumeData.workExperience?.length">
        <h2 class="notion-h2">💼 Experience</h2>
        <div class="notion-item" v-for="work in resumeData.workExperience" :key="work.id">
          <div class="notion-item-header">
            <strong>{{ work.company }}</strong> · <span class="notion-gray">{{ work.position }}</span>
          </div>
          <div class="notion-gray notion-date">🗓 {{ work.startDate }} → {{ work.endDate }}</div>
          <p class="notion-paragraph" v-if="work.description">{{ work.description }}</p>
          <ul class="notion-bullet-list" v-if="work.achievements?.length">
            <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
          </ul>
        </div>
      </div>

      <div class="notion-block" v-if="resumeData.projects?.length">
        <h2 class="notion-h2">🚀 Projects</h2>
        <div class="notion-gallery">
          <div class="notion-card" v-for="project in resumeData.projects" :key="project.id">
            <h4 class="notion-card-title">{{ project.name }}</h4>
            <div class="notion-gray notion-date text-sm">{{ project.startDate }} → {{ project.endDate }}</div>
            <p class="notion-card-desc">{{ project.description }}</p>
            <div class="notion-tags" v-if="project.technologies?.length">
              <span class="notion-tag" v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="notion-block" v-if="resumeData.education?.length">
        <h2 class="notion-h2">🎓 Education</h2>
        <div class="notion-item" v-for="edu in resumeData.education" :key="edu.id">
          <div class="notion-item-header">
            <strong>{{ edu.school }}</strong>
          </div>
          <div class="notion-gray">{{ edu.degree }} in {{ edu.major }} | {{ edu.startDate }} → {{ edu.endDate }}</div>
        </div>
      </div>

      <div class="notion-block" v-if="resumeData.skills?.length">
        <h2 class="notion-h2">🛠 Skills</h2>
        <div class="notion-inline-skills">
          <span class="notion-code" v-for="skill in resumeData.skills" :key="skill.name">
            {{ skill.name }} <span class="notion-gray">({{ skill.level }})</span>
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'notion' }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.notion-template {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  background-color: #ffffff;
  color: #37352f;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  position: relative;
  overflow: hidden;
}

.notion-cover {
  height: 180px;
  background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
  width: 100%;
}

.notion-icon-wrapper {
  position: absolute;
  top: 130px;
  left: 80px;
  width: 80px;
  height: 80px;
  font-size: 60px;
  line-height: 80px;
  text-align: center;
  background: transparent;
}

.notion-page-content {
  padding: 50px 80px 80px 80px;
}

.notion-page-title {
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 25px 0;
  letter-spacing: -1px;
}

.notion-callout {
  display: flex;
  padding: 16px;
  background-color: #f1f1ef;
  border-radius: 4px;
  margin-bottom: 25px;
  align-items: flex-start;
}

.notion-callout-icon {
  font-size: 20px;
  margin-right: 12px;
}

.notion-callout-text {
  font-size: 14px;
  line-height: 1.5;
}

.contact-line {
  color: #787774;
  font-size: 13px;
  display: inline-block;
  margin-top: 4px;
}

.spacer { margin: 0 8px; color: #d3d1cb; }

.notion-quote {
  border-left: 3px solid #37352f;
  padding: 4px 16px;
  margin: 0 0 30px 0;
  font-size: 15px;
  line-height: 1.6;
  color: #37352f;
}

.notion-block {
  margin-bottom: 30px;
}

.notion-h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 15px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #ededeb;
}

.notion-item { margin-bottom: 20px; }
.notion-item:last-child { margin-bottom: 0; }

.notion-item-header {
  font-size: 16px;
  margin-bottom: 4px;
}

.notion-gray { color: #787774; font-size: 14px; }
.notion-date { margin-bottom: 8px; font-size: 13px; }
.notion-paragraph { margin: 0 0 8px 0; font-size: 14px; line-height: 1.6; }

.notion-bullet-list {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.6;
}
.notion-bullet-list li { margin-bottom: 4px; }

.notion-gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.notion-card {
  border: 1px solid #ededeb;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.notion-card-title { font-size: 15px; margin: 0 0 4px 0; font-weight: 600; }
.notion-card-desc { font-size: 13px; margin: 8px 0; line-height: 1.5; color: #37352f;}
.text-sm { font-size: 12px; }

.notion-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.notion-tag {
  background-color: #f1f1ef;
  color: #37352f;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.notion-inline-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.notion-code {
  background-color: #f1f1ef;
  color: #eb5757;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 13px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
</style>