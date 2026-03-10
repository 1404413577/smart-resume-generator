<template>
  <div 
    v-if="visible"
    class="draggable-donation" 
    :style="positionStyle"
    @mousedown="handleMouseDown"
  >
    <div class="donation-header">
      <p class="donation-text">如果帮助到你，希望客官为爱发电</p>
      <el-icon class="close-donation" @click="closeDonation"><Close /></el-icon>
    </div>
    <div class="donation-content">
      <img :src="qrCode1" alt="为爱发电1" class="donation-qr" draggable="false" />
      <img :src="qrCode2" alt="为爱发电2" class="donation-qr" draggable="false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { Close } from '@element-plus/icons-vue'
import qrCode1 from '@/assets/zhibao (1).jpg'
import qrCode2 from '@/assets/zhibao (2).jpg'

const visible = ref(true)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const initialPosition = ref({ x: 0, y: 0 })

// 生成随机位置
onMounted(() => {
  // 假设弹窗宽度约为 320px，高度约为 200px
  const maxX = window.innerWidth - 320
  const maxY = window.innerHeight - 200
  
  // 随机在右半边或者下半边出现，避免遮挡主要工作区
  position.value = {
    x: Math.max(0, Math.floor(Math.random() * (maxX - 100)) + 100),
    y: Math.max(0, Math.floor(Math.random() * (maxY - 100)) + 100)
  }
})

const positionStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`
}))

const closeDonation = () => {
  visible.value = false
}

// 拖拽逻辑
const handleMouseDown = (e) => {
  if (e.target.closest('.close-donation')) return // 点击关闭按钮时不触发拖拽
  
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  initialPosition.value = { ...position.value }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  
  const deltaX = e.clientX - dragStart.value.x
  const deltaY = e.clientY - dragStart.value.y
  
  let newX = initialPosition.value.x + deltaX
  let newY = initialPosition.value.y + deltaY
  
  // 边界检查
  const maxX = window.innerWidth - 320
  const maxY = window.innerHeight - 200
  
  newX = Math.max(0, Math.min(newX, maxX))
  newY = Math.max(0, Math.min(newY, maxY))
  
  position.value = { x: newX, y: newY }
}

const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.draggable-donation {
  position: fixed;
  z-index: 9999;
  width: 300px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  border: 1px solid #ebeef5;
  cursor: grab;
  user-select: none; /* 防止拖拽时选中文本 */
}

.draggable-donation:active {
  cursor: grabbing;
}

.donation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.donation-text {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
  margin: 0;
}

.close-donation {
  cursor: pointer;
  color: #909399;
  font-size: 16px;
  padding: 4px;
}

.close-donation:hover {
  color: #f56c6c;
}

.donation-content {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.donation-qr {
  width: calc(50% - 5px);
  max-width: 145px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  pointer-events: none; /* 防止拖拽图片的原生默认行为 */
}
</style>
