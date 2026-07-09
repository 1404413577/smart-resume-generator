import { RESUME_SECTION_KEYS } from './resumeSchema'

const isPlainObject = (value) => (
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value)
)

export function validateResumeData(data) {
  const errors = []
  const warnings = []

  if (!isPlainObject(data)) {
    return {
      valid: false,
      errors: ['resumeData must be an object'],
      warnings
    }
  }

  RESUME_SECTION_KEYS.forEach((key) => {
    if (!(key in data)) {
      warnings.push(`Missing section: ${key}`)
    }
  })

  if (!isPlainObject(data.personalInfo)) {
    errors.push('personalInfo must be an object')
  }

  ;['workExperience', 'education', 'skills', 'projects', 'certifications', 'languages'].forEach((key) => {
    if (data[key] !== undefined && !Array.isArray(data[key])) {
      errors.push(`${key} must be an array`)
    }
  })

  if (!data.personalInfo?.name) {
    warnings.push('personalInfo.name is empty')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
