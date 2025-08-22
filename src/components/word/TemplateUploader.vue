<template>
  <div class="template-uploader">
    <el-card class="uploader-card">
      <template #header>
        <div class="card-header">
          <span>Word模板上传</span>
          <el-button 
            type="text" 
            @click="showVariablesDoc = !showVariablesDoc"
            :icon="showVariablesDoc ? 'ArrowUp' : 'ArrowDown'"
          >
            {{ showVariablesDoc ? '隐藏' : '查看' }}变量说明
          </el-button>
        </div>
      </template>

      <!-- 变量说明文档 -->
      <el-collapse-transition>
        <div v-show="showVariablesDoc" class="variables-doc">
          <el-alert
            title="模板变量使用说明"
            type="info"
            :closable="false"
            show-icon
          >
            <p>在Word模板中使用以下变量格式，系统会自动填充对应的简历数据：</p>
          </el-alert>
          
          <div class="doc-sections">
            <div class="doc-section">
              <h4>个人信息</h4>
              <div class="variables">
                <code>{{name}}</code> - 姓名
                <code>{{email}}</code> - 邮箱
                <code>{{phone}}</code> - 电话
                <code>{{targetPosition}}</code> - 目标职位
              </div>
            </div>
            
            <div class="doc-section">
              <h4>工作经历（循环）</h4>
              <div class="variables">
                <pre v-text="workExperienceTemplate"></pre>
              </div>
            </div>

            <div class="doc-section">
              <h4>教育背景（循环）</h4>
              <div class="variables">
                <pre v-text="educationTemplate"></pre>
              </div>
            </div>

            <div class="doc-section">
              <h4>技能特长（循环）</h4>
              <div class="variables">
                <pre v-text="skillsTemplate"></pre>
              </div>
            </div>

            <div class="doc-section">
              <h4>项目经历（循环）</h4>
              <div class="variables">
                <pre v-text="projectsTemplate"></pre>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>

      <!-- 文件上传区域 -->
      <div class="upload-area">
        <el-upload
          ref="uploadRef"
          class="template-upload"
          drag
          :auto-upload="false"
          :show-file-list="true"
          :limit="1"
          accept=".docx"
          :before-upload="beforeUpload"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将Word模板文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传.docx格式文件，且不超过10MB
            </div>
          </template>
        </el-upload>
      </div>

      <!-- 操作按钮 -->
      <div class="actions" v-if="templateFile">
        <el-button 
          type="primary" 
          @click="handleExport"
          :loading="isExporting"
          :icon="Document"
        >
          使用模板导出
        </el-button>
        <el-button @click="handleClear">
          清除模板
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, UploadFilled } from '@element-plus/icons-vue'
import { validateTemplateFile, fillWordTemplate } from '@utils/word/templateExport'
import { useResumeStore } from '@stores/resume'

// 模板示例文本
const workExperienceTemplate = `{{#workExperience}}
{{position}} | {{company}}
{{startDate}} - {{endDate}}
{{description}}
{{/workExperience}}`

const educationTemplate = `{{#education}}
{{degree}} | {{school}}
{{major}} | {{startDate}} - {{endDate}}
{{/education}}`

const skillsTemplate = `{{#skills}}
{{name}} - {{level}}
{{/skills}}`

const projectsTemplate = `{{#projects}}
{{name}} | {{role}}
{{description}}
技术栈：{{technologiesText}}
{{/projects}}`

const emit = defineEmits(['export-success', 'export-error'])

const resumeStore = useResumeStore()
const uploadRef = ref()
const templateFile = ref(null)
const isExporting = ref(false)
const showVariablesDoc = ref(false)

const beforeUpload = (file) => {
  if (!validateTemplateFile(file)) {
    ElMessage.error('请上传有效的.docx格式文件（不超过10MB）')
    return false
  }
  return true
}

const handleFileChange = (file) => {
  if (file.status === 'ready') {
    templateFile.value = file.raw
    ElMessage.success('模板文件上传成功')
  }
}

const handleFileRemove = () => {
  templateFile.value = null
}

const handleClear = () => {
  uploadRef.value.clearFiles()
  templateFile.value = null
  ElMessage.info('已清除模板文件')
}

const handleExport = async () => {
  if (!templateFile.value) {
    ElMessage.warning('请先上传Word模板文件')
    return
  }

  try {
    isExporting.value = true
    
    // 使用模板填充数据
    const blob = await fillWordTemplate(templateFile.value, resumeStore.resumeData)
    
    // 生成文件名
    const name = resumeStore.resumeData.personalInfo?.name?.trim()
    const filename = `${name || '简历'}-模板版.docx`
    
    // 下载文件
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    ElMessage.success('模板导出成功！')
    emit('export-success', { filename, blob })
  } catch (error) {
    console.error('模板导出失败:', error)
    ElMessage.error(`模板导出失败: ${error.message}`)
    emit('export-error', error)
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped>
.template-uploader {
  width: 100%;
}

.uploader-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.variables-doc {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.doc-sections {
  margin-top: 15px;
}

.doc-section {
  margin-bottom: 20px;
}

.doc-section h4 {
  margin: 0 0 10px 0;
  color: #409eff;
  font-size: 14px;
}

.variables {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.variables code {
  background: #e7f3ff;
  color: #409eff;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  white-space: nowrap;
}

.variables pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  margin: 0;
  white-space: pre-wrap;
  flex: 1;
  min-width: 200px;
}

.upload-area {
  margin: 20px 0;
}

.template-upload {
  width: 100%;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-upload-dragger) {
  width: 100%;
}
</style>
