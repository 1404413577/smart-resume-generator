<template>
  <div class="template-thumbnail" :style="thumbnailStyle">
    <div class="thumbnail-header" :style="headerStyle">
      <div class="header-line primary"></div>
      <div class="header-line secondary"></div>
    </div>
    <div class="thumbnail-body">
      <div class="body-line" v-for="i in 6" :key="i" :style="getLineStyle(i)"></div>
    </div>
    <div class="thumbnail-footer">
      <div class="footer-accent" :style="accentStyle"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  template: {
    type: Object,
    required: true
  },
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 150
  }
})

// 基础样式
const thumbnailStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  backgroundColor: props.template.colors?.background || '#ffffff',
  border: `1px solid ${props.template.colors?.secondary || '#e5e7eb'}`,
  borderRadius: '8px',
  overflow: 'hidden',
  position: 'relative'
}))

// 头部样式
const headerStyle = computed(() => ({
  backgroundColor: props.template.colors?.primary || '#3b82f6',
  opacity: '0.1',
  height: '30%'
}))

// 强调色样式
const accentStyle = computed(() => ({
  backgroundColor: props.template.colors?.accent || props.template.colors?.primary || '#3b82f6',
  height: '4px',
  width: '60%'
}))

// 获取线条样式
const getLineStyle = (index) => {
  const baseColor = props.template.colors?.text || '#374151'
  const opacity = index <= 3 ? 0.8 : 0.4
  const width = index === 1 ? '80%' : index === 2 ? '60%' : index <= 4 ? '90%' : '70%'
  
  return {
    backgroundColor: baseColor,
    opacity: opacity,
    width: width,
    height: '2px',
    marginBottom: '4px'
  }
}
</script>

<style scoped>
.template-thumbnail {
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.template-thumbnail:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.thumbnail-header {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-line {
  height: 3px;
  border-radius: 2px;
}

.header-line.primary {
  width: 70%;
}

.header-line.secondary {
  width: 50%;
}

.thumbnail-body {
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.body-line {
  border-radius: 1px;
}

.thumbnail-footer {
  padding: 8px;
  display: flex;
  justify-content: flex-end;
}

.footer-accent {
  border-radius: 2px;
}
</style>
