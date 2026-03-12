<template>
  <div class="standard-clean-template" :style="templateStyles">
    
    <header class="sc-header" :class="['photo-pos-' + (resumeData.personalInfo?.photoPosition || 'right')]">
      
      <div class="sc-avatar" v-if="resumeData.personalInfo?.photo">
        <div class="img-wrapper">
          <img :src="resumeData.personalInfo.photo" alt="Photo" />
        </div>
      </div>

      <div class="sc-header-text">
        <h1 class="sc-name">{{ resumeData.personalInfo?.name || 'NAME' }}</h1>
        <div class="sc-contact">
          <span v-if="resumeData.personalInfo?.phone">{{ resumeData.personalInfo.phone }}</span>
          <span class="divider" v-if="resumeData.personalInfo?.phone && resumeData.personalInfo?.email">|</span>
          <span v-if="resumeData.personalInfo?.email">{{ resumeData.personalInfo.email }}</span>
          <span class="divider" v-if="(resumeData.personalInfo?.email || resumeData.personalInfo?.phone) && resumeData.personalInfo?.address">|</span>
          <span v-if="resumeData.personalInfo?.address">{{ resumeData.personalInfo.address }}</span>
          <span class="divider" v-if="resumeData.personalInfo?.website">|</span>
          <span v-if="resumeData.personalInfo?.website">{{ resumeData.personalInfo.website }}</span>
        </div>
      </div>
    </header>

    <div class="sc-body">
      <section class="sc-section" v-if="resumeData.summary">
        <h2 class="sc-section-title">SUMMARY</h2>
        <div class="sc-section-content"><p class="sc-text">{{ resumeData.summary }}</p></div>
      </section>

      <section class="sc-section" v-if="resumeData.education?.length">
        <h2 class="sc-section-title">EDUCATION</h2>
        <div class="sc-section-content">
          <div class="sc-item" v-for="edu in resumeData.education" :key="edu.id">
            <div class="sc-item-row">
              <div class="sc-item-main"><strong>{{ edu.school }}</strong></div>
              <div class="sc-item-date">{{ edu.startDate }} - {{ edu.endDate }}</div>
            </div>
            <div class="sc-item-row">
              <div class="sc-item-sub">{{ edu.degree }}, {{ edu.major }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="sc-section" v-if="resumeData.workExperience?.length">
        <h2 class="sc-section-title">EXPERIENCE</h2>
        <div class="sc-section-content">
          <div class="sc-item" v-for="work in resumeData.workExperience" :key="work.id">
            <div class="sc-item-row">
              <div class="sc-item-main"><strong>{{ work.company }}</strong> — {{ work.position }}</div>
              <div class="sc-item-date">{{ work.startDate }} - {{ work.endDate }}</div>
            </div>
            <p class="sc-text italic-desc" v-if="work.description">{{ work.description }}</p>
            <ul class="sc-list" v-if="work.achievements?.length">
              <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="sc-section" v-if="resumeData.projects?.length">
        <h2 class="sc-section-title">PROJECTS</h2>
        <div class="sc-section-content">
          <div class="sc-item" v-for="project in resumeData.projects" :key="project.id">
            <div class="sc-item-row">
              <div class="sc-item-main"><strong>{{ project.name }}</strong> <span class="tech-inline" v-if="project.technologies">| {{ project.technologies.join(', ') }}</span></div>
              <div class="sc-item-date">{{ project.endDate }}</div>
            </div>
            <p class="sc-text mt-1">{{ project.description }}</p>
          </div>
        </div>
      </section>

      <section class="sc-section" v-if="resumeData.skills?.length">
        <h2 class="sc-section-title">SKILLS</h2>
        <div class="sc-section-content sc-skills-inline">
          <div class="sc-skill-line" v-for="skill in resumeData.skills" :key="skill.name">
            <strong>{{ skill.name }}:</strong> <span>{{ skill.level }}</span>
          </div>
        </div>
      </section>

    </div>
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
    default: 'standardClean'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.standard-clean-template {
  --sc-text: #000000;
  --sc-text-light: #444444;
  font-family: 'Times New Roman', Times, serif;
  background-color: #ffffff;
  color: var(--sc-text);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 50px 60px;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* 头部相对定位，以便头像能够绝对定位悬挂 */
.sc-header {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
  /* 如果有头像，且没有居中，确保头部有足够高度不被下方内容重叠 */
  min-height: 80px; 
}

/* 传统 3:4 证件照白底细框样式 */
.sc-avatar {
  width: 85px;
  height: 113px; /* 3:4 比例 */
  background: #fff;
  border: 1px solid #ccc;
  padding: 4px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  z-index: 10;
}

.img-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f8f9fa;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 头像排版控制 */
.photo-pos-right .sc-avatar {
  right: 0;
}

.photo-pos-left .sc-avatar {
  left: 0;
}

.photo-pos-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.photo-pos-center .sc-avatar {
  position: relative; /* 居中时取消绝对定位，融入正常文档流 */
  margin-bottom: 15px;
}

.sc-name {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sc-contact {
  font-size: 13px;
  color: var(--sc-text-light);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.divider { color: #cccccc; }
.sc-section { margin-bottom: 25px; }
.sc-section-title {
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1px solid #000000;
  padding-bottom: 4px;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
}
.sc-item { margin-bottom: 15px; }
.sc-item:last-child { margin-bottom: 0; }
.sc-item-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.sc-item-main { font-size: 14px; }
.sc-item-date { font-size: 13px; color: var(--sc-text-light); }
.sc-item-sub { font-size: 14px; font-style: italic; color: var(--sc-text-light); }
.tech-inline { font-size: 13px; color: var(--sc-text-light); font-weight: normal; }
.sc-text { font-size: 13.5px; line-height: 1.5; margin: 0; }
.italic-desc { font-style: italic; margin-bottom: 6px; }
.mt-1 { margin-top: 4px; }
.sc-list { margin: 4px 0 0 0; padding-left: 18px; font-size: 13.5px; line-height: 1.5; }
.sc-list li { margin-bottom: 4px; }
.sc-skills-inline { display: flex; flex-wrap: wrap; gap: 15px 30px; }
.sc-skill-line { font-size: 14px; }
</style>