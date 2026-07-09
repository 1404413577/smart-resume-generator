<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-technical"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'technical' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-technical .template-page) {
  display: flex;
  flex-direction: column;
  gap: var(--tpl-section-gap);
}

:deep(.template-technical .personal-layout) {
  border-bottom: 4px solid var(--tpl-accent);
}

:deep(.template-technical .section-title) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.template-technical .section-title::before) {
  content: '';
  width: 4px;
  height: 1em;
  background: var(--tpl-accent);
}

:deep(.template-technical .section-projects) {
  padding: 12px;
  border: 1px solid var(--tpl-border);
  background: #f8fafc;
}

:deep(.template-technical .tag-list span),
:deep(.template-technical .skill-chip) {
  border-radius: 0;
  border-color: var(--tpl-accent);
}
</style>
