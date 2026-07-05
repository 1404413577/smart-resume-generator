/**
 * Optional browser-local AI service.
 *
 * WebLLM / Transformers.js are intentionally loaded lazily. The project can
 * keep building without those heavy dependencies; selecting local mode at
 * runtime will show a clear install message if they are not available.
 */

let webllm = null
let transformersPipeline = null
let transformersEnv = null

async function importOptionalDependency(packageName, installName = packageName) {
  try {
    return await import(/* @vite-ignore */ packageName)
  } catch (error) {
    throw new Error(`本地模型依赖未安装或无法加载：${installName}。请安装后再使用浏览器本地模型。`)
  }
}

async function getWebLLM() {
  if (webllm) return webllm
  webllm = await importOptionalDependency('@mlc-ai/web-llm')
  return webllm
}

async function initTransformersEnv() {
  if (transformersEnv) return transformersEnv

  const mod = await importOptionalDependency('@xenova/transformers')
  transformersEnv = mod.env
  transformersEnv.allowLocalModels = true
  transformersEnv.allowRemoteModels = true
  transformersEnv.useBrowserCache = true
  transformersEnv.localModelPath = `${import.meta.env.BASE_URL}models/`
  transformersEnv.fetch_options = { credentials: 'omit' }

  return transformersEnv
}

async function getPipeline() {
  if (transformersPipeline) return transformersPipeline

  const mod = await importOptionalDependency('@xenova/transformers')
  transformersPipeline = mod.pipeline
  await initTransformersEnv()

  return transformersPipeline
}

export async function checkWebGPUSupport() {
  if (!navigator.gpu) {
    return { supported: false, message: '当前浏览器不支持 WebGPU。' }
  }

  try {
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance'
    })

    if (!adapter) {
      return { supported: false, message: '未能找到支持 WebGPU 的显卡设备。' }
    }

    return { supported: true, message: '当前环境支持 WebGPU。' }
  } catch (err) {
    return {
      supported: false,
      message: `WebGPU 初始化失败: ${err.message}`
    }
  }
}

export class LocalAIService {
  constructor() {
    this.engine = null
    this.pipeline = null
    this.loading = false
    this.progress = 0
    this.statusText = ''
    this.currentType = null
    this.currentModelId = null
  }

  async getEngine(modelId, type = 'gpu', onProgress) {
    if (this.currentType === type && this.currentModelId === modelId) {
      if (type === 'gpu' && this.engine) return this.engine
      if (type === 'cpu' && this.pipeline) return this.pipeline
    }

    if (this.loading) {
      throw new Error('模型正在加载中，请稍候...')
    }

    this.loading = true
    this.currentType = type
    this.currentModelId = modelId
    this.progress = 0
    this.statusText = '准备加载...'

    try {
      if (type === 'gpu') {
        const support = await checkWebGPUSupport()
        if (!support.supported) {
          throw new Error(`${support.message} 请切换到 CPU/WASM 模式。`)
        }

        this.pipeline = null

        const wllm = await getWebLLM()
        this.engine = new wllm.MLCEngine()

        this.engine.setInitProgressCallback((report) => {
          this.progress = Math.round((report.progress || 0) * 100)
          this.statusText = report.text || '正在加载 GPU 模型...'
          onProgress?.({
            progress: this.progress,
            statusText: this.statusText
          })
        })

        await this.engine.reload(modelId)
        return this.engine
      }

      this.engine = null
      this.statusText = '正在初始化 CPU 文本生成管道...'

      const pipeline = await getPipeline()
      this.pipeline = await pipeline('text-generation', modelId, {
        progress_callback: (report) => {
          if (report.status === 'progress') {
            this.progress = Math.round(report.progress || 0)
            this.statusText = `正在下载权重: ${report.file || ''} (${this.progress}%)`
            onProgress?.({
              progress: this.progress,
              statusText: this.statusText
            })
          } else if (report.status === 'done') {
            this.statusText = `加载完成: ${report.file || modelId}`
          }
        }
      })

      this.statusText = 'CPU 模型加载成功'
      return this.pipeline
    } finally {
      this.loading = false
    }
  }

  async chatCompletion(modelId, type, messages, onChunk = null, onProgress = null, options = {}) {
    const instance = await this.getEngine(modelId, type, onProgress)

    if (type === 'gpu') {
      const completion = await instance.chat.completions.create({
        messages,
        stream: !!onChunk,
        ...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
        ...(options.maxTokens !== undefined ? { max_tokens: options.maxTokens } : {})
      })

      if (!onChunk) {
        return completion.choices?.[0]?.message?.content || ''
      }

      let fullText = ''
      for await (const chunk of completion) {
        const delta = chunk.choices?.[0]?.delta?.content || ''
        fullText += delta
        if (delta) onChunk(delta, fullText)
      }
      return fullText
    }

    const prompt =
      messages
        .map((message) => {
          if (message.role === 'system') return `System: ${message.content}\n`
          if (message.role === 'user') return `User: ${message.content}\n`
          return `Assistant: ${message.content}\n`
        })
        .join('') + 'Assistant: '

    const output = await instance(prompt, {
      max_new_tokens: options.maxTokens || 512,
      temperature: options.temperature || 0.7,
      do_sample: true
    })

    const fullText = String(output?.[0]?.generated_text || '').slice(prompt.length)
    if (onChunk) onChunk(fullText, fullText)
    return fullText
  }
}

export const localAiService = new LocalAIService()
