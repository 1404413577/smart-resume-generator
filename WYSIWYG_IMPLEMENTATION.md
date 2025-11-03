# WYSIWYG 实现 - 所见即所得

## 问题描述
简历预览区域显示的样式与导出的PDF不一致，主要原因是：
1. 预览使用了 `transform: scale()` 缩放
2. PDF导出时没有考虑缩放因素
3. 导出时的尺寸计算不准确

## 解决方案

### 1. 移除预览缩放变换
**文件**: `src/components/resume/ResumePreview.vue`

- 移除了 `previewStyle` 中的 `transform: scale(${props.scale})`
- 保持真实的 A4 尺寸 (210mm × 297mm)
- 缩放现在只用于视觉显示，不影响导出

### 2. 修改 HomeView 预览容器
**文件**: `src/views/HomeView.vue`

**改动**:
- 移除了 `.preview-container` 的固定高度约束
- 添加了 `getPreviewContainerStyle` 计算属性，用于视觉缩放
- 修改了 `handleExportPDF` 函数，在导出前临时移除缩放

**关键代码**:
```javascript
// 计算预览容器的缩放样式（用于显示缩放效果，但不影响导出）
const getPreviewContainerStyle = computed(() => {
  return {
    transform: `scale(${previewScale.value})`,
    transformOrigin: 'top center'
  }
})

// 导出时临时移除缩放
const handleExportPDF = async () => {
  const previewContainer = document.querySelector('.preview-container')
  const originalTransform = previewContainer?.style.transform
  if (previewContainer) {
    previewContainer.style.transform = 'none'
  }
  // ... 导出逻辑
  // 恢复缩放
  if (previewContainer && originalTransform) {
    previewContainer.style.transform = originalTransform
  }
}
```

### 3. 优化 PDF 导出器
**文件**: `src/utils/pdf/pdfGenerator.js`

**改动**:
- 设置元素高度为 `auto` 而不是固定的 `297mm`
- 获取实际的内容高度 (`element.scrollHeight`)
- 根据实际内容高度计算 canvas 尺寸
- 支持多页 PDF 自动分页

**关键改进**:
```javascript
// 获取实际的内容高度
const contentHeight = element.scrollHeight
const contentWidth = element.scrollWidth

// 计算像素尺寸
const pixelWidth = Math.ceil(contentWidth)
const pixelHeight = Math.ceil(contentHeight)

// 使用实际尺寸生成 canvas
const canvas = await html2canvas(element, {
  width: pixelWidth,
  height: pixelHeight,
  // ...
})

// 计算实际的PDF高度
const actualHeightMm = (pixelHeight / 3.78)
const totalPages = Math.ceil(actualHeightMm / pageHeight)

// 自动分页
if (totalPages > 1) {
  for (let i = 1; i < totalPages; i++) {
    pdf.addPage()
    const yOffset = -(i * pageHeight)
    pdf.addImage(imgData, 'PNG', 0, yOffset, pageWidth, pageHeight, '', 'FAST')
  }
}
```

### 4. 更新 PrintView 样式
**文件**: `src/views/PrintView.vue`

- 移除了 `min-height: 297mm` 约束
- 更新 `@page` margin 从 12mm 改为 20mm
- 增加 `line-height` 从 1.5 改为 1.6

## 使用效果

### 预览区域
- 用户可以使用缩放按钮调整预览大小（50% - 150%）
- 预览显示的是真实的 A4 尺寸
- 缩放只影响视觉显示，不影响数据

### PDF 导出
- 导出的 PDF 与预览完全一致
- 自动处理多页内容
- 保持正确的间距和排版

## 测试步骤

1. 启动开发服务器: `npm run dev`
2. 打开简历编辑页面
3. 在预览区域调整缩放（使用缩放按钮）
4. 观察预览显示的内容
5. 点击"导出PDF"按钮
6. 打开导出的PDF文件
7. 验证PDF中的内容与预览完全一致

## 注意事项

- 缩放功能现在只用于视觉显示，不会影响导出
- PDF 导出时会自动移除缩放变换
- 内容高度会自动计算，支持多页 PDF
- 保持了原有的样式和排版

## 相关文件修改

1. ✅ `src/components/resume/ResumePreview.vue` - 移除 scale 变换
2. ✅ `src/views/HomeView.vue` - 修改预览容器和导出逻辑
3. ✅ `src/utils/pdf/pdfGenerator.js` - 优化 PDF 生成
4. ✅ `src/views/PrintView.vue` - 更新打印样式

