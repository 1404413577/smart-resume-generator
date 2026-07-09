<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-flow"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'flow' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-flow .template-page) {
  gap: calc(var(--tpl-section-gap) * 1.08);
}

:deep(.template-flow .personal-layout) {
  padding: 18px 0 16px;
  border-top: 5px solid var(--tpl-primary);
  border-bottom: 1px solid var(--tpl-border);
}

:deep(.template-flow .avatar-image) {
  border-radius: 8px;
  border: 2px solid var(--tpl-accent);
}

:deep(.template-flow .person-name) {
  color: var(--tpl-primary);
  font-size: calc(var(--tpl-title-size) + 12px);
  font-weight: 850;
}

:deep(.template-flow .target-position) {
  color: var(--tpl-secondary);
  font-weight: 750;
}

:deep(.template-flow .resume-section:not(.section-personalInfo)) {
  padding: 10px 0 12px;
  border-bottom: 1px solid var(--tpl-border);
}

:deep(.template-flow .section-title) {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 9px;
  color: var(--tpl-primary);
}

:deep(.template-flow .section-title::before) {
  content: '';
  width: 20px;
  height: 2px;
  background: var(--tpl-accent);
}

:deep(.template-flow .resume-item) {
  padding: 8px 0;
}

:deep(.template-flow .item-title) {
  color: var(--tpl-primary);
  font-weight: 800;
}

:deep(.template-flow .item-subtitle) {
  color: var(--tpl-secondary);
  font-weight: 650;
}

:deep(.template-flow .skill-chip),
:deep(.template-flow .tag-list span) {
  border-color: var(--tpl-border);
  background: color-mix(in srgb, var(--tpl-accent) 7%, #ffffff);
}

:deep(.template-flow .bullet-list li::marker) {
  color: var(--tpl-accent);
}
</style>
