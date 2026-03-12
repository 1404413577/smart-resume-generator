<template>
  <div class="pure-template" :style="templateStyles">
    
    <header class="pure-header" :class="['photo-pos-' + (resumeData.personalInfo?.photoPosition || 'right')]">
      
      <div class="header-text">
        <h1 class="pure-name">{{ resumeData.personalInfo?.name || 'Your Name' }}</h1>
        <h2 class="pure-title">{{ resumeData.personalInfo?.targetPosition || 'Job Title' }}</h2>
        
        <div class="pure-contact">
          <span v-if="resumeData.personalInfo?.phone">{{ resumeData.personalInfo.phone }}</span>
          <span class="dot" v-if="resumeData.personalInfo?.phone && resumeData.personalInfo?.email">•</span>
          <span v-if="resumeData.personalInfo?.email">{{ resumeData.personalInfo.email }}</span>
          <span class="dot" v-if="(resumeData.personalInfo?.email || resumeData.personalInfo?.phone) && resumeData.personalInfo?.website">•</span>
          <span v-if="resumeData.personalInfo?.website">{{ resumeData.personalInfo.website }}</span>
        </div>
      </div>

      <div class="avatar-container" v-if="resumeData.personalInfo?.photo">
        <img :src="resumeData.personalInfo.photo" alt="Profile" />
      </div>

    </header>

    <div class="pure-body">
      <section class="pure-section" v-if="resumeData.summary">
        <div class="section-left"><h3 class="section-title">Profile</h3></div>
        <div class="section-right"><p class="pure-text">{{ resumeData.summary }}</p></div>
      </section>

      <section class="pure-section" v-if="resumeData.workExperience?.length">
        <div class="section-left"><h3 class="section-title">Experience</h3></div>
        <div class="section-right">
          <div class="pure-item" v-for="work in resumeData.workExperience" :key="work.id">
            <div class="item-header">
              <h4 class="item-primary">{{ work.position }}</h4>
              <span class="item-date">{{ work.startDate }} — {{ work.endDate }}</span>
            </div>
            <div class="item-secondary">{{ work.company }}</div>
            <p class="pure-text" v-if="work.description">{{ work.description }}</p>
            <ul class="pure-list" v-if="work.achievements?.length">
              <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="pure-section" v-if="resumeData.projects?.length">
        <div class="section-left"><h3 class="section-title">Projects</h3></div>
        <div class="section-right">
          <div class="pure-item" v-for="project in resumeData.projects" :key="project.id">
            <div class="item-header">
              <h4 class="item-primary">{{ project.name }}</h4>
              <span class="item-date">{{ project.endDate }}</span>
            </div>
            <p class="pure-text">{{ project.description }}</p>
            <div class="pure-tags" v-if="project.technologies?.length">
              <span class="pure-tag" v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="pure-section" v-if="resumeData.skills?.length">
        <div class="section-left"><h3 class="section-title">Skills</h3></div>
        <div class="section-right">
          <div class="skill-grid">
            <div class="skill-group" v-for="skill in resumeData.skills" :key="skill.name">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level">{{ skill.level }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="pure-section" v-if="resumeData.education?.length">
        <div class="section-left"><h3 class="section-title">Education</h3></div>
        <div class="section-right">
          <div class="pure-item" v-for="edu in resumeData.education" :key="edu.id">
            <div class="item-header">
              <h4 class="item-primary">{{ edu.school }}</h4>
              <span class="item-date">{{ edu.startDate }} — {{ edu.endDate }}</span>
            </div>
            <div class="item-secondary">{{ edu.major }} | {{ edu.degree }}</div>
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
    default: 'pure'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.pure-template {
  --p-text-main: #111827;
  --p-text-muted: #6b7280;
  --p-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  
  font-family: var(--p-font);
  background-color: #ffffff;
  color: var(--p-text-main);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 60px 50px;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* 头部 Flex 布局与照片对齐逻辑 */
.pure-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
  gap: 30px;
}

/* 默认靠右：文字在左，照片在右 (HTML结构已满足) */

/* 靠左排版：反转 flex 方向 */
.pure-header.photo-pos-left {
  flex-direction: row-reverse;
  justify-content: flex-end;
}
.pure-header.photo-pos-left .header-text {
  flex: 1;
}

/* 居中排版：变为垂直排列 */
.pure-header.photo-pos-center {
  flex-direction: column-reverse;
  text-align: center;
}
.pure-header.photo-pos-center .pure-contact {
  justify-content: center;
}

.avatar-container {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 50%; /* 也可以改成 8px 变为微圆角方形 */
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 文本样式保持不变 */
.pure-name {
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 1px;
  margin: 0 0 8px 0;
  text-transform: uppercase;
}
.pure-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--p-text-muted);
  margin: 0 0 15px 0;
  letter-spacing: 0.5px;
}
.pure-contact {
  font-size: 13px;
  color: var(--p-text-muted);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.dot { font-size: 16px; line-height: 1; }

.pure-section {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 30px;
  margin-bottom: 40px;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--p-text-muted);
  margin: 0;
  padding-top: 2px;
}
.pure-item { margin-bottom: 25px; }
.pure-item:last-child { margin-bottom: 0; }
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}
.item-primary { font-size: 15px; font-weight: 600; margin: 0; }
.item-date { font-size: 13px; color: var(--p-text-muted); }
.item-secondary { font-size: 14px; font-weight: 500; color: var(--p-text-muted); margin-bottom: 8px; }
.pure-text { font-size: 13px; line-height: 1.6; margin: 0 0 10px 0; color: #374151; }
.pure-list { margin: 0; padding-left: 16px; font-size: 13px; line-height: 1.6; color: #374151; }
.pure-list li { margin-bottom: 6px; }
.pure-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.pure-tag { font-size: 12px; color: var(--p-text-muted); border: 1px solid #e5e7eb; padding: 3px 10px; border-radius: 20px; }
.skill-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
.skill-group { display: flex; justify-content: space-between; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px; }
.skill-name { font-size: 13px; font-weight: 500; }
.skill-level { font-size: 12px; color: var(--p-text-muted); }
</style>