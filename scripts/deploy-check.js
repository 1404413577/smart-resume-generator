#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 验证项目配置是否完整，确保部署成功
 */

import fs from 'fs'
import path from 'path'

const checks = []
let hasErrors = false

// 检查函数
function check(name, condition, message) {
  const result = {
    name,
    status: condition ? '✅' : '❌',
    message: condition ? 'OK' : message
  }
  
  if (!condition) {
    hasErrors = true
  }
  
  checks.push(result)
  return condition
}

console.log('🔍 开始部署前检查...\n')

// 1. 检查必要文件是否存在
check('package.json', fs.existsSync('package.json'), 'package.json 文件不存在')
check('vite.config.js', fs.existsSync('vite.config.js'), 'vite.config.js 文件不存在')
check('vercel.json', fs.existsSync('vercel.json'), 'vercel.json 文件不存在')
check('index.html', fs.existsSync('index.html'), 'index.html 文件不存在')

// 2. 检查环境变量文件
check('.env.production', fs.existsSync('.env.production'), '.env.production 文件不存在')
check('.env.development', fs.existsSync('.env.development'), '.env.development 文件不存在')

// 3. 检查构建目录
const distExists = fs.existsSync('dist')
check('dist目录', distExists, 'dist 目录不存在，请先运行 npm run build')

if (distExists) {
  check('dist/index.html', fs.existsSync('dist/index.html'), 'dist/index.html 不存在')
  check('dist/assets', fs.existsSync('dist/assets'), 'dist/assets 目录不存在')
}

// 4. 检查package.json配置
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  
  check('build脚本', pkg.scripts && pkg.scripts.build, 'package.json 中缺少 build 脚本')
  check('dev脚本', pkg.scripts && pkg.scripts.dev, 'package.json 中缺少 dev 脚本')
  
  // 检查关键依赖
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  check('Vue依赖', deps.vue, '缺少 Vue 依赖')
  check('Vite依赖', deps.vite, '缺少 Vite 依赖')
  check('terser依赖', deps.terser, '缺少 terser 依赖（构建压缩需要）')
}

// 5. 检查vercel.json配置
if (fs.existsSync('vercel.json')) {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))
  
  check('构建命令', vercelConfig.buildCommand === 'npm run build', 'vercel.json 构建命令不正确')
  check('输出目录', vercelConfig.outputDirectory === 'dist', 'vercel.json 输出目录不正确')
  check('框架设置', vercelConfig.framework === 'vite', 'vercel.json 框架设置不正确')
  check('SPA重写规则', vercelConfig.rewrites && vercelConfig.rewrites.length > 0, 'vercel.json 缺少 SPA 重写规则')
}

// 6. 检查重要的源文件
check('src/main.js', fs.existsSync('src/main.js'), 'src/main.js 入口文件不存在')
check('src/App.vue', fs.existsSync('src/App.vue'), 'src/App.vue 根组件不存在')

// 7. 检查公共资源
check('public目录', fs.existsSync('public'), 'public 目录不存在')
if (fs.existsSync('public')) {
  check('favicon', fs.existsSync('public/favicon.svg'), 'public/favicon.svg 不存在')
  check('robots.txt', fs.existsSync('public/robots.txt'), 'public/robots.txt 不存在')
}

// 输出检查结果
console.log('📋 检查结果:\n')
checks.forEach(check => {
  console.log(`${check.status} ${check.name}: ${check.message}`)
})

console.log('\n' + '='.repeat(50))

if (hasErrors) {
  console.log('❌ 发现问题，请修复后再部署')
  process.exit(1)
} else {
  console.log('✅ 所有检查通过，可以安全部署！')
  console.log('\n🚀 建议的部署步骤:')
  console.log('1. git add .')
  console.log('2. git commit -m "ready for deployment"')
  console.log('3. git push github master')
  console.log('4. 在 Vercel 中导入项目或触发重新部署')
}
