<template>
  <div class="section-order-manager">
    <div class="header">
      <h3 class="title">
        <el-icon><Sort /></el-icon>
        章节排序
      </h3>
      <el-button 
        type="text" 
        size="small" 
        @click="resetOrder"
        class="reset-btn"
      >
        <el-icon><RefreshLeft /></el-icon>
        重置默认
      </el-button>
    </div>

    <div class="section-list">
      <div
        v-for="(section, index) in orderedSections"
        :key="section.key"
        class="section-item"
        :class="{ 'has-data': section.hasData }"
      >
        <div class="section-info">
          <span class="section-icon">{{ section.icon }}</span>
          <span class="section-name">{{ section.name }}</span>
          <el-tag 
            v-if="section.hasData" 
            size="small" 
            type="success"
            class="data-tag"
          >
            有数据
          </el-tag>
          <el-tag 
            v-else 
            size="small" 
            type="info"
            class="data-tag"
          >
            无数据
          </el-tag>
        </div>

        <div class="section-controls">
          <el-button
            type="text"
            size="small"
            :disabled="index === 0"
            @click="moveUp(index)"
            class="move-btn"
          >
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button
            type="text"
            size="small"
            :disabled="index === orderedSections.length - 1"
            @click="moveDown(index)"
            class="move-btn"
          >
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <div class="tips">
      <el-icon><InfoFilled /></el-icon>
      <span>调整章节顺序将实时反映在简历预览中</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '../stores/resume'


const resumeStore = useResumeStore()

// 计算属性
const orderedSections = computed(() => resumeStore.getOrderedSections)

// 方法
const moveUp = (index) => {
  resumeStore.moveSectionUp(index)
}

const moveDown = (index) => {
  resumeStore.moveSectionDown(index)
}

const resetOrder = () => {
  resumeStore.resetSectionOrder()
}
</script>

<style scoped>
.section-order-manager {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reset-btn {
  color: #409eff;
  padding: 4px 8px;
}

.reset-btn:hover {
  background-color: #ecf5ff;
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.section-item:hover {
  background: #f0f9ff;
  border-color: #409eff;
}

.section-item.has-data {
  background: #f0f9ff;
  border-color: #67c23a;
}

.section-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.section-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.section-name {
  font-weight: 500;
  color: #303133;
  flex: 1;
}

.data-tag {
  font-size: 12px;
}

.section-controls {
  display: flex;
  gap: 4px;
}

.move-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 4px;
  color: #606266;
}

.move-btn:hover:not(:disabled) {
  background-color: #409eff;
  color: #fff;
}

.move-btn:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.tips {
  margin-top: 16px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.tips .el-icon {
  color: #409eff;
}
</style>
