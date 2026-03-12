<template>
  <el-dialog
    v-model="visible"
    title="裁剪头像"
    width="600px"
    @closed="handleClosed"
    append-to-body
    destroy-on-close
  >
    <div class="cropper-container">
      <div class="cropper-wrapper">
        <vue-cropper
          ref="cropper"
          :img="imageSrc"
          :outputSize="options.size"
          :outputType="options.outputType"
          :info="true"
          :full="options.full"
          :canMove="options.canMove"
          :canMoveBox="options.canMoveBox"
          :original="options.original"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          :centerBox="options.centerBox"
          :infoTrue="options.infoTrue"
          :fixed="options.fixed"
          :fixedNumber="options.fixedNumber"
          @realTime="realTime"
        ></vue-cropper>
      </div>
      <div class="preview-wrapper" v-if="previews.url">
        <div class="preview-title">预览</div>
        <div 
          class="preview-image" 
          :style="previewStyle"
        >
          <img :src="previews.url" :style="previews.img">
        </div>
      </div>
    </div>
    
    <div class="cropper-controls">
      <el-button-group>
        <el-button @click="changeScale(1)" :icon="ZoomIn">放大</el-button>
        <el-button @click="changeScale(-1)" :icon="ZoomOut">缩小</el-button>
        <el-button @click="rotateLeft" :icon="RefreshLeft">左转</el-button>
        <el-button @click="rotateRight" :icon="RefreshRight">右转</el-button>
      </el-button-group>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">确认裁剪</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, defineExpose } from 'vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { ZoomIn, ZoomOut, RefreshLeft, RefreshRight } from '@element-plus/icons-vue'

const visible = ref(false)
const imageSrc = ref('')
const loading = ref(false)
const cropper = ref(null)
const previews = ref({})

const options = reactive({
  size: 1,
  full: false,
  outputType: 'webp',
  canMove: true,
  fixedBox: false,
  original: false,
  canMoveBox: true,
  autoCrop: true,
  autoCropWidth: 200,
  autoCropHeight: 200,
  centerBox: true,
  infoTrue: true,
  fixed: true,
  fixedNumber: [1, 1],
})

const emit = defineEmits(['confirm'])

const open = (src) => {
  imageSrc.value = src
  visible.value = true
}

const handleClosed = () => {
  imageSrc.value = ''
  previews.value = {}
}

const changeScale = (num) => {
  cropper.value.changeScale(num)
}

const rotateLeft = () => {
  cropper.value.rotateLeft()
}

const rotateRight = () => {
  cropper.value.rotateRight()
}

const realTime = (data) => {
  previews.value = data
}

const previewStyle = ref({})

const handleConfirm = () => {
  loading.value = true
  cropper.value.getCropData((data) => {
    emit('confirm', data)
    loading.value = false
    visible.value = false
  })
}

defineExpose({
  open
})
</script>

<style scoped>
.cropper-container {
  display: flex;
  gap: 20px;
  height: 400px;
}

.cropper-wrapper {
  flex: 1;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.preview-wrapper {
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.preview-image {
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  background: #f5f7fa;
  width: 120px;
  height: 120px;
}

.cropper-controls {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
