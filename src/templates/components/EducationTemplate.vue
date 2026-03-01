<template>
  <div class="education-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 侧边栏结构 -->
      <aside class="sidebar">
        <div class="profile-section">
          <div class="avatar-wrapper" v-if="resumeData.personalInfo?.photo">
            <img :src="resumeData.personalInfo.photo" alt="Profile Photo" class="avatar" />
          </div>
          <h1 class="name">{{ resumeData.personalInfo?.name || 'Jane Doe' }}</h1>
          <h2 class="title">{{ resumeData.personalInfo?.targetPosition || resumeData.personalInfo?.title || 'Educator / Teacher' }}</h2>
        </div>

        <div class="sidebar-module contact-module">
          <h3 class="side-title">Contact</h3>
          <ul class="contact-list">
            <li v-if="resumeData.personalInfo?.email"><span>📧</span> {{ resumeData.personalInfo.email }}</li>
            <li v-if="resumeData.personalInfo?.phone"><span>📞</span> {{ resumeData.personalInfo.phone }}</li>
            <li v-if="resumeData.personalInfo?.address"><span>📍</span> {{ resumeData.personalInfo.address }}</li>
            <li v-if="resumeData.personalInfo?.website"><span>🔗</span> {{ resumeData.personalInfo.website }}</li>
          </ul>
        </div>

        <div class="sidebar-module" v-if="resumeData.skills?.length">
          <h3 class="side-title">Core Competencies</h3>
          <div class="skills-tags">
            <span class="skill-tag" v-for="skill in resumeData.skills" :key="skill.name">
              {{ skill.name }}
            </span>
          </div>
        </div>

        <div class="sidebar-module" v-if="resumeData.languages?.length">
          <h3 class="side-title">Languages</h3>
          <ul class="lang-list">
            <li v-for="lang in resumeData.languages" :key="lang.name">
              <strong>{{ lang.name }}</strong>
              <span class="lang-level">{{ lang.level }}</span>
            </li>
          </ul>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <div class="content-module" v-if="resumeData.summary">
          <h2 class="main-title">Professional Summary</h2>
          <div class="summary-card">
            <p>{{ resumeData.summary }}</p>
          </div>
        </div>

        <div class="content-module" v-if="resumeData.workExperience?.length">
          <h2 class="main-title">Teaching & Work Experience</h2>
          <div class="timeline">
            <div class="timeline-item card" v-for="work in resumeData.workExperience" :key="work.id">
              <div class="card-header">
                <div>
                  <h3 class="position-title">{{ work.position }}</h3>
                  <h4 class="org-name">{{ work.company }} <span v-if="work.location">| {{ work.location }}</span></h4>
                </div>
                <div class="date-badge">{{ work.startDate }} - {{ work.endDate }}</div>
              </div>
              <p class="description-text" v-if="work.description">{{ work.description }}</p>
              <ul class="bullet-points" v-if="work.achievements?.length">
                <li v-for="ach in work.achievements" :key="ach">
                  <span class="bullet-icon">✏️</span> {{ ach }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="content-module" v-if="resumeData.education?.length">
          <h2 class="main-title">Education Background</h2>
          <div class="education-grid">
            <div class="edu-card" v-for="edu in resumeData.education" :key="edu.id">
              <div class="edu-year">{{ edu.endDate }}</div>
              <h3 class="program-name">{{ edu.degree }} in {{ edu.major }}</h3>
              <p class="school-name">{{ edu.school }}</p>
              <p class="edu-meta" v-if="edu.gpa || edu.honors">
                <span v-if="edu.gpa">GPA: {{ edu.gpa }}</span>
                <span v-if="edu.gpa && edu.honors"> | </span>
                <span v-if="edu.honors">{{ edu.honors }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="content-module" v-if="resumeData.awards?.length">
          <h2 class="main-title">Certifications & Awards</h2>
          <ul class="cert-list">
            <li v-for="cert in resumeData.awards" :key="cert.name">
              <div class="cert-icon">🏆</div>
              <div class="cert-info">
                <strong>{{ cert.name }}</strong>
                <span class="cert-org" v-if="cert.organization">{{ cert.organization }}</span>
              </div>
            </li>
          </ul>
        </div>
      </main>
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
    default: 'education'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.education-template {
  /* 温暖、结构化、圆润亲和力的设计 */
  font-family: 'Nunito', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: var(--background-color, #f4f6f8);
  color: var(--text-color, #2c3e50);
  line-height: 1.6;
  font-size: 13px;
}

.resume-container {
  display: flex;
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* 柔和的大阴影 */
  overflow: hidden;
}

/* 左侧栏 */
.sidebar {
  width: 32%;
  background: #fff8f0; /* 非常淡的暖阳色/豆沙底色 */
  padding: 35px 25px;
  border-right: 1px solid #f0e6dd;
}

.profile-section {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-wrapper {
  width: 130px;
  height: 130px;
  margin: 0 auto 15px auto;
  border-radius: 50%;
  padding: 5px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-size: 26px;
  font-weight: 800;
  color: #34495e;
  margin: 0 0 5px 0;
  line-height: 1.2;
}

.title {
  font-size: 15px;
  color: #d35400; /* 暖橙色 */
  font-weight: 600;
  margin: 0;
}

.sidebar-module {
  margin-bottom: 25px;
}

.side-title {
  font-size: 15px;
  text-transform: uppercase;
  color: #7f8c8d;
  font-weight: 700;
  border-bottom: 2px solid #e67e22; /* 暖色分割线 */
  padding-bottom: 5px;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-list li {
  margin-bottom: 10px;
  font-size: 12.5px;
  display: flex;
  align-items: center;
}

.contact-list span {
  margin-right: 8px;
  font-size: 14px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: #ffffff;
  color: #34495e;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #e8dcd0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}

.lang-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lang-list li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.lang-level {
  color: #7f8c8d;
  font-style: italic;
  font-size: 12px;
}

/* 右侧主内容 */
.main-content {
  width: 68%;
  padding: 35px 30px;
  background: #ffffff;
}

.main-title {
  font-size: 20px;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
}

.main-title::after {
  content: "";
  flex-grow: 1;
  height: 2px;
  background: #ecf0f1;
  margin-left: 15px;
  border-radius: 2px;
}

.content-module {
  margin-bottom: 30px;
}

/* 卡片风格 */
.summary-card {
  background: #fdfbf7;
  padding: 15px 20px;
  border-radius: 12px;
  border-left: 4px solid #e67e22;
}

.summary-card p {
  margin: 0;
  text-align: justify;
}

.card {
  background: #ffffff;
  border: 1px solid #f0f3f4;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.position-title {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.org-name {
  font-size: 14px;
  font-weight: 600;
  color: #7f8c8d;
  margin: 0;
}

.date-badge {
  background: #fef5e7;
  color: #d35400;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}

.description-text {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 12.5px;
}

.bullet-points {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bullet-points li {
  margin-bottom: 6px;
  font-size: 12.5px;
  color: #444;
  display: flex;
  align-items: flex-start;
}

.bullet-icon {
  margin-right: 8px;
  font-size: 12px;
  margin-top: 2px;
}

/* 教育网格 */
.education-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.edu-card {
  background: #fdfbf7;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #f3ebe1;
}

.edu-year {
  font-size: 12px;
  color: #e67e22;
  font-weight: 800;
  margin-bottom: 5px;
}

.program-name {
  font-size: 14px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.school-name {
  font-size: 13px;
  color: #7f8c8d;
  margin: 0 0 5px 0;
}

.edu-meta {
  font-size: 11px;
  color: #95a5a6;
  margin: 0;
  font-weight: 600;
}

/* 证书列表 */
.cert-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.cert-list li {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ecf0f1;
}

.cert-icon {
  font-size: 20px;
  margin-right: 12px;
  background: #f4f6f8;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.cert-info strong {
  display: block;
  font-size: 13px;
  color: #2c3e50;
}

.cert-org {
  display: block;
  font-size: 11px;
  color: #95a5a6;
  margin-top: 2px;
}

/* 打印与导出适配 */
@media print {
  .resume-container {
    box-shadow: none;
  }
  .card:hover {
    transform: none;
    box-shadow: 0 3px 10px rgba(0,0,0,0.03);
  }
}
</style>
