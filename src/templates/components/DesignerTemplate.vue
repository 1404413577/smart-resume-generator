<template>
  <div class="designer-template" :style="templateStyles">
    <!-- 创意头部 -->
    <div class="designer-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="designer-avatar" v-if="resumeData.personalInfo?.photo">
          <img :src="resumeData.personalInfo.photo" alt="头像" />
          <div class="avatar-ring"></div>
        </div>
        <div class="designer-intro">
          <h1 class="designer-name">{{ resumeData.personalInfo?.name || '设计师姓名' }}</h1>
          <h2 class="designer-role">{{ resumeData.personalInfo?.targetPosition || '创意设计师' }}</h2>
          <p class="designer-tagline" v-if="resumeData.summary">{{ resumeData.summary }}</p>
        </div>
        <div class="contact-creative">
          <div class="contact-item" v-if="resumeData.personalInfo?.email">
            <div class="contact-icon">📧</div>
            <span>{{ resumeData.personalInfo.email }}</span>
          </div>
          <div class="contact-item" v-if="resumeData.personalInfo?.phone">
            <div class="contact-icon">📱</div>
            <span>{{ resumeData.personalInfo.phone }}</span>
          </div>
          <div class="contact-item" v-if="resumeData.personalInfo?.website">
            <div class="contact-icon">🌐</div>
            <span>{{ resumeData.personalInfo.website }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="designer-content">
      <!-- 设计技能 -->
      <section v-if="resumeData.skills?.length > 0" class="designer-section skills-showcase">
        <h3 class="section-title">
          <span class="title-text">设计技能</span>
          <div class="title-decoration"></div>
        </h3>
        <div class="skills-creative">
          <div 
            v-for="skill in resumeData.skills" 
            :key="skill.id"
            class="skill-bubble"
            :style="{ '--skill-level': getSkillLevel(skill.level) }"
          >
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-level">{{ skill.level }}</div>
            <div class="skill-progress">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 作品集项目 -->
      <section v-if="resumeData.projects?.length > 0" class="designer-section portfolio-showcase">
        <h3 class="section-title">
          <span class="title-text">作品集</span>
          <div class="title-decoration"></div>
        </h3>
        <div class="portfolio-grid">
          <div 
            v-for="project in resumeData.projects" 
            :key="project.id"
            class="portfolio-item"
          >
            <div class="portfolio-card">
              <div class="project-header">
                <h4 class="project-title">{{ project.name }}</h4>
                <div class="project-date">{{ project.startDate }} - {{ project.endDate }}</div>
              </div>
              <p class="project-desc">{{ project.description }}</p>
              <div class="project-tech" v-if="project.technologies?.length">
                <div class="tech-tags">
                  <span 
                    v-for="tech in project.technologies" 
                    :key="tech"
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
              <div class="project-highlights" v-if="project.highlights?.length">
                <ul class="highlights-list">
                  <li v-for="highlight in project.highlights" :key="highlight">
                    {{ highlight }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 工作经历 -->
      <section v-if="resumeData.workExperience?.length > 0" class="designer-section experience-creative">
        <h3 class="section-title">
          <span class="title-text">工作经历</span>
          <div class="title-decoration"></div>
        </h3>
        <div class="experience-timeline">
          <div 
            v-for="work in resumeData.workExperience" 
            :key="work.id"
            class="timeline-item"
          >
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="work-period">{{ work.startDate }} - {{ work.endDate }}</div>
              <h4 class="work-position">{{ work.position }}</h4>
              <h5 class="work-company">{{ work.company }}</h5>
              <p class="work-description">{{ work.description }}</p>
              <div class="work-achievements" v-if="work.achievements?.length">
                <ul>
                  <li v-for="achievement in work.achievements" :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 教育背景 -->
      <section v-if="resumeData.education?.length > 0" class="designer-section education-creative">
        <h3 class="section-title">
          <span class="title-text">教育背景</span>
          <div class="title-decoration"></div>
        </h3>
        <div class="education-cards">
          <div 
            v-for="edu in resumeData.education" 
            :key="edu.id"
            class="education-card"
          >
            <div class="edu-year">{{ edu.endDate }}</div>
            <div class="edu-details">
              <h4 class="edu-degree">{{ edu.degree }}</h4>
              <h5 class="edu-major">{{ edu.major }}</h5>
              <h6 class="edu-school">{{ edu.school }}</h6>
              <div class="edu-honors" v-if="edu.honors">{{ edu.honors }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 语言能力 -->
      <section v-if="resumeData.languages?.length > 0" class="designer-section languages-creative">
        <h3 class="section-title">
          <span class="title-text">语言能力</span>
          <div class="title-decoration"></div>
        </h3>
        <div class="languages-grid">
          <div 
            v-for="lang in resumeData.languages" 
            :key="lang.id"
            class="language-item"
          >
            <div class="lang-name">{{ lang.name }}</div>
            <div class="lang-level">{{ lang.level }}</div>
          </div>
        </div>
      </section>
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
    default: 'designer'
  }
})

