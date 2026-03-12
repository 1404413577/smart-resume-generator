<template>
  <div class="bento-template" :style="templateStyles">
    <div class="bento-container">
      
      <div class="bento-header">
        <div class="bento-card profile-card">
          <div class="profile-left">
            <h1 class="bento-name">{{ resumeData.personalInfo?.name || 'Developer Name' }}</h1>
            <h2 class="bento-title">{{ resumeData.personalInfo?.targetPosition || 'UI/UX Designer & Developer' }}</h2>
            <div class="bento-contact">
              <span v-if="resumeData.personalInfo?.phone">📞 {{ resumeData.personalInfo.phone }}</span>
              <span v-if="resumeData.personalInfo?.email">✉️ {{ resumeData.personalInfo.email }}</span>
              <span v-if="resumeData.personalInfo?.website">🔗 {{ resumeData.personalInfo.website }}</span>
            </div>
          </div>
          <div class="profile-right" v-if="resumeData.personalInfo?.photo">
            <img class="bento-avatar" :src="resumeData.personalInfo.photo" alt="Avatar" />
          </div>
        </div>
      </div>

      <div class="bento-grid">
        
        <div class="bento-card col-span-2" v-if="resumeData.summary">
          <h3 class="bento-card-title">✨ About Me</h3>
          <p class="bento-text">{{ resumeData.summary }}</p>
        </div>

        <div class="bento-card col-span-1" v-if="resumeData.skills?.length">
          <h3 class="bento-card-title">🎯 Skills</h3>
          <div class="bento-pills">
            <span class="bento-pill" v-for="skill in resumeData.skills" :key="skill.name">
              {{ skill.name }}
            </span>
          </div>
        </div>

        <div class="bento-card col-span-3" v-if="resumeData.workExperience?.length">
          <h3 class="bento-card-title">💼 Experience</h3>
          <div class="bento-list">
            <div class="bento-list-item" v-for="work in resumeData.workExperience" :key="work.id">
              <div class="item-head">
                <span class="item-primary">{{ work.company }}</span>
                <span class="item-date">{{ work.startDate }} - {{ work.endDate }}</span>
              </div>
              <div class="item-sub">{{ work.position }}</div>
              <ul class="item-bullets" v-if="work.achievements?.length">
                <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bento-card col-span-2" v-if="resumeData.projects?.length">
          <h3 class="bento-card-title">🚀 Featured Projects</h3>
          <div class="bento-proj-grid">
            <div class="bento-proj-card" v-for="project in resumeData.projects" :key="project.id">
              <h4 class="proj-name">{{ project.name }}</h4>
              <p class="proj-desc">{{ project.description }}</p>
              <div class="proj-tags" v-if="project.technologies?.length">
                <span class="proj-tag" v-for="tech in project.technologies.slice(0,3)" :key="tech">{{ tech }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bento-card col-span-1" v-if="resumeData.education?.length">
          <h3 class="bento-card-title">🎓 Education</h3>
          <div class="bento-edu-item" v-for="edu in resumeData.education" :key="edu.id">
            <div class="edu-school">{{ edu.school }}</div>
            <div class="edu-detail">{{ edu.degree }} | {{ edu.major }}</div>
            <div class="edu-year">{{ edu.endDate }}</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'bento' }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.bento-template {
  font-family: 'Inter', -apple-system, sans-serif;
  background-color: #f3f4f6; /* 浅灰底色突出卡片 */
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 40px;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.bento-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bento-card {
  background-color: #ffffff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  border: 1px solid #f1f1f1;
}

.bento-header {
  margin-bottom: 0;
}

.profile-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
}

.profile-left { flex: 1; }
.bento-name { font-size: 32px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -1px; }
.bento-title { font-size: 18px; color: #6b7280; margin: 0 0 16px 0; font-weight: 500; }
.bento-contact { display: flex; gap: 16px; font-size: 13px; color: #4b5563; flex-wrap: wrap; }

.bento-avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.col-span-1 { grid-column: span 1; }
.col-span-2 { grid-column: span 2; }
.col-span-3 { grid-column: span 3; }

.bento-card-title { font-size: 16px; font-weight: 700; margin: 0 0 16px 0; color: #111827; }
.bento-text { font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0; }

.bento-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.bento-pill { background-color: #f3f4f6; color: #374151; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 20px; }

.bento-list-item { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6; }
.bento-list-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
.item-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.item-primary { font-size: 16px; font-weight: 700; color: #111827; }
.item-date { font-size: 12px; color: #6b7280; font-weight: 500; }
.item-sub { font-size: 14px; color: #3b82f6; font-weight: 500; margin-bottom: 8px; }
.item-bullets { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6; color: #4b5563; }
.item-bullets li { margin-bottom: 4px; }

.bento-proj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.bento-proj-card { background-color: #f9fafb; border-radius: 16px; padding: 16px; }
.proj-name { font-size: 15px; font-weight: 700; margin: 0 0 8px 0; }
.proj-desc { font-size: 12px; line-height: 1.5; color: #4b5563; margin: 0 0 12px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.proj-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.proj-tag { font-size: 10px; font-weight: 600; color: #6b7280; background: #fff; border: 1px solid #e5e7eb; padding: 2px 6px; border-radius: 6px; }

.bento-edu-item { margin-bottom: 16px; }
.edu-school { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.edu-detail { font-size: 12px; color: #4b5563; margin-bottom: 4px; }
.edu-year { font-size: 11px; color: #9ca3af; font-weight: 500; }
</style>