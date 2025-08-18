# 模板样式自定义功能

## 功能概述

实现了模板样式的完全可定制化，允许用户在选择任何预设模板后，仍能通过左侧边栏的"样式设置"面板自定义样式参数。

## 核心特性

### 1. 模板样式可定制化
- ✅ 用户可在任何预设模板下自定义颜色、字体、间距
- ✅ 模板作为基础布局，样式参数可独立调整
- ✅ 支持所有模板类型（Modern、Classic、Creative、Minimalist、Professional、Academic、Tech）

### 2. 样式继承与覆盖机制
- ✅ 预设模板提供默认样式作为起点
- ✅ 用户自定义样式覆盖模板默认样式
- ✅ 样式优先级：用户自定义 > 模板默认 > 系统默认

### 3. 实时预览更新
- ✅ 修改样式设置时右侧预览区域立即反映变化
- ✅ 所见即所得的编辑体验
- ✅ 样式修改不破坏模板基本布局结构

### 4. 样式持久化
- ✅ 保存用户的样式自定义设置到 localStorage
- ✅ 切换模板时保持相应的自定义样式配置

## 技术实现

### 核心文件

#### 1. `src/utils/styleUtils.js`
- `mergeTemplateStyles()` - 合并模板样式和全局设置
- `generateCSSVariables()` - 生成统一的CSS变量
- `applyCSSVariables()` - 应用CSS变量到DOM元素

#### 2. `src/composables/useTemplateStyles.js`
- `useTemplateStyles()` - 模板样式管理主要钩子
- `useTemplateComponentStyles()` - 模板组件专用样式钩子

#### 3. `src/composables/useGlobalStyles.js`
- 监听全局设置和模板变化
- 自动应用合并后的样式到预览区域

#### 4. 模板组件更新
- 所有模板组件使用 `useTemplateComponentStyles()`
- 统一的CSS变量命名规范
- 保持模板布局结构不变

### 样式合并逻辑

```javascript
// 样式优先级
const mergedColors = {
  ...defaultStyles,      // 系统默认
  ...templateStyles,     // 模板默认
  ...userStyles         // 用户自定义（最高优先级）
}
```

### CSS变量系统

```css
/* 统一的CSS变量命名 */
--primary-color: #409eff;
--secondary-color: #67c23a;
--accent-color: #e6a23c;
--text-color: #303133;
--background-color: #ffffff;
--resume-base-font-size: 14px;
--resume-title-font-size: 18px;
/* ... 更多变量 */
```

## 使用方法

### 用户操作流程

1. **选择模板**：在左侧边栏"模板设置"中选择任意模板
2. **自定义样式**：在左侧边栏"样式设置"中调整：
   - 主题配色（预设或自定义颜色）
   - 字体设置（基础字号、标题字号、行高）
   - 间距设置（页面边距、模块间距）
3. **实时预览**：右侧预览区域立即显示修改效果
4. **自动保存**：所有设置自动保存到本地存储

### 开发者集成

```vue
<template>
  <div class="template" :style="templateStyles">
    <!-- 模板内容 -->
  </div>
</template>

<script setup>
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  templateId: String,
  resumeData: Object
})

// 获取合并后的样式
const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>
```

## 兼容性

### 向后兼容
- ✅ 保持现有模板组件API不变
- ✅ 支持旧的CSS变量命名
- ✅ 不影响现有的样式定义

### 浏览器支持
- ✅ 支持CSS自定义属性的现代浏览器
- ✅ Chrome 49+, Firefox 31+, Safari 9.1+

## 调试信息

开发模式下，控制台会输出样式合并的调试信息：

```javascript
Template styles merged: {
  templateId: "modern",
  templateColors: { primary: "#2563eb", ... },
  globalTheme: { primary: "#409eff", ... },
  mergedResult: { primary: "#409eff", ... }
}
```

## 故障排除

### 常见问题

1. **样式不生效**
   - 检查CSS变量是否正确应用到DOM元素
   - 确认模板组件使用了 `useTemplateComponentStyles()`

2. **预览不更新**
   - 检查 `useGlobalStyles()` 是否在主组件中调用
   - 确认样式变化监听器正常工作

3. **样式冲突**
   - 检查CSS特异性和优先级
   - 确认CSS变量命名一致性
