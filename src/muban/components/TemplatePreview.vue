<template>
  <div class="template-preview-wrapper">
    <div class="preview-container" :style="containerStyle">
      <component
        :is="templateComponent"
        :resume-data="sampleData"
        :template-id="template.id"
        class="preview-template"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, defineAsyncComponent } from 'vue'
import { getTemplateById } from '../templateConfig.js'

// 加载组件配置
const asyncComponentOptions = {
  loadingComponent: {
    template: '<div class="template-loading">加载中...</div>'
  },
  errorComponent: {
    template: '<div class="template-error">加载失败</div>'
  },
  delay: 200,
  timeout: 3000
}

// 动态导入模板组件（使用 defineAsyncComponent 包装）
const ModernTemplate = defineAsyncComponent({
  loader: () => import('../templates/ModernTemplate.vue'),
  ...asyncComponentOptions
})
const ClassicTemplate = defineAsyncComponent({
  loader: () => import('../templates/ClassicTemplate.vue'),
  ...asyncComponentOptions
})
const CreativeTemplate = defineAsyncComponent({
  loader: () => import('../templates/CreativeTemplate.vue'),
  ...asyncComponentOptions
})
const MinimalistTemplate = defineAsyncComponent({
  loader: () => import('../templates/MinimalistTemplate.vue'),
  ...asyncComponentOptions
})
const ProfessionalTemplate = defineAsyncComponent({
  loader: () => import('../templates/ProfessionalTemplate.vue'),
  ...asyncComponentOptions
})
const AcademicTemplate = defineAsyncComponent({
  loader: () => import('../templates/AcademicTemplate.vue'),
  ...asyncComponentOptions
})
const TechTemplate = defineAsyncComponent({
  loader: () => import('../templates/TechTemplate.vue'),
  ...asyncComponentOptions
})

const props = defineProps({
  template: {
    type: Object,
    required: true
  },
  scale: {
    type: Number,
    default: 0.3
  }
})

// 模板组件映射
const templateComponents = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
  minimalist: MinimalistTemplate,
  professional: ProfessionalTemplate,
  academic: AcademicTemplate,
  tech: TechTemplate
}

// 当前模板组件
const templateComponent = computed(() => {
  return templateComponents[props.template.id] || ModernTemplate
})

// 容器样式
const containerStyle = computed(() => ({
  transform: `scale(${props.scale})`,
  transformOrigin: 'top left',
  width: `${100 / props.scale}%`,
  height: `${100 / props.scale}%`
}))

// 示例简历数据
const sampleData = ref({
  personalInfo: {
    name: '张三',
    email: 'zhangsan@email.com',
    phone: '138-0000-0000',
    address: '北京市朝阳区',
    website: 'www.example.com',
    linkedin: 'linkedin.com/in/zhangsan'
  },
  summary: '具有5年软件开发经验的专业工程师，擅长前端开发和用户体验设计。熟练掌握Vue.js、React等现代前端框架。',
  workExperience: [
    {
      id: '1',
      position: '高级前端工程师',
      company: '科技有限公司',
      location: '北京',
      startDate: '2022-01',
      endDate: '2024-01',
      current: false,
      description: '负责公司核心产品的前端开发工作，使用现代前端框架构建用户界面。',
      achievements: [
        '独立完成公司官网重构，页面加载速度提升40%',
        '参与开发核心业务系统，服务用户超过10万人'
      ]
    }
  ],
  education: [
    {
      id: '1',
      school: '北京大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2018-09',
      endDate: '2022-06',
      gpa: '3.8/4.0',
      honors: '优秀毕业生'
    }
  ],
  skills: [
    { id: '1', name: 'JavaScript', level: '高级', category: '编程语言' },
    { id: '2', name: 'Vue.js', level: '高级', category: '前端框架' },
    { id: '3', name: 'React', level: '中级', category: '前端框架' },
    { id: '4', name: 'Node.js', level: '中级', category: '后端技术' }
  ],
  projects: [
    {
      id: '1',
      name: '电商管理系统',
      role: '前端负责人',
      startDate: '2023-03',
      endDate: '2023-08',
      description: '基于Vue.js开发的电商后台管理系统，包含商品管理、订单处理等功能。',
      technologies: ['Vue.js', 'Element Plus', 'Axios'],
      url: 'https://demo.example.com'
    }
  ]
})
</script>

<style scoped>
.template-preview-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f8f9fa;
  border-radius: 8px;
  position: relative;
}

.preview-container {
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.preview-template {
  width: 210mm;
  min-height: 297mm;
  font-size: 12px;
  line-height: 1.4;
}

/* 异步组件加载状态样式 */
.template-loading,
.template-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #f8f9fa;
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  color: #6c757d;
  font-size: 14px;
}

.template-loading {
  background: linear-gradient(45deg, #f8f9fa 25%, transparent 25%),
              linear-gradient(-45deg, #f8f9fa 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f8f9fa 75%),
              linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  animation: loading-animation 1s linear infinite;
}

.template-error {
  color: #dc3545;
  border-color: #dc3545;
}

@keyframes loading-animation {
  0% {
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  }
  100% {
    background-position: 20px 20px, 20px 30px, 30px 10px, 10px 20px;
  }
}

/* 确保预览中的文字和元素适当缩小 */
:deep(.preview-template) {
  font-size: 10px;
}

:deep(.preview-template h1) {
  font-size: 18px;
}

:deep(.preview-template h2) {
  font-size: 14px;
}

:deep(.preview-template h3) {
  font-size: 12px;
}

:deep(.preview-template .section) {
  margin-bottom: 15px;
}
</style>
