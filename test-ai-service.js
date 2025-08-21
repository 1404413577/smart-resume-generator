/**
 * 测试 AI 服务是否正常工作
 */

import { generatePersonalSummary, checkAPIAvailability } from './src/utils/ai/aiService.js'

async function testAIService() {
  console.log('🧪 开始测试 AI 服务...')
  
  try {
    // 测试 API 可用性
    console.log('📡 检查 API 可用性...')
    const isAvailable = await checkAPIAvailability()
    console.log(`API 可用性: ${isAvailable ? '✅ 可用' : '❌ 不可用'}`)
    
    if (!isAvailable) {
      console.log('❌ API 不可用，请检查 API 密钥配置')
      return
    }
    
    // 测试生成个人简介
    console.log('📝 测试生成个人简介...')
    const personalInfo = {
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '138-0000-0000',
      address: '北京市朝阳区'
    }
    
    const summary = await generatePersonalSummary(personalInfo, '前端工程师')
    console.log('✅ 个人简介生成成功:')
    console.log(summary)
    
    console.log('🎉 AI 服务测试完成！')
    
  } catch (error) {
    console.error('❌ AI 服务测试失败:', error.message)
  }
}

// 运行测试
testAIService()
