<template>
  <div class="resume-builder">
    <el-row :gutter="20">
      <!-- 左侧编辑区域 -->
      <el-col :span="resumeStore.isPreviewMode ? 0 : 12" class="edit-section">
        <div v-show="!resumeStore.isPreviewMode" class="form-container">
          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <el-icon><User /></el-icon>
                <span>个人信息</span>
              </div>
            </template>
            <PersonalInfoForm />
          </el-card>

          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <el-icon><Document /></el-icon>
                <span>个人简介</span>
              </div>
            </template>
            <SummaryForm />
          </el-card>

          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <el-icon><Briefcase /></el-icon>
                <span>工作经历</span>
              </div>
            </template>
            <WorkExperienceForm />
          </el-card>

          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <el-icon><School /></el-icon>
                <span>教育背景</span>
              </div>
            </template>
            <EducationForm />
          </el-card>

          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <el-icon><Star /></el-icon>
                <span>技能特长</span>
              </div>
            </template>
            <SkillsForm />
          </el-card>

          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <el-icon><Folder /></el-icon>
                <span>项目经历</span>
              </div>
            </template>
            <ProjectsForm />
          </el-card>
        </div>
      </el-col>

      <!-- 右侧预览区域 -->
      <el-col :span="resumeStore.isPreviewMode ? 24 : 12" class="preview-section">
        <div class="preview-container">
          <div class="preview-header">
            <h3>简历预览</h3>
            <div class="preview-actions">
              <el-button-group>
                <el-button 
                  v-for="template in templates" 
                  :key="template.id"
                  :type="resumeStore.selectedTemplate === template.id ? 'primary' : 'default'"
                  size="small"
                  @click="resumeStore.setTemplate(template.id)"
                >
                  {{ template.name }}
                </el-button>
              </el-button-group>
              <el-button type="success" @click="downloadPDF">
                <el-icon><Download /></el-icon>
                下载PDF
              </el-button>
            </div>
          </div>
          
          <div class="resume-preview" id="resume-preview">
            <component 
              :is="currentTemplate" 
              :resume-data="resumeStore.resumeData"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '../stores/resume'
import { generatePDF } from '../utils/pdfGenerator'

// 导入表单组件
import PersonalInfoForm from './forms/PersonalInfoForm.vue'
import SummaryForm from './forms/SummaryForm.vue'
import WorkExperienceForm from './forms/WorkExperienceForm.vue'
import EducationForm from './forms/EducationForm.vue'
import SkillsForm from './forms/SkillsForm.vue'
import ProjectsForm from './forms/ProjectsForm.vue'

// 导入模板组件
import ModernTemplate from './templates/ModernTemplate.vue'
import ClassicTemplate from './templates/ClassicTemplate.vue'
import MinimalTemplate from './templates/MinimalTemplate.vue'

const resumeStore = useResumeStore()

// 可用模板
const templates = [
  { id: 'modern', name: '现代风格' },
  { id: 'classic', name: '经典风格' },
  { id: 'minimal', name: '简约风格' }
]

// 当前选中的模板组件
const currentTemplate = computed(() => {
  const templateMap = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate
  }
  return templateMap[resumeStore.selectedTemplate] || ModernTemplate
})

// 下载PDF
const downloadPDF = async () => {
  try {
    await generatePDF('resume-preview', `${resumeStore.resumeData.personalInfo.name || '简历'}.pdf`)
    ElMessage.success('PDF下载成功！')
  } catch (error) {
    console.error('PDF生成失败:', error)
    ElMessage.error('PDF生成失败，请重试')
  }
}
</script>

<style scoped>
.resume-builder {
  width: 100%;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.preview-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.preview-header h3 {
  margin: 0;
  color: #2c3e50;
}

.preview-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.resume-preview {
  padding: 20px;
  min-height: 800px;
  background: white;
}

@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .preview-actions {
    justify-content: center;
  }
}
</style>
