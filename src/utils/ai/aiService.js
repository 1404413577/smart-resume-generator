/**
 * Unified AI service for resume generation.
 *
 * The UI calls the high-level functions exported from this module. The actual
 * engine can be OpenAI-compatible chat completions, Ollama, Gemini, or an
 * optional browser-local model service.
 */

import { localAiService } from './localAi'

const DEFAULT_TIMEOUT_MS = 120000
const SETTINGS_STORAGE_KEY = 'resumeBuilderSettings'

export const DEFAULT_AI_SETTINGS = {
  aiEngine: import.meta.env.VITE_AI_ENGINE || (import.meta.env.VITE_GEMINI_API_KEY ? 'gemini' : 'online'),
  aiApiKey: import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_GLM_API_KEY || import.meta.env.VITE_GML_API_KEY || '',
  aiBaseUrl: import.meta.env.VITE_OPENAI_BASE_URL || import.meta.env.VITE_GLM_API_URL || import.meta.env.VITE_GML_API_URL || 'https://api.openai.com/v1',
  aiModel: import.meta.env.VITE_OPENAI_MODEL || import.meta.env.VITE_GLM_API_MODEL || import.meta.env.VITE_GML_API_MODEL || 'gpt-4o-mini',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  geminiBaseUrl: import.meta.env.VITE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
  geminiModel: import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash',
  ollamaBaseUrl: import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: import.meta.env.VITE_OLLAMA_MODEL || 'llama3.1',
  localAiType: 'gpu',
  localModelId: 'SmolLM2-135M-Instruct-q0f32-MLC',
  localCpuModelId: 'Xenova/Qwen1.5-0.5B-Chat'
}

// 请求频率限制
let lastRequestTime = 0
const REQUEST_INTERVAL = 1000

// ---- Settings helpers ----

export function getAiSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!saved) return { ...DEFAULT_AI_SETTINGS }

    return {
      ...DEFAULT_AI_SETTINGS,
      ...JSON.parse(saved)
    }
  } catch (error) {
    console.warn('[AI Service] 读取 AI 设置失败，使用默认配置:', error)
    return { ...DEFAULT_AI_SETTINGS }
  }
}

function normalizeBaseUrl(baseUrl, fallback) {
  return String(baseUrl || fallback).replace(/\/$/, '')
}

function normalizeGeminiModel(model) {
  return String(model || DEFAULT_AI_SETTINGS.geminiModel).replace(/^models\//, '')
}

function normalizeOpenAICompatibleModel(model) {
  const value = String(model || DEFAULT_AI_SETTINGS.aiModel).trim()
  return value.startsWith('gml-') ? value.replace(/^gml-/, 'glm-') : value
}

function createTimeoutSignal(timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort(new Error('AI 请求超时，请检查网络或服务状态'))
  }, timeoutMs)

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timer)
  }
}

async function throttleRequest() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL - timeSinceLastRequest))
  }
  lastRequestTime = Date.now()
}

/** 安全解析 AI 返回的 JSON，自动清理 markdown 代码块等常见格式问题 */
function safeJsonParse(text, fallback) {
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

function messagesToGeminiPayload(messages) {
  const systemText = messages
    .filter(message => message.role === 'system')
    .map(message => message.content)
    .join('\n\n')

  const contents = messages
    .filter(message => message.role !== 'system')
    .map(message => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(message.content || '') }]
    }))

  return {
    contents: contents.length ? contents : [{ role: 'user', parts: [{ text: '' }] }],
    ...(systemText ? { systemInstruction: { parts: [{ text: systemText }] } } : {})
  }
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || []
  return parts.map(part => part.text || '').join('')
}

function toGenerationConfig(options = {}) {
  const generationConfig = {}
  if (options.temperature !== undefined) generationConfig.temperature = options.temperature
  if (options.maxTokens !== undefined) generationConfig.maxOutputTokens = options.maxTokens
  return generationConfig
}

// ---- Unified service ----

