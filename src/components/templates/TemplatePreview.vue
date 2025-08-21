<template>
  <div class="template-preview" :style="previewStyle">
    <div class="preview-container">
      <component
        v-if="template?.component"
        :is="template.component"
        :resume-data="sampleResumeData"
        :template-id="template.id"
        class="template-content"
      />
      <div v-else class="preview-placeholder">
        <div class="placeholder-content">
          <el-icon><Document /></el-icon>
          <span>模板预览</span>
        </div>
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
    default: 200
  },
  height: {
    type: Number,
    default: 280
  },
  scale: {
    type: Number,
    default: 0.3
  }
})

// 预览样式
const previewStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  position: 'relative'
}))

// 示例简历数据
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
      description: '负责公司核心产品的前端开发工作',
      achievements: [
        '完成了用户管理系统的重构，提升了50%的性能',
        '参与了移动端应用的开发，获得了用户好评'
      ]
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
    { id: '3', name: '团队协作', level: '高级', category: 'soft' },
    { id: '4', name: '英语', level: '中级', category: 'language' }
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
      highlights: [
        '使用Vue 3 Composition API重构了整个前端架构',
        '实现了动态权限控制系统',
        '优化了页面加载速度，提升了用户体验'
      ]
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'Vue.js认证开发者',
      issuer: 'Vue.js官方',
      date: '2023-03',
      url: 'https://example.com/cert'
    }
  ],
  languages: [
    { id: '1', name: '中文', level: '母语' },
    { id: '2', name: '英语', level: 'CET-6' }
  ],
  customModulesData: {}
}
</script>

<style scoped>
.template-preview {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.preview-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.template-content {
  transform: scale(0.3);
  transform-origin: top left;
  width: 210mm;
  min-height: 297mm;
  background: white;
  position: absolute;
  top: 0;
  left: 0;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #6c757d;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.placeholder-content .el-icon {
  font-size: 24px;
}
</style>
