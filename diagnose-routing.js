/**
 * 路由诊断脚本
 * 用于检查路由配置和视图组件是否正确
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIEWS_DIR = path.join(__dirname, 'src/views');
const ROUTER_FILE = path.join(__dirname, 'src/router/index.js');

console.log('🔍 开始路由诊断...\n');

// 1. 检查视图文件是否存在
console.log('1️⃣  检查视图文件...');
const viewFiles = fs.readdirSync(VIEWS_DIR).filter(f => f.endsWith('.vue'));
console.log(`   找到 ${viewFiles.length} 个Vue文件:`, viewFiles);

// 2. 检查路由配置
console.log('\n2️⃣  检查路由配置...');
const routerContent = fs.readFileSync(ROUTER_FILE, 'utf-8');
const componentImports = routerContent.match(/const \w+View = .+/g) || [];
console.log(`   找到 ${componentImports.length} 个路由组件导入`);
componentImports.forEach(imp => console.log(`   - ${imp}`));

// 3. 检查路由器初始化
console.log('\n3️⃣  检查路由器初始化...');
const hasRouterCreation = routerContent.includes('createRouter');
const hasHashHistory = routerContent.includes('createWebHashHistory');
const hasBeforeEach = routerContent.includes('router.beforeEach');
const hasErrorHandler = routerContent.includes('router.onError');

console.log(`   ✓ createRouter: ${hasRouterCreation ? '✅' : '❌'}`);
console.log(`   ✓ createWebHashHistory: ${hasHashHistory ? '✅' : '❌'}`);
console.log(`   ✓ router.beforeEach: ${hasBeforeEach ? '✅' : '❌'}`);
console.log(`   ✓ router.onError: ${hasErrorHandler ? '✅' : '❌'}`);

// 4. 检查 main.js
console.log('\n4️⃣  检查 main.js...');
const mainFile = path.join(__dirname, 'src/main.js');
const mainContent = fs.readFileSync(mainFile, 'utf-8');
const hasRouterUse = mainContent.includes('app.use(router)');
const hasRouterIsReady = mainContent.includes('router.isReady()');
const hasAppMount = mainContent.includes('app.mount');

console.log(`   ✓ app.use(router): ${hasRouterUse ? '✅' : '❌'}`);
console.log(`   ✓ router.isReady(): ${hasRouterIsReady ? '✅' : '❌'}`);
console.log(`   ✓ app.mount: ${hasAppMount ? '✅' : '❌'}`);

// 5. 检查 AppLayout 组件
console.log('\n5️⃣  检查 AppLayout 组件...');
const appLayoutFile = path.join(__dirname, 'src/components/layout/AppLayout.vue');
const appLayoutContent = fs.readFileSync(appLayoutFile, 'utf-8');
const hasRouterView = appLayoutContent.includes('<router-view');
const hasRouterLink = appLayoutContent.includes('<router-link');

console.log(`   ✓ <router-view>: ${hasRouterView ? '✅' : '❌'}`);
console.log(`   ✓ <router-link>: ${hasRouterLink ? '✅' : '❌'}`);

console.log('\n✨ 诊断完成！');
console.log('\n💡 建议:');
console.log('   1. 确保所有视图文件存在于 src/views/');
console.log('   2. 检查浏览器控制台是否有错误');
console.log('   3. 在开发工具中查看 Vue 组件树');
console.log('   4. 检查网络选项卡中的资源加载情况');
