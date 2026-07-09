<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-portfolio"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'portfolio' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-portfolio .template-page) {
  gap: calc(var(--tpl-section-gap) * 1.12);
}

:deep(.template-portfolio .personal-layout) {
  padding: 20px;
  border: 1px solid var(--tpl-border);
  border-bottom: 4px solid var(--tpl-accent);
  background: color-mix(in srgb, var(--tpl-accent) 8%, #ffffff);
}

:deep(.template-portfolio .avatar-image) {
  border-radius: 14px;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px var(--tpl-border);
}

:deep(.template-portfolio .person-name) {
  color: var(--tpl-primary);
  font-size: calc(var(--tpl-title-size) + 14px);
  font-weight: 850;
}

:deep(.template-portfolio .target-position) {
  display: inline-flex;
  padding: 3px 8px;
  color: #fff;
  background: var(--tpl-primary);
  font-size: 0.92em;
}

:deep(.template-portfolio .resume-section:not(.section-personalInfo)) {
  padding: 10px 0 12px;
}

:deep(.template-portfolio .section-title) {
  display: inline-flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 4px 10px;
  color: #fff;
  background: var(--tpl-primary);
  font-size: calc(var(--tpl-title-size) - 1px);
}

:deep(.template-portfolio .section-title::before) {
  display: none;
}

:deep(.template-portfolio .section-projects .item-list),
:deep(.template-portfolio .section-skills .skill-list) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 10px;
}

:deep(.template-portfolio .section-projects .resume-item) {
  padding: 10px;
  border: 1px solid var(--tpl-border);
  background: #ffffff;
}

:deep(.template-portfolio .item-title) {
  color: var(--tpl-primary);
  font-weight: 800;
}

:deep(.template-portfolio .item-subtitle) {
  color: var(--tpl-secondary);
  font-weight: 650;
}

:deep(.template-portfolio .skill-chip),
:deep(.template-portfolio .tag-list span) {
  border-color: color-mix(in srgb, var(--tpl-accent) 35%, var(--tpl-border));
  background: color-mix(in srgb, var(--tpl-accent) 9%, #ffffff);
}

:deep(.template-portfolio .bullet-list li::marker) {
  color: var(--tpl-accent);
}

@media screen and (max-width: 900px) {
  :deep(.template-portfolio .section-projects .item-list),
  :deep(.template-portfolio .section-skills .skill-list) {
    grid-template-columns: 1fr;
  }
}
</style>
