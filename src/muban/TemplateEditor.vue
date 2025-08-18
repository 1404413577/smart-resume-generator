<template>
  <div class="template-editor">
    <div class="editor-layout">
      <!-- 工具栏 -->
      <div class="editor-toolbar">
        <div class="toolbar-left">
          <el-button @click="$emit('back')" :icon="ArrowLeft" size="small">
            返回模板选择
          </el-button>
          
          <div class="template-info">
            <span class="current-template">{{ currentTemplate?.name }}</span>
            <el-tag size="small" type="info">{{ currentTemplate?.category }}</el-tag>
          </div>
        </div>
        
        <div class="toolbar-right">
          <el-button @click="togglePreview" size="small" :icon="View">
            {{ showPreview ? '隐藏预览' : '显示预览' }}
          </el-button>
          
          <el-dropdown @command="handleExport">
            <el-button type="primary" size="small" :icon="Download">
              导出 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="pdf">导出为PDF</el-dropdown-item>
                <el-dropdown-item command="preview">预览PDF</el-dropdown-item>
                <el-dropdown-item command="json">导出数据</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 编辑区域 -->
      <div class="editor-content">
        <!-- 左侧编辑面板 -->
        <div class="edit-panel" v-show="!showPreview || !isMobile">
          <div class="panel-header">
            <h3>编辑简历内容</h3>
            <el-button @click="resetToDefault" size="small" type="warning" plain>
              重置为默认
            </el-button>
          </div>
          
          <div class="edit-sections">
            <!-- 个人信息编辑 -->
            <div class="edit-section">
              <h4 class="section-title">
                <el-icon><User /></el-icon>
                个人信息
              </h4>
              <div class="form-grid">
                <el-form-item label="姓名">
                  <el-input v-model="editableData.personalInfo.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="职位">
                  <el-input v-model="editableData.personalInfo.title" placeholder="请输入目标职位" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="editableData.personalInfo.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="电话">
                  <el-input v-model="editableData.personalInfo.phone" placeholder="请输入电话" />
                </el-form-item>
                <el-form-item label="地址">
                  <el-input v-model="editableData.personalInfo.address" placeholder="请输入地址" />
                </el-form-item>
                <el-form-item label="网站">
                  <el-input v-model="editableData.personalInfo.website" placeholder="个人网站或作品集" />
                </el-form-item>
              </div>
            </div>

            <!-- 个人简介编辑 -->
            <div class="edit-section">
              <h4 class="section-title">
                <el-icon><Document /></el-icon>
                个人简介
              </h4>
              <el-input
                v-model="editableData.summary"
                type="textarea"
                :rows="4"
                placeholder="请输入个人简介，突出您的核心优势和职业目标..."
              />
            </div>

            <!-- 工作经历编辑 -->
            <div class="edit-section">
              <h4 class="section-title">
                <el-icon><Briefcase /></el-icon>
                工作经历
                <el-button @click="addWorkExperience" size="small" type="primary" plain>
                  添加经历
                </el-button>
              </h4>
              
              <div class="experience-list">
                <div
                  v-for="(work, index) in editableData.workExperience"
                  :key="work.id || index"
                  class="experience-item"
                >
                  <div class="item-header">
                    <span class="item-index">{{ index + 1 }}</span>
                    <el-button
                      @click="removeWorkExperience(index)"
                      size="small"
                      type="danger"
                      text
                      :icon="Delete"
                    />
                  </div>
                  
                  <div class="form-grid">
                    <el-form-item label="职位">
                      <el-input v-model="work.jobTitle" placeholder="职位名称" />
                    </el-form-item>
                    <el-form-item label="公司">
                      <el-input v-model="work.company" placeholder="公司名称" />
                    </el-form-item>
                    <el-form-item label="开始时间">
                      <el-input v-model="work.startDate" placeholder="2020-01" />
                    </el-form-item>
                    <el-form-item label="结束时间">
                      <el-input v-model="work.endDate" placeholder="2023-12" />
                    </el-form-item>
                    <el-form-item label="工作地点">
                      <el-input v-model="work.location" placeholder="工作地点" />
                    </el-form-item>
                  </div>
                  
                  <el-form-item label="工作职责">
                    <div class="responsibilities-editor">
                      <div
                        v-for="(resp, respIndex) in work.responsibilities"
                        :key="respIndex"
                        class="responsibility-item"
                      >
                        <el-input
                          v-model="work.responsibilities[respIndex]"
                          placeholder="描述您的工作职责和成就..."
                        />
                        <el-button
                          @click="work.responsibilities.splice(respIndex, 1)"
                          size="small"
                          type="danger"
                          text
                          :icon="Delete"
                        />
                      </div>
                      <el-button
                        @click="work.responsibilities.push('')"
                        size="small"
                        type="primary"
                        plain
                      >
                        添加职责
                      </el-button>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>

            <!-- 技能特长编辑 -->
            <div class="edit-section">
              <h4 class="section-title">
                <el-icon><Star /></el-icon>
                技能特长
                <el-button @click="addSkill" size="small" type="primary" plain>
                  添加技能
                </el-button>
              </h4>
              
              <div class="skills-editor">
                <div
                  v-for="(skill, index) in editableData.skills"
                  :key="skill.id || index"
                  class="skill-item"
                >
                  <el-input
                    v-model="skill.name"
                    placeholder="技能名称"
                    class="skill-name-input"
                  />
                  <el-select v-model="skill.level" placeholder="熟练度" class="skill-level-select">
                    <el-option label="初级" value="初级" />
                    <el-option label="中级" value="中级" />
                    <el-option label="高级" value="高级" />
                    <el-option label="专家" value="专家" />
                  </el-select>
                  <el-button
                    @click="removeSkill(index)"
                    size="small"
                    type="danger"
                    text
                    :icon="Delete"
                  />
                </div>
              </div>
            </div>

            <!-- 教育背景编辑 -->
            <div class="edit-section">
              <h4 class="section-title">
                <el-icon><School /></el-icon>
                教育背景
                <el-button @click="addEducation" size="small" type="primary" plain>
                  添加教育
                </el-button>
              </h4>
              
              <div class="education-list">
                <div
                  v-for="(edu, index) in editableData.education"
                  :key="edu.id || index"
                  class="education-item"
                >
                  <div class="item-header">
                    <span class="item-index">{{ index + 1 }}</span>
                    <el-button
                      @click="removeEducation(index)"
                      size="small"
                      type="danger"
                      text
                      :icon="Delete"
                    />
                  </div>
                  
                  <div class="form-grid">
                    <el-form-item label="学校">
                      <el-input v-model="edu.school" placeholder="学校名称" />
                    </el-form-item>
                    <el-form-item label="专业">
                      <el-input v-model="edu.major" placeholder="专业名称" />
                    </el-form-item>
                    <el-form-item label="学历">
                      <el-select v-model="edu.degree" placeholder="选择学历">
                        <el-option label="高中" value="高中" />
                        <el-option label="大专" value="大专" />
                        <el-option label="本科" value="本科" />
                        <el-option label="硕士" value="硕士" />
                        <el-option label="博士" value="博士" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="毕业时间">
                      <el-input v-model="edu.graduationDate" placeholder="2023-06" />
                    </el-form-item>
                    <el-form-item label="GPA">
                      <el-input v-model="edu.gpa" placeholder="3.8" />
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧预览面板 -->
        <div class="preview-panel" v-show="showPreview">
          <div class="panel-header">
            <h3>实时预览</h3>
            <div class="preview-actions">
              <el-button @click="refreshPreview" size="small" :icon="Refresh">
                刷新
              </el-button>
              <el-button @click="fitToWidth" size="small" :icon="FullScreen">
                适应宽度
              </el-button>
            </div>
          </div>
          
          <div class="preview-container" ref="previewContainer">
            <div class="preview-wrapper" :style="previewStyle">
              <component
                :is="templateComponent"
                :resume-data="editableData"
                :template-id="currentTemplate?.id"
                ref="templateRef"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PDF预览对话框 -->
    <el-dialog
      v-model="showPDFPreview"
      title="PDF预览"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="pdf-preview-container">
        <iframe
          v-if="pdfPreviewUrl"
          :src="pdfPreviewUrl"
          width="100%"
          height="600px"
          frameborder="0"
        ></iframe>
      </div>
      <template #footer>
        <el-button @click="showPDFPreview = false">关闭</el-button>
        <el-button type="primary" @click="downloadPDF">下载PDF</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  View,
  Download,
  ArrowDown,
  User,
  Document,
  Briefcase,
  Star,
  School,
  Delete,
  Refresh,
  FullScreen
} from '@element-plus/icons-vue'
import { exportToPDF, previewPDF, optimizeForPDF } from './pdfExport.js'
import { useResumeStore } from '../stores/resume'

