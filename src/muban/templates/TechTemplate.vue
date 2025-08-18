<template>
  <div class="tech-template" :style="templateStyles">
    <div class="resume-container">
      <!-- 头部信息 -->
      <div class="header-section">
        <div class="header-content">
          <div class="name-section">
            <h1 class="name">{{ resumeData.personalInfo?.name || 'Developer Name' }}</h1>
            <div class="title-line">
              <span class="prompt">$</span>
              <span class="title">{{ resumeData.personalInfo?.title || 'Software Engineer' }}</span>
              <span class="cursor">_</span>
            </div>
          </div>
          
          <div class="contact-grid">
            <div v-if="resumeData.personalInfo?.email" class="contact-item">
              <span class="label">email:</span>
              <span class="value">{{ resumeData.personalInfo.email }}</span>
            </div>
            <div v-if="resumeData.personalInfo?.phone" class="contact-item">
              <span class="label">phone:</span>
              <span class="value">{{ resumeData.personalInfo.phone }}</span>
            </div>
            <div v-if="resumeData.personalInfo?.website" class="contact-item">
              <span class="label">website:</span>
              <span class="value">{{ resumeData.personalInfo.website }}</span>
            </div>
            <div v-if="resumeData.personalInfo?.address" class="contact-item">
              <span class="label">location:</span>
              <span class="value">{{ resumeData.personalInfo.address }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="code-section" v-if="resumeData.summary">
        <div class="section-header">
          <span class="comment">// Personal Summary</span>
        </div>
        <div class="code-block">
          <span class="keyword">const</span> <span class="variable">summary</span> = <span class="string">"{{ resumeData.summary }}"</span>;
        </div>
      </div>

      <!-- 技能特长 -->
      <div class="code-section" v-if="resumeData.skills?.length">
        <div class="section-header">
          <span class="comment">// Technical Skills</span>
        </div>
        <div class="code-block">
          <span class="keyword">const</span> <span class="variable">skills</span> = {<br>
          <div class="skills-object">
            <div 
              v-for="(skill, index) in resumeData.skills" 
              :key="skill.name"
              class="skill-line"
            >
              <span class="property">"{{ skill.name }}"</span>: 
              <span class="string">"{{ skill.level }}"</span><span v-if="index < resumeData.skills.length - 1">,</span>
            </div>
          </div>
          };
        </div>
      </div>

      <!-- 工作经历 -->
      <div class="code-section" v-if="resumeData.workExperience?.length">
        <div class="section-header">
          <span class="comment">// Work Experience</span>
        </div>
        <div class="code-block">
          <span class="keyword">const</span> <span class="variable">workExperience</span> = [<br>
          <div class="experience-array">
            <div 
              v-for="(work, index) in resumeData.workExperience" 
              :key="work.id"
              class="experience-object"
            >
              {<br>
              <div class="object-content">
                <div class="property-line">
                  <span class="property">company</span>: <span class="string">"{{ work.company }}"</span>,
                </div>
                <div class="property-line">
                  <span class="property">position</span>: <span class="string">"{{ work.jobTitle }}"</span>,
                </div>
                <div class="property-line">
                  <span class="property">period</span>: <span class="string">"{{ work.startDate }} - {{ work.endDate }}"</span>,
                </div>
                <div v-if="work.location" class="property-line">
                  <span class="property">location</span>: <span class="string">"{{ work.location }}"</span>,
                </div>
                <div v-if="work.responsibilities?.length" class="property-line">
                  <span class="property">achievements</span>: [<br>
                  <div class="achievements-array">
                    <div 
                      v-for="(resp, respIndex) in work.responsibilities" 
                      :key="respIndex"
                      class="achievement-line"
                    >
                      <span class="string">"{{ resp }}"</span><span v-if="respIndex < work.responsibilities.length - 1">,</span>
                    </div>
                  </div>
                  ]
                </div>
              </div>
              }<span v-if="index < resumeData.workExperience.length - 1">,</span><br>
            </div>
          </div>
          ];
        </div>
      </div>

      <!-- 项目经历 -->
      <div class="code-section" v-if="resumeData.projects?.length">
        <div class="section-header">
          <span class="comment">// Key Projects</span>
        </div>
        <div class="code-block">
          <span class="keyword">const</span> <span class="variable">projects</span> = [<br>
          <div class="projects-array">
            <div 
              v-for="(project, index) in resumeData.projects" 
              :key="project.id"
              class="project-object"
            >
              {<br>
              <div class="object-content">
                <div class="property-line">
                  <span class="property">name</span>: <span class="string">"{{ project.name }}"</span>,
                </div>
                <div class="property-line">
                  <span class="property">description</span>: <span class="string">"{{ project.description }}"</span>,
                </div>
                <div class="property-line">
                  <span class="property">duration</span>: <span class="string">"{{ project.startDate }} - {{ project.endDate }}"</span>,
                </div>
                <div v-if="project.technologies?.length" class="property-line">
                  <span class="property">technologies</span>: [<span class="tech-array">{{ project.technologies.map(tech => `"${tech}"`).join(', ') }}</span>]
                </div>
              </div>
              }<span v-if="index < resumeData.projects.length - 1">,</span><br>
            </div>
          </div>
          ];
        </div>
      </div>

      <!-- 教育背景 -->
      <div class="code-section" v-if="resumeData.education?.length">
        <div class="section-header">
          <span class="comment">// Education</span>
        </div>
        <div class="code-block">
          <span class="keyword">const</span> <span class="variable">education</span> = [<br>
          <div class="education-array">
            <div 
              v-for="(edu, index) in resumeData.education" 
              :key="edu.id"
              class="education-object"
            >
              {<br>
              <div class="object-content">
                <div class="property-line">
                  <span class="property">institution</span>: <span class="string">"{{ edu.school }}"</span>,
                </div>
                <div class="property-line">
                  <span class="property">degree</span>: <span class="string">"{{ edu.degree }} in {{ edu.major }}"</span>,
                </div>
                <div class="property-line">
                  <span class="property">graduation</span>: <span class="string">"{{ edu.graduationDate }}"</span><span v-if="edu.gpa">,</span>
                </div>
                <div v-if="edu.gpa" class="property-line">
                  <span class="property">gpa</span>: <span class="number">{{ edu.gpa }}</span>
                </div>
              </div>
              }<span v-if="index < resumeData.education.length - 1">,</span><br>
            </div>
          </div>
          ];
        </div>
      </div>

      <!-- 页脚 -->
      <div class="footer-section">
        <div class="terminal-line">
          <span class="prompt">$</span>
          <span class="command">git commit -m "Ready for new opportunities"</span>
        </div>
        <div class="terminal-line">
          <span class="output">[main {{ new Date().getFullYear() }}] Resume updated successfully</span>
        </div>
      </div>
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
    default: 'tech'
  }
})

