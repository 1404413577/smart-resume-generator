<template>
  <div class="work-experience-form">
    <div class="form-header">
      <el-button type="primary" @click="addNewExperience">
        <el-icon><Plus /></el-icon>
        添加工作经历
      </el-button>
    </div>

    <div v-if="workExperiences.length === 0" class="empty-state">
      <el-empty description="暂无工作经历">
        <el-button type="primary" @click="addNewExperience">添加第一份工作经历</el-button>
      </el-empty>
    </div>

    <div v-else class="experience-list">
      <el-card 
        v-for="(experience, index) in workExperiences" 
        :key="experience.id"
        class="experience-card"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <span class="experience-title">工作经历 {{ index + 1 }}</span>
            <el-button 
              type="danger" 
              size="small" 
              text
              @click="removeExperience(experience.id)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </template>

        <el-form :model="experience" label-width="80px" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="职位名称" required>
                <el-input 
                  v-model="experience.jobTitle" 
                  placeholder="如：前端开发工程师"
                  @input="updateExperience(experience.id, experience)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司名称" required>
                <el-input 
                  v-model="experience.company" 
                  placeholder="如：阿里巴巴集团"
                  @input="updateExperience(experience.id, experience)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="工作地点">
                <el-input 
                  v-model="experience.location" 
                  placeholder="如：北京"
                  @input="updateExperience(experience.id, experience)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开始时间" required>
                <el-date-picker
                  v-model="experience.startDate"
                  type="month"
                  placeholder="选择开始时间"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  @change="updateExperience(experience.id, experience)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="experience.endDate"
                  type="month"
                  placeholder="选择结束时间"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  :disabled="experience.current"
                  @change="updateExperience(experience.id, experience)"
                />
                <el-checkbox 
                  v-model="experience.current" 
                  @change="handleCurrentChange(experience)"
                  style="margin-top: 8px;"
                >
                  目前在职
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="工作职责">
            <div class="responsibilities-section">
              <div 
                v-for="(responsibility, respIndex) in experience.responsibilities" 
                :key="respIndex"
                class="responsibility-item"
              >
                <el-input
                  v-model="experience.responsibilities[respIndex]"
                  placeholder="描述您的工作职责和成就"
                  @input="updateExperience(experience.id, experience)"
                >
                  <template #suffix>
                    <el-button 
                      type="danger" 
                      text 
                      size="small"
                      @click="removeResponsibility(experience, respIndex)"
                    >
                      <el-icon><Close /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>
              <el-button 
                type="primary" 
                text 
                @click="addResponsibility(experience)"
                class="add-responsibility-btn"
              >
                <el-icon><Plus /></el-icon>
                添加职责描述
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useResumeStore } from '../../stores/resume'

const resumeStore = useResumeStore()

// 直接使用store中的数据，确保响应式
const workExperiences = computed(() => resumeStore.resumeData.workExperience)

// 添加新的工作经历
const addNewExperience = () => {
  const newExperience = {
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    responsibilities: ['']
  }
  resumeStore.addWorkExperience(newExperience)
}

// 更新工作经历
const updateExperience = (id, experience) => {
  resumeStore.updateWorkExperience(id, experience)
}

// 删除工作经历
const removeExperience = (id) => {
  ElMessageBox.confirm('确定要删除这条工作经历吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.removeWorkExperience(id)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理"目前在职"状态变化
const handleCurrentChange = (experience) => {
  if (experience.current) {
    experience.endDate = ''
  }
  updateExperience(experience.id, experience)
}

// 添加职责描述
const addResponsibility = (experience) => {
  experience.responsibilities.push('')
  updateExperience(experience.id, experience)
}

// 删除职责描述
const removeResponsibility = (experience, index) => {
  if (experience.responsibilities.length > 1) {
    experience.responsibilities.splice(index, 1)
    updateExperience(experience.id, experience)
  } else {
    ElMessage.warning('至少保留一条职责描述')
  }
}

// 数据现在通过computed自动同步，无需手动处理
</script>

<style scoped>
.work-experience-form {
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

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.experience-card {
  border-radius: 12px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

.experience-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.experience-title {
  font-weight: 600;
  color: #2c3e50;
}

.responsibilities-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.responsibility-item {
  display: flex;
  align-items: center;
}

.add-responsibility-btn {
  align-self: flex-start;
  margin-top: 5px;
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

:deep(.el-date-editor) {
  width: 100%;
}
</style>
