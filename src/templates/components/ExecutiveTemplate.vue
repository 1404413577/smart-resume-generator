<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-executive"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'executive' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-executive .template-page) {
  gap: calc(var(--tpl-section-gap) * 1.05);
}

:deep(.template-executive .personal-layout) {
  padding: 22px;
  border-bottom: none;
  background: var(--tpl-primary);
}

:deep(.template-executive .person-name),
:deep(.template-executive .target-position),
:deep(.template-executive .contact-list) {
  color: #fff;
}

:deep(.template-executive .section-title) {
  padding-bottom: 6px;
  border-bottom: 2px solid var(--tpl-accent);
}

:deep(.template-executive .section-title::before) {
  display: none;
}
</style>
