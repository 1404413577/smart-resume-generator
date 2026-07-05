// 网站地图生成器
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

function readEnvValue(key) {
  const envFiles = ['.env.production', '.env']

  for (const file of envFiles) {
    if (!fs.existsSync(file)) continue

    const line = fs.readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .find(item => item.trim().startsWith(`${key}=`))

    if (line) return line.slice(line.indexOf('=') + 1).trim()
  }

  return ''
}

const configuredBaseUrl = process.env.VITE_BASE_URL || readEnvValue('VITE_BASE_URL')
const baseUrl = (configuredBaseUrl || 'https://smart-resume-generator-lac.vercel.app').replace(/\/$/, '')
const currentDate = new Date().toISOString().split('T')[0]

// 静态页面配置
const staticPages = [
  {
    url: '/',
    priority: '1.0',
    changefreq: 'daily',
    lastmod: currentDate
  },
  {
    url: '/templates',
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: currentDate
  },
  {
    url: '/design',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: currentDate
  },
  {
    url: '/ai-assistant',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: currentDate
  },
  {
    url: '/settings',
    priority: '0.5',
    changefreq: 'monthly',
    lastmod: currentDate
  },
  {
    url: '/about',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: currentDate
  }
]

const templatePages = []

// 生成XML网站地图
function generateSitemap() {
  const allPages = staticPages
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`

  allPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
  })

  sitemap += '</urlset>'
  
  return sitemap
}

// 生成HTML网站地图
function generateHtmlSitemap() {
  const allPages = staticPages
  
  let htmlSitemap = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>网站地图 - 简历编辑器</title>
    <meta name="description" content="简历编辑器网站地图，包含所有主要页面和功能链接。">
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #409eff; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; border-bottom: 2px solid #409eff; padding-bottom: 10px; }
        ul { list-style-type: none; padding: 0; }
        li { margin: 10px 0; }
        a { color: #409eff; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .priority { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>网站地图</h1>
    <p>欢迎访问简历编辑器网站地图，这里包含了我们网站的所有主要页面。</p>
    
    <div class="section">
        <h2>主要页面</h2>
        <ul>
`

  staticPages.forEach(page => {
    const title = getPageTitle(page.url)
    htmlSitemap += `            <li>
                <a href="${page.url}">${title}</a>
                <span class="priority">(优先级: ${page.priority})</span>
            </li>
`
  })

  htmlSitemap += `        </ul>
    </div>
    
    <div class="section">
        <h2>简历模板</h2>
        <ul>
`

  templatePages.forEach(page => {
    const templateName = page.url.split('/').pop()
    const title = getTemplateTitle(templateName)
    htmlSitemap += `            <li>
                <a href="${page.url}">${title}</a>
                <span class="priority">(优先级: ${page.priority})</span>
            </li>
`
  })

  htmlSitemap += `        </ul>
    </div>
    
    <footer style="margin-top: 50px; text-align: center; color: #666;">
        <p>最后更新时间: ${currentDate}</p>
        <p><a href="/">返回首页</a></p>
    </footer>
</body>
</html>`

  return htmlSitemap
}

// 获取页面标题
function getPageTitle(url) {
  const titles = {
    '/': '首页',
    '/templates': '简历模板',
    '/features': '功能特色',
    '/help': '帮助中心',
    '/about': '关于我们',
    '/privacy': '隐私政策',
    '/terms': '使用条款'
  }
  return titles[url] || url
}

// 获取模板标题
function getTemplateTitle(templateName) {
  const titles = {
    'modern': '现代风格模板',
    'classic': '经典风格模板',
    'minimal': '简约风格模板',
    'creative': '创意风格模板',
    'professional': '专业风格模板'
  }
  return titles[templateName] || templateName
}

// 保存文件
function saveFile(filename, content) {
  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  
  const filePath = path.join(publicDir, filename)
  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`✅ 生成 ${filename} 成功`)
}

// 主函数
function main() {
  try {
    console.log('🚀 开始生成网站地图...')
    
    // 生成XML网站地图
    const xmlSitemap = generateSitemap()
    saveFile('sitemap.xml', xmlSitemap)
    
    // 生成HTML网站地图
    const htmlSitemap = generateHtmlSitemap()
    saveFile('sitemap.html', htmlSitemap)
    
    console.log('🎉 网站地图生成完成！')
    console.log(`📍 XML网站地图: ${baseUrl}/sitemap.xml`)
    console.log(`📍 HTML网站地图: ${baseUrl}/sitemap.html`)
    
  } catch (error) {
    console.error('❌ 生成网站地图失败:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main()
}

export { generateSitemap, generateHtmlSitemap }
