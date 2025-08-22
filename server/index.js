import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import puppeteer from 'puppeteer'

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '5mb' }))

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const PRINT_URL = process.env.PRINT_URL || `${CLIENT_ORIGIN}/print`

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'pdf-export', timestamp: new Date().toISOString() })
})

app.post('/api/export/pdf', async (req, res) => {
  const { filename = 'resume.pdf', query = {}, snapshot = null } = req.body || {}

  let browser
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=medium',
        '--disable-gpu'
      ]
    })

    const page = await browser.newPage()

    // 如果提供了 snapshot，则在新文档执行前注入 localStorage（确保与目标源一致）
    if (snapshot) {
      await page.evaluateOnNewDocument((snap) => {
        try {
          if (snap.resumeData) localStorage.setItem('resumeData', JSON.stringify(snap.resumeData))
          if (snap.selectedTemplate) localStorage.setItem('selectedTemplate', snap.selectedTemplate)
          if (snap.templateSettings) localStorage.setItem('templateSettings', JSON.stringify(snap.templateSettings))
          if (snap.globalSettings) localStorage.setItem('globalSettings', JSON.stringify(snap.globalSettings))
        } catch (e) {
          console.warn('Failed to inject localStorage:', e)
        }
      }, snapshot)
    }

    const qs = new URLSearchParams(query).toString()
    const url = qs ? `${PRINT_URL}?${qs}` : PRINT_URL

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })

    // 等待主要节点可见
    await page.waitForSelector('#resume-preview', { timeout: 30000 })

    // 启用打印介质并强制颜色精确
    await page.emulateMediaType('print')
    await page.addStyleTag({ content: `@media print { *{-webkit-print-color-adjust: exact;print-color-adjust: exact;} }` })

    // 等待字体完全加载（更稳健）
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready
      }
    })

    // 等待两帧以确保布局稳定
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))

    // 额外缓冲等待（图像/异步样式）
    await page.waitForTimeout(200)

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      scale: 1
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(pdf)
  } catch (err) {
    console.error('Export PDF error:', err)
    res.status(500).json({ error: 'Failed to export PDF' })
  } finally {
    if (browser) await browser.close()
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`PDF export server listening on :${PORT}`))