const props = defineProps({
  currentTemplate: {
    type: Object,
    required: true
  },
  resumeData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back', 'data-updated'])

const resumeStore = useResumeStore()

// 响应式数据
const showPreview = ref(true)
const isMobile = ref(false)
const editableData = ref({})
const templateComponent = ref(null)
const templateRef = ref(null)
const previewContainer = ref(null)
const previewScale = ref(1)
const showPDFPreview = ref(false)
const pdfPreviewUrl = ref('')

// 计算属性
const previewStyle = computed(() => ({
  transform: `scale(${previewScale.value})`,
  transformOrigin: 'top left',
  width: `${100 / previewScale.value}%`
}))

// 方法
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const refreshPreview = () => {
  // 强制重新渲染预览
  nextTick(() => {
    if (templateRef.value) {
      templateRef.value.$forceUpdate()
    }
  })
}

const fitToWidth = () => {
  if (previewContainer.value) {
    const containerWidth = previewContainer.value.clientWidth
    const contentWidth = 800 // 假设内容宽度为800px
    previewScale.value = Math.min(1, containerWidth / contentWidth)
  }
}

const addWorkExperience = () => {
  editableData.value.workExperience.push({
    id: Date.now(),
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    location: '',
    responsibilities: ['']
  })
}

const removeWorkExperience = (index) => {
  editableData.value.workExperience.splice(index, 1)
}

const addSkill = () => {
  editableData.value.skills.push({
    id: Date.now(),
    name: '',
    level: '中级'
  })
}

const removeSkill = (index) => {
  editableData.value.skills.splice(index, 1)
}

const addEducation = () => {
  editableData.value.education.push({
    id: Date.now(),
    school: '',
    major: '',
    degree: '',
    graduationDate: '',
    gpa: ''
  })
}

const removeEducation = (index) => {
  editableData.value.education.splice(index, 1)
}

const resetToDefault = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置为默认数据吗？这将清除所有当前编辑的内容。',
      '确认重置',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 重置为原始数据
    editableData.value = JSON.parse(JSON.stringify(props.resumeData))
    ElMessage.success('已重置为默认数据')
  } catch {
    // 用户取消
  }
}

