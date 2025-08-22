<template>
  <div class="action-buttons">
    <!-- 其他操作按钮可以在这里添加 -->
  </div>
</template>

<script setup>
// 可以在这里添加其他操作按钮的逻辑
</script>

<style scoped>
.action-buttons {
  padding: 15px 20px;
  border-top: 1px solid #e4e7ed;
  background: #fff;
  flex-shrink: 0;
}

.manage-button {
  width: 100%;
  height: 36px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .action-buttons {
    min-width: 120px;
    border-top: none;
    border-left: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
  }
  
  .manage-button {
    width: auto;
    height: 32px;
    font-size: 12px;
  }
}
</style>
