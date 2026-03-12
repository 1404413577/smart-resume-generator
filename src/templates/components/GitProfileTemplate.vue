<template>
  <div class="git-profile-template" :style="templateStyles">
    
    <div class="git-navbar">
      <div class="nav-left">
        <span class="icon-git">🐙</span>
        <span class="repo-path">
          <span class="username">{{ resumeData.personalInfo?.name || 'Developer' }}</span>
          <span class="slash">/</span>
          <span class="reponame">resume.md</span>
        </span>
      </div>
      <div class="nav-right">
        <span class="badge">Public</span>
      </div>
    </div>

    <div class="git-container">
      
      <aside class="git-sidebar">
        <div class="avatar-box" v-if="resumeData.personalInfo?.photo">
          <img :src="resumeData.personalInfo.photo" alt="Avatar">
        </div>
        <div class="avatar-placeholder" v-else>
          {{ (resumeData.personalInfo?.name || 'D').charAt(0).toUpperCase() }}
        </div>
        
        <h1 class="vcard-names">
          <span class="p-name">{{ resumeData.personalInfo?.name || 'Developer Name' }}</span>
          <span class="p-nickname">{{ resumeData.personalInfo?.targetPosition || 'Full Stack / Front-end' }}</span>
        </h1>

        <div class="vcard-bio" v-if="resumeData.summary">
          {{ resumeData.summary }}
        </div>

        <ul class="vcard-details">
          <li v-if="resumeData.personalInfo?.address">📍 {{ resumeData.personalInfo.address }}</li>
          <li v-if="resumeData.personalInfo?.email">✉️ {{ resumeData.personalInfo.email }}</li>
          <li v-if="resumeData.personalInfo?.phone">📱 {{ resumeData.personalInfo.phone }}</li>
          <li v-if="resumeData.personalInfo?.website">🔗 {{ resumeData.personalInfo.website }}</li>
        </ul>

        <div class="border-bottom"></div>
        
        <h2 class="h4-title">Skills</h2>
        <div class="topic-tags" v-if="resumeData.skills?.length">
          <span class="topic-tag" v-for="skill in resumeData.skills" :key="skill.name">
            {{ skill.name }}
          </span>
        </div>
      </aside>

      <main class="git-main">
        <div class="readme-box">
          
          <div class="readme-header">
            <span>📖 README.md</span>
          </div>

          <div class="markdown-body">
            <h2 v-if="resumeData.workExperience?.length">💻 Work Experience</h2>
            <div class="timeline" v-if="resumeData.workExperience?.length">
              <div class="timeline-item" v-for="work in resumeData.workExperience" :key="work.id">
                <div class="commit-header">
                  <strong>{{ work.company }}</strong> — {{ work.position }}
                  <span class="commit-time float-right">{{ work.startDate }} to {{ work.endDate }}</span>
                </div>
                <div class="commit-body">
                  <p v-if="work.description">{{ work.description }}</p>
                  <ul v-if="work.achievements?.length">
                    <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 v-if="resumeData.projects?.length">📦 Pinned Projects</h2>
            <div class="repo-grid" v-if="resumeData.projects?.length">
              <div class="repo-card" v-for="project in resumeData.projects" :key="project.id">
                <div class="repo-title">
                  <span class="repo-icon">🔖</span> <strong>{{ project.name }}</strong>
                </div>
                <p class="repo-desc">{{ project.description }}</p>
                <div class="repo-meta" v-if="project.technologies?.length">
                  <span class="language-color"></span> {{ project.technologies[0] }}
                  <span class="text-muted ml-3" v-if="project.technologies.length > 1">+ {{ project.technologies.slice(1).join(', ') }}</span>
                </div>
                <div class="repo-links" v-if="project.url || project.github">
                  <div v-if="project.url" class="repo-link-item">
                    <span class="link-icon">🔗</span>
                    <a :href="project.url" target="_blank" class="repo-link-full">{{ project.url }}</a>
                  </div>
                  <div v-if="project.github" class="repo-link-item">
                    <span class="link-icon">🍴</span>
                    <a :href="project.github" target="_blank" class="repo-link-full">{{ project.github }}</a>
                  </div>
                </div>
              </div>
            </div>

            <h2 v-if="resumeData.education?.length">🎓 Education</h2>
            <ul class="edu-list" v-if="resumeData.education?.length">
              <li v-for="edu in resumeData.education" :key="edu.id">
                <strong>{{ edu.school }}</strong> ({{ edu.startDate }} - {{ edu.endDate }}) <br/>
                <em>{{ edu.degree }}, {{ edu.major }}</em>
              </li>
            </ul>

          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'gitProfile' }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.git-profile-template {
  --git-bg: #0d1117;
  --git-border: #30363d;
  --git-text: #c9d1d9;
  --git-link: #58a6ff;
  --git-muted: #8b949e;
  
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  background-color: var(--git-bg);
  color: var(--git-text);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.git-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #161b22;
  border-bottom: 1px solid var(--git-border);
}

