<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-classic"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'classic' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-classic .personal-layout) {
  grid-template-columns: 1fr;
  padding-bottom: 12px;
  border-top: 1px solid var(--tpl-border);
  border-bottom: 1px solid var(--tpl-border);
  text-align: center;
}

:deep(.template-classic .contact-list) {
  justify-content: center;
}

:deep(.template-classic .section-title) {
  padding-bottom: 4px;
  color: var(--tpl-text);
  border-bottom: 1px solid var(--tpl-border);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif CN', serif;
}

:deep(.template-classic .section-title::before) {
  display: none;
}

:deep(.template-classic .person-name) {
  color: var(--tpl-text);
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif CN', serif;
}
</style>
