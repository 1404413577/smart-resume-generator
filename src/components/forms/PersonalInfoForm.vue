<template>
  <div class="personal-info-form">
    <el-form :model="personalInfo" label-width="80px" label-position="top">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" required>
            <el-input 
              v-model="personalInfo.name" 
              placeholder="请输入您的姓名"
              @input="updateInfo"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" required>
            <el-input 
              v-model="personalInfo.email" 
              placeholder="请输入邮箱地址"
              type="email"
              @input="updateInfo"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="电话" required>
            <el-input 
              v-model="personalInfo.phone" 
              placeholder="请输入手机号码"
              @input="updateInfo"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址">
            <el-input 
              v-model="personalInfo.address" 
              placeholder="请输入居住地址"
              @input="updateInfo"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="个人网站">
            <el-input 
              v-model="personalInfo.website" 
              placeholder="https://yourwebsite.com"
              @input="updateInfo"
            >
              <template #prefix>
                <el-icon><Link /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="LinkedIn">
            <el-input 
              v-model="personalInfo.linkedin" 
              placeholder="LinkedIn个人资料链接"
              @input="updateInfo"
            >
              <template #prefix>
                <el-icon><Link /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="GitHub">
            <el-input 
              v-model="personalInfo.github" 
              placeholder="GitHub个人资料链接"
              @input="updateInfo"
            >
              <template #prefix>
                <el-icon><Link /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useResumeStore } from '../../stores/resume'

const resumeStore = useResumeStore()

// 本地响应式数据
const personalInfo = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  linkedin: '',
  github: ''
})

// 更新store中的数据
const updateInfo = () => {
  resumeStore.updatePersonalInfo(personalInfo.value)
}

// 组件挂载时同步数据
onMounted(() => {
  personalInfo.value = { ...resumeStore.resumeData.personalInfo }
})
</script>

<style scoped>
.personal-info-form {
  padding: 10px 0;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  width: 100%;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
</style>
