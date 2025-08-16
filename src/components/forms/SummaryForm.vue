<template>
  <div class="summary-form">
    <el-form label-position="top">
      <el-form-item label="个人简介">
        <el-input
          v-model="summary"
          type="textarea"
          :rows="6"
          placeholder="请简要描述您的职业背景、核心技能和职业目标。建议控制在100-200字以内。"
          show-word-limit
          maxlength="500"
        />
        <div class="summary-tips">
          <el-alert
            title="写作建议"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <ul class="tips-list">
                <li>突出您的核心技能和专业优势</li>
                <li>简要说明您的工作经验和成就</li>
                <li>表达您的职业目标和发展方向</li>
                <li>使用积极正面的语言描述</li>
              </ul>
            </template>
          </el-alert>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="quick-templates">
          <h4>快速模板</h4>
          <el-row :gutter="10">
            <el-col :span="8" v-for="template in summaryTemplates" :key="template.id">
              <el-card 
                class="template-card" 
                shadow="hover"
                @click="applySummaryTemplate(template.content)"
              >
                <div class="template-title">{{ template.title }}</div>
                <div class="template-preview">{{ template.preview }}</div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useResumeStore } from '../../stores/resume'

const resumeStore = useResumeStore()

// 直接使用store中的数据，确保响应式
const summary = computed({
  get: () => resumeStore.resumeData.summary,
  set: (value) => {
    resumeStore.updateSummary(value)
  }
})

// 快速模板
const summaryTemplates = [
  {
    id: 1,
    title: '技术专家',
    preview: '资深技术专家，专注于...',
    content: '拥有X年软件开发经验的技术专家，专注于[技术领域]。精通[核心技术栈]，具备丰富的[项目类型]开发经验。擅长[特长技能]，致力于通过技术创新解决复杂业务问题，推动团队技术水平提升。'
  },
  {
    id: 2,
    title: '管理岗位',
    preview: '经验丰富的团队管理者...',
    content: '具有X年[行业]经验的专业管理者，擅长团队建设和项目管理。成功领导过[团队规模]的团队，完成了[重要成就]。具备优秀的沟通协调能力和战略思维，致力于推动组织效率提升和业务增长。'
  },
  {
    id: 3,
    title: '应届毕业生',
    preview: '充满热情的应届毕业生...',
    content: '[专业]专业应届毕业生，在校期间专业成绩优异，积极参与[相关活动/项目]。掌握[相关技能]，具备良好的学习能力和团队协作精神。热爱[行业/领域]，希望在[目标岗位]领域发挥所长，为公司发展贡献力量。'
  }
]

// 应用模板
const applySummaryTemplate = (template) => {
  summary.value = template
  ElMessage.success('模板已应用，请根据个人情况进行修改')
}

// 数据现在通过computed自动同步，无需手动处理
</script>

<style scoped>
.summary-form {
  padding: 10px 0;
}

.summary-tips {
  margin-top: 15px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
}

.tips-list li {
  margin-bottom: 5px;
  color: #606266;
  font-size: 14px;
}

.quick-templates {
  margin-top: 20px;
}

.quick-templates h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-weight: 600;
}

.template-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-bottom: 10px;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.template-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.template-preview {
  color: #606266;
  font-size: 12px;
  line-height: 1.4;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

:deep(.el-textarea__inner:hover) {
  border-color: #409eff;
}

:deep(.el-textarea__inner:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

:deep(.el-alert) {
  border-radius: 8px;
}
</style>
