<template>
  <div class="multipage-controls" v-if="isMultiPage">
    <!-- 页面导航 -->
    <div class="page-navigation">
      <div class="nav-info">
        <span class="page-indicator">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
        </span>
        <div class="page-stats">
          <el-tooltip content="查看页面统计信息">
            <el-button 
              size="small" 
              text 
              @click="showPageStats = !showPageStats"
              :icon="InfoFilled"
            />
          </el-tooltip>
        </div>
      </div>
      
      <div class="nav-buttons">
        <el-button-group>
          <el-button 
            size="small" 
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
            :icon="ArrowLeft"
          >
            上一页
          </el-button>
          <el-button 
            size="small" 
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
            :icon="ArrowRight"
          >
            下一页
          </el-button>
        </el-button-group>
        
        <el-button 
          size="small" 
          @click="showAllPages = !showAllPages"
          :type="showAllPages ? 'primary' : 'default'"
        >
          {{ showAllPages ? '单页视图' : '全部页面' }}
        </el-button>
      </div>
    </div>

    <!-- 页面统计信息 -->
    <el-collapse-transition>
      <div v-show="showPageStats" class="page-stats-panel">
        <div class="stats-header">
          <h4>页面分布统计</h4>
          <el-button 
            size="small" 
            text 
            @click="showPageStats = false"
            :icon="Close"
          />
        </div>
        
        <div class="stats-content">
          <div 
            v-for="(page, index) in pageStats" 
            :key="index"
            class="page-stat-item"
            :class="{ active: currentPage === page.pageNumber }"
            @click="goToPage(page.pageNumber)"
          >
            <div class="page-number">第{{ page.pageNumber }}页</div>
            <div class="page-sections">
              <el-tag 
                v-for="section in page.sections" 
                :key="section"
                size="small"
                class="section-tag"
              >
                {{ getSectionName(section) }}
              </el-tag>
            </div>
            <div class="page-info">
              {{ page.sectionCount }}个章节
              <span v-if="page.estimatedHeight" class="height-info">
                (约{{ Math.round(page.estimatedHeight) }}px)
              </span>
            </div>
          </div>
        </div>
        
        <!-- 分页建议 -->
        <div v-if="contentAnalysis" class="paging-suggestions">
          <div class="suggestion-header">
            <el-icon><Lightbulb /></el-icon>
            <span>分页建议</span>
          </div>
          <div class="suggestion-content">
            <p>{{ contentAnalysis.recommendation }}</p>
            <div v-if="contentAnalysis.isOverflowing" class="suggestion-actions">
              <el-button 
                size="small" 
                type="primary" 
                @click="applySuggestedPaging"
              >
                应用建议 ({{ contentAnalysis.suggestedPages }}页)
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>

    <!-- 快速页面跳转 -->
    <div class="quick-navigation" v-if="totalPages > 2">
      <span class="quick-nav-label">快速跳转：</span>
      <div class="page-thumbnails">
        <div 
          v-for="page in totalPages" 
          :key="page"
          class="page-thumbnail"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          <div class="thumbnail-number">{{ page }}</div>
          <div class="thumbnail-preview">
            <div class="preview-sections">
              <div 
                v-for="section in getPageSections(page)" 
                :key="section"
                class="preview-section"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
  InfoFilled,
  Close,
  Lightbulb
} from '@element-plus/icons-vue'

const props = defineProps({
  pageManager: {
    type: Object,
    required: true
  },
  currentPage: {
    type: Number,
    default: 1
  },
  showAllPages: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['page-changed', 'view-mode-changed', 'apply-suggested-paging'])

// 响应式数据
const showPageStats = ref(false)
const localCurrentPage = ref(props.currentPage)
const localShowAllPages = ref(props.showAllPages)

// 计算属性
const isMultiPage = computed(() => {
  return props.pageManager && props.pageManager.totalPages.value > 1
})

const totalPages = computed(() => {
  return props.pageManager?.totalPages.value || 1
})

const pageStats = computed(() => {
  return props.pageManager?.getPageStats().pages || []
})

const contentAnalysis = computed(() => {
  return props.pageManager?.analyzeContentOverflow() || null
})

// 监听外部变化
watch(() => props.currentPage, (newPage) => {
  localCurrentPage.value = newPage
})

watch(() => props.showAllPages, (newMode) => {
  localShowAllPages.value = newMode
})

// 监听本地变化并发出事件
watch(localCurrentPage, (newPage) => {
  emit('page-changed', newPage)
})

watch(localShowAllPages, (newMode) => {
  emit('view-mode-changed', newMode)
})

// 方法
const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    localCurrentPage.value = pageNumber
  }
}

const getSectionName = (sectionKey) => {
  const sectionNames = {
    personalInfo: '个人信息',
    summary: '个人简介',
    workExperience: '工作经历',
    projects: '项目经历',
    education: '教育背景',
    skills: '技能特长',
    certifications: '证书认证',
    languages: '语言能力'
  }
  return sectionNames[sectionKey] || sectionKey
}

const getPageSections = (pageNumber) => {
  const page = pageStats.value.find(p => p.pageNumber === pageNumber)
  return page?.sections || []
}

const applySuggestedPaging = () => {
  emit('apply-suggested-paging', contentAnalysis.value)
  ElMessage.success('已应用分页建议')
}
</script>

<style scoped>
.multipage-controls {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.page-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.nav-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-indicator {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 页面统计面板 */
.page-stats-panel {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 16px;
  margin-top: 12px;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stats-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-stat-item {
  padding: 12px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-stat-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.page-stat-item.active {
  border-color: #409eff;
  background: #f0f9ff;
}

.page-number {
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 8px;
}

.page-sections {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.section-tag {
  font-size: 11px;
}

.page-info {
  font-size: 12px;
  color: #909399;
}

.height-info {
  color: #c0c4cc;
}

/* 分页建议 */
.paging-suggestions {
  margin-top: 16px;
  padding: 12px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 6px;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #d46b08;
}

.suggestion-content p {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #8c4a00;
}

.suggestion-actions {
  text-align: center;
}

/* 快速导航 */
.quick-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
}

.quick-nav-label {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.page-thumbnails {
  display: flex;
  gap: 8px;
  flex: 1;
  overflow-x: auto;
}

.page-thumbnail {
  flex-shrink: 0;
  width: 60px;
  height: 80px;
  border: 2px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #ffffff;
  position: relative;
}

.page-thumbnail:hover {
  border-color: #409eff;
  transform: translateY(-2px);
}

.page-thumbnail.active {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.thumbnail-number {
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #409eff;
  background: #f0f9ff;
  padding: 2px 4px;
  border-radius: 2px;
}

.thumbnail-preview {
  padding: 16px 4px 4px 4px;
  height: 100%;
}

.preview-sections {
  display: flex;
  flex-direction: column;
  gap: 2px;
  height: 100%;
}

.preview-section {
  height: 8px;
  background: #e4e7ed;
  border-radius: 1px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-navigation {
    flex-direction: column;
    gap: 12px;
  }
  
  .quick-navigation {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .page-thumbnails {
    width: 100%;
  }
}
</style>
