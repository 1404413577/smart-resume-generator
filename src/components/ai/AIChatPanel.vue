<template>
  <div class="ai-chat-panel">
    <p>AI对话面板 - 开发中...</p>
  </div>
</template>

<script setup>
defineProps({
  messages: Array,
  isThinking: Boolean,
  qualityScore: Number
})

defineEmits([
  'send-message',
  'question-click',
  'analyze-quality',
  'upload-jd'
])
</script>

<style scoped>
.ai-chat-panel {
  flex: 1;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
}
</style>
