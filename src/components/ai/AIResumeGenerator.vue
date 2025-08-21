<template>
  <div class="ai-resume-generator">
    <el-dialog
      :model-value="visible"
      title="AI智能简历生成器"
      width="700px"
      :close-on-click-modal="false"
      @update:model-value="$emit('update:visible', $event)"
      @close="handleClose"
    >
      <div class="generator-content">
        <!-- 步骤指示器 -->
        <el-steps :active="currentStep" align-center class="steps-indicator">
          <el-step title="选择职业" description="选择目标职位类型" />
          <el-step title="填写信息" description="完善基本信息" />
          <el-step title="选择风格" description="随机生成简历风格" />
          <el-step title="生成简历" description="AI智能生成" />
        </el-steps>

        <!-- 步骤1: 职业选择 -->
        <div v-if="currentStep === 0" class="step-content">
          <h3>选择您的目标职位</h3>
          <div class="career-grid">
            <div
              v-for="career in supportedCareers"
              :key="career.id"
              class="career-card"
              :class="{ active: selectedCareer === career.id }"
              @click="selectCareer(career.id)"
            >
              <div class="career-icon">
                {{ getCareerIcon(career.id) }}
              </div>
              <h4>{{ career.name }}</h4>
              <div class="career-skills">
                <el-tag
                  v-for="skill in career.skills.slice(0, 3)"
                  :key="skill"
                  size="small"
                  type="info"
                >
                  {{ skill }}
                </el-tag>
                <span v-if="career.skills.length > 3" class="more-skills">
                  +{{ career.skills.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤2: 信息填写 -->
        <div v-if="currentStep === 1" class="step-content">
          <h3>完善基本信息</h3>
          <el-form :model="formData" label-width="100px" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名" required>
                  <el-input
                    v-model="formData.name"
                    placeholder="请输入您的姓名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作年限" required>
                  <el-select v-model="formData.experience" placeholder="选择工作年限">
                    <el-option label="应届毕业生" value="0" />
                    <el-option label="1-2年" value="1-2" />
                    <el-option label="3-5年" value="3-5" />
                    <el-option label="5-8年" value="5-8" />
                    <el-option label="8年以上" value="8+" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="教育背景" required>
              <el-input
                v-model="formData.education"
                placeholder="如：北京大学 计算机科学与技术"
              />
            </el-form-item>

            <el-form-item label="目标公司类型">
              <el-checkbox-group v-model="formData.companies">
                <el-checkbox label="互联网公司">互联网公司</el-checkbox>
                <el-checkbox label="金融机构">金融机构</el-checkbox>
                <el-checkbox label="传统企业">传统企业</el-checkbox>
                <el-checkbox label="创业公司">创业公司</el-checkbox>
                <el-checkbox label="外企">外企</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="特殊要求">
              <el-input
                v-model="formData.requirements"
                type="textarea"
                :rows="3"
                placeholder="如：突出项目管理经验、强调技术深度等（可选）"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤3: 风格选择 -->
        <div v-if="currentStep === 2" class="step-content">
          <h3>选择简历风格</h3>
          <p class="step-description">AI将为您生成多种风格选项，选择最适合的一种</p>
          <RandomStyleSelector
            :career="selectedCareer"
            :show-career-selector="false"
            @style-applied="handleStyleSelected"
          />
        </div>

        <!-- 步骤4: 生成结果 -->
        <div v-if="currentStep === 3" class="step-content">
          <div v-if="isGenerating" class="generating-status">
            <el-icon class="is-loading"><Loading /></el-icon>
            <h3>AI正在为您生成专业简历...</h3>
            <p>这可能需要几秒钟时间，请耐心等待</p>
          </div>

          <div v-else-if="generatedResume" class="generation-result">
            <div class="result-header">
              <el-icon class="success-icon"><SuccessFilled /></el-icon>
              <h3>简历生成成功！</h3>
              <p>AI已为您生成了一份专业的{{ getCareerName(selectedCareer) }}简历</p>
            </div>

            <div class="result-preview">
              <div class="preview-section">
                <h4>个人信息</h4>
                <p><strong>姓名：</strong>{{ generatedResume.personalInfo.name }}</p>
                <p><strong>邮箱：</strong>{{ generatedResume.personalInfo.email }}</p>
                <p><strong>电话：</strong>{{ generatedResume.personalInfo.phone }}</p>
              </div>

              <div class="preview-section">
                <h4>个人简介</h4>
                <p>{{ generatedResume.summary }}</p>
              </div>

              <div class="preview-section">
                <h4>核心技能</h4>
                <div class="skills-preview">
                  <el-tag
                    v-for="skill in generatedResume.skills.slice(0, 6)"
                    :key="skill.name"
                    class="skill-tag"
                  >
                    {{ skill.name }}
                  </el-tag>
                </div>
              </div>

              <div class="preview-section">
                <h4>工作经历</h4>
                <div v-for="work in generatedResume.workExperience" :key="work.company" class="work-preview">
                  <p><strong>{{ work.jobTitle }}</strong> @ {{ work.company }}</p>
                  <p class="work-period">{{ work.startDate }} - {{ work.endDate }}</p>
                </div>
              </div>
            </div>

            <div class="result-actions">
              <el-button type="primary" @click="applyToResume">
                <el-icon><Check /></el-icon>
                应用到简历编辑器
              </el-button>
              <el-button @click="regenerate">
                <el-icon><Refresh /></el-icon>
                重新生成
              </el-button>
            </div>
          </div>

          <div v-else-if="generationError" class="generation-error">
            <el-icon class="error-icon"><CircleCloseFilled /></el-icon>
            <h3>生成失败</h3>
            <p>{{ generationError }}</p>
            <el-button type="primary" @click="regenerate">重试</el-button>
          </div>
        </div>
      </div>

      <!-- 对话框底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
          <el-button v-if="currentStep < 2" type="primary" @click="nextStep" :disabled="!canProceed">
            下一步
          </el-button>
          <el-button v-if="currentStep === 2" @click="handleClose">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { 
  Loading, 
  SuccessFilled, 
  CircleCloseFilled, 
  Check, 
  Refresh 
} from '@element-plus/icons-vue'
import { generateCompleteResume, getSupportedCareers } from '@utils/ai/aiService'
import { useResumeStore } from '@stores/resume'
import RandomStyleSelector from './RandomStyleSelector.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'close', 'resume-generated'])

const resumeStore = useResumeStore()

// 响应式数据
const currentStep = ref(0)
const selectedCareer = ref('')
const supportedCareers = ref([])
const isGenerating = ref(false)
const generatedResume = ref(null)
const generationError = ref('')

const formData = ref({
  name: '',
  experience: '',
  education: '',
  companies: [],
  requirements: ''
})

const selectedStyle = ref(null) // 选中的风格

// 计算属性
const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return selectedCareer.value !== ''
  }
  if (currentStep.value === 1) {
    return formData.value.name && formData.value.experience && formData.value.education
  }
  if (currentStep.value === 2) {
    return selectedStyle.value !== null
  }
  return true
})

