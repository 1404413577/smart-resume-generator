<template>
  <div class="action-buttons">
    <el-button @click="$emit('manage-resumes')" type="primary" size="small" class="manage-button">
      <el-icon><Folder /></el-icon>
      简历管理
    </el-button>
  </div>
</template>

<script setup>
import { Folder } from '@element-plus/icons-vue'

defineEmits(['manage-resumes'])
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
