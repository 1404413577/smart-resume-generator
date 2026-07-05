<template>
  <div class="skills-editor">
    <div class="editor-header">
      <div class="header-content">
        <h4 class="section-title">技能特长</h4>
        <p class="section-description">
          展示您的专业技能和熟练程度，包括编程语言、工具、框架等。
        </p>
      </div>
      <div class="header-actions">
        <el-button @click="addNewSkill" type="primary" :icon="Plus">
          添加技能
        </el-button>
        <el-button @click="generateWithAI" :loading="isGenerating" :icon="MagicStick">
          AI智能生成
        </el-button>
      </div>
    </div>

    <div v-if="skills.length === 0" class="empty-state">
      <div class="empty-icon">⚡</div>
      <h3>还没有技能特长</h3>
      <p>点击"添加技能"开始展示您的专业能力</p>
      <el-button @click="addNewSkill" type="primary" size="large">
        添加第一个技能
      </el-button>
    </div>

    <div v-else class="skills-container">
      <div class="skills-grid">
        <div
          v-for="(skill, index) in skills"
          :key="skill.id"
          class="skill-item"
        >
          <div class="skill-header">
            <el-input
              v-model="skill.name"
              placeholder="技能名称"
              @input="updateSkill(skill.id, skill)"
              class="skill-name-input"
            />
            <el-button
              @click="removeSkill(skill.id)"
              size="small"
              type="danger"
              :icon="Delete"
              circle
            />
          </div>

          <div class="skill-description">
            <el-input
              v-model="skill.description"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="可选：填写长句描述，例如：熟练使用 Vue2、Vue3 全家桶进行项目开发"
              @input="updateSkill(skill.id, skill)"
            />
          </div>

          <div class="skill-level">
            <span class="level-label">熟练程度：</span>
            <el-select
              v-model="skill.level"
              placeholder="选择熟练程度"
              @change="updateSkill(skill.id, skill)"
              class="level-select"
            >
              <el-option label="初级" value="初级" />
              <el-option label="中级" value="中级" />
              <el-option label="高级" value="高级" />
              <el-option label="专家" value="专家" />
            </el-select>
          </div>

          <div class="skill-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: getSkillWidth(skill.level) }"
              ></div>
            </div>
            <span class="progress-text">{{ skill.level || '未设置' }}</span>
          </div>

          <div class="skill-category">
            <el-select
              v-model="skill.category"
              placeholder="技能分类"
              @change="updateSkill(skill.id, skill)"
              size="small"
            >
              <el-option label="编程语言" value="编程语言" />
              <el-option label="前端框架" value="前端框架" />
              <el-option label="后端框架" value="后端框架" />
              <el-option label="数据库" value="数据库" />
              <el-option label="开发工具" value="开发工具" />
              <el-option label="设计工具" value="设计工具" />
              <el-option label="其他" value="其他" />
            </el-select>
          </div>
        </div>
      </div>

      <div class="add-skill-card" @click="addNewSkill">
        <el-icon class="add-icon"><Plus /></el-icon>
        <span>添加新技能</span>
      </div>
    </div>

    <div class="skills-summary" v-if="skills.length > 0">
      <h5>技能分类统计</h5>
      <div class="category-stats">
        <div
          v-for="(count, category) in categoryStats"
          :key="category"
          class="category-item"
        >
          <span class="category-name">{{ category }}</span>
          <span class="category-count">{{ count }}项</span>
        </div>
      </div>
    </div>

    <div class="tips-section">
      <h5 class="tips-title">💡 填写建议</h5>
      <ul class="tips-list">
        <li>按重要程度和熟练程度排序</li>
        <li>技能名称要准确，避免过于宽泛</li>
        <li>诚实填写熟练程度，避免夸大</li>
        <li>重点突出与目标职位相关的技能</li>
        <li>可以按分类组织技能，便于阅读</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, MagicStick } from '@element-plus/icons-vue'
import { useResumeStore } from '../../../stores/resume'

const emit = defineEmits(['data-updated'])
const resumeStore = useResumeStore()

// 响应式数据
const isGenerating = ref(false)

// 计算属性
const skills = computed(() => resumeStore.resumeData.skills)

// 技能分类统计
const categoryStats = computed(() => {
  const stats = {}
  skills.value.forEach(skill => {
    const category = skill.category || '其他'
    stats[category] = (stats[category] || 0) + 1
  })
  return stats
})

