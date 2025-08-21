<template>
  <div class="resume-manager">
    <el-dialog
      :model-value="visible"
      title="简历管理"
      width="800px"
      @update:model-value="$emit('update:visible', $event)"
      @close="$emit('close')"
    >
      <div class="manager-content">
        <!-- 保存当前简历 -->
        <div class="save-section">
          <h3>保存当前简历</h3>
          <el-form :model="saveForm" inline>
            <el-form-item label="简历名称">
              <el-input 
                v-model="saveForm.name" 
                placeholder="请输入简历名称"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                @click="saveCurrentResume"
                :disabled="!saveForm.name.trim()"
              >
                保存简历
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 已保存的简历列表 -->
        <div class="saved-resumes-section">
          <h3>已保存的简历 ({{ resumeStore.savedResumes.length }})</h3>
          
          <div v-if="resumeStore.savedResumes.length === 0" class="empty-state">
            <el-empty description="暂无保存的简历">
              <el-button type="primary" @click="saveCurrentResume" :disabled="!saveForm.name.trim()">
                保存第一份简历
              </el-button>
            </el-empty>
          </div>

          <div v-else class="resumes-list">
            <el-card 
              v-for="resume in resumeStore.savedResumes" 
              :key="resume.id"
              class="resume-card"
              shadow="hover"
            >
              <div class="resume-info">
                <div class="resume-header">
                  <h4 class="resume-name">{{ resume.name }}</h4>
                  <div class="resume-actions">
                    <el-button 
                      type="primary" 
                      size="small" 
                      @click="loadResume(resume.id)"
                    >
                      加载
                    </el-button>
                    <el-button 
                      type="success" 
                      size="small" 
                      @click="downloadResume(resume)"
                    >
                      下载
                    </el-button>
                    <el-button 
                      type="danger" 
                      size="small" 
                      @click="deleteResume(resume.id)"
                    >
                      删除
                    </el-button>
                  </div>
                </div>
                
                <div class="resume-meta">
                  <div class="meta-item">
                    <el-icon><User /></el-icon>
                    <span>{{ resume.data.personalInfo.name || '未填写姓名' }}</span>
                  </div>
                  <div class="meta-item">
                    <el-icon><Briefcase /></el-icon>
                    <span>{{ resume.data.workExperience.length }} 份工作经历</span>
                  </div>
                  <div class="meta-item">
                    <el-icon><School /></el-icon>
                    <span>{{ resume.data.education.length }} 个教育背景</span>
                  </div>
                  <div class="meta-item">
                    <el-icon><Document /></el-icon>
                    <span>模板：{{ getTemplateName(resume.template) }}</span>
                  </div>
                </div>
                
                <div class="resume-dates">
                  <span class="date-item">创建：{{ formatDate(resume.createdAt) }}</span>
                  <span class="date-item">更新：{{ formatDate(resume.updatedAt) }}</span>
                </div>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="data-management">
          <h3>数据管理</h3>
          <div class="management-actions">
            <el-button @click="exportAllData">
              <el-icon><Download /></el-icon>
              导出所有数据
            </el-button>
            <el-button @click="showImportDialog = true">
              <el-icon><Upload /></el-icon>
              导入数据
            </el-button>
            <el-button type="danger" @click="clearAllData">
              <el-icon><Delete /></el-icon>
              清空所有数据
            </el-button>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="$emit('close')">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导入数据对话框 -->
    <el-dialog
      v-model="showImportDialog"
      title="导入数据"
      width="500px"
    >
      <div class="import-section">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :show-file-list="false"
          accept=".json"
          :on-change="handleFileChange"
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon>
            选择JSON文件
          </el-button>
        </el-upload>
        
        <div v-if="importFile" class="file-info">
          <p>已选择文件：{{ importFile.name }}</p>
          <el-button type="success" @click="importData">确认导入</el-button>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showImportDialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useResumeStore } from '@stores/resume'