const handleExport = async (command) => {
  if (!templateRef.value) {
    ElMessage.error('模板未加载完成，请稍后重试')
    return
  }

  try {
    switch (command) {
      case 'pdf':
        await exportPDF()
        break
      case 'preview':
        await previewPDFHandler()
        break
      case 'json':
        exportJSON()
        break
    }
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error(error.message || '导出失败，请重试')
  }
}

const exportPDF = async () => {
  const element = templateRef.value.$el
  const restore = optimizeForPDF(element)
  
  try {
    await exportToPDF(element, {
      filename: `${editableData.value.personalInfo?.name || 'resume'}_${props.currentTemplate.name}.pdf`
    })
    ElMessage.success('PDF导出成功！')
  } finally {
    restore()
  }
}

const previewPDFHandler = async () => {
  const element = templateRef.value.$el
  const restore = optimizeForPDF(element)
  
  try {
    const pdfBlob = await previewPDF(element)
    pdfPreviewUrl.value = URL.createObjectURL(pdfBlob)
    showPDFPreview.value = true
  } finally {
    restore()
  }
}

const downloadPDF = async () => {
  if (pdfPreviewUrl.value) {
    const link = document.createElement('a')
    link.href = pdfPreviewUrl.value
    link.download = `${editableData.value.personalInfo?.name || 'resume'}_${props.currentTemplate.name}.pdf`
    link.click()
  }
}

const exportJSON = () => {
  const dataStr = JSON.stringify(editableData.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `resume_data_${Date.now()}.json`
  link.click()
  
  URL.revokeObjectURL(url)
  ElMessage.success('数据导出成功！')
}

// 监听数据变化
watch(editableData, (newData) => {
  emit('data-updated', newData)
}, { deep: true })

// 生命周期
onMounted(async () => {
  // 初始化数据
  editableData.value = JSON.parse(JSON.stringify(props.resumeData))
  
  // 动态加载模板组件
  try {
    const module = await props.currentTemplate.component()
    templateComponent.value = module.default
  } catch (error) {
    console.error('模板加载失败:', error)
    ElMessage.error('模板加载失败')
  }
  
  // 检测移动设备
  isMobile.value = window.innerWidth < 768
  
  // 初始化预览缩放
  nextTick(() => {
    fitToWidth()
  })
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
    fitToWidth()
  })
})
</script>

<style scoped>
.template-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.editor-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.template-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-template {
  font-weight: 600;
  color: #1f2937;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.edit-panel {
  width: 400px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-panel {
  flex: 1;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.edit-sections {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.edit-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 15px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-grid .el-form-item {
  margin-bottom: 0;
}

.experience-list, .education-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.experience-item, .education-item {
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.item-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
}

.responsibilities-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.responsibility-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.responsibility-item .el-input {
  flex: 1;
}

.skills-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.skill-name-input {
  flex: 2;
}

.skill-level-select {
  flex: 1;
}

.preview-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #e5e7eb;
}

.preview-wrapper {
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  margin: 0 auto;
  max-width: 800px;
}

.pdf-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .edit-panel {
    width: 350px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .editor-content {
    flex-direction: column;
  }

  .edit-panel {
    width: 100%;
    height: 50vh;
  }

  .preview-panel {
    height: 50vh;
  }

  .toolbar-left, .toolbar-right {
    flex-wrap: wrap;
    gap: 8px;
  }

  .template-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

/* 滚动条样式 */
.edit-sections::-webkit-scrollbar,
.preview-container::-webkit-scrollbar {
  width: 6px;
}

.edit-sections::-webkit-scrollbar-track,
.preview-container::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.edit-sections::-webkit-scrollbar-thumb,
.preview-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.edit-sections::-webkit-scrollbar-thumb:hover,
.preview-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