.nav-left { display: flex; align-items: center; gap: 10px; }
.icon-git { font-size: 24px; }
.username { color: var(--git-link); font-weight: 600; }
.slash { color: var(--git-muted); margin: 0 4px; }
.reponame { font-weight: 600; }

.badge {
  border: 1px solid var(--git-border);
  border-radius: 2em;
  padding: 2px 10px;
  font-size: 12px;
  color: var(--git-muted);
}

.git-container {
  display: flex;
  padding: 24px;
  gap: 24px;
}

/* Sidebar */
.git-sidebar {
  width: 25%;
}

.avatar-box, .avatar-placeholder {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid var(--git-border);
  overflow: hidden;
  margin-bottom: 16px;
}
.avatar-box img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder {
  background-color: #21262d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  color: var(--git-muted);
}

.vcard-names { margin: 0 0 16px 0; display: flex; flex-direction: column; }
.p-name { font-size: 24px; font-weight: 600; color: #c9d1d9; line-height: 1.25; }
.p-nickname { font-size: 20px; font-weight: 300; color: var(--git-muted); line-height: 1.25; }

.vcard-bio { font-size: 14px; margin-bottom: 16px; line-height: 1.5; }
.vcard-details { list-style: none; padding: 0; margin: 0 0 16px 0; font-size: 14px; color: #c9d1d9; }
.vcard-details li { margin-bottom: 6px; }

.border-bottom { border-bottom: 1px solid var(--git-border); margin: 16px 0; }
.h4-title { font-size: 16px; font-weight: 600; margin: 0 0 12px 0; }

.topic-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.topic-tag {
  background-color: rgba(56, 139, 253, 0.15);
  color: var(--git-link);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 2em;
}

/* Main Content */
.git-main { flex: 1; }

.readme-box {
  border: 1px solid var(--git-border);
  border-radius: 6px;
  background-color: var(--git-bg);
}

.readme-header {
  padding: 12px 16px;
  background-color: #161b22;
  border-bottom: 1px solid var(--git-border);
  font-size: 14px;
  font-weight: 600;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.markdown-body { padding: 32px; font-size: 14px; line-height: 1.6; }
.markdown-body h2 {
  font-size: 20px;
  border-bottom: 1px solid var(--git-border);
  padding-bottom: 8px;
  margin-top: 24px;
  margin-bottom: 16px;
}
.markdown-body h2:first-child { margin-top: 0; }

/* Timeline / Experience */
.timeline { border-left: 2px solid var(--git-border); margin-left: 10px; padding-left: 20px; }
.timeline-item { margin-bottom: 24px; position: relative; }
.timeline-item::before {
  content: '';
  position: absolute;
  left: -26px;
  top: 4px;
  width: 10px;
  height: 10px;
  background-color: var(--git-border);
  border: 2px solid var(--git-bg);
  border-radius: 50%;
}
.commit-header { font-size: 15px; margin-bottom: 8px; }
.float-right { float: right; color: var(--git-muted); font-size: 13px; }
.commit-body p { margin: 0 0 8px 0; color: var(--git-muted); }
.commit-body ul { margin: 0; padding-left: 20px; color: var(--git-muted); }
.commit-body li { margin-bottom: 4px; }

/* Repositories / Projects */
.repo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.repo-card {
  border: 1px solid var(--git-border);
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.repo-title { font-size: 15px; color: var(--git-link); margin-bottom: 8px; }
.repo-desc { font-size: 12px; color: var(--git-muted); flex: 1; margin: 0 0 16px 0; }
.repo-meta { font-size: 12px; color: var(--git-muted); display: flex; align-items: center; }
.language-color {
  display: inline-block;
  width: 12px; height: 12px;
  border-radius: 50%;
  background-color: #41b883; /* Vue Green as default */
  margin-right: 6px;
}

.repo-links {
  margin-top: auto;
  padding-top: 12px;
  display: flex;
  gap: 12px;
}

.repo-link {
  font-size: 11px;
  color: var(--git-link);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.repo-link:hover {
  text-decoration: underline;
}

.repo-links {
  margin-top: auto;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.repo-link-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
}

.repo-link-full {
  color: var(--git-link);
  text-decoration: none;
  word-break: break-all;
  line-height: 1.4;
}

.repo-link-full:hover {
  text-decoration: underline;
}

.link-icon {
  font-size: 12px;
}

.ml-3 { margin-left: 12px; }

/* Education */
.edu-list { list-style: none; padding: 0; margin: 0; }
.edu-list li { margin-bottom: 16px; }
</style>