import { generatePDF } from '@utils/pdf/pdfGenerator'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const resumeStore = useResumeStore()

// 响应式数据
const saveForm = ref({
  name: ''
})

const showImportDialog = ref(false)
const importFile = ref(null)

// 模板名称映射
const templateNames = {
  modern: '现代风格',
  classic: '经典风格'
}

// 保存当前简历
const saveCurrentResume = () => {
  if (!saveForm.value.name.trim()) {
    ElMessage.warning('请输入简历名称')
    return
  }
  
  resumeStore.saveResume(saveForm.value.name.trim())
  saveForm.value.name = ''
  ElMessage.success('简历保存成功')
}

// 加载简历
const loadResume = (id) => {
  resumeStore.loadResume(id)
  ElMessage.success('简历加载成功')
  emit('close')
}

// 下载简历
const downloadResume = async (resume) => {
  try {
    // 临时加载简历数据
    const currentData = { ...resumeStore.resumeData }
    const currentTemplate = resumeStore.selectedTemplate
    
    resumeStore.loadResume(resume.id)
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 生成PDF
    await generatePDF('resume-preview', `${resume.name}.pdf`)
    
    // 恢复原始数据
    resumeStore.resumeData = currentData
    resumeStore.selectedTemplate = currentTemplate
    
    ElMessage.success('简历下载成功')
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败，请重试')
  }
}

// 删除简历
const deleteResume = (id) => {
  ElMessageBox.confirm('确定要删除这份简历吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.deleteResume(id)
    ElMessage.success('简历删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 导出所有数据
const exportAllData = () => {
  const data = {
    currentResume: resumeStore.resumeData,
    savedResumes: resumeStore.savedResumes,
    selectedTemplate: resumeStore.selectedTemplate,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `resume-data-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  ElMessage.success('数据导出成功')
}

// 处理文件选择
const handleFileChange = (file) => {
  importFile.value = file
}

// 导入数据
const importData = () => {
  if (!importFile.value) {
    ElMessage.warning('请选择文件')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      if (data.currentResume) {
        resumeStore.resumeData = data.currentResume
      }
      
      if (data.savedResumes) {
        resumeStore.savedResumes = data.savedResumes
        localStorage.setItem('savedResumes', JSON.stringify(data.savedResumes))
      }
      
      if (data.selectedTemplate) {
        resumeStore.selectedTemplate = data.selectedTemplate
      }
      
      resumeStore.saveToLocalStorage()
      
      showImportDialog.value = false
      importFile.value = null
      ElMessage.success('数据导入成功')
    } catch (error) {
      console.error('导入失败:', error)
      ElMessage.error('文件格式错误，导入失败')
    }
  }
  
  reader.readAsText(importFile.value.raw)
}

// 清空所有数据
const clearAllData = () => {
  ElMessageBox.confirm('确定要清空所有数据吗？此操作不可恢复！', '确认清空', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.resetResumeData()
    resumeStore.savedResumes = []
    localStorage.removeItem('savedResumes')
    ElMessage.success('所有数据已清空')
  }).catch(() => {
    // 用户取消操作
  })
}

// 获取模板名称
const getTemplateName = (templateId) => {
  return templateNames[templateId] || templateId
}

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>

<style scoped>
.resume-manager {
  width: 100%;
}

.manager-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.save-section,
.saved-resumes-section,
.data-management {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
}

.save-section h3,
.saved-resumes-section h3,
.data-management h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.resumes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 15px;
}

.resume-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.resume-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.resume-name {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
  font-size: 16px;
}

.resume-actions {
  display: flex;
  gap: 5px;
}

.resume-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.resume-dates {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  border-top: 1px solid #e4e7ed;
  padding-top: 10px;
}

.management-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.import-section {
  text-align: center;
  padding: 20px 0;
}

.file-info {
  margin-top: 15px;
  padding: 15px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #b3d8ff;
}

.file-info p {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-card__body) {
  padding: 15px;
}
</style>
