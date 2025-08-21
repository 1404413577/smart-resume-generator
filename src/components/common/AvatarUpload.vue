<template>
  <div class="avatar-upload-container">
    <div class="avatar-section">
      <div class="avatar-preview" :class="{ 'has-avatar': hasAvatar }">
        <div v-if="!hasAvatar" class="avatar-placeholder" @click="triggerUpload">
          <el-icon class="upload-icon"><Plus /></el-icon>
          <span class="upload-text">上传头像</span>
          <span class="upload-hint">支持 JPG、PNG、GIF 格式<br>建议尺寸 200x200px，最大 2MB</span>
        </div>
        <div v-else class="avatar-display">
          <img :src="avatarUrl" alt="头像" class="avatar-image" />
          <div class="avatar-overlay">
            <el-button-group class="avatar-actions">
              <el-button size="small" type="primary" @click="triggerUpload">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click="removeAvatar">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>
      
      <!-- 头像位置选择 -->
      <div class="avatar-position-selector">
        <label class="position-label">头像位置：</label>
        <el-radio-group v-model="avatarPosition" @change="updatePosition" size="small">
          <el-radio-button label="left">左侧</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">右侧</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/gif"
      @change="handleFileSelect"
      style="display: none"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useResumeStore } from '../stores/resume'

const resumeStore = useResumeStore()
const fileInput = ref(null)

// 头像数据
const avatarUrl = computed(() => resumeStore.resumeData.personalInfo.avatar)
const avatarPosition = ref(resumeStore.resumeData.personalInfo.avatarPosition || 'left')
const hasAvatar = computed(() => !!avatarUrl.value)

// 文件限制
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

// 触发文件选择
const triggerUpload = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (!ALLOWED_TYPES.includes(file.type)) {
    ElMessage.error('请选择 JPG、PNG 或 GIF 格式的图片')
    return
  }

  // 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }

  // 读取文件并转换为base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64Data = e.target.result
    resumeStore.updateAvatar(base64Data)
    ElMessage.success('头像上传成功')
  }
  reader.onerror = () => {
    ElMessage.error('图片读取失败，请重试')
  }
  reader.readAsDataURL(file)

  // 清空input值，允许重复选择同一文件
  event.target.value = ''
}

// 更新头像位置
const updatePosition = (position) => {
  resumeStore.updateAvatarPosition(position)
}

// 删除头像
const removeAvatar = () => {
  ElMessageBox.confirm('确定要删除头像吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.removeAvatar()
    ElMessage.success('头像已删除')
  }).catch(() => {
    // 用户取消删除
  })
}

// 组件挂载时同步位置数据
onMounted(() => {
  avatarPosition.value = resumeStore.resumeData.personalInfo.avatarPosition || 'left'
})
</script>

<style scoped>
.avatar-upload-container {
  margin-bottom: 20px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed #d9d9d9;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.avatar-placeholder:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.upload-icon {
  font-size: 24px;
  color: #d9d9d9;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 11px;
  color: #999;
  text-align: center;
  line-height: 1.3;
}

.avatar-display {
  width: 100%;
  height: 100%;
  position: relative;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-display:hover .avatar-overlay {
  opacity: 1;
}

.avatar-actions {
  display: flex;
  gap: 8px;
}

.avatar-position-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.position-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .avatar-preview {
    width: 100px;
    height: 100px;
  }
  
  .avatar-position-selector {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
