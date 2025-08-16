<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="module ? '编辑自定义模块' : '添加自定义模块'"
    width="500px"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="模块名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入模块名称"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="模块类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择模块类型" style="width: 100%">
          <el-option label="单行文本" value="text" />
          <el-option label="多行文本" value="textarea" />
          <el-option label="日期" value="date" />
          <el-option label="列表" value="list" />
        </el-select>
      </el-form-item>

      <el-form-item label="模块描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          placeholder="请输入模块描述（可选）"
          :rows="3"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="字段配置" v-if="formData.type">
        <div class="field-config">
          <div class="field-list">
            <div 
              v-for="(field, index) in formData.fields" 
              :key="index"
              class="field-item"
            >
              <el-input
                v-model="field.name"
                placeholder="字段名称"
                size="small"
                style="flex: 1"
              />
              <el-select
                v-model="field.type"
                placeholder="类型"
                size="small"
                style="width: 100px"
              >
                <el-option label="文本" value="text" />
                <el-option label="日期" value="date" />
                <el-option label="数字" value="number" />
              </el-select>
              <el-checkbox v-model="field.required" size="small">必填</el-checkbox>
              <el-button 
                size="small" 
                text 
                type="danger" 
                @click="removeField(index)"
                :disabled="formData.fields.length <= 1"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          
          <el-button 
            size="small" 
            @click="addField"
            :disabled="formData.fields.length >= 10"
            style="width: 100%; margin-top: 8px;"
          >
            <el-icon><Plus /></el-icon>
            添加字段
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="模块模板">
        <el-select v-model="formData.template" placeholder="选择模板（可选）" style="width: 100%">
          <el-option label="无模板" value="" />
          <el-option label="证书认证" value="certification" />
          <el-option label="语言能力" value="language" />
          <el-option label="兴趣爱好" value="hobby" />
          <el-option label="获奖经历" value="award" />
          <el-option label="志愿服务" value="volunteer" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">
          {{ module ? '更新' : '添加' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean,
  module: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'close'])

const formRef = ref()
const saving = ref(false)

const formData = ref({
  name: '',
  type: '',
  description: '',
  fields: [
    { name: '', type: 'text', required: false }
  ],
  template: ''
})

const rules = {
  name: [
    { required: true, message: '请输入模块名称', trigger: 'blur' },
    { min: 2, max: 20, message: '模块名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择模块类型', trigger: 'change' }
  ]
}

// 模板预设
const moduleTemplates = {
  certification: {
    name: '证书认证',
    type: 'list',
    description: '专业证书和认证信息',
    fields: [
      { name: '证书名称', type: 'text', required: true },
      { name: '颁发机构', type: 'text', required: true },
      { name: '获得时间', type: 'date', required: false },
      { name: '证书编号', type: 'text', required: false }
    ]
  },
  language: {
    name: '语言能力',
    type: 'list',
    description: '外语水平和语言技能',
    fields: [
      { name: '语言', type: 'text', required: true },
      { name: '水平', type: 'text', required: true },
      { name: '证书', type: 'text', required: false }
    ]
  },
  hobby: {
    name: '兴趣爱好',
    type: 'textarea',
    description: '个人兴趣爱好和特长',
    fields: [
      { name: '兴趣爱好', type: 'text', required: true }
    ]
  },
  award: {
    name: '获奖经历',
    type: 'list',
    description: '获得的奖项和荣誉',
    fields: [
      { name: '奖项名称', type: 'text', required: true },
      { name: '颁发机构', type: 'text', required: true },
      { name: '获奖时间', type: 'date', required: false },
      { name: '奖项描述', type: 'text', required: false }
    ]
  },
  volunteer: {
    name: '志愿服务',
    type: 'list',
    description: '志愿服务和社会实践经历',
    fields: [
      { name: '服务项目', type: 'text', required: true },
      { name: '服务机构', type: 'text', required: true },
      { name: '服务时间', type: 'date', required: false },
      { name: '服务描述', type: 'text', required: false }
    ]
  }
}

// 重置表单函数
const resetForm = () => {
  formData.value = {
    name: '',
    type: '',
    description: '',
    fields: [
      { name: '', type: 'text', required: false }
    ],
    template: ''
  }
}

// 监听模块变化
watch(() => props.module, (newModule) => {
  if (newModule) {
    formData.value = {
      name: newModule.name || '',
      type: newModule.type || '',
      description: newModule.description || '',
      fields: newModule.fields ? [...newModule.fields] : [{ name: '', type: 'text', required: false }],
      template: newModule.template || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// 监听模板选择
watch(() => formData.value.template, (template) => {
  if (template && moduleTemplates[template]) {
    const templateData = moduleTemplates[template]
    formData.value.name = templateData.name
    formData.value.type = templateData.type
    formData.value.description = templateData.description
    formData.value.fields = [...templateData.fields]
  }
})

const addField = () => {
  if (formData.value.fields.length < 10) {
    formData.value.fields.push({
      name: '',
      type: 'text',
      required: false
    })
  }
}

const removeField = (index) => {
  if (formData.value.fields.length > 1) {
    formData.value.fields.splice(index, 1)
  }
}

const handleSave = async () => {
  try {
    await formRef.value.validate()
    
    // 验证字段配置
    const validFields = formData.value.fields.filter(field => field.name.trim())
    if (validFields.length === 0) {
      ElMessage.warning('请至少配置一个有效字段')
      return
    }

    saving.value = true
    
    const moduleData = {
      ...formData.value,
      fields: validFields
    }
    
    emit('save', moduleData)
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    saving.value = false
  }
}

const handleClose = () => {
  emit('close')
  nextTick(() => {
    formRef.value?.resetFields()
    resetForm()
  })
}
</script>

<style scoped>
.field-config {
  width: 100%;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-textarea__inner) {
  resize: vertical;
}
</style>
