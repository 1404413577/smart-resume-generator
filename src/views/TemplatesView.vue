<template>
  <div class="templates-view">
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <el-icon><Grid /></el-icon>
            模板中心
          </h1>
          <p class="page-description">选择专业简历模板，快速创建精美简历</p>
        </div>
        <div class="header-actions">
          <el-button @click="showPreview = !showPreview" :icon="View">
            {{ showPreview ? '隐藏预览' : '显示预览' }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="page-content">
      <!-- 筛选和搜索 -->
      <div class="filters-section">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索模板..."
            :prefix-icon="Search"
            clearable
          />
        </div>
        <div class="filter-controls">
          <el-select v-model="selectedCategory" placeholder="选择类别" clearable>
            <el-option label="全部" value="" />
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="grid">网格</el-radio-button>
            <el-radio-button label="list">列表</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="templates-container">
        <!-- 推荐模板 -->
        <div class="section" v-if="!searchQuery && !selectedCategory">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Star /></el-icon>
              为您推荐
            </h2>
          </div>
          <div class="templates-grid recommended">
            <div
              v-for="template in recommendedTemplates"
              :key="template.id"
              class="template-card recommended-card"
              @click="selectTemplate(template)"
            >
              <div class="card-badge">推荐</div>
              <div class="template-preview">
                <TemplateThumbnail :template="template" :width="200" :height="150" />
              </div>
              <div class="template-info">
                <h3 class="template-name">{{ template.name }}</h3>
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
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Grid /></el-icon>
              所有模板 ({{ filteredTemplates.length }})
            </h2>
          </div>
          
          <div v-if="viewMode === 'grid'" class="templates-grid">
            <div
              v-for="template in filteredTemplates"
              :key="template.id"
              class="template-card"
              @click="selectTemplate(template)"
            >
              <div class="template-preview">
                <TemplateThumbnail :template="template" :width="200" :height="150" />
                <div class="preview-overlay">
                  <el-button type="primary" size="small">选择模板</el-button>
                </div>
              </div>
              <div class="template-info">
                <h3 class="template-name">{{ template.name }}</h3>
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
                  <span class="suitable-text">{{ template.suitableFor.join('、') }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="templates-list">
            <div
              v-for="template in filteredTemplates"
              :key="template.id"
              class="template-list-item"
              @click="selectTemplate(template)"
            >
              <div class="list-preview">
                <TemplateThumbnail :template="template" :width="120" :height="90" />
              </div>
              <div class="list-content">
                <div class="list-header">
                  <h3 class="template-name">{{ template.name }}</h3>
                  <el-button type="primary" size="small">选择模板</el-button>
                </div>
                <p class="template-description">{{ template.description }}</p>
                <div class="template-meta">
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
                    <span class="suitable-text">{{ template.suitableFor.join('、') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模板预览对话框 -->
    <el-dialog
      v-model="showTemplateDialog"
      :title="selectedTemplate?.name"
      width="90%"
      :close-on-click-modal="false"
      class="template-dialog"
    >
      <div class="template-dialog-content" v-if="selectedTemplate">
        <div class="dialog-preview">
          <div class="preview-container">
            <TemplatePreview
              :template="selectedTemplate"
              :scale="0.4"
            />
          </div>
        </div>
        <div class="dialog-info">
          <h3>{{ selectedTemplate.name }}</h3>
          <p>{{ selectedTemplate.description }}</p>
          <div class="dialog-features">
            <h4>特色功能：</h4>
            <ul>
              <li v-for="feature in selectedTemplate.features" :key="feature">
                {{ feature }}
              </li>
            </ul>
          </div>
          <div class="dialog-suitable">
            <h4>适合人群：</h4>
            <p>{{ selectedTemplate.suitableFor.join('、') }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showTemplateDialog = false">取消</el-button>
          <el-button @click="previewTemplate" type="info">全屏预览</el-button>
          <el-button @click="useTemplate" type="primary">使用此模板</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 全屏预览对话框 -->
    <el-dialog
      v-model="showFullPreview"
      title="模板预览"
      width="95%"
      :close-on-click-modal="false"
      class="fullscreen-preview-dialog"
    >
      <div class="fullscreen-preview-container" v-if="selectedTemplate">
        <TemplatePreview
          :template="selectedTemplate"
          :scale="0.8"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showFullPreview = false">关闭</el-button>
          <el-button @click="useTemplate" type="primary">使用此模板</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Grid,
  View,
  Search,
  Star
} from '@element-plus/icons-vue'
import { getAllTemplates, getTemplatesByCategory } from '@templates'
import { useResumeStore } from '@stores/resume'
import TemplateThumbnail from '@components/templates/TemplateThumbnail.vue'

const router = useRouter()
const resumeStore = useResumeStore()

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const viewMode = ref('grid')
const showPreview = ref(false)
const showTemplateDialog = ref(false)
const showFullPreview = ref(false)
const selectedTemplate = ref(null)
const templates = ref([])

// 类别选项
const categories = [
  { label: '现代风格', value: 'modern' },
  { label: '经典风格', value: 'classic' },
  { label: '创意风格', value: 'creative' },
  { label: '极简风格', value: 'minimalist' },
  { label: '专业风格', value: 'professional' },
  { label: '学术风格', value: 'academic' },
  { label: '技术风格', value: 'tech' }
]

// 计算属性
const filteredTemplates = computed(() => {
  let filtered = templates.value

  // 类别筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(template => template.category === selectedCategory.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.features.some(feature => feature.toLowerCase().includes(query)) ||
      template.suitableFor.some(suitable => suitable.toLowerCase().includes(query))
    )
  }

  return filtered
})

const recommendedTemplates = computed(() => {
  // 推荐逻辑：选择几个热门模板
  return templates.value.filter(template => 
    ['modern', 'professional', 'creative'].includes(template.category)
  ).slice(0, 3)
})

// 方法
const selectTemplate = (template) => {
  selectedTemplate.value = template
  showTemplateDialog.value = true
}

const previewTemplate = () => {
  if (!selectedTemplate.value) return

  showFullPreview.value = true
}

const useTemplate = () => {
  if (!selectedTemplate.value) return

  try {
    // 应用模板到当前简历
    resumeStore.applyTemplate(selectedTemplate.value.id)
    ElMessage.success(`已应用 ${selectedTemplate.value.name} 模板`)
    
    // 关闭对话框并跳转到编辑器
    showTemplateDialog.value = false
    router.push('/')
  } catch (error) {
    console.error('应用模板失败:', error)
    ElMessage.error('应用模板失败，请重试')
  }
}

// 生命周期
onMounted(async () => {
  try {
    templates.value = getAllTemplates()
  } catch (error) {
    console.error('加载模板失败:', error)
    ElMessage.error('加载模板失败')
  }
})
</script>

<style scoped>
.templates-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 24px 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-description {
  color: #606266;
  margin: 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.page-content {
  flex: 1;
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  overflow: auto;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-box {
  flex: 1;
  max-width: 300px;
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.templates-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section {
  margin-bottom: 40px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.templates-grid.recommended {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-bottom: 40px;
}

.template-card {
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  position: relative;
}

.template-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.recommended-card {
  border-color: #f56c6c;
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f56c6c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  z-index: 2;
}

.template-preview {
  height: 200px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.template-preview .template-thumbnail {
  width: 100%;
  height: 100%;
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
  font-size: 13px;
  color: #606266;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.template-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.template-suitable {
  font-size: 12px;
  color: #909399;
}

.suitable-label {
  font-weight: 500;
}

.suitable-text {
  color: #606266;
}

/* 列表视图样式 */
.templates-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.template-list-item {
  display: flex;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.template-list-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.list-preview {
  width: 120px;
  height: 90px;
  flex-shrink: 0;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-preview .template-thumbnail {
  width: 100%;
  height: 100%;
}

.list-content {
  flex: 1;
  padding: 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.template-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

/* 对话框样式 */
.template-dialog-content {
  display: flex;
  gap: 24px;
}

.dialog-preview {
  flex: 1;
  max-width: 500px;
}

.preview-container {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-preview-container {
  width: 100%;
  height: 70vh;
  overflow: auto;
  background: #f8f9fa;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
}

.dialog-info {
  flex: 1;
}

.dialog-info h3 {
  font-size: 20px;
  color: #303133;
  margin: 0 0 12px 0;
}

.dialog-info p {
  color: #606266;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.dialog-features,
.dialog-suitable {
  margin-bottom: 20px;
}

.dialog-features h4,
.dialog-suitable h4 {
  font-size: 14px;
  color: #303133;
  margin: 0 0 8px 0;
}

.dialog-features ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.dialog-features li {
  margin-bottom: 4px;
}

.dialog-suitable p {
  margin: 0;
  color: #606266;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .page-content {
    padding: 16px 20px;
  }
  
  .filters-section {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .template-list-item {
    flex-direction: column;
  }
  
  .list-preview {
    width: 100%;
    height: 120px;
  }
  
  .template-dialog-content {
    flex-direction: column;
  }
  
  .dialog-preview {
    max-width: none;
  }
}

/* 对话框样式优化 */
.template-dialog :deep(.el-dialog) {
  border-radius: 12px;
}

.template-dialog :deep(.el-dialog__header) {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e4e7ed;
}

.template-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.fullscreen-preview-dialog :deep(.el-dialog) {
  border-radius: 12px;
}

.fullscreen-preview-dialog :deep(.el-dialog__body) {
  padding: 0;
}
</style>
