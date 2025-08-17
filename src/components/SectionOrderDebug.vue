<template>
  <div class="section-order-debug">
    <el-card>
      <template #header>
        <span>🔍 章节排序调试信息</span>
      </template>
      
      <div class="debug-info">
        <h4>当前章节排序：</h4>
        <ol>
          <li v-for="(sectionKey, index) in sectionOrder" :key="sectionKey">
            {{ index + 1 }}. {{ sectionConfig[sectionKey]?.name }} ({{ sectionKey }})
          </li>
        </ol>
        
        <h4>排序操作测试：</h4>
        <div class="test-buttons">
          <el-button 
            v-for="(sectionKey, index) in sectionOrder" 
            :key="sectionKey"
            size="small"
            @click="moveSectionUp(index)"
            :disabled="index === 0"
          >
            ↑ {{ sectionConfig[sectionKey]?.name }}
          </el-button>
        </div>
        
        <div class="test-buttons">
          <el-button 
            v-for="(sectionKey, index) in sectionOrder" 
            :key="sectionKey"
            size="small"
            @click="moveSectionDown(index)"
            :disabled="index === sectionOrder.length - 1"
          >
            ↓ {{ sectionConfig[sectionKey]?.name }}
          </el-button>
        </div>
        
        <div class="reset-section">
          <el-button type="danger" @click="resetSectionOrder">
            重置排序
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useResumeStore } from '../stores/resume'

const resumeStore = useResumeStore()

// 使用响应式引用，不要解构赋值以保持响应性
const sectionConfig = resumeStore.sectionConfig
const sectionOrder = resumeStore.sectionOrder

// 解构方法函数
const { 
  moveSectionUp,
  moveSectionDown,
  resetSectionOrder
} = resumeStore
</script>

<style scoped>
.section-order-debug {
  margin: 20px 0;
}

.debug-info h4 {
  margin: 16px 0 8px 0;
  color: var(--el-text-color-primary);
}

.debug-info ol {
  margin: 8px 0;
  padding-left: 20px;
}

.debug-info li {
  margin: 4px 0;
  color: var(--el-text-color-regular);
}

.test-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.reset-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color);
}
</style>
