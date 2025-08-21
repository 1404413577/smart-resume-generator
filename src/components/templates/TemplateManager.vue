<template>
  <el-dialog
    v-model="visible"
    title="选择简历模板"
    width="80%"
    :close-on-click-modal="false"
    class="template-manager-dialog"
  >
    <div class="template-manager-content">
      <!-- 搜索和筛选 -->
      <div class="filter-section">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索模板..."
            :prefix-icon="Search"
            clearable
          />
        </div>
        <div class="category-filter">
          <el-select
            v-model="selectedCategory"
            placeholder="选择分类"
            clearable
            style="width: 200px"
          >
            <el-option label="全部分类" value="" />
            <el-option label="专业商务" value="professional" />
            <el-option label="传统正式" value="traditional" />
            <el-option label="创意设计" value="creative" />
            <el-option label="技术专业" value="tech" />
            <el-option label="学术研究" value="academic" />
            <el-option label="极简风格" value="minimalist" />
          </el-select>
        </div>
      </div>

      <!-- 模板网格 -->
      <div class="templates-grid">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="template-card"
          :class="{ 'selected': selectedTemplate?.id === template.id }"
          @click="selectTemplate(template)"
        >
          <div class="template-preview">
            <TemplatePreview :template="template" :width="200" :height="150" />
            <div class="preview-overlay">
              <el-button type="primary" size="small">
                {{ selectedTemplate?.id === template.id ? '已选择' : '选择' }}
              </el-button>
            </div>
          </div>
          <div class="template-info">
            <h3 class="template-name">{{ template.name }}</h3>
            <p class="template-description">{{ template.description }}</p>
            <div class="template-features" v-if="template.features?.length">
              <el-tag
                v-for="feature in template.features.slice(0, 3)"
                :key="feature"
                size="small"
                type="info"
              >
                {{ feature }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTemplates.length === 0" class="empty-state">
        <el-empty description="没有找到匹配的模板" />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="template-info-section" v-if="selectedTemplate">
          <div class="selected-template-info">
            <span class="template-name">{{ selectedTemplate.name }}</span>
            <span class="template-category">{{ getCategoryName(selectedTemplate.category) }}</span>
          </div>
        </div>
        <div class="action-buttons">
          <el-button @click="handleClose">取消</el-button>
          <el-button 
            type="primary" 
            @click="applyTemplate"
            :disabled="!selectedTemplate"
          >
            应用模板
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getAllTemplates } from '@templates'
import { useResumeStore } from '@stores/resume'
import TemplatePreview from './TemplatePreview.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'template-applied'])

const resumeStore = useResumeStore()

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTemplate = ref(null)
const templates = ref([])

// 初始化模板数据
const initTemplates = () => {
  try {
    templates.value = getAllTemplates()
    // 默认选择当前使用的模板
    const currentTemplate = templates.value.find(t => t.id === resumeStore.selectedTemplate)
    if (currentTemplate) {
      selectedTemplate.value = currentTemplate
    }
  } catch (error) {
    console.error('加载模板失败:', error)
    ElMessage.error('加载模板失败')
  }
}

// 监听对话框打开
watch(visible, (newVisible) => {
  if (newVisible) {
    initTemplates()
  }
})

// 计算属性
const filteredTemplates = computed(() => {
  let filtered = templates.value

  // 分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(template => template.category === selectedCategory.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      (template.features && template.features.some(feature => feature.toLowerCase().includes(query))) ||
      (template.suitableFor && template.suitableFor.some(suitable => suitable.toLowerCase().includes(query)))
    )
  }

  return filtered
})

// 方法
const selectTemplate = (template) => {
  selectedTemplate.value = template
}

const getCategoryName = (category) => {
  const categoryMap = {
    'professional': '专业商务',
    'traditional': '传统正式',
    'creative': '创意设计',
    'tech': '技术专业',
    'academic': '学术研究',
    'minimalist': '极简风格'
  }
  return categoryMap[category] || category
}

const applyTemplate = () => {
  if (!selectedTemplate.value) {
    ElMessage.warning('请先选择一个模板')
    return
  }

  try {
    resumeStore.setTemplate(selectedTemplate.value.id)
    ElMessage.success(`已应用 ${selectedTemplate.value.name} 模板`)
    emit('template-applied', selectedTemplate.value)
    handleClose()
  } catch (error) {
    console.error('应用模板失败:', error)
    ElMessage.error('应用模板失败，请重试')
  }
}

const handleClose = () => {
  emit('close')
  visible.value = false
}
</script>

<style scoped>
.template-manager-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.template-manager-content {
  max-height: 70vh;
  overflow-y: auto;
}

.filter-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.search-box {
  flex: 1;
  max-width: 300px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.template-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
}

.template-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.template-card.selected {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
}

.template-preview {
  position: relative;
  overflow: hidden;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.template-card:hover .preview-overlay {
  opacity: 1;
}

.template-info {
  padding: 16px;
}

.template-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.template-description {
  font-size: 14px;
  color: #606266;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.template-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-info-section {
  flex: 1;
}

.selected-template-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.selected-template-info .template-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.selected-template-info .template-category {
  font-size: 12px;
  color: #909399;
}

.action-buttons {
  display: flex;
  gap: 12px;
}
</style>
