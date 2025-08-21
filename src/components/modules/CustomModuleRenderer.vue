<template>
  <div class="custom-module" v-if="module && moduleData">
    <h3 class="section-title">{{ module.name }}</h3>
    
    <!-- 文本类型模块 -->
    <div v-if="module.type === 'text'" class="text-module">
      <div v-for="field in module.fields" :key="field.name" class="field-group">
        <label class="field-label">{{ field.name }}</label>
        <div class="field-value">{{ moduleData[field.name] || '未填写' }}</div>
      </div>
    </div>

    <!-- 多行文本类型模块 -->
    <div v-else-if="module.type === 'textarea'" class="textarea-module">
      <div v-for="field in module.fields" :key="field.name" class="field-group">
        <label class="field-label">{{ field.name }}</label>
        <div class="field-value textarea-value">{{ moduleData[field.name] || '未填写' }}</div>
      </div>
    </div>

    <!-- 日期类型模块 -->
    <div v-else-if="module.type === 'date'" class="date-module">
      <div v-for="field in module.fields" :key="field.name" class="field-group">
        <label class="field-label">{{ field.name }}</label>
        <div class="field-value">{{ formatDate(moduleData[field.name]) || '未填写' }}</div>
      </div>
    </div>

    <!-- 列表类型模块 -->
    <div v-else-if="module.type === 'list'" class="list-module">
      <div class="list-items">
        <div v-for="(item, index) in moduleData.items || []" :key="index" class="list-item">
          <div class="item-content">
            <div v-for="field in module.fields" :key="field.name" class="field-group">
              <span class="field-label">{{ field.name }}:</span>
              <span class="field-value">{{ item[field.name] || '未填写' }}</span>
            </div>
          </div>
        </div>
        <div v-if="!moduleData.items || moduleData.items.length === 0" class="empty-list">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  module: {
    type: Object,
    required: true
  },
  moduleData: {
    type: Object,
    default: () => ({})
  }
})

// 格式化日期显示
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN')
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.custom-module {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.field-group {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
}

.field-label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
  min-width: 80px;
  font-size: 14px;
}

.field-value {
  color: #303133;
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

.textarea-value {
  white-space: pre-wrap;
  word-break: break-word;
}

.list-module {
  margin-top: 8px;
}

.list-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #409eff;
}

.list-item:last-child {
  margin-bottom: 0;
}

.item-content .field-group {
  margin-bottom: 6px;
}

.item-content .field-group:last-child {
  margin-bottom: 0;
}

.item-content .field-label {
  min-width: 60px;
  font-size: 13px;
}

.item-content .field-value {
  font-size: 13px;
}

.empty-list {
  color: #909399;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

/* 不同模板的样式适配 */
.modern-template .section-title {
  color: #667eea;
  border-bottom-color: #667eea;
}

.classic-template .section-title {
  color: #2c3e50;
  border-bottom-color: #3498db;
  font-family: inherit;
}

.minimal-template .section-title {
  color: #333;
  border-bottom: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 8px;
}

.minimal-template .section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: #333;
}
</style>
