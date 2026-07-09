export const RESUME_SECTION_KEYS = [
  'personalInfo',
  'summary',
  'workExperience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages'
]

export const PHOTO_POSITIONS = ['left', 'center', 'right']

export function createEmptyResumeData() {
  return {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      linkedin: '',
      github: '',
      targetPosition: '',
      photo: '',
      photoPosition: 'center',
      customFields: []
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customModulesData: {}
  }
}
