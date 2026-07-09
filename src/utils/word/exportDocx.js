import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, SectionType } from 'docx'

// 将空值转为空字符串
const t = (v) => (v == null ? '' : String(v))
const DOCX_FONT = 'Noto Sans SC'

function buildPersonalInfo(data) {
  const p = data.personalInfo || {}
  const name = new Paragraph({
    alignment: AlignmentType.CENTER,
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: t(p.name) || '姓名', bold: true, font: DOCX_FONT })]
  })
  const contacts = [p.email && `邮箱：${p.email}`, p.phone && `电话：${p.phone}`, p.address && `地址：${p.address}`]
    .filter(Boolean)
    .join('  |  ')
  const contactLine = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: contacts, font: DOCX_FONT, size: 22 })]
  })
  return [name, contactLine]
}

function buildSectionTitle(text) {
  return new Paragraph({
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, font: DOCX_FONT })]
  })
}

function buildSummary(data) {
  const s = t(data.summary)
  if (!s) return []
  return [buildSectionTitle('个人简介'), new Paragraph({ children: [new TextRun({ text: s, font: DOCX_FONT })] })]
}

function buildWorkExperience(data) {
  const list = data.workExperience || []
  if (!list.length) return []
  const paragraphs = [buildSectionTitle('工作经历')]
  list.forEach((w) => {
    const header = new Paragraph({
      children: [
        new TextRun({ text: t(w.position), bold: true, font: DOCX_FONT }),
        new TextRun({ text: `  |  ${t(w.company)}`, font: DOCX_FONT }),
        new TextRun({ text: `  (${t(w.startDate)} - ${t(w.endDate) || '至今'})`, italics: true, font: DOCX_FONT })
      ]
    })
    paragraphs.push(header)
    if (w.description) {
      paragraphs.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: t(w.description), font: DOCX_FONT })] }))
    }
    if (w.achievements && w.achievements.length) {
      w.achievements.forEach((a) => {
        paragraphs.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: t(a), font: DOCX_FONT })] }))
      })
    }
  })
  return paragraphs
}

function buildEducation(data) {
  const list = data.education || []
  if (!list.length) return []
  const paragraphs = [buildSectionTitle('教育背景')]
  list.forEach((e) => {
    const header = new Paragraph({
      children: [
        new TextRun({ text: t(e.degree), bold: true, font: DOCX_FONT }),
        new TextRun({ text: `  |  ${t(e.school)}`, font: DOCX_FONT }),
        new TextRun({ text: `  (${t(e.startDate)} - ${t(e.endDate) || '至今'})`, italics: true, font: DOCX_FONT })
      ]
    })
    paragraphs.push(header)
    if (e.major || e.studyType) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({
            text: [`专业：${t(e.major)}`, e.studyType ? `学习形式：${t(e.studyType)}` : ''].filter(Boolean).join('  |  '),
            font: DOCX_FONT
          })
        ]
      }))
    }
    if (e.gpa) paragraphs.push(new Paragraph({ children: [new TextRun({ text: `GPA：${t(e.gpa)}`, font: DOCX_FONT })] }))
    if (e.honors) paragraphs.push(new Paragraph({ children: [new TextRun({ text: `荣誉：${t(e.honors)}`, font: DOCX_FONT })] }))
  })
  return paragraphs
}

function buildSkills(data) {
  const list = data.skills || []
  if (!list.length) return []
  const paragraphs = [buildSectionTitle('技能特长')]
  list.forEach((s) => {
    const line = [t(s.name), s.level ? `（${t(s.level)}）` : ''].join('')
    paragraphs.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: line, font: DOCX_FONT })] }))
  })
  return paragraphs
}

function buildProjects(data) {
  const list = data.projects || []
  if (!list.length) return []
  const paragraphs = [buildSectionTitle('项目经历')]
  list.forEach((p) => {
    const header = new Paragraph({
      children: [
        new TextRun({ text: t(p.name), bold: true, font: DOCX_FONT }),
        p.role ? new TextRun({ text: ` | 角色：${t(p.role)}`, font: DOCX_FONT }) : null
      ].filter(Boolean)
    })
    paragraphs.push(header)
    if (p.description) paragraphs.push(new Paragraph({ children: [new TextRun({ text: t(p.description), font: DOCX_FONT })] }))
    if (p.technologies && p.technologies.length) {
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: `技术栈：${p.technologies.join('、')}`, font: DOCX_FONT })] }))
    }
    if (p.url || p.github) {
      const linkLine = [p.url ? `链接：${p.url}` : '', p.github ? ` GitHub：${p.github}` : ''].filter(Boolean).join('  ')
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: linkLine, font: DOCX_FONT })] }))
    }
  })
  return paragraphs
}

function buildCertifications(data) {
  const list = data.certifications || []
  if (!list.length) return []
  const paragraphs = [buildSectionTitle('证书获得')]
  list.forEach((cert) => {
    const header = new Paragraph({
      children: [
        new TextRun({ text: t(cert.name), bold: true, font: DOCX_FONT }),
        cert.date ? new TextRun({ text: `  (${t(cert.date)})`, italics: true, font: DOCX_FONT }) : null
      ].filter(Boolean)
    })
    paragraphs.push(header)
    const detailLine = [
      cert.issuer ? `颁发机构：${t(cert.issuer)}` : '',
      cert.score ? `分数：${t(cert.score)}` : ''
    ].filter(Boolean).join('  |  ')
    if (detailLine) {
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: detailLine, font: DOCX_FONT })] }))
    }
  })
  return paragraphs
}

export async function exportResumeToDocx(resumeData, options = {}) {
  const children = [
    ...buildPersonalInfo(resumeData),
    ...buildSummary(resumeData),
    ...buildWorkExperience(resumeData),
    ...buildEducation(resumeData),
    ...buildSkills(resumeData),
    ...buildProjects(resumeData),
    ...buildCertifications(resumeData)
  ]

  const doc = new Document({
    sections: [
      {
        properties: { type: SectionType.CONTINUOUS, page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
        children
      }
    ]
  })

  const blob = await Packer.toBlob(doc)
  return blob
}