export class AIService {
  static getConfigs() {
    const settings = getAiSettings()
    const aiEngine = settings.aiEngine || DEFAULT_AI_SETTINGS.aiEngine

    if (aiEngine === 'ollama') {
      return {
        aiEngine,
        baseUrl: normalizeBaseUrl(settings.ollamaBaseUrl, DEFAULT_AI_SETTINGS.ollamaBaseUrl),
        model: settings.ollamaModel || DEFAULT_AI_SETTINGS.ollamaModel
      }
    }

    if (aiEngine === 'local') {
      const localAiType = settings.localAiType || DEFAULT_AI_SETTINGS.localAiType
      return {
        aiEngine,
        localAiType,
        localModelId: localAiType === 'gpu'
          ? settings.localModelId || DEFAULT_AI_SETTINGS.localModelId
          : settings.localCpuModelId || DEFAULT_AI_SETTINGS.localCpuModelId
      }
    }

    if (aiEngine === 'gemini') {
      return {
        aiEngine,
        apiKey: settings.geminiApiKey || '',
        baseUrl: normalizeBaseUrl(settings.geminiBaseUrl, DEFAULT_AI_SETTINGS.geminiBaseUrl),
        model: normalizeGeminiModel(settings.geminiModel)
      }
    }

    return {
      aiEngine: 'online',
      apiKey: settings.aiApiKey || '',
      baseUrl: normalizeBaseUrl(settings.aiBaseUrl, DEFAULT_AI_SETTINGS.aiBaseUrl),
      model: normalizeOpenAICompatibleModel(settings.aiModel)
    }
  }

  static async chatCompletion(messages, onChunk = null, onProgress = null, options = {}) {
    const configs = this.getConfigs()

    if (configs.aiEngine === 'ollama') {
      return this.ollamaChatCompletion(configs, messages, onChunk, options)
    }

    if (configs.aiEngine === 'local') {
      return localAiService.chatCompletion(
        configs.localModelId,
        configs.localAiType,
        messages,
        onChunk,
        onProgress,
        options
      )
    }

    if (configs.aiEngine === 'gemini') {
      return this.geminiChatCompletion(configs, messages, onChunk, options)
    }

    return this.openAICompatibleChatCompletion(configs, messages, onChunk, options)
  }

