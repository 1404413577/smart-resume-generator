<template>
  <div class="random-style-preview">
    <div class="preview-header">
      <h3>{{ style.name }}</h3>
      <div class="style-info">
        <el-tag size="small" :type="getTagType(style.category)">
          {{ getCategoryName(style.category) }}
        </el-tag>
        <span class="style-description">
          {{ style.typography.name }} · {{ style.spacing.name }}间距
        </span>
      </div>
    </div>
    
    <div 
      class="preview-container"
      :style="previewStyles"
    >
      <div class="preview-resume">
        <!-- 模拟简历头部 -->
        <div class="preview-header-section">
          <div class="preview-name">张三</div>
          <div class="preview-title">{{ getJobTitle(style.category) }}</div>
          <div class="preview-contact">
            <span>📧 zhangsan@example.com</span>
            <span>📱 138-0000-0000</span>
          </div>
        </div>
        
        <!-- 模拟个人简介 -->
        <div class="preview-section">
          <div class="preview-section-title">个人简介</div>
          <div class="preview-content">
            具有5年以上工作经验的专业人士，精通相关技术栈，具备良好的团队协作能力...
          </div>
        </div>
        
        <!-- 模拟工作经历 -->
        <div class="preview-section">
          <div class="preview-section-title">工作经历</div>
          <div class="preview-work-item">
            <div class="preview-work-header">
              <span class="preview-company">科技有限公司</span>
              <span class="preview-period">2020-2024</span>
            </div>
            <div class="preview-position">高级工程师</div>
            <div class="preview-content">
              • 负责核心产品的架构设计和开发<br>
              • 带领团队完成多个重要项目
            </div>
          </div>
        </div>
        
        <!-- 模拟技能 -->
        <div class="preview-section">
          <div class="preview-section-title">专业技能</div>
          <div class="preview-skills">
            <div class="preview-skill-item">
              <span class="skill-name">JavaScript</span>
              <div class="skill-bar">
                <div class="skill-progress" style="width: 90%"></div>
              </div>
            </div>
            <div class="preview-skill-item">
              <span class="skill-name">Vue.js</span>
              <div class="skill-bar">
                <div class="skill-progress" style="width: 85%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 颜色方案展示 -->
    <div class="color-palette">
      <div class="color-item" :style="{ backgroundColor: style.colors.primary }" title="主色"></div>
      <div class="color-item" :style="{ backgroundColor: style.colors.secondary }" title="辅助色"></div>
      <div class="color-item" :style="{ backgroundColor: style.colors.accent }" title="强调色"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  style: {
    type: Object,
    required: true
  },
  width: {
    type: Number,
    default: 300
  },
  height: {
    type: Number,
    default: 400
  }
})

// 生成预览样式
const previewStyles = computed(() => ({
  '--preview-primary': props.style.colors.primary,
  '--preview-secondary': props.style.colors.secondary,
  '--preview-accent': props.style.colors.accent,
  '--preview-text': props.style.colors.text,
  '--preview-background': props.style.colors.background,
  '--preview-font-family': props.style.typography.fontFamily,
  '--preview-font-size': `${props.style.typography.baseFontSize}px`,
  '--preview-title-size': `${props.style.typography.titleFontSize}px`,
  '--preview-line-height': props.style.spacing.lineHeight,
  '--preview-spacing': `${props.style.spacing.moduleSpacing}px`,
  width: `${props.width}px`,
  height: `${props.height}px`
}))

// 获取标签类型
const getTagType = (category) => {
  const typeMap = {
    professional: 'primary',
    creative: 'warning',
    minimal: 'info',
    modern: 'success'
  }
  return typeMap[category] || 'primary'
}

// 获取分类名称
const getCategoryName = (category) => {
  const nameMap = {
    professional: '专业',
    creative: '创意',
    minimal: '简约',
    modern: '现代'
  }
  return nameMap[category] || '专业'
}

// 根据分类获取示例职位
const getJobTitle = (category) => {
  const titleMap = {
    professional: '产品经理',
    creative: 'UI设计师',
    minimal: '数据分析师',
    modern: '前端工程师'
  }
  return titleMap[category] || '专业人士'
}
</script>

<style scoped>
.random-style-preview {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
}

.random-style-preview:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.preview-header {
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
}

.preview-header h3 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.style-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.style-description {
  font-size: 12px;
  color: #6c757d;
}

.preview-container {
  position: relative;
  overflow: hidden;
  background: var(--preview-background);
  font-family: var(--preview-font-family);
  font-size: var(--preview-font-size);
  line-height: var(--preview-line-height);
  color: var(--preview-text);
}

.preview-resume {
  padding: var(--preview-spacing);
  height: 100%;
  overflow: hidden;
}

.preview-header-section {
  text-align: center;
  margin-bottom: var(--preview-spacing);
  padding-bottom: calc(var(--preview-spacing) / 2);
  border-bottom: 2px solid var(--preview-primary);
}

.preview-name {
  font-size: var(--preview-title-size);
  font-weight: bold;
  color: var(--preview-primary);
  margin-bottom: 4px;
}

.preview-title {
  font-size: calc(var(--preview-font-size) + 2px);
  color: var(--preview-secondary);
  margin-bottom: 8px;
}

.preview-contact {
  font-size: calc(var(--preview-font-size) - 1px);
  color: var(--preview-text);
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.preview-section {
  margin-bottom: calc(var(--preview-spacing) * 0.8);
}

.preview-section-title {
  font-size: calc(var(--preview-font-size) + 1px);
  font-weight: bold;
  color: var(--preview-primary);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--preview-accent);
}

.preview-content {
  font-size: calc(var(--preview-font-size) - 1px);
  line-height: var(--preview-line-height);
  color: var(--preview-text);
}

.preview-work-item {
  margin-bottom: 12px;
}

.preview-work-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.preview-company {
  font-weight: 600;
  color: var(--preview-secondary);
}

.preview-period {
  font-size: calc(var(--preview-font-size) - 1px);
  color: var(--preview-accent);
}

.preview-position {
  font-size: calc(var(--preview-font-size) - 1px);
  color: var(--preview-text);
  margin-bottom: 4px;
}

.preview-skills {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-name {
  font-size: calc(var(--preview-font-size) - 1px);
  min-width: 60px;
  color: var(--preview-text);
}

.skill-bar {
  flex: 1;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: var(--preview-accent);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.color-palette {
  display: flex;
  height: 24px;
}

.color-item {
  flex: 1;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-item:hover {
  transform: scaleY(1.2);
}

.color-item:first-child {
  border-bottom-left-radius: 8px;
}

.color-item:last-child {
  border-bottom-right-radius: 8px;
}
</style>
