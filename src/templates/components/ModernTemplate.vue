<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-modern"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'modern' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-modern .template-page) {
  display: flex;
  flex-direction: column;
  gap: var(--tpl-section-gap);
}

:deep(.template-modern .resume-section:not(.section-personalInfo)) {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--tpl-border);
}

:deep(.template-modern .section-title) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.template-modern .section-title::before) {
  content: '';
  width: 4px;
  height: 1em;
  background: var(--tpl-accent);
}
</style>