// 职业图标映射
const careerIcons = {
  'software-engineer': '💻',
  'product-manager': '📊',
  'ui-designer': '🎨',
  'marketing-specialist': '📈',
  'data-analyst': '📉'
}

// 方法
const getCareerIcon = (careerId) => {
  return careerIcons[careerId] || '💼'
}

const getCareerName = (careerId) => {
  const career = supportedCareers.value.find(c => c.id === careerId)
  return career ? career.name : ''
}

const selectCareer = (careerId) => {
  selectedCareer.value = careerId
}

const nextStep = async () => {
  if (currentStep.value === 2) {
    // 开始生成简历
    await generateResume()
  }
  currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    generationError.value = ''
  }
}

const generateResume = async () => {
  isGenerating.value = true
  generationError.value = ''
  generatedResume.value = null

  try {
    const options = {
      career: selectedCareer.value,
      name: formData.value.name,
      experience: formData.value.experience,
      education: formData.value.education,
      companies: formData.value.companies,
      requirements: formData.value.requirements
    }

    const result = await generateCompleteResume(options)
    generatedResume.value = result
    
    ElMessage.success('简历生成成功！')
  } catch (error) {
    console.error('简历生成失败:', error)
    generationError.value = error.message || '生成失败，请重试'
    ElMessage.error('简历生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

const regenerate = () => {
  currentStep.value = 2
  generatedResume.value = null
  generationError.value = ''
}

// 处理风格选择
const handleStyleSelected = (style) => {
  selectedStyle.value = style
  ElMessage.success(`已选择"${style.name}"风格！`)
}

const applyToResume = () => {
  if (!generatedResume.value) return

  // 应用生成的简历数据到store
  const resume = generatedResume.value
  
  // 更新个人信息
  resumeStore.updatePersonalInfo(resume.personalInfo)
  
  // 更新个人简介
  resumeStore.updateSummary(resume.summary)
  
  // 清空现有数据并添加新数据
  resumeStore.resetResumeData()
  resumeStore.updatePersonalInfo(resume.personalInfo)
  resumeStore.updateSummary(resume.summary)
  
  // 添加工作经历
  resume.workExperience.forEach(work => {
    resumeStore.addWorkExperience(work)
  })
  
  // 添加教育背景
  resume.education.forEach(edu => {
    resumeStore.addEducation(edu)
  })
  
  // 添加技能
  resume.skills.forEach(skill => {
    resumeStore.addSkill(skill)
  })
  
  // 添加项目经历
  resume.projects.forEach(project => {
    resumeStore.addProject(project)
  })

  ElMessage.success('简历已应用到编辑器，您可以继续编辑和完善！')
  emit('resume-generated', resume)
  handleClose()
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
  
  // 重置状态
  setTimeout(() => {
    currentStep.value = 0
    selectedCareer.value = ''
    generatedResume.value = null
    generationError.value = ''
    formData.value = {
      name: '',
      experience: '',
      education: '',
      companies: [],
      requirements: ''
    }
  }, 300)
}

// 生命周期
onMounted(async () => {
  try {
    supportedCareers.value = getSupportedCareers()
  } catch (error) {
    console.error('获取职业列表失败:', error)
    ElMessage.error('获取职业列表失败')
  }
})
</script>

<style scoped>
.ai-resume-generator .generator-content {
  padding: 20px 0;
}

.ai-resume-generator .steps-indicator {
  margin-bottom: 30px;
}

.ai-resume-generator .step-content {
  min-height: 400px;
}

.ai-resume-generator .step-content h3 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
  font-size: 18px;
}

/* 职业选择样式 */
.career-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.career-card {
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.career-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1);
}

.career-card.active {
  border-color: #409eff;
  background: #ecf5ff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.career-card .career-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.career-card h4 {
  margin: 10px 0;
  color: #303133;
  font-size: 16px;
}

.career-card .career-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  align-items: center;
}

