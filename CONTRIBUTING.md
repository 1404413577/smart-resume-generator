# 贡献指南 (Contributing Guide)

欢迎参与简历编辑器项目的开发！我们非常感谢志愿者的贡献。

## 🎯 项目概述

这是一个基于Vue.js的现代化简历编辑器，支持多种模板、实时预览、PDF导出等功能。

## 🌿 分支策略

### 分支结构
- `master` - 主分支（稳定版本，受保护）
- `contrib/volunteer-contributions` - **志愿者协作分支**
- `feature/*` - 功能开发分支
- `bugfix/*` - Bug修复分支

### 协作流程
1. **Fork项目** 或 **克隆协作分支**
2. **创建功能分支** 从`contrib/volunteer-contributions`分支
3. **开发功能** 在您的功能分支上
4. **提交Pull Request** 到`contrib/volunteer-contributions`分支
5. **代码审查** 由项目维护者进行
6. **合并到主分支** 经审查通过后合并

## 🚀 快速开始

### 1. 克隆项目
```bash
# 克隆项目
git clone https://gitee.com/hailang123/jianli.git
cd jianli

# 切换到协作分支
git checkout contrib/volunteer-contributions
```

### 2. 创建功能分支
```bash
# 从协作分支创建您的功能分支
git checkout -b feature/your-feature-name

# 例如：
git checkout -b feature/add-new-template
git checkout -b feature/improve-export
git checkout -b bugfix/fix-layout-issue
```

### 3. 安装依赖
```bash
npm install
```

### 4. 启动开发服务器
```bash
npm run dev
```

## 📝 开发规范

### 代码风格
- 使用ES6+语法
- 遵循Vue.js官方风格指南
- 使用2空格缩进
- 组件名使用PascalCase
- 文件名使用kebab-case

### 提交规范
使用[Conventional Commits](https://www.conventionalcommits.org/)规范：

```bash
# 新功能
git commit -m "feat: 添加新的简历模板"

# Bug修复
git commit -m "fix: 修复PDF导出问题"

# 文档更新
git commit -m "docs: 更新API文档"

# 样式调整
git commit -m "style: 优化模板样式"

# 代码重构
git commit -m "refactor: 重构组件结构"

# 性能优化
git commit -m "perf: 优化渲染性能"

# 测试相关
git commit -m "test: 添加单元测试"
```

### 分支命名规范
- `feature/功能描述` - 新功能开发
- `bugfix/问题描述` - Bug修复
- `docs/文档描述` - 文档更新
- `style/样式描述` - 样式调整
- `refactor/重构描述` - 代码重构

## 🔧 开发指南

### 项目结构
```
src/
├── components/          # Vue组件
│   ├── templates/      # 简历模板
│   ├── editors/        # 编辑器组件
│   └── common/         # 通用组件
├── stores/             # Pinia状态管理
├── utils/              # 工具函数
├── styles/             # 样式文件
└── assets/             # 静态资源
```

### 常见开发任务

#### 添加新模板
1. 在`src/components/templates/`创建新模板组件
2. 在模板选择器中注册新模板
3. 添加模板预览图
4. 编写模板文档

#### 修复Bug
1. 重现问题并记录步骤
2. 定位问题代码
3. 编写修复代码
4. 添加测试用例（如适用）

#### 优化性能
1. 使用Vue DevTools分析性能
2. 优化组件渲染
3. 减少不必要的计算
4. 优化资源加载

## 📋 Pull Request指南

### 提交前检查
- [ ] 代码符合项目风格规范
- [ ] 功能正常工作，无明显Bug
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 测试了不同浏览器兼容性

### PR模板
```markdown
## 功能描述
简要描述您添加的功能或修复的问题

## 变更类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 文档更新
- [ ] 样式调整
- [ ] 代码重构
- [ ] 性能优化

## 测试
描述您如何测试了这些变更

## 截图（如适用）
添加相关截图展示变更效果

## 相关Issue
关联相关的Issue编号
```

## 🤝 社区规范

### 行为准则
- 尊重所有贡献者
- 提供建设性的反馈
- 保持友好和专业的态度
- 欢迎新手参与

### 沟通渠道
- GitHub Issues - 报告Bug和功能请求
- Pull Requests - 代码贡献和讨论
- 项目文档 - 查看详细说明

## 🎁 贡献认可

我们会在以下方式认可您的贡献：
- 在项目README中列出贡献者
- 在发布说明中感谢贡献者
- 为重要贡献者提供项目徽章

## 📞 联系我们

如果您有任何问题或建议，请通过以下方式联系：
- 创建GitHub Issue
- 在Pull Request中留言
- 发送邮件给项目维护者

感谢您的贡献！🎉
