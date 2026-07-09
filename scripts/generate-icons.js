// 生成基本图标文件的脚本
import fs from 'fs'
import path from 'path'

// 创建一个简单的SVG图标
const createSVGIcon = (size = 32, color = '#409eff') => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${color}" rx="4"/>
  <text x="50%" y="50%" font-family="Noto Sans SC, Source Han Sans SC, system-ui, sans-serif" font-size="${size * 0.6}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">简</text>
</svg>`
}

// 创建不同尺寸的图标
const iconSizes = [16, 32, 180, 192, 512]
const publicDir = path.join(process.cwd(), 'public')

// 确保public目录存在
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// 生成SVG图标
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size)
  const filename = `icon-${size}x${size}.svg`
  const filepath = path.join(publicDir, filename)
  
  fs.writeFileSync(filepath, svgContent, 'utf8')
  console.log(`✅ 生成图标: ${filename}`)
})

// 创建一个通用的favicon.svg
const faviconSVG = createSVGIcon(32)
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG, 'utf8')
console.log('✅ 生成favicon.svg')

// 更新site.webmanifest
const manifest = {
  "name": "简历编辑器 - 专业在线简历制作工具",
  "short_name": "简历编辑器",
  "description": "专业的在线简历编辑器，提供多种精美简历模板，支持实时预览、PDF导出。",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#409eff",
  "orientation": "portrait-primary",
  "categories": ["business", "productivity", "utilities"],
  "lang": "zh-CN",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    },
    {
      "src": "/icon-512x512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml"
    }
  ]
}

fs.writeFileSync(
  path.join(publicDir, 'site.webmanifest'), 
  JSON.stringify(manifest, null, 2), 
  'utf8'
)
console.log('✅ 更新site.webmanifest')

console.log('🎉 图标生成完成！')
console.log('生成的文件:')
iconSizes.forEach(size => {
  console.log(`  - icon-${size}x${size}.svg`)
})
console.log('  - favicon.svg')
console.log('  - site.webmanifest (已更新)')
