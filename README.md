# Vue 3 + Vite

# 智能简历生成器

一个基于Vue.js的现代化简历生成Web应用，支持实时预览、多种模板和PDF导出功能。

## ✨ 主要功能

### 📝 智能表单系统
- **个人信息管理** - 姓名、联系方式、社交链接等
- **个人简介** - 内置模板快速生成专业简介
- **工作经历** - 支持多份工作经历，详细职责描述
- **教育背景** - 学历、专业、成绩、荣誉等信息
- **技能特长** - 分类管理技术技能、软技能和语言能力
- **项目经历** - 项目描述、技术栈、链接等

### 🎨 多样化模板
- **现代风格** - 渐变色彩，现代化设计
- **经典风格** - 传统商务风格，适合正式场合

### 💾 数据管理
- **自动保存** - 每3秒自动保存到本地存储
- **简历管理** - 保存多份简历，随时切换编辑
- **数据导入导出** - 支持JSON格式数据备份和恢复

### 📱 用户体验
- **实时预览** - 输入即时反映在简历预览中
- **响应式设计** - 支持桌面和移动设备
- **PDF导出** - 一键生成高质量PDF简历

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 🤝 参与贡献

我们欢迎志愿者参与项目开发！

### 🌿 协作分支
- **主分支**: `master` - 稳定版本
- **协作分支**: `contrib/volunteer-contributions` - 志愿者开发分支

### 📋 贡献流程
1. 从协作分支创建功能分支
2. 开发您的功能或修复
3. 提交Pull Request到协作分支
4. 经过代码审查后合并

### 📚 贡献指南
- 查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细贡献指南
- 查看 [志愿者工作流程](./docs/VOLUNTEER_WORKFLOW.md) 了解协作流程
- 遵循代码规范和提交规范

### 🎯 贡献方向
- 🎨 新增简历模板
- 🔧 功能开发和优化
- 🐛 Bug修复
- 📚 文档和测试完善

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **PDF生成**: jsPDF + html2canvas
- **文件下载**: FileSaver.js

## 📖 使用指南

### 1. 填写个人信息
在左侧表单中依次填写：
- 基本个人信息（姓名、邮箱、电话等）
- 个人简介（可使用快速模板）
- 工作经历（支持添加多份）
- 教育背景
- 技能特长（分类管理）
- 项目经历

### 2. 选择简历模板
在右侧预览区域顶部选择喜欢的模板风格：
- 现代风格：适合互联网、设计等行业
- 经典风格：适合传统行业、正式场合
- 简约风格：适合追求简洁的用户

### 3. 实时预览
右侧会实时显示简历效果，所有修改都会立即反映在预览中。

### 4. 保存和管理
- 点击"简历管理"可以保存当前简历
- 支持保存多份不同版本的简历
- 可以随时加载之前保存的简历进行编辑

### 5. 导出PDF
点击"下载PDF"按钮即可生成高质量的PDF简历文件。

## 💡 特色功能

### 自动保存
- 应用会每3秒自动保存您的输入
- 即使意外关闭浏览器，数据也不会丢失
- 顶部显示自动保存状态和最后保存时间

### 智能模板
- 个人简介提供多种职业模板
- 技能管理支持快速添加常用技能
- 表单验证确保信息完整性

### 数据安全
- 所有数据存储在本地浏览器中
- 支持数据导出备份
- 可以导入之前的数据文件

## 🔧 开发说明

### 项目结构
```
src/
├── components/          # 组件目录
│   ├── forms/          # 表单组件
│   ├── templates/      # 简历模板
│   ├── ResumeBuilder.vue
│   └── ResumeManager.vue
├── stores/             # Pinia状态管理
│   └── resume.js
├── utils/              # 工具函数
│   └── pdfGenerator.js
└── main.js            # 应用入口
```

### 自定义模板
要添加新的简历模板：
1. 在 `src/components/templates/` 创建新的模板组件
2. 在 `ResumeBuilder.vue` 中注册新模板
3. 更新模板选择器

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！ The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
