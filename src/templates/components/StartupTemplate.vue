<template>
  <div class="startup-template" :style="templateStyles">
    <!-- 创新头部 -->
    <div class="startup-header">
      <div class="header-mesh"></div>
      <div class="header-content">
        <div class="startup-hero">
          <div class="hero-avatar" v-if="resumeData.personalInfo?.photo">
            <img :src="resumeData.personalInfo.photo" alt="头像" />
            <div class="avatar-glow"></div>
          </div>
          <div class="hero-content">
            <h1 class="startup-name">{{ resumeData.personalInfo?.name || '创新者' }}</h1>
            <h2 class="startup-role">{{ resumeData.personalInfo?.targetPosition || '产品经理' }}</h2>
            <div class="startup-vision" v-if="resumeData.summary">
              <div class="vision-icon">💡</div>
              <p>{{ resumeData.summary }}</p>
            </div>
            
            <!-- 快速联系 -->
            <div class="quick-contact">
              <a v-if="resumeData.personalInfo?.email" 
                 :href="`mailto:${resumeData.personalInfo.email}`" 
                 class="contact-link email">
                <span class="link-icon">📧</span>
                <span>{{ resumeData.personalInfo.email }}</span>
              </a>
              <a v-if="resumeData.personalInfo?.phone" 
                 :href="`tel:${resumeData.personalInfo.phone}`" 
                 class="contact-link phone">
                <span class="link-icon">📱</span>
                <span>{{ resumeData.personalInfo.phone }}</span>
              </a>
              <a v-if="resumeData.personalInfo?.website" 
                 :href="resumeData.personalInfo.website" 
                 class="contact-link website" 
                 target="_blank">
                <span class="link-icon">🌐</span>
                <span>Portfolio</span>
              </a>
              <a v-if="resumeData.personalInfo?.linkedin" 
                 :href="resumeData.personalInfo.linkedin" 
                 class="contact-link linkedin" 
                 target="_blank">
                <span class="link-icon">💼</span>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="startup-content">
      <!-- 核心技能云 -->
      <section v-if="resumeData.skills?.length > 0" class="startup-section skills-cloud">
        <h3 class="section-title">
          <span class="title-emoji">🚀</span>
          <span class="title-text">技能矩阵</span>
        </h3>
        <div class="skills-matrix">
          <div 
            v-for="skill in resumeData.skills" 
            :key="skill.id"
            class="skill-chip"
            :class="getSkillClass(skill.level)"
          >
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-badge">{{ skill.level }}</span>
          </div>
        </div>
      </section>

      <!-- 产品经验 -->
      <section v-if="resumeData.workExperience?.length > 0" class="startup-section experience-journey">
        <h3 class="section-title">
          <span class="title-emoji">🎯</span>
          <span class="title-text">产品之旅</span>
        </h3>
        <div class="journey-timeline">
          <div 
            v-for="(work, index) in resumeData.workExperience" 
            :key="work.id"
            class="journey-milestone"
            :class="{ 'milestone-featured': index === 0 }"
          >
            <div class="milestone-marker">
              <div class="marker-dot"></div>
              <div class="marker-line" v-if="index < resumeData.workExperience.length - 1"></div>
            </div>
            <div class="milestone-content">
              <div class="milestone-header">
                <div class="milestone-period">{{ work.startDate }} - {{ work.endDate }}</div>
                <div class="milestone-badge">{{ index === 0 ? '最新' : `第${resumeData.workExperience.length - index}站` }}</div>
              </div>
              <h4 class="milestone-role">{{ work.position }}</h4>
              <h5 class="milestone-company">{{ work.company }}</h5>
              <p class="milestone-description">{{ work.description }}</p>
              <div class="milestone-achievements" v-if="work.achievements?.length">
                <div class="achievements-title">关键成果</div>
                <div class="achievements-tags">
                  <span 
                    v-for="achievement in work.achievements" 
                    :key="achievement"
                    class="achievement-tag"
                  >
                    {{ achievement }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 创新项目 -->
      <section v-if="resumeData.projects?.length > 0" class="startup-section innovation-lab">
        <h3 class="section-title">
          <span class="title-emoji">⚡</span>
          <span class="title-text">创新实验室</span>
        </h3>
        <div class="innovation-grid">
          <div 
            v-for="project in resumeData.projects" 
            :key="project.id"
            class="innovation-card"
          >
            <div class="card-header">
              <div class="project-icon">🔬</div>
              <div class="project-meta">
                <h4 class="project-title">{{ project.name }}</h4>
                <div class="project-timeline">{{ project.startDate }} - {{ project.endDate }}</div>
              </div>
            </div>
            <p class="project-summary">{{ project.description }}</p>
            
            <div class="project-tech-stack" v-if="project.technologies?.length">
              <div class="tech-title">技术栈</div>
              <div class="tech-chips">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech"
                  class="tech-chip"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <div class="project-impact" v-if="project.highlights?.length">
              <div class="impact-title">项目亮点</div>
              <ul class="impact-points">
                <li v-for="highlight in project.highlights" :key="highlight">
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 学习成长 -->
      <section v-if="resumeData.education?.length > 0" class="startup-section growth-path">
        <h3 class="section-title">
          <span class="title-emoji">📚</span>
          <span class="title-text">成长轨迹</span>
        </h3>
        <div class="growth-cards">
          <div 
            v-for="edu in resumeData.education" 
            :key="edu.id"
            class="growth-card"
          >
            <div class="growth-year">{{ edu.endDate }}</div>
            <div class="growth-content">
              <h4 class="growth-degree">{{ edu.degree }}</h4>
              <h5 class="growth-field">{{ edu.major }}</h5>
              <h6 class="growth-institution">{{ edu.school }}</h6>
              <div class="growth-highlights" v-if="edu.gpa || edu.honors">
                <span v-if="edu.gpa" class="highlight-item">GPA {{ edu.gpa }}</span>
                <span v-if="edu.honors" class="highlight-item">{{ edu.honors }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 认证徽章 -->
      <section v-if="resumeData.certifications?.length > 0" class="startup-section badges-collection">
        <h3 class="section-title">
          <span class="title-emoji">🏆</span>
          <span class="title-text">成就徽章</span>
        </h3>
        <div class="badges-showcase">
          <div 
            v-for="cert in resumeData.certifications" 
            :key="cert.id"
            class="badge-item"
          >
            <div class="badge-icon">🏅</div>
            <div class="badge-info">
              <div class="badge-name">{{ cert.name }}</div>
              <div class="badge-issuer">{{ cert.issuer }}</div>
              <div class="badge-date">{{ cert.date }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 全球视野 -->
      <section v-if="resumeData.languages?.length > 0" class="startup-section global-reach">
        <h3 class="section-title">
          <span class="title-emoji">🌍</span>
          <span class="title-text">全球视野</span>
        </h3>
        <div class="languages-world">
          <div 
            v-for="lang in resumeData.languages" 
            :key="lang.id"
            class="language-sphere"
          >
            <div class="sphere-icon">🗣️</div>
            <div class="sphere-content">
              <div class="lang-name">{{ lang.name }}</div>
              <div class="lang-proficiency">{{ lang.level }}</div>
            </div>
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
    default: 'startup'
  }
})

