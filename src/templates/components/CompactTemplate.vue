<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-compact"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'compact' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-compact .template-page) {
  gap: calc(var(--tpl-section-gap) * 0.65);
}

:deep(.template-compact .personal-layout) {
  padding-bottom: 10px;
}

:deep(.template-compact .resume-section:not(.section-personalInfo)) {
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.template-compact .section-title) {
  margin-bottom: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--tpl-border);
}

:deep(.template-compact .section-title::before) {
  display: none;
}

:deep(.template-compact .item-list) {
  gap: 7px;
}

:deep(.template-compact .bullet-list),
:deep(.template-compact .item-description) {
  margin-top: 4px;
}
</style>
