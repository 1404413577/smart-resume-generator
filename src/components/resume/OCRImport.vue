<template>
  <el-dialog
    v-model="visible"
    title="图片识别导入简历"
    width="600px"
    :close-on-click-modal="false"
  >
    <div class="ocr-import-container">
      <el-upload
        v-if="!processing"
        class="ocr-upload"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        accept="image/*"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将简历照片/截图拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 JPG/PNG 格式，识别过程可能需要 10-20 秒
          </div>
        </template>
      </el-upload>

      <div v-else class="processing-state">
        <el-skeleton :rows="5" animated />
        <p class="status-text">{{ statusText }}</p>
      </div>

      <div v-if="resultData && !processing" class="result-preview">
        <h4>识别结果预览</h4>
        <div class="preview-card">
          <p><strong>姓名:</strong> {{ resultData.personalInfo?.name }}</p>
          <p><strong>意向:</strong> {{ resultData.personalInfo?.targetPosition }}</p>
          <p><strong>内容概览:</strong> 已提取 {{ resultData.workExperience?.length }} 段经历, {{ resultData.skills?.length }} 项技能</p>
        </div>
        <el-alert
          title="提示"
          type="warning"
          description="AI 识别可能存在偏差，确认后将覆盖当前简历中对应的模块。"
          show-icon
          :closable="false"
        />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="processing"
          :disabled="!resultData"
          @click="confirmImport"
        >
          确认导入
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ocrService } from '@/utils/ai/ocrService'
import { useResumeStore } from '@/stores/resume'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['imported'])
const resumeStore = useResumeStore()

const visible = ref(false)
const processing = ref(false)
const statusText = ref('')
const resultData = ref(null)

const handleFileChange = async (file) => {
  if (!file.raw) return
  
  processing.value = true
  resultData.value = null
  
  try {
    statusText.value = '正在提取图像文字...'
    const text = await ocrService.recognize(file.raw)
    
    statusText.value = 'AI 正在解析简历结构...'
    const parsedData = await ocrService.convertToResumeData(text)
    
    resultData.value = parsedData
    ElMessage.success('识别完成，请核对信息')
  } catch (error) {
    console.error('OCR Error:', error)
    ElMessage.error(error.message || '识别失败，请检查网络或换一张更清晰的图片')
  } finally {
    processing.value = false
    statusText.value = ''
  }
}

const confirmImport = () => {
  if (!resultData.value) return
  
  // 智能合并：保留头像等无法 OCR 的内容，覆盖结构化信息
  const currentData = resumeStore.resumeData
  resumeStore.resumeData = {
    ...currentData,
    ...resultData.value,
    personalInfo: {
      ...currentData.personalInfo,
      ...resultData.value.personalInfo
    }
  }
  
  ElMessage.success('简历导入成功')
  visible.value = false
  emit('imported')
}

const show = () => {
  visible.value = true
  resultData.value = null
}

defineExpose({ show })
</script>

<style scoped>
.ocr-import-container {
  min-height: 200px;
}

.processing-state {
  text-align: center;
  padding: 20px;
}

.status-text {
  margin-top: 20px;
  color: #409eff;
  font-weight: bold;
}

.result-preview {
  margin-top: 20px;
}

.preview-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
}

.preview-card p {
  margin: 5px 0;
}
</style>
