<template>
  <div class="ai-preview-panel">
    <p>AI预览面板 - 开发中...</p>
  </div>
</template>

<script setup>
defineProps({
  previewData: Object
})

defineEmits([
  'refresh-preview',
  'apply-to-editor'
])
</script>

<style scoped>
.ai-preview-panel {
  width: 400px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  border-left: 1px solid #e4e7ed;
}
</style>
