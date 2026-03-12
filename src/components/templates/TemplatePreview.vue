<template>
  <div class="template-preview-wrap" :style="wrapStyle">
    <div class="scale-container" :style="scaleContainerStyle">
      <component
        v-if="template?.component"
        :is="template.component"
        :resume-data="sampleResumeData"
        :template-id="template.id"
        :config="template.config || {}"
        class="template-inner"
      />
      <div v-else class="preview-placeholder">
        <el-icon><Document /></el-icon>
        <span>{{ template?.name || '预览' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Document } from '@element-plus/icons-vue'

const props = defineProps({
  template: {
    type: Object,
    required: true
  },
  width: {
    type: Number,
    default: 220 // 卡片宽度 px
  }
})

// A4 尺寸（96dpi，1mm ≈ 3.7795px）
const A4_W_PX = 794   // 210mm in px
const A4_H_PX = 1123  // 297mm in px

// 根据卡片宽度动态计算缩放比例
const scale = computed(() => props.width / A4_W_PX)

// 缩放后的实际高度
const scaledHeight = computed(() => Math.round(A4_H_PX * scale.value))

// 外层容器：固定宽高，overflow hidden 裁掉底部
const wrapStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${scaledHeight.value}px`,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e5e7eb'
}))

// 缩放容器：真实 A4 尺寸，transform 缩放到卡片大小
const scaleContainerStyle = computed(() => ({
  width: `${A4_W_PX}px`,
  height: `${A4_H_PX}px`,
  transformOrigin: 'top left',
  transform: `scale(${scale.value})`,
  position: 'absolute',
  top: '0',
  left: '0',
  pointerEvents: 'none'
}))

// 示例数据 —— 为预览提供真实内容
const sampleResumeData = {
  personalInfo: {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    address: '北京市朝阳区',
    targetPosition: '前端工程师',
    avatar: ''
  },
  summary: '具有3年前端开发经验的工程师，熟练掌握Vue.js、React等现代前端框架，具备良好的团队协作能力和学习能力。',
  workExperience: [
    {
      id: '1',
      position: '前端工程师',
      company: '某科技公司',
      location: '北京',
      startDate: '2021-06',
      endDate: '2024-01',
      current: false,
      description: '负责公司核心产品的前端开发工作，推动组件库建设和性能优化。',
      achievements: ['重构用户管理系统，性能提升50%', '参与移动端应用开发，获用户好评']
    }
  ],
  education: [
    {
      id: '1',
      school: '某大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2017-09',
      endDate: '2021-06',
      current: false,
      gpa: '3.8',
      honors: '优秀毕业生',
      description: '主修计算机相关课程，成绩优异'
    }
  ],
  skills: [
    { id: '1', name: 'Vue.js', level: '高级', category: 'technical' },
    { id: '2', name: 'JavaScript', level: '高级', category: 'technical' },
    { id: '3', name: 'React', level: '中级', category: 'technical' },
    { id: '4', name: 'TypeScript', level: '中级', category: 'technical' }
  ],
  projects: [
    {
      id: '1',
      name: '企业管理系统',
      description: '基于Vue.js开发的企业内部管理系统，包含用户管理、权限控制等功能。',
      technologies: ['Vue.js', 'Element Plus', 'Node.js'],
      url: 'https://example.com',
      startDate: '2023-01',
      endDate: '2023-06',
      highlights: ['使用Vue 3重构前端架构', '实现动态权限控制系统']
    }
  ],
  certifications: [
    { id: '1', name: 'Vue.js认证开发者', issuer: 'Vue.js官方', date: '2023-03' }
  ],
  languages: [
    { id: '1', name: '中文', level: '母语' },
    { id: '2', name: '英语', level: 'CET-6' }
  ],
  customModulesData: {}
}
</script>

<style scoped>
.template-preview-wrap {
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;
}

.template-preview-wrap:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.scale-container {
  user-select: none;
}

.template-inner {
  width: 100%;
  background: white;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f8f9fa;
  color: #909399;
  font-size: 14px;
}

.preview-placeholder :deep(.el-icon) {
  font-size: 32px;
}
</style>
