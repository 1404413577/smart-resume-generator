<template>
  <div 
    v-if="visible"
    ref="el"
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
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from 'vue'
import { Close } from '@element-plus/icons-vue'
import qrCode1 from '@/assets/zhibao (1).jpg'
import qrCode2 from '@/assets/zhibao (2).jpg'

const el = ref(null)

const visible = ref(true)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const initialPosition = ref({ x: 0, y: 0 })

// 生成随机位置
onMounted(async () => {
  await nextTick()
  if (!el.value) return

  const width = el.value.offsetWidth
  const height = el.value.offsetHeight
  
  const maxX = window.innerWidth - width
  const maxY = window.innerHeight - height
  
  // 在全屏范围内随机生成位置，并留出少量边距
  position.value = {
    x: Math.max(10, Math.floor(Math.random() * (maxX - 20)) + 10),
    y: Math.max(10, Math.floor(Math.random() * (maxY - 20)) + 10)
  }

  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  if (!el.value) return
  const width = el.value.offsetWidth
  const height = el.value.offsetHeight
  
  const maxX = window.innerWidth - width
  const maxY = window.innerHeight - height
  
  // 确保窗口缩小时组件不会超出边界
  position.value.x = Math.max(0, Math.min(position.value.x, maxX))
  position.value.y = Math.max(0, Math.min(position.value.y, maxY))
}

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
  if (!isDragging.value || !el.value) return
  
  const deltaX = e.clientX - dragStart.value.x
  const deltaY = e.clientY - dragStart.value.y
  
  let newX = initialPosition.value.x + deltaX
  let newY = initialPosition.value.y + deltaY
  
  // 使用实际尺寸进行边界检查
  const maxX = window.innerWidth - el.value.offsetWidth
  const maxY = window.innerHeight - el.value.offsetHeight
  
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
  window.removeEventListener('resize', handleResize)
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
