<template>
  <div class="template-preview-wrap" :style="wrapStyle">
    <div class="scale-container" :style="scaleContainerStyle">
      <component
        v-if="template?.component"
        :is="template.component"
        :resume-data="previewResumeData"
        :template-id="template.id"
        render-mode="thumbnail"
        v-bind="template.config ? { config: template.config } : {}"
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
import { normalizeResumeData } from '@/domain/resumeNormalizer'

const props = defineProps({
  template: {
    type: Object,
    required: true
  },
  width: {
    type: Number,
    default: 220 // 卡片宽度 px
  },
  height: {
    type: Number,
    default: null
  },
  scale: {
    type: Number,
    default: null
  },
  resumeData: {
    type: Object,
    default: null
  },
  useSampleData: {
    type: Boolean,
    default: true
  }
})

// A4 尺寸（96dpi，1mm ≈ 3.7795px）
const A4_W_PX = 794   // 210mm in px
const A4_H_PX = 1123  // 297mm in px

const scale = computed(() => {
  if (props.scale) return props.scale

  const widthScale = props.width / A4_W_PX
  const heightScale = props.height ? props.height / A4_H_PX : widthScale
  return Math.min(widthScale, heightScale)
})

const scaledWidth = computed(() => Math.round(A4_W_PX * scale.value))
const scaledHeight = computed(() => Math.round(A4_H_PX * scale.value))
const previewWidth = computed(() => props.scale ? scaledWidth.value : props.width)
const previewHeight = computed(() => props.height || scaledHeight.value)
const previewOffsetX = computed(() => Math.max(0, Math.round((previewWidth.value - scaledWidth.value) / 2)))
const previewOffsetY = computed(() => Math.max(0, Math.round((previewHeight.value - scaledHeight.value) / 2)))

// 外层容器：固定宽高，overflow hidden 裁掉底部
const wrapStyle = computed(() => ({
  width: `${previewWidth.value}px`,
  height: `${previewHeight.value}px`,
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
  top: `${previewOffsetY.value}px`,
  left: `${previewOffsetX.value}px`,
  pointerEvents: 'none'
}))

const hasUsableResumeData = (data) => {
  if (!data) return false
  return Boolean(
    data.personalInfo?.name ||
    data.summary ||
    data.workExperience?.length ||
    data.education?.length ||
    data.skills?.length ||
    data.projects?.length
  )
}

const templateProfiles = {
  classic: {
    targetPosition: '行政主管',
    summary: '重视流程、规范和稳定交付，具备扎实的组织协调与文档管理经验。',
    photoPosition: 'center'
  },
  compact: {
    targetPosition: '资深工程师',
    summary: '经历丰富，擅长在有限篇幅内呈现核心项目、技术栈与量化成果。',
    photoPosition: 'left'
  },
  sidebar: {
    targetPosition: '产品经理',
    summary: '关注业务目标、用户反馈和跨团队协作，擅长推动复杂需求落地。',
    photoPosition: 'right'
  },
  executive: {
    targetPosition: '业务总监',
    summary: '具备团队管理和经营分析经验，强调战略拆解、结果负责和组织协同。',
    photoPosition: 'left'
  },
  creative: {
    targetPosition: '品牌设计师',
    summary: '擅长品牌视觉、内容表达和跨媒介设计，注重审美一致性与传播效率。',
    photoPosition: 'right'
  },
  academic: {
    targetPosition: '研究助理',
    summary: '具备研究写作、数据整理和项目协作经验，关注论证严谨性与材料完整度。',
    photoPosition: 'center'
  },
  technical: {
    targetPosition: '全栈工程师',
    summary: '熟悉前后端工程实践，重视架构演进、性能优化和可维护交付。',
    photoPosition: 'left'
  },
  'ats-clean': {
    targetPosition: '财务专员',
    summary: '黑白简洁结构，突出基础信息、经历和技能，适合系统筛选与正式投递。',
    photoPosition: 'left'
  },
  'project-ledger': {
    targetPosition: '平台工程师',
    summary: '项目和成果优先，突出技术方案、交付结果和关键指标。',
    photoPosition: 'left'
  },
  timeline: {
    targetPosition: '项目经理',
    summary: '以时间线梳理职业路径，突出关键节点、项目推进和可验证成果。',
    photoPosition: 'right'
  },
  metro: {
    targetPosition: '运营负责人',
    summary: '强调稳定交付、团队协作和业务结果，适合成熟职场候选人。',
    photoPosition: 'left'
  },
  editorial: {
    targetPosition: '品牌策略顾问',
    summary: '用更强的叙事排版组织项目、经历和成果，适合展示复杂背景与作品脉络。',
    photoPosition: 'right'
  },
  flow: {
    targetPosition: '增长产品经理',
    summary: '线性结构清晰，适合在自由样式控制下平衡阅读效率和专业质感。',
    photoPosition: 'left'
  },
  portfolio: {
    targetPosition: '视觉设计师',
    summary: '突出项目模块、技能标签和成果表达，适合创意与作品导向岗位。',
    photoPosition: 'right'
  },
  'portrait-column': {
    targetPosition: '客户成功经理',
    summary: '头像自适应模板：有头像时保留专门形象区，没有头像时自动收拢为文字主导页眉。',
    photoPosition: 'center',
    photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 144"%3E%3Crect width="120" height="144" fill="%23e5e7eb"/%3E%3Ccircle cx="60" cy="52" r="25" fill="%239ca3af"/%3E%3Cpath d="M24 125c6-28 66-28 72 0" fill="%239ca3af"/%3E%3C/svg%3E'
  }
}

const previewResumeData = computed(() => {
  const baseData = !props.useSampleData && hasUsableResumeData(props.resumeData)
    ? props.resumeData
    : sampleResumeData
  const profile = templateProfiles[props.template?.id] || {
    targetPosition: '前端工程师',
    summary: sampleResumeData.summary,
    photoPosition: 'left'
  }
  const normalized = normalizeResumeData(baseData)

  return normalizeResumeData({
    ...normalized,
    personalInfo: {
      ...normalized.personalInfo,
      targetPosition: profile.targetPosition,
      photoPosition: profile.photoPosition,
      photo: profile.photo ?? normalized.personalInfo.photo
    },
    summary: profile.summary
  })
})

// 示例数据 —— 为预览提供真实内容
const sampleResumeData = {
  personalInfo: {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    address: '北京市朝阳区',
    website: 'https://zhangsan.dev',
    linkedin: 'linkedin.com/in/zhangsan',
    github: 'github.com/zhangsan',
    targetPosition: '前端工程师',
    photo: '',
    photoPosition: 'left',
    customFields: [
      { id: 'field-1', name: '城市', value: '北京' }
    ]
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
      studyType: '全日制',
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
      role: '前端负责人',
      description: '基于Vue.js开发的企业内部管理系统，包含用户管理、权限控制等功能。',
      technologies: ['Vue.js', 'Element Plus', 'Node.js'],
      url: 'https://example.com',
      startDate: '2023-01',
      endDate: '2023-06',
      highlights: ['使用Vue 3重构前端架构', '实现动态权限控制系统']
    }
  ],
  certifications: [
    { id: '1', name: '前端工程能力认证', issuer: '技术认证机构', date: '2023-03', score: '优秀' }
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
