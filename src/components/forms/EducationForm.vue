<template>
  <div class="education-form">
    <div class="form-header">
      <el-button type="primary" @click="addNewEducation">
        <el-icon><Plus /></el-icon>
        添加教育经历
      </el-button>
    </div>

    <div v-if="educations.length === 0" class="empty-state">
      <el-empty description="暂无教育经历">
        <el-button type="primary" @click="addNewEducation">添加教育经历</el-button>
      </el-empty>
    </div>

    <div v-else class="education-list">
      <el-card 
        v-for="(education, index) in educations" 
        :key="education.id"
        class="education-card"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <span class="education-title">教育经历 {{ index + 1 }}</span>
            <el-button 
              type="danger" 
              size="small" 
              text
              @click="removeEducation(education.id)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </template>

        <el-form :model="education" label-width="80px" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="学位/学历" required>
                <el-select 
                  v-model="education.degree" 
                  placeholder="请选择学位"
                  @change="updateEducation(education.id, education)"
                  style="width: 100%"
                >
                  <el-option label="博士" value="博士" />
                  <el-option label="硕士" value="硕士" />
                  <el-option label="学士" value="学士" />
                  <el-option label="大专" value="大专" />
                  <el-option label="高中" value="高中" />
                  <el-option label="中专" value="中专" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专业" required>
                <el-input 
                  v-model="education.major" 
                  placeholder="如：计算机科学与技术"
                  @input="updateEducation(education.id, education)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="学校名称" required>
                <el-input 
                  v-model="education.institution" 
                  placeholder="如：清华大学"
                  @input="updateEducation(education.id, education)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学校地点">
                <el-input 
                  v-model="education.location" 
                  placeholder="如：北京"
                  @input="updateEducation(education.id, education)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="入学时间">
                <el-date-picker
                  v-model="education.startDate"
                  type="month"
                  placeholder="选择入学时间"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  @change="updateEducation(education.id, education)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="毕业时间" required>
                <el-date-picker
                  v-model="education.graduationDate"
                  type="month"
                  placeholder="选择毕业时间"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  @change="updateEducation(education.id, education)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="GPA/成绩">
                <el-input 
                  v-model="education.gpa" 
                  placeholder="如：3.8/4.0"
                  @input="updateEducation(education.id, education)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="荣誉奖项">
                <el-input 
                  v-model="education.honors" 
                  type="textarea"
                  :rows="2"
                  placeholder="如：优秀毕业生、奖学金获得者等"
                  @input="updateEducation(education.id, education)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="相关课程">
                <el-input 
                  v-model="education.relevantCourses" 
                  type="textarea"
                  :rows="2"
                  placeholder="列出与目标职位相关的主要课程，用逗号分隔"
                  @input="updateEducation(education.id, education)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useResumeStore } from '../../stores/resume'

const resumeStore = useResumeStore()

// 本地响应式数据
const educations = ref([])

// 添加新的教育经历
const addNewEducation = () => {
  const newEducation = {
    degree: '',
    major: '',
    institution: '',
    location: '',
    startDate: '',
    graduationDate: '',
    gpa: '',
    honors: '',
    relevantCourses: ''
  }
  resumeStore.addEducation(newEducation)
  syncData()
}

// 更新教育经历
const updateEducation = (id, education) => {
  resumeStore.updateEducation(id, education)
}

// 删除教育经历
const removeEducation = (id) => {
  ElMessageBox.confirm('确定要删除这条教育经历吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.removeEducation(id)
    syncData()
    ElMessage.success('删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 同步数据
const syncData = () => {
  educations.value = [...resumeStore.resumeData.education]
}

// 组件挂载时同步数据
onMounted(() => {
  syncData()
})
</script>

<style scoped>
.education-form {
  padding: 10px 0;
}

.form-header {
  margin-bottom: 20px;
  text-align: right;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.education-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.education-card {
  border-radius: 12px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

.education-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.education-title {
  font-weight: 600;
  color: #2c3e50;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #409eff;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

:deep(.el-textarea__inner:hover) {
  border-color: #409eff;
}

:deep(.el-textarea__inner:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
</style>
