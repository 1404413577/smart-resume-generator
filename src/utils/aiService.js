/**
 * AI服务模块 - 使用Gemini API生成简历内容
 */

// Gemini API配置
const GEMINI_API_KEY = 'AIzaSyAqgE78y8_m4nQ09qHaf7xFSC0T_5ppyMU'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

// 请求频率限制
let lastRequestTime = 0
const REQUEST_INTERVAL = 1000 // 1秒间隔

/**
 * 调用Gemini API生成内容
 * @param {string} prompt - 提示词
 * @returns {Promise<string>} 生成的内容
 */
async function callGeminiAPI(prompt) {
  // 频率限制检查
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL - timeSinceLastRequest))
  }
  lastRequestTime = Date.now()

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('API返回数据格式错误')
    }

    return data.candidates[0].content.parts[0].text.trim()
  } catch (error) {
    console.error('Gemini API调用失败:', error)
    throw new Error(`AI生成失败: ${error.message}`)
  }
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
- 目标职位：${targetPosition || '相关职位'}

要求：
1. 字数控制在100-150字
2. 突出专业技能和工作经验
3. 体现职业目标和发展方向
4. 语言专业、积极正面
5. 适合中国求职市场

请直接返回生成的个人简介内容，不要包含其他说明文字。
`

  return await callGeminiAPI(prompt)
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
- 职位：${workExperience.jobTitle || ''}
- 公司：${workExperience.company || ''}
- 工作时间：${workExperience.startDate || ''} - ${workExperience.endDate || '至今'}
- 地点：${workExperience.location || ''}
- 当前职责：${workExperience.responsibilities?.join('；') || ''}

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
  
  try {
    // 尝试解析JSON
    const parsed = JSON.parse(result)
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch (error) {
    console.warn('AI返回内容不是有效JSON，尝试文本解析')
  }
  
  // 如果JSON解析失败，尝试文本解析
  const lines = result.split('\n').filter(line => line.trim())
  return lines.map(line => line.replace(/^[-•\d.]\s*/, '').trim()).filter(line => line)
}

/**
 * 推荐技能特长
 * @param {string} industry - 行业领域
 * @param {string} position - 职位
 * @param {Array} currentSkills - 当前技能列表
 * @returns {Promise<Object>} 推荐的技能分类
 */
export async function recommendSkills(industry = '', position = '', currentSkills = []) {
  const currentSkillsText = currentSkills.map(skill => skill.name).join('、')
  
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
  
  try {
    const parsed = JSON.parse(result)
    return {
      technical: parsed.technical || [],
      soft: parsed.soft || [],
      language: parsed.language || []
    }
  } catch (error) {
    console.warn('技能推荐JSON解析失败:', error)
    return {
      technical: [],
      soft: [],
      language: []
    }
  }
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
  
  try {
    const parsed = JSON.parse(result)
    return {
      description: parsed.description || project.description || '',
      highlights: parsed.highlights || []
    }
  } catch (error) {
    console.warn('项目描述JSON解析失败:', error)
    return {
      description: project.description || '',
      highlights: []
    }
  }
}

/**
 * 检查API可用性
 * @returns {Promise<boolean>} API是否可用
 */
export async function checkAPIAvailability() {
  try {
    await callGeminiAPI('测试连接')
    return true
  } catch (error) {
    console.error('API不可用:', error)
    return false
  }
}
