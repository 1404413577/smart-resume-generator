# 志愿者快速入门指南

欢迎加入简历编辑器项目！这个指南将帮助您快速开始贡献代码。

## 🚀 5分钟快速开始

### 步骤1：获取代码
```bash
# 克隆项目
git clone https://gitee.com/hailang123/jianli.git
cd jianli

# 切换到协作分支
git checkout contrib/volunteer-contributions
```

### 步骤2：安装和运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 步骤3：创建您的功能分支
```bash
# 创建功能分支（替换为您的功能名称）
git checkout -b feature/my-awesome-feature
```

### 步骤4：开始开发
在浏览器中打开 `http://localhost:5173` 开始开发！

## 🎯 新手推荐任务

### 🎨 简单UI改进（难度：⭐）
- 调整按钮样式和颜色
- 优化间距和布局
- 改进图标和视觉效果
- 修复小的显示问题

### 📝 添加新模板（难度：⭐⭐）
- 复制现有模板文件
- 修改样式和布局
- 在模板选择器中注册
- 测试不同数据的显示效果

### 🔧 功能增强（难度：⭐⭐⭐）
- 添加新的表单字段
- 实现数据验证
- 优化用户交互
- 集成第三方库

### 🐛 Bug修复（难度：⭐⭐）
- 查看Issues列表
- 重现和定位问题
- 编写修复代码
- 验证修复效果

## 📁 项目结构快速了解

```
src/
├── components/
│   ├── templates/          # 简历模板（新手友好）
│   │   ├── ModernTemplate.vue
│   │   ├── ClassicTemplate.vue
│   │   └── MinimalTemplate.vue
│   ├── editors/            # 编辑器组件
│   └── common/             # 通用组件
├── stores/                 # 状态管理
│   └── resume.js          # 主要数据存储
├── styles/                # 样式文件
└── utils/                 # 工具函数
```

## 🛠️ 常用开发命令

```bash
# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 代码格式化
npm run format

# 类型检查
npm run type-check

# 预览构建结果
npm run preview
```

## 📝 第一次贡献示例

让我们通过一个简单的例子来演示完整流程：

### 示例：添加新的按钮颜色

1. **创建分支**
```bash
git checkout -b feature/add-button-colors
```

2. **修改代码**
找到按钮组件，添加新的颜色选项：
```vue
<!-- 在相关组件中添加新的按钮样式 -->
<el-button type="success">新颜色按钮</el-button>
```

3. **测试功能**
```bash
npm run dev
# 在浏览器中测试新按钮
```

4. **提交代码**
```bash
git add .
git commit -m "feat: 添加新的按钮颜色选项"
git push origin feature/add-button-colors
```

5. **创建Pull Request**
- 在Gitee上创建PR
- 目标分支：`contrib/volunteer-contributions`
- 填写PR描述

## 🎨 开发技巧

### Vue.js开发
- 使用Composition API
- 组件名使用PascalCase
- Props定义要完整
- 使用响应式数据

### 样式开发
- 使用scoped样式
- 遵循BEM命名规范
- 考虑响应式设计
- 保持样式一致性

### 调试技巧
- 使用Vue DevTools
- 浏览器开发者工具
- Console.log调试
- 网络请求检查

## 🤝 获得帮助

### 文档资源
- [Vue.js官方文档](https://vuejs.org/)
- [Element Plus组件库](https://element-plus.org/)
- [项目贡献指南](../CONTRIBUTING.md)

### 社区支持
- 在Issues中提问
- 参与PR讨论
- 联系项目维护者
- 查看现有代码示例

### 常见问题
**Q: 我不熟悉Vue.js，可以参与吗？**
A: 当然可以！从简单的样式修改开始，逐步学习。

**Q: 如何知道哪些任务适合新手？**
A: 查看Issues中标记为"good first issue"的任务。

**Q: 我的PR被拒绝了怎么办？**
A: 不要气馁！根据反馈修改代码，这是学习的好机会。

**Q: 可以同时开发多个功能吗？**
A: 建议一次专注一个功能，完成后再开始下一个。

## 🎉 贡献成功！

当您的PR被合并后：
1. 您的名字会出现在贡献者列表中
2. 可以在简历中展示这个开源项目经验
3. 获得了宝贵的实际开发经验
4. 为开源社区做出了贡献

## 📞 联系我们

- **Issues**: 报告Bug或提出建议
- **Pull Requests**: 代码贡献和讨论
- **Email**: 联系项目维护者

---

**开始您的开源贡献之旅吧！** 🚀

每一个小的改进都让项目变得更好，我们期待您的参与！
