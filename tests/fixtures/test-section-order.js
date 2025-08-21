// 章节排序功能测试脚本
// 在浏览器控制台中运行此脚本来测试章节排序功能

console.log('🧪 开始测试章节排序功能...')

// 获取Vue应用实例和store
const app = document.querySelector('#app').__vueParentComponent
const store = app.appContext.app.config.globalProperties.$pinia._s.get('resume')

if (!store) {
  console.error('❌ 无法找到resume store')
} else {
  console.log('✅ 找到resume store')
  
  // 测试1: 检查当前章节排序
  console.log('📋 当前章节排序:', store.sectionOrder)
  
  // 测试2: 检查是否有测试数据
  console.log('👤 个人信息:', store.resumeData.personalInfo.name)
  console.log('📝 个人简介:', store.resumeData.summary ? '有' : '无')
  console.log('💼 工作经历:', store.resumeData.workExperience.length + '条')
  console.log('🎓 教育背景:', store.resumeData.education.length + '条')
  console.log('⚡ 技能特长:', store.resumeData.skills.length + '项')
  console.log('🚀 项目经历:', store.resumeData.projects.length + '个')
  
  // 测试3: 检查页面设置
  console.log('📄 页面设置:', store.globalSettings.pageSettings)
  
  // 测试4: 模拟章节排序变更
  console.log('🔄 测试章节排序变更...')
  
  const originalOrder = [...store.sectionOrder]
  console.log('原始排序:', originalOrder)
  
  // 将技能特长移到第二位
  const newOrder = ['personalInfo', 'skills', 'summary', 'workExperience', 'education', 'projects']
  store.updateSectionOrder(newOrder)
  
  console.log('新的排序:', store.sectionOrder)
  
  // 等待3秒后恢复原始排序
  setTimeout(() => {
    console.log('🔄 恢复原始排序...')
    store.updateSectionOrder(originalOrder)
    console.log('恢复后排序:', store.sectionOrder)
    console.log('✅ 章节排序测试完成')
  }, 3000)
}

// 测试多页布局组件
console.log('🔍 检查多页布局组件...')
const multiPageComponents = document.querySelectorAll('.multi-page-layout')
if (multiPageComponents.length > 0) {
  console.log('✅ 找到多页布局组件:', multiPageComponents.length + '个')
} else {
  console.log('⚠️ 未找到多页布局组件，可能当前是单页模式')
}

// 检查页面容器
const pageContainers = document.querySelectorAll('.page-container')
console.log('📄 页面容器数量:', pageContainers.length)

console.log('🎯 测试说明:')
console.log('1. 打开章节排序管理界面')
console.log('2. 调整章节顺序')
console.log('3. 观察简历预览中的章节顺序是否相应变化')
console.log('4. 切换单页/多页模式测试兼容性')
