import { PHOTO_POSITIONS, createEmptyResumeData } from './resumeSchema'

const isPlainObject = (value) => (
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value)
)

const toObject = (value) => isPlainObject(value) ? value : {}
const toArray = (value) => Array.isArray(value) ? value : []
const toStringValue = (value) => value == null ? '' : String(value)

const normalizeTextArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map(item => typeof item === 'string' ? item : item?.text || item?.description || '')
      .map(item => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|；|;/)
      .map(item => item.replace(/^[-*•\d.、\s]+/, '').trim())
      .filter(Boolean)
  }

  return []
}

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map(item => toStringValue(item).trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value.split(/[,，、\n]/).map(item => item.trim()).filter(Boolean)
  }

  return []
}

const normalizeId = (item, sectionKey, index) => (
  item.id || `${sectionKey}-${index + 1}`
)

function normalizePersonalInfo(value, defaults) {
  const source = toObject(value)

  return {
    ...defaults,
    ...source,
    name: toStringValue(source.name || defaults.name),
    email: toStringValue(source.email || defaults.email),
    phone: toStringValue(source.phone || defaults.phone),
    address: toStringValue(source.address || defaults.address),
    website: toStringValue(source.website || defaults.website),
    linkedin: toStringValue(source.linkedin || defaults.linkedin),
    github: toStringValue(source.github || defaults.github),
    targetPosition: toStringValue(source.targetPosition || source.position || defaults.targetPosition),
    photo: toStringValue(source.photo || defaults.photo),
    photoPosition: PHOTO_POSITIONS.includes(source.photoPosition) ? source.photoPosition : defaults.photoPosition,
    customFields: toArray(source.customFields).map((field, index) => {
      const fieldSource = toObject(field)
      return {
        ...fieldSource,
        id: normalizeId(fieldSource, 'custom-field', index),
        name: toStringValue(fieldSource.name || fieldSource.label),
        value: toStringValue(fieldSource.value)
      }
    })
  }
}

function normalizeWorkExperienceItem(item, index) {
  const source = toObject(item)
  const responsibilities = normalizeTextArray(source.responsibilities)
  const achievements = normalizeTextArray(source.achievements).length
    ? normalizeTextArray(source.achievements)
    : responsibilities

  return {
    ...source,
    id: normalizeId(source, 'work', index),
    company: toStringValue(source.company),
    position: toStringValue(source.position || source.jobTitle),
    startDate: toStringValue(source.startDate),
    endDate: toStringValue(source.endDate),
    current: Boolean(source.current),
    location: toStringValue(source.location),
    description: toStringValue(source.description || responsibilities.join('\n')),
    achievements
  }
}

function normalizeEducationItem(item, index) {
  const source = toObject(item)

  return {
    ...source,
    id: normalizeId(source, 'education', index),
    school: toStringValue(source.school),
    major: toStringValue(source.major),
    degree: toStringValue(source.degree),
    studyType: toStringValue(source.studyType),
    startDate: toStringValue(source.startDate),
    endDate: toStringValue(source.endDate || source.graduationDate),
    current: Boolean(source.current),
    gpa: toStringValue(source.gpa),
    description: toStringValue(source.description),
    honors: toStringValue(source.honors)
  }
}

function normalizeSkillItem(item, index) {
  if (typeof item === 'string') {
    return {
      id: `skill-${index + 1}`,
      name: item,
      level: '',
      category: '',
      description: ''
    }
  }

  const source = toObject(item)

  return {
    ...source,
    id: normalizeId(source, 'skill', index),
    name: toStringValue(source.name),
    level: toStringValue(source.level || source.proficiency),
    category: toStringValue(source.category),
    description: toStringValue(source.description)
  }
}

function normalizeProjectItem(item, index) {
  const source = toObject(item)

  return {
    ...source,
    id: normalizeId(source, 'project', index),
    name: toStringValue(source.name),
    role: toStringValue(source.role),
    startDate: toStringValue(source.startDate),
    endDate: toStringValue(source.endDate),
    description: toStringValue(source.description),
    technologies: normalizeStringArray(source.technologies),
    highlights: normalizeTextArray(source.highlights || source.achievements),
    url: toStringValue(source.url),
    github: toStringValue(source.github)
  }
}

function normalizeCertificationItem(item, index) {
  const source = toObject(item)

  return {
    ...source,
    id: normalizeId(source, 'certification', index),
    name: toStringValue(source.name),
    issuer: toStringValue(source.issuer || source.organization),
    date: toStringValue(source.date || source.issueDate),
    score: toStringValue(source.score),
    url: toStringValue(source.url)
  }
}

function normalizeLanguageItem(item, index) {
  if (typeof item === 'string') {
    return {
      id: `language-${index + 1}`,
      name: item,
      level: ''
    }
  }

  const source = toObject(item)

  return {
    ...source,
    id: normalizeId(source, 'language', index),
    name: toStringValue(source.name),
    level: toStringValue(source.level || source.proficiency)
  }
}

export function normalizeResumeData(data) {
  const defaults = createEmptyResumeData()
  const source = toObject(data)

  return {
    ...source,
    personalInfo: normalizePersonalInfo(source.personalInfo, defaults.personalInfo),
    summary: toStringValue(source.summary),
    workExperience: toArray(source.workExperience).map(normalizeWorkExperienceItem),
    education: toArray(source.education).map(normalizeEducationItem),
    skills: toArray(source.skills).map(normalizeSkillItem),
    projects: toArray(source.projects).map(normalizeProjectItem),
    certifications: toArray(source.certifications).map(normalizeCertificationItem),
    languages: toArray(source.languages).map(normalizeLanguageItem),
    customModulesData: toObject(source.customModulesData)
  }
}
