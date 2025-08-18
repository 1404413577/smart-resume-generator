<template>
  <div class="template-manager">
    <!-- 模板选择阶段 -->
    <TemplateGallery
      v-if="currentStep === 'gallery'"
      :visible="true"
      :current-career="currentCareer"
      @template-selected="handleTemplateSelected"
      @close="$emit('close')"
    />

    <!-- 模板编辑阶段 -->
    <TemplateEditor
      v-if="currentStep === 'editor'"
      :current-template="selectedTemplate"
      :resume-data="resumeData"
      @back="handleBackToGallery"
      @data-updated="handleDataUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import TemplateGallery from './TemplateGallery.vue'
import TemplateEditor from './TemplateEditor.vue'
import { useResumeStore } from '../stores/resume'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'template-applied'])

const resumeStore = useResumeStore()

// 响应式数据
const currentStep = ref('gallery') // 'gallery' | 'editor'
const selectedTemplate = ref(null)
const resumeData = ref({})
const currentCareer = ref('')

// 方法
const handleTemplateSelected = (template) => {
  // 记录选择
  selectedTemplate.value = template
  // 应用到全局store，驱动预览切换
  resumeStore.setTemplate(template.id)
  ElMessage.success(`已应用 ${template.name} 模板`)
  // 通知父组件并关闭管理器
  emit('template-applied', template)
  emit('close')
}

const handleBackToGallery = () => {
  currentStep.value = 'gallery'
  selectedTemplate.value = null
}

const handleDataUpdated = (newData) => {
  resumeData.value = newData
  // 实时更新到store
  updateStoreData(newData)
}

const updateStoreData = (data) => {
  // 更新个人信息
  if (data.personalInfo) {
    resumeStore.updatePersonalInfo(data.personalInfo)
  }
  
  // 更新个人简介
  if (data.summary) {
    resumeStore.updateSummary(data.summary)
  }
  
  // 更新工作经历
  if (data.workExperience?.length) {
    resumeStore.clearWorkExperience()
    data.workExperience.forEach(work => {
      resumeStore.addWorkExperience(work)
    })
  }
  
  // 更新技能
  if (data.skills?.length) {
    resumeStore.clearSkills()
    data.skills.forEach(skill => {
      resumeStore.addSkill(skill)
    })
  }
  
  // 更新教育背景
  if (data.education?.length) {
    resumeStore.clearEducation()
    data.education.forEach(edu => {
      resumeStore.addEducation(edu)
    })
  }
  
  // 更新项目经历
  if (data.projects?.length) {
    resumeStore.clearProjects()
    data.projects.forEach(project => {
      resumeStore.addProject(project)
    })
  }
}

// 生命周期
onMounted(() => {
  // 从store获取当前简历数据
  resumeData.value = {
    personalInfo: resumeStore.personalInfo,
    summary: resumeStore.summary,
    workExperience: resumeStore.workExperience,
    skills: resumeStore.skills,
    education: resumeStore.education,
    projects: resumeStore.projects,
    languages: resumeStore.languages || []
  }
  
  // 尝试从个人信息中推断职业
  if (resumeStore.personalInfo?.title) {
    currentCareer.value = resumeStore.personalInfo.title
  }
})
</script>

<style scoped>
.template-manager {
  width: 100%;
  height: 100%;
}
</style>