// 使用新的样式系统
const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.tech-template {
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  background: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  font-size: 13px;
}

.resume-container {
  max-width: 210mm;
  margin: 0 auto;
  padding: 30px;
  background: #1a1a1a;
  color: #e5e7eb;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  min-height: 100vh;
}

/* 头部样式 */
.header-section {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 25px;
  border-left: 4px solid var(--primary-color);
}

.name {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 10px 0;
  font-family: 'Fira Code', monospace;
}

.title-line {
  font-size: 16px;
  color: var(--primary-color);
  margin-bottom: 20px;
  font-family: 'Fira Code', monospace;
}

.prompt {
  color: var(--accent-color);
  font-weight: bold;
}

.title {
  color: #ffffff;
  margin: 0 5px;
}

.cursor {
  animation: blink 1s infinite;
  color: var(--primary-color);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.contact-item {
  font-size: 12px;
}

.label {
  color: var(--accent-color);
  font-weight: bold;
}

.value {
  color: #ffffff;
  margin-left: 5px;
}

/* 代码块样式 */
.code-section {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid var(--primary-color);
  position: relative;
}

.section-header {
  margin-bottom: 15px;
}

.comment {
  color: #6b7280;
  font-style: italic;
}

.code-block {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  line-height: 1.8;
}

.keyword {
  color: #f59e0b;
  font-weight: bold;
}

.variable {
  color: #3b82f6;
}

.string {
  color: #10b981;
}

.property {
  color: #8b5cf6;
}

.number {
  color: #f97316;
}

/* 对象和数组缩进 */
.skills-object,
.experience-array,
.projects-array,
.education-array {
  margin-left: 20px;
}

.object-content {
  margin-left: 20px;
}

.property-line,
.skill-line,
.achievement-line {
  margin: 5px 0;
}

.achievements-array {
  margin-left: 20px;
}

.tech-array {
  color: #10b981;
}

/* 页脚样式 */
.footer-section {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 15px;
  margin-top: 30px;
  border-left: 4px solid var(--accent-color);
}

.terminal-line {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  margin: 5px 0;
}

.command {
  color: #ffffff;
  margin-left: 5px;
}

.output {
  color: var(--primary-color);
  margin-left: 5px;
}

/* 打印样式 */
@media print {
  .tech-template {
    font-size: 11px;
  }
  
  .resume-container {
    background: white;
    color: black;
    box-shadow: none;
    padding: 20px;
    min-height: auto;
  }
  
  .header-section,
  .code-section,
  .footer-section {
    background: #f8f9fa;
    color: black;
  }
  
  .name,
  .title,
  .value,
  .command {
    color: black;
  }
  
  .keyword {
    color: #d97706;
  }
  
  .variable {
    color: #2563eb;
  }
  
  .string {
    color: #059669;
  }
  
  .property {
    color: #7c3aed;
  }
  
  .number {
    color: #ea580c;
  }
  
  .comment {
    color: #6b7280;
  }
  
  .prompt,
  .cursor {
    color: #059669;
  }
  
  .output {
    color: #059669;
  }
}
</style>