// 使用模板样式
const { templateStyles } = useTemplateComponentStyles(props.templateId)

// 获取技能等级样式类
const getSkillClass = (level) => {
  const levelMap = {
    '初级': 'skill-beginner',
    '中级': 'skill-intermediate', 
    '高级': 'skill-advanced',
    '专家': 'skill-expert',
    '精通': 'skill-master'
  }
  return levelMap[level] || 'skill-intermediate'
}
</script>

<style scoped>
.startup-template {
  width: 210mm;
  min-height: 297mm;
  height: auto;
  background: var(--resume-background-color, #f8fafc);
  font-family: var(--resume-font-family, 'Helvetica Neue', Arial, sans-serif);
  color: var(--resume-text-color, #1e293b);
  line-height: var(--resume-line-height, 1.6);
  margin: 0 auto;
  overflow: visible;
}

/* 创新头部 (纯色圆角大区块) */
.startup-header {
  background: var(--resume-primary-color, #1e293b); 
  color: #ffffff;
  padding: 40px 30px;
  position: relative;
  border-radius: 0 0 32px 32px;
  margin-bottom: 10px;
}

.header-mesh {
  display: none; /* 移除网格背景 */
}

.header-content {
  position: relative;
  z-index: 2;
}

.startup-hero {
  display: flex;
  align-items: center;
  gap: 40px;
}

.hero-avatar {
  position: relative;
  width: 130px;
  height: 130px;
  flex-shrink: 0;
}

.hero-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 32px; /* 圆角矩形头像更符合现代扁平风格 */
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.1);
}

.avatar-glow {
  display: none; /* 移除发光动画特效 */
}

.hero-content {
  flex: 1;
}

.startup-name {
  font-size: var(--resume-name-font-size, 42px);
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #ffffff;
}

.startup-role {
  font-size: var(--resume-subtitle-font-size, 20px);
  font-weight: 500;
  margin: 0 0 20px 0;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.startup-vision {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #334155; /* 纯色卡片 */
  padding: 16px 20px;
  border-radius: 16px;
  margin-bottom: 25px;
}

.vision-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.startup-vision p {
  margin: 0;
  font-size: var(--resume-content-font-size, 15px);
  line-height: var(--resume-line-height, 1.6);
  color: #f8fafc;
}

.quick-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #334155;
  padding: 10px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #f8fafc;
  font-size: var(--resume-contact-font-size, 13px);
  font-weight: 500;
  transition: background 0.2s ease;
}

.contact-link:hover {
  background: #475569;
}

.link-icon {
  font-size: 16px;
}

/* 主要内容: 白色圆角块容器编排 */
.startup-content {
  padding: 20px 30px 40px;
}

.startup-section {
  margin-bottom: 30px;
  background: #ffffff;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  padding-bottom: 0;
  border: none;
}

.title-emoji {
  font-size: var(--resume-title-font-size, 24px);
}

.title-text {
  font-size: var(--resume-title-font-size, 22px);
  font-weight: 700;
  color: #0f172a;
}

/* 技能矩阵 (纯色) */
.skills-matrix {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 500;
}

/* 全部使用高级莫兰迪/护眼纯色 */
.skill-beginner { background: #f0fdf4; color: #166534; }
.skill-beginner .skill-badge { background: #dcfce7; color: #15803d; }
.skill-intermediate { background: #eff6ff; color: #1e40af; }
.skill-intermediate .skill-badge { background: #dbeafe; color: #1d4ed8; }
.skill-advanced { background: #fef2f2; color: #991b1b; }
.skill-advanced .skill-badge { background: #fee2e2; color: #b91c1c; }
.skill-expert { background: #fdf4ff; color: #86198f; }
.skill-expert .skill-badge { background: #fae8ff; color: #a21caf; }
.skill-master { background: #fff7ed; color: #c2410c; }
.skill-master .skill-badge { background: #ffedd5; color: #ea580c; }

.skill-name {
  font-size: var(--resume-skill-font-size, 14px);
}

.skill-badge {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: var(--resume-small-font-size, 11px);
  font-weight: 600;
}

/* 产品之旅/工作经验 */
.journey-timeline {
  position: relative;
}

.journey-milestone {
  display: flex;
  gap: 25px;
  margin-bottom: 30px;
}

.milestone-marker {
  position: relative;
  flex-shrink: 0;
  width: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-dot {
  width: 16px;
  height: 16px;
  background: #cbd5e1;
  border-radius: 50%;
  border: 4px solid #ffffff;
  box-shadow: 0 0 0 1px #e2e8f0;
}

.milestone-featured .marker-dot {
  background: var(--resume-primary-color, #3b82f6); /* 主点亮色 */
  box-shadow: 0 0 0 1px #3b82f6;
}

.marker-line {
  width: 2px;
  height: 100%;
  background: #e2e8f0;
  margin-top: 4px;
}

.milestone-content {
  flex: 1;
  padding-bottom: 10px;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.milestone-period {
  font-size: var(--resume-meta-font-size, 13px);
  color: #64748b;
  font-weight: 500;
}

.milestone-badge {
  background: #eff6ff;
  color: #3b82f6;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: var(--resume-small-font-size, 11px);
  font-weight: 600;
}

.milestone-role {
  font-size: var(--resume-subtitle-font-size, 18px);
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 5px 0;
}

.milestone-company {
  font-size: var(--resume-content-font-size, 15px);
  color: #3b82f6;
  margin: 0 0 15px 0;
  font-weight: 500;
}

.milestone-description {
  color: #475569;
  margin: 0 0 15px 0;
  line-height: var(--resume-line-height, 1.6);
  font-size: var(--resume-content-font-size, 14px);
}

.achievements-title {
  font-size: var(--resume-content-font-size, 13px);
  font-weight: 600;
  color: #64748b;
  margin-bottom: 10px;
}

.achievements-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.achievement-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: var(--resume-small-font-size, 12px);
  font-weight: 500;
}

/* 创新实验室/项目经验 */
.innovation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.innovation-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.project-icon {
  font-size: var(--resume-title-font-size, 24px);
  width: 48px;
  height: 48px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.project-meta {
  flex: 1;
}

.project-title {
  font-size: var(--resume-subtitle-font-size, 16px);
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.project-timeline {
  font-size: var(--resume-small-font-size, 12px);
  color: #64748b;
  font-weight: 500;
}

.project-summary {
  color: #475569;
  margin: 0 0 20px 0;
  line-height: var(--resume-line-height, 1.6);
  font-size: var(--resume-content-font-size, 13px);
}

.tech-title,
.impact-title {
  font-size: var(--resume-content-font-size, 13px);
  font-weight: 600;
  color: #64748b;
  margin-bottom: 10px;
}

.tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.tech-chip {
  background: var(--resume-primary-color, #e0e7ff);
  color: var(--resume-secondary-color, #4338ca);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: var(--resume-small-font-size, 11px);
  font-weight: 500;
}

.impact-points {
  list-style: none;
  padding: 0;
  margin: 0;
}

.impact-points li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 8px;
  color: #475569;
  font-size: var(--resume-content-font-size, 13px);
}

.impact-points li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: #94a3b8;
  font-size: 24px;
  line-height: 0.8;
  top: -2px;
}

/* 成长轨迹/教育 */
.growth-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.growth-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.growth-year {
  font-size: var(--resume-title-font-size, 24px);
  font-weight: 700;
  color: #94a3b8;
  flex-shrink: 0;
  text-align: center;
  min-width: 60px;
}

.growth-content {
  flex: 1;
}

.growth-degree {
  font-size: var(--resume-subtitle-font-size, 16px);
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.growth-field {
  font-size: var(--resume-content-font-size, 14px);
  color: var(--resume-primary-color, #3b82f6);
  margin: 0 0 4px 0;
}

.growth-institution {
  font-size: var(--resume-content-font-size, 13px);
  color: #64748b;
  margin: 0 0 10px 0;
}

.growth-highlights {
  display: flex;
  gap: 8px;
}

.highlight-item {
  background: #ffffff;
  color: #475569;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: var(--resume-small-font-size, 11px);
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

/* 成就徽章 */
.badges-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.badge-item {
  background: #f8fafc;
  border-radius: 16px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.badge-icon {
  font-size: var(--resume-title-font-size, 28px);
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.badge-info {
  flex: 1;
}

.badge-name {
  font-size: var(--resume-content-font-size, 14px);
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
}

.badge-issuer {
  font-size: var(--resume-small-font-size, 12px);
  color: #64748b;
  margin-bottom: 2px;
}

.badge-date {
  font-size: var(--resume-small-font-size, 11px);
  color: #94a3b8;
}

/* 全球视野/语言 */
.languages-world {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.language-sphere {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
}

.sphere-icon {
  font-size: var(--resume-title-font-size, 32px);
  margin-bottom: 15px;
}

.lang-name {
  font-size: var(--resume-subtitle-font-size, 16px);
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.lang-proficiency {
  font-size: var(--resume-content-font-size, 13px);
  color: #64748b;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .startup-template {
    width: 100%;
    min-height: auto;
    background: #ffffff;
  }

  .startup-header {
    border-radius: 0 0 24px 24px;
    padding: 30px 20px;
  }

  .startup-hero {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .quick-contact {
    justify-content: center;
  }

  .startup-content {
    padding: 20px 15px;
  }

  .startup-section {
    padding: 20px 15px;
    border-radius: 16px;
  }

  .skills-matrix {
    justify-content: center;
  }

  .journey-milestone {
    flex-direction: column;
    gap: 10px;
  }

  .milestone-marker {
    display: none;
  }

  .innovation-grid,
  .growth-cards,
  .badges-showcase,
  .languages-world {
    grid-template-columns: 1fr;
  }

  .growth-card {
    flex-direction: column;
    text-align: center;
  }
}

/* 打印与导出适配 */
@media print {
  .startup-template { background: #ffffff; margin: 0; padding: 0; }
  .startup-header { border-radius: 0; margin-bottom: 20px; }
  .startup-section { box-shadow: none; border: 1px solid #f1f5f9; padding: 25px; margin-bottom: 20px; page-break-inside: avoid; }
  .startup-content { padding: 0; width: 100%; }
}
</style>
