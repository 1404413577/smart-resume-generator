<template>
  <div class="test-random-style">
    <div class="page-header">
      <h1>随机风格生成器测试</h1>
      <p>测试随机简历风格生成功能</p>
    </div>

    <div class="test-content">
      <div class="test-section">
        <h2>基础功能测试</h2>
        <div class="test-controls">
          <el-button @click="testGenerateRandomStyle" type="primary">
            生成单个随机风格
          </el-button>
          <el-button @click="testGenerateMultipleStyles">
            生成多个随机风格
          </el-button>
          <el-button @click="testCareerSpecificStyles">
            测试职业特定风格
          </el-button>
        </div>
        
        <div class="test-results" v-if="testResults.length > 0">
          <h3>测试结果</h3>
          <div class="results-grid">
            <div 
              v-for="(result, index) in testResults" 
              :key="index"
              class="result-card"
            >
              <RandomStylePreview :style="result" />
            </div>
          </div>
        </div>
      </div>

      <div class="test-section">
        <h2>组件集成测试</h2>
        <RandomStyleSelector 
          :show-career-selector="true"
          @style-applied="handleStyleApplied"
          @style-previewed="handleStylePreviewed"
        />
      </div>

      <div class="test-section">
        <h2>配色方案预览</h2>
        <div class="color-schemes">
          <div 
            v-for="(category, categoryName) in colorSchemes" 
            :key="categoryName"
            class="category-section"
          >
            <h3>{{ getCategoryDisplayName(categoryName) }}</h3>
            <div class="schemes-grid">
              <div 
                v-for="scheme in category" 
                :key="scheme.name"
                class="scheme-card"
              >
                <div class="scheme-name">{{ scheme.name }}</div>
                <div class="scheme-colors">
                  <div 
                    class="color-swatch" 
                    :style="{ backgroundColor: scheme.primary }"
                    :title="`主色: ${scheme.primary}`"
                  ></div>
                  <div 
                    class="color-swatch" 
                    :style="{ backgroundColor: scheme.secondary }"
                    :title="`辅助色: ${scheme.secondary}`"
                  ></div>
                  <div 
                    class="color-swatch" 
                    :style="{ backgroundColor: scheme.accent }"
                    :title="`强调色: ${scheme.accent}`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import RandomStyleSelector from '@components/ai/RandomStyleSelector.vue'
import RandomStylePreview from '@components/ai/RandomStylePreview.vue'
import { 
  generateRandomStyle, 
  generateMultipleRandomStyles,
  colorSchemes 
} from '@utils/styles/randomStyleGenerator'

// 响应式数据
const testResults = ref([])

// 测试方法
const testGenerateRandomStyle = () => {
  const style = generateRandomStyle()
  testResults.value = [style]
  ElMessage.success('生成单个随机风格成功！')
}

const testGenerateMultipleStyles = () => {
  const styles = generateMultipleRandomStyles(4)
  testResults.value = styles
  ElMessage.success(`生成${styles.length}个随机风格成功！`)
}

const testCareerSpecificStyles = () => {
  const careers = ['software-engineer', 'ui-designer', 'product-manager', 'data-analyst']
  const styles = []
  
  careers.forEach(career => {
    const style = generateRandomStyle(career)
    styles.push(style)
  })
  
  testResults.value = styles
  ElMessage.success('生成职业特定风格成功！')
}

const handleStyleApplied = (style) => {
  ElMessage.success(`应用了风格: ${style.name}`)
}

const handleStylePreviewed = ({ style }) => {
  ElMessage.info(`预览风格: ${style.name}`)
}

const getCategoryDisplayName = (categoryName) => {
  const nameMap = {
    professional: '专业风格',
    creative: '创意风格',
    minimal: '简约风格',
    modern: '现代风格'
  }
  return nameMap[categoryName] || categoryName
}
</script>

<style scoped>
.test-random-style {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.page-header p {
  color: #6c757d;
  font-size: 16px;
}

.test-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.test-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.test-section h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
}

.test-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.test-results h3 {
  margin: 0 0 16px 0;
  color: #495057;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.result-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.color-schemes {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-section h3 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 16px;
}

.schemes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.scheme-card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.scheme-name {
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.scheme-colors {
  display: flex;
  gap: 4px;
}

.color-swatch {
  width: 40px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-swatch:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .test-controls {
    flex-direction: column;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .schemes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
