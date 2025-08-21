<template>
  <div class="random-style-selector">
    <div class="selector-header">
      <div class="header-content">
        <h3>
          <el-icon><MagicStick /></el-icon>
          随机风格生成器
        </h3>
        <p>为您的简历生成独特的视觉风格</p>
      </div>
      <div class="header-actions">
        <el-button 
          @click="generateNewStyles" 
          :loading="isGenerating"
          type="primary"
          :icon="Refresh"
        >
          {{ isGenerating ? '生成中...' : '重新生成' }}
        </el-button>
      </div>
    </div>

    <div class="career-selector" v-if="showCareerSelector">
      <el-select
        v-model="selectedCareer"
        placeholder="选择职业类型（可选）"
        clearable
        @change="handleCareerChange"
        style="width: 200px"
      >
        <el-option
          v-for="career in careers"
          :key="career.value"
          :label="career.label"
          :value="career.value"
        />
      </el-select>
      <span class="career-hint">选择职业类型可获得更匹配的风格</span>
    </div>

    <div class="styles-grid" v-loading="isGenerating">
      <div
        v-for="(style, index) in randomStyles"
        :key="style.id"
        class="style-card"
        :class="{ 'selected': selectedStyleIndex === index }"
        @click="selectStyle(index)"
      >
        <RandomStylePreview 
          :style="style" 
          :width="280" 
          :height="360"
        />
        <div class="card-actions">
          <el-button 
            size="small" 
            type="primary" 
            :disabled="selectedStyleIndex !== index"
            @click.stop="previewStyle(style)"
          >
            实时预览
          </el-button>
          <el-button 
            size="small" 
            @click.stop="applyStyle(style)"
            :disabled="selectedStyleIndex !== index"
          >
            应用风格
          </el-button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="randomStyles.length === 0 && !isGenerating">
      <el-empty description="点击重新生成按钮开始创建随机风格">
        <el-button type="primary" @click="generateNewStyles" :icon="MagicStick">
          生成随机风格
        </el-button>
      </el-empty>
    </div>

    <div class="selector-footer" v-if="randomStyles.length > 0">
      <div class="footer-info">
        <el-icon><InfoFilled /></el-icon>
        <span>选择一个风格后可以实时预览或直接应用到简历</span>
      </div>
      <div class="footer-actions">
        <el-button @click="generateMoreStyles" :loading="isGenerating">
          生成更多选项
        </el-button>
        <el-button 
          type="primary" 
          @click="applySelectedStyle"
          :disabled="selectedStyleIndex === -1"
        >
          应用选中风格
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  MagicStick, 
  Refresh, 
  InfoFilled 
} from '@element-plus/icons-vue'
import RandomStylePreview from './RandomStylePreview.vue'
import { 
  generateMultipleRandomStyles, 
  convertToGlobalSettings 
} from '@utils/styles/randomStyleGenerator'
import { useResumeStore } from '@stores/resume'

const props = defineProps({
  career: {
    type: String,
    default: null
  },
  showCareerSelector: {
    type: Boolean,
    default: true
  },
  autoGenerate: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['style-selected', 'style-applied', 'style-previewed'])

const resumeStore = useResumeStore()

// 响应式数据
const randomStyles = ref([])
const selectedStyleIndex = ref(-1)
const isGenerating = ref(false)
const selectedCareer = ref(props.career)

// 职业选项
const careers = ref([
  { label: '软件工程师', value: 'software-engineer' },
  { label: '产品经理', value: 'product-manager' },
  { label: 'UI设计师', value: 'ui-designer' },
  { label: '市场营销专员', value: 'marketing-specialist' },
  { label: '数据分析师', value: 'data-analyst' }
])

// 生成新的随机风格
const generateNewStyles = async () => {
  isGenerating.value = true
  selectedStyleIndex.value = -1
  
  try {
    // 模拟生成延迟，提供更好的用户体验
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const styles = generateMultipleRandomStyles(3, selectedCareer.value)
    randomStyles.value = styles
    
    ElMessage.success('已生成新的随机风格！')
  } catch (error) {
    console.error('生成随机风格失败:', error)
    ElMessage.error('生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

// 生成更多风格选项
const generateMoreStyles = async () => {
  isGenerating.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const newStyles = generateMultipleRandomStyles(2, selectedCareer.value)
    randomStyles.value = [...randomStyles.value, ...newStyles]
    
    ElMessage.success('已添加更多风格选项！')
  } catch (error) {
    console.error('生成更多风格失败:', error)
    ElMessage.error('生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

// 选择风格
const selectStyle = (index) => {
  selectedStyleIndex.value = index
  const selectedStyle = randomStyles.value[index]
  emit('style-selected', selectedStyle)
}

// 预览风格
const previewStyle = (style) => {
  const globalSettings = convertToGlobalSettings(style)
  
  // 临时应用样式进行预览
  const originalSettings = { ...resumeStore.globalSettings }
  resumeStore.updateGlobalSettings(globalSettings)
  
  emit('style-previewed', { style, originalSettings })
  ElMessage.success(`正在预览"${style.name}"风格`)
}

// 应用风格
const applyStyle = (style) => {
  const globalSettings = convertToGlobalSettings(style)
  resumeStore.updateGlobalSettings(globalSettings)
  
  emit('style-applied', style)
  ElMessage.success(`已应用"${style.name}"风格！`)
}

// 应用选中的风格
const applySelectedStyle = () => {
  if (selectedStyleIndex.value >= 0) {
    const selectedStyle = randomStyles.value[selectedStyleIndex.value]
    applyStyle(selectedStyle)
  }
}

// 职业类型变化处理
const handleCareerChange = () => {
  if (randomStyles.value.length > 0) {
    generateNewStyles()
  }
}

// 组件挂载时自动生成
onMounted(() => {
  if (props.autoGenerate) {
    generateNewStyles()
  }
})
</script>

<style scoped>
.random-style-selector {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.header-content h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-content p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.career-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.career-hint {
  font-size: 12px;
  color: #6c757d;
}

.styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.style-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.style-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.style-card.selected {
  border-color: #409eff;
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.2);
}

.card-actions {
  padding: 12px 16px;
  background: #f8f9fa;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.selector-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 14px;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .selector-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .styles-grid {
    grid-template-columns: 1fr;
  }
  
  .selector-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .footer-actions {
    justify-content: center;
  }
}
</style>
