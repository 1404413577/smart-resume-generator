# 路由切换错误 - 快速修复参考

## 🎯 问题症状

```
TypeError: Cannot read properties of null (reading 'parentNode')
```

当从一个路由页面切换到另一个页面时报错。

---

## ✅ 已应用的修复

### 1. **AppLayout.vue** 
- ✅ 添加了 `Suspense` 包装器处理异步加载
- ✅ 添加了 `Transition` 组件用于平滑动画
- ✅ 使用 `:key="$route.path"` 强制重建组件

### 2. **AIAssistantView.vue**
- ✅ 添加了 `isMounted` 状态标志
- ✅ 异步操作前后检查组件状态
- ✅ 修复了 `scrollToBottom()` 的 DOM 访问

### 3. **TemplatesView.vue & DesignView.vue**
- ✅ 添加了 `onBeforeUnmount` 钩子
- ✅ 组件卸载时清理弹窗状态

### 4. **App.vue**
- ✅ 添加了全局 `onErrorCaptured` 处理器
- ✅ 捕获并隔离 parentNode 错误

### 5. **main.js**
- ✅ 添加了 `app.config.errorHandler`
- ✅ 添加了 `app.config.warnHandler`

### 6. **router/index.js**
- ✅ 改进了异步组件加载错误处理
- ✅ 添加了 `BASE_URL` 支持

---

## 🧪 验证修复

打开浏览器开发者工具 (F12)，执行以下测试：

```javascript
// 1. 快速切换路由
console.log('开始快速切换测试...')
// 多次点击导航链接

// 2. 检查是否有错误
// 应该看到 "Router navigation: ... -> ..." 的日志，但无 parentNode 错误

// 3. 检查 Suspense 加载状态
// 切换页面时应看到"加载中..."提示
```

---

## 📋 修改清单

| 文件 | 修改内容 |
|------|--------|
| `src/components/layout/AppLayout.vue` | ✅ 添加 Suspense + Transition |
| `src/views/AIAssistantView.vue` | ✅ 添加 isMounted 检查 |
| `src/views/TemplatesView.vue` | ✅ 添加 onBeforeUnmount |
| `src/views/DesignView.vue` | ✅ 添加 onBeforeUnmount |
| `src/App.vue` | ✅ 添加错误捕获 |
| `src/main.js` | ✅ 添加全局错误处理 |
| `src/router/index.js` | ✅ 改进加载处理 |

---

## 🔍 如果问题仍存在

1. **清除浏览器缓存**
   - 按 `Ctrl+Shift+Delete` 打开缓存清空页面
   - 选择"所有时间"并清空

2. **重新加载页面**
   - 按 `Ctrl+Shift+R` 进行硬刷新

3. **检查控制台**
   - F12 打开开发者工具
   - 在 Console 标签中查找错误信息
   - 记录下完整的错误堆栈

4. **检查网络**
   - Network 标签中查看是否有 404 或 5xx 错误
   - 确认 .vue 文件正常加载

---

## 💡 核心原理

**问题根源**: 路由切换时，旧组件卸载速度快，但异步操作仍在进行，导致访问已销毁的 DOM。

**解决方案**:
1. 强制销毁和重建组件 (`:key="$route.path"`)
2. 检查组件是否仍挂载 (`isMounted` 标志)
3. 双重检查 DOM 引用 (Ref + nextTick)
4. 全局错误隔离 (errorHandler)

---

## 📞 调试技巧

### 查看路由导航
```
console: Router navigation: / -> /ai-assistant
```

### 查看组件生命周期
```
console: Navigated from Home to AIAssistant
```

### 验证 Suspense 加载
- 切换页面时应看到"加载中..."
- 异步块应在 Network 标签中可见

---

**最后检查**: 2026年3月13日
**状态**: ✅ 所有修复已应用
