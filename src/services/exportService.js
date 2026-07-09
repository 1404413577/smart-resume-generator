import { getTemplate } from '@templates'
import { normalizeResumeData } from '@/domain/resumeNormalizer'
import { generateOptimizedPDF } from '@utils/pdf/pdfGenerator'
import { generateMultiPageResumePDF } from '@utils/pdf/multiPagePdfGenerator'
import { printResume as browserPrintResume } from '@utils/pdf/browserPrint'
import { exportResumeToDocx } from '@utils/word/exportDocx'

export function createDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportResumePdf({
  elementId,
  filename,
  templateId,
  pageSettings
}) {
  const template = getTemplate(templateId)

  if (template?.isMultiPage) {
    return generateMultiPageResumePDF(elementId, filename, pageSettings)
  }

  return generateOptimizedPDF(elementId, filename)
}

export async function exportResumeWord(resumeData, filename) {
  const blob = await exportResumeToDocx(normalizeResumeData(resumeData))
  createDownload(blob, filename)
  return blob
}

export async function printResume(elementId, options = {}) {
  return browserPrintResume(elementId, options)
}
