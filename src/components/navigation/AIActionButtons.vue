<template>
  <div class="ai-action-buttons">
    <!-- AI智能助手按钮 -->
    <div class="ai-generate-section">
      <el-button @click="$emit('ai-generate')" type="success" size="default" class="ai-button">
        <el-icon><MagicStick /></el-icon>
        AI智能助手
      </el-button>
      <p class="ai-description">对话式AI，智能生成个性化简历</p>
    </div>

    <!-- 模板中心按钮 -->
    <div class="template-manage-section">
      <el-button @click="$emit('template-manage')" type="primary" size="default" class="template-button">
        <el-icon><Document /></el-icon>
        模板中心
      </el-button>
      <p class="template-description">选择模板，直接编辑，导出PDF</p>
    </div>
  </div>
</template>

<script setup>
import { MagicStick, Document } from '@element-plus/icons-vue'

defineEmits(['ai-generate', 'template-manage'])
</script>

<style scoped>
.ai-action-buttons {
  flex-shrink: 0;
}

/* AI生成按钮区域样式 */
.ai-generate-section {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
  flex-shrink: 0;
}

.ai-generate-section .ai-button {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  border: none;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
  transition: all 0.3s ease;
  border-radius: 8px;
}

.ai-generate-section .ai-button:hover {
  background: linear-gradient(135deg, #85ce61 0%, #67c23a 100%);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
  transform: translateY(-1px);
}

.ai-generate-section .ai-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);
}

.ai-generate-section .ai-description {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #909399;
  text-align: center;
  line-height: 1.3;
}

/* 模板管理按钮区域样式 */
.template-manage-section {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
  flex-shrink: 0;
}

.template-manage-section .template-button {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border: none;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
  border-radius: 8px;
}

.template-manage-section .template-button:hover {
  background: linear-gradient(135deg, #67c23a 0%, #409eff 100%);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  transform: translateY(-1px);
}

.template-manage-section .template-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
}

.template-manage-section .template-description {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #909399;
  text-align: center;
  line-height: 1.3;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .ai-action-buttons {
    display: flex;
    gap: 10px;
    min-width: 300px;
  }
  
  .ai-generate-section,
  .template-manage-section {
    flex: 1;
    border-bottom: none;
    border-right: 1px solid #e4e7ed;
  }
  
  .template-manage-section {
    border-right: none;
  }
}
</style>
