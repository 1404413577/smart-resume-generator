// 测试服务端健康检查和PDF导出
import fetch from 'node-fetch'

async function testHealth() {
  try {
    const res = await fetch('http://localhost:3000/api/health')
    const data = await res.json()
    console.log('✅ Health check:', data)
    return true
  } catch (e) {
    console.log('❌ Health check failed:', e.message)
    return false
  }
}

async function testPdfExport() {
  try {
    const payload = {
      filename: 'test-resume.pdf',
      snapshot: {
        resumeData: {
          personalInfo: { name: '张三', email: 'test@example.com' },
          summary: '这是一个测试简历'
        },
        selectedTemplate: 'modern'
      }
    }
    
    console.log('🚀 Testing PDF export...')
    const res = await fetch('http://localhost:3000/api/export/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (res.ok) {
      console.log('✅ PDF export successful, Content-Type:', res.headers.get('content-type'))
      console.log('📄 PDF size:', res.headers.get('content-length'), 'bytes')
      return true
    } else {
      console.log('❌ PDF export failed:', res.status, await res.text())
      return false
    }
  } catch (e) {
    console.log('❌ PDF export error:', e.message)
    return false
  }
}

async function main() {
  console.log('🧪 Testing PDF Export Server...\n')
  
  const healthOk = await testHealth()
  if (!healthOk) {
    console.log('\n❌ Server not responding, please check if it\'s running on port 3000')
    return
  }
  
  console.log()
  await testPdfExport()
  
  console.log('\n✨ Test completed!')
}

main().catch(console.error)
