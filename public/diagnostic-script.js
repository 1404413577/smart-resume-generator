// 浏览器控制台调试脚本
// 复制以下代码到浏览器控制台并执行，用来诊断"使用默认数据"按钮

console.log('=== 简历生成器按钮诊断工具 ===\n')

// 1. 检查导航栏结构
console.log('📍 检查导航栏...')
const navPanel = document.querySelector('.navigation-panel')
if (navPanel) {
  console.log('✓ 导航栏已渲染')
  console.log(`  - 宽度: ${navPanel.offsetWidth}px`)
  console.log(`  - 高度: ${navPanel.offsetHeight}px`)
  console.log(`  - 子元素数: ${navPanel.children.length}`)
} else {
  console.error('✗ 未找到导航栏元素')
}

// 2. 检查各个区域
console.log('\n📍 检查导航栏区域...')
const aiSection = document.querySelector('.ai-section')
const moduleSection = document.querySelector('.module-section')
const actionSection = document.querySelector('.action-section')

console.log(`AI 区域: ${aiSection ? '✓ 已找到' : '✗ 未找到'}`)
console.log(`模块区域: ${moduleSection ? '✓ 已找到' : '✗ 未找到'}`)
console.log(`操作区域: ${actionSection ? '✓ 已找到' : '✗ 未找到'}`)

// 3. 检查按钮本身
console.log('\n📍 检查"使用默认数据"按钮...')
const actionButtons = document.querySelector('.action-buttons')
if (actionButtons) {
  console.log('✓ 操作按钮容器已找到')
  console.log(`  - 可见性: ${actionButtons.offsetHeight > 0 ? '✓ 可见' : '✗ 隐藏'}`)
  console.log(`  - 高度: ${actionButtons.offsetHeight}px`)
  console.log(`  - 位置: ${actionButtons.getBoundingClientRect().bottom > 0 ? '✓ 在视口内' : '✗ 在视口外'}`)
} else {
  console.error('✗ 操作按钮容器未找到')
}

const fillBtn = document.querySelector('.fill-default-btn')
if (fillBtn) {
  console.log('✓ 填充按钮已找到')
  console.log(`  - 文本: "${fillBtn.textContent.trim()}"`)
  console.log(`  - 宽度: ${fillBtn.offsetWidth}px`)
  console.log(`  - 高度: ${fillBtn.offsetHeight}px`)
  console.log(`  - 禁用: ${fillBtn.disabled ? '✗ 是' : '✓ 否'}`)
  console.log(`  - 可见: ${fillBtn.offsetHeight > 0 && fillBtn.offsetWidth > 0 ? '✓ 是' : '✗ 否'}`)
} else {
  console.error('✗ 填充按钮未找到')
}

// 4. 检查 Store
console.log('\n📍 检查 Pinia Store...')
if (window.__STORE__) {
  console.log('✓ Store 已注入到全局')
  const fillMethod = window.__STORE__.fillWithDefaultData
  console.log(`  - fillWithDefaultData 方法: ${typeof fillMethod === 'function' ? '✓ 存在' : '✗ 不存在'}`)
} else {
  console.log('ℹ Store 未在全局暴露（这是正常的，通过 Vue 使用）')
}

// 5. 检查 Pinia
console.log('\n📍 检查 Pinia...')
if (window.__PINIA__) {
  console.log('✓ Pinia 已找到')
} else {
  console.log('ℹ Pinia 未在全局暴露（可通过 DevTools 检查）')
}

// 6. 检查默认数据
console.log('\n📍 检查默认数据...')
fetch('./src/data.js')
  .then(r => r.text())
  .then(text => {
    if (text.includes('defaultResumeData')) {
      console.log('✓ 数据文件已找到')
      // 尝试获取数据大小
      const size = new Blob([text]).size
      console.log(`  - 文件大小: ${(size / 1024).toFixed(2)} KB`)
    } else {
      console.error('✗ 数据文件格式不正确')
    }
  })
  .catch(e => console.error('✗ 无法加载数据文件:', e.message))

// 7. 检查事件监听
console.log('\n📍 检查事件监听...')
if (fillBtn) {
  const clonedBtn = fillBtn.cloneNode(true)
  const hasClickListener = fillBtn.onclick !== null || fillBtn.addEventListener.toString().includes('click')
  console.log(`  - 点击事件: ${hasClickListener ? '✓ 已绑定' : '✗ 未绑定'}`)
}

// 8. 总体诊断
console.log('\n📊 诊断总结：')
const isOk = navPanel && actionButtons && fillBtn && fillBtn.offsetHeight > 0
if (isOk) {
  console.log('✓ 所有检查通过！按钮应该可见且可用。')
  console.log('\n💡 如仍看不到按钮，请尝试：')
  console.log('  1. 刷新页面 (Ctrl + F5)')
  console.log('  2. 检查浏览器缩放比例')
  console.log('  3. 确保左侧导航栏完全可见')
} else {
  console.error('✗ 诊断发现问题：')
  if (!navPanel) console.error('  - 导航栏未找到')
  if (!actionButtons) console.error('  - 按钮容器未找到')
  if (!fillBtn) console.error('  - 按钮本身未找到')
  if (fillBtn && fillBtn.offsetHeight === 0) console.error('  - 按钮可能被隐藏')
}

// 9. 手动测试
console.log('\n🧪 手动测试方法：')
console.log('尝试在控制台执行以下代码测试功能：')
console.log(`
// 这需要 Vue DevTools 或直接访问 store
// 如果已经初始化，可以尝试：
// store.fillWithDefaultData()
`)

console.log('\n=== 诊断完成 ===')
