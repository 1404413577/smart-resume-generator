<template>
  <BaseResumeTemplate
    :resume-data="resumeData"
    :template-id="templateId"
    :render-mode="renderMode"
    :template-class="templateClass"
  />
</template>

<script setup>
import { computed } from 'vue'
import BaseResumeTemplate from './BaseResumeTemplate.vue'
import { templateVariants } from '../templateVariants'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'modern' },
  renderMode: { type: String, default: 'preview' }
})

const templateClass = computed(() => {
  const variant = templateVariants[props.templateId] || templateVariants.modern
  return [
    `template-${props.templateId}`,
    `layout-${variant.layout}`,
    `density-${variant.density}`,
    `accent-${variant.accent}`
  ].join(' ')
})
</script>