// 使用模板样式
const { templateStyles } = useTemplateComponentStyles(props.templateId)

// 获取技能等级百分比
const getSkillLevel = (level) => {
  const levelMap = {
    '初级': '30%',
    '中级': '60%',
    '高级': '85%',
    '专家': '95%',
    '精通': '100%'
  }
  return levelMap[level] || '50%'
}
</script>

<style scoped>
.designer-template {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  font-family: var(--font-family, 'Inter, sans-serif');
  color: var(--theme-text-primary, #1a202c);
  line-height: var(--line-height, 1.6);
  margin: 0 auto;
  overflow: hidden;
}

/* 创意头部 */
.designer-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 40px 30px;
  color: white;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1.5" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 30px;
  align-items: center;
}

.designer-avatar {
  position: relative;
  width: 120px;
  height: 120px;
}

.designer-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.avatar-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.designer-intro {
  text-align: center;
}

.designer-name {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(45deg, #ffffff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.designer-role {
  font-size: 20px;
  font-weight: 300;
  margin: 0 0 16px 0;
  opacity: 0.9;
  font-style: italic;
}

.designer-tagline {
  font-size: 16px;
  opacity: 0.8;
  max-width: 400px;
  margin: 0 auto;
}

.contact-creative {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  opacity: 0.9;
}

.contact-icon {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

/* 主要内容 */
.designer-content {
  padding: 40px 30px;
}

.designer-section {
  margin-bottom: 50px;
}

.section-title {
  position: relative;
  margin-bottom: 30px;
  text-align: center;
}

.title-text {
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;
  padding: 0 20px;
  background-color: white;
}

.title-decoration {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
  z-index: 1;
}

/* 设计技能 */
.skills-creative {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.skill-bubble {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.skill-bubble:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.skill-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
}

.skill-level {
  font-size: 14px;
  color: #667eea;
  margin-bottom: 12px;
}

.skill-progress {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  width: var(--skill-level);
  transition: width 1s ease;
}

/* 作品集 */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.portfolio-item {
  position: relative;
}

.portfolio-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 25px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.portfolio-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
}

.portfolio-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(102, 126, 234, 0.15);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.project-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.project-date {
  font-size: 12px;
  color: #667eea;
  background: #f0f9ff;
  padding: 4px 8px;
  border-radius: 12px;
}

.project-desc {
  color: #4a5568;
  margin: 0 0 15px 0;
  line-height: 1.6;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
}

.tech-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.highlights-list li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
  color: #4a5568;
  font-size: 14px;
}

.highlights-list li::before {
  content: '✨';
  position: absolute;
  left: 0;
  color: #667eea;
}

/* 工作经历时间线 */
.experience-timeline {
  position: relative;
  padding-left: 30px;
}

.experience-timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #667eea, #764ba2);
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
}

.timeline-marker {
  position: absolute;
  left: -37px;
  top: 8px;
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #667eea;
}

.timeline-content {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.work-period {
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 8px;
}

.work-position {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.work-company {
  font-size: 16px;
  color: #667eea;
  margin: 0 0 12px 0;
}

.work-description {
  color: #4a5568;
  margin: 0 0 12px 0;
}

.work-achievements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.work-achievements li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 6px;
  color: #4a5568;
  font-size: 14px;
}

.work-achievements li::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: #667eea;
  font-size: 10px;
}

/* 教育背景 */
.education-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.education-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 25px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  gap: 20px;
  align-items: center;
}

.edu-year {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  flex-shrink: 0;
}

.edu-details {
  flex: 1;
}

.edu-degree {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.edu-major {
  font-size: 14px;
  color: #667eea;
  margin: 0 0 4px 0;
}

.edu-school {
  font-size: 14px;
  color: #4a5568;
  margin: 0 0 8px 0;
}

.edu-honors {
  font-size: 12px;
  color: #667eea;
  background: #f0f9ff;
  padding: 4px 8px;
  border-radius: 8px;
  display: inline-block;
}

/* 语言能力 */
.languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.language-item {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.language-item:hover {
  transform: scale(1.05);
}

.lang-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.lang-level {
  font-size: 14px;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .designer-template {
    width: 100%;
    min-height: auto;
  }

  .designer-header {
    padding: 20px 15px;
  }

  .header-content {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }

  .designer-name {
    font-size: 32px;
  }

  .designer-content {
    padding: 20px 15px;
  }

  .skills-creative,
  .portfolio-grid,
  .education-cards,
  .languages-grid {
    grid-template-columns: 1fr;
  }

  .experience-timeline {
    padding-left: 20px;
  }

  .timeline-marker {
    left: -27px;
  }
}

/* 打印样式 */
@media print {
  .designer-template {
    box-shadow: none;
    margin: 0;
  }

  .avatar-ring {
    animation: none;
  }
}
</style>
