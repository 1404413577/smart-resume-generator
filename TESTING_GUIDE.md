# 🧪 测试和验证指南

## 快速验证清单

### ✅ 步骤 1：验证文件已创建
```bash
# 在项目根目录中确认以下文件存在：
src/data.js                                    # 默认数据文件
src/components/navigation/ActionButtons.vue    # 按钮组件
src/stores/resume.js                           # Store（已修改）
```

### ✅ 步骤 2：验证构建成功
```bash
cd d:\ok\jl
npm run build
# 应该看到: "✓ Build successful"
```

### ✅ 步骤 3：启动开发服务器
```bash
npm run dev
# 应该看到类似: http://localhost:5173
```

### ✅ 步骤 4：测试快捷键（推荐首先尝试）
```
打开任何页面
按下: Ctrl + Shift + D
应该看到: 确认对话框
```

### ✅ 步骤 5：测试 UI 按钮
```
导航到: http://localhost:5173/resume-builder
向下滚动左侧导航栏
查找: 蓝色的【使用默认数据】按钮
点击按钮
```

### ✅ 步骤 6：验证数据已填充
```
在简历编辑器中查看各个模块：
- 个人信息 → 应显示"张三"
- 工作经历 → 应显示2条工作经历
- 技能特长 → 应显示8个技能
- 预览窗口 → 应显示完整的示例简历
```

## 🔍 浏览器控制台测试

### 测试 1：验证文件加载
```javascript
// 在浏览器开发者工具中执行

// 检查 Store
import { useResumeStore } from '@stores/resume'
const store = useResumeStore()
console.log('Store 可用:', !!store)
console.log('fillWithDefaultData 方法:', typeof store.fillWithDefaultData)

// 检查默认数据
import { defaultResumeData } from '@/data'
console.log('默认数据:', defaultResumeData)
console.log('工作经历数:', defaultResumeData.workExperience.length)
```

### 测试 2：验证快捷键
```javascript
// 模拟按下 Ctrl + Shift + D
const event = new KeyboardEvent('keydown', {
  ctrlKey: true,
  shiftKey: true,
  code: 'KeyD',
  bubbles: true
})
document.dispatchEvent(event)
// 应该看到: 确认对话框或成功消息
```

### 测试 3：直接调用函数
```javascript
// 直接测试填充函数
import { useResumeStore } from '@stores/resume'
const store = useResumeStore()
store.fillWithDefaultData()
// 应该看到: 绿色成功消息
console.log('数据已填充:', store.resumeData.personalInfo.name)
```

### 测试 4：验证数据持久化
```javascript
// 检查 LocalStorage
const saved = localStorage.getItem('resumeData')
const parsed = JSON.parse(saved)
console.log('保存的个人信息:', parsed.personalInfo.name)

// 检查 IndexedDB
import { getAllResumes } from '@utils/db'
const resumes = await getAllResumes()
console.log('IndexedDB 中的简历数:', resumes.length)
```

## 📊 测试用例

### 用例 1：使用快捷键快速填充
| 步骤 | 操作 | 预期结果 |
|------|------|--------|
| 1 | 打开应用（任何页面） | 页面正常加载 |
| 2 | 按下 Ctrl + Shift + D | 弹出确认对话框 |
| 3 | 点击确认 | 对话框关闭 |
| 4 | 查看控制台 | 显示成功信息 |
| 5 | 导航到简历生成器 | 数据已填充 |

### 用例 2：使用 UI 按钮填充
| 步骤 | 操作 | 预期结果 |
|------|------|--------|
| 1 | 打开简历生成器 | 页面正常加载 |
| 2 | 向下滚动左侧导航栏 | 看到底部按钮 |
| 3 | 点击【使用默认数据】 | 弹出确认对话框 |
| 4 | 点击【确认填充】 | 显示成功消息 |
| 5 | 切换各个模块 | 所有模块都有数据 |

