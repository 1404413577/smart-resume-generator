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
  background: #ffffff;
  font-family: var(--font-family, 'Poppins, sans-serif');
  color: var(--theme-text-primary, #1a202c);
  line-height: var(--line-height, 1.6);
  margin: 0 auto;
}

/* 创新头部 */
.startup-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #a8edea 100%);
  color: white;
  padding: 40px 30px;
  position: relative;
  overflow: hidden;
}

.header-mesh {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="mesh" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.2)"/><circle cx="5" cy="5" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="15" cy="15" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23mesh)"/></svg>');
  opacity: 0.4;
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
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.hero-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.avatar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  }
  to {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
  }
}

.hero-content {
  flex: 1;
}

.startup-name {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(45deg, #ffffff, #a8edea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.startup-role {
  font-size: 24px;
  font-weight: 400;
  margin: 0 0 20px 0;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.startup-vision {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin-bottom: 25px;
}

.vision-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.startup-vision p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
}

.quick-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 16px;
  border-radius: 25px;
  text-decoration: none;
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.contact-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.link-icon {
  font-size: 16px;
}

/* 主要内容 */
.startup-content {
  padding: 40px 30px;
}

.startup-section {
  margin-bottom: 50px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding: 15px 0;
  border-bottom: 2px solid transparent;
  background: linear-gradient(90deg, #4facfe, #00f2fe) padding-box,
              linear-gradient(90deg, #4facfe, #00f2fe) border-box;
  border-image: linear-gradient(90deg, #4facfe, #00f2fe) 1;
}

.title-emoji {
  font-size: 28px;
}

.title-text {
  font-size: 26px;
  font-weight: 600;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* 技能矩阵 */
.skills-matrix {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.skill-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
}

.skill-chip:hover {
  transform: scale(1.05);
}

.skill-beginner {
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  color: #8b4513;
}

.skill-intermediate {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #2d3748;
}

.skill-advanced {
  background: linear-gradient(135deg, #d299c2, #fef9d7);
  color: #553c9a;
}

.skill-expert {
  background: linear-gradient(135deg, #89f7fe, #66a6ff);
  color: #1a365d;
}

.skill-master {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.skill-name {
  font-size: 14px;
}

.skill-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

/* 产品之旅 */
.journey-timeline {
  position: relative;
}

.journey-milestone {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.milestone-marker {
  position: relative;
  flex-shrink: 0;
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-dot {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 0 0 2px #4facfe;
  z-index: 2;
}

.milestone-featured .marker-dot {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 0 0 2px #667eea, 0 0 20px rgba(102, 126, 234, 0.3);
}

.marker-line {
  width: 2px;
  height: 60px;
  background: linear-gradient(180deg, #4facfe, #00f2fe);
  margin-top: 10px;
}

.milestone-content {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.milestone-content:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(79, 172, 254, 0.15);
}

.milestone-featured .milestone-content {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8faff, #f0f9ff);
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.milestone-period {
  font-size: 12px;
  color: #4facfe;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.milestone-badge {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.milestone-role {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 5px 0;
}

.milestone-company {
  font-size: 16px;
  color: #4facfe;
  margin: 0 0 15px 0;
  font-weight: 500;
}

.milestone-description {
  color: #4a5568;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.achievements-title {
  font-size: 14px;
  font-weight: 600;
  color: #4facfe;
  margin-bottom: 10px;
}

.achievements-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.achievement-tag {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #2d3748;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

/* 创新实验室 */
.innovation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.innovation-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.innovation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4facfe, #00f2fe, #a8edea);
}

.innovation-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(79, 172, 254, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.project-icon {
  font-size: 32px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.project-meta {
  flex: 1;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.project-timeline {
  font-size: 12px;
  color: #4facfe;
  font-weight: 500;
}

.project-summary {
  color: #4a5568;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.tech-title,
.impact-title {
  font-size: 14px;
  font-weight: 600;
  color: #4facfe;
  margin-bottom: 10px;
}

.tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.tech-chip {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.impact-points {
  list-style: none;
  padding: 0;
  margin: 0;
}

.impact-points li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
  color: #4a5568;
  font-size: 14px;
}

.impact-points li::before {
  content: '⚡';
  position: absolute;
  left: 0;
  color: #4facfe;
  font-size: 14px;
}

/* 成长轨迹 */
.growth-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.growth-card {
  background: linear-gradient(135deg, #f8faff, #f0f9ff);
  border: 1px solid #bfdbfe;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  gap: 20px;
  align-items: center;
  transition: all 0.3s ease;
}

.growth-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.15);
}

.growth-year {
  font-size: 32px;
  font-weight: 700;
  color: #4facfe;
  flex-shrink: 0;
  text-align: center;
  min-width: 80px;
}

.growth-content {
  flex: 1;
}

.growth-degree {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.growth-field {
  font-size: 16px;
  color: #4facfe;
  margin: 0 0 4px 0;
}

.growth-institution {
  font-size: 14px;
  color: #4a5568;
  margin: 0 0 10px 0;
}

.growth-highlights {
  display: flex;
  gap: 10px;
}

.highlight-item {
  background: #4facfe;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* 成就徽章 */
.badges-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.badge-item {
  background: linear-gradient(135deg, #fff7ed, #fed7aa);
  border: 1px solid #fdba74;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.badge-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(251, 146, 60, 0.15);
}

.badge-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.badge-info {
  flex: 1;
}

.badge-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
}

.badge-issuer {
  font-size: 14px;
  color: #ea580c;
  margin-bottom: 4px;
}

.badge-date {
  font-size: 12px;
  color: #9a3412;
}

/* 全球视野 */
.languages-world {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.language-sphere {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  border-radius: 20px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
}

.language-sphere:hover {
  transform: scale(1.05) rotate(2deg);
}

.sphere-icon {
  font-size: 32px;
  margin-bottom: 15px;
}

.lang-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.lang-proficiency {
  font-size: 14px;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .startup-template {
    width: 100%;
    min-height: auto;
  }

  .startup-header {
    padding: 20px 15px;
  }

  .startup-hero {
    flex-direction: column;
    text-align: center;
    gap: 25px;
  }

  .startup-name {
    font-size: 36px;
  }

  .startup-content {
    padding: 20px 15px;
  }

  .skills-matrix {
    justify-content: flex-start;
  }

  .journey-milestone {
    flex-direction: column;
    gap: 15px;
  }

  .milestone-marker {
    flex-direction: row;
    width: auto;
    height: 20px;
  }

  .marker-line {
    width: 60px;
    height: 2px;
    margin-top: 0;
    margin-left: 10px;
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

/* 打印样式 */
@media print {
  .startup-template {
    box-shadow: none;
    margin: 0;
  }

  .avatar-glow {
    animation: none;
  }
}
</style>
