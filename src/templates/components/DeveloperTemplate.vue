<template>
  <div class="developer-template" :style="templateStyles">
    <div class="resume-container">
      <header>
        <h1 class="name">{{ resumeData.personalInfo?.name || 'NAME SURNAME' }}</h1>
        <div class="contact-info">
          <span v-if="resumeData.personalInfo?.location">{{ resumeData.personalInfo.location }}</span>
          <span v-if="resumeData.personalInfo?.location && resumeData.personalInfo?.jobStatus" class="separator"> | </span>
          <span v-if="resumeData.personalInfo?.jobStatus">{{ resumeData.personalInfo.jobStatus }}</span>
          <span v-if="(resumeData.personalInfo?.location || resumeData.personalInfo?.jobStatus) && resumeData.personalInfo?.salary" class="separator"> | </span>
          <span v-if="resumeData.personalInfo?.salary">薪资：{{ resumeData.personalInfo.salary }}</span>
          <br v-if="resumeData.personalInfo?.location || resumeData.personalInfo?.jobStatus || resumeData.personalInfo?.salary">
          
          <span v-if="resumeData.personalInfo?.phone">电话：{{ resumeData.personalInfo.phone }}</span>
          <span v-if="resumeData.personalInfo?.phone && resumeData.personalInfo?.email" class="separator"> | </span>
          <span v-if="resumeData.personalInfo?.email">
            邮箱：<a :href="`mailto:${resumeData.personalInfo.email}`" class="text-link">{{ resumeData.personalInfo.email }}</a>
          </span>
          <span v-if="(resumeData.personalInfo?.phone || resumeData.personalInfo?.email) && resumeData.personalInfo?.website" class="separator"> | </span>
          <span v-if="resumeData.personalInfo?.website">
            网站/博客：<a :href="resumeData.personalInfo.website" target="_blank" class="text-link">{{ resumeData.personalInfo.website }}</a>
          </span>
        </div>
      </header>

      <section v-if="resumeData.summary">
        <h2>个人简介</h2>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </section>

      <section v-if="resumeData.education?.length">
        <h2>教育经历</h2>
        <div class="education-item" v-for="edu in resumeData.education" :key="edu.id">
          <p>
            <strong>{{ edu.school }}</strong>
            <span v-if="edu.major"> - {{ edu.major }}</span>
            <span v-if="edu.degree"> | {{ edu.degree }}</span>
            <br />
            <em>{{ edu.startDate ? edu.startDate + ' - ' : '' }}{{ edu.endDate }}</em>
          </p>
          <p v-if="edu.description || edu.gpa || edu.honors" class="edu-details">
            <span v-if="edu.gpa">GPA: {{ edu.gpa }} </span>
            <span v-if="edu.honors">{{ edu.honors }} </span>
            {{ edu.description }}
          </p>
        </div>
      </section>

      <section v-if="resumeData.skills?.length">
        <h2>专业技能</h2>
        <ul class="skills-list">
          <li v-for="skill in resumeData.skills" :key="skill.name">
            <strong>{{ skill.name }}</strong>
            <span v-if="skill.level"> ({{ skill.level }})</span>
            <span v-if="skill.description"> - {{ skill.description }}</span>
          </li>
        </ul>
      </section>

      <section v-if="resumeData.workExperience?.length">
        <h2>工作经历</h2>
        <div class="experience-item" v-for="work in resumeData.workExperience" :key="work.id">
          <h3>
            {{ work.company }} 
            <span v-if="work.position" class="position-title">| {{ work.position }}</span>
          </h3>
          <p class="job-meta">
            {{ work.startDate }} - {{ work.endDate }}
            <span v-if="work.location"> | {{ work.location }}</span>
            <span v-if="work.department"> | {{ work.department }}</span>
          </p>
          <p class="work-desc" v-if="work.description">{{ work.description }}</p>
          <ul v-if="work.achievements?.length">
            <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
          </ul>
        </div>
      </section>

      <section v-if="resumeData.projects?.length">
        <h2>项目经历</h2>
        <div class="project-item" v-for="project in resumeData.projects" :key="project.id">
          <h3>
            {{ project.name }}
            <span v-if="project.role" class="position-title">| {{ project.role }}</span>
          </h3>
          <p class="job-meta">
            {{ project.startDate }} - {{ project.endDate }}
          </p>
          <p class="tech-stack" v-if="project.technologies?.length">
            <strong>技术栈：</strong>{{ project.technologies.join('、') }}
          </p>
          <p class="work-desc" v-if="project.description">{{ project.description }}</p>
          <ul v-if="project.highlights?.length">
            <li v-for="hit in project.highlights" :key="hit">{{ hit }}</li>
          </ul>
        </div>
      </section>
      
      <section v-if="resumeData.awards?.length || resumeData.certifications?.length">
        <h2>证书与荣誉</h2>
        <ul class="cert-list">
          <li v-for="cert in resumeData.certifications" :key="cert.name">
            <strong>{{ cert.name }}</strong>
            <span v-if="cert.issuer"> - {{ cert.issuer }}</span>
            <span v-if="cert.date"> ({{ cert.date }})</span>
          </li>
          <li v-for="award in resumeData.awards" :key="award.name">
            <strong>{{ award.name }}</strong>
            <span v-if="award.organization"> - {{ award.organization }}</span>
            <span v-if="award.date"> ({{ award.date }})</span>
          </li>
        </ul>
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
    default: 'developer'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.developer-template {
  font-family: var(--resume-font-family, "Helvetica Neue", Helvetica, Arial, sans-serif);
  line-height: var(--resume-line-height, 1.4);
  color: var(--resume-text-color, #333);
  background-color: var(--resume-background-color, #fafafa);
  font-size: var(--resume-base-font-size, 14px);
}

.resume-container {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 20mm;
  background-color: #fafafa;
  box-sizing: border-box;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1.name {
  font-size: var(--resume-name-font-size, 2em);
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--resume-primary-color, #222);
}

.contact-info {
  font-size: 1em;
  color: #666;
  line-height: 1.6;
}

section {
  margin-bottom: 25px;
}

h2 {
  font-size: var(--resume-title-font-size, 1.4em);
  border-bottom: 2px solid var(--resume-primary-color, #444);
  padding-bottom: 5px;
  margin-bottom: 15px;
  color: var(--resume-primary-color, #222);
  font-weight: bold;
}

h3 {
  font-size: var(--resume-subtitle-font-size, 1.1em);
  margin-bottom: 8px;
  color: var(--resume-primary-color, #333);
  font-weight: bold;
}

.position-title {
  font-weight: normal;
  font-size: var(--resume-content-font-size, 0.95em);
  color: #444;
}

.job-meta {
  color: #666;
  font-style: italic;
  margin-bottom: 10px;
  font-size: var(--resume-meta-font-size, 0.95em);
}

ul {
  padding-left: 20px;
  margin-top: 5px;
  margin-bottom: 10px;
}

li {
  margin-bottom: 8px;
  text-align: justify;
}

p {
  margin-top: 0;
  margin-bottom: 10px;
  text-align: justify;
}

.summary-text {
  text-align: justify;
}

.text-link {
  color: var(--resume-primary-color, #007acc);
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
}

.tech-stack {
  margin-bottom: 8px;
}

.work-desc {
  margin-bottom: 6px;
}

.edu-details {
  font-size: var(--resume-content-font-size, 0.95em);
  color: #555;
  margin-top: 4px;
}

.separator {
  margin: 0 4px;
}

/* 打印与导出适配 */
@media print {
  .resume-container {
    box-shadow: none;
  }
}
</style>
