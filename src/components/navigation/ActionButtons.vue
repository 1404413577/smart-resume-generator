<template>
  <div class="action-buttons">
    <el-popconfirm
      title="警告"
      description="这将使用示例数据填充整个简历，现有数据将被覆盖。是否继续？"
      confirm-button-text="确认填充"
      cancel-button-text="取消"
      @confirm="handleFillDefault"
    >
      <template #reference>
        <el-button type="primary" class="fill-default-btn">
          <el-icon><DocumentCopy /></el-icon>
          使用默认数据    
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useResumeStore } from '@stores/resume'
import { DocumentCopy } from '@element-plus/icons-vue'

const resumeStore = useResumeStore()

const handleFillDefault = () => {
  try {
    resumeStore.fillWithDefaultData()
    ElMessage.success('已成功填充默认数据！')
  } catch (error) {
    console.error('填充默认数据失败:', error)
    ElMessage.error('填充默认数据失败，请查看控制台错误信息')
  }
}
</script>

<style scoped>
.action-buttons {
  padding: 15px 20px;
  border-top: 1px solid #e4e7ed;
  background: #fff;
  flex-shrink: 0;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.fill-default-btn {
  width: 100%;
  max-width: 240px;
  height: 40px;
  font-weight: 600;
  font-size: 14px;
  background: linear-gradient(135deg, #409eff 0%, #66b3ff 100%);
  border: none;
  border-radius: 4px;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
}

.fill-default-btn:hover {
  background: linear-gradient(135deg, #66b3ff 0%, #409eff 100%);
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.5);
  transform: translateY(-2px);
}

.fill-default-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .action-buttons {
    min-width: 120px;
    border-top: none;
    border-left: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    padding: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .fill-default-btn {
    width: auto;
    max-width: none;
    height: 36px;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .action-buttons {
    border-left: none;
    border-top: 1px solid #e4e7ed;
    padding: 12px 10px;
  }
  
  .fill-default-btn {
    width: 100%;
    height: 36px;
    font-size: 12px;
  }
}
</style>
</style>
