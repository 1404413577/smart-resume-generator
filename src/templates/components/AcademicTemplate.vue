<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-academic"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'academic' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-academic .personal-layout) {
  grid-template-columns: 1fr;
  align-items: start;
  border-bottom: 1px solid var(--tpl-border);
}

:deep(.template-academic .person-name) {
  color: var(--tpl-text);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif CN', serif;
}

:deep(.template-academic .section-title) {
  color: var(--tpl-text);
}

:deep(.template-academic .resume-section:not(.section-personalInfo)) {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--tpl-border);
}
</style>
