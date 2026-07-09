<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-ats-clean"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'ats-clean' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-ats-clean .template-page) {
  gap: calc(var(--tpl-section-gap) * 0.72);
  padding: var(--tpl-padding);
}

:deep(.template-ats-clean .personal-layout) {
  grid-template-columns: 1fr;
  gap: 8px;
  align-items: start;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--tpl-text);
}

:deep(.template-ats-clean .avatar-image) {
  width: 64px;
  height: 64px;
  border-radius: 2px;
  border: 1px solid var(--tpl-border);
}

:deep(.template-ats-clean .person-name) {
  color: var(--tpl-text);
  font-size: calc(var(--tpl-title-size) + 8px);
  font-weight: 750;
}

:deep(.template-ats-clean .target-position) {
  margin-top: 4px;
  color: var(--tpl-text);
  font-weight: 600;
}

:deep(.template-ats-clean .contact-list) {
  gap: 3px 10px;
  margin-top: 8px;
  color: var(--tpl-text);
  font-size: 0.88em;
}

:deep(.template-ats-clean .section-title) {
  margin-bottom: 5px;
  padding-bottom: 3px;
  color: var(--tpl-text);
  font-size: calc(var(--tpl-title-size) - 1px);
  border-bottom: 1px solid var(--tpl-text);
}

:deep(.template-ats-clean .section-title::before) {
  display: none;
}

:deep(.template-ats-clean .item-list) {
  gap: 7px;
}

:deep(.template-ats-clean .item-title) {
  font-size: 1em;
}

:deep(.template-ats-clean .item-subtitle),
:deep(.template-ats-clean .item-meta),
:deep(.template-ats-clean .skill-chip small) {
  color: var(--tpl-text);
}

:deep(.template-ats-clean .skill-list),
:deep(.template-ats-clean .tag-list) {
  gap: 4px 8px;
}

:deep(.template-ats-clean .skill-chip),
:deep(.template-ats-clean .tag-list span) {
  padding: 0;
  border: 0;
  background: transparent;
}

:deep(.template-ats-clean .skill-chip::after),
:deep(.template-ats-clean .tag-list span::after) {
  content: ';';
}

:deep(.template-ats-clean .skill-chip:last-child::after),
:deep(.template-ats-clean .tag-list span:last-child::after) {
  content: '';
}
</style>
