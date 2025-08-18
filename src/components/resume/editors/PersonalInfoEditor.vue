<template>
  <div class="personal-info-editor">
    <div class="editor-section">
      <h4 class="section-title">基本信息</h4>
      <div class="form-grid">
        <el-form-item label="姓名">
          <el-input v-model="personalInfo.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="personalInfo.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="personalInfo.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="personalInfo.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="网站">
          <el-input v-model="personalInfo.website" placeholder="请输入个人网站" />
        </el-form-item>
        <el-form-item label="LinkedIn">
          <el-input v-model="personalInfo.linkedin" placeholder="请输入LinkedIn链接" />
        </el-form-item>
      </div>
    </div>

    <div class="editor-section">
      <h4 class="section-title">职业目标</h4>
      <el-form-item label="期望职位">
        <el-input v-model="personalInfo.targetPosition" placeholder="请输入期望职位" />
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useResumeStore } from '../../../stores/resume'

const emit = defineEmits(['data-updated'])
const resumeStore = useResumeStore()

// 个人信息数据
const personalInfo = ref({
  name: resumeStore.resumeData.personalInfo?.name || '',
  email: resumeStore.resumeData.personalInfo?.email || '',
  phone: resumeStore.resumeData.personalInfo?.phone || '',
  address: resumeStore.resumeData.personalInfo?.address || '',
  website: resumeStore.resumeData.personalInfo?.website || '',
  linkedin: resumeStore.resumeData.personalInfo?.linkedin || '',
  targetPosition: resumeStore.resumeData.personalInfo?.targetPosition || ''
})

// 监听数据变化并更新store
watch(personalInfo, (newValue) => {
  resumeStore.updatePersonalInfo(newValue)
  emit('data-updated', newValue)
}, { deep: true })
</script>

<style scoped>
.personal-info-editor {
  padding: 0;
}

.editor-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