.career-card .career-skills .el-tag {
  margin: 2px;
}

.career-card .career-skills .more-skills {
  color: #909399;
  font-size: 12px;
}

/* 生成状态样式 */
.generating-status {
  text-align: center;
  padding: 60px 20px;
}

.generating-status .el-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 20px;
}

.generating-status h3 {
  color: #303133;
  margin-bottom: 10px;
}

.generating-status p {
  color: #606266;
}

/* 生成结果样式 */
.generation-result .result-header {
  text-align: center;
  margin-bottom: 30px;
}

.generation-result .result-header .success-icon {
  font-size: 48px;
  color: #67c23a;
  margin-bottom: 15px;
}

.generation-result .result-header h3 {
  color: #303133;
  margin-bottom: 10px;
}

.generation-result .result-header p {
  color: #606266;
}

.generation-result .result-preview {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.generation-result .result-preview .preview-section {
  margin-bottom: 20px;
}

.generation-result .result-preview .preview-section:last-child {
  margin-bottom: 0;
}

.generation-result .result-preview .preview-section h4 {
  color: #409eff;
  font-size: 14px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 5px;
}

.generation-result .result-preview .preview-section p {
  margin: 5px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.generation-result .result-preview .skills-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.generation-result .result-preview .skill-tag {
  font-size: 12px;
}

.generation-result .result-preview .work-preview {
  margin-bottom: 15px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}

.generation-result .result-preview .work-period {
  color: #909399;
  font-size: 12px;
}

.generation-result .result-actions {
  text-align: center;
}

.generation-result .result-actions .el-button {
  margin: 0 10px;
}

/* 错误状态样式 */
.generation-error {
  text-align: center;
  padding: 60px 20px;
}

.generation-error .error-icon {
  font-size: 48px;
  color: #f56c6c;
  margin-bottom: 20px;
}

.generation-error h3 {
  color: #303133;
  margin-bottom: 10px;
}

.generation-error p {
  color: #606266;
  margin-bottom: 20px;
}

/* 对话框底部 */
.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button {
  margin-left: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .career-grid {
    grid-template-columns: 1fr;
  }

  .ai-resume-generator .step-content {
    min-height: 300px;
  }
}
</style>
