<template>
  <div class="resume-builder">
    <el-row :gutter="32" class="builder-row">
      <!-- 左侧编辑区域 -->
      <el-col :span="resumeStore.isPreviewMode ? 0 : 10" class="edit-section">
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
      <el-col :span="resumeStore.isPreviewMode ? 24 : 14" class="preview-section">
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

              <!-- 模板设置 -->
              <el-dropdown v-if="resumeStore.selectedTemplate === 'classic'" trigger="click">
                <el-button size="small">
                  <el-icon><Setting /></el-icon>
                  模板设置
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <div class="template-setting-item">
                        <span>标题对齐:</span>
                        <el-radio-group
                          :model-value="resumeStore.templateSettings.sectionTitleAlignment"
                          @update:model-value="updateTitleAlignment"
                          size="small"
                        >
                          <el-radio value="left">居左</el-radio>
                          <el-radio value="center">居中</el-radio>
                        </el-radio-group>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <!-- 章节排序 -->
              <el-button size="small" @click="showSectionOrder = true">
                <el-icon><Sort /></el-icon>
                章节排序
              </el-button>

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

    <!-- 章节排序对话框 -->
    <el-dialog
      v-model="showSectionOrder"
      title="章节排序"
      width="500px"
      :before-close="handleSectionOrderClose"
    >
      <SectionOrderManager />
      <template #footer>
        <el-button @click="showSectionOrder = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
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

// 导入章节排序组件
import SectionOrderManager from './SectionOrderManager.vue'

const resumeStore = useResumeStore()

// 章节排序对话框状态
const showSectionOrder = ref(false)

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

// 更新标题对齐方式
const updateTitleAlignment = (alignment) => {
  resumeStore.updateTemplateSetting('sectionTitleAlignment', alignment)
}

// 关闭章节排序对话框
const handleSectionOrderClose = () => {
  showSectionOrder.value = false
}
</script>

<style scoped>
.resume-builder {
  width: 100%;
  max-width: 100%;
}

.builder-row {
  margin: 0 !important;
  width: 100%;
}

.edit-section {
  padding: 0 !important;
}

.preview-section {
  padding: 0 !important;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
}

.section-card {
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: none;
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
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
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: fit-content;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 16px;
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
  padding: 32px;
  min-height: 800px;
  background: white;
}

.template-setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  min-width: 200px;
}

.template-setting-item span {
  font-weight: 600;
  color: #2c3e50;
  min-width: 60px;
}

/* 大屏幕优化 */
@media (min-width: 1400px) {
  .form-container {
    gap: 28px;
  }

  .section-card {
    margin-bottom: 28px;
  }

  .preview-header {
    padding: 28px 32px;
  }

  .resume-preview {
    padding: 40px;
  }
}

/* 中等屏幕优化 */
@media (max-width: 1200px) {
  .builder-row {
    --el-row-gutter: 24px;
  }

  .preview-header {
    padding: 20px 24px;
  }

  .resume-preview {
    padding: 24px;
  }
}

/* 平板设备优化 */
@media (max-width: 768px) {
  .builder-row {
    --el-row-gutter: 16px;
  }

  .form-container {
    gap: 16px;
  }

  .section-card {
    margin-bottom: 16px;
    border-radius: 12px;
  }

  .preview-container {
    border-radius: 12px;
  }

  .preview-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
    padding: 16px 20px;
  }

  .preview-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .resume-preview {
    padding: 20px;
  }
}

/* 手机设备优化 */
@media (max-width: 480px) {
  .form-container {
    gap: 12px;
  }

  .section-card {
    margin-bottom: 12px;
    border-radius: 8px;
  }

  .preview-container {
    border-radius: 8px;
  }

  .preview-header {
    padding: 12px 16px;
  }

  .resume-preview {
    padding: 16px;
  }
}
</style>