  static async openAICompatibleChatCompletion(configs, messages, onChunk, options = {}) {
    if (!configs.apiKey) {
      throw new Error('请先在设置页配置 OpenAI 兼容 API Key')
    }

    await throttleRequest()
    const apiUrl = `${configs.baseUrl}/chat/completions`
    const { signal, clear } = options.signal
      ? { signal: options.signal, clear: () => {} }
      : createTimeoutSignal(options.timeoutMs)

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${configs.apiKey}`
        },
        body: JSON.stringify({
          model: options.model || configs.model,
          messages,
          stream: !!onChunk,
          ...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
          ...(options.maxTokens !== undefined ? { max_tokens: options.maxTokens } : {})
        }),
        signal
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `请求失败，状态码: ${response.status}`)
      }

      if (!onChunk) {
        const data = await response.json()
        return data.choices?.[0]?.message?.content || ''
      }

      return this.readOpenAISSE(response, onChunk)
    } finally {
      clear()
    }
  }

  static async readOpenAISSE(response, onChunk) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let fullText = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data: ')) continue
        const payload = trimmed.slice(6).trim()
        if (!payload || payload === '[DONE]') continue

        try {
          const data = JSON.parse(payload)
          const delta = data.choices?.[0]?.delta?.content || ''
          fullText += delta
          if (delta) onChunk(delta, fullText)
        } catch (error) {
          console.warn('OpenAI SSE 解析异常', error)
        }
      }
    }

    return fullText
  }

  static async geminiChatCompletion(configs, messages, onChunk, options = {}) {
    if (!configs.apiKey) {
      throw new Error('请先在设置页配置 Gemini API Key')
    }

    await throttleRequest()
    const action = onChunk ? 'streamGenerateContent?alt=sse' : 'generateContent'
    const apiUrl = `${configs.baseUrl}/models/${encodeURIComponent(configs.model)}:${action}&key=${encodeURIComponent(configs.apiKey)}`
      .replace(':generateContent&key=', ':generateContent?key=')

    const { signal, clear } = options.signal
      ? { signal: options.signal, clear: () => {} }
      : createTimeoutSignal(options.timeoutMs)

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...messagesToGeminiPayload(messages),
          generationConfig: toGenerationConfig(options)
        }),
        signal
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Gemini 请求失败，状态码: ${response.status}`)
      }

      if (!onChunk) {
        const data = await response.json()
        return extractGeminiText(data)
      }

      return this.readGeminiSSE(response, onChunk)
    } finally {
      clear()
    }
  }

  static async readGeminiSSE(response, onChunk) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let fullText = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data: ')) continue

        try {
          const data = JSON.parse(trimmed.slice(6))
          const delta = extractGeminiText(data)
          fullText += delta
          if (delta) onChunk(delta, fullText)
        } catch (error) {
          console.warn('Gemini SSE 解析异常', error)
        }
      }
    }

    return fullText
  }

  static async ollamaChatCompletion(configs, messages, onChunk, options = {}) {
    const model = options.model || configs.model
    if (!model) throw new Error('请先选择 Ollama 模型')

    await throttleRequest()
    const { signal, clear } = options.signal
      ? { signal: options.signal, clear: () => {} }
      : createTimeoutSignal(options.timeoutMs)

    try {
      const response = await fetch(`${configs.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: !!onChunk,
          options: {
            ...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
            ...(options.maxTokens !== undefined ? { num_predict: options.maxTokens } : {})
          }
        }),
        signal
      })

      if (!response.ok) {
        throw new Error(`Ollama 请求失败: ${response.status}`)
      }

      if (!onChunk) {
        const data = await response.json()
        return data.message?.content || ''
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let fullText = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const parsed = JSON.parse(line)
            const delta = parsed.message?.content || ''
            fullText += delta
            if (delta) onChunk(delta, fullText)
          } catch (error) {
            console.warn('Ollama NDJSON 解析异常', error)
          }
        }
      }

      return fullText
    } finally {
      clear()
    }
  }

  static async generateSummary(content, onChunk = null) {
    return this.chatCompletion([
      {
        role: 'system',
        content: '你是一个擅长知识提炼的 AI 助手。请用简洁中文总结以下文档内容。'
      },
      {
        role: 'user',
        content: String(content || '').slice(0, 10000)
      }
    ], onChunk)
  }

  static async polishText(text, instruction, onChunk = null) {
    return this.chatCompletion([
      {
        role: 'system',
        content: `你是一个专业文字编辑。请根据指令处理文本，直接返回处理后的结果。指令：${instruction}`
      },
      {
        role: 'user',
        content: text
      }
    ], onChunk)
  }
}

// ---- Legacy-compatible high-level resume APIs ----

/**
 * 兼容旧调用名：底层已切换为统一 AIService。
 * @param {string} prompt
 * @param {number} maxTokens
 * @returns {Promise<string>}
 */
export async function callGeminiAPI(prompt, maxTokens = 1024) {
  return AIService.chatCompletion(
    [{ role: 'user', content: prompt }],
    null,
    null,
    { maxTokens }
  )
}

async function callAIStream(prompt, onStream, maxTokens = 2048) {
  return AIService.chatCompletion(
    [{ role: 'user', content: prompt }],
    (delta) => onStream?.(delta),
    null,
    { maxTokens }
  )
}

/**
 * 生成个人简介
 * @param {Object} personalInfo - 个人信息
 * @param {string} targetPosition - 目标职位
 * @returns {Promise<string>} 生成的个人简介
 */
export async function generatePersonalSummary(personalInfo, targetPosition = '') {
  const prompt = `
请为以下个人信息生成一份专业的个人简介，要求简洁有力，突出核心优势：

个人信息：
- 姓名：${personalInfo.name || '求职者'}
- 邮箱：${personalInfo.email || ''}
- 电话：${personalInfo.phone || ''}
- 地址：${personalInfo.address || ''}
- 目标职位：${targetPosition || personalInfo.targetPosition || '相关职位'}

要求：
1. 字数控制在100-150字
2. 突出专业技能和工作经验
3. 体现职业目标和发展方向
4. 语言专业、积极正面
5. 适合中国求职市场

请直接返回生成的个人简介内容，不要包含其他说明文字。
`

  return callGeminiAPI(prompt)
}

/**
 * 优化工作经历描述
 * @param {Object} workExperience - 工作经历信息
 * @returns {Promise<Array>} 优化后的职责描述数组
 */
export async function optimizeWorkExperience(workExperience) {
  const prompt = `
请为以下工作经历生成专业的职责描述，要求突出成果和贡献：

工作信息：
- 职位：${workExperience.jobTitle || workExperience.position || ''}
- 公司：${workExperience.company || ''}
- 工作时间：${workExperience.startDate || ''} - ${workExperience.endDate || '至今'}
- 地点：${workExperience.location || ''}
- 当前职责：${workExperience.responsibilities?.join('；') || workExperience.description || ''}

要求：
1. 生成3-5条职责描述
2. 使用动作词开头（如：负责、主导、完成、优化等）
3. 尽量量化成果（如：提升XX%、管理XX人团队、完成XX项目等）
4. 突出专业技能和业务价值
5. 语言简洁专业

请以JSON数组格式返回，例如：["职责描述1", "职责描述2", "职责描述3"]
只返回JSON数组，不要包含其他文字。
`

  const result = await callGeminiAPI(prompt)
  const parsed = safeJsonParse(result, null)
  if (Array.isArray(parsed)) return parsed
  return result.split('\n').filter(line => line.trim()).map(line => line.replace(/^[-•\d.]\s*/, '').trim())
}

/**
 * 推荐技能特长
 * @param {string} industry - 行业领域
 * @param {string} position - 职位
 * @param {Array} currentSkills - 当前技能列表
 * @returns {Promise<Object>} 推荐的技能分类
 */
export async function recommendSkills(industry = '', position = '', currentSkills = []) {
  const currentSkillsText = currentSkills.map(skill => skill.name || skill).join('、')

  const prompt = `
请为以下职位推荐相关的技能特长，分为技术技能、软技能和语言技能：

职位信息：
- 行业：${industry || '通用'}
- 职位：${position || '通用职位'}
- 现有技能：${currentSkillsText || '无'}

要求：
1. 推荐与职位高度相关的技能
2. 避免重复现有技能
3. 技术技能：具体的工具、技术、平台等
4. 软技能：沟通、领导、分析等能力
5. 语言技能：英语、其他外语等

请以JSON格式返回，格式如下：
{
  "technical": ["技能1", "技能2", "技能3"],
  "soft": ["技能1", "技能2", "技能3"],
  "language": ["技能1", "技能2"]
}

只返回JSON对象，不要包含其他文字。
`

  const result = await callGeminiAPI(prompt)
  const parsed = safeJsonParse(result, { technical: [], soft: [], language: [] })
  return { technical: parsed.technical || [], soft: parsed.soft || [], language: parsed.language || [] }
}

/**
 * 完善项目经历描述
 * @param {Object} project - 项目信息
 * @returns {Promise<Object>} 完善后的项目描述
 */
export async function enhanceProjectDescription(project) {
  const prompt = `
请为以下项目经历生成专业的描述和亮点：

项目信息：
- 项目名称：${project.name || ''}
- 项目描述：${project.description || ''}
- 技术栈：${project.technologies?.join('、') || ''}
- 项目链接：${project.url || ''}
- 时间：${project.startDate || ''} - ${project.endDate || ''}

要求：
1. 优化项目描述，突出项目价值和技术难点
2. 生成3-5个项目亮点
3. 突出个人贡献和技术能力
4. 量化项目成果（如性能提升、用户增长等）
5. 语言专业简洁

请以JSON格式返回：
{
  "description": "优化后的项目描述",
  "highlights": ["亮点1", "亮点2", "亮点3"]
}

只返回JSON对象，不要包含其他文字。
`

  const result = await callGeminiAPI(prompt)
  const parsed = safeJsonParse(result, { description: project.description || '', highlights: [] })
  return { description: parsed.description || project.description || '', highlights: parsed.highlights || [] }
}

/**
 * 职业模板配置
 */
const CAREER_TEMPLATES = {
  'software-engineer': {
    name: '软件工程师',
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'Docker'],
    summary: '具有{experience}年软件开发经验的工程师，精通前后端开发技术栈，具备良好的编程习惯和团队协作能力。',
    workTemplate: {
      responsibilities: [
        '参与系统架构设计和技术选型，确保项目技术方案的可行性',
        '负责核心功能模块的开发和维护，保证代码质量和性能',
        '与产品经理和设计师协作，将需求转化为技术实现',
        '参与代码审查和技术分享，提升团队整体技术水平',
        '优化系统性能，解决生产环境中的技术问题'
      ]
    }
  },
  'product-manager': {
    name: '产品经理',
    skills: ['产品规划', '需求分析', 'Axure', 'Figma', '数据分析', '项目管理'],
    summary: '拥有{experience}年产品管理经验，擅长用户需求分析和产品规划，具备敏锐的市场洞察力和优秀的跨部门协调能力。',
    workTemplate: {
      responsibilities: [
        '负责产品需求调研和分析，制定产品发展规划和路线图',
        '设计产品功能和用户体验，输出详细的产品需求文档',
        '协调开发、设计、测试等团队，推进产品按时上线',
        '分析产品数据和用户反馈，持续优化产品功能和体验',
        '跟踪竞品动态和市场趋势，为产品决策提供数据支持'
      ]
    }
  },
  'ui-designer': {
    name: 'UI设计师',
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', '原型设计', '用户体验', '视觉设计'],
    summary: '具有{experience}年UI/UX设计经验的设计师，擅长用户界面设计和交互体验优化，对设计趋势敏感，追求完美的视觉效果。',
    workTemplate: {
      responsibilities: [
        '负责产品界面设计和交互原型制作，确保设计的可用性',
        '制定和维护设计规范，保证产品视觉风格的一致性',
        '与产品经理和开发工程师协作，确保设计方案的落地',
        '进行用户研究和可用性测试，持续优化用户体验',
        '跟踪设计趋势和最佳实践，提升设计质量和效率'
      ]
    }
  },
  'marketing-specialist': {
    name: '市场营销专员',
    skills: ['数字营销', 'SEO/SEM', '内容营销', '社交媒体', '数据分析', '品牌推广'],
    summary: '拥有{experience}年市场营销经验，精通数字营销和品牌推广，具备敏锐的市场洞察力和创新的营销思维。',
    workTemplate: {
      responsibilities: [
        '制定和执行市场营销策略，提升品牌知名度和市场份额',
        '管理多渠道营销活动，包括线上线下推广和社交媒体运营',
        '分析市场数据和竞争对手，为营销决策提供数据支持',
        '与销售团队协作，制定销售支持材料和培训内容',
        '监控营销效果和ROI，持续优化营销策略和执行方案'
      ]
    }
  },
  'data-analyst': {
    name: '数据分析师',
    skills: ['Python', 'SQL', 'Tableau', 'Excel', '统计分析', '机器学习'],
    summary: '具有{experience}年数据分析经验，精通数据挖掘和统计分析，能够从数据中发现业务洞察，为决策提供有力支持。',
    workTemplate: {
      responsibilities: [
        '收集、清洗和分析业务数据，建立数据分析模型和指标体系',
        '制作数据报表和可视化图表，为业务团队提供数据支持',
        '进行用户行为分析和市场趋势研究，发现业务增长机会',
        '与业务团队协作，将数据洞察转化为可执行的业务策略',
        '优化数据处理流程，提升数据分析的效率和准确性'
      ]
    }
  }
}

function getTemplateForCareer(career, fallbackName = '通用职位') {
  if (CAREER_TEMPLATES[career]) return CAREER_TEMPLATES[career]

  return {
    name: fallbackName || career || '通用职位',
    skills: ['沟通能力', '项目管理', '数据分析', '问题解决', '团队协作'],
    summary: '具有{experience}年相关经验，具备扎实的专业能力和良好的团队协作意识，能够快速理解业务目标并推动结果落地。',
    workTemplate: {
      responsibilities: [
        '负责核心工作任务规划与执行，确保业务目标按期达成',
        '协调跨部门资源，推动项目流程优化和效率提升',
        '沉淀工作方法和最佳实践，提升团队协作质量'
      ]
    }
  }
}

/**
 * 生成完整的AI简历
 * @param {Object} options - 生成选项
 * @returns {Promise<Object>} 生成的完整简历数据
 */
export async function generateCompleteResume(options) {
  const { career, name, experience, education, companies = [], requirements = '' } = options
  const template = getTemplateForCareer(career, career)

  const prompt = `
请为以下信息生成一份完整的专业简历，要求内容真实可信、结构清晰、突出亮点：

基本信息：
- 姓名：${name}
- 目标职位：${template.name}
- 工作年限：${experience}年
- 教育背景：${education}
- 目标公司类型：${companies.join('、') || '互联网公司'}
- 特殊要求：${requirements || '无'}

请生成以下内容并以JSON格式返回：
{
  "personalInfo": {
    "name": "${name}",
    "email": "示例邮箱",
    "phone": "示例电话",
    "address": "示例地址",
    "targetPosition": "${template.name}"
  },
  "summary": "个人简介（100-150字）",
  "workExperience": [
    {
      "jobTitle": "职位名称",
      "position": "职位名称",
      "company": "公司名称",
      "location": "工作地点",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "current": false,
      "responsibilities": ["职责1", "职责2", "职责3"],
      "description": "工作描述",
      "achievements": ["成就1", "成就2"]
    }
  ],
  "education": [
    {
      "degree": "学位",
      "major": "专业",
      "school": "学校名称",
      "graduationDate": "毕业时间",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "gpa": "成绩"
    }
  ],
  "skills": [
    {
      "name": "技能名称",
      "level": "熟练",
      "category": "技能分类"
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "description": "项目描述",
      "technologies": ["技术1", "技术2"],
      "highlights": ["亮点1", "亮点2"]
    }
  ]
}

要求：
1. 内容要符合${template.name}的职业特点
2. 工作经历要体现职业发展轨迹
3. 技能要与职位匹配
4. 项目经历要突出技术能力和业务价值
5. 所有时间格式使用 YYYY-MM
6. 只返回JSON，不要其他文字

请确保返回的是有效的JSON格式。
`

  const result = await callGeminiAPI(prompt, 4096)
  const resumeData = safeJsonParse(result, null)
  if (resumeData) return validateAndEnhanceResumeData(resumeData, template, options)
  console.warn('AI返回内容不是有效JSON，使用模板生成')
  return generateResumeFromTemplate(options, template)
}

/**
 * 验证和增强简历数据
 */
function validateAndEnhanceResumeData(data, template, options = {}) {
  const enhanced = {
    personalInfo: {
      name: data.personalInfo?.name || options.name || '姓名',
      email: data.personalInfo?.email || 'example@email.com',
      phone: data.personalInfo?.phone || '138-0000-0000',
      address: data.personalInfo?.address || '北京市',
      targetPosition: data.personalInfo?.targetPosition || template.name,
      ...data.personalInfo
    },
    summary: data.summary || template.summary.replace('{experience}', options.experience || '3'),
    workExperience: Array.isArray(data.workExperience) ? data.workExperience : [],
    education: Array.isArray(data.education) ? data.education : [],
    skills: Array.isArray(data.skills) && data.skills.length
      ? data.skills
      : template.skills.map(skill => ({ name: skill, level: '熟练', category: '专业技能' })),
    projects: Array.isArray(data.projects) ? data.projects : []
  }

  enhanced.workExperience = enhanced.workExperience.map(work => ({
    ...work,
    position: work.position || work.jobTitle || '',
    jobTitle: work.jobTitle || work.position || '',
    description: work.description || work.responsibilities?.join('\n') || '',
    achievements: work.achievements || work.responsibilities || []
  }))

  return enhanced
}

/**
 * 从模板生成简历数据（备用方案）
 */
function generateResumeFromTemplate(options, template) {
  const { name, experience, education } = options

  return {
    personalInfo: {
      name,
      email: `${String(name || 'user').toLowerCase().replace(/\s+/g, '')}@email.com`,
      phone: '138-0000-0000',
      address: '北京市朝阳区',
      targetPosition: template.name
    },
    summary: template.summary.replace('{experience}', experience || '3'),
    workExperience: [
      {
        jobTitle: template.name,
        position: template.name,
        company: '科技有限公司',
        location: '北京',
        startDate: '2022-01',
        endDate: '2024-01',
        current: false,
        responsibilities: template.workTemplate.responsibilities,
        description: template.workTemplate.responsibilities.join('\n'),
        achievements: template.workTemplate.responsibilities
      }
    ],
    education: [
      {
        degree: '本科',
        major: '计算机科学与技术',
        school: education || '示例大学',
        graduationDate: '2022-06',
        startDate: '2018-09',
        endDate: '2022-06',
        gpa: '3.5'
      }
    ],
    skills: template.skills.map(skill => ({
      name: skill,
      level: '熟练',
      category: '专业技能'
    })),
    projects: [
      {
        name: '示例项目',
        description: '这是一个展示专业能力的示例项目',
        technologies: template.skills.slice(0, 3),
        highlights: ['完成核心功能交付', '提升业务处理效率']
      }
    ]
  }
}

/**
 * 检查API可用性
 * @returns {Promise<boolean>} API是否可用
 */
export async function checkAPIAvailability() {
  try {
    await AIService.chatCompletion(
      [{ role: 'user', content: '请直接回复 OK，不要解释。' }],
      null,
      null,
      { maxTokens: 128, timeoutMs: 30000 }
    )
    return true
  } catch (error) {
    console.error('API连接测试失败:', error)
    return {
      ok: false,
      message: error?.message || '未知错误'
    }
  }
}

/**
 * 智能对话式简历生成（支持流式响应内容字段）
 * @param {Object} conversationData - 对话数据
 * @param {Function} onResponseStream - 仅针对 "response" 字段文本流的回调
 * @returns {Promise<Object>} AI回复和建议的完整JSON
 */
export async function generateConversationalResponse(conversationData, onResponseStream = null) {
  const { messages, currentStep, userProfile } = conversationData

  const prompt = `
你是一位专业的简历顾问，正在通过对话帮助用户创建完美的简历。

用户档案：
${userProfile ? JSON.stringify(userProfile, null, 2) : '暂无'}

对话历史：
${messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

当前步骤：${currentStep}

请根据对话历史和用户档案，提供：
1. 针对性的问题或建议
2. 如果信息足够，生成相应的简历内容
3. 质量评估和改进建议

**非常重要：请必须返回标准的 JSON 格式！**
结构如下：
{
  "response": "AI回复内容（请尽量详细）",
  "suggestions": ["建议1", "建议2"],
  "questions": ["问题1", "问题2"],
  "resumeContent": {
    "section": "章节名称",
    "content": "根据当前对话新生成的或修改的简历JSON对象"
  },
  "qualityScore": 85,
  "improvements": ["改进建议1", "改进建议2"]
}
`

  let fullResponse = ''
  const streamCtx = { sentLen: 0 }

  const wrappedOnStream = (chunk) => {
    if (!onResponseStream) return
    fullResponse += chunk
    const responseMatch = fullResponse.match(/"response"\s*:\s*"((?:\\.|[^"\\])*)/s)
    if (responseMatch?.[1]) {
      const currentText = responseMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
      const newText = currentText.substring(streamCtx.sentLen)
      if (newText) {
        onResponseStream(newText)
        streamCtx.sentLen = currentText.length
      }
    }
  }

  const result = onResponseStream
    ? await callAIStream(prompt, wrappedOnStream, 4096)
    : await callGeminiAPI(prompt, 4096)

  const fallback = {
    response: result,
    suggestions: [],
    questions: [],
    resumeContent: null,
    qualityScore: 0,
    improvements: []
  }
  return safeJsonParse(result, fallback)
}

/**
 * 简历质量评分和分析
 * @param {Object} resumeData - 简历数据
 * @returns {Promise<Object>} 质量分析结果
 */
export async function analyzeResumeQuality(resumeData) {
  const prompt = `
请分析以下简历的质量，并提供详细的评分和改进建议：

简历数据：
${JSON.stringify(resumeData, null, 2)}

请返回JSON格式的分析结果：
{
  "overallScore": 85,
  "scores": {
    "completeness": 90,
    "relevance": 80,
    "clarity": 85,
    "impact": 75,
    "formatting": 95
  },
  "strengths": ["优势1", "优势2"],
  "weaknesses": ["不足1", "不足2"],
  "improvements": [
    {
      "section": "章节名称",
      "issue": "问题描述",
      "suggestion": "改进建议",
      "priority": "high|medium|low"
    }
  ],
  "keywords": ["关键词1", "关键词2"],
  "missingElements": ["缺失元素1", "缺失元素2"]
}
`

  const result = await callGeminiAPI(prompt, 4096)
  return safeJsonParse(result, {
    overallScore: 0,
    scores: { completeness: 0, relevance: 0, clarity: 0, impact: 0, formatting: 0 },
    strengths: [],
    weaknesses: [],
    improvements: [],
    keywords: [],
    missingElements: []
  })
}

/**
 * JD匹配度分析
 * @param {Object} params - 分析参数
 * @returns {Promise<Object>} 匹配度分析结果
 */
export async function analyzeJobMatch(params) {
  const { resumeData, jobDescription } = params

  const prompt = `
请分析简历与职位描述的匹配度：

简历数据：
${JSON.stringify(resumeData, null, 2)}

职位描述：
${jobDescription}

请返回JSON格式的匹配度分析：
{
  "matchScore": 78,
  "matchedSkills": ["技能1", "技能2"],
  "missingSkills": ["缺失技能1", "缺失技能2"],
  "recommendations": [
    {
      "type": "add_skill",
      "content": "建议添加的技能",
      "reason": "原因说明"
    }
  ],
  "keywordOptimization": [
    {
      "original": "原始表述",
      "optimized": "优化后表述",
      "reason": "优化原因"
    }
  ],
  "sectionPriority": {
    "skills": "high",
    "experience": "medium",
    "education": "low"
  }
}
`

  const result = await callGeminiAPI(prompt, 4096)
  return safeJsonParse(result, {
    matchScore: 0,
    matchedSkills: [],
    missingSkills: [],
    recommendations: [],
    keywordOptimization: [],
    sectionPriority: {}
  })
}

/**
 * 智能内容优化
 * @param {Object} params - 优化参数
 * @returns {Promise<Object>} 优化结果
 */
export async function optimizeContent(params) {
  const { content, section, context } = params

  const prompt = `
请优化以下简历内容：

章节：${section}
原始内容：${content}
上下文：${context ? JSON.stringify(context) : '无'}

请返回JSON格式的优化结果：
{
  "optimizedContent": "优化后的内容",
  "improvements": ["改进点1", "改进点2"],
  "alternatives": ["替代方案1", "替代方案2"],
  "keywords": ["关键词1", "关键词2"],
  "tone": "professional|creative|technical",
  "impactScore": 85
}
`

  const result = await callGeminiAPI(prompt, 2048)
  return safeJsonParse(result, {
    optimizedContent: content,
    improvements: [],
    alternatives: [],
    keywords: [],
    tone: 'professional',
    impactScore: 0
  })
}

/**
 * 获取支持的职业类型列表
 * @returns {Array} 职业类型列表
 */
export function getSupportedCareers() {
  return Object.keys(CAREER_TEMPLATES).map(key => ({
    id: key,
    name: CAREER_TEMPLATES[key].name,
    skills: CAREER_TEMPLATES[key].skills
  }))
}

/**
 * 导出 AI 服务对象供命名空间式调用
 */
export const aiService = {
  AIService,
  getAiSettings,
  callGeminiAPI,
  generatePersonalSummary,
  optimizeWorkExperience,
  recommendSkills,
  enhanceProjectDescription,
  generateCompleteResume,
  checkAPIAvailability,
  generateConversationalResponse,
  analyzeResumeQuality,
  analyzeJobMatch,
  optimizeContent,
  getSupportedCareers
}
