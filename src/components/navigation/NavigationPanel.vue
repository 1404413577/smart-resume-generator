<template>
  <div class="navigation-panel">
    <!-- AI功能区域 -->
    <div class="ai-section">
      <AIActionButtons
        @ai-generate="$emit('ai-generate')"
        @template-manage="$emit('template-manage')"
        @ocr-import="$emit('ocr-import')"
      />
    </div>

    <!-- 模块导航 -->
    <div class="module-section">
      <ModuleNavigation
        :active-module="activeModule"
        @module-change="$emit('module-change', $event)"
      />
    </div>

    <!-- 底部操作按钮 -->
    <div class="action-section">
      <ActionButtons />
    </div>
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
  'ocr-import'
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

.ai-section {
  flex-shrink: 0;
  overflow-y: auto;
}

.module-section {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

.action-section {
  flex-shrink: 0;
  border-top: 1px solid #e4e7ed;
}

@media (max-width: 1200px) {
  .navigation-panel {
    width: 240px;
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
