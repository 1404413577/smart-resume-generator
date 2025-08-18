<template>
  <div class="navigation-panel">
    <!-- AI功能区域 -->
    <AIActionButtons
      @ai-generate="$emit('ai-generate')"
      @template-manage="$emit('template-manage')"
    />

    <!-- 模块导航 -->
    <ModuleNavigation
      :active-module="activeModule"
      @module-change="$emit('module-change', $event)"
    />

    <!-- 底部操作按钮 -->
    <ActionButtons
      @manage-resumes="$emit('manage-resumes')"
    />
  </div>
</template>

<script setup>
import AIActionButtons from './AIActionButtons.vue'
import ModuleNavigation from './ModuleNavigation.vue'
import ActionButtons from './ActionButtons.vue'

defineProps({
  activeModule: {
    type: String,
    required: true
  }
})

defineEmits([
  'module-change',
  'template-manage',
  'ai-generate',
  'manage-resumes'
])
</script>

<style scoped>
.navigation-panel {
  width: 280px;
  height: 100%;
  background: #f8f9fa;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (max-width: 1200px) {
  .navigation-panel {
    width: 240px; /* 保持固定宽度，但稍微缩小 */
    height: 100%;
    flex-direction: column;
    overflow-y: auto;
  }
}

@media (max-width: 768px) {
  .navigation-panel {
    width: 100%;
    height: auto;
    max-height: 200px;
    flex-direction: row;
    overflow-x: auto;
  }
}
</style>
