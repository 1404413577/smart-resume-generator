# 📱 设计系统与移动端适配完整指南

## 🎨 设计系统概览

本项目建立了完整的设计系统，包括：

### 1. **颜色系统** 🎭
```javascript
// 主色系
primary: '#409EFF'        // 蓝色主色
success: '#67C23A'        // 绿色成功
warning: '#E6A23C'        // 橙色警告
error: '#F56C6C'          // 红色错误

// 灰度系 (9档)
gray100-900               // 从浅到深
```

**使用场景:**
- 主按钮: `primary` 色
- 成功提示: `success` 色
- 警告提示: `warning` 色
- 错误提示: `error` 色

### 2. **字体系统** 📝
```javascript
// 字体大小
xs:  12px   // 辅助文字
sm:  14px   // 常规文字
base: 16px  // 身体文字
lg:  18px   // 大标题
xl:  20px   // 较大标题
2xl: 24px   // 中等标题
3xl: 30px   // 大标题
4xl: 36px   // 超大标题

// 行高
tight: 1.25    // 紧凑
normal: 1.5    // 标准
relaxed: 1.75  // 松散
loose: 2       // 超松散
```

**最佳实践:**
- 主标题: `fontSize: 24px, fontWeight: bold, lineHeight: 1.2`
- 副标题: `fontSize: 18px, fontWeight: 600, lineHeight: 1.3`
- 正文: `fontSize: 16px, fontWeight: 400, lineHeight: 1.6`
- 注释: `fontSize: 14px, fontWeight: 400, lineHeight: 1.5`

### 3. **间距系统** 📏
```javascript
// 4px 基础单位
0: 0px    // 无间距
1: 4px    // 极小
2: 8px    // 小
3: 12px   // 中小
4: 16px   // 中
5: 20px   // 中大
6: 24px   // 大
8: 32px   // 很大
```

**最佳实践:**
- 元素间距: `16px (4)`
- 小区块间距: `12px (3)`
- 组件内边距: `16px (4)`
- 页面边距: `24px (6)`

### 4. **圆角系统** 🔲
```javascript
none: 0        // 直角
sm: 2px        // 微弱圆角
base: 4px      // 标准圆角
md: 6px        // 中等圆角
lg: 8px        // 大圆角
xl: 12px       // 很大圆角
full: 9999px   // 完全圆形
```

### 5. **阴影系统** ✨
```javascript
none: 无阴影
sm: 轻微阴影     (如: 辅助元素)
base: 标准阴影   (如: 卡片)
md: 中等阴影     (如: 浮动按钮)
lg: 大阴影       (如: 对话框)
xl: 超大阴影     (如: 模态框)
```

---

## 📱 响应式设计

### 响应式断点

```javascript
xs:  320px    // 超小屏 (小手机)
sm:  576px    // 小屏 (大手机)
md:  768px    // 中屏 (平板竖屏)
lg:  992px    // 大屏 (小笔记本)
xl:  1200px   // 超大屏 (笔记本)
2xl: 1408px   // 2K屏 (大桌面)
```

### 设备分类

| 类型 | 宽度范围 | 示例 | 特点 |
|------|---------|------|------|
| 小手机 | < 480px | iPhone SE | 单列布局 |
| 手机 | 480-768px | iPhone 12 Pro | 单/双列 |
| 平板 | 768-992px | iPad | 双/三列 |
| 桌面 | 992px+ | 笔记本 | 多列布局 |
| 宽屏 | 1200px+ | 27" 显示器 | 最大化内容 |

### 使用 useResponsive Hook

```vue
<template>
  <div>
    <!-- 根据屏幕宽度调整布局 -->
    <div v-if="isMobile" class="mobile-layout">
      <!-- 移动端布局 -->
    </div>
    
    <div v-else-if="isTablet" class="tablet-layout">
      <!-- 平板布局 -->
    </div>
    
    <div v-else class="desktop-layout">
      <!-- 桌面布局 -->
    </div>
  </div>
</template>

<script setup>
import { useResponsive } from '@/composables/useResponsive'

const { isMobile, isTablet, isDesktop } = useResponsive()
</script>
```

### 响应式 CSS

```css
/* 移动优先方式 */
.card {
  display: flex;
  flex-direction: column;  /* 移动端竖排 */
  gap: 12px;
  padding: 12px;
}

@media (min-width: 768px) {
  .card {
    flex-direction: row;   /* 平板及以上横排 */
    gap: 16px;
    padding: 16px;
  }
}

@media (min-width: 992px) {
  .card {
    gap: 20px;
    padding: 20px;
  }
}
```

---

## 🎯 移动端最佳实践

### 1. **触摸友好**
```vue
<!-- ❌ 不好：点击区域太小 -->
<button class="small-btn">点击</button>

<!-- ✅ 好：最小 44x44px 点击区域 -->
<button class="touch-btn">点击</button>

<style>
@media (max-width: 768px) {
  .touch-btn {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 16px;
  }
}
</style>
```

### 2. **字体大小 (防止 iOS 自动放大)**
```css
/* 移动端输入框必须最小 16px */
input, select, textarea {
  font-size: 16px;  /* 避免 iOS Safari 自动放大 */
}
```

### 3. **视口设置 (HTML)**
```html
<!-- 确保响应式工作 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

### 4. **Flexbox 布局**
```css
/* 移动端优先 */
.flex-container {
  display: flex;
  flex-direction: column;  /* 移动端竖排 */
  gap: 12px;
}

@media (min-width: 768px) {
  .flex-container {
    flex-direction: row;   /* 平板及以上横排 */
  }
}
```

### 5. **栅格布局**
```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr;  /* 移动端单列 */
  gap: 12px;
}

