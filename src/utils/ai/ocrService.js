import { createWorker } from 'tesseract.js';
import { aiService } from './aiService';

/**
 * OCR 服务：将简历图片转换为结构化数据
 */
class OCRService {
  constructor() {
    this.worker = null;
    this.isInitializing = false;
  }

  /**
   * 初始化 Tesseract Worker
   */
  async initWorker() {
    if (this.worker) return this.worker;
    
    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise(r => setTimeout(r, 100));
      }
      return this.worker;
    }

    this.isInitializing = true;
    try {
      this.worker = await createWorker('chi_sim+eng', 1, {
        logger: m => console.log('OCR Progress:', m),
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
        langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js',
      });
      return this.worker;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * 识别图片中的文字
   * @param {string|File|Blob} image - 图片资源
   */
  async recognize(image) {
    const worker = await this.initWorker();
    const { data: { text } } = await worker.recognize(image);
    return text;
  }

  /**
   * 将识别出的自由文本转换为简历结构化数据
   * @param {string} rawText - OCR 提取的原始文本
   */
  async convertToResumeData(rawText) {
    const prompt = `
      你是一个专业的数据转换助手。请将以下从图片中通过 OCR 提取的原始文本（可能包含错别字或乱码）转换成标准的简历 JSON 格式。
      
      原始文本内容：
      """
      ${rawText}
      """

      要求：
      1. 修正 OCR 识别错误（如将 "微信号" 识别为 "徽信号" 等）。
      2. 提取以下字段：姓名, 电话, 邮箱, 意向职位, 个人简介, 工作经历(公司, 职位, 时间, 背景/成就), 扩展教育背景, 技能, 项目经验。
      3. 严格遵循以下 JSON 结构：
      {
        "personalInfo": { "name": "", "phone": "", "email": "", "targetPosition": "" },
        "summary": "",
        "workExperience": [{ "id": "uuid", "company": "", "position": "", "startDate": "", "endDate": "", "description": "", "achievements": [] }],
        "education": [{ "id": "uuid", "school": "", "degree": "", "major": "", "startDate": "", "endDate": "" }],
        "projects": [{ "id": "uuid", "name": "", "description": "", "technologies": [] }],
        "skills": [{ "id": "uuid", "name": "", "level": "熟练" }]
      }
      4. 只返回 JSON 字符串，不要包含任何 Markdown 代码块包装或其他解释。
    `;

    try {
      const response = await aiService.callGeminiAPI(prompt);
      // 去除可能存在的 markdown 标记
      const jsonStr = response.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('AI 数据转换失败:', error);
      throw new Error('无法将图片文本转换为简历数据，请手动输入。');
    }
  }

  /**
   * 销毁组件时释放资源
   */
  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export const ocrService = new OCRService();
