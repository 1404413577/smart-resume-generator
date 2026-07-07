/**
 * 浏览器原生打印功能
 * 使用浏览器自带的打印对话框，可以保存为PDF或直接打印
 */

/**
 * 调用浏览器打印对话框
 * @param {string} elementId - 要打印的元素ID（可选）
 * @param {Object} options - 打印选项
 */
export async function printResume(elementId = null, options = {}) {
  const {
    title = '简历'
  } = options

  try {
    // 保存原始标题
    const originalTitle = document.title
    document.title = title

    // 直接调用浏览器打印，不修改任何样式
    // 这样可以确保打印效果与预览完全一致
    window.print()

    // 打印对话框关闭后恢复标题
    window.addEventListener('afterprint', () => {
      document.title = originalTitle
    }, { once: true })

    return true
  } catch (error) {
    console.error('打印失败:', error)
    throw error
  }
}