@media (min-width: 576px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);  /* 小屏双列 */
  }
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);  /* 平板三列 */
  }
}

@media (min-width: 992px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);  /* 桌面四列 */
  }
}
```

### 6. **隐显控制**
```css
/* 移动端隐藏 */
.hidden-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hidden-mobile {
    display: block;
  }
}

/* 桌面端隐藏 */
.hidden-desktop {
  display: block;
}

@media (min-width: 768px) {
  .hidden-desktop {
    display: none;
  }
}
```

### 7. **间距响应式**
```css
.section {
  padding: 12px;      /* 移动端小间距 */
  margin: 8px 0;
}

@media (min-width: 768px) {
  .section {
    padding: 20px;    /* 平板及以上大间距 */
    margin: 16px 0;
  }
}

@media (min-width: 992px) {
  .section {
    padding: 24px;
    margin: 20px 0;
  }
}
```

---

## 🛠️ 简历定制化工具

### 使用 useResponsiveLayout

```vue
<script setup>
import { useResponsiveLayout } from '@/composables/useResponsive'

const { gridColumns, gap, padding } = useResponsiveLayout()
</script>

<template>
  <div :style="{ display: 'grid', gridTemplateColumns: `repeat(${gridColumns}, 1fr)`, gap }">
    <!-- 根据屏幕宽度自动调整列数 -->
    <div v-for="item in items" :key="item.id" :style="{ padding }">
      {{ item.name }}
    </div>
  </div>
</template>
```

### 简历预览响应式

```vue
<template>
  <div class="resume-preview" :class="deviceType">
    <!-- 移动端: 100% 宽度 -->
    <!-- 平板: 适配宽度 -->
    <!-- 桌面: 固定宽度 + 侧栏 -->
  </div>
</template>

<script setup>
import { useResponsive } from '@/composables/useResponsive'

const { deviceType, isMobile, isTablet, isDesktop } = useResponsive()
</script>

<style scoped>
.resume-preview {
  width: 100%;
  max-width: 100%;
}

.resume-preview.tablet {
  max-width: 600px;
  margin: 0 auto;
}

.resume-preview.desktop {
  max-width: 800px;
  margin: 0 auto;
}

.resume-preview.wide {
  max-width: 900px;
  margin: 0 auto;
}
</style>
```

---

## 📊 简历样式定制

### 主题色定制

```vue
<script setup>
import { colors } from '@/styles/designSystem'

// 使用设计系统的颜色
const themeColor = colors.primary
const accentColor = colors.success
</script>

<style :scoped="{ '--theme-color': themeColor }">
.resume {
  --primary: var(--theme-color);
  --accent: v-bind(accentColor);
}
</style>
```

### 字体定制

```javascript
// 支持的字体
const fonts = [
  'Noto Sans SC',
  'Source Han Sans',
  'PingFang SC',
  'Microsoft YaHei',
  'SimSun',
]

// 使用
const selectedFont = 'Noto Sans SC'
```

### 布局定制

```javascript
// 支持的布局
const layouts = [
  { id: 'single-column', name: '单列布局' },
  { id: 'two-column', name: '两列布局' },
  { id: 'card', name: '卡片布局' },
  { id: 'modern', name: '现代布局' },
]
```

---

## ✅ 检查清单

在提交设计之前，请检查以下项目：

### 移动端检查
- [ ] 在 375px 手机上正确显示
- [ ] 在 576px 大手机上正确显示
- [ ] 所有按钮最小 44x44px
- [ ] 输入框字体 ≥ 16px
- [ ] 没有横向滚动条
- [ ] 间距合理，不拥挤

### 平板检查
- [ ] 在 768px 平板上正确显示
- [ ] 内容宽度不超过 720px
- [ ] 布局充分利用宽度

### 桌面检查
- [ ] 在 992px 桌面上正确显示
- [ ] 在 1200px 宽屏上正确显示
- [ ] 内容宽度不超过 1200px
- [ ] 侧栏适配宽度

### 通用检查
- [ ] 颜色对比度 WCAG AA 以上
- [ ] 字体大小清晰易读
- [ ] 交互反馈明确
- [ ] 打印样式正确

---

## 🎓 设计系统使用示例

### 示例 1: 响应式卡片

```vue
<template>
  <div class="card" :style="cardStyle">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResponsiveLayout } from '@/composables/useResponsive'

const { padding, gap } = useResponsiveLayout()

const cardStyle = computed(() => ({
  padding: padding.value,
  gap: gap.value,
}))
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
</style>
```

### 示例 2: 响应式网格

```vue
<template>
  <div class="grid" :style="gridStyle">
    <div v-for="item in items" :key="item.id" class="grid-item">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { useResponsiveLayout } from '@/composables/useResponsive'

const { gridColumns, gap } = useResponsiveLayout()

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridColumns.value}, 1fr)`,
  gap: gap.value,
}))
</script>
```

---

## 📞 常见问题

**Q: 如何在 Vue 中使用 useResponsive？**
A: 导入 hook，然后在 computed 或 template 中使用响应式值

**Q: 移动端为什么需要 44px 按钮？**
A: Apple HIG 建议最小触摸目标 44x44pt，防止误触

**Q: 如何测试响应式设计？**
A: 使用 Chrome DevTools，选择不同设备预设进行测试

**Q: 简历在手机上显示效果如何？**
A: 单列布局，字体合理缩放，保持可读性

---

*设计系统版本: 1.0*  
*最后更新: 2026-05-26*
