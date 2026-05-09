# 🎯 快速查看"使用默认数据"按钮

## 按钮位置

**"使用默认数据"按钮** 位置：
```
简历生成器页面
    ↓
左侧导航栏（深灰色背景）
    ↓
最底部
    ↓
【使用默认数据】按钮
```

## 视觉描述

该按钮应该显示为：
- **位置**：左侧导航栏的最底部
- **颜色**：蓝色按钮（主色调）
- **图标**：文件夹复制图标 📄
- **文本**："使用默认数据"
- **宽度**：占满整个导航栏宽度
- **高度**：约 36px

## 如何使用

### 步骤 1：打开简历生成器
```
访问: /resume-builder 
或点击导航栏中的"简历生成器"
```

### 步骤 2：找到按钮
```
在左侧导航栏底部向下滚动（如果需要）
找到蓝色的"使用默认数据"按钮
```

### 步骤 3：点击按钮
```
点击【使用默认数据】按钮
```

### 步骤 4：确认操作
```
会弹出一个对话框：
标题：警告
内容：这将使用示例数据填充整个简历，现有数据将被覆盖。是否继续？
选择：【确认填充】或【取消】
```

### 步骤 5：查看结果
```
如果点击"确认填充"：
✓ 页面右上角会出现绿色成功提示信息
✓ 所有编辑模块（个人信息、工作经历等）将被填充示例数据
✓ 预览窗口将显示更新的简历

如果点击"取消"：
✗ 操作被取消，现有数据保持不变
```

## 故障排查

### 问题 1：看不到按钮

**可能原因：**
- 导航栏被隐藏或折叠
- 按钮在导航栏外（需要向下滚动）
- 浏览器缓存问题

**解决方案：**
```
1. 刷新页面：Ctrl + F5 (强制刷新清除缓存)
2. 向下滚动左侧导航栏
3. 检查浏览器控制台是否有错误
4. 尝试不同的浏览器
```

### 问题 2：按钮不可点击

**可能原因：**
- 页面仍在加载中
- JavaScript 加载失败
- Store 初始化不完整

**解决方案：**
```
1. 等待页面完全加载（检查网络标签）
2. 打开浏览器控制台 (F12) 检查是否有错误
3. 清除浏览器 LocalStorage：
   - 打开开发者工具
   - Application → LocalStorage → 删除当前域的记录
   - 刷新页面
```

### 问题 3：点击后没有反应

**可能原因：**
- Store 方法未正确调用
- 数据持久化失败
- 浏览器 IndexedDB 容量满

**解决方案：**
```
1. 打开浏览器控制台 (F12)
2. 查看 Console 标签中的错误信息
3. 检查 IndexedDB 使用情况：
   - Application → IndexedDB → 查看存储容量
   - 如果满了，清除旧数据
4. 尝试使用开发者工具的 Console 直接调用：
   resumeStore.fillWithDefaultData()
```

## 技术细节

### 组件结构
```
NavigationPanel.vue (导航面板)
├── AIActionButtons.vue (AI功能区)
├── ModuleNavigation.vue (模块导航，占用中间区域)
└── ActionButtons.vue (底部按钮区) ← 包含"使用默认数据"按钮
```

### 按钮的事件流
```
点击按钮
  ↓
handleFillDefault() 被触发
  ↓
resumeStore.fillWithDefaultData() 被调用
  ↓
resumeData 被更新为默认数据
  ↓
persistData() 自动保存
  ↓
显示成功消息
  ↓
UI 自动刷新显示新数据
```

### 按钮的 CSS 布局
```
.navigation-panel {
  display: flex;
  flex-direction: column;
}

.action-section {
  flex-shrink: 0;  ← 确保不会被压缩
  border-top: 1px solid #e4e7ed;
}
```

## 浏览器开发者工具检查

如果仍看不到按钮，在浏览器控制台执行以下代码查看是否正确渲染：

```javascript
// 检查 ActionButtons 组件是否存在
const actionButtons = document.querySelector('.action-buttons')
console.log('ActionButtons 元素:', actionButtons)

// 检查按钮是否存在
const fillBtn = document.querySelector('.fill-default-btn')
console.log('填充按钮:', fillBtn)

// 检查导航栏结构
const navPanel = document.querySelector('.navigation-panel')
console.log('导航栏元素:', navPanel)
console.log('导航栏子元素数量:', navPanel?.children.length)

// 打印所有子元素
Array.from(navPanel?.children || []).forEach((child, i) => {
  console.log(`子元素 ${i}:`, child.className)
})
```

## 预期数据示例

点击"使用默认数据"后，您将看到以下示例内容：

**个人信息：**
- 姓名：张三
- 邮箱：zhangsan@example.com
- 电话：138-0000-0000

**工作经历：**
- 2条工作经历（公司、职位、时间段等）

**技能特长：**
- 8个技能（JavaScript、Vue.js、React 等）

**项目经历：**
- 1个项目示例

**教育背景、证书、语言等其他信息也都会被填充**

## 联系支持

如果按钮仍然无法显示或使用，请检查以下日志：

```bash
# 在项目目录中运行
npm run build

# 检查构建输出中是否有错误
# 如果有错误，清理并重新构建
rm -rf dist node_modules
npm install
npm run build
```

---

**更新时间**：2026年5月9日  
**按钮类型**：主要功能按钮  
**优先级**：高（对新用户体验很重要）
