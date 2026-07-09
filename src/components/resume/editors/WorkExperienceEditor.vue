<template>
  <div class="work-experience-editor">
    <div class="editor-header">
      <div class="header-content">
        <h4 class="section-title">工作经历</h4>
        <p class="section-description">
          详细描述您的工作经历，包括职位、公司、工作时间和主要职责。
        </p>
      </div>
      <div class="header-actions">
        <el-button @click="addNewExperience" type="primary" :icon="Plus">
          添加工作经历
        </el-button>
      </div>
    </div>

    <div v-if="workExperiences.length === 0" class="empty-state">
      <div class="empty-icon">💼</div>
      <h3>还没有工作经历</h3>
      <p>点击"添加工作经历"开始填写您的工作经验</p>
      <el-button @click="addNewExperience" type="primary" size="large">
        添加第一份工作经历
      </el-button>
    </div>

    <div v-else class="experience-list">
      <div
        v-for="(experience, index) in workExperiences"
        :key="experience.id"
        class="experience-item"
      >
        <div class="experience-header">
          <div class="experience-title">
            <h5>工作经历 {{ index + 1 }}</h5>
            <div class="experience-status">
              <span v-if="experience.current" class="current-badge">目前在职</span>
              <span v-else-if="experience.endDate" class="completed-badge">已离职</span>
              <span v-else class="draft-badge">草稿</span>
            </div>
          </div>
          <div class="experience-actions">
            <el-button @click="removeExperience(experience.id)" size="small" type="danger" :icon="Delete">
              删除
            </el-button>
          </div>
        </div>

        <div class="experience-form">
          <el-form :model="experience" label-width="100px" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="职位名称" required>
                  <el-input
                    v-model="experience.position"
                    placeholder="如：前端开发工程师"
                    @input="updateExperience(experience.id, experience)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司名称" required>
                  <el-input
                    v-model="experience.company"
                    placeholder="如：某互联网公司"
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
                    format="YYYY年MM月"
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
                    format="YYYY年MM月"
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

            <el-form-item label="工作描述">
              <el-input
                v-model="experience.description"
                type="textarea"
                :rows="4"
                placeholder="简要描述您在这个职位的主要工作内容和职责..."
                show-word-limit
                maxlength="500"
                @input="updateExperience(experience.id, experience)"
              />
            </el-form-item>

            <el-form-item label="主要成就">
              <div class="achievements-section">
                <div
                  v-for="(achievement, achIndex) in experience.achievements || []"
                  :key="achIndex"
                  class="achievement-item"
                >
                  <el-input
                    v-model="experience.achievements[achIndex]"
                    placeholder="描述一项具体的工作成就或项目经验..."
                    @input="updateExperience(experience.id, experience)"
                  />
                  <el-button
                    @click="removeAchievement(experience, achIndex)"
                    size="small"
                    type="danger"
                    :icon="Delete"
                    circle
                  />
                </div>
                <el-button
                  @click="addAchievement(experience)"
                  size="small"
                  type="primary"
                  :icon="Plus"
                  style="margin-top: 8px;"
                >
                  添加成就
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div v-if="workExperiences.length > 0" class="add-more-section">
      <el-button @click="addNewExperience" type="primary" :icon="Plus" size="large">
        添加更多工作经历
      </el-button>
    </div>

    <div class="tips-section">
      <h5 class="tips-title">💡 填写建议</h5>
      <ul class="tips-list">
        <li>按时间倒序排列，最近的工作经历放在前面</li>
        <li>职位名称要准确，与招聘要求匹配</li>
        <li>工作描述要具体，突出关键技能和成果</li>
        <li>用数据说话，如"提升效率30%"、"管理团队10人"</li>
        <li>重点描述与目标职位相关的经验</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useResumeStore } from '@stores/resume'

const emit = defineEmits(['data-updated'])
const resumeStore = useResumeStore()

// 计算属性
const workExperiences = computed(() => resumeStore.resumeData.workExperience)

// 添加新的工作经历
const addNewExperience = () => {
  const newExperience = {
    position: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: []
  }
  resumeStore.addWorkExperience(newExperience)
  emit('data-updated', workExperiences.value)
  ElMessage.success('已添加新的工作经历')
}

// 更新工作经历
const updateExperience = (id, experience) => {
  resumeStore.updateWorkExperience(id, experience)
  emit('data-updated', workExperiences.value)
}

// 删除工作经历
const removeExperience = (id) => {
  ElMessageBox.confirm('确定要删除这条工作经历吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.removeWorkExperience(id)
    emit('data-updated', workExperiences.value)
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

// 添加成就
const addAchievement = (experience) => {
  if (!experience.achievements) {
    experience.achievements = []
  }
  experience.achievements.push('')
  updateExperience(experience.id, experience)
}

// 删除成就
const removeAchievement = (experience, index) => {
  if (experience.achievements && experience.achievements.length > index) {
    experience.achievements.splice(index, 1)
    updateExperience(experience.id, experience)
  }
}

</script>

<style scoped>
.work-experience-editor {
  padding: 0;
}

/* 编辑器头部 */
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.header-content .section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.header-content .section-description {
  font-size: 14px;
  color: #606266;
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #fafbfc;
  border-radius: 8px;
  border: 2px dashed #e4e7ed;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: #303133;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #606266;
  margin: 0 0 24px 0;
}

/* 工作经历列表 */
.experience-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.experience-item {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.experience-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

/* 工作经历头部 */
.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.experience-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.experience-title h5 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.experience-status {
  display: flex;
  align-items: center;
}

.current-badge,
.completed-badge,
.draft-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.current-badge {
  background: #f0f9ff;
  color: #409eff;
  border: 1px solid #409eff;
}

.completed-badge {
  background: #f0f9f0;
  color: #67c23a;
  border: 1px solid #67c23a;
}

.draft-badge {
  background: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #e6a23c;
}

.experience-actions {
  display: flex;
  gap: 8px;
}

/* 表单样式 */
.experience-form {
  margin-top: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
  font-family: inherit;
  line-height: 1.6;
}

:deep(.el-date-editor) {
  width: 100%;
}

/* 成就部分 */
.achievements-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.achievement-item .el-input {
  flex: 1;
}

/* 添加更多部分 */
.add-more-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px dashed #e4e7ed;
}

/* 提示部分 */
.tips-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  margin: 0 0 12px 0;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.tips-list li {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .header-actions {
    justify-content: center;
  }

  .experience-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .experience-actions {
    justify-content: center;
  }

  .achievement-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}
</style>
