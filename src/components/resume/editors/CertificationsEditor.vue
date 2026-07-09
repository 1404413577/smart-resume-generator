<template>
  <div class="certifications-editor">
    <div class="editor-header">
      <div class="header-content">
        <h4 class="section-title">证书获得</h4>
        <p class="section-description">
          填写已获得的证书、考试分数和获取日期，增强简历可信度。
        </p>
      </div>
      <div class="header-actions">
        <el-button @click="addNewCertification" type="primary" :icon="Plus">
          添加证书
        </el-button>
      </div>
    </div>

    <div v-if="certifications.length === 0" class="empty-state">
      <div class="empty-icon">📄</div>
      <h3>还没有证书</h3>
      <p>点击"添加证书"填写证书名称、分数和获取日期</p>
      <el-button @click="addNewCertification" type="primary" size="large">
        添加第一个证书
      </el-button>
    </div>

    <div v-else class="certifications-list">
      <div
        v-for="(certification, index) in certifications"
        :key="certification.id"
        class="certification-item"
      >
        <div class="certification-header">
          <div class="certification-title">
            <h5>证书 {{ index + 1 }}</h5>
            <div class="certification-status">
              <span v-if="certification.name && certification.date" class="completed-badge">已填写</span>
              <span v-else class="draft-badge">草稿</span>
            </div>
          </div>
          <div class="certification-actions">
            <el-button @click="removeCertification(certification.id)" size="small" type="danger" :icon="Delete">
              删除
            </el-button>
          </div>
        </div>

        <div class="certification-form">
          <el-form :model="certification" label-width="100px" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="证书名称" required>
                  <el-input
                    v-model="certification.name"
                    placeholder="如：英语四级、项目管理证书、云平台认证"
                    @input="updateCertification(certification.id, certification)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分数">
                  <el-input
                    v-model="certification.score"
                    placeholder="如：560、优秀、通过"
                    @input="updateCertification(certification.id, certification)"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="获取日期">
                  <el-date-picker
                    v-model="certification.date"
                    type="month"
                    placeholder="选择获取日期"
                    format="YYYY年MM月"
                    value-format="YYYY-MM"
                    @change="updateCertification(certification.id, certification)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="颁发机构">
                  <el-input
                    v-model="certification.issuer"
                    placeholder="如：考试机构、行业协会、认证平台"
                    @input="updateCertification(certification.id, certification)"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="证书链接">
              <el-input
                v-model="certification.url"
                placeholder="证书查询链接或在线凭证地址"
                @input="updateCertification(certification.id, certification)"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div v-if="certifications.length > 0" class="add-more-section">
      <el-button @click="addNewCertification" type="primary" :icon="Plus" size="large">
        添加更多证书
      </el-button>
    </div>

    <div class="tips-section">
      <h5 class="tips-title">填写建议</h5>
      <ul class="tips-list">
        <li>优先填写与目标岗位相关的证书</li>
        <li>考试类证书建议填写分数或等级</li>
        <li>证书名称保持真实完整名称</li>
        <li>获取日期用月份即可，避免占用简历空间</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useResumeStore } from '@stores/resume'

const emit = defineEmits(['data-updated'])
const resumeStore = useResumeStore()

const certifications = computed(() => resumeStore.resumeData.certifications)

const addNewCertification = () => {
  const newCertification = {
    name: '',
    score: '',
    date: '',
    issuer: '',
    url: ''
  }
  resumeStore.addCertification(newCertification)
  emit('data-updated', certifications.value)
  ElMessage.success('已添加新证书')
}

const updateCertification = (id, certification) => {
  resumeStore.updateCertification(id, certification)
  emit('data-updated', certifications.value)
}

const removeCertification = (id) => {
  ElMessageBox.confirm('确定要删除这个证书吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.removeCertification(id)
    emit('data-updated', certifications.value)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}
</script>

<style scoped>
.certifications-editor {
  padding: 0;
}

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

.certifications-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.certification-item {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.certification-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.certification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.certification-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.certification-title h5 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.certification-status {
  display: flex;
  align-items: center;
}

.completed-badge,
.draft-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
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

.certification-actions {
  display: flex;
  gap: 8px;
}

.certification-form {
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

:deep(.el-date-editor) {
  width: 100%;
}

.add-more-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px dashed #e4e7ed;
}

.tips-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
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

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .header-actions {
    justify-content: center;
  }

  .certification-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .certification-actions {
    justify-content: center;
  }
}
</style>
