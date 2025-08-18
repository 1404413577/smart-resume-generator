<template>
  <div class="template-gallery">
    <el-dialog
      :model-value="visible"
      title="选择简历模板"
      width="90%"
      :close-on-click-modal="false"
      @update:model-value="$emit('update:visible', $event)"
      @close="handleClose"
      class="template-dialog"
    >
      <div class="gallery-content">
        <!-- 搜索和筛选 -->
        <div class="gallery-header">
          <div class="search-section">
            <el-input
              v-model="searchQuery"
              placeholder="搜索模板..."
              :prefix-icon="Search"
              clearable
              class="search-input"
            />
          </div>
          
          <div class="filter-section">
            <el-select
              v-model="selectedCategory"
              placeholder="选择类别"
              clearable
              class="category-select"
            >
              <el-option label="全部模板" value="" />
              <el-option label="现代风格" value="modern" />
              <el-option label="经典风格" value="classic" />
              <el-option label="创意风格" value="creative" />
              <el-option label="极简风格" value="minimalist" />
              <el-option label="专业风格" value="professional" />
              <el-option label="技术风格" value="tech" />
            </el-select>
          </div>

          <div class="view-toggle">
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button label="grid">网格</el-radio-button>
              <el-radio-button label="list">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <!-- 推荐模板 -->
        <div class="recommended-section" v-if="recommendedTemplates.length && !searchQuery">
          <h3 class="section-title">
            <el-icon><Star /></el-icon>
            为您推荐
          </h3>
          <div class="templates-grid recommended">
            <div
              v-for="template in recommendedTemplates"
              :key="template.id"
              class="template-card recommended-card"
              @click="selectTemplate(template)"
            >
              <div class="template-preview">
                <TemplatePreview
                  :template="template"
                  :scale="0.25"
                />
                <div class="recommended-badge">推荐</div>
              </div>
              <div class="template-info">
                <h4 class="template-name">{{ template.name }}</h4>
                <p class="template-description">{{ template.description }}</p>
                <div class="template-features">
                  <el-tag
                    v-for="feature in template.features.slice(0, 2)"
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
        </div>

        <!-- 所有模板 -->
        <div class="all-templates-section">
          <h3 class="section-title">
            <el-icon><Grid /></el-icon>
            {{ searchQuery ? '搜索结果' : '所有模板' }}
            <span class="template-count">({{ filteredTemplates.length }})</span>
          </h3>
          
          <div :class="['templates-container', viewMode]">
            <div
              v-for="template in filteredTemplates"
              :key="template.id"
              :class="['template-card', { 'selected': selectedTemplate?.id === template.id }]"
              @click="selectTemplate(template)"
            >
              <div class="template-preview">
                <TemplatePreview
                  :template="template"
                  :scale="0.25"
                />
                <div class="template-overlay">
                  <el-button type="primary" size="small">选择模板</el-button>
                </div>
              </div>
              
              <div class="template-info">
                <h4 class="template-name">{{ template.name }}</h4>
                <p class="template-description">{{ template.description }}</p>
                
                <div class="template-features">
                  <el-tag
                    v-for="feature in template.features"
                    :key="feature"
                    size="small"
                    type="info"
                  >
                    {{ feature }}
                  </el-tag>
                </div>
                
                <div class="template-suitable">
                  <span class="suitable-label">适合：</span>
                  <span class="suitable-jobs">{{ template.suitableFor.slice(0, 2).join('、') }}</span>
                  <span v-if="template.suitableFor.length > 2" class="more-jobs">等</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredTemplates.length === 0" class="empty-state">
          <el-icon class="empty-icon"><DocumentRemove /></el-icon>
          <h3>未找到匹配的模板</h3>
          <p>请尝试调整搜索条件或选择其他类别</p>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <div class="selected-info" v-if="selectedTemplate">
            <div class="selected-preview">
              <div class="mini-preview" :style="getTemplatePreviewStyle(selectedTemplate)"></div>
            </div>
            <div class="selected-details">
              <h4>{{ selectedTemplate.name }}</h4>
              <p>{{ selectedTemplate.description }}</p>
            </div>
          </div>
          
          <div class="footer-actions">
            <el-button @click="handleClose">取消</el-button>
            <el-button 
              type="primary" 
              @click="confirmSelection"
              :disabled="!selectedTemplate"
            >
              使用此模板
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search,
  Star,
  Grid
} from '@element-plus/icons-vue'
import {
  getAllTemplates,
  getRecommendedTemplates,
  getTemplatesByCategory
} from './templateConfig.js'
import TemplatePreview from './components/TemplatePreview.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentCareer: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'template-selected', 'close'])

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const viewMode = ref('grid')
const selectedTemplate = ref(null)
const allTemplates = ref([])

