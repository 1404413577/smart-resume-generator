<template>
  <div class="schema-template" :style="templateStyles">
    <div class="resume-container">
      <template v-for="(section, index) in config.layout" :key="index">
        <!-- 头部区域 -->
        <header v-if="section.type === 'header'" :class="['section-header', section.align]">
          <div class="header-main">
            <h1 class="name">{{ resumeData.personalInfo?.name }}</h1>
            <h2 class="title">{{ resumeData.personalInfo?.targetPosition }}</h2>
            <div class="contact-info">
              <span v-if="resumeData.personalInfo?.phone">{{ resumeData.personalInfo.phone }}</span>
              <span v-if="resumeData.personalInfo?.email">{{ resumeData.personalInfo.email }}</span>
              <span v-if="resumeData.personalInfo?.address">{{ resumeData.personalInfo.address }}</span>
            </div>
          </div>
          <div v-if="resumeData.personalInfo?.photo && section.showPhoto" class="photo-box">
            <img :src="resumeData.personalInfo.photo" alt="头像" />
          </div>
        </header>

        <!-- 栅格布局区域 -->
        <div v-if="section.type === 'grid'" class="section-grid" :style="{ gridTemplateColumns: section.columns }">
          <div v-for="(col, colIdx) in section.children" :key="colIdx" class="grid-column">
            <template v-for="(child, childIdx) in col" :key="childIdx">
              <render-module :type="child" :resume-data="resumeData" :config="config" />
            </template>
          </div>
        </div>

        <!-- 通栏模块 -->
        <render-module v-if="['summary', 'workExperience', 'education', 'projects', 'skills'].includes(section.type)" 
                      :type="section.type" 
                      :resume-data="resumeData" 
                      :config="config" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, provide } from 'vue'
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'
import RenderModule from './RenderModule.vue'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, required: true },
  config: { type: Object, required: true }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

// 提供样式配置给子组件
provide('schemaConfig', props.config)
</script>

<style scoped>
.schema-template {
  background: var(--background-color, #fff);
  color: var(--text-color, #333);
  font-family: var(--font-family, sans-serif);
}

.resume-container {
  max-width: 210mm;
  margin: 0 auto;
  padding: 40px;
  min-height: 297mm;
}

.section-header {
  display: flex;
  margin-bottom: 30px;
  gap: 20px;
}

.section-header.center { text-align: center; justify-content: center; }
.section-header.right { flex-direction: row-reverse; }

.name { font-size: 32px; margin: 0 0 10px 0; color: var(--primary-color); }
.title { font-size: 18px; font-weight: normal; margin-bottom: 15px; }
.contact-info { display: flex; gap: 15px; font-size: 14px; flex-wrap: wrap; }

.photo-box img { width: 100px; height: 120px; object-fit: cover; border-radius: 4px; }

.section-grid { display: grid; gap: 30px; margin-top: 20px; }
</style>
