<template>
  <div class="education-editor">
    <div class="editor-header">
      <div class="header-content">
        <h4 class="section-title">教育背景</h4>
        <p class="section-description">
          填写您的教育经历，包括学校、专业、学位和时间等信息。
        </p>
      </div>
      <div class="header-actions">
        <el-button @click="addNewEducation" type="primary" :icon="Plus">
          添加教育背景
        </el-button>
      </div>
    </div>

    <div v-if="educations.length === 0" class="empty-state">
      <div class="empty-icon">🎓</div>
      <h3>还没有教育背景</h3>
      <p>点击"添加教育背景"开始填写您的教育经历</p>
      <el-button @click="addNewEducation" type="primary" size="large">
        添加第一个教育背景
      </el-button>
    </div>

    <div v-else class="education-list">
      <div
        v-for="(education, index) in educations"
        :key="education.id"
        class="education-item"
      >
        <div class="education-header">
          <div class="education-title">
            <h5>教育背景 {{ index + 1 }}</h5>
            <div class="education-status">
              <span v-if="education.current" class="current-badge">在读</span>
              <span v-else-if="education.endDate" class="completed-badge">已毕业</span>
              <span v-else class="draft-badge">草稿</span>
            </div>
          </div>
          <div class="education-actions">
            <el-button @click="removeEducation(education.id)" size="small" type="danger" :icon="Delete">
              删除
            </el-button>
          </div>
        </div>

        <div class="education-form">
          <el-form :model="education" label-width="100px" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="学校名称" required>
                  <el-input
                    v-model="education.school"
                    placeholder="如：北京大学"
                    @input="updateEducation(education.id, education)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专业名称" required>
                  <el-input
                    v-model="education.major"
                    placeholder="如：计算机科学与技术"
                    @input="updateEducation(education.id, education)"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="学位" required>
                  <el-select
                    v-model="education.degree"
                    placeholder="选择学位"
                    @change="updateEducation(education.id, education)"
                  >
                    <el-option label="高中" value="高中" />
                    <el-option label="专科" value="专科" />
                    <el-option label="本科" value="本科" />
                    <el-option label="硕士" value="硕士" />
                    <el-option label="博士" value="博士" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开始时间" required>
                  <el-date-picker
                    v-model="education.startDate"
                    type="month"
                    placeholder="选择开始时间"
                    format="YYYY年MM月"
                    value-format="YYYY-MM"
                    @change="updateEducation(education.id, education)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结束时间">
                  <el-date-picker
                    v-model="education.endDate"
                    type="month"
                    placeholder="选择结束时间"
                    format="YYYY年MM月"
                    value-format="YYYY-MM"
                    :disabled="education.current"
                    @change="updateEducation(education.id, education)"
                  />
                  <el-checkbox
                    v-model="education.current"
                    @change="handleCurrentChange(education)"
                    style="margin-top: 8px;"
                  >
                    目前在读
                  </el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="GPA/成绩">
                  <el-input
                    v-model="education.gpa"
                    placeholder="如：3.8/4.0 或 85/100"
                    @input="updateEducation(education.id, education)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="荣誉奖项">
                  <el-input
                    v-model="education.honors"
                    placeholder="如：优秀毕业生、奖学金等"
                    @input="updateEducation(education.id, education)"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="课程描述">
              <el-input
                v-model="education.description"
                type="textarea"
                :rows="3"
                placeholder="简要描述主要课程、研究方向或学习成果..."
                show-word-limit
                maxlength="300"
                @input="updateEducation(education.id, education)"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div v-if="educations.length > 0" class="add-more-section">
      <el-button @click="addNewEducation" type="primary" :icon="Plus" size="large">
        添加更多教育背景
      </el-button>
    </div>

    <div class="tips-section">
      <h5 class="tips-title">💡 填写建议</h5>
      <ul class="tips-list">
        <li>按时间倒序排列，最高学历放在前面</li>
        <li>学校名称要完整准确</li>
        <li>专业名称要与学位证书一致</li>
        <li>GPA建议在3.0以上时填写</li>
        <li>重要的荣誉奖项可以突出显示</li>
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
const educations = computed(() => resumeStore.resumeData.education)

// 添加新的教育背景
const addNewEducation = () => {
  const newEducation = {
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    honors: '',
    description: ''
  }
  resumeStore.addEducation(newEducation)
  emit('data-updated', educations.value)
  ElMessage.success('已添加新的教育背景')
}

// 更新教育背景
const updateEducation = (id, education) => {
  resumeStore.updateEducation(id, education)
  emit('data-updated', educations.value)
}

// 删除教育背景
const removeEducation = (id) => {
  ElMessageBox.confirm('确定要删除这个教育背景吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.removeEducation(id)
    emit('data-updated', educations.value)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理"目前在读"状态变化
const handleCurrentChange = (education) => {
  if (education.current) {
    education.endDate = ''
  }
  updateEducation(education.id, education)
}

</script>

<style scoped>
.education-editor {
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

/* 教育背景列表 */
.education-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.education-item {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.education-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

/* 教育背景头部 */
.education-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.education-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.education-title h5 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.education-status {
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

.education-actions {
  display: flex;
  gap: 8px;
}

/* 表单样式 */
.education-form {
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

:deep(.el-select) {
  width: 100%;
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

  .education-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .education-actions {
    justify-content: center;
  }
}
</style>
