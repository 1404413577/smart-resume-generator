<template>
  <div class="terminal-template" :style="templateStyles">
    <div class="term-window">
      <div class="term-header">
        <div class="term-buttons">
          <span class="close"></span>
          <span class="minimize"></span>
          <span class="maximize"></span>
        </div>
        <div class="term-title">guest@{{ resumeData.personalInfo?.name || 'developer' }}: ~</div>
      </div>

      <div class="term-body">
        
        <div class="sys-msg">
          Last login: {{ currentDate }} on ttys001<br>
          Type 'help' to see available commands.
        </div>

        <div class="cmd-block">
          <div class="prompt">
            <span class="user">guest@portfolio</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span> 
            <span class="command">whoami</span>
          </div>
          <div class="output highlight-green">
            <h1>{{ resumeData.personalInfo?.name || 'Admin' }}</h1>
            <p>> {{ resumeData.personalInfo?.targetPosition || 'Software Engineer' }}</p>
            <p v-if="resumeData.personalInfo?.email">> Email: {{ resumeData.personalInfo.email }}</p>
            <p v-if="resumeData.personalInfo?.website">> Link: {{ resumeData.personalInfo.website }}</p>
          </div>
        </div>

        <div class="cmd-block" v-if="resumeData.summary">
          <div class="prompt">
            <span class="user">guest@portfolio</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span> 
            <span class="command">cat summary.txt</span>
          </div>
          <div class="output">
            {{ resumeData.summary }}
          </div>
        </div>

        <div class="cmd-block" v-if="resumeData.skills?.length">
          <div class="prompt">
            <span class="user">guest@portfolio</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span> 
            <span class="command">ls -l ./skills</span>
          </div>
          <div class="output skill-table">
            <div class="skill-row" v-for="skill in resumeData.skills" :key="skill.name">
              <span class="perms">-rw-r--r--</span>
              <span class="level">[{{ skill.level }}]</span>
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>

        <div class="cmd-block" v-if="resumeData.projects?.length">
          <div class="prompt">
            <span class="user">guest@portfolio</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span> 
            <span class="command">./execute_projects.sh</span>
          </div>
          <div class="output">
            <div class="proj-item" v-for="(project, index) in resumeData.projects" :key="project.id">
              <div class="proj-title">
                <span class="bracket">[</span>{{ index + 1 }}<span class="bracket">]</span> 
                <span class="highlight-blue">{{ project.name }}</span>
              </div>
              <div class="proj-desc">{{ project.description }}</div>
              <div class="proj-tech" v-if="project.technologies?.length">
                Dependencies: [ {{ project.technologies.join(', ') }} ]
              </div>
            </div>
          </div>
        </div>

        <div class="cmd-block" v-if="resumeData.workExperience?.length">
          <div class="prompt">
            <span class="user">guest@portfolio</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span> 
            <span class="command">grep -r "experience" .</span>
          </div>
          <div class="output">
            <div class="exp-item" v-for="work in resumeData.workExperience" :key="work.id">
              <div class="exp-head">
                <span class="highlight-yellow">{{ work.company }}</span>: {{ work.position }} ({{ work.startDate }} - {{ work.endDate }})
              </div>
              <div class="exp-desc" v-if="work.description">
                {{ work.description }}
              </div>
              <ul class="exp-tasks" v-if="work.achievements?.length">
                <li v-for="ach in work.achievements" :key="ach">-> {{ ach }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="prompt">
          <span class="user">guest@portfolio</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span>
          <span class="cursor">_</span>
        </div>

      </div>
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
    default: 'terminal'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const currentDate = computed(() => {
  return new Date().toDateString()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap');

.terminal-template {
  --term-bg: #121212;
  --term-text: #a9b7c6;
  --term-green: #629755;
  --term-blue: #6897bb;
  --term-yellow: #cc7832;
  --term-purple: #9876aa;
  --term-red: #ff6b68;
  --term-font: 'Fira Code', Consolas, Monaco, monospace;

  background-color: #2b2b2b; /* Outer background */
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  font-family: var(--term-font);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.term-window {
  background-color: var(--term-bg);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  overflow: hidden;
  height: 100%;
  border: 1px solid #3c3f41;
}

.term-header {
  background-color: #3c3f41;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  position: relative;
}

.term-buttons {
  display: flex;
  gap: 8px;
}

.term-buttons span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.close { background-color: #ff5f56; }
.minimize { background-color: #ffbd2e; }
.maximize { background-color: #27c93f; }

.term-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #aaaaaa;
  font-size: 12px;
}

.term-body {
  padding: 20px 25px;
  color: var(--term-text);
  font-size: 13px;
  line-height: 1.6;
}

.sys-msg {
  color: var(--term-text);
  opacity: 0.7;
  margin-bottom: 20px;
}

.cmd-block {
  margin-bottom: 25px;
}

.prompt {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.user { color: var(--term-green); font-weight: bold; }
.colon { color: var(--term-text); }
.path { color: var(--term-blue); font-weight: bold; }
.dollar { color: var(--term-text); margin-right: 8px; }
.command { color: #ffffff; }

.output {
  padding-left: 10px;
  border-left: 2px solid #3c3f41;
}

h1 {
  margin: 0 0 10px 0;
  color: var(--term-green);
  font-size: 24px;
}

.highlight-green { color: var(--term-green); }
.highlight-blue { color: var(--term-blue); font-weight: bold;}
.highlight-yellow { color: var(--term-yellow); font-weight: bold;}
.bracket { color: var(--term-text); opacity: 0.5; }

/* Skills */
.skill-row {
  display: flex;
  gap: 15px;
  margin-bottom: 4px;
}
.perms { color: var(--term-purple); }
.level { color: var(--term-yellow); width: 60px;}

/* Projects & Exp */
.proj-item, .exp-item {
  margin-bottom: 15px;
}
.proj-desc, .exp-desc {
  padding-left: 25px;
  opacity: 0.9;
  margin: 4px 0;
}
.proj-tech {
  padding-left: 25px;
  color: var(--term-purple);
  font-size: 12px;
}
.exp-tasks {
  list-style: none;
  padding-left: 25px;
  margin: 0;
}

/* Cursor Animation */
.cursor {
  display: inline-block;
  width: 8px;
  height: 15px;
  background-color: var(--term-text);
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>