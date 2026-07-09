<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-creative"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'creative' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-creative .personal-layout) {
  padding: 18px;
  border: 1px solid var(--tpl-border);
  border-bottom: 5px solid var(--tpl-accent);
  background: #faf5ff;
}

:deep(.template-creative .section-title) {
  display: inline-flex;
  padding: 3px 9px;
  color: #fff;
  background: var(--tpl-accent);
}

:deep(.template-creative .section-title::before) {
  display: none;
}
</style>
