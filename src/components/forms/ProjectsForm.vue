<template>
  <div class="projects-form">
    <div class="form-header">
      <el-button type="primary" @click="addNewProject">
        <el-icon><Plus /></el-icon>
        添加项目经历
      </el-button>
    </div>

    <div v-if="projects.length === 0" class="empty-state">
      <el-empty description="暂无项目经历">
        <el-button type="primary" @click="addNewProject">添加项目经历</el-button>
      </el-empty>
    </div>

    <div v-else class="projects-list">
      <el-card 
        v-for="(project, index) in projects" 
        :key="project.id"
        class="project-card"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <span class="project-title">项目经历 {{ index + 1 }}</span>
            <el-button 
              type="danger" 
              size="small" 
              text
              @click="removeProject(project.id)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </template>

        <el-form :model="project" label-width="80px" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目名称" required>
                <el-input 
                  v-model="project.name" 
                  placeholder="如：电商管理系统"
                  @input="updateProject(project.id, project)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目链接">
                <el-input 
                  v-model="project.url" 
                  placeholder="项目演示或代码仓库链接"
                  @input="updateProject(project.id, project)"
                >
                  <template #prefix>
                    <el-icon><Link /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开始时间" required>
                <el-date-picker
                  v-model="project.startDate"
                  type="month"
                  placeholder="选择开始时间"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  @change="updateProject(project.id, project)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" required>
                <el-date-picker
                  v-model="project.endDate"
                  type="month"
                  placeholder="选择结束时间"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  @change="updateProject(project.id, project)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="项目描述" required>
            <el-input
              v-model="project.description"
              type="textarea"
              :rows="4"
              placeholder="详细描述项目背景、您的职责、解决的问题和取得的成果"
              show-word-limit
              maxlength="500"
              @input="updateProject(project.id, project)"
            />
          </el-form-item>

          <el-form-item label="技术栈">
            <div class="technologies-section">
              <div class="technologies-input">
                <el-input
                  v-model="newTechnology"
                  placeholder="输入技术名称，如：Vue.js"
                  @keyup.enter="addTechnology(project)"
                >
                  <template #suffix>
                    <el-button 
                      type="primary" 
                      text 
                      @click="addTechnology(project)"
                      :disabled="!newTechnology.trim()"
                    >
                      添加
                    </el-button>
                  </template>
                </el-input>
              </div>
              
              <div class="technologies-list">
                <el-tag
                  v-for="(tech, techIndex) in project.technologies"
                  :key="techIndex"
                  closable
                  @close="removeTechnology(project, techIndex)"
                  class="tech-tag"
                >
                  {{ tech }}
                </el-tag>
              </div>
              
              <div v-if="project.technologies.length === 0" class="no-technologies">
                暂无技术栈信息
              </div>
            </div>
          </el-form-item>

          <!-- 项目亮点 -->
          <el-form-item label="项目亮点">
            <div class="highlights-section">
              <div 
                v-for="(highlight, highlightIndex) in project.highlights" 
                :key="highlightIndex"
                class="highlight-item"
              >
                <el-input
                  v-model="project.highlights[highlightIndex]"
                  placeholder="描述项目的亮点或创新点"
                  @input="updateProject(project.id, project)"
                >
                  <template #suffix>
                    <el-button 
                      type="danger" 
                      text 
                      size="small"
                      @click="removeHighlight(project, highlightIndex)"
                    >
                      <el-icon><Close /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>
              <el-button 
                type="primary" 
                text 
                @click="addHighlight(project)"
                class="add-highlight-btn"
              >
                <el-icon><Plus /></el-icon>
                添加项目亮点
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useResumeStore } from '../../stores/resume'

const resumeStore = useResumeStore()

// 直接使用store中的数据，确保响应式
const projects = computed(() => resumeStore.resumeData.projects)
const newTechnology = ref('')

// 添加新项目
const addNewProject = () => {
  const newProject = {
    name: '',
    description: '',
    technologies: [],
    url: '',
    startDate: '',
    endDate: '',
    highlights: ['']
  }
  resumeStore.addProject(newProject)
}

// 更新项目
const updateProject = (id, project) => {
  resumeStore.updateProject(id, project)
}

// 删除项目
const removeProject = (id) => {
  ElMessageBox.confirm('确定要删除这个项目吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.removeProject(id)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 添加技术栈
const addTechnology = (project) => {
  if (newTechnology.value.trim()) {
    if (!project.technologies.includes(newTechnology.value.trim())) {
      project.technologies.push(newTechnology.value.trim())
      updateProject(project.id, project)
      newTechnology.value = ''
    } else {
      ElMessage.warning('该技术已存在')
    }
  }
}

// 删除技术栈
const removeTechnology = (project, index) => {
  project.technologies.splice(index, 1)
  updateProject(project.id, project)
}

// 添加项目亮点
const addHighlight = (project) => {
  project.highlights.push('')
  updateProject(project.id, project)
}

// 删除项目亮点
const removeHighlight = (project, index) => {
  if (project.highlights.length > 1) {
    project.highlights.splice(index, 1)
    updateProject(project.id, project)
  } else {
    ElMessage.warning('至少保留一个亮点描述')
  }
}

// 数据现在通过computed自动同步，无需手动处理
</script>

<style scoped>
.projects-form {
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

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-card {
  border-radius: 12px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

.project-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-title {
  font-weight: 600;
  color: #2c3e50;
}

.technologies-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.technologies-input {
  width: 100%;
}

.technologies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  margin: 0;
  border-radius: 16px;
}

.no-technologies {
  color: #909399;
  font-style: italic;
  text-align: center;
  padding: 10px 0;
  border: 1px dashed #e4e7ed;
  border-radius: 8px;
}

.highlights-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.highlight-item {
  display: flex;
  align-items: center;
}

.add-highlight-btn {
  align-self: flex-start;
  margin-top: 5px;
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

:deep(.el-date-editor) {
  width: 100%;
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
</style>
