// 尝试服务端导出PDF，失败时由调用方回退到客户端方案
export async function exportPdfViaServer(filename = 'resume.pdf', params = {}) {
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  const url = `${base}/export/pdf`

  // 通过传 query 方式让服务端打开 /print 页面时能定位简历，或直接传全部数据
  const payload = {
    filename,
    query: params.query || {},
    // 也可以将必须的数据直接传给服务端，在 /print 注入（备选）
    snapshot: params.snapshot || null
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) throw new Error('Server PDF export failed')

  const blob = await res.blob()
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(a.href)
}

