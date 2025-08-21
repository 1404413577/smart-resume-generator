<template>
  <div class="resumes-view">
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <el-icon><Folder /></el-icon>
            简历管理
          </h1>
          <p class="page-description">管理您的所有简历，创建、编辑、删除和导出</p>
        </div>
        <div class="header-actions">
          <el-button @click="createNewResume" type="primary" :icon="Plus">
            新建简历
          </el-button>
          <el-button @click="importResume" :icon="Upload">
            导入简历
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
            placeholder="搜索简历..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </div>
        <div class="filter-controls">
          <el-select v-model="sortBy" placeholder="排序方式" style="width: 120px">
            <el-option label="最近修改" value="updatedAt" />
            <el-option label="创建时间" value="createdAt" />
            <el-option label="名称" value="name" />
          </el-select>
          <el-select v-model="viewMode" placeholder="视图" style="width: 100px">
            <el-option label="网格" value="grid" />
            <el-option label="列表" value="list" />
          </el-select>
        </div>
      </div>

      <!-- 简历列表 -->
      <div class="resumes-container" :class="viewMode">
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>
        
        <div v-else-if="filteredResumes.length === 0" class="empty-state">
          <el-empty description="暂无简历">
            <el-button @click="createNewResume" type="primary">创建第一份简历</el-button>
          </el-empty>
        </div>

        <div v-else class="resumes-grid" v-if="viewMode === 'grid'">
          <div
            v-for="resume in filteredResumes"
            :key="resume.id"
            class="resume-card"
            @click="editResume(resume.id)"
          >
            <div class="card-header">
              <div class="resume-preview">
                <div class="preview-placeholder">
                  <el-icon><Document /></el-icon>
                </div>
              </div>
              <div class="card-actions">
                <el-dropdown trigger="click" @command="handleCommand">
                  <el-button size="small" text>
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{action: 'edit', id: resume.id}">
                        <el-icon><Edit /></el-icon>编辑
                      </el-dropdown-item>
                      <el-dropdown-item :command="{action: 'duplicate', id: resume.id}">
                        <el-icon><CopyDocument /></el-icon>复制
                      </el-dropdown-item>
                      <el-dropdown-item :command="{action: 'export', id: resume.id}">
                        <el-icon><Download /></el-icon>导出
                      </el-dropdown-item>
                      <el-dropdown-item :command="{action: 'delete', id: resume.id}" divided>
                        <el-icon><Delete /></el-icon>删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            
            <div class="card-content">
              <h3 class="resume-name">{{ resume.name || '未命名简历' }}</h3>
              <p class="resume-description">{{ resume.description || '暂无描述' }}</p>
              <div class="resume-meta">
                <span class="meta-item">
                  <el-icon><Clock /></el-icon>
                  {{ formatTime(resume.updatedAt) }}
                </span>
                <span class="meta-item">
                  <el-icon><User /></el-icon>
                  {{ resume.personalInfo?.name || '未填写' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 列表视图 -->
        <div v-else class="resumes-list">
          <el-table :data="filteredResumes" @row-click="editResume">
            <el-table-column prop="name" label="简历名称" min-width="200">
              <template #default="{ row }">
                <div class="list-name">
                  <el-icon><Document /></el-icon>
                  {{ row.name || '未命名简历' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="personalInfo.name" label="姓名" width="120" />
            <el-table-column prop="updatedAt" label="最后修改" width="150">
              <template #default="{ row }">
                {{ formatTime(row.updatedAt) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button @click.stop="editResume(row.id)" size="small" type="primary">
                  编辑
                </el-button>
                <el-button @click.stop="duplicateResume(row.id)" size="small">
                  复制
                </el-button>
                <el-button @click.stop="deleteResume(row.id)" size="small" type="danger">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Folder,
  Plus,
  Upload,
  Search,
  Document,
  MoreFilled,
  Edit,
  CopyDocument,
  Download,
  Delete,
  Clock,
  User
} from '@element-plus/icons-vue'
import { useResumeStore } from '@stores/resume'
import { generateOptimizedPDF } from '@utils/pdf/pdfGenerator'

const router = useRouter()
const resumeStore = useResumeStore()

// 响应式数据
const loading = ref(true)
const searchQuery = ref('')
const sortBy = ref('updatedAt')
const viewMode = ref('grid')

// 计算属性
const filteredResumes = computed(() => {
  let resumes = resumeStore.allResumes || []
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    resumes = resumes.filter(resume => 
      (resume.name || '').toLowerCase().includes(query) ||
      (resume.personalInfo?.name || '').toLowerCase().includes(query) ||
      (resume.description || '').toLowerCase().includes(query)
    )
  }
  
  // 排序
  resumes.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '')
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt)
      default: // updatedAt
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    }
  })
  
  return resumes
})

// 方法
const createNewResume = () => {
  const newResumeId = resumeStore.createNewResume()
  router.push(`/resume/${newResumeId}`)
}

const editResume = (resumeId) => {
  router.push(`/resume/${resumeId}`)
}

const importResume = () => {
  // TODO: 实现简历导入功能
  ElMessage.info('导入功能开发中...')
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const handleCommand = ({ action, id }) => {
  switch (action) {
    case 'edit':
      editResume(id)
      break
    case 'duplicate':
      duplicateResume(id)
      break
    case 'export':
      exportResume(id)
      break
    case 'delete':
      deleteResume(id)
      break
  }
}

const duplicateResume = (resumeId) => {
  const newId = resumeStore.duplicateResume(resumeId)
  ElMessage.success('简历已复制')
  router.push(`/resume/${newId}`)
}

const exportResume = async (resumeId) => {
  try {
    const resume = resumeStore.getResumeById(resumeId)
    await generateOptimizedPDF('resume-preview', `${resume.name || '简历'}.pdf`)
    ElMessage.success('简历导出成功')
  } catch (error) {
    ElMessage.error('导出失败，请重试')
  }
}

const deleteResume = async (resumeId) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这份简历吗？此操作不可恢复。',
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    resumeStore.deleteResume(resumeId)
    ElMessage.success('简历已删除')
  } catch {
    // 用户取消
  }
}

const formatTime = (time) => {
  if (!time) return '未知'
  const date = new Date(time)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
  return date.toLocaleDateString()
}

// 生命周期
onMounted(async () => {
  try {
    await resumeStore.loadAllResumes()
  } catch (error) {
    ElMessage.error('加载简历列表失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.resumes-view {
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
}

.resumes-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.loading-container {
  padding: 20px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.resumes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.resume-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.resume-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-placeholder {
  color: white;
  font-size: 32px;
  opacity: 0.8;
}

.card-actions {
  position: absolute;
  top: 8px;
  right: 8px;
}

.card-content {
  padding: 16px;
}

.resume-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resume-description {
  font-size: 13px;
  color: #606266;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resume-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.list-name {
  display: flex;
  align-items: center;
  gap: 8px;
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
  
  .resumes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
