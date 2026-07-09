<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    template-class="template-sidebar"
  />
</template>

<script setup>
import BaseResumeTemplate from './BaseResumeTemplate.vue'

defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'sidebar' },
  renderMode: { type: String, default: 'preview' }
})
</script>

<style scoped>
:deep(.template-sidebar .template-page) {
  display: grid;
  grid-template-columns: 34% 1fr;
  align-items: start;
  column-gap: var(--tpl-column-gap);
}

:deep(.template-sidebar .section-personalInfo) {
  padding: 18px;
  background: #f1f5f9;
}

:deep(.template-sidebar .section-personalInfo),
:deep(.template-sidebar .section-skills),
:deep(.template-sidebar .section-languages),
:deep(.template-sidebar .section-certifications) {
  grid-column: 1;
}

:deep(.template-sidebar .resume-section:not(.section-personalInfo):not(.section-skills):not(.section-languages):not(.section-certifications)) {
  grid-column: 2;
}

:deep(.template-sidebar .personal-layout) {
  grid-template-columns: 1fr;
}

:deep(.template-sidebar .section-title) {
  font-size: calc(var(--tpl-title-size) - 2px);
}

@media screen and (max-width: 900px) {
  :deep(.template-sidebar .template-page) {
    display: flex;
    flex-direction: column;
  }
}
</style>
