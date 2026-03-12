<template>
  <div v-if="hasData" class="render-module" :class="type">
    <h3 v-if="showTitle" class="module-title">{{ getTitle }}</h3>
    
    <!-- 个人简介 -->
    <div v-if="type === 'summary'" class="module-content">
      <p class="summary-text">{{ resumeData.summary }}</p>
    </div>

    <!-- 工作经历 & 教育背景 & 项目经验 -->
    <div v-if="['workExperience', 'education', 'projects'].includes(type)" class="items-list">
      <div v-for="item in resumeData[type]" :key="item.id" class="list-item">
        <div class="item-header">
          <h4 class="item-name">{{ getName(item) }}</h4>
          <span class="item-date">{{ item.startDate }} - {{ item.endDate }}</span>
        </div>
        <div class="item-sub">
          <span class="sub-text">{{ getSub(item) }}</span>
          <span v-if="item.location" class="location">{{ item.location }}</span>
        </div>
        <div v-if="item.description" class="item-desc">
          <p>{{ item.description }}</p>
        </div>
        <ul v-if="item.achievements?.length" class="achievements">
          <li v-for="(ach, i) in item.achievements" :key="i">{{ ach }}</li>
        </ul>
        <div v-if="item.technologies?.length" class="tech-stack">
          <span v-for="tech in item.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
        </div>
        <div v-if="(type === 'projects') && (item.url || item.github)" class="project-links">
          <div v-if="item.url" class="project-link-item">
            <strong>Demo:</strong>
            <a :href="item.url" target="_blank" class="project-link-full">{{ item.url }}</a>
          </div>
          <div v-if="item.github" class="project-link-item">
            <strong>GitHub:</strong>
            <a :href="item.github" target="_blank" class="project-link-full">{{ item.github }}</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能列表 -->
    <div v-if="type === 'skills'" class="skills-grid">
      <div v-for="skill in resumeData.skills" :key="skill.id" class="skill-item">
        <span class="skill-name">{{ skill.name }}</span>
        <div class="skill-bar-bg">
          <div class="skill-bar-fill" :style="{ width: skill.level === '专家' ? '100%' : skill.level === '高级' ? '80%' : skill.level === '中级' ? '60%' : '30%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  type: { type: String, required: true },
  resumeData: { type: Object, required: true }
})

const config = inject('schemaConfig')

const showTitle = computed(() => config.moduleSettings?.[props.type]?.showTitle !== false)

const getTitle = computed(() => config.moduleSettings?.[props.type]?.title || {
  summary: '个人简介',
  workExperience: '工作经历',
  education: '教育背景',
  projects: '项目经验',
  skills: '技能特长'
}[props.type])

const hasData = computed(() => {
  if (props.type === 'summary') return !!props.resumeData.summary
  return props.resumeData[props.type]?.length > 0
})

const getName = (item) => {
  if (props.type === 'workExperience') return item.company
  if (props.type === 'education') return item.school
  if (props.type === 'projects') return item.name
  return ''
}

const getSub = (item) => {
  if (props.type === 'workExperience') return item.position
  if (props.type === 'education') return `${item.degree} · ${item.major}`
  return ''
}
</script>

<style scoped>
.render-module { margin-bottom: 25px; }

.module-title {
  font-size: 18px;
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 5px;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.summary-text { line-height: 1.6; font-size: 14px; text-align: justify; }

.list-item { margin-bottom: 20px; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
.item-name { font-size: 16px; margin: 0; font-weight: bold; }
.item-date { font-size: 13px; color: #666; }
.item-sub { font-size: 14px; color: var(--secondary-color); margin-bottom: 8px; font-weight: 500; }

.item-desc { font-size: 13px; line-height: 1.5; margin-bottom: 8px; }
.achievements { padding-left: 18px; margin: 0; font-size: 13px; }
.achievements li { margin-bottom: 4px; }

.tech-stack { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.tech-tag {
  font-size: 11px;
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
  color: #666;
}

.project-links {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.project-link-item {
  font-size: 13px;
  display: flex;
  gap: 8px;
  align-items: baseline;
}

.project-link-full {
  color: var(--primary-color);
  text-decoration: none;
  word-break: break-all;
  line-height: 1.4;
}

.project-link-full:hover {
  text-decoration: underline;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.skill-item { display: flex; flex-direction: column; gap: 5px; }
.skill-name { font-size: 13px; font-weight: 500; }
.skill-bar-bg { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; }
.skill-bar-fill { height: 100%; background: var(--primary-color); border-radius: 3px; }
</style>
