<template>
  <div class="page-break" :class="{ 'show-in-preview': showInPreview }">
    <div class="page-break-line"></div>
    <div class="page-break-label" v-if="showPageNumber">
      第{{ pageNumber }}页
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pageNumber: {
    type: Number,
    default: 1
  },
  showInPreview: {
    type: Boolean,
    default: true
  },
  showPageNumber: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.page-break {
  position: relative;
  height: 0;
  margin: 20px 0;
  page-break-before: always;
  display: none; /* 默认隐藏，只在预览时显示 */
}

.page-break.show-in-preview {
  display: block;
}

.page-break-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #ddd 0%, #999 50%, #ddd 100%);
  position: relative;
}

.page-break-line::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: white;
  border: 2px solid #999;
  border-radius: 50%;
}

.page-break-label {
  position: absolute;
  top: -10px;
  right: 0;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  border: 1px solid #ddd;
}

/* 打印时的样式 */
@media print {
  .page-break {
    display: block !important;
    height: 0;
    margin: 0;
    page-break-before: always;
  }
  
  .page-break-line,
  .page-break-label {
    display: none;
  }
}
</style>