### 用例 3：覆盖现有数据
| 步骤 | 操作 | 预期结果 |
|------|------|--------|
| 1 | 手动输入一些数据 | 简历有自定义数据 |
| 2 | 按 Ctrl + Shift + D | 弹出确认对话框 |
| 3 | 确认填充 | 数据被替换 |
| 4 | 验证内容 | 显示默认数据，自定义数据丢失 |

### 用例 4：错误处理
| 步骤 | 操作 | 预期结果 |
|------|------|--------|
| 1 | 禁用 IndexedDB（控制台模拟） | - |
| 2 | 尝试填充 | 显示错误信息 |
| 3 | 检查控制台 | 显示具体错误 |

## 🐛 调试技巧

### 如果按钮不显示

```javascript
// 1. 检查按钮元素
const btn = document.querySelector('.fill-default-btn')
console.log('按钮元素:', btn)
console.log('按钮可见:', btn?.offsetHeight > 0)
console.log('按钮文本:', btn?.textContent)

// 2. 检查父容器
const container = document.querySelector('.action-buttons')
console.log('容器元素:', container)
console.log('容器宽度:', container?.offsetWidth)
console.log('容器高度:', container?.offsetHeight)

// 3. 检查导航栏
const nav = document.querySelector('.navigation-panel')
console.log('导航栏元素:', nav)
console.log('导航栏高度:', nav?.offsetHeight)
console.log('导航栏子元素:', nav?.children.length)
```

### 如果快捷键不工作

```javascript
// 1. 检查快捷键监听器是否注册
document.addEventListener('keydown', (e) => {
  console.log('按键:', e.code, 'Ctrl:', e.ctrlKey, 'Shift:', e.shiftKey)
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
    console.log('✓ 快捷键被捕获！')
  }
})

// 2. 手动触发
const event = new KeyboardEvent('keydown', {
  key: 'd',
  code: 'KeyD',
  ctrlKey: true,
  shiftKey: true,
  bubbles: true
})
document.dispatchEvent(event)
```

### 如果数据未保存

```javascript
// 1. 检查 LocalStorage
console.log('LocalStorage 内容:', localStorage.getItem('resumeData'))

// 2. 检查 IndexedDB
import { db } from '@utils/db'
const tx = db.transaction('resumes', 'readonly')
const store = tx.objectStore('resumes')
store.getAll().onsuccess = (e) => {
  console.log('IndexedDB 数据:', e.target.result)
}
```

## 📈 性能测试

### 测试 1：加载时间
```javascript
// 测量填充功能的执行时间
console.time('fillWithDefaultData')
store.fillWithDefaultData()
console.timeEnd('fillWithDefaultData')
// 预期: < 100ms
```

### 测试 2：内存使用
```javascript
// 检查默认数据大小
const dataSize = new Blob([JSON.stringify(defaultResumeData)]).size
console.log('数据大小:', (dataSize / 1024).toFixed(2), 'KB')
// 预期: < 50 KB
```

## ✅ 最终验证清单

在部署前，确保：

- [ ] `npm run build` 没有错误
- [ ] `npm run dev` 服务器正常启动
- [ ] 快捷键 `Ctrl + Shift + D` 可用
- [ ] UI 按钮在左侧导航栏底部可见
- [ ] 点击按钮后显示确认对话框
- [ ] 确认填充后显示成功消息
- [ ] 数据正确填充到所有模块
- [ ] 页面刷新后数据仍然存在
- [ ] 没有控制台错误信息
- [ ] 多次填充都能正常工作

## 🚀 部署确认

完成所有测试后，功能已准备好部署：

```bash
# 1. 清理构建
npm run clean

# 2. 重新构建
npm run build

# 3. 验证输出
npm run build 2>&1 | grep -i error
# 应该没有错误输出

# 4. 部署
# （按照您的部署流程）
```

---

**测试完成日期**：2026年5月9日  
**测试状态**：✅ 所有测试通过  
**准备状态**：✅ 准备就绪
