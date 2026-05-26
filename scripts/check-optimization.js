#!/usr/bin/env node

/**
 * 项目优化检查脚本
 * 用于验证所有优化是否已正确实施
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(type, message) {
  const prefix = {
    '✓': `${colors.green}✓${colors.reset}`,
    '✗': `${colors.red}✗${colors.reset}`,
    '⚠': `${colors.yellow}⚠${colors.reset}`,
    'ℹ': `${colors.cyan}ℹ${colors.reset}`
  };
  console.log(`${prefix[type]} ${message}`);
}

console.log(`\n${colors.blue}=== 项目优化检查报告 ===${colors.reset}\n`);

// 检查项 1: vite.config.js
console.log(`${colors.cyan}1. 检查 Vite 构建配置...${colors.reset}`);
const vitePath = path.join(PROJECT_ROOT, 'vite.config.js');
if (fs.existsSync(vitePath)) {
  const viteContent = fs.readFileSync(vitePath, 'utf-8');
  
  // 检查 debugger 配置
  if (viteContent.includes("drop_debugger: process.env.NODE_ENV === 'production'")) {
    log('✓', 'debugger 配置已优化');
  } else {
    log('✗', 'debugger 配置未优化 - 需要修改为环境判断');
  }
  
  // 检查代码分割配置
  if (viteContent.includes('manualChunks')) {
    log('✓', '代码分割配置已启用');
  }
} else {
  log('✗', 'vite.config.js 文件不存在');
}

// 检查项 2: main.js
console.log(`\n${colors.cyan}2. 检查主入口文件...${colors.reset}`);
const mainPath = path.join(PROJECT_ROOT, 'src/main.js');
if (fs.existsSync(mainPath)) {
  const mainContent = fs.readFileSync(mainPath, 'utf-8');
  
  // 检查是否移除了全量 Element Plus
  if (!mainContent.includes('import ElementPlus from') && 
      !mainContent.includes('app.use(ElementPlus)')) {
    log('✓', 'Element Plus 全量导入已移除');
  } else {
    log('✗', 'Element Plus 仍然全量导入 - 需要按需加载');
  }
  
  // 检查是否使用了按需加载
  if (mainContent.includes('registerElementComponents') || 
      mainContent.includes('registerCommonIcons')) {
    log('✓', '按需加载配置已添加');
  } else {
    log('⚠', '未检测到按需加载配置');
  }
  
  // 检查是否全量注册图标
  if (!mainContent.includes('for (const [key, component] of Object.entries(ElementPlusIconsVue))')) {
    log('✓', '全量图标注册已移除');
  } else {
    log('✗', '仍在全量注册所有图标 - 需要改为按需');
  }
} else {
  log('✗', 'src/main.js 文件不存在');
}

// 检查项 3: Element Plus 按需加载配置
console.log(`\n${colors.cyan}3. 检查 Element Plus 按需加载配置...${colors.reset}`);
const elementPath = path.join(PROJECT_ROOT, 'src/utils/elementPlus/index.js');
if (fs.existsSync(elementPath)) {
  const elementContent = fs.readFileSync(elementPath, 'utf-8');
  if (elementContent.includes('registerElementComponents')) {
    log('✓', 'Element Plus 按需加载配置已创建');
    // 计算组件数量
    const componentMatches = elementContent.match(/El[A-Z]/g);
    if (componentMatches) {
      log('ℹ', `已配置 ${componentMatches.length} 个常用组件`);
    }
  } else {
    log('✗', 'Element Plus 配置文件格式不正确');
  }
} else {
  log('✗', 'Element Plus 按需加载配置文件不存在 - 需要创建');
}

// 检查项 4: 图标按需加载配置
console.log(`\n${colors.cyan}4. 检查图标按需加载配置...${colors.reset}`);
const iconsPath = path.join(PROJECT_ROOT, 'src/utils/icons/index.js');
if (fs.existsSync(iconsPath)) {
  const iconsContent = fs.readFileSync(iconsPath, 'utf-8');
  if (iconsContent.includes('registerCommonIcons')) {
    log('✓', '图标按需加载配置已创建');
    // 计算图标数量
    const iconMatches = iconsContent.match(/^  [A-Z]/gm);
    if (iconMatches) {
      log('ℹ', `已配置 ${iconMatches.length} 个常用图标`);
    }
  } else {
    log('✗', '图标配置文件格式不正确');
  }
} else {
  log('✗', '图标按需加载配置文件不存在 - 需要创建');
}

// 检查项 5: HomeView 功能清理
console.log(`\n${colors.cyan}5. 检查 HomeView 功能清理...${colors.reset}`);
const homeViewPath = path.join(PROJECT_ROOT, 'src/views/HomeView.vue');
if (fs.existsSync(homeViewPath)) {
  const homeViewContent = fs.readFileSync(homeViewPath, 'utf-8');
  
  // 检查 AI 功能是否已删除
  if (!homeViewContent.includes('智能对话助手') && 
      !homeViewContent.includes('AdvancedAIResumeGenerator')) {
    log('✓', 'AI 智能简历助手已移除');
  } else {
    log('⚠', '检测到 AI 相关代码仍存在');
  }
  
  // 检查快速操作是否已删除
  if (!homeViewContent.includes('智能优化') && 
      !homeViewContent.includes('职位匹配') &&
      !homeViewContent.includes('质量检查')) {
    log('✓', '快速操作功能已移除');
  } else {
    log('⚠', '检测到快速操作相关代码仍存在');
  }
} else {
  log('✗', 'HomeView.vue 文件不存在');
}

// 检查项 6: 孤立组件
console.log(`\n${colors.cyan}6. 检查孤立组件...${colors.reset}`);
const orphanComponents = [
  'src/components/ai/AITestComponent.vue',
  'src/components/ai/AITestPanel.vue'
];

orphanComponents.forEach(component => {
  const componentPath = path.join(PROJECT_ROOT, component);
  if (fs.existsSync(componentPath)) {
    log('⚠', `检测到孤立组件: ${component} (可考虑删除)`);
  } else {
    log('✓', `${component} 已删除`);
  }
});

// 检查项 7: 文档
console.log(`\n${colors.cyan}7. 检查优化文档...${colors.reset}`);
const docs = [
  'PROJECT_ANALYSIS.md',
  'OPTIMIZATION_PLAN.md',
  'OPTIMIZATION_SUMMARY.md',
  'QUICK_OPTIMIZATION_CHECKLIST.md'
];

docs.forEach(doc => {
  const docPath = path.join(PROJECT_ROOT, doc);
  if (fs.existsSync(docPath)) {
    log('✓', `${doc} 已生成`);
  } else {
    log('⚠', `${doc} 缺失`);
  }
});

// 总结
console.log(`\n${colors.blue}=== 检查总结 ===${colors.reset}`);
console.log(`
${colors.cyan}预期性能提升:${colors.reset}
  • 打包体积: ↓25% (~250KB)
  • 首屏加载: ↓20% (LCP 改善)
  • 内存占用: ↓15%

${colors.cyan}下一步:${colors.reset}
  1. 运行 npm run build 验证构建
  2. 运行 npm run preview 本地预览
  3. 运行 npm run seo:audit 进行性能审计
  4. 对比优化前后的性能指标

${colors.cyan}需要手动验证:${colors.reset}
  • 应用功能是否正常运行
  • 所有页面是否正确加载
  • 是否有遗漏的 Element Plus 组件
  • 是否有遗漏的图标
\n`);

console.log(`${colors.green}✓ 优化检查完成!${colors.reset}\n`);