// 计算属性
const filteredTemplates = computed(() => {
  let templates = allTemplates.value

  // 类别筛选
  if (selectedCategory.value) {
    templates = getTemplatesByCategory(selectedCategory.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    templates = templates.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.features.some(feature => feature.toLowerCase().includes(query)) ||
      template.suitableFor.some(job => job.toLowerCase().includes(query))
    )
  }

  return templates
})

const recommendedTemplates = computed(() => {
  if (props.currentCareer) {
    return getRecommendedTemplates(props.currentCareer).slice(0, 3)
  }
  return allTemplates.value.slice(0, 3)
})

// 方法
const selectTemplate = (template) => {
  selectedTemplate.value = template
}

const confirmSelection = () => {
  if (selectedTemplate.value) {
    emit('template-selected', selectedTemplate.value)
    ElMessage.success(`已选择 ${selectedTemplate.value.name} 模板`)
    handleClose()
  }
}

const handleClose = () => {
  selectedTemplate.value = null
  emit('update:visible', false)
  emit('close')
}



// 获取模板预览样式
const getTemplatePreviewStyle = (template) => {
  if (!template || !template.colors) {
    return {
      '--preview-background': '#ffffff',
      '--preview-primary': '#3b82f6',
      '--preview-secondary': '#6b7280'
    }
  }

  return {
    '--preview-background': template.colors.background || '#ffffff',
    '--preview-primary': template.colors.primary || '#3b82f6',
    '--preview-secondary': template.colors.secondary || '#6b7280'
  }
}

// 生命周期
onMounted(() => {
  allTemplates.value = getAllTemplates()
})
</script>

<style scoped>
.template-gallery .template-dialog {
  --el-dialog-border-radius: 16px;
}

.gallery-content {
  max-height: 70vh;
  overflow-y: auto;
}

.gallery-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.search-input {
  width: 300px;
}

.category-select {
  width: 150px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.template-count {
  font-size: 14px;
  color: #6b7280;
  font-weight: 400;
}

.templates-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.templates-container.list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.templates-grid.recommended {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.template-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.template-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.template-card.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.recommended-card {
  position: relative;
}

.recommended-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  z-index: 2;
}

.template-preview {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-bottom: 1px solid #e5e7eb;
}



.template-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.template-card:hover .template-overlay {
  opacity: 1;
}

.template-info {
  padding: 20px;
}

.template-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.template-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.template-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.template-suitable {
  font-size: 12px;
  color: #6b7280;
}

.suitable-label {
  font-weight: 500;
}

.suitable-jobs {
  color: #374151;
}

.more-jobs {
  color: #9ca3af;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.mini-preview {
  width: 60px;
  height: 40px;
  background: var(--preview-background, #ffffff);
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  position: relative;
}

.mini-preview::before {
  content: '';
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  height: 4px;
  background: var(--preview-primary, #3b82f6);
  border-radius: 2px;
}

.mini-preview::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 6px;
  right: 20px;
  height: 2px;
  background: var(--preview-secondary, #6b7280);
  border-radius: 1px;
  opacity: 0.5;
}

.selected-details h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #1f2937;
}

.selected-details p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

/* 列表视图样式 */
.templates-container.list .template-card {
  display: flex;
  height: 120px;
}

.templates-container.list .template-preview {
  width: 200px;
  height: 120px;
}

.templates-container.list .template-info {
  flex: 1;
  padding: 15px 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gallery-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .templates-container.grid {
    grid-template-columns: 1fr;
  }
  
  .dialog-footer {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .footer-actions {
    justify-content: center;
  }
}
</style>
