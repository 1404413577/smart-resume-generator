<template>
  <div class="projects-editor">
    <div class="editor-header">
      <div class="header-content">
        <h4 class="section-title">项目经历</h4>
        <p class="section-description">
          展示您参与的重要项目，包括项目描述、技术栈、个人贡献等。
        </p>
      </div>
      <div class="header-actions">
        <el-button @click="addNewProject" type="primary" :icon="Plus">
          添加项目
        </el-button>
      </div>
    </div>

    <div v-if="projects.length === 0" class="empty-state">
      <div class="empty-icon">🚀</div>
      <h3>还没有项目经历</h3>
      <p>点击"添加项目"开始展示您的项目经验</p>
      <el-button @click="addNewProject" type="primary" size="large">
        添加第一个项目
      </el-button>
    </div>

    <div v-else class="projects-list">
      <div
        v-for="(project, index) in projects"
        :key="project.id"
        class="project-item"
      >
        <div class="project-header">
          <div class="project-title">
            <h5>项目 {{ index + 1 }}</h5>
            <div class="project-status">
              <span v-if="project.status === 'ongoing'" class="ongoing-badge">进行中</span>
              <span v-else-if="project.status === 'completed'" class="completed-badge">已完成</span>
              <span v-else class="draft-badge">草稿</span>
            </div>
          </div>
          <div class="project-actions">
            <el-button @click="removeProject(project.id)" size="small" type="danger" :icon="Delete">
              删除
            </el-button>
          </div>
        </div>

        <div class="project-form">
          <el-form :model="project" label-width="100px" label-position="top">
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
                <el-form-item label="项目角色">
                  <el-input
                    v-model="project.role"
                    placeholder="如：前端负责人、核心开发者"
                    @input="updateProject(project.id, project)"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="项目状态">
                  <el-select
                    v-model="project.status"
                    placeholder="选择状态"
                    @change="updateProject(project.id, project)"
                  >
                    <el-option label="进行中" value="ongoing" />
                    <el-option label="已完成" value="completed" />
                    <el-option label="已暂停" value="paused" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开始时间">
                  <el-date-picker
                    v-model="project.startDate"
                    type="month"
                    placeholder="选择开始时间"
                    format="YYYY年MM月"
                    value-format="YYYY-MM"
                    @change="updateProject(project.id, project)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结束时间">
                  <el-date-picker
                    v-model="project.endDate"
                    type="month"
                    placeholder="选择结束时间"
                    format="YYYY年MM月"
                    value-format="YYYY-MM"
                    :disabled="project.status === 'ongoing'"
                    @change="updateProject(project.id, project)"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="项目描述">
              <el-input
                v-model="project.description"
                type="textarea"
                :rows="4"
                placeholder="详细描述项目背景、目标、功能特点等..."
                show-word-limit
                maxlength="500"
                @input="updateProject(project.id, project)"
              />
            </el-form-item>

            <el-form-item label="技术栈">
              <div class="technologies-section">
                <div
                  v-for="(tech, techIndex) in project.technologies || []"
                  :key="techIndex"
                  class="technology-item"
                >
                  <el-input
                    v-model="project.technologies[techIndex]"
                    placeholder="如：Vue.js、Node.js、MySQL"
                    @input="updateProject(project.id, project)"
                  />
                  <el-button
                    @click="removeTechnology(project, techIndex)"
                    size="small"
                    type="danger"
                    :icon="Delete"
                    circle
                  />
                </div>
                <el-button
                  @click="addTechnology(project)"
                  size="small"
                  type="primary"
                  :icon="Plus"
                  style="margin-top: 8px;"
                >
                  添加技术
                </el-button>
              </div>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="项目链接">
                  <el-input
                    v-model="project.url"
                    placeholder="项目演示地址或官网"
                    @input="updateProject(project.id, project)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="GitHub链接">
                  <el-input
                    v-model="project.github"
                    placeholder="GitHub仓库地址"
                    @input="updateProject(project.id, project)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>

    <div v-if="projects.length > 0" class="add-more-section">
      <el-button @click="addNewProject" type="primary" :icon="Plus" size="large">
        添加更多项目
      </el-button>
    </div>

    <div class="tips-section">
      <h5 class="tips-title">💡 填写建议</h5>
      <ul class="tips-list">
        <li>按重要程度和时间顺序排列项目</li>
        <li>突出您在项目中的核心贡献和价值</li>
        <li>技术栈要与目标职位相关</li>
        <li>提供可访问的项目链接增加可信度</li>
        <li>用具体数据说明项目成果和影响</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useResumeStore } from '@stores/resume'

const emit = defineEmits(['data-updated'])
const resumeStore = useResumeStore()

// 计算属性
const projects = computed(() => resumeStore.resumeData.projects)

// 添加新项目
const addNewProject = () => {
  const newProject = {
    name: '',
    role: '',
    status: 'completed',
    startDate: '',
    endDate: '',
    description: '',
    technologies: [],
    url: '',
    github: ''
  }
  resumeStore.addProject(newProject)
  emit('data-updated', projects.value)
  ElMessage.success('已添加新项目')
}

// 更新项目
const updateProject = (id, project) => {
  resumeStore.updateProject(id, project)
  emit('data-updated', projects.value)
}

// 删除项目
const removeProject = (id) => {
  ElMessageBox.confirm('确定要删除这个项目吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.removeProject(id)
    emit('data-updated', projects.value)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 添加技术
const addTechnology = (project) => {
  if (!project.technologies) {
    project.technologies = []
  }
  project.technologies.push('')
  updateProject(project.id, project)
}

// 删除技术
const removeTechnology = (project, index) => {
  if (project.technologies && project.technologies.length > index) {
    project.technologies.splice(index, 1)
    updateProject(project.id, project)
  }
}

</script>

<style scoped>
.projects-editor {
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

/* 项目列表 */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.project-item {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.project-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

/* 项目头部 */
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.project-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-title h5 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.project-status {
  display: flex;
  align-items: center;
}

.ongoing-badge,
.completed-badge,
.draft-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.ongoing-badge {
  background: #f0f9ff;
  color: #409eff;
  border: 1px solid #409eff;
}

.completed-badge {
  background: #f0f9f0;
  color: #67c23a;
  border: 1px solid #67c23a;
}

.draft-badge {
  background: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #e6a23c;
}

.project-actions {
  display: flex;
  gap: 8px;
}

/* 表单样式 */
.project-form {
  margin-top: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
  font-family: inherit;
  line-height: 1.6;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

/* 技术栈部分 */
.technologies-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.technology-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.technology-item .el-input {
  flex: 1;
}

/* 添加更多部分 */
.add-more-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px dashed #e4e7ed;
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

  .project-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .project-actions {
    justify-content: center;
  }

  .technology-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}
</style>
