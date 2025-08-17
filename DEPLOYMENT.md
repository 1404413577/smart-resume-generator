# 简历编辑器部署指南

## 🚀 推荐部署平台

### 1. Vercel (推荐) ⭐⭐⭐⭐⭐

**优势**：
- 专为前端项目设计，完美支持Vue/Vite
- 自动CI/CD，推送代码即部署
- 全球CDN，访问速度快
- 免费额度充足

**部署步骤**：
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 导入您的GitHub仓库
5. Vercel会自动检测为Vite项目
6. 点击 "Deploy" 开始部署

**自定义域名**：
- 在项目设置中添加自定义域名
- 配置DNS记录指向Vercel

### 2. Netlify ⭐⭐⭐⭐⭐

**优势**：
- 功能强大，支持表单处理
- 分支预览功能
- 自定义域名支持

**部署步骤**：
1. 访问 [netlify.com](https://netlify.com)
2. 使用GitHub账号登录
3. 点击 "New site from Git"
4. 选择您的GitHub仓库
5. 构建设置会自动检测
6. 点击 "Deploy site"

### 3. GitHub Pages ⭐⭐⭐⭐

**适合**：开源项目展示

**部署步骤**：
1. 在GitHub仓库中启用Pages
2. 选择 "GitHub Actions" 作为源
3. 创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 📋 部署前准备

### 1. 环境变量配置

创建 `.env.production` 文件：
```env
VITE_APP_TITLE=简历编辑器
VITE_BASE_URL=https://your-domain.com
VITE_ENABLE_ANALYTICS=true
```

### 2. 构建优化

项目已配置：
- ✅ 代码分割和压缩
- ✅ 静态资源优化
- ✅ SEO优化
- ✅ PWA支持

### 3. 域名配置

**免费域名选项**：
- `your-project.vercel.app` (Vercel)
- `your-project.netlify.app` (Netlify)
- `username.github.io/repo-name` (GitHub Pages)

**自定义域名**：
- 购买域名（推荐：Cloudflare、阿里云）
- 配置DNS记录
- 启用HTTPS（平台自动提供）

## 🛠️ 本地部署测试

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview

# 访问 http://localhost:4173
```

## 📊 部署后优化

### 1. 性能监控
- 使用 Google PageSpeed Insights 测试
- 监控 Core Web Vitals 指标
- 设置 Google Analytics（可选）

### 2. SEO优化
- 提交网站地图到搜索引擎
- 配置 Google Search Console
- 优化社交媒体分享

### 3. 用户反馈
- 添加用户反馈功能
- 监控错误日志
- 收集使用数据

## 🔧 故障排除

### 常见问题

**1. 构建失败**
```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

**2. 路由404错误**
- 确保配置了SPA重定向规则
- 检查 `vercel.json` 或 `netlify.toml` 配置

**3. 静态资源加载失败**
- 检查 `base` 配置在 `vite.config.js`
- 确保资源路径正确

### 部署日志查看
- **Vercel**: 项目面板 → Functions → View Logs
- **Netlify**: Site overview → Deploys → 点击具体部署
- **GitHub Pages**: Actions 标签页查看工作流

## 📈 推荐部署流程

1. **开发阶段**：本地开发和测试
2. **预发布**：部署到测试环境（分支预览）
3. **生产发布**：合并到主分支自动部署
4. **监控维护**：性能监控和用户反馈

## 🎯 最佳实践

- ✅ 使用版本控制管理代码
- ✅ 设置自动化CI/CD流程
- ✅ 配置环境变量管理
- ✅ 启用HTTPS和安全头
- ✅ 定期备份和更新依赖
- ✅ 监控网站性能和可用性

选择适合您需求的平台开始部署吧！推荐从 Vercel 开始，操作最简单且效果最好。