// 添加新技能
const addNewSkill = () => {
  const newSkill = {
    name: '',
    description: '',
    level: '中级',
    category: '编程语言'
  }
  resumeStore.addSkill(newSkill)
  emit('data-updated', skills.value)
  ElMessage.success('已添加新技能')
}

// 更新技能
const updateSkill = (id, skill) => {
  // 直接更新store中的数据
  const index = skills.value.findIndex(s => s.id === id)
  if (index !== -1) {
    Object.assign(skills.value[index], skill)
    resumeStore.saveToLocalStorage()
    emit('data-updated', skills.value)
  }
}

// 删除技能
const removeSkill = (id) => {
  ElMessageBox.confirm('确定要删除这个技能吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.removeSkill(id)
    emit('data-updated', skills.value)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 获取技能等级对应的宽度百分比
const getSkillWidth = (level) => {
  const levelMap = {
    '初级': '30%',
    '中级': '60%',
    '高级': '90%',
    '专家': '100%'
  }
  return levelMap[level] || '50%'
}

// AI智能生成技能
const generateWithAI = async () => {
  isGenerating.value = true
  try {
    // TODO: 集成AI服务
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟API调用

    const generatedSkills = [
      { name: 'JavaScript', level: '高级', category: '编程语言' },
      { name: 'Vue.js', level: '高级', category: '前端框架' },
      { name: 'React', level: '中级', category: '前端框架' },
      { name: 'Node.js', level: '中级', category: '后端框架' },
      { name: 'MySQL', level: '中级', category: '数据库' },
      { name: 'Git', level: '高级', category: '开发工具' }
    ]

    generatedSkills.forEach(skill => {
      resumeStore.addSkill(skill)
    })

    emit('data-updated', skills.value)
    ElMessage.success('AI技能生成成功！')
  } catch (error) {
    ElMessage.error('AI生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.skills-editor {
  padding: 0;
}

/* 编辑器头部 */
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

/* 空状态 */
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

/* 技能容器 */
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.skill-item {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.skill-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.skill-name-input {
  flex: 1;
}

.skill-description {
  margin-bottom: 12px;
}

.skill-level {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.level-label {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

.level-select {
  flex: 1;
}

.skill-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e4e7ed;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #66b3ff);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 40px;
  text-align: right;
}

.skill-category :deep(.el-select) {
  width: 100%;
}

/* 添加技能卡片 */
.add-skill-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  background: #fafbfc;
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #909399;
}

.add-skill-card:hover {
  border-color: #409eff;
  color: #409eff;
  background: #f0f9ff;
}

.add-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

/* 技能统计 */
.skills-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #67c23a;
}

.skills-summary h5 {
  font-size: 16px;
  font-weight: 600;
  color: #67c23a;
  margin: 0 0 16px 0;
}

.category-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e4e7ed;
}

.category-name {
  font-size: 13px;
  color: #606266;
}

.category-count {
  font-size: 12px;
  color: #67c23a;
  font-weight: 600;
}

/* 提示部分 */
.tips-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .header-actions {
    justify-content: center;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .category-stats {
    justify-content: center;
  }
}
</style>

<style scoped>
.skills-editor {
  padding: 0;
}

/* 编辑器头部 */
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

/* 空状态 */
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

/* 技能容器 */
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.skill-item {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.skill-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.skill-name-input {
  flex: 1;
}

.skill-level {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.level-label {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

.level-select {
  flex: 1;
}

.skill-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e4e7ed;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #66b3ff);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 40px;
  text-align: right;
}

.skill-category :deep(.el-select) {
  width: 100%;
}

/* 添加技能卡片 */
.add-skill-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  background: #fafbfc;
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #909399;
}

.add-skill-card:hover {
  border-color: #409eff;
  color: #409eff;
  background: #f0f9ff;
}

.add-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

/* 技能统计 */
.skills-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #67c23a;
}

.skills-summary h5 {
  font-size: 16px;
  font-weight: 600;
  color: #67c23a;
  margin: 0 0 16px 0;
}

.category-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e4e7ed;
}

.category-name {
  font-size: 13px;
  color: #606266;
}

.category-count {
  font-size: 12px;
  color: #67c23a;
  font-weight: 600;
}

/* 提示部分 */
.tips-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .header-actions {
    justify-content: center;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .category-stats {
    justify-content: center;
  }
}
</style>
