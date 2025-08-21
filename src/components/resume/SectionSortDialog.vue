<template>
  <el-dialog
    v-model="visible"
    title="章节排序"
    width="500px"
    :before-close="handleClose"
    class="section-order-dialog"
  >
    <div class="section-order-content">
      <div class="order-description">
        <el-icon><InfoFilled /></el-icon>
        <span>拖拽下方章节来调整简历中的显示顺序</span>
      </div>

      <div class="section-list">
        <draggable
          v-model="localSectionOrder"
          item-key="id"
          handle=".drag-handle"
          ghost-class="ghost"
          chosen-class="chosen"
          drag-class="drag"
          @start="onDragStart"
          @end="onDragEnd"
        >
          <template #item="{ element, index }">
            <div class="section-item" :class="{ disabled: !getSectionConfig(element).visible }">
              <div class="drag-handle">
                <el-icon><Rank /></el-icon>
              </div>
              
              <div class="section-info">
                <div class="section-icon">{{ getSectionConfig(element).icon }}</div>
                <div class="section-details">
                  <div class="section-name">{{ getSectionConfig(element).name }}</div>
                  <div class="section-status">
                    <span v-if="getSectionConfig(element).visible" class="status-visible">
                      <el-icon><View /></el-icon>
                      显示
                    </span>
                    <span v-else class="status-hidden">
                      <el-icon><Hide /></el-icon>
                      隐藏
                    </span>
                    <span class="data-status">
                      {{ getDataStatus(element) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="section-actions">
                <el-button
                  size="small"
                  :icon="ArrowUp"
                  :disabled="index === 0"
                  @click="moveUp(index)"
                  circle
                />
                <el-button
                  size="small"
                  :icon="ArrowDown"
                  :disabled="index === localSectionOrder.length - 1"
                  @click="moveDown(index)"
                  circle
                />
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <div class="order-preview">
        <h4>预览顺序</h4>
        <div class="preview-list">
          <div
            v-for="(section, index) in localSectionOrder"
            :key="section"
            class="preview-item"
            :class="{ disabled: !getSectionConfig(section).visible }"
          >
            <span class="preview-number">{{ index + 1 }}</span>
            <span class="preview-icon">{{ getSectionConfig(section).icon }}</span>
            <span class="preview-name">{{ getSectionConfig(section).name }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resetOrder" :icon="RefreshLeft">
          重置默认
        </el-button>
        <div class="footer-actions">
          <el-button @click="handleClose">
            取消
          </el-button>
          <el-button type="primary" @click="saveOrder" :icon="Check">
            保存排序
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  InfoFilled,
  Rank,
  View,
  Hide,
  ArrowUp,
  ArrowDown,
  RefreshLeft,
  Check
} from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { useResumeStore } from '@stores/resume'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'order-changed'])

const resumeStore = useResumeStore()

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const localSectionOrder = ref([])
const isDragging = ref(false)

// 初始化本地排序数据
watch(visible, (newVisible) => {
  if (newVisible) {
    localSectionOrder.value = [...resumeStore.sectionOrder]
  }
}, { immediate: true })

// 计算属性
const getSectionConfig = (sectionKey) => {
  return resumeStore.sectionConfig[sectionKey] || {
    name: sectionKey,
    icon: '📄',
    visible: true
  }
}

const getDataStatus = (sectionKey) => {
  const data = resumeStore.resumeData[sectionKey]
  
  if (sectionKey === 'personalInfo') {
    return data?.name ? '已填写' : '未填写'
  } else if (sectionKey === 'summary') {
    return data ? '已填写' : '未填写'
  } else if (Array.isArray(data)) {
    return data.length > 0 ? `${data.length}项` : '未填写'
  }
  
  return '未知'
}

// 方法
const onDragStart = () => {
  isDragging.value = true
}

const onDragEnd = () => {
  isDragging.value = false
}

const moveUp = (index) => {
  if (index > 0) {
    const newOrder = [...localSectionOrder.value]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index - 1]
    newOrder[index - 1] = temp
    localSectionOrder.value = newOrder
  }
}

const moveDown = (index) => {
  if (index < localSectionOrder.value.length - 1) {
    const newOrder = [...localSectionOrder.value]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index + 1]
    newOrder[index + 1] = temp
    localSectionOrder.value = newOrder
  }
}

const resetOrder = () => {
  localSectionOrder.value = [
    'personalInfo',
    'summary',
    'education',
    'workExperience',
    'skills',
    'projects'
  ]
  ElMessage.success('已重置为默认排序')
}

const saveOrder = () => {
  resumeStore.updateSectionOrder(localSectionOrder.value)
  emit('order-changed', localSectionOrder.value)
  ElMessage.success('章节排序已保存')
  handleClose()
}

const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
.section-order-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.order-description {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #0369a1;
}

.section-list {
  margin-bottom: 24px;
}

.section-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: move;
}

.section-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.section-item.disabled {
  opacity: 0.6;
  background: #f9fafb;
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #9ca3af;
  cursor: grab;
  margin-right: 12px;
}

.drag-handle:active {
  cursor: grabbing;
}

.section-info {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;
}

.section-icon {
  font-size: 20px;
  width: 32px;
  text-align: center;
}

.section-details {
  flex: 1;
}

.section-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.section-status {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.status-visible {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #059669;
}

.status-hidden {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #9ca3af;
}

.data-status {
  color: #6b7280;
}

.section-actions {
  display: flex;
  gap: 4px;
}

.order-preview {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.order-preview h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 12px;
  color: #374151;
}

.preview-item.disabled {
  opacity: 0.5;
}

.preview-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: #409eff;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 600;
}

.preview-icon {
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

/* 拖拽样式 */
.ghost {
  opacity: 0.5;
  background: #f0f9ff;
  border: 2px dashed #409eff;
}

.chosen {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.drag {
  transform: rotate(2deg);
}
</style>
