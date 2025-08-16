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

      <!-- 自定义字段分隔线 -->
      <el-divider v-if="personalInfo.customFields && personalInfo.customFields.length > 0">
        <span class="divider-text">自定义字段</span>
      </el-divider>

      <!-- 自定义字段列表 -->
      <div v-if="personalInfo.customFields && personalInfo.customFields.length > 0" class="custom-fields-section">
        <div
          v-for="(field, index) in personalInfo.customFields"
          :key="field.id"
          class="custom-field-item"
        >
          <el-row :gutter="20" class="custom-field-row">
            <el-col :span="10">
              <el-form-item :label="`字段名称 ${index + 1}`">
                <el-input
                  v-model="field.name"
                  placeholder="如：微信号、QQ号等"
                  @input="updateCustomField(field.id, { name: field.name })"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="`字段值 ${index + 1}`">
                <el-input
                  v-model="field.value"
                  placeholder="请输入对应的值"
                  @input="updateCustomField(field.id, { value: field.value })"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="操作">
                <div class="field-actions">
                  <el-button
                    size="small"
                    type="primary"
                    text
                    @click="moveField(field.id, 'up')"
                    :disabled="index === 0"
                    title="上移"
                  >
                    <el-icon><ArrowUp /></el-icon>
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    text
                    @click="moveField(field.id, 'down')"
                    :disabled="index === personalInfo.customFields.length - 1"
                    title="下移"
                  >
                    <el-icon><ArrowDown /></el-icon>
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    text
                    @click="removeField(field.id)"
                    title="删除"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 添加自定义字段按钮 -->
      <div class="add-custom-field-section">
        <el-button
          type="primary"
          :icon="Plus"
          @click="showAddFieldDialog = true"
          class="add-field-btn"
        >
          添加自定义字段
        </el-button>
      </div>
    </el-form>

    <!-- 添加自定义字段对话框 -->
    <el-dialog
      v-model="showAddFieldDialog"
      title="添加自定义字段"
      width="500px"
      @close="resetAddFieldForm"
    >
      <el-form :model="newFieldForm" label-width="80px" label-position="top">
        <el-form-item label="字段名称" required>
          <el-input
            v-model="newFieldForm.name"
            placeholder="如：微信号、QQ号、个人博客等"
            maxlength="20"
            show-word-limit
          />
          <div class="quick-field-options">
            <span class="quick-option-label">常用字段：</span>
            <el-button
              v-for="option in commonFieldOptions"
              :key="option"
              size="small"
              text
              type="primary"
              @click="newFieldForm.name = option"
            >
              {{ option }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="字段值">
          <el-input
            v-model="newFieldForm.value"
            placeholder="请输入对应的值（可稍后填写）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddFieldDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="addField"
            :disabled="!newFieldForm.name.trim()"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, ArrowUp, ArrowDown, Delete } from '@element-plus/icons-vue'
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
  github: '',
  customFields: []
})

// 添加字段对话框相关
const showAddFieldDialog = ref(false)
const newFieldForm = ref({
  name: '',
  value: ''
})

// 常用字段选项
const commonFieldOptions = [
  '微信号', 'QQ号', '个人博客', '作品集',
  '知乎', '掘金', 'CSDN', '简书',
  'Behance', 'Dribbble', 'Instagram', 'Twitter'
]

// 更新store中的数据
const updateInfo = () => {
  resumeStore.updatePersonalInfo(personalInfo.value)
}

// 自定义字段操作
const addField = () => {
  if (!newFieldForm.value.name.trim()) {
    ElMessage.warning('请输入字段名称')
    return
  }

  resumeStore.addCustomField(newFieldForm.value.name.trim(), newFieldForm.value.value.trim())
  syncData()
  showAddFieldDialog.value = false
  resetAddFieldForm()
  ElMessage.success('自定义字段添加成功')
}

const updateCustomField = (id, updates) => {
  resumeStore.updateCustomField(id, updates)
}

const removeField = (id) => {
  ElMessageBox.confirm('确定要删除这个自定义字段吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.removeCustomField(id)
    syncData()
    ElMessage.success('字段删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

const moveField = (id, direction) => {
  resumeStore.moveCustomField(id, direction)
  syncData()
}

const resetAddFieldForm = () => {
  newFieldForm.value = {
    name: '',
    value: ''
  }
}

// 同步数据
const syncData = () => {
  personalInfo.value = { ...resumeStore.resumeData.personalInfo }
}

// 组件挂载时同步数据
onMounted(() => {
  syncData()
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

/* 自定义字段样式 */
.divider-text {
  color: #409eff;
  font-weight: 600;
  font-size: 14px;
}

.custom-fields-section {
  margin: 20px 0;
}

.custom-field-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.custom-field-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.custom-field-row {
  align-items: flex-end;
}

.field-actions {
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  height: 32px;
}

.add-custom-field-section {
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.add-custom-field-section:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.add-field-btn {
  border-radius: 20px;
  padding: 10px 20px;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-divider__text) {
  background: white;
  padding: 0 15px;
}

.quick-field-options {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.quick-option-label {
  font-size: 12px;
  color: #666;
  margin-right: 8px;
  font-weight: 600;
}

.quick-field-options .el-button {
  margin: 2px 4px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-field-row {
    flex-direction: column;
  }

  .field-actions {
    justify-content: flex-start;
    margin-top: 10px;
  }
}
</style>
