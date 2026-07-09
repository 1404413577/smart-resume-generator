export function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text)
  } catch {
    let cleaned = String(text || '').trim()
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')

    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start !== -1 && end > start) {
      try { return JSON.parse(cleaned.slice(start, end + 1)) } catch {}
    }

    const arrStart = cleaned.indexOf('[')
    const arrEnd = cleaned.lastIndexOf(']')
    if (arrStart !== -1 && arrEnd > arrStart) {
      try { return JSON.parse(cleaned.slice(arrStart, arrEnd + 1)) } catch {}
    }

    console.warn('[safeJsonParse] 解析失败，使用 fallback')
    return fallback
  }
}
