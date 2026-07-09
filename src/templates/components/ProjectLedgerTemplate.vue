<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-project-ledger"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'project-ledger' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-project-ledger .template-page) {
  gap: calc(var(--tpl-section-gap) * 0.95);
}

:deep(.template-project-ledger .personal-layout) {
  grid-template-columns: 96px 1fr;
  padding: 18px 0 14px;
  border-top: 4px solid var(--tpl-primary);
  border-bottom: 1px solid var(--tpl-border);
}

:deep(.template-project-ledger .person-name) {
  color: var(--tpl-primary);
  font-size: calc(var(--tpl-title-size) + 10px);
}

:deep(.template-project-ledger .target-position) {
  color: var(--tpl-secondary);
}

:deep(.template-project-ledger .section-title) {
  margin-bottom: 9px;
  color: var(--tpl-primary);
  font-size: calc(var(--tpl-title-size) - 1px);
}

:deep(.template-project-ledger .section-title::before) {
  width: 18px;
  height: 2px;
  background: var(--tpl-accent);
}

:deep(.template-project-ledger .resume-section:not(.section-personalInfo)) {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--tpl-border);
}

:deep(.template-project-ledger .section-projects .resume-item),
:deep(.template-project-ledger .section-workExperience .resume-item) {
  padding: 8px 0 8px 12px;
  border-left: 1px solid var(--tpl-border);
}

:deep(.template-project-ledger .section-projects .item-title),
:deep(.template-project-ledger .section-workExperience .item-title) {
  color: var(--tpl-primary);
}

:deep(.template-project-ledger .tag-list span),
:deep(.template-project-ledger .skill-chip) {
  border-color: var(--tpl-border);
  background: #f8fafc;
}

:deep(.template-project-ledger .bullet-list li::marker) {
  color: var(--tpl-accent);
}
</style>
