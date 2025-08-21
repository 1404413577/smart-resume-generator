<template>
  <div class="custom-module-editor" v-if="module">
    <div class="module-header">
      <h3 class="module-title">{{ module.name }}</h3>
      <p class="module-description" v-if="module.description">{{ module.description }}</p>
    </div>

    <!-- 文本类型模块编辑 -->
    <div v-if="module.type === 'text'" class="text-editor">
      <div v-for="field in module.fields" :key="field.name" class="field-editor">
        <label class="field-label">
          {{ field.name }}
          <span v-if="field.required" class="required">*</span>
        </label>
        <el-input
          :model-value="moduleData[field.name] || ''"
          @update:model-value="(val) => updateField(field.name, val)"
          :placeholder="`请输入${field.name}`"
          size="small"
        />
      </div>
    </div>

    <!-- 多行文本类型模块编辑 -->
    <div v-else-if="module.type === 'textarea'" class="textarea-editor">
      <div v-for="field in module.fields" :key="field.name" class="field-editor">
        <label class="field-label">
          {{ field.name }}
          <span v-if="field.required" class="required">*</span>
        </label>
        <el-input
          type="textarea"
          :model-value="moduleData[field.name] || ''"
          @update:model-value="(val) => updateField(field.name, val)"
          :placeholder="`请输入${field.name}`"
          :rows="4"
          size="small"
        />
      </div>
    </div>

    <!-- 日期类型模块编辑 -->
    <div v-else-if="module.type === 'date'" class="date-editor">
      <div v-for="field in module.fields" :key="field.name" class="field-editor">
        <label class="field-label">
          {{ field.name }}
          <span v-if="field.required" class="required">*</span>
        </label>
        <el-date-picker
          :model-value="moduleData[field.name] || ''"
          @update:model-value="(val) => updateField(field.name, val)"
          type="date"
          :placeholder="`请选择${field.name}`"
          size="small"
          style="width: 100%"
        />
      </div>
    </div>

    <!-- 列表类型模块编辑 -->
    <div v-else-if="module.type === 'list'" class="list-editor">
      <div class="list-header">
        <span class="list-title">列表项目</span>
        <el-button type="primary" size="small" @click="addListItem">
          <el-icon><Plus /></el-icon>
          添加项目
        </el-button>
      </div>

      <div class="list-items">
        <div v-for="(item, index) in moduleData.items || []" :key="index" class="list-item-editor">
          <div class="item-header">
            <span class="item-index">项目 {{ index + 1 }}</span>
            <el-button size="small" text type="danger" @click="removeListItem(index)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
          
          <div class="item-fields">
            <div v-for="field in module.fields" :key="field.name" class="field-editor">
              <label class="field-label">
                {{ field.name }}
                <span v-if="field.required" class="required">*</span>
              </label>
              <el-input
                v-if="field.type === 'text'"
                :model-value="item[field.name] || ''"
                @update:model-value="(val) => updateListItemField(index, field.name, val)"
                :placeholder="`请输入${field.name}`"
                size="small"
              />
              <el-date-picker
                v-else-if="field.type === 'date'"
                :model-value="item[field.name] || ''"
                @update:model-value="(val) => updateListItemField(index, field.name, val)"
                type="date"
                :placeholder="`请选择${field.name}`"
                size="small"
                style="width: 100%"
              />
              <el-input-number
                v-else-if="field.type === 'number'"
                :model-value="item[field.name] || 0"
                @update:model-value="(val) => updateListItemField(index, field.name, val)"
                :placeholder="`请输入${field.name}`"
                size="small"
                style="width: 100%"
              />
            </div>
          </div>
        </div>

        <div v-if="!moduleData.items || moduleData.items.length === 0" class="empty-list">
          <p>暂无项目，点击"添加项目"开始填写</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'

const props = defineProps({
  module: {
    type: Object,
    required: true
  }
})

const resumeStore = useResumeStore()

// 获取模块数据
const moduleData = computed(() => {
  return resumeStore.getCustomModuleData(props.module.id)
})

// 初始化模块数据
watch(() => props.module, (newModule) => {
  if (newModule) {
    resumeStore.initializeCustomModuleData(newModule.id, newModule.fields)
  }
}, { immediate: true })

// 更新字段值
const updateField = (fieldName, value) => {
  const currentData = { ...moduleData.value }
  currentData[fieldName] = value
  resumeStore.updateCustomModuleData(props.module.id, currentData)
}

// 添加列表项
const addListItem = () => {
  const currentData = { ...moduleData.value }
  if (!currentData.items) {
    currentData.items = []
  }
  
  const newItem = {}
  props.module.fields.forEach(field => {
    newItem[field.name] = field.type === 'number' ? 0 : ''
  })
  
  currentData.items.push(newItem)
  resumeStore.updateCustomModuleData(props.module.id, currentData)
}

// 删除列表项
const removeListItem = (index) => {
  const currentData = { ...moduleData.value }
  if (currentData.items) {
    currentData.items.splice(index, 1)
    resumeStore.updateCustomModuleData(props.module.id, currentData)
  }
}

// 更新列表项字段
const updateListItemField = (itemIndex, fieldName, value) => {
  const currentData = { ...moduleData.value }
  if (!currentData.items) {
    currentData.items = []
  }
  
  if (currentData.items[itemIndex]) {
    currentData.items[itemIndex][fieldName] = value
    resumeStore.updateCustomModuleData(props.module.id, currentData)
  }
}
</script>

<style scoped>
.custom-module-editor {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 16px;
  background: #fff;
}

.module-header {
  margin-bottom: 16px;
}

.module-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.module-description {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.4;
}

.field-editor {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.required {
  color: #f56c6c;
  margin-left: 2px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.list-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.list-item-editor {
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-index {
  font-size: 14px;
  font-weight: 500;
  color: #409eff;
}

.item-fields {
  display: grid;
  gap: 12px;
}

.empty-list {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
  background: #f8f9fa;
  border-radius: 6px;
  border: 2px dashed #e4e7ed;
}

.empty-list p {
  margin: 0;
  font-size: 14px;
}
</style>
