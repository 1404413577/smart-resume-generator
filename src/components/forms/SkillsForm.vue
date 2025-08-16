<template>
  <div class="skills-form">
    <div class="form-header">
      <el-button type="primary" @click="showAddSkillDialog = true">
        <el-icon><Plus /></el-icon>
        添加技能
      </el-button>
    </div>

    <div v-if="skills.length === 0" class="empty-state">
      <el-empty description="暂无技能信息">
        <el-button type="primary" @click="showAddSkillDialog = true">添加技能</el-button>
      </el-empty>
    </div>

    <div v-else class="skills-display">
      <!-- 技能分类显示 -->
      <div v-for="category in skillCategories" :key="category.key" class="skill-category">
        <h4 class="category-title">
          <el-icon :class="category.icon"></el-icon>
          {{ category.name }}
        </h4>
        <div class="skills-grid">
          <el-tag
            v-for="skill in getSkillsByCategory(category.key)"
            :key="skill.id"
            :type="getSkillLevelType(skill.level)"
            size="large"
            closable
            @close="removeSkill(skill.id)"
            class="skill-tag"
          >
            {{ skill.name }}
            <span class="skill-level">({{ getLevelText(skill.level) }})</span>
          </el-tag>
        </div>
        <div v-if="getSkillsByCategory(category.key).length === 0" class="no-skills">
          暂无{{ category.name }}
        </div>
      </div>
    </div>

    <!-- 添加技能对话框 -->
    <el-dialog
      v-model="showAddSkillDialog"
      title="添加技能"
      width="500px"
      @close="resetSkillForm"
    >
      <el-form :model="newSkill" label-width="80px" label-position="top">
        <el-form-item label="技能名称" required>
          <el-input 
            v-model="newSkill.name" 
            placeholder="如：JavaScript、项目管理、英语等"
          />
        </el-form-item>
        
        <el-form-item label="技能类别" required>
          <el-select v-model="newSkill.category" placeholder="请选择技能类别" style="width: 100%">
            <el-option 
              v-for="category in skillCategories" 
              :key="category.key"
              :label="category.name" 
              :value="category.key"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="熟练程度" required>
          <el-select v-model="newSkill.level" placeholder="请选择熟练程度" style="width: 100%">
            <el-option label="初级" value="beginner" />
            <el-option label="中级" value="intermediate" />
            <el-option label="高级" value="advanced" />
            <el-option label="专家" value="expert" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddSkillDialog = false">取消</el-button>
          <el-button type="primary" @click="addSkill">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 快速添加常用技能 -->
    <el-card class="quick-skills-card" v-if="skills.length > 0">
      <template #header>
        <div class="card-header">
          <span>快速添加常用技能</span>
        </div>
      </template>
      
      <div class="quick-skills-section">
        <div v-for="category in commonSkills" :key="category.name" class="quick-category">
          <h5>{{ category.name }}</h5>
          <div class="quick-skills-list">
            <el-button
              v-for="skill in category.skills"
              :key="skill"
              size="small"
              text
              @click="quickAddSkill(skill, category.type)"
            >
              + {{ skill }}
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useResumeStore } from '../../stores/resume'

const resumeStore = useResumeStore()

// 本地响应式数据
const skills = ref([])
const showAddSkillDialog = ref(false)
const newSkill = ref({
  name: '',
  category: 'technical',
  level: 'intermediate'
})

// 技能分类
const skillCategories = [
  { key: 'technical', name: '技术技能', icon: 'el-icon-cpu' },
  { key: 'soft', name: '软技能', icon: 'el-icon-user' },
  { key: 'language', name: '语言技能', icon: 'el-icon-chat-dot-round' }
]

// 常用技能
const commonSkills = [
  {
    name: '前端技术',
    type: 'technical',
    skills: ['JavaScript', 'Vue.js', 'React', 'HTML', 'CSS', 'TypeScript', 'Webpack']
  },
  {
    name: '后端技术',
    type: 'technical',
    skills: ['Node.js', 'Python', 'Java', 'MySQL', 'MongoDB', 'Redis', 'Docker']
  },
  {
    name: '软技能',
    type: 'soft',
    skills: ['团队协作', '项目管理', '沟通能力', '领导力', '问题解决', '创新思维']
  },
  {
    name: '语言',
    type: 'language',
    skills: ['英语', '日语', '韩语', '德语', '法语']
  }
]

// 根据分类获取技能
const getSkillsByCategory = (category) => {
  return skills.value.filter(skill => skill.category === category)
}

// 获取技能等级对应的标签类型
const getSkillLevelType = (level) => {
  const typeMap = {
    beginner: '',
    intermediate: 'success',
    advanced: 'warning',
    expert: 'danger'
  }
  return typeMap[level] || ''
}

// 获取等级文本
const getLevelText = (level) => {
  const textMap = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
    expert: '专家'
  }
  return textMap[level] || '中级'
}

// 添加技能
const addSkill = () => {
  if (!newSkill.value.name.trim()) {
    ElMessage.warning('请输入技能名称')
    return
  }
  
  // 检查是否已存在相同技能
  const exists = skills.value.some(skill => 
    skill.name.toLowerCase() === newSkill.value.name.toLowerCase()
  )
  
  if (exists) {
    ElMessage.warning('该技能已存在')
    return
  }
  
  resumeStore.addSkill(newSkill.value)
  syncData()
  showAddSkillDialog.value = false
  resetSkillForm()
  ElMessage.success('技能添加成功')
}

// 快速添加技能
const quickAddSkill = (skillName, category) => {
  // 检查是否已存在
  const exists = skills.value.some(skill => 
    skill.name.toLowerCase() === skillName.toLowerCase()
  )
  
  if (exists) {
    ElMessage.warning('该技能已存在')
    return
  }
  
  const skill = {
    name: skillName,
    category: category,
    level: 'intermediate'
  }
  
  resumeStore.addSkill(skill)
  syncData()
  ElMessage.success(`已添加技能：${skillName}`)
}

// 删除技能
const removeSkill = (id) => {
  resumeStore.removeSkill(id)
  syncData()
  ElMessage.success('技能删除成功')
}

// 重置表单
const resetSkillForm = () => {
  newSkill.value = {
    name: '',
    category: 'technical',
    level: 'intermediate'
  }
}

// 同步数据
const syncData = () => {
  skills.value = [...resumeStore.resumeData.skills]
}

// 组件挂载时同步数据
onMounted(() => {
  syncData()
})
</script>

<style scoped>
.skills-form {
  padding: 10px 0;
}

.form-header {
  margin-bottom: 20px;
  text-align: right;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.skills-display {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.skill-category {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-weight: 600;
  font-size: 16px;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  margin: 0;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: default;
}

.skill-level {
  margin-left: 5px;
  opacity: 0.8;
  font-size: 12px;
}

.no-skills {
  color: #909399;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

.quick-skills-card {
  margin-top: 20px;
  border-radius: 12px;
}

.quick-skills-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quick-category h5 {
  margin: 0 0 8px 0;
  color: #606266;
  font-weight: 600;
}

.quick-skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #409eff;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
</style>